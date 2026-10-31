"use client";

import React, { useRef, useEffect } from "react";

interface TiltCard3DProps {
  children: React.ReactNode;
  className?: string;
  maxTilt?: number;
  glow?: boolean;
}

/**
 * Ultra-smooth, hardware-accelerated 3D Tilt Card.
 * Uses direct CSS transform mutation on requestAnimationFrame to eliminate
 * all React re-renders during mouse movement, ensuring silky 60-120 FPS performance.
 */
export function TiltCard3D({
  children,
  className = "",
  maxTilt = 7,
  glow = true,
}: TiltCard3DProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const glareRef = useRef<HTMLDivElement>(null);
  const rafId = useRef<number | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    const card = cardRef.current;
    const glare = glareRef.current;
    if (!container || !card) return;

    let isHovering = false;

    const onMouseMove = (e: MouseEvent) => {
      if (!isHovering) isHovering = true;
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const rotateX = ((y - centerY) / centerY) * -maxTilt;
      const rotateY = ((x - centerX) / centerX) * maxTilt;

      if (rafId.current) cancelAnimationFrame(rafId.current);
      rafId.current = requestAnimationFrame(() => {
        card.style.transform = `perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) translateZ(0)`;
        if (glow && glare) {
          const gx = ((x / rect.width) * 100).toFixed(1);
          const gy = ((y / rect.height) * 100).toFixed(1);
          glare.style.opacity = "0.32";
          glare.style.background = `radial-gradient(circle at ${gx}% ${gy}%, rgba(214, 181, 109, 0.22) 0%, rgba(25, 55, 45, 0) 65%)`;
        }
      });
    };

    const onMouseLeave = () => {
      isHovering = false;
      if (rafId.current) cancelAnimationFrame(rafId.current);
      rafId.current = requestAnimationFrame(() => {
        card.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) translateZ(0)`;
        if (glare) {
          glare.style.opacity = "0";
        }
      });
    };

    container.addEventListener("mousemove", onMouseMove, { passive: true });
    container.addEventListener("mouseleave", onMouseLeave, { passive: true });

    return () => {
      container.removeEventListener("mousemove", onMouseMove);
      container.removeEventListener("mouseleave", onMouseLeave);
      if (rafId.current) cancelAnimationFrame(rafId.current);
    };
  }, [maxTilt, glow]);

  return (
    <div
      ref={containerRef}
      className="w-full h-full"
      style={{ perspective: "1000px" }}
    >
      <div
        ref={cardRef}
        style={{
          transformStyle: "preserve-3d",
          transition: "transform 0.15s ease-out",
          willChange: "transform",
        }}
        className={`relative overflow-hidden ${className}`}
      >
        {/* Specular Glare Effect */}
        {glow && (
          <div
            ref={glareRef}
            className="pointer-events-none absolute inset-0 transition-opacity duration-300 -z-0"
            style={{
              opacity: 0,
              willChange: "opacity, background",
            }}
            aria-hidden="true"
          />
        )}
        <div style={{ transform: "translateZ(15px)" }} className="relative z-10 w-full h-full">
          {children}
        </div>
      </div>
    </div>
  );
}
