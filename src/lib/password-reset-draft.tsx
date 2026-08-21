"use client";

import { useRouter } from "next/navigation";
import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

// Carries the password-reset wizard's email + one-time resetToken across route hops
// (/login/reset/email → /login/reset/code → /login/reset/password) — same reasoning as
// signup-draft.tsx (in-memory Context, not sessionStorage — see that file), kept as a
// separate provider since the two wizards can be mid-flight at once.
type PasswordResetDraft = { email?: string; resetToken?: string };

type PasswordResetDraftContextValue = {
  draft: PasswordResetDraft;
  save: (patch: PasswordResetDraft) => void;
  clear: () => void;
};

const PasswordResetDraftContext = createContext<PasswordResetDraftContextValue | null>(null);

export function PasswordResetDraftProvider({ children }: { children: ReactNode }) {
  const [draft, setDraft] = useState<PasswordResetDraft>({});
  const value: PasswordResetDraftContextValue = {
    draft,
    save: (patch) => setDraft((prev) => ({ ...prev, ...patch })),
    clear: () => setDraft({}),
  };
  return <PasswordResetDraftContext.Provider value={value}>{children}</PasswordResetDraftContext.Provider>;
}

export function useResetDraft(): PasswordResetDraftContextValue {
  const context = useContext(PasswordResetDraftContext);
  if (!context) throw new Error("useResetDraft must be used within src/app/login/layout.tsx");
  return context;
}

// Same reasoning as useRequiredSignupDraft (signup-draft.tsx) — redirects to
// /login/reset/email and renders nothing until the requested keys are present.
export function useRequiredResetDraft<K extends keyof PasswordResetDraft>(
  ...keys: K[]
): Required<Pick<PasswordResetDraft, K>> | null {
  const { draft } = useResetDraft();
  const router = useRouter();
  const ready = keys.every((key) => Boolean(draft[key]));

  useEffect(() => {
    if (!ready) router.replace("/login/reset/email");
  }, [ready, router]);

  return ready ? (draft as Required<Pick<PasswordResetDraft, K>>) : null;
}
