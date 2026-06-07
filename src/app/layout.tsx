import type { Metadata } from "next";
import { Fraunces, Hanken_Grotesk } from "next/font/google";
import "./globals.css";
import { Nav } from "@/components/Nav";
import { StoreProvider } from "@/lib/context/StoreContext";

const display = Fraunces({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
});

const body = Hanken_Grotesk({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
});

export const metadata: Metadata = {
  title: "ScholarshipRadar — find & track scholarships",
  description:
    "Match with scholarships, track deadlines and applications, and reuse your essays. Built for high school seniors.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${display.variable} ${body.variable}`}>
      <body className="font-body antialiased">
        <StoreProvider>
          <Nav />
          <main className="container-app py-6 pb-28 sm:py-10 sm:pb-10">
            {children}
          </main>
          <footer className="container-app hidden border-t border-line py-8 text-center text-xs text-ink-faint sm:block">
            ScholarshipRadar · sample data · built with Next.js — ready for
            Supabase &amp; Stripe
          </footer>
        </StoreProvider>
      </body>
    </html>
  );
}
