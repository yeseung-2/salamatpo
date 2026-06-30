"use client";

import { useRouter } from "next/navigation";

export default function InfoInputPage() {
  const router = useRouter();

  return (
    <main className="min-h-screen bg-[#F8FAF7] px-5 py-6">
      <section className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Information Input</h1>
        <p className="mt-2 text-sm leading-6 text-gray-600">
          Extract patient, prescription, and medicine details from prescriptions,
          then enter any additional information needed for benefit matching.
        </p>
      </section>

      <section className="space-y-4">
        <button
          onClick={() => router.push("/medication/prescription-intake")}
          className="w-full rounded-2xl bg-white p-5 text-left shadow-sm border border-gray-100"
        >
          <h2 className="text-lg font-semibold text-gray-900">
            Prescription Scan / Data Entry
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Capture or manually enter patient details, hospital name, doctor name,
            prescription date, and medicine information.
          </p>
        </button>

        <button
          onClick={() => router.push("/medication/additional-info")}
          className="w-full rounded-2xl bg-white p-5 text-left shadow-sm border border-gray-100"
        >
          <h2 className="text-lg font-semibold text-gray-900">
            Additional Information
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Auto-fill name, age, and address from the prescription, then add
            missing details such as PhilHealth, eligibility, and income level.
          </p>
        </button>

        <button
          onClick={() => router.push("/medication/search")}
          className="w-full rounded-2xl bg-white p-5 text-left shadow-sm border border-gray-100"
        >
          <h2 className="text-lg font-semibold text-gray-900">
            Medicine Search
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Search by medicine name, ingredient, dosage, and form. The search API
            will be connected separately.
          </p>
        </button>
      </section>
    </main>
  );
}
