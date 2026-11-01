"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { usePathname } from "next/navigation";
import { Volume2, VolumeX, Play, Pause, SkipForward, X, Music } from "lucide-react";
import { YOUTUBE_QURAN_PLAYLIST } from "@/lib/constants";

declare global {
  interface Window {
    YT: any;
    onYouTubeIframeAPIReady: () => void;
  }
}

export function AmbientQuranAudio() {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith("/admin");

  const playerRef = useRef<any>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const [currentTrackIndex, setCurrentTrackIndex] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [autoplayBlocked, setAutoplayBlocked] = useState<boolean>(false);
  const [showPopover, setShowPopover] = useState<boolean>(false);
  const [isApiReady, setIsApiReady] = useState<boolean>(false);

  const hasUserPausedManually = useRef<boolean>(false);
  const currentTrackIndexRef = useRef<number>(0);

  // Keep ref in sync for event listeners
  useEffect(() => {
    currentTrackIndexRef.current = currentTrackIndex;
  }, [currentTrackIndex]);

  const currentTrack = YOUTUBE_QURAN_PLAYLIST[currentTrackIndex];

  // Load YouTube IFrame Player API
  useEffect(() => {
    if (isAdmin) return;

    if (window.YT && window.YT.Player) {
      setIsApiReady(true);
      return;
    }

    const prevReady = window.onYouTubeIframeAPIReady;
    window.onYouTubeIframeAPIReady = () => {
      if (prevReady) prevReady();
      setIsApiReady(true);
    };

    if (!document.getElementById("youtube-iframe-api-script")) {
      const tag = document.createElement("script");
      tag.id = "youtube-iframe-api-script";
      tag.src = "https://www.youtube.com/iframe_api";
      tag.async = true;
      document.head.appendChild(tag);
    }
  }, [isAdmin]);

  // Handle track transition: 0 (HKlu1PDL0x0) -> 1 (gDl6s--vkmg) -> 0 -> 1...
  const handleTrackEnded = useCallback(() => {
    const nextIndex = (currentTrackIndexRef.current + 1) % YOUTUBE_QURAN_PLAYLIST.length;
    setCurrentTrackIndex(nextIndex);

    const player = playerRef.current;
    if (player && typeof player.loadVideoById === "function") {
      player.loadVideoById(YOUTUBE_QURAN_PLAYLIST[nextIndex].videoId);
    }
  }, []);

  // Initialize YouTube Player
  useEffect(() => {
    if (!isApiReady || isAdmin || playerRef.current) return;

    const playerId = "yt-quran-audio-element";
    const initialVideo = YOUTUBE_QURAN_PLAYLIST[0];

    try {
      playerRef.current = new window.YT.Player(playerId, {
        videoId: initialVideo.videoId,
        playerVars: {
          autoplay: 1,
          playsinline: 1,
          controls: 0,
          disablekb: 1,
          fs: 0,
          rel: 0,
          modestbranding: 1,
          origin: typeof window !== "undefined" ? window.location.origin : "",
        },
        events: {
          onReady: (event: any) => {
            const player = event.target;
            player.setVolume(90);
            player.unMute();

            // Attempt unmuted audible autoplay immediately on load
            player.playVideo();

            // Verify playback status after brief tick to detect browser policy block
            setTimeout(() => {
              try {
                const state = player.getPlayerState();
                if (state === 1) {
                  // Successfully playing
                  setIsPlaying(true);
                  setAutoplayBlocked(false);
                } else {
                  // Blocked by browser autoplay policy
                  setIsPlaying(false);
                  setAutoplayBlocked(true);
                }
              } catch (e) {
                setAutoplayBlocked(true);
              }
            }, 600);
          },
          onStateChange: (event: any) => {
            // YT.PlayerState: -1 (unstarted), 0 (ended), 1 (playing), 2 (paused), 3 (buffering), 5 (cued)
            const state = event.data;
            if (state === 0) {
              // Video ended -> transition to next track in loop
              handleTrackEnded();
            } else if (state === 1) {
              setIsPlaying(true);
              setAutoplayBlocked(false);
            } else if (state === 2) {
              setIsPlaying(false);
            }
          },
          onError: () => {
            // If video 1 fails for any reason, try video 2
            handleTrackEnded();
          },
        },
      });
    } catch (err) {
      console.warn("YouTube Player initialization notice:", err);
    }

    // Passive first-interaction listener if browser policy blocks initial audible autoplay
    const handleFirstUserInteraction = () => {
      const player = playerRef.current;
      if (player && !hasUserPausedManually.current) {
        try {
          if (typeof player.playVideo === "function") {
            player.unMute();
            player.playVideo();
            setIsPlaying(true);
            setAutoplayBlocked(false);
          }
        } catch (e) {}
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
  }, [isApiReady, isAdmin, handleTrackEnded]);

  // Tab visibility management: pause in background, resume upon return
  useEffect(() => {
    const handleVisibilityChange = () => {
      const player = playerRef.current;
      if (!player) return;

      if (document.hidden) {
        if (isPlaying && typeof player.pauseVideo === "function") {
          player.pauseVideo();
          setIsPlaying(false);
        }
      } else {
        if (!hasUserPausedManually.current && typeof player.playVideo === "function") {
          player.playVideo();
        }
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [isPlaying]);

  // Close popover when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setShowPopover(false);
      }
    };

    if (showPopover) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showPopover]);

  // Controls: Toggle Play / Pause
  const togglePlayPause = () => {
    const player = playerRef.current;
    if (!player) return;

    if (isPlaying) {
      if (typeof player.pauseVideo === "function") player.pauseVideo();
      setIsPlaying(false);
      hasUserPausedManually.current = true;
    } else {
      hasUserPausedManually.current = false;
      if (typeof player.unMute === "function") player.unMute();
      if (typeof player.playVideo === "function") player.playVideo();
      setIsPlaying(true);
      setAutoplayBlocked(false);
    }
  };

  // Controls: Skip to Next Track
  const skipToNext = () => {
    hasUserPausedManually.current = false;
    handleTrackEnded();
  };

  // Controls: Toggle Mute / Unmute
  const toggleMute = () => {
    const player = playerRef.current;
    if (!player) return;

    if (isMuted) {
      if (typeof player.unMute === "function") player.unMute();
      setIsMuted(false);
    } else {
      if (typeof player.mute === "function") player.mute();
      setIsMuted(true);
    }
  };

  if (isAdmin) return null;

  return (
    <div ref={containerRef} className="fixed bottom-6 right-6 z-40 select-none">
      {/* 
        Official YouTube IFrame Player API Container (Hidden offscreen)
        Complies strictly with API without extracting or downloading raw YouTube audio
      */}
      <div
        id="yt-quran-audio-element"
        style={{
          position: "fixed",
          left: "-9999px",
          top: "-9999px",
          width: "1px",
          height: "1px",
          opacity: 0,
          pointerEvents: "none",
        }}
        aria-hidden="true"
      />

      {/* Popover Card (Track Info & Granular Controls) */}
      {showPopover && (
        <div className="absolute bottom-full right-0 mb-3 w-72 p-4 rounded-3xl bg-[#0D1C15]/95 backdrop-blur-2xl border border-[#B79A62]/45 shadow-[0_20px_50px_rgba(0,0,0,0.85)] text-[#F6F4ED] animate-in fade-in zoom-in-95 duration-200">
          <div className="flex items-start justify-between border-b border-white/10 pb-2.5 mb-3">
            <div>
              <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#B79A62]" />
                <span className="text-[10px] font-mono uppercase tracking-wider text-[#E8D6AC] font-semibold">
                  Quran Recitation
                </span>
                <span className="text-[9px] font-mono px-1.5 py-0.5 rounded-full bg-[#19372D] text-[#E8D6AC] border border-[#B79A62]/30">
                  {currentTrackIndex === 0 ? "1/2" : "2/2"}
                </span>
              </div>
              <h4 className="font-display font-bold text-sm text-[#F6F4ED] mt-0.5">
                {currentTrack.title}
              </h4>
              <p className="text-[11px] font-mono text-[#DDE4D9]/70">
                {currentTrack.verses}
              </p>
              <p className="text-[10px] font-mono text-[#E8D6AC]/85 mt-0.5">
                {currentTrack.reciter}
              </p>
            </div>
            <button
              onClick={() => setShowPopover(false)}
              className="p-1 rounded-full text-[#DDE4D9]/60 hover:text-[#F6F4ED] transition-colors"
              aria-label="Close details"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Popover Controls */}
          <div className="flex items-center justify-between gap-2 pt-1">
            <button
              onClick={togglePlayPause}
              className="flex-1 py-2 rounded-xl bg-[#B79A62] text-[#0A1410] font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 hover:bg-[#D8C296] transition-colors shadow-md shadow-[#B79A62]/20"
            >
              {isPlaying ? (
                <>
                  <Pause className="w-3.5 h-3.5 fill-current" />
                  <span>Pause</span>
                </>
              ) : (
                <>
                  <Play className="w-3.5 h-3.5 fill-current ml-0.5" />
                  <span>Play</span>
                </>
              )}
            </button>

            <button
              onClick={skipToNext}
              className="p-2 rounded-xl bg-white/5 border border-white/10 hover:border-[#B79A62] text-[#E8D6AC] hover:text-[#F6F4ED] transition-colors"
              title="Next Recitation"
              aria-label="Next Recitation"
            >
              <SkipForward className="w-4 h-4" />
            </button>

            <button
              onClick={toggleMute}
              className="p-2 rounded-xl bg-white/5 border border-white/10 hover:border-[#B79A62] text-[#E8D6AC] hover:text-[#F6F4ED] transition-colors"
              title={isMuted ? "Unmute" : "Mute"}
              aria-label={isMuted ? "Unmute" : "Mute"}
            >
              {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            </button>
          </div>
        </div>
      )}

      {/* 
        Circular Floating Control Button (58–64px diameter)
        Emerald background, subtle champagne gold border, minimal soundwave animation
      */}
      <div className="relative group">
        <button
          onClick={() => {
            if (autoplayBlocked && !isPlaying) {
              togglePlayPause();
            } else {
              setShowPopover(!showPopover);
            }
          }}
          className={`relative w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-[#0D1C15] border-2 shadow-[0_10px_35px_rgba(0,0,0,0.8),0_0_20px_rgba(183,154,98,0.2)] flex items-center justify-center transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer ${
            autoplayBlocked && !isPlaying
              ? "border-[#B79A62] animate-bounce"
              : "border-[#B79A62]/50 hover:border-[#B79A62]"
          }`}
          aria-label={isPlaying ? "Quran Recitation Playing — Toggle Options" : "Listen to Quran Recitation"}
          title={isPlaying ? "Pause / Quran Options" : "Listen to Quran"}
        >
          {/* Animated Gold Ring when Playing */}
          {isPlaying && (
            <span className="absolute -inset-1 rounded-full border border-dashed border-[#B79A62]/60 animate-[spin_12s_linear_infinite] pointer-events-none" />
          )}

          {/* Minimal sound-wave animation inside the circle */}
          {isPlaying ? (
            <div className="flex items-end gap-0.5 h-4">
              <span className="w-0.5 h-2 bg-[#B79A62] rounded-full animate-pulse" />
              <span className="w-0.5 h-4 bg-[#E8D6AC] rounded-full animate-pulse delay-75" />
              <span className="w-0.5 h-2.5 bg-[#B79A62] rounded-full animate-pulse delay-150" />
            </div>
          ) : (
            <div className="flex items-center justify-center text-[#E8D6AC]">
              <Play className="w-5 h-5 fill-current ml-0.5" />
            </div>
          )}

          {/* Track Number Badge */}
          <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-[#19372D] border border-[#B79A62] text-[9px] font-mono text-[#E8D6AC] font-bold flex items-center justify-center shadow-md">
            {currentTrackIndex + 1}
          </span>
        </button>

        {/* Discreet Autoplay Blocked Beacon Callout */}
        {autoplayBlocked && !isPlaying && !showPopover && (
          <div
            onClick={togglePlayPause}
            className="absolute bottom-full right-0 mb-2.5 whitespace-nowrap px-3 py-1.5 rounded-full bg-[#142A21] border border-[#B79A62] text-[11px] font-mono text-[#E8D6AC] shadow-xl cursor-pointer hover:bg-[#1A382C] transition-colors flex items-center gap-1.5"
          >
            <Play className="w-3 h-3 fill-current" />
            <span>Tap to Listen ({currentTrack.title})</span>
          </div>
        )}
      </div>
    </div>
  );
}
