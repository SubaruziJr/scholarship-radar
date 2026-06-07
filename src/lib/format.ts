import { ApplicationStatus } from "@/lib/types";

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(amount);
}

export function daysUntil(isoDate: string): number {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const target = new Date(isoDate + "T00:00:00");
  return Math.round((target.getTime() - today.getTime()) / 86_400_000);
}

export function formatDeadline(isoDate: string): string {
  return new Date(isoDate + "T00:00:00").toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function deadlineUrgency(
  isoDate: string
): { label: string; tone: "coral" | "sky" | "faint" } {
  const d = daysUntil(isoDate);
  if (d < 0) return { label: "Closed", tone: "faint" };
  if (d === 0) return { label: "Due today", tone: "coral" };
  if (d <= 14) return { label: `${d} day${d === 1 ? "" : "s"} left`, tone: "coral" };
  if (d <= 30) return { label: `${d} days left`, tone: "sky" };
  return { label: `${d} days left`, tone: "faint" };
}

export const STATUS_META: Record<
  ApplicationStatus,
  { label: string; tone: "faint" | "sky" | "brand" | "lime" | "coral" }
> = {
  not_started: { label: "Not started", tone: "faint" },
  in_progress: { label: "In progress", tone: "sky" },
  submitted: { label: "Submitted", tone: "brand" },
  awarded: { label: "Awarded", tone: "lime" },
  rejected: { label: "Not selected", tone: "coral" },
};

export function classNames(...parts: (string | false | null | undefined)[]): string {
  return parts.filter(Boolean).join(" ");
}
