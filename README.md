# Digital Taqwa — Immersive Islamic Digital Sanctuary

> **"Make Space for What Truly Matters."**  
> *A Project by Barakah Habits Daily.*  
> GitHub Repository: [https://github.com/ZubairCodes78/Digital_Taqwa](https://github.com/ZubairCodes78/Digital_Taqwa)

Digital Taqwa is a production-grade, immersive Islamic digital experience and market research platform designed to validate genuine community demand before developing native mobile applications.

Created in connection with **Barakah Habits Daily**, the platform blends cinematic 3D architectural environments, ambient Quran recitation, interactive 3D carousels, and an intelligent research survey to gather feedback from Muslims worldwide.

---

## 🌟 Key Features

1. **Cinematic 3D Islamic Architecture (Three.js / WebGL)**:
   - Dynamic 3D Islamic sacred geometry, floating polyhedra, and golden volumetric stardust.
   - Interactive camera orbit reacting to cursor movement and scroll depth.

2. **Sequential Ambient Quran Recitation Engine**:
   - Dual-track playlist streaming authentic recitations:
     - Track 1: *Surah Al-Mu’minun — Sheikh Yasser Al-Dosari*
     - Track 2: *Surah Al-Fajr ("Kalla Iza Dukkati Al-Ardu")*
   - Auto-plays the next track upon completion.
   - Automatic pause on browser blur / tab switch, and automatic restart on return.
   - Ultra-compact, single-line sound controller pill in the bottom right corner.

3. **Interactive 3D Sliding Carousel (`ThreeDCardCarousel.tsx`)**:
   - Hardware-accelerated CSS 3D perspective (`perspective: 1200px`) with multi-card rotation.
   - Touch-swipe support on mobile and auto-slide with pause-on-hover.

4. **Multi-Step Community Research Survey**:
   - Empathic questionnaire to understand real struggles with screen addiction and Salah consistency.
   - Instant unique referral code generation (`?ref=DT-XXXXXX`).
   - Bot protection (Honeypot + rate-limiting).

5. **Private Administrative Dashboard (`/admin`)**:
   - Real-time lead metrics, feature interest distribution, and country analytics.
   - Complete UTM campaign attribution breakdown.
   - 1-Click UTF-8 CSV data export.

6. **Dual Database Architecture (PostgreSQL + Local Fallback)**:
   - Production PostgreSQL integration with **Supabase** (RLS, triggers, indexes).
   - Zero-config local filesystem fallback (`.data/leads.json`) for seamless offline development.

---

## 🚀 Getting Started

### 1. Clone & Install
```bash
git clone https://github.com/ZubairCodes78/Digital_Taqwa.git
cd Digital_Taqwa
npm install
```

### 2. Environment Configuration
Copy `.env.example` to `.env.local`:
```bash
cp .env.example .env.local
```

Configure your credentials:
```env
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Supabase (Optional for local dev, required for production)
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Admin Dashboard Access
ADMIN_PASSWORD=YourSecurePasswordHere
```

### 3. Database Migration (Supabase)
Run `supabase/migrations/20261031_digital_taqwa_schema.sql` in your Supabase SQL Editor. See [DATABASE_SETUP.md](./DATABASE_SETUP.md) for full details.

### 4. Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) to view the application.

---

## 🛡️ Security & Privacy
Built with Islamic Data Ethics (Amanah). We never track spiritual confessions, private sins, or monetize community data with advertisers.
