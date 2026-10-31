"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, AlertCircle, Loader2, Lock } from "lucide-react";

export default function AdminLoginPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/admin/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        router.push("/admin");
        router.refresh();
      } else {
        setError(data.error || "Invalid password");
      }
    } catch (err) {
      setError("An error occurred during authentication.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-ivory text-charcoal flex items-center justify-center p-6">
      <div className="max-w-md w-full bg-white rounded-3xl p-8 sm:p-10 shadow-xl border border-charcoal/10">
        <div className="mb-8 text-center">
          <div className="relative w-12 h-12 mx-auto mb-4">
            <Image
              src="/logo-icon.png"
              alt="Digital Taqwa"
              fill
              sizes="48px"
              priority
              className="object-contain"
            />
          </div>
          <span className="text-xs uppercase tracking-widest text-gold-dark font-medium">
            Internal Operations
          </span>
          <h1 className="font-serif text-3xl font-bold text-forest mt-1">
            Digital Taqwa Admin
          </h1>
          <p className="text-xs text-charcoal-muted mt-1 font-light">
            Enter administrator passphrase to access waitlist analytics.
          </p>
        </div>

        {error && (
          <div className="mb-6 p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center space-x-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs uppercase tracking-wider text-charcoal-muted font-medium mb-1.5">
              Admin Passphrase
            </label>
            <input
              type="password"
              placeholder="••••••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-[#FAF9F5] border border-charcoal/15 focus:border-forest rounded-xl px-4 py-3 text-sm text-charcoal outline-none transition-colors"
              required
              autoFocus
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 rounded-full bg-forest text-ivory text-xs uppercase tracking-wider font-semibold hover:bg-forest-light transition-all flex items-center justify-center space-x-2 disabled:opacity-50"
          >
            {loading ? (
              <Loader2 className="w-4 h-4 animate-spin text-ivory" />
            ) : (
              <>
                <span>Enter Admin Console</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-charcoal/10 text-center text-xs text-charcoal-subtle">
          <Link href="/" className="hover:text-forest transition-colors">
            &larr; Return to Website
          </Link>
        </div>
      </div>
    </div>
  );
}
