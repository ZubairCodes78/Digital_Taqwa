"use client";

import React, { useState, useEffect, useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

export interface CarouselSlide {
  id: string;
  badge: string;
  title: string;
  subtitle: string;
  description: string;
  icon?: React.ReactNode;
  highlight?: string;
}

interface ThreeDCardCarouselProps {
  slides: CarouselSlide[];
  autoPlayInterval?: number; // ms, 0 for off
}

export function ThreeDCardCarousel({
  slides,
  autoPlayInterval = 5000,
}: ThreeDCardCarouselProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const touchStartX = useRef<number | null>(null);

  const total = slides.length;

  const nextSlide = () => {
    setActiveIndex((prev) => (prev + 1) % total);
  };

  const prevSlide = () => {
    setActiveIndex((prev) => (prev - 1 + total) % total);
  };

  const goToSlide = (idx: number) => {
    setActiveIndex(idx);
  };

  // Auto-play timer
  useEffect(() => {
    if (!autoPlayInterval || isHovered) return;
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % total);
    }, autoPlayInterval);
    return () => clearInterval(interval);
  }, [autoPlayInterval, isHovered, total]);

  // Touch swipe support
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const diff = touchStartX.current - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) {
      if (diff > 0) nextSlide();
      else prevSlide();
    }
    touchStartX.current = null;
  };

  // Compute circular offset from active slide
  const getOffset = (index: number) => {
    let diff = index - activeIndex;
    if (diff > total / 2) diff -= total;
    if (diff < -total / 2) diff += total;
    return diff;
  };

  return (
    <div
      className="relative w-full max-w-5xl mx-auto py-8 sm:py-12 select-none"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* 3D Stage Container */}
      <div
        className="relative h-[400px] sm:h-[440px] md:h-[480px] w-full flex items-center justify-center overflow-visible"
        style={{ perspective: "1200px" }}
      >
        {slides.map((slide, index) => {
          const offset = getOffset(index);
          const isCurrent = offset === 0;

          // Limit rendering to nearby slides for clean performance
          if (Math.abs(offset) > 2) return null;

          // Compute 3D translation & rotation
          let translateX = "0%";
          let translateZ = 0;
          let rotateY = 0;
          let scale = 1;
          let opacity = 1;
          let zIndex = 30;

          if (offset === 0) {
            translateX = "0%";
            translateZ = 80;
            rotateY = 0;
            scale = 1;
            opacity = 1;
            zIndex = 30;
          } else if (offset === 1) {
            translateX = "62%";
            translateZ = -60;
            rotateY = -24;
            scale = 0.86;
            opacity = 0.65;
            zIndex = 20;
          } else if (offset === -1) {
            translateX = "-62%";
            translateZ = -60;
            rotateY = 24;
            scale = 0.86;
            opacity = 0.65;
            zIndex = 20;
          } else if (offset === 2) {
            translateX = "110%";
            translateZ = -140;
            rotateY = -38;
            scale = 0.72;
            opacity = 0.25;
            zIndex = 10;
          } else if (offset === -2) {
            translateX = "-110%";
            translateZ = -140;
            rotateY = 38;
            scale = 0.72;
            opacity = 0.25;
            zIndex = 10;
          }

          return (
            <div
              key={slide.id}
              onClick={() => !isCurrent && goToSlide(index)}
              className={`absolute top-0 bottom-0 w-[88%] sm:w-[500px] md:w-[560px] mx-auto rounded-3xl p-6 sm:p-8 md:p-10 flex flex-col justify-between transition-all duration-700 ease-[cubic-bezier(0.25,1,0.5,1)] cursor-pointer ${
                isCurrent
                  ? "bg-gradient-to-b from-[#183226]/95 via-[#12251D]/90 to-[#0A1410]/95 border-2 border-[#B79A62]/60 shadow-[0_24px_60px_0_rgba(0,0,0,0.85),0_0_40px_rgba(183,154,98,0.2)]"
                  : "bg-[#102018]/80 border border-[#B79A62]/25 shadow-[0_12px_30px_0_rgba(0,0,0,0.7)] backdrop-blur-xl hover:border-[#B79A62]/45"
              }`}
              style={{
                transform: `translateX(${translateX}) translateZ(${translateZ}px) rotateY(${rotateY}deg) scale(${scale})`,
                opacity,
                zIndex,
                transformStyle: "preserve-3d",
              }}
            >
              {/* Card Top: Badge & Icon */}
              <div>
                <div className="flex items-center justify-between mb-4 sm:mb-6">
                  <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-[#14261F]/90 border border-[#B79A62]/35 shadow-inner">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#B79A62]" />
                    <span className="text-[10px] sm:text-[11px] font-mono uppercase tracking-widest text-[#E8D6AC] font-bold">
                      {slide.badge}
                    </span>
                  </div>

                  {slide.icon && (
                    <div className="w-10 h-10 rounded-2xl bg-[#19372D] border border-[#B79A62]/40 text-[#B79A62] flex items-center justify-center shadow-md">
                      {slide.icon}
                    </div>
                  )}
                </div>

                <span className="text-xs uppercase font-mono tracking-wider text-[#B79A62] block mb-1.5">
                  {slide.subtitle}
                </span>

                <h3 className="font-display text-2xl sm:text-3xl md:text-4xl font-black text-[#F6F4ED] tracking-tight leading-[1.1] mb-4">
                  {slide.title}
                </h3>

                <p className="text-xs sm:text-sm md:text-base text-[#DDE4D9]/85 font-normal leading-relaxed">
                  {slide.description}
                </p>
              </div>

              {/* Card Bottom: Highlight Pill */}
              {slide.highlight && (
                <div className="pt-4 border-t border-[#B79A62]/20 flex items-center justify-between mt-4">
                  <span className="text-[11px] font-mono text-[#DDE4D9]/70">
                    Sacred Commitment
                  </span>
                  <span className="text-xs font-mono font-bold text-[#E8D6AC] uppercase tracking-wider">
                    {slide.highlight}
                  </span>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Navigation Controls */}
      <div className="flex items-center justify-between max-w-md mx-auto mt-6 sm:mt-8 px-4">
        {/* Previous Button */}
        <button
          onClick={prevSlide}
          className="w-11 h-11 rounded-full bg-[#12241C]/80 border border-[#B79A62]/30 text-[#DDE4D9] hover:text-[#0A1410] hover:bg-[#B79A62] hover:border-[#B79A62] transition-all flex items-center justify-center shadow-lg hover:scale-105 active:scale-95"
          aria-label="Previous slide"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        {/* Indicators */}
        <div className="flex items-center space-x-2">
          {slides.map((_, idx) => (
            <button
              key={idx}
              onClick={() => goToSlide(idx)}
              className={`transition-all duration-300 rounded-full ${
                activeIndex === idx
                  ? "w-8 h-2 bg-[#B79A62] shadow-[0_0_12px_rgba(183,154,98,0.6)]"
                  : "w-2 h-2 bg-white/20 hover:bg-white/40"
              }`}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>

        {/* Next Button */}
        <button
          onClick={nextSlide}
          className="w-11 h-11 rounded-full bg-[#12241C]/80 border border-[#B79A62]/30 text-[#DDE4D9] hover:text-[#0A1410] hover:bg-[#B79A62] hover:border-[#B79A62] transition-all flex items-center justify-center shadow-lg hover:scale-105 active:scale-95"
          aria-label="Next slide"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      {/* Mobile Swipe Hint */}
      <p className="text-center text-[10px] uppercase font-mono tracking-widest text-[#B79A62]/60 mt-3 sm:hidden">
        Swipe or tap to explore
      </p>
    </div>
  );
}
