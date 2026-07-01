"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChangeEvent, useRef, useState } from "react";
import {
  AiNoticeBanner,
  Card,
  FieldLabel,
  PrimaryButton,
  ScanningLoader,
  SecondaryButton,
  SectionHeader,
  StepProgress,
  TextArea,
  TextInput,
  helperClass,
} from "@/components/medication/ui";
import {
  confirmPrescription,
  getApiErrorMessage,
  scanPrescription,
  type Prescription,
  type PrescriptionForm,
} from "@/lib/api";

const INTAKE_STEPS = [
  { label: "Upload" },
  { label: "Review" },
  { label: "Done" },
];

const emptyForm: PrescriptionForm = {
  patient_name: "",
  patient_age: "",
  patient_birth_date: "",
  patient_address: "",
  hospital_name: "",
  doctor_name: "",
  prescription_date: "",
  medicines: [],
};

function toDateInputValue(value: string | null | undefined): string {
  if (!value) return "";

  if (/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return value;
  }

  const mdy = value.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
  if (mdy) {
    const [, month, day, year] = mdy;
    return `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
  }

  return value;
}

function toForm(data: Prescription): PrescriptionForm {
  return {
    patient_name: data.patient_name ?? "",
    patient_age: data.patient_age != null ? String(data.patient_age) : "",
    patient_birth_date: toDateInputValue(data.patient_birth_date),
    patient_address: data.patient_address ?? "",
    hospital_name: data.hospital_name ?? "",
    doctor_name: data.doctor_name ?? "",
    prescription_date: toDateInputValue(data.prescription_date),
    medicines: data.medicines ?? [],
  };
}

type ViewStage = "upload" | "scanning" | "review";

export default function PrescriptionIntakePage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null);
  const [prescriptionId, setPrescriptionId] = useState<number | null>(null);
  const [form, setForm] = useState<PrescriptionForm>(emptyForm);
  const [prescriptionStatus, setPrescriptionStatus] = useState<string | null>(
    null,
  );
  const [stage, setStage] = useState<ViewStage>("upload");
  const [isConfirming, setIsConfirming] = useState(false);

  const isAlreadyConfirmed = prescriptionStatus === "confirmed";
  const currentStep = stage === "review" ? 2 : 1;

  const handleImageSelect = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (imagePreviewUrl) {
      URL.revokeObjectURL(imagePreviewUrl);
    }

    setSelectedFile(file);
    setImagePreviewUrl(URL.createObjectURL(file));
    setPrescriptionId(null);
    setForm(emptyForm);
    setPrescriptionStatus(null);
    setStage("upload");
  };

  const handleScanPrescription = async () => {
    if (!selectedFile) {
      alert("Please upload a prescription image first.");
      return;
    }

    try {
      setStage("scanning");

      const data = await scanPrescription(selectedFile);
      console.log("Prescription scan result:", data);

      setPrescriptionId(data.id);
      setForm(toForm(data));
      setPrescriptionStatus(data.status);
      setStage("review");
    } catch (error) {
      console.error("Prescription scan failed:", error);
      alert(
        getApiErrorMessage(
          error,
          "We could not read the server response. Please try again or check your connection.",
        ),
      );
      setStage("upload");
    }
  };

  const updateFormField = (
    field:
      | "patient_name"
      | "patient_age"
      | "patient_birth_date"
      | "patient_address"
      | "hospital_name"
      | "doctor_name"
      | "prescription_date",
    value: string,
  ) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const updateMedicine = (
    medicineId: number,
    field: "medicine_name" | "dosage" | "form" | "frequency",
    value: string,
  ) => {
    setForm((prev) => ({
      ...prev,
      medicines: prev.medicines.map((medicine) =>
        medicine.id === medicineId
          ? { ...medicine, [field]: value }
          : medicine,
      ),
    }));
  };

  const handleConfirmPrescription = async () => {
    if (!prescriptionId) {
      alert("Please scan the prescription first.");
      return;
    }

    if (!form.patient_name.trim()) {
      alert("Please enter the patient name.");
      return;
    }

    if (form.medicines.length === 0) {
      alert("No medicines were detected. Please check your prescription image.");
      return;
    }

    try {
      setIsConfirming(true);

      const payload = {
        patient_name: form.patient_name,
        patient_age: form.patient_age ? Number(form.patient_age) : null,
        patient_birth_date: form.patient_birth_date,
        patient_address: form.patient_address,
        hospital_name: form.hospital_name,
        doctor_name: form.doctor_name,
        prescription_date: form.prescription_date,
        medicines: form.medicines.map((medicine) => ({
          id: medicine.id,
          medicine_name: medicine.medicine_name,
          generic_name: medicine.generic_name,
          dosage: medicine.dosage,
          form: medicine.form,
          frequency: medicine.frequency,
          duration: medicine.duration,
          is_confirmed: true,
        })),
      };

      await confirmPrescription(prescriptionId, payload);

      router.push(`/medication/additional-info?prescriptionId=${prescriptionId}`);
    } catch (error) {
      console.error("confirmPrescription failed:", error);
      alert(getApiErrorMessage(error, "Failed to save prescription information."));
    } finally {
      setIsConfirming(false);
    }
  };

  const emptyFieldCount = [
    form.patient_name,
    form.patient_address,
    form.hospital_name,
    form.doctor_name,
    form.prescription_date,
    ...form.medicines.flatMap((m) => [
      m.medicine_name ?? "",
      m.dosage ?? "",
      m.form ?? "",
      m.frequency ?? "",
    ]),
  ].filter((v) => !v.trim()).length;

  return (
    <div className="space-y-5 pb-28">
      <div>
        <Link
          href="/medication"
          className="text-sm font-medium text-emerald-600 hover:text-emerald-700"
        >
          ← Back to Medication
        </Link>
        <h1 className="mt-3 text-2xl font-bold text-gray-900">
          Prescription Scan
        </h1>
        <p className={`mt-2 ${helperClass}`}>
          Upload your prescription photo. We will read it for you — then you
          review and save.
        </p>
      </div>

      <StepProgress steps={INTAKE_STEPS} current={currentStep} />

      {/* ── Upload ── */}
      <Card>
        <SectionHeader
          title="Prescription Image"
          description="Take a clear photo or upload a scanned file."
        />

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleImageSelect}
        />

        {!imagePreviewUrl ? (
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="flex min-h-[160px] w-full flex-col items-center justify-center rounded-2xl border-2 border-dashed border-emerald-200 bg-emerald-50/60 px-4 py-8 transition-colors hover:border-emerald-300 hover:bg-emerald-50"
          >
            <span className="text-4xl" aria-hidden>
              📷
            </span>
            <span className="mt-3 text-base font-semibold text-emerald-800">
              Tap to upload photo
            </span>
            <span className="mt-1 text-sm text-emerald-600">
              JPG, PNG, or HEIC
            </span>
          </button>
        ) : (
          <div className="space-y-3">
            <div className="overflow-hidden rounded-2xl border border-gray-100 bg-gray-50">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={imagePreviewUrl}
                alt="Uploaded prescription preview"
                className="max-h-56 w-full object-contain"
              />
              {selectedFile && (
                <p className="border-t border-gray-100 px-4 py-2.5 text-xs text-gray-500">
                  {selectedFile.name}
                </p>
              )}
            </div>

            {stage !== "scanning" && stage !== "review" && (
              <div className="flex gap-2">
                <SecondaryButton onClick={() => fileInputRef.current?.click()}>
                  Change Photo
                </SecondaryButton>
                <PrimaryButton
                  onClick={handleScanPrescription}
                  disabled={!selectedFile}
                >
                  Read Prescription
                </PrimaryButton>
              </div>
            )}
          </div>
        )}
      </Card>

      {/* ── Scanning ── */}
      {stage === "scanning" && (
        <Card>
          <ScanningLoader />
        </Card>
      )}

      {/* ── Review ── */}
      {stage === "review" && prescriptionId !== null && (
        <>
          <AiNoticeBanner />

          {emptyFieldCount > 0 && !isAlreadyConfirmed && (
            <div className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
              <span className="font-semibold">
                {emptyFieldCount} field{emptyFieldCount > 1 ? "s" : ""} need
                your attention
              </span>
              {" — "}
              highlighted fields could not be read clearly.
            </div>
          )}

          <Card>
            <SectionHeader
              title="Patient Information"
              description="Check name, age, and address."
              badge={
                prescriptionStatus ? (
                  <span
                    className={`shrink-0 rounded-full px-3 py-1 text-xs font-semibold ${
                      isAlreadyConfirmed
                        ? "bg-emerald-100 text-emerald-700"
                        : "bg-gray-100 text-gray-600"
                    }`}
                  >
                    {isAlreadyConfirmed ? "Saved" : "Draft"}
                  </span>
                ) : undefined
              }
            />

            <div className="space-y-4">
              <div>
                <FieldLabel htmlFor="patientName" showAutoBadge required>
                  Full Name
                </FieldLabel>
                <TextInput
                  id="patientName"
                  value={form.patient_name}
                  onChange={(v) => updateFormField("patient_name", v)}
                  disabled={isAlreadyConfirmed}
                  needsReview
                  placeholder="Patient full name"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <FieldLabel htmlFor="patientAge" showAutoBadge>
                    Age
                  </FieldLabel>
                  <TextInput
                    id="patientAge"
                    type="number"
                    min={0}
                    value={form.patient_age}
                    onChange={(v) => updateFormField("patient_age", v)}
                    disabled={isAlreadyConfirmed}
                    placeholder="Age"
                  />
                </div>
                <div>
                  <FieldLabel htmlFor="patientBirthDate" showAutoBadge>
                    Date of Birth
                  </FieldLabel>
                  <TextInput
                    id="patientBirthDate"
                    type="date"
                    value={form.patient_birth_date}
                    onChange={(v) => updateFormField("patient_birth_date", v)}
                    disabled={isAlreadyConfirmed}
                  />
                </div>
              </div>

              <div>
                <FieldLabel htmlFor="patientAddress" showAutoBadge>
                  Address
                </FieldLabel>
                <TextArea
                  id="patientAddress"
                  value={form.patient_address}
                  onChange={(v) => updateFormField("patient_address", v)}
                  disabled={isAlreadyConfirmed}
                  needsReview
                  placeholder="Home address"
                />
              </div>
            </div>
          </Card>

          <Card>
            <SectionHeader
              title="Prescription Details"
              description="Hospital, doctor, and date from your prescription."
            />

            <div className="space-y-4">
              <div>
                <FieldLabel htmlFor="hospitalName" showAutoBadge>
                  Hospital / Clinic
                </FieldLabel>
                <TextInput
                  id="hospitalName"
                  value={form.hospital_name}
                  onChange={(v) => updateFormField("hospital_name", v)}
                  disabled={isAlreadyConfirmed}
                  needsReview
                  placeholder="Hospital or clinic name"
                />
              </div>

              <div>
                <FieldLabel htmlFor="doctorName" showAutoBadge>
                  Doctor Name
                </FieldLabel>
                <TextInput
                  id="doctorName"
                  value={form.doctor_name}
                  onChange={(v) => updateFormField("doctor_name", v)}
                  disabled={isAlreadyConfirmed}
                  needsReview
                  placeholder="Prescribing doctor"
                />
              </div>

              <div>
                <FieldLabel htmlFor="prescriptionDate" showAutoBadge>
                  Prescription Date
                </FieldLabel>
                <TextInput
                  id="prescriptionDate"
                  type="date"
                  value={form.prescription_date}
                  onChange={(v) => updateFormField("prescription_date", v)}
                  disabled={isAlreadyConfirmed}
                  needsReview
                />
              </div>
            </div>
          </Card>

          <div className="space-y-3">
            <SectionHeader
              title="Medicines"
              description={`${form.medicines.length} medicine${form.medicines.length !== 1 ? "s" : ""} detected. Edit anything that looks wrong.`}
            />

            {form.medicines.length === 0 ? (
              <Card>
                <p className="text-sm text-gray-600">
                  No medicines were detected. Try uploading a clearer photo.
                </p>
              </Card>
            ) : (
              form.medicines.map((medicine, index) => {
                const lowConfidence =
                  medicine.confidence_score != null &&
                  medicine.confidence_score < 0.7;

                return (
                  <Card
                    key={medicine.id}
                    className={
                      lowConfidence
                        ? "border-amber-200 bg-amber-50/30"
                        : undefined
                    }
                  >
                    <div className="mb-4 flex items-center justify-between gap-2">
                      <h3 className="text-base font-semibold text-gray-900">
                        Medicine {index + 1}
                      </h3>
                      <div className="flex items-center gap-2">
                        {lowConfidence && (
                          <span className="rounded-full bg-amber-100 px-2.5 py-1 text-xs font-medium text-amber-800">
                            Low confidence
                          </span>
                        )}
                        <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-700 ring-1 ring-emerald-200">
                          Auto-detected
                        </span>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <FieldLabel
                          htmlFor={`medicine-name-${medicine.id}`}
                          required
                        >
                          Medicine Name
                        </FieldLabel>
                        <TextInput
                          id={`medicine-name-${medicine.id}`}
                          value={medicine.medicine_name ?? ""}
                          onChange={(v) =>
                            updateMedicine(medicine.id, "medicine_name", v)
                          }
                          disabled={isAlreadyConfirmed}
                          needsReview
                          placeholder="Brand or generic name"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <FieldLabel htmlFor={`medicine-dosage-${medicine.id}`}>
                            Dosage
                          </FieldLabel>
                          <TextInput
                            id={`medicine-dosage-${medicine.id}`}
                            value={medicine.dosage ?? ""}
                            onChange={(v) =>
                              updateMedicine(medicine.id, "dosage", v)
                            }
                            disabled={isAlreadyConfirmed}
                            needsReview
                            placeholder="e.g. 500mg"
                          />
                        </div>
                        <div>
                          <FieldLabel htmlFor={`medicine-form-${medicine.id}`}>
                            Form
                          </FieldLabel>
                          <TextInput
                            id={`medicine-form-${medicine.id}`}
                            value={medicine.form ?? ""}
                            onChange={(v) =>
                              updateMedicine(medicine.id, "form", v)
                            }
                            disabled={isAlreadyConfirmed}
                            needsReview
                            placeholder="Tablet, syrup…"
                          />
                        </div>
                      </div>

                      <div>
                        <FieldLabel
                          htmlFor={`medicine-frequency-${medicine.id}`}
                        >
                          How to Take
                        </FieldLabel>
                        <TextArea
                          id={`medicine-frequency-${medicine.id}`}
                          value={medicine.frequency ?? ""}
                          onChange={(v) =>
                            updateMedicine(medicine.id, "frequency", v)
                          }
                          disabled={isAlreadyConfirmed}
                          needsReview
                          placeholder="e.g. 1 tablet twice daily after meals"
                          rows={2}
                        />
                      </div>
                    </div>
                  </Card>
                );
              })
            )}
          </div>
        </>
      )}

      {/* ── Sticky save bar ── */}
      {stage === "review" && !isAlreadyConfirmed && (
        <div className="fixed bottom-[72px] left-1/2 z-30 w-full max-w-[430px] -translate-x-1/2 border-t border-gray-100 bg-white/95 px-5 py-4 backdrop-blur-sm">
          <PrimaryButton
            onClick={handleConfirmPrescription}
            disabled={isConfirming || form.medicines.length === 0}
          >
            {isConfirming ? "Saving…" : "Save & Continue"}
          </PrimaryButton>
          <p className="mt-2 text-center text-xs text-gray-500">
            You can edit these details again later if needed.
          </p>
        </div>
      )}
    </div>
  );
}
