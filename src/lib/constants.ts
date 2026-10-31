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

// Curated Short Peaceful Quran Recitation Clips (30–80 seconds)
export const QURAN_CLIPS = [
  {
    id: "ad_duha",
    surahName: "Surah Ad-Duha",
    verseRange: "Verses 1–11 (Complete)",
    reciter: "Sheikh Yasser Al-Dossari",
    reciterTitle: "Imam of Masjid Al-Haram, Makkah",
    passageMeaning: "“Your Lord has not forsaken you, nor is He displeased.”",
    audioUrl: "https://cdn.mp3quran.net/audio/yasser-dosari/r1/093.mp3",
    durationLabel: "~50 sec",
  },
  {
    id: "ar_rahman",
    surahName: "Surah Ar-Rahman",
    verseRange: "Verses 1–16",
    reciter: "Sheikh Yasser Al-Dossari",
    reciterTitle: "Imam of Masjid Al-Haram, Makkah",
    passageMeaning: "“The Most Merciful. Taught the Quran. Created mankind...”",
    audioUrl: "https://cdn.mp3quran.net/audio/yasser-dosari/r1/055.mp3",
    durationLabel: "~65 sec",
  },
  {
    id: "al_fajr",
    surahName: "Surah Al-Fajr",
    verseRange: "Verses 1–14",
    reciter: "Sheikh Yasser Al-Dossari",
    reciterTitle: "Imam of Masjid Al-Haram, Makkah",
    passageMeaning: "“By the dawn, and the ten nights...”",
    audioUrl: "https://cdn.mp3quran.net/audio/yasser-dosari/r1/089.mp3",
    durationLabel: "~60 sec",
  },
  {
    id: "maher_duha",
    surahName: "Surah Ad-Duha",
    verseRange: "Verses 1–11",
    reciter: "Sheikh Maher Al-Muaiqly",
    reciterTitle: "Imam of Masjid Al-Haram, Makkah",
    passageMeaning: "“And your Lord will give you, and you will be satisfied.”",
    audioUrl: "https://cdn.mp3quran.net/audio/maher-muaiqly/r1/093.mp3",
    durationLabel: "~55 sec",
  },
];

export const QURAN_AUDIO = {
  title: "Qul Limanil Ardu Wa Man Fiha (Surah Al-Mu’minun, Verses 84–90)",
  surahName: "Surah Al-Mu’minun",
  reciter: "Sheikh Yasser Al-Dosari",
  youtubeUrl: "https://www.youtube.com/watch?v=gDl6s--vkmg",
  youtubeId: "gDl6s--vkmg",
  audioUrl: "https://cdn.mp3quran.net/audio/yasser-dosari/r1/023.mp3",
  surahNumber: 23,
  verseRange: "Verses 84–90",
  passageMeaning: "“Say: To whom belongs the earth and whoever is in it, if you should know?”",
  durationEstimate: "1:15",
};

// STEP 1 — CURRENT CHALLENGES
export const SURVEY_CHALLENGES = [
  "Maintaining daily Islamic habits",
  "Consistency with Quran reading",
  "Maintaining prayer routines",
  "Excessive screen time and distractions",
  "Lack of discipline and consistency",
  "Other",
] as const;

// STEP 2 — WHAT WOULD HELP YOU?
export const SURVEY_DESIRED_SOLUTIONS = [
  "Islamic habit building",
  "Quran consistency",
  "Prayer reminders and routines",
  "Reducing digital distractions",
  "Daily Islamic reminders",
  "Structured Deen goals",
  "Other",
] as const;

// STEP 3 — PREFERRED EXPERIENCE
export const SURVEY_PRODUCT_TYPES = [
  "Islamic lifestyle companion",
  "Islamic habit-building platform",
  "Quran and prayer companion",
  "Digital self-discipline tool",
  "Not sure yet",
] as const;

// STEP 4 — BETA TESTING PARTICIPATION
export const SURVEY_BETA_INTEREST_OPTIONS = [
  "Yes, I am interested",
  "Maybe, depending on the application",
  "Not right now",
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

// Legacy aliases
export const USER_CHALLENGES = SURVEY_CHALLENGES.map((label) => ({
  id: label.toLowerCase().replace(/[^a-z0-9]+/g, "_"),
  label,
  description: label,
}));

export const PROPOSED_FEATURES = SURVEY_DESIRED_SOLUTIONS.map((title, i) => ({
  id: title.toLowerCase().replace(/[^a-z0-9]+/g, "_"),
  number: `0${i + 1}`,
  title,
  shortLabel: title,
  summary: title,
}));

export const COUNTRIES = SURVEY_COUNTRIES;
