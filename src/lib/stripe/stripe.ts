// ─────────────────────────────────────────────────────────────────────────────
// Stripe (STUB) — client side
//
// ScholarshipRadar is free with mock data today. This is the seam for a future
// "Pro" tier (e.g. unlimited essay matching, deadline reminders, export).
//
// To enable later:
//   1. npm install stripe @stripe/stripe-js
//   2. Fill STRIPE_* keys in .env.local
//   3. Implement src/app/api/checkout/route.ts (server)
//   4. Call startProCheckout() from an "Upgrade" button
// ─────────────────────────────────────────────────────────────────────────────

export const PRO_PLAN = {
  name: "ScholarshipRadar Pro",
  priceLabel: "$4 / mo",
  features: [
    "Unlimited essay-reuse matching",
    "Email + SMS deadline reminders",
    "Export your tracker to PDF / CSV",
    "Priority new-scholarship alerts",
  ],
};

/**
 * Kicks off Stripe Checkout. Currently a stub: it hits the (also stubbed)
 * /api/checkout route and would redirect to the returned Checkout URL.
 */
export async function startProCheckout(): Promise<void> {
  const res = await fetch("/api/checkout", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ plan: "pro" }),
  });

  if (!res.ok) {
    const { error } = await res.json().catch(() => ({ error: "Checkout unavailable" }));
    throw new Error(error ?? "Checkout unavailable");
  }

  const { url } = await res.json();
  if (url) {
    window.location.href = url; // redirect to Stripe Checkout
  }
}
