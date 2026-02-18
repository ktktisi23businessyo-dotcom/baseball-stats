import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "草野球 個人成績集計",
  description: "スマホで完結する草野球成績管理",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-gray-50 text-gray-900`}
      >
        <div className="min-h-screen flex justify-center">
          <div className="w-full max-w-md px-4 py-6">

            <header className="mb-6 text-center">
              <h1 className="text-2xl font-bold tracking-tight">
                草野球 個人成績集計
              </h1>
            </header>

            <main className="space-y-6">
              {children}
            </main>

          </div>
        </div>
      </body>
    </html>
  );
}
