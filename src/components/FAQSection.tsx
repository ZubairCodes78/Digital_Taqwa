"use client";

import { useState } from "react";
import { ChevronDown, HelpCircle } from "lucide-react";
import { TiltCard3D } from "./TiltCard3D";

export function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      q: "What is Digital Taqwa and who is behind it?",
      a: "Digital Taqwa is a mindful Islamic digital companion being developed by Barakah Habits Daily — a global Islamic media channel dedicated to Sunnah habits, mindful mornings, and spiritual presence. It is designed to help Muslims disconnect from worldly noise and build intentional spiritual routines.",
    },
    {
      q: "Why are you conducting market research instead of releasing an app right away?",
      a: "Most technology applications fail because developers build on assumptions rather than understanding actual human struggles. We refuse to build features that clutter your life or force unnecessary complexity. By surveying Muslims worldwide first, we ensure that every single feature serves a genuine spiritual need.",
    },
    {
      q: "When will the application be available for testing?",
      a: "Once our initial research phase concludes, our product roadmap will be finalized directly based on your survey answers. Everyone who completes the research survey and joins the waitlist will receive priority beta testing invitations before public release.",
    },
    {
      q: "Will Digital Taqwa contain advertisements?",
      a: "No. Spiritual technology should foster tranquility and devotion, not commercial distraction. We are committed to a quiet, dignified experience free of intrusive pop-ups, flashing banner ads, or data monetization.",
    },
    {
      q: "How will my survey responses and email be protected?",
      a: "Your survey answers are strictly confidential and used solely for aggregated product research. We will never sell, rent, or share your contact details. You will only receive meaningful project updates and your early beta testing link.",
    },
  ];

  return (
    <section id="faq" className="py-24 md:py-32 relative text-[#F6F4ED] overflow-hidden">
      {/* Ambient background light */}
      <div className="absolute top-1/2 right-1/3 w-[600px] h-[500px] bg-[#19372D]/20 rounded-full blur-[140px] pointer-events-none -z-0" />

      <div className="max-w-4xl mx-auto px-6 sm:px-8 relative z-10">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-[#14261F]/80 backdrop-blur-md border border-[#B79A62]/35 mb-4">
            <span className="w-1.5 h-1.5 rounded-full bg-[#B79A62]" />
            <span className="text-[11px] uppercase tracking-widest text-[#E8D6AC] font-mono font-semibold">
              Frequently Asked Questions
            </span>
          </div>

          <h2 className="font-display text-3xl sm:text-5xl md:text-6xl font-black tracking-tight leading-[1.08] mb-4 text-[#F6F4ED]">
            Answers to Common <br className="hidden sm:inline" />
            <span className="text-gradient-gold">
              Questions.
            </span>
          </h2>
          <p className="text-sm sm:text-base text-[#DDE4D9]/80 font-normal">
            Everything you need to know about our research process, privacy, and community roadmap.
          </p>
        </div>

        {/* FAQ Accordion — Frosted Glassmorphic Cards */}
        <div className="space-y-4">
          {faqs.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={idx}
                className="rounded-3xl bg-[#12241C]/55 backdrop-blur-2xl border border-[#B79A62]/25 hover:border-[#B79A62]/50 hover:bg-[#162D23]/65 transition-all duration-300 shadow-[0_10px_35px_0_rgba(0,0,0,0.45)] overflow-hidden"
              >
                <button
                  onClick={() => setOpenIndex(isOpen ? null : idx)}
                  className="w-full p-6 sm:p-7 text-left flex items-center justify-between gap-4 focus:outline-none"
                  aria-expanded={isOpen}
                >
                  <span className="font-display text-base sm:text-lg font-bold text-[#F6F4ED]">
                    {faq.q}
                  </span>
                  <div className={`w-8 h-8 rounded-full bg-[#19372D] border border-[#B79A62]/30 flex items-center justify-center shrink-0 transition-transform duration-300 ${
                    isOpen ? "rotate-180 bg-[#B79A62] text-[#0A1410]" : "text-[#B79A62]"
                  }`}>
                    <ChevronDown className="w-4 h-4" />
                  </div>
                </button>
                {isOpen && (
                  <div className="px-6 pb-6 sm:px-7 sm:pb-7 text-sm sm:text-base text-[#DDE4D9]/85 font-normal leading-relaxed border-t border-white/5 pt-4">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
