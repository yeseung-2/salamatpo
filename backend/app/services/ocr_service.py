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
