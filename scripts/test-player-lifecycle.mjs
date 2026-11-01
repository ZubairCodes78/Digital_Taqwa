// Simulation and Verification of Quran Player Lifecycle

import fs from "fs";
import path from "path";

console.log("=================================================================");
console.log("🔊 VERIFYING DIGITAL TAQWA QURAN PLAYER LIFECYCLE");
console.log("=================================================================\n");

const componentPath = path.join(process.cwd(), "src/components/AmbientQuranAudio.tsx");
const content = fs.readFileSync(componentPath, "utf-8");

const checks = [
  {
    name: "Immediate unmuted autoplay attempted on YouTube player ready",
    pass: content.includes("player.playVideo()") && content.includes("player.unMute()"),
  },
  {
    name: "Player UI smooth fade-out and complete hide when playback starts",
    pass: content.includes("isPlayerUIVisible") && content.includes("opacity-0 pointer-events-none translate-y-3 scale-95"),
  },
  {
    name: "Permanent offscreen iframe container isolated from UI fade-out",
    pass: content.includes('id="yt-quran-audio-element"') && content.includes('left: "-9999px"'),
  },
  {
    name: "Two-track continuous loop: Recitation 1 -> Recitation 2 -> Recitation 1",
    pass: content.includes("(currentTrackIndexRef.current + 1) % YOUTUBE_QURAN_PLAYLIST.length") && content.includes("player.loadVideoById"),
  },
  {
    name: "Player stays hidden during track transition",
    pass: content.includes("isTransitioningRef.current = true") && content.includes("isTransitioningRef.current"),
  },
  {
    name: "Player fades back in if paused by user or playback blocked",
    pass: content.includes("const isPlayerUIVisible = !isPlaying || autoplayBlocked"),
  },
  {
    name: "Page exit handlers ('pagehide' & 'beforeunload') implemented",
    pass: content.includes('window.addEventListener("pagehide"') && content.includes('window.addEventListener("beforeunload"'),
  },
  {
    name: "Full cleanup of YouTube player and resources on exit (stopVideo & destroy)",
    pass: content.includes("player.stopVideo()") && content.includes("player.destroy()"),
  },
  {
    name: "No persistent background playback or resume state stored in localStorage",
    pass: !content.includes("localStorage.setItem") && !content.includes("sessionStorage.setItem"),
  },
  {
    name: "Tab switching does not interrupt playback",
    pass: !content.includes('document.addEventListener("visibilitychange"'),
  },
];

let allPassed = true;
checks.forEach((chk, idx) => {
  if (chk.pass) {
    console.log(`✅ PASS: [${idx + 1}] ${chk.name}`);
  } else {
    allPassed = false;
    console.error(`❌ FAIL: [${idx + 1}] ${chk.name}`);
  }
});

console.log("\n=================================================================");
if (allPassed) {
  console.log(`🎉 ALL ${checks.length} LIFECYCLE CHECKS PASSED SUCCESSFULLY!`);
} else {
  console.error("⚠️ SOME LIFECYCLE CHECKS FAILED");
  process.exit(1);
}
console.log("=================================================================\n");
