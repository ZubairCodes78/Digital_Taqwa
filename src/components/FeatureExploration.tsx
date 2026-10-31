"use client";

import { useState } from "react";
import { PROPOSED_FEATURES } from "@/lib/constants";
import {
  ArrowRight,
  CheckCircle2,
  Compass,
  BookOpen,
  Clock,
  ShieldAlert,
  Bell,
  Target,
  Flame,
} from "lucide-react";

export function FeatureExploration() {
  const [activeFeature, setActiveFeature] = useState<string>(PROPOSED_FEATURES[0].id);

  const getFeatureIcon = (id: string) => {
    switch (id) {
      case "habit_tracker":
        return <CheckCircle2 className="w-5 h-5 text-[#D6B56D]" />;
      case "quran_consistency":
        return <BookOpen className="w-5 h-5 text-[#D6B56D]" />;
      case "prayer_tracker":
        return <Clock className="w-5 h-5 text-[#D6B56D]" />;
      case "screen_distraction":
        return <ShieldAlert className="w-5 h-5 text-[#D6B56D]" />;
      case "daily_reminders":
        return <Bell className="w-5 h-5 text-[#D6B56D]" />;
      case "deen_goals":
        return <Target className="w-5 h-5 text-[#D6B56D]" />;
      case "progress_streaks":
        return <Flame className="w-5 h-5 text-[#D6B56D]" />;
      default:
        return <Compass className="w-5 h-5 text-[#D6B56D]" />;
    }
  };

  return (
    <section id="features" className="py-24 md:py-36 bg-[#ECE8DF] text-charcoal border-t border-charcoal/10 relative">
      <div className="max-w-6xl mx-auto px-6 sm:px-8">
        {/* Section Header */}
        <div className="max-w-3xl mb-16 md:mb-20">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-forest/10 border border-forest/15 mb-3">
            <span className="w-1.5 h-1.5 rounded-full bg-forest" />
            <span className="text-[11px] uppercase tracking-widest text-forest font-mono font-medium">
              Concept Architecture &bull; In Community Research
            </span>
          </div>

          <h2 className="font-serif text-3xl sm:text-5xl md:text-6xl font-bold tracking-tight text-forest leading-[1.12] mb-4">
            Built Around What <br />
            <span className="font-serif italic font-normal text-gold-dark">
              Matters to You.
            </span>
          </h2>
          <p className="text-base sm:text-lg text-charcoal-muted font-light leading-relaxed">
            We are actively validating seven core modules designed to protect your attention, elevate your daily prayers, and turn good intentions into unbroken habits.
          </p>
        </div>

        {/* Feature Interactive Layout (Editorial List + Live Preview Card) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start mb-16">
          {/* Left Column: Numbered Interactive Features */}
          <div className="lg:col-span-7 divide-y divide-charcoal/15 border-t border-b border-charcoal/15">
            {PROPOSED_FEATURES.map((feature) => {
              const isSelected = activeFeature === feature.id;
              return (
                <div
                  key={feature.id}
                  onClick={() => setActiveFeature(feature.id)}
                  className={`py-5 sm:py-6 cursor-pointer transition-all duration-200 group ${
                    isSelected ? "bg-white/40 -mx-3 px-3 rounded-2xl" : "hover:bg-white/20"
                  }`}
                >
                  <div className="flex items-start space-x-4">
                    <span className="font-mono text-xs text-gold-dark font-semibold pt-1">
                      {feature.number}
                    </span>

                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h3
                          className={`font-serif text-xl sm:text-2xl font-bold transition-colors ${
                            isSelected ? "text-forest" : "text-charcoal group-hover:text-forest"
                          }`}
                        >
                          {feature.title}
                        </h3>
                        <span
                          className={`text-xs uppercase font-mono px-2 py-0.5 rounded-full transition-opacity ${
                            isSelected
                              ? "bg-forest text-ivory opacity-100"
                              : "opacity-0 group-hover:opacity-100 bg-charcoal/10 text-charcoal"
                          }`}
                        >
                          {isSelected ? "Active View" : "Click to view"}
                        </span>
                      </div>
                      <p className="text-sm text-charcoal-muted font-light mt-1.5 leading-relaxed">
                        {feature.summary}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Right Column: Dynamic Concept Preview Card */}
          <div className="lg:col-span-5 sticky top-28">
            <div className="bg-forest text-ivory rounded-3xl p-6 sm:p-8 shadow-2xl border border-[#D6B56D]/20 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-48 h-48 bg-[#D6B56D]/10 rounded-full blur-3xl pointer-events-none" />

              <div className="flex items-center justify-between mb-6 pb-4 border-b border-white/10">
                <div className="flex items-center space-x-3">
                  <div className="p-2.5 rounded-xl bg-white/10 backdrop-blur-md">
                    {getFeatureIcon(activeFeature)}
                  </div>
                  <div>
                    <span className="text-[10px] font-mono uppercase tracking-wider text-[#D6B56D] block">
                      Concept Wireframe
                    </span>
                    <span className="text-xs text-sage font-medium">Proposed Mobile Experience</span>
                  </div>
                </div>
                <span className="text-[10px] uppercase font-mono bg-white/10 px-2 py-0.5 rounded-full text-sage">
                  Phase 01
                </span>
              </div>

              {/* Dynamic Feature Mockup Display */}
              <div className="space-y-4">
                <h4 className="font-serif text-2xl font-bold text-ivory">
                  {PROPOSED_FEATURES.find((f) => f.id === activeFeature)?.title}
                </h4>
                <p className="text-xs sm:text-sm text-sage/90 font-light leading-relaxed">
                  {PROPOSED_FEATURES.find((f) => f.id === activeFeature)?.summary}
                </p>

                {/* Simulated in-app interactive micro-card */}
                <div className="p-4 rounded-2xl bg-[#12241D] border border-white/10 space-y-3 mt-4">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-sage font-medium">Daily Target</span>
                    <span className="text-[#D6B56D] font-mono font-semibold">In Progress</span>
                  </div>
                  <div className="w-full bg-white/10 h-2 rounded-full overflow-hidden">
                    <div className="bg-[#D6B56D] h-full w-3/4 rounded-full" />
                  </div>
                  <div className="flex items-center justify-between text-[11px] text-sage/75 pt-1">
                    <span>Consistency: 18 days unbroken</span>
                    <span>Barakah Score &uarr;</span>
                  </div>
                </div>

                <div className="pt-4 border-t border-white/10 flex items-center justify-between">
                  <span className="text-xs text-sage/80 font-light">
                    Have feedback on this feature?
                  </span>
                  <a
                    href="#waitlist"
                    className="text-xs font-semibold text-[#D6B56D] hover:underline flex items-center space-x-1"
                  >
                    <span>Vote in Waitlist</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Callout & Anchor */}
        <div className="flex flex-col sm:flex-row items-start sm:items-baseline justify-between pt-6 border-t border-charcoal/10 gap-3 text-xs">
          <span className="uppercase tracking-wider text-charcoal-subtle font-mono">
            Digital Taqwa &bull; Research Architecture &bull; Barakah Habits Daily
          </span>
          <a
            href="#waitlist"
            className="text-forest font-semibold hover:text-gold-dark transition-colors flex items-center space-x-1 uppercase tracking-wider"
          >
            <span>Rank your top features in the waitlist</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>
    </section>
  );
}
