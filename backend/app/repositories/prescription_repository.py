from sqlalchemy.orm import Session

from app.models.prescription import Prescription, PrescriptionMedicine
from app.schemas.prescription import PrescriptionCreate, PrescriptionConfirmRequest


def create_prescription(db: Session, data: PrescriptionCreate):
    prescription = Prescription(
        image_url=data.image_url,
        ocr_raw_text=data.ocr_raw_text,
        patient_name=data.patient_name,
        patient_age=data.patient_age,
        patient_birth_date=data.patient_birth_date,
        patient_address=data.patient_address,
        hospital_name=data.hospital_name,
        doctor_name=data.doctor_name,
        prescription_date=data.prescription_date,
        status=data.status,
    )

    for med in data.medicines:
        prescription.medicines.append(
            PrescriptionMedicine(
                medicine_name=med.medicine_name,
                generic_name=med.generic_name,
                dosage=med.dosage,
                form=med.form,
                frequency=med.frequency,
                duration=med.duration,
                confidence_score=med.confidence_score,
                is_confirmed=med.is_confirmed,
            )
        )

    db.add(prescription)
    db.commit()
    db.refresh(prescription)

    return prescription


def get_prescription(db: Session, prescription_id: int):
    return (
        db.query(Prescription)
        .filter(Prescription.id == prescription_id)
        .first()
    )


def confirm_prescription(
    db: Session,
    prescription_id: int,
    data: PrescriptionConfirmRequest,
):
    prescription = get_prescription(db, prescription_id)

    if not prescription:
        return None

    prescription.patient_name = data.patient_name
    prescription.patient_age = data.patient_age
    prescription.patient_birth_date = data.patient_birth_date
    prescription.patient_address = data.patient_address
    prescription.hospital_name = data.hospital_name
    prescription.doctor_name = data.doctor_name
    prescription.prescription_date = data.prescription_date
    prescription.status = "confirmed"

    for med_data in data.medicines:
        if med_data.id:
            medicine = (
                db.query(PrescriptionMedicine)
                .filter(PrescriptionMedicine.id == med_data.id)
                .first()
            )

            if medicine:
                medicine.medicine_name = med_data.medicine_name
                medicine.generic_name = med_data.generic_name
                medicine.dosage = med_data.dosage
                medicine.form = med_data.form
                medicine.frequency = med_data.frequency
                medicine.duration = med_data.duration
                medicine.confidence_score = med_data.confidence_score
                medicine.is_confirmed = med_data.is_confirmed

    db.commit()
    db.refresh(prescription)

    return prescription