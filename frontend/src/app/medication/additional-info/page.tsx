"use client";

import Link from "next/link";
import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Card,
  ChipSelect,
  FieldLabel,
  PrimaryButton,
  SectionHeader,
  StepProgress,
  TextInput,
  YesNoToggle,
  helperClass,
  inputClass,
  labelClass,
} from "@/components/medication/ui";
import {
  createAdditionalInfo,
  getApiErrorMessage,
  getPrescription,
  type Prescription,
} from "@/lib/api";

const ADDITIONAL_STEPS = [
  { label: "Upload" },
  { label: "Review" },
  { label: "Details" },
];

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
  hasPhilhealth: boolean | null;
  isSeniorCitizen: boolean | null;
  isPwd: boolean | null;
  monthlyIncomeRange: string;
  chronicConditions: string[];
  otherCondition: string;
};

const initialForm: AdditionalInfoForm = {
  barangay: "",
  hasPhilhealth: null,
  isSeniorCitizen: null,
  isPwd: null,
  monthlyIncomeRange: "",
  chronicConditions: [],
  otherCondition: "",
};

function PrescriptionSummary({ prescription }: { prescription: Prescription }) {
  return (
    <Card className="border-emerald-100 bg-emerald-50/30">
      <SectionHeader
        title="From Your Prescription"
        description="Already saved — no need to re-enter."
      />

      <dl className="space-y-3 text-sm">
        <div className="flex justify-between gap-4 border-b border-emerald-100/80 pb-3">
          <dt className="text-gray-500">Patient</dt>
          <dd className="text-right font-medium text-gray-900">
            {prescription.patient_name || "—"}
            {prescription.patient_age != null && (
              <span className="text-gray-500">
                {" "}
                · {prescription.patient_age} yrs
              </span>
            )}
          </dd>
        </div>

        {prescription.patient_address && (
          <div className="flex justify-between gap-4 border-b border-emerald-100/80 pb-3">
            <dt className="shrink-0 text-gray-500">Address</dt>
            <dd className="text-right font-medium text-gray-900">
              {prescription.patient_address}
            </dd>
          </div>
        )}

        <div className="flex justify-between gap-4 border-b border-emerald-100/80 pb-3">
          <dt className="text-gray-500">Hospital</dt>
          <dd className="text-right font-medium text-gray-900">
            {prescription.hospital_name || "—"}
          </dd>
        </div>

        <div className="flex justify-between gap-4 border-b border-emerald-100/80 pb-3">
          <dt className="text-gray-500">Prescription Date</dt>
          <dd className="text-right font-medium text-gray-900">
            {prescription.prescription_date || "—"}
          </dd>
        </div>

        <div>
          <dt className="text-gray-500">Medicines</dt>
          <dd className="mt-2 space-y-2">
            {prescription.medicines.map((medicine) => (
              <div
                key={medicine.id}
                className="rounded-xl bg-white px-3.5 py-2.5 ring-1 ring-emerald-100"
              >
                <p className="font-medium text-gray-900">
                  {medicine.medicine_name || "Unnamed medicine"}
                </p>
                <p className="mt-0.5 text-xs text-gray-500">
                  {[medicine.dosage, medicine.form, medicine.frequency]
                    .filter(Boolean)
                    .join(" · ") || "No details"}
                </p>
              </div>
            ))}
          </dd>
        </div>
      </dl>
    </Card>
  );
}

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
        console.error("getPrescription failed:", error);
        alert(getApiErrorMessage(error, "Failed to load prescription information."));
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

    if (form.hasPhilhealth === null) {
      alert("Please select your PhilHealth status.");
      return;
    }

    if (form.isSeniorCitizen === null) {
      alert("Please select your senior citizen status.");
      return;
    }

    if (form.isPwd === null) {
      alert("Please select your PWD status.");
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
      console.error("createAdditionalInfo failed:", error);
      alert(getApiErrorMessage(error, "Failed to save additional information."));
    } finally {
      setIsSaving(false);
    }
  };

  if (!prescriptionId) {
    return (
      <div className="space-y-4">
        <h1 className="text-2xl font-bold text-gray-900">
          Additional Information
        </h1>
        <Card className="border-red-100 bg-red-50">
          <p className="text-sm font-medium text-red-800">
            No prescription found
          </p>
          <p className="mt-1 text-sm text-red-700">
            Please scan and confirm your prescription first.
          </p>
          <Link
            href="/medication/prescription-intake"
            className="mt-3 inline-block text-sm font-semibold text-emerald-600"
          >
            Go to Prescription Scan →
          </Link>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-5 pb-8">
      <div>
        <Link
          href="/medication"
          className="text-sm font-medium text-emerald-600 hover:text-emerald-700"
        >
          ← Back to Medication
        </Link>
        <h1 className="mt-3 text-2xl font-bold text-gray-900">
          Additional Information
        </h1>
        <p className={`mt-2 ${helperClass}`}>
          A few more details help us find free or discounted medicine programs
          near you.
        </p>
      </div>

      <StepProgress steps={ADDITIONAL_STEPS} current={3} />

      {isLoading ? (
        <Card>
          <div className="flex items-center gap-3 py-4">
            <div className="h-5 w-5 animate-spin rounded-full border-2 border-emerald-200 border-t-emerald-600" />
            <p className="text-sm text-gray-600">Loading your prescription…</p>
          </div>
        </Card>
      ) : prescription ? (
        <PrescriptionSummary prescription={prescription} />
      ) : null}

      <Card>
        <SectionHeader
          title="Eligibility Details"
          description="Only what we need to match support programs."
        />

        <div className="space-y-6">
          <div>
            <FieldLabel htmlFor="barangay" required>
              Barangay
            </FieldLabel>
            <TextInput
              id="barangay"
              value={form.barangay}
              onChange={(v) => setForm((prev) => ({ ...prev, barangay: v }))}
              placeholder="Your barangay"
            />
          </div>

          <YesNoToggle
            label="PhilHealth Member"
            value={form.hasPhilhealth}
            onChange={(v) =>
              setForm((prev) => ({ ...prev, hasPhilhealth: v }))
            }
            required
          />

          <YesNoToggle
            label="Senior Citizen"
            value={form.isSeniorCitizen}
            onChange={(v) =>
              setForm((prev) => ({ ...prev, isSeniorCitizen: v }))
            }
            required
          />

          <YesNoToggle
            label="Person with Disability (PWD)"
            value={form.isPwd}
            onChange={(v) => setForm((prev) => ({ ...prev, isPwd: v }))}
            required
          />

          <div>
            <label htmlFor="incomeRange" className={labelClass}>
              Monthly Income Range
              <span className="ml-1 text-red-500">*</span>
            </label>
            <select
              id="incomeRange"
              value={form.monthlyIncomeRange}
              onChange={(e) =>
                setForm((prev) => ({
                  ...prev,
                  monthlyIncomeRange: e.target.value,
                }))
              }
              className={inputClass}
            >
              <option value="">Select income range</option>
              {monthlyIncomeOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>

          <ChipSelect
            label="Chronic Conditions"
            description="Select all that apply."
            options={chronicConditionOptions}
            selected={form.chronicConditions}
            onToggle={handleConditionToggle}
            required
          />

          {form.chronicConditions.includes("Other") && (
            <div>
              <FieldLabel htmlFor="otherCondition" required>
                Please specify
              </FieldLabel>
              <TextInput
                id="otherCondition"
                value={form.otherCondition}
                onChange={(v) =>
                  setForm((prev) => ({ ...prev, otherCondition: v }))
                }
                placeholder="Your condition"
              />
            </div>
          )}

          <PrimaryButton onClick={handleSubmit} disabled={isSaving}>
            {isSaving ? "Saving…" : "Save & Continue"}
          </PrimaryButton>
        </div>
      </Card>
    </div>
  );
}

export default function AdditionalInfoPage() {
  return (
    <Suspense
      fallback={
        <div className="py-6">
          <p className="text-sm text-gray-600">Loading…</p>
        </div>
      }
    >
      <AdditionalInfoContent />
    </Suspense>
  );
}
