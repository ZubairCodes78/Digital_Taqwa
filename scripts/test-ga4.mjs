import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, "..");

console.log("=== DIGITAL TAQWA — GA4 INTEGRATION VERIFICATION ===");

let passed = true;

function check(name, condition, errorMsg) {
  if (condition) {
    console.log(`[PASS] ${name}`);
  } else {
    console.error(`[FAIL] ${name}: ${errorMsg}`);
    passed = false;
  }
}

// 1. Check .env.local and .env.example
const envLocal = fs.readFileSync(path.join(rootDir, ".env.local"), "utf8");
const envExample = fs.readFileSync(path.join(rootDir, ".env.example"), "utf8");
check(
  ".env.local has NEXT_PUBLIC_GA_ID=G-GLZ1CKWRT1",
  envLocal.includes("NEXT_PUBLIC_GA_ID=G-GLZ1CKWRT1"),
  "Missing or incorrect NEXT_PUBLIC_GA_ID in .env.local"
);
check(
  ".env.example has NEXT_PUBLIC_GA_ID=G-GLZ1CKWRT1",
  envExample.includes("NEXT_PUBLIC_GA_ID=G-GLZ1CKWRT1"),
  "Missing or incorrect NEXT_PUBLIC_GA_ID in .env.example"
);

// 2. Check src/lib/constants.ts
const constants = fs.readFileSync(path.join(rootDir, "src/lib/constants.ts"), "utf8");
check(
  "constants.ts exports GA_MEASUREMENT_ID defaulting to G-GLZ1CKWRT1",
  constants.includes('GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_ID || "G-GLZ1CKWRT1"'),
  "constants.ts missing GA_MEASUREMENT_ID export"
);

// 3. Check src/app/layout.tsx
const layout = fs.readFileSync(path.join(rootDir, "src/app/layout.tsx"), "utf8");
check(
  "layout.tsx loads Google tag with afterInteractive",
  layout.includes("googletagmanager.com/gtag/js?id=") && layout.includes('strategy="afterInteractive"'),
  "layout.tsx missing Google tag script or correct strategy"
);
check(
  "layout.tsx contains inline gtag config",
  layout.includes("window.dataLayer = window.dataLayer || [];") && layout.includes("gtag('config'"),
  "layout.tsx missing inline gtag config snippet"
);
check(
  "layout.tsx mounts AnalyticsTracker inside Suspense",
  layout.includes("<AnalyticsTracker />") && layout.includes("<Suspense"),
  "layout.tsx does not mount AnalyticsTracker inside Suspense"
);

// 4. Check src/lib/analytics.ts for all required events
const analytics = fs.readFileSync(path.join(rootDir, "src/lib/analytics.ts"), "utf8");
const requiredEvents = [
  "trackPageView",
  "trackWaitlistSignup",
  "trackSurveyStart",
  "trackSurveyComplete",
  "trackBetaInterest",
  "trackAudioPlay",
  "trackAudioPause",
  "trackCtaClick",
];
for (const fn of requiredEvents) {
  check(`analytics.ts exports ${fn}`, analytics.includes(`export function ${fn}`), `Missing export ${fn}`);
}

// 5. Privacy Verification: ensure no PII fields are sent to GA4
const piiTerms = ["user_email", "user_name", "phone_number", "whatsapp_number"];
for (const term of piiTerms) {
  check(
    `Zero PII check: no '${term}' in analytics event payloads`,
    !analytics.includes(`'${term}'`) && !analytics.includes(`"${term}"`),
    `Found potentially sensitive field ${term} in analytics.ts`
  );
}

// 6. Check Component Wiring
const waitlistForm = fs.readFileSync(path.join(rootDir, "src/components/MultiStepWaitlistForm.tsx"), "utf8");
check(
  "MultiStepWaitlistForm wires survey_start",
  waitlistForm.includes("trackSurveyStart("),
  "survey_start not called in MultiStepWaitlistForm"
);
check(
  "MultiStepWaitlistForm wires survey_complete",
  waitlistForm.includes("trackSurveyComplete("),
  "survey_complete not called in MultiStepWaitlistForm"
);
check(
  "MultiStepWaitlistForm wires waitlist_signup on success",
  waitlistForm.includes("trackWaitlistSignup("),
  "waitlist_signup not called on success in MultiStepWaitlistForm"
);
check(
  "MultiStepWaitlistForm wires beta_interest",
  waitlistForm.includes("trackBetaInterest("),
  "beta_interest not called in MultiStepWaitlistForm"
);

const audioComponent = fs.readFileSync(path.join(rootDir, "src/components/AmbientQuranAudio.tsx"), "utf8");
check(
  "AmbientQuranAudio wires audio_play",
  audioComponent.includes("trackAudioPlay("),
  "audio_play not called in AmbientQuranAudio"
);
check(
  "AmbientQuranAudio wires audio_pause",
  audioComponent.includes("trackAudioPause("),
  "audio_pause not called in AmbientQuranAudio"
);

const heroComponent = fs.readFileSync(path.join(rootDir, "src/components/Hero.tsx"), "utf8");
check(
  "Hero wires trackCtaClick",
  heroComponent.includes("trackCtaClick("),
  "cta_click not called in Hero"
);

const ctaBanner = fs.readFileSync(path.join(rootDir, "src/components/CallToActionBanner.tsx"), "utf8");
check(
  "CallToActionBanner wires trackCtaClick",
  ctaBanner.includes("trackCtaClick("),
  "cta_click not called in CallToActionBanner"
);

const navbar = fs.readFileSync(path.join(rootDir, "src/components/Navbar.tsx"), "utf8");
check(
  "Navbar wires trackCtaClick",
  navbar.includes("trackCtaClick("),
  "cta_click not called in Navbar"
);

if (passed) {
  console.log("\nALL VERIFICATION CHECKS PASSED SUCCESSFULLY!");
  process.exit(0);
} else {
  console.error("\nSOME CHECKS FAILED.");
  process.exit(1);
}

