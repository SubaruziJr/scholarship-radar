import { StudentProfile } from "@/lib/types";

export function emptyProfile(): StudentProfile {
  return {
    id: "local-student",
    name: "",
    gpa: 3.0,
    state: "",
    intendedCollege: "",
    major: "",
    interests: [],
    activities: [],
    jobExperience: "",
    financialNeed: "moderate",
    graduationYear: new Date().getFullYear(),
  };
}

// Used to pre-fill the app on first run so the dashboard isn't empty.
// Remove or replace once real auth + persistence is in place.
export const SAMPLE_PROFILE: StudentProfile = {
  id: "local-student",
  name: "Jordan Rivera",
  gpa: 3.6,
  state: "LA",
  intendedCollege: "Louisiana State University",
  major: "Computer Science",
  interests: ["coding", "robotics", "community", "music"],
  activities: ["robotics club", "volunteering", "part-time job"],
  jobExperience: "Weekend barista at a local coffee shop for 18 months; trained two new hires.",
  financialNeed: "moderate",
  graduationYear: new Date().getFullYear(),
};
