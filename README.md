# airfold Creator Platform

Creator dashboard for the airfold mini-app platform. Runs exclusively inside the iOS app's WKWebView — no standalone web auth. Real-time analytics, earnings tracking, health scoring, and Stripe Connect payouts.

<p align="center">
  <img src="public/icon.png" alt="airfold" width="80" />
</p>

<p align="center">
  <img src="public/banner.png" alt="The new era of social apps" width="100%" />
</p>

## Architecture

```
┌──────────────────┐                          ┌────────────────────┐
│  iOS App          │  WKUserScript injects    │   airfold API      │
│  (WKWebView)      │  JWT → sessionStorage    │   (FastAPI / GCR)  │
└──────────┬────────┘                          └────────┬───────────┘
           │                                            │
           ▼                                            │
┌──────────────────┐   Authorization: Bearer <jwt>      │
│  Creator Platform │ ─────────────────────────────────▶ │
│  (React SPA)      │                                    │
└──────────────────┘                                    │
                                                        │
           GET /v1/creator/*  (earnings, health)        │ Neon PostgreSQL
           GET /v1/leaderboard (rankings)               │   ↕
           GET /v1/analytics/* (usage stats)            │ ClickHouse Cloud
           GET /v1/stripe/connect/* (payouts)           │   ↕
                                                        │ app_events table
                                                        │
                                                 Cloudflare Dispatcher
                                                 writes 'view' event on
                                                 every mini-app request
```

### Auth Flow

No web login. The iOS app injects a JWT + username into `sessionStorage` via `WKUserScript` at document start, before React hydrates. The `ProtectedRoute` component gates `/dashboard/*`:

1. Immediate check: `sessionStorage.getItem('native_token')` via `isNativeMode()`
2. Race condition guard: if token not found on first render, re-checks after 50ms (`setTimeout`) to handle WKWebView injection timing
3. DEV mode bypass: `import.meta.env.DEV` skips auth entirely
4. Fallback: redirects to `/` (landing page with App Store link)

Token is read in `authHeaders()` from `sessionStorage` and sent as `Authorization: Bearer <jwt>` on every API call.

---

## Tech Stack

| Layer | Tech |
|-------|------|
| Framework | React 18 + TypeScript + Vite |
| Styling | Tailwind CSS v4 (`@theme` tokens: `--color-af-tint`, `--color-af-deep-charcoal`, etc.) |
| Data | TanStack React Query (`keepPreviousData`, normalized query keys, per-hook `staleTime`) |
| Charts | Recharts (Bar, Area, Line) + custom `SparklineChart` (SVG with `useId()` for gradient uniqueness) |
| Routing | React Router v6 (nested under `/dashboard` with `ProtectedRoute` guard) |
| Animation | Framer Motion (landing page + progress bars) |
| Font | Croogla 4F (`public/fonts/croogla_4f-regular.otf`) |
| Haptics | `navigator.vibrate()` on nav items, buttons, app cards |
| Deploy | Cloudflare Pages — auto-deploy on push to `main` |

---

## API Integration

### Service Layer (`src/services/api.ts`)

- Base URL: `VITE_API_URL` (injected at build time from `.env`)
- Auth: `sessionStorage.getItem('native_token')` → `Authorization: Bearer`
- Error handling: parses response body for `detail` field, throws with message
- URL safety: `encodeURIComponent()` on path params, `URLSearchParams` for query strings

### Data Hooks (`src/hooks/useCreatorData.ts`)

All hooks call the real API. In Vite dev mode (`npm run dev`), `AuthContext` provides a mock user so you can test without the iOS app, but data always comes from the backend.

| Hook | Query Key | Endpoint | staleTime |
|------|-----------|----------|-----------|
| `useMyApps()` | `['myApps']` | `GET /v1/app` | 5 min |
| `useCreatorEarnings(appId?)` | `['creatorEarnings', appId ?? null]` | `GET /v1/creator/earnings[/app/{appId}]` | 5 min |
| `useCreatorHealth(appId?)` | `['creatorHealth', appId ?? null]` | `GET /v1/creator/health[/app/{appId}]` | 5 min |
| `usePayoutStatus()` | `['payoutStatus']` | `GET /v1/stripe/connect/status` | 30s, `refetchOnWindowFocus: true` |
| `useLeaderboard(period)` | `['leaderboard', period]` | `GET /v1/leaderboard?period=` | 5 min |
| `useAnalytics(appId?)` | `['analytics', appId ?? null]` | `GET /v1/analytics/creator` or `/app/{appId}` | 5 min |

Query keys are normalized (`appId ?? null`) to prevent cache fragmentation between `undefined` and `null`.

### All API Endpoints

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
| `/v1/stripe/webhooks` | POST | Stripe webhook (no auth, verified by signature) |
| `/v1/admin/run-payouts` | POST | Execute weekly payouts (admin secret required) |

---

## Dashboard Pages

### Overview (`/dashboard`)
Hero earnings card showing this month's total, a progress bar toward the $5,000 monthly cap, and inline stats (this week's earnings, QAU count, health score). Below that, a tappable 8-week QAU sparkline linking to the Earnings tab, and a list of all apps sorted by QAU with per-app earnings. "Show all" toggle if you have more than 4 apps.

### Earnings (`/dashboard/earnings`)
`PayoutCard` (Stripe Connect status) + weekly bar chart (Recharts) + breakdown table (QAU, gross, capped per week). Aggregates by `week_start` across apps in "All Apps" view. Cap rollover notice when monthly $5K exceeded. Per-app filtering via `AppSelector`.

### Analytics (`/dashboard/analytics`)
DAU area chart (30 days), summary stats, QAU bar chart, retention curve. Per-app filtering via `AppSelector`.

### Health (`/dashboard/health`)
Color-coded status card (green/orange/red based on score thresholds 80/50). Three metric rows: session time, returning users (inverted bounce rate), real traffic (inverted same-IP %). Each has its own status indicator. Score `null` → "No data yet" state. Info button opens `QAURulesSheet` bottom sheet explaining the 3 QAU qualification rules.

### Leaderboard (`/dashboard/leaderboard`)
Ranked list of top creators by QAU. Supports weekly/monthly/all-time period switching. Current creator's row is highlighted with `(You)` tag and tinted background. Shows QAU count, earnings, and app count per entry.

### Stripe Callback (`/dashboard/stripe-callback`)
Post-onboarding handler. Invalidates `payoutStatus` query cache, redirects to earnings.

---

## UX Patterns

- **Skeleton loading** — all pages show animated pulse placeholders on initial load (hero card, charts, metric cards, leaderboard rows)
- **Smooth app switching** — `keepPreviousData` (React Query) keeps old data visible during refetch; content dims to 50% opacity during transition instead of flashing a skeleton
- **Haptic feedback** — `navigator.vibrate()` on taps for mobile (nav items, buttons, app cards)
- **Bottom sheet** — QAU rules info sheet slides up from bottom with backdrop blur, dismissible by tap-outside or "Got it" button
- **Error resilience** — pages handle missing/failed data gracefully with `??` fallbacks and null states rather than error banners

---

## Payment Structure

### What is a QAU?

**QAU** = **Qualified Active User**. Not every user counts — they have to meet all of these:

1. **3+ different days** in a single week (Mon–Sun) — opening the app once doesn't count
2. **Minimum 1 minute per session** — quick bounces are filtered out
3. **Authenticated** — signed in via phone number or Apple ID
4. **Not flagged** — no bot traffic, no fake accounts, no same-IP farming

### Earnings

| Parameter | Value |
|-----------|-------|
| Rate | $2/QAU/week |
| Weekly cap | $2,000/app (1,000 QAU) |
| Monthly cap | $5,000/creator |
| Payout frequency | Weekly via Stripe Transfer |
| Excess | Rolls to next month |

### Health Score

The API queries the last 7 days of `app_events` from ClickHouse and computes three metrics. Score starts at 100, penalties are subtracted, clamped to 0–100:

| Metric | What it measures | Green | Orange | Red |
|--------|-----------------|-------|--------|-----|
| Same-IP % | Bot/fake traffic detection | ≤15% | >15% (−10) | >30% (−30) |
| Bounce rate | One-time visitors | ≤40% | >40% (−10) | >60% (−25) |
| Avg session | Time spent per visit | ≥60s | <60s (−10) | <30s (−25) |

Score → status: **≥80** green (eligible for payouts), **≥50** orange (at risk), **<50** red (payouts paused).

**What the creator sees:** big color-coded status, three metric rows with plain-language feedback (e.g. "Users stick around" vs "Sessions are too short — add more content"), and an info button with QAU qualification rules.

---

## Stripe Connect Payouts

Creators receive payouts via **Stripe Connect Express**. Stripe handles KYC, identity verification, and bank account setup. Airfold handles earnings calculation and payout execution.

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
5. Callback invalidates `payoutStatus` cache, then redirects to Earnings
6. Card now shows **"Payouts active"** with a green checkmark

Four card states (ordered by priority):
1. **Payouts active** — `payouts_enabled=true` → green checkmark, ready to receive transfers
2. **Pending verification** — `details_submitted=true` but payouts not yet enabled → blue info, "Stripe is reviewing, 1–2 business days"
3. **Setup incomplete** — `has_account=true` but details not submitted → amber warning + "Complete setup" button
4. **Not connected** — no Stripe account → "Set up payouts" button

URL validation: `res.url.startsWith('https://connect.stripe.com/')` before any redirect.

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
3. For each creator with a connected Stripe account: inserts payout record first (idempotent via `ON CONFLICT DO NOTHING`), then executes Stripe Transfer, updates status
4. Returns a summary: creators paid, total amount, skipped, errors

### Stripe env variables (API side)

| Variable | Description |
|----------|-------------|
| `STRIPE_SECRET_KEY` | Stripe API secret key (`sk_test_...` or `sk_live_...`) |
| `STRIPE_WEBHOOK_SECRET` | Webhook signing secret (`whsec_...`) |
| `STRIPE_CONNECT_RETURN_URL` | Redirect after onboarding (default: `creators.airfold.co/dashboard/stripe-callback`) |
| `STRIPE_CONNECT_REFRESH_URL` | Redirect if link expires (default: `creators.airfold.co/dashboard/earnings`) |
| `ADMIN_SECRET` | Secret for admin endpoints (`x-admin-secret` header), compared via `hmac.compare_digest` |

### Database tables

- **`stripe_connect_accounts`** — Maps users to Stripe Express accounts (onboarding status, payouts_enabled). Unique on `user_id`, idempotent create via `ON CONFLICT DO NOTHING`.
- **`payouts`** — Payout history (amount, week, transfer ID, status). Unique constraint on `(user_id, week_start)` prevents double-paying. `status` field tracks `pending` → `completed` / `failed`.

---

## Project Structure

```
src/
  App.tsx                  # Routes, ProtectedRoute (50ms race guard), ErrorBoundary, QueryClient
  main.tsx                 # Entry point
  index.css                # Tailwind v4 config, @theme tokens, brand font, animations
  components/
    AppSelector.tsx         # Dropdown for per-app filtering (shared across tabs)
    SparklineChart.tsx      # SVG sparkline with useId() gradient IDs
    Logo.tsx                # Brand logo
  context/
    AuthContext.tsx          # isNativeMode(), initNativeToken(), Vite DEV mock user
    AppContext.tsx           # selectedAppId state (shared across dashboard)
  hooks/
    useCreatorData.ts       # All React Query data hooks (always hit real API)
  services/
    api.ts                  # Authenticated fetch wrapper, Stripe onboarding calls
  utils/
    earnings.ts             # calculateWeeklyEarnings, calculateMonthlyEarnings, formatCurrency
    haptic.ts               # navigator.vibrate() wrapper
  data/
    creators.ts             # Mock data for dev mode + landing page
  layouts/
    PublicLayout/            # Landing page wrapper
    DashboardLayout/         # Bottom nav, dev toggle, tab routing
  pages/
    Landing/                 # Marketing page (no auth)
    Dashboard/
      Overview/              # Hero card, sparkline, app list
      Earnings/              # PayoutCard, bar chart, breakdown table
      Analytics/             # DAU, QAU charts, retention
      HealthScore/           # Score card, metric rows, QAURulesSheet
      Leaderboard/           # Rankings with period filter
      StripeCallback/        # Post-Stripe-onboarding handler
```

## Environment

| File | Variable | Value |
|------|----------|-------|
| `.env` | `VITE_API_URL` | `https://airfold-api-mfyi64k65q-uc.a.run.app` (prod) |
| `.env.development` | `VITE_API_URL` | `http://localhost:8000` |

`.env` is tracked in git (required for Cloudflare Pages build-time `VITE_*` injection). `.env.local` is gitignored for local overrides.

## Development

```bash
npm install
npm run dev          # localhost:5173, uses .env.development
npm run build        # production build
```

In Vite dev mode (`npm run dev`), auth is bypassed with a mock user — but you still need the API running on `localhost:8000` for data.

## Deployment

Push to `main` → Cloudflare Pages auto-deploys to `creators.airfold.co`.

## License

MIT
