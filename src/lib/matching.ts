import {
  FINANCIAL_NEED_RANK,
  MatchReason,
  MatchResult,
  Scholarship,
  StudentProfile,
} from "@/lib/types";

// ─────────────────────────────────────────────────────────────────────────────
// Matching algorithm
//
// Produces a 0–100 score for how well a scholarship fits a student profile,
// plus an explainable list of reasons so the UI can show *why* something matched.
//
// Scoring is a weighted sum of independent factors. Two factors are "hard
// eligibility gates" (GPA and state): if a student fails them, they cannot
// realistically win the award, so the final score is capped low and the result
// is flagged ineligible — it still appears, just sorted to the bottom.
//
// Weights are intentionally kept in one place so they're easy to tune.
// ─────────────────────────────────────────────────────────────────────────────

const WEIGHTS = {
  gpa: 25,
  state: 15,
  major: 20,
  interests: 15,
  activities: 10,
  need: 10,
  bonus: 5,
} as const;

const INELIGIBLE_SCORE_CAP = 25;

function norm(s: string): string {
  return s.trim().toLowerCase();
}

/** Fraction of the scholarship's tags that the student's list covers (0–1). */
function overlapRatio(studentTags: string[], scholarshipTags?: string[]): number {
  if (!scholarshipTags || scholarshipTags.length === 0) return -1; // sentinel: "not specified"
  const set = new Set(studentTags.map(norm));
  let hits = 0;
  for (const tag of scholarshipTags) {
    // count a hit if any student tag contains or is contained by the scholarship tag
    const t = norm(tag);
    for (const s of set) {
      if (s === t || s.includes(t) || t.includes(s)) {
        hits++;
        break;
      }
    }
  }
  return hits / scholarshipTags.length;
}

export function scoreScholarship(
  profile: StudentProfile,
  scholarship: Scholarship
): MatchResult {
  const reasons: MatchReason[] = [];
  let raw = 0;
  let eligible = true;

  // ── GPA gate ──────────────────────────────────────────────────────────────
  if (scholarship.minGpa == null) {
    raw += WEIGHTS.gpa;
    reasons.push({ label: "No minimum GPA", met: true, weight: WEIGHTS.gpa });
  } else if (profile.gpa >= scholarship.minGpa) {
    raw += WEIGHTS.gpa;
    reasons.push({
      label: `Meets ${scholarship.minGpa.toFixed(1)} GPA minimum`,
      met: true,
      weight: WEIGHTS.gpa,
      detail: `Your GPA: ${profile.gpa.toFixed(2)}`,
    });
  } else {
    eligible = false;
    reasons.push({
      label: `Below ${scholarship.minGpa.toFixed(1)} GPA minimum`,
      met: false,
      weight: WEIGHTS.gpa,
      detail: `Your GPA: ${profile.gpa.toFixed(2)}`,
    });
  }

  // ── State gate ──────────────────────────────────────────────────────────────
  if (!scholarship.eligibleStates || scholarship.eligibleStates.length === 0) {
    raw += WEIGHTS.state;
    reasons.push({ label: "Open to all states", met: true, weight: WEIGHTS.state });
  } else if (profile.state && scholarship.eligibleStates.includes(profile.state)) {
    raw += WEIGHTS.state;
    reasons.push({
      label: `Eligible in ${profile.state}`,
      met: true,
      weight: WEIGHTS.state,
    });
  } else {
    eligible = false;
    reasons.push({
      label: `Restricted to ${scholarship.eligibleStates.join(", ")}`,
      met: false,
      weight: WEIGHTS.state,
    });
  }

  // ── Major ──────────────────────────────────────────────────────────────────
  if (!scholarship.majors || scholarship.majors.length === 0) {
    raw += WEIGHTS.major * 0.4; // general award — modest credit, not a tailored fit
    reasons.push({ label: "Open to all majors", met: true, weight: WEIGHTS.major });
  } else {
    const majorMatch =
      !!profile.major &&
      scholarship.majors.some(
        (m) => norm(m) === norm(profile.major) || norm(profile.major).includes(norm(m)) || norm(m).includes(norm(profile.major))
      );
    if (majorMatch) {
      raw += WEIGHTS.major;
      reasons.push({
        label: `Matches your major (${profile.major})`,
        met: true,
        weight: WEIGHTS.major,
      });
    } else {
      raw += WEIGHTS.major * 0.15;
      reasons.push({
        label: `Prefers: ${scholarship.majors.slice(0, 3).join(", ")}`,
        met: false,
        weight: WEIGHTS.major,
      });
    }
  }

  // ── Interests ────────────────────────────────────────────────────────────────
  const interestRatio = overlapRatio(profile.interests, scholarship.interestTags);
  if (interestRatio < 0) {
    raw += WEIGHTS.interests * 0.3;
  } else {
    raw += WEIGHTS.interests * interestRatio;
    reasons.push({
      label:
        interestRatio > 0
          ? `Shares ${Math.round(interestRatio * 100)}% of target interests`
          : "Different interest focus",
      met: interestRatio > 0,
      weight: WEIGHTS.interests,
    });
  }

  // ── Activities ───────────────────────────────────────────────────────────────
  const activityRatio = overlapRatio(profile.activities, scholarship.activityTags);
  if (activityRatio < 0) {
    raw += WEIGHTS.activities * 0.3;
  } else {
    raw += WEIGHTS.activities * activityRatio;
    if (activityRatio > 0) {
      reasons.push({
        label: "Your activities line up",
        met: true,
        weight: WEIGHTS.activities,
      });
    }
  }

  // ── Financial need ───────────────────────────────────────────────────────────
  if (!scholarship.financialNeedRequired) {
    raw += WEIGHTS.need;
  } else {
    const required = FINANCIAL_NEED_RANK[scholarship.financialNeedRequired];
    const have = FINANCIAL_NEED_RANK[profile.financialNeed];
    if (have >= required) {
      raw += WEIGHTS.need;
      reasons.push({
        label: "Matches financial-need criteria",
        met: true,
        weight: WEIGHTS.need,
      });
    } else {
      raw += WEIGHTS.need * 0.3;
      reasons.push({
        label: `Prioritizes ${scholarship.financialNeedRequired}+ financial need`,
        met: false,
        weight: WEIGHTS.need,
      });
    }
  }

  // ── Bonus: winnability ───────────────────────────────────────────────────────
  let bonus = WEIGHTS.bonus * 0.5;
  if (scholarship.competitiveness === "low") bonus = WEIGHTS.bonus;
  else if (scholarship.competitiveness === "high") bonus = WEIGHTS.bonus * 0.2;
  raw += bonus;
  // Tiny award-size nudge (max ~3 pts) so two otherwise-equal scholarships don't
  // land on the exact same score — bigger money edges ahead. Capped at $30k+.
  if (!scholarship.amountVaries && scholarship.amount > 0) {
    raw += Math.min(3, scholarship.amount / 10000);
  }
  if (scholarship.renewable) {
    reasons.push({ label: "Renewable each year", met: true, weight: 0 });
  }

  let score = Math.round(Math.max(0, Math.min(100, raw)));
  if (!eligible) {
    score = Math.min(score, INELIGIBLE_SCORE_CAP);
  }

  return { scholarship, score, eligible, reasons };
}

/** Score every scholarship and return them sorted best-first. */
export function matchAll(
  profile: StudentProfile,
  scholarships: Scholarship[]
): MatchResult[] {
  return scholarships
    .map((s) => scoreScholarship(profile, s))
    .sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score;
      // tie-break: sooner deadline first, then larger award
      const da = new Date(a.scholarship.deadline).getTime();
      const db = new Date(b.scholarship.deadline).getTime();
      if (da !== db) return da - db;
      return b.scholarship.amount - a.scholarship.amount;
    });
}

export function scoreTier(score: number): {
  label: string;
  tone: "lime" | "brand" | "sky" | "faint";
} {
  if (score >= 80) return { label: "Strong match", tone: "lime" };
  if (score >= 60) return { label: "Good match", tone: "brand" };
  if (score >= 40) return { label: "Possible match", tone: "sky" };
  return { label: "Long shot", tone: "faint" };
}
