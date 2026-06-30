"use client";

import { useRouter } from "next/navigation";

export default function InfoInputPage() {
  const router = useRouter();

  return (
    <main className="min-h-screen bg-[#F8FAF7] px-5 py-6">
      <section className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">정보입력</h1>
        <p className="mt-2 text-sm leading-6 text-gray-600">
          처방전에서 환자·처방·약 정보를 추출하고, 복지 매칭에 필요한 추가
          정보만 따로 입력할 수 있어요.
        </p>
      </section>

      <section className="space-y-4">
        <button
          onClick={() => router.push("/medication/prescription-intake")}
          className="w-full rounded-2xl bg-white p-5 text-left shadow-sm border border-gray-100"
        >
          <h2 className="text-lg font-semibold text-gray-900">
            처방전 인식 / 정보입력
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            처방전을 촬영하거나 직접 입력해서 환자 정보, 병원명, 의사명,
            처방일, 약 정보를 등록합니다.
          </p>
        </button>

        <button
          onClick={() => router.push("/medication/additional-info")}
          className="w-full rounded-2xl bg-white p-5 text-left shadow-sm border border-gray-100"
        >
          <h2 className="text-lg font-semibold text-gray-900">
            추가정보입력
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            처방전에서 가져온 이름·나이·주소는 자동기입하고, PhilHealth·자격
            정보·소득 수준 등 부족한 정보만 추가로 입력합니다.
          </p>
        </button>

        <button
          onClick={() => router.push("/medication/search")}
          className="w-full rounded-2xl bg-white p-5 text-left shadow-sm border border-gray-100"
        >
          <h2 className="text-lg font-semibold text-gray-900">
            약 검색
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            약 이름, 성분, 함량, 제형을 검색합니다. 약 검색 API는 이후 별도로 연결합니다.
          </p>
        </button>
      </section>
    </main>
  );
}