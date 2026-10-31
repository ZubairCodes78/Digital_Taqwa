"use client";

import { useState, useRef, useEffect } from "react";
import { QURAN_AUDIO } from "@/lib/constants";
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  Music,
  ChevronUp,
  ChevronDown,
} from "lucide-react";

export function QuranAudioPlayer() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [volume, setVolume] = useState<number>(0.75);
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>(0);
  const [hasError, setHasError] = useState<boolean>(false);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.volume = volume;

    const handleTimeUpdate = () => setCurrentTime(audio.currentTime);
    const handleLoadedMetadata = () => setDuration(audio.duration || 0);
    const handleEnded = () => setIsPlaying(false);
    const handleError = () => setHasError(true);

    audio.addEventListener("timeupdate", handleTimeUpdate);
    audio.addEventListener("loadedmetadata", handleLoadedMetadata);
    audio.addEventListener("ended", handleEnded);
    audio.addEventListener("error", handleError);

    return () => {
      audio.removeEventListener("timeupdate", handleTimeUpdate);
      audio.removeEventListener("loadedmetadata", handleLoadedMetadata);
      audio.removeEventListener("ended", handleEnded);
      audio.removeEventListener("error", handleError);
    };
  }, [volume]);

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
          setHasError(false);
        })
        .catch((err) => {
          console.warn("Audio playback prevented:", err);
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
    const newVol = parseFloat(e.target.value);
    setVolume(newVol);
    if (audioRef.current) {
      audioRef.current.volume = newVol;
      audioRef.current.muted = newVol === 0;
      setIsMuted(newVol === 0);
    }
  };

  const formatTime = (secs: number) => {
    if (isNaN(secs) || secs === 0) return "0:00";
    const mins = Math.floor(secs / 60);
    const remainder = Math.floor(secs % 60);
    return `${mins}:${remainder < 10 ? "0" : ""}${remainder}`;
  };

  return (
    <>
      {/* Hidden Native Audio Element */}
      <audio
        ref={audioRef}
        src={QURAN_AUDIO.audioUrl}
        preload="metadata"
        playsInline
      />

      {/* Floating Audio Controller */}
      <div
        className="fixed bottom-6 right-6 z-40 max-w-[calc(100vw-3rem)] sm:max-w-sm transition-all duration-300"
        role="region"
        aria-label="Quran Recitation Audio Experience"
      >
        <div className="bg-[#121A15]/90 backdrop-blur-md border border-[#D6B56D]/25 rounded-2xl shadow-2xl p-3 sm:p-3.5 text-ivory">
          {/* Main Top Bar */}
          <div className="flex items-center space-x-3">
            {/* Play/Pause Button */}
            <button
              onClick={togglePlay}
              className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                isPlaying
                  ? "bg-[#D6B56D] text-[#121A15] shadow-lg shadow-[#D6B56D]/30"
                  : "bg-forest-light text-ivory hover:bg-[#D6B56D] hover:text-[#121A15]"
              }`}
              aria-label={isPlaying ? "Pause Quran Recitation" : "Listen to Quran Recitation"}
              title={isPlaying ? "Pause" : "Listen to Recitation"}
            >
              {isPlaying ? (
                <Pause className="w-4 h-4 fill-current" />
              ) : (
                <Play className="w-4 h-4 fill-current ml-0.5" />
              )}
            </button>

            {/* Recitation Title & Waveform */}
            <div
              className="flex-1 min-w-0 cursor-pointer select-none"
              onClick={() => setIsExpanded(!isExpanded)}
            >
              <div className="flex items-center space-x-1.5">
                <span className="text-[10px] font-mono uppercase tracking-wider text-[#D6B56D] font-semibold">
                  Recitation
                </span>
                {isPlaying && (
                  <span className="flex items-center space-x-0.5" aria-hidden="true">
                    <span className="w-1 h-2 bg-[#D6B56D] rounded-full animate-pulse" />
                    <span className="w-1 h-3.5 bg-[#D6B56D] rounded-full animate-pulse delay-75" />
                    <span className="w-1 h-2.5 bg-[#D6B56D] rounded-full animate-pulse delay-150" />
                  </span>
                )}
              </div>
              <p className="text-xs font-serif font-medium text-ivory truncate">
                {QURAN_AUDIO.title}
              </p>
              <p className="text-[10px] text-sage/75 truncate">
                {QURAN_AUDIO.reciter}
              </p>
            </div>

            {/* Expand / Minimize Toggle */}
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="p-1.5 text-sage/70 hover:text-ivory transition-colors"
              aria-label={isExpanded ? "Collapse audio details" : "Expand audio controls"}
            >
              {isExpanded ? (
                <ChevronDown className="w-4 h-4" />
              ) : (
                <ChevronUp className="w-4 h-4" />
              )}
            </button>
          </div>

          {/* Expanded Controls Drawer */}
          {isExpanded && (
            <div className="mt-3 pt-3 border-t border-[#D6B56D]/15 space-y-3 animate-in fade-in duration-200">
              {/* Progress & Duration */}
              <div className="flex items-center justify-between text-[10px] text-sage/75 font-mono">
                <span>{formatTime(currentTime)}</span>
                <span className="text-[10px] uppercase tracking-wider text-[#D6B56D]/80">
                  {isPlaying ? "Playing in background" : "Optional Peaceful Reflection"}
                </span>
                <span>{formatTime(duration)}</span>
              </div>

              {/* Progress bar */}
              <div className="w-full bg-charcoal/40 h-1.5 rounded-full overflow-hidden">
                <div
                  className="bg-[#D6B56D] h-full transition-all duration-300 rounded-full"
                  style={{
                    width: `${duration > 0 ? (currentTime / duration) * 100 : 0}%`,
                  }}
                />
              </div>

              {/* Volume Slider & Mute Toggle */}
              <div className="flex items-center space-x-3 pt-1">
                <button
                  onClick={toggleMute}
                  className="text-sage/80 hover:text-ivory transition-colors"
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
                  className="w-full h-1 bg-charcoal/50 rounded-lg appearance-none cursor-pointer accent-[#D6B56D]"
                  aria-label="Volume slider"
                />

                <span className="text-[10px] font-mono text-sage/75 w-8 text-right">
                  {Math.round((isMuted ? 0 : volume) * 100)}%
                </span>
              </div>

              {/* Source attribution license note */}
              <div className="flex items-center justify-between text-[9px] text-sage/60 pt-1 border-t border-[#D6B56D]/10">
                <span>License: Open Community Audio</span>
                <span>Never Autoplays</span>
              </div>
            </div>
          )}

          {hasError && (
            <div className="mt-2 text-[10px] text-amber-300 text-center">
              Audio stream temporarily unavailable.
            </div>
          )}
        </div>
      </div>
    </>
  );
}

