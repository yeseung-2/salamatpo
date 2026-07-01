import logging

from fastapi import APIRouter, Depends, File, HTTPException, UploadFile
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.repositories.prescription_repository import (
    confirm_prescription,
    create_prescription,
    get_prescription,
)
from app.schemas.prescription import (
    PrescriptionConfirmRequest,
    PrescriptionCreate,
    PrescriptionResponse,
)
from app.services.ai_prescription_service import structure_prescription_with_nvidia_vlm
from app.services.ocr_service import (
    extract_text_with_google_vision,
    parse_prescription_text,
)

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/prescriptions", tags=["prescriptions"])


@router.post("/scan", response_model=PrescriptionResponse)
async def scan_prescription(
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
):
    image_bytes = await file.read()
    mime_type = file.content_type or "image/jpeg"

    logger.info(
        "Starting prescription scan: filename=%s mime_type=%s size_bytes=%d",
        file.filename,
        mime_type,
        len(image_bytes),
    )

    try:
        raw_text = extract_text_with_google_vision(image_bytes)
        logger.info(
            "Google Vision OCR complete: raw_text_length=%d preview=%r",
            len(raw_text),
            raw_text[:300],
        )

        extraction_source = "nvidia_vlm"

        try:
            ocr_result = structure_prescription_with_nvidia_vlm(
                image_bytes=image_bytes,
                raw_text=raw_text,
                mime_type=mime_type,
            )
        except Exception as ai_error:
            extraction_source = "rule_parser_fallback"
            logger.warning(
                "NVIDIA VLM failed, falling back to rule parser: %s",
                ai_error,
                exc_info=True,
            )
            ocr_result = parse_prescription_text(raw_text)

        logger.info(
            "Prescription extraction complete: source=%s patient_name=%r doctor_name=%r medicine_count=%d",
            extraction_source,
            ocr_result.get("patient_name"),
            ocr_result.get("doctor_name"),
            len(ocr_result.get("medicines", [])),
        )
        logger.debug("Extracted prescription data: %s", ocr_result)

    except Exception as error:
        logger.exception("Prescription extraction failed")
        raise HTTPException(
            status_code=500,
            detail=f"Prescription extraction failed: {str(error)}",
        )

    prescription_data = PrescriptionCreate(
        image_url=file.filename,
        ocr_raw_text=ocr_result.get("ocr_raw_text"),
        patient_name=ocr_result.get("patient_name"),
        patient_age=ocr_result.get("patient_age"),
        patient_birth_date=ocr_result.get("patient_birth_date"),
        patient_address=ocr_result.get("patient_address"),
        hospital_name=ocr_result.get("hospital_name"),
        doctor_name=ocr_result.get("doctor_name"),
        prescription_date=ocr_result.get("prescription_date"),
        status="draft",
        medicines=ocr_result.get("medicines", []),
    )

    saved = create_prescription(db, prescription_data)
    logger.info("Prescription draft saved: id=%d status=%s", saved.id, saved.status)

    return saved


@router.get("/{prescription_id}", response_model=PrescriptionResponse)
def read_prescription(
    prescription_id: int,
    db: Session = Depends(get_db),
):
    prescription = get_prescription(db, prescription_id)

    if not prescription:
        raise HTTPException(status_code=404, detail="Prescription not found")

    return prescription


@router.put("/{prescription_id}/confirm", response_model=PrescriptionResponse)
def confirm_prescription_api(
    prescription_id: int,
    data: PrescriptionConfirmRequest,
    db: Session = Depends(get_db),
):
    prescription = confirm_prescription(db, prescription_id, data)

    if not prescription:
        raise HTTPException(status_code=404, detail="Prescription not found")

    return prescription
