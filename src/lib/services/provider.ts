import { Application, Scholarship, StudentProfile } from "@/lib/types";

// ─────────────────────────────────────────────────────────────────────────────
// The DataProvider contract.
//
// Everything in the UI talks to a DataProvider, never to mock data or Supabase
// directly. To migrate, you implement this same interface against Supabase and
// flip NEXT_PUBLIC_DATA_PROVIDER=supabase — no component code changes.
// ─────────────────────────────────────────────────────────────────────────────

export interface DataProvider {
  listScholarships(): Promise<Scholarship[]>;

  getProfile(): Promise<StudentProfile | null>;
  saveProfile(profile: StudentProfile): Promise<void>;

  listApplications(): Promise<Application[]>;
  upsertApplication(application: Application): Promise<void>;
}
