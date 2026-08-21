"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { CodeScreen } from "@/components/login/code-screen";
import { confirmPasswordResetVerification, sendPasswordResetVerification } from "@/lib/api/auth";
import { useResetDraft } from "@/lib/password-reset-draft";

export default function ResetCodePage() {
  const { draft, save } = useResetDraft();
  const router = useRouter();

  // Same reasoning as /login/code: don't let a lost draft submit an empty email.
  useEffect(() => {
    if (!draft.email) router.replace("/login/reset/email");
  }, [draft.email, router]);

  if (!draft.email) return null;

  return (
    <main className="flex flex-1 flex-col items-center bg-white px-4 pb-10">
      <CodeScreen
        headerTitle="Reset Password"
        email={draft.email}
        nextPath="/login/reset/password"
        onConfirm={async (email, code) => {
          const { resetToken } = await confirmPasswordResetVerification(email, code);
          save({ resetToken });
        }}
        onResend={sendPasswordResetVerification}
      />
    </main>
  );
}
