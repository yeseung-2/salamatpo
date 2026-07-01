"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import PageHeader from "@/components/community/PageHeader";

const MEDICINES = ["Metformin", "Losartan", "Amlodipine", "Insulin", "Salbutamol"];
const PROGRAMS = ["GAMOT", "Malasakit", "GL", "PhilHealth"];
const LOCATIONS = ["Hospital", "Health Center", "Pharmacy"];
const DOCUMENTS = [
  "PhilHealth ID",
  "Prescription",
  "Senior Card",
  "PWD Card",
  "Barangay Certificate",
];

export default function WritePostPage() {
  const router = useRouter();
  const [medicine, setMedicine] = useState("");
  const [program, setProgram] = useState("");
  const [location, setLocation] = useState("");
  const [content, setContent] = useState("");
  const [waitingTime, setWaitingTime] = useState("");
  const [totalCost, setTotalCost] = useState("");
  const [selectedDocs, setSelectedDocs] = useState<string[]>([]);

  function toggleDocument(doc: string) {
    setSelectedDocs((prev) =>
      prev.includes(doc) ? prev.filter((d) => d !== doc) : [...prev, doc],
    );
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    router.push("/community");
  }

  return (
    <div>
      <PageHeader title="Share Experience" />

      <form onSubmit={handleSubmit} className="space-y-5">
        <FormField label="Select Medicine">
          <select
            value={medicine}
            onChange={(e) => setMedicine(e.target.value)}
            required
            className="form-select"
          >
            <option value="">Choose medicine...</option>
            {MEDICINES.map((m) => (
              <option key={m} value={m}>
                {m}
              </option>
            ))}
          </select>
        </FormField>

        <FormField label="Select Government Support">
          <select
            value={program}
            onChange={(e) => setProgram(e.target.value)}
            required
            className="form-select"
          >
            <option value="">Choose program...</option>
            {PROGRAMS.map((p) => (
              <option key={p} value={p}>
                {p}
              </option>
            ))}
          </select>
        </FormField>

        <FormField label="Location Type">
          <select
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            required
            className="form-select"
          >
            <option value="">Choose location...</option>
            {LOCATIONS.map((l) => (
              <option key={l} value={l}>
                {l}
              </option>
            ))}
          </select>
        </FormField>

        <FormField label="Your Experience">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Share your experience..."
            required
            rows={5}
            className="form-textarea"
          />
        </FormField>

        <FormField label="Upload Photo">
          <label className="flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-gray-200 bg-gray-50 px-4 py-8 transition hover:border-primary hover:bg-primary/5">
            <span className="text-3xl">📷</span>
            <span className="mt-2 text-sm font-medium text-gray-700">
              Tap to upload photo
            </span>
            <span className="mt-1 text-xs text-gray-500">Optional</span>
            <input type="file" accept="image/*" className="hidden" />
          </label>
        </FormField>

        <div className="grid grid-cols-2 gap-3">
          <FormField label="Waiting Time">
            <input
              type="text"
              value={waitingTime}
              onChange={(e) => setWaitingTime(e.target.value)}
              placeholder="e.g. 30 min"
              required
              className="form-input"
            />
          </FormField>
          <FormField label="Total Cost">
            <input
              type="text"
              value={totalCost}
              onChange={(e) => setTotalCost(e.target.value)}
              placeholder="e.g. ₱0"
              required
              className="form-input"
            />
          </FormField>
        </div>

        <FormField label="Documents Used">
          <div className="space-y-2">
            {DOCUMENTS.map((doc) => (
              <label
                key={doc}
                className="flex cursor-pointer items-center gap-3 rounded-xl bg-gray-50 px-4 py-3 ring-1 ring-gray-100"
              >
                <input
                  type="checkbox"
                  checked={selectedDocs.includes(doc)}
                  onChange={() => toggleDocument(doc)}
                  className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                />
                <span className="text-sm text-gray-700">{doc}</span>
              </label>
            ))}
          </div>
        </FormField>

        <button
          type="submit"
          className="h-14 w-full rounded-2xl bg-primary text-base font-semibold text-white shadow-sm transition hover:bg-primary-dark active:scale-[0.99]"
        >
          Share Experience
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
