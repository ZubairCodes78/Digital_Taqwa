"use client";

import { Smartphone, BellOff, HeartCrack } from "lucide-react";
import { TiltCard3D } from "./TiltCard3D";

export function TheProblem() {
  const problems = [
    {
      icon: Smartphone,
      title: "The Midnight Screen Trap",
      description:
        "Endless social feeds consume the quiet hours before sleep, leaving us waking up exhausted for Fajr and spiritually depleted.",
    },
    {
      icon: BellOff,
      title: "Fragmented Khushu in Salah",
      description:
        "Notifications, messages, and mental to-do lists invade the sacred minutes on our prayer mat, turning prayer into a rushed chore.",
    },
    {
      icon: HeartCrack,
      title: "The Vanity Streak Trap",
      description:
        "Most Islamic digital tools rely on aggressive streaks and gamification that breed guilt and anxiety, rather than nurturing sincere devotion (Ikhlas).",
    },
  ];

  return (
    <section className="py-24 md:py-32 relative text-[#F6F4ED] overflow-hidden">
      {/* Ambient glass glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] bg-[#B79A62]/5 rounded-full blur-[140px] pointer-events-none -z-0" />

      <div className="max-w-5xl mx-auto px-6 sm:px-8 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-[#14261F]/80 backdrop-blur-md border border-[#B79A62]/35 mb-4 shadow-inner">
            <span className="w-1.5 h-1.5 rounded-full bg-[#B79A62]" />
            <span className="text-[11px] uppercase tracking-widest text-[#E8D6AC] font-mono font-semibold">
              The Reality of 2026
            </span>
          </div>

          <h2 className="font-display text-3xl sm:text-5xl font-black tracking-tight leading-[1.08] mb-6 text-[#F6F4ED]">
            Our Phones Connect Us to the World, <br className="hidden sm:inline" />
            <span className="text-gradient-gold">
              But Disconnect Us from the Divine.
            </span>
          </h2>

          <p className="text-base sm:text-lg text-[#DDE4D9]/85 font-normal leading-relaxed max-w-2xl mx-auto">
            We live in an era of continuous digital noise. While modern technology promises efficiency, it often leaves our souls fragmented, rushed, and spiritually restless.
          </p>
        </div>

        {/* 3 Core Relatable Pain Points — Frosted Glassmorphism with 3D Tilt */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 mb-14">
          {problems.map((item, idx) => {
            const Icon = item.icon;
            return (
              <TiltCard3D key={idx} maxTilt={8}>
                <div className="h-full p-6 sm:p-8 rounded-3xl bg-[#12241C]/55 backdrop-blur-2xl border border-[#B79A62]/25 hover:border-[#B79A62]/60 hover:bg-[#162D23]/70 transition-all duration-300 shadow-[0_16px_40px_0_rgba(0,0,0,0.5)] group flex flex-col justify-between">
                  <div>
                    <div className="w-12 h-12 rounded-2xl bg-[#19372D]/90 border border-[#B79A62]/40 text-[#B79A62] flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-lg shadow-[#19372D]/50">
                      <Icon className="w-6 h-6" />
                    </div>
                    <h3 className="font-display text-xl font-bold mb-3 text-[#F6F4ED] group-hover:text-[#E8D6AC] transition-colors">
                      {item.title}
                    </h3>
                    <p className="text-sm text-[#DDE4D9]/80 font-normal leading-relaxed">
                      {item.description}
                    </p>
                  </div>

                  <div className="pt-6 mt-6 border-t border-white/5 flex items-center justify-between">
                    <span className="text-[10px] font-mono uppercase tracking-widest text-[#B79A62]/70">
                      Digital Struggle #{idx + 1}
                    </span>
                    <span className="w-1.5 h-1.5 rounded-full bg-[#B79A62] opacity-75 group-hover:scale-150 transition-transform" />
                  </div>
                </div>
              </TiltCard3D>
            );
          })}
        </div>

        {/* Transition statement — Glassmorphic Pillar Banner */}
        <TiltCard3D maxTilt={4}>
          <div className="p-8 sm:p-10 rounded-3xl bg-[#142920]/65 backdrop-blur-2xl border border-[#B79A62]/35 shadow-[0_12px_45px_0_rgba(0,0,0,0.55)] text-center max-w-2xl mx-auto">
            <p className="font-display text-lg sm:text-2xl font-black text-[#F6F4ED] leading-snug">
              &ldquo;What if your phone helped you remember Allah, instead of pulling you away?&rdquo;
            </p>
            <span className="text-xs uppercase tracking-wider font-mono text-[#B79A62] mt-3 block font-semibold">
              The Founding Premise of Digital Taqwa
            </span>
          </div>
        </TiltCard3D>
      </div>
    </section>
  );
}
