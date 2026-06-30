from sqlalchemy import Boolean, Column, DateTime, ForeignKey, Integer, String, Text
from sqlalchemy.sql import func

from app.core.database import Base


class AdditionalInfo(Base):
    __tablename__ = "additional_infos"

    id = Column(Integer, primary_key=True, index=True)

    prescription_id = Column(Integer, ForeignKey("prescriptions.id"), nullable=False)

    barangay = Column(String, nullable=True)

    has_philhealth = Column(Boolean, default=False)
    is_senior_citizen = Column(Boolean, default=False)
    is_pwd = Column(Boolean, default=False)

    monthly_income_range = Column(String, nullable=True)

    chronic_conditions = Column(Text, nullable=True)
    other_condition = Column(String, nullable=True)

    created_at = Column(DateTime(timezone=True), server_default=func.now())