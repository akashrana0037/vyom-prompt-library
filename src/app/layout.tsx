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
  title: "Vyom Prompt Studio | Premium AI Prompt Library",
  description: "A high-performance technical prompt library for AI enthusiasts and professional engineers. Discover thousands of curated prompts for image generation, coding, and creative tasks.",
  keywords: ["AI Prompts", "Prompt Engineering", "Image Generation", "DALL-E 3", "Midjourney", "Vyom Prompt Studio", "Technical Prompts"],
  authors: [{ name: "Vyom Team" }],
  openGraph: {
    title: "Vyom Prompt Studio | Premium AI Prompt Library",
    description: "Discover thousands of curated high-performance AI prompts for image generation and professional engineering.",
    url: "https://prompt-studio.vyom.ai",
    siteName: "Vyom Prompt Studio",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Vyom Prompt Studio Preview",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Vyom Prompt Studio | Premium AI Prompt Library",
    description: "High-performance technical prompt library for AI enthusiasts.",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: "/favicon.ico",
  },
};


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased selection:bg-accent-blue/30 selection:text-foreground`}
      >
        <div className="min-h-screen bg-background">
          {children}
        </div>
      </body>
    </html>
  );
}
