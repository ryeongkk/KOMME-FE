"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { CodeScreen } from "@/components/login/code-screen";
import { confirmEmailVerification, sendEmailVerification } from "@/lib/api/auth";
import { useSignupDraft } from "@/lib/signup-draft";

export default function CodePage() {
  const { draft } = useSignupDraft();
  const router = useRouter();

  // A reload (or direct visit) loses the in-memory draft — bounce back to the email step
  // instead of letting the screen submit an empty email to the verify/resend APIs.
  useEffect(() => {
    if (!draft.email) router.replace("/login/email");
  }, [draft.email, router]);

  if (!draft.email) return null;

  return (
    <main className="flex flex-1 flex-col items-center bg-white px-4 pb-10">
      <CodeScreen
        headerTitle="Profile Setting"
        email={draft.email}
        nextPath="/login/password"
        onConfirm={confirmEmailVerification}
        onResend={sendEmailVerification}
      />
    </main>
  );
}
