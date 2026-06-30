import Link from "next/link";

export default function SavingStartButton() {
  return (
    <Link
      href="/search"
      className="flex w-full items-center justify-center rounded-xl bg-foreground px-4 py-4 text-base font-semibold text-background"
    >
      절약 시작하기
    </Link>
  );
}
