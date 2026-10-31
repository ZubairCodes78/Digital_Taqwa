import path from "path";
import fs from "fs";
import { WaitlistUserRecord } from "@/types";

const DATA_DIR = path.join(process.cwd(), ".data");
const SQLITE_FILE = path.join(DATA_DIR, "digital_taqwa.sqlite");

let sqliteDbInstance: any = null;
let sqliteAvailable: boolean | null = null;

/**
 * Initializes and returns the local SQLite database instance if supported.
 * Uses Node.js native DatabaseSync (Node 22+) with zero external dependencies.
 */
export function getLocalSqliteDb(): any | null {
  if (sqliteAvailable === false) return null;
  if (sqliteDbInstance) return sqliteDbInstance;

  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }

    const req = typeof require !== "undefined" ? require : null;
    if (!req) return null;
    const { DatabaseSync } = req("node:sqlite");
    sqliteDbInstance = new DatabaseSync(SQLITE_FILE);
    sqliteAvailable = true;

    // Initialize relational tables
    initSqliteSchema(sqliteDbInstance);
    return sqliteDbInstance;
  } catch (err) {
    sqliteAvailable = false;
    console.info("Native node:sqlite not active, using resilient JSON storage fallback.");
    return null;
  }
}

/**
 * Creates the local relational database tables in SQLite
 */
function initSqliteSchema(db: any) {
  try {
    db.exec(`
      CREATE TABLE IF NOT EXISTS waitlist_users (
        id TEXT PRIMARY KEY,
        name TEXT,
        email TEXT UNIQUE NOT NULL,
        country TEXT NOT NULL,
        whatsapp_number TEXT,
        email_verified INTEGER DEFAULT 0,
        verification_token TEXT,
        verification_token_expires TEXT,
        verified_at TEXT,
        marketing_consent INTEGER DEFAULT 0,
        referral_code TEXT UNIQUE NOT NULL,
        referred_by TEXT,
        referral_count INTEGER DEFAULT 0,
        preferred_product_type TEXT,
        expected_usage_frequency TEXT,
        beta_interest TEXT,
        other_challenge TEXT,
        user_suggestions TEXT,
        primary_feature TEXT,
        device_platform TEXT,
        challenges_json TEXT,
        features_json TEXT,
        attribution_json TEXT,
        created_at TEXT,
        updated_at TEXT
      );

      CREATE INDEX IF NOT EXISTS idx_local_email ON waitlist_users (email);
      CREATE INDEX IF NOT EXISTS idx_local_referral_code ON waitlist_users (referral_code);
      CREATE INDEX IF NOT EXISTS idx_local_created_at ON waitlist_users (created_at DESC);

      CREATE TABLE IF NOT EXISTS user_challenges (
        id TEXT PRIMARY KEY,
        user_id TEXT NOT NULL,
        challenge TEXT NOT NULL,
        created_at TEXT
      );

      CREATE TABLE IF NOT EXISTS feature_interests (
        id TEXT PRIMARY KEY,
        user_id TEXT NOT NULL,
        feature TEXT NOT NULL,
        is_primary INTEGER DEFAULT 0,
        created_at TEXT
      );

      CREATE TABLE IF NOT EXISTS marketing_attribution (
        id TEXT PRIMARY KEY,
        user_id TEXT NOT NULL,
        utm_source TEXT,
        utm_medium TEXT,
        utm_campaign TEXT,
        utm_term TEXT,
        utm_content TEXT,
        referrer TEXT,
        landing_page TEXT,
        created_at TEXT
      );

      CREATE TABLE IF NOT EXISTS referrals (
        id TEXT PRIMARY KEY,
        referrer_user_id TEXT,
        referred_user_id TEXT NOT NULL,
        referral_code TEXT NOT NULL,
        created_at TEXT
      );
    `);
  } catch (e) {
    console.warn("Error initializing SQLite schema:", e);
  }
}

/**
 * Save or update a waitlist user record into the local SQLite database
 */
export function saveRecordToSqlite(record: WaitlistUserRecord) {
  const db = getLocalSqliteDb();
  if (!db) return;

  try {
    const stmt = db.prepare(`
      INSERT INTO waitlist_users (
        id, name, email, country, whatsapp_number,
        email_verified, verification_token, verification_token_expires, verified_at,
        marketing_consent, referral_code, referred_by, referral_count,
        preferred_product_type, expected_usage_frequency, beta_interest,
        other_challenge, user_suggestions, primary_feature, device_platform,
        challenges_json, features_json, attribution_json,
        created_at, updated_at
      ) VALUES (
        ?, ?, ?, ?, ?,
        ?, ?, ?, ?,
        ?, ?, ?, ?,
        ?, ?, ?,
        ?, ?, ?, ?,
        ?, ?, ?,
        ?, ?
      )
      ON CONFLICT(id) DO UPDATE SET
        name=excluded.name,
        email_verified=excluded.email_verified,
        verified_at=excluded.verified_at,
        referral_count=excluded.referral_count,
        updated_at=excluded.updated_at;
    `);

    stmt.run(
      record.id,
      record.name || null,
      record.email.toLowerCase().trim(),
      record.country,
      record.whatsapp_number || null,
      record.email_verified ? 1 : 0,
      record.verification_token || null,
      record.verification_token_expires || null,
      record.verified_at || null,
      record.marketing_consent ? 1 : 0,
      record.referral_code,
      record.referred_by || null,
      record.referral_count || 0,
      record.preferred_product_type || null,
      record.expected_usage_frequency || null,
      record.beta_interest || null,
      record.other_challenge || null,
      record.user_suggestions || null,
      record.primary_feature || null,
      record.device_platform || null,
      JSON.stringify(record.challenges || []),
      JSON.stringify(record.features || []),
      JSON.stringify(record.attribution || {}),
      record.created_at,
      record.updated_at
    );

    // Normalized challenges
    if (record.challenges && record.challenges.length > 0) {
      const deleteChallenges = db.prepare("DELETE FROM user_challenges WHERE user_id = ?");
      deleteChallenges.run(record.id);

      const insertChallenge = db.prepare(`
        INSERT INTO user_challenges (id, user_id, challenge, created_at)
        VALUES (?, ?, ?, ?)
      `);
      for (const ch of record.challenges) {
        insertChallenge.run(`${record.id}_${ch}`, record.id, ch, record.created_at);
      }
    }

    // Normalized attribution
    if (record.attribution) {
      const deleteAttr = db.prepare("DELETE FROM marketing_attribution WHERE user_id = ?");
      deleteAttr.run(record.id);

      const insertAttr = db.prepare(`
        INSERT INTO marketing_attribution (
          id, user_id, utm_source, utm_medium, utm_campaign, utm_term, utm_content, referrer, landing_page, created_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `);
      insertAttr.run(
        `attr_${record.id}`,
        record.id,
        record.attribution.utm_source || "direct",
        record.attribution.utm_medium || "none",
        record.attribution.utm_campaign || "organic",
        record.attribution.utm_term || "",
        record.attribution.utm_content || "",
        record.attribution.referrer || "direct",
        record.attribution.landing_page || "/",
        record.created_at
      );
    }
  } catch (err) {
    console.warn("SQLite record save note:", err);
  }
}

/**
 * Load all records from the local SQLite database
 */
export function loadAllRecordsFromSqlite(): WaitlistUserRecord[] | null {
  const db = getLocalSqliteDb();
  if (!db) return null;

  try {
    const rows = db.prepare("SELECT * FROM waitlist_users ORDER BY created_at DESC").all();
    if (!rows || rows.length === 0) return null;

    return rows.map((r: any) => ({
      id: r.id,
      name: r.name || undefined,
      email: r.email,
      country: r.country,
      whatsapp_number: r.whatsapp_number || undefined,
      email_verified: Boolean(r.email_verified),
      verification_token: r.verification_token || undefined,
      verification_token_expires: r.verification_token_expires || undefined,
      verified_at: r.verified_at || undefined,
      marketing_consent: Boolean(r.marketing_consent),
      referral_code: r.referral_code,
      referred_by: r.referred_by || undefined,
      referral_count: Number(r.referral_count) || 0,
      preferred_product_type: r.preferred_product_type || undefined,
      expected_usage_frequency: r.expected_usage_frequency || undefined,
      beta_interest: r.beta_interest || undefined,
      other_challenge: r.other_challenge || undefined,
      user_suggestions: r.user_suggestions || undefined,
      primary_feature: r.primary_feature || undefined,
      device_platform: r.device_platform || undefined,
      challenges: safeParseJson(r.challenges_json, []),
      features: safeParseJson(r.features_json, []),
      attribution: safeParseJson(r.attribution_json, undefined),
      created_at: r.created_at,
      updated_at: r.updated_at,
    }));
  } catch (e) {
    console.warn("Error reading from SQLite:", e);
    return null;
  }
}

function safeParseJson(str: string | null | undefined, fallback: any) {
  if (!str) return fallback;
  try {
    return JSON.parse(str);
  } catch {
    return fallback;
  }
}

