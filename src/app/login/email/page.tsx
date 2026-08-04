import { EmailScreen } from "@/components/login/email-screen";

export default function EmailPage() {
  return (
    <main className="flex flex-1 flex-col items-center bg-white px-4 pb-10">
      <EmailScreen headerTitle="Profile Setting" heading="Enter your email address" nextPath="/login/code" />
    </main>
  );
}
