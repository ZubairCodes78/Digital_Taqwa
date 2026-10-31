"use client";

import { useEffect, useRef, useState } from "react";
import { Volume2, VolumeX } from "lucide-react";

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
    // https://www.youtube.com/watch?v=gDl6s--vkmg
    id: "gDl6s--vkmg",
    title: "Surah Al-Mu’minun",
    reciter: "Sheikh Yasser Al-Dosari",
    verseRef: "Qul Limanil Ardu Wa Man Fiha",
  },
  {
    // 2nd Recitation: Surah Al-Fajr (Kalla Iza Dukkati Al-Ardu)
    // https://www.youtube.com/shorts/HKlu1PDL0x0
    id: "HKlu1PDL0x0",
    title: "Surah Al-Fajr",
    reciter: "Sheikh Yasser Al-Dosari",
    verseRef: "Kalla Iza Dukkati Al-Ard",
  },
];

export function AmbientQuranAudio() {
  const playerRef = useRef<any>(null);
  const currentTrackIndexRef = useRef<number>(0);
  const [currentTrackIndex, setCurrentTrackIndex] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [isReady, setIsReady] = useState<boolean>(false);

  useEffect(() => {
    let isMounted = true;

    // Helper: start playback of current track
    const playCurrentTrack = () => {
      if (playerRef.current && typeof playerRef.current.playVideo === "function") {
        try {
          playerRef.current.unMute();
          playerRef.current.playVideo();
          setIsPlaying(true);
          setIsMuted(false);
        } catch (e) {
          console.warn("Autoplay trigger note:", e);
        }
      }
    };

    // Helper: Pause immediately when user leaves the browser
    const stopOnLeave = () => {
      if (playerRef.current && typeof playerRef.current.pauseVideo === "function") {
        try {
          playerRef.current.pauseVideo();
        } catch {}
      }
      setIsPlaying(false);
    };

    // Helper: Restart with 1st recitation from the beginning when user returns to the browser
    const restartFirstTrackOnReturn = () => {
      currentTrackIndexRef.current = 0;
      setCurrentTrackIndex(0);
      if (playerRef.current && typeof playerRef.current.loadVideoById === "function") {
        try {
          playerRef.current.loadVideoById({
            videoId: RECITATIONS[0].id,
            startSeconds: 0,
          });
          playerRef.current.unMute();
          playerRef.current.playVideo();
          setIsPlaying(true);
          setIsMuted(false);
        } catch (e) {
          console.warn("Return playback error:", e);
        }
      }
    };

    // Tab visibility & Window focus listeners
    const handleVisibilityChange = () => {
      if (document.hidden) {
        stopOnLeave();
      } else {
        restartFirstTrackOnReturn();
      }
    };

    const handleWindowBlur = () => {
      stopOnLeave();
    };

    const handleWindowFocus = () => {
      if (!document.hidden) {
        restartFirstTrackOnReturn();
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("blur", handleWindowBlur);
    window.addEventListener("focus", handleWindowFocus);

    // Initial zero-click user gesture listener (fallback for strict browser autoplay policies)
    const handleFirstGesture = () => {
      playCurrentTrack();
      cleanupGestureListeners();
    };

    const cleanupGestureListeners = () => {
      window.removeEventListener("pointerdown", handleFirstGesture);
      window.removeEventListener("touchstart", handleFirstGesture);
      window.removeEventListener("scroll", handleFirstGesture);
      window.removeEventListener("mousemove", handleFirstGesture);
      window.removeEventListener("keydown", handleFirstGesture);
    };

    window.addEventListener("pointerdown", handleFirstGesture, { passive: true, once: true });
    window.addEventListener("touchstart", handleFirstGesture, { passive: true, once: true });
    window.addEventListener("scroll", handleFirstGesture, { passive: true, once: true });
    window.addEventListener("mousemove", handleFirstGesture, { passive: true, once: true });
    window.addEventListener("keydown", handleFirstGesture, { passive: true, once: true });

    // Load YouTube IFrame API
    const loadAPI = () => {
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
    };

    const mountPlayer = () => {
      const container = document.getElementById("yt-exclusive-audio-frame");
      if (!container || playerRef.current) return;

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
              setIsReady(true);
              try {
                event.target.setVolume(85);
                event.target.unMute();
                event.target.playVideo();
                setIsPlaying(true);
              } catch {}
            },
            onStateChange: (event: any) => {
              if (!isMounted) return;

              // 1 = PLAYING
              if (event.data === 1) {
                setIsPlaying(true);
              } else if (event.data === 2) {
                // 2 = PAUSED
                setIsPlaying(false);
              } else if (event.data === 0) {
                // 0 = ENDED
                // Requirement: When 1st recitation completes, automatically start 2nd one!
                if (currentTrackIndexRef.current === 0) {
                  currentTrackIndexRef.current = 1;
                  setCurrentTrackIndex(1);
                  event.target.loadVideoById({
                    videoId: RECITATIONS[1].id,
                    startSeconds: 0,
                  });
                  event.target.playVideo();
                  setIsPlaying(true);
                } else {
                  // After 2nd recitation completes, loop back to 1st recitation
                  currentTrackIndexRef.current = 0;
                  setCurrentTrackIndex(0);
                  event.target.loadVideoById({
                    videoId: RECITATIONS[0].id,
                    startSeconds: 0,
                  });
                  event.target.playVideo();
                  setIsPlaying(true);
                }
              }
            },
          },
        });
      } catch (e) {
        console.warn("YouTube player init error:", e);
      }
    };

    loadAPI();

    return () => {
      isMounted = false;
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
  }, []);

  const toggleSound = () => {
    if (!playerRef.current) return;

    try {
      if (isPlaying && !isMuted) {
        playerRef.current.pauseVideo();
        setIsPlaying(false);
      } else if (!isPlaying) {
        playerRef.current.unMute();
        playerRef.current.playVideo();
        setIsPlaying(true);
        setIsMuted(false);
      } else if (isMuted) {
        playerRef.current.unMute();
        setIsMuted(false);
      }
    } catch (e) {
      console.warn("Error toggling YouTube sound:", e);
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

      {/* Floating Sound Controller — Pure Round Circular Emblem on Right Bottom Corner */}
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
