# airfold Creator Platform

Creator dashboard for the airfold mini-app platform. Accessible exclusively from the airfold iOS app — no standalone web sign-in. Creators see real analytics, earnings, and health scores for their published apps.

<p align="center">
  <img src="public/icon.png" alt="airfold" width="80" />
</p>

<p align="center">
  <img src="public/banner.png" alt="The new era of social apps" width="100%" />
</p>

## Architecture

```
┌──────────────────┐      Clerk JWT       ┌────────────────────┐
│  Creator Platform │ ──────────────────▶  │   airfold API      │
│  (React SPA)      │                      │   (FastAPI/GCR)    │
└──────────┬────────┘                      └────────┬───────────┘
           │                                        │
           │  GET /v1/creator/*  (earnings, health) │ Neon PostgreSQL
           │  GET /v1/leaderboard (rankings)        │   ↕
           │  GET /v1/analytics/* (usage stats)     │ ClickHouse Cloud
           │                                        │   ↕
           │                                        │ app_events table
           └────────────────────────────────────────┘
                                                      ↑
                                              Cloudflare Dispatcher
                                              writes 'view' event on
                                              every mini-app request
```

### Authentication (iOS app only)

The creator dashboard has **no standalone web sign-in**. It is opened from within the airfold iOS app:

1. **Native JWT injection** — the iOS app opens the dashboard in a WKWebView and injects the Clerk JWT into `sessionStorage` before page load via `WKUserScript`.
2. **No web login flow** — visiting `creators.airfold.co` directly shows a landing page with featured creators and an App Store link. There is no sign-in button on the web.
3. **Token-based auth** — the React app reads the JWT from `sessionStorage('native_token')` and sends it as `Authorization: Bearer <jwt>` to the API.

### Dev Mode

A small "DEV" toggle next to the logo in the dashboard header enables dev mode, which bypasses auth and uses mock data for all API calls. This lets you run the dashboard without a backend or the iOS app. Toggling dev mode reloads the page.

---

## Dashboard Tabs

### Overview
Hero earnings card showing this month's total, a progress bar toward the $5,000 monthly cap, and inline stats (this week's earnings, QAU count, health score). Below that, a tappable 8-week QAU sparkline linking to the Earnings tab, and a list of all apps sorted by QAU with per-app earnings. "Show all" toggle if you have more than 4 apps.

**API**: `GET /v1/creator/earnings`, `GET /v1/creator/health`

### Earnings
Bar chart showing weekly payouts over the last 8 weeks (aggregated by week when viewing all apps), plus a breakdown table with QAU, gross, and capped payout per week. Shows cap progress — when the monthly $5,000 cap is hit, a notice explains the excess rolls over. Supports per-app filtering via the app selector.

**API**: `GET /v1/creator/earnings` (all apps) or `GET /v1/creator/earnings/app/{appId}` (single app)

### Analytics
Usage analytics: DAU area chart (30 days), summary stats (views + unique users), QAU vs unique users bar chart, and retention curve. Per-app filtering supported via the app selector.

**API**: `GET /v1/analytics/creator`, `GET /v1/analytics/app/{appId}`

### Health
Traffic quality dashboard. Tells creators whether their app usage is healthy enough to qualify for payouts — shown in plain language, not raw numbers. Per-app filtering supported.

**How the score works:**

The API queries the last 7 days of `app_events` from ClickHouse and computes three metrics:

| Metric | What it measures | Penalty |
|--------|-----------------|---------|
| Same-IP % | % of users with >5 views from one source — detects bot/fake traffic | >30% → −30 pts, >15% → −10 pts |
| Bounce rate | % of users who only visited once — no repeat usage | >60% → −25 pts, >40% → −10 pts |
| Avg session time | Average seconds per session (first to last event per user per day) | <30s → −25 pts, <60s → −10 pts |

Score starts at 100, penalties are subtracted, then clamped to 0–100:
- **80–100** → Eligible (green) — qualifies for payouts
- **50–79** → At risk (orange) — needs improvement
- **0–49** → Under review (red) — payouts paused

**Examples:**

> **Healthy app (score 100):** 5% same-IP, 25% bounce rate, avg session 3m 20s. No penalties — all metrics are well within limits. Creator gets full payouts.

> **Decent app (score 80):** 18% same-IP (−10), 35% bounce rate (ok), avg session 45s (−10). Loses 20 points but still eligible at 80. Close to the edge though.

> **Struggling app (score 55):** 8% same-IP (ok), 65% bounce rate (−25, flagged), avg session 20s (−25, flagged). Two flags, score drops to 50–55. At risk — creator sees "Needs attention" with tips to fix.

> **Flagged app (score 15):** 40% same-IP (−30, flagged), 70% bounce rate (−25, flagged), avg session 15s (−25, flagged). All three flags hit. Score crashes to 20 or below. Payouts paused until fixed.

**What the creator sees:**

- Big color-coded score (80 = green, 55 = orange, 30 = red)
- **Avg time in app** — "Users are sticking around" or "Users leave too quickly"
- **One-time visitors** — bounce rate framed as retention (are users coming back?)
- **User authenticity** — organic traffic % (inverted from same-IP %, so 97% = good)
- **Flags** — friendly fix suggestions (e.g., "Sessions are under 1 minute — add more content to keep users in")
- **(i) info button** — bottom sheet explaining the 3 QAU rules (3+ days/week, 1 min/session, not flagged)

**API**: `GET /v1/creator/health` (aggregated) or `GET /v1/creator/health/app/{appId}` (single app)

### Leaderboard
Ranked list of top creators by QAU. Supports weekly/monthly/all-time period switching. Current creator's row is highlighted with `(You)` tag and tinted background. Shows QAU count, earnings, and app count per entry.

**API**: `GET /v1/leaderboard?period={week|month|all}&limit=20`

---

## UX Patterns

- **Skeleton loading** — all pages show animated pulse placeholders on initial load (hero card, charts, metric cards, leaderboard rows)
- **Smooth app switching** — `keepPreviousData` (React Query) keeps old data visible during refetch; content dims to 50% opacity during transition instead of flashing a skeleton
- **Haptic feedback** — `navigator.vibrate()` on taps for mobile (nav items, buttons, app cards)
- **Bottom sheet** — QAU rules info sheet slides up from bottom with backdrop blur, dismissible by tap-outside or "Got it" button

---

## Payment Structure

### What is a QAU?

**QAU** = **Qualified Active User**. Not every user counts — they have to meet all of these conditions:

1. **3+ different days** in a single week (Mon–Sun) — opening the app once doesn't count
2. **Minimum 1 minute per session** — quick bounces are filtered out
3. **Authenticated** — signed in via phone number or Apple ID (Clerk)
4. **Not flagged** — no bot traffic, no fake accounts, no same-IP farming

If a user opens your app twice on Monday and once on Tuesday, that's only 2 days — not a QAU. They need to come back on a third day, spending at least 1 minute each time.

### How earnings are calculated

- **$2 per QAU per week** — flat rate, no tiers
- QAU counts are calculated every Monday for the previous week
- **Weekly cap**: $2,000 per app (= 1,000 QAU max per app per week)
- **Monthly cap**: $5,000 per creator
- **Payouts are monthly** — weekly earnings accumulate, paid out once at the end of the month
- If you hit the monthly cap, the excess rolls over to the next month's payout cycle
- Earnings are per-creator (summed across all your apps), not per-app

## Stripe Connect Payouts

Creators receive payouts via **Stripe Connect Express**. Stripe handles KYC, identity verification, and bank account setup. Airfold handles earnings calculation and payout execution.

### How it works

```
┌──────────────┐    ┌──────────────┐    ┌──────────────┐    ┌──────────────┐
│  Creator      │    │  airfold API │    │    Stripe    │    │  Creator's   │
│  Dashboard    │───▶│  (FastAPI)   │───▶│   Connect    │───▶│  Bank Acct   │
│  Earnings tab │    │              │    │              │    │              │
└──────────────┘    └──────────────┘    └──────────────┘    └──────────────┘
     Setup ▲              │                    │
     button │         Transfer $           Auto-payout
             │         (weekly)            to bank
             └─────────────────────────────────┘
                    Stripe hosted onboarding
```

### Creator onboarding flow

1. Creator opens the **Earnings** tab in the dashboard
2. Sees a **"Set up payouts"** card at the top (if no Stripe account connected)
3. Taps the button → redirected to Stripe's hosted onboarding (KYC, bank details, tax info)
4. Stripe redirects back to `/dashboard/stripe-callback`
5. Callback page polls the API until the account is verified, then redirects to Earnings
6. Card now shows **"Payouts active"** with a green checkmark

Three card states:
- **Not connected** — "Set up payouts" button
- **Onboarding incomplete** — "Complete setup" button (warns them to finish)
- **Connected & enabled** — "Payouts active" (green checkmark)

### Stripe Connect API endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/v1/stripe/connect/status` | GET | Current account status (has_account, onboarding_complete, payouts_enabled) |
| `/v1/stripe/connect/onboard` | POST | Create Express account + return Stripe onboarding URL |
| `/v1/stripe/connect/refresh-link` | POST | Generate new onboarding link (if previous expired) |
| `/v1/stripe/webhooks` | POST | Stripe webhook — handles `account.updated` events (no auth, verified by signature) |

### Weekly admin payout

Payouts are triggered manually via an admin endpoint — not automated, so you control when money goes out.

```bash
# Pay all eligible creators for last completed week
curl -X POST https://airfold-api-mfyi64k65q-uc.a.run.app/v1/admin/run-payouts \
  -H "x-admin-secret: $ADMIN_SECRET"

# Pay for a specific week
curl -X POST "https://airfold-api-mfyi64k65q-uc.a.run.app/v1/admin/run-payouts?week_start=2026-02-03" \
  -H "x-admin-secret: $ADMIN_SECRET"
```

**What it does:**
1. Queries ClickHouse for all published apps' QAU for the target week
2. Groups by creator and computes capped earnings ($2/QAU, $2,000/app/week cap)
3. For each creator with a connected Stripe account (`payouts_enabled = true`):
   - Skips if already paid for that week (idempotent — safe to re-run)
   - Creates a Stripe Transfer from your balance → creator's connected account
   - Records the payout in the `payouts` table
4. Returns a summary: creators paid, total amount, skipped, errors

**Response example:**
```json
{
  "week_start": "2026-02-03",
  "total_paid_cents": 124000,
  "creators_paid": 8,
  "creators_skipped": 3,
  "payouts": [
    { "user_id": "...", "amount_cents": 24000, "total_qau": 120, "app_count": 2, "stripe_transfer_id": "tr_..." }
  ],
  "errors": []
}
```

**Prerequisites:**
- Stripe balance must have enough funds (top up via Stripe Dashboard → Balance → Add to balance)
- Creators must have completed Stripe onboarding (`payouts_enabled = true`)
- `ADMIN_SECRET` env var must be set on the API

### Stripe environment variables (API)

| Variable | Description |
|----------|-------------|
| `STRIPE_SECRET_KEY` | Stripe API secret key (`sk_test_...` or `sk_live_...`) |
| `STRIPE_WEBHOOK_SECRET` | Webhook signing secret (`whsec_...`) |
| `STRIPE_CONNECT_RETURN_URL` | Where Stripe redirects after onboarding (default: `https://creators.airfold.co/dashboard/stripe-callback`) |
| `STRIPE_CONNECT_REFRESH_URL` | Where Stripe redirects if link expires (default: `https://creators.airfold.co/dashboard/earnings`) |
| `ADMIN_SECRET` | Secret key for admin endpoints (`x-admin-secret` header) |

### Database tables

- **`stripe_connect_accounts`** — Maps users to Stripe Express accounts (onboarding status, payouts_enabled)
- **`payouts`** — Payout history (amount, week, transfer ID). Unique constraint on `(user_id, week_start)` prevents double-paying.

---

## Tech Stack

- **React 18** + **Vite** + **TypeScript**
- **Tailwind CSS v4** — airfold light theme with custom `@theme` variables
- **TanStack React Query** — data fetching with `keepPreviousData` for smooth transitions
- **Recharts** — charts (bar, line, area, sparklines)
- **React Router v6** — client-side routing
- **Framer Motion** — landing page animations
- **Croogla 4F** — custom brand font for "airfold" text
- **Haptic feedback** — `navigator.vibrate()` on main CTAs for mobile
- **Cloudflare Pages** — auto-deploys from `main` branch

## Getting Started

### Prerequisites
- Node.js 18+
- npm

### Install
```bash
git clone https://github.com/airfold/airfold-creator-platform.git
cd airfold-creator-platform
npm install
```

### Environment
```bash
cp .env.example .env
# Edit .env if needed (defaults point to production API)
```

| Variable | Default | Description |
|----------|---------|-------------|
| `VITE_API_URL` | `https://airfold-api-...run.app` | Production API |
| `VITE_API_URL` (dev) | `http://localhost:8000` | Local API (`.env.development`) |

### Development
```bash
npm run dev
```
Open [http://localhost:5173](http://localhost:5173)

### Build
```bash
npm run build
```

## Folder Structure

```
src/
  components/          # Shared UI (Logo, SparklineChart, AppSelector)
  context/             # AuthContext (native JWT + dev mode), AppContext (selected app)
  data/                # Mock data (creators, platform stats — used in dev mode + landing)
  hooks/               # useCreatorData (all dashboard data hooks with dev/prod switching)
  services/            # API client (JWT-authenticated fetch calls)
  layouts/
    PublicLayout/      # Landing page wrapper (no auth)
    DashboardLayout/   # Bottom nav + dev mode toggle (authenticated)
  pages/
    Landing/           # Marketing page with featured creators + App Store link
    Dashboard/
      Overview/        # Hero earnings card, QAU sparkline, app list
      Earnings/        # Weekly bar chart, breakdown table, cap rollover, payout status card
      StripeCallback/  # Post-onboarding verification page (polls status, redirects to earnings)
      Analytics/       # DAU, QAU vs unique, retention
      HealthScore/     # Plain-language metrics, flags, QAU rules info sheet
      Leaderboard/     # Creator ranking with period filter
  utils/
    earnings.ts        # Earnings calculations and formatting
    haptic.ts          # Haptic feedback utility
  App.tsx              # Router setup + React Query client
  main.tsx             # Entry point
  index.css            # Tailwind config, brand font, custom utilities, animations
public/
  fonts/
    croogla_4f-regular.otf  # Brand font
```

## API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/v1/creator/earnings` | GET | Weekly earnings across all creator's apps (last 8 weeks) |
| `/v1/creator/earnings/app/{appId}` | GET | Weekly earnings for a single app |
| `/v1/creator/health` | GET | Aggregated health score across all apps |
| `/v1/creator/health/app/{appId}` | GET | Health metrics for a single app |
| `/v1/leaderboard` | GET | Creator leaderboard ranked by QAU (`?period=week\|month\|all`) |
| `/v1/analytics/creator` | GET | Creator analytics (DAU, views, geo, devices) |
| `/v1/analytics/app/{appId}` | GET | Per-app analytics |
| `/v1/app` | GET | List of creator's published apps |
| `/v1/stripe/connect/status` | GET | Stripe Connect account status |
| `/v1/stripe/connect/onboard` | POST | Create account + onboarding URL |
| `/v1/stripe/connect/refresh-link` | POST | New onboarding link (if expired) |
| `/v1/stripe/webhooks` | POST | Stripe webhook (no auth) |
| `/v1/admin/run-payouts` | POST | Execute weekly payouts (admin secret required) |

## Deployment

Pushes to `main` auto-deploy to **Cloudflare Pages** at `creators.airfold.co`.

## Roadmap

- [x] Native JWT auth (iOS app WKWebView injection)
- [x] API service layer (JWT-authenticated calls to backend)
- [x] Analytics endpoints (ClickHouse queries via API)
- [x] Creator earnings endpoints
- [x] Health score endpoints with plain-language UI
- [x] Leaderboard endpoint
- [x] QAU rules info sheet
- [x] Skeleton loading states on all pages
- [x] Smooth app switching (keepPreviousData + opacity transitions)
- [x] Wire dashboard pages to real API (with dev mode fallback to mocks)
- [x] Brand font (Croogla 4F) for airfold text
- [x] Haptic feedback on mobile CTAs
- [x] Monthly payout messaging with cap rollover
- [x] Remove standalone web login (app-only access)
- [x] Cloudflare Pages deployment
- [ ] Health score computation pipeline (scheduled job)
- [x] Stripe Connect Express payout integration
- [x] Admin weekly payout endpoint
- [ ] Admin panel for reviewing flagged creators
- [ ] Real-time QAU tracking
- [ ] Creator messaging / support chat
- [ ] Public creator profiles

## License

MIT License - see [LICENSE](LICENSE) for details.
