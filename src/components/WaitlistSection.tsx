"use client";

import { MultiStepWaitlistForm } from "./MultiStepWaitlistForm";

export function WaitlistSection() {
  return (
    <section id="waitlist" className="py-24 md:py-32 relative text-[#F6F4ED] overflow-hidden">
      {/* Anchor for survey navigation */}
      <div id="survey" className="absolute -top-24" />

      {/* Atmospheric golden glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-[#B79A62]/5 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-4xl mx-auto px-6 sm:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-10 md:mb-14">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-[#19372D]/60 border border-[#B79A62]/30 mb-4 shadow-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-[#B79A62]" />
            <span className="text-[11px] uppercase tracking-widest text-[#E8D6AC] font-mono font-medium">
              Community Product Research &bull; Early Access Waitlist
            </span>
          </div>

          <h2 className="font-display text-3xl sm:text-5xl md:text-6xl font-black tracking-tight leading-[1.08] mb-4 text-[#F6F4ED]">
            Shape the Future of <br className="hidden sm:inline" />
            <span className="text-gradient-gold block sm:inline font-black">
              Digital Taqwa.
            </span>
          </h2>

          <p className="text-base sm:text-lg text-[#DDE4D9]/90 font-light leading-relaxed max-w-2xl mx-auto">
            Your honest feedback directly guides which features will be developed. Take 60 seconds to tell us what kind of Islamic digital experience would truly help your spiritual journey.
          </p>

          <p className="text-xs text-[#B79A62]/90 font-mono mt-3">
            Early respondents receive priority access to our initial beta testing cohort.
          </p>
        </div>

        {/* Multi-Step Waitlist & Research Form */}
        <MultiStepWaitlistForm />

        {/* Minimal Disclaimer */}
        <div className="mt-8 text-center text-xs text-[#DDE4D9]/60 font-mono">
          Strictly confidential &bull; No spam &bull; We build with intention &amp; Barakah
        </div>
      </div>
    </section>
  );
}
