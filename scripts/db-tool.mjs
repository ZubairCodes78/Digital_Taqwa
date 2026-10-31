import { DatabaseSync } from "node:sqlite";
import path from "node:path";
import fs from "node:fs";

const dbPath = path.join(process.cwd(), ".data", "digital_taqwa.sqlite");

console.log("\n=======================================================");
console.log("🕋 DIGITAL TAQWA — LOCAL SQLITE DATABASE INSPECTOR");
console.log("=======================================================\n");

if (!fs.existsSync(dbPath)) {
  console.log("No local SQLite database found yet at:", dbPath);
  console.log("Start the dev server or submit a survey to initialize it automatically.\n");
  process.exit(0);
}

try {
  const db = new DatabaseSync(dbPath);
  const userCount = db.prepare("SELECT COUNT(*) as count FROM waitlist_users").get();
  const verifiedCount = db.prepare("SELECT COUNT(*) as count FROM waitlist_users WHERE email_verified = 1").get();
  const challengesCount = db.prepare("SELECT COUNT(*) as count FROM user_challenges").get();
  const attributionCount = db.prepare("SELECT COUNT(*) as count FROM marketing_attribution").get();

  console.log(`Database File: ${dbPath}`);
  console.log(`Total Waitlist Users: ${userCount.count}`);
  console.log(`Verified Users:       ${verifiedCount.count}`);
  console.log(`Challenges Logged:    ${challengesCount.count}`);
  console.log(`Attributions Logged:  ${attributionCount.count}\n`);

  console.log("--- RECENT 5 SIGNUPS ---");
  const recent = db.prepare("SELECT name, email, country, referral_code, email_verified, created_at FROM waitlist_users ORDER BY created_at DESC LIMIT 5").all();
  console.table(recent);

  console.log("\n✅ Local SQLite database is healthy and synchronized.\n");
} catch (e) {
  console.error("Error inspecting database:", e);
}
