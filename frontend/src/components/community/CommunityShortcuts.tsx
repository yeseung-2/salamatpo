import Link from "next/link";

const shortcuts = [
  { label: "Stock Report", href: "/community/report", icon: "📦" },
  { label: "Q&A", href: "/community/qa", icon: "❓" },
  { label: "Ranking", href: "/community/leaderboard", icon: "🏆" },
];

export default function CommunityShortcuts() {
  return (
    <div className="grid grid-cols-3 gap-2">
      {shortcuts.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className="flex flex-col items-center gap-1 rounded-2xl bg-primary/5 px-2 py-3 text-center transition hover:bg-primary/10"
        >
          <span className="text-xl">{item.icon}</span>
          <span className="text-xs font-medium text-gray-700">{item.label}</span>
        </Link>
      ))}
    </div>
  );
}
