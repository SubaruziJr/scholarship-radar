"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  Application,
  ApplicationStatus,
  Scholarship,
  StudentProfile,
} from "@/lib/types";
import { getDataProvider } from "@/lib/services";

interface StoreValue {
  loading: boolean;
  profile: StudentProfile | null;
  scholarships: Scholarship[];
  applications: Application[];
  saveProfile: (profile: StudentProfile) => Promise<void>;
  setStatus: (scholarshipId: string, status: ApplicationStatus) => Promise<void>;
  getStatus: (scholarshipId: string) => ApplicationStatus;
}

const StoreContext = createContext<StoreValue | null>(null);

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const provider = useMemo(() => getDataProvider(), []);
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<StudentProfile | null>(null);
  const [scholarships, setScholarships] = useState<Scholarship[]>([]);
  const [applications, setApplications] = useState<Application[]>([]);

  useEffect(() => {
    let active = true;
    (async () => {
      const [p, s, a] = await Promise.all([
        provider.getProfile(),
        provider.listScholarships(),
        provider.listApplications(),
      ]);
      if (!active) return;
      setProfile(p);
      setScholarships(s);
      setApplications(a);
      setLoading(false);
    })();
    return () => {
      active = false;
    };
  }, [provider]);

  const saveProfile = useCallback(
    async (next: StudentProfile) => {
      setProfile(next); // optimistic
      await provider.saveProfile(next);
    },
    [provider]
  );

  const setStatus = useCallback(
    async (scholarshipId: string, status: ApplicationStatus) => {
      const next: Application = {
        scholarshipId,
        status,
        updatedAt: new Date().toISOString(),
      };
      setApplications((prev) => {
        const idx = prev.findIndex((x) => x.scholarshipId === scholarshipId);
        if (idx >= 0) {
          const copy = [...prev];
          copy[idx] = { ...copy[idx], ...next };
          return copy;
        }
        return [...prev, next];
      });
      await provider.upsertApplication(next);
    },
    [provider]
  );

  const getStatus = useCallback(
    (scholarshipId: string): ApplicationStatus =>
      applications.find((a) => a.scholarshipId === scholarshipId)?.status ??
      "not_started",
    [applications]
  );

  const value: StoreValue = {
    loading,
    profile,
    scholarships,
    applications,
    saveProfile,
    setStatus,
    getStatus,
  };

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore(): StoreValue {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error("useStore must be used within <StoreProvider>");
  return ctx;
}
