"use client";

import { Suspense } from "react";
import { CodeScreen } from "@/components/login/code-screen";
import { confirmPasswordResetVerification, sendPasswordResetVerification } from "@/lib/api/auth";
import { savePasswordResetDraft } from "@/lib/password-reset-draft";

export default function ResetCodePage() {
  return (
    <main className="flex flex-1 flex-col items-center bg-white px-4 pb-10">
      <Suspense>
        <CodeScreen
          headerTitle="Reset Password"
          nextPath="/login/reset/password"
          onConfirm={async (email, code) => {
            const { resetToken } = await confirmPasswordResetVerification(email, code);
            savePasswordResetDraft({ resetToken });
          }}
          onResend={sendPasswordResetVerification}
        />
      </Suspense>
    </main>
  );
}
