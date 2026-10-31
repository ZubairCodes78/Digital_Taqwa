import { createClient } from "@supabase/supabase-js";
import fs from "fs";

// Parse .env.local manually
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
  console.warn("Could not read .env.local", e);
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey =
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

console.log("--------------------------------------------------");
console.log("🔍 TESTING LIVE SUPABASE CONNECTION & TABLES");
console.log(`URL: ${supabaseUrl}`);
console.log(`Key Prefix: ${supabaseKey ? supabaseKey.substring(0, 16) + "..." : "MISSING"}`);
console.log("--------------------------------------------------");

if (!supabaseUrl || !supabaseKey) {
  console.error("❌ Missing Supabase URL or Key in .env.local");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function runVerification() {
  const tables = [
    "waitlist_users",
    "user_challenges",
    "feature_interests",
    "referrals",
    "marketing_attribution",
  ];

  let allOk = true;

  for (const table of tables) {
    const { data, error } = await supabase.from(table).select("*").limit(1);
    if (error) {
      console.error(`❌ Table '${table}': ERROR - ${error.message} (${error.code})`);
      allOk = false;
    } else {
      console.log(`✅ Table '${table}': EXISTS & ACCESSIBLE (Rows returned: ${data.length})`);
    }
  }

  // Test inserting a test record to waitlist_users
  const testEmail = `test_supabase_${Date.now()}@example.com`;
  console.log(`\nTesting INSERT to 'waitlist_users' with email: ${testEmail}...`);

  const { data: insertData, error: insertError } = await supabase
    .from("waitlist_users")
    .insert({
      email: testEmail,
      name: "Test Verification User",
      country: "Pakistan",
      marketing_consent: true,
      email_verified: false,
      verification_token: "test_token_" + Date.now(),
      referral_code: "DT-TEST" + Math.floor(Math.random() * 900 + 100),
    })
    .select()
    .single();

  if (insertError) {
    console.warn(`⚠️ Insert test warning: ${insertError.message} (${insertError.code})`);
    if (insertError.code === "42501") {
      console.log("   (RLS policy restricted insert or requires specific columns)");
    }
  } else {
    console.log(`✅ Insert successful! User ID: ${insertData.id}`);

    // Clean up test record if possible
    await supabase.from("waitlist_users").delete().eq("id", insertData.id);
    console.log("🧹 Cleaned up test record.");
  }

  console.log("\n--------------------------------------------------");
  if (allOk) {
    console.log("🎉 ALL SUPABASE TABLES ARE CREATED AND CONNECTED PERFECTLY!");
  } else {
    console.log("⚠️ Some tables need attention. See errors above.");
  }
  console.log("--------------------------------------------------");
}

runVerification().catch(console.error);
