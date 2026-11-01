-- ============================================================================
-- DIGITAL TAQWA — RESEARCH-LED SURVEY SCHEMA DOCUMENTATION & ENHANCEMENTS
-- Migration: 20261101_research_led_survey.sql
-- ============================================================================

-- Ensure usage_priorities table exists for Question 2 (Current Workarounds)
CREATE TABLE IF NOT EXISTS public.usage_priorities (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.waitlist_users(id) ON DELETE CASCADE,
    priority_key VARCHAR(255) NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Index for analytics and fast retrieval
CREATE INDEX IF NOT EXISTS idx_usage_priorities_user_id ON public.usage_priorities(user_id);
CREATE INDEX IF NOT EXISTS idx_usage_priorities_key ON public.usage_priorities(priority_key);

-- Enable RLS
ALTER TABLE public.usage_priorities ENABLE ROW LEVEL SECURITY;

-- Grants
GRANT INSERT ON TABLE public.usage_priorities TO anon, authenticated;
GRANT ALL ON TABLE public.usage_priorities TO service_role;

-- Policies for usage_priorities
DROP POLICY IF EXISTS "p_anon_insert_usage_priorities" ON public.usage_priorities;
DROP POLICY IF EXISTS "p_service_role_all_usage_priorities" ON public.usage_priorities;

CREATE POLICY "p_anon_insert_usage_priorities"
    ON public.usage_priorities FOR INSERT
    TO anon, authenticated
    WITH CHECK (
        user_id IS NOT NULL AND
        priority_key IS NOT NULL AND
        length(priority_key) > 0
    );

CREATE POLICY "p_service_role_all_usage_priorities"
    ON public.usage_priorities FOR ALL
    TO service_role
    USING (true)
    WITH CHECK (true);

-- Comments clarifying the research architecture mapping
COMMENT ON TABLE public.user_challenges IS 'Research Question 1: Attention struggles and divided focus (e.g. mindless scrolling, scattered prayer attention).';
COMMENT ON TABLE public.usage_priorities IS 'Research Question 2: Current workarounds & behaviors (e.g. standard prayer apps, phone blockers, physical mushaf).';
COMMENT ON TABLE public.feature_interests IS 'Research Question 3: Why existing apps fail & churn drivers (e.g. notification fatigue, streak guilt, robotic checklist).';
COMMENT ON COLUMN public.waitlist_users.marketing_consent IS 'Optional consent to receive occasional research findings from Digital Taqwa.';
