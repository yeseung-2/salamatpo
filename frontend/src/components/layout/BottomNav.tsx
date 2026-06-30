"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  {
    label: "Home",
    href: "/",
    icon: "🏠",
  },
  {
    label: "Search",
    href: "/search",
    icon: "🔍",
  },
  {
    label: "Intake",
    href: "/medication",
    icon: "💊",
  },
  {
    label: "Community",
    href: "/community",
    icon: "💬",
  },
  {
    label: "Profile",
    href: "/mypage",
    icon: "👤",
  },
];

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-1/2 z-50 w-full max-w-[430px] -translate-x-1/2 border-t border-gray-100 bg-white px-2 pb-3 pt-2">
      <div className="grid grid-cols-5">
        {navItems.map((item) => {
          const isActive =
            item.href === "/"
              ? pathname === "/"
              : pathname === item.href || pathname.startsWith(`${item.href}/`);

          return (
            <Link
              key={item.href}
              href={item.href}
              className="flex flex-col items-center justify-center gap-1 rounded-xl py-2 text-xs"
            >
              <span className="text-lg">{item.icon}</span>
              <span
                className={
                  isActive
                    ? "font-semibold text-emerald-600"
                    : "text-gray-400"
                }
              >
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}