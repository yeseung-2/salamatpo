import axios, { isAxiosError } from "axios";

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

export type AdditionalInfo = {
  id: number;
  prescription_id: number;
  barangay?: string | null;
  has_philhealth: boolean;
  is_senior_citizen: boolean;
  is_pwd: boolean;
  monthly_income_range?: string | null;
  chronic_conditions: string[];
  other_condition?: string | null;
};

export type AdditionalInfoCreatePayload = {
  prescription_id: number;
  barangay: string;
  has_philhealth: boolean;
  is_senior_citizen: boolean;
  is_pwd: boolean;
  monthly_income_range: string;
  chronic_conditions: string[];
  other_condition?: string | null;
};

// Use same-origin `/api/v1` in dev (proxied by Next.js) to avoid CORS and
// `localhost` pointing at the wrong device when testing on a phone/tablet.
export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL ?? "/api/v1",
  timeout: 30_000,
});

/** OCR + VLM scan can take longer than normal API calls. */
const SCAN_TIMEOUT_MS = 120_000;

export function getApiErrorMessage(error: unknown, fallback: string): string {
  if (isAxiosError(error)) {
    if (error.code === "ECONNABORTED") {
      return "The request timed out. Please try again.";
    }
    if (error.response?.data?.detail) {
      const detail = error.response.data.detail;
      return typeof detail === "string" ? detail : JSON.stringify(detail);
    }
    if (error.message === "Network Error") {
      return "Cannot reach the server. Check that the backend is running and restart the frontend dev server.";
    }
    return error.message || fallback;
  }

  if (error instanceof Error) {
    return error.message;
  }

  return fallback;
}

function assertPrescription(data: unknown): Prescription {
  const prescription = data as Prescription;

  if (!prescription || typeof prescription.id !== "number") {
    console.error("Unexpected prescription response:", data);
    throw new Error("Invalid prescription response from server.");
  }

  return prescription;
}

export async function scanPrescription(file: File): Promise<Prescription> {
  const formData = new FormData();
  formData.append("file", file);

  const response = await api.post<Prescription>("/prescriptions/scan", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
    timeout: SCAN_TIMEOUT_MS,
  });

  return assertPrescription(response.data);
}

export async function getPrescription(prescriptionId: number): Promise<Prescription> {
  const response = await api.get<Prescription>(`/prescriptions/${prescriptionId}`);
  return assertPrescription(response.data);
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

export async function createAdditionalInfo(
  payload: AdditionalInfoCreatePayload,
): Promise<AdditionalInfo> {
  const response = await api.post<AdditionalInfo>("/additional-infos", payload);
  return response.data;
}

export async function getAdditionalInfoByPrescription(
  prescriptionId: number,
): Promise<AdditionalInfo> {
  const response = await api.get<AdditionalInfo>(
    `/additional-infos/prescription/${prescriptionId}`,
  );
  return response.data;
}