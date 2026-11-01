"use client";

import React, { useState, useEffect } from "react";
import {
  RESEARCH_Q1_STRUGGLES,
  RESEARCH_Q2_WORKAROUNDS,
  RESEARCH_Q3_FRUSTRATIONS,
  RESEARCH_Q4_EXPERIENCE,
  RESEARCH_BETA_INTEREST,
  SURVEY_COUNTRIES,
} from "@/lib/constants";
import {
  captureAndPersistAttribution,
  getStoredAttribution,
  trackFormStarted,
  trackFormStepCompleted,
  trackLead,
} from "@/lib/analytics";
import {
  Check,
  ArrowRight,
  ArrowLeft,
  Copy,
  MessageCircle,
  AlertCircle,
  Loader2,
  ExternalLink,
  Sparkles,
  Heart,
} from "lucide-react";

interface SurveyFormState {
  // Question 1: Attention Struggles
  challenges: string[];
  other_challenge: string;
  // Question 2: Current Workarounds & Approaches
  usage_priorities: string[];
  other_approach: string;
  // Question 3: Why Existing Apps Fail (Churn Drivers)
  desired_solutions: string[];
  other_frustration: string;
  // Question 4: Ideal Experience & Qualitative Reflection
  preferred_product_type: string;
  user_suggestions: string;
  // Step 5: Contact & Beta Testing
  beta_interest: string;
  email: string;
  name: string;
  whatsapp_number: string;
  country: string;
  marketing_consent: boolean;
  honeypot: string;
}

interface MultiStepWaitlistFormProps {
  onSuccess?: (data: { email: string; referralCode: string; referralLink: string }) => void;
  onStepChange?: (step: number) => void;
}

export function MultiStepWaitlistForm({ onSuccess, onStepChange }: MultiStepWaitlistFormProps = {}) {
  const [step, setStep] = useState<number>(1);
  const [started, setStarted] = useState<boolean>(false);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [copied, setCopied] = useState<boolean>(false);

  const [successData, setSuccessData] = useState<{
    email: string;
    referralCode: string;
    referralLink: string;
  } | null>(null);

  const [formData, setFormData] = useState<SurveyFormState>({
    challenges: [],
    other_challenge: "",
    usage_priorities: [],
    other_approach: "",
    desired_solutions: [],
    other_frustration: "",
    preferred_product_type: "",
    user_suggestions: "",
    beta_interest: "Yes, I would love to test early concepts and provide feedback",
    email: "",
    name: "",
    whatsapp_number: "",
    country: "Global",
    marketing_consent: false,
    honeypot: "",
  });

  useEffect(() => {
    captureAndPersistAttribution();
  }, []);

  useEffect(() => {
    onStepChange?.(step);
  }, [step, onStepChange]);

  const handleStartInteraction = () => {
    if (!started) {
      setStarted(true);
      trackFormStarted();
    }
  };

  // Question 1: Toggle Attention Struggles (Multi-select)
  const toggleChallenge = (item: string) => {
    handleStartInteraction();
    setErrorMessage("");
    setFormData((prev) => {
      const exists = prev.challenges.includes(item);
      return {
        ...prev,
        challenges: exists
          ? prev.challenges.filter((c) => c !== item)
          : [...prev.challenges, item],
      };
    });
  };

  // Question 2: Toggle Current Approaches / Workarounds (Multi-select)
  const toggleApproach = (item: string) => {
    setErrorMessage("");
    setFormData((prev) => {
      const exists = prev.usage_priorities.includes(item);
      return {
        ...prev,
        usage_priorities: exists
          ? prev.usage_priorities.filter((p) => p !== item)
          : [...prev.usage_priorities, item],
      };
    });
  };

  // Question 3: Toggle App Frustrations / Churn Drivers (Multi-select)
  const toggleFrustration = (item: string) => {
    setErrorMessage("");
    setFormData((prev) => {
      const exists = prev.desired_solutions.includes(item);
      return {
        ...prev,
        desired_solutions: exists
          ? prev.desired_solutions.filter((s) => s !== item)
          : [...prev.desired_solutions, item],
      };
    });
  };

  // Step 1 Validation -> Step 2
  const goToStep2 = () => {
    if (formData.challenges.length === 0) {
      setErrorMessage("Please select at least one area where your attention feels divided.");
      return;
    }
    if (formData.challenges.includes("Other") && !formData.other_challenge.trim()) {
      setErrorMessage("Please share a brief note about your other struggle, or uncheck 'Other'.");
      return;
    }
    setErrorMessage("");
    trackFormStepCompleted(1, "struggles");
    setStep(2);
  };

  // Step 2 Validation -> Step 3
  const goToStep3 = () => {
    if (formData.usage_priorities.length === 0) {
      setErrorMessage("Please select how you currently try to protect your spiritual time.");
      return;
    }
    if (formData.usage_priorities.includes("Other") && !formData.other_approach.trim()) {
      setErrorMessage("Please share a brief note about your approach, or uncheck 'Other'.");
      return;
    }
    setErrorMessage("");
    trackFormStepCompleted(2, "workarounds");
    setStep(3);
  };

  // Step 3 Validation -> Step 4
  const goToStep4 = () => {
    if (formData.desired_solutions.length === 0) {
      setErrorMessage("Please select what causes you to stop using other apps or routines.");
      return;
    }
    if (formData.desired_solutions.includes("Other") && !formData.other_frustration.trim()) {
      setErrorMessage("Please share a brief note about your frustration, or uncheck 'Other'.");
      return;
    }
    setErrorMessage("");
    trackFormStepCompleted(3, "frustrations");
    setStep(4);
  };

  // Step 4 Validation -> Step 5
  const goToStep5 = () => {
    if (!formData.preferred_product_type) {
      setErrorMessage("Please select which direction feels most resonant to you.");
      return;
    }
    setErrorMessage("");
    trackFormStepCompleted(4, "ideal_experience");
    setStep(5);
  };

  // Step 5: Final Submission (Immediate Registration, No Email Verification)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");

    const emailTrimmed = formData.email.trim().toLowerCase();
    if (!emailTrimmed || !emailTrimmed.includes("@") || !emailTrimmed.includes(".")) {
      setErrorMessage("Please enter a valid email address.");
      return;
    }

    setSubmitting(true);

    try {
      const attribution = getStoredAttribution();

      const payload = {
        name: formData.name.trim() || undefined,
        country: formData.country || "Global",
        email: emailTrimmed,
        whatsapp_number: formData.whatsapp_number.trim() || undefined,
        marketing_consent: Boolean(formData.marketing_consent),
        // Research responses
        challenges: formData.challenges,
        other_challenge: formData.other_challenge.trim() || undefined,
        usage_priorities: formData.usage_priorities,
        other_approach: formData.other_approach.trim() || undefined,
        desired_solutions: formData.desired_solutions,
        other_frustration: formData.other_frustration.trim() || undefined,
        preferred_product_type: formData.preferred_product_type,
        user_suggestions: formData.user_suggestions.trim() || undefined,
        beta_interest: formData.beta_interest,
        // Backward compatibility mappings
        features: formData.desired_solutions,
        primary_feature: formData.preferred_product_type,
        honeypot: formData.honeypot || undefined,
        // Attribution
        utm_source: attribution.utm_source,
        utm_medium: attribution.utm_medium,
        utm_campaign: attribution.utm_campaign,
        utm_content: attribution.utm_content,
        utm_term: attribution.utm_term,
        referrer: attribution.referrer,
        landing_page: attribution.landing_page,
        referred_by: attribution.referral_code,
      };

      const res = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        if (res.status === 409) {
          setErrorMessage("This email is already registered on our early access waitlist.");
        } else {
          setErrorMessage(data.error || "Unable to submit your responses. Please try again.");
        }
        setSubmitting(false);
        return;
      }

      // Successful registration
      trackLead(formData.preferred_product_type || "General", formData.country || "Global");
      const successPayload = {
        email: data.user?.email || emailTrimmed,
        referralCode: data.user?.referral_code || "",
        referralLink: data.user?.referral_link || `https://digitaltaqwa.site/?ref=${data.user?.referral_code}`,
      };

      setSuccessData(successPayload);
      setStep(6); // Step 6 = Confirmation Screen
      onSuccess?.(successPayload);

      try {
        const confetti = (await import("canvas-confetti")).default;
        confetti({
          particleCount: 75,
          spread: 70,
          origin: { y: 0.6 },
          colors: ["#B79A62", "#19372D", "#F6F4ED", "#E8D6AC"],
        });
      } catch (e) {
        // Confetti optional
      }
    } catch (err: any) {
      setErrorMessage("Network error. Please check your internet connection and retry.");
    } finally {
      setSubmitting(false);
    }
  };

  const copyReferralLink = () => {
    if (!successData?.referralLink) return;
    navigator.clipboard.writeText(successData.referralLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="bg-[#10221A]/80 backdrop-blur-2xl border border-[#B79A62]/35 rounded-3xl p-5 sm:p-8 md:p-11 shadow-[0_20px_60px_0_rgba(0,0,0,0.6)] text-[#F6F4ED] max-w-2xl mx-auto transition-all">
      {/* Bot Honeypot */}
      <input
        type="text"
        name="website_url"
        value={formData.honeypot}
        onChange={(e) => setFormData({ ...formData, honeypot: e.target.value })}
        className="hidden"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
      />

      {/* Progress Bar & Header (Steps 1 to 5) */}
      {step <= 5 && (
        <div className="mb-6 sm:mb-8">
          <div className="flex items-center justify-between text-xs font-mono mb-2">
            <span className="text-[#E8D6AC] font-semibold tracking-wider uppercase">
              {step === 1 && "Phase 01 / 05 • Attention & Focus"}
              {step === 2 && "Phase 02 / 05 • Current Workarounds"}
              {step === 3 && "Phase 03 / 05 • Why Other Apps Fail"}
              {step === 4 && "Phase 04 / 05 • Ideal Sanctuary"}
              {step === 5 && "Phase 05 / 05 • Early Access Invite"}
            </span>
            <span className="text-[#DDE4D9]/70">
              ~{Math.max(10, 50 - (step - 1) * 10)}s
            </span>
          </div>

          <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden">
            <div
              className="bg-gradient-to-r from-[#19372D] via-[#B79A62] to-[#E8D6AC] h-full transition-all duration-300 rounded-full"
              style={{ width: `${(step / 5) * 100}%` }}
            />
          </div>
        </div>
      )}

      {/* Global Error Message */}
      {errorMessage && (
        <div
          role="alert"
          className="mb-6 p-3.5 sm:p-4 rounded-2xl bg-red-950/70 border border-red-500/40 text-red-200 text-xs sm:text-sm flex items-center space-x-2.5 animate-shake"
        >
          <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* ========================================================
          QUESTION 1: ATTENTION STRUGGLES (Multiple Select)
      ======================================================== */}
      {step === 1 && (
        <div className="space-y-5 animate-in fade-in duration-300">
          <div>
            <span className="text-[10px] uppercase font-mono tracking-widest text-[#E8D6AC] font-semibold block mb-1">
              Research Question 1 of 4
            </span>
            <h3 className="font-display text-2xl sm:text-3xl font-black text-[#F6F4ED] leading-snug">
              Where does your attention feel most divided?
            </h3>
            <p className="text-xs sm:text-sm text-[#DDE4D9]/80 font-light mt-1">
              Select all that apply. We want to understand where distraction hits hardest so we can build genuine tranquility.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-2.5 pt-1">
            {RESEARCH_Q1_STRUGGLES.map((item) => {
              const checked = formData.challenges.includes(item);
              return (
                <button
                  type="button"
                  key={item}
                  onClick={() => toggleChallenge(item)}
                  className={`text-left p-3.5 sm:p-4 rounded-2xl border transition-all flex items-center justify-between text-xs sm:text-sm ${
                    checked
                      ? "bg-[#B79A62]/20 border-[#B79A62] text-[#F6F4ED] font-medium shadow-md shadow-black/20"
                      : "bg-white/5 border-white/10 text-[#DDE4D9]/85 hover:bg-white/10 hover:border-white/20"
                  }`}
                >
                  <span className="leading-snug pr-2">{item}</span>
                  <div
                    className={`w-5 h-5 rounded-lg border flex items-center justify-center shrink-0 ml-3 transition-colors ${
                      checked
                        ? "bg-[#B79A62] border-[#B79A62] text-[#0A1410]"
                        : "border-white/30 bg-black/20"
                    }`}
                  >
                    {checked && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Optional "Other" input field */}
          {formData.challenges.includes("Other") && (
            <div className="pt-1 animate-in fade-in duration-200">
              <label className="block text-xs text-[#E8D6AC] mb-1 font-mono">
                Please specify your struggle:
              </label>
              <input
                type="text"
                value={formData.other_challenge}
                onChange={(e) => setFormData({ ...formData, other_challenge: e.target.value })}
                placeholder="e.g. Opening Instagram right after waking for Fajr..."
                className="w-full px-4 py-3 rounded-xl bg-black/40 border border-white/15 text-[#F6F4ED] text-xs sm:text-sm placeholder:text-[#DDE4D9]/40 outline-none focus:border-[#B79A62]"
              />
            </div>
          )}

          <div className="pt-3 flex justify-end">
            <button
              type="button"
              onClick={goToStep2}
              className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-[#B79A62] text-[#0A1410] font-bold text-xs uppercase tracking-wider hover:bg-[#D8C296] transition-all flex items-center justify-center space-x-2 shadow-lg shadow-[#B79A62]/25 hover:scale-105 active:scale-95"
            >
              <span>Continue</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* ========================================================
          QUESTION 2: CURRENT WORKAROUNDS & BEHAVIORS (Multiple Select)
      ======================================================== */}
      {step === 2 && (
        <div className="space-y-5 animate-in fade-in duration-300">
          <div>
            <span className="text-[10px] uppercase font-mono tracking-widest text-[#E8D6AC] font-semibold block mb-1">
              Research Question 2 of 4
            </span>
            <h3 className="font-display text-2xl sm:text-3xl font-black text-[#F6F4ED] leading-snug">
              How do you currently try to protect your spiritual time?
            </h3>
            <p className="text-xs sm:text-sm text-[#DDE4D9]/80 font-light mt-1">
              Select all approaches you use or have tried. This reveals what is currently missing.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-2.5 pt-1">
            {RESEARCH_Q2_WORKAROUNDS.map((item) => {
              const checked = formData.usage_priorities.includes(item);
              return (
                <button
                  type="button"
                  key={item}
                  onClick={() => toggleApproach(item)}
                  className={`text-left p-3.5 sm:p-4 rounded-2xl border transition-all flex items-center justify-between text-xs sm:text-sm ${
                    checked
                      ? "bg-[#B79A62]/20 border-[#B79A62] text-[#F6F4ED] font-medium shadow-md shadow-black/20"
                      : "bg-white/5 border-white/10 text-[#DDE4D9]/85 hover:bg-white/10 hover:border-white/20"
                  }`}
                >
                  <span className="leading-snug pr-2">{item}</span>
                  <div
                    className={`w-5 h-5 rounded-lg border flex items-center justify-center shrink-0 ml-3 transition-colors ${
                      checked
                        ? "bg-[#B79A62] border-[#B79A62] text-[#0A1410]"
                        : "border-white/30 bg-black/20"
                    }`}
                  >
                    {checked && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Optional "Other" input field */}
          {formData.usage_priorities.includes("Other") && (
            <div className="pt-1 animate-in fade-in duration-200">
              <label className="block text-xs text-[#E8D6AC] mb-1 font-mono">
                Please specify your approach:
              </label>
              <input
                type="text"
                value={formData.other_approach}
                onChange={(e) => setFormData({ ...formData, other_approach: e.target.value })}
                placeholder="e.g. Leaving phone in another room during Salah..."
                className="w-full px-4 py-3 rounded-xl bg-black/40 border border-white/15 text-[#F6F4ED] text-xs sm:text-sm placeholder:text-[#DDE4D9]/40 outline-none focus:border-[#B79A62]"
              />
            </div>
          )}

          <div className="pt-3 flex items-center justify-between gap-3">
            <button
              type="button"
              onClick={() => {
                setErrorMessage("");
                setStep(1);
              }}
              className="px-5 py-3 rounded-full border border-white/20 text-[#DDE4D9]/80 hover:text-[#F6F4ED] text-xs uppercase tracking-wider flex items-center space-x-1.5 transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back</span>
            </button>
            <button
              type="button"
              onClick={goToStep3}
              className="px-8 py-3 rounded-full bg-[#B79A62] text-[#0A1410] font-bold text-xs uppercase tracking-wider hover:bg-[#D8C296] transition-all flex items-center space-x-2 shadow-lg shadow-[#B79A62]/25 hover:scale-105 active:scale-95"
            >
              <span>Continue</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* ========================================================
          QUESTION 3: WHY EXISTING APPS FAIL (Multiple Select)
      ======================================================== */}
      {step === 3 && (
        <div className="space-y-5 animate-in fade-in duration-300">
          <div>
            <span className="text-[10px] uppercase font-mono tracking-widest text-[#E8D6AC] font-semibold block mb-1">
              Research Question 3 of 4
            </span>
            <h3 className="font-display text-2xl sm:text-3xl font-black text-[#F6F4ED] leading-snug">
              What causes you to stop using Islamic or habit apps?
            </h3>
            <p className="text-xs sm:text-sm text-[#DDE4D9]/80 font-light mt-1">
              Tell us what usually pushes you away so we never repeat those patterns.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-2.5 pt-1">
            {RESEARCH_Q3_FRUSTRATIONS.map((item) => {
              const checked = formData.desired_solutions.includes(item);
              return (
                <button
                  type="button"
                  key={item}
                  onClick={() => toggleFrustration(item)}
                  className={`text-left p-3.5 sm:p-4 rounded-2xl border transition-all flex items-center justify-between text-xs sm:text-sm ${
                    checked
                      ? "bg-[#B79A62]/20 border-[#B79A62] text-[#F6F4ED] font-medium shadow-md shadow-black/20"
                      : "bg-white/5 border-white/10 text-[#DDE4D9]/85 hover:bg-white/10 hover:border-white/20"
                  }`}
                >
                  <span className="leading-snug pr-2">{item}</span>
                  <div
                    className={`w-5 h-5 rounded-lg border flex items-center justify-center shrink-0 ml-3 transition-colors ${
                      checked
                        ? "bg-[#B79A62] border-[#B79A62] text-[#0A1410]"
                        : "border-white/30 bg-black/20"
                    }`}
                  >
                    {checked && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Optional "Other" input field */}
          {formData.desired_solutions.includes("Other") && (
            <div className="pt-1 animate-in fade-in duration-200">
              <label className="block text-xs text-[#E8D6AC] mb-1 font-mono">
                Please specify what frustrates you:
              </label>
              <input
                type="text"
                value={formData.other_frustration}
                onChange={(e) => setFormData({ ...formData, other_frustration: e.target.value })}
                placeholder="e.g. Too many ads popping up during Quran recitation..."
                className="w-full px-4 py-3 rounded-xl bg-black/40 border border-white/15 text-[#F6F4ED] text-xs sm:text-sm placeholder:text-[#DDE4D9]/40 outline-none focus:border-[#B79A62]"
              />
            </div>
          )}

          <div className="pt-3 flex items-center justify-between gap-3">
            <button
              type="button"
              onClick={() => {
                setErrorMessage("");
                setStep(2);
              }}
              className="px-5 py-3 rounded-full border border-white/20 text-[#DDE4D9]/80 hover:text-[#F6F4ED] text-xs uppercase tracking-wider flex items-center space-x-1.5 transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back</span>
            </button>
            <button
              type="button"
              onClick={goToStep4}
              className="px-8 py-3 rounded-full bg-[#B79A62] text-[#0A1410] font-bold text-xs uppercase tracking-wider hover:bg-[#D8C296] transition-all flex items-center space-x-2 shadow-lg shadow-[#B79A62]/25 hover:scale-105 active:scale-95"
            >
              <span>Continue</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* ========================================================
          QUESTION 4: IDEAL DIGITAL RELATIONSHIP & REFLECTION (Single Select + Optional Text)
      ======================================================== */}
      {step === 4 && (
        <div className="space-y-5 animate-in fade-in duration-300">
          <div>
            <span className="text-[10px] uppercase font-mono tracking-widest text-[#E8D6AC] font-semibold block mb-1">
              Research Question 4 of 4
            </span>
            <h3 className="font-display text-2xl sm:text-3xl font-black text-[#F6F4ED] leading-snug">
              If technology could truly bring peace to your Deen, what would it look like?
            </h3>
            <p className="text-xs sm:text-sm text-[#DDE4D9]/80 font-light mt-1">
              Choose the one direction that aligns best with what you need right now.
            </p>
          </div>

          <div className="space-y-2.5 pt-1">
            {RESEARCH_Q4_EXPERIENCE.map((item) => {
              const selected = formData.preferred_product_type === item;
              return (
                <button
                  type="button"
                  key={item}
                  onClick={() => {
                    setErrorMessage("");
                    setFormData({ ...formData, preferred_product_type: item });
                  }}
                  className={`w-full text-left p-4 rounded-2xl border transition-all flex items-center justify-between text-xs sm:text-sm ${
                    selected
                      ? "bg-[#B79A62]/20 border-[#B79A62] text-[#F6F4ED] font-semibold shadow-md shadow-black/20"
                      : "bg-white/5 border-white/10 text-[#DDE4D9]/85 hover:bg-white/10 hover:border-white/20"
                  }`}
                >
                  <span className="leading-snug pr-2">{item}</span>
                  <div
                    className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 ml-3 ${
                      selected
                        ? "border-[#B79A62] bg-[#B79A62]"
                        : "border-white/30"
                    }`}
                  >
                    {selected && <div className="w-1.5 h-1.5 rounded-full bg-[#0A1410]" />}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Optional Qualitative Reflection Field */}
          <div className="pt-2 animate-in fade-in duration-200">
            <label className="block text-xs text-[#E8D6AC] mb-1.5 font-mono">
              In your own words: What is one thing technology could do to genuinely help your relationship with Allah? (Optional)
            </label>
            <textarea
              rows={3}
              value={formData.user_suggestions}
              onChange={(e) => setFormData({ ...formData, user_suggestions: e.target.value })}
              placeholder="e.g. Give me a quiet pause before opening social media so I can recite Ayat al-Kursi, or remind me gently without guilt..."
              className="w-full px-4 py-3 rounded-xl bg-black/40 border border-white/15 text-[#F6F4ED] text-xs sm:text-sm placeholder:text-[#DDE4D9]/40 outline-none focus:border-[#B79A62] resize-none"
            />
          </div>

          <div className="pt-3 flex items-center justify-between gap-3">
            <button
              type="button"
              onClick={() => {
                setErrorMessage("");
                setStep(3);
              }}
              className="px-5 py-3 rounded-full border border-white/20 text-[#DDE4D9]/80 hover:text-[#F6F4ED] text-xs uppercase tracking-wider flex items-center space-x-1.5 transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back</span>
            </button>
            <button
              type="button"
              onClick={goToStep5}
              className="px-8 py-3 rounded-full bg-[#B79A62] text-[#0A1410] font-bold text-xs uppercase tracking-wider hover:bg-[#D8C296] transition-all flex items-center space-x-2 shadow-lg shadow-[#B79A62]/25 hover:scale-105 active:scale-95"
            >
              <span>Continue</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* ========================================================
          STEP 5: CONTACT INFORMATION & BETA INTEREST
      ======================================================== */}
      {step === 5 && (
        <form onSubmit={handleSubmit} className="space-y-4 animate-in fade-in duration-300">
          <div>
            <span className="text-[10px] uppercase font-mono tracking-widest text-[#E8D6AC] font-semibold block mb-1">
              Final Step • Early Access Invite
            </span>
            <h3 className="font-display text-2xl sm:text-3xl font-black text-[#F6F4ED] leading-snug">
              Where should we send your early access invite?
            </h3>
            <p className="text-xs sm:text-sm text-[#DDE4D9]/80 font-light mt-1">
              No verification emails or links required. You will be registered on the waitlist immediately.
            </p>
          </div>

          {/* Email Address (Required) */}
          <div>
            <label className="block text-xs font-mono uppercase tracking-wider text-[#E8D6AC] mb-1.5">
              Email Address <span className="text-[#B79A62]">*</span>
            </label>
            <input
              type="email"
              required
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="you@example.com"
              className="w-full px-4 py-3.5 rounded-2xl bg-black/40 border border-white/15 text-[#F6F4ED] text-sm placeholder:text-[#DDE4D9]/40 outline-none focus:border-[#B79A62] transition-colors"
            />
          </div>

          {/* First Name & WhatsApp Number (Optional) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-[#DDE4D9]/70 mb-1.5">
                First Name (Optional)
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g. Bilal"
                className="w-full px-4 py-3 rounded-2xl bg-black/40 border border-white/15 text-[#F6F4ED] text-sm placeholder:text-[#DDE4D9]/40 outline-none focus:border-[#B79A62] transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-[#DDE4D9]/70 mb-1.5">
                WhatsApp Number (Optional)
              </label>
              <input
                type="tel"
                value={formData.whatsapp_number}
                onChange={(e) => setFormData({ ...formData, whatsapp_number: e.target.value })}
                placeholder="+92 300 1234567"
                className="w-full px-4 py-3 rounded-2xl bg-black/40 border border-white/15 text-[#F6F4ED] text-sm placeholder:text-[#DDE4D9]/40 outline-none focus:border-[#B79A62] transition-colors"
              />
            </div>
          </div>

          {/* Country Selection */}
          <div>
            <label className="block text-xs font-mono uppercase tracking-wider text-[#DDE4D9]/70 mb-1.5">
              Location / Country (Optional)
            </label>
            <select
              value={formData.country}
              onChange={(e) => setFormData({ ...formData, country: e.target.value })}
              className="w-full px-4 py-3 rounded-2xl bg-black/40 border border-white/15 text-[#F6F4ED] text-sm outline-none focus:border-[#B79A62] transition-colors"
            >
              <option value="Global" className="bg-[#0A1410] text-[#F6F4ED]">Global / International</option>
              {SURVEY_COUNTRIES.map((c) => (
                <option key={c} value={c} className="bg-[#0A1410] text-[#F6F4ED]">
                  {c}
                </option>
              ))}
            </select>
          </div>

          {/* Beta Testing Preference */}
          <div className="pt-1">
            <label className="block text-xs font-mono uppercase tracking-wider text-[#E8D6AC] mb-2">
              Would you like to test early concepts before public launch?
            </label>
            <div className="space-y-2">
              {RESEARCH_BETA_INTEREST.map((opt) => {
                const selected = formData.beta_interest === opt;
                return (
                  <button
                    type="button"
                    key={opt}
                    onClick={() => setFormData({ ...formData, beta_interest: opt })}
                    className={`w-full text-left p-3 rounded-xl border text-xs sm:text-sm flex items-center justify-between transition-all ${
                      selected
                        ? "bg-[#B79A62]/20 border-[#B79A62] text-[#F6F4ED] font-medium"
                        : "bg-white/5 border-white/10 text-[#DDE4D9]/80 hover:bg-white/10"
                    }`}
                  >
                    <span>{opt}</span>
                    <div
                      className={`w-3.5 h-3.5 rounded-full border shrink-0 ml-2 ${
                        selected ? "bg-[#B79A62] border-[#B79A62]" : "border-white/30"
                      }`}
                    />
                  </button>
                );
              })}
            </div>
          </div>

          {/* Optional Marketing Consent Checkbox (Unchecked by default) */}
          <div className="pt-2">
            <label className="flex items-start space-x-3 text-xs text-[#DDE4D9]/85 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={formData.marketing_consent}
                onChange={(e) => setFormData({ ...formData, marketing_consent: e.target.checked })}
                className="mt-0.5 rounded accent-[#B79A62] w-4 h-4 shrink-0 cursor-pointer"
              />
              <span className="leading-relaxed">
                I would like to receive occasional research findings and project announcements from Digital Taqwa &amp; Barakah Habits Daily. (Optional)
              </span>
            </label>
          </div>

          <div className="pt-3 flex items-center justify-between gap-3">
            <button
              type="button"
              onClick={() => {
                setErrorMessage("");
                setStep(4);
              }}
              className="px-5 py-3 rounded-full border border-white/20 text-[#DDE4D9]/80 hover:text-[#F6F4ED] text-xs uppercase tracking-wider flex items-center space-x-1.5 transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back</span>
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-8 py-3.5 rounded-full bg-[#B79A62] text-[#0A1410] font-bold text-xs uppercase tracking-wider hover:bg-[#D8C296] transition-all flex items-center space-x-2 shadow-lg shadow-[#B79A62]/30 disabled:opacity-50 hover:scale-105 active:scale-95"
            >
              {submitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Submitting Insights...</span>
                </>
              ) : (
                <>
                  <span>Join Early Access</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </form>
      )}

      {/* ========================================================
          STEP 6: CLEAN & POLISHED CONFIRMATION SCREEN
      ======================================================== */}
      {step === 6 && (
        <div className="text-center py-5 sm:py-8 space-y-6 animate-in fade-in duration-300">
          {/* Simple Success Icon */}
          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-[#19372D] border-2 border-[#B79A62] flex items-center justify-center mx-auto text-[#E8D6AC] shadow-xl shadow-[#B79A62]/20">
            <Check className="w-8 h-8 sm:w-10 sm:h-10 stroke-[2.5]" />
          </div>

          {/* Confirmation Content */}
          <div className="space-y-2">
            <h3 className="font-display text-2xl sm:text-4xl font-black text-[#F6F4ED] leading-tight">
              Thank You for Being Part of the Journey.
            </h3>
            <p className="text-sm sm:text-base text-[#DDE4D9]/90 font-light leading-relaxed max-w-lg mx-auto">
              Your feedback will help shape the future of Digital Taqwa.
            </p>
            <p className="text-xs sm:text-sm text-[#E8D6AC] font-serif italic">
              Together, we are building something meaningful.
            </p>
          </div>

          {/* Prominent EXPLORE DIGITAL TAQWA Button */}
          <div className="pt-2">
            <a
              href="https://digitaltaqwa.site"
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center justify-center space-x-2 px-9 py-4 rounded-full bg-gradient-to-r from-[#B79A62] via-[#D8C296] to-[#B79A62] text-[#0A1410] font-display text-xs sm:text-sm font-black uppercase tracking-wider shadow-[0_10px_35px_rgba(183,154,98,0.4)] hover:shadow-[0_12px_45px_rgba(183,154,98,0.6)] hover:scale-105 active:scale-95 transition-all duration-300"
            >
              <span>EXPLORE DIGITAL TAQWA</span>
              <ExternalLink className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </a>

            {/* Clickable URL clearly displayed below button */}
            <div className="mt-3">
              <a
                href="https://digitaltaqwa.site"
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-[#E8D6AC]/85 hover:text-[#F6F4ED] underline underline-offset-4 font-mono transition-colors"
              >
                https://digitaltaqwa.site
              </a>
            </div>
          </div>

          {/* Optional Referral Link */}
          {successData?.referralLink && (
            <div className="max-w-md mx-auto border-t border-white/10 pt-6 mt-6">
              <span className="text-xs uppercase tracking-widest text-[#E8D6AC] font-mono block mb-2.5">
                Share With Family &amp; Friends
              </span>

              <div className="flex items-center space-x-2 bg-black/40 border border-white/15 rounded-2xl p-2 mb-3">
                <input
                  type="text"
                  readOnly
                  value={successData.referralLink}
                  className="bg-transparent text-xs text-[#DDE4D9] flex-1 outline-none px-2 truncate select-all font-mono"
                />
                <button
                  type="button"
                  onClick={copyReferralLink}
                  className="px-3.5 py-1.5 rounded-xl bg-[#B79A62] text-[#0A1410] text-xs font-bold flex items-center space-x-1 hover:bg-[#D8C296] transition-colors"
                >
                  {copied ? (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      <span>Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy</span>
                    </>
                  )}
                </button>
              </div>

              <div className="flex items-center justify-center gap-2.5">
                <a
                  href={`https://wa.me/?text=${encodeURIComponent(
                    "Assalamu Alaikum! I just joined the early access waitlist for Digital Taqwa — an intentional Islamic sanctuary by Barakah Habits Daily: " +
                      successData.referralLink
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 rounded-xl border border-white/15 hover:border-[#B79A62] text-xs text-[#DDE4D9] hover:text-[#F6F4ED] flex items-center space-x-2 transition-colors bg-white/5"
                >
                  <MessageCircle className="w-4 h-4 text-emerald-400" />
                  <span>Share on WhatsApp</span>
                </a>
              </div>
            </div>
          )}

          <div className="pt-2">
            <button
              type="button"
              onClick={() => {
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
              className="text-xs text-[#DDE4D9]/60 hover:text-[#F6F4ED] uppercase tracking-wider font-mono transition-colors"
            >
              ↑ Return to Homepage
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
