"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  createAdditionalInfo,
  getPrescription,
  type Prescription,
} from "@/lib/api";

const monthlyIncomeOptions = [
  "Below ₱10,000",
  "₱10,000 - ₱19,999",
  "₱20,000 - ₱29,999",
  "₱30,000 - ₱49,999",
  "₱50,000 and above",
  "Prefer not to say",
];

const chronicConditionOptions = [
  "Diabetes",
  "Hypertension",
  "Asthma",
  "Heart Disease",
  "Chronic Kidney Disease",
  "High Cholesterol",
  "COPD",
  "Arthritis",
  "Stroke",
  "Cancer",
  "Other",
];

type AdditionalInfoForm = {
  barangay: string;
  hasPhilhealth: boolean;
  isSeniorCitizen: boolean;
  isPwd: boolean;
  monthlyIncomeRange: string;
  chronicConditions: string[];
  otherCondition: string;
};

const initialForm: AdditionalInfoForm = {
  barangay: "",
  hasPhilhealth: false,
  isSeniorCitizen: false,
  isPwd: false,
  monthlyIncomeRange: "",
  chronicConditions: [],
  otherCondition: "",
};

function AdditionalInfoContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const prescriptionId = searchParams.get("prescriptionId");

  const [prescription, setPrescription] = useState<Prescription | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [form, setForm] = useState<AdditionalInfoForm>(initialForm);

  useEffect(() => {
    if (!prescriptionId) return;

    const fetchPrescription = async () => {
      try {
        setIsLoading(true);
        const data = await getPrescription(Number(prescriptionId));
        setPrescription(data);
      } catch (error) {
        console.error(error);
        alert("Failed to load prescription information.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchPrescription();
  }, [prescriptionId]);

  const handleConditionToggle = (condition: string) => {
    setForm((prev) => {
      const alreadySelected = prev.chronicConditions.includes(condition);

      return {
        ...prev,
        chronicConditions: alreadySelected
          ? prev.chronicConditions.filter((item) => item !== condition)
          : [...prev.chronicConditions, condition],
      };
    });
  };

  const handleSubmit = async () => {
    if (!prescriptionId) {
      alert("Prescription ID is missing.");
      return;
    }

    if (!form.barangay.trim()) {
      alert("Please enter your barangay.");
      return;
    }

    if (!form.monthlyIncomeRange) {
      alert("Please select your monthly income range.");
      return;
    }

    if (form.chronicConditions.length === 0) {
      alert("Please select at least one chronic condition.");
      return;
    }

    if (
      form.chronicConditions.includes("Other") &&
      !form.otherCondition.trim()
    ) {
      alert("Please specify your other condition.");
      return;
    }

    try {
      setIsSaving(true);

      const payload = {
        prescription_id: Number(prescriptionId),
        barangay: form.barangay,
        has_philhealth: form.hasPhilhealth,
        is_senior_citizen: form.isSeniorCitizen,
        is_pwd: form.isPwd,
        monthly_income_range: form.monthlyIncomeRange,
        chronic_conditions: form.chronicConditions,
        other_condition: form.chronicConditions.includes("Other")
          ? form.otherCondition
          : null,
      };

      await createAdditionalInfo(payload);

      router.push(`/medication/result?prescriptionId=${prescriptionId}`);
    } catch (error) {
      console.error(error);
      alert("Failed to save additional information.");
    } finally {
      setIsSaving(false);
    }
  };

  if (!prescriptionId) {
    return (
      <main className="min-h-screen bg-[#F8FAF7] px-5 py-6">
        <h1 className="text-2xl font-bold text-gray-900">
          Additional Information
        </h1>
        <p className="mt-3 text-sm text-red-600">
          Prescription ID is missing. Please scan and confirm your prescription
          first.
        </p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#F8FAF7] px-5 py-6">
      <section className="mb-6">
        <p className="text-sm text-gray-500">Step 2</p>
        <h1 className="mt-1 text-2xl font-bold text-gray-900">
          Additional Information
        </h1>
        <p className="mt-2 text-sm leading-6 text-gray-600">
          Please provide a few additional details to help us match you with
          available medicine support options.
        </p>
      </section>

      {isLoading ? (
        <p className="text-sm text-gray-600">Loading prescription...</p>
      ) : prescription ? (
        <section className="mb-5 rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900">
            Auto-filled from Prescription
          </h2>

          <div className="mt-4 space-y-3 text-sm">
            <div>
              <p className="text-gray-500">Patient Name</p>
              <p className="font-medium text-gray-900">
                {prescription.patient_name || "-"}
              </p>
            </div>

            <div>
              <p className="text-gray-500">Age</p>
              <p className="font-medium text-gray-900">
                {prescription.patient_age ?? "-"}
              </p>
            </div>

            <div>
              <p className="text-gray-500">Address</p>
              <p className="font-medium text-gray-900">
                {prescription.patient_address || "-"}
              </p>
            </div>

            <div>
              <p className="text-gray-500">Prescription Date</p>
              <p className="font-medium text-gray-900">
                {prescription.prescription_date || "-"}
              </p>
            </div>

            <div>
              <p className="text-gray-500">Medicines</p>
              <div className="mt-2 space-y-2">
                {prescription.medicines.map((medicine) => (
                  <div
                    key={medicine.id}
                    className="rounded-xl bg-gray-50 px-3 py-2"
                  >
                    <p className="font-medium text-gray-900">
                      {medicine.medicine_name}
                    </p>
                    <p className="text-xs text-gray-500">
                      {medicine.dosage} · {medicine.form} · {medicine.frequency}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      ) : null}

      <section className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
        <h2 className="text-lg font-semibold text-gray-900">
          Eligibility Details
        </h2>

        <div className="mt-5 space-y-5">
          <label className="block">
            <span className="text-sm font-medium text-gray-700">Barangay</span>
            <input
              value={form.barangay}
              onChange={(event) =>
                setForm((prev) => ({
                  ...prev,
                  barangay: event.target.value,
                }))
              }
              placeholder="Enter your barangay"
              className="mt-2 w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
            />
          </label>

          <div>
            <p className="text-sm font-medium text-gray-700">PhilHealth Member</p>
            <div className="mt-2 flex gap-2">
              {[true, false].map((value) => (
                <button
                  key={String(value)}
                  type="button"
                  onClick={() =>
                    setForm((prev) => ({
                      ...prev,
                      hasPhilhealth: value,
                    }))
                  }
                  className={`rounded-full border px-4 py-2 text-sm ${
                    form.hasPhilhealth === value
                      ? "border-emerald-600 bg-emerald-600 text-white"
                      : "border-gray-200 bg-white text-gray-700"
                  }`}
                >
                  {value ? "Yes" : "No"}
                </button>
              ))}
            </div>
          </div>

          <div>
            <p className="text-sm font-medium text-gray-700">Senior Citizen</p>
            <div className="mt-2 flex gap-2">
              {[true, false].map((value) => (
                <button
                  key={String(value)}
                  type="button"
                  onClick={() =>
                    setForm((prev) => ({
                      ...prev,
                      isSeniorCitizen: value,
                    }))
                  }
                  className={`rounded-full border px-4 py-2 text-sm ${
                    form.isSeniorCitizen === value
                      ? "border-emerald-600 bg-emerald-600 text-white"
                      : "border-gray-200 bg-white text-gray-700"
                  }`}
                >
                  {value ? "Yes" : "No"}
                </button>
              ))}
            </div>
          </div>

          <div>
            <p className="text-sm font-medium text-gray-700">
              Person with Disability (PWD)
            </p>
            <div className="mt-2 flex gap-2">
              {[true, false].map((value) => (
                <button
                  key={String(value)}
                  type="button"
                  onClick={() =>
                    setForm((prev) => ({
                      ...prev,
                      isPwd: value,
                    }))
                  }
                  className={`rounded-full border px-4 py-2 text-sm ${
                    form.isPwd === value
                      ? "border-emerald-600 bg-emerald-600 text-white"
                      : "border-gray-200 bg-white text-gray-700"
                  }`}
                >
                  {value ? "Yes" : "No"}
                </button>
              ))}
            </div>
          </div>

          <label className="block">
            <span className="text-sm font-medium text-gray-700">
              Monthly Income Range
            </span>
            <select
              value={form.monthlyIncomeRange}
              onChange={(event) =>
                setForm((prev) => ({
                  ...prev,
                  monthlyIncomeRange: event.target.value,
                }))
              }
              className="mt-2 w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
            >
              <option value="">Select income range</option>
              {monthlyIncomeOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </label>

          <div>
            <p className="text-sm font-medium text-gray-700">
              Chronic Conditions
            </p>
            <p className="mt-1 text-xs text-gray-500">Select all that apply.</p>

            <div className="mt-3 flex flex-wrap gap-2">
              {chronicConditionOptions.map((condition) => {
                const selected = form.chronicConditions.includes(condition);

                return (
                  <button
                    key={condition}
                    type="button"
                    onClick={() => handleConditionToggle(condition)}
                    className={`rounded-full border px-4 py-2 text-sm ${
                      selected
                        ? "border-emerald-600 bg-emerald-600 text-white"
                        : "border-gray-200 bg-white text-gray-700"
                    }`}
                  >
                    {condition}
                  </button>
                );
              })}
            </div>
          </div>

          {form.chronicConditions.includes("Other") && (
            <label className="block">
              <span className="text-sm font-medium text-gray-700">
                Please specify your condition
              </span>
              <input
                value={form.otherCondition}
                onChange={(event) =>
                  setForm((prev) => ({
                    ...prev,
                    otherCondition: event.target.value,
                  }))
                }
                placeholder="Enter condition"
                className="mt-2 w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
              />
            </label>
          )}

          <button
            type="button"
            onClick={handleSubmit}
            disabled={isSaving}
            className="w-full rounded-xl bg-emerald-600 px-4 py-3 text-sm font-semibold text-white disabled:opacity-50"
          >
            {isSaving ? "Saving..." : "Save and Continue"}
          </button>
        </div>
      </section>
    </main>
  );
}

export default function AdditionalInfoPage() {
  return (
    <Suspense
      fallback={
        <main className="min-h-screen bg-[#F8FAF7] px-5 py-6">
          <p className="text-sm text-gray-600">Loading...</p>
        </main>
      }
    >
      <AdditionalInfoContent />
    </Suspense>
  );
}
