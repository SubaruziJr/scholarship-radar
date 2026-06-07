"use client";

import { useMemo, useState } from "react";
import { useStore } from "@/lib/context/StoreContext";
import { suggestEssayReuse } from "@/lib/essayMatch";
import { Badge, Button, Card, SectionHeader } from "@/components/ui/Primitives";
import { MatchRing } from "@/components/ui/MatchRing";
import { StatusSelect } from "@/components/StatusSelect";
import { formatCurrency, formatDeadline } from "@/lib/format";

const EXAMPLES = [
  "I spent two years volunteering at a community garden, learning how a small group of neighbors could fight food insecurity together.",
  "Building my first robot taught me to solve problems by failing fast, iterating, and never giving up when the code wouldn't compile.",
  "Working weekends at a coffee shop while keeping my grades up taught me responsibility, time management, and how to lead a team.",
];

export default function EssayToolPage() {
  const { scholarships } = useStore();
  const [essay, setEssay] = useState("");
  const [submitted, setSubmitted] = useState("");

  const suggestions = useMemo(
    () => (submitted ? suggestEssayReuse(submitted, scholarships) : []),
    [submitted, scholarships]
  );

  const wordCount = essay.trim() ? essay.trim().split(/\s+/).length : 0;

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <SectionHeader
        eyebrow="Write once, apply often"
        title="Essay reuse finder"
      />
      <p className="-mt-2 text-ink-soft">
        Paste an essay you&apos;ve already written (or just its topic). We&apos;ll
        scan every scholarship prompt and rank which ones your essay could be
        reused or lightly tweaked for.
      </p>

      <Card className="p-5">
        <label className="label">Your essay or topic</label>
        <textarea
          className="field min-h-[180px] resize-y"
          value={essay}
          onChange={(e) => setEssay(e.target.value)}
          placeholder="Paste your essay here…"
        />
        <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
          <span className="text-xs text-ink-faint">{wordCount} words</span>
          <div className="flex gap-2">
            <Button
              variant="ghost"
              onClick={() => {
                setEssay("");
                setSubmitted("");
              }}
            >
              Clear
            </Button>
            <Button
              onClick={() => setSubmitted(essay)}
              disabled={essay.trim().length < 8}
            >
              Find matching prompts
            </Button>
          </div>
        </div>

        {!essay && (
          <div className="mt-4 border-t border-line pt-3">
            <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-ink-faint">
              Try an example
            </p>
            <div className="space-y-2">
              {EXAMPLES.map((ex, i) => (
                <button
                  key={i}
                  onClick={() => {
                    setEssay(ex);
                    setSubmitted(ex);
                  }}
                  className="block w-full rounded-xl border border-line bg-cream/60 p-3 text-left text-sm text-ink-soft transition hover:border-brand hover:bg-paper"
                >
                  {ex}
                </button>
              ))}
            </div>
          </div>
        )}
      </Card>

      {submitted && (
        <div className="space-y-4">
          <SectionHeader
            eyebrow="Results"
            title={
              suggestions.length
                ? `${suggestions.length} prompt${
                    suggestions.length === 1 ? "" : "s"
                  } your essay could fit`
                : "No strong matches yet"
            }
          />

          {suggestions.length === 0 && (
            <Card className="p-8 text-center text-ink-faint">
              We couldn&apos;t find prompts that overlap with this essay. Try
              adding more detail about your themes, experiences, or goals.
            </Card>
          )}

          {suggestions.map(({ scholarship: s, fit, matchedThemes }) => (
            <Card key={s.id} className="animate-fade-up p-5">
              <div className="flex items-start gap-4">
                <MatchRing score={fit} size={52} showLabel />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="truncate font-display text-lg font-semibold">
                      {s.name}
                    </h3>
                  </div>
                  <p className="text-sm text-ink-faint">
                    {s.provider} · {formatCurrency(s.amount)} · due{" "}
                    {formatDeadline(s.deadline)}
                  </p>
                </div>
                <StatusSelect scholarshipId={s.id} />
              </div>

              {s.essayPrompt && (
                <p className="mt-3 rounded-xl bg-cream/70 p-3 text-sm text-ink-soft">
                  <span className="font-semibold text-ink">Prompt: </span>
                  {s.essayPrompt}
                </p>
              )}

              {matchedThemes.length > 0 && (
                <div className="mt-3">
                  <p className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-ink-faint">
                    Overlapping themes
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {matchedThemes.map((t) => (
                      <Badge key={t} tone="lime">
                        {t}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
