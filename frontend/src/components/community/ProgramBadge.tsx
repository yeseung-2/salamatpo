import type { ProgramTag } from "@/lib/community/types";

const programColors: Record<ProgramTag, string> = {
  GAMOT: "bg-emerald-50 text-emerald-700 ring-emerald-200",
  Malasakit: "bg-blue-50 text-blue-700 ring-blue-200",
  PhilHealth: "bg-teal-50 text-teal-700 ring-teal-200",
  GL: "bg-purple-50 text-purple-700 ring-purple-200",
  Hospital: "bg-orange-50 text-orange-700 ring-orange-200",
};

type ProgramBadgeProps = {
  program: ProgramTag;
};

export default function ProgramBadge({ program }: ProgramBadgeProps) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset ${programColors[program]}`}
    >
      {program}
    </span>
  );
}
