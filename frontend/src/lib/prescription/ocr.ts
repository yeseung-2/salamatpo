import { mockPrescriptionOcrResult } from "./mockOcr";
import type { PrescriptionOcrResult } from "./types";

const OCR_DELAY_MS = 1200;

/**
 * 처방전 OCR 실행.
 * 실제 OCR API 연동 시 이 함수 내부만 교체하면 됩니다.
 */
export async function runPrescriptionOcr(
  _imageFile: File,
): Promise<PrescriptionOcrResult> {
  await new Promise((resolve) => setTimeout(resolve, OCR_DELAY_MS));
  return mockPrescriptionOcrResult;
}
