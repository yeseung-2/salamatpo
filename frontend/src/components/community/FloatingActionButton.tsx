import Link from "next/link";

type FloatingActionButtonProps = {
  href: string;
  label?: string;
};

export default function FloatingActionButton({
  href,
  label = "Write Post",
}: FloatingActionButtonProps) {
  return (
    <Link
      href={href}
      className="fixed bottom-24 right-[max(1.25rem,calc(50%-195px))] z-40 flex h-14 items-center gap-2 rounded-full bg-primary px-5 text-sm font-semibold text-white shadow-lg shadow-primary/30 transition hover:bg-primary-dark active:scale-95"
    >
      <span className="text-xl leading-none">+</span>
      {label}
    </Link>
  );
}
