-- ============================================================================
-- DIGITAL TAQWA — LEAST PRIVILEGE DATABASE PERMISSIONS & RLS POLICIES
-- Review and run this script in your Supabase SQL Editor.
-- Enforces zero data leakage: anon has INSERT-only intake permissions.
-- Sensitive survey answers, leads, referrals, and admin logs cannot be read publicly.
-- ============================================================================

-- 1. REVOKE ALL DEFAULT PERMISSIONS FROM PUBLIC & UNTRUSTED ROLES
REVOKE ALL ON ALL TABLES IN SCHEMA public FROM anon, authenticated, public;
REVOKE ALL ON ALL SEQUENCES IN SCHEMA public FROM anon, authenticated, public;
REVOKE ALL ON ALL ROUTINES IN SCHEMA public FROM anon, authenticated, public;

ALTER DEFAULT PRIVILEGES IN SCHEMA public REVOKE ALL ON TABLES FROM anon, authenticated, public;
ALTER DEFAULT PRIVILEGES IN SCHEMA public REVOKE ALL ON SEQUENCES FROM anon, authenticated, public;
ALTER DEFAULT PRIVILEGES IN SCHEMA public REVOKE ALL ON ROUTINES FROM anon, authenticated, public;

-- 2. GRANT MINIMAL SCHEMA USAGE
GRANT USAGE ON SCHEMA public TO anon, authenticated, service_role;

-- 3. ENABLE ROW LEVEL SECURITY (RLS) ON EVERY TABLE
ALTER TABLE IF EXISTS waitlist_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS user_challenges ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS feature_interests ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS usage_priorities ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS marketing_attribution ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS referrals ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS admin_activity_logs ENABLE ROW LEVEL SECURITY;

-- 4. GRANT LEAST-PRIVILEGE TABLE ACCESS TO ANON & AUTHENTICATED
-- Public visitors only need to INSERT their intake data.
-- No SELECT, UPDATE, or DELETE permissions granted to anon.
GRANT INSERT ON TABLE public.waitlist_users TO anon, authenticated;
GRANT INSERT ON TABLE public.user_challenges TO anon, authenticated;
GRANT INSERT ON TABLE public.feature_interests TO anon, authenticated;
GRANT INSERT ON TABLE public.usage_priorities TO anon, authenticated;
GRANT INSERT ON TABLE public.marketing_attribution TO anon, authenticated;
GRANT INSERT ON TABLE public.referrals TO anon, authenticated;

-- Allow sequence usage for auto-generated UUIDs/IDs
GRANT USAGE ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated;

-- Admin logs: Completely blocked from anon and authenticated (zero permissions)
-- (No grant given to anon or authenticated on admin_activity_logs)

-- 5. SERVICE ROLE: SERVER-SIDE BACKEND EXCLUSIVE ACCESS
-- Only the trusted Node.js server using SUPABASE_SERVICE_ROLE_KEY has administrative rights
GRANT ALL ON ALL TABLES IN SCHEMA public TO service_role;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO service_role;
GRANT ALL ON ALL ROUTINES IN SCHEMA public TO service_role;

ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO service_role;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO service_role;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON ROUTINES TO service_role;

-- 6. DROP OLD / OVERLY BROAD POLICIES
DROP POLICY IF EXISTS "Allow public insert to waitlist_users" ON waitlist_users;
DROP POLICY IF EXISTS "Allow public select for verification token" ON waitlist_users;
DROP POLICY IF EXISTS "Allow public update for email verification" ON waitlist_users;
DROP POLICY IF EXISTS "Allow service role full access to waitlist_users" ON waitlist_users;
DROP POLICY IF EXISTS "p_anon_insert_waitlist_users" ON waitlist_users;
DROP POLICY IF EXISTS "p_anon_deny_select_waitlist_users" ON waitlist_users;
DROP POLICY IF EXISTS "p_service_role_all_waitlist_users" ON waitlist_users;

DROP POLICY IF EXISTS "Allow public insert to user_challenges" ON user_challenges;
DROP POLICY IF EXISTS "Allow service role full access to user_challenges" ON user_challenges;
DROP POLICY IF EXISTS "p_anon_insert_user_challenges" ON user_challenges;
DROP POLICY IF EXISTS "p_service_role_all_user_challenges" ON user_challenges;

DROP POLICY IF EXISTS "Allow public insert to feature_interests" ON feature_interests;
DROP POLICY IF EXISTS "Allow service role full access to feature_interests" ON feature_interests;
DROP POLICY IF EXISTS "p_anon_insert_feature_interests" ON feature_interests;
DROP POLICY IF EXISTS "p_service_role_all_feature_interests" ON feature_interests;

DROP POLICY IF EXISTS "Allow public insert to usage_priorities" ON usage_priorities;
DROP POLICY IF EXISTS "Allow service role full access to usage_priorities" ON usage_priorities;
DROP POLICY IF EXISTS "p_anon_insert_usage_priorities" ON usage_priorities;
DROP POLICY IF EXISTS "p_service_role_all_usage_priorities" ON usage_priorities;

DROP POLICY IF EXISTS "Allow public insert to marketing_attribution" ON marketing_attribution;
DROP POLICY IF EXISTS "Allow service role full access to marketing_attribution" ON marketing_attribution;
DROP POLICY IF EXISTS "p_anon_insert_marketing_attribution" ON marketing_attribution;
DROP POLICY IF EXISTS "p_service_role_all_marketing_attribution" ON marketing_attribution;

DROP POLICY IF EXISTS "Allow public insert to referrals" ON referrals;
DROP POLICY IF EXISTS "Allow service role full access to referrals" ON referrals;
DROP POLICY IF EXISTS "p_anon_insert_referrals" ON referrals;
DROP POLICY IF EXISTS "p_service_role_all_referrals" ON referrals;

DROP POLICY IF EXISTS "Allow service role full access to admin_activity_logs" ON admin_activity_logs;
DROP POLICY IF EXISTS "p_service_role_all_admin_activity_logs" ON admin_activity_logs;

-- 7. DEFINE STRICT RLS POLICIES FOR INTAKE & PRIVACY

-- TABLE 1: waitlist_users
-- Strict INSERT check: valid email format & marketing consent must be provided
CREATE POLICY "p_anon_insert_waitlist_users"
    ON waitlist_users FOR INSERT
    TO anon, authenticated
    WITH CHECK (
        email IS NOT NULL AND
        email LIKE '%@%.%' AND
        marketing_consent IS TRUE
    );

-- Strict Privacy: Service role only has full access (server-side Next.js API)
CREATE POLICY "p_service_role_all_waitlist_users"
    ON waitlist_users FOR ALL
    TO service_role
    USING (true)
    WITH CHECK (true);

-- TABLE 2: user_challenges (Private community struggle votes)
CREATE POLICY "p_anon_insert_user_challenges"
    ON user_challenges FOR INSERT
    TO anon, authenticated
    WITH CHECK (user_id IS NOT NULL AND challenge_key IS NOT NULL);

CREATE POLICY "p_service_role_all_user_challenges"
    ON user_challenges FOR ALL
    TO service_role
    USING (true)
    WITH CHECK (true);

-- TABLE 3: feature_interests (Private feature preferences)
CREATE POLICY "p_anon_insert_feature_interests"
    ON feature_interests FOR INSERT
    TO anon, authenticated
    WITH CHECK (user_id IS NOT NULL AND feature_key IS NOT NULL);

CREATE POLICY "p_service_role_all_feature_interests"
    ON feature_interests FOR ALL
    TO service_role
    USING (true)
    WITH CHECK (true);

-- TABLE 4: usage_priorities (Private usage routines)
CREATE POLICY "p_anon_insert_usage_priorities"
    ON usage_priorities FOR INSERT
    TO anon, authenticated
    WITH CHECK (user_id IS NOT NULL AND priority_key IS NOT NULL);

CREATE POLICY "p_service_role_all_usage_priorities"
    ON usage_priorities FOR ALL
    TO service_role
    USING (true)
    WITH CHECK (true);

-- TABLE 5: marketing_attribution (Private analytics & UTM data)
CREATE POLICY "p_anon_insert_marketing_attribution"
    ON marketing_attribution FOR INSERT
    TO anon, authenticated
    WITH CHECK (user_id IS NOT NULL);

CREATE POLICY "p_service_role_all_marketing_attribution"
    ON marketing_attribution FOR ALL
    TO service_role
    USING (true)
    WITH CHECK (true);

-- TABLE 6: referrals (Private referral linkages)
CREATE POLICY "p_anon_insert_referrals"
    ON referrals FOR INSERT
    TO anon, authenticated
    WITH CHECK (referred_user_id IS NOT NULL AND referral_code IS NOT NULL);

CREATE POLICY "p_service_role_all_referrals"
    ON referrals FOR ALL
    TO service_role
    USING (true)
    WITH CHECK (true);

-- TABLE 7: admin_activity_logs (Audit trail)
-- Zero public access; service role server-only
CREATE POLICY "p_service_role_all_admin_activity_logs"
    ON admin_activity_logs FOR ALL
    TO service_role
    USING (true)
    WITH CHECK (true);

-- 8. SECURE PUBLIC HELPER FUNCTION (NO DATA LEAKAGE)
-- Instead of exposing waitlist_users to public SELECT,
-- provide a secure function that ONLY returns true/false if a referral code exists.
CREATE OR REPLACE FUNCTION public.validate_referral_code(code TEXT)
RETURNS BOOLEAN
LANGUAGE sql
SECURITY DEFINER
STABLE
AS $$
  SELECT EXISTS(
    SELECT 1 FROM public.waitlist_users WHERE referral_code = trim(code)
  );
$$;

GRANT EXECUTE ON FUNCTION public.validate_referral_code(TEXT) TO anon, authenticated, service_role;
