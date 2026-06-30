from typing import List, Optional
from pydantic import BaseModel


class PrescriptionMedicineBase(BaseModel):
    medicine_name: Optional[str] = None
    generic_name: Optional[str] = None
    dosage: Optional[str] = None
    form: Optional[str] = None
    frequency: Optional[str] = None
    duration: Optional[str] = None
    confidence_score: Optional[float] = None
    is_confirmed: bool = False


class PrescriptionMedicineCreate(PrescriptionMedicineBase):
    pass


class PrescriptionMedicineUpdate(PrescriptionMedicineBase):
    id: Optional[int] = None


class PrescriptionMedicineResponse(PrescriptionMedicineBase):
    id: int

    class Config:
        from_attributes = True


class PrescriptionCreate(BaseModel):
    image_url: Optional[str] = None
    ocr_raw_text: Optional[str] = None

    patient_name: Optional[str] = None
    patient_age: Optional[int] = None
    patient_birth_date: Optional[str] = None
    patient_address: Optional[str] = None

    hospital_name: Optional[str] = None
    doctor_name: Optional[str] = None
    prescription_date: Optional[str] = None
    status: str = "draft"
    medicines: List[PrescriptionMedicineCreate] = []


class PrescriptionResponse(BaseModel):
    id: int
    image_url: Optional[str] = None
    ocr_raw_text: Optional[str] = None

    patient_name: Optional[str] = None
    patient_age: Optional[int] = None
    patient_birth_date: Optional[str] = None
    patient_address: Optional[str] = None

    hospital_name: Optional[str] = None
    doctor_name: Optional[str] = None
    prescription_date: Optional[str] = None
    status: str
    medicines: List[PrescriptionMedicineResponse] = []

    class Config:
        from_attributes = True


class PrescriptionConfirmRequest(BaseModel):
    patient_name: Optional[str] = None
    patient_age: Optional[int] = None
    patient_birth_date: Optional[str] = None
    patient_address: Optional[str] = None

    hospital_name: Optional[str] = None
    doctor_name: Optional[str] = None
    prescription_date: Optional[str] = None
    medicines: List[PrescriptionMedicineUpdate]
