"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { QURAN_CLIPS } from "@/lib/constants";
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  ChevronUp,
  ChevronDown,
  Music2,
  RotateCcw,
} from "lucide-react";

export function QuranCinematicExperience() {
  const [selectedClipIndex, setSelectedClipIndex] = useState<number>(0);
  const currentClip = QURAN_CLIPS[selectedClipIndex] || QURAN_CLIPS[0];

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [volume, setVolume] = useState<number>(0.75);
  const [autoplayBlocked, setAutoplayBlocked] = useState<boolean>(false);
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>(0);

  // Attempt browser autoplay on mount
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.volume = volume;

    // Browser autoplay attempt
    const promise = audio.play();
    if (promise !== undefined) {
      promise
        .then(() => {
          setIsPlaying(true);
          setAutoplayBlocked(false);
        })
        .catch(() => {
          // Audible autoplay blocked by browser policy
          setAutoplayBlocked(true);
          setIsPlaying(false);
        });
    }

    const handleFirstUserClick = () => {
      if (audioRef.current && audioRef.current.paused) {
        audioRef.current
          .play()
          .then(() => {
            setIsPlaying(true);
            setAutoplayBlocked(false);
          })
          .catch(() => {});
      }
    };

    window.addEventListener("click", handleFirstUserClick, { once: true });
    return () => {
      window.removeEventListener("click", handleFirstUserClick);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Sync audio events
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.volume = volume;

    const handleTimeUpdate = () => {
      setCurrentTime(audio.currentTime);
      // Auto-stop if clip exceeds designated length
      if (currentClip.id === "ar_rahman" && audio.currentTime > 65) {
        audio.pause();
        audio.currentTime = 0;
        setIsPlaying(false);
      } else if (currentClip.id === "al_fajr" && audio.currentTime > 70) {
        audio.pause();
        audio.currentTime = 0;
        setIsPlaying(false);
      }
    };

    const handleLoadedMetadata = () => {
      setDuration(audio.duration || 0);
    };

    const handleEnded = () => {
      setIsPlaying(false);
      audio.currentTime = 0;
    };

    audio.addEventListener("timeupdate", handleTimeUpdate);
    audio.addEventListener("loadedmetadata", handleLoadedMetadata);
    audio.addEventListener("ended", handleEnded);

    return () => {
      audio.removeEventListener("timeupdate", handleTimeUpdate);
      audio.removeEventListener("loadedmetadata", handleLoadedMetadata);
      audio.removeEventListener("ended", handleEnded);
    };
  }, [currentClip, volume]);

  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
    } else {
      audio
        .play()
        .then(() => {
          setIsPlaying(true);
          setAutoplayBlocked(false);
        })
        .catch((err) => {
          console.warn("Play failed:", err);
          setIsPlaying(false);
        });
    }
  };

  const toggleMute = () => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    setVolume(val);
    if (audioRef.current) {
      audioRef.current.volume = val;
      audioRef.current.muted = val === 0;
      setIsMuted(val === 0);
    }
  };

  const selectClip = (idx: number) => {
    setSelectedClipIndex(idx);
    const audio = audioRef.current;
    if (audio) {
      audio.pause();
      audio.src = QURAN_CLIPS[idx].audioUrl;
      audio.currentTime = 0;
      audio.play().then(() => {
        setIsPlaying(true);
        setAutoplayBlocked(false);
      });
    }
  };

  const formatTime = (secs: number) => {
    if (isNaN(secs) || secs === 0) return "0:00";
    const mins = Math.floor(secs / 60);
    const rem = Math.floor(secs % 60);
    return `${mins}:${rem < 10 ? "0" : ""}${rem}`;
  };

  return (
    <>
      <audio
        ref={audioRef}
        src={currentClip.audioUrl}
        preload="metadata"
        playsInline
      />

      {/* PROMINENT "TAP TO EXPERIENCE RECITATION" CALLOUT (When Autoplay Blocked) */}
      {autoplayBlocked && !isPlaying && (
        <div className="fixed top-24 left-1/2 -translate-x-1/2 z-50 animate-bounce duration-1000">
          <button
            onClick={togglePlay}
            className="shimmer-badge px-6 py-3 rounded-full bg-[#B79A62] text-[#0A1410] text-xs uppercase font-mono font-black tracking-wider shadow-2xl flex items-center space-x-2.5 border-2 border-white/50 hover:scale-105 transition-transform"
          >
            <Volume2 className="w-4 h-4 text-[#0A1410]" />
            <span>Tap to Experience Quran Recitation</span>
          </button>
        </div>
      )}

      {/* FLOATING CONTROLLER (BOTTOM RIGHT) */}
      <div
        className="fixed bottom-5 right-5 z-40 max-w-xs transition-all duration-300"
        role="region"
        aria-label="Quran Recitation Experience"
      >
        <div className="bg-[#0E1A14]/90 backdrop-blur-xl border border-[#D6B56D]/30 rounded-2xl p-2 sm:p-2.5 text-ivory shadow-xl">
          {/* Main Bar */}
          <div className="flex items-center space-x-2.5">
            {/* Play/Pause Button */}
            <button
              onClick={togglePlay}
              className={`w-8 h-8 rounded-full flex items-center justify-center transition-all shrink-0 ${isPlaying
                  ? "bg-[#D6B56D] text-[#0E1A14] shadow-md shadow-[#D6B56D]/30"
                  : "bg-white/10 text-ivory hover:bg-[#D6B56D] hover:text-[#0E1A14]"
                }`}
              aria-label={isPlaying ? "Pause Recitation" : "Listen to Recitation"}
            >
              {isPlaying ? (
                <Pause className="w-4 h-4 fill-current" />
              ) : (
                <Play className="w-4 h-4 fill-current ml-0.5" />
              )}
            </button>

            {/* Recitation Info & Waveform */}
            <div
              className="flex-1 min-w-0 cursor-pointer select-none"
              onClick={() => setIsExpanded(!isExpanded)}
            >
              <div className="flex items-center space-x-2">
                <span className="text-[10px] font-mono uppercase tracking-wider text-[#D6B56D] font-bold">
                  {currentClip.surahName}
                </span>
                <span className="text-[10px] text-sage/70 font-mono">
                  {currentClip.verseRange}
                </span>
                {isPlaying && (
                  <span className="flex items-center space-x-0.5" aria-hidden="true">
                    <span className="w-1 h-2 bg-[#D6B56D] rounded-full animate-pulse" />
                    <span className="w-1 h-3.5 bg-[#D6B56D] rounded-full animate-pulse delay-75" />
                    <span className="w-1 h-2 bg-[#D6B56D] rounded-full animate-pulse delay-150" />
                  </span>
                )}
              </div>
              <p className="text-xs text-sage/90 truncate font-light italic">
                {currentClip.passageMeaning}
              </p>
              <p className="text-[10px] text-sage/60 font-mono truncate">
                Reciter: {currentClip.reciter}
              </p>
            </div>

            {/* Expand / Minimize Toggle */}
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="p-2 text-sage hover:text-ivory transition-colors"
              aria-label="Toggle recitation details"
            >
              {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
            </button>
          </div>

          {/* Expanded Drawer: Clip Selection, Volume & Etiquette */}
          {isExpanded && (
            <div className="mt-3 pt-3 border-t border-[#D6B56D]/15 space-y-3.5 animate-in fade-in duration-200">
              {/* Select from Curated Clips */}
              <div>
                <span className="text-[10px] uppercase font-mono tracking-widest text-[#B79A62] block mb-2 font-semibold">
                  Select Recitation Passage
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
                  {QURAN_CLIPS.map((clip, idx) => (
                    <button
                      key={clip.id}
                      onClick={() => selectClip(idx)}
                      className={`p-2 rounded-xl text-left text-xs font-mono border transition-all ${selectedClipIndex === idx
                          ? "bg-[#B79A62]/25 border-[#B79A62] text-white font-bold shadow-sm"
                          : "bg-white/5 border-white/10 text-sage hover:bg-white/10"
                        }`}
                    >
                      <div className="truncate font-semibold">{clip.surahName}</div>
                      <div className="text-[9px] text-[#B79A62] truncate">{clip.reciter.replace("Sheikh ", "")}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Volume Slider & Progress */}
              <div className="flex items-center space-x-3 pt-1">
                <button
                  onClick={toggleMute}
                  className="text-sage hover:text-ivory transition-colors"
                  aria-label={isMuted ? "Unmute" : "Mute"}
                >
                  {isMuted || volume === 0 ? (
                    <VolumeX className="w-3.5 h-3.5" />
                  ) : (
                    <Volume2 className="w-3.5 h-3.5" />
                  )}
                </button>

                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={isMuted ? 0 : volume}
                  onChange={handleVolumeChange}
                  className="w-full h-1 bg-white/20 rounded-lg appearance-none cursor-pointer accent-[#D6B56D]"
                  aria-label="Volume slider"
                />

                <span className="text-[10px] font-mono text-sage w-10 text-right">
                  {Math.round((isMuted ? 0 : volume) * 100)}%
                </span>
              </div>

              {/* Quranic Etiquette Notice */}
              <div className="pt-2 border-t border-white/5 flex items-center justify-between text-[9px] font-mono text-sage/60">
                <span>Authentic Public Domain Recitation</span>
                <span>Optional &bull; Never Forced</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

