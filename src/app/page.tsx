import React from "react";
import type { Metadata } from "next";
import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { TheProblem } from "@/components/TheProblem";
import { TheVision } from "@/components/TheVision";
import { ProposedPillars } from "@/components/ProposedPillars";
import { WaitlistSection } from "@/components/WaitlistSection";
import { FAQSection } from "@/components/FAQSection";
import { CallToActionBanner } from "@/components/CallToActionBanner";
import { Footer } from "@/components/Footer";

export const metadata: Metadata = {
  title: "Digital Taqwa — Reconnect With Allah. One Day at a Time.",
  description:
    "An early-stage Islamic digital sanctuary exploring how mindful technology, prayer presence, and Sunnah habits can help you make space for what truly matters. A project by Barakah Habits Daily.",
  alternates: {
    canonical: "https://digitaltaqwa.site",
  },
  openGraph: {
    title: "Digital Taqwa — Reconnect With Allah. One Day at a Time.",
    description:
      "An early-stage initiative exploring how digital experiences can support Islamic habits, intentional living and a more mindful relationship with technology.",
    url: "https://digitaltaqwa.site",
    siteName: "Digital Taqwa",
    type: "website",
    locale: "en_US",
    images: [
      {
        url: "/logo.png",
        width: 1200,
        height: 630,
        alt: "Digital Taqwa — Make Space for What Truly Matters",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Digital Taqwa — Reconnect With Allah. One Day at a Time.",
    description:
      "An early-stage initiative exploring how digital experiences can support Islamic habits, intentional living and a more mindful relationship with technology.",
    images: ["/logo.png"],
    creator: "@barakahhabitsdaily",
  },
};

export default function HomePage() {
  return (
    <main className="min-h-screen bg-[#0A1410] text-[#F6F4ED] selection:bg-[#B79A62] selection:text-[#0A1410]">
      {/* Sleek Minimalist Navigation */}
      <Navbar />

      {/* 1. HERO — Cinematic 3D Islamic Architecture, Logo, Headline & CTAs */}
      <Hero />

      {/* 2. THE REALITY — The Modern Digital Disconnect */}
      <TheProblem />

      {/* 3. THE VISION — Spiritual Technology Built on Humility */}
      <TheVision />

      {/* 4. PROPOSED PILLARS — 4 Core Dimensions Under Research */}
      <ProposedPillars />

      {/* 5. WAITLIST & RESEARCH SURVEY — Community Shaping the Future */}
      <WaitlistSection />

      {/* 6. FAQ — Answers to Common Questions */}
      <FAQSection />

      {/* 7. CALL TO ACTION BANNER — Final Invitation */}
      <CallToActionBanner />

      {/* 8. FOOTER — Attribution & Social Links */}
      <Footer />
    </main>
  );
}
