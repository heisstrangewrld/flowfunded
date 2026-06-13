# FlowFunded — Agent Handoff Document
> Last updated: June 2026 | Status: Phase 2 Complete ✅

This document gives a new agent (Claude or otherwise) everything needed to understand the codebase and continue building without any prior conversation context.

---

## 1. What Is FlowFunded?

A **proprietary trading firm platform** — traders pay to take evaluation challenges, prove their skill, and get funded with simulated capital up to $200K. They keep 80–90% of profits.

**Competitors for reference:** FTMO, MyForexFunds, The Funded Trader.

**Tech Stack:**
- Next.js 16.2.7 (App Router, TypeScript)
- React 19, Tailwind CSS 4
- Supabase (Auth + Postgres DB)
- Framer Motion (animations)
- Recharts (performance charts)
- Lucide React (icons)

**Repo:** `https://github.com/heisstrangewrld/flowfunded.git`

---

## 2. How to Run Locally

```bash
git clone https://github.com/heisstrangewrld/flowfunded.git
cd flowfunded
npm install

# Create .env.local with your Supabase credentials:
echo "NEXT_PUBLIC_SUPABASE_URL=https://YOUR_PROJECT.supabase.co" >> .env.local
echo "NEXT_PUBLIC_SUPABASE_ANON_KEY=YOUR_ANON_KEY" >> .env.local

npm run dev
# Open http://localhost:3000
```

**Required: Run the Supabase schema first** (see Section 5).

---

## 3. Full Project File Structure

```
flowfunded/
├── supabase_schema.sql          ← DB migration (run this in Supabase SQL Editor)
├── AUTHENTICATION_SETUP.md      ← Supabase auth setup guide
├── AGENT_HANDOFF.md             ← This file
├── package.json
├── next.config.mjs
├── tsconfig.json
├── postcss.config.mjs
│
└── src/
    ├── app/
    │   ├── layout.tsx           ← Root layout, wraps AuthProvider + Navbar + Footer
    │   ├── globals.css          ← Design tokens, glass-panel, neon glow utilities
    │   ├── page.tsx             ← Landing page (hero, challenge configurator, payout feed, FAQ CTA)
    │   ├── dashboard/
    │   │   └── page.tsx         ← Main trader dashboard (Phase 2 rebuilt — real data)
    │   ├── login/page.tsx       ← Login form (Supabase email/password)
    │   ├── signup/page.tsx      ← Signup form
    │   ├── account/page.tsx     ← Account settings (stub — needs building)
    │   ├── leaderboard/page.tsx ← Leaderboard (currently mock data)
    │   ├── faq/page.tsx         ← FAQ page (static)
    │   └── rules/page.tsx       ← Rules page (static)
    │
    ├── components/
    │   ├── Navbar.tsx           ← Responsive navbar, auth-aware
    │   ├── Footer.tsx           ← Site footer
    │   ├── ChallengeConfigurator.tsx ← Interactive pricing/challenge selector on landing page
    │   ├── LivePayoutFeed.tsx   ← Scrolling marquee of recent payouts (mock data)
    │   └── dashboard/
    │       ├── PerformanceChart.tsx  ← Recharts area chart (equity curve, 7D/14D/30D/ALL)
    │       ├── ChallengeTracker.tsx  ← Phase progress stepper + rule violation alerts
    │       ├── OpenPositions.tsx     ← Live trades table
    │       └── PayoutFlow.tsx        ← Payout request modal + history table
    │
    ├── context/
    │   └── AuthContext.tsx      ← Global auth state (useAuth hook)
    │
    ├── lib/
    │   ├── supabase.ts          ← Supabase client singleton
    │   └── db.ts                ← All DB access helpers (challenges, trades, payouts, snapshots)
    │
    └── types/
        └── database.ts          ← TypeScript types: Profile, Challenge, Trade, EquitySnapshot, Payout
```

---

## 4. Design System

**Colors (from `globals.css`):**
```
--background: #05070e        (deep space dark)
--primary:    #00f0ff        (neon cyan — primary brand colour)
--secondary:  #6366f1        (indigo/violet)
--accent:     #3b82f6        (blue)
--success:    #10b981        (emerald green)
--destructive:#ef4444        (red)
--muted:      #6b7280        (gray)
```

**Key CSS utilities:**
- `.glass-panel` — dark translucent card with backdrop-blur
- `.glass-panel-hover` — hover lift + cyan border glow
- `.text-neon-glow` — cyan text glow shadow
- `.border-neon-glow` — box shadow glow

**Conventions:**
- All cards: `rounded-xl glass-panel border border-white/5 p-6`
- Section headings: `text-lg font-bold text-white`
- Subtext: `text-sm text-gray-400`
- Primary buttons: `bg-primary text-black font-bold rounded-xl` with shadow `shadow-[0_0_20px_rgba(0,240,255,0.2)]`
- Ghost buttons: `bg-white/5 border border-white/10 text-gray-400 hover:text-white`

---

## 5. Database Schema

**Run `supabase_schema.sql` in your Supabase SQL Editor.** It creates:

| Table | Purpose |
|---|---|
| `profiles` | User profile (name, country, payout wallet). Auto-created on signup via trigger. |
| `challenges` | Each purchased challenge (account size, phase, status, balances, drawdown limits) |
| `trades` | Individual trade records linked to a challenge |
| `equity_snapshots` | Daily balance/equity snapshots for the performance chart |
| `payouts` | Payout requests with status tracking |

All tables have **Row Level Security (RLS)** — users can only see their own data.

**To seed test data after signing up:**
```sql
-- Get your user ID from Supabase Auth dashboard, then run:
INSERT INTO public.challenges (
  user_id, account_size, phase, status,
  profit_target, max_drawdown, daily_loss_limit,
  starting_balance, current_balance, peak_balance
) VALUES (
  'YOUR-USER-UUID', 50000, 1, 'active',
  0.08, 0.10, 0.05,
  50000, 52340, 52340
);
```

---

## 6. Data Flow — How the Dashboard Works

```
Dashboard page.tsx
  └── on mount: supabase.auth.getUser()
        ├── getActiveChallenge(userId)     → challenge state
        ├── getUserPayouts(userId)          → payouts state
        └── if challenge exists:
              ├── getOpenTrades(challenge.id)        → trades state
              ├── getEquitySnapshots(challenge.id)   → snapshots state
              └── getTradeSummary(challenge.id)      → win rate, total P&L

All helpers are in src/lib/db.ts
All types are in src/types/database.ts
```

If no challenge is found → shows "No Active Challenge" CTA with link to `/` (landing/pricing).
If no equity snapshots → PerformanceChart shows **demo data** automatically.

---

## 7. What's Done (Phases 1 & 2)

### ✅ Phase 1 — Foundation
- Landing page (hero, stats, how-it-works, testimonials)
- Challenge configurator component (5 account sizes, interactive pricing)
- Live payout feed marquee (mock data for now)
- Supabase auth (login, signup, protected routes)
- Navbar (auth-aware), Footer
- FAQ page, Rules page

### ✅ Phase 2 — Real Dashboard
- **PerformanceChart** — Recharts equity curve with range selector, gradient fill, custom tooltip
- **ChallengeTracker** — Phase 1→2→3 stepper, profit progress bar, max drawdown + daily loss rule monitoring with warning/violation states
- **OpenPositions** — live trade table with BUY/SELL badges, P&L coloring, live indicator
- **PayoutFlow** — payout request modal (USDT/BTC/wire), history table with status badges
- **Dashboard page rebuilt** — all data loaded from Supabase, stat cards wired to real challenge data, no more hardcoded numbers
- Full DB schema (`supabase_schema.sql`) with RLS

---

## 8. What Needs to Be Built Next

### 🔴 Phase 3 — Revenue Layer (Build this first — it generates money)

#### A. Stripe Checkout
- Install: `npm install stripe @stripe/stripe-js`
- Add to `ChallengeConfigurator.tsx`: replace the `alert()` on "Start Challenge" with a call to `/api/checkout`
- Create `src/app/api/checkout/route.ts` — Stripe Checkout session, price based on account size:
  - $10K → $99, $25K → $199, $50K → $299, $100K → $499, $200K → $799
- Create `src/app/api/webhooks/stripe/route.ts` — on `checkout.session.completed`, insert a row in `challenges` table for the buyer
- Add env vars: `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`, `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
- Success redirect: `/dashboard?purchase=success`

#### B. Account Settings Page (`src/app/account/page.tsx`)
Currently a stub. Build:
- Profile section: full_name, country, avatar upload
- Payout wallet section: wallet address, preferred method (USDT/BTC/Wire)
- Security section: change password, 2FA hint
- Save changes → upsert to `profiles` table

#### C. Admin Panel (`src/app/admin/page.tsx`)
- Protected by checking `profiles.role = 'admin'` (add `role` column to profiles)
- Tables: all challenges, pending payouts (approve/reject), all users
- Approve payout → update `payouts.status = 'completed'`, add tx_hash

---

### 🟡 Phase 4 — Trader Experience

#### A. Live Leaderboard (replace mock data)
File: `src/app/leaderboard/page.tsx`
- Query `challenges` table joined with `profiles`, order by `(current_balance - starting_balance) / starting_balance DESC`
- Add filter tabs: This Week / This Month / All Time
- Show: rank, name, account size, % gain, phase

#### B. Affiliate / Referral System
- Add `referral_code` (unique, auto-generated) and `referred_by` columns to `profiles`
- Add `affiliate_earnings` table: `{ id, affiliate_id, referred_user_id, amount, paid_at }`
- Landing page: accept `?ref=CODE` query param, store in cookie
- On Stripe webhook: if referral cookie present, credit 10% of challenge fee to affiliate

#### C. Trading Journal (`src/app/journal/page.tsx`)
- New page with a form: symbol, direction, entry/exit, lot size, notes, emotion (dropdown), strategy tag
- Inserts to `trades` table (already exists)
- History table below with filters by date/symbol/direction

---

### 🟢 Phase 5 — Growth & Moat

#### A. FlowAcademy (`src/app/academy/page.tsx`)
- Video lessons grid (embed YouTube or Vimeo)
- Categories: Risk Management, Psychology, Strategy
- Static content is fine to start

#### B. Funded Certificate (PDF auto-generation)
- When `challenges.status` changes to `'funded'`, generate a PDF certificate
- Use `jsPDF` or a Supabase Edge Function
- Add "Download Certificate" button to dashboard when funded

#### C. Email Notifications (Supabase Edge Functions)
- Trigger on: challenge purchase, payout processed, rule violation warning
- Use Resend or SendGrid via Supabase Edge Function

---

## 9. Environment Variables Needed

```bash
# .env.local
NEXT_PUBLIC_SUPABASE_URL=https://YOUR_PROJECT.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key

# For Phase 3 (Stripe):
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...

# For Phase 5 (Email):
RESEND_API_KEY=re_...
```

---

## 10. Git Commit History

```
9c08389  Phase 2: Real dashboard — performance chart, challenge tracker, open positions, payout flow
79dd63a  Move Quick Navigation menu above Performance charts
4d13232  Add Quick Navigation menu to dashboard with 9 action buttons
5620714  Enhance dashboard with professional design inspired by reference
c3571b9  Add complete authentication system with Supabase
da61a4c  Fix Footer component: correct import icons and close Link tag
```

---

## 11. Known Issues / TODOs

| Item | File | Priority |
|---|---|---|
| `LivePayoutFeed` uses hardcoded mock payout names/amounts | `src/components/LivePayoutFeed.tsx` | Medium |
| Leaderboard uses hardcoded mock data | `src/app/leaderboard/page.tsx` | Medium |
| Account settings page is a stub | `src/app/account/page.tsx` | High |
| "Trade", "Withdraw", "Deposit", "Certificate" nav buttons on dashboard are unlinked | `src/app/dashboard/page.tsx` | Low |
| No Stripe checkout — "Start Challenge" shows alert() | `src/components/ChallengeConfigurator.tsx` | CRITICAL |
| No admin panel | — | High |
| Google Fonts removed (blocked in build env) — site uses system fonts | `src/app/layout.tsx` | Low — re-add `next/font/google` locally |

---

## 12. How to Re-add Google Fonts (Optional)

The build environment blocks Google Fonts CDN. To restore locally:

```tsx
// src/app/layout.tsx — add back at top:
import { Geist, Geist_Mono } from "next/font/google";
const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

// Then on the <html> tag:
<html className={`${geistSans.variable} ${geistMono.variable} h-full antialiased scroll-smooth`}>
```

---

## 13. Prompt to Give a New Agent

Copy-paste this to start a new session:

```
I'm building FlowFunded — a prop trading firm platform at https://github.com/heisstrangewrld/flowfunded.git

Please clone the repo and read AGENT_HANDOFF.md first — it has the full context, file structure, design system, and what needs to be built next.

Stack: Next.js 16, TypeScript, Tailwind CSS 4, Supabase, Recharts, Framer Motion.

Phases 1 and 2 are complete (landing page, auth, real dashboard with performance chart, challenge tracker, payout flow).

Next priority is Phase 3 — Stripe checkout. When a user clicks "Start Challenge" on the landing page, it should create a Stripe checkout session and on payment success, insert a challenge row in Supabase for that user.

Please read the AGENT_HANDOFF.md in the repo for full details before writing any code.
```
