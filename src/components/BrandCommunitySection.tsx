"use client";

import Image from "next/image";
import { SOCIAL_PROFILES } from "@/lib/constants";
import { ArrowUpRight, Instagram, Youtube } from "lucide-react";
import { TikTokIcon } from "./icons/TikTokIcon";

export function BrandCommunitySection() {
  return (
    <section id="community" className="py-24 md:py-36 bg-[#F6F4ED] text-charcoal border-t border-charcoal/10 relative overflow-hidden">
      <div className="max-w-6xl mx-auto px-6 sm:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 md:mb-20">
          <div className="relative w-16 h-16 rounded-2xl overflow-hidden border border-[#B79A62]/40 shadow-xl mx-auto mb-4 bg-[#0A1410]">
            <Image
              src="/barakah-habits-logo.jpg"
              alt="Barakah Habits Daily Logo"
              fill
              sizes="64px"
              className="object-cover"
            />
          </div>
          <span className="text-xs uppercase tracking-widest text-gold-dark font-mono font-medium block mb-3">
            Section 06 &bull; Brand & Community
          </span>
          <h2 className="font-serif text-3xl sm:text-5xl md:text-6xl font-bold tracking-tight text-forest leading-[1.12] mb-4">
            A Project by <br />
            <span className="font-serif italic font-normal text-gold-dark">
              Barakah Habits Daily.
            </span>
          </h2>
          <p className="text-base sm:text-lg text-charcoal-muted font-light leading-relaxed">
            Digital Taqwa extends our shared mission to build conscious daily habits rooted in the Quran and Sunnah. Join our thriving global community across platforms.
          </p>
        </div>

        {/* 3 Dedicated Official Social Profiles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 mb-16">
          {/* 1. Instagram */}
          <a
            href={SOCIAL_PROFILES.instagram.url}
            target="_blank"
            rel="noreferrer"
            className="group block p-8 rounded-3xl bg-white border border-charcoal/10 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
          >
            <div className="flex items-center justify-between mb-6">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-amber-500 via-rose-500 to-purple-600 text-white flex items-center justify-center shadow-md group-hover:scale-105 transition-transform">
                <Instagram className="w-7 h-7" />
              </div>
              <ArrowUpRight className="w-5 h-5 text-charcoal-subtle group-hover:text-forest group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
            </div>

            <span className="text-[11px] font-mono uppercase tracking-wider text-gold-dark font-semibold block mb-1">
              Official Instagram
            </span>
            <h3 className="font-serif text-2xl font-bold text-forest group-hover:text-gold-dark transition-colors mb-2">
              @barakahhabitsdaily
            </h3>
            <p className="text-xs sm:text-sm text-charcoal-muted font-light leading-relaxed mb-6">
              Daily visual reminders, prophetic morning routines, and mindful reflections on strengthening your Deen in a digital world.
            </p>

            <div className="pt-4 border-t border-charcoal/10 flex items-center justify-between text-xs font-semibold text-forest">
              <span>Explore Instagram</span>
              <span className="font-mono text-[11px] text-charcoal-subtle font-normal">Connect &rarr;</span>
            </div>
          </a>

          {/* 2. YouTube */}
          <a
            href={SOCIAL_PROFILES.youtube.url}
            target="_blank"
            rel="noreferrer"
            className="group block p-8 rounded-3xl bg-white border border-charcoal/10 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
          >
            <div className="flex items-center justify-between mb-6">
              <div className="w-14 h-14 rounded-2xl bg-[#FF0000] text-white flex items-center justify-center shadow-md group-hover:scale-105 transition-transform">
                <Youtube className="w-7 h-7" />
              </div>
              <ArrowUpRight className="w-5 h-5 text-charcoal-subtle group-hover:text-forest group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
            </div>

            <span className="text-[11px] font-mono uppercase tracking-wider text-gold-dark font-semibold block mb-1">
              Official YouTube
            </span>
            <h3 className="font-serif text-2xl font-bold text-forest group-hover:text-gold-dark transition-colors mb-2">
              @barakahhabitsdaily
            </h3>
            <p className="text-xs sm:text-sm text-charcoal-muted font-light leading-relaxed mb-6">
              Deep-dive videos on overcoming phone addiction, building intentional prayer habits, and cultivating tranquility in daily life.
            </p>

            <div className="pt-4 border-t border-charcoal/10 flex items-center justify-between text-xs font-semibold text-forest">
              <span>Subscribe on YouTube</span>
              <span className="font-mono text-[11px] text-charcoal-subtle font-normal">Watch &rarr;</span>
            </div>
          </a>

          {/* 3. TikTok */}
          <a
            href={SOCIAL_PROFILES.tiktok.url}
            target="_blank"
            rel="noreferrer"
            className="group block p-8 rounded-3xl bg-white border border-charcoal/10 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
          >
            <div className="flex items-center justify-between mb-6">
              <div className="w-14 h-14 rounded-2xl bg-[#000000] text-white flex items-center justify-center shadow-md group-hover:scale-105 transition-transform">
                <TikTokIcon className="w-7 h-7" />
              </div>
              <ArrowUpRight className="w-5 h-5 text-charcoal-subtle group-hover:text-forest group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
            </div>

            <span className="text-[11px] font-mono uppercase tracking-wider text-gold-dark font-semibold block mb-1">
              Official TikTok
            </span>
            <h3 className="font-serif text-2xl font-bold text-forest group-hover:text-gold-dark transition-colors mb-2">
              @barakahhabits1
            </h3>
            <p className="text-xs sm:text-sm text-charcoal-muted font-light leading-relaxed mb-6">
              Short-form daily sunnah tips, quick dhikr reminders, and actionable advice to reclaim your morning from mindless scrolling.
            </p>

            <div className="pt-4 border-t border-charcoal/10 flex items-center justify-between text-xs font-semibold text-forest">
              <span>Follow on TikTok</span>
              <span className="font-mono text-[11px] text-charcoal-subtle font-normal">Explore &rarr;</span>
            </div>
          </a>
        </div>

        {/* Community Trust Callout */}
        <div className="p-8 sm:p-10 rounded-3xl bg-forest text-ivory flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden">
          <div className="relative z-10 max-w-xl text-center md:text-left">
            <span className="text-[10px] font-mono uppercase tracking-widest text-[#D6B56D] font-semibold block mb-2">
              United in Purpose
            </span>
            <h4 className="font-serif text-2xl sm:text-3xl font-bold text-ivory mb-2">
              Growing One Intentional Day at a Time
            </h4>
            <p className="text-xs sm:text-sm text-sage/85 font-light leading-relaxed">
              Every like, reflection, and waitlist submission helps us build a technological companion worthy of our shared deen.
            </p>
          </div>

          <div className="relative z-10 shrink-0">
            <a
              href="#waitlist"
              className="px-6 py-3.5 rounded-full bg-[#D6B56D] text-[#0A100D] font-semibold text-xs uppercase tracking-wider hover:bg-[#E8D6AC] transition-all shadow-md inline-block"
            >
              Join the Early Access Waitlist
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
