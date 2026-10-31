"use client";

import { Sun, Shield, BookOpen, Compass, Smartphone, ArrowRight } from "lucide-react";
import { ThreeDCardCarousel, CarouselSlide } from "./ThreeDCardCarousel";

export function ProposedPillars() {
  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  const pillarSlides: CarouselSlide[] = [
    {
      id: "pillar-1",
      badge: "Pillar 01 • Morning Clarity",
      subtitle: "Reclaiming the Blessed Early Hours",
      title: "Fajr & Morning Barakah",
      description:
        "An intentional morning flow that helps you wake up peacefully for Fajr, recite morning Adhkar, and begin your day with spiritual clarity before checking work or notifications.",
      icon: <Sun className="w-5 h-5" />,
      highlight: "Blessed Dawn Flow",
    },
    {
      id: "pillar-2",
      badge: "Pillar 02 • Sacred Presence",
      subtitle: "Digital Silence for Khushu",
      title: "Salah Focus Sanctuary",
      description:
        "A one-touch distraction barrier that mutes incoming interruptions, calms the nervous system, and provides uninterrupted presence before Allah.",
      icon: <Shield className="w-5 h-5" />,
      highlight: "Distraction Shield",
    },
    {
      id: "pillar-3",
      badge: "Pillar 03 • Deep Contemplation",
      subtitle: "Quality Over Speed",
      title: "Mindful Quran Tadabbur",
      description:
        "Focusing on understanding and living one verse a day with reflection, rather than rushing through pages just to maintain a gamified streak on a dashboard.",
      icon: <BookOpen className="w-5 h-5" />,
      highlight: "Verse by Verse",
    },
    {
      id: "pillar-4",
      badge: "Pillar 04 • Sunnah Consistency",
      subtitle: "The Most Beloved Deeds Are Consistent",
      title: "Quiet Sunnah Rhythms",
      description:
        "Gentle habit tracking inspired by the Sunnah — voluntary fasts, daily charity, Tahajjud, and nighttime repentance — built on humility without vanity metrics.",
      icon: <Compass className="w-5 h-5" />,
      highlight: "Sincere Habits",
    },
    {
      id: "pillar-5",
      badge: "Pillar 05 • Digital Fasting",
      subtitle: "Overcoming Screen Addiction",
      title: "Mindful Tech Boundaries",
      description:
        "Gentle friction barriers before opening addictive apps, helping you reclaim quiet hours before sleep so you wake up refreshed and spiritually present.",
      icon: <Smartphone className="w-5 h-5" />,
      highlight: "Phone Addiction Cure",
    },
  ];

  return (
    <section id="pillars" className="py-24 md:py-32 relative text-[#F6F4ED] overflow-hidden">
      {/* Ambient background light */}
      <div className="absolute top-1/2 left-1/3 w-[650px] h-[550px] bg-[#B79A62]/5 rounded-full blur-[150px] pointer-events-none -z-0" />

      <div className="max-w-6xl mx-auto px-6 sm:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
          <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-[#14261F]/80 backdrop-blur-md border border-[#B79A62]/35 mb-4 shadow-inner">
            <span className="w-1.5 h-1.5 rounded-full bg-[#B79A62]" />
            <span className="text-[11px] uppercase tracking-widest text-[#E8D6AC] font-mono font-semibold">
              Research Exploration &bull; Community-Led
            </span>
          </div>

          <h2 className="font-display text-3xl sm:text-5xl md:text-6xl font-black tracking-tight leading-[1.08] mb-6 text-[#F6F4ED]">
            Core Dimensions <br className="hidden sm:inline" />
            <span className="text-gradient-gold">
              We Are Exploring With You.
            </span>
          </h2>

          <p className="text-base sm:text-lg text-[#DDE4D9]/85 font-normal leading-relaxed max-w-2xl mx-auto">
            These conceptual pillars represent the daily spiritual struggles our community discusses most. Explore them below and shape which features become reality in the survey.
          </p>
        </div>

        {/* Beautiful 3D Sliding Carousel on Homepage */}
        <div className="mb-14">
          <ThreeDCardCarousel slides={pillarSlides} autoPlayInterval={6000} />
        </div>

        {/* Community Feedback Callout */}
        <div className="text-center">
          <button
            onClick={() => scrollTo("waitlist")}
            className="px-9 py-4 rounded-full bg-[#19372D]/90 backdrop-blur-xl border border-[#B79A62]/40 text-[#F6F4ED] text-xs uppercase tracking-wider font-extrabold hover:bg-[#234d3f] hover:border-[#B79A62] transition-all inline-flex items-center space-x-2 shadow-2xl hover:scale-105 active:scale-95"
          >
            <span>Vote on These Pillars in the Survey</span>
            <ArrowRight className="w-4 h-4 text-[#B79A62]" />
          </button>
        </div>
      </div>
    </section>
  );
}
