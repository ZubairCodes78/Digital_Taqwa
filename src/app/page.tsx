import React from "react";
import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { TheProblem } from "@/components/TheProblem";
import { TheVision } from "@/components/TheVision";
import { ProposedPillars } from "@/components/ProposedPillars";
import { WaitlistSection } from "@/components/WaitlistSection";
import { FAQSection } from "@/components/FAQSection";
import { CallToActionBanner } from "@/components/CallToActionBanner";
import { Footer } from "@/components/Footer";

export const metadata = {
  title: "Digital Taqwa — A Project by Barakah Habits Daily",
  description:
    "Reconnect with Allah. Build better habits. Live with intention. An intentional Islamic digital sanctuary.",
  openGraph: {
    title: "Digital Taqwa — A Project by Barakah Habits Daily",
    description: "Make Space for What Truly Matters.",
    images: [{ url: "/logo.png" }],
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
