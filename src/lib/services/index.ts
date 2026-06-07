import { DataProvider } from "@/lib/services/provider";
import { MockProvider } from "@/lib/services/mockProvider";
import { SupabaseProvider } from "@/lib/services/supabaseProvider";

// ─────────────────────────────────────────────────────────────────────────────
// Single source of truth for which data backend the app uses.
// Flip NEXT_PUBLIC_DATA_PROVIDER in .env.local to switch — nothing else changes.
// ─────────────────────────────────────────────────────────────────────────────

let provider: DataProvider | null = null;

export function getDataProvider(): DataProvider {
  if (provider) return provider;

  const which = process.env.NEXT_PUBLIC_DATA_PROVIDER ?? "mock";
  provider = which === "supabase" ? new SupabaseProvider() : new MockProvider();
  return provider;
}

export type { DataProvider };
