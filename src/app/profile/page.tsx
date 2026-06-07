"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useStore } from "@/lib/context/StoreContext";
import { emptyProfile } from "@/lib/data/profile";
import {
  FinancialNeed,
  StudentProfile,
  US_STATES,
} from "@/lib/types";
import { Button, Card, SectionHeader } from "@/components/ui/Primitives";
import { TagInput } from "@/components/ui/TagInput";
import { Autocomplete } from "@/components/ui/Autocomplete";
import { COLLEGES } from "@/lib/data/colleges";
import { MAJORS } from "@/lib/data/majors";

const MAJOR_OPTIONS = MAJORS.map((m) => ({ label: m }));

const INTEREST_SUGGESTIONS = [
  "coding", "robotics", "art", "music", "writing", "science", "business",
  "sports", "community", "environment", "medicine", "leadership", "math",
  "technology", "design", "entrepreneurship",
];
const ACTIVITY_SUGGESTIONS = [
  "robotics club", "volunteering", "student government", "varsity sports",
  "band", "drama club", "part-time job", "tutoring", "debate", "scouts",
  "hackathon", "school newspaper",
];
const NEED_OPTIONS: { value: FinancialNeed; label: string }[] = [
  { value: "none", label: "None" },
  { value: "low", label: "Low" },
  { value: "moderate", label: "Moderate" },
  { value: "high", label: "High" },
];

export default function ProfilePage() {
  const router = useRouter();
  const { loading, profile, saveProfile } = useStore();
  const [form, setForm] = useState<StudentProfile>(emptyProfile());
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (profile) setForm(profile);
  }, [profile]);

  const set = <K extends keyof StudentProfile>(
    key: K,
    value: StudentProfile[K]
  ) => setForm((f) => ({ ...f, [key]: value }));

  const handleSubmit = async () => {
    await saveProfile(form);
    setSaved(true);
    setTimeout(() => router.push("/"), 700);
  };

  if (loading) {
    return <div className="h-96 animate-pulse rounded-2xl bg-ink/5" />;
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <SectionHeader
        eyebrow="Your radar"
        title="Student profile"
        action={
          <span className="text-sm text-ink-faint">
            The more you add, the sharper your matches.
          </span>
        }
      />

      <Card className="space-y-6 p-6">
        {/* Identity */}
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="label">Full name</label>
            <input
              className="field"
              value={form.name}
              onChange={(e) => set("name", e.target.value)}
              placeholder="Jordan Rivera"
            />
          </div>
          <div>
            <label className="label">Graduation year</label>
            <input
              type="number"
              className="field"
              value={form.graduationYear}
              onChange={(e) =>
                set("graduationYear", Number(e.target.value) || 0)
              }
            />
          </div>
        </div>

        {/* Academics */}
        <div className="grid gap-4 sm:grid-cols-3">
          <div>
            <label className="label">GPA (0–4.0)</label>
            <input
              type="number"
              step="0.01"
              min={0}
              max={4}
              className="field"
              value={form.gpa}
              onChange={(e) => set("gpa", Number(e.target.value))}
            />
            <input
              type="range"
              min={0}
              max={4}
              step={0.1}
              value={form.gpa}
              onChange={(e) => set("gpa", Number(e.target.value))}
              className="mt-2 w-full accent-brand"
            />
          </div>
          <div>
            <label className="label">State</label>
            <select
              className="field"
              value={form.state}
              onChange={(e) => set("state", e.target.value)}
            >
              <option value="">Select…</option>
              {US_STATES.map((s) => (
                <option key={s.code} value={s.code}>
                  {s.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="label">Financial need</label>
            <select
              className="field"
              value={form.financialNeed}
              onChange={(e) =>
                set("financialNeed", e.target.value as FinancialNeed)
              }
            >
              {NEED_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <Autocomplete
            label="Intended college"
            value={form.intendedCollege}
            onChange={(v) => set("intendedCollege", v)}
            options={COLLEGES}
            placeholder="Start typing, e.g. “pitt”…"
            hint="Type a name or abbreviation — or enter your own."
          />
          <Autocomplete
            label="Intended major"
            value={form.major}
            onChange={(v) => set("major", v)}
            options={MAJOR_OPTIONS}
            placeholder="Start typing, e.g. “comp”…"
            hint="Pick from the list or type your own."
          />
        </div>

        {/* Interests & activities */}
        <TagInput
          label="Interests"
          value={form.interests}
          onChange={(v) => set("interests", v)}
          placeholder="Type and press Enter…"
          suggestions={INTEREST_SUGGESTIONS}
        />
        <TagInput
          label="Activities & clubs"
          value={form.activities}
          onChange={(v) => set("activities", v)}
          placeholder="Type and press Enter…"
          suggestions={ACTIVITY_SUGGESTIONS}
        />

        {/* Job experience */}
        <div>
          <label className="label">Job / work experience</label>
          <textarea
            className="field min-h-[96px] resize-y"
            value={form.jobExperience}
            onChange={(e) => set("jobExperience", e.target.value)}
            placeholder="Part-time roles, internships, family business, summer work…"
          />
        </div>

        <div className="flex items-center justify-end gap-3 border-t border-line pt-4">
          {saved && (
            <span className="text-sm font-semibold text-brand">
              Saved ✓ redirecting…
            </span>
          )}
          <Button onClick={handleSubmit} disabled={!form.name || !form.major}>
            Save profile &amp; see matches
          </Button>
        </div>
      </Card>

      <p className="text-center text-xs text-ink-faint">
        Saved locally on this device (mock mode). With Supabase enabled, this
        syncs to your account.
      </p>
    </div>
  );
}
