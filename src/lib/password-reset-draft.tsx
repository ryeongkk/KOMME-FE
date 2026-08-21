"use client";

import { createContext, useContext, useState, type ReactNode } from "react";

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
