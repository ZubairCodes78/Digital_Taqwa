"use client";

import { useState } from "react";
import Image from "next/image";
import {
  Smartphone,
  Shield,
  Clock,
  BookOpen,
  CheckCircle2,
  TrendingUp,
  RotateCcw,
} from "lucide-react";

export function InteractiveProductExperience() {
  const [activeTab, setActiveTab] = useState<"habits" | "friction" | "analytics">("habits");

  return (
    <section id="experience" className="py-24 md:py-36 bg-[#0E1B15] text-ivory relative overflow-hidden">
      {/* Ambient background glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-[#D6B56D]/5 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-[#19372D]/40 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-6xl mx-auto px-6 sm:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 md:mb-20">
          <span className="text-xs uppercase tracking-widest text-[#D6B56D] font-mono font-medium block mb-3">
            Section 04 &bull; Concept Exploration
          </span>
          <h2 className="font-serif text-3xl sm:text-5xl md:text-6xl font-bold tracking-tight text-ivory leading-[1.1] mb-4">
            An Intimate Glimpse Into <br />
            <span className="font-serif italic font-normal text-[#D6B56D]">
              The Companion App.
            </span>
          </h2>
          <p className="text-base sm:text-lg text-sage/90 font-light leading-relaxed max-w-2xl mx-auto">
            Explore concepts for a peaceful, friction-first interface designed to anchor your mind around Allah rather than commercial algorithms.
          </p>

          {/* Interactive Screen Switcher Pills */}
          <div className="inline-flex p-1.5 rounded-full bg-[#162720] border border-[#D6B56D]/20 mt-8 gap-1 shadow-xl">
            <button
              onClick={() => setActiveTab("habits")}
              className={`px-4 sm:px-5 py-2 rounded-full text-xs uppercase tracking-wider font-medium transition-all ${
                activeTab === "habits"
                  ? "bg-[#D6B56D] text-[#0E1B15] font-semibold shadow-md"
                  : "text-sage hover:text-ivory"
              }`}
            >
              01. Sacred Daily Habits
            </button>
            <button
              onClick={() => setActiveTab("friction")}
              className={`px-4 sm:px-5 py-2 rounded-full text-xs uppercase tracking-wider font-medium transition-all ${
                activeTab === "friction"
                  ? "bg-[#D6B56D] text-[#0E1B15] font-semibold shadow-md"
                  : "text-sage hover:text-ivory"
              }`}
            >
              02. Distraction Shield
            </button>
            <button
              onClick={() => setActiveTab("analytics")}
              className={`px-4 sm:px-5 py-2 rounded-full text-xs uppercase tracking-wider font-medium transition-all ${
                activeTab === "analytics"
                  ? "bg-[#D6B56D] text-[#0E1B15] font-semibold shadow-md"
                  : "text-sage hover:text-ivory"
              }`}
            >
              03. Barakah Growth
            </button>
          </div>
        </div>

        {/* Realistic Mobile Device Mockup Stage */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Context Column */}
          <div className="lg:col-span-4 order-2 lg:order-1 space-y-6">
            <div className="p-6 rounded-3xl bg-[#14261F]/80 border border-[#D6B56D]/15 backdrop-blur-md">
              <span className="text-[10px] uppercase font-mono tracking-widest text-[#D6B56D] font-semibold block mb-2">
                Concept Philosophy
              </span>
              <h3 className="font-serif text-2xl font-bold text-ivory mb-2">
                {activeTab === "habits" && "Dignified Habit Anchors"}
                {activeTab === "friction" && "Compassionate Friction"}
                {activeTab === "analytics" && "Sincerity Over Vanity Streaks"}
              </h3>
              <p className="text-xs sm:text-sm text-sage/85 leading-relaxed font-light">
                {activeTab === "habits" &&
                  "No overwhelming checklists. The companion syncs with prayer times, presenting small, high-reward prophetic habits when you are most receptive."}
                {activeTab === "friction" &&
                  "Before entering distracting social media feeds, Digital Taqwa introduces a calming 5-second pause with a short Quranic reflection or Dhikr."}
                {activeTab === "analytics" &&
                  "Progress is measured by calm consistency (Istiqamah) rather than anxiety-inducing streaks. If you miss a prayer, it encourages repentance, not guilt."}
              </p>
            </div>

            <div className="p-4 rounded-2xl border border-white/10 bg-white/5 text-xs text-sage/75 space-y-2 font-mono">
              <div className="flex items-center justify-between">
                <span>UI Architecture:</span>
                <span className="text-ivory">Minimalist Dark Glass</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Validation State:</span>
                <span className="text-[#D6B56D]">Community Voted (Pre-Launch)</span>
              </div>
            </div>
          </div>

          {/* Center Mobile Phone Showcase with 3D Depth */}
          <div className="lg:col-span-4 order-1 lg:order-2 flex justify-center">
            {/* Phone Outer Shell */}
            <div className="relative w-[300px] sm:w-[320px] h-[610px] bg-[#0A100D] rounded-[48px] p-3 shadow-[0_25px_60px_rgba(0,0,0,0.8),0_0_40px_rgba(214,181,109,0.15)] border-4 border-[#253A30]">
              {/* Dynamic Island / Speaker Notch */}
              <div className="absolute top-6 left-1/2 -translate-x-1/2 w-28 h-5 bg-black rounded-full z-30 flex items-center justify-center">
                <div className="w-2.5 h-2.5 rounded-full bg-[#182820] mr-2" />
                <div className="w-2 h-2 rounded-full bg-[#2a4538]" />
              </div>

              {/* Inner Screen Surface */}
              <div className="w-full h-full rounded-[40px] bg-[#0E1A14] overflow-hidden p-5 pt-10 text-ivory flex flex-col justify-between border border-white/5 relative">
                {/* Status Bar */}
                <div className="flex items-center justify-between text-[10px] font-mono text-sage/75 mb-4">
                  <span>9:41</span>
                  <div className="flex items-center space-x-1.5">
                    <span className="w-2 h-2 rounded-full bg-[#D6B56D]" />
                    <span>Taqwa Mode</span>
                  </div>
                </div>

                {/* DYNAMIC SCREEN CONTENT BASED ON ACTIVE TAB */}
                {activeTab === "habits" && (
                  <div className="space-y-3.5 flex-1 animate-in fade-in duration-300">
                    <div className="flex items-center justify-between pb-2 border-b border-white/10">
                      <div>
                        <span className="text-[10px] uppercase font-mono text-[#D6B56D] block">
                          Next Sacred Time
                        </span>
                        <h4 className="font-serif text-lg font-bold text-ivory">
                          Asr Prayer &bull; in 42m
                        </h4>
                      </div>
                      <span className="text-xs font-mono text-[#D6B56D] bg-[#D6B56D]/15 px-2 py-0.5 rounded-full">
                        3:48 PM
                      </span>
                    </div>

                    {/* Today's Habits List */}
                    <span className="text-[10px] uppercase tracking-wider text-sage font-mono block pt-1">
                      Today&apos;s Sunnah Anchors
                    </span>

                    <div className="p-3 rounded-2xl bg-[#14261E] border border-white/10 flex items-center justify-between">
                      <div className="flex items-center space-x-2.5">
                        <CheckCircle2 className="w-4 h-4 text-[#D6B56D]" />
                        <span className="text-xs text-ivory font-medium">Fajr in Congregation</span>
                      </div>
                      <span className="text-[10px] font-mono text-[#D6B56D]">Completed</span>
                    </div>

                    <div className="p-3 rounded-2xl bg-[#14261E] border border-white/10 flex items-center justify-between">
                      <div className="flex items-center space-x-2.5">
                        <BookOpen className="w-4 h-4 text-[#D6B56D]" />
                        <span className="text-xs text-ivory font-medium">Read 2 Pages Quran</span>
                      </div>
                      <span className="text-[10px] font-mono text-sage">1/2 Surah Mulk</span>
                    </div>

                    <div className="p-3 rounded-2xl bg-[#14261E] border border-white/10 flex items-center justify-between">
                      <div className="flex items-center space-x-2.5">
                        <Clock className="w-4 h-4 text-sage" />
                        <span className="text-xs text-sage font-medium">Evening Adhkar</span>
                      </div>
                      <span className="text-[10px] font-mono text-sage/75">After Asr</span>
                    </div>
                  </div>
                )}

                {activeTab === "friction" && (
                  <div className="space-y-4 flex-1 animate-in fade-in duration-300 flex flex-col justify-center text-center px-2">
                    <div className="w-12 h-12 rounded-full bg-[#D6B56D]/15 border border-[#D6B56D]/30 flex items-center justify-center mx-auto text-[#D6B56D]">
                      <Shield className="w-6 h-6" />
                    </div>

                    <div>
                      <span className="text-[10px] font-mono uppercase text-[#D6B56D] tracking-wider block">
                        Intentional Friction
                      </span>
                      <h4 className="font-serif text-xl font-bold text-ivory mt-1">
                        Pause Before You Scroll
                      </h4>
                    </div>

                    <p className="text-xs text-sage/85 leading-relaxed font-light italic bg-[#15251E] p-3 rounded-2xl border border-white/10">
                      &ldquo;Remember your intention. Take a quiet breath and recite: SubhanAllah wa bihamdihi.&rdquo;
                    </p>

                    <div className="space-y-2 pt-2">
                      <button className="w-full py-2.5 rounded-full bg-[#D6B56D] text-[#0A100D] text-xs font-semibold uppercase tracking-wider">
                        I am Mindful &bull; Proceed
                      </button>
                      <button className="w-full py-2 rounded-full border border-white/20 text-sage text-xs">
                        Close App & Recite Dhikr
                      </button>
                    </div>
                  </div>
                )}

                {activeTab === "analytics" && (
                  <div className="space-y-3.5 flex-1 animate-in fade-in duration-300">
                    <div className="pb-2 border-b border-white/10">
                      <span className="text-[10px] uppercase font-mono text-[#D6B56D] block">
                        Weekly Istiqamah
                      </span>
                      <h4 className="font-serif text-lg font-bold text-ivory">
                        Consistency &bull; 92% Sacred Focus
                      </h4>
                    </div>

                    {/* Chart Mockup */}
                    <div className="p-3 rounded-2xl bg-[#14261E] border border-white/10">
                      <div className="flex items-end justify-between h-20 pt-2 px-1">
                        {[60, 80, 95, 70, 100, 85, 90].map((h, i) => (
                          <div key={i} className="flex flex-col items-center gap-1">
                            <div
                              className="w-4 bg-gradient-to-t from-forest to-[#D6B56D] rounded-t-md"
                              style={{ height: `${h * 0.7}px` }}
                            />
                            <span className="text-[8px] font-mono text-sage/70">
                              {["M", "T", "W", "T", "F", "S", "S"][i]}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="p-3 rounded-2xl bg-[#14261E] border border-white/10 text-xs flex items-center justify-between">
                      <span className="text-sage">Mindful Screen Time Saved:</span>
                      <span className="font-mono text-[#D6B56D] font-bold">2h 15m / day</span>
                    </div>
                  </div>
                )}

                {/* Bottom Navigation Mockup */}
                <div className="pt-3 border-t border-white/10 flex items-center justify-around text-sage/60 text-xs">
                  <span className="text-[#D6B56D] font-semibold text-[10px]">Today</span>
                  <span className="text-[10px]">Quran</span>
                  <span className="text-[10px]">Friction</span>
                  <span className="text-[10px]">Insights</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column Highlights */}
          <div className="lg:col-span-4 order-3 space-y-6">
            <div className="p-6 rounded-3xl bg-[#14261F]/80 border border-[#D6B56D]/15 backdrop-blur-md">
              <span className="text-[10px] uppercase font-mono tracking-widest text-[#D6B56D] font-semibold block mb-2">
                Designed for Muslims
              </span>
              <h3 className="font-serif text-2xl font-bold text-ivory mb-2">
                Built With the Community
              </h3>
              <p className="text-xs sm:text-sm text-sage/85 leading-relaxed font-light mb-4">
                We are building these interfaces based on direct input from our waitlist community. Register today to vote on the features you want built first.
              </p>
              <a
                href="#waitlist"
                className="inline-flex items-center space-x-1.5 text-xs uppercase font-semibold text-[#D6B56D] hover:underline tracking-wider"
              >
                <span>Shape the Future App &rarr;</span>
              </a>
            </div>

            <div className="p-4 rounded-2xl border border-white/10 bg-white/5 text-xs text-sage/75 space-y-1.5 font-mono">
              <p>&bull; 100% Ad-Free Concept</p>
              <p>&bull; No Spiritual Exploitation</p>
              <p>&bull; Offline-First Core Functions</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
