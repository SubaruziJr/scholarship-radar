import { MOCK_SCHOLARSHIPS } from "@/lib/data/scholarships";
import { SAMPLE_PROFILE } from "@/lib/data/profile";
import { Application, Scholarship, StudentProfile } from "@/lib/types";
import { DataProvider } from "@/lib/services/provider";

// ─────────────────────────────────────────────────────────────────────────────
// Mock provider: serves bundled sample scholarships and persists the student's
// profile + applications to localStorage. Async signatures match the real
// provider so swapping in Supabase requires no call-site changes.
// ─────────────────────────────────────────────────────────────────────────────

const PROFILE_KEY = "sr:profile";
const APPS_KEY = "sr:applications";

const isBrowser = () => typeof window !== "undefined";

// Whether to pre-fill the sample profile ("Jordan Rivera") on a first, fresh run.
//   • Local development (npm run dev) → yes, so you immediately see a populated
//     dashboard while testing.
//   • The real, deployed app (production build) → no, so actual users land on a
//     clean slate and enter their own details.
// You can force it either way regardless of environment by setting
// NEXT_PUBLIC_SEED_SAMPLE to "true" or "false" in .env.local.
function shouldSeedSample(): boolean {
  const flag = process.env.NEXT_PUBLIC_SEED_SAMPLE;
  if (flag === "true") return true;
  if (flag === "false") return false;
  return process.env.NODE_ENV === "development";
}

function readJSON<T>(key: string): T | null {
  if (!isBrowser()) return null;
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : null;
  } catch {
    return null;
  }
}

function writeJSON(key: string, value: unknown): void {
  if (!isBrowser()) return;
  window.localStorage.setItem(key, JSON.stringify(value));
}

export class MockProvider implements DataProvider {
  async listScholarships(): Promise<Scholarship[]> {
    // simulate a tiny bit of latency so loading states are exercised
    await delay(120);
    return MOCK_SCHOLARSHIPS;
  }

  async getProfile(): Promise<StudentProfile | null> {
    await delay(60);
    const existing = readJSON<StudentProfile>(PROFILE_KEY);
    if (existing) return existing;
    // First run: seed the sample only when enabled (dev by default); otherwise
    // return null so the app shows its blank "set up your profile" state.
    if (shouldSeedSample()) {
      writeJSON(PROFILE_KEY, SAMPLE_PROFILE);
      return SAMPLE_PROFILE;
    }
    return null;
  }

  async saveProfile(profile: StudentProfile): Promise<void> {
    await delay(60);
    writeJSON(PROFILE_KEY, profile);
  }

  async listApplications(): Promise<Application[]> {
    await delay(60);
    return readJSON<Application[]>(APPS_KEY) ?? [];
  }

  async upsertApplication(application: Application): Promise<void> {
    await delay(60);
    const apps = readJSON<Application[]>(APPS_KEY) ?? [];
    const idx = apps.findIndex((a) => a.scholarshipId === application.scholarshipId);
    if (idx >= 0) apps[idx] = application;
    else apps.push(application);
    writeJSON(APPS_KEY, apps);
  }
}

function delay(ms: number): Promise<void> {
  return new Promise((res) => setTimeout(res, ms));
}
