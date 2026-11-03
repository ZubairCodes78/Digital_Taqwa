import React from "react";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowLeft,
  Shield,
  CheckCircle2,
  Mail,
} from "lucide-react";
import type { Metadata } from "next";
import { Footer } from "@/components/Footer";

export const metadata: Metadata = {
  title: "Privacy Policy & Islamic Data Ethics (Amanah) — Digital Taqwa",
  description:
    "Our sacred commitments to Islamic privacy, data protection (Amanah), zero commercial ads, and non-commercial stewardship at Digital Taqwa.",
  alternates: {
    canonical: "https://digitaltaqwa.site/privacy",
  },
  openGraph: {
    title: "Privacy Policy & Islamic Data Ethics — Digital Taqwa",
    description:
      "Our sacred commitments to Islamic privacy, data protection (Amanah), and non-commercial stewardship at Digital Taqwa.",
    url: "https://digitaltaqwa.site/privacy",
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
    title: "Privacy Policy & Islamic Data Ethics — Digital Taqwa",
    description:
      "Our sacred commitments to Islamic privacy, data protection (Amanah), and non-commercial stewardship at Digital Taqwa.",
    images: ["/logo.png"],
  },
};

export default function PrivacyPage() {
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
        name: "Privacy Policy",
        item: "https://digitaltaqwa.site/privacy",
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
      <div className="absolute top-1/3 left-10 w-[500px] h-[500px] bg-[#B79A62]/5 rounded-full blur-[140px] pointer-events-none -z-0" />

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
            <Shield className="w-3.5 h-3.5 text-[#B79A62]" />
            <span className="text-[11px] uppercase tracking-widest text-[#E8D6AC] font-mono font-bold">
              Privacy &bull; Amanah (Sacred Trust)
            </span>
          </div>

          <h1 className="font-display text-4xl sm:text-6xl md:text-7xl font-black tracking-tight text-[#F6F4ED] leading-[1.08] mb-6">
            Privacy Policy &amp;{" "}
            <span className="text-gradient-gold block sm:inline">
              Islamic Data Ethics.
            </span>
          </h1>

          <p className="text-base sm:text-lg text-[#DDE4D9]/85 font-normal leading-relaxed max-w-2xl mx-auto mb-4">
            We believe privacy is an intrinsic moral responsibility. Your spiritual journey belongs only to you and Allah.
          </p>

          <p className="text-xs text-[#B79A62] font-mono uppercase tracking-wider">
            Last Updated: October 2026 &bull; Digital Taqwa Pre-Launch Stage
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
                Islamic Data Ethics (Amanah &amp; Taqwa)
              </h2>
            </div>
            <p className="text-sm sm:text-base text-[#DDE4D9]/85 leading-relaxed font-light mb-3">
              Modern digital platforms frequently view human beings as data commodities to be harvested, tracked, and behaviorally manipulated. <strong>Digital Taqwa</strong> was created as the antithesis of this paradigm.
            </p>
            <p className="text-sm sm:text-base text-[#DDE4D9]/85 leading-relaxed font-light">
              We treat any information entrusted to us as an <em>Amanah</em> (a sacred trust) for which we are accountable before Allah. We pledge never to introduce invasive analytics or emotional surveillance.
            </p>
          </div>

          {/* Section 2 */}
          <div className="p-8 sm:p-10 rounded-3xl bg-[#12241C]/65 backdrop-blur-2xl border border-[#B79A62]/30 shadow-xl">
            <div className="flex items-center space-x-3 mb-4">
              <span className="font-mono text-xs font-bold text-[#B79A62] px-2.5 py-1 rounded bg-[#19372D] border border-[#B79A62]/30">
                02
              </span>
              <h2 className="font-display text-2xl sm:text-3xl font-black text-[#F6F4ED]">
                What Information We Collect
              </h2>
            </div>
            <p className="text-sm sm:text-base text-[#DDE4D9]/85 leading-relaxed font-light mb-4">
              During the current market research and pre-launch phase, we collect exclusively the following information:
            </p>

            <div className="space-y-3">
              <div className="p-4 rounded-2xl bg-[#162B21]/60 border border-white/10">
                <h4 className="font-display font-bold text-sm text-[#F6F4ED] mb-1">
                  1. Contact Coordinates
                </h4>
                <p className="text-xs text-[#DDE4D9]/80">
                  Your email address (required to issue your verification link and notify you of launch), and optional name or WhatsApp number if you choose to provide it.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-[#162B21]/60 border border-white/10">
                <h4 className="font-display font-bold text-sm text-[#F6F4ED] mb-1">
                  2. Research Feedback &amp; Feature Preferences
                </h4>
                <p className="text-xs text-[#DDE4D9]/80">
                  Your selected responses regarding daily digital habits, prayer focus challenges, and preferred features to guide our engineering priorities.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-[#162B21]/60 border border-white/10">
                <h4 className="font-display font-bold text-sm text-[#F6F4ED] mb-1">
                  3. Referral &amp; Attribution Telemetry
                </h4>
                <p className="text-xs text-[#DDE4D9]/80">
                  Anonymous referral tags (e.g., utm_source from Instagram, YouTube, TikTok) and unique referral codes to attribute community invitations.
                </p>
              </div>
            </div>
          </div>

          {/* Section 3 */}
          <div className="p-8 sm:p-10 rounded-3xl bg-[#12241C]/65 backdrop-blur-2xl border border-[#B79A62]/30 shadow-xl">
            <div className="flex items-center space-x-3 mb-4">
              <span className="font-mono text-xs font-bold text-[#B79A62] px-2.5 py-1 rounded bg-[#19372D] border border-[#B79A62]/30">
                03
              </span>
              <h2 className="font-display text-2xl sm:text-3xl font-black text-[#F6F4ED]">
                Your Unconditional Right to Deletion
              </h2>
            </div>
            <p className="text-sm sm:text-base text-[#DDE4D9]/85 leading-relaxed font-light mb-4">
              You maintain total authority over your records. You can request immediate and permanent deletion of your email address, referral counts, and survey submissions at any time without having to provide any justification.
            </p>
            <div className="p-4 rounded-2xl bg-[#162B21]/60 border border-[#B79A62]/20 flex items-center space-x-3">
              <Mail className="w-5 h-5 text-[#B79A62] shrink-0" />
              <div className="text-xs text-[#DDE4D9]/90">
                To request permanent erasure, email us at:{" "}
                <span className="font-mono font-bold text-[#E8D6AC]">
                  privacy@digitaltaqwa.com
                </span>{" "}
                with the subject line &ldquo;Permanent Data Erasure&rdquo;.
              </div>
            </div>
          </div>

          {/* Section 4 */}
          <div className="p-8 sm:p-10 rounded-3xl bg-[#12241C]/65 backdrop-blur-2xl border border-[#B79A62]/30 shadow-xl">
            <div className="flex items-center space-x-3 mb-4">
              <span className="font-mono text-xs font-bold text-[#B79A62] px-2.5 py-1 rounded bg-[#19372D] border border-[#B79A62]/30">
                04
              </span>
              <h2 className="font-display text-2xl sm:text-3xl font-black text-[#F6F4ED]">
                Infrastructure &amp; Security Standards
              </h2>
            </div>
            <p className="text-sm sm:text-base text-[#DDE4D9]/85 leading-relaxed font-light mb-4">
              Our waitlist records and research datasets are hosted in secured, enterprise-grade cloud environments featuring end-to-end TLS/HTTPS encryption, role-based access controls, and rate-limiting to prevent unauthorized extraction.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-2xl bg-[#162B21]/60 border border-white/10 flex items-start space-x-3">
                <CheckCircle2 className="w-4 h-4 text-[#B79A62] shrink-0 mt-0.5" />
                <span className="text-xs text-[#DDE4D9]/85">
                  HTTPS/TLS 1.3 encrypted data transmission in transit.
                </span>
              </div>
              <div className="p-4 rounded-2xl bg-[#162B21]/60 border border-white/10 flex items-start space-x-3">
                <CheckCircle2 className="w-4 h-4 text-[#B79A62] shrink-0 mt-0.5" />
                <span className="text-xs text-[#DDE4D9]/85">
                  Zero third-party advertising or cookie trackers.
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Callout Banner */}
        <div className="mt-16 p-8 sm:p-12 rounded-3xl bg-gradient-to-r from-[#142A20] via-[#1A382D] to-[#142A20] border border-[#B79A62]/40 text-center shadow-2xl">
          <h3 className="font-display text-2xl sm:text-4xl font-black text-[#F6F4ED] mb-3">
            Built on Faith, Designed for Peace.
          </h3>
          <p className="text-sm sm:text-base text-[#DDE4D9]/85 max-w-xl mx-auto mb-6">
            Join thousands of Muslims who trust us to build an intentional, distraction-free spiritual companion.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/#waitlist"
              className="px-8 py-3.5 rounded-full bg-[#B79A62] text-[#0A1410] text-xs uppercase tracking-wider font-extrabold hover:bg-[#D8C296] transition-all shadow-lg hover:scale-105 active:scale-95"
            >
              Join Early Access Waitlist
            </Link>
            <Link
              href="/terms"
              className="px-6 py-3.5 rounded-full bg-white/5 border border-white/15 text-xs uppercase tracking-wider font-mono text-[#DDE4D9] hover:border-[#B79A62] hover:text-[#B79A62] transition-all"
            >
              Review Terms of Service
            </Link>
          </div>
        </div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
