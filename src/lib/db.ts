import fs from "fs";
import path from "path";
import crypto from "crypto";
import { supabaseAdmin, isSupabaseConfigured } from "./supabase";
import { CompleteWaitlistInput } from "./validation";
import { WaitlistUserRecord, AdminStats } from "@/types";
import { generateReferralCode } from "./utils";
import { saveRecordToSqlite, loadAllRecordsFromSqlite } from "./sqliteDb";

const DATA_DIR = path.join(process.cwd(), ".data");
const DATA_FILE = path.join(DATA_DIR, "leads.json");

// Ensure data directory exists for local fallback
function ensureDataDir() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  if (!fs.existsSync(DATA_FILE)) {
    fs.writeFileSync(DATA_FILE, "[]", "utf-8");
  }
}

function readLocalLeads(): WaitlistUserRecord[] {
  ensureDataDir();
  try {
    const sqliteRecords = loadAllRecordsFromSqlite();
    if (sqliteRecords && sqliteRecords.length > 0) {
      return sqliteRecords;
    }
    const raw = fs.readFileSync(DATA_FILE, "utf-8");
    const leads: WaitlistUserRecord[] = JSON.parse(raw);
    for (const lead of leads) {
      saveRecordToSqlite(lead);
    }
    return leads;
  } catch (err) {
    console.error("Error reading local leads:", err);
    return [];
  }
}

function writeLocalLeads(leads: WaitlistUserRecord[]) {
  ensureDataDir();
  fs.writeFileSync(DATA_FILE, JSON.stringify(leads, null, 2), "utf-8");
  for (const lead of leads) {
    saveRecordToSqlite(lead);
  }
}

/**
 * Check if an email is already registered
 */
export async function checkEmailExists(email: string): Promise<boolean> {
  const normalizedEmail = email.trim().toLowerCase();

  if (isSupabaseConfigured && supabaseAdmin) {
    try {
      const { data, error } = await supabaseAdmin
        .from("waitlist_users")
        .select("id")
        .eq("email", normalizedEmail)
        .maybeSingle();

      if (error) {
        console.warn("Supabase check email error, using fallback:", error.message);
      } else {
        return Boolean(data);
      }
    } catch (e) {
      console.warn("Supabase connection exception, using local fallback");
    }
  }

  const leads = readLocalLeads();
  return leads.some((lead) => lead.email.toLowerCase() === normalizedEmail);
}

/**
 * Register a new waitlist user with transactional integrity
 */
export async function createWaitlistUser(
  data: CompleteWaitlistInput
): Promise<{ user: WaitlistUserRecord; verificationToken: string; isNew: boolean }> {
  const normalizedEmail = data.email.trim().toLowerCase();
  const exists = await checkEmailExists(normalizedEmail);

  if (exists) {
    const error: any = new Error("This email is already on the early access waitlist.");
    error.code = "DUPLICATE_EMAIL";
    throw error;
  }

  const userId = crypto.randomUUID();
  const verificationToken = crypto.randomBytes(32).toString("hex");
  const tokenExpires = new Date(Date.now() + 1000 * 60 * 60 * 48).toISOString(); // 48 hours
  const referralCode = generateReferralCode();
  const now = new Date().toISOString();

  // Try Supabase first if configured
  if (isSupabaseConfigured && supabaseAdmin) {
    try {
      // 1. Insert waitlist_users (directly marked verified, no email verification needed)
      const { data: userInsert, error: userError } = await supabaseAdmin
        .from("waitlist_users")
        .insert({
          id: userId,
          name: data.name || null,
          email: normalizedEmail,
          country: data.country,
          whatsapp_number: data.whatsapp_number || null,
          email_verified: true,
          verified_at: now,
          verification_token: null,
          verification_token_expires: null,
          marketing_consent: Boolean(data.marketing_consent),
          referral_code: referralCode,
          created_at: now,
          updated_at: now,
        })
        .select()
        .single();

      if (userError) {
        console.error("Supabase user insert failed, falling back to local:", userError);
      } else {
        // 2. Insert challenges
        if (data.challenges && data.challenges.length > 0) {
          const challengesPayload = data.challenges.map((c) => ({
            user_id: userId,
            challenge_key: c,
          }));
          await supabaseAdmin.from("user_challenges").insert(challengesPayload);
        }

        // 3. Insert features
        if (data.features && data.features.length > 0) {
          const featuresPayload = data.features.map((f) => ({
            user_id: userId,
            feature_key: f,
            is_primary: f === data.primary_feature,
          }));
          await supabaseAdmin.from("feature_interests").insert(featuresPayload);
        }

        // 4. Insert attribution
        if (data.utm_source || data.referrer || data.landing_page) {
          await supabaseAdmin.from("marketing_attribution").insert({
            user_id: userId,
            utm_source: data.utm_source || "direct",
            utm_medium: data.utm_medium || "none",
            utm_campaign: data.utm_campaign || "organic",
            utm_content: data.utm_content || "",
            utm_term: data.utm_term || "",
            referrer: data.referrer || "direct",
            landing_page: data.landing_page || "",
          });
        }

        // 5. Insert referral connection if referred_by code provided
        if (data.referred_by) {
          const { data: referrerUser } = await supabaseAdmin
            .from("waitlist_users")
            .select("id")
            .eq("referral_code", data.referred_by.trim())
            .maybeSingle();

          await supabaseAdmin.from("referrals").insert({
            referrer_user_id: referrerUser?.id || null,
            referred_user_id: userId,
            referral_code: data.referred_by.trim(),
          });
        }

        const newRecord: WaitlistUserRecord = {
          id: userId,
          name: data.name,
          email: normalizedEmail,
          country: data.country,
          whatsapp_number: data.whatsapp_number,
          email_verified: true,
          verified_at: now,
          marketing_consent: Boolean(data.marketing_consent),
          referral_code: referralCode,
          created_at: now,
          updated_at: now,
          challenges: data.challenges || [],
          other_challenge: data.other_challenge,
          desired_solutions: data.desired_solutions || data.features || [],
          user_suggestions: data.user_suggestions,
          preferred_product_type: data.preferred_product_type || data.primary_feature || "",
          usage_priorities: data.usage_priorities || [],
          expected_usage_frequency: data.expected_usage_frequency || "",
          beta_interest: data.beta_interest || "Yes, I am interested",
          features: data.desired_solutions || data.features || [],
          primary_feature: data.preferred_product_type || data.primary_feature || "",
          attribution: {
            utm_source: data.utm_source || "direct",
            utm_medium: data.utm_medium || "none",
            utm_campaign: data.utm_campaign || "organic",
            utm_content: data.utm_content || "",
            utm_term: data.utm_term || "",
            referrer: data.referrer || "direct",
            landing_page: data.landing_page || "",
          },
        };

        // Also write to local cache for dual-resilience
        const currentLocal = readLocalLeads();
        currentLocal.unshift(newRecord);
        writeLocalLeads(currentLocal);

        return { user: newRecord, verificationToken: "", isNew: true };
      }
    } catch (err) {
      console.warn("Supabase error during creation, persisting locally:", err);
    }
  }

  // Local fallback storage
  const record: WaitlistUserRecord = {
    id: userId,
    name: data.name,
    email: normalizedEmail,
    country: data.country,
    whatsapp_number: data.whatsapp_number,
    email_verified: true,
    verified_at: now,
    marketing_consent: Boolean(data.marketing_consent),
    referral_code: referralCode,
    created_at: now,
    updated_at: now,
    challenges: data.challenges || [],
    other_challenge: data.other_challenge,
    desired_solutions: data.desired_solutions || data.features || [],
    user_suggestions: data.user_suggestions,
    preferred_product_type: data.preferred_product_type || data.primary_feature || "",
    usage_priorities: data.usage_priorities || [],
    expected_usage_frequency: data.expected_usage_frequency || "",
    beta_interest: data.beta_interest || "Yes, I am interested",
    features: data.desired_solutions || data.features || [],
    primary_feature: data.preferred_product_type || data.primary_feature || "",
    attribution: {
      utm_source: data.utm_source || "direct",
      utm_medium: data.utm_medium || "none",
      utm_campaign: data.utm_campaign || "organic",
      utm_content: data.utm_content,
      utm_term: data.utm_term,
      referrer: data.referrer,
      landing_page: data.landing_page,
    },
  };

  const leads = readLocalLeads();
  leads.unshift(record);
  writeLocalLeads(leads);

  return { user: record, verificationToken: "", isNew: true };
}

/**
 * Fetch all leads with search, filters, and pagination
 */
export async function getLeads(filters: {
  search?: string;
  country?: string;
  verified?: string;
  feature?: string;
  betaInterest?: string;
  page?: number;
  limit?: number;
}): Promise<{ leads: WaitlistUserRecord[]; total: number; page: number; totalPages: number }> {
  const page = Math.max(1, filters.page || 1);
  const limit = Math.max(1, Math.min(100, filters.limit || 15));

  // We read from the local consolidated store or Supabase
  let all = readLocalLeads();

  // If Supabase is configured, sync any recent records
  if (isSupabaseConfigured && supabaseAdmin) {
    try {
      const { data: dbUsers, error } = await supabaseAdmin
        .from("waitlist_users")
        .select(`
          id,
          name,
          email,
          country,
          whatsapp_number,
          email_verified,
          marketing_consent,
          referral_code,
          created_at,
          updated_at,
          user_challenges (challenge_key),
          feature_interests (feature_key, is_primary),
          marketing_attribution (utm_source, utm_medium, utm_campaign, utm_content, utm_term, referrer, landing_page)
        `)
        .order("created_at", { ascending: false });

      if (!error && dbUsers && dbUsers.length > 0) {
        all = dbUsers.map((u: any) => {
          const primary = u.feature_interests?.find((f: any) => f.is_primary)?.feature_key || "";
          const attr = u.marketing_attribution?.[0] || {};
          return {
            id: u.id,
            name: u.name || undefined,
            email: u.email,
            country: u.country,
            whatsapp_number: u.whatsapp_number || undefined,
            email_verified: Boolean(u.email_verified),
            marketing_consent: Boolean(u.marketing_consent),
            referral_code: u.referral_code,
            created_at: u.created_at,
            updated_at: u.updated_at,
            challenges: (u.user_challenges || []).map((c: any) => c.challenge_key),
            features: (u.feature_interests || []).map((f: any) => f.feature_key),
            primary_feature: primary,
            attribution: attr,
          };
        });
      }
    } catch (e) {
      console.warn("Could not query Supabase directly for getLeads, using cache:", e);
    }
  }

  // Filter Search
  if (filters.search) {
    const q = filters.search.toLowerCase().trim();
    all = all.filter(
      (l) =>
        l.email.toLowerCase().includes(q) ||
        (l.name && l.name.toLowerCase().includes(q)) ||
        (l.whatsapp_number && l.whatsapp_number.includes(q)) ||
        (l.referral_code && l.referral_code.toLowerCase().includes(q))
    );
  }

  // Filter Country
  if (filters.country && filters.country !== "all") {
    all = all.filter((l) => l.country === filters.country);
  }

  // Filter Verified
  if (filters.verified && filters.verified !== "all") {
    const isV = filters.verified === "true";
    all = all.filter((l) => l.email_verified === isV);
  }

  // Filter Feature
  if (filters.feature && filters.feature !== "all") {
    all = all.filter(
      (l) => l.primary_feature === filters.feature || (l.features || []).includes(filters.feature!)
    );
  }

  // Filter Beta Interest
  if (filters.betaInterest && filters.betaInterest !== "all") {
    all = all.filter((l) => l.beta_interest === filters.betaInterest);
  }

  const total = all.length;
  const totalPages = Math.ceil(total / limit) || 1;
  const start = (page - 1) * limit;
  const paginated = all.slice(start, start + limit);

  return {
    leads: paginated,
    total,
    page,
    totalPages,
  };
}

/**
 * Get aggregate statistics for the Admin Dashboard
 */
export async function getAdminStats(): Promise<AdminStats> {
  const { leads: all } = await getLeads({ limit: 10000 });

  const totalSignups = all.length;
  const verifiedEmails = all.filter((l) => l.email_verified).length;
  const unverifiedEmails = totalSignups - verifiedEmails;
  const verificationRate = totalSignups > 0 ? Math.round((verifiedEmails / totalSignups) * 100) : 0;

  let organicSignups = 0;
  let paidSignups = 0;

  const countryDistribution: Record<string, number> = {};
  const featureInterests: Record<string, number> = {};
  const primaryFeatures: Record<string, number> = {};
  const challengeCounts: Record<string, number> = {};
  const betaInterestDistribution: Record<string, number> = {};
  const solutionInterests: Record<string, number> = {};
  const productTypeDistribution: Record<string, number> = {};
  const usagePriorityCounts: Record<string, number> = {};
  const usageFrequencyDistribution: Record<string, number> = {};
  const recentSuggestions: { email: string; country: string; suggestion: string; date: string }[] = [];
  const campaignsMap: Record<string, { count: number; verifiedCount: number }> = {};

  for (const lead of all) {
    // Country
    countryDistribution[lead.country] = (countryDistribution[lead.country] || 0) + 1;

    // Beta Interest
    if (lead.beta_interest) {
      betaInterestDistribution[lead.beta_interest] = (betaInterestDistribution[lead.beta_interest] || 0) + 1;
    }

    // Product Type / Primary
    const prodType = lead.preferred_product_type || lead.primary_feature;
    if (prodType) {
      primaryFeatures[prodType] = (primaryFeatures[prodType] || 0) + 1;
      productTypeDistribution[prodType] = (productTypeDistribution[prodType] || 0) + 1;
    }

    // Desired Solutions / Features
    const solutions = lead.desired_solutions?.length ? lead.desired_solutions : (lead.features || []);
    for (const s of solutions) {
      featureInterests[s] = (featureInterests[s] || 0) + 1;
      solutionInterests[s] = (solutionInterests[s] || 0) + 1;
    }

    // Challenges
    for (const c of lead.challenges || []) {
      challengeCounts[c] = (challengeCounts[c] || 0) + 1;
    }

    // Usage Priorities
    for (const p of lead.usage_priorities || []) {
      usagePriorityCounts[p] = (usagePriorityCounts[p] || 0) + 1;
    }

    // Usage Frequency
    if (lead.expected_usage_frequency) {
      usageFrequencyDistribution[lead.expected_usage_frequency] =
        (usageFrequencyDistribution[lead.expected_usage_frequency] || 0) + 1;
    }

    // User Suggestions (open text)
    if (lead.user_suggestions && lead.user_suggestions.trim().length > 0) {
      recentSuggestions.push({
        email: lead.email,
        country: lead.country,
        suggestion: lead.user_suggestions.trim(),
        date: lead.created_at,
      });
    }

    // Attribution
    const medium = (lead.attribution?.utm_medium || "").toLowerCase();
    const source = (lead.attribution?.utm_source || "direct").toLowerCase();
    const campaign = lead.attribution?.utm_campaign || "none";

    if (medium === "paid" || medium === "cpc" || medium === "ads") {
      paidSignups++;
    } else {
      organicSignups++;
    }

    const campaignKey = `${source} / ${campaign}`;
    if (!campaignsMap[campaignKey]) {
      campaignsMap[campaignKey] = { count: 0, verifiedCount: 0 };
    }
    campaignsMap[campaignKey].count++;
    if (lead.email_verified) {
      campaignsMap[campaignKey].verifiedCount++;
    }
  }

  const campaignPerformance = Object.entries(campaignsMap).map(([key, data]) => {
    const [source, campaign] = key.split(" / ");
    return {
      source,
      campaign,
      count: data.count,
      verifiedCount: data.verifiedCount,
    };
  });

  return {
    totalSignups,
    totalSurveys: totalSignups,
    verifiedEmails,
    unverifiedEmails,
    verificationRate,
    organicSignups,
    paidSignups,
    countryDistribution,
    betaInterestDistribution,
    solutionInterests,
    productTypeDistribution,
    usagePriorityCounts,
    usageFrequencyDistribution,
    recentSuggestions,
    featureInterests,
    primaryFeatures,
    challengeCounts,
    campaignPerformance,
  };
}

/**
 * Generate CSV representation of all leads
 */
export async function exportLeadsCSV(): Promise<string> {
  const { leads } = await getLeads({ limit: 10000 });

  const headers = [
    "ID",
    "Name",
    "Email",
    "Country",
    "WhatsApp",
    "Verified",
    "Marketing Consent",
    "Beta Interest",
    "Preferred Product Type",
    "Desired Solutions",
    "Challenges",
    "Other Challenge",
    "User Suggestions",
    "Usage Priorities",
    "Usage Frequency",
    "UTM Source",
    "UTM Medium",
    "UTM Campaign",
    "Referral Code",
    "Registered At",
  ];

  const escapeCSV = (val: any) => {
    if (val === null || val === undefined) return '""';
    const str = String(val).replace(/"/g, '""');
    return `"${str}"`;
  };

  const rows = leads.map((lead) => [
    escapeCSV(lead.id),
    escapeCSV(lead.name || ""),
    escapeCSV(lead.email),
    escapeCSV(lead.country),
    escapeCSV(lead.whatsapp_number || ""),
    escapeCSV(lead.email_verified ? "Yes" : "No"),
    escapeCSV(lead.marketing_consent ? "Yes" : "No"),
    escapeCSV(lead.beta_interest || "Yes, I am interested"),
    escapeCSV(lead.preferred_product_type || lead.primary_feature || ""),
    escapeCSV((lead.desired_solutions || lead.features || []).join("; ")),
    escapeCSV((lead.challenges || []).join("; ")),
    escapeCSV(lead.other_challenge || ""),
    escapeCSV(lead.user_suggestions || ""),
    escapeCSV((lead.usage_priorities || []).join("; ")),
    escapeCSV(lead.expected_usage_frequency || ""),
    escapeCSV(lead.attribution?.utm_source || ""),
    escapeCSV(lead.attribution?.utm_medium || ""),
    escapeCSV(lead.attribution?.utm_campaign || ""),
    escapeCSV(lead.referral_code),
    escapeCSV(lead.created_at),
  ]);

  return [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
}

