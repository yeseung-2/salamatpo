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
from app.services.ocr_service import parse_prescription_image_mock

router = APIRouter(prefix="/prescriptions", tags=["prescriptions"])


@router.post("/scan", response_model=PrescriptionResponse)
async def scan_prescription(
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
):
    ocr_result = parse_prescription_image_mock()

    prescription_data = PrescriptionCreate(
        image_url=file.filename,
        ocr_raw_text=ocr_result["ocr_raw_text"],
        patient_name=ocr_result.get("patient_name"),
        patient_age=ocr_result.get("patient_age"),
        patient_birth_date=ocr_result.get("patient_birth_date"),
        patient_address=ocr_result.get("patient_address"),
        hospital_name=ocr_result["hospital_name"],
        doctor_name=ocr_result["doctor_name"],
        prescription_date=ocr_result["prescription_date"],
        status="draft",
        medicines=ocr_result["medicines"],
    )

    return create_prescription(db, prescription_data)


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