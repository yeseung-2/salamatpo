"use client";

import type { FilterChip } from "@/lib/community/types";
import { FILTER_CHIPS } from "@/lib/community/dummy-data";

type FilterChipsProps = {
  active: FilterChip;
  onChange: (chip: FilterChip) => void;
};

export default function FilterChips({ active, onChange }: FilterChipsProps) {
  return (
    <div className="-mx-5 overflow-x-auto px-5 pb-1">
      <div className="flex gap-2">
        {FILTER_CHIPS.map((chip) => {
          const isActive = active === chip;

          return (
            <button
              key={chip}
              type="button"
              onClick={() => onChange(chip)}
              className={`shrink-0 rounded-full px-4 py-2 text-xs font-medium transition ${
                isActive
                  ? "bg-primary text-white shadow-sm"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              {chip}
            </button>
          );
        })}
      </div>
    </div>
  );
}
