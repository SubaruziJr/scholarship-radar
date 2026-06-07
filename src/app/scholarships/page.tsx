"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useStore } from "@/lib/context/StoreContext";
import { matchAll } from "@/lib/matching";
import { ScholarshipCard } from "@/components/ScholarshipCard";
import { Button, Card, SectionHeader } from "@/components/ui/Primitives";
import { daysUntil } from "@/lib/format";
import { ScholarshipAction } from "@/lib/types";

type SortKey = "match" | "deadline" | "amount";
type GroupFilter = "all" | ScholarshipAction;

// Ordered so the friction-free "just apply" awards lead, and the bigger-but-
// slower official processes come last — the right default for a stressed student.
const GROUPS: { key: ScholarshipAction; label: string; blurb: string }[] = [
  { key: "direct_apply", label: "Apply direct", blurb: "Quick public forms — easiest wins" },
  { key: "portal", label: "Login portal", blurb: "Sign in, then apply inside" },
  { key: "process", label: "Official process", blurb: "Multi-step, but often the biggest money" },
];

export default function ScholarshipsPage() {
  const { loading, profile, scholarships } = useStore();
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState<SortKey>("match");
  const [eligibleOnly, setEligibleOnly] = useState(false);
  const [essayOnly, setEssayOnly] = useState(false);
  const [group, setGroup] = useState<GroupFilter>("all");

  const matches = useMemo(
    () => (profile ? matchAll(profile, scholarships) : []),
    [profile, scholarships]
  );

  const filtered = useMemo(() => {
    let list = matches;
    const q = query.trim().toLowerCase();
    if (q) {
      list = list.filter(
        (m) =>
          m.scholarship.name.toLowerCase().includes(q) ||
          m.scholarship.provider.toLowerCase().includes(q) ||
          m.scholarship.description.toLowerCase().includes(q)
      );
    }
    if (eligibleOnly) list = list.filter((m) => m.eligible);
    if (essayOnly) list = list.filter((m) => m.scholarship.requiresEssay);
    if (group !== "all")
      list = list.filter((m) => m.scholarship.actionType === group);

    const sorted = [...list];
    if (sort === "deadline") {
      sorted.sort(
        (a, b) =>
          daysUntil(a.scholarship.deadline) - daysUntil(b.scholarship.deadline)
      );
    } else if (sort === "amount") {
      sorted.sort((a, b) => b.scholarship.amount - a.scholarship.amount);
    } else {
      sorted.sort((a, b) => b.score - a.score);
    }
    return sorted;
  }, [matches, query, sort, eligibleOnly, essayOnly, group]);

  if (loading) return <ListSkeleton />;

  if (!profile || !profile.major) {
    return (
      <Card className="p-8 text-center">
        <p className="text-ink-soft">
          Set up your profile first so we can score these for you.
        </p>
        <Link href="/profile" className="mt-3 inline-block">
          <Button>Go to profile →</Button>
        </Link>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <SectionHeader
        eyebrow="Database"
        title="All scholarships"
        action={
          <span className="text-sm text-ink-faint">
            {filtered.length} of {scholarships.length}
          </span>
        }
      />

      {/* Controls */}
      <Card className="p-3">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by name, provider, keyword…"
            className="field flex-1"
          />
          <div className="flex items-center gap-2">
            <label className="text-xs font-semibold text-ink-faint">Sort</label>
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value as SortKey)}
              className="rounded-xl border border-line bg-cream px-3 py-2 text-sm font-semibold focus:border-brand focus:outline-none"
            >
              <option value="match">Best match</option>
              <option value="deadline">Deadline</option>
              <option value="amount">Award amount</option>
            </select>
          </div>
        </div>
        <div className="mt-3 flex flex-wrap gap-2">
          <GroupChip on={group === "all"} onClick={() => setGroup("all")}>
            All
          </GroupChip>
          {GROUPS.map((g) => (
            <GroupChip
              key={g.key}
              on={group === g.key}
              onClick={() => setGroup(g.key)}
            >
              {g.label}
            </GroupChip>
          ))}
        </div>
        <div className="mt-2 flex flex-wrap gap-2">
          <Toggle on={eligibleOnly} onClick={() => setEligibleOnly((v) => !v)}>
            Eligible only
          </Toggle>
          <Toggle on={essayOnly} onClick={() => setEssayOnly((v) => !v)}>
            Requires essay
          </Toggle>
        </div>
      </Card>

      {/* Results */}
      {filtered.length === 0 ? (
        <Card className="p-10 text-center text-ink-faint">
          No scholarships match those filters.
        </Card>
      ) : group === "all" ? (
        <div className="space-y-8">
          {GROUPS.map((g) => {
            const items = filtered.filter(
              (m) => m.scholarship.actionType === g.key
            );
            if (items.length === 0) return null;
            return (
              <section key={g.key}>
                <div className="mb-3 flex items-baseline justify-between gap-3">
                  <div>
                    <h3 className="font-display text-lg font-semibold text-ink">
                      {g.label}
                    </h3>
                    <p className="text-xs text-ink-faint">{g.blurb}</p>
                  </div>
                  <span className="text-xs text-ink-faint">{items.length}</span>
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                  {items.map((m) => (
                    <ScholarshipCard key={m.scholarship.id} match={m} />
                  ))}
                </div>
              </section>
            );
          })}
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {filtered.map((m) => (
            <ScholarshipCard key={m.scholarship.id} match={m} />
          ))}
        </div>
      )}
    </div>
  );
}

function GroupChip({
  on,
  onClick,
  children,
}: {
  on: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={`chip border transition ${
        on
          ? "border-brand bg-brand-light font-semibold text-brand-dark"
          : "border-line bg-cream text-ink-faint hover:border-brand"
      }`}
    >
      {children}
    </button>
  );
}

function Toggle({
  on,
  onClick,
  children,
}: {
  on: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={`chip border transition ${
        on
          ? "border-brand bg-brand text-white"
          : "border-line bg-cream text-ink-soft hover:border-brand"
      }`}
    >
      {children}
    </button>
  );
}

function ListSkeleton() {
  return (
    <div className="space-y-4">
      <div className="h-10 w-48 animate-pulse rounded-xl bg-ink/5" />
      <div className="h-16 animate-pulse rounded-2xl bg-ink/5" />
      <div className="grid gap-4 md:grid-cols-2">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="h-44 animate-pulse rounded-2xl bg-ink/5" />
        ))}
      </div>
    </div>
  );
}
