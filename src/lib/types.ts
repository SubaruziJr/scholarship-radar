// ─────────────────────────────────────────────────────────────────────────────
// Core domain types. These map cleanly to future Supabase tables, so when you
// migrate, the column names below become your table columns.
// ─────────────────────────────────────────────────────────────────────────────

export type FinancialNeed = "none" | "low" | "moderate" | "high";

export const FINANCIAL_NEED_RANK: Record<FinancialNeed, number> = {
  none: 0,
  low: 1,
  moderate: 2,
  high: 3,
};

export const US_STATES: { code: string; name: string }[] = [
  { code: "AL", name: "Alabama" }, { code: "AK", name: "Alaska" },
  { code: "AZ", name: "Arizona" }, { code: "AR", name: "Arkansas" },
  { code: "CA", name: "California" }, { code: "CO", name: "Colorado" },
  { code: "CT", name: "Connecticut" }, { code: "DE", name: "Delaware" },
  { code: "FL", name: "Florida" }, { code: "GA", name: "Georgia" },
  { code: "HI", name: "Hawaii" }, { code: "ID", name: "Idaho" },
  { code: "IL", name: "Illinois" }, { code: "IN", name: "Indiana" },
  { code: "IA", name: "Iowa" }, { code: "KS", name: "Kansas" },
  { code: "KY", name: "Kentucky" }, { code: "LA", name: "Louisiana" },
  { code: "ME", name: "Maine" }, { code: "MD", name: "Maryland" },
  { code: "MA", name: "Massachusetts" }, { code: "MI", name: "Michigan" },
  { code: "MN", name: "Minnesota" }, { code: "MS", name: "Mississippi" },
  { code: "MO", name: "Missouri" }, { code: "MT", name: "Montana" },
  { code: "NE", name: "Nebraska" }, { code: "NV", name: "Nevada" },
  { code: "NH", name: "New Hampshire" }, { code: "NJ", name: "New Jersey" },
  { code: "NM", name: "New Mexico" }, { code: "NY", name: "New York" },
  { code: "NC", name: "North Carolina" }, { code: "ND", name: "North Dakota" },
  { code: "OH", name: "Ohio" }, { code: "OK", name: "Oklahoma" },
  { code: "OR", name: "Oregon" }, { code: "PA", name: "Pennsylvania" },
  { code: "RI", name: "Rhode Island" }, { code: "SC", name: "South Carolina" },
  { code: "SD", name: "South Dakota" }, { code: "TN", name: "Tennessee" },
  { code: "TX", name: "Texas" }, { code: "UT", name: "Utah" },
  { code: "VT", name: "Vermont" }, { code: "VA", name: "Virginia" },
  { code: "WA", name: "Washington" }, { code: "WV", name: "West Virginia" },
  { code: "WI", name: "Wisconsin" }, { code: "WY", name: "Wyoming" },
  { code: "DC", name: "District of Columbia" },
];

export interface StudentProfile {
  id: string;
  name: string;
  gpa: number; // 0.0 – 4.0
  state: string; // two-letter code, e.g. "LA"
  intendedCollege: string;
  major: string;
  interests: string[];
  activities: string[];
  jobExperience: string; // free text
  financialNeed: FinancialNeed;
  graduationYear: number;
}

export type Competitiveness = "low" | "medium" | "high";

// How a student actually applies. This drives the card's button + guidance so we
// never drop a stressed kid on a page that only *describes* a thing.
//   direct_apply — one public form; the button takes them straight to it.
//   portal       — login-gated database (e.g. a school's own scholarship system);
//                  the button opens the portal, the steps say what to do once in.
//   process      — a multi-step official process with no single "apply" button
//                  (FAFSA, state programs); the steps ARE the product here.
export type ScholarshipAction = "direct_apply" | "portal" | "process";

export interface Scholarship {
  id: string;
  name: string;
  provider: string;
  amount: number; // USD (ignored for display when amountVaries is true)
  amountVaries?: boolean; // true when there's no fixed dollar figure (FAFSA, TOPS)
  deadline: string; // ISO date string "YYYY-MM-DD"
  description: string;
  url?: string; // optional "more info" / details page

  // Action + guidance ────────────────────────────────────────────────────────
  actionType: ScholarshipAction;
  applyUrl?: string; // where the action button sends them (falls back to url)
  actionNote?: string; // one-line context shown above the steps
  steps?: string[]; // short walkthrough of what to do once they're on the page

  // Eligibility / matching criteria (all optional == "open to everyone")
  minGpa?: number;
  eligibleStates?: string[]; // undefined / empty == all states
  majors?: string[]; // matched against profile.major
  interestTags?: string[]; // matched against profile.interests
  activityTags?: string[]; // matched against profile.activities
  financialNeedRequired?: FinancialNeed; // minimum need level to qualify

  requiresEssay: boolean;
  essayPrompt?: string;
  essayThemes?: string[]; // used by the essay-reuse matcher
  renewable?: boolean;
  competitiveness?: Competitiveness;
}

export type ApplicationStatus =
  | "not_started"
  | "in_progress"
  | "submitted"
  | "awarded"
  | "rejected";

export interface Application {
  scholarshipId: string;
  status: ApplicationStatus;
  notes?: string;
  updatedAt: string; // ISO timestamp
}

export interface MatchReason {
  label: string;
  met: boolean;
  weight: number;
  detail?: string;
}

export interface MatchResult {
  scholarship: Scholarship;
  score: number; // 0 – 100
  eligible: boolean; // false if a hard requirement (GPA / state) is not met
  reasons: MatchReason[];
}

export interface EssaySuggestion {
  scholarship: Scholarship;
  fit: number; // 0 – 100
  matchedThemes: string[];
}
