"use client";

import { ArrowRight } from "lucide-react";
import { TiltCard3D } from "./TiltCard3D";
import { trackCtaClick } from "@/lib/analytics";

export function CallToActionBanner() {
  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="py-24 relative text-[#F6F4ED] overflow-hidden">
      <div className="max-w-5xl mx-auto px-6 sm:px-8 text-center relative z-10">
        <TiltCard3D maxTilt={4}>
          <div className="p-10 sm:p-16 rounded-3xl bg-[#12241C]/65 backdrop-blur-2xl border border-[#B79A62]/40 shadow-[0_24px_70px_0_rgba(0,0,0,0.65)] relative overflow-hidden">
            {/* Glowing inner aura */}
            <div className="absolute -top-24 -left-24 w-80 h-80 bg-[#B79A62]/15 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -bottom-24 -right-24 w-80 h-80 bg-[#19372D]/70 rounded-full blur-3xl pointer-events-none" />

            <div className="relative z-10 max-w-2xl mx-auto">
              <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-[#19372D]/90 border border-[#B79A62]/40 mb-6 shadow-inner">
                <span className="w-1.5 h-1.5 rounded-full bg-[#B79A62]" />
                <span className="text-[11px] uppercase tracking-widest text-[#E8D6AC] font-mono font-semibold">
                  Founding Research Cohort
                </span>
              </div>

              <h2 className="font-display text-3xl sm:text-5xl md:text-6xl font-black tracking-tight leading-[1.08] mb-4 text-[#F6F4ED]">
                Make Space for <br />
                <span className="text-gradient-gold">
                  What Truly Matters.
                </span>
              </h2>

              <p className="text-base sm:text-lg text-[#DDE4D9]/85 font-normal leading-relaxed mb-8">
                Take 60 seconds to share your thoughts and become a founding voice in the creation of Digital Taqwa.
              </p>

              <button
                onClick={() => {
                  trackCtaClick("shape_app_join_waitlist", "cta_banner");
                  scrollTo("waitlist");
                }}
                className="px-10 py-4 rounded-full bg-[#B79A62] text-[#0A1410] text-sm uppercase tracking-wider font-extrabold hover:bg-[#D8C296] transition-all inline-flex items-center space-x-2 shadow-2xl hover:scale-105 active:scale-95"
              >
                <span>Shape the App &bull; Join Waitlist</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </TiltCard3D>
      </div>
    </section>
  );
}
