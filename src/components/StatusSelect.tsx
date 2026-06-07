"use client";

import { ApplicationStatus } from "@/lib/types";
import { STATUS_META } from "@/lib/format";
import { useStore } from "@/lib/context/StoreContext";

const ORDER: ApplicationStatus[] = [
  "not_started",
  "in_progress",
  "submitted",
  "awarded",
  "rejected",
];

export function StatusSelect({ scholarshipId }: { scholarshipId: string }) {
  const { getStatus, setStatus } = useStore();
  const current = getStatus(scholarshipId);

  return (
    <select
      value={current}
      onChange={(e) => setStatus(scholarshipId, e.target.value as ApplicationStatus)}
      onClick={(e) => e.stopPropagation()}
      className="rounded-lg border border-line bg-cream px-2.5 py-1.5 text-xs font-semibold text-ink focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20"
      aria-label="Application status"
    >
      {ORDER.map((s) => (
        <option key={s} value={s}>
          {STATUS_META[s].label}
        </option>
      ))}
    </select>
  );
}
