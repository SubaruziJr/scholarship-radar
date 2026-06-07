"use client";

import Link from "next/link";
import { useMemo } from "react";
import { useStore } from "@/lib/context/StoreContext";
import { matchAll } from "@/lib/matching";
import { ScholarshipCard } from "@/components/ScholarshipCard";
import { Badge, Button, Card, SectionHeader } from "@/components/ui/Primitives";
import { RadarLogo } from "@/components/ui/RadarLogo";
import { startProCheckout, PRO_PLAN } from "@/lib/stripe/stripe";
import {
  daysUntil,
  deadlineUrgency,
  formatCurrency,
  formatDeadline,
  STATUS_META,
} from "@/lib/format";

export default function DashboardPage() {
  const { loading, profile, scholarships, applications, getStatus } = useStore();

  const matches = useMemo(
    () => (profile ? matchAll(profile, scholarships) : []),
    [profile, scholarships]
  );

  if (loading) return <PageSkeleton />;

  if (!profile || !profile.name || !profile.major) {
    return <NeedsProfile />;
  }

  const strong = matches.filter((m) => m.score >= 70);
  const potential = matches
    .filter((m) => m.eligible)
    .reduce((sum, m) => sum + m.scholarship.amount, 0);

  const upcoming = matches
    .filter((m) => {
      const d = daysUntil(m.scholarship.deadline);
      return d >= 0 && d <= 30;
    })
    .sort(
      (a, b) =>
        daysUntil(a.scholarship.deadline) - daysUntil(b.scholarship.deadline)
    )
    .slice(0, 5);

  const inProgress = applications.filter(
    (a) => a.status === "in_progress" || a.status === "submitted"
  ).length;

  const statusCounts = (["not_started", "in_progress", "submitted", "awarded", "rejected"] as const).map(
    (s) => ({
      status: s,
      count:
        s === "not_started"
          ? scholarships.length - applications.filter((a) => a.status !== "not_started").length
          : applications.filter((a) => a.status === s).length,
    })
  );

  return (
    <div className="space-y-8">
      {/* Hero */}
      <section className="relative overflow-hidden rounded-3xl border border-line bg-brand-dark px-6 py-8 text-cream sm:px-10 sm:py-10">
        <div className="absolute -right-10 -top-10 opacity-30">
          <RadarLogo size={220} animated />
        </div>
        <div className="relative max-w-xl">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-lime">
            Welcome back
          </p>
          <h1 className="mt-1 font-display text-3xl font-semibold sm:text-4xl">
            {profile.name.split(" ")[0]}, you have{" "}
            <span className="text-lime">{strong.length} strong</span> match
            {strong.length === 1 ? "" : "es"}.
          </h1>
          <p className="mt-2 max-w-md text-cream/75">
            Scanning {scholarships.length} scholarships against your profile.
            Keep your deadlines in sight and reuse your best essays.
          </p>
          <div className="mt-5 flex flex-wrap gap-2">
            <Link href="/scholarships">
              <Button variant="lime">Browse all matches</Button>
            </Link>
            <Link href="/essay-tool">
              <Button variant="ghostLight">Reuse an essay →</Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <Stat label="Strong matches" value={String(strong.length)} tone="lime" />
        <Stat
          label="Potential awards"
          value={formatCurrency(potential)}
          tone="brand"
        />
        <Stat
          label="Deadlines ≤30 days"
          value={String(upcoming.length)}
          tone="coral"
        />
        <Stat label="Active applications" value={String(inProgress)} tone="sky" />
      </section>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Best matches */}
        <div className="lg:col-span-2">
          <SectionHeader
            eyebrow="Top picks"
            title="Best matches for you"
            action={
              <Link
                href="/scholarships"
                className="text-sm font-semibold text-brand hover:underline"
              >
                See all
              </Link>
            }
          />
          <div className="space-y-4">
            {matches.slice(0, 4).map((m) => (
              <ScholarshipCard key={m.scholarship.id} match={m} />
            ))}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-8">
          {/* Upcoming deadlines */}
          <div>
            <SectionHeader eyebrow="Don't miss" title="Upcoming deadlines" />
            <Card className="divide-y divide-line">
              {upcoming.length === 0 && (
                <p className="p-4 text-sm text-ink-faint">
                  No deadlines in the next 30 days.
                </p>
              )}
              {upcoming.map((m) => {
                const u = deadlineUrgency(m.scholarship.deadline);
                return (
                  <div
                    key={m.scholarship.id}
                    className="flex items-center justify-between gap-3 p-4"
                  >
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold">
                        {m.scholarship.name}
                      </p>
                      <p className="text-xs text-ink-faint">
                        {formatDeadline(m.scholarship.deadline)} ·{" "}
                        {formatCurrency(m.scholarship.amount)}
                      </p>
                    </div>
                    <Badge tone={u.tone}>{u.label}</Badge>
                  </div>
                );
              })}
            </Card>
          </div>

          {/* Status overview */}
          <div>
            <SectionHeader eyebrow="Tracker" title="Application status" />
            <Card className="p-4">
              <div className="space-y-2.5">
                {statusCounts.map(({ status, count }) => (
                  <div
                    key={status}
                    className="flex items-center justify-between text-sm"
                  >
                    <span className="flex items-center gap-2">
                      <Badge tone={STATUS_META[status].tone}>
                        {STATUS_META[status].label}
                      </Badge>
                    </span>
                    <span className="font-display text-base font-semibold">
                      {Math.max(0, count)}
                    </span>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {/* Pro upsell (Stripe seam) */}
          <ProCard />
        </div>
      </div>
    </div>
  );
}

function Stat({
  label,
  value,
  tone,
}: {
  label: string;
  value: string;
  tone: "lime" | "brand" | "coral" | "sky";
}) {
  const accent = {
    lime: "before:bg-lime",
    brand: "before:bg-brand",
    coral: "before:bg-coral",
    sky: "before:bg-sky",
  }[tone];
  return (
    <Card
      className={`relative overflow-hidden p-4 before:absolute before:left-0 before:top-0 before:h-full before:w-1 ${accent}`}
    >
      <p className="font-display text-2xl font-semibold leading-tight">{value}</p>
      <p className="mt-0.5 text-xs font-medium text-ink-faint">{label}</p>
    </Card>
  );
}

function ProCard() {
  const handleUpgrade = async () => {
    try {
      await startProCheckout();
    } catch (e) {
      alert(
        (e as Error).message ??
          "Billing isn't enabled yet — add Stripe keys to turn this on."
      );
    }
  };
  return (
    <Card className="border-brand/30 bg-brand-light p-5">
      <div className="flex items-center justify-between">
        <h3 className="font-display text-lg font-semibold text-brand-dark">
          {PRO_PLAN.name}
        </h3>
        <Badge tone="brand">{PRO_PLAN.priceLabel}</Badge>
      </div>
      <ul className="mt-3 space-y-1.5 text-sm text-ink-soft">
        {PRO_PLAN.features.map((f) => (
          <li key={f} className="flex items-start gap-2">
            <span className="text-brand">✓</span> {f}
          </li>
        ))}
      </ul>
      <Button onClick={handleUpgrade} className="mt-4 w-full">
        Upgrade to Pro
      </Button>
      <p className="mt-2 text-center text-[11px] text-ink-faint">
        Stripe checkout — wired but disabled until keys are added
      </p>
    </Card>
  );
}

function NeedsProfile() {
  return (
    <div className="mx-auto max-w-md py-16 text-center">
      <div className="mx-auto mb-4 w-fit">
        <RadarLogo size={64} animated />
      </div>
      <h1 className="font-display text-2xl font-semibold">
        Let&apos;s build your radar
      </h1>
      <p className="mt-2 text-ink-soft">
        Fill in your profile and we&apos;ll start matching you with scholarships
        right away.
      </p>
      <Link href="/profile" className="mt-5 inline-block">
        <Button>Set up my profile →</Button>
      </Link>
    </div>
  );
}

function PageSkeleton() {
  return (
    <div className="space-y-6">
      <div className="h-44 animate-pulse rounded-3xl bg-ink/5" />
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-20 animate-pulse rounded-2xl bg-ink/5" />
        ))}
      </div>
      <div className="grid gap-4 lg:grid-cols-3">
        <div className="space-y-4 lg:col-span-2">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-40 animate-pulse rounded-2xl bg-ink/5" />
          ))}
        </div>
        <div className="h-72 animate-pulse rounded-2xl bg-ink/5" />
      </div>
    </div>
  );
}
