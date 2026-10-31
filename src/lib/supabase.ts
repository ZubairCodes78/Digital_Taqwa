import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseAnonKey =
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  "";
/**
 * Server-only guard: Ensure service role key is strictly evaluated on the server
 * and NEVER exposed to or instantiated in client-side bundles.
 */
const isServer = typeof window === "undefined";
const supabaseServiceKey = isServer ? process.env.SUPABASE_SERVICE_ROLE_KEY : undefined;

export const isSupabaseConfigured = Boolean(
  supabaseUrl && supabaseUrl.startsWith("http") && supabaseAnonKey
);

/**
 * Standard Supabase client for client-side or anon usage (Least-privilege)
 */
export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

/**
 * Admin Supabase client with service role key for trusted server operations ONLY.
 * Guaranteed to be null in browser environments.
 */
export const supabaseAdmin =
  isServer && isSupabaseConfigured && supabaseServiceKey
    ? createClient(supabaseUrl, supabaseServiceKey, {
        auth: {
          autoRefreshToken: false,
          persistSession: false,
        },
      })
    : null;

