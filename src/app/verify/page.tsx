"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Loader2, Check, X } from "lucide-react";
import { trackEmailVerified } from "@/lib/analytics";

function VerifyContent() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState(false);
  const [message, setMessage] = useState("");
  const [email, setEmail] = useState("");

  useEffect(() => {
    if (!token) {
      setLoading(false);
      setSuccess(false);
      setMessage("Verification token is missing from the link.");
      return;
    }

    async function doVerify() {
      try {
        const res = await fetch(`/api/verify?token=${token}`);
        const data = await res.json();

        if (res.ok && data.success) {
          setSuccess(true);
          setMessage(data.message || "Your email address has been verified.");
          setEmail(data.email || "");
          trackEmailVerified();
        } else {
          setSuccess(false);
          setMessage(data.error || "Verification link is invalid or expired.");
        }
      } catch (err) {
        setSuccess(false);
        setMessage("A network error occurred while verifying your email.");
      } finally {
        setLoading(false);
      }
    }

    doVerify();
  }, [token]);

  return (
    <div className="min-h-screen bg-ivory text-charcoal flex items-center justify-center p-6">
      <div className="max-w-md w-full bg-white rounded-3xl p-8 sm:p-10 text-center shadow-xl border border-charcoal/10">
        {loading ? (
          <div>
            <div className="w-14 h-14 rounded-full bg-forest/10 flex items-center justify-center mx-auto mb-6 text-forest">
              <Loader2 className="w-6 h-6 animate-spin" />
            </div>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-forest mb-2">
              Confirming Reservation...
            </h2>
            <p className="text-sm text-charcoal-muted font-light">
              Checking token validity against our secure registry.
            </p>
          </div>
        ) : success ? (
          <div>
            <div className="w-14 h-14 rounded-full bg-forest/10 flex items-center justify-center mx-auto mb-6 text-forest">
              <Check className="w-7 h-7 stroke-[2.5]" />
            </div>
            <span className="text-xs uppercase tracking-widest text-gold-dark font-medium block mb-2">
              Confirmation Complete
            </span>
            <h2 className="font-serif text-3xl font-bold text-forest mb-3">
              Early Access Confirmed.
            </h2>
            <p className="text-sm text-charcoal-muted font-light leading-relaxed mb-8">
              {message} {email && <>for <strong className="text-charcoal font-medium">{email}</strong></>}. You have reserved your priority placement in Cohort 01.
            </p>

            <Link
              href="/"
              className="inline-flex items-center space-x-2 px-7 py-3.5 rounded-full bg-forest text-ivory text-xs uppercase tracking-wider font-medium hover:bg-forest-light transition-all"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Return to Platform</span>
            </Link>
          </div>
        ) : (
          <div>
            <div className="w-14 h-14 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-6 text-red-600">
              <X className="w-7 h-7" />
            </div>
            <span className="text-xs uppercase tracking-widest text-red-600 font-medium block mb-2">
              Verification Notice
            </span>
            <h2 className="font-serif text-3xl font-bold text-forest mb-3">
              Unable to Verify.
            </h2>
            <p className="text-sm text-charcoal-muted font-light leading-relaxed mb-8">
              {message}
            </p>

            <Link
              href="/#waitlist"
              className="inline-flex items-center space-x-2 px-7 py-3.5 rounded-full bg-forest text-ivory text-xs uppercase tracking-wider font-medium hover:bg-forest-light transition-all"
            >
              <span>Re-join Waitlist &rarr;</span>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

export default function VerifyPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-ivory flex items-center justify-center text-xs uppercase tracking-widest text-forest">
          Loading...
        </div>
      }
    >
      <VerifyContent />
    </Suspense>
  );
}
