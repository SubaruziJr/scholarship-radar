"use client";

import { useState } from "react";
import { MatchResult, ScholarshipAction } from "@/lib/types";
import { Badge } from "@/components/ui/Primitives";
import { MatchRing } from "@/components/ui/MatchRing";
import { StatusSelect } from "@/components/StatusSelect";
import {
  classNames,
  deadlineUrgency,
  formatCurrency,
  formatDeadline,
} from "@/lib/format";
import { scoreTier } from "@/lib/matching";

// Per-group presentation: the label badge, the call-to-action wording, and the
// button style. This is what keeps a direct-apply award from looking like a
// login-gated portal, or a process like FAFSA from pretending it's "click to apply".
const ACTION_META: Record<
  ScholarshipAction,
  {
    badge: string;
    tone: "lime" | "sky" | "brand";
    cta: string;
    btn: string;
    guideLabel: string; // text on the expand toggle
    guideTitle: string; // header inside the expanded guide
  }
> = {
  direct_apply: {
    badge: "Apply direct",
    tone: "lime",
    cta: "Apply now",
    btn: "bg-brand text-white hover:bg-brand-dark shadow-card",
    guideLabel: "How to apply",
    guideTitle: "How to apply",
  },
  portal: {
    badge: "Login portal",
    tone: "sky",
    cta: "Open portal",
    btn: "bg-sky text-white hover:opacity-90 shadow-card",
    guideLabel: "What to do",
    guideTitle: "Once you're in",
  },
  process: {
    badge: "Official process",
    tone: "brand",
    cta: "Start here",
    btn: "bg-ink text-cream hover:bg-ink/90 shadow-card",
    guideLabel: "What to do",
    guideTitle: "Step by step",
  },
};

export function ScholarshipCard({ match }: { match: MatchResult }) {
  const { scholarship: s, score, eligible, reasons } = match;
  const [guide, setGuide] = useState(false);
  const [why, setWhy] = useState(false);
  const urgency = deadlineUrgency(s.deadline);
  const tier = scoreTier(score);
  const action = ACTION_META[s.actionType];
  const href = s.applyUrl ?? s.url;

  const metReasons = reasons.filter((r) => r.met && r.weight > 0).slice(0, 3);

  return (
    <article
      className={classNames(
        "card animate-fade-up p-5 transition hover:shadow-lift",
        !eligible && "opacity-75"
      )}
    >
      <div className="flex items-start gap-4">
        <MatchRing score={score} />

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <Badge tone={action.tone}>{action.badge}</Badge>
            <Badge tone={tier.tone}>{tier.label}</Badge>
            {!eligible && <Badge tone="coral">Check eligibility</Badge>}
            {s.requiresEssay && <Badge tone="faint">Essay</Badge>}
          </div>
          <h3 className="mt-1.5 truncate font-display text-lg font-semibold">
            {s.name}
          </h3>
          <p className="text-sm text-ink-faint">{s.provider}</p>
        </div>

        <div className="text-right">
          <p className="font-display text-xl font-semibold text-brand">
            {s.amountVaries ? "Varies" : formatCurrency(s.amount)}
          </p>
          <Badge tone={urgency.tone} className="mt-1">
            {urgency.label}
          </Badge>
        </div>
      </div>

      <p className="mt-3 line-clamp-2 text-sm text-ink-soft">{s.description}</p>

      {metReasons.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-1.5">
          {metReasons.map((r) => (
            <span key={r.label} className="chip bg-lime-soft text-brand-dark">
              ✓ {r.label}
            </span>
          ))}
        </div>
      )}

      {/* Action area: a prominent CTA whose wording/behavior matches the group, */}
      {/* plus an always-reachable walkthrough for kids who've never done this.   */}
      <div className="mt-4 space-y-3 border-t border-line pt-3">
        {href && (
          <a
            href={href}
            target="_blank"
            rel="noreferrer"
            className={classNames(
              "inline-flex w-full items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition focus-ring active:scale-[0.99]",
              action.btn
            )}
          >
            {action.cta} →
          </a>
        )}

        <div className="flex items-center justify-between gap-2">
          <span className="text-xs text-ink-faint">
            Due {formatDeadline(s.deadline)}
          </span>
          <div className="flex items-center gap-1">
            <button
              onClick={() => {
                setGuide((g) => !g);
                setWhy(false);
              }}
              className={classNames(
                "rounded-lg px-2.5 py-1.5 text-xs font-semibold transition",
                guide ? "bg-brand-light text-brand" : "text-brand hover:bg-brand-light"
              )}
            >
              {action.guideLabel}
            </button>
            <button
              onClick={() => {
                setWhy((w) => !w);
                setGuide(false);
              }}
              className={classNames(
                "rounded-lg px-2.5 py-1.5 text-xs font-semibold transition",
                why ? "bg-brand-light text-brand" : "text-ink-faint hover:bg-ink/5"
              )}
            >
              Why?
            </button>
          </div>
        </div>

        <StatusSelect scholarshipId={s.id} />
      </div>

      {/* Walkthrough — what to actually DO once you're on the page / signed in. */}
      {guide && (
        <div className="mt-3 rounded-xl bg-cream/70 p-3">
          <p className="mb-2 text-xs font-bold uppercase tracking-wide text-ink-faint">
            {action.guideTitle}
          </p>
          {s.actionNote && (
            <p className="mb-2 rounded-lg bg-sky-soft px-3 py-2 text-xs text-sky">
              {s.actionNote}
            </p>
          )}
          {s.steps && s.steps.length > 0 ? (
            <ol className="space-y-1.5">
              {s.steps.map((step, i) => (
                <li key={i} className="flex gap-2 text-sm text-ink-soft">
                  <span className="mt-0.5 flex h-5 w-5 flex-none items-center justify-center rounded-full bg-brand text-[11px] font-bold text-white">
                    {i + 1}
                  </span>
                  <span>{step}</span>
                </li>
              ))}
            </ol>
          ) : (
            <p className="text-sm text-ink-soft">
              Open the link above to start your application.
            </p>
          )}
          {href && (
            <a
              href={href}
              target="_blank"
              rel="noreferrer"
              className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-brand underline-offset-2 hover:underline"
            >
              {action.cta} →
            </a>
          )}
        </div>
      )}

      {/* Match breakdown */}
      {why && (
        <div className="mt-3 space-y-1.5 rounded-xl bg-cream/70 p-3">
          <p className="mb-1 text-xs font-bold uppercase tracking-wide text-ink-faint">
            Match breakdown
          </p>
          {reasons.map((r, i) => (
            <div key={i} className="flex items-center justify-between text-sm">
              <span
                className={classNames(
                  "flex items-center gap-2",
                  r.met ? "text-ink" : "text-ink-faint"
                )}
              >
                <span className={r.met ? "text-brand" : "text-coral"}>
                  {r.met ? "✓" : "✕"}
                </span>
                {r.label}
                {r.detail && (
                  <span className="text-xs text-ink-faint">· {r.detail}</span>
                )}
              </span>
              {r.weight > 0 && (
                <span className="text-xs font-semibold text-ink-faint">
                  {r.weight} pts
                </span>
              )}
            </div>
          ))}
          {s.essayPrompt && (
            <p className="mt-2 border-t border-line pt-2 text-xs text-ink-soft">
              <span className="font-semibold">Essay prompt: </span>
              {s.essayPrompt}
            </p>
          )}
        </div>
      )}
    </article>
  );
}
