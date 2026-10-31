"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { Volume2, VolumeX, Play, Pause, AlertCircle, RefreshCw } from "lucide-react";

interface QuranTrack {
  id: string;
  surahName: string;
  reciter: string;
  reciterTitle: string;
  audioUrl: string;
  fallbackUrl: string;
}

const PRIMARY_TRACK: QuranTrack = {
  id: "al_fajr",
  surahName: "Surah Al-Fajr",
  reciter: "Sheikh Yasser Al-Dosari",
  reciterTitle: "Imam of Masjid Al-Haram, Makkah",
  audioUrl: "https://server11.mp3quran.net/yasser/089.mp3",
  fallbackUrl: "https://cdn.mp3quran.net/audio/yasser-dosari/r1/089.mp3",
};

export function AmbientQuranAudio() {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith("/admin");

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [hasEntered, setHasEntered] = useState<boolean>(false);
  const [isAttempting, setIsAttempting] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isAudioReady, setIsAudioReady] = useState<boolean>(false);
  const hasUserPausedManually = useRef<boolean>(false);

  // Synchronous play trigger inside user click event
  const handleEnterAndListen = () => {
    const audio = audioRef.current;
    if (!audio) return;

    setIsAttempting(true);
    setErrorMessage(null);
    hasUserPausedManually.current = false;

    // Ensure audio is audible and set to 90% volume
    audio.volume = 0.9;
    audio.muted = false;
    setIsMuted(false);

    // Audio playback must be initiated synchronously inside user gesture
    const playPromise = audio.play();

    if (playPromise !== undefined) {
      playPromise
        .then(() => {
          // Playback confirmed by browser
          setIsPlaying(true);
          setHasEntered(true);
          setIsAttempting(false);
        })
        .catch((err) => {
          console.warn("Audio playback prevented:", err);
          setIsAttempting(false);
          setIsPlaying(false);
          setErrorMessage("Unable to start recitation. Please try again.");
        });
    }
  };

  // Toggle Pause / Resume on the main website
  const togglePlayPause = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
      hasUserPausedManually.current = true; // Never autoplay again after user paused it
    } else {
      hasUserPausedManually.current = false;
      audio
        .play()
        .then(() => {
          setIsPlaying(true);
        })
        .catch(() => {
          setIsPlaying(false);
        });
    }
  };

  // Toggle Mute / Unmute
  const toggleMute = () => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.muted = !audio.muted;
    setIsMuted(audio.muted);
  };

  // Background tab management (pause on leave, resume if not manually paused)
  useEffect(() => {
    const handleVisibilityChange = () => {
      const audio = audioRef.current;
      if (!audio || !hasEntered) return;

      if (document.hidden) {
        if (isPlaying) {
          audio.pause();
          setIsPlaying(false);
        }
      } else {
        // Return to tab: resume if visitor had entered and didn't manually pause
        if (!hasUserPausedManually.current && audio.paused) {
          audio
            .play()
            .then(() => setIsPlaying(true))
            .catch(() => {});
        }
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [hasEntered, isPlaying]);

  return (
    <>
      {/* 1. Preloaded Native HTML5 Audio Element — Instant Zero-Delay Playback */}
      <audio
        ref={audioRef}
        preload="metadata"
        playsInline
        onCanPlay={() => setIsAudioReady(true)}
        onEnded={() => {
          // Do not automatically switch Surahs; loop back to beginning
          if (audioRef.current) {
            audioRef.current.currentTime = 0;
            audioRef.current.play().catch(() => {});
          }
        }}
        onError={() => {
          // If server11 has network issue, try fallback CDN URL
          if (audioRef.current && audioRef.current.src !== PRIMARY_TRACK.fallbackUrl) {
            audioRef.current.src = PRIMARY_TRACK.fallbackUrl;
            audioRef.current.load();
          }
        }}
      >
        <source src={PRIMARY_TRACK.audioUrl} type="audio/mpeg" />
        <source src={PRIMARY_TRACK.fallbackUrl} type="audio/mpeg" />
      </audio>

      {/* 2. FULLSCREEN QURAN WELCOME SCREEN (Shown only on landing before enter) */}
      {!isAdmin && (
        <div
          className={`fixed inset-0 z-50 flex items-center justify-center bg-[#0A1410] transition-all duration-700 ease-out select-none ${
            hasEntered
              ? "opacity-0 pointer-events-none scale-102"
              : "opacity-100 pointer-events-auto scale-100"
          }`}
          style={{ willChange: "opacity, transform" }}
          aria-hidden={hasEntered}
        >
          {/* Subtle Ambient Islamic Architectural Backdrop — Lightweight CSS/SVG (No 3D) */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {/* Deep Emerald Radial Gradient */}
            <div className="absolute inset-0 bg-radial-gradient from-[#142A21] via-[#0D1C15] to-[#0A1410] opacity-90" />

            {/* Subtle Golden Mihrab Arch Architectural Silhouette */}
            <svg
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[92vw] max-w-[620px] h-[85vh] max-h-[720px] opacity-25"
              viewBox="0 0 400 600"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
            >
              {/* Outer Arch Profile */}
              <path
                d="M 60 580 L 60 280 C 60 170 140 100 200 40 C 260 100 340 170 340 280 L 340 580"
                stroke="#B79A62"
                strokeWidth="1.5"
                strokeDasharray="4 4"
              />
              {/* Inner Arch Profile */}
              <path
                d="M 80 580 L 80 290 C 80 190 150 125 200 70 C 250 125 320 190 320 290 L 320 580"
                stroke="#E8D6AC"
                strokeWidth="1"
                strokeOpacity="0.6"
              />
              {/* Celestial Arch Apex Star Accent */}
              <circle cx="200" cy="40" r="3" fill="#B79A62" />
            </svg>

            {/* Faint Soft Center Light Aura */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[340px] sm:w-[480px] h-[340px] sm:h-[480px] bg-[#B79A62]/6 rounded-full blur-[90px]" />
          </div>

          {/* Welcome Screen Foreground Content */}
          <div className="relative z-10 max-w-lg mx-auto px-6 text-center flex flex-col items-center">
            {/* Actual Digital Taqwa Logo */}
            <div className="relative w-44 h-22 sm:w-56 sm:h-28 mx-auto mb-5 drop-shadow-[0_12px_28px_rgba(183,154,98,0.35)] transition-transform duration-500 hover:scale-105">
              <Image
                src="/logo.png"
                alt="Digital Taqwa"
                fill
                sizes="(max-width: 640px) 176px, 224px"
                priority
                className="object-contain"
              />
            </div>

            {/* Small Brand Pill */}
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-[#14261F]/90 border border-[#B79A62]/35 mb-4">
              <span className="w-1.5 h-1.5 rounded-full bg-[#B79A62] animate-pulse" />
              <span className="text-[10px] sm:text-[11px] font-mono uppercase tracking-widest text-[#E8D6AC] font-semibold">
                Sacred Digital Sanctuary
              </span>
            </div>

            {/* Headline */}
            <h1 className="font-display text-2xl sm:text-4xl font-black tracking-tight text-[#F6F4ED] mb-2 uppercase">
              Digital Taqwa
            </h1>

            {/* Peaceful Tagline */}
            <p className="text-sm sm:text-base text-[#DDE4D9]/90 font-light tracking-wide leading-relaxed mb-8 max-w-sm">
              Take a moment. Reconnect with Allah.
            </p>

            {/* PRIMARY BUTTON: ENTER & LISTEN TO QURAN */}
            <button
              onClick={handleEnterAndListen}
              disabled={isAttempting}
              className="group relative w-full sm:w-auto px-8 sm:px-11 py-4 sm:py-4.5 rounded-full bg-gradient-to-r from-[#B79A62] via-[#D8C296] to-[#B79A62] text-[#0A1410] font-display text-xs sm:text-sm font-black uppercase tracking-wider shadow-[0_10px_35px_rgba(183,154,98,0.45)] hover:shadow-[0_12px_45px_rgba(183,154,98,0.65)] hover:scale-105 active:scale-95 transition-all duration-300 flex items-center justify-center gap-2.5 cursor-pointer disabled:opacity-75"
              aria-label="Enter Digital Taqwa and Listen to Quran Recitation"
            >
              {isAttempting ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin text-[#0A1410]" />
                  <span>STARTING RECITATION...</span>
                </>
              ) : (
                <>
                  <Volume2 className="w-4 h-4 text-[#0A1410] transition-transform group-hover:scale-110" />
                  <span>ENTER &amp; LISTEN TO QURAN</span>
                </>
              )}
            </button>

            {/* Small Supporting Text */}
            <p className="text-xs text-[#E8D6AC]/85 font-mono tracking-wider mt-4">
              Begin your journey with the words of Allah.
            </p>

            {/* Reciter & Surah Details */}
            <span className="text-[10px] sm:text-[11px] font-mono text-[#DDE4D9]/55 mt-1.5 block">
              {PRIMARY_TRACK.reciter} &bull; {PRIMARY_TRACK.surahName}
            </span>

            {/* Error Message & Clear Retry Control */}
            {errorMessage && (
              <div className="mt-5 p-3.5 rounded-2xl bg-red-950/70 border border-red-500/40 text-red-200 text-xs font-mono max-w-xs mx-auto flex flex-col items-center gap-2 shadow-xl animate-shake">
                <div className="flex items-center gap-1.5 text-red-300">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{errorMessage}</span>
                </div>
                <button
                  onClick={handleEnterAndListen}
                  className="px-4 py-1.5 rounded-full bg-[#B79A62] text-[#0A1410] font-bold text-[11px] uppercase tracking-wider hover:bg-[#D8C296] transition-colors"
                >
                  Retry Playback
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* 3. ELEGANT FLOATING AUDIO CONTROL ON MAIN WEBSITE (Visible once entered) */}
      {hasEntered && (
        <div className="fixed bottom-5 right-5 sm:bottom-6 sm:right-6 z-40 animate-fade-in">
          <div className="group flex items-center gap-2.5 px-3.5 py-2 rounded-full bg-[#0D1C15]/95 backdrop-blur-xl border border-[#B79A62]/45 text-[#F6F4ED] shadow-[0_8px_30px_rgba(0,0,0,0.65),0_0_20px_rgba(183,154,98,0.2)] hover:border-[#B79A62] hover:bg-[#142920] transition-all duration-300">
            {/* Animated Golden Pulse Ring when Playing */}
            <div className="relative w-8 h-8 rounded-full bg-[#19372D] border border-[#B79A62]/40 text-[#E8D6AC] flex items-center justify-center shrink-0">
              {isPlaying && (
                <span className="absolute -inset-1 rounded-full border border-dashed border-[#B79A62]/50 animate-[spin_10s_linear_infinite] pointer-events-none" />
              )}
              {isPlaying ? (
                <span className="flex items-end gap-0.5 h-3">
                  <span className="w-0.5 h-2 bg-[#B79A62] rounded-full animate-pulse" />
                  <span className="w-0.5 h-3 bg-[#B79A62] rounded-full animate-pulse delay-75" />
                  <span className="w-0.5 h-1.5 bg-[#B79A62] rounded-full animate-pulse delay-150" />
                </span>
              ) : (
                <span className="w-1.5 h-1.5 rounded-full bg-[#B79A62]/50" />
              )}
            </div>

            {/* Current Surah & Reciter Name */}
            <div className="min-w-0 pr-1 text-left">
              <span className="text-[11px] font-display font-bold text-[#F6F4ED] block leading-tight tracking-tight whitespace-nowrap">
                {PRIMARY_TRACK.surahName}
              </span>
              <span className="text-[9px] font-mono text-[#E8D6AC]/80 block leading-none truncate whitespace-nowrap">
                {PRIMARY_TRACK.reciter}
              </span>
            </div>

            {/* Controls: Pause / Resume Button */}
            <button
              onClick={togglePlayPause}
              className="w-7 h-7 rounded-full bg-white/5 border border-white/10 hover:border-[#B79A62] hover:bg-[#B79A62] hover:text-[#0A1410] text-[#E8D6AC] flex items-center justify-center transition-all duration-200 cursor-pointer"
              aria-label={isPlaying ? "Pause Recitation" : "Resume Recitation"}
              title={isPlaying ? "Pause Recitation" : "Resume Recitation"}
            >
              {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 ml-0.5 fill-current" />}
            </button>

            {/* Controls: Mute / Unmute Button */}
            <button
              onClick={toggleMute}
              className="w-7 h-7 rounded-full bg-white/5 border border-white/10 hover:border-[#B79A62] hover:bg-[#B79A62] hover:text-[#0A1410] text-[#E8D6AC] flex items-center justify-center transition-all duration-200 cursor-pointer"
              aria-label={isMuted ? "Unmute Recitation" : "Mute Recitation"}
              title={isMuted ? "Unmute" : "Mute"}
            >
              {isMuted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>
      )}
    </>
  );
}
