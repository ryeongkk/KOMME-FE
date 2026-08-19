"use client";

import { PasswordScreen } from "@/components/login/password-screen";
import { saveSignupDraft } from "@/lib/signup-draft";

export default function PasswordPage() {
  return (
    <main className="flex flex-1 flex-col items-center bg-white px-4 pb-10">
      <PasswordScreen
        headerTitle="Profile Setting"
        heading="Enter your password"
        nextPath="/login/nickname"
        // Signup's own submit (signup()) waits until the nickname step, once the
        // whole draft is collected — this step just stashes the password for it.
        onSubmit={async (password) => {
          saveSignupDraft({ password });
        }}
      />
    </main>
  );
}
