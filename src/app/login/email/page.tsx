"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { CodeScreen } from "@/components/login/code-screen";
import { EmailScreen } from "@/components/login/email-screen";
import { NicknameScreen } from "@/components/login/nickname-screen";
import { PasswordScreen } from "@/components/login/password-screen";
import { confirmEmailVerification, sendEmailVerification, signup } from "@/lib/api/auth";

// Signup wizard orchestrator (Figma: /login/terms → this route's 4 screens → /login).
// Single route + internal step state, same pattern as course/course-create-screen.tsx —
// owns email/password across the whole wizard as plain useState (never touches Web
// Storage; see components/AGENTS.md for why that matters for `password`). A reload just
// resets to the first step, which is simpler and safer than trying to survive one.
const STEPS = ["email", "code", "password", "nickname"] as const;
type Step = (typeof STEPS)[number];

export default function EmailPage() {
  const router = useRouter();
  const [step, setStep] = useState<Step>("email");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Step back within the wizard, or — at the first step — leave to wherever came before
  // it (/login/terms). Mirrors course-create-screen.tsx's back handling.
  const handleBack = () => {
    const index = STEPS.indexOf(step);
    if (index > 0) setStep(STEPS[index - 1]);
    else router.back();
  };

  return (
    <main className="flex flex-1 flex-col items-center bg-white px-4 pb-10">
      {step === "email" && (
        <EmailScreen
          headerTitle="Profile Setting"
          heading="Enter your email address"
          onBack={handleBack}
          onSubmit={async (value) => {
            await sendEmailVerification(value);
            setEmail(value);
          }}
          onNext={() => setStep("code")}
        />
      )}
      {step === "code" && (
        <CodeScreen
          headerTitle="Profile Setting"
          email={email}
          onBack={handleBack}
          onConfirm={confirmEmailVerification}
          onResend={sendEmailVerification}
          onNext={() => setStep("password")}
        />
      )}
      {step === "password" && (
        <PasswordScreen
          headerTitle="Profile Setting"
          heading="Enter your password"
          onBack={handleBack}
          onSubmit={async (value) => {
            setPassword(value);
          }}
          onNext={() => setStep("nickname")}
        />
      )}
      {step === "nickname" && (
        <NicknameScreen
          onBack={handleBack}
          onSubmit={async (nickname) => {
            await signup({ email, password, nickname });
          }}
          onNext={() => router.replace("/login")}
        />
      )}
    </main>
  );
}
