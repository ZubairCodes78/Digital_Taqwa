"use client";

import { useState, useEffect } from "react";
import {
  SURVEY_CHALLENGES,
  SURVEY_DESIRED_SOLUTIONS,
  SURVEY_PRODUCT_TYPES,
  SURVEY_USAGE_PRIORITIES,
  SURVEY_USAGE_FREQUENCIES,
  SURVEY_BETA_INTEREST_OPTIONS,
  SURVEY_COUNTRIES,
  SOCIAL_PROFILES,
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
  Share2,
  AlertCircle,
  Loader2,
  HelpCircle,
  Heart,
  Instagram,
  Youtube,
} from "lucide-react";
import confetti from "canvas-confetti";

interface SurveyFormState {
  // Step 1
  challenges: string[];
  other_challenge: string;
  // Step 2
  desired_solutions: string[];
  user_suggestions: string;
  // Step 3
  preferred_product_type: string;
  // Step 4
  usage_priorities: string[];
  expected_usage_frequency: string;
  // Step 5
  country: string;
  email: string;
  name: string;
  whatsapp_number: string;
  beta_interest: string;
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
    devUrl?: string;
  } | null>(null);

  const [formData, setFormData] = useState<SurveyFormState>({
    challenges: [],
    other_challenge: "",
    desired_solutions: [],
    user_suggestions: "",
    preferred_product_type: "",
    usage_priorities: [],
    expected_usage_frequency: "",
    country: "Pakistan",
    email: "",
    name: "",
    whatsapp_number: "",
    beta_interest: "Yes, I am interested",
    marketing_consent: false,
    honeypot: "",
  });

  useEffect(() => {
    captureAndPersistAttribution();
  }, []);

  const handleStartInteraction = () => {
    if (!started) {
      setStarted(true);
      trackFormStarted();
    }
  };

  // STEP 1: Toggle Challenges
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

  // STEP 2: Toggle Desired Solutions
  const toggleSolution = (item: string) => {
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

  // STEP 4: Toggle Usage Priorities
  const togglePriority = (item: string) => {
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

  // Step 1 Validation -> Next
  const goToStep2 = () => {
    if (formData.challenges.length === 0) {
      setErrorMessage("Please select at least one challenge you currently face.");
      return;
    }
    if (formData.challenges.includes("Other") && !formData.other_challenge.trim()) {
      setErrorMessage("Please specify your other challenge, or deselect 'Other'.");
      return;
    }
    setErrorMessage("");
    trackFormStepCompleted(1, "challenges");
    setStep(2);
  };

  // Step 2 Validation -> Next
  const goToStep3 = () => {
    if (formData.desired_solutions.length === 0) {
      setErrorMessage("Please select at least one capability you would want to see.");
      return;
    }
    setErrorMessage("");
    trackFormStepCompleted(2, "desired_solutions");
    setStep(3);
  };

  // Step 3 Validation -> Next
  const goToStep4 = () => {
    if (!formData.preferred_product_type) {
      setErrorMessage("Please select what kind of product experience you would prefer.");
      return;
    }
    setErrorMessage("");
    trackFormStepCompleted(3, "product_type");
    setStep(4);
  };

  // Step 4 Validation -> Next
  const goToStep5 = () => {
    if (formData.usage_priorities.length === 0) {
      setErrorMessage("Please select at least one priority that would make you use an app regularly.");
      return;
    }
    if (!formData.expected_usage_frequency) {
      setErrorMessage("Please select how often you realistically expect to use it.");
      return;
    }
    setErrorMessage("");
    trackFormStepCompleted(4, "priorities_frequency");
    setStep(5);
  };

  // Final Submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");

    if (!formData.email || !formData.email.includes("@")) {
      setErrorMessage("Please enter a valid email address.");
      return;
    }

    if (!formData.country) {
      setErrorMessage("Please select your country.");
      return;
    }

    setSubmitting(true);

    try {
      const attribution = getStoredAttribution();

      const payload = {
        name: formData.name.trim() || undefined,
        country: formData.country,
        email: formData.email.trim().toLowerCase(),
        whatsapp_number: formData.whatsapp_number.trim() || undefined,
        marketing_consent: formData.marketing_consent,
        // Research survey responses
        challenges: formData.challenges,
        other_challenge: formData.other_challenge.trim() || undefined,
        desired_solutions: formData.desired_solutions,
        user_suggestions: formData.user_suggestions.trim() || undefined,
        preferred_product_type: formData.preferred_product_type,
        usage_priorities: formData.usage_priorities,
        expected_usage_frequency: formData.expected_usage_frequency,
        beta_interest: formData.beta_interest,
        // Backward compatibility
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
          setErrorMessage("This email is already registered on our early access research list.");
        } else {
          setErrorMessage(data.error || "Unable to submit your responses. Please try again.");
        }
        setSubmitting(false);
        return;
      }

      // Success!
      trackLead(formData.preferred_product_type || "General", formData.country);
      const successPayload = {
        email: data.user?.email || formData.email,
        referralCode: data.user?.referral_code || "",
        referralLink: data.user?.referral_link || `${window.location.origin}/?ref=${data.user?.referral_code}`,
        devUrl: data.devUrl,
      };

      setSuccessData(successPayload);
      setStep(6); // Step 6 = Success Screen
      onSuccess?.(successPayload);

      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: ["#D6B56D", "#19372D", "#F6F4ED"],
        });
      } catch (e) {
        // Confetti silent fail
      }
    } catch (err: any) {
      setErrorMessage("Network error. Please check your connection and retry.");
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
    <div className="bg-[#10221A]/60 backdrop-blur-2xl border border-[#B79A62]/35 rounded-3xl p-6 sm:p-10 md:p-12 shadow-[0_20px_60px_0_rgba(0,0,0,0.6)] text-ivory max-w-3xl mx-auto transition-all">
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

      {/* Progress Bar & Stage Indicator (Steps 1 to 5) */}
      {step <= 5 && (
        <div className="mb-8">
          <div className="flex items-center justify-between text-xs font-mono mb-2">
            <span className="text-[#D6B56D] font-semibold tracking-wider uppercase">
              {step === 1 && "Step 01 / 05 &bull; Real Challenges"}
              {step === 2 && "Step 02 / 05 &bull; Desired Capabilities"}
              {step === 3 && "Step 03 / 05 &bull; Experience Direction"}
              {step === 4 && "Step 04 / 05 &bull; Priorities & Frequency"}
              {step === 5 && "Step 05 / 05 &bull; Early Access & Beta"}
            </span>
            <span className="text-sage/75">
              ~{60 - (step - 1) * 12}s left
            </span>
          </div>

          <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden">
            <div
              className="bg-gradient-to-r from-forest-light via-[#D6B56D] to-[#E8D6AC] h-full transition-all duration-300 rounded-full"
              style={{ width: `${(step / 5) * 100}%` }}
            />
          </div>
        </div>
      )}

      {/* Global Error Banner */}
      {errorMessage && (
        <div
          role="alert"
          className="mb-6 p-4 rounded-2xl bg-red-950/60 border border-red-500/40 text-red-200 text-xs flex items-center space-x-3"
        >
          <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* ========================================================
          STEP 1: UNDERSTAND DAILY CHALLENGES
      ======================================================== */}
      {step === 1 && (
        <div className="space-y-6 animate-in fade-in duration-300">
          <div>
            <span className="text-[10px] uppercase font-mono tracking-widest text-[#D6B56D] font-semibold block mb-1">
              Community Market Research
            </span>
            <h3 className="font-display text-2xl sm:text-3xl font-black text-ivory">
              What challenges do you currently face in your daily Islamic routine?
            </h3>
            <p className="text-xs sm:text-sm text-sage/80 font-light mt-1">
              Select all that apply to you. Your honest feedback dictates what we prioritize.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-2.5 pt-2">
            {SURVEY_CHALLENGES.map((item) => {
              const checked = formData.challenges.includes(item);
              return (
                <button
                  type="button"
                  key={item}
                  onClick={() => toggleChallenge(item)}
                  className={`text-left p-3.5 sm:p-4 rounded-2xl border transition-all flex items-center justify-between text-xs sm:text-sm ${
                    checked
                      ? "bg-[#D6B56D]/15 border-[#D6B56D] text-ivory font-medium shadow-sm"
                      : "bg-white/5 border-white/10 text-sage hover:bg-white/10 hover:border-white/20"
                  }`}
                >
                  <span className="leading-snug">{item}</span>
                  <div
                    className={`w-5 h-5 rounded-lg border flex items-center justify-center shrink-0 ml-3 transition-colors ${
                      checked
                        ? "bg-[#D6B56D] border-[#D6B56D] text-[#0E1A14]"
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
            <div className="pt-2 animate-in fade-in duration-200">
              <label className="block text-xs text-sage mb-1 font-mono">
                Please specify your other challenge:
              </label>
              <input
                type="text"
                value={formData.other_challenge}
                onChange={(e) => setFormData({ ...formData, other_challenge: e.target.value })}
                placeholder="e.g., Struggling to wake up for Tahajjud, lack of accountability..."
                className="w-full px-4 py-3 rounded-xl bg-black/30 border border-white/15 text-ivory text-xs placeholder:text-sage/40 outline-none focus:border-[#D6B56D]"
              />
            </div>
          )}

          <div className="pt-4 flex justify-end">
            <button
              type="button"
              onClick={goToStep2}
              className="px-8 py-3.5 rounded-full bg-[#D6B56D] text-[#0E1A14] font-semibold text-xs uppercase tracking-wider hover:bg-[#E8D6AC] transition-all flex items-center space-x-2 shadow-lg shadow-[#D6B56D]/20 hover:shadow-[#D6B56D]/30"
            >
              <span>Continue &rarr;</span>
            </button>
          </div>
        </div>
      )}

      {/* ========================================================
          STEP 2: DISCOVER WHAT USERS ACTUALLY WANT
      ======================================================== */}
      {step === 2 && (
        <div className="space-y-6 animate-in fade-in duration-300">
          <div>
            <span className="text-[10px] uppercase font-mono tracking-widest text-[#D6B56D] font-semibold block mb-1">
              Explore Research Possibilities
            </span>
            <h3 className="font-display text-2xl sm:text-3xl font-black text-ivory">
              If you could have a digital tool that genuinely helps your Deen, what would you want it to do?
            </h3>
            <p className="text-xs sm:text-sm text-sage/80 font-light mt-1">
              Select all capabilities you would realistically use. These are potential directions, not finalized features.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-2">
            {SURVEY_DESIRED_SOLUTIONS.map((item) => {
              const checked = formData.desired_solutions.includes(item);
              return (
                <button
                  type="button"
                  key={item}
                  onClick={() => toggleSolution(item)}
                  className={`text-left p-3.5 rounded-2xl border transition-all flex items-center justify-between text-xs ${
                    checked
                      ? "bg-[#D6B56D]/15 border-[#D6B56D] text-ivory font-medium"
                      : "bg-white/5 border-white/10 text-sage hover:bg-white/10"
                  }`}
                >
                  <span className="leading-snug pr-2">{item}</span>
                  <div
                    className={`w-4 h-4 rounded-md border flex items-center justify-center shrink-0 transition-colors ${
                      checked
                        ? "bg-[#D6B56D] border-[#D6B56D] text-[#0E1A14]"
                        : "border-white/30 bg-black/20"
                    }`}
                  >
                    {checked && <Check className="w-3 h-3 stroke-[3]" />}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Optional open text response */}
          <div className="pt-2">
            <label className="block text-xs text-sage mb-1 font-mono">
              Tell us what you would like to see (Optional):
            </label>
            <textarea
              rows={3}
              value={formData.user_suggestions}
              onChange={(e) => setFormData({ ...formData, user_suggestions: e.target.value })}
              placeholder="What unique feature or nuance would genuinely transform your Islamic lifestyle? Speak freely..."
              className="w-full px-4 py-3 rounded-xl bg-black/30 border border-white/15 text-ivory text-xs placeholder:text-sage/40 outline-none focus:border-[#D6B56D] resize-none"
            />
          </div>

          <div className="pt-4 flex items-center justify-between">
            <button
              type="button"
              onClick={() => setStep(1)}
              className="px-5 py-2.5 rounded-full border border-white/20 text-sage hover:text-ivory text-xs uppercase tracking-wider flex items-center space-x-1.5"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back</span>
            </button>
            <button
              type="button"
              onClick={goToStep3}
              className="px-8 py-3.5 rounded-full bg-[#D6B56D] text-[#0E1A14] font-semibold text-xs uppercase tracking-wider hover:bg-[#E8D6AC] transition-all flex items-center space-x-2 shadow-lg shadow-[#D6B56D]/20"
            >
              <span>Continue &rarr;</span>
            </button>
          </div>
        </div>
      )}

      {/* ========================================================
          STEP 3: PRODUCT EXPERIENCE PREFERENCES
      ======================================================== */}
      {step === 3 && (
        <div className="space-y-6 animate-in fade-in duration-300">
          <div>
            <span className="text-[10px] uppercase font-mono tracking-widest text-[#D6B56D] font-semibold block mb-1">
              Desired Direction
            </span>
            <h3 className="font-display text-2xl sm:text-3xl font-black text-ivory">
              What kind of experience would you prefer?
            </h3>
            <p className="text-xs sm:text-sm text-sage/80 font-light mt-1">
              Choose the one format that best matches your personal lifestyle philosophy.
            </p>
          </div>

          <div className="space-y-2.5 pt-2">
            {SURVEY_PRODUCT_TYPES.map((item) => {
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
                      ? "bg-[#D6B56D]/20 border-[#D6B56D] text-ivory font-semibold shadow-md"
                      : "bg-white/5 border-white/10 text-sage hover:bg-white/10"
                  }`}
                >
                  <span>{item}</span>
                  <div
                    className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 ml-3 ${
                      selected
                        ? "border-[#D6B56D] bg-[#D6B56D]"
                        : "border-white/30"
                    }`}
                  >
                    {selected && <div className="w-1.5 h-1.5 rounded-full bg-[#0E1A14]" />}
                  </div>
                </button>
              );
            })}
          </div>

          <div className="pt-4 flex items-center justify-between">
            <button
              type="button"
              onClick={() => setStep(2)}
              className="px-5 py-2.5 rounded-full border border-white/20 text-sage hover:text-ivory text-xs uppercase tracking-wider flex items-center space-x-1.5"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back</span>
            </button>
            <button
              type="button"
              onClick={goToStep4}
              className="px-8 py-3.5 rounded-full bg-[#D6B56D] text-[#0E1A14] font-semibold text-xs uppercase tracking-wider hover:bg-[#E8D6AC] transition-all flex items-center space-x-2 shadow-lg shadow-[#D6B56D]/20"
            >
              <span>Continue &rarr;</span>
            </button>
          </div>
        </div>
      )}

      {/* ========================================================
          STEP 4: PRIORITY & USAGE
      ======================================================== */}
      {step === 4 && (
        <div className="space-y-6 animate-in fade-in duration-300">
          <div>
            <span className="text-[10px] uppercase font-mono tracking-widest text-[#D6B56D] font-semibold block mb-1">
              Usage & Practicality
            </span>
            <h3 className="font-display text-2xl sm:text-3xl font-black text-ivory">
              What would make you use an app like this regularly?
            </h3>
            <p className="text-xs sm:text-sm text-sage/80 font-light mt-1">
              Select all elements that would make you open it daily.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2">
            {SURVEY_USAGE_PRIORITIES.map((item) => {
              const checked = formData.usage_priorities.includes(item);
              return (
                <button
                  type="button"
                  key={item}
                  onClick={() => togglePriority(item)}
                  className={`text-left p-3 rounded-2xl border transition-all flex items-center justify-between text-xs ${
                    checked
                      ? "bg-[#D6B56D]/15 border-[#D6B56D] text-ivory font-medium"
                      : "bg-white/5 border-white/10 text-sage hover:bg-white/10"
                  }`}
                >
                  <span>{item}</span>
                  <div
                    className={`w-3.5 h-3.5 rounded border flex items-center justify-center shrink-0 ml-2 ${
                      checked
                        ? "bg-[#D6B56D] border-[#D6B56D] text-[#0E1A14]"
                        : "border-white/30"
                    }`}
                  >
                    {checked && <Check className="w-2.5 h-2.5 stroke-[3]" />}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Sub-question: Realistic frequency */}
          <div className="pt-4 border-t border-white/10">
            <h4 className="font-display text-lg font-black text-ivory mb-2">
              How often would you realistically use such an application?
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {SURVEY_USAGE_FREQUENCIES.map((freq) => {
                const selected = formData.expected_usage_frequency === freq;
                return (
                  <button
                    type="button"
                    key={freq}
                    onClick={() => {
                      setErrorMessage("");
                      setFormData({ ...formData, expected_usage_frequency: freq });
                    }}
                    className={`p-2.5 rounded-xl border text-center text-xs transition-all ${
                      selected
                        ? "bg-[#D6B56D] text-[#0E1A14] font-semibold border-[#D6B56D]"
                        : "bg-white/5 border-white/10 text-sage hover:bg-white/10"
                    }`}
                  >
                    {freq}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="pt-4 flex items-center justify-between">
            <button
              type="button"
              onClick={() => setStep(3)}
              className="px-5 py-2.5 rounded-full border border-white/20 text-sage hover:text-ivory text-xs uppercase tracking-wider flex items-center space-x-1.5"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back</span>
            </button>
            <button
              type="button"
              onClick={goToStep5}
              className="px-8 py-3.5 rounded-full bg-[#D6B56D] text-[#0E1A14] font-semibold text-xs uppercase tracking-wider hover:bg-[#E8D6AC] transition-all flex items-center space-x-2 shadow-lg shadow-[#D6B56D]/20"
            >
              <span>Continue &rarr;</span>
            </button>
          </div>
        </div>
      )}

      {/* ========================================================
          STEP 5: EARLY ACCESS REGISTRATION & BETA INTEREST
      ======================================================== */}
      {step === 5 && (
        <form onSubmit={handleSubmit} className="space-y-5 animate-in fade-in duration-300">
          <div>
            <span className="text-[10px] uppercase font-mono tracking-widest text-[#D6B56D] font-semibold block mb-1">
              Final Step &bull; Early Access
            </span>
            <h3 className="font-display text-2xl sm:text-3xl font-black text-ivory">
              Reserve Your Place in the Digital Taqwa Cohort
            </h3>
            <p className="text-xs sm:text-sm text-sage/80 font-light mt-1">
              We never spam or sell data. Your email is strictly used to share research updates and cohort invitations.
            </p>
          </div>

          {/* Country Selection */}
          <div>
            <label className="block text-xs font-mono uppercase tracking-wider text-sage mb-1.5">
              Your Country <span className="text-[#D6B56D]">*</span>
            </label>
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 mb-2">
              {["Pakistan", "India", "Other"].map((c) => (
                <button
                  type="button"
                  key={c}
                  onClick={() => setFormData({ ...formData, country: c })}
                  className={`p-2 rounded-xl text-xs font-mono border transition-all ${
                    formData.country === c
                      ? "bg-[#D6B56D] text-[#0E1A14] font-bold border-[#D6B56D]"
                      : "bg-white/5 border-white/10 text-sage hover:bg-white/10"
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>

            {formData.country === "Other" && (
              <select
                value={formData.country}
                onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl bg-black/40 border border-white/15 text-ivory text-xs outline-none focus:border-[#D6B56D]"
              >
                <option value="Other">Select other country...</option>
                {SURVEY_COUNTRIES.filter((c) => c !== "Pakistan" && c !== "India" && c !== "Other").map(
                  (c) => (
                    <option key={c} value={c} className="bg-[#0E1A14]">
                      {c}
                    </option>
                  )
                )}
              </select>
            )}
          </div>

          {/* Email Address */}
          <div>
            <label className="block text-xs font-mono uppercase tracking-wider text-sage mb-1.5">
              Email Address <span className="text-[#D6B56D]">*</span>
            </label>
            <input
              type="email"
              required
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="you@example.com"
              className="w-full px-4 py-3 rounded-xl bg-black/40 border border-white/15 text-ivory text-sm placeholder:text-sage/40 outline-none focus:border-[#D6B56D]"
            />
          </div>

          {/* Optional Name & WhatsApp */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-sage mb-1.5">
                First Name (Optional)
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g. Zaid"
                className="w-full px-4 py-3 rounded-xl bg-black/40 border border-white/15 text-ivory text-sm placeholder:text-sage/40 outline-none focus:border-[#D6B56D]"
              />
            </div>

            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-sage mb-1.5">
                WhatsApp Number (Optional)
              </label>
              <input
                type="tel"
                value={formData.whatsapp_number}
                onChange={(e) => setFormData({ ...formData, whatsapp_number: e.target.value })}
                placeholder="+92 300 1234567"
                className="w-full px-4 py-3 rounded-xl bg-black/40 border border-white/15 text-ivory text-sm placeholder:text-sage/40 outline-none focus:border-[#D6B56D]"
              />
            </div>
          </div>

          {/* Beta Testing Interest Question */}
          <div className="pt-2">
            <label className="block text-xs font-mono uppercase tracking-wider text-[#D6B56D] mb-1.5">
              Would you like to participate in future beta testing?
            </label>
            <div className="space-y-1.5">
              {SURVEY_BETA_INTEREST_OPTIONS.map((opt) => (
                <label
                  key={opt}
                  className="flex items-center space-x-2.5 p-2 rounded-xl bg-white/5 border border-white/5 text-xs text-sage cursor-pointer hover:bg-white/10"
                >
                  <input
                    type="radio"
                    name="beta_interest"
                    checked={formData.beta_interest === opt}
                    onChange={() => setFormData({ ...formData, beta_interest: opt })}
                    className="accent-[#D6B56D]"
                  />
                  <span>{opt}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Optional Consent (Unchecked by default) */}
          <div className="pt-1">
            <label className="flex items-start space-x-2.5 text-xs text-sage/85 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={formData.marketing_consent}
                onChange={(e) => setFormData({ ...formData, marketing_consent: e.target.checked })}
                className="mt-0.5 rounded accent-[#D6B56D] w-4 h-4 shrink-0"
              />
              <span className="leading-relaxed">
                I agree to receive research updates and occasional project newsletters from Digital Taqwa &amp; Barakah Habits Daily. You can unsubscribe at any time.
              </span>
            </label>
          </div>

          <div className="pt-4 flex items-center justify-between">
            <button
              type="button"
              onClick={() => setStep(4)}
              className="px-5 py-2.5 rounded-full border border-white/20 text-sage hover:text-ivory text-xs uppercase tracking-wider flex items-center space-x-1.5"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back</span>
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-8 py-3.5 rounded-full bg-[#D6B56D] text-[#0E1A14] font-semibold text-xs uppercase tracking-wider hover:bg-[#E8D6AC] transition-all flex items-center space-x-2 shadow-lg shadow-[#D6B56D]/20 disabled:opacity-50"
            >
              {submitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Submitting Survey...</span>
                </>
              ) : (
                <>
                  <span>Submit Feedback &amp; Join</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </form>
      )}

      {/* ========================================================
          STEP 6: SUCCESS EXPERIENCE
      ======================================================== */}
      {step === 6 && successData && (
        <div className="text-center py-6 space-y-6 animate-in fade-in duration-300">
          <div className="w-16 h-16 rounded-full bg-[#D6B56D]/20 border border-[#D6B56D]/40 flex items-center justify-center mx-auto text-[#D6B56D]">
            <Check className="w-8 h-8 stroke-[2.5]" />
          </div>

          <div>
            <h3 className="font-display text-3xl sm:text-4xl font-black text-ivory">
              Thank You for Being Part of the Journey.
            </h3>
            <p className="max-w-md mx-auto text-sm sm:text-base text-sage/90 font-light leading-relaxed mt-2">
              Digital Taqwa is being shaped by people like you. Your feedback will help us understand what the future application should become.
            </p>
            <p className="text-xs text-[#D6B56D] font-mono mt-1">
              We will keep you updated as the project develops.
            </p>
          </div>

          {/* Verification Box */}
          <div className="max-w-md mx-auto p-4 rounded-2xl bg-black/40 border border-white/10 text-left">
            <span className="text-[10px] uppercase font-mono tracking-wider text-[#D6B56D] font-semibold block mb-1">
              Priority Placement &bull; Check Your Email
            </span>
            <p className="text-xs text-sage/80 leading-relaxed font-light">
              We have sent a verification email to <strong className="text-ivory font-medium">{successData.email}</strong>. Confirming your email ensures your research responses receive direct weighting.
            </p>

            {successData.devUrl && (
              <div className="mt-3 pt-3 border-t border-white/10">
                <span className="text-[9px] uppercase tracking-wider text-[#D6B56D] block font-mono">
                  Development Simulation Mode:
                </span>
                <a
                  href={successData.devUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="text-xs text-[#E8D6AC] hover:underline font-mono inline-block mt-0.5"
                >
                  1-Click Simulate Email Verification &rarr;
                </a>
              </div>
            )}
          </div>

          {/* Share Referral Link with Community */}
          <div className="max-w-md mx-auto border-t border-white/10 pt-6">
            <span className="text-xs uppercase tracking-widest text-sage font-mono block mb-3">
              Invite Family &amp; Friends to Shape Digital Taqwa
            </span>

            <div className="flex items-center space-x-2 bg-black/40 border border-white/15 rounded-xl p-2 mb-4">
              <input
                type="text"
                readOnly
                value={successData.referralLink}
                className="bg-transparent text-xs text-sage flex-1 outline-none px-2 truncate select-all font-mono"
              />
              <button
                type="button"
                onClick={copyReferralLink}
                className="px-3.5 py-1.5 rounded-lg bg-[#D6B56D] text-[#0E1A14] text-xs font-semibold flex items-center space-x-1"
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

            <div className="flex items-center justify-center space-x-3">
              <a
                href={`https://wa.me/?text=${encodeURIComponent(
                  "Assalamu Alaikum! I just took part in the community research survey for Digital Taqwa — a proposed companion by Barakah Habits Daily to help Muslims build consistent Islamic habits and reduce screen time. Share your thoughts here: " +
                    successData.referralLink
                )}`}
                target="_blank"
                rel="noreferrer"
                className="px-4 py-2 rounded-xl border border-white/15 hover:border-[#D6B56D] text-xs text-sage hover:text-ivory flex items-center space-x-2 transition-colors bg-white/5"
              >
                <MessageCircle className="w-4 h-4 text-emerald-400" />
                <span>WhatsApp</span>
              </a>

              <a
                href={SOCIAL_PROFILES.instagram.url}
                target="_blank"
                rel="noreferrer"
                className="px-4 py-2 rounded-xl border border-white/15 hover:border-[#D6B56D] text-xs text-sage hover:text-ivory flex items-center space-x-2 transition-colors bg-white/5"
              >
                <Instagram className="w-4 h-4 text-pink-400" />
                <span>Follow on Instagram</span>
              </a>
            </div>
          </div>

          <div className="pt-2">
            <button
              type="button"
              onClick={() => {
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
              className="text-xs text-sage/70 hover:text-ivory uppercase tracking-wider font-mono transition-colors"
            >
              &uarr; Return to Homepage
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
