import type { Metadata, Viewport } from "next";
import { Raleway } from "next/font/google";
import "./globals.css";
import { RegisterServiceWorker } from "./register-sw";

const raleway = Raleway({
  variable: "--font-raleway",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "KOMME - 한국인처럼 살아보기",
  description: "방한 외국인을 위한 한국인처럼 살아보기 일상 체험 큐레이션 플랫폼",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "KOMME",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#0f172a",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${raleway.variable} h-full antialiased`}
    >
      <body className="min-h-screen bg-white">
        <div className="mx-auto flex min-h-screen w-full max-w-sm flex-col bg-white">
          {children}
        </div>
        <RegisterServiceWorker />
      </body>
    </html>
  );
}
