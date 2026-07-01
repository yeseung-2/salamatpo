"use client";

import Link from "next/link";
import { useState } from "react";
import {
  Card,
  PrimaryButton,
  SectionHeader,
  TextInput,
  helperClass,
} from "@/components/medication/ui";

const MOCK_RESULTS = [
  {
    name: "Metformin 500mg",
    generic: "Metformin Hydrochloride",
    form: "Tablet",
    note: "Common for Type 2 Diabetes",
  },
  {
    name: "Losartan 50mg",
    generic: "Losartan Potassium",
    form: "Tablet",
    note: "Common for Hypertension",
  },
  {
    name: "Amlodipine 5mg",
    generic: "Amlodipine Besylate",
    form: "Tablet",
    note: "Common for High Blood Pressure",
  },
];

export default function MedicationSearchPage() {
  const [query, setQuery] = useState("");
  const [hasSearched, setHasSearched] = useState(false);

  const filtered = query.trim()
    ? MOCK_RESULTS.filter(
        (item) =>
          item.name.toLowerCase().includes(query.toLowerCase()) ||
          item.generic.toLowerCase().includes(query.toLowerCase()),
      )
    : [];

  const handleSearch = () => {
    setHasSearched(true);
  };

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
          Medicine Search
        </h1>
        <p className={`mt-2 ${helperClass}`}>
          Search by medicine name or ingredient. No prescription needed.
        </p>
      </div>

      <Card>
        <SectionHeader
          title="Search"
          description="Try a brand name, generic name, or dosage."
        />

        <div className="space-y-3">
          <TextInput
            value={query}
            onChange={setQuery}
            placeholder="e.g. Metformin, Losartan 50mg"
          />
          <PrimaryButton onClick={handleSearch} disabled={!query.trim()}>
            Search
          </PrimaryButton>
        </div>

        <p className="mt-3 text-xs text-gray-400">
          Demo mode — real search API coming soon.
        </p>
      </Card>

      {hasSearched && (
        <div className="space-y-3">
          <p className="text-sm font-medium text-gray-700">
            {filtered.length > 0
              ? `${filtered.length} result${filtered.length !== 1 ? "s" : ""}`
              : "No results found"}
          </p>

          {filtered.map((item) => (
            <Card key={item.name} className="hover:border-emerald-200">
              <h3 className="text-base font-semibold text-gray-900">
                {item.name}
              </h3>
              <p className="mt-0.5 text-sm text-gray-500">{item.generic}</p>
              <div className="mt-2 flex flex-wrap gap-2">
                <span className="rounded-full bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-600">
                  {item.form}
                </span>
                <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-700">
                  {item.note}
                </span>
              </div>
            </Card>
          ))}

          {filtered.length === 0 && (
            <Card>
              <p className="text-sm text-gray-600">
                Try a different spelling or a shorter keyword.
              </p>
            </Card>
          )}
        </div>
      )}
    </div>
  );
}
