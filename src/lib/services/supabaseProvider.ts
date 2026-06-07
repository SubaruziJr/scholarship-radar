import { Application, Scholarship, StudentProfile } from "@/lib/types";
import { DataProvider } from "@/lib/services/provider";

// ─────────────────────────────────────────────────────────────────────────────
// Supabase provider (STUB)
//
// This is intentionally not wired up yet. When you're ready:
//
//   1. npm install @supabase/supabase-js @supabase/ssr
//   2. Set NEXT_PUBLIC_SUPABASE_URL + NEXT_PUBLIC_SUPABASE_ANON_KEY in .env.local
//   3. Run the SQL below in the Supabase SQL editor
//   4. Fill in the method bodies and set NEXT_PUBLIC_DATA_PROVIDER=supabase
//
// Because this class implements the same DataProvider interface as MockProvider,
// no UI/component code needs to change.
//
// ── Suggested schema ─────────────────────────────────────────────────────────
//
//   create table profiles (
//     id uuid primary key references auth.users on delete cascade,
//     name text,
//     gpa numeric,
//     state text,
//     intended_college text,
//     major text,
//     interests text[],
//     activities text[],
//     job_experience text,
//     financial_need text check (financial_need in ('none','low','moderate','high')),
//     graduation_year int,
//     updated_at timestamptz default now()
//   );
//
//   create table scholarships (
//     id text primary key,
//     name text not null,
//     provider text,
//     amount int,
//     deadline date,
//     description text,
//     url text,
//     min_gpa numeric,
//     eligible_states text[],
//     majors text[],
//     interest_tags text[],
//     activity_tags text[],
//     financial_need_required text,
//     requires_essay boolean default false,
//     essay_prompt text,
//     essay_themes text[],
//     renewable boolean,
//     competitiveness text
//   );
//
//   create table applications (
//     user_id uuid references auth.users on delete cascade,
//     scholarship_id text references scholarships(id),
//     status text default 'not_started',
//     notes text,
//     updated_at timestamptz default now(),
//     primary key (user_id, scholarship_id)
//   );
//
//   -- Enable RLS and add owner policies on profiles + applications.
// ─────────────────────────────────────────────────────────────────────────────

const NOT_IMPLEMENTED =
  "SupabaseProvider is not implemented yet. See src/lib/services/supabaseProvider.ts " +
  "for the schema + steps, then set NEXT_PUBLIC_DATA_PROVIDER=mock to keep using mock data for now.";

export class SupabaseProvider implements DataProvider {
  // Example of how you'd create the client (uncomment after installing the SDK):
  //
  // import { createBrowserClient } from "@supabase/ssr";
  // private supabase = createBrowserClient(
  //   process.env.NEXT_PUBLIC_SUPABASE_URL!,
  //   process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  // );

  async listScholarships(): Promise<Scholarship[]> {
    // const { data, error } = await this.supabase.from("scholarships").select("*");
    // if (error) throw error;
    // return data.map(rowToScholarship);
    throw new Error(NOT_IMPLEMENTED);
  }

  async getProfile(): Promise<StudentProfile | null> {
    throw new Error(NOT_IMPLEMENTED);
  }

  async saveProfile(_profile: StudentProfile): Promise<void> {
    throw new Error(NOT_IMPLEMENTED);
  }

  async listApplications(): Promise<Application[]> {
    throw new Error(NOT_IMPLEMENTED);
  }

  async upsertApplication(_application: Application): Promise<void> {
    throw new Error(NOT_IMPLEMENTED);
  }
}
