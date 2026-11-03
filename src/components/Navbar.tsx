"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Menu, X } from "lucide-react";
import { trackCtaClick } from "@/lib/analytics";

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollTo = (id: string) => {
    setMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        scrolled
          ? "bg-[#0A1410]/95 backdrop-blur-md border-b border-[#B79A62]/15 py-3 shadow-xl"
          : "bg-transparent py-5 sm:py-6"
      }`}
    >
      <div className="max-w-6xl mx-auto px-6 sm:px-8 flex items-center justify-between">
        {/* Left: Brand Logo & Attribution */}
        <Link href="/" className="flex items-center space-x-3 group py-1">
          <div className="relative w-9 h-9 sm:w-11 sm:h-11 shrink-0 transition-transform duration-300 group-hover:scale-105">
            <Image
              src="/logo-icon.png"
              alt="Digital Taqwa — Official Logo Icon"
              fill
              sizes="44px"
              priority
              className="object-contain drop-shadow-[0_4px_12px_rgba(183,154,98,0.3)]"
            />
          </div>
          <div className="flex flex-col">
            <span className="font-display text-lg sm:text-xl tracking-[0.14em] uppercase font-black text-[#F6F4ED]">
              Digital Taqwa
            </span>
            <span className="text-[9px] uppercase tracking-widest text-[#B79A62] font-mono -mt-0.5 hidden sm:block font-medium">
              A Project by Barakah Habits Daily
            </span>
          </div>
        </Link>

        {/* Right: Clean Navigation */}
        <nav className="hidden md:flex items-center space-x-8 text-xs uppercase tracking-wider font-mono text-[#DDE4D9]">
          <button
            onClick={() => scrollTo("vision")}
            className="hover:text-[#B79A62] transition-colors"
          >
            Vision
          </button>
          <button
            onClick={() => scrollTo("pillars")}
            className="hover:text-[#B79A62] transition-colors"
          >
            Pillars
          </button>
          <button
            onClick={() => scrollTo("waitlist")}
            className="hover:text-[#B79A62] transition-colors"
          >
            Research Survey
          </button>
          <button
            onClick={() => scrollTo("faq")}
            className="hover:text-[#B79A62] transition-colors"
          >
            FAQ
          </button>
          <button
            onClick={() => {
              trackCtaClick("join_waitlist", "navbar_desktop");
              scrollTo("waitlist");
            }}
            className="px-5 py-2.5 rounded-full bg-[#B79A62] text-[#0A1410] font-bold text-xs tracking-wider uppercase hover:bg-[#D8C296] transition-all shadow-md hover:shadow-lg hover:shadow-[#B79A62]/25 hover:scale-105 active:scale-95"
          >
            Join Waitlist
          </button>
        </nav>

        {/* Mobile Hamburger */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-2 text-[#F6F4ED] hover:text-[#B79A62] transition-colors focus:outline-none"
          aria-label="Toggle navigation menu"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#0D1813]/98 backdrop-blur-xl border-b border-[#B79A62]/20 px-8 py-6 shadow-2xl">
          <div className="flex flex-col space-y-4 text-sm font-mono uppercase tracking-wider text-[#DDE4D9]">
            <button
              onClick={() => scrollTo("vision")}
              className="text-left py-2 hover:text-[#B79A62] transition-colors border-b border-white/5"
            >
              01. The Vision
            </button>
            <button
              onClick={() => scrollTo("pillars")}
              className="text-left py-2 hover:text-[#B79A62] transition-colors border-b border-white/5"
            >
              02. Proposed Pillars
            </button>
            <button
              onClick={() => scrollTo("waitlist")}
              className="text-left py-2 hover:text-[#B79A62] transition-colors border-b border-white/5"
            >
              03. Community Survey
            </button>
            <button
              onClick={() => scrollTo("faq")}
              className="text-left py-2 hover:text-[#B79A62] transition-colors border-b border-white/5"
            >
              04. FAQ
            </button>
            <button
              onClick={() => {
                trackCtaClick("join_waitlist", "navbar_mobile");
                scrollTo("waitlist");
              }}
              className="w-full text-center py-3 rounded-full bg-[#B79A62] text-[#0A1410] font-black text-xs tracking-wider uppercase mt-2 shadow-md"
            >
              Join the Waitlist
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
