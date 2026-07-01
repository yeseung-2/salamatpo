"use client";

import { useState } from "react";
import Avatar from "@/components/community/Avatar";
import PageHeader from "@/components/community/PageHeader";
import {
  LEADERBOARD_WEEKLY,
  LEADERBOARD_MONTHLY,
} from "@/lib/community/dummy-data";
import type { BadgeTier, LeaderboardEntry } from "@/lib/community/types";

const badgeStyles: Record<BadgeTier, string> = {
  Gold: "bg-amber-100 text-amber-700 ring-amber-200",
  Silver: "bg-gray-200 text-gray-700 ring-gray-300",
  Bronze: "bg-orange-100 text-orange-700 ring-orange-200",
};

export default function LeaderboardPage() {
  const [period, setPeriod] = useState<"weekly" | "monthly">("weekly");
  const entries = period === "weekly" ? LEADERBOARD_WEEKLY : LEADERBOARD_MONTHLY;

  return (
    <div>
      <PageHeader title="Top Contributors" />

      <p className="mb-5 text-sm text-gray-500">
        Users who share verified free medicine experiences earn points and badges.
      </p>

      <div className="mb-5 flex rounded-2xl bg-gray-100 p-1">
        <PeriodTab
          label="Weekly Ranking"
          active={period === "weekly"}
          onClick={() => setPeriod("weekly")}
        />
        <PeriodTab
          label="Monthly Ranking"
          active={period === "monthly"}
          onClick={() => setPeriod("monthly")}
        />
      </div>

      <div className="space-y-3">
        {entries.map((entry) => (
          <LeaderboardCard key={`${period}-${entry.rank}`} entry={entry} />
        ))}
      </div>
    </div>
  );
}

function PeriodTab({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex-1 rounded-xl py-2.5 text-xs font-semibold transition ${
        active ? "bg-white text-primary shadow-sm" : "text-gray-500"
      }`}
    >
      {label}
    </button>
  );
}

function LeaderboardCard({ entry }: { entry: LeaderboardEntry }) {
  return (
    <div className="flex items-center gap-3 rounded-2xl bg-white p-4 shadow-sm ring-1 ring-gray-100">
      <div
        className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-bold ${
          entry.rank === 1
            ? "bg-amber-400 text-white"
            : entry.rank === 2
              ? "bg-gray-400 text-white"
              : entry.rank === 3
                ? "bg-orange-400 text-white"
                : "bg-gray-100 text-gray-600"
        }`}
      >
        {entry.rank}
      </div>

      <Avatar name={entry.username} />

      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <p className="truncate font-semibold text-gray-900">{entry.username}</p>
          <span
            className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-bold uppercase ring-1 ring-inset ${badgeStyles[entry.badge]}`}
          >
            {entry.badge}
          </span>
        </div>
        <p className="text-xs text-gray-500">{entry.region}</p>
        <div className="mt-1 flex gap-3 text-xs text-gray-600">
          <span>{entry.helpfulPosts} helpful</span>
          <span>{entry.verifiedReports} verified</span>
        </div>
      </div>

      <div className="text-right">
        <p className="text-lg font-bold text-primary">{entry.points}</p>
        <p className="text-[10px] uppercase text-gray-400">points</p>
      </div>
    </div>
  );
}
