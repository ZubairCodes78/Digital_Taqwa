"use client";

import { useEffect, useState, useCallback } from "react";
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
  XCircle,
  TrendingUp,
  MessageSquare,
  Award,
  PieChart,
  BarChart2,
  Filter,
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
  const [selectedVerified, setSelectedVerified] = useState<string>("all");
  const [suggestionsSearch, setSuggestionsSearch] = useState<string>("");

  const [activeLead, setActiveLead] = useState<WaitlistUserRecord | null>(null);
  const [activeTab, setActiveTab] = useState<
    "overview" | "problems" | "solutions" | "suggestions" | "campaigns" | "leads"
  >("overview");

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

      // Build query params
      const params = new URLSearchParams({
        page: targetPage.toString(),
        limit: "15",
      });
      if (searchTerm) params.append("search", searchTerm);
      if (selectedCountry !== "all") params.append("country", selectedCountry);
      if (selectedVerified !== "all") params.append("verified", selectedVerified);

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
  }, [page, router, searchTerm, selectedCountry, selectedVerified]);

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

  return (
    <div className="min-h-screen bg-[#F6F4ED] text-charcoal">
      {/* Top Header Bar */}
      <header className="border-b border-charcoal/10 bg-white/95 sticky top-0 z-40 backdrop-blur-md shadow-sm">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Link href="/" className="flex items-center space-x-2.5">
              <div className="relative w-7 h-7 shrink-0">
                <Image
                  src="/logo-icon.png"
                  alt="Digital Taqwa"
                  fill
                  sizes="28px"
                  className="object-contain"
                />
              </div>
              <span className="font-serif text-xl tracking-wider text-forest font-bold">
                Digital Taqwa
              </span>
            </Link>
            <span className="text-[10px] uppercase tracking-widest text-[#D6B56D] px-2.5 py-0.5 rounded-full bg-forest font-mono font-medium">
              Research Dashboard
            </span>
          </div>

          <div className="flex items-center space-x-3 text-xs">
            <button
              onClick={() => loadData(page)}
              className="p-2 border border-charcoal/15 rounded-xl text-charcoal-muted hover:text-forest transition-colors bg-white shadow-sm"
              title="Refresh Data"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
            </button>
            <button
              onClick={handleExportCSV}
              className="px-4 py-2 rounded-xl bg-forest text-ivory font-semibold uppercase tracking-wider flex items-center space-x-1.5 transition-colors hover:bg-forest-light shadow-sm"
            >
              <Download className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Export Research CSV</span>
            </button>
            <button
              onClick={handleLogout}
              className="px-3 py-2 border border-charcoal/15 rounded-xl text-charcoal-muted hover:text-red-600 uppercase tracking-wider flex items-center space-x-1.5 transition-colors bg-white shadow-sm"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>

        {/* Tab Navigation Bar */}
        <div className="max-w-7xl mx-auto px-6 sm:px-8 flex space-x-6 sm:space-x-8 text-xs uppercase tracking-wider border-t border-charcoal/10 font-mono font-medium overflow-x-auto">
          <button
            onClick={() => setActiveTab("overview")}
            className={`py-3.5 border-b-2 transition-colors whitespace-nowrap ${
              activeTab === "overview"
                ? "border-forest text-forest font-bold"
                : "border-transparent text-charcoal-muted hover:text-charcoal"
            }`}
          >
            01. Audience Overview
          </button>
          <button
            onClick={() => setActiveTab("problems")}
            className={`py-3.5 border-b-2 transition-colors whitespace-nowrap ${
              activeTab === "problems"
                ? "border-forest text-forest font-bold"
                : "border-transparent text-charcoal-muted hover:text-charcoal"
            }`}
          >
            02. Problem Analysis
          </button>
          <button
            onClick={() => setActiveTab("solutions")}
            className={`py-3.5 border-b-2 transition-colors whitespace-nowrap ${
              activeTab === "solutions"
                ? "border-forest text-forest font-bold"
                : "border-transparent text-charcoal-muted hover:text-charcoal"
            }`}
          >
            03. Desired Product
          </button>
          <button
            onClick={() => setActiveTab("suggestions")}
            className={`py-3.5 border-b-2 transition-colors whitespace-nowrap ${
              activeTab === "suggestions"
                ? "border-forest text-forest font-bold"
                : "border-transparent text-charcoal-muted hover:text-charcoal"
            }`}
          >
            04. User Suggestions ({stats?.recentSuggestions?.length || 0})
          </button>
          <button
            onClick={() => setActiveTab("campaigns")}
            className={`py-3.5 border-b-2 transition-colors whitespace-nowrap ${
              activeTab === "campaigns"
                ? "border-forest text-forest font-bold"
                : "border-transparent text-charcoal-muted hover:text-charcoal"
            }`}
          >
            05. Campaigns
          </button>
          <button
            onClick={() => setActiveTab("leads")}
            className={`py-3.5 border-b-2 transition-colors whitespace-nowrap ${
              activeTab === "leads"
                ? "border-forest text-forest font-bold"
                : "border-transparent text-charcoal-muted hover:text-charcoal"
            }`}
          >
            06. Survey Directory ({totalLeads})
          </button>
        </div>
      </header>

      {/* Main Admin Content Body */}
      <main className="max-w-7xl mx-auto px-6 sm:px-8 py-8">
        {/* ========================================================
            TAB 1: AUDIENCE OVERVIEW
        ======================================================== */}
        {activeTab === "overview" && stats && (
          <div className="space-y-8 animate-in fade-in duration-200">
            {/* Top KPI Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              <div className="bg-white rounded-3xl p-6 border border-charcoal/10 shadow-sm">
                <div className="flex items-center justify-between text-charcoal-muted text-xs uppercase tracking-wider mb-2 font-mono">
                  <span>Total Submissions</span>
                  <Users className="w-4 h-4 text-forest" />
                </div>
                <div className="font-serif text-3xl sm:text-4xl font-bold text-forest">
                  {stats.totalSignups}
                </div>
                <div className="text-xs text-charcoal-subtle mt-1 font-light">
                  Market survey participants
                </div>
              </div>

              <div className="bg-white rounded-3xl p-6 border border-charcoal/10 shadow-sm">
                <div className="flex items-center justify-between text-charcoal-muted text-xs uppercase tracking-wider mb-2 font-mono">
                  <span>Verified Emails</span>
                  <CheckCircle className="w-4 h-4 text-emerald-600" />
                </div>
                <div className="font-serif text-3xl sm:text-4xl font-bold text-emerald-700">
                  {stats.verifiedEmails}
                </div>
                <div className="text-xs text-emerald-700 mt-1 font-medium font-mono">
                  {stats.verificationRate}% confirmation rate
                </div>
              </div>

              <div className="bg-white rounded-3xl p-6 border border-charcoal/10 shadow-sm">
                <div className="flex items-center justify-between text-charcoal-muted text-xs uppercase tracking-wider mb-2 font-mono">
                  <span>Beta Testers</span>
                  <Award className="w-4 h-4 text-[#D6B56D]" />
                </div>
                <div className="font-serif text-3xl sm:text-4xl font-bold text-[#B79A62]">
                  {stats.betaInterestDistribution?.["Yes, I am interested"] || 0}
                </div>
                <div className="text-xs text-charcoal-subtle mt-1 font-light">
                  Ready for future testing
                </div>
              </div>

              <div className="bg-white rounded-3xl p-6 border border-charcoal/10 shadow-sm">
                <div className="flex items-center justify-between text-charcoal-muted text-xs uppercase tracking-wider mb-2 font-mono">
                  <span>Organic / Paid</span>
                  <TrendingUp className="w-4 h-4 text-forest" />
                </div>
                <div className="font-serif text-2xl sm:text-3xl font-bold text-charcoal">
                  {stats.organicSignups} <span className="text-sm font-sans text-charcoal-subtle font-normal">/</span> {stats.paidSignups}
                </div>
                <div className="text-xs text-charcoal-subtle mt-1 font-light">
                  Attribution split
                </div>
              </div>
            </div>

            {/* Geographical Distribution & Beta Interest */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Country Breakdown */}
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-charcoal/10 shadow-sm">
                <div className="text-xs uppercase tracking-widest text-[#B79A62] font-mono font-semibold mb-4">
                  Geographical Distribution
                </div>
                <div className="space-y-4">
                  {Object.entries(stats.countryDistribution || {})
                    .sort((a, b) => b[1] - a[1])
                    .map(([country, count]) => {
                      const pct = Math.round((count / (stats.totalSignups || 1)) * 100);
                      return (
                        <div key={country}>
                          <div className="flex items-center justify-between text-xs mb-1 font-mono">
                            <span className="font-semibold text-charcoal">{country}</span>
                            <span className="text-charcoal-muted">{count} ({pct}%)</span>
                          </div>
                          <div className="h-2 w-full bg-[#EFECE4] rounded-full overflow-hidden">
                            <div className="h-full bg-forest rounded-full" style={{ width: `${pct}%` }} />
                          </div>
                        </div>
                      );
                    })}
                </div>
              </div>

              {/* Beta Testing Interest Breakdown */}
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-charcoal/10 shadow-sm">
                <div className="text-xs uppercase tracking-widest text-[#B79A62] font-mono font-semibold mb-4">
                  Future Beta Testing Interest
                </div>
                <div className="space-y-4">
                  {Object.entries(stats.betaInterestDistribution || {})
                    .sort((a, b) => b[1] - a[1])
                    .map(([interest, count]) => {
                      const pct = Math.round((count / (stats.totalSignups || 1)) * 100);
                      return (
                        <div key={interest}>
                          <div className="flex items-center justify-between text-xs mb-1 font-mono">
                            <span className="font-semibold text-charcoal">{interest}</span>
                            <span className="text-charcoal-muted">{count} ({pct}%)</span>
                          </div>
                          <div className="h-2 w-full bg-[#EFECE4] rounded-full overflow-hidden">
                            <div className="h-full bg-[#D6B56D] rounded-full" style={{ width: `${pct}%` }} />
                          </div>
                        </div>
                      );
                    })}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================
            TAB 2: PROBLEM ANALYSIS
        ======================================================== */}
        {activeTab === "problems" && stats && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-charcoal/10 shadow-sm">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 mb-6 border-b border-charcoal/10 gap-2">
                <div>
                  <h3 className="font-serif text-2xl font-bold text-forest">
                    Reported Daily Islamic Challenges
                  </h3>
                  <p className="text-xs text-charcoal-muted font-light mt-0.5">
                    Percentage of surveyed respondents experiencing each obstacle in their daily routine.
                  </p>
                </div>
                <span className="text-xs font-mono text-gold-dark font-semibold">
                  Sample Size: {stats.totalSignups}
                </span>
              </div>

              <div className="space-y-5">
                {Object.entries(stats.challengeCounts || {})
                  .sort((a, b) => b[1] - a[1])
                  .map(([challenge, count]) => {
                    const pct = Math.round((count / (stats.totalSignups || 1)) * 100);
                    return (
                      <div key={challenge} className="p-4 rounded-2xl bg-[#FAF9F5] border border-charcoal/5">
                        <div className="flex items-center justify-between text-xs sm:text-sm mb-1.5">
                          <span className="font-semibold text-charcoal font-serif">{challenge}</span>
                          <span className="font-mono text-xs text-forest font-bold">{count} votes ({pct}%)</span>
                        </div>
                        <div className="h-2.5 w-full bg-[#EFECE4] rounded-full overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-forest to-gold-dark rounded-full"
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
              </div>
            </div>
          </div>
        )}

        {/* ========================================================
            TAB 3: DESIRED PRODUCT ANALYSIS
        ======================================================== */}
        {activeTab === "solutions" && stats && (
          <div className="space-y-8 animate-in fade-in duration-200">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Desired Solutions / Features */}
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-charcoal/10 shadow-sm">
                <div className="text-xs uppercase tracking-widest text-[#B79A62] font-mono font-semibold mb-4">
                  Most Requested Capabilities
                </div>
                <div className="space-y-4">
                  {Object.entries(stats.solutionInterests || stats.featureInterests || {})
                    .sort((a, b) => b[1] - a[1])
                    .map(([solution, count]) => {
                      const pct = Math.round((count / (stats.totalSignups || 1)) * 100);
                      return (
                        <div key={solution}>
                          <div className="flex items-center justify-between text-xs mb-1 font-mono">
                            <span className="font-semibold text-charcoal truncate pr-2">{solution}</span>
                            <span className="text-charcoal-muted">{count} ({pct}%)</span>
                          </div>
                          <div className="h-2 w-full bg-[#EFECE4] rounded-full overflow-hidden">
                            <div className="h-full bg-forest rounded-full" style={{ width: `${pct}%` }} />
                          </div>
                        </div>
                      );
                    })}
                </div>
              </div>

              {/* Preferred Product Format */}
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-charcoal/10 shadow-sm">
                <div className="text-xs uppercase tracking-widest text-[#B79A62] font-mono font-semibold mb-4">
                  Preferred Product Experience Format
                </div>
                <div className="space-y-4">
                  {Object.entries(stats.productTypeDistribution || stats.primaryFeatures || {})
                    .sort((a, b) => b[1] - a[1])
                    .map(([format, count]) => {
                      const pct = Math.round((count / (stats.totalSignups || 1)) * 100);
                      return (
                        <div key={format}>
                          <div className="flex items-center justify-between text-xs mb-1 font-mono">
                            <span className="font-semibold text-charcoal truncate pr-2">{format}</span>
                            <span className="text-charcoal-muted">{count} ({pct}%)</span>
                          </div>
                          <div className="h-2 w-full bg-[#EFECE4] rounded-full overflow-hidden">
                            <div className="h-full bg-gold-dark rounded-full" style={{ width: `${pct}%` }} />
                          </div>
                        </div>
                      );
                    })}
                </div>
              </div>
            </div>

            {/* Usage Priorities & Frequency */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Priorities Driving Usage */}
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-charcoal/10 shadow-sm">
                <div className="text-xs uppercase tracking-widest text-[#B79A62] font-mono font-semibold mb-4">
                  Priorities That Would Drive Regular Usage
                </div>
                <div className="space-y-4">
                  {Object.entries(stats.usagePriorityCounts || {})
                    .sort((a, b) => b[1] - a[1])
                    .map(([prio, count]) => {
                      const pct = Math.round((count / (stats.totalSignups || 1)) * 100);
                      return (
                        <div key={prio}>
                          <div className="flex items-center justify-between text-xs mb-1 font-mono">
                            <span className="font-semibold text-charcoal">{prio}</span>
                            <span className="text-charcoal-muted">{count} ({pct}%)</span>
                          </div>
                          <div className="h-2 w-full bg-[#EFECE4] rounded-full overflow-hidden">
                            <div className="h-full bg-forest-light rounded-full" style={{ width: `${pct}%` }} />
                          </div>
                        </div>
                      );
                    })}
                </div>
              </div>

              {/* Usage Frequency */}
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-charcoal/10 shadow-sm">
                <div className="text-xs uppercase tracking-widest text-[#B79A62] font-mono font-semibold mb-4">
                  Expected Realistic Usage Frequency
                </div>
                <div className="space-y-4">
                  {Object.entries(stats.usageFrequencyDistribution || {})
                    .sort((a, b) => b[1] - a[1])
                    .map(([freq, count]) => {
                      const pct = Math.round((count / (stats.totalSignups || 1)) * 100);
                      return (
                        <div key={freq}>
                          <div className="flex items-center justify-between text-xs mb-1 font-mono">
                            <span className="font-semibold text-charcoal">{freq}</span>
                            <span className="text-charcoal-muted">{count} ({pct}%)</span>
                          </div>
                          <div className="h-2 w-full bg-[#EFECE4] rounded-full overflow-hidden">
                            <div className="h-full bg-[#D6B56D] rounded-full" style={{ width: `${pct}%` }} />
                          </div>
                        </div>
                      );
                    })}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================
            TAB 4: USER SUGGESTIONS (OPEN-TEXT RESPONSES)
        ======================================================== */}
        {activeTab === "suggestions" && stats && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-charcoal/10 shadow-sm">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 mb-6 border-b border-charcoal/10 gap-3">
                <div>
                  <h3 className="font-serif text-2xl font-bold text-forest">
                    Community Open-Text Ideas &amp; Suggestions
                  </h3>
                  <p className="text-xs text-charcoal-muted font-light mt-0.5">
                    Unfiltered qualitative responses to &ldquo;Tell us what you would like to see&rdquo;.
                  </p>
                </div>
                <div className="relative">
                  <input
                    type="text"
                    value={suggestionsSearch}
                    onChange={(e) => setSuggestionsSearch(e.target.value)}
                    placeholder="Search responses..."
                    className="pl-8 pr-3 py-1.5 rounded-xl border border-charcoal/15 text-xs outline-none focus:border-forest w-56 font-mono"
                  />
                  <Search className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-charcoal-subtle" />
                </div>
              </div>

              {(!stats.recentSuggestions || stats.recentSuggestions.length === 0) ? (
                <div className="py-12 text-center text-charcoal-muted text-xs font-mono">
                  No open-text suggestions submitted yet. New suggestions appear here automatically.
                </div>
              ) : (
                <div className="space-y-3">
                  {stats.recentSuggestions
                    .filter((s) =>
                      suggestionsSearch
                        ? s.suggestion.toLowerCase().includes(suggestionsSearch.toLowerCase()) ||
                          s.country.toLowerCase().includes(suggestionsSearch.toLowerCase())
                        : true
                    )
                    .map((item, idx) => (
                      <div
                        key={idx}
                        className="p-4 rounded-2xl bg-[#FAF9F5] border border-charcoal/10 space-y-1.5"
                      >
                        <p className="text-sm font-serif italic text-forest leading-relaxed">
                          &ldquo;{item.suggestion}&rdquo;
                        </p>
                        <div className="flex items-center justify-between text-[11px] font-mono text-charcoal-subtle pt-1 border-t border-charcoal/5">
                          <span>{item.email} &bull; {item.country}</span>
                          <span>{formatDate(item.date)}</span>
                        </div>
                      </div>
                    ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* ========================================================
            TAB 5: CAMPAIGNS & UTM ATTRIBUTION
        ======================================================== */}
        {activeTab === "campaigns" && stats && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-charcoal/10 shadow-sm">
              <div className="pb-4 mb-6 border-b border-charcoal/10">
                <h3 className="font-serif text-2xl font-bold text-forest">
                  Acquisition Channel Performance
                </h3>
                <p className="text-xs text-charcoal-muted font-light mt-0.5">
                  Attribution breakdown across Instagram, YouTube, TikTok, and direct referrals.
                </p>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left font-mono">
                  <thead>
                    <tr className="border-b border-charcoal/10 text-charcoal-subtle uppercase">
                      <th className="py-3 px-4">Source</th>
                      <th className="py-3 px-4">Campaign</th>
                      <th className="py-3 px-4 text-center">Submissions</th>
                      <th className="py-3 px-4 text-center">Verified</th>
                      <th className="py-3 px-4 text-right">Conversion Share</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-charcoal/5">
                    {stats.campaignPerformance.map((c, i) => {
                      const share = Math.round((c.count / (stats.totalSignups || 1)) * 100);
                      return (
                        <tr key={i} className="hover:bg-[#FAF9F5]">
                          <td className="py-3 px-4 font-bold text-forest uppercase">{c.source}</td>
                          <td className="py-3 px-4 text-charcoal">{c.campaign}</td>
                          <td className="py-3 px-4 text-center font-bold">{c.count}</td>
                          <td className="py-3 px-4 text-center text-emerald-700">{c.verifiedCount}</td>
                          <td className="py-3 px-4 text-right text-charcoal-muted">{share}%</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================
            TAB 6: SURVEY RESPONSES & LEADS DIRECTORY
        ======================================================== */}
        {activeTab === "leads" && (
          <div className="space-y-6 animate-in fade-in duration-200">
            {/* Filter Bar */}
            <div className="bg-white rounded-2xl p-4 border border-charcoal/10 shadow-sm flex flex-col md:flex-row gap-4 items-center justify-between">
              <div className="relative w-full md:w-80">
                <input
                  type="text"
                  placeholder="Search by name, email, referral code..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 rounded-xl border border-charcoal/15 text-xs outline-none focus:border-forest bg-[#FAF9F5]"
                />
                <Search className="w-4 h-4 text-charcoal-subtle absolute left-3 top-2.5" />
              </div>

              <div className="flex items-center space-x-3 w-full md:w-auto">
                <select
                  value={selectedCountry}
                  onChange={(e) => setSelectedCountry(e.target.value)}
                  className="px-3 py-2 rounded-xl border border-charcoal/15 text-xs text-charcoal bg-[#FAF9F5] outline-none"
                >
                  <option value="all">All Countries</option>
                  <option value="Pakistan">Pakistan</option>
                  <option value="India">India</option>
                  <option value="United Kingdom">United Kingdom</option>
                  <option value="United States">United States</option>
                  <option value="Other">Other</option>
                </select>

                <select
                  value={selectedVerified}
                  onChange={(e) => setSelectedVerified(e.target.value)}
                  className="px-3 py-2 rounded-xl border border-charcoal/15 text-xs text-charcoal bg-[#FAF9F5] outline-none"
                >
                  <option value="all">Verification Status</option>
                  <option value="true">Verified Only</option>
                  <option value="false">Unverified</option>
                </select>

                <button
                  onClick={() => loadData(1)}
                  className="px-4 py-2 rounded-xl bg-forest text-ivory text-xs font-semibold uppercase tracking-wider hover:bg-forest-light"
                >
                  Filter
                </button>
              </div>
            </div>

            {/* Table */}
            <div className="bg-white rounded-3xl border border-charcoal/10 shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left font-mono">
                  <thead>
                    <tr className="border-b border-charcoal/10 text-charcoal-subtle uppercase bg-[#FAF9F5]">
                      <th className="py-3.5 px-4">Member</th>
                      <th className="py-3.5 px-4">Country</th>
                      <th className="py-3.5 px-4">Preferred Format</th>
                      <th className="py-3.5 px-4">Beta Interest</th>
                      <th className="py-3.5 px-4">Source</th>
                      <th className="py-3.5 px-4 text-center">Status</th>
                      <th className="py-3.5 px-4">Date</th>
                      <th className="py-3.5 px-4 text-center">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-charcoal/5">
                    {leads.length === 0 ? (
                      <tr>
                        <td colSpan={8} className="py-12 text-center text-charcoal-muted">
                          No matching research responses found.
                        </td>
                      </tr>
                    ) : (
                      leads.map((lead) => (
                        <tr key={lead.id} className="hover:bg-[#FAF9F5] transition-colors">
                          <td className="py-3 px-4">
                            <span className="font-bold text-forest block">{lead.name || "Anonymous"}</span>
                            <span className="text-charcoal-muted text-[11px]">{lead.email}</span>
                          </td>
                          <td className="py-3 px-4">{lead.country}</td>
                          <td className="py-3 px-4 max-w-[180px] truncate" title={lead.preferred_product_type || lead.primary_feature}>
                            {lead.preferred_product_type || lead.primary_feature || "General"}
                          </td>
                          <td className="py-3 px-4 text-charcoal-subtle text-[11px]">
                            {lead.beta_interest || "Yes"}
                          </td>
                          <td className="py-3 px-4 uppercase text-charcoal-subtle">
                            {lead.attribution?.utm_source || "direct"}
                          </td>
                          <td className="py-3 px-4 text-center">
                            {lead.email_verified ? (
                              <span className="text-emerald-700 font-bold">[VERIFIED]</span>
                            ) : (
                              <span className="text-charcoal-subtle">[UNVERIFIED]</span>
                            )}
                          </td>
                          <td className="py-3 px-4 text-charcoal-subtle text-[11px]">
                            {formatDate(lead.created_at)}
                          </td>
                          <td className="py-3 px-4 text-center">
                            <button
                              onClick={() => setActiveLead(lead)}
                              className="px-2.5 py-1 rounded-lg border border-charcoal/15 hover:border-forest hover:text-forest text-charcoal-muted transition-colors shadow-sm"
                              title="View Full Survey Responses"
                            >
                              <Eye className="w-3.5 h-3.5" />
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              <div className="p-4 border-t border-charcoal/10 flex items-center justify-between text-xs text-charcoal-subtle font-mono">
                <span>PAGE {page} OF {totalPages} &bull; TOTAL {totalLeads} RESPONSES</span>
                <div className="flex items-center space-x-2">
                  <button
                    disabled={page <= 1}
                    onClick={() => loadData(page - 1)}
                    className="p-1 rounded-lg border border-charcoal/15 text-charcoal-muted hover:text-charcoal disabled:opacity-30"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button
                    disabled={page >= totalPages}
                    onClick={() => loadData(page + 1)}
                    className="p-1 rounded-lg border border-charcoal/15 text-charcoal-muted hover:text-charcoal disabled:opacity-30"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* INDIVIDUAL SURVEY RESPONSE DETAIL MODAL */}
      {activeLead && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl border border-charcoal/15 max-w-xl w-full p-6 sm:p-8 relative text-xs shadow-2xl max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setActiveLead(null)}
              className="absolute top-5 right-5 text-charcoal-subtle hover:text-charcoal"
              aria-label="Close survey detail"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="border-b border-charcoal/10 pb-4 mb-6">
              <span className="text-gold-dark font-mono font-bold uppercase block mb-1">
                [ RESEARCH SURVEY RECORD // {activeLead.referral_code} ]
              </span>
              <div className="font-serif text-2xl font-bold text-forest">
                {activeLead.name || "Anonymous Community Member"}
              </div>
              <div className="text-charcoal-muted font-mono">{activeLead.email}</div>
            </div>

            <div className="space-y-4 font-mono">
              <div className="grid grid-cols-2 gap-2 p-3.5 rounded-2xl border border-charcoal/10 bg-[#FAF9F5]">
                <div>Country: <span className="text-charcoal font-bold">{activeLead.country}</span></div>
                <div>Status: <span className={activeLead.email_verified ? "text-emerald-700 font-bold" : "text-charcoal-subtle"}>{activeLead.email_verified ? "Verified" : "Unverified"}</span></div>
                <div>WhatsApp: <span className="text-charcoal">{activeLead.whatsapp_number || "None"}</span></div>
                <div>Beta Interest: <span className="text-forest font-bold">{activeLead.beta_interest || "Yes"}</span></div>
              </div>

              {/* Preferred Format */}
              <div>
                <div className="text-forest font-bold mb-1 uppercase">Preferred Product Format:</div>
                <div className="p-3 rounded-xl border border-forest/20 text-forest font-serif text-base font-bold bg-forest/5">
                  {activeLead.preferred_product_type || activeLead.primary_feature || "Not specified"}
                </div>
              </div>

              {/* Desired Solutions */}
              <div>
                <div className="text-charcoal-subtle mb-1 uppercase font-semibold">
                  Desired Capabilities ({activeLead.desired_solutions?.length || activeLead.features?.length || 0}):
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {(activeLead.desired_solutions || activeLead.features || []).map((s) => (
                    <span key={s} className="px-2.5 py-1 rounded-lg border border-charcoal/10 text-charcoal text-[11px] bg-[#FAF9F5]">
                      {s}
                    </span>
                  ))}
                </div>
              </div>

              {/* Challenges */}
              <div>
                <div className="text-charcoal-subtle mb-1 uppercase font-semibold">
                  Reported Challenges ({activeLead.challenges?.length || 0}):
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {(activeLead.challenges || []).map((c) => (
                    <span key={c} className="px-2.5 py-1 rounded-lg border border-charcoal/10 text-charcoal-muted text-[11px] bg-[#FAF9F5]">
                      {c}
                    </span>
                  ))}
                  {activeLead.other_challenge && (
                    <span className="px-2.5 py-1 rounded-lg border border-amber-300 text-amber-900 text-[11px] bg-amber-50">
                      Other: &ldquo;{activeLead.other_challenge}&rdquo;
                    </span>
                  )}
                </div>
              </div>

              {/* Open Text Suggestion */}
              {activeLead.user_suggestions && (
                <div className="p-3.5 rounded-2xl border border-gold-dark/30 bg-[#FAF7F0]">
                  <div className="text-gold-dark font-bold uppercase mb-1">Qualitative Suggestion:</div>
                  <p className="font-serif italic text-sm text-forest leading-relaxed">
                    &ldquo;{activeLead.user_suggestions}&rdquo;
                  </p>
                </div>
              )}

              {/* Usage Priorities & Frequency */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="p-3 rounded-xl border border-charcoal/10 bg-[#FAF9F5]">
                  <div className="text-charcoal-subtle uppercase mb-1 font-bold">Usage Priorities:</div>
                  <div className="text-xs text-charcoal">
                    {(activeLead.usage_priorities || []).join(", ") || "Standard"}
                  </div>
                </div>

                <div className="p-3 rounded-xl border border-charcoal/10 bg-[#FAF9F5]">
                  <div className="text-charcoal-subtle uppercase mb-1 font-bold">Expected Frequency:</div>
                  <div className="text-xs text-charcoal">
                    {activeLead.expected_usage_frequency || "Not specified"}
                  </div>
                </div>
              </div>

              {/* Attribution */}
              <div className="p-3 rounded-xl border border-charcoal/10 bg-[#FAF9F5]">
                <div className="text-charcoal-subtle uppercase mb-1 font-bold">Campaign Attribution:</div>
                <div>Source: <span className="text-charcoal">{activeLead.attribution?.utm_source || "direct"}</span></div>
                <div>Campaign: <span className="text-charcoal">{activeLead.attribution?.utm_campaign || "none"}</span></div>
                <div>Medium: <span className="text-charcoal">{activeLead.attribution?.utm_medium || "none"}</span></div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-charcoal/10 flex justify-end font-mono">
              <button
                onClick={() => setActiveLead(null)}
                className="px-5 py-2 rounded-full border border-charcoal/20 text-charcoal-muted hover:text-charcoal uppercase text-xs"
              >
                Close Record
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
