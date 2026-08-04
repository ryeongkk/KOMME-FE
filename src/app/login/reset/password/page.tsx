import { PasswordScreen } from "@/components/login/password-screen";

export default function ResetPasswordPage() {
  return (
    <main className="flex flex-1 flex-col items-center bg-white px-4 pb-10">
      <PasswordScreen headerTitle="Reset Password" heading="Enter your new password" nextPath="/login" />
    </main>
  );
}
