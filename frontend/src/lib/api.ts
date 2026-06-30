import axios from "axios";

export type PrescriptionMedicine = {
  id: number;
  medicine_name?: string | null;
  generic_name?: string | null;
  dosage?: string | null;
  form?: string | null;
  frequency?: string | null;
  duration?: string | null;
  confidence_score?: number | null;
  is_confirmed: boolean;
};

export type Prescription = {
  id: number;
  image_url?: string | null;
  ocr_raw_text?: string | null;
  patient_name?: string | null;
  patient_age?: number | null;
  patient_birth_date?: string | null;
  patient_address?: string | null;
  hospital_name?: string | null;
  doctor_name?: string | null;
  prescription_date?: string | null;
  status: string;
  medicines: PrescriptionMedicine[];
};

export type PrescriptionConfirmPayload = {
  patient_name: string;
  patient_age: number | null;
  patient_birth_date: string;
  patient_address: string;
  hospital_name: string;
  doctor_name: string;
  prescription_date: string;
  medicines: Array<{
    id: number;
    medicine_name?: string | null;
    generic_name?: string | null;
    dosage?: string | null;
    form?: string | null;
    frequency?: string | null;
    duration?: string | null;
    confidence_score?: number | null;
    is_confirmed: boolean;
  }>;
};

export type PrescriptionForm = {
  patient_name: string;
  patient_age: string;
  patient_birth_date: string;
  patient_address: string;
  hospital_name: string;
  doctor_name: string;
  prescription_date: string;
  medicines: PrescriptionMedicine[];
};

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
});

export async function scanPrescription(file: File): Promise<Prescription> {
  const formData = new FormData();
  formData.append("file", file);

  const response = await api.post<Prescription>("/prescriptions/scan", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return response.data;
}

export async function getPrescription(prescriptionId: number): Promise<Prescription> {
  const response = await api.get<Prescription>(`/prescriptions/${prescriptionId}`);
  return response.data;
}

export async function confirmPrescription(
  prescriptionId: number,
  payload: PrescriptionConfirmPayload,
): Promise<Prescription> {
  const response = await api.put<Prescription>(
    `/prescriptions/${prescriptionId}/confirm`,
    payload,
  );

  return response.data;
}