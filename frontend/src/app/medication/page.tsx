"use client";

import { useRouter } from "next/navigation";
import { HubCard, helperClass } from "@/components/medication/ui";

export default function MedicationHubPage() {
  const router = useRouter();

  return (
    <div className="space-y-6">
      <section>
        <p className="text-sm font-semibold uppercase tracking-wide text-emerald-600">
          Medication
        </p>
        <h1 className="mt-1 text-2xl font-bold text-gray-900">
          How can we help?
        </h1>
        <p className={`mt-2 ${helperClass}`}>
          Scan your prescription to find medicine savings, or search for a
          specific drug.
        </p>
      </section>

      <section className="space-y-3" aria-label="Medication features">
        <HubCard
          step="Step 1"
          icon="📋"
          title="Scan Prescription"
          description="Upload a photo. We read patient details and medicines for you — then you review and confirm."
          onClick={() => router.push("/medication/prescription-intake")}
          accent="emerald"
        />

        <HubCard
          step="Step 2"
          icon="✅"
          title="Additional Information"
          description="Add PhilHealth status, income, and health details to match you with support programs."
          onClick={() => router.push("/medication/additional-info")}
          accent="emerald"
        />

        <HubCard
          icon="🔍"
          title="Medicine Search"
          description="Look up a medicine by name, ingredient, or dosage. Works on its own — no prescription needed."
          onClick={() => router.push("/medication/search")}
          accent="blue"
        />
      </section>

      <div className="rounded-2xl border border-emerald-100 bg-emerald-50/60 px-4 py-3.5">
        <p className="text-sm font-medium text-emerald-900">New here?</p>
        <p className="mt-0.5 text-sm leading-relaxed text-emerald-800">
          Start with <strong>Scan Prescription</strong>, then complete{" "}
          <strong>Additional Information</strong> to see your savings options.
        </p>
      </div>
    </div>
  );
}
