import React from "react";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowLeft,
  FileText,
  ShieldCheck,
  Scale,
  HeartHandshake,
  BookOpen,
  UserCheck,
  CheckCircle2,
} from "lucide-react";
import type { Metadata } from "next";
import { Footer } from "@/components/Footer";

export const metadata: Metadata = {
  title: "Terms of Service & Community Covenant — Digital Taqwa",
  description:
    "Ethical covenants and terms governing the pre-launch research community and early-access platform for Digital Taqwa. A project by Barakah Habits Daily.",
  alternates: {
    canonical: "https://digitaltaqwa.site/terms",
  },
  openGraph: {
    title: "Terms of Service & Community Covenant — Digital Taqwa",
    description:
      "Terms and ethical covenants governing the pre-launch research community and early-access platform for Digital Taqwa.",
    url: "https://digitaltaqwa.site/terms",
    siteName: "Digital Taqwa",
    type: "article",
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
    title: "Terms of Service & Community Covenant — Digital Taqwa",
    description:
      "Terms and ethical covenants governing the pre-launch research community and early-access platform for Digital Taqwa.",
    images: ["/logo.png"],
  },
};

export default function TermsPage() {
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Sanctuary",
        item: "https://digitaltaqwa.site",
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Terms of Service",
        item: "https://digitaltaqwa.site/terms",
      },
    ],
  };

  return (
    <div className="min-h-screen bg-[#0A1410] text-[#F6F4ED] selection:bg-[#B79A62] selection:text-[#0A1410] relative overflow-hidden">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      {/* Ambient background glows */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-[#19372D]/35 rounded-full blur-[160px] pointer-events-none -z-0" />
      <div className="absolute top-1/3 right-10 w-[500px] h-[500px] bg-[#B79A62]/5 rounded-full blur-[140px] pointer-events-none -z-0" />

      {/* Top Navigation Bar */}
      <header className="relative z-20 border-b border-[#B79A62]/15 bg-[#0A1410]/80 backdrop-blur-md">
        <div className="max-w-6xl mx-auto px-6 sm:px-8 py-4 flex items-center justify-between">
          <Link
            href="/"
            className="inline-flex items-center space-x-2 text-xs uppercase tracking-wider font-mono text-[#DDE4D9] hover:text-[#B79A62] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to Sanctuary</span>
          </Link>

          <div className="flex items-center space-x-3">
            <div className="relative w-7 h-7 rounded-full overflow-hidden border border-[#B79A62]/50">
              <Image
                src="/barakah-habits-logo.jpg"
                alt="Barakah Habits Daily — Official Logo"
                fill
                sizes="28px"
                className="object-cover"
              />
            </div>
            <span className="text-[10px] uppercase tracking-widest text-[#B79A62] font-mono hidden sm:inline font-semibold">
              Barakah Habits Daily
            </span>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="relative z-10 max-w-4xl mx-auto px-6 sm:px-8 pt-16 pb-24">
        {/* Page Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-[#14261F]/90 border border-[#B79A62]/35 mb-4 shadow-inner">
            <FileText className="w-3.5 h-3.5 text-[#B79A62]" />
            <span className="text-[11px] uppercase tracking-widest text-[#E8D6AC] font-mono font-bold">
              Community Covenant &bull; Pre-Launch Stage
            </span>
          </div>

          <h1 className="font-display text-4xl sm:text-6xl md:text-7xl font-black tracking-tight text-[#F6F4ED] leading-[1.08] mb-6">
            Terms of Service &amp;{" "}
            <span className="text-gradient-gold block sm:inline">
              Ethical Covenant.
            </span>
          </h1>

          <p className="text-base sm:text-lg text-[#DDE4D9]/85 font-normal leading-relaxed max-w-2xl mx-auto mb-4">
            A transparent agreement grounded in Islamic principles of Amanah (trust), mutual consent, and sincere community co-creation.
          </p>

          <p className="text-xs text-[#B79A62] font-mono uppercase tracking-wider">
            Effective: October 2026 &bull; Version 1.2
          </p>
        </div>

        {/* Detailed Sections in Frosted Glass Cards */}
        <div className="space-y-8">
          {/* Section 1 */}
          <div className="p-8 sm:p-10 rounded-3xl bg-[#12241C]/65 backdrop-blur-2xl border border-[#B79A62]/30 shadow-xl">
            <div className="flex items-center space-x-3 mb-4">
              <span className="font-mono text-xs font-bold text-[#B79A62] px-2.5 py-1 rounded bg-[#19372D] border border-[#B79A62]/30">
                01
              </span>
              <h2 className="font-display text-2xl sm:text-3xl font-black text-[#F6F4ED]">
                Pre-Launch Research &amp; Early Access
              </h2>
            </div>
            <p className="text-sm sm:text-base text-[#DDE4D9]/85 leading-relaxed font-light mb-3">
              Digital Taqwa is currently an active research and conceptual initiative by <strong>Barakah Habits Daily</strong>. The mobile application is not yet completed, released on app stores, or commercially distributed.
            </p>
            <p className="text-sm sm:text-base text-[#DDE4D9]/85 leading-relaxed font-light">
              By joining the waitlist or submitting survey feedback, you express interest in participating in early community research, receiving developmental updates, and gaining prioritized invitation to future beta testing.
            </p>
          </div>

          {/* Section 2 */}
          <div className="p-8 sm:p-10 rounded-3xl bg-[#12241C]/65 backdrop-blur-2xl border border-[#B79A62]/30 shadow-xl">
            <div className="flex items-center space-x-3 mb-4">
              <span className="font-mono text-xs font-bold text-[#B79A62] px-2.5 py-1 rounded bg-[#19372D] border border-[#B79A62]/30">
                02
              </span>
              <h2 className="font-display text-2xl sm:text-3xl font-black text-[#F6F4ED]">
                No Financial Transactions or Hidden Fees
              </h2>
            </div>
            <p className="text-sm sm:text-base text-[#DDE4D9]/85 leading-relaxed font-light mb-3">
              Registration on this waitlist is 100% free of charge. No payment card, banking credentials, or subscription trial enrollment is required or requested.
            </p>
            <p className="text-sm sm:text-base text-[#DDE4D9]/85 leading-relaxed font-light">
              If any third party claiming to represent Digital Taqwa solicits funds or payment credentials for early access, please report it immediately to our team.
            </p>
          </div>

          {/* Section 3 */}
          <div className="p-8 sm:p-10 rounded-3xl bg-[#12241C]/65 backdrop-blur-2xl border border-[#B79A62]/30 shadow-xl">
            <div className="flex items-center space-x-3 mb-4">
              <span className="font-mono text-xs font-bold text-[#B79A62] px-2.5 py-1 rounded bg-[#19372D] border border-[#B79A62]/30">
                03
              </span>
              <h2 className="font-display text-2xl sm:text-3xl font-black text-[#F6F4ED]">
                Intellectual Property &amp; Brand Rights
              </h2>
            </div>
            <p className="text-sm sm:text-base text-[#DDE4D9]/85 leading-relaxed font-light mb-3">
              All branding elements, logos, 3D assets, interface designs, written copy, and interactive environments on this website are protected under copyright and intellectual property laws and belong exclusively to <strong>Digital Taqwa</strong> and <strong>Barakah Habits Daily</strong>.
            </p>
            <p className="text-sm sm:text-base text-[#DDE4D9]/85 leading-relaxed font-light">
              Community feedback submitted through the survey becomes part of our collective research insights, helping guide the architectural roadmap for the benefit of the global Muslim community.
            </p>
          </div>

          {/* Section 4 */}
          <div className="p-8 sm:p-10 rounded-3xl bg-[#12241C]/65 backdrop-blur-2xl border border-[#B79A62]/30 shadow-xl">
            <div className="flex items-center space-x-3 mb-4">
              <span className="font-mono text-xs font-bold text-[#B79A62] px-2.5 py-1 rounded bg-[#19372D] border border-[#B79A62]/30">
                04
              </span>
              <h2 className="font-display text-2xl sm:text-3xl font-black text-[#F6F4ED]">
                Community Conduct &amp; Verification
              </h2>
            </div>
            <p className="text-sm sm:text-base text-[#DDE4D9]/85 leading-relaxed font-light mb-3">
              We reserve the right to remove automated submissions, bot registrations, and fraudulent referrals to preserve data integrity for our research team.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
              <div className="p-4 rounded-2xl bg-[#162B21]/60 border border-white/10 flex items-start space-x-3">
                <CheckCircle2 className="w-4 h-4 text-[#B79A62] shrink-0 mt-0.5" />
                <span className="text-xs text-[#DDE4D9]/85">
                  One genuine entry per person ensures authentic survey findings.
                </span>
              </div>
              <div className="p-4 rounded-2xl bg-[#162B21]/60 border border-white/10 flex items-start space-x-3">
                <CheckCircle2 className="w-4 h-4 text-[#B79A62] shrink-0 mt-0.5" />
                <span className="text-xs text-[#DDE4D9]/85">
                  Email verification links authenticate early access positioning.
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Callout Banner */}
        <div className="mt-16 p-8 sm:p-12 rounded-3xl bg-gradient-to-r from-[#142A20] via-[#1A382D] to-[#142A20] border border-[#B79A62]/40 text-center shadow-2xl">
          <h3 className="font-display text-2xl sm:text-4xl font-black text-[#F6F4ED] mb-3">
            Have Questions About Our Covenant?
          </h3>
          <p className="text-sm sm:text-base text-[#DDE4D9]/85 max-w-xl mx-auto mb-6">
            We welcome open dialogue. Connect directly with our team or return to explore the full vision and survey.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/#waitlist"
              className="px-8 py-3.5 rounded-full bg-[#B79A62] text-[#0A1410] text-xs uppercase tracking-wider font-extrabold hover:bg-[#D8C296] transition-all shadow-lg hover:scale-105 active:scale-95"
            >
              Join Early Access Waitlist
            </Link>
            <Link
              href="/privacy"
              className="px-6 py-3.5 rounded-full bg-white/5 border border-white/15 text-xs uppercase tracking-wider font-mono text-[#DDE4D9] hover:border-[#B79A62] hover:text-[#B79A62] transition-all"
            >
              Review Privacy Policy
            </Link>
          </div>
        </div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
