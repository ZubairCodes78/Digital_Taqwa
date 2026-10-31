# Digital Taqwa — Database & Infrastructure Setup Guide

Digital Taqwa is engineered with a **resilient dual-database architecture**:
1. **Local SQLite Database (`.data/digital_taqwa.sqlite`)**: An embedded relational SQL database engine that runs locally with zero external setup, perfect for development and self-hosted environments.
2. **Production PostgreSQL (Supabase)**: Scalable cloud relational database with Row Level Security (RLS), relational triggers, and normalized indexes for global production deployments.

---

## 1. Local Database (Zero-Config SQLite)

The platform comes with an **automatic embedded SQLite database engine** (`src/lib/sqliteDb.ts`).
- **File location**: `.data/digital_taqwa.sqlite`
- **Tables created automatically**:
  - `waitlist_users`: Complete user records, referral codes, verification status.
  - `user_challenges`: Normalized relational table of community struggles.
  - `feature_interests`: Survey feature demand and priorities.
  - `marketing_attribution`: UTM source, campaign, referrer.
  - `referrals`: Referral linkages and inviter attribution.

### Inspect Local Database:
You can inspect the local SQLite database at any time from your terminal:
```bash
npm run db:view
```
This prints the active user count, verification rates, and recent signups in an interactive ASCII table.

---

## 2. Production Setup with Supabase (PostgreSQL)

When you are ready to deploy to production (e.g. Vercel, Railway, AWS):

### Step 1: Create a Supabase Project
1. Go to [https://supabase.com](https://supabase.com) and create an account.
2. Click **New Project** and name it `digital-taqwa`.

### Step 2: Run the SQL Schema Migration
1. In your Supabase Dashboard, open the **SQL Editor** from the left navigation.
2. Click **New query**.
3. Copy and paste the contents of `supabase/migrations/20261031_digital_taqwa_schema.sql`.
4. Click **Run** (or press `Ctrl+Enter`).
5. All tables, automated referral triggers, and security policies will be created immediately.

### Step 3: Configure Environment Variables
Copy `.env.example` to `.env.local` (or set in Vercel):
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
```

---

## 3. Admin Dashboard Access
- URL: `/admin`
- Enter your configured `ADMIN_PASSWORD`.
- View real-time lead counts, feature demand breakdown, country distribution, and 1-click UTF-8 CSV exports.
