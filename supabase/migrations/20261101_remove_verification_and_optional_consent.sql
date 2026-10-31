-- ============================================================================
-- DIGITAL TAQWA — MIGRATION: REMOVE EMAIL VERIFICATION & MAKE MARKETING CONSENT OPTIONAL
-- Migration date: 2026-11-01
-- ============================================================================

-- 1. Update waitlist_users default for email_verified to true
ALTER TABLE IF EXISTS public.waitlist_users 
  ALTER COLUMN email_verified SET DEFAULT true;

-- 2. Update existing unverified users to verified so no legacy users are locked out
UPDATE public.waitlist_users 
SET email_verified = true 
WHERE email_verified IS FALSE OR email_verified IS NULL;

-- 3. Update RLS policy on waitlist_users so marketing_consent is strictly optional
-- (anon insert requires valid non-empty email with @ and ., but marketing_consent can be false/true)
DROP POLICY IF EXISTS "p_anon_insert_waitlist_users" ON public.waitlist_users;

CREATE POLICY "p_anon_insert_waitlist_users"
    ON public.waitlist_users FOR INSERT
    TO anon, authenticated
    WITH CHECK (
        email IS NOT NULL AND
        email LIKE '%@%.%'
    );

-- 4. Ensure service_role maintains full server-side administrative access
DROP POLICY IF EXISTS "p_service_role_all_waitlist_users" ON public.waitlist_users;

CREATE POLICY "p_service_role_all_waitlist_users"
    ON public.waitlist_users FOR ALL
    TO service_role
    USING (true)
    WITH CHECK (true);

