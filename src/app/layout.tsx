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
  title: "Vyom Prompt Style | Technical Prompt Library",
  description: "The ultimate 10k+ prompt library for AI enthusiasts and engineers.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased selection:bg-brand-black selection:text-brand-yellow`}
      >
        <div className="flex min-h-screen bg-brand-white overflow-hidden">
          {children}
        </div>
      </body>
    </html>
  );
}
