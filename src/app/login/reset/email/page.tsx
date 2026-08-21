"use client";

import { EmailScreen } from "@/components/login/email-screen";
import { sendPasswordResetVerification } from "@/lib/api/auth";
import { useResetDraft } from "@/lib/password-reset-draft";

export default function ResetEmailPage() {
  const { save, clear } = useResetDraft();
  return (
    <main className="flex flex-1 flex-col items-center bg-white px-4 pb-10">
      <EmailScreen
        headerTitle="Reset Password"
        heading="Enter your email address to reset the password"
        nextPath="/login/reset/code"
        onSubmit={async (email) => {
          await sendPasswordResetVerification(email);
          // Same reasoning as /login/email: start a fresh draft so a stale resetToken
          // from an earlier abandoned reset never rides along with a new email.
          clear();
          save({ email });
        }}
      />
    </main>
  );
}
