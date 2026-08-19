"use client";

import { EmailScreen } from "@/components/login/email-screen";
import { sendEmailVerification } from "@/lib/api/auth";
import { saveSignupDraft } from "@/lib/signup-draft";

export default function EmailPage() {
  return (
    <main className="flex flex-1 flex-col items-center bg-white px-4 pb-10">
      <EmailScreen
        headerTitle="Profile Setting"
        heading="Enter your email address"
        nextPath="/login/code"
        onSubmit={async (email) => {
          await sendEmailVerification(email);
          saveSignupDraft({ email });
        }}
      />
    </main>
  );
}
