"use client";

import { useState } from "react";

export function TagInput({
  label,
  value,
  onChange,
  placeholder,
  suggestions = [],
}: {
  label: string;
  value: string[];
  onChange: (next: string[]) => void;
  placeholder?: string;
  suggestions?: string[];
}) {
  const [draft, setDraft] = useState("");

  const add = (raw: string) => {
    const tag = raw.trim().toLowerCase();
    if (!tag) return;
    if (value.includes(tag)) return;
    onChange([...value, tag]);
    setDraft("");
  };

  const remove = (tag: string) => onChange(value.filter((t) => t !== tag));

  const draftNorm = draft.trim().toLowerCase();
  const unusedSuggestions = suggestions.filter((s) => !value.includes(s));
  // As the user types, narrow the suggestions to what matches the draft so this
  // behaves like type-ahead; with an empty draft, show a starter set.
  const shownSuggestions = (
    draftNorm
      ? unusedSuggestions.filter((s) => s.toLowerCase().includes(draftNorm))
      : unusedSuggestions
  ).slice(0, 8);

  return (
    <div>
      <label className="label">{label}</label>
      <div className="field flex flex-wrap items-center gap-1.5 py-2">
        {value.map((tag) => (
          <span
            key={tag}
            className="chip bg-brand-light text-brand-dark"
          >
            {tag}
            <button
              type="button"
              onClick={() => remove(tag)}
              className="ml-0.5 rounded-full px-1 text-brand-dark/70 hover:bg-brand/10 hover:text-brand-dark"
              aria-label={`Remove ${tag}`}
            >
              ×
            </button>
          </span>
        ))}
        <input
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === ",") {
              e.preventDefault();
              add(draft);
            } else if (e.key === "Backspace" && !draft && value.length) {
              remove(value[value.length - 1]);
            }
          }}
          placeholder={value.length ? "" : placeholder}
          className="min-w-[8rem] flex-1 bg-transparent text-sm outline-none placeholder:text-ink-faint"
        />
      </div>
      {shownSuggestions.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-1.5">
          {shownSuggestions.map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => add(s)}
              className="chip border border-line bg-cream text-ink-soft hover:border-brand hover:text-brand-dark"
            >
              + {s}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
