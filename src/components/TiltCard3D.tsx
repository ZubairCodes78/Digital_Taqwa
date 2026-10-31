"use client";

import React, { useRef, useState, useCallback } from "react";

interface TiltCard3DProps {
  children: React.ReactNode;
  className?: string;
  maxTilt?: number;
  glow?: boolean;
}

export function TiltCard3D({
  children,
  className = "",
  maxTilt = 8,
  glow = true,
}: TiltCard3DProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [glare, setGlare] = useState<{ x: number; y: number; opacity: number }>({
    x: 50,
    y: 50,
    opacity: 0,
  });

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      const card = cardRef.current;
      if (!card) return;

      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const rotateX = ((y - centerY) / centerY) * -maxTilt;
      const rotateY = ((x - centerX) / centerX) * maxTilt;

      setTilt({ x: rotateX, y: rotateY });
      setGlare({
        x: (x / rect.width) * 100,
        y: (y / rect.height) * 100,
        opacity: 0.35,
      });
    },
    [maxTilt]
  );

  const handleMouseLeave = useCallback(() => {
    setTilt({ x: 0, y: 0 });
    setGlare((prev) => ({ ...prev, opacity: 0 }));
  }, []);

  return (
    <div
      style={{ perspective: "1000px" }}
      className="w-full transition-transform duration-300"
    >
      <div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{
          transform: `rotateX(${tilt.x}deg) rotateY(${tilt.y}deg) translateZ(0)`,
          transformStyle: "preserve-3d",
          transition: "transform 0.2s cubic-bezier(0.2, 0.8, 0.2, 1)",
        }}
        className={`relative overflow-hidden ${className}`}
      >
        {/* Specular Glare Effect */}
        {glow && (
          <div
            className="pointer-events-none absolute inset-0 transition-opacity duration-300 -z-0"
            style={{
              opacity: glare.opacity,
              background: `radial-gradient(circle at ${glare.x}% ${glare.y}%, rgba(214, 181, 109, 0.25) 0%, rgba(25, 55, 45, 0) 65%)`,
            }}
            aria-hidden="true"
          />
        )}
        <div style={{ transform: "translateZ(20px)" }} className="relative z-10 w-full h-full">
          {children}
        </div>
      </div>
    </div>
  );
}

