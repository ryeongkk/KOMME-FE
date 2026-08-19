"use client";

import { Suspense } from "react";
import { CodeScreen } from "@/components/login/code-screen";
import { confirmEmailVerification, sendEmailVerification } from "@/lib/api/auth";

export default function CodePage() {
  return (
    <main className="flex flex-1 flex-col items-center bg-white px-4 pb-10">
      <Suspense>
        <CodeScreen
          headerTitle="Profile Setting"
          nextPath="/login/password"
          onConfirm={confirmEmailVerification}
          onResend={sendEmailVerification}
        />
      </Suspense>
    </main>
  );
}
