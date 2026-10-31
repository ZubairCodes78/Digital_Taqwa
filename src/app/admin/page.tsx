"use client";

import React, { useEffect, useState, useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
  Download,
  Search,
  LogOut,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  Eye,
  X,
  Users,
  CheckCircle,
  HelpCircle,
  Sparkles,
  TrendingUp,
  Filter,
  Check,
  ExternalLink,
  ShieldCheck,
  Globe,
  Radio,
  FileSpreadsheet,
} from "lucide-react";
import { AdminStats, WaitlistUserRecord } from "@/types";
import { formatDate } from "@/lib/utils";

export default function AdminDashboardPage() {
  const router = useRouter();
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [leads, setLeads] = useState<WaitlistUserRecord[]>([]);
  const [totalLeads, setTotalLeads] = useState<number>(0);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [page, setPage] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(true);

  // Filters
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [selectedCountry, setSelectedCountry] = useState<string>("all");
  const [selectedBetaInterest, setSelectedBetaInterest] = useState<string>("all");

  // Response detail modal
  const [activeLead, setActiveLead] = useState<WaitlistUserRecord | null>(null);

  // Active navigation tab
  const [activeTab, setActiveTab] = useState<"overview" | "users">("overview");

  const loadData = useCallback(async (targetPage = page) => {
    setLoading(true);
    try {
      const statsRes = await fetch("/api/admin/stats");
      if (statsRes.status === 401) {
        router.push("/admin/login");
        return;
      }
      const statsData = await statsRes.json();
      setStats(statsData.stats || statsData);

      // Build query params for leads
      const params = new URLSearchParams({
        page: targetPage.toString(),
        limit: "15",
      });
      if (searchTerm) params.append("search", searchTerm);
      if (selectedCountry !== "all") params.append("country", selectedCountry);
      if (selectedBetaInterest !== "all") params.append("betaInterest", selectedBetaInterest);

      const leadsRes = await fetch(`/api/admin/leads?${params.toString()}`);
      if (leadsRes.ok) {
        const leadsData = await leadsRes.json();
        setLeads(leadsData.leads || []);
        setTotalLeads(leadsData.total || 0);
        setTotalPages(leadsData.totalPages || 1);
        setPage(leadsData.page || 1);
      }
    } catch (err) {
      console.error("Error loading admin data:", err);
    } finally {
      setLoading(false);
    }
  }, [page, router, searchTerm, selectedCountry, selectedBetaInterest]);

  useEffect(() => {
    loadData(1);
  }, [loadData]);

  const handleLogout = async () => {
    await fetch("/api/admin/auth", { method: "DELETE" });
    router.push("/admin/login");
  };

  const handleExportCSV = () => {
    window.location.href = "/api/admin/export";
  };

  // Extract unique countries from stats or leads
  const availableCountries = useMemo(() => {
    if (!stats?.countryDistribution) return [];
    return Object.keys(stats.countryDistribution).sort();
  }, [stats]);

  // Beta interest options
  const betaOptions = [
    "Yes, I am interested",
    "Maybe, depending on the application",
    "Not right now",
  ];

  return (
    <div className="min-h-screen bg-[#0A1410] text-[#F6F4ED] selection:bg-[#B79A62] selection:text-[#0A1410]">
      {/* Top Navigation Bar */}
      <header className="border-b border-[#B79A62]/20 bg-[#0D1C15]/90 sticky top-0 z-40 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
          <div className="flex items-center space-x-3.5">
            <div className="relative w-9 h-9 rounded-xl overflow-hidden border border-[#B79A62]/40 bg-[#0A1410] p-1 shadow-md">
              <Image
                src="/barakah-habits-logo.jpg"
                alt="Digital Taqwa"
                fill
                sizes="36px"
                className="object-cover"
              />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-display font-black text-base sm:text-lg text-[#F6F4ED] tracking-tight">
                  DIGITAL TAQWA
                </span>
                <span className="px-2 py-0.5 rounded-full bg-[#19372D] border border-[#B79A62]/30 text-[10px] font-mono text-[#E8D6AC] uppercase tracking-wider">
                  Admin Console
                </span>
              </div>
              <span className="text-[11px] text-[#DDE4D9]/60 font-mono block">
                Real Database Information Only
              </span>
            </div>
          </div>

          <div className="flex items-center space-x-2.5">
            <button
              onClick={() => loadData(page)}
              disabled={loading}
              title="Refresh Data"
              className="p-2.5 rounded-xl border border-white/10 text-[#DDE4D9] hover:text-[#E8D6AC] hover:border-[#B79A62]/40 transition-colors bg-white/5 disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
            </button>

            <button
              onClick={handleExportCSV}
              className="px-4 py-2 rounded-xl bg-[#B79A62] text-[#0A1410] font-bold text-xs uppercase tracking-wider hover:bg-[#D8C296] transition-all flex items-center space-x-1.5 shadow-md shadow-[#B79A62]/20 hover:scale-105 active:scale-95"
            >
              <Download className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Export CSV</span>
            </button>

            <Link
              href="/"
              target="_blank"
              className="px-3.5 py-2 rounded-xl border border-white/10 text-[#DDE4D9] hover:text-[#F6F4ED] hover:border-white/25 text-xs font-mono uppercase tracking-wider flex items-center space-x-1.5 bg-white/5 transition-colors"
            >
              <span>Live Site</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </Link>

            <button
              onClick={handleLogout}
              title="Sign Out"
              className="p-2.5 rounded-xl border border-red-500/20 text-red-300 hover:text-red-200 hover:bg-red-950/40 transition-colors"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Navigation Tabs */}
        <div className="flex items-center space-x-2 border-b border-white/10 pb-3">
          <button
            onClick={() => setActiveTab("overview")}
            className={`px-4 py-2 rounded-xl text-xs font-mono uppercase tracking-wider transition-all flex items-center space-x-2 ${
              activeTab === "overview"
                ? "bg-[#B79A62] text-[#0A1410] font-bold shadow-md shadow-[#B79A62]/20"
                : "text-[#DDE4D9]/70 hover:text-[#F6F4ED] hover:bg-white/5"
            }`}
          >
            <TrendingUp className="w-3.5 h-3.5" />
            <span>Research Overview</span>
          </button>
          <button
            onClick={() => setActiveTab("users")}
            className={`px-4 py-2 rounded-xl text-xs font-mono uppercase tracking-wider transition-all flex items-center space-x-2 ${
              activeTab === "users"
                ? "bg-[#B79A62] text-[#0A1410] font-bold shadow-md shadow-[#B79A62]/20"
                : "text-[#DDE4D9]/70 hover:text-[#F6F4ED] hover:bg-white/5"
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>User Management ({totalLeads})</span>
          </button>
        </div>

        {/* ========================================================
            TAB 1: RESEARCH OVERVIEW & ANALYTICS
        ======================================================== */}
        {activeTab === "overview" && (
          <div className="space-y-8 animate-in fade-in duration-300">
            {/* Top Metric Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-6 rounded-3xl bg-[#12241C]/70 backdrop-blur-xl border border-[#B79A62]/30 shadow-xl">
                <span className="text-[11px] font-mono uppercase tracking-wider text-[#E8D6AC] block mb-1">
                  Total Waitlist
                </span>
                <div className="flex items-baseline space-x-2">
                  <span className="text-3xl sm:text-4xl font-black font-display text-[#F6F4ED]">
                    {stats?.totalSignups ?? totalLeads}
                  </span>
                  <span className="text-xs text-[#E8D6AC]/75 font-mono">Real Entries</span>
                </div>
                <p className="text-xs text-[#DDE4D9]/60 mt-2 font-light">
                  Active community members registered
                </p>
              </div>

              <div className="p-6 rounded-3xl bg-[#12241C]/70 backdrop-blur-xl border border-[#B79A62]/30 shadow-xl">
                <span className="text-[11px] font-mono uppercase tracking-wider text-[#E8D6AC] block mb-1">
                  Surveys Completed
                </span>
                <div className="flex items-baseline space-x-2">
                  <span className="text-3xl sm:text-4xl font-black font-display text-[#F6F4ED]">
                    {stats?.totalSignups ?? totalLeads}
                  </span>
                  <span className="text-xs text-emerald-400 font-mono">100% Rate</span>
                </div>
                <p className="text-xs text-[#DDE4D9]/60 mt-2 font-light">
                  All 4 research questions answered
                </p>
              </div>

              <div className="p-6 rounded-3xl bg-[#12241C]/70 backdrop-blur-xl border border-[#B79A62]/30 shadow-xl">
                <span className="text-[11px] font-mono uppercase tracking-wider text-[#E8D6AC] block mb-1">
                  Beta Testing Interest
                </span>
                <div className="flex items-baseline space-x-2">
                  <span className="text-3xl sm:text-4xl font-black font-display text-[#F6F4ED]">
                    {stats?.betaInterestDistribution
                      ? Object.entries(stats.betaInterestDistribution)
                          .filter(([k]) => k.toLowerCase().includes("yes"))
                          .reduce((acc, [, val]) => acc + val, 0)
                      : 0}
                  </span>
                  <span className="text-xs text-[#E8D6AC]/75 font-mono">Ready to test</span>
                </div>
                <p className="text-xs text-[#DDE4D9]/60 mt-2 font-light">
                  Volunteered for pre-launch beta access
                </p>
              </div>

              <div className="p-6 rounded-3xl bg-[#12241C]/70 backdrop-blur-xl border border-[#B79A62]/30 shadow-xl">
                <span className="text-[11px] font-mono uppercase tracking-wider text-[#E8D6AC] block mb-1">
                  Marketing Opt-In
                </span>
                <div className="flex items-baseline space-x-2">
                  <span className="text-3xl sm:text-4xl font-black font-display text-[#F6F4ED]">
                    {stats?.verifiedEmails ?? 0}
                  </span>
                  <span className="text-xs text-[#E8D6AC]/75 font-mono">Optional</span>
                </div>
                <p className="text-xs text-[#DDE4D9]/60 mt-2 font-light">
                  Agreed to occasional research updates
                </p>
              </div>
            </div>

            {/* Grid Breakdown: Challenges & Solutions */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Question 1: Biggest Challenges */}
              <div className="p-6 sm:p-8 rounded-3xl bg-[#12241C]/70 backdrop-blur-xl border border-[#B79A62]/30 shadow-xl space-y-5">
                <div className="flex items-center justify-between border-b border-white/10 pb-3">
                  <div>
                    <span className="text-[10px] font-mono uppercase tracking-wider text-[#E8D6AC] font-semibold block">
                      Question 01 Breakdown
                    </span>
                    <h3 className="font-display text-lg font-bold text-[#F6F4ED]">
                      Top Challenges Faced by Community
                    </h3>
                  </div>
                </div>

                <div className="space-y-3.5">
                  {stats?.challengeCounts && Object.keys(stats.challengeCounts).length > 0 ? (
                    Object.entries(stats.challengeCounts)
                      .sort(([, a], [, b]) => b - a)
                      .map(([challenge, count]) => {
                        const maxVal = Math.max(
                          ...Object.values(stats.challengeCounts),
                          1
                        );
                        const pct = Math.round((count / (stats.totalSignups || 1)) * 100);
                        return (
                          <div key={challenge} className="space-y-1">
                            <div className="flex items-center justify-between text-xs">
                              <span className="text-[#DDE4D9] font-medium pr-2">{challenge}</span>
                              <span className="font-mono text-[#E8D6AC] shrink-0">
                                {count} votes ({pct}%)
                              </span>
                            </div>
                            <div className="w-full bg-white/5 h-2 rounded-full overflow-hidden">
                              <div
                                className="bg-[#B79A62] h-full rounded-full transition-all duration-500"
                                style={{ width: `${(count / maxVal) * 100}%` }}
                              />
                            </div>
                          </div>
                        );
                      })
                  ) : (
                    <p className="text-xs text-[#DDE4D9]/60 italic py-4">No challenge data recorded yet.</p>
                  )}
                </div>
              </div>

              {/* Question 2: Desired Solutions */}
              <div className="p-6 sm:p-8 rounded-3xl bg-[#12241C]/70 backdrop-blur-xl border border-[#B79A62]/30 shadow-xl space-y-5">
                <div className="flex items-center justify-between border-b border-white/10 pb-3">
                  <div>
                    <span className="text-[10px] font-mono uppercase tracking-wider text-[#E8D6AC] font-semibold block">
                      Question 02 Breakdown
                    </span>
                    <h3 className="font-display text-lg font-bold text-[#F6F4ED]">
                      What Would Help Most (Desired Solutions)
                    </h3>
                  </div>
                </div>

                <div className="space-y-3.5">
                  {stats?.solutionInterests && Object.keys(stats.solutionInterests).length > 0 ? (
                    Object.entries(stats.solutionInterests)
                      .sort(([, a], [, b]) => b - a)
                      .map(([solution, count]) => {
                        const maxVal = Math.max(
                          ...Object.values(stats.solutionInterests),
                          1
                        );
                        const pct = Math.round((count / (stats.totalSignups || 1)) * 100);
                        return (
                          <div key={solution} className="space-y-1">
                            <div className="flex items-center justify-between text-xs">
                              <span className="text-[#DDE4D9] font-medium pr-2">{solution}</span>
                              <span className="font-mono text-[#E8D6AC] shrink-0">
                                {count} votes ({pct}%)
                              </span>
                            </div>
                            <div className="w-full bg-white/5 h-2 rounded-full overflow-hidden">
                              <div
                                className="bg-gradient-to-r from-[#B79A62] to-[#E8D6AC] h-full rounded-full transition-all duration-500"
                                style={{ width: `${(count / maxVal) * 100}%` }}
                              />
                            </div>
                          </div>
                        );
                      })
                  ) : (
                    <p className="text-xs text-[#DDE4D9]/60 italic py-4">No solution data recorded yet.</p>
                  )}
                </div>
              </div>
            </div>

            {/* Grid Breakdown: Product Types & Beta Interest */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Question 3: Preferred Product Type */}
              <div className="p-6 rounded-3xl bg-[#12241C]/70 backdrop-blur-xl border border-[#B79A62]/30 shadow-xl space-y-4">
                <span className="text-[10px] font-mono uppercase tracking-wider text-[#E8D6AC] font-semibold block">
                  Question 03 • Product Format
                </span>
                <h3 className="font-display text-base font-bold text-[#F6F4ED]">
                  Experience Preference
                </h3>
                <div className="space-y-2.5">
                  {stats?.productTypeDistribution && Object.keys(stats.productTypeDistribution).length > 0 ? (
                    Object.entries(stats.productTypeDistribution)
                      .sort(([, a], [, b]) => b - a)
                      .map(([prodType, count]) => (
                        <div
                          key={prodType}
                          className="p-3 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-between text-xs"
                        >
                          <span className="text-[#DDE4D9] truncate pr-2">{prodType}</span>
                          <span className="font-mono font-bold text-[#E8D6AC]">{count}</span>
                        </div>
                      ))
                  ) : (
                    <p className="text-xs text-[#DDE4D9]/60 italic">No responses yet.</p>
                  )}
                </div>
              </div>

              {/* Question 4: Beta Interest */}
              <div className="p-6 rounded-3xl bg-[#12241C]/70 backdrop-blur-xl border border-[#B79A62]/30 shadow-xl space-y-4">
                <span className="text-[10px] font-mono uppercase tracking-wider text-[#E8D6AC] font-semibold block">
                  Question 04 • Beta Testing
                </span>
                <h3 className="font-display text-base font-bold text-[#F6F4ED]">
                  Testing Willingness
                </h3>
                <div className="space-y-2.5">
                  {stats?.betaInterestDistribution && Object.keys(stats.betaInterestDistribution).length > 0 ? (
                    Object.entries(stats.betaInterestDistribution).map(([opt, count]) => (
                      <div
                        key={opt}
                        className="p-3 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-between text-xs"
                      >
                        <span className="text-[#DDE4D9] truncate pr-2">{opt}</span>
                        <span className="font-mono font-bold text-[#E8D6AC]">{count}</span>
                      </div>
                    ))
                  ) : (
                    <p className="text-xs text-[#DDE4D9]/60 italic">No responses yet.</p>
                  )}
                </div>
              </div>

              {/* Geographic Distribution */}
              <div className="p-6 rounded-3xl bg-[#12241C]/70 backdrop-blur-xl border border-[#B79A62]/30 shadow-xl space-y-4">
                <span className="text-[10px] font-mono uppercase tracking-wider text-[#E8D6AC] font-semibold block">
                  Geographic Footprint
                </span>
                <h3 className="font-display text-base font-bold text-[#F6F4ED]">
                  Top Countries
                </h3>
                <div className="space-y-2.5">
                  {stats?.countryDistribution && Object.keys(stats.countryDistribution).length > 0 ? (
                    Object.entries(stats.countryDistribution)
                      .sort(([, a], [, b]) => b - a)
                      .slice(0, 5)
                      .map(([country, count]) => (
                        <div
                          key={country}
                          className="p-3 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-between text-xs"
                        >
                          <span className="text-[#DDE4D9]">{country}</span>
                          <span className="font-mono font-bold text-[#E8D6AC]">{count}</span>
                        </div>
                      ))
                  ) : (
                    <p className="text-xs text-[#DDE4D9]/60 italic">No geographic data yet.</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================
            TAB 2: USER MANAGEMENT TABLE
        ======================================================== */}
        {activeTab === "users" && (
          <div className="space-y-6 animate-in fade-in duration-300">
            {/* Filter Bar */}
            <div className="p-5 rounded-3xl bg-[#12241C]/70 backdrop-blur-xl border border-[#B79A62]/30 shadow-xl flex flex-col md:flex-row items-center justify-between gap-4">
              {/* Search input */}
              <div className="relative w-full md:w-96">
                <Search className="w-4 h-4 text-[#DDE4D9]/50 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search by name, email, or phone..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-black/40 border border-white/10 text-xs sm:text-sm text-[#F6F4ED] placeholder:text-[#DDE4D9]/40 outline-none focus:border-[#B79A62]"
                />
              </div>

              {/* Filter selects */}
              <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
                {/* Country Filter */}
                <div className="flex items-center space-x-2">
                  <span className="text-xs font-mono text-[#E8D6AC]/80">Country:</span>
                  <select
                    value={selectedCountry}
                    onChange={(e) => setSelectedCountry(e.target.value)}
                    className="px-3 py-2 rounded-xl bg-black/40 border border-white/10 text-xs text-[#F6F4ED] outline-none focus:border-[#B79A62]"
                  >
                    <option value="all">All Countries</option>
                    {availableCountries.map((c) => (
                      <option key={c} value={c} className="bg-[#0A1410]">
                        {c}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Beta Interest Filter */}
                <div className="flex items-center space-x-2">
                  <span className="text-xs font-mono text-[#E8D6AC]/80">Beta:</span>
                  <select
                    value={selectedBetaInterest}
                    onChange={(e) => setSelectedBetaInterest(e.target.value)}
                    className="px-3 py-2 rounded-xl bg-black/40 border border-white/10 text-xs text-[#F6F4ED] outline-none focus:border-[#B79A62]"
                  >
                    <option value="all">All Preferences</option>
                    {betaOptions.map((b) => (
                      <option key={b} value={b} className="bg-[#0A1410]">
                        {b}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Table Container */}
            <div className="rounded-3xl bg-[#12241C]/70 backdrop-blur-xl border border-[#B79A62]/30 shadow-xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#0D1C15] border-b border-[#B79A62]/20 font-mono uppercase tracking-wider text-[#E8D6AC]">
                    <tr>
                      <th className="px-5 py-4">User</th>
                      <th className="px-5 py-4">Country</th>
                      <th className="px-5 py-4">Beta Interest</th>
                      <th className="px-5 py-4">Experience Direction</th>
                      <th className="px-5 py-4">Registered</th>
                      <th className="px-5 py-4 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {loading ? (
                      <tr>
                        <td colSpan={6} className="text-center py-12 text-[#DDE4D9]/60 font-mono">
                          <RefreshCw className="w-5 h-5 animate-spin mx-auto mb-2 text-[#B79A62]" />
                          Loading real user records...
                        </td>
                      </tr>
                    ) : leads.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="text-center py-12 text-[#DDE4D9]/60 font-mono">
                          No records match your query.
                        </td>
                      </tr>
                    ) : (
                      leads.map((lead) => (
                        <tr
                          key={lead.id}
                          className="hover:bg-white/5 transition-colors group"
                        >
                          <td className="px-5 py-4">
                            <div className="font-semibold text-[#F6F4ED] truncate max-w-xs">
                              {lead.name ? `${lead.name} • ${lead.email}` : lead.email}
                            </div>
                            {lead.whatsapp_number && (
                              <div className="text-[11px] text-[#DDE4D9]/60 font-mono">
                                WhatsApp: {lead.whatsapp_number}
                              </div>
                            )}
                          </td>
                          <td className="px-5 py-4 text-[#DDE4D9] font-mono">
                            {lead.country}
                          </td>
                          <td className="px-5 py-4">
                            <span
                              className={`px-2.5 py-1 rounded-full text-[10px] font-mono font-semibold ${
                                lead.beta_interest?.includes("Yes")
                                  ? "bg-emerald-950/80 border border-emerald-500/40 text-emerald-300"
                                  : lead.beta_interest?.includes("Maybe")
                                  ? "bg-amber-950/80 border border-amber-500/40 text-amber-300"
                                  : "bg-white/5 border border-white/10 text-[#DDE4D9]/70"
                              }`}
                            >
                              {lead.beta_interest || "Interested"}
                            </span>
                          </td>
                          <td className="px-5 py-4 text-[#DDE4D9] max-w-xs truncate">
                            {lead.preferred_product_type || lead.primary_feature || "General"}
                          </td>
                          <td className="px-5 py-4 text-[#DDE4D9]/70 font-mono whitespace-nowrap">
                            {formatDate(lead.created_at)}
                          </td>
                          <td className="px-5 py-4 text-right">
                            <button
                              onClick={() => setActiveLead(lead)}
                              className="px-3 py-1.5 rounded-xl border border-white/10 hover:border-[#B79A62] text-[#DDE4D9] hover:text-[#E8D6AC] bg-white/5 transition-colors inline-flex items-center space-x-1.5 text-xs font-mono"
                            >
                              <Eye className="w-3.5 h-3.5" />
                              <span>View Response</span>
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>

              {/* Pagination Controls */}
              <div className="p-4 border-t border-white/10 flex items-center justify-between text-xs font-mono text-[#DDE4D9]/70">
                <span>
                  Showing {leads.length} of {totalLeads} users
                </span>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => loadData(Math.max(1, page - 1))}
                    disabled={page <= 1}
                    className="p-2 rounded-xl border border-white/10 hover:border-[#B79A62] disabled:opacity-30 disabled:pointer-events-none transition-colors"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <span className="px-2">
                    Page {page} of {totalPages}
                  </span>
                  <button
                    onClick={() => loadData(Math.min(totalPages, page + 1))}
                    disabled={page >= totalPages}
                    className="p-2 rounded-xl border border-white/10 hover:border-[#B79A62] disabled:opacity-30 disabled:pointer-events-none transition-colors"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================
            MODAL: INDIVIDUAL USER RESPONSE VIEW
        ======================================================== */}
        {activeLead && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
            <div className="w-full max-w-2xl bg-[#0D1C15] border border-[#B79A62]/40 rounded-3xl p-6 sm:p-8 shadow-2xl text-[#F6F4ED] max-h-[90vh] overflow-y-auto space-y-6">
              {/* Header */}
              <div className="flex items-start justify-between border-b border-white/10 pb-4">
                <div>
                  <span className="text-[10px] font-mono uppercase tracking-wider text-[#E8D6AC] font-semibold block">
                    Individual Survey Submission
                  </span>
                  <h3 className="font-display text-xl sm:text-2xl font-bold text-[#F6F4ED] mt-0.5">
                    {activeLead.name ? `${activeLead.name}` : "Early Access Participant"}
                  </h3>
                  <span className="text-xs font-mono text-[#DDE4D9]/70 block mt-0.5">
                    {activeLead.email} &bull; Registered {formatDate(activeLead.created_at)}
                  </span>
                </div>
                <button
                  onClick={() => setActiveLead(null)}
                  className="p-2 rounded-full border border-white/10 hover:border-white/30 text-[#DDE4D9] hover:text-[#F6F4ED] transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Contact & Demographics */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
                <div className="p-3 rounded-2xl bg-white/5 border border-white/5">
                  <span className="text-[#DDE4D9]/60 block font-mono">Country</span>
                  <span className="font-semibold text-[#F6F4ED] mt-0.5 block">{activeLead.country}</span>
                </div>
                <div className="p-3 rounded-2xl bg-white/5 border border-white/5">
                  <span className="text-[#DDE4D9]/60 block font-mono">WhatsApp</span>
                  <span className="font-semibold text-[#F6F4ED] mt-0.5 block">
                    {activeLead.whatsapp_number || "Not provided"}
                  </span>
                </div>
                <div className="p-3 rounded-2xl bg-white/5 border border-white/5">
                  <span className="text-[#DDE4D9]/60 block font-mono">Beta Testing</span>
                  <span className="font-semibold text-[#E8D6AC] mt-0.5 block">
                    {activeLead.beta_interest || "Interested"}
                  </span>
                </div>
              </div>

              {/* Question 1: Challenges */}
              <div className="space-y-2">
                <span className="text-xs font-mono uppercase tracking-wider text-[#E8D6AC] font-semibold block">
                  Q1: Biggest Challenges
                </span>
                <div className="flex flex-wrap gap-2">
                  {activeLead.challenges && activeLead.challenges.length > 0 ? (
                    activeLead.challenges.map((c) => (
                      <span
                        key={c}
                        className="px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 text-xs text-[#DDE4D9]"
                      >
                        {c}
                      </span>
                    ))
                  ) : (
                    <span className="text-xs text-[#DDE4D9]/50 italic">None selected</span>
                  )}
                </div>
                {activeLead.other_challenge && (
                  <p className="text-xs text-[#E8D6AC] font-mono mt-1 pl-1">
                    Other specified: &ldquo;{activeLead.other_challenge}&rdquo;
                  </p>
                )}
              </div>

              {/* Question 2: Desired Solutions */}
              <div className="space-y-2">
                <span className="text-xs font-mono uppercase tracking-wider text-[#E8D6AC] font-semibold block">
                  Q2: Desired Solutions / What Would Help
                </span>
                <div className="flex flex-wrap gap-2">
                  {(activeLead.desired_solutions || activeLead.features || []).map((s) => (
                    <span
                      key={s}
                      className="px-3 py-1.5 rounded-xl bg-[#B79A62]/15 border border-[#B79A62]/30 text-xs text-[#E8D6AC]"
                    >
                      {s}
                    </span>
                  ))}
                </div>
                {activeLead.user_suggestions && (
                  <p className="text-xs text-[#DDE4D9] bg-white/5 p-3 rounded-2xl border border-white/5 italic">
                    User Suggestion: &ldquo;{activeLead.user_suggestions}&rdquo;
                  </p>
                )}
              </div>

              {/* Question 3: Preferred Product Type */}
              <div className="space-y-1">
                <span className="text-xs font-mono uppercase tracking-wider text-[#E8D6AC] font-semibold block">
                  Q3: Preferred Digital Experience Direction
                </span>
                <p className="text-sm font-semibold text-[#F6F4ED]">
                  {activeLead.preferred_product_type || activeLead.primary_feature || "Not specified"}
                </p>
              </div>

              {/* Question 4: Beta Interest */}
              <div className="space-y-1">
                <span className="text-xs font-mono uppercase tracking-wider text-[#E8D6AC] font-semibold block">
                  Q4: Beta Testing Participation
                </span>
                <p className="text-sm font-semibold text-[#E8D6AC]">
                  {activeLead.beta_interest || "Yes, I am interested"}
                </p>
              </div>

              {/* Attribution Meta */}
              {activeLead.attribution && (
                <div className="p-3.5 rounded-2xl bg-black/40 border border-white/5 text-[11px] font-mono text-[#DDE4D9]/60 space-y-1">
                  <span className="text-[#E8D6AC] block font-semibold">Attribution Metadata:</span>
                  <div>Source: {activeLead.attribution.utm_source || "direct"}</div>
                  <div>Medium: {activeLead.attribution.utm_medium || "none"}</div>
                  <div>Campaign: {activeLead.attribution.utm_campaign || "none"}</div>
                  {activeLead.attribution.referrer && (
                    <div>Referrer: {activeLead.attribution.referrer}</div>
                  )}
                </div>
              )}

              <div className="pt-2 flex justify-end">
                <button
                  onClick={() => setActiveLead(null)}
                  className="px-6 py-2.5 rounded-full bg-[#B79A62] text-[#0A1410] font-bold text-xs uppercase tracking-wider hover:bg-[#D8C296] transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
