"use client";

import { CodeScreen } from "@/components/login/code-screen";
import { confirmEmailVerification, sendEmailVerification } from "@/lib/api/auth";
import { useRequiredSignupDraft } from "@/lib/signup-draft";

export default function CodePage() {
  const draft = useRequiredSignupDraft("email");
  if (!draft) return null;

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
