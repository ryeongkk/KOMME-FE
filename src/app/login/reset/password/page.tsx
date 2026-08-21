"use client";

import { PasswordScreen } from "@/components/login/password-screen";
import { resetPassword } from "@/lib/api/auth";
import { useRequiredResetDraft, useResetDraft } from "@/lib/password-reset-draft";

export default function ResetPasswordPage() {
  const { clear } = useResetDraft();
  const draft = useRequiredResetDraft("resetToken");
  if (!draft) return null;

  return (
    <main className="flex flex-1 flex-col items-center bg-white px-4 pb-10">
      <PasswordScreen
        headerTitle="Reset Password"
        heading="Enter your new password"
        nextPath="/login"
        onSubmit={async (password) => {
          await resetPassword(draft.resetToken, password);
          clear();
        }}
      />
    </main>
  );
}
