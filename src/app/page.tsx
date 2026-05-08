import type { Metadata } from "next";
import HomeClient from "./HomeClient";

export const metadata: Metadata = {
  title: "Vyom Prompt Studio | Premium AI Prompt Library",
  description: "Explore thousands of curated AI prompts for image generation, coding, and creative tasks. High-performance technical prompt library for AI enthusiasts and professional engineers.",
  openGraph: {
    title: "Vyom Prompt Studio | Premium AI Prompt Library",
    description: "Discover thousands of curated high-performance AI prompts for image generation and professional engineering.",
    images: ["/og-image.png"],
  },
};

export default function Home() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "DataCatalog",
    "name": "Vyom Prompt Studio",
    "description": "Premium AI Prompt Library for Image Generation and Technical Tasks",
    "url": "https://prompt-studio.vyom.ai",
    "creator": {
      "@type": "Organization",
      "name": "Vyom"
    }
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <HomeClient />
    </>
  );
}
