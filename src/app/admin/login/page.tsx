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
    <div className="min-h-screen bg-[#0A1410] text-[#F6F4ED] flex items-center justify-center p-6 selection:bg-[#B79A62] selection:text-[#0A1410]">
      <div className="max-w-md w-full bg-[#0D1C15]/90 backdrop-blur-2xl rounded-3xl p-8 sm:p-10 shadow-[0_20px_60px_rgba(0,0,0,0.8)] border border-[#B79A62]/35">
        <div className="mb-8 text-center">
          <div className="relative w-14 h-14 mx-auto mb-4 rounded-2xl overflow-hidden border border-[#B79A62]/40 bg-[#0A1410] p-1 shadow-lg">
            <Image
              src="/barakah-habits-logo.jpg"
              alt="Digital Taqwa"
              fill
              sizes="56px"
              priority
              className="object-cover"
            />
          </div>
          <span className="text-[11px] font-mono uppercase tracking-widest text-[#E8D6AC] font-semibold block mb-1">
            Internal Operations
          </span>
          <h1 className="font-display text-2xl sm:text-3xl font-black text-[#F6F4ED]">
            Digital Taqwa Admin
          </h1>
          <p className="text-xs text-[#DDE4D9]/70 mt-1 font-light">
            Enter administrator passphrase to access waitlist analytics.
          </p>
        </div>

        {error && (
          <div className="mb-6 p-3.5 rounded-2xl bg-red-950/70 border border-red-500/40 text-red-200 text-xs flex items-center space-x-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-mono uppercase tracking-wider text-[#E8D6AC] mb-1.5">
              Admin Passphrase
            </label>
            <input
              type="password"
              placeholder="••••••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-black/40 border border-white/15 focus:border-[#B79A62] rounded-2xl px-4 py-3 text-sm text-[#F6F4ED] outline-none transition-colors"
              required
              autoFocus
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 rounded-full bg-[#B79A62] text-[#0A1410] text-xs font-bold uppercase tracking-wider hover:bg-[#D8C296] transition-all flex items-center justify-center space-x-2 shadow-lg shadow-[#B79A62]/25 disabled:opacity-50 hover:scale-105 active:scale-95"
          >
            {loading ? (
              <Loader2 className="w-4 h-4 animate-spin text-[#0A1410]" />
            ) : (
              <>
                <span>Enter Admin Console</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        <div className="mt-6 pt-6 border-t border-white/10 text-center">
          <Link
            href="/"
            className="text-xs text-[#DDE4D9]/60 hover:text-[#E8D6AC] font-mono uppercase tracking-wider transition-colors"
          >
            ← Return to Homepage
          </Link>
        </div>
      </div>
    </div>
  );
}
