"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
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
  autoPlayInterval = 5500,
}: ThreeDCardCarouselProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isInteracting, setIsInteracting] = useState(false);
  const dragStartX = useRef<number | null>(null);
  const dragDeltaX = useRef<number>(0);

  const total = slides.length;

  const nextSlide = useCallback(() => {
    setActiveIndex((prev) => (prev + 1) % total);
  }, [total]);

  const prevSlide = useCallback(() => {
    setActiveIndex((prev) => (prev - 1 + total) % total);
  }, [total]);

  const goToSlide = useCallback((idx: number) => {
    setActiveIndex(idx);
  }, []);

  // Auto-play timer with pause-on-hover/touch
  useEffect(() => {
    if (!autoPlayInterval || isInteracting) return;
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % total);
    }, autoPlayInterval);
    return () => clearInterval(interval);
  }, [autoPlayInterval, isInteracting, total]);

  // Pointer & Touch Drag Handlers (Smooth Universal Swipe)
  const handlePointerDown = (e: React.PointerEvent) => {
    dragStartX.current = e.clientX;
    dragDeltaX.current = 0;
    setIsInteracting(true);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (dragStartX.current === null) return;
    dragDeltaX.current = e.clientX - dragStartX.current;
  };

  const handlePointerUp = () => {
    if (dragStartX.current !== null) {
      if (dragDeltaX.current < -40) {
        nextSlide();
      } else if (dragDeltaX.current > 40) {
        prevSlide();
      }
    }
    dragStartX.current = null;
    dragDeltaX.current = 0;
    setIsInteracting(false);
  };

  const handlePointerCancel = () => {
    dragStartX.current = null;
    dragDeltaX.current = 0;
    setIsInteracting(false);
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
      className="relative w-full max-w-5xl mx-auto py-6 sm:py-10 select-none touch-pan-y"
      onMouseEnter={() => setIsInteracting(true)}
      onMouseLeave={() => setIsInteracting(false)}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerCancel}
    >
      {/* 3D Stage Container */}
      <div
        className="relative h-[410px] sm:h-[430px] md:h-[460px] w-full flex items-center justify-center overflow-visible"
        style={{
          perspective: "1200px",
          transformStyle: "preserve-3d",
        }}
      >
        {slides.map((slide, index) => {
          const offset = getOffset(index);
          const isCurrent = offset === 0;

          // Limit rendering to nearby slides for peak GPU performance
          if (Math.abs(offset) > 2) return null;

          // Compute 3D translation & rotation
          let translateX = "0px";
          let translateZ = 0;
          let rotateY = 0;
          let scale = 1;
          let opacity = 1;
          let zIndex = 30;

          if (offset === 0) {
            translateX = "0px";
            translateZ = 75;
            rotateY = 0;
            scale = 1;
            opacity = 1;
            zIndex = 30;
          } else if (offset === 1) {
            translateX = "min(340px, 58%)";
            translateZ = -50;
            rotateY = -22;
            scale = 0.88;
            opacity = 0.65;
            zIndex = 20;
          } else if (offset === -1) {
            translateX = "max(-340px, -58%)";
            translateZ = -50;
            rotateY = 22;
            scale = 0.88;
            opacity = 0.65;
            zIndex = 20;
          } else if (offset === 2) {
            translateX = "min(560px, 98%)";
            translateZ = -120;
            rotateY = -35;
            scale = 0.74;
            opacity = 0.2;
            zIndex = 10;
          } else if (offset === -2) {
            translateX = "max(-560px, -98%)";
            translateZ = -120;
            rotateY = 35;
            scale = 0.74;
            opacity = 0.2;
            zIndex = 10;
          }

          return (
            <div
              key={slide.id}
              onClick={() => !isCurrent && goToSlide(index)}
              className={`absolute top-0 bottom-0 w-[92%] sm:w-[480px] md:w-[540px] rounded-3xl p-5 sm:p-8 md:p-9 flex flex-col justify-between cursor-pointer ${
                isCurrent
                  ? "bg-gradient-to-b from-[#183226]/95 via-[#12251D]/90 to-[#0A1410]/95 border-2 border-[#B79A62]/65 shadow-[0_24px_60px_0_rgba(0,0,0,0.85),0_0_35px_rgba(183,154,98,0.25)]"
                  : "bg-[#102018]/85 border border-[#B79A62]/25 shadow-[0_12px_30px_0_rgba(0,0,0,0.6)] backdrop-blur-xl hover:border-[#B79A62]/45"
              }`}
              style={{
                left: "50%",
                transform: `translate3d(calc(-50% + ${translateX}), 0, ${translateZ}px) rotateY(${rotateY}deg) scale(${scale})`,
                opacity,
                zIndex,
                transformStyle: "preserve-3d",
                backfaceVisibility: "hidden",
                WebkitBackfaceVisibility: "hidden",
                willChange: "transform, opacity",
                transition: "transform 0.5s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.5s ease-out",
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

                <h3 className="font-display text-2xl sm:text-3xl md:text-4xl font-black text-[#F6F4ED] tracking-tight leading-[1.1] mb-3 sm:mb-4">
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
                    Sacred Dimension
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
          onClick={(e) => {
            e.stopPropagation();
            prevSlide();
          }}
          className="w-11 h-11 rounded-full bg-[#12241C]/85 border border-[#B79A62]/35 text-[#DDE4D9] hover:text-[#0A1410] hover:bg-[#B79A62] hover:border-[#B79A62] transition-all flex items-center justify-center shadow-lg hover:scale-105 active:scale-95"
          aria-label="Previous slide"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        {/* Indicators */}
        <div className="flex items-center space-x-2">
          {slides.map((_, idx) => (
            <button
              key={idx}
              onClick={(e) => {
                e.stopPropagation();
                goToSlide(idx);
              }}
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
          onClick={(e) => {
            e.stopPropagation();
            nextSlide();
          }}
          className="w-11 h-11 rounded-full bg-[#12241C]/85 border border-[#B79A62]/35 text-[#DDE4D9] hover:text-[#0A1410] hover:bg-[#B79A62] hover:border-[#B79A62] transition-all flex items-center justify-center shadow-lg hover:scale-105 active:scale-95"
          aria-label="Next slide"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      {/* Touch & Swipe Hint */}
      <p className="text-center text-[10px] uppercase font-mono tracking-widest text-[#B79A62]/70 mt-3 sm:hidden">
        Swipe or tap to explore
      </p>
    </div>
  );
}
