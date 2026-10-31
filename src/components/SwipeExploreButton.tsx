"use client";

import React, { useState, useRef } from "react";
import { ChevronDown } from "lucide-react";

interface SwipeExploreButtonProps {
  targetId?: string;
  className?: string;
}

export function SwipeExploreButton({
  targetId = "vision",
  className = "",
}: SwipeExploreButtonProps) {
  const [isPressed, setIsPressed] = useState(false);
  const touchStartY = useRef<number | null>(null);

  const performSmoothScroll = () => {
    const el = document.getElementById(targetId);
    if (!el) {
      window.scrollTo({ top: window.innerHeight * 0.9, behavior: "smooth" });
      return;
    }

    const navbarOffset = 76;
    const elementPosition = el.getBoundingClientRect().top + window.pageYOffset;
    const targetY = Math.max(0, elementPosition - navbarOffset);

    // Primary smooth window scroll
    try {
      window.scrollTo({
        top: targetY,
        behavior: "smooth",
      });
    } catch {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  // Touch Swipe Detection
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartY.current = e.touches[0].clientY;
    setIsPressed(true);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (touchStartY.current === null) return;
    const diffY = e.touches[0].clientY - touchStartY.current;
    // If swiped downwards by more than 35px, trigger smooth navigation
    if (diffY > 35) {
      performSmoothScroll();
      touchStartY.current = null;
      setIsPressed(false);
    }
  };

  const handleTouchEnd = () => {
    touchStartY.current = null;
    setIsPressed(false);
  };

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={performSmoothScroll}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          performSmoothScroll();
        }
      }}
      className={`group cursor-pointer select-none inline-flex flex-col items-center justify-center transition-all duration-300 ${
        isPressed ? "scale-95" : "hover:scale-105"
      } ${className}`}
      aria-label="Swipe or click down to explore vision"
    >
      {/* Unique Mihrab-Inspired Islamic Scroll Capsule */}
      <div className="relative w-10 h-16 sm:w-11 sm:h-18 rounded-full border-2 border-[#B79A62]/45 bg-[#0E1E17]/85 backdrop-blur-md p-1.5 flex flex-col items-center justify-between shadow-[0_0_20px_rgba(183,154,98,0.25)] group-hover:border-[#B79A62] group-hover:shadow-[0_0_30px_rgba(183,154,98,0.45)] transition-all">
        {/* Soft Golden Ambient Inner Glow */}
        <div className="absolute inset-0 rounded-full bg-gradient-to-b from-[#B79A62]/10 via-transparent to-[#B79A62]/20 pointer-events-none" />

        {/* Sliding Kinetic Golden Particle / Droplet */}
        <div className="w-2.5 h-3.5 rounded-full bg-gradient-to-b from-[#E8D6AC] to-[#B79A62] shadow-[0_0_10px_#B79A62] animate-bounce duration-1000 mt-1" />

        {/* Subtle Downward Indicator Chevron */}
        <div className="flex flex-col items-center space-y--1 mb-0.5 text-[#B79A62]">
          <ChevronDown className="w-3.5 h-3.5 -mb-2 opacity-50 group-hover:opacity-100 transition-opacity animate-pulse" />
          <ChevronDown className="w-3.5 h-3.5 text-[#E8D6AC]" />
        </div>
      </div>

      {/* Atmospheric Text Prompt */}
      <div className="mt-3 flex items-center space-x-2 text-[#DDE4D9]/80 group-hover:text-[#F6F4ED] transition-colors">
        <span className="w-1.5 h-1.5 rounded-full bg-[#B79A62] group-hover:scale-125 transition-transform" />
        <span className="text-[10px] sm:text-[11px] font-mono uppercase tracking-[0.22em] text-[#E8D6AC] font-bold">
          Swipe to explore
        </span>
        <span className="w-1.5 h-1.5 rounded-full bg-[#B79A62] group-hover:scale-125 transition-transform" />
      </div>

      <span className="text-[9px] font-mono text-[#DDE4D9]/50 tracking-wider mt-0.5 opacity-80 group-hover:opacity-100 transition-opacity">
        or tap to enter sanctuary
      </span>
    </div>
  );
}

