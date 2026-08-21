"use client";

import { EmailScreen } from "@/components/login/email-screen";
import { sendEmailVerification } from "@/lib/api/auth";
import { clearSignupDraft, saveSignupDraft } from "@/lib/signup-draft";

export default function EmailPage() {
  return (
    <main className="flex flex-1 flex-col items-center bg-white px-4 pb-10">
      <EmailScreen
        headerTitle="Profile Setting"
        heading="Enter your email address"
        nextPath="/login/code"
        onSubmit={async (email) => {
          await sendEmailVerification(email);
          // Entering this step always starts (or restarts) signup — clear first so a
          // password left over from a previously abandoned draft never rides along with
          // a new email (the password step below re-collects it either way).
          clearSignupDraft();
          saveSignupDraft({ email });
        }}
      />
    </main>
  );
}
