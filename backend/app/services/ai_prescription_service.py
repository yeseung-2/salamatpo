import base64
import json
import logging
import os
import re
from pathlib import Path
from typing import Any, Dict

import requests
from dotenv import load_dotenv

BASE_DIR = Path(__file__).resolve().parents[2]
load_dotenv(BASE_DIR / ".env")

logger = logging.getLogger(__name__)

NVIDIA_API_URL = "https://integrate.api.nvidia.com/v1/chat/completions"


def image_bytes_to_data_url(image_bytes: bytes, mime_type: str = "image/jpeg") -> str:
    encoded = base64.b64encode(image_bytes).decode("utf-8")
    return f"data:{mime_type};base64,{encoded}"


def extract_json_from_model_response(text: str) -> Dict[str, Any]:
    cleaned = text.strip()

    if cleaned.startswith("```"):
        cleaned = re.sub(r"^```(?:json)?", "", cleaned).strip()
        cleaned = re.sub(r"```$", "", cleaned).strip()

    start = cleaned.find("{")
    end = cleaned.rfind("}")

    if start == -1 or end == -1:
        raise ValueError(f"No JSON object found in NVIDIA response: {text}")

    return json.loads(cleaned[start : end + 1])


def clean_frequency(value):
    if not value:
        return None

    lower = str(value).lower().strip()

    quantity_keywords = [
        "bote",
        "bot",
        "bottle",
        "bottles",
        "tabs",
        "tablets",
        "capsules",
        "#",
    ]

    if any(keyword in lower for keyword in quantity_keywords):
        return None

    if "once daily" in lower or lower == "od":
        return "Once daily"

    if "twice daily" in lower or lower == "bid":
        return "Twice daily"

    if "three times daily" in lower or lower == "tid" or lower == "td":
        return "Three times daily"

    if "four times daily" in lower or lower == "qid":
        return "Four times daily"

    return value


def clean_duration(value):
    if not value:
        return None

    lower = str(value).lower().strip()

    roman_days = {
        "vii": "7 days",
        "x": "10 days",
        "vi": "6 days",
        "v": "5 days",
        "iv": "4 days",
        "iii": "3 days",
        "ii": "2 days",
        "i": "1 day",
    }

    for roman, converted in roman_days.items():
        if roman in lower and "day" in lower:
            return converted

    match = re.search(r"(\d+)\s*days?", lower)
    if match:
        return f"{match.group(1)} days"

    return value


def infer_frequency_from_text(*values):
    joined = " ".join([str(value) for value in values if value]).lower()

    if "once daily" in joined or re.search(r"\bod\b", joined):
        return "Once daily"

    if "twice daily" in joined or re.search(r"\bbid\b", joined):
        return "Twice daily"

    if (
        "three times daily" in joined
        or re.search(r"\btid\b", joined)
        or re.search(r"\btd\b", joined)
    ):
        return "Three times daily"

    if "four times daily" in joined or re.search(r"\bqid\b", joined):
        return "Four times daily"

    return None


def normalize_prescription_data(data: Dict[str, Any], raw_text: str) -> Dict[str, Any]:
    medicines = data.get("medicines") or []
    normalized_medicines = []

    for medicine in medicines:
        raw_frequency = medicine.get("frequency")
        raw_duration = medicine.get("duration")

        frequency = clean_frequency(raw_frequency)

        if not frequency:
            frequency = infer_frequency_from_text(
                medicine.get("medicine_name"),
                raw_frequency,
                raw_duration,
            )

        duration = clean_duration(raw_duration)

        normalized_medicines.append(
            {
                "medicine_name": medicine.get("medicine_name"),
                "generic_name": medicine.get("generic_name"),
                "dosage": medicine.get("dosage"),
                "form": medicine.get("form"),
                "frequency": frequency,
                "duration": duration,
                "confidence_score": None,
                "is_confirmed": False,
            }
        )

        logger.debug(
            "Medicine normalized: raw_frequency=%r raw_duration=%r -> frequency=%r duration=%r",
            raw_frequency,
            raw_duration,
            frequency,
            duration,
        )

    patient_age = data.get("patient_age")

    if isinstance(patient_age, str):
        digits = re.findall(r"\d+", patient_age)
        patient_age = int(digits[0]) if digits else None

    return {
        "ocr_raw_text": raw_text,
        "patient_name": data.get("patient_name"),
        "patient_age": patient_age,
        "patient_birth_date": data.get("patient_birth_date"),
        "patient_address": data.get("patient_address"),
        "hospital_name": data.get("hospital_name"),
        "doctor_name": data.get("doctor_name"),
        "prescription_date": data.get("prescription_date"),
        "medicines": normalized_medicines,
    }


def structure_prescription_with_nvidia_vlm(
    image_bytes: bytes,
    raw_text: str,
    mime_type: str = "image/jpeg",
) -> Dict[str, Any]:
    api_key = os.getenv("NVIDIA_API_KEY")
    model = os.getenv(
        "NVIDIA_VLM_MODEL",
        "nvidia/llama-3.1-nemotron-nano-vl-8b-v1",
    )

    if not api_key:
        raise RuntimeError("NVIDIA_API_KEY is not set")

    logger.info(
        "Calling NVIDIA VLM: model=%s mime_type=%s raw_text_length=%d image_size_bytes=%d",
        model,
        mime_type,
        len(raw_text),
        len(image_bytes),
    )

    image_data_url = image_bytes_to_data_url(image_bytes, mime_type)

    prompt = f"""
You are a prescription information extraction assistant.

Use BOTH the prescription image and the OCR raw text to extract structured information.

OCR raw text:
\"\"\"
{raw_text}
\"\"\"

Return ONLY valid JSON.
Do not include markdown.
Do not explain anything.

Important rules:
- Extract only the fields in the JSON schema below.
- If a value is missing, unclear, or not visible, use null.
- Do NOT use labels such as "Name:", "Address:", "Age:", or "Date:" as values.
- Separate patient information from doctor information.
- If a name includes "MD", "M.D.", "Dr.", or appears near license/PTR/S2/signature, treat it as doctor_name.
- For patient_name, extract the actual patient name.
- For patient_address, extract the actual patient address, not the doctor or clinic address.
- For hospital_name, use null if there is no clear hospital/clinic name.
- Extract each medicine as a separate item.
- For medicine_name, use the actual medicine name, not instructions.
- For dosage, extract values like "500mg", "250mg/5ml", "5mg".
- For form, use values like "Tablet", "Capsule", "Syrup", "Suspension", "Injection", or null.
- Do not use quantity, bottle count, tablet count, or dispensing amount as frequency.
- Ignore dispensing quantity lines such as "# 2 bote", "# 2 bottles", "# 10 tablets", or "# 30 tabs".
- Frequency means how often the patient should take the medicine.
- Valid frequency examples: "Once daily", "Twice daily", "Three times daily", "Four times daily", "Every 8 hours", "As needed".
- Prescription abbreviations:
  - OD means Once daily.
  - BID means Twice daily.
  - TID means Three times daily.
  - TD may mean Three times daily.
  - QID means Four times daily.
- Duration means how long the patient should take the medicine.
- Convert Roman numerals in duration when clear:
  - VII days means 7 days.
  - X days means 10 days.
- For "Sig. Take 1 tablespoon TD for VII days":
  - frequency should be "Three times daily"
  - duration should be "7 days"
- Do not invent missing values.

Return this exact JSON structure:
{{
  "patient_name": null,
  "patient_age": null,
  "patient_birth_date": null,
  "patient_address": null,
  "hospital_name": null,
  "doctor_name": null,
  "prescription_date": null,
  "medicines": [
    {{
      "medicine_name": null,
      "generic_name": null,
      "dosage": null,
      "form": null,
      "frequency": null,
      "duration": null
    }}
  ]
}}
"""

    payload = {
        "model": model,
        "messages": [
            {
                "role": "user",
                "content": f'{prompt}\n\n<img src="{image_data_url}" />',
            }
        ],
        "temperature": 0,
        "max_tokens": 1500,
    }

    response = requests.post(
        NVIDIA_API_URL,
        headers={
            "Authorization": f"Bearer {api_key}",
            "Content-Type": "application/json",
        },
        json=payload,
        timeout=60,
    )

    logger.info("NVIDIA VLM API response: status_code=%d", response.status_code)

    if response.status_code != 200:
        raise RuntimeError(
            f"NVIDIA VLM API error: {response.status_code} {response.text}"
        )

    result = response.json()
    content = result["choices"][0]["message"]["content"]

    logger.info("NVIDIA VLM raw response preview: %r", content[:500])

    parsed = extract_json_from_model_response(content)
    logger.debug("NVIDIA VLM parsed JSON: %s", parsed)

    normalized = normalize_prescription_data(parsed, raw_text)
    logger.info(
        "NVIDIA VLM structured result: patient_name=%r doctor_name=%r medicine_count=%d",
        normalized.get("patient_name"),
        normalized.get("doctor_name"),
        len(normalized.get("medicines", [])),
    )

    return normalized
