import type { PrescriptionOcrResult } from "./types";

export const mockPrescriptionOcrResult: PrescriptionOcrResult = {
  hospitalName: "Manila General Hospital",
  doctorName: "Dr. Maria Santos",
  prescriptionDate: "2026-06-15",
  medicines: [
    {
      name: "Metformin",
      strength: "500mg",
      dosageForm: "Tablet",
      directions: "1 tablet twice daily after meals",
    },
    {
      name: "Amlodipine",
      strength: "5mg",
      dosageForm: "Tablet",
      directions: "1 tablet once daily in the morning",
    },
    {
      name: "Losartan",
      strength: "50mg",
      dosageForm: "Tablet",
      directions: "1 tablet once daily at night",
    },
  ],
};
