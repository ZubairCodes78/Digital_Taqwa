import { AttributionData } from "@/types";
import { GA_MEASUREMENT_ID } from "./constants";

declare global {
  interface Window {
    dataLayer?: any[];
    gtag?: (...args: any[]) => void;
    fbq?: (...args: any[]) => void;
    _fbq?: any;
    __dt_debug_ga?: boolean;
  }
}

const ATTRIBUTION_STORAGE_KEY = "digital_taqwa_attribution";
const LEAD_TRACKED_KEY = "digital_taqwa_lead_tracked";

/**
 * Checks whether debug_mode should be attached to GA4 events.
 * Enabled automatically in development or when `?debug_ga=true` is in the URL.
 */
function isDebugMode(): boolean {
  if (typeof window === "undefined") return false;
  if (process.env.NODE_ENV === "development" || window.__dt_debug_ga) return true;
  try {
    const params = new URLSearchParams(window.location.search);
    return params.get("debug_ga") === "true";
  } catch {
    return false;
  }
}

/**
 * Core GA4 Event Dispatcher
 * Ensures window.gtag is available, attaches debug_mode if active,
 * and strips any potential undefined / null fields.
 */
export function sendGAEvent(eventName: string, params: Record<string, any> = {}) {
  if (typeof window === "undefined") return;

  const cleanParams: Record<string, any> = {};
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== null) {
      cleanParams[key] = value;
    }
  }

  if (isDebugMode()) {
    cleanParams.debug_mode = true;
  }

  if (typeof window.gtag === "function") {
    window.gtag("event", eventName, cleanParams);
  } else if (Array.isArray(window.dataLayer)) {
    window.dataLayer.push({
      event: eventName,
      ...cleanParams,
    });
  }
}

/**
 * Extracts UTM parameters and referrer from the current browser window and stores them.
 */
export function captureAndPersistAttribution(): AttributionData {
  if (typeof window === "undefined") {
    return {};
  }

  try {
    const params = new URLSearchParams(window.location.search);
    const existingRaw = localStorage.getItem(ATTRIBUTION_STORAGE_KEY);
    let attribution: AttributionData = existingRaw ? JSON.parse(existingRaw) : {};

    const utmSource = params.get("utm_source");
    const utmMedium = params.get("utm_medium");
    const utmCampaign = params.get("utm_campaign");
    const utmContent = params.get("utm_content");
    const utmTerm = params.get("utm_term");
    const refCode = params.get("ref");

    if (utmSource || utmMedium || utmCampaign || refCode || !attribution.landing_page) {
      attribution = {
        utm_source: utmSource || attribution.utm_source || "direct",
        utm_medium: utmMedium || attribution.utm_medium || "none",
        utm_campaign: utmCampaign || attribution.utm_campaign || "organic",
        utm_content: utmContent || attribution.utm_content || "",
        utm_term: utmTerm || attribution.utm_term || "",
        referral_code: refCode || attribution.referral_code || "",
        landing_page: attribution.landing_page || window.location.href.split("?")[0],
        referrer: attribution.referrer || document.referrer || "direct",
      };

      localStorage.setItem(ATTRIBUTION_STORAGE_KEY, JSON.stringify(attribution));

      document.cookie = `dt_utm=${encodeURIComponent(
        JSON.stringify(attribution)
      )}; path=/; max-age=2592000; SameSite=Lax`;
    }

    return attribution;
  } catch (e) {
    console.error("Attribution capture error:", e);
    return {};
  }
}

/**
 * Retrieves the stored attribution data.
 */
export function getStoredAttribution(): AttributionData {
  if (typeof window === "undefined") return {};
  try {
    const raw = localStorage.getItem(ATTRIBUTION_STORAGE_KEY);
    if (raw) return JSON.parse(raw);

    const match = document.cookie.match(new RegExp("(^| )dt_utm=([^;]+)"));
    if (match) {
      return JSON.parse(decodeURIComponent(match[2]));
    }
  } catch (e) {
    console.error("Failed to read stored attribution:", e);
  }
  return {
    utm_source: "direct",
    utm_medium: "none",
    utm_campaign: "organic",
  };
}

// ============================================================================
// GA4 SPECIFIC TRACKING FUNCTIONS (ZERO PII)
// ============================================================================

/**
 * Track SPA Route change / page_view without duplicating initial load.
 */
export function trackPageView(url?: string) {
  if (typeof window === "undefined") return;

  const pagePath = url || window.location.pathname + window.location.search;
  const pageLocation = window.location.href;

  sendGAEvent("page_view", {
    page_path: pagePath,
    page_location: pageLocation,
    send_to: GA_MEASUREMENT_ID,
  });

  if (window.fbq) {
    window.fbq("track", "PageView");
  }
}

/**
 * Track Successful Waitlist Registration
 * STRICT PRIVACY: Zero PII (no names, emails, phones, or raw survey answers)
 */
export function trackWaitlistSignup(options?: {
  country?: string;
  method?: string;
  is_beta_tester?: boolean;
}) {
  sendGAEvent("waitlist_signup", {
    method: options?.method || "conversational_form",
    country: options?.country || "Global",
    is_beta_tester: options?.is_beta_tester ?? true,
  });

  // Also record standard lead
  trackLead("Waitlist Registration", options?.country || "Global");
}

/**
 * Track Survey / Conversational Form Start
 */
export function trackSurveyStart(step: number = 1) {
  sendGAEvent("survey_start", {
    form_name: "conversational_inquiry",
    step,
  });

  if (window.fbq) {
    window.fbq("trackCustom", "FormStarted", {
      form_name: "conversational_inquiry",
    });
  }
}

/**
 * Track Survey / Conversational Form Completion
 */
export function trackSurveyComplete(totalSteps: number = 3) {
  sendGAEvent("survey_complete", {
    form_name: "conversational_inquiry",
    total_steps: totalSteps,
  });
}

/**
 * Track Beta Interest Expression
 */
export function trackBetaInterest(interested: boolean = true, source: string = "waitlist_survey") {
  sendGAEvent("beta_interest", {
    interested,
    source,
  });
}

/**
 * Track Quran Recitation Start
 */
export function trackAudioPlay(trackTitle: string, reciter: string = "Sheikh Yasser Al-Dosari", autoplay: boolean = true) {
  sendGAEvent("audio_play", {
    track_title: trackTitle,
    reciter,
    autoplay,
  });
}

/**
 * Track Quran Recitation Pause
 */
export function trackAudioPause(trackTitle: string, pausedBy: "user" | "tab_switch" | "window_blur" | string = "user") {
  sendGAEvent("audio_pause", {
    track_title: trackTitle,
    paused_by: pausedBy,
  });
}

/**
 * Track Call To Action Clicks
 */
export function trackCtaClick(ctaName: string, ctaLocation: string, additionalParams?: Record<string, any>) {
  sendGAEvent("cta_click", {
    cta_name: ctaName,
    cta_location: ctaLocation,
    ...additionalParams,
  });
}

// ============================================================================
// BACKWARD-COMPATIBLE HELPERS
// ============================================================================

export function trackViewContent(contentName: string, category: string = "Landing Page") {
  sendGAEvent("view_item", {
    item_name: contentName,
    item_category: category,
  });

  if (window.fbq) {
    window.fbq("track", "ViewContent", {
      content_name: contentName,
      content_category: category,
    });
  }
}

export function trackFormStarted() {
  trackSurveyStart(1);
}

export function trackFormStepCompleted(stepNumber: number, stepName: string) {
  sendGAEvent("form_step_completed", {
    step_number: stepNumber,
    step_name: stepName,
  });

  if (window.fbq) {
    window.fbq("trackCustom", "FormStepCompleted", {
      step_number: stepNumber,
      step_name: stepName,
    });
  }
}

export function trackLead(primaryInterest: string, country: string) {
  if (typeof window === "undefined") return;

  if (sessionStorage.getItem(LEAD_TRACKED_KEY)) {
    return;
  }
  sessionStorage.setItem(LEAD_TRACKED_KEY, "true");

  sendGAEvent("generate_lead", {
    lead_type: "waitlist",
    primary_interest: primaryInterest,
    country: country,
  });

  if (window.fbq) {
    window.fbq("track", "Lead", {
      content_name: "Waitlist Registration",
      content_category: primaryInterest,
    });
  }
}
