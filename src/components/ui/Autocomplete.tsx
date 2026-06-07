"use client";

import { useMemo, useRef, useState } from "react";
import { classNames } from "@/lib/format";

export interface ComboOption {
  label: string;
  keywords?: string; // extra terms to match on (abbreviations, nicknames)
}

// A text field with a filtered suggestion dropdown. Free text is always allowed
// — selecting a suggestion just fills the input — so a value not in the list
// still works. Matches on label first (starts-with ranked above contains) and
// on the optional keywords, so "pitt" finds "University of Pittsburgh".
export function Autocomplete({
  label,
  value,
  onChange,
  options,
  placeholder,
  maxResults = 8,
  hint,
}: {
  label: string;
  value: string;
  onChange: (next: string) => void;
  options: ComboOption[];
  placeholder?: string;
  maxResults?: number;
  hint?: string;
}) {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);
  const blurTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const q = value.trim().toLowerCase();

  const results = useMemo(() => {
    if (!q) return [];
    const starts: ComboOption[] = [];
    const contains: ComboOption[] = [];
    for (const o of options) {
      const lbl = o.label.toLowerCase();
      if (lbl === q) continue; // already exactly typed — nothing to suggest
      const kw = (o.keywords ?? "").toLowerCase();
      const kwHit = kw.split(/\s+/).some((k) => k && k.startsWith(q));
      if (lbl.startsWith(q) || kwHit) starts.push(o);
      else if (lbl.includes(q) || kw.includes(q)) contains.push(o);
    }
    return [...starts, ...contains].slice(0, maxResults);
  }, [q, options, maxResults]);

  const choose = (o: ComboOption) => {
    onChange(o.label);
    setOpen(false);
  };

  const show = open && results.length > 0;

  return (
    <div className="relative">
      <label className="label">{label}</label>
      <input
        className="field"
        value={value}
        placeholder={placeholder}
        role="combobox"
        aria-expanded={show}
        aria-autocomplete="list"
        onChange={(e) => {
          onChange(e.target.value);
          setOpen(true);
          setActive(0);
        }}
        onFocus={() => setOpen(true)}
        onBlur={() => {
          blurTimer.current = setTimeout(() => setOpen(false), 120);
        }}
        onKeyDown={(e) => {
          if (!show) return;
          if (e.key === "ArrowDown") {
            e.preventDefault();
            setActive((a) => Math.min(a + 1, results.length - 1));
          } else if (e.key === "ArrowUp") {
            e.preventDefault();
            setActive((a) => Math.max(a - 1, 0));
          } else if (e.key === "Enter") {
            e.preventDefault();
            choose(results[active]);
          } else if (e.key === "Escape") {
            setOpen(false);
          }
        }}
      />
      {hint && !show && (
        <p className="mt-1 text-xs text-ink-faint">{hint}</p>
      )}
      {show && (
        <ul
          role="listbox"
          className="absolute z-30 mt-1 max-h-64 w-full overflow-auto rounded-xl border border-line bg-paper py-1 shadow-lift"
        >
          {results.map((o, i) => (
            <li key={o.label} role="option" aria-selected={i === active}>
              <button
                type="button"
                onMouseDown={(e) => e.preventDefault()}
                onMouseEnter={() => setActive(i)}
                onClick={() => choose(o)}
                className={classNames(
                  "block w-full px-3 py-2 text-left text-sm transition",
                  i === active
                    ? "bg-brand-light text-brand-dark"
                    : "text-ink-soft hover:bg-cream"
                )}
              >
                {o.label}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
