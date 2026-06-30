from typing import List, Optional

from pydantic import BaseModel


class AdditionalInfoCreate(BaseModel):
    prescription_id: int

    barangay: Optional[str] = None

    has_philhealth: bool = False
    is_senior_citizen: bool = False
    is_pwd: bool = False

    monthly_income_range: Optional[str] = None

    chronic_conditions: List[str] = []
    other_condition: Optional[str] = None


class AdditionalInfoResponse(BaseModel):
    id: int
    prescription_id: int

    barangay: Optional[str] = None

    has_philhealth: bool
    is_senior_citizen: bool
    is_pwd: bool

    monthly_income_range: Optional[str] = None

    chronic_conditions: List[str] = []
    other_condition: Optional[str] = None

    class Config:
        from_attributes = True