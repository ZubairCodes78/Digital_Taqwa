export const BRAND = {
  name: "DIGITAL TAQWA",
  parentName: "Barakah Habits Daily",
  projectAttribution: "A Project by Barakah Habits Daily",
  tagline: "Reconnect With Allah. One Day at a Time.",
  heroHeadline: "Make Space for What Truly Matters.",
  heroSubcopy: "A more intentional journey towards Deen.",
  researchHeadline: "Help Us Build Something That Truly Matters.",
  researchSubcopy:
    "Digital Taqwa is currently in its research stage. We want to understand the real challenges Muslims face in their daily routines and discover what kind of digital experience would genuinely help them. Your feedback will help shape the direction of our future application.",
  visionHeadline: "A More Intentional Digital Life.",
  visionSubcopy:
    "Life moves fast. Digital distractions grow. Sometimes, the things that matter most deserve more of our attention.",
};

export const SOCIAL_PROFILES = {
  instagram: {
    name: "Instagram",
    url: "https://www.instagram.com/barakahhabitsdaily/",
    handle: "@barakahhabitsdaily",
  },
  youtube: {
    name: "YouTube",
    url: "https://www.youtube.com/@barakahhabitsdaily",
    handle: "@barakahhabitsdaily",
  },
  tiktok: {
    name: "TikTok",
    url: "https://www.tiktok.com/@barakahhabits1",
    handle: "@barakahhabits1",
  },
};

// ============================================================================
// RESEARCH-LED SURVEY ARCHITECTURE FOR DIGITAL TAQWA
// Grounded in human-centered design, Islamic digital wellbeing, and churn analysis
// ============================================================================

// Question 1: The Core Attention Tension (Real Problems)
export const RESEARCH_Q1_STRUGGLES = [
  "Mindless scrolling during sacred quiet times (Late nights, pre-Fajr, or upon waking)",
  "Scattered attention during prayer (Struggling to find stillness and khushu’)",
  "Inconsistent Quran reading (Wanting depth, but days and weeks slip by)",
  "Guilt from broken streaks (Starting strong, missing a day, and feeling defeated)",
  "Mental clutter & digital fatigue (Constantly stimulated, feeling spiritually numb)",
  "Other",
] as const;

// Question 2: Current Workarounds & Behaviors (What people actually do)
export const RESEARCH_Q2_WORKAROUNDS = [
  "Relying on standard prayer & Quran apps (Checking prayer times, notifications)",
  "General phone screen-time limits or blockers (App timers, DND, grayscale)",
  "Physical non-digital tools (Physical Mushaf, handwritten journals, quiet spaces)",
  "Relying purely on willpower (Telling myself I will do better tomorrow)",
  "I feel stuck and don't have a working system right now",
  "Other",
] as const;

// Question 3: Why Existing Solutions Fail (Unmet Needs & Churn Drivers)
export const RESEARCH_Q3_FRUSTRATIONS = [
  "Too many push notifications (Feeling nagged, stressed, or interrupted)",
  "Streak guilt & shame mechanics (Missing one day ruins momentum)",
  "Pop-up ads, commercial feel, or privacy worries (Jarring during worship)",
  "Feels like a robotic checklist (Turning Deen into a transactional task to tick)",
  "Too bloated or complicated (I just wanted quiet, peaceful simplicity)",
  "Other",
] as const;

// Question 4: The Ideal Digital Relationship (Voluntary Pull & Core Orientation)
export const RESEARCH_Q4_EXPERIENCE = [
  "A Quiet Digital Sanctuary (Zero ads, zero noise — a sacred pause to breathe and remember Allah)",
  "Gentle Friction Against Distraction (A mindful pause or dhikr breath before opening addictive apps)",
  "Sustainable Sunnah Habit Anchors (Small, effortless daily routines built around consistency without guilt)",
  "Reflective Quran Companion (Focusing on a few verses and deep meaning rather than reading volume)",
  "I am not sure yet — I want to explore with you",
] as const;

// Step 5: Beta Testing Participation
export const RESEARCH_BETA_INTEREST = [
  "Yes, I would love to test early concepts and provide feedback",
  "Maybe, depending on what you build",
  "Not right now, just notify me when you launch",
] as const;

export const SURVEY_COUNTRIES = [
  "Pakistan",
  "India",
  "United Kingdom",
  "United States",
  "Canada",
  "United Arab Emirates",
  "Saudi Arabia",
  "Other",
] as const;

// Circular YouTube Quran Audio References
export const YOUTUBE_QURAN_PLAYLIST = [
  {
    videoId: "HKlu1PDL0x0",
    title: "Surah Al-Fajr",
    verses: "Verses 21–30 • Kalla Iza Dukkati Al-Ardu",
    reciter: "Sheikh Yasser Al-Dosari",
    url: "https://youtube.com/shorts/HKlu1PDL0x0",
  },
  {
    videoId: "gDl6s--vkmg",
    title: "Surah Al-Mu’minun",
    verses: "Verses 84–90 • Qul Limanil Ardu Wa Man Fiha",
    reciter: "Sheikh Yasser Al-Dosari",
    url: "https://youtu.be/gDl6s--vkmg",
  },
] as const;

// Backward-compatible aliases
export const SURVEY_CHALLENGES = RESEARCH_Q1_STRUGGLES;
export const SURVEY_DESIRED_SOLUTIONS = RESEARCH_Q3_FRUSTRATIONS;
export const SURVEY_PRODUCT_TYPES = RESEARCH_Q4_EXPERIENCE;
export const SURVEY_BETA_INTEREST_OPTIONS = RESEARCH_BETA_INTEREST;
export const COUNTRIES = SURVEY_COUNTRIES;
