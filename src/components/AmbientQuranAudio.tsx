"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { usePathname } from "next/navigation";
import { Volume2, VolumeX, Play, Pause, Sparkles } from "lucide-react";

interface QuranTrack {
  id: string;
  surahName: string;
  verseDetails: string;
  reciter: string;
  audioUrl: string;
  fallbackUrl: string;
}

// The TWO Quran recitation reference audio URLs provided by the user
const PLAYLIST: QuranTrack[] = [
  {
    id: "muminun",
    surahName: "Surah Al-Mu’minun",
    verseDetails: "Verses 84–90",
    reciter: "Sheikh Yasser Al-Dosari",
    audioUrl: "https://cdn.mp3quran.net/audio/yasser-dosari/r1/023.mp3",
    fallbackUrl: "https://server11.mp3quran.net/yasser/023.mp3",
  },
  {
    id: "fajr",
    surahName: "Surah Al-Fajr",
    verseDetails: "Verses 21–30",
    reciter: "Sheikh Yasser Al-Dosari",
    audioUrl: "https://cdn.mp3quran.net/audio/yasser-dosari/r1/089.mp3",
    fallbackUrl: "https://server11.mp3quran.net/yasser/089.mp3",
  },
];

export function AmbientQuranAudio() {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith("/admin");

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [currentTrackIndex, setCurrentTrackIndex] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [autoplayBlocked, setAutoplayBlocked] = useState<boolean>(false);
  const hasUserPausedManually = useRef<boolean>(false);
  const isTransitioningRef = useRef<boolean>(false);

  const currentTrack = PLAYLIST[currentTrackIndex];

  // Helper to safely play audio with browser policy handling
  const safePlay = useCallback(async () => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.volume = 0.9;
    audio.muted = isMuted;

    try {
      const playPromise = audio.play();
      if (playPromise !== undefined) {
        await playPromise;
        setIsPlaying(true);
        setAutoplayBlocked(false);
      }
    } catch (err: any) {
      // Browser blocked autoplay without user gesture
      if (err.name === "NotAllowedError" || err.name === "AbortError") {
        setIsPlaying(false);
        setAutoplayBlocked(true);
      } else {
        console.warn("Audio playback notice:", err?.message || err);
      }
    }
  }, [isMuted]);

  // 1. Initial page load: Immediately attempt audible autoplay with sound enabled
  useEffect(() => {
    if (isAdmin) return;

    const audio = audioRef.current;
    if (!audio) return;

    // Direct immediate audible autoplay attempt on initial load
    safePlay();

    // Setup fallback user interaction listener if browser policy blocks initial audible autoplay
    const handleFirstUserInteraction = () => {
      if (!hasUserPausedManually.current && audio.paused) {
        audio
          .play()
          .then(() => {
            setIsPlaying(true);
            setAutoplayBlocked(false);
          })
          .catch(() => {});
      }
    };

    window.addEventListener("click", handleFirstUserInteraction, { once: true, passive: true });
    window.addEventListener("touchstart", handleFirstUserInteraction, { once: true, passive: true });
    window.addEventListener("keydown", handleFirstUserInteraction, { once: true, passive: true });

    return () => {
      window.removeEventListener("click", handleFirstUserInteraction);
      window.removeEventListener("touchstart", handleFirstUserInteraction);
      window.removeEventListener("keydown", handleFirstUserInteraction);
    };
  }, [isAdmin, safePlay]);

  // 2. Continuous playback transition: Recording 1 finishes -> Recording 2 starts -> Looping
  const handleTrackEnded = useCallback(() => {
    if (isTransitioningRef.current) return;
    isTransitioningRef.current = true;

    // Switch to next recording: 0 -> 1 -> 0 indefinitely
    const nextIndex = (currentTrackIndex + 1) % PLAYLIST.length;
    setCurrentTrackIndex(nextIndex);

    const nextTrack = PLAYLIST[nextIndex];
    const audio = audioRef.current;

    if (audio) {
      audio.src = nextTrack.audioUrl;
      audio.currentTime = 0;
      audio
        .play()
        .then(() => {
          setIsPlaying(true);
          isTransitioningRef.current = false;
        })
        .catch(() => {
          // Retry with fallback URL if primary fails
          audio.src = nextTrack.fallbackUrl;
          audio
            .play()
            .then(() => setIsPlaying(true))
            .catch(() => setIsPlaying(false))
            .finally(() => {
              isTransitioningRef.current = false;
            });
        });
    } else {
      isTransitioningRef.current = false;
    }
  }, [currentTrackIndex]);

  // 3. User Controls: Pause & Resume
  const togglePlayPause = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
      hasUserPausedManually.current = true;
    } else {
      hasUserPausedManually.current = false;
      safePlay();
    }
  };

  // 4. User Controls: Mute & Unmute
  const toggleMute = () => {
    const audio = audioRef.current;
    if (!audio) return;

    const newMutedState = !isMuted;
    audio.muted = newMutedState;
    setIsMuted(newMutedState);
  };

  // 5. Background tab management: Pause on leave, resume on return
  useEffect(() => {
    const handleVisibilityChange = () => {
      const audio = audioRef.current;
      if (!audio) return;

      if (document.hidden) {
        if (isPlaying) {
          audio.pause();
          setIsPlaying(false);
        }
      } else {
        // Resuming tab: continue playing if user didn't manually pause
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
  }, [isPlaying]);

  if (isAdmin) return null;

  return (
    <>
      {/* 
        Single reliable native HTML5 Audio element
        - autoplay enabled
        - muted=false
        - playsInline enabled for mobile browsers
      */}
      <audio
        ref={audioRef}
        src={currentTrack.audioUrl}
        preload="auto"
        autoPlay
        playsInline
        onEnded={handleTrackEnded}
        onError={() => {
          const audio = audioRef.current;
          if (audio && audio.src !== currentTrack.fallbackUrl) {
            audio.src = currentTrack.fallbackUrl;
            audio.load();
            if (!hasUserPausedManually.current) {
              audio.play().catch(() => {});
            }
          }
        }}
      />

      {/* Floating Audio Control (Always visible on public pages) */}
      <div className="fixed bottom-5 right-5 sm:bottom-6 sm:right-6 z-40 transition-all duration-300">
        <div
          className={`flex items-center gap-2.5 px-3.5 py-2 rounded-full backdrop-blur-xl border shadow-[0_8px_30px_rgba(0,0,0,0.65),0_0_20px_rgba(183,154,98,0.2)] transition-all duration-300 ${
            autoplayBlocked && !isPlaying
              ? "bg-[#142A21] border-[#B79A62] text-[#F6F4ED] animate-pulse"
              : "bg-[#0D1C15]/95 border-[#B79A62]/45 text-[#F6F4ED] hover:border-[#B79A62]"
          }`}
        >
          {/* Audio Wave / Pulse Indicator */}
          <button
            onClick={togglePlayPause}
            className="relative w-8 h-8 rounded-full bg-[#19372D] border border-[#B79A62]/40 text-[#E8D6AC] flex items-center justify-center shrink-0 hover:scale-105 transition-transform"
            aria-label={isPlaying ? "Pause Recitation" : "Listen to Quran Recitation"}
            title={isPlaying ? "Pause" : "Listen"}
          >
            {isPlaying ? (
              <span className="flex items-end gap-0.5 h-3">
                <span className="w-0.5 h-2 bg-[#B79A62] rounded-full animate-pulse" />
                <span className="w-0.5 h-3 bg-[#B79A62] rounded-full animate-pulse delay-75" />
                <span className="w-0.5 h-1.5 bg-[#B79A62] rounded-full animate-pulse delay-150" />
              </span>
            ) : (
              <Play className="w-3.5 h-3.5 fill-current ml-0.5 text-[#E8D6AC]" />
            )}
          </button>

          {/* Current Recitation Info */}
          <div
            className="min-w-0 pr-1 text-left cursor-pointer select-none"
            onClick={togglePlayPause}
          >
            <div className="flex items-center gap-1.5">
              <span className="text-[11px] font-display font-bold text-[#F6F4ED] block leading-tight tracking-tight whitespace-nowrap">
                {currentTrack.surahName}
              </span>
              <span className="text-[9px] font-mono px-1.5 py-0.2 rounded-full bg-[#19372D] text-[#E8D6AC] border border-[#B79A62]/30">
                {currentTrackIndex === 0 ? "1/2" : "2/2"}
              </span>
            </div>
            <span className="text-[9px] font-mono text-[#E8D6AC]/85 block leading-none truncate whitespace-nowrap">
              {autoplayBlocked && !isPlaying
                ? "Tap to Listen with Sound"
                : `${currentTrack.reciter}`}
            </span>
          </div>

          {/* Pause / Resume Button */}
          <button
            onClick={togglePlayPause}
            className="w-7 h-7 rounded-full bg-white/5 border border-white/10 hover:border-[#B79A62] hover:bg-[#B79A62] hover:text-[#0A1410] text-[#E8D6AC] flex items-center justify-center transition-all duration-200 cursor-pointer"
            aria-label={isPlaying ? "Pause Recitation" : "Resume Recitation"}
            title={isPlaying ? "Pause" : "Play"}
          >
            {isPlaying ? (
              <Pause className="w-3.5 h-3.5 fill-current" />
            ) : (
              <Play className="w-3.5 h-3.5 ml-0.5 fill-current" />
            )}
          </button>

          {/* Mute / Unmute Button */}
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
    </>
  );
}
