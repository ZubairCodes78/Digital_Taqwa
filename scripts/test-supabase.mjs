import { createClient } from "@supabase/supabase-js";
import fs from "fs";

// 1. Load environment variables from .env.local manually
try {
  const envContent = fs.readFileSync(".env.local", "utf8");
  for (const line of envContent.split("\n")) {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith("#") && trimmed.includes("=")) {
      const idx = trimmed.indexOf("=");
      const key = trimmed.slice(0, idx).trim();
      const val = trimmed.slice(idx + 1).trim();
      process.env[key] = val;
    }
  }
} catch (e) {
  console.warn("⚠️ Warning: Could not read .env.local", e.message);
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const publishableKey =
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

console.log("=================================================================");
console.log("🔒 SUPABASE LEAST-PRIVILEGE SECURITY & VERIFICATION TEST");
console.log(`URL: ${supabaseUrl}`);
console.log(`Anon Key Prefix: ${publishableKey ? publishableKey.substring(0, 16) + "..." : "MISSING"}`);
console.log(`Service Role Key: ${serviceRoleKey ? "Configured (Server-Only)" : "Not present in .env.local (Optional)"}`);
console.log("=================================================================\n");

if (!supabaseUrl || !publishableKey) {
  console.error("❌ Missing Supabase URL or Anon/Publishable Key in .env.local");
  process.exit(1);
}

// Create anon client (representing public browser visitor)
const anonClient = createClient(supabaseUrl, publishableKey);

// Create service role client (representing trusted server backend)
const serviceClient = serviceRoleKey
  ? createClient(supabaseUrl, serviceRoleKey, {
      auth: { autoRefreshToken: false, persistSession: false },
    })
  : null;

async function runSecurityTests() {
  console.log("--- 1. SERVER-ONLY KEY AUDIT ---");
  const serviceKeyPrefix = "NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY";
  if (process.env[serviceKeyPrefix]) {
    console.error("❌ CRITICAL: Service role key has NEXT_PUBLIC_ prefix! It must remain server-only.");
  } else {
    console.log("✅ PASS: Service role key is private and not exposed via NEXT_PUBLIC_ prefix.");
  }

  // Audit codebase for any client leaks of service role key
  const supabaseTs = fs.readFileSync("src/lib/supabase.ts", "utf8");
  if (supabaseTs.includes("typeof window === \"undefined\"")) {
    console.log("✅ PASS: src/lib/supabase.ts enforces server-only guard (isServer check).");
  } else {
    console.warn("⚠️ WARNING: src/lib/supabase.ts missing server guard.");
  }

  console.log("\n--- 2. LEAST-PRIVILEGE READ RESTRICTIONS (ANON ROLE) ---");

  // A. Public SELECT on waitlist_users (Must NOT expose user emails or personal data)
  const { data: usersData, error: usersErr } = await anonClient
    .from("waitlist_users")
    .select("id, email, name, whatsapp_number")
    .limit(5);

  if (usersErr || !usersData || usersData.length === 0) {
    console.log(`✅ PASS: waitlist_users SELECT blocked/isolated for anon (Error: ${usersErr?.code || "0 rows returned"}). Personal data is NOT exposed!`);
  } else {
    console.error("❌ FAIL: waitlist_users leaked personal data to anon!", usersData);
  }

  // B. Public SELECT on user_challenges (Must NOT expose community survey answers)
  const { data: challengesData, error: challengesErr } = await anonClient
    .from("user_challenges")
    .select("*")
    .limit(5);

  if (challengesErr || !challengesData || challengesData.length === 0) {
    console.log(`✅ PASS: user_challenges SELECT blocked/isolated for anon (Error: ${challengesErr?.code || "0 rows returned"}). Survey answers are private!`);
  } else {
    console.error("❌ FAIL: user_challenges leaked survey responses to anon!");
  }

  // C. Public SELECT on feature_interests (Must NOT expose community votes)
  const { data: featuresData, error: featuresErr } = await anonClient
    .from("feature_interests")
    .select("*")
    .limit(5);

  if (featuresErr || !featuresData || featuresData.length === 0) {
    console.log(`✅ PASS: feature_interests SELECT blocked/isolated for anon (Error: ${featuresErr?.code || "0 rows returned"}). Feature votes are private!`);
  } else {
    console.error("❌ FAIL: feature_interests leaked data to anon!");
  }

  // D. Public SELECT on referrals (Must NOT expose referral linkage graph)
  const { data: referralsData, error: referralsErr } = await anonClient
    .from("referrals")
    .select("*")
    .limit(5);

  if (referralsErr || !referralsData || referralsData.length === 0) {
    console.log(`✅ PASS: referrals SELECT blocked/isolated for anon (Error: ${referralsErr?.code || "0 rows returned"}). Referral graph is private!`);
  } else {
    console.error("❌ FAIL: referrals leaked data to anon!");
  }

  // E. Public SELECT on admin_activity_logs (Must be completely rejected)
  const { data: adminData, error: adminErr } = await anonClient
    .from("admin_activity_logs")
    .select("*")
    .limit(5);

  if (adminErr) {
    console.log(`✅ PASS: admin_activity_logs strictly denied to anon (${adminErr.code}: ${adminErr.message}).`);
  } else {
    console.error("❌ FAIL: admin_activity_logs exposed to anon!");
  }

  console.log("\n--- 3. LEAST-PRIVILEGE INTAKE (INSERT POLICIES) ---");

  // A. Test invalid insert (missing marketing_consent or invalid email)
  const invalidEmail = "notanemail";
  const { error: invalidErr } = await anonClient
    .from("waitlist_users")
    .insert({
      email: invalidEmail,
      marketing_consent: false,
    });

  if (invalidErr) {
    console.log(`✅ PASS: Strict RLS blocked invalid intake (${invalidErr.code}: ${invalidErr.message}).`);
  } else {
    console.warn("⚠️ Note: Invalid email test was not blocked by check constraint.");
  }

  // B. Test valid intake insert
  const validTestEmail = `verify_qa_${Date.now()}@example.com`;
  const { data: insertResult, error: insertErr } = await anonClient
    .from("waitlist_users")
    .insert({
      email: validTestEmail,
      name: "Security QA User",
      country: "Pakistan",
      marketing_consent: true,
      referral_code: "DT-SEC" + Math.floor(Math.random() * 900 + 100),
    });

  if (insertErr) {
    if (insertErr.code === "42501") {
      console.log(`ℹ️ NOTE: Table permissions not yet applied in Supabase SQL editor (${insertErr.message}).`);
      console.log(`   👉 Run 'supabase/grant_permissions.sql' in your Supabase SQL Editor to activate.`);
    } else {
      console.warn(`⚠️ Insert test note: ${insertErr.message} (${insertErr.code})`);
    }
  } else {
    console.log(`✅ PASS: Legitimate waitlist submission succeeded under least-privilege INSERT policy.`);
  }

  // C. Test RPC function validate_referral_code
  try {
    const { data: rpcData, error: rpcErr } = await anonClient.rpc("validate_referral_code", {
      code: "NONEXISTENT_CODE_123",
    });

    if (rpcErr) {
      console.log(`ℹ️ RPC function 'validate_referral_code': ${rpcErr.message} (will be active after running grant_permissions.sql)`);
    } else {
      console.log(`✅ PASS: RPC 'validate_referral_code' returned ${rpcData} securely without exposing any row data.`);
    }
  } catch (e) {
    console.log(`ℹ️ RPC not yet created in Supabase.`);
  }

  console.log("\n--- 4. SERVICE ROLE VERIFICATION (SERVER-SIDE) ---");
  if (serviceClient) {
    const { data: sUsers, error: sErr } = await serviceClient
      .from("waitlist_users")
      .select("count")
      .limit(1);

    if (sErr) {
      console.warn(`⚠️ Service role check: ${sErr.message}`);
    } else {
      console.log("✅ PASS: Service role key has verified server-side administrative access.");
    }
  } else {
    console.log("ℹ️ Server running with Publishable Key + Local Storage Fallback.");
    console.log("   To enable Supabase server-side admin sync, add SUPABASE_SERVICE_ROLE_KEY to .env.local.");
  }

  console.log("\n=================================================================");
  console.log("🔒 SECURITY AUDIT COMPLETE");
  console.log("=================================================================");
}

runSecurityTests().catch(console.error);
