from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.repositories.additional_info_repository import (
    create_additional_info,
    get_additional_info_by_prescription_id,
    to_additional_info_response,
)
from app.repositories.prescription_repository import get_prescription
from app.schemas.additional_info import AdditionalInfoCreate, AdditionalInfoResponse

router = APIRouter(prefix="/additional-infos", tags=["additional-infos"])


@router.post("", response_model=AdditionalInfoResponse)
def create_additional_info_api(
    data: AdditionalInfoCreate,
    db: Session = Depends(get_db),
):
    prescription = get_prescription(db, data.prescription_id)

    if not prescription:
        raise HTTPException(status_code=404, detail="Prescription not found")

    additional_info = create_additional_info(db, data)

    return to_additional_info_response(additional_info)


@router.get("/prescription/{prescription_id}", response_model=AdditionalInfoResponse)
def get_additional_info_api(
    prescription_id: int,
    db: Session = Depends(get_db),
):
    additional_info = get_additional_info_by_prescription_id(db, prescription_id)

    if not additional_info:
        raise HTTPException(status_code=404, detail="Additional info not found")

    return to_additional_info_response(additional_info)