import { EmailScreen } from "@/components/login/email-screen";

export default function ResetEmailPage() {
  return (
    <main className="flex flex-1 flex-col items-center bg-white px-4 pb-10">
      <EmailScreen
        headerTitle="Reset Password"
        heading="Enter your email address to reset the password"
        nextPath="/login/reset/code"
      />
    </main>
  );
}
