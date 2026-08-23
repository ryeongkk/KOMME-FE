"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { CodeScreen } from "@/components/login/code-screen";
import { EmailScreen } from "@/components/login/email-screen";
import { PasswordScreen } from "@/components/login/password-screen";
import {
  confirmPasswordResetVerification,
  resetPassword,
  sendPasswordResetVerification,
} from "@/lib/api/auth";

// Password-reset wizard orchestrator — same single-route + step pattern as
// /login/email/page.tsx (signup), kept as a separate route since the two wizards can be
// mid-flight at once. `resetToken` is a bearer credential (resets the password without the
// old one) so, like signup's password, it only ever lives in this component's state.
const STEPS = ["email", "code", "password"] as const;
type Step = (typeof STEPS)[number];

export default function ResetEmailPage() {
  const router = useRouter();
  const [step, setStep] = useState<Step>("email");
  const [email, setEmail] = useState("");
  const [resetToken, setResetToken] = useState("");

  const handleBack = () => {
    const index = STEPS.indexOf(step);
    if (index > 0) setStep(STEPS[index - 1]);
    else router.back();
  };

  return (
    <main className="flex flex-1 flex-col items-center bg-white px-4 pb-10">
      {step === "email" && (
        <EmailScreen
          headerTitle="Reset Password"
          heading="Enter your email address to reset the password"
          onBack={handleBack}
          onSubmit={async (value) => {
            await sendPasswordResetVerification(value);
            setEmail(value);
          }}
          onNext={() => setStep("code")}
        />
      )}
      {step === "code" && (
        <CodeScreen
          headerTitle="Reset Password"
          email={email}
          onBack={handleBack}
          onConfirm={async (confirmEmail, code) => {
            const { resetToken: token } = await confirmPasswordResetVerification(confirmEmail, code);
            setResetToken(token);
          }}
          onResend={sendPasswordResetVerification}
          onNext={() => setStep("password")}
        />
      )}
      {step === "password" && (
        <PasswordScreen
          headerTitle="Reset Password"
          heading="Enter your new password"
          onBack={handleBack}
          onSubmit={async (password) => {
            await resetPassword(resetToken, password);
          }}
          onNext={() => router.replace("/login")}
        />
      )}
    </main>
  );
}
