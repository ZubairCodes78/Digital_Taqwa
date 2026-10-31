# Digital Taqwa — Database & Infrastructure Setup Guide

Digital Taqwa is engineered with a **dual database architecture**:
1. **Production PostgreSQL (Supabase)**: Scalable relational database with Row Level Security (RLS), relational triggers, and normalized indexes.
2. **Local Zero-Config Fallback**: Automatic local file storage engine (`.data/leads.json`) that works out-of-the-box in development even before connecting Supabase, ensuring zero crashes.

---

## 1. Quick Setup with Supabase (Production)

### Step 1: Create a Free Supabase Project
1. Go to [https://supabase.com](https://supabase.com) and create an account.
2. Click **New Project** and choose a project name (e.g. `digital-taqwa`).
3. Set a strong database password and select a region close to your target audience.

### Step 2: Run the SQL Schema Migration
1. In your Supabase Dashboard, open the **SQL Editor** from the left navigation.
2. Click **New query**.
3. Copy and paste the contents of `supabase/migrations/20261031_digital_taqwa_schema.sql`.
4. Click **Run** (or press `Ctrl+Enter`).
5. All 7 tables, automated referral triggers, and security policies will be created immediately:
   - `waitlist_users`
   - `user_challenges`
   - `feature_interests`
   - `usage_priorities`
   - `marketing_attribution`
   - `referrals`
   - `admin_activity_logs`

### Step 3: Configure Environment Variables
In your project root (or in your hosting provider's dashboard like Vercel):
Copy `.env.example` to `.env.local`:
```bash
cp .env.example .env.local
```

Fill in your Supabase credentials found in **Project Settings -> API**:
```env
NEXT_PUBLIC_APP_URL=https://your-domain.com

# Supabase API Credentials
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOi...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOi...

# Admin Dashboard Access
ADMIN_PASSWORD=YourSecurePasswordHere

# Optional: Email Verification via Resend
RESEND_API_KEY=re_your_key_here
EMAIL_FROM="Digital Taqwa <onboarding@yourdomain.com>"
```

---

## 2. Admin Dashboard Access
- URL: `/admin`
- Enter your configured `ADMIN_PASSWORD`.
- View real-time lead counts, feature demand breakdown, country distribution, and 1-click UTF-8 CSV exports.
