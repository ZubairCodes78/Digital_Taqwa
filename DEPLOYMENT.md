# DIGITAL TAQWA — Production Deployment Guide

This guide details how to deploy Digital Taqwa to Vercel and connect Supabase and Resend for production.

---

## 1. Prerequisites

- A [Vercel](https://vercel.com) account.
- A [Supabase](https://supabase.com) account & project.
- A [Resend](https://resend.com) account with a verified domain (optional for email sending).

---

## 2. Supabase Database Migration

1. In your Supabase Dashboard, navigate to the **SQL Editor**.
2. Open or paste the migration file from your repository:
   `supabase/migrations/20261031_digital_taqwa_schema.sql`
3. Click **Run**.
4. Confirm the following tables exist:
   - `waitlist_users`
   - `user_challenges`
   - `feature_interests`
   - `marketing_attribution`
   - `referrals`
5. Row Level Security (RLS) is automatically enabled with restricted policies.

---

## 3. Vercel Deployment

1. Push your repository to GitHub / GitLab / Bitbucket.
2. In Vercel, click **Add New Project** and select your repository.
3. In the **Environment Variables** section, configure:

| Variable | Description | Example / Recommended |
|---|---|---|
| `NEXT_PUBLIC_APP_URL` | Production website URL | `https://digitaltaqwa.com` |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase Project URL | `https://xxxxxx.supabase.co` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase Anonymous Key | `eyJhbGciOi...` |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase Service Role Secret | `eyJhbGciOi...` |
| `ADMIN_PASSWORD` | Passphrase to access `/admin` | Choose a strong password |
| `RESEND_API_KEY` | Resend API Key | `re_xxxxxxxxxxxx` |
| `EMAIL_FROM` | Verified sender address | `Digital Taqwa <onboarding@digitaltaqwa.com>` |
| `NEXT_PUBLIC_GA_ID` | Google Analytics 4 Measurement ID | `G-XXXXXXXXXX` (Optional) |
| `NEXT_PUBLIC_META_PIXEL_ID` | Meta Pixel ID | `123456789012345` (Optional) |

4. Click **Deploy**.

---

## 4. Post-Deployment Verification

1. **Verify Landing Page**: Visit your custom domain. Check responsive typography and dark luxury styling.
2. **Submit Test Waitlist Form**: Complete all 3 steps. Verify that:
   - Lead appears in the Supabase `waitlist_users` table.
   - Associated rows in `user_challenges` and `feature_interests` are created.
   - UTM attribution is logged correctly.
3. **Verify Email Workflow**:
   - If Resend is active, check the recipient inbox for the branded email.
   - Click the confirmation button and verify that `email_verified` changes to `true`.
4. **Log into `/admin`**:
   - Access `https://your-domain.com/admin`.
   - Enter your `ADMIN_PASSWORD`.
   - Verify KPI cards, feature preference distribution charts, campaign analytics, and download the CSV export.

