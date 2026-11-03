import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, Home } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "404 — Page Not Found | Digital Taqwa",
  description: "The page you are looking for does not exist. Return to the Digital Taqwa sanctuary.",
  robots: {
    index: false,
    follow: true,
  },
};

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#0A1410] text-[#F6F4ED] flex flex-col items-center justify-center px-6 py-24 text-center relative overflow-hidden selection:bg-[#B79A62] selection:text-[#0A1410]">
      {/* Ambient background glows */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[500px] bg-[#19372D]/40 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-[#B79A62]/10 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-lg mx-auto relative z-10 space-y-6">
        {/* Real Digital Taqwa Logo */}
        <div className="relative w-44 h-20 sm:w-52 sm:h-24 mx-auto mb-2">
          <Image
            src="/logo.png"
            alt="Digital Taqwa Logo"
            fill
            sizes="208px"
            priority
            className="object-contain drop-shadow-[0_10px_25px_rgba(183,154,98,0.35)]"
          />
        </div>

        <div className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full bg-[#14261F]/80 border border-[#B79A62]/35">
          <span className="w-1.5 h-1.5 rounded-full bg-[#B79A62]" />
          <span className="text-[11px] uppercase tracking-widest text-[#E8D6AC] font-mono font-semibold">
            404 &bull; Page Not Found
          </span>
        </div>

        <h1 className="font-display text-3xl sm:text-4xl md:text-5xl font-black text-[#F6F4ED] tracking-tight leading-snug">
          Lost in Reflection.
        </h1>

        <p className="text-sm sm:text-base text-[#DDE4D9]/80 font-light leading-relaxed max-w-md mx-auto">
          The path you are looking for does not exist or has been moved. Let us guide you peacefully back to the sanctuary.
        </p>

        <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            href="/"
            className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 px-7 py-3.5 rounded-full bg-[#B79A62] text-[#0A1410] text-xs uppercase tracking-wider font-extrabold hover:bg-[#D8C296] transition-all shadow-lg shadow-[#B79A62]/20 hover:scale-105 active:scale-95"
          >
            <Home className="w-4 h-4" />
            <span>Return to Sanctuary</span>
          </Link>

          <Link
            href="/#faq"
            className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 px-6 py-3.5 rounded-full border border-white/15 text-[#DDE4D9] text-xs uppercase tracking-wider font-mono hover:border-[#B79A62] hover:text-[#F6F4ED] transition-colors"
          >
            <span>Read Common Questions</span>
          </Link>
        </div>

        <div className="pt-8 text-xs font-mono text-[#DDE4D9]/50">
          A Project by Barakah Habits Daily &bull; digitaltaqwa.site
        </div>
      </div>
    </div>
  );
}
