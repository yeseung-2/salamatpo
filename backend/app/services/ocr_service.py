import base64
import logging
import os
import re
from pathlib import Path
from typing import Dict, List

import requests
from dotenv import load_dotenv

BASE_DIR = Path(__file__).resolve().parents[2]
load_dotenv(BASE_DIR / ".env")

logger = logging.getLogger(__name__)


def extract_text_with_google_vision(image_bytes: bytes) -> str:
    api_key = os.getenv("GOOGLE_VISION_API_KEY")

    if not api_key:
        raise RuntimeError("GOOGLE_VISION_API_KEY is not set")

    logger.info("Calling Google Vision API: image_size_bytes=%d", len(image_bytes))

    encoded_image = base64.b64encode(image_bytes).decode("utf-8")

    url = f"https://vision.googleapis.com/v1/images:annotate?key={api_key}"

    payload = {
        "requests": [
            {
                "image": {
                    "content": encoded_image,
                },
                "features": [
                    {
                        "type": "DOCUMENT_TEXT_DETECTION",
                    }
                ],
            }
        ]
    }

    response = requests.post(url, json=payload, timeout=30)

    logger.info("Google Vision API response: status_code=%d", response.status_code)

    if response.status_code != 200:
        raise RuntimeError(
            f"Google Vision API error: {response.status_code} {response.text}"
        )

    result = response.json()
    responses = result.get("responses", [])

    if not responses:
        return ""

    first_response = responses[0]

    if "error" in first_response:
        raise RuntimeError(f"Google Vision OCR error: {first_response['error']}")

    full_text = first_response.get("fullTextAnnotation", {}).get("text")

    if full_text:
        logger.info("Google Vision returned fullTextAnnotation: length=%d", len(full_text))
        return full_text

    text_annotations = first_response.get("textAnnotations", [])

    if text_annotations:
        description = text_annotations[0].get("description", "")
        logger.info(
            "Google Vision returned textAnnotations: length=%d",
            len(description),
        )
        return description

    logger.warning("Google Vision returned no text")
    return ""


def parse_prescription_text(raw_text: str) -> Dict:
    lines = [line.strip() for line in raw_text.splitlines() if line.strip()]
    joined_text = "\n".join(lines)

    patient_name = None
    patient_age = None
    patient_birth_date = None
    patient_address = None
    hospital_name = None
    doctor_name = None
    prescription_date = None
    medicines: List[Dict] = []

    for line in lines:
        lower = line.lower()

        if not hospital_name and (
            "hospital" in lower or "clinic" in lower or "medical center" in lower
        ):
            hospital_name = line

        if not doctor_name and (
            "dr." in lower or "doctor" in lower or "physician" in lower
        ):
            doctor_name = line

        if not patient_name and ("patient" in lower or "name" in lower):
            patient_name = line

        if not patient_address and (
            "address" in lower or "barangay" in lower or "brgy" in lower
        ):
            patient_address = line

    date_match = re.search(
        r"(\d{1,2}[/-]\d{1,2}[/-]\d{2,4}|\d{4}[/-]\d{1,2}[/-]\d{1,2})",
        joined_text,
    )
    if date_match:
        prescription_date = date_match.group(1)

    age_match = re.search(r"\bAge[:\s]*([0-9]{1,3})\b", joined_text, re.IGNORECASE)
    if age_match:
        patient_age = int(age_match.group(1))

    medicine_keywords = [
        "tablet",
        "tab",
        "capsule",
        "cap",
        "syrup",
        "mg",
        "mcg",
        "ml",
        "once",
        "twice",
        "daily",
        "bid",
        "tid",
        "qid",
        "od",
    ]

    for line in lines:
        lower = line.lower()

        if any(keyword in lower for keyword in medicine_keywords):
            medicines.append(
                {
                    "medicine_name": line,
                    "generic_name": None,
                    "dosage": extract_dosage(line),
                    "form": extract_form(line),
                    "frequency": extract_frequency(line),
                    "duration": None,
                    "confidence_score": None,
                    "is_confirmed": False,
                }
            )

    parsed = {
        "ocr_raw_text": raw_text,
        "patient_name": patient_name,
        "patient_age": patient_age,
        "patient_birth_date": patient_birth_date,
        "patient_address": patient_address,
        "hospital_name": hospital_name,
        "doctor_name": doctor_name,
        "prescription_date": prescription_date,
        "medicines": medicines,
    }

    logger.info(
        "Rule parser complete: patient_name=%r doctor_name=%r medicine_count=%d",
        patient_name,
        doctor_name,
        len(medicines),
    )

    return parsed


def extract_dosage(text: str):
    match = re.search(r"\b\d+(\.\d+)?\s?(mg|mcg|g|ml|mL|IU)\b", text, re.IGNORECASE)
    return match.group(0) if match else None


def extract_form(text: str):
    lower = text.lower()

    if "tablet" in lower or "tab" in lower:
        return "Tablet"
    if "capsule" in lower or "cap" in lower:
        return "Capsule"
    if "syrup" in lower:
        return "Syrup"

    return None


def extract_frequency(text: str):
    lower = text.lower()

    patterns = [
        "once daily",
        "twice daily",
        "three times daily",
        "bid",
        "tid",
        "qid",
        "od",
        "daily",
    ]

    for pattern in patterns:
        if pattern in lower:
            return pattern

    return None


def parse_prescription_image(image_bytes: bytes):
    raw_text = extract_text_with_google_vision(image_bytes)
    return parse_prescription_text(raw_text)


def parse_prescription_image_mock():
    return {
        "ocr_raw_text": "Mock OCR result text",
        "patient_name": "Juan Dela Cruz",
        "patient_age": 62,
        "patient_birth_date": "1964-03-12",
        "patient_address": "Commonwealth, Quezon City, Metro Manila",
        "hospital_name": "Quezon City General Hospital",
        "doctor_name": "Dr. Santos",
        "prescription_date": "2026-07-01",
        "medicines": [
            {
                "medicine_name": "Metformin",
                "generic_name": "Metformin",
                "dosage": "500mg",
                "form": "Tablet",
                "frequency": "Twice daily",
                "duration": "30 days",
                "confidence_score": 0.87,
                "is_confirmed": False,
            },
            {
                "medicine_name": "Amlodipine",
                "generic_name": "Amlodipine",
                "dosage": "5mg",
                "form": "Tablet",
                "frequency": "Once daily",
                "duration": "30 days",
                "confidence_score": 0.82,
                "is_confirmed": False,
            },
        ],
    }
