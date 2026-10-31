"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import dynamic from "next/dynamic";
import { ArrowRight, ArrowDown } from "lucide-react";
import { SwipeExploreButton } from "./SwipeExploreButton";

// Load 3D scene only on capable desktop devices to guarantee instant mobile performance
const ThreeIslamicScene = dynamic(
  () => import("./ThreeIslamicScene").then((mod) => mod.ThreeIslamicScene),
  {
    ssr: false,
    loading: () => null,
  }
);

export function Hero() {
  const [deviceTier, setDeviceTier] = useState<"low" | "high">("low");

  useEffect(() => {
    // Detect mobile, low-power devices, or reduced motion preference
    const isReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const isTouchMobile = window.innerWidth < 1024 || (navigator.maxTouchPoints && navigator.maxTouchPoints > 1);
    const cores = navigator.hardwareConcurrency || 4;

    // Use lightweight architectural background on mobile & low-powered hardware
    if (!isReducedMotion && !isTouchMobile && cores >= 4) {
      setDeviceTier("high");
    } else {
      setDeviceTier("low");
    }
  }, []);

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section className="relative min-h-[96vh] sm:min-h-screen flex items-center justify-center pt-28 pb-20 md:pt-36 md:pb-24 overflow-hidden text-[#F6F4ED]">
      {/* 1. ADAPTIVE ARCHITECTURAL ENVIRONMENT (3D for High-End Desktop, Lightweight SVG for Mobile/Low-End) */}
      {deviceTier === "high" ? (
        <ThreeIslamicScene fixed />
      ) : (
        <div className="absolute inset-0 pointer-events-none -z-10 overflow-hidden" aria-hidden="true">
          <div className="absolute inset-0 bg-radial-gradient from-[#142A21] via-[#0D1C15] to-[#0A1410] opacity-90" />
          <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[340px] sm:w-[500px] h-[340px] sm:h-[500px] bg-[#B79A62]/6 rounded-full blur-[90px]" />
          <svg
            className="absolute top-16 left-1/2 -translate-x-1/2 w-[90vw] max-w-[680px] h-[75vh] opacity-20 pointer-events-none"
            viewBox="0 0 400 600"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M 60 580 L 60 280 C 60 170 140 100 200 40 C 260 100 340 170 340 280 L 340 580"
              stroke="#B79A62"
              strokeWidth="1.5"
              strokeDasharray="4 4"
            />
            <path
              d="M 80 580 L 80 290 C 80 190 150 125 200 70 C 250 125 320 190 320 290 L 320 580"
              stroke="#E8D6AC"
              strokeWidth="1"
              strokeOpacity="0.6"
            />
            <circle cx="200" cy="40" r="3" fill="#B79A62" />
          </svg>
        </div>
      )}

      {/* Atmospheric depth vignette & soft lighting masks */}
      <div className="absolute inset-0 bg-radial-gradient from-transparent via-[#0A1410]/40 to-[#0A1410]/95 pointer-events-none" />
      <div className="absolute bottom-0 left-0 right-0 h-36 bg-gradient-to-t from-[#0A1410] via-[#0A1410]/80 to-transparent pointer-events-none" />

      {/* 2. HERO FOREGROUND CONTENT */}
      <div className="relative z-10 max-w-5xl mx-auto px-6 sm:px-8 text-center flex flex-col items-center">
        {/* Brand Logo — Actual Supplied Logo with Modern Floating Glow Animation */}
        <div className="relative w-48 h-24 sm:w-60 sm:h-32 md:w-72 md:h-36 mx-auto mb-6 sm:mb-8 transition-transform duration-700 hover:scale-105 animate-float">
          <Image
            src="/logo.png"
            alt="Digital Taqwa"
            fill
            sizes="(max-width: 640px) 192px, (max-width: 768px) 240px, 288px"
            priority
            className="object-contain drop-shadow-[0_16px_36px_rgba(183,154,98,0.45)]"
          />
        </div>

        {/* Small Attribution Tag with Shimmer Animation */}
        <div className="shimmer-badge inline-flex items-center space-x-2.5 px-4 py-1.5 rounded-full border border-[#B79A62]/40 bg-[#14261F]/90 backdrop-blur-md mb-8 shadow-inner hover:border-[#B79A62] transition-colors">
          <div className="relative w-4 h-4 rounded-full overflow-hidden border border-[#B79A62]/60 shrink-0">
            <Image
              src="/barakah-habits-logo.jpg"
              alt="Barakah Habits Daily"
              fill
              sizes="16px"
              className="object-cover"
            />
          </div>
          <span className="text-[11px] sm:text-xs uppercase tracking-widest text-[#E8D6AC] font-mono font-semibold">
            A PROJECT BY BARAKAH HABITS DAILY
          </span>
        </div>

        {/* Hero Headline — Modern Luxury Display Font (No Times New Roman / Serif) */}
        <h1 className="font-display text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-black tracking-tight leading-[1.06] mb-6 text-[#F6F4ED] max-w-4xl">
          Make Space for{" "}
          <span className="text-gradient-gold block sm:inline font-black tracking-tight">
            What Truly Matters.
          </span>
        </h1>

        {/* Supporting Copy */}
        <p className="max-w-2xl mx-auto text-base sm:text-xl md:text-2xl text-[#DDE4D9] font-normal leading-relaxed mb-10 px-2 tracking-normal">
          Reconnect with Allah. Build better habits. Live with intention.
        </p>

        {/* Primary & Secondary CTAs with Modern Direction Animations */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-4 sm:gap-5 w-full sm:w-auto mb-14 px-4 sm:px-0">
          <button
            onClick={() => scrollTo("waitlist")}
            className="group relative px-8 sm:px-10 py-4 rounded-full bg-[#B79A62] text-[#0A1410] text-sm uppercase tracking-wider font-extrabold hover:bg-[#D8C296] transition-all flex items-center justify-center gap-2 shadow-2xl shadow-[#B79A62]/35 hover:shadow-[#B79A62]/55 hover:-translate-y-1 active:translate-y-0"
          >
            <span>JOIN THE WAITLIST</span>
            <ArrowRight className="w-4 h-4 shrink-0 transition-transform duration-300 group-hover:translate-x-1" />
          </button>

          <button
            onClick={() => scrollTo("vision")}
            className="px-7 sm:px-9 py-4 rounded-full border border-[#B79A62]/40 bg-[#111713]/60 text-[#F6F4ED] text-sm uppercase tracking-wider font-bold hover:border-[#B79A62] hover:bg-[#19372D]/70 transition-all flex items-center justify-center gap-2 backdrop-blur-md hover:-translate-y-0.5 active:translate-y-0"
          >
            <span>DISCOVER OUR VISION</span>
            <ArrowDown className="w-3.5 h-3.5 shrink-0 text-[#B79A62]" />
          </button>
        </div>

        {/* Unique Sacred Mihrab-Style Swipe & Scroll Trigger */}
        <SwipeExploreButton targetId="vision" className="mt-8 sm:mt-12" />
      </div>
    </section>
  );
}
