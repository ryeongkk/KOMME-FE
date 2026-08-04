import { PasswordScreen } from "@/components/login/password-screen";

export default function PasswordPage() {
  return (
    <main className="flex flex-1 flex-col items-center bg-white px-4 pb-10">
      <PasswordScreen headerTitle="Profile Setting" heading="Enter your password" nextPath="/login/nickname" />
    </main>
  );
}
