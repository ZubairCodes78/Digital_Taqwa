import { AttributionData } from "@/types";

declare global {
  interface Window {
    dataLayer?: any[];
    gtag?: (...args: any[]) => void;
    fbq?: (...args: any[]) => void;
    _fbq?: any;
  }
}

const ATTRIBUTION_STORAGE_KEY = "digital_taqwa_attribution";
const LEAD_TRACKED_KEY = "digital_taqwa_lead_tracked";

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

    // Only update if new parameters are present or if first visit
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

      // Also set a first-party cookie for resilience
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

    // Fallback to cookie
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

/**
 * Track PageView event
 */
export function trackPageView(url?: string) {
  if (typeof window === "undefined") return;

  // Google Analytics 4
  if (window.gtag) {
    window.gtag("event", "page_view", {
      page_location: url || window.location.href,
    });
  }

  // Meta Pixel
  if (window.fbq) {
    window.fbq("track", "PageView");
  }
}

/**
 * Track ViewContent event
 */
export function trackViewContent(contentName: string, category: string = "Landing Page") {
  if (typeof window === "undefined") return;

  if (window.gtag) {
    window.gtag("event", "view_item", {
      item_name: contentName,
      item_category: category,
    });
  }

  if (window.fbq) {
    window.fbq("track", "ViewContent", {
      content_name: contentName,
      content_category: category,
    });
  }
}

/**
 * Track FormStarted event
 */
export function trackFormStarted() {
  if (typeof window === "undefined") return;

  if (window.gtag) {
    window.gtag("event", "form_start", {
      form_name: "waitlist_survey",
    });
  }

  if (window.fbq) {
    window.fbq("trackCustom", "FormStarted", {
      form_name: "waitlist_survey",
    });
  }
}

/**
 * Track FormStepCompleted event
 */
export function trackFormStepCompleted(stepNumber: number, stepName: string) {
  if (typeof window === "undefined") return;

  if (window.gtag) {
    window.gtag("event", "form_step_completed", {
      step_number: stepNumber,
      step_name: stepName,
    });
  }

  if (window.fbq) {
    window.fbq("trackCustom", "FormStepCompleted", {
      step_number: stepNumber,
      step_name: stepName,
    });
  }
}

/**
 * Track Lead event (With duplicate prevention)
 */
export function trackLead(primaryInterest: string, country: string) {
  if (typeof window === "undefined") return;

  // Prevent duplicate Lead triggers within the same session
  if (sessionStorage.getItem(LEAD_TRACKED_KEY)) {
    return;
  }
  sessionStorage.setItem(LEAD_TRACKED_KEY, "true");

  if (window.gtag) {
    window.gtag("event", "generate_lead", {
      lead_type: "waitlist",
      primary_interest: primaryInterest,
      country: country,
    });
  }

  if (window.fbq) {
    window.fbq("track", "Lead", {
      content_name: "Waitlist Registration",
      content_category: primaryInterest,
    });
  }
}


