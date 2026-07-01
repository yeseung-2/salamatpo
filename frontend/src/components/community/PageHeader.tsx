import Link from "next/link";

type PageHeaderProps = {
  title: string;
  backHref?: string;
};

export default function PageHeader({ title, backHref = "/community" }: PageHeaderProps) {
  return (
    <div className="mb-5 flex items-center gap-3">
      <Link
        href={backHref}
        className="flex h-10 w-10 items-center justify-center rounded-xl bg-gray-100 text-gray-700 transition hover:bg-gray-200"
        aria-label="Go back"
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5">
          <path fillRule="evenodd" d="M12.79 5.23a.75.75 0 01-.02 1.06L8.832 10l3.938 3.71a.75.75 0 11-1.04 1.08l-4.5-4.25a.75.75 0 010-1.08l4.5-4.25a.75.75 0 011.06.02z" clipRule="evenodd" />
        </svg>
      </Link>
      <h1 className="text-xl font-bold text-gray-900">{title}</h1>
    </div>
  );
}
