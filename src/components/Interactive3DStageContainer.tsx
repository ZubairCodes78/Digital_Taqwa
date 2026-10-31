"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  ArrowDown,
  ExternalLink,
  Compass,
  BookOpen,
  Users,
  CheckCircle2,
  Share2,
  ChevronRight,
  ChevronLeft,
} from "lucide-react";
import { TikTokIcon } from "./icons/TikTokIcon";
import { ThreeWorldExperience } from "./ThreeWorldExperience";
import { QuranCinematicExperience } from "./QuranCinematicExperience";
import { MultiStepWaitlistForm } from "./MultiStepWaitlistForm";
import { SOCIAL_PROFILES } from "@/lib/constants";

export function Interactive3DStageContainer() {
  // 0 = Entrance, 1 = Vision, 2 = Survey, 3 = Completion / Sacred Dawn
  const [currentStage, setCurrentStage] = useState<number>(0);
  const [hasCompletedSurvey, setHasCompletedSurvey] = useState<boolean>(false);
  const [completedUserData, setCompletedUserData] = useState<{
    email: string;
    referralCode: string;
    referralLink: string;
  } | null>(null);

  // Allow URL hash navigation (#survey, #vision)
  useEffect(() => {
    if (typeof window !== "undefined") {
      const hash = window.location.hash.toLowerCase();
      if (hash === "#survey" || hash === "#waitlist") {
        setCurrentStage(2);
      } else if (hash === "#vision" || hash === "#about") {
        setCurrentStage(1);
      }
    }
  }, []);

  const goToStage = (stage: number) => {
    setCurrentStage(stage);
    // Smooth scroll top so view is aligned
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleSurveySuccess = (data: {
    email: string;
    referralCode: string;
    referralLink: string;
  }) => {
    setHasCompletedSurvey(true);
    setCompletedUserData(data);
    setCurrentStage(3); // Fly 3D camera to Sacred Dawn completion chamber!
  };

  return (
    <div className="relative min-h-screen w-full bg-[#0A1410] text-[#F6F4ED] selection:bg-[#D6B56D] selection:text-[#0A1410] overflow-x-hidden flex flex-col justify-between">
      {/* 1. PERSISTENT 3D IMMERSIVE WEBGL WORLD (Background) */}
      <ThreeWorldExperience currentStage={currentStage} />

      {/* Atmospheric lighting layers */}
      <div className="fixed inset-0 pointer-events-none -z-1 bg-radial-gradient from-transparent via-[#0A1410]/40 to-[#0A1410]/90" />
      <div className="fixed inset-0 pointer-events-none -z-1 bg-gradient-to-b from-[#0A1410]/70 via-transparent to-[#0A1410]/90" />

      {/* 2. MINIMAL TOP NAVIGATION & 3D STAGE SELECTOR */}
      <header className="sticky top-0 z-30 w-full px-4 sm:px-8 py-3 sm:py-4 backdrop-blur-md bg-[#0A1410]/75 border-b border-[#D6B56D]/15 transition-all">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          {/* Logo & Brand Attribution */}
          <button
            onClick={() => goToStage(0)}
            className="flex items-center space-x-3 text-left group focus:outline-none"
          >
            <div className="relative w-8 h-8 sm:w-10 sm:h-10 shrink-0 transition-transform group-hover:scale-105">
              <Image
                src="/logo-icon.png"
                alt="Digital Taqwa Logo"
                fill
                sizes="40px"
                className="object-contain"
                priority
              />
            </div>
            <div className="flex flex-col">
              <span className="font-serif text-base sm:text-lg font-bold tracking-tight text-[#F6F4ED] group-hover:text-[#D6B56D] transition-colors leading-tight">
                DIGITAL TAQWA
              </span>
              <span className="text-[9px] sm:text-[10px] uppercase font-mono tracking-widest text-[#D6B56D]/90">
                A Project by Barakah Habits Daily
              </span>
            </div>
          </button>

          {/* Interactive 3D World Stage Switcher */}
          <nav className="hidden md:flex items-center space-x-1.5 p-1 rounded-full bg-[#12221A]/85 border border-[#D6B56D]/20 shadow-inner">
            <button
              onClick={() => goToStage(0)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-mono uppercase tracking-wider transition-all ${
                currentStage === 0
                  ? "bg-[#D6B56D] text-[#0A1410] font-semibold shadow-sm"
                  : "text-[#DDE4D9]/80 hover:text-[#F6F4ED] hover:bg-white/5"
              }`}
            >
              01 Entrance
            </button>
            <button
              onClick={() => goToStage(1)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-mono uppercase tracking-wider transition-all ${
                currentStage === 1
                  ? "bg-[#D6B56D] text-[#0A1410] font-semibold shadow-sm"
                  : "text-[#DDE4D9]/80 hover:text-[#F6F4ED] hover:bg-white/5"
              }`}
            >
              02 Vision
            </button>
            <button
              onClick={() => goToStage(2)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-mono uppercase tracking-wider transition-all ${
                currentStage === 2
                  ? "bg-[#D6B56D] text-[#0A1410] font-semibold shadow-sm"
                  : "text-[#DDE4D9]/80 hover:text-[#F6F4ED] hover:bg-white/5"
              }`}
            >
              03 Survey
            </button>
            <button
              onClick={() => goToStage(3)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-mono uppercase tracking-wider transition-all ${
                currentStage === 3
                  ? "bg-[#D6B56D] text-[#0A1410] font-semibold shadow-sm"
                  : "text-[#DDE4D9]/80 hover:text-[#F6F4ED] hover:bg-white/5"
              }`}
            >
              04 Community
            </button>
          </nav>

          {/* Quick CTA button */}
          <div className="flex items-center space-x-2">
            {currentStage !== 2 ? (
              <button
                onClick={() => goToStage(2)}
                className="px-4 py-2 rounded-full bg-[#D6B56D] text-[#0A1410] text-xs font-semibold uppercase tracking-wider hover:bg-[#E8D6AC] transition-all shadow-md shadow-[#D6B56D]/20 hover:scale-105 active:scale-95"
              >
                Join Waitlist
              </button>
            ) : (
              <button
                onClick={() => goToStage(1)}
                className="px-3.5 py-1.5 rounded-full border border-[#D6B56D]/40 text-[#DDE4D9] text-xs font-mono hover:text-[#F6F4ED] hover:border-[#D6B56D] transition-all"
              >
                Our Vision
              </button>
            )}
          </div>
        </div>
      </header>

      {/* 3. STAGE CONTENT VIEWPORT */}
      <div className="relative z-10 flex-1 flex flex-col justify-center px-4 sm:px-6 md:px-8 py-8 sm:py-12">
        {/* ============================================================== */}
        {/* STAGE 0: HERO ENTRANCE — SACRED GATEWAY */}
        {/* ============================================================== */}
        {currentStage === 0 && (
          <section className="max-w-4xl mx-auto w-full text-center py-6 sm:py-12 animate-fadeIn">
            {/* Prominent High-Resolution Logo */}
            <div className="relative w-36 h-36 sm:w-44 sm:h-44 md:w-52 md:h-52 mx-auto mb-6 sm:mb-8 transition-transform duration-700 hover:scale-105">
              <Image
                src="/logo-icon.png"
                alt="Digital Taqwa Emblem"
                fill
                sizes="(max-width: 640px) 144px, (max-width: 768px) 176px, 208px"
                priority
                className="object-contain drop-shadow-[0_16px_36px_rgba(214,181,109,0.4)]"
              />
            </div>

            {/* Sub-badge: Exact styling from mobile reference */}
            <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full border border-[#D6B56D]/35 bg-[#14261F]/80 backdrop-blur-md mb-6 shadow-inner">
              <span className="w-1.5 h-1.5 rounded-full bg-[#D6B56D] animate-ping" />
              <span className="text-[11px] sm:text-xs uppercase tracking-widest text-[#E8D6AC] font-mono font-medium">
                &bull; EARLY ACCESS &bull; COMMUNITY VALIDATION
              </span>
            </div>

            {/* Hero Headline */}
            <h1 className="font-serif text-4xl sm:text-6xl md:text-7xl font-bold tracking-tight leading-[1.12] mb-6 text-[#F6F4ED]">
              Make Space for{" "}
              <span className="font-serif italic font-normal text-[#D6B56D] block sm:inline">
                What Truly Matters.
              </span>
            </h1>

            {/* Exact Supporting Text requested by user */}
            <p className="max-w-2xl mx-auto text-base sm:text-xl text-[#DDE4D9] font-light leading-relaxed mb-4 px-2">
              Build better habits, strengthen your Deen, and create a more intentional digital life.
            </p>

            <p className="max-w-xl mx-auto text-xs sm:text-sm text-[#D6B56D]/85 font-mono mb-10 px-4">
              We are conducting global market research before development to build only what Muslims genuinely need.
            </p>

            {/* Primary & Secondary CTAs */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3.5 sm:gap-4 max-w-md mx-auto mb-12 px-2">
              <button
                onClick={() => goToStage(2)}
                className="w-full sm:w-auto px-8 py-4 rounded-full bg-[#19372D] border border-[#D6B56D]/60 text-[#F6F4ED] text-sm uppercase tracking-wider font-semibold hover:bg-[#234d3f] transition-all flex items-center justify-center gap-2 shadow-xl shadow-black/40 hover:-translate-y-0.5"
              >
                <span>JOIN THE WAITLIST</span>
                <ArrowRight className="w-4 h-4 text-[#D6B56D]" />
              </button>

              <button
                onClick={() => goToStage(1)}
                className="w-full sm:w-auto px-7 py-4 rounded-full border border-[#D6B56D]/30 bg-[#0A1410]/50 text-[#F6F4ED] text-sm uppercase tracking-wider font-medium hover:border-[#D6B56D] hover:bg-[#19372D]/50 transition-all flex items-center justify-center gap-2 backdrop-blur-sm"
              >
                <span>EXPLORE THE VISION</span>
                <ArrowDown className="w-3.5 h-3.5 text-[#D6B56D]" />
              </button>
            </div>

            {/* Bottom 3D Scene Indicator */}
            <div className="flex flex-col items-center justify-center space-y-2 opacity-75 hover:opacity-100 transition-opacity">
              <span className="text-[10px] uppercase tracking-widest text-[#D6B56D] font-mono">
                Click Explore or Survey to travel inside the 3D Sanctuary
              </span>
              <div className="w-5 h-9 rounded-full border border-[#D6B56D]/40 flex items-start justify-center p-1">
                <span className="w-1.5 h-2.5 rounded-full bg-[#D6B56D] animate-bounce" />
              </div>
            </div>
          </section>
        )}

        {/* ============================================================== */}
        {/* STAGE 1: THE VISION SANCTUARY */}
        {/* ============================================================== */}
        {currentStage === 1 && (
          <section className="max-w-4xl mx-auto w-full py-4 sm:py-8 animate-fadeIn">
            <div className="bg-[#121E18]/90 backdrop-blur-xl border border-[#D6B56D]/30 rounded-3xl p-6 sm:p-10 md:p-12 shadow-2xl text-[#F6F4ED]">
              {/* Attribution Header */}
              <div className="text-center mb-8">
                <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full border border-[#D6B56D]/30 bg-[#162920] mb-4">
                  <Compass className="w-3.5 h-3.5 text-[#D6B56D]" />
                  <span className="text-[11px] uppercase tracking-widest text-[#E8D6AC] font-mono">
                    A Project by Barakah Habits Daily
                  </span>
                </div>
                <h2 className="font-serif text-3xl sm:text-5xl font-bold tracking-tight text-[#F6F4ED] mb-4">
                  Built on Humility, <br />
                  <span className="font-serif italic text-[#D6B56D]">Shaped by the Ummah.</span>
                </h2>
                <p className="max-w-2xl mx-auto text-sm sm:text-base text-[#DDE4D9]/90 font-light leading-relaxed">
                  Most Islamic apps are built backwards — teams guess what users want, pack the interface with intrusive ads, and introduce gimmicks that distract from spiritual devotion.
                </p>
              </div>

              {/* Research Principles Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                <div className="p-5 rounded-2xl bg-[#0d1a14]/75 border border-[#D6B56D]/20">
                  <span className="text-[#D6B56D] font-mono text-xs font-bold block mb-2">01 &bull; RESEARCH FIRST</span>
                  <h3 className="font-serif text-lg font-bold mb-2 text-[#F6F4ED]">No Presumed Features</h3>
                  <p className="text-xs text-[#DDE4D9]/80 leading-relaxed">
                    The mobile app has NOT been coded yet. We are surveying Muslims globally to understand actual daily struggles.
                  </p>
                </div>

                <div className="p-5 rounded-2xl bg-[#0d1a14]/75 border border-[#D6B56D]/20">
                  <span className="text-[#D6B56D] font-mono text-xs font-bold block mb-2">02 &bull; DEEN ALIGNMENT</span>
                  <h3 className="font-serif text-lg font-bold mb-2 text-[#F6F4ED]">Zero Vanity Metrics</h3>
                  <p className="text-xs text-[#DDE4D9]/80 leading-relaxed">
                    No noisy streaks that cause guilt or anxiety. Digital Taqwa will champion quiet intentionality and sincerity (Ikhlas).
                  </p>
                </div>

                <div className="p-5 rounded-2xl bg-[#0d1a14]/75 border border-[#D6B56D]/20">
                  <div className="flex items-center space-x-2 mb-2">
                    <div className="relative w-4 h-4 rounded-full overflow-hidden border border-[#D6B56D]/50 shrink-0">
                      <Image
                        src="/barakah-habits-logo.jpg"
                        alt="Barakah Habits"
                        fill
                        sizes="16px"
                        className="object-cover"
                      />
                    </div>
                    <span className="text-[#D6B56D] font-mono text-xs font-bold">03 &bull; BARAKAH HABITS</span>
                  </div>
                  <h3 className="font-serif text-lg font-bold mb-2 text-[#F6F4ED]">Proven Methodology</h3>
                  <p className="text-xs text-[#DDE4D9]/80 leading-relaxed">
                    Directly inspired by the spiritual productivity insights of the Barakah Habits Daily community.
                  </p>
                </div>
              </div>

              {/* Official Social Media Profiles */}
              <div className="p-5 rounded-2xl bg-[#162920]/70 border border-[#D6B56D]/25 mb-8">
                <p className="text-xs uppercase font-mono tracking-wider text-[#D6B56D] mb-3 text-center sm:text-left">
                  Connect With Our Parent Media Channel:
                </p>
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3">
                  <a
                    href={SOCIAL_PROFILES.instagram.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center space-x-2 px-4 py-2 rounded-xl bg-[#0d1a14] border border-[#D6B56D]/30 text-xs font-medium text-[#F6F4ED] hover:border-[#D6B56D] hover:bg-[#1a382d] transition-all"
                  >
                    <span>Instagram</span>
                    <ExternalLink className="w-3 h-3 text-[#D6B56D]" />
                  </a>

                  <a
                    href={SOCIAL_PROFILES.youtube.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center space-x-2 px-4 py-2 rounded-xl bg-[#0d1a14] border border-[#D6B56D]/30 text-xs font-medium text-[#F6F4ED] hover:border-[#D6B56D] hover:bg-[#1a382d] transition-all"
                  >
                    <span>YouTube</span>
                    <ExternalLink className="w-3 h-3 text-[#D6B56D]" />
                  </a>

                  <a
                    href={SOCIAL_PROFILES.tiktok.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center space-x-2 px-4 py-2 rounded-xl bg-[#0d1a14] border border-[#D6B56D]/30 text-xs font-medium text-[#F6F4ED] hover:border-[#D6B56D] hover:bg-[#1a382d] transition-all"
                  >
                    <TikTokIcon className="w-3.5 h-3.5" />
                    <span>TikTok</span>
                    <ExternalLink className="w-3 h-3 text-[#D6B56D]" />
                  </a>
                </div>
              </div>

              {/* Stage Navigation Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-[#D6B56D]/15">
                <button
                  onClick={() => goToStage(0)}
                  className="w-full sm:w-auto px-5 py-3 rounded-full border border-[#D6B56D]/30 text-xs font-mono text-[#DDE4D9] hover:text-[#F6F4ED] hover:border-[#D6B56D] transition-all flex items-center justify-center space-x-2"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>Return to Entrance</span>
                </button>

                <button
                  onClick={() => goToStage(2)}
                  className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-[#D6B56D] text-[#0A1410] text-xs uppercase tracking-wider font-semibold hover:bg-[#E8D6AC] transition-all flex items-center justify-center space-x-2 shadow-lg shadow-[#D6B56D]/20 hover:scale-105"
                >
                  <span>Step Into Survey Chamber</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </section>
        )}

        {/* ============================================================== */}
        {/* STAGE 2: 3D SURVEY CHAMBER */}
        {/* ============================================================== */}
        {currentStage === 2 && (
          <section id="survey" className="max-w-3xl mx-auto w-full py-4 sm:py-8 animate-fadeIn">
            <div className="text-center mb-6">
              <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full border border-[#D6B56D]/30 bg-[#162920]/80 mb-3">
                <span className="w-1.5 h-1.5 rounded-full bg-[#D6B56D]" />
                <span className="text-[11px] uppercase tracking-widest text-[#E8D6AC] font-mono">
                  Community Research &bull; 60 Seconds
                </span>
              </div>
              <h2 className="font-serif text-2xl sm:text-4xl font-bold tracking-tight text-[#F6F4ED] mb-2">
                Help Us Build What You Truly Need.
              </h2>
              <p className="text-xs sm:text-sm text-[#DDE4D9]/80 font-light max-w-lg mx-auto">
                Your direct feedback determines which features will be created for the Digital Taqwa platform.
              </p>
            </div>

            {/* Embedded MultiStepWaitlistForm */}
            <MultiStepWaitlistForm onSuccess={handleSurveySuccess} />

            <div className="mt-6 text-center">
              <button
                onClick={() => goToStage(1)}
                className="inline-flex items-center space-x-1.5 text-xs text-[#DDE4D9]/75 hover:text-[#D6B56D] font-mono transition-colors"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
                <span>Learn why we are conducting market research first</span>
              </button>
            </div>
          </section>
        )}

        {/* ============================================================== */}
        {/* STAGE 3: COMPLETION & SACRED DAWN */}
        {/* ============================================================== */}
        {currentStage === 3 && (
          <section className="max-w-3xl mx-auto w-full py-4 sm:py-8 animate-fadeIn">
            <div className="bg-[#121E18]/90 backdrop-blur-xl border border-[#D6B56D]/40 rounded-3xl p-6 sm:p-10 md:p-12 shadow-2xl text-center text-[#F6F4ED]">
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-[#162920] border-2 border-[#D6B56D] flex items-center justify-center mx-auto mb-6 shadow-[0_0_30px_rgba(214,181,109,0.3)]">
                <CheckCircle2 className="w-8 h-8 sm:w-10 sm:h-10 text-[#D6B56D]" />
              </div>

              <div className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full border border-[#D6B56D]/30 bg-[#14261F] mb-4">
                <span className="text-[11px] uppercase tracking-widest text-[#E8D6AC] font-mono">
                  Feedback Recorded &bull; JazakAllahu Khayran
                </span>
              </div>

              <h2 className="font-serif text-3xl sm:text-5xl font-bold text-[#F6F4ED] mb-4 leading-tight">
                Your Voice Will Shape <br />
                <span className="font-serif italic text-[#D6B56D]">The Future of Digital Taqwa.</span>
              </h2>

              <p className="max-w-xl mx-auto text-sm sm:text-base text-[#DDE4D9]/90 font-light leading-relaxed mb-8">
                Thank you for taking the time to share your perspective. We review every single submission to ensure the product we develop solves genuine everyday problems.
              </p>

              {/* Referral & Access Box */}
              {completedUserData && (
                <div className="p-5 rounded-2xl bg-[#0d1a14] border border-[#D6B56D]/30 mb-8 text-left">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs uppercase font-mono tracking-wider text-[#D6B56D]">
                      Your Early Access Priority Link
                    </span>
                    <span className="text-[10px] text-sage font-mono">
                      Invite friends to test early
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      readOnly
                      value={completedUserData.referralLink}
                      className="flex-1 bg-[#14261F] border border-[#D6B56D]/20 rounded-xl px-3.5 py-2.5 text-xs font-mono text-[#F6F4ED] select-all outline-none"
                    />
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(completedUserData.referralLink);
                        alert("Referral link copied!");
                      }}
                      className="px-4 py-2.5 rounded-xl bg-[#D6B56D] text-[#0A1410] text-xs font-bold uppercase tracking-wider hover:bg-[#E8D6AC] transition-all shrink-0"
                    >
                      Copy
                    </button>
                  </div>
                </div>
              )}

              {/* Parent Brand Community Section */}
              <div className="p-6 rounded-2xl bg-[#162920]/80 border border-[#D6B56D]/25 mb-8">
                <h3 className="font-serif text-xl font-bold text-[#F6F4ED] mb-2">
                  Stay Connected with Barakah Habits Daily
                </h3>
                <p className="text-xs text-[#DDE4D9]/80 mb-5 max-w-md mx-auto">
                  Follow our parent channel for daily reminders, habit-building reflections, and updates on the Digital Taqwa development roadmap.
                </p>
                <div className="flex flex-wrap items-center justify-center gap-3">
                  <a
                    href={SOCIAL_PROFILES.instagram.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-[#0d1a14] border border-[#D6B56D]/30 text-xs font-semibold text-[#F6F4ED] hover:border-[#D6B56D] hover:bg-[#1a382d] transition-all"
                  >
                    <span>Follow on Instagram</span>
                    <ExternalLink className="w-3.5 h-3.5 text-[#D6B56D]" />
                  </a>

                  <a
                    href={SOCIAL_PROFILES.youtube.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-[#0d1a14] border border-[#D6B56D]/30 text-xs font-semibold text-[#F6F4ED] hover:border-[#D6B56D] hover:bg-[#1a382d] transition-all"
                  >
                    <span>Subscribe on YouTube</span>
                    <ExternalLink className="w-3.5 h-3.5 text-[#D6B56D]" />
                  </a>

                  <a
                    href={SOCIAL_PROFILES.tiktok.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-[#0d1a14] border border-[#D6B56D]/30 text-xs font-semibold text-[#F6F4ED] hover:border-[#D6B56D] hover:bg-[#1a382d] transition-all"
                  >
                    <TikTokIcon className="w-3.5 h-3.5" />
                    <span>Follow on TikTok</span>
                    <ExternalLink className="w-3.5 h-3.5 text-[#D6B56D]" />
                  </a>
                </div>
              </div>

              {/* Reset / Return Action */}
              <div className="flex items-center justify-center space-x-4">
                <button
                  onClick={() => goToStage(0)}
                  className="px-6 py-3 rounded-full border border-[#D6B56D]/35 text-xs font-mono uppercase tracking-wider text-[#DDE4D9] hover:text-[#F6F4ED] hover:border-[#D6B56D] transition-all"
                >
                  Return to Sanctuary Entrance
                </button>
              </div>
            </div>
          </section>
        )}
      </div>

      {/* 4. PERSISTENT CINEMATIC QURAN RECITATION EXPERIENCE */}
      <QuranCinematicExperience />

      {/* 5. MINIMAL REFINED FOOTER */}
      <footer className="relative z-20 w-full px-4 sm:px-8 py-6 border-t border-[#D6B56D]/15 bg-[#0A1410]/85 backdrop-blur-md">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-[#DDE4D9]/70">
          <div className="flex items-center space-x-2 text-center sm:text-left">
            <span>&copy; {new Date().getFullYear()} Digital Taqwa.</span>
            <span className="text-[#D6B56D]">&bull;</span>
            <span className="text-[#D6B56D]">A Project by Barakah Habits Daily</span>
          </div>

          <div className="flex items-center space-x-6 text-[11px]">
            <a
              href={SOCIAL_PROFILES.instagram.url}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-[#D6B56D] transition-colors"
            >
              Instagram
            </a>
            <a
              href={SOCIAL_PROFILES.youtube.url}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-[#D6B56D] transition-colors"
            >
              YouTube
            </a>
            <a
              href={SOCIAL_PROFILES.tiktok.url}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-[#D6B56D] transition-colors"
            >
              TikTok
            </a>
            <Link href="/privacy" className="hover:text-[#D6B56D] transition-colors">
              Privacy
            </Link>
            <Link href="/terms" className="hover:text-[#D6B56D] transition-colors">
              Terms
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
