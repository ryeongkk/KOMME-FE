"use client";

import { PasswordScreen } from "@/components/login/password-screen";
import { resetPassword } from "@/lib/api/auth";
import { SessionExpiredError } from "@/lib/api/auth-error-messages";
import { clearPasswordResetDraft, readPasswordResetDraft } from "@/lib/password-reset-draft";

export default function ResetPasswordPage() {
  return (
    <main className="flex flex-1 flex-col items-center bg-white px-4 pb-10">
      <PasswordScreen
        headerTitle="Reset Password"
        heading="Enter your new password"
        nextPath="/login"
        onSubmit={async (password) => {
          const { resetToken } = readPasswordResetDraft();
          if (!resetToken) {
            throw new SessionExpiredError("Reset session expired — please start over from the email step.");
          }
          await resetPassword(resetToken, password);
          clearPasswordResetDraft();
        }}
      />
    </main>
  );
}
