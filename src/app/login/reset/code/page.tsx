import { Suspense } from "react";
import { CodeScreen } from "@/components/login/code-screen";

export default function ResetCodePage() {
  return (
    <main className="flex flex-1 flex-col items-center bg-white px-4 pb-10">
      <Suspense>
        <CodeScreen headerTitle="Reset Password" nextPath="/login/reset/password" />
      </Suspense>
    </main>
  );
}
