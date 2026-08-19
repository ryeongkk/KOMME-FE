"use client";

import { NicknameScreen } from "@/components/login/nickname-screen";
import { signup } from "@/lib/api/auth";
import { clearSignupDraft, readSignupDraft } from "@/lib/signup-draft";

export default function NicknamePage() {
  return (
    <main className="flex flex-1 flex-col items-center bg-white px-4 pb-10">
      <NicknameScreen
        onSubmit={async (nickname) => {
          const { email, password } = readSignupDraft();
          if (!email || !password) {
            throw new Error("Signup session expired — please start over from the email step.");
          }
          await signup({ email, password, nickname });
          clearSignupDraft();
        }}
      />
    </main>
  );
}
