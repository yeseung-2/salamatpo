"use client";

import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  getAdditionalInfoByPrescription,
  getPrescription,
  type AdditionalInfo,
  type Prescription,
} from "@/lib/api";

function ResultContent() {
  const searchParams = useSearchParams();
  const prescriptionId = searchParams.get("prescriptionId");

  const [prescription, setPrescription] = useState<Prescription | null>(null);
  const [additionalInfo, setAdditionalInfo] = useState<AdditionalInfo | null>(
    null,
  );
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!prescriptionId) return;

    const fetchData = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const [prescriptionData, additionalInfoData] = await Promise.all([
          getPrescription(Number(prescriptionId)),
          getAdditionalInfoByPrescription(Number(prescriptionId)),
        ]);

        setPrescription(prescriptionData);
        setAdditionalInfo(additionalInfoData);
      } catch (fetchError) {
        console.error(fetchError);
        setError("Failed to load your submission details.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [prescriptionId]);

  if (!prescriptionId) {
    return (
      <main className="min-h-screen bg-[#F8FAF7] px-5 py-6">
        <h1 className="text-2xl font-bold text-gray-900">Submission Result</h1>
        <p className="mt-3 text-sm text-red-600">
          Prescription ID is missing.
        </p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#F8FAF7] px-5 py-6">
      <section className="mb-6">
        <p className="text-sm text-gray-500">Step 3</p>
        <h1 className="mt-1 text-2xl font-bold text-gray-900">
          Submission Complete
        </h1>
        <p className="mt-2 text-sm leading-6 text-gray-600">
          Your prescription and eligibility details have been saved. Support
          route recommendations will be shown here next.
        </p>
      </section>

      {isLoading ? (
        <p className="text-sm text-gray-600">Loading your information...</p>
      ) : error ? (
        <p className="text-sm text-red-600">{error}</p>
      ) : (
        <div className="space-y-4">
          {prescription && (
            <section className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
              <h2 className="text-lg font-semibold text-gray-900">
                Prescription Summary
              </h2>
              <div className="mt-4 space-y-3 text-sm">
                <div>
                  <p className="text-gray-500">Patient</p>
                  <p className="font-medium text-gray-900">
                    {prescription.patient_name || "-"}
                  </p>
                </div>
                <div>
                  <p className="text-gray-500">Hospital</p>
                  <p className="font-medium text-gray-900">
                    {prescription.hospital_name || "-"}
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
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </section>
          )}

          {additionalInfo && (
            <section className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
              <h2 className="text-lg font-semibold text-gray-900">
                Eligibility Summary
              </h2>
              <div className="mt-4 space-y-3 text-sm">
                <div>
                  <p className="text-gray-500">Barangay</p>
                  <p className="font-medium text-gray-900">
                    {additionalInfo.barangay || "-"}
                  </p>
                </div>
                <div>
                  <p className="text-gray-500">Monthly Income</p>
                  <p className="font-medium text-gray-900">
                    {additionalInfo.monthly_income_range || "-"}
                  </p>
                </div>
                <div>
                  <p className="text-gray-500">Chronic Conditions</p>
                  <p className="font-medium text-gray-900">
                    {additionalInfo.chronic_conditions.join(", ") || "-"}
                  </p>
                </div>
              </div>
            </section>
          )}
        </div>
      )}

      <Link
        href="/medication"
        className="mt-6 flex h-12 w-full items-center justify-center rounded-xl bg-emerald-600 text-sm font-semibold text-white"
      >
        Back to Information Input
      </Link>
    </main>
  );
}

export default function ResultPage() {
  return (
    <Suspense
      fallback={
        <main className="min-h-screen bg-[#F8FAF7] px-5 py-6">
          <p className="text-sm text-gray-600">Loading...</p>
        </main>
      }
    >
      <ResultContent />
    </Suspense>
  );
}
