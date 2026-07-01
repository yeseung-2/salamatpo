"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import PageHeader from "@/components/community/PageHeader";
import type { AvailabilityStatus } from "@/lib/community/types";

const MEDICINES = ["Metformin", "Losartan", "Amlodipine", "Insulin"];
const HEALTH_CENTERS = [
  "Quezon City Health Center",
  "Manila City Hospital",
  "Pasig City Health Center",
];
const PHARMACIES = ["TGP Pharmacy", "Mercury Drug", "South Star Drug"];

const AVAILABILITY_OPTIONS: { value: AvailabilityStatus; color: string }[] = [
  { value: "Available", color: "border-primary bg-primary/5 text-primary" },
  { value: "Low Stock", color: "border-amber-400 bg-amber-50 text-amber-700" },
  { value: "Out of Stock", color: "border-red-400 bg-red-50 text-red-700" },
];

export default function ReportAvailabilityPage() {
  const router = useRouter();
  const [medicine, setMedicine] = useState("");
  const [healthCenter, setHealthCenter] = useState("");
  const [pharmacy, setPharmacy] = useState("");
  const [availability, setAvailability] = useState<AvailabilityStatus | "">("");
  const [waitingTime, setWaitingTime] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    router.push("/community");
  }

  return (
    <div>
      <PageHeader title="Report Stock" />

      <div className="mb-5 rounded-2xl bg-primary/5 p-4 ring-1 ring-primary/10">
        <p className="text-sm font-semibold text-primary">Verified Badge</p>
        <p className="mt-1 text-xs leading-relaxed text-gray-600">
          Accurate stock reports help others find free medicine faster. Verified
          reports earn contributor points.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <FormField label="Medicine">
          <select
            value={medicine}
            onChange={(e) => setMedicine(e.target.value)}
            required
            className="form-select"
          >
            <option value="">Select medicine...</option>
            {MEDICINES.map((m) => (
              <option key={m} value={m}>
                {m}
              </option>
            ))}
          </select>
        </FormField>

        <FormField label="Health Center">
          <select
            value={healthCenter}
            onChange={(e) => setHealthCenter(e.target.value)}
            required
            className="form-select"
          >
            <option value="">Select health center...</option>
            {HEALTH_CENTERS.map((hc) => (
              <option key={hc} value={hc}>
                {hc}
              </option>
            ))}
          </select>
        </FormField>

        <FormField label="Pharmacy">
          <select
            value={pharmacy}
            onChange={(e) => setPharmacy(e.target.value)}
            required
            className="form-select"
          >
            <option value="">Select pharmacy...</option>
            {PHARMACIES.map((p) => (
              <option key={p} value={p}>
                {p}
              </option>
            ))}
          </select>
        </FormField>

        <FormField label="Availability">
          <div className="grid grid-cols-1 gap-2">
            {AVAILABILITY_OPTIONS.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => setAvailability(option.value)}
                className={`rounded-xl border-2 px-4 py-3 text-left text-sm font-semibold transition ${
                  availability === option.value
                    ? option.color
                    : "border-gray-200 bg-white text-gray-600"
                }`}
              >
                {option.value}
              </button>
            ))}
          </div>
        </FormField>

        <FormField label="Waiting Time">
          <input
            type="text"
            value={waitingTime}
            onChange={(e) => setWaitingTime(e.target.value)}
            placeholder="e.g. 20 min"
            className="form-input"
          />
        </FormField>

        <FormField label="Photo Upload">
          <label className="flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-gray-200 bg-gray-50 px-4 py-8 transition hover:border-primary hover:bg-primary/5">
            <span className="text-3xl">📦</span>
            <span className="mt-2 text-sm font-medium text-gray-700">
              Upload stock photo
            </span>
            <input type="file" accept="image/*" className="hidden" />
          </label>
        </FormField>

        <button
          type="submit"
          disabled={!availability}
          className="h-14 w-full rounded-2xl bg-primary text-base font-semibold text-white shadow-sm transition hover:bg-primary-dark disabled:cursor-not-allowed disabled:opacity-50"
        >
          Submit Report
        </button>
      </form>
    </div>
  );
}

function FormField({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="mb-2 block text-sm font-semibold text-gray-900">
        {label}
      </label>
      {children}
    </div>
  );
}
