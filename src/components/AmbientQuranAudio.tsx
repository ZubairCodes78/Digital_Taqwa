"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { Volume2, VolumeX, Play, X } from "lucide-react";

declare global {
  interface Window {
    YT: any;
    onYouTubeIframeAPIReady: () => void;
  }
}

interface RecitationTrack {
  id: string;
  title: string;
  reciter: string;
  verseRef: string;
}

const RECITATIONS: RecitationTrack[] = [
  {
    // 1st Recitation: Surah Al-Mu'minun by Sheikh Yasser Al-Dosari
    id: "gDl6s--vkmg",
    title: "Surah Al-Mu’minun",
    reciter: "Sheikh Yasser Al-Dosari",
    verseRef: "Qul Limanil Ardu Wa Man Fiha",
  },
  {
    // 2nd Recitation: Surah Al-Fajr by Sheikh Yasser Al-Dosari
    id: "HKlu1PDL0x0",
    title: "Surah Al-Fajr",
    reciter: "Sheikh Yasser Al-Dosari",
    verseRef: "Kalla Iza Dukkati Al-Ard",
  },
];

export function AmbientQuranAudio() {
  const playerRef = useRef<any>(null);
  const currentTrackIndexRef = useRef<number>(0);
  const isPlayingRef = useRef<boolean>(false);
  const [currentTrackIndex, setCurrentTrackIndex] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [showAutoplayPrompt, setShowAutoplayPrompt] = useState<boolean>(true);
  const [isDismissed, setIsDismissed] = useState<boolean>(false);

  // Helper to start or resume playback
  const playCurrentTrack = useCallback(() => {
    if (playerRef.current && typeof playerRef.current.playVideo === "function") {
      try {
        playerRef.current.unMute();
        playerRef.current.setVolume(90);
        playerRef.current.playVideo();
      } catch (e) {
        console.warn("Audio play trigger:", e);
      }
    }
  }, []);

  // Helper to pause audio
  const pauseCurrentTrack = useCallback(() => {
    if (playerRef.current && typeof playerRef.current.pauseVideo === "function") {
      try {
        playerRef.current.pauseVideo();
      } catch {}
    }
    setIsPlaying(false);
    isPlayingRef.current = false;
  }, []);

  // Helper to restart track 1 from the beginning when user returns to tab
  const restartFirstTrack = useCallback(() => {
    currentTrackIndexRef.current = 0;
    setCurrentTrackIndex(0);
    if (playerRef.current && typeof playerRef.current.loadVideoById === "function") {
      try {
        playerRef.current.loadVideoById({
          videoId: RECITATIONS[0].id,
          startSeconds: 0,
        });
        playerRef.current.unMute();
        playerRef.current.setVolume(90);
        playerRef.current.playVideo();
      } catch (e) {
        console.warn("Return playback error:", e);
      }
    }
  }, []);

  useEffect(() => {
    let isMounted = true;
    let autoplayCheckTimer: NodeJS.Timeout;

    // Visibility & Focus listeners (pause on leave, restart track 1 on return)
    const handleVisibilityChange = () => {
      if (document.hidden) {
        pauseCurrentTrack();
      } else {
        restartFirstTrack();
      }
    };

    const handleWindowBlur = () => {
      pauseCurrentTrack();
    };

    const handleWindowFocus = () => {
      if (!document.hidden) {
        restartFirstTrack();
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("blur", handleWindowBlur);
    window.addEventListener("focus", handleWindowFocus);

    // Initial user gesture listener (fallback for strict browser autoplay policies)
    const handleFirstGesture = () => {
      if (!isPlayingRef.current) {
        playCurrentTrack();
      }
      cleanupGestureListeners();
    };

    const cleanupGestureListeners = () => {
      window.removeEventListener("pointerdown", handleFirstGesture);
      window.removeEventListener("touchstart", handleFirstGesture);
      window.removeEventListener("click", handleFirstGesture);
      window.removeEventListener("keydown", handleFirstGesture);
    };

    window.addEventListener("pointerdown", handleFirstGesture, { passive: true, once: true });
    window.addEventListener("touchstart", handleFirstGesture, { passive: true, once: true });
    window.addEventListener("click", handleFirstGesture, { passive: true, once: true });
    window.addEventListener("keydown", handleFirstGesture, { passive: true, once: true });

    // Mount YouTube player
    const mountPlayer = () => {
      const container = document.getElementById("yt-exclusive-audio-frame");
      if (!container || playerRef.current || !window.YT || !window.YT.Player) return;

      try {
        playerRef.current = new window.YT.Player("yt-exclusive-audio-frame", {
          height: "1",
          width: "1",
          videoId: RECITATIONS[0].id,
          playerVars: {
            autoplay: 1,
            controls: 0,
            disablekb: 1,
            fs: 0,
            modestbranding: 1,
            playsinline: 1,
            rel: 0,
          },
          events: {
            onReady: (event: any) => {
              if (!isMounted) return;
              try {
                event.target.setVolume(90);
                event.target.unMute();
                event.target.playVideo();
              } catch {}

              // Check if browser allowed autoplay after 1.4s
              autoplayCheckTimer = setTimeout(() => {
                if (isMounted && !isPlayingRef.current) {
                  // Autoplay blocked by browser policy — keep fallback prompt visible
                  setShowAutoplayPrompt(true);
                }
              }, 1400);
            },
            onStateChange: (event: any) => {
              if (!isMounted) return;

              // 1 = PLAYING (Confirmed audible playback)
              if (event.data === 1) {
                setIsPlaying(true);
                isPlayingRef.current = true;
                setShowAutoplayPrompt(false); // Hide fallback prompt immediately on playback
              } else if (event.data === 2) {
                // 2 = PAUSED
                setIsPlaying(false);
                isPlayingRef.current = false;
              } else if (event.data === 0) {
                // 0 = ENDED -> Advance sequence: 1st track -> 2nd track -> 1st track
                if (currentTrackIndexRef.current === 0) {
                  currentTrackIndexRef.current = 1;
                  setCurrentTrackIndex(1);
                  event.target.loadVideoById({
                    videoId: RECITATIONS[1].id,
                    startSeconds: 0,
                  });
                  event.target.playVideo();
                } else {
                  currentTrackIndexRef.current = 0;
                  setCurrentTrackIndex(0);
                  event.target.loadVideoById({
                    videoId: RECITATIONS[0].id,
                    startSeconds: 0,
                  });
                  event.target.playVideo();
                }
              }
            },
          },
        });
      } catch (e) {
        console.warn("YouTube player setup warning:", e);
      }
    };

    // Load or attach to YouTube IFrame API
    if (!window.YT || !window.YT.Player) {
      if (!document.getElementById("youtube-iframe-api")) {
        const script = document.createElement("script");
        script.id = "youtube-iframe-api";
        script.src = "https://www.youtube.com/iframe_api";
        const firstScript = document.getElementsByTagName("script")[0];
        firstScript?.parentNode?.insertBefore(script, firstScript);
      }
      const prevCallback = window.onYouTubeIframeAPIReady;
      window.onYouTubeIframeAPIReady = () => {
        if (prevCallback) prevCallback();
        if (isMounted) mountPlayer();
      };
    } else {
      mountPlayer();
    }

    return () => {
      isMounted = false;
      clearTimeout(autoplayCheckTimer);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("blur", handleWindowBlur);
      window.removeEventListener("focus", handleWindowFocus);
      cleanupGestureListeners();
      if (playerRef.current && typeof playerRef.current.destroy === "function") {
        try {
          playerRef.current.destroy();
          playerRef.current = null;
        } catch {}
      }
    };
  }, [playCurrentTrack, pauseCurrentTrack, restartFirstTrack]);

  // Toggle sound controller
  const toggleSound = () => {
    if (!playerRef.current) return;
    if (isPlaying) {
      pauseCurrentTrack();
    } else {
      playCurrentTrack();
    }
  };

  const currentTrack = RECITATIONS[currentTrackIndex] || RECITATIONS[0];

  return (
    <>
      {/* Invisible YouTube Player Container — Sole Audio Stream */}
      <div
        className="fixed -top-96 -left-96 w-1 h-1 opacity-0 pointer-events-none overflow-hidden"
        aria-hidden="true"
      >
        <div id="yt-exclusive-audio-frame" />
      </div>

      {/* Elegant "Tap to Listen to Quran" Autoplay Fallback Prompt */}
      {showAutoplayPrompt && !isPlaying && !isDismissed && (
        <div className="fixed bottom-22 right-5 sm:bottom-24 sm:right-6 z-40 animate-fade-in-up max-w-xs sm:max-w-sm">
          <div
            onClick={playCurrentTrack}
            className="group relative p-3 sm:p-4 rounded-2xl bg-[#0D1C15]/95 backdrop-blur-2xl border-2 border-[#B79A62]/65 text-[#F6F4ED] shadow-[0_12px_40px_rgba(0,0,0,0.7),0_0_25px_rgba(183,154,98,0.25)] hover:border-[#B79A62] hover:bg-[#142920] transition-all duration-300 cursor-pointer flex items-center gap-3.5"
            role="button"
            aria-label="Tap to Listen to Quran Recitation"
          >
            {/* Animated Golden Play Icon with Pulse Halo */}
            <div className="relative w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-[#B79A62] text-[#0A1410] flex items-center justify-center shrink-0 shadow-md group-hover:scale-105 transition-transform">
              <Play className="w-5 h-5 fill-current ml-0.5" />
              <span className="absolute -inset-1 rounded-xl border border-[#B79A62]/60 animate-ping opacity-40 pointer-events-none" />
            </div>

            {/* Label & Reciter Details */}
            <div className="min-w-0 flex-1 pr-4">
              <span className="font-display text-xs sm:text-sm font-black text-[#F6F4ED] block leading-tight tracking-tight group-hover:text-[#E8D6AC] transition-colors">
                Tap to Listen to Quran
              </span>
              <span className="text-[10px] sm:text-[11px] font-mono text-[#E8D6AC]/85 block truncate mt-0.5">
                {currentTrack.reciter} &bull; {currentTrack.title}
              </span>
            </div>

            {/* Dismiss button */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                setIsDismissed(true);
              }}
              className="absolute top-2 right-2 p-1 text-[#DDE4D9]/50 hover:text-[#DDE4D9] transition-colors rounded-full"
              aria-label="Dismiss audio prompt"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* Floating Circular Recitation FAB in Bottom-Right Corner */}
      <div className="fixed bottom-5 right-5 sm:bottom-6 sm:right-6 z-40">
        <button
          onClick={toggleSound}
          className="group relative w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-[#0D1C15]/95 backdrop-blur-xl border-2 border-[#B79A62]/65 text-[#F6F4ED] hover:border-[#B79A62] hover:bg-[#162D23] transition-all duration-300 shadow-[0_4px_24px_rgba(0,0,0,0.6),0_0_20px_rgba(183,154,98,0.25)] hover:shadow-[0_4px_30px_rgba(0,0,0,0.7),0_0_30px_rgba(183,154,98,0.45)] hover:scale-105 active:scale-95 flex items-center justify-center cursor-pointer"
          aria-label={isPlaying ? "Pause Recitation" : "Play Recitation"}
          title={`${currentTrack.title} (${currentTrackIndex === 0 ? "Track 1" : "Track 2"}) — ${currentTrack.reciter} | Tap to ${isPlaying ? "Pause" : "Play"}`}
        >
          {/* Animated Orbital Ring When Active */}
          {isPlaying && (
            <div className="absolute -inset-1 rounded-full border border-dashed border-[#B79A62]/50 animate-[spin_10s_linear_infinite] pointer-events-none" />
          )}

          {/* Small Round Track Badge on Top Right of Circle */}
          <span
            className={`absolute -top-1 -right-1 w-5 h-5 rounded-full font-mono text-[9px] font-black flex items-center justify-center shadow-md border border-[#0A1410] transition-colors ${
              isPlaying
                ? "bg-[#B79A62] text-[#0A1410]"
                : "bg-[#19372D] text-[#DDE4D9] border-[#B79A62]/40"
            }`}
          >
            {currentTrackIndex === 0 ? "1" : "2"}
          </span>

          {/* Centered Volume Icon */}
          {isPlaying ? (
            <Volume2 className="w-5 h-5 text-[#E8D6AC] transition-transform group-hover:scale-110" />
          ) : (
            <VolumeX className="w-5 h-5 text-[#DDE4D9]/60 transition-transform group-hover:scale-110" />
          )}
        </button>
      </div>
    </>
  );
}
