import Link from "next/link";

export default function Home() {
  return (
    <section className="flex min-h-[70vh] flex-col justify-center">
      <div className="space-y-4">
        <p className="text-sm font-medium text-emerald-600">
          Philippines medicine savings helper
        </p>

        <h2 className="text-3xl font-bold leading-tight">
          Find the medicines
          <br />
          you need at lower cost
        </h2>

        <p className="text-sm leading-6 text-gray-500">
          Based on medicine name, location, and eligibility, we guide you to free
          medicines, government support, lower-cost pharmacies, and stock inquiry
          routes.
        </p>
      </div>

      <div className="mt-10">
        <Link
          href="/search"
          className="flex h-14 w-full items-center justify-center rounded-2xl bg-emerald-600 text-base font-semibold text-white shadow-sm"
        >
          Start saving on medicines
        </Link>
      </div>
    </section>
  );
}
