"use client";

import { NicknameScreen } from "@/components/login/nickname-screen";
import { signup } from "@/lib/api/auth";
import { useRequiredSignupDraft, useSignupDraft } from "@/lib/signup-draft";

export default function NicknamePage() {
  const { clear } = useSignupDraft();
  const draft = useRequiredSignupDraft("email", "password");
  if (!draft) return null;

  return (
    <main className="flex flex-1 flex-col items-center bg-white px-4 pb-10">
      <NicknameScreen
        onSubmit={async (nickname) => {
          await signup({ email: draft.email, password: draft.password, nickname });
          clear();
        }}
      />
    </main>
  );
}
