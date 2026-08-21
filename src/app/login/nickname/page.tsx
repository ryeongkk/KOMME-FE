"use client";

import { NicknameScreen } from "@/components/login/nickname-screen";
import { signup } from "@/lib/api/auth";
import { SessionExpiredError } from "@/lib/api/auth-error-messages";
import { useSignupDraft } from "@/lib/signup-draft";

export default function NicknamePage() {
  const { draft, clear } = useSignupDraft();
  return (
    <main className="flex flex-1 flex-col items-center bg-white px-4 pb-10">
      <NicknameScreen
        onSubmit={async (nickname) => {
          const { email, password } = draft;
          if (!email || !password) {
            throw new SessionExpiredError("Signup session expired — please start over from the email step.");
          }
          await signup({ email, password, nickname });
          clear();
        }}
      />
    </main>
  );
}
