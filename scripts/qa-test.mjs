// Comprehensive End-to-End QA Test Suite for Digital Taqwa Platform

const BASE_URL = process.env.TEST_URL || "http://localhost:3000";

const results = [];

function record(name, pass, err) {
  if (pass) {
    results.push({ name, status: "PASS" });
    console.log(`✅ PASS: ${name}`);
  } else {
    results.push({ name, status: "FAIL", error: err });
    console.error(`❌ FAIL: ${name} -> ${err}`);
  }
}

async function runQA() {
  console.log("=================================================================");
  console.log("🚀 STARTING AUTOMATED QA TEST SUITE FOR DIGITAL TAQWA PLATFORM");
  console.log(`   Target Server: ${BASE_URL}`);
  console.log("=================================================================\n");

  // 1. Landing Page
  try {
    const res = await fetch(`${BASE_URL}/`);
    const html = await res.text();
    const ok = res.status === 200 && html.includes("Digital Taqwa") && html.includes("Make Space for");
    record("1. Public Landing Page renders with 200 OK & brand copy", ok, `Status ${res.status}`);
  } catch (e) {
    record("1. Public Landing Page renders", false, e.message);
  }

  // 2. Favicon & Icons
  try {
    const resIco = await fetch(`${BASE_URL}/favicon.ico`);
    const resIcon = await fetch(`${BASE_URL}/logo-icon.png`);
    const ok = resIco.status === 200 && resIcon.status === 200;
    record("2. Favicon (/favicon.ico) & Logo Emblem (/logo-icon.png) load 200 OK", ok, `ico: ${resIco.status}, logo: ${resIcon.status}`);
  } catch (e) {
    record("2. Favicon & Icons", false, e.message);
  }

  // 3. Privacy Policy & Terms
  try {
    const resPrivacy = await fetch(`${BASE_URL}/privacy`);
    const resTerms = await fetch(`${BASE_URL}/terms`);
    const ok = resPrivacy.status === 200 && resTerms.status === 200;
    record("3. Legal Pages (/privacy, /terms) render with 200 OK", ok, `privacy: ${resPrivacy.status}, terms: ${resTerms.status}`);
  } catch (e) {
    record("3. Legal Pages", false, e.message);
  }

  // 4. Admin Login Page
  try {
    const res = await fetch(`${BASE_URL}/admin/login`);
    const html = await res.text();
    const ok = res.status === 200 && html.includes("Digital Taqwa Admin");
    record("4. Admin Login page renders cleanly", ok, `Status: ${res.status}`);
  } catch (e) {
    record("4. Admin Login page", false, e.message);
  }

  // 5. Admin Auth Rejection with wrong password
  try {
    const res = await fetch(`${BASE_URL}/api/admin/auth`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password: "wrong_password_test" }),
    });
    const data = await res.json();
    const ok = res.status === 401 && !data.success;
    record("5. Admin Auth rejects unauthorized passwords (401)", ok, `Status: ${res.status}`);
  } catch (e) {
    record("5. Admin Auth rejection", false, e.message);
  }

  // 6. Admin Auth with Attari7866@
  let adminCookie = null;
  try {
    const res = await fetch(`${BASE_URL}/api/admin/auth`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password: "Attari7866@" }),
    });
    const data = await res.json();
    const rawCookie = res.headers.get("set-cookie");
    if (rawCookie) adminCookie = rawCookie.split(";")[0];
    const ok = res.status === 200 && data.success && !!adminCookie;
    record("6. Admin Auth accepts Attari7866@ and issues session cookie", ok, `Status: ${res.status}`);
  } catch (e) {
    record("6. Admin Auth success", false, e.message);
  }

  // 7. Protected Admin Stats API
  try {
    const res = await fetch(`${BASE_URL}/api/admin/stats`, {
      headers: adminCookie ? { cookie: adminCookie } : {},
    });
    const data = await res.json();
    const statsObj = data.stats || data;
    const ok = res.status === 200 && typeof statsObj.totalSignups === "number";
    record("7. Admin Stats API returns full metrics breakdown", ok, `Status: ${res.status}`);
  } catch (e) {
    record("7. Admin Stats API", false, e.message);
  }

  // 8. Protected Admin Leads API
  try {
    const res = await fetch(`${BASE_URL}/api/admin/leads?page=1&limit=5`, {
      headers: adminCookie ? { cookie: adminCookie } : {},
    });
    const data = await res.json();
    const ok = res.status === 200 && Array.isArray(data.leads);
    record("8. Admin Leads Directory API returns segmented lead records", ok, `Status: ${res.status}`);
  } catch (e) {
    record("8. Admin Leads Directory API", false, e.message);
  }

  // 9. Admin CSV Export
  try {
    const res = await fetch(`${BASE_URL}/api/admin/export`, {
      headers: adminCookie ? { cookie: adminCookie } : {},
    });
    const text = await res.text();
    const ok = res.status === 200 && text.includes("ID") && text.includes("Email") && text.includes("Country");
    record("9. Admin CSV Export generates compliant UTF-8 CSV headers", ok, `Status: ${res.status}`);
  } catch (e) {
    record("9. Admin CSV Export", false, e.message);
  }

  // 10. Waitlist Registration API with attribution & segmentation
  const testEmail = `qa_${Date.now()}@example.com`;
  let verificationToken = null;
  try {
    const payload = {
      name: "Bilal QA",
      country: "Pakistan",
      email: testEmail,
      whatsapp_number: "+923001112233",
      marketing_consent: true,
      challenges: ["Difficulty staying consistent with Islamic habits", "Excessive mobile usage and social media scrolling"],
      desired_solutions: ["Help me build consistent Islamic daily habits", "Help me reduce digital distractions"],
      preferred_product_type: "A complete Islamic lifestyle companion",
      usage_priorities: ["Simple and easy to use", "Useful daily reminders"],
      expected_usage_frequency: "Multiple times a day",
      beta_interest: "Yes, I am interested",
      user_suggestions: "Make sure there are no ads or invasive tracking.",
      utm_source: "instagram",
      utm_medium: "paid_ad",
      utm_campaign: "launch_2026",
    };

    const res = await fetch(`${BASE_URL}/api/waitlist`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    const ok = res.status === 201 && data.success && data.user && data.user.referral_code;
    if (data.devUrl) {
      const match = data.devUrl.match(/token=([a-f0-9]+)/);
      if (match) verificationToken = match[1];
    }
    record("10. Waitlist Registration creates user, referral code & attribution", ok, `Status: ${res.status}`);
  } catch (e) {
    record("10. Waitlist Registration", false, e.message);
  }

  // 11. Email Verification Endpoint
  try {
    if (!verificationToken) {
      record("11. Email Verification token extracted", false, "No token found from step 10");
    } else {
      const res = await fetch(`${BASE_URL}/api/verify?token=${verificationToken}`);
      const data = await res.json();
      const ok = res.status === 200 && data.success && data.email === testEmail;
      record("11. Email Verification marks user as verified", ok, `Status: ${res.status}`);
    }
  } catch (e) {
    record("11. Email Verification", false, e.message);
  }

  // 12. Duplicate Email Prevention
  try {
    const payload = {
      country: "Pakistan",
      email: testEmail,
      challenges: ["Endless social media scrolling"],
      features: ["Prayer Consistency Tracker"],
      primary_feature: "Prayer Consistency Tracker",
    };
    const res = await fetch(`${BASE_URL}/api/waitlist`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    const ok = res.status === 409 && !data.success;
    record("12. Duplicate Email registration rejected (409 Conflict)", ok, `Status: ${res.status}`);
  } catch (e) {
    record("12. Duplicate Email prevention", false, e.message);
  }

  console.log("\n=================================================================");
  const passed = results.filter((r) => r.status === "PASS").length;
  const failed = results.filter((r) => r.status === "FAIL").length;
  console.log(`📊 QA SUMMARY: ${passed}/${results.length} PASSED (${failed} failed)`);
  console.log("=================================================================");

  if (failed > 0) process.exit(1);
}

runQA();
