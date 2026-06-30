import { mockPrescriptionOcrResult } from "./mockOcr";
import type { PrescriptionOcrResult } from "./types";

const OCR_DELAY_MS = 1200;

/**
 * Run prescription OCR.
 * Replace this function when connecting the real OCR API.
 */
export async function runPrescriptionOcr(
  _imageFile: File,
): Promise<PrescriptionOcrResult> {
  await new Promise((resolve) => setTimeout(resolve, OCR_DELAY_MS));
  return mockPrescriptionOcrResult;
}
