-- ============================================================================
-- DIGITAL TAQWA — Complete Production PostgreSQL Database Schema
-- Compatible with Supabase SQL Editor & standard PostgreSQL 14+
-- A Project by Barakah Habits Daily
-- ============================================================================

-- 1. Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============================================================================
-- TABLE 1: waitlist_users
-- Core identity, verification state, contact coordinates & referral code
-- ============================================================================
CREATE TABLE IF NOT EXISTS waitlist_users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT,
    email TEXT NOT NULL,
    country TEXT NOT NULL,
    whatsapp_number TEXT,
    
    -- Verification & Consent
    email_verified BOOLEAN DEFAULT FALSE,
    verification_token TEXT,
    verification_token_expires TIMESTAMPTZ,
    verified_at TIMESTAMPTZ,
    marketing_consent BOOLEAN DEFAULT FALSE,
    
    -- Referral Program
    referral_code TEXT UNIQUE NOT NULL,
    referred_by TEXT,
    referral_count INTEGER DEFAULT 0,
    
    -- Research Survey Responses
    preferred_product_type TEXT,
    expected_usage_frequency TEXT,
    beta_interest TEXT DEFAULT 'Yes, I am interested',
    other_challenge TEXT,
    user_suggestions TEXT,
    primary_feature TEXT,
    device_platform TEXT,

    -- Timestamps
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for waitlist_users
CREATE UNIQUE INDEX IF NOT EXISTS idx_waitlist_users_lower_email 
    ON waitlist_users (LOWER(TRIM(email)));

CREATE INDEX IF NOT EXISTS idx_waitlist_users_country 
    ON waitlist_users (country);

CREATE INDEX IF NOT EXISTS idx_waitlist_users_email_verified 
    ON waitlist_users (email_verified);

CREATE INDEX IF NOT EXISTS idx_waitlist_users_created_at 
    ON waitlist_users (created_at DESC);

CREATE INDEX IF NOT EXISTS idx_waitlist_users_referral_code 
    ON waitlist_users (referral_code);

CREATE INDEX IF NOT EXISTS idx_waitlist_users_referred_by 
    ON waitlist_users (referred_by);


-- ============================================================================
-- TABLE 2: user_challenges
-- Normalized storage of spiritual & digital challenges faced by each user
-- ============================================================================
CREATE TABLE IF NOT EXISTS user_challenges (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES waitlist_users(id) ON DELETE CASCADE,
    challenge_key TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_user_challenges_user_id 
    ON user_challenges (user_id);

CREATE INDEX IF NOT EXISTS idx_user_challenges_key 
    ON user_challenges (challenge_key);


-- ============================================================================
-- TABLE 3: feature_interests
-- Desired features and capabilities voted on by the community
-- ============================================================================
CREATE TABLE IF NOT EXISTS feature_interests (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES waitlist_users(id) ON DELETE CASCADE,
    feature_key TEXT NOT NULL,
    is_primary BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_feature_interests_user_id 
    ON feature_interests (user_id);

CREATE INDEX IF NOT EXISTS idx_feature_interests_key 
    ON feature_interests (feature_key);

CREATE INDEX IF NOT EXISTS idx_feature_interests_primary 
    ON feature_interests (is_primary);


-- ============================================================================
-- TABLE 4: usage_priorities
-- Priorities that drive regular usage (e.g. morning routine, adhkhar, Salah)
-- ============================================================================
CREATE TABLE IF NOT EXISTS usage_priorities (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES waitlist_users(id) ON DELETE CASCADE,
    priority_key TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_usage_priorities_user_id 
    ON usage_priorities (user_id);


-- ============================================================================
-- TABLE 5: marketing_attribution
-- Anonymous campaign attribution (UTMs, referrer, landing page)
-- ============================================================================
CREATE TABLE IF NOT EXISTS marketing_attribution (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES waitlist_users(id) ON DELETE CASCADE,
    utm_source TEXT DEFAULT 'direct',
    utm_medium TEXT DEFAULT 'none',
    utm_campaign TEXT DEFAULT 'organic',
    utm_content TEXT DEFAULT '',
    utm_term TEXT DEFAULT '',
    referrer TEXT DEFAULT 'direct',
    landing_page TEXT DEFAULT '/',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_marketing_attribution_user_id 
    ON marketing_attribution (user_id);

CREATE INDEX IF NOT EXISTS idx_marketing_attribution_source 
    ON marketing_attribution (utm_source);

CREATE INDEX IF NOT EXISTS idx_marketing_attribution_campaign 
    ON marketing_attribution (utm_campaign);


-- ============================================================================
-- TABLE 6: referrals
-- Bidirectional connection linking the inviter to the invited lead
-- ============================================================================
CREATE TABLE IF NOT EXISTS referrals (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    referrer_user_id UUID REFERENCES waitlist_users(id) ON DELETE SET NULL,
    referred_user_id UUID NOT NULL REFERENCES waitlist_users(id) ON DELETE CASCADE,
    referral_code TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_referrals_referrer_user_id 
    ON referrals (referrer_user_id);

CREATE INDEX IF NOT EXISTS idx_referrals_code 
    ON referrals (referral_code);


-- ============================================================================
-- TABLE 7: admin_activity_logs
-- Audit log of administrative actions (data export, status reviews)
-- ============================================================================
CREATE TABLE IF NOT EXISTS admin_activity_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    action TEXT NOT NULL,
    metadata JSONB DEFAULT '{}'::jsonb,
    ip_address TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_admin_activity_action 
    ON admin_activity_logs (action);


-- ============================================================================
-- TRIGGERS & AUTOMATION FUNCTIONS
-- ============================================================================

-- A. Auto-update updated_at timestamp on waitlist_users
CREATE OR REPLACE FUNCTION update_timestamp()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_waitlist_users_updated_at ON waitlist_users;
CREATE TRIGGER trg_waitlist_users_updated_at
    BEFORE UPDATE ON waitlist_users
    FOR EACH ROW
    EXECUTE FUNCTION update_timestamp();


-- B. Auto-increment referral_count on referrer when a referral is logged
CREATE OR REPLACE FUNCTION increment_referral_count()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.referrer_user_id IS NOT NULL THEN
        UPDATE waitlist_users
        SET referral_count = referral_count + 1
        WHERE id = NEW.referrer_user_id;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_increment_referral_count ON referrals;
CREATE TRIGGER trg_increment_referral_count
    AFTER INSERT ON referrals
    FOR EACH ROW
    EXECUTE FUNCTION increment_referral_count();


-- ============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES & LEAST-PRIVILEGE ROLE ACCESS
-- ============================================================================
REVOKE ALL ON ALL TABLES IN SCHEMA public FROM anon, authenticated, public;
REVOKE ALL ON ALL SEQUENCES IN SCHEMA public FROM anon, authenticated, public;
REVOKE ALL ON ALL ROUTINES IN SCHEMA public FROM anon, authenticated, public;

ALTER DEFAULT PRIVILEGES IN SCHEMA public REVOKE ALL ON TABLES FROM anon, authenticated, public;
ALTER DEFAULT PRIVILEGES IN SCHEMA public REVOKE ALL ON SEQUENCES FROM anon, authenticated, public;
ALTER DEFAULT PRIVILEGES IN SCHEMA public REVOKE ALL ON ROUTINES FROM anon, authenticated, public;

GRANT USAGE ON SCHEMA public TO anon, authenticated, service_role;

ALTER TABLE waitlist_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_challenges ENABLE ROW LEVEL SECURITY;
ALTER TABLE feature_interests ENABLE ROW LEVEL SECURITY;
ALTER TABLE usage_priorities ENABLE ROW LEVEL SECURITY;
ALTER TABLE marketing_attribution ENABLE ROW LEVEL SECURITY;
ALTER TABLE referrals ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_activity_logs ENABLE ROW LEVEL SECURITY;

-- 1. Grant least-privilege table permissions to anon & authenticated
-- Public intake tables: INSERT only (no SELECT/UPDATE/DELETE permissions)
GRANT INSERT ON TABLE public.waitlist_users TO anon, authenticated;
GRANT INSERT ON TABLE public.user_challenges TO anon, authenticated;
GRANT INSERT ON TABLE public.feature_interests TO anon, authenticated;
GRANT INSERT ON TABLE public.usage_priorities TO anon, authenticated;
GRANT INSERT ON TABLE public.marketing_attribution TO anon, authenticated;
GRANT INSERT ON TABLE public.referrals TO anon, authenticated;

-- Allow sequence usage for IDs
GRANT USAGE ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated;

-- Admin logs: Completely blocked from public roles (zero permissions)
REVOKE ALL ON TABLE public.admin_activity_logs FROM anon, authenticated;

-- Service role: Trusted server-side backend operations ONLY
GRANT ALL ON ALL TABLES IN SCHEMA public TO service_role;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO service_role;
GRANT ALL ON ALL ROUTINES IN SCHEMA public TO service_role;

ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO service_role;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO service_role;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON ROUTINES TO service_role;

-- 2. Strict Row Level Security Policies

-- waitlist_users: Strict INSERT check, zero public SELECT to prevent email harvesting
CREATE POLICY "p_anon_insert_waitlist_users" 
    ON waitlist_users FOR INSERT
    TO anon, authenticated
    WITH CHECK (
        email IS NOT NULL AND
        email LIKE '%@%.%' AND
        marketing_consent IS TRUE
    );

CREATE POLICY "p_service_role_all_waitlist_users" 
    ON waitlist_users FOR ALL
    TO service_role
    USING (true)
    WITH CHECK (true);

-- user_challenges: Private community survey responses
CREATE POLICY "p_anon_insert_user_challenges" 
    ON user_challenges FOR INSERT
    TO anon, authenticated
    WITH CHECK (user_id IS NOT NULL AND challenge_key IS NOT NULL);

CREATE POLICY "p_service_role_all_user_challenges" 
    ON user_challenges FOR ALL
    TO service_role
    USING (true)
    WITH CHECK (true);

-- feature_interests: Private feature preferences
CREATE POLICY "p_anon_insert_feature_interests" 
    ON feature_interests FOR INSERT
    TO anon, authenticated
    WITH CHECK (user_id IS NOT NULL AND feature_key IS NOT NULL);

CREATE POLICY "p_service_role_all_feature_interests" 
    ON feature_interests FOR ALL
    TO service_role
    USING (true)
    WITH CHECK (true);

-- usage_priorities: Private daily habit preferences
CREATE POLICY "p_anon_insert_usage_priorities" 
    ON usage_priorities FOR INSERT
    TO anon, authenticated
    WITH CHECK (user_id IS NOT NULL AND priority_key IS NOT NULL);

CREATE POLICY "p_service_role_all_usage_priorities" 
    ON usage_priorities FOR ALL
    TO service_role
    USING (true)
    WITH CHECK (true);

-- marketing_attribution: Private UTM & analytics data
CREATE POLICY "p_anon_insert_marketing_attribution" 
    ON marketing_attribution FOR INSERT
    TO anon, authenticated
    WITH CHECK (user_id IS NOT NULL);

CREATE POLICY "p_service_role_all_marketing_attribution" 
    ON marketing_attribution FOR ALL
    TO service_role
    USING (true)
    WITH CHECK (true);

-- referrals: Private referral linkages
CREATE POLICY "p_anon_insert_referrals" 
    ON referrals FOR INSERT
    TO anon, authenticated
    WITH CHECK (referred_user_id IS NOT NULL AND referral_code IS NOT NULL);

CREATE POLICY "p_service_role_all_referrals" 
    ON referrals FOR ALL
    TO service_role
    USING (true)
    WITH CHECK (true);

-- admin_activity_logs: Completely inaccessible to anon
CREATE POLICY "p_service_role_all_admin_activity_logs" 
    ON admin_activity_logs FOR ALL
    TO service_role
    USING (true)
    WITH CHECK (true);

-- 3. Secure Public Helper Function (No data leakage)
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

