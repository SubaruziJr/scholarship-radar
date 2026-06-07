import { NextResponse } from "next/server";

// ─────────────────────────────────────────────────────────────────────────────
// POST /api/checkout  (STUB)
//
// When you enable billing:
//   import Stripe from "stripe";
//   const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
//
//   const session = await stripe.checkout.sessions.create({
//     mode: "subscription",
//     line_items: [{ price: process.env.STRIPE_PRICE_ID_PRO!, quantity: 1 }],
//     success_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?upgraded=1`,
//     cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard`,
//   });
//   return NextResponse.json({ url: session.url });
//
// You'll also want a /api/webhooks/stripe route to mark the user as Pro.
// ─────────────────────────────────────────────────────────────────────────────

export async function POST() {
  return NextResponse.json(
    {
      error:
        "Billing isn't enabled yet. Add your Stripe keys and implement src/app/api/checkout/route.ts.",
    },
    { status: 501 }
  );
}
