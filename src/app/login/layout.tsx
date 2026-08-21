import type { ReactNode } from "react";
import { PasswordResetDraftProvider } from "@/lib/password-reset-draft";
import { SignupDraftProvider } from "@/lib/signup-draft";

// Wraps every /login/* route. Next doesn't remount a layout when navigating between its
// child routes, so the draft Context providers here survive /login/email → /login/code →
// ... route hops the same way sessionStorage used to — see signup-draft.tsx for why we
// moved off Web Storage.
export default function LoginLayout({ children }: { children: ReactNode }) {
  return (
    <SignupDraftProvider>
      <PasswordResetDraftProvider>{children}</PasswordResetDraftProvider>
    </SignupDraftProvider>
  );
}
