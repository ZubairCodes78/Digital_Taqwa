"use client";

import Link from "next/link";
import Image from "next/image";
import { SOCIAL_PROFILES } from "@/lib/constants";
import { Instagram, Youtube } from "lucide-react";
import { TikTokIcon } from "./icons/TikTokIcon";

export function Footer() {
  return (
    <footer className="bg-[#0A100C] py-14 sm:py-16 border-t border-white/10 text-[#F6F4ED]">
      <div className="max-w-5xl mx-auto px-6 sm:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8 pb-8 border-b border-white/10 text-center md:text-left">
          {/* Brand Identity & Attribution */}
          <div className="flex flex-col items-center md:items-start max-w-sm">
            <Link href="/" className="flex items-center space-x-3 mb-2 group">
              <div className="relative w-8 h-8 sm:w-9 sm:h-9 shrink-0 transition-transform group-hover:scale-105">
                <Image
                  src="/logo-icon.png"
                  alt="Digital Taqwa — Official Logo Icon"
                  fill
                  sizes="36px"
                  className="object-contain"
                />
              </div>
              <span className="font-display text-xl tracking-[0.14em] uppercase font-black text-[#F6F4ED]">
                Digital Taqwa
              </span>
            </Link>

            <div className="flex items-center space-x-2 mb-1.5">
              <div className="relative w-4 h-4 rounded-full overflow-hidden border border-[#B79A62]/60 shrink-0">
                <Image
                  src="/barakah-habits-logo.jpg"
                  alt="Barakah Habits Daily — Official Logo"
                  fill
                  sizes="16px"
                  className="object-cover"
                />
              </div>
              <p className="text-xs text-[#B79A62] font-mono uppercase tracking-wider font-semibold">
                A Project by Barakah Habits Daily
              </p>
            </div>

            <p className="text-xs text-[#DDE4D9]/70 font-light">
              Exploring a more intentional journey toward Deen.
            </p>
          </div>

          {/* Official Social Links & Legal */}
          <div className="flex flex-col items-center md:items-end space-y-4">
            <div className="flex items-center space-x-3">
              <a
                href={SOCIAL_PROFILES.instagram.url}
                target="_blank"
                rel="noreferrer"
                className="w-10 h-10 rounded-full bg-white/5 border border-white/10 hover:border-[#B79A62] text-[#DDE4D9] hover:text-[#B79A62] flex items-center justify-center transition-all"
                aria-label="Barakah Habits Daily Instagram"
                title="Instagram"
              >
                <Instagram className="w-4 h-4" />
              </a>

              <a
                href={SOCIAL_PROFILES.youtube.url}
                target="_blank"
                rel="noreferrer"
                className="w-10 h-10 rounded-full bg-white/5 border border-white/10 hover:border-[#B79A62] text-[#DDE4D9] hover:text-[#B79A62] flex items-center justify-center transition-all"
                aria-label="Barakah Habits Daily YouTube"
                title="YouTube"
              >
                <Youtube className="w-4 h-4" />
              </a>

              <a
                href={SOCIAL_PROFILES.tiktok.url}
                target="_blank"
                rel="noreferrer"
                className="w-10 h-10 rounded-full bg-white/5 border border-white/10 hover:border-[#B79A62] text-[#DDE4D9] hover:text-[#B79A62] flex items-center justify-center transition-all"
                aria-label="Barakah Habits Daily TikTok"
                title="TikTok"
              >
                <TikTokIcon className="w-4 h-4" />
              </a>
            </div>

            <div className="flex items-center space-x-6 text-xs uppercase tracking-wider text-[#DDE4D9]/70 font-mono">
              <Link href="/privacy" className="hover:text-[#B79A62] transition-colors">
                Privacy
              </Link>
              <Link href="/terms" className="hover:text-[#B79A62] transition-colors">
                Terms
              </Link>
            </div>
          </div>
        </div>

        {/* Disclaimer & Copyright */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-[#DDE4D9]/50 gap-2 text-center font-mono font-light">
          <p>&copy; {new Date().getFullYear()} Digital Taqwa. All rights reserved.</p>
          <p>Early-access research initiative &bull; Barakah Habits Daily</p>
        </div>
      </div>
    </footer>
  );
}
