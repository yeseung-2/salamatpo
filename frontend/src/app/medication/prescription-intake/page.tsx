"use client";

import Link from "next/link";
import { ChangeEvent, useRef, useState } from "react";
import { runPrescriptionOcr } from "@/lib/prescription/ocr";
import type {
  PrescriptionDraft,
  PrescriptionMedicineDraft,
} from "@/lib/prescription/types";

function createMedicineId() {
  return crypto.randomUUID();
}

function toDraftFromOcr(
  result: Awaited<ReturnType<typeof runPrescriptionOcr>>,
): PrescriptionDraft {
  return {
    hospitalName: result.hospitalName,
    doctorName: result.doctorName,
    prescriptionDate: result.prescriptionDate,
    medicines: result.medicines.map((medicine) => ({
      id: createMedicineId(),
      name: medicine.name,
      strength: medicine.strength,
      dosageForm: medicine.dosageForm,
      directions: medicine.directions,
      confirmed: false,
    })),
  };
}

function fieldClassName() {
  return "w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100";
}

function labelClassName() {
  return "mb-1.5 block text-sm font-medium text-gray-700";
}

export default function PrescriptionIntakePage() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null);
  const [draft, setDraft] = useState<PrescriptionDraft | null>(null);
  const [isRecognizing, setIsRecognizing] = useState(false);
  const [ocrError, setOcrError] = useState<string | null>(null);

  const handleImageSelect = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (imagePreviewUrl) {
      URL.revokeObjectURL(imagePreviewUrl);
    }

    setImageFile(file);
    setImagePreviewUrl(URL.createObjectURL(file));
    setDraft(null);
    setOcrError(null);
  };

  const handleRunOcr = async () => {
    if (!imageFile) return;

    setIsRecognizing(true);
    setOcrError(null);

    try {
      const result = await runPrescriptionOcr(imageFile);
      setDraft(toDraftFromOcr(result));
    } catch {
      setOcrError("OCR 인식에 실패했습니다. 다시 시도해 주세요.");
    } finally {
      setIsRecognizing(false);
    }
  };

  const updateDraftField = <K extends keyof Omit<PrescriptionDraft, "medicines">>(
    field: K,
    value: PrescriptionDraft[K],
  ) => {
    setDraft((prev) => (prev ? { ...prev, [field]: value } : prev));
  };

  const updateMedicine = (
    medicineId: string,
    field: keyof Omit<PrescriptionMedicineDraft, "id" | "confirmed">,
    value: string,
  ) => {
    setDraft((prev) => {
      if (!prev) return prev;

      return {
        ...prev,
        medicines: prev.medicines.map((medicine) =>
          medicine.id === medicineId
            ? { ...medicine, [field]: value, confirmed: false }
            : medicine,
        ),
      };
    });
  };

  const confirmMedicine = (medicineId: string) => {
    setDraft((prev) => {
      if (!prev) return prev;

      return {
        ...prev,
        medicines: prev.medicines.map((medicine) =>
          medicine.id === medicineId
            ? { ...medicine, confirmed: true }
            : medicine,
        ),
      };
    });
  };

  const confirmedCount = draft?.medicines.filter((m) => m.confirmed).length ?? 0;

  return (
    <div className="space-y-6 pb-8">
      <section>
        <Link
          href="/medication"
          className="text-sm font-medium text-emerald-600"
        >
          ← 복약관리로 돌아가기
        </Link>
        <p className="mt-3 text-sm text-gray-500">1단계</p>
        <h1 className="mt-1 text-2xl font-bold text-gray-900">
          처방전 인식 / 정보입력
        </h1>
        <p className="mt-2 text-sm leading-6 text-gray-600">
          처방전 이미지를 업로드한 뒤 OCR로 정보를 불러오고, 필요하면 직접
          수정하세요.
        </p>
      </section>

      <section className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
        <h2 className="text-base font-semibold text-gray-900">처방전 이미지</h2>
        <p className="mt-1 text-sm text-gray-500">
          사진 또는 스캔 파일을 선택해 주세요.
        </p>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleImageSelect}
        />

        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="mt-4 flex h-12 w-full items-center justify-center rounded-xl border border-dashed border-emerald-300 bg-emerald-50 text-sm font-semibold text-emerald-700"
        >
          처방전 이미지 업로드
        </button>

        {imagePreviewUrl && (
          <div className="mt-4 overflow-hidden rounded-xl border border-gray-100 bg-gray-50">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={imagePreviewUrl}
              alt="업로드한 처방전 미리보기"
              className="max-h-64 w-full object-contain"
            />
            {imageFile && (
              <p className="border-t border-gray-100 px-4 py-2 text-xs text-gray-500">
                {imageFile.name}
              </p>
            )}
          </div>
        )}

        <button
          type="button"
          onClick={handleRunOcr}
          disabled={!imageFile || isRecognizing}
          className="mt-4 flex h-12 w-full items-center justify-center rounded-xl bg-emerald-600 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:bg-gray-300"
        >
          {isRecognizing ? "OCR 인식 중..." : "OCR 인식하기"}
        </button>

        {ocrError && (
          <p className="mt-3 text-sm text-red-500">{ocrError}</p>
        )}
      </section>

      {draft && (
        <>
          <section className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
            <h2 className="text-base font-semibold text-gray-900">
              처방 기본 정보
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              OCR 결과가 자동으로 입력됩니다. 필요하면 수정하세요.
            </p>

            <div className="mt-4 space-y-4">
              <div>
                <label htmlFor="hospitalName" className={labelClassName()}>
                  병원명
                </label>
                <input
                  id="hospitalName"
                  type="text"
                  value={draft.hospitalName}
                  onChange={(e) =>
                    updateDraftField("hospitalName", e.target.value)
                  }
                  className={fieldClassName()}
                />
              </div>

              <div>
                <label htmlFor="doctorName" className={labelClassName()}>
                  의사명
                </label>
                <input
                  id="doctorName"
                  type="text"
                  value={draft.doctorName}
                  onChange={(e) =>
                    updateDraftField("doctorName", e.target.value)
                  }
                  className={fieldClassName()}
                />
              </div>

              <div>
                <label htmlFor="prescriptionDate" className={labelClassName()}>
                  처방일
                </label>
                <input
                  id="prescriptionDate"
                  type="date"
                  value={draft.prescriptionDate}
                  onChange={(e) =>
                    updateDraftField("prescriptionDate", e.target.value)
                  }
                  className={fieldClassName()}
                />
              </div>
            </div>
          </section>

          <section className="space-y-4">
            <div className="flex items-end justify-between">
              <div>
                <h2 className="text-base font-semibold text-gray-900">
                  약품 정보
                </h2>
                <p className="mt-1 text-sm text-gray-500">
                  약품별로 내용을 확인한 뒤 확인 버튼을 눌러 주세요.
                </p>
              </div>
              <p className="text-sm text-gray-500">
                {confirmedCount}/{draft.medicines.length} 확인
              </p>
            </div>

            {draft.medicines.map((medicine, index) => (
              <article
                key={medicine.id}
                className={`rounded-2xl border p-5 shadow-sm ${
                  medicine.confirmed
                    ? "border-emerald-200 bg-emerald-50/40"
                    : "border-gray-100 bg-white"
                }`}
              >
                <div className="mb-4 flex items-center justify-between">
                  <h3 className="text-sm font-semibold text-gray-900">
                    약품 {index + 1}
                  </h3>
                  {medicine.confirmed && (
                    <span className="rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-medium text-emerald-700">
                      확인됨
                    </span>
                  )}
                </div>

                <div className="space-y-4">
                  <div>
                    <label
                      htmlFor={`medicine-name-${medicine.id}`}
                      className={labelClassName()}
                    >
                      약품명
                    </label>
                    <input
                      id={`medicine-name-${medicine.id}`}
                      type="text"
                      value={medicine.name}
                      onChange={(e) =>
                        updateMedicine(medicine.id, "name", e.target.value)
                      }
                      className={fieldClassName()}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label
                        htmlFor={`medicine-strength-${medicine.id}`}
                        className={labelClassName()}
                      >
                        함량
                      </label>
                      <input
                        id={`medicine-strength-${medicine.id}`}
                        type="text"
                        value={medicine.strength}
                        onChange={(e) =>
                          updateMedicine(
                            medicine.id,
                            "strength",
                            e.target.value,
                          )
                        }
                        className={fieldClassName()}
                      />
                    </div>

                    <div>
                      <label
                        htmlFor={`medicine-form-${medicine.id}`}
                        className={labelClassName()}
                      >
                        제형
                      </label>
                      <input
                        id={`medicine-form-${medicine.id}`}
                        type="text"
                        value={medicine.dosageForm}
                        onChange={(e) =>
                          updateMedicine(
                            medicine.id,
                            "dosageForm",
                            e.target.value,
                          )
                        }
                        className={fieldClassName()}
                      />
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor={`medicine-directions-${medicine.id}`}
                      className={labelClassName()}
                    >
                      용법
                    </label>
                    <textarea
                      id={`medicine-directions-${medicine.id}`}
                      value={medicine.directions}
                      onChange={(e) =>
                        updateMedicine(
                          medicine.id,
                          "directions",
                          e.target.value,
                        )
                      }
                      rows={3}
                      className={`${fieldClassName()} resize-none`}
                    />
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => confirmMedicine(medicine.id)}
                  disabled={
                    medicine.confirmed ||
                    !medicine.name.trim() ||
                    !medicine.strength.trim() ||
                    !medicine.dosageForm.trim() ||
                    !medicine.directions.trim()
                  }
                  className="mt-4 flex h-11 w-full items-center justify-center rounded-xl bg-emerald-600 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:bg-gray-300"
                >
                  {medicine.confirmed ? "확인 완료" : "이 약품 확인"}
                </button>
              </article>
            ))}
          </section>
        </>
      )}
    </div>
  );
}
