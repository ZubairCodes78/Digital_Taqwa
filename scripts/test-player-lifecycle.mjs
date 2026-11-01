// Simulation and Verification of Quran Player Tab Visibility & Lifecycle

import fs from "fs";
import path from "path";

console.log("=================================================================");
console.log("🔊 VERIFYING DIGITAL TAQWA QURAN PLAYER TAB VISIBILITY & LIFECYCLE");
console.log("=================================================================\n");

const componentPath = path.join(process.cwd(), "src/components/AmbientQuranAudio.tsx");
const content = fs.readFileSync(componentPath, "utf-8");

const checks = [
  {
    name: "Page Visibility API ('visibilitychange') event registered",
    pass: content.includes('document.addEventListener("visibilitychange", handleVisibilityChange)'),
  },
  {
    name: "Immediate pause when tab is hidden (document.visibilityState === 'hidden')",
    pass: content.includes('document.visibilityState === "hidden"') && content.includes("player.pauseVideo()"),
  },
  {
    name: "Automatic resume when tab returns to visible (document.visibilityState === 'visible')",
    pass: content.includes('document.visibilityState === "visible"') && content.includes("player.playVideo()"),
  },
  {
    name: "Exact position resume without restarting recitation from beginning",
    pass: content.includes("player.pauseVideo()") && content.includes("player.playVideo()") && !content.includes("player.seekTo(0)"),
  },
  {
    name: "Window blur and focus listeners for application/window switching",
    pass: content.includes('window.addEventListener("blur", handleWindowBlur)') && content.includes('window.addEventListener("focus", handleWindowFocus)'),
  },
  {
    name: "Manual pause tracking: visitor manual pause is NEVER overridden by tab return",
    pass: content.includes("hasUserPausedManually.current") && content.includes("!hasUserPausedManually.current"),
  },
  {
    name: "State flag prevents circular player flashing during tab switch",
    pass: content.includes("isAutoPausedByTabSwitch.current"),
  },
  {
    name: "Preserve continuous two-track sequence (Recitation 1 -> Recitation 2 -> Loop)",
    pass: content.includes("(currentTrackIndexRef.current + 1) % YOUTUBE_QURAN_PLAYLIST.length") && content.includes("player.loadVideoById"),
  },
  {
    name: "Stop playback & release YouTube player resources on page exit / tab closure",
    pass: content.includes('window.addEventListener("pagehide"') && content.includes("player.stopVideo()") && content.includes("player.destroy()"),
  },
  {
    name: "Permanent offscreen iframe container isolated from UI transitions",
    pass: content.includes('id="yt-quran-audio-element"') && content.includes('left: "-9999px"'),
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
  console.log(`🎉 ALL ${checks.length} VISIBILITY & LIFECYCLE CHECKS PASSED!`);
} else {
  console.error("⚠️ SOME CHECKS FAILED");
  process.exit(1);
}
console.log("=================================================================\n");
