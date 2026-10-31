"use client";

import Image from "next/image";
import { SOCIAL_PROFILES } from "@/lib/constants";
import { ArrowRight, Compass, ShieldCheck, Instagram, Youtube, ExternalLink } from "lucide-react";
import { TikTokIcon } from "./icons/TikTokIcon";
import { TiltCard3D } from "./TiltCard3D";

export function TheVision() {
  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section id="vision" className="py-24 md:py-32 relative text-[#F6F4ED] overflow-hidden">
      {/* Ambient background light */}
      <div className="absolute top-1/3 right-1/4 w-[600px] h-[500px] bg-[#19372D]/30 rounded-full blur-[140px] pointer-events-none -z-0" />

      <div className="max-w-5xl mx-auto px-6 sm:px-8 relative z-10">
        {/* Parent Content Brand Attribution Card — Glassmorphic 3D Card */}
        <div className="mb-14">
          <TiltCard3D maxTilt={5}>
            <div className="p-8 sm:p-10 rounded-3xl bg-[#12241C]/65 backdrop-blur-2xl border border-[#B79A62]/30 shadow-[0_16px_50px_0_rgba(0,0,0,0.55)] flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
              <div className="flex items-start sm:items-center space-x-5">
                <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-2xl overflow-hidden border border-[#B79A62]/50 shadow-2xl shrink-0 group-hover:scale-105 transition-transform bg-[#0a1410] ring-2 ring-[#B79A62]/20">
                  <Image
                    src="/barakah-habits-logo.jpg"
                    alt="Barakah Habits Daily Logo"
                    fill
                    sizes="(max-width: 640px) 64px, 80px"
                    className="object-cover"
                    priority
                  />
                </div>
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="text-[11px] uppercase tracking-widest text-[#B79A62] font-mono font-semibold">
                      Parent Media Channel
                    </span>
                    <span className="w-1.5 h-1.5 rounded-full bg-[#B79A62]" />
                    <span className="text-xs text-[#DDE4D9]/70 font-mono">Global Islamic Community</span>
                  </div>
                  <h3 className="font-display text-2xl sm:text-3xl font-black text-[#F6F4ED] mt-0.5">
                    Barakah Habits Daily
                  </h3>
                  <p className="text-xs sm:text-sm text-[#DDE4D9]/80 font-normal mt-1 max-w-xl leading-relaxed">
                    Inspiring Muslims across Instagram, YouTube, and TikTok toward intentional Sunnah habits, mindful mornings, and spiritual presence.
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-3 w-full md:w-auto justify-end shrink-0">
                <div className="flex items-center space-x-2">
                  <a
                    href={SOCIAL_PROFILES.instagram.url}
                    target="_blank"
                    rel="noreferrer"
                    aria-label="Instagram"
                    className="w-10 h-10 rounded-full bg-white/5 border border-white/10 hover:border-[#B79A62] text-[#DDE4D9] hover:text-[#B79A62] flex items-center justify-center transition-all"
                    title="Instagram"
                  >
                    <Instagram className="w-4 h-4" />
                  </a>
                  <a
                    href={SOCIAL_PROFILES.youtube.url}
                    target="_blank"
                    rel="noreferrer"
                    aria-label="YouTube"
                    className="w-10 h-10 rounded-full bg-white/5 border border-white/10 hover:border-[#B79A62] text-[#DDE4D9] hover:text-[#B79A62] flex items-center justify-center transition-all"
                    title="YouTube"
                  >
                    <Youtube className="w-4 h-4" />
                  </a>
                  <a
                    href={SOCIAL_PROFILES.tiktok.url}
                    target="_blank"
                    rel="noreferrer"
                    aria-label="TikTok"
                    className="w-10 h-10 rounded-full bg-white/5 border border-white/10 hover:border-[#B79A62] text-[#DDE4D9] hover:text-[#B79A62] flex items-center justify-center transition-all"
                    title="TikTok"
                  >
                    <TikTokIcon className="w-4 h-4" />
                  </a>
                </div>

                <a
                  href={SOCIAL_PROFILES.instagram.url}
                  target="_blank"
                  rel="noreferrer"
                  className="text-xs font-bold uppercase tracking-wider px-5 py-2.5 rounded-full bg-[#B79A62] text-[#0A1410] hover:bg-[#D8C296] transition-all flex items-center space-x-2 shadow-lg hover:scale-105 active:scale-95"
                >
                  <span>Channels</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          </TiltCard3D>
        </div>

        {/* Short Vision & Research Mandate — Frosted Glass Container */}
        <TiltCard3D maxTilt={3}>
          <div className="p-8 sm:p-12 md:p-14 rounded-3xl bg-[#10221A]/60 backdrop-blur-2xl border border-[#B79A62]/35 shadow-[0_20px_60px_0_rgba(0,0,0,0.6)] text-center">
            <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-[#14261F]/80 border border-[#B79A62]/35 mb-4">
              <span className="w-1.5 h-1.5 rounded-full bg-[#B79A62]" />
              <span className="text-[11px] uppercase tracking-widest text-[#E8D6AC] font-mono font-semibold">
                Our Purpose &bull; Research Stage
              </span>
            </div>

            <h2 className="font-display text-3xl sm:text-5xl md:text-6xl font-black tracking-tight text-[#F6F4ED] leading-[1.08] mb-6">
              A Peaceful Digital Sanctuary, <br />
              <span className="text-gradient-gold">
                Shaped By Your Real Needs.
              </span>
            </h2>

            <p className="text-base sm:text-lg text-[#DDE4D9]/90 font-normal leading-relaxed mb-8 max-w-2xl mx-auto">
              Digital technology often pulls us into worldly distractions when what our souls truly need is sacred quiet. Digital Taqwa was born from a simple conviction: <em>our devices should help us remember Allah, not distract us from Him.</em>
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-left mb-10">
              <div className="p-6 rounded-2xl bg-[#142920]/60 backdrop-blur-xl border border-white/10 hover:border-[#B79A62]/40 transition-colors">
                <div className="flex items-center space-x-3 mb-3">
                  <Compass className="w-5 h-5 text-[#B79A62] shrink-0" />
                  <h4 className="font-display font-bold text-base text-[#F6F4ED]">
                    The App Is Not Finalized
                  </h4>
                </div>
                <p className="text-xs sm:text-sm text-[#DDE4D9]/80 font-normal leading-relaxed">
                  We refuse to guess features behind closed doors. We are surveying Muslims globally to understand actual daily struggles &mdash; from phone distraction during prayer to Quran consistency.
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-[#142920]/60 backdrop-blur-xl border border-white/10 hover:border-[#B79A62]/40 transition-colors">
                <div className="flex items-center space-x-3 mb-3">
                  <ShieldCheck className="w-5 h-5 text-[#B79A62] shrink-0" />
                  <h4 className="font-display font-bold text-base text-[#F6F4ED]">
                    Zero Ads. Zero Vanity Streaks.
                  </h4>
                </div>
                <p className="text-xs sm:text-sm text-[#DDE4D9]/80 font-normal leading-relaxed">
                  We reject intrusive pop-ups, noisy notifications, and guilt-inducing red streaks. Our goal is sincere, quiet spiritual utility built with excellence (<em>Ihsan</em>).
                </p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <button
                onClick={() => scrollTo("waitlist")}
                className="px-8 py-4 rounded-full bg-[#B79A62] text-[#0A1410] text-xs uppercase tracking-wider font-extrabold hover:bg-[#D8C296] transition-all flex items-center space-x-2 shadow-xl hover:scale-105 active:scale-95"
              >
                <span>Shape Digital Taqwa (1-Min Survey)</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </TiltCard3D>
      </div>
    </section>
  );
}
