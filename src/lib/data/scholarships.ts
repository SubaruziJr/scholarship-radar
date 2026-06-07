import { Scholarship } from "@/lib/types";

// ─────────────────────────────────────────────────────────────────────────────
// Seed scholarship database — real opportunities from a live search run for a
// New Orleans student heading to the University of Pittsburgh (the "test run"
// that became the first dataset). Each record is tagged by actionType so the UI
// can group them and the card can behave correctly:
//
//   direct_apply  → one public form. Button deep-links straight to it.
//   portal        → login-gated system. Button opens it; steps say what to do in.
//   process       → official multi-step process, no single button. Steps = value.
//
// ⚠️  CURATION NOTE: URLs and deadlines reflect a point-in-time search and MUST be
// re-verified before going live — this is exactly the freshness/accuracy work that
// is the real moat. When you migrate to Supabase this becomes the `scholarships`
// table and listScholarships() queries it instead of importing this array.
//
// Dollar-less items (FAFSA, TOPS) set amountVaries so we never show a fake "$0".
// Rolling deadlines use deadlineInDays(); fixed-cycle ones use literal ISO dates.
// ─────────────────────────────────────────────────────────────────────────────

function deadlineInDays(days: number): string {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d.toISOString().slice(0, 10);
}

export const MOCK_SCHOLARSHIPS: Scholarship[] = [
  // ── GROUP 1: DIRECT APPLY — fast, public, button goes straight to the form ──
  {
    id: "sch_sallie_monthly",
    name: "Sallie $2,000 Monthly Scholarship",
    provider: "Sallie Mae",
    amount: 2000,
    deadline: deadlineInDays(30),
    description:
      "No-essay sweepstakes-style award for college students, drawn monthly. Takes about a minute to enter — a genuine quick win.",
    requiresEssay: false,
    renewable: false,
    competitiveness: "low",
    actionType: "direct_apply",
    applyUrl: "https://www.sallie.com/scholarships",
    actionNote: "Pure quick win — no essay, re-enter every month.",
    steps: [
      "Create a free Sallie account (email + password).",
      "Confirm you're a current or incoming college student.",
      "Submit the entry — there's no essay or transcript.",
      "Set a phone reminder to re-enter next month; each month is a new drawing.",
    ],
    url: "https://www.sallie.com/scholarships",
  },
  {
    id: "sch_s360_no_essay",
    name: "Scholarships360 $10,000 No-Essay Scholarship",
    provider: "Scholarships360",
    amount: 10000,
    deadline: "2026-06-30",
    description:
      "Open to high school, college, and graduate students. Rolling monthly deadlines; applying earlier improves your odds.",
    requiresEssay: false,
    competitiveness: "low",
    actionType: "direct_apply",
    applyUrl: "https://scholarships360.org/scholarships/",
    actionNote: "Apply early in the cycle — earlier entries have better odds.",
    steps: [
      "Make a free Scholarships360 account.",
      "Fill in basic profile info (school, year, major).",
      "Submit the no-essay entry.",
      "While you're there, save 3–5 other matches it surfaces for later.",
    ],
    url: "https://scholarships360.org/scholarships/summer-scholarships/",
  },
  {
    id: "sch_bold_no_essay",
    name: "Bold.org \"Be Bold\" No-Essay Scholarship",
    provider: "Bold.org",
    amount: 25000,
    deadline: deadlineInDays(25),
    description:
      "A large no-essay award open to essentially all students. Bold.org also hosts hundreds of smaller exclusive scholarships you can apply to from the same profile.",
    requiresEssay: false,
    competitiveness: "medium",
    actionType: "direct_apply",
    applyUrl: "https://bold.org/scholarships/",
    actionNote: "One profile unlocks hundreds of other Bold.org scholarships.",
    steps: [
      "Sign up for a free Bold.org account.",
      "Build out your profile once — it auto-fills future applications.",
      "Apply to the Be Bold no-essay award.",
      "Filter by your major (e.g. Computer Science) and apply to 5+ more before you log off.",
    ],
    url: "https://bold.org/scholarships/by-year/college/freshmen/",
  },
  {
    id: "sch_unigo_laugh",
    name: "Unigo \"Make Me Laugh\" Scholarship",
    provider: "Unigo",
    amount: 1500,
    deadline: "2026-08-31",
    description:
      "A short, personality-driven prompt instead of a formal essay — rewards wit over polish. A smart late-summer pick.",
    requiresEssay: false,
    competitiveness: "low",
    interestTags: ["writing", "humor", "creativity"],
    actionType: "direct_apply",
    applyUrl: "https://www.unigo.com/scholarships/our-scholarships/make-me-laugh-scholarship",
    actionNote: "Short funny answer, not a 500-word essay.",
    steps: [
      "Open a free Unigo account.",
      "Read the prompt — it asks for something funny in a few sentences.",
      "Draft 2–3 versions, pick the one that actually made you laugh.",
      "Paste it in and submit before the August 31 deadline.",
    ],
    url: "https://www.unigo.com/scholarships/our-scholarships/make-me-laugh-scholarship",
  },
  {
    id: "sch_ascent",
    name: "Ascent $2,500 Scholarship Giveaway",
    provider: "Ascent Funding",
    amount: 2500,
    deadline: "2026-09-25",
    description:
      "A no-essay award aimed at students and families showing school spirit and community involvement.",
    requiresEssay: false,
    competitiveness: "low",
    interestTags: ["community", "school spirit"],
    actionType: "direct_apply",
    applyUrl: "https://www.ascentfunding.com/scholarships/",
    actionNote: "No essay — registration-style entry.",
    steps: [
      "Go to the Ascent scholarships page and start the entry.",
      "Enter your contact and school details.",
      "Submit before the September 25 deadline.",
      "Add the deadline to your calendar in case you want to re-enter next cycle.",
    ],
    url: "https://www.ascentfunding.com/scholarships/",
  },
  {
    id: "sch_bold_stem",
    name: "Bold.org STEM & Computer Science Scholarships",
    provider: "Bold.org (multiple donors)",
    amount: 5000,
    deadline: deadlineInDays(45),
    description:
      "A whole category of exclusive awards for students in computer science, engineering, and the sciences. Many require no essay.",
    minGpa: 3.0,
    majors: ["Computer Science", "Software Engineering", "Engineering", "Data Science", "Information Technology", "Physics", "Mathematics"],
    interestTags: ["coding", "technology", "software", "data", "ai", "science", "math", "robotics"],
    activityTags: ["coding club", "hackathon", "robotics club", "app development"],
    requiresEssay: false,
    renewable: false,
    competitiveness: "medium",
    actionType: "direct_apply",
    applyUrl: "https://bold.org/scholarships/",
    actionNote: "Filter to your exact major and stack several in one sitting.",
    steps: [
      "Sign in to Bold.org (same account as the Be Bold award).",
      "Filter scholarships by major: Computer Science / Engineering.",
      "Sort by soonest deadline.",
      "Apply to every no-essay match first, then the short-essay ones.",
    ],
    url: "https://bold.org/scholarships/",
  },

  // ── GROUP 2: SCHOOL PORTAL — login-gated, button opens it, steps guide inside ─
  {
    id: "sch_pitt_fundsme",
    name: "PittFund$Me — University of Pittsburgh",
    provider: "University of Pittsburgh",
    amount: 5000,
    deadline: deadlineInDays(60),
    description:
      "Pitt's internal scholarship database — departmental and donor awards you can only reach once you're an admitted/enrolled student. This is where renewable, school-specific money lives.",
    requiresEssay: false,
    renewable: true,
    competitiveness: "medium",
    actionType: "portal",
    applyUrl: "https://financialaid.pitt.edu/types-of-aid/scholarships/",
    actionNote: "Not a single scholarship — a database you log into and search.",
    steps: [
      "Log in to PittFund$Me with your Pitt account (you'll have this once enrolled).",
      "Fill out the general application once — it auto-matches you to many awards.",
      "Open each match it surfaces and submit that award's own short application.",
      "Set a yearly reminder to come back and re-apply — this money renews.",
    ],
    url: "https://financialaid.pitt.edu/types-of-aid/scholarships/",
  },
  {
    id: "sch_gnof",
    name: "Greater New Orleans Foundation Scholarships",
    provider: "Greater New Orleans Foundation (GNOF)",
    amount: 4000,
    deadline: deadlineInDays(40),
    description:
      "Place-based awards for students who attended high school in the Greater New Orleans region. Small applicant pools mean strong odds — usable at out-of-state schools.",
    eligibleStates: ["LA"],
    requiresEssay: true,
    essayPrompt:
      "Varies by fund — most ask about your background, community, and goals.",
    essayThemes: ["community", "new orleans", "identity", "goals", "service"],
    competitiveness: "low",
    actionType: "portal",
    applyUrl: "https://www.gnof.org/nonprofits/grants/scholarships/",
    actionNote: "Several funds; each has its own criteria — apply to every one you fit.",
    steps: [
      "Scan the list of currently open funds on the page.",
      "Flag the ones you fit — NOLA high-school grad, your major, your background.",
      "Write one base essay about your community and goals you can adapt per fund.",
      "Apply to every fund you qualify for; email roy@gnof.org if you're unsure.",
    ],
    url: "https://www.gnof.org/nonprofits/grants/scholarships/",
  },

  // ── GROUP 3: OFFICIAL PROCESS — no single button; the walkthrough IS the help ─
  {
    id: "aid_fafsa",
    name: "FAFSA — Federal Student Aid",
    provider: "U.S. Department of Education",
    amount: 0,
    amountVaries: true,
    deadline: deadlineInDays(21),
    description:
      "Not a scholarship — the federal form that unlocks grants, work-study, and most school need-based aid. Usually the single biggest source of money, and Pitt's need-based aid depends on it.",
    requiresEssay: false,
    competitiveness: "low",
    actionType: "process",
    applyUrl: "https://studentaid.gov/h/apply-for-aid/fafsa",
    actionNote: "Do this first — it's the gate to the largest pools of money.",
    steps: [
      "Create an FSA ID at studentaid.gov (both you and a parent, if dependent).",
      "Gather tax info and Social Security numbers before you start.",
      "Complete the FAFSA and list Pitt — federal school code 008815.",
      "Submit, then watch your Pitt email for the aid offer that follows.",
    ],
    url: "https://studentaid.gov/h/apply-for-aid/fafsa",
  },
  {
    id: "aid_tops",
    name: "Louisiana TOPS",
    provider: "LA Office of Student Financial Assistance (LOSFA)",
    amount: 0,
    amountVaries: true,
    deadline: "2026-07-01",
    description:
      "Louisiana's state award. IMPORTANT: TOPS only pays at in-state Louisiana colleges — it pays $0 at an out-of-state school like Pitt. Worth understanding so you don't count on money that won't come.",
    eligibleStates: ["LA"],
    requiresEssay: false,
    competitiveness: "low",
    actionType: "process",
    applyUrl: "https://mylosfa.la.gov/students-parents/scholarships-grants/tops",
    actionNote:
      "Heads up: pays in-state LA only — $0 at Pitt. Keep it alive in case you ever transfer home.",
    steps: [
      "Know the rule: TOPS funds in-state LA schools only, so it won't pay at Pitt.",
      "Still complete the FAFSA by July 1 to establish eligibility.",
      "If you ever transfer to an eligible Louisiana school, file the \"Application to Return from an Out-of-State College\" to claim it.",
      "Otherwise, focus your energy on the direct-apply and portal awards above.",
    ],
    url: "https://mylosfa.la.gov/students-parents/scholarships-grants/tops",
  },
];
