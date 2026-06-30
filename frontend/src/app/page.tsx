import Link from "next/link";

export default function Home() {
  return (
    <section className="flex min-h-[70vh] flex-col justify-center">
      <div className="space-y-4">
        <p className="text-sm font-medium text-emerald-600">
          필리핀 약값 절감 도우미
        </p>

        <h2 className="text-3xl font-bold leading-tight">
          필요한 약을  
          <br />
          더 저렴하게 찾는 방법
        </h2>

        <p className="text-sm leading-6 text-gray-500">
          약 이름, 지역, 자격 정보를 바탕으로 무료약, 정부지원,
          저가 약국, 재고 문의 경로를 안내합니다.
        </p>
      </div>

      <div className="mt-10">
        <Link
          href="/search"
          className="flex h-14 w-full items-center justify-center rounded-2xl bg-emerald-600 text-base font-semibold text-white shadow-sm"
        >
          약값 절감기 시작하기
        </Link>
      </div>
    </section>
  );
}