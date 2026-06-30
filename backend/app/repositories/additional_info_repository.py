import json

from sqlalchemy.orm import Session

from app.models.additional_info import AdditionalInfo
from app.schemas.additional_info import AdditionalInfoCreate


def create_additional_info(db: Session, data: AdditionalInfoCreate):
    additional_info = AdditionalInfo(
        prescription_id=data.prescription_id,
        barangay=data.barangay,
        has_philhealth=data.has_philhealth,
        is_senior_citizen=data.is_senior_citizen,
        is_pwd=data.is_pwd,
        monthly_income_range=data.monthly_income_range,
        chronic_conditions=json.dumps(data.chronic_conditions),
        other_condition=data.other_condition,
    )

    db.add(additional_info)
    db.commit()
    db.refresh(additional_info)

    return additional_info


def get_additional_info_by_prescription_id(db: Session, prescription_id: int):
    return (
        db.query(AdditionalInfo)
        .filter(AdditionalInfo.prescription_id == prescription_id)
        .first()
    )


def to_additional_info_response(additional_info: AdditionalInfo):
    conditions = []

    if additional_info.chronic_conditions:
        try:
            conditions = json.loads(additional_info.chronic_conditions)
        except json.JSONDecodeError:
            conditions = []

    return {
        "id": additional_info.id,
        "prescription_id": additional_info.prescription_id,
        "barangay": additional_info.barangay,
        "has_philhealth": additional_info.has_philhealth,
        "is_senior_citizen": additional_info.is_senior_citizen,
        "is_pwd": additional_info.is_pwd,
        "monthly_income_range": additional_info.monthly_income_range,
        "chronic_conditions": conditions,
        "other_condition": additional_info.other_condition,
    }