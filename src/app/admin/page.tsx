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
  ExternalLink,
  MessageSquare,
  Sparkles,
  Quote,
  ShieldCheck,
  Compass,
  Sliders,
  Database,
  Lock,
  Calendar,
  CheckCircle2,
} from "lucide-react";
import { AdminStats, WaitlistUserRecord } from "@/types";
import { formatDate } from "@/lib/utils";

type AdminTab = "overview" | "responses" | "insights" | "settings";

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

  // Active user detail drawer / modal
  const [activeLead, setActiveLead] = useState<WaitlistUserRecord | null>(null);

  // 4 Core Navigation Tabs
  const [activeTab, setActiveTab] = useState<AdminTab>("overview");

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

  // Available countries from real responses
  const availableCountries = useMemo(() => {
    if (!stats?.countryDistribution) return [];
    return Object.keys(stats.countryDistribution).sort();
  }, [stats]);

  // Recent 5 leads for Overview
  const recentLeads = useMemo(() => {
    return leads.slice(0, 5);
  }, [leads]);

  return (
    <div className="min-h-screen bg-[#060D09] text-[#F6F4ED] selection:bg-[#B79A62] selection:text-[#060D09] relative overflow-x-hidden">
      {/* Subtle ambient lighting */}
      <div className="fixed top-0 left-1/4 w-[600px] h-[350px] bg-[#B79A62]/[0.03] rounded-full blur-[140px] pointer-events-none" />
      <div className="fixed bottom-0 right-1/4 w-[500px] h-[350px] bg-[#142A1E]/30 rounded-full blur-[140px] pointer-events-none" />

      {/* Header Bar */}
      <header className="border-b border-white/[0.06] bg-[#0A140E]/80 backdrop-blur-xl sticky top-0 z-30">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          {/* Brand */}
          <div className="flex items-center space-x-3">
            <div className="relative w-8 h-8 rounded-lg overflow-hidden border border-[#B79A62]/30 bg-[#060D09] p-0.5">
              <Image
                src="/barakah-habits-logo.jpg"
                alt="Digital Taqwa"
                fill
                sizes="32px"
                className="object-cover rounded-md"
              />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-display font-medium text-sm sm:text-base text-[#F6F4ED] tracking-wide">
                  DIGITAL TAQWA
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-white/[0.04] text-[#E8D6AC] border border-[#B79A62]/25">
                  Research
                </span>
              </div>
            </div>
          </div>

          {/* Quick Header Actions */}
          <div className="flex items-center space-x-2">
            <button
              onClick={() => loadData(page)}
              disabled={loading}
              title="Refresh Data"
              className="p-2 rounded-xl text-[#DDE4D9]/70 hover:text-[#E8D6AC] hover:bg-white/[0.04] transition-colors border border-transparent hover:border-white/[0.08]"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
            </button>

            <Link
              href="/"
              target="_blank"
              className="px-3 py-1.5 rounded-xl border border-white/[0.08] text-[#DDE4D9]/80 hover:text-[#F6F4ED] hover:bg-white/[0.04] text-xs font-mono transition-colors inline-flex items-center space-x-1.5"
            >
              <span>Live Site</span>
              <ExternalLink className="w-3 h-3 text-[#B79A62]" />
            </Link>

            <button
              onClick={handleLogout}
              title="Sign Out"
              className="p-2 rounded-xl text-red-300/80 hover:text-red-200 hover:bg-red-950/30 transition-colors"
            >
              <LogOut className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8 space-y-8">
        {/* Navigation Tabs (Overview, Responses, Research Insights, Settings) */}
        <div className="flex items-center space-x-1 sm:space-x-2 border-b border-white/[0.06] pb-3 overflow-x-auto scrollbar-none">
          <button
            onClick={() => setActiveTab("overview")}
            className={`px-4 py-2 rounded-xl text-xs font-mono tracking-wider uppercase transition-all flex items-center space-x-2 shrink-0 ${
              activeTab === "overview"
                ? "bg-[#B79A62]/15 text-[#E8D6AC] border border-[#B79A62]/35 shadow-[0_2px_12px_rgba(183,154,98,0.1)]"
                : "text-[#DDE4D9]/60 hover:text-[#F6F4ED] hover:bg-white/[0.02]"
            }`}
          >
            <Compass className="w-3.5 h-3.5" />
            <span>Overview</span>
          </button>

          <button
            onClick={() => setActiveTab("responses")}
            className={`px-4 py-2 rounded-xl text-xs font-mono tracking-wider uppercase transition-all flex items-center space-x-2 shrink-0 ${
              activeTab === "responses"
                ? "bg-[#B79A62]/15 text-[#E8D6AC] border border-[#B79A62]/35 shadow-[0_2px_12px_rgba(183,154,98,0.1)]"
                : "text-[#DDE4D9]/60 hover:text-[#F6F4ED] hover:bg-white/[0.02]"
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>Responses ({totalLeads})</span>
          </button>

          <button
            onClick={() => setActiveTab("insights")}
            className={`px-4 py-2 rounded-xl text-xs font-mono tracking-wider uppercase transition-all flex items-center space-x-2 shrink-0 ${
              activeTab === "insights"
                ? "bg-[#B79A62]/15 text-[#E8D6AC] border border-[#B79A62]/35 shadow-[0_2px_12px_rgba(183,154,98,0.1)]"
                : "text-[#DDE4D9]/60 hover:text-[#F6F4ED] hover:bg-white/[0.02]"
            }`}
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>Research Insights</span>
          </button>

          <button
            onClick={() => setActiveTab("settings")}
            className={`px-4 py-2 rounded-xl text-xs font-mono tracking-wider uppercase transition-all flex items-center space-x-2 shrink-0 ${
              activeTab === "settings"
                ? "bg-[#B79A62]/15 text-[#E8D6AC] border border-[#B79A62]/35 shadow-[0_2px_12px_rgba(183,154,98,0.1)]"
                : "text-[#DDE4D9]/60 hover:text-[#F6F4ED] hover:bg-white/[0.02]"
            }`}
          >
            <Sliders className="w-3.5 h-3.5" />
            <span>Settings</span>
          </button>
        </div>

        {/* ========================================================
            TAB 1: OVERVIEW (Essential Real Metrics & Recent Activity)
        ======================================================== */}
        {activeTab === "overview" && (
          <div className="space-y-8 animate-in fade-in duration-200">
            {/* Essential Metrics: Restrained, Clean, Glassmorphic */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-6 rounded-2xl bg-[#0D1C14]/50 backdrop-blur-xl border border-white/[0.06] hover:border-[#B79A62]/20 transition-all">
                <span className="text-[11px] font-mono uppercase tracking-wider text-[#DDE4D9]/60 block mb-1">
                  Total Registrations
                </span>
                <div className="flex items-baseline space-x-2">
                  <span className="text-3xl sm:text-4xl font-display font-light text-[#F6F4ED]">
                    {stats?.totalSignups ?? totalLeads}
                  </span>
                  <span className="text-xs text-[#E8D6AC]/75 font-mono">Members</span>
                </div>
                <p className="text-xs text-[#DDE4D9]/50 mt-2 font-light">
                  Active database participants
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-[#0D1C14]/50 backdrop-blur-xl border border-white/[0.06] hover:border-[#B79A62]/20 transition-all">
                <span className="text-[11px] font-mono uppercase tracking-wider text-[#DDE4D9]/60 block mb-1">
                  Survey Reflections
                </span>
                <div className="flex items-baseline space-x-2">
                  <span className="text-3xl sm:text-4xl font-display font-light text-[#F6F4ED]">
                    {stats?.totalSignups ?? totalLeads}
                  </span>
                  <span className="text-xs text-emerald-400 font-mono">100% Complete</span>
                </div>
                <p className="text-xs text-[#DDE4D9]/50 mt-2 font-light">
                  Direct personal insights gathered
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-[#0D1C14]/50 backdrop-blur-xl border border-white/[0.06] hover:border-[#B79A62]/20 transition-all">
                <span className="text-[11px] font-mono uppercase tracking-wider text-[#DDE4D9]/60 block mb-1">
                  Beta Testing Interest
                </span>
                <div className="flex items-baseline space-x-2">
                  <span className="text-3xl sm:text-4xl font-display font-light text-[#F6F4ED]">
                    {stats?.betaInterestDistribution
                      ? Object.entries(stats.betaInterestDistribution)
                          .filter(([k]) => k.toLowerCase().includes("yes") || k.toLowerCase().includes("love"))
                          .reduce((acc, [, val]) => acc + val, 0)
                      : 0}
                  </span>
                  <span className="text-xs text-[#E8D6AC]/75 font-mono">Volunteers</span>
                </div>
                <p className="text-xs text-[#DDE4D9]/50 mt-2 font-light">
                  Ready to test early private concepts
                </p>
              </div>
            </div>

            {/* Recent Activity Stream */}
            <div className="rounded-2xl bg-[#0D1C14]/40 backdrop-blur-xl border border-white/[0.06] p-6 space-y-4">
              <div className="flex items-center justify-between border-b border-white/[0.06] pb-3">
                <span className="text-xs font-mono uppercase tracking-wider text-[#E8D6AC]">
                  Recent Activity Stream
                </span>
                <button
                  onClick={() => setActiveTab("responses")}
                  className="text-xs text-[#DDE4D9]/60 hover:text-[#F6F4ED] font-mono transition-colors"
                >
                  View all &rarr;
                </button>
              </div>

              {recentLeads.length === 0 ? (
                <p className="text-xs text-[#DDE4D9]/50 italic py-4">No recent activity recorded yet.</p>
              ) : (
                <div className="divide-y divide-white/[0.04]">
                  {recentLeads.map((item) => (
                    <div
                      key={item.id}
                      onClick={() => setActiveLead(item)}
                      className="py-3 flex items-center justify-between hover:bg-white/[0.02] cursor-pointer rounded-xl px-2 -mx-2 transition-colors"
                    >
                      <div className="space-y-0.5 truncate max-w-sm">
                        <div className="text-xs text-[#F6F4ED] font-medium truncate">
                          {item.name ? `${item.name} &bull; ${item.email}` : item.email}
                        </div>
                        <div className="text-[11px] text-[#DDE4D9]/50 font-mono truncate">
                          {item.preferred_product_type || item.primary_feature || "Sanctuary Member"}
                        </div>
                      </div>

                      <div className="text-right text-xs font-mono text-[#DDE4D9]/60 shrink-0">
                        <div>{item.country}</div>
                        <div className="text-[10px] text-[#DDE4D9]/40">{formatDate(item.created_at)}</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* ========================================================
            TAB 2: RESPONSES (Clean, Searchable Registry)
        ======================================================== */}
        {activeTab === "responses" && (
          <div className="space-y-6 animate-in fade-in duration-200">
            {/* Search & Filter Bar */}
            <div className="p-4 rounded-2xl bg-[#0D1C14]/40 backdrop-blur-xl border border-white/[0.06] flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="relative w-full sm:w-80">
                <Search className="w-3.5 h-3.5 text-[#DDE4D9]/40 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search by name, email, or phone..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 rounded-xl bg-black/40 border border-white/[0.08] text-xs text-[#F6F4ED] placeholder:text-[#DDE4D9]/30 outline-none focus:border-[#B79A62]/50 transition-colors"
                />
              </div>

              <div className="flex items-center space-x-2 w-full sm:w-auto">
                <span className="text-xs font-mono text-[#DDE4D9]/50">Country:</span>
                <select
                  value={selectedCountry}
                  onChange={(e) => setSelectedCountry(e.target.value)}
                  className="px-3 py-1.5 rounded-xl bg-black/40 border border-white/[0.08] text-xs text-[#F6F4ED] outline-none focus:border-[#B79A62]/50"
                >
                  <option value="all">All Locations</option>
                  {availableCountries.map((c) => (
                    <option key={c} value={c} className="bg-[#060D09]">
                      {c}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Clean Responses Table */}
            <div className="rounded-2xl bg-[#0D1C14]/40 backdrop-blur-xl border border-white/[0.06] overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="border-b border-white/[0.06] bg-black/20 font-mono text-[#DDE4D9]/60 uppercase tracking-wider text-[11px]">
                    <tr>
                      <th className="px-5 py-3.5">User</th>
                      <th className="px-5 py-3.5">Country</th>
                      <th className="px-5 py-3.5">Sanctuary Preference</th>
                      <th className="px-5 py-3.5">Beta</th>
                      <th className="px-5 py-3.5">Date</th>
                      <th className="px-5 py-3.5 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/[0.04]">
                    {loading ? (
                      <tr>
                        <td colSpan={6} className="text-center py-10 text-[#DDE4D9]/40 font-mono">
                          Loading responses...
                        </td>
                      </tr>
                    ) : leads.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="text-center py-10 text-[#DDE4D9]/40 font-mono">
                          No matching records found.
                        </td>
                      </tr>
                    ) : (
                      leads.map((lead) => (
                        <tr
                          key={lead.id}
                          className="hover:bg-white/[0.02] transition-colors group cursor-pointer"
                          onClick={() => setActiveLead(lead)}
                        >
                          <td className="px-5 py-3.5">
                            <div className="font-medium text-[#F6F4ED] truncate max-w-xs">
                              {lead.name ? `${lead.name} &bull; ${lead.email}` : lead.email}
                            </div>
                            {lead.whatsapp_number && (
                              <div className="text-[10px] text-[#DDE4D9]/40 font-mono">
                                WhatsApp: {lead.whatsapp_number}
                              </div>
                            )}
                          </td>
                          <td className="px-5 py-3.5 text-[#DDE4D9]/80 font-mono">
                            {lead.country}
                          </td>
                          <td className="px-5 py-3.5 text-[#DDE4D9]/80 max-w-xs truncate">
                            {lead.preferred_product_type || lead.primary_feature || "Sanctuary"}
                          </td>
                          <td className="px-5 py-3.5">
                            <span
                              className={`px-2 py-0.5 rounded-full text-[10px] font-mono ${
                                lead.beta_interest?.includes("Yes") || lead.beta_interest?.includes("love")
                                  ? "bg-emerald-950/60 text-emerald-300 border border-emerald-500/30"
                                  : "text-[#DDE4D9]/50 bg-white/[0.02]"
                              }`}
                            >
                              {lead.beta_interest?.includes("Yes") ? "Volunteered" : "No"}
                            </span>
                          </td>
                          <td className="px-5 py-3.5 text-[#DDE4D9]/50 font-mono whitespace-nowrap">
                            {formatDate(lead.created_at)}
                          </td>
                          <td className="px-5 py-3.5 text-right">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setActiveLead(lead);
                              }}
                              className="px-2.5 py-1 rounded-lg border border-white/[0.08] hover:border-[#B79A62]/40 text-[#DDE4D9]/70 hover:text-[#E8D6AC] text-[11px] font-mono transition-colors"
                            >
                              View
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              <div className="p-4 border-t border-white/[0.06] flex items-center justify-between text-xs font-mono text-[#DDE4D9]/60">
                <span>
                  Showing {leads.length} of {totalLeads} responses
                </span>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => loadData(Math.max(1, page - 1))}
                    disabled={page <= 1}
                    className="p-1.5 rounded-lg border border-white/[0.08] hover:border-[#B79A62]/40 disabled:opacity-30 disabled:pointer-events-none transition-colors"
                  >
                    <ChevronLeft className="w-3.5 h-3.5" />
                  </button>
                  <span className="px-1 text-[11px]">
                    {page} / {totalPages}
                  </span>
                  <button
                    onClick={() => loadData(Math.min(totalPages, page + 1))}
                    disabled={page >= totalPages}
                    className="p-1.5 rounded-lg border border-white/[0.08] hover:border-[#B79A62]/40 disabled:opacity-30 disabled:pointer-events-none transition-colors"
                  >
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================
            TAB 3: RESEARCH INSIGHTS (Real Patterns & User Voice)
        ======================================================== */}
        {activeTab === "insights" && (
          <div className="space-y-8 animate-in fade-in duration-200">
            {/* Two-Column Pattern Breakdown */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Spiritual Frictions & Struggles */}
              <div className="p-6 rounded-2xl bg-[#0D1C14]/40 backdrop-blur-xl border border-white/[0.06] space-y-4">
                <span className="text-[11px] font-mono uppercase tracking-wider text-[#E8D6AC] block">
                  Recurring Spiritual Friction
                </span>
                <div className="space-y-3 pt-1">
                  {stats?.challengeCounts && Object.keys(stats.challengeCounts).length > 0 ? (
                    Object.entries(stats.challengeCounts)
                      .sort(([, a], [, b]) => b - a)
                      .slice(0, 5)
                      .map(([challenge, count]) => {
                        const total = stats.totalSignups || 1;
                        const pct = Math.round((count / total) * 100);
                        return (
                          <div key={challenge} className="space-y-1">
                            <div className="flex items-center justify-between text-xs">
                              <span className="text-[#DDE4D9] pr-3 truncate">{challenge}</span>
                              <span className="font-mono text-[#E8D6AC] shrink-0">{pct}%</span>
                            </div>
                            <div className="w-full bg-white/[0.04] h-1.5 rounded-full overflow-hidden">
                              <div
                                className="bg-[#B79A62] h-full rounded-full transition-all duration-300"
                                style={{ width: `${pct}%` }}
                              />
                            </div>
                          </div>
                        );
                      })
                  ) : (
                    <p className="text-xs text-[#DDE4D9]/40 italic py-2">No friction data recorded yet.</p>
                  )}
                </div>
              </div>

              {/* Desired Sanctuary Formats */}
              <div className="p-6 rounded-2xl bg-[#0D1C14]/40 backdrop-blur-xl border border-white/[0.06] space-y-4">
                <span className="text-[11px] font-mono uppercase tracking-wider text-[#E8D6AC] block">
                  Desired Sanctuary Formats
                </span>
                <div className="space-y-3 pt-1">
                  {stats?.productTypeDistribution && Object.keys(stats.productTypeDistribution).length > 0 ? (
                    Object.entries(stats.productTypeDistribution)
                      .sort(([, a], [, b]) => b - a)
                      .slice(0, 5)
                      .map(([type, count]) => {
                        const total = stats.totalSignups || 1;
                        const pct = Math.round((count / total) * 100);
                        return (
                          <div key={type} className="space-y-1">
                            <div className="flex items-center justify-between text-xs">
                              <span className="text-[#DDE4D9] pr-3 truncate">{type}</span>
                              <span className="font-mono text-emerald-400 shrink-0">{pct}%</span>
                            </div>
                            <div className="w-full bg-white/[0.04] h-1.5 rounded-full overflow-hidden">
                              <div
                                className="bg-emerald-500/80 h-full rounded-full transition-all duration-300"
                                style={{ width: `${pct}%` }}
                              />
                            </div>
                          </div>
                        );
                      })
                  ) : (
                    <p className="text-xs text-[#DDE4D9]/40 italic py-2">No sanctuary format data recorded yet.</p>
                  )}
                </div>
              </div>
            </div>

            {/* Qualitative Voice of the Community (Open Reflections) */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-display font-medium text-[#F6F4ED]">
                    Unfiltered Community Voice
                  </h3>
                  <p className="text-xs text-[#DDE4D9]/50 font-light">
                    Direct quotes from participants answering what technology could genuinely do to help their relationship with Allah.
                  </p>
                </div>
                <span className="text-xs font-mono text-[#E8D6AC]">
                  {stats?.recentSuggestions?.length || 0} reflections
                </span>
              </div>

              {stats?.recentSuggestions && stats.recentSuggestions.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {stats.recentSuggestions.map((item, idx) => (
                    <div
                      key={idx}
                      className="p-5 rounded-2xl bg-[#0D1C14]/40 backdrop-blur-xl border border-white/[0.06] hover:border-[#B79A62]/30 transition-all flex flex-col justify-between space-y-3"
                    >
                      <p className="text-xs text-[#F6F4ED] font-serif italic leading-relaxed">
                        &ldquo;{item.suggestion}&rdquo;
                      </p>
                      <div className="text-[10px] font-mono text-[#DDE4D9]/40 flex items-center justify-between border-t border-white/[0.04] pt-2.5">
                        <span>{item.country}</span>
                        <span>{formatDate(item.date)}</span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-8 text-center rounded-2xl bg-[#0D1C14]/20 border border-white/[0.04] text-xs text-[#DDE4D9]/40 font-mono">
                  No freeform reflections submitted yet.
                </div>
              )}
            </div>
          </div>
        )}

        {/* ========================================================
            TAB 4: SETTINGS (Data Export, System Health, Security)
        ======================================================== */}
        {activeTab === "settings" && (
          <div className="space-y-6 max-w-2xl animate-in fade-in duration-200">
            {/* Export Section */}
            <div className="p-6 rounded-2xl bg-[#0D1C14]/40 backdrop-blur-xl border border-white/[0.06] space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-mono uppercase tracking-wider text-[#E8D6AC]">
                    Research Data Export
                  </h4>
                  <p className="text-xs text-[#DDE4D9]/60 font-light mt-0.5">
                    Download full dataset with all survey reflections and attribution in UTF-8 CSV.
                  </p>
                </div>
                <button
                  onClick={handleExportCSV}
                  className="px-4 py-2 rounded-xl bg-[#B79A62] text-[#060D09] font-bold text-xs font-mono uppercase tracking-wider hover:bg-[#D8C296] transition-all flex items-center space-x-1.5 shadow-md shadow-[#B79A62]/10"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Export CSV</span>
                </button>
              </div>
            </div>

            {/* Database & Security Architecture */}
            <div className="p-6 rounded-2xl bg-[#0D1C14]/40 backdrop-blur-xl border border-white/[0.06] space-y-4">
              <span className="text-xs font-mono uppercase tracking-wider text-[#E8D6AC] block">
                Security &amp; Persistence Status
              </span>

              <div className="space-y-3 text-xs">
                <div className="flex items-center justify-between py-2 border-b border-white/[0.04]">
                  <span className="text-[#DDE4D9]/70 flex items-center space-x-2">
                    <Database className="w-3.5 h-3.5 text-[#B79A62]" />
                    <span>Supabase Storage</span>
                  </span>
                  <span className="font-mono text-emerald-400">Connected &bull; Least-Privilege</span>
                </div>

                <div className="flex items-center justify-between py-2 border-b border-white/[0.04]">
                  <span className="text-[#DDE4D9]/70 flex items-center space-x-2">
                    <Lock className="w-3.5 h-3.5 text-[#B79A62]" />
                    <span>Row Level Security (RLS)</span>
                  </span>
                  <span className="font-mono text-emerald-400">Enforced &bull; Anon Restricted</span>
                </div>

                <div className="flex items-center justify-between py-2">
                  <span className="text-[#DDE4D9]/70 flex items-center space-x-2">
                    <ShieldCheck className="w-3.5 h-3.5 text-[#B79A62]" />
                    <span>Service Role Credentials</span>
                  </span>
                  <span className="font-mono text-[#E8D6AC]">Server-Side Only</span>
                </div>
              </div>
            </div>

            {/* Session Sign Out */}
            <div className="pt-2 flex justify-end">
              <button
                onClick={handleLogout}
                className="px-4 py-2 rounded-xl border border-red-500/20 text-red-300 hover:text-red-200 hover:bg-red-950/20 text-xs font-mono transition-colors flex items-center space-x-2"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Sign Out of Admin Console</span>
              </button>
            </div>
          </div>
        )}

        {/* ========================================================
            MODAL: REFINED PARTICIPANT DETAIL VIEW
        ======================================================== */}
        {activeLead && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-150">
            <div className="w-full max-w-lg bg-[#0A140E] border border-[#B79A62]/30 rounded-3xl p-6 sm:p-8 shadow-2xl text-[#F6F4ED] max-h-[88vh] overflow-y-auto space-y-5">
              <div className="flex items-start justify-between border-b border-white/[0.06] pb-3">
                <div>
                  <span className="text-[10px] font-mono uppercase tracking-wider text-[#E8D6AC] block">
                    Participant Profile
                  </span>
                  <h3 className="font-display text-lg font-medium text-[#F6F4ED] mt-0.5">
                    {activeLead.name ? activeLead.name : "Sanctuary Member"}
                  </h3>
                  <span className="text-xs font-mono text-[#DDE4D9]/60 block">
                    {activeLead.email}
                  </span>
                </div>
                <button
                  onClick={() => setActiveLead(null)}
                  className="p-1.5 rounded-full border border-white/[0.08] hover:border-white/30 text-[#DDE4D9]/60 hover:text-[#F6F4ED] transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Metadata Grid */}
              <div className="grid grid-cols-2 gap-2.5 text-xs font-mono">
                <div className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.04]">
                  <span className="text-[#DDE4D9]/40 block text-[10px]">Location</span>
                  <span className="text-[#F6F4ED] mt-0.5 block truncate">{activeLead.country}</span>
                </div>
                <div className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.04]">
                  <span className="text-[#DDE4D9]/40 block text-[10px]">Beta Volunteer</span>
                  <span className="text-[#E8D6AC] mt-0.5 block truncate">
                    {activeLead.beta_interest?.includes("Yes") ? "Yes, Volunteer" : "No"}
                  </span>
                </div>
                {activeLead.whatsapp_number && (
                  <div className="col-span-2 p-3 rounded-xl bg-white/[0.02] border border-white/[0.04]">
                    <span className="text-[#DDE4D9]/40 block text-[10px]">WhatsApp</span>
                    <span className="text-[#F6F4ED] mt-0.5 block">{activeLead.whatsapp_number}</span>
                  </div>
                )}
              </div>

              {/* Inquiry 1 Response: Spiritual Friction */}
              <div className="space-y-1.5">
                <span className="text-[11px] font-mono uppercase tracking-wider text-[#E8D6AC]">
                  Spiritual Friction / Struggle
                </span>
                <p className="text-xs text-[#DDE4D9] bg-white/[0.02] p-3 rounded-xl border border-white/[0.04] leading-relaxed">
                  {activeLead.challenges?.length
                    ? activeLead.challenges.join("; ")
                    : activeLead.other_challenge || "Not specified"}
                </p>
              </div>

              {/* Inquiry 2 Response: Desired Sanctuary */}
              <div className="space-y-1.5">
                <span className="text-[11px] font-mono uppercase tracking-wider text-[#E8D6AC]">
                  Desired Sanctuary
                </span>
                <p className="text-xs text-[#DDE4D9] bg-white/[0.02] p-3 rounded-xl border border-white/[0.04] leading-relaxed">
                  {activeLead.preferred_product_type || activeLead.primary_feature || "Not specified"}
                </p>
              </div>

              {/* Open Reflection */}
              {activeLead.user_suggestions && (
                <div className="space-y-1.5">
                  <span className="text-[11px] font-mono uppercase tracking-wider text-[#E8D6AC]">
                    Personal Reflection
                  </span>
                  <p className="text-xs text-[#F6F4ED] font-serif italic bg-[#B79A62]/[0.08] p-3.5 rounded-xl border border-[#B79A62]/20 leading-relaxed">
                    &ldquo;{activeLead.user_suggestions}&rdquo;
                  </p>
                </div>
              )}

              {/* Registration timestamp */}
              <div className="text-[10px] font-mono text-[#DDE4D9]/40 flex items-center justify-between border-t border-white/[0.06] pt-3">
                <span>Registered: {formatDate(activeLead.created_at)}</span>
                <button
                  onClick={() => setActiveLead(null)}
                  className="px-4 py-1.5 rounded-full bg-[#B79A62] text-[#060D09] font-bold text-xs uppercase tracking-wider hover:bg-[#D8C296] transition-colors"
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
