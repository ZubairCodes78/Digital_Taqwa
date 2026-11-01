"use client";

import React, { useState, useEffect } from "react";
import {
  CONVERSATIONAL_FRICTIONS,
  CONVERSATIONAL_SANCTUARY_VISIONS,
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
  ArrowRight,
  ArrowLeft,
  Check,
  Copy,
  MessageCircle,
  AlertCircle,
  Loader2,
  ExternalLink,
  ChevronDown,
  Sparkles,
} from "lucide-react";

interface MultiStepWaitlistFormProps {
  onSuccess?: (data: { email: string; referralCode: string; referralLink: string }) => void;
  onStepChange?: (step: number) => void;
}

export function MultiStepWaitlistForm({ onSuccess, onStepChange }: MultiStepWaitlistFormProps = {}) {
  // Step 1: Spiritual Friction (Conversational Inquiry 1)
  // Step 2: Sanctuary Vision (Conversational Inquiry 2)
  // Step 3: Quiet Invitation (Email & Waitlist)
  // Step 4: Thank-You Confirmation
  const [step, setStep] = useState<number>(1);
  const [started, setStarted] = useState<boolean>(false);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [copied, setCopied] = useState<boolean>(false);

  // Form State
  const [selectedFriction, setSelectedFriction] = useState<string>("");
  const [customFriction, setCustomFriction] = useState<string>("");
  const [showCustomFriction, setShowCustomFriction] = useState<boolean>(false);

  const [selectedVision, setSelectedVision] = useState<string>("");
  const [customSuggestion, setCustomSuggestion] = useState<string>("");

  const [email, setEmail] = useState<string>("");
  const [name, setName] = useState<string>("");
  const [whatsapp, setWhatsapp] = useState<string>("");
  const [country, setCountry] = useState<string>("Global");
  const [showExtraContact, setShowExtraContact] = useState<boolean>(false);
  const [betaTester, setBetaTester] = useState<boolean>(true);
  const [marketingConsent, setMarketingConsent] = useState<boolean>(false);
  const [honeypot, setHoneypot] = useState<string>("");

  const [successData, setSuccessData] = useState<{
    email: string;
    referralCode: string;
    referralLink: string;
  } | null>(null);

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

  // Step 1 -> Step 2
  const handleProceedFromStep1 = () => {
    if (!selectedFriction && !customFriction.trim()) {
      setErrorMessage("Please choose a reflection that speaks to you, or write your own.");
      return;
    }
    setErrorMessage("");
    trackFormStepCompleted(1, "spiritual_friction");
    setStep(2);
  };

  // Step 2 -> Step 3
  const handleProceedFromStep2 = () => {
    if (!selectedVision && !customSuggestion.trim()) {
      setErrorMessage("Please choose what kind of sanctuary you need, or share your thought.");
      return;
    }
    setErrorMessage("");
    trackFormStepCompleted(2, "sanctuary_vision");
    setStep(3);
  };

  // Step 3 -> Final Submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");

    const emailTrimmed = email.trim().toLowerCase();
    if (!emailTrimmed || !emailTrimmed.includes("@") || !emailTrimmed.includes(".")) {
      setErrorMessage("Please enter a valid email address.");
      return;
    }

    setSubmitting(true);

    try {
      const attribution = getStoredAttribution();

      // Map conversational responses cleanly into the database structure
      const primaryFriction = selectedFriction || customFriction.trim() || "Spiritual distraction";
      const primaryVision = selectedVision || (customSuggestion.trim() ? "Community Suggestion" : "Quiet Digital Sanctuary");

      const payload = {
        name: name.trim() || undefined,
        country: country || "Global",
        email: emailTrimmed,
        whatsapp_number: whatsapp.trim() || undefined,
        marketing_consent: Boolean(marketingConsent),
        // Research mapping
        challenges: [primaryFriction],
        other_challenge: customFriction.trim() || undefined,
        desired_solutions: [primaryVision],
        preferred_product_type: primaryVision,
        user_suggestions: customSuggestion.trim() || undefined,
        beta_interest: betaTester
          ? "Yes, I would love to test early concepts and provide feedback"
          : "Not right now, just notify me when you launch",
        // Backward compatibility
        features: [primaryVision],
        primary_feature: primaryVision,
        usage_priorities: [primaryVision],
        honeypot: honeypot || undefined,
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
          setErrorMessage("This email is already part of our quiet waitlist.");
        } else {
          setErrorMessage(data.error || "Unable to save your reflection. Please try again.");
        }
        setSubmitting(false);
        return;
      }

      trackLead(primaryVision, country || "Global");
      const successPayload = {
        email: data.user?.email || emailTrimmed,
        referralCode: data.user?.referral_code || "",
        referralLink: data.user?.referral_link || `https://digitaltaqwa.site/?ref=${data.user?.referral_code}`,
      };

      setSuccessData(successPayload);
      setStep(4);
      onSuccess?.(successPayload);

      try {
        const confetti = (await import("canvas-confetti")).default;
        confetti({
          particleCount: 65,
          spread: 60,
          origin: { y: 0.6 },
          colors: ["#B79A62", "#19372D", "#F6F4ED", "#E8D6AC"],
        });
      } catch (e) {
        // Confetti optional
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
    <div className="relative bg-[#09140F]/90 backdrop-blur-2xl border border-[#B79A62]/25 rounded-[2rem] sm:rounded-[2.5rem] p-6 sm:p-10 md:p-14 text-[#F6F4ED] max-w-2xl mx-auto shadow-[0_30px_90px_rgba(0,0,0,0.65)] transition-all overflow-hidden">
      {/* Subtle ambient gold radial lighting behind the questions */}
      <div className="absolute -top-24 -left-24 w-80 h-80 bg-[#B79A62]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -right-24 w-80 h-80 bg-[#19372D]/40 rounded-full blur-3xl pointer-events-none" />

      {/* Bot Honeypot */}
      <input
        type="text"
        name="website_url"
        value={honeypot}
        onChange={(e) => setHoneypot(e.target.value)}
        className="hidden"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
      />

      {/* Micro Progress Indicator (Steps 1 to 3) */}
      {step <= 3 && (
        <div className="flex items-center justify-between mb-8 sm:mb-10 text-xs font-mono">
          <div className="flex items-center space-x-2">
            <span className="text-[#B79A62] font-semibold tracking-widest uppercase">
              Inquiry {step} of 3
            </span>
            <span className="text-white/20">&bull;</span>
            <span className="text-[#DDE4D9]/60">
              {step === 1 && "Spiritual Friction"}
              {step === 2 && "The Sanctuary"}
              {step === 3 && "Early Access"}
            </span>
          </div>

          <div className="flex items-center space-x-1.5">
            {[1, 2, 3].map((s) => (
              <div
                key={s}
                className={`h-1 rounded-full transition-all duration-300 ${
                  s === step
                    ? "w-7 bg-[#B79A62]"
                    : s < step
                    ? "w-2.5 bg-[#E8D6AC]/50"
                    : "w-2.5 bg-white/10"
                }`}
              />
            ))}
          </div>
        </div>
      )}

      {/* Global Error Banner */}
      {errorMessage && (
        <div
          role="alert"
          className="mb-6 p-4 rounded-2xl bg-red-950/70 border border-red-500/30 text-red-200 text-xs sm:text-sm flex items-center space-x-2.5 animate-shake"
        >
          <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* ========================================================
          INQUIRY 1: SPIRITUAL FRICTION (Editorial Conversational)
      ======================================================== */}
      {step === 1 && (
        <div className="space-y-6 sm:space-y-8 animate-in fade-in duration-300">
          <div>
            <h3 className="font-display text-2xl sm:text-3xl md:text-4xl font-normal text-[#F6F4ED] tracking-tight leading-snug">
              When your phone pulls you away from Allah, what does that moment look like?
            </h3>
            <p className="text-xs sm:text-sm text-[#DDE4D9]/75 font-light mt-2.5 leading-relaxed">
              Tap the thought that echoes your daily experience, or write your own below.
            </p>
          </div>

          {/* Fluid Conversational Phrases */}
          <div className="space-y-2.5">
            {CONVERSATIONAL_FRICTIONS.map((phrase) => {
              const isSelected = selectedFriction === phrase;
              return (
                <button
                  type="button"
                  key={phrase}
                  onClick={() => {
                    handleStartInteraction();
                    setErrorMessage("");
                    setSelectedFriction(isSelected ? "" : phrase);
                  }}
                  className={`w-full text-left p-4 sm:p-4.5 rounded-2xl border transition-all duration-200 text-xs sm:text-sm leading-relaxed flex items-center justify-between ${
                    isSelected
                      ? "bg-[#B79A62]/20 border-[#B79A62] text-[#F6F4ED] font-medium shadow-[0_4px_20px_rgba(183,154,98,0.2)]"
                      : "bg-white/[0.03] border-white/10 text-[#DDE4D9]/85 hover:bg-white/[0.07] hover:border-white/20"
                  }`}
                >
                  <span className="pr-3">&ldquo;{phrase}&rdquo;</span>
                  <div
                    className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 transition-colors ${
                      isSelected
                        ? "bg-[#B79A62] border-[#B79A62] text-[#0A1410]"
                        : "border-white/20 bg-black/20"
                    }`}
                  >
                    {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Optional: Write Your Own Thought */}
          <div className="pt-1">
            {!showCustomFriction ? (
              <button
                type="button"
                onClick={() => setShowCustomFriction(true)}
                className="text-xs text-[#E8D6AC]/80 hover:text-[#F6F4ED] font-mono transition-colors inline-flex items-center space-x-1.5"
              >
                <span>+ Or express this moment in your own words</span>
              </button>
            ) : (
              <div className="space-y-2 animate-in fade-in duration-200">
                <label className="block text-xs font-mono text-[#E8D6AC]/90">
                  In your own words:
                </label>
                <input
                  type="text"
                  value={customFriction}
                  onChange={(e) => {
                    setCustomFriction(e.target.value);
                    setErrorMessage("");
                  }}
                  placeholder="e.g. Opening social media right after waking for Fajr..."
                  className="w-full px-4 py-3.5 rounded-2xl bg-black/40 border border-white/15 text-[#F6F4ED] text-xs sm:text-sm placeholder:text-[#DDE4D9]/35 outline-none focus:border-[#B79A62] transition-colors"
                />
              </div>
            )}
          </div>

          <div className="pt-4 flex justify-end">
            <button
              type="button"
              onClick={handleProceedFromStep1}
              className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-[#B79A62] text-[#0A1410] font-bold text-xs uppercase tracking-wider hover:bg-[#D8C296] transition-all flex items-center justify-center space-x-2 shadow-lg shadow-[#B79A62]/20 hover:scale-105 active:scale-95"
            >
              <span>Continue</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* ========================================================
          INQUIRY 2: THE SANCTUARY (What Genuine Peace Feels Like)
      ======================================================== */}
      {step === 2 && (
        <div className="space-y-6 sm:space-y-8 animate-in fade-in duration-300">
          <div>
            <h3 className="font-display text-2xl sm:text-3xl md:text-4xl font-normal text-[#F6F4ED] tracking-tight leading-snug">
              If a digital space could bring stillness to your Deen, what would that feel like?
            </h3>
            <p className="text-xs sm:text-sm text-[#DDE4D9]/75 font-light mt-2.5 leading-relaxed">
              What kind of environment would make you return voluntarily, without guilt?
            </p>
          </div>

          {/* Sanctuary Visions */}
          <div className="space-y-2.5">
            {CONVERSATIONAL_SANCTUARY_VISIONS.map((vision) => {
              const isSelected = selectedVision === vision;
              return (
                <button
                  type="button"
                  key={vision}
                  onClick={() => {
                    setErrorMessage("");
                    setSelectedVision(isSelected ? "" : vision);
                  }}
                  className={`w-full text-left p-4 sm:p-4.5 rounded-2xl border transition-all duration-200 text-xs sm:text-sm leading-relaxed flex items-center justify-between ${
                    isSelected
                      ? "bg-[#B79A62]/20 border-[#B79A62] text-[#F6F4ED] font-medium shadow-[0_4px_20px_rgba(183,154,98,0.2)]"
                      : "bg-white/[0.03] border-white/10 text-[#DDE4D9]/85 hover:bg-white/[0.07] hover:border-white/20"
                  }`}
                >
                  <span className="pr-3">{vision}</span>
                  <div
                    className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 transition-colors ${
                      isSelected
                        ? "bg-[#B79A62] border-[#B79A62] text-[#0A1410]"
                        : "border-white/20 bg-black/20"
                    }`}
                  >
                    {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Optional Open Reflection */}
          <div className="space-y-2 pt-1">
            <label className="block text-xs font-mono text-[#E8D6AC]/90">
              Is there one thing you genuinely wish existed for your spiritual life? (Optional)
            </label>
            <textarea
              rows={2}
              value={customSuggestion}
              onChange={(e) => setCustomSuggestion(e.target.value)}
              placeholder="Share any thought, desire, or suggestion you have..."
              className="w-full px-4 py-3 rounded-2xl bg-black/40 border border-white/15 text-[#F6F4ED] text-xs sm:text-sm placeholder:text-[#DDE4D9]/35 outline-none focus:border-[#B79A62] transition-colors resize-none"
            />
          </div>

          <div className="pt-4 flex items-center justify-between gap-3">
            <button
              type="button"
              onClick={() => {
                setErrorMessage("");
                setStep(1);
              }}
              className="px-5 py-3 rounded-full border border-white/15 text-[#DDE4D9]/75 hover:text-[#F6F4ED] text-xs uppercase tracking-wider flex items-center space-x-1.5 transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back</span>
            </button>
            <button
              type="button"
              onClick={handleProceedFromStep2}
              className="px-8 py-3.5 rounded-full bg-[#B79A62] text-[#0A1410] font-bold text-xs uppercase tracking-wider hover:bg-[#D8C296] transition-all flex items-center space-x-2 shadow-lg shadow-[#B79A62]/20 hover:scale-105 active:scale-95"
            >
              <span>Continue</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* ========================================================
          INQUIRY 3: THE QUIET DOOR (Waitlist & Beta)
      ======================================================== */}
      {step === 3 && (
        <form onSubmit={handleSubmit} className="space-y-6 animate-in fade-in duration-300">
          <div>
            <h3 className="font-display text-2xl sm:text-3xl md:text-4xl font-normal text-[#F6F4ED] tracking-tight leading-snug">
              We are building with intention. May we invite you when the doors open?
            </h3>
            <p className="text-xs sm:text-sm text-[#DDE4D9]/75 font-light mt-2.5 leading-relaxed">
              No spam. No mandatory verification links. Your private spot is confirmed immediately.
            </p>
          </div>

          {/* Large Minimal Email Input */}
          <div className="space-y-1.5">
            <label className="block text-xs font-mono uppercase tracking-wider text-[#E8D6AC]">
              Email Address <span className="text-[#B79A62]">*</span>
            </label>
            <input
              type="email"
              required
              autoFocus
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full px-5 py-4 rounded-2xl bg-black/40 border border-[#B79A62]/40 text-[#F6F4ED] text-base placeholder:text-[#DDE4D9]/35 outline-none focus:border-[#B79A62] focus:ring-1 focus:ring-[#B79A62]/50 transition-all font-mono"
            />
          </div>

          {/* Beta Testing Quiet Toggle */}
          <button
            type="button"
            onClick={() => setBetaTester(!betaTester)}
            className={`w-full text-left p-3.5 rounded-2xl border transition-all flex items-center justify-between text-xs ${
              betaTester
                ? "bg-[#B79A62]/15 border-[#B79A62]/60 text-[#F6F4ED]"
                : "bg-white/[0.02] border-white/10 text-[#DDE4D9]/60"
            }`}
          >
            <span>I would love to test early private concepts before public launch</span>
            <div
              className={`w-4 h-4 rounded-md border flex items-center justify-center shrink-0 ml-2 ${
                betaTester ? "bg-[#B79A62] border-[#B79A62] text-[#0A1410]" : "border-white/20"
              }`}
            >
              {betaTester && <Check className="w-3 h-3 stroke-[3]" />}
            </div>
          </button>

          {/* Optional Expandable Contact Details */}
          {!showExtraContact ? (
            <button
              type="button"
              onClick={() => setShowExtraContact(true)}
              className="text-xs text-[#E8D6AC]/80 hover:text-[#F6F4ED] font-mono transition-colors inline-flex items-center space-x-1"
            >
              <span>+ Add Name or WhatsApp (optional)</span>
            </button>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1 animate-in fade-in duration-200">
              <div>
                <label className="block text-[11px] font-mono text-[#DDE4D9]/70 mb-1">
                  First Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Bilal"
                  className="w-full px-4 py-3 rounded-xl bg-black/40 border border-white/10 text-xs text-[#F6F4ED] placeholder:text-[#DDE4D9]/30 outline-none focus:border-[#B79A62]"
                />
              </div>
              <div>
                <label className="block text-[11px] font-mono text-[#DDE4D9]/70 mb-1">
                  WhatsApp Number
                </label>
                <input
                  type="tel"
                  value={whatsapp}
                  onChange={(e) => setWhatsapp(e.target.value)}
                  placeholder="+92 300 1234567"
                  className="w-full px-4 py-3 rounded-xl bg-black/40 border border-white/10 text-xs text-[#F6F4ED] placeholder:text-[#DDE4D9]/30 outline-none focus:border-[#B79A62]"
                />
              </div>
            </div>
          )}

          {/* Optional Marketing Consent */}
          <div className="pt-1">
            <label className="flex items-start space-x-2.5 text-xs text-[#DDE4D9]/70 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={marketingConsent}
                onChange={(e) => setMarketingConsent(e.target.checked)}
                className="mt-0.5 rounded accent-[#B79A62] w-3.5 h-3.5 shrink-0 cursor-pointer"
              />
              <span className="leading-relaxed">
                Send me occasional research findings from Digital Taqwa &amp; Barakah Habits Daily. (Optional)
              </span>
            </label>
          </div>

          <div className="pt-4 flex items-center justify-between gap-3">
            <button
              type="button"
              onClick={() => {
                setErrorMessage("");
                setStep(2);
              }}
              className="px-5 py-3 rounded-full border border-white/15 text-[#DDE4D9]/75 hover:text-[#F6F4ED] text-xs uppercase tracking-wider flex items-center space-x-1.5 transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back</span>
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-9 py-4 rounded-full bg-gradient-to-r from-[#B79A62] via-[#D8C296] to-[#B79A62] text-[#0A1410] font-bold text-xs uppercase tracking-wider hover:opacity-95 transition-all flex items-center space-x-2 shadow-xl shadow-[#B79A62]/25 disabled:opacity-50 hover:scale-105 active:scale-95"
            >
              {submitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Reserving Sanctuary...</span>
                </>
              ) : (
                <>
                  <span>Join the Sanctuary</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </form>
      )}

      {/* ========================================================
          STEP 4: ELEGANT THANK-YOU & EXPLORATION SCREEN
      ======================================================== */}
      {step === 4 && (
        <div className="text-center py-6 sm:py-10 space-y-7 animate-in fade-in duration-300">
          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-[#142A20] border-2 border-[#B79A62] flex items-center justify-center mx-auto text-[#E8D6AC] shadow-2xl shadow-[#B79A62]/20">
            <Check className="w-8 h-8 sm:w-10 sm:h-10 stroke-[2.5]" />
          </div>

          <div className="space-y-2.5 max-w-lg mx-auto">
            <h3 className="font-display text-2xl sm:text-4xl font-normal text-[#F6F4ED] tracking-tight leading-tight">
              Your Space is Reserved.
            </h3>
            <p className="text-sm sm:text-base text-[#DDE4D9]/85 font-light leading-relaxed">
              Thank you for sharing your reflection. Together, we are building something meaningful.
            </p>
          </div>

          {/* Prominent EXPLORE DIGITAL TAQWA Button */}
          <div className="pt-2">
            <a
              href="https://digitaltaqwa.site"
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center justify-center space-x-2 px-9 py-4 rounded-full bg-gradient-to-r from-[#B79A62] via-[#D8C296] to-[#B79A62] text-[#0A1410] font-display text-xs sm:text-sm font-black uppercase tracking-wider shadow-[0_10px_35px_rgba(183,154,98,0.35)] hover:shadow-[0_12px_45px_rgba(183,154,98,0.55)] hover:scale-105 active:scale-95 transition-all duration-300"
            >
              <span>EXPLORE DIGITAL TAQWA</span>
              <ExternalLink className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </a>

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
              <span className="text-[11px] uppercase tracking-widest text-[#E8D6AC] font-mono block mb-2.5">
                Invite a Friend to the Journey
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
                    "Assalamu Alaikum! I just reserved my spot for Digital Taqwa — an intentional Islamic sanctuary by Barakah Habits Daily: " +
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
              className="text-xs text-[#DDE4D9]/50 hover:text-[#F6F4ED] uppercase tracking-wider font-mono transition-colors"
            >
              ↑ Return to Homepage
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
