"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChangeEvent, useRef, useState } from "react";
import {
  confirmPrescription,
  scanPrescription,
  type Prescription,
  type PrescriptionForm,
} from "@/lib/api";

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

function toForm(data: Prescription): PrescriptionForm {
  return {
    patient_name: data.patient_name ?? "",
    patient_age: data.patient_age != null ? String(data.patient_age) : "",
    patient_birth_date: data.patient_birth_date ?? "",
    patient_address: data.patient_address ?? "",
    hospital_name: data.hospital_name ?? "",
    doctor_name: data.doctor_name ?? "",
    prescription_date: data.prescription_date ?? "",
    medicines: data.medicines ?? [],
  };
}

function fieldClassName() {
  return "w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100";
}

function labelClassName() {
  return "mb-1.5 block text-sm font-medium text-gray-700";
}

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
  const [isScanning, setIsScanning] = useState(false);
  const [isConfirming, setIsConfirming] = useState(false);

  const hasScanResult = prescriptionId !== null;

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
  };

  const handleScanPrescription = async () => {
    if (!selectedFile) {
      alert("Please upload a prescription image first.");
      return;
    }

    try {
      setIsScanning(true);

      const data = await scanPrescription(selectedFile);

      setPrescriptionId(data.id);
      setForm(toForm(data));
      setPrescriptionStatus(data.status);
    } catch (error) {
      console.error(error);
      alert("An error occurred while scanning the prescription.");
    } finally {
      setIsScanning(false);
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
          ? { ...medicine, [field]: value, is_confirmed: false }
          : medicine,
      ),
    }));
  };

  const confirmMedicine = (medicineId: number) => {
    setForm((prev) => ({
      ...prev,
      medicines: prev.medicines.map((medicine) =>
        medicine.id === medicineId
          ? { ...medicine, is_confirmed: true }
          : medicine,
      ),
    }));
  };

  const handleConfirmPrescription = async () => {
    if (!prescriptionId) {
      alert("Please scan the prescription first.");
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
          ...medicine,
          is_confirmed: true,
        })),
      };

      await confirmPrescription(prescriptionId, payload);

      router.push(`/medication/additional-info?prescriptionId=${prescriptionId}`);
    } catch (error) {
      console.error(error);
      alert("Failed to save prescription information.");
    } finally {
      setIsConfirming(false);
    }
  };

  const confirmedCount =
    form.medicines.filter((medicine) => medicine.is_confirmed).length ?? 0;

  const isAlreadyConfirmed = prescriptionStatus === "confirmed";

  return (
    <div className="space-y-6 pb-8">
      <section>
        <Link
          href="/medication"
          className="text-sm font-medium text-emerald-600"
        >
          ← Back to Information Input
        </Link>
        <p className="mt-3 text-sm text-gray-500">Step 1</p>
        <h1 className="mt-1 text-2xl font-bold text-gray-900">
          Prescription Scan / Data Entry
        </h1>
        <p className="mt-2 text-sm leading-6 text-gray-600">
          Automatically extract patient details, prescription details, and medicine
          information from the prescription. Edit anything that needs correction.
        </p>
      </section>

      <section className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
        <h2 className="text-base font-semibold text-gray-900">Prescription Image</h2>
        <p className="mt-1 text-sm text-gray-500">
          Select a photo or scanned file.
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
          Upload Prescription Image
        </button>

        {imagePreviewUrl && (
          <div className="mt-4 overflow-hidden rounded-xl border border-gray-100 bg-gray-50">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={imagePreviewUrl}
              alt="Uploaded prescription preview"
              className="max-h-64 w-full object-contain"
            />
            {selectedFile && (
              <p className="border-t border-gray-100 px-4 py-2 text-xs text-gray-500">
                {selectedFile.name}
              </p>
            )}
          </div>
        )}

        <button
          type="button"
          onClick={handleScanPrescription}
          disabled={!selectedFile || isScanning}
          className="mt-4 flex h-12 w-full items-center justify-center rounded-xl bg-emerald-600 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:bg-gray-300"
        >
          {isScanning ? "Scanning..." : "Run OCR"}
        </button>
      </section>

      {hasScanResult && (
        <>
          <section className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between gap-3">
              <h2 className="text-base font-semibold text-gray-900">
                Patient Information
              </h2>
              {prescriptionStatus && (
                <span
                  className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                    isAlreadyConfirmed
                      ? "bg-emerald-100 text-emerald-700"
                      : "bg-gray-100 text-gray-600"
                  }`}
                >
                  {isAlreadyConfirmed ? "Saved" : "Draft"}
                </span>
              )}
            </div>
            <p className="mt-1 text-sm text-gray-500">
              Basic patient details extracted from the prescription.
            </p>

            <div className="mt-4 space-y-4">
              <div>
                <label htmlFor="patientName" className={labelClassName()}>
                  Name
                </label>
                <input
                  id="patientName"
                  type="text"
                  value={form.patient_name}
                  onChange={(e) =>
                    updateFormField("patient_name", e.target.value)
                  }
                  disabled={isAlreadyConfirmed}
                  className={fieldClassName()}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label htmlFor="patientAge" className={labelClassName()}>
                    Age
                  </label>
                  <input
                    id="patientAge"
                    type="number"
                    min={0}
                    value={form.patient_age}
                    onChange={(e) =>
                      updateFormField("patient_age", e.target.value)
                    }
                    disabled={isAlreadyConfirmed}
                    className={fieldClassName()}
                  />
                </div>

                <div>
                  <label htmlFor="patientBirthDate" className={labelClassName()}>
                    Date of Birth
                  </label>
                  <input
                    id="patientBirthDate"
                    type="date"
                    value={form.patient_birth_date}
                    onChange={(e) =>
                      updateFormField("patient_birth_date", e.target.value)
                    }
                    disabled={isAlreadyConfirmed}
                    className={fieldClassName()}
                  />
                </div>
              </div>

              <div>
                <label htmlFor="patientAddress" className={labelClassName()}>
                  Address
                </label>
                <textarea
                  id="patientAddress"
                  value={form.patient_address}
                  onChange={(e) =>
                    updateFormField("patient_address", e.target.value)
                  }
                  rows={3}
                  disabled={isAlreadyConfirmed}
                  className={`${fieldClassName()} resize-none`}
                />
              </div>
            </div>
          </section>

          <section className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
            <h2 className="text-base font-semibold text-gray-900">Prescription Details</h2>
            <p className="mt-1 text-sm text-gray-500">
              Review and edit the hospital name, doctor name, and prescription date.
            </p>

            <div className="mt-4 space-y-4">
              <div>
                <label htmlFor="hospitalName" className={labelClassName()}>
                  Hospital Name
                </label>
                <input
                  id="hospitalName"
                  type="text"
                  value={form.hospital_name}
                  onChange={(e) =>
                    updateFormField("hospital_name", e.target.value)
                  }
                  disabled={isAlreadyConfirmed}
                  className={fieldClassName()}
                />
              </div>

              <div>
                <label htmlFor="doctorName" className={labelClassName()}>
                  Doctor Name
                </label>
                <input
                  id="doctorName"
                  type="text"
                  value={form.doctor_name}
                  onChange={(e) =>
                    updateFormField("doctor_name", e.target.value)
                  }
                  disabled={isAlreadyConfirmed}
                  className={fieldClassName()}
                />
              </div>

              <div>
                <label htmlFor="prescriptionDate" className={labelClassName()}>
                  Prescription Date
                </label>
                <input
                  id="prescriptionDate"
                  type="date"
                  value={form.prescription_date}
                  onChange={(e) =>
                    updateFormField("prescription_date", e.target.value)
                  }
                  disabled={isAlreadyConfirmed}
                  className={fieldClassName()}
                />
              </div>
            </div>
          </section>

          <section className="space-y-4">
            <div className="flex items-end justify-between">
              <div>
                <h2 className="text-base font-semibold text-gray-900">
                  Medicine Information
                </h2>
                <p className="mt-1 text-sm text-gray-500">
                  Review each medicine and tap confirm when ready.
                </p>
              </div>
              <p className="text-sm text-gray-500">
                {confirmedCount}/{form.medicines.length} confirmed
              </p>
            </div>

            {form.medicines.map((medicine, index) => (
              <article
                key={medicine.id}
                className={`rounded-2xl border p-5 shadow-sm ${
                  medicine.is_confirmed
                    ? "border-emerald-200 bg-emerald-50/40"
                    : "border-gray-100 bg-white"
                }`}
              >
                <div className="mb-4 flex items-center justify-between">
                  <h3 className="text-sm font-semibold text-gray-900">
                    Medicine {index + 1}
                  </h3>
                  {medicine.is_confirmed && (
                    <span className="rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-medium text-emerald-700">
                      Confirmed
                    </span>
                  )}
                </div>

                <div className="space-y-4">
                  <div>
                    <label
                      htmlFor={`medicine-name-${medicine.id}`}
                      className={labelClassName()}
                    >
                      Medicine Name
                    </label>
                    <input
                      id={`medicine-name-${medicine.id}`}
                      type="text"
                      value={medicine.medicine_name ?? ""}
                      onChange={(e) =>
                        updateMedicine(
                          medicine.id,
                          "medicine_name",
                          e.target.value,
                        )
                      }
                      disabled={isAlreadyConfirmed}
                      className={fieldClassName()}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label
                        htmlFor={`medicine-dosage-${medicine.id}`}
                        className={labelClassName()}
                      >
                        Dosage
                      </label>
                      <input
                        id={`medicine-dosage-${medicine.id}`}
                        type="text"
                        value={medicine.dosage ?? ""}
                        onChange={(e) =>
                          updateMedicine(medicine.id, "dosage", e.target.value)
                        }
                        disabled={isAlreadyConfirmed}
                        className={fieldClassName()}
                      />
                    </div>

                    <div>
                      <label
                        htmlFor={`medicine-form-${medicine.id}`}
                        className={labelClassName()}
                      >
                        Form
                      </label>
                      <input
                        id={`medicine-form-${medicine.id}`}
                        type="text"
                        value={medicine.form ?? ""}
                        onChange={(e) =>
                          updateMedicine(medicine.id, "form", e.target.value)
                        }
                        disabled={isAlreadyConfirmed}
                        className={fieldClassName()}
                      />
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor={`medicine-frequency-${medicine.id}`}
                      className={labelClassName()}
                    >
                      Directions
                    </label>
                    <textarea
                      id={`medicine-frequency-${medicine.id}`}
                      value={medicine.frequency ?? ""}
                      onChange={(e) =>
                        updateMedicine(
                          medicine.id,
                          "frequency",
                          e.target.value,
                        )
                      }
                      rows={3}
                      disabled={isAlreadyConfirmed}
                      className={`${fieldClassName()} resize-none`}
                    />
                  </div>
                </div>

                {!isAlreadyConfirmed && (
                  <button
                    type="button"
                    onClick={() => confirmMedicine(medicine.id)}
                    disabled={
                      medicine.is_confirmed ||
                      !medicine.medicine_name?.trim() ||
                      !medicine.dosage?.trim() ||
                      !medicine.form?.trim() ||
                      !medicine.frequency?.trim()
                    }
                    className="mt-4 flex h-11 w-full items-center justify-center rounded-xl bg-emerald-600 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:bg-gray-300"
                  >
                    {medicine.is_confirmed ? "Confirmed" : "Confirm This Medicine"}
                  </button>
                )}
              </article>
            ))}
          </section>

          {!isAlreadyConfirmed && (
            <button
              type="button"
              onClick={handleConfirmPrescription}
              disabled={isConfirming || form.medicines.length === 0}
              className="flex h-14 w-full items-center justify-center rounded-2xl bg-emerald-600 text-base font-semibold text-white shadow-sm disabled:cursor-not-allowed disabled:bg-gray-300"
            >
              {isConfirming ? "Saving..." : "Confirm and Save"}
            </button>
          )}
        </>
      )}
    </div>
  );
}
