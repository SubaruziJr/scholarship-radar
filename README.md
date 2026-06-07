# ScholarshipRadar 🛰️

Find, match, and track scholarships — built for high school seniors.

A Next.js (App Router + TypeScript + Tailwind) app that scores scholarships
against a student profile, tracks deadlines and application status, and suggests
which scholarship prompts an existing essay could be reused for.

Runs entirely on **mock data** today, with clean seams to drop in **Supabase**
(data + auth) and **Stripe** (a Pro tier) later — no UI rewrites required.

---

## Quick start

```bash
npm install
cp .env.local.example .env.local   # defaults to mock mode
npm run dev
```

Open http://localhost:3000. The app seeds a sample profile on first run so the
dashboard isn't empty — edit it on the **Profile** page.

---

## Features

1. **Student profile** (`/profile`) — GPA, state, intended college, major,
   interests, activities, job experience, and financial-need level. Saved to
   `localStorage` in mock mode.
2. **Scholarship database** (`/scholarships`) — sample scholarships with search,
   sort (match / deadline / amount), and eligibility/essay filters.
3. **Matching algorithm** (`src/lib/matching.ts`) — a transparent weighted
   0–100 score with GPA/state eligibility gates and per-factor "why it matched"
   reasons.
4. **Dashboard** (`/`) — best matches, potential award total, upcoming
   deadlines, and an application-status tracker.
5. **Essay reuse tool** (`/essay-tool`) — paste an essay/topic and get ranked
   scholarship prompts it could fit, with overlapping themes.
6. Clean, mobile-first UI (top nav on desktop, bottom tab bar on mobile).
7. Mock data only — no external API calls.
8. Structured for Supabase + Stripe (see below).

---

## Project structure

```
scholarship-radar/
├── src/
│   ├── app/
│   │   ├── layout.tsx              # fonts, nav, store provider
│   │   ├── page.tsx                # Dashboard (home)
│   │   ├── globals.css
│   │   ├── profile/page.tsx        # Profile form
│   │   ├── scholarships/page.tsx   # Database + filters
│   │   ├── essay-tool/page.tsx     # Essay reuse finder
│   │   ├── dashboard/page.tsx      # → redirects to /
│   │   └── api/checkout/route.ts   # Stripe checkout (stub)
│   ├── components/
│   │   ├── Nav.tsx
│   │   ├── ScholarshipCard.tsx
│   │   ├── StatusSelect.tsx
│   │   └── ui/                     # Button, Badge, Card, MatchRing, TagInput, RadarLogo
│   └── lib/
│       ├── types.ts               # Domain types (≈ future DB columns)
│       ├── matching.ts            # Scoring algorithm
│       ├── essayMatch.ts          # Essay → prompt matcher
│       ├── format.ts              # Currency / date / status helpers
│       ├── context/StoreContext.tsx
│       ├── data/                  # Mock scholarships + sample profile
│       ├── services/              # DataProvider interface + mock/supabase impls
│       └── stripe/stripe.ts       # Pro plan + checkout helper (stub)
├── tailwind.config.ts
├── .env.local.example
└── package.json
```

---

## How the matching works

`scoreScholarship(profile, scholarship)` returns `{ score, eligible, reasons }`.
The score is a weighted sum (weights live at the top of `src/lib/matching.ts`):

| Factor             | Weight | Notes                                            |
| ------------------ | ------ | ------------------------------------------------ |
| GPA                | 25     | Hard gate — below minimum caps the score & flags ineligible |
| State              | 15     | Hard gate — restricted states cap the score      |
| Major              | 20     | Exact/partial major match                        |
| Interests          | 15     | Tag-overlap ratio                                |
| Activities         | 10     | Tag-overlap ratio                                |
| Financial need     | 10     | Meets the award's targeted need level            |
| Winnability bonus  | 5      | Boost for low-competitiveness awards             |

Tune the weights in one place; the dashboard, scholarships page, and essay tool
all reflect changes automatically.

---

## Migrating to Supabase

Everything reads/writes through the `DataProvider` interface
(`src/lib/services/provider.ts`), so the UI never touches the backend directly.

1. `npm install @supabase/supabase-js @supabase/ssr`
2. Add `NEXT_PUBLIC_SUPABASE_URL` + `NEXT_PUBLIC_SUPABASE_ANON_KEY` to `.env.local`
3. Run the SQL schema in `src/lib/services/supabaseProvider.ts` (it's in a comment)
4. Implement the method bodies in `SupabaseProvider`
5. Set `NEXT_PUBLIC_DATA_PROVIDER=supabase`

No component code changes.

---

## Enabling Stripe (Pro tier)

The "Upgrade to Pro" card on the dashboard already calls `startProCheckout()`,
which posts to `/api/checkout`. Both are stubbed.

1. `npm install stripe @stripe/stripe-js`
2. Add `STRIPE_SECRET_KEY`, `STRIPE_PRICE_ID_PRO`, `NEXT_PUBLIC_APP_URL` to `.env.local`
3. Implement `src/app/api/checkout/route.ts` (Stripe session creation is sketched
   in a comment there)
4. Add a `/api/webhooks/stripe` route to mark accounts as Pro

---

## Notes

- All data is **sample/mock**. Scholarship URLs point to `example.org`.
- Profile + application status persist in `localStorage` per device in mock mode.
- Fonts: Fraunces (display) + Hanken Grotesk (body), loaded via `next/font`.
