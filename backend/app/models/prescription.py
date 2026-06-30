from sqlalchemy import Boolean, Column, DateTime, Float, ForeignKey, Integer, String, Text
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

from app.core.database import Base


class Prescription(Base):
    __tablename__ = "prescriptions"

    id = Column(Integer, primary_key=True, index=True)

    image_url = Column(String, nullable=True)
    ocr_raw_text = Column(Text, nullable=True)

    patient_name = Column(String, nullable=True)
    patient_age = Column(Integer, nullable=True)
    patient_birth_date = Column(String, nullable=True)
    patient_address = Column(String, nullable=True)

    hospital_name = Column(String, nullable=True)
    doctor_name = Column(String, nullable=True)
    prescription_date = Column(String, nullable=True)

    status = Column(String, default="draft")

    created_at = Column(DateTime(timezone=True), server_default=func.now())

    medicines = relationship(
        "PrescriptionMedicine",
        back_populates="prescription",
        cascade="all, delete-orphan",
    )


class PrescriptionMedicine(Base):
    __tablename__ = "prescription_medicines"

    id = Column(Integer, primary_key=True, index=True)

    prescription_id = Column(Integer, ForeignKey("prescriptions.id"), nullable=False)

    medicine_name = Column(String, nullable=True)
    generic_name = Column(String, nullable=True)
    dosage = Column(String, nullable=True)
    form = Column(String, nullable=True)
    frequency = Column(String, nullable=True)
    duration = Column(String, nullable=True)

    confidence_score = Column(Float, nullable=True)
    is_confirmed = Column(Boolean, default=False)

    prescription = relationship(
        "Prescription",
        back_populates="medicines",
    )