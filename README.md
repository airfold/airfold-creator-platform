# airfold Creator Platform

Creator dashboard for the airfold mini-app platform. Creators sign in with the same account they use in the airfold iOS app and see real analytics, earnings, and health scores for their published apps.

<p align="center">
  <img src="public/icon.png" alt="airfold" width="80" />
</p>

<p align="center">
  <img src="public/banner.png" alt="The new era of social apps" width="100%" />
</p>

## Dashboard Tabs

### Overview
The main dashboard screen. Shows a monthly payout summary (total earned, cap usage with rollover messaging), a horizontal scrollable row of compact app cards (QAU + earnings per app), and key stats (total QAU, active apps, health score, monthly earnings). If a creator has more than 4 apps, a "Show all" toggle expands the full list.

**API**: `GET /v1/creator/earnings` — returns weekly earnings breakdown for all apps.

### Earnings
Detailed earnings view with a bar chart showing weekly QAU and earnings over the last 8 weeks, plus a weekly breakdown table. Shows cap progress — when the monthly $5,000 cap is hit, it tells the creator the excess rolls over to the next month's payout cycle. Supports per-app filtering via the app selector.

**API**: `GET /v1/creator/earnings` (all apps) or `GET /v1/creator/earnings/app/{appId}` (single app).

### Analytics
Usage analytics: DAU sparkline, retention rate, average session duration, and total sessions. Displays weekly trends in a line chart. Per-app filtering supported.

**API**: `GET /v1/analytics/creator` — aggregates from ClickHouse `app_events`.

### Leaderboard
Ranked list of top creators by QAU. Supports weekly/monthly/all-time period switching. Shows the current creator's rank highlighted. Top 3 get colored rank badges.

**API**: `GET /v1/leaderboard?period={week|month|all}&limit=20`

### Calculator
Interactive earnings estimator. Drag a slider to set projected QAU, see estimated weekly and monthly earnings with cap visualization. Pure client-side — no API calls.

### Health Score
Traffic quality dashboard. Shows an overall health score (0-100), eligibility status, and individual metrics: same-IP percentage, bounce rate, average session duration, app rating, and any flags. Per-app filtering supported.

**API**: `GET /v1/creator/health` (aggregated) or `GET /v1/app/{appId}/health` (single app).

---

## Architecture

```
┌──────────────────┐      Clerk JWT       ┌────────────────────┐
│  Creator Platform │ ──────────────────▶  │   airfold API      │
│  (React SPA)      │                      │   (FastAPI/GCR)    │
└──────────┬────────┘                      └────────┬───────────┘
           │                                        │
           │  GET /v1/creator/*  (earnings, health) │ Neon PostgreSQL
           │  GET /v1/leaderboard (rankings)        │   ↕
           │  GET /v1/app/*/health (per-app)        │ ClickHouse Cloud
           │  GET /v1/analytics/* (usage stats)     │   ↕
           │                                        │ app_events table
           └────────────────────────────────────────┘
                                                      ↑
                                              Cloudflare Dispatcher
                                              writes 'view' event on
                                              every mini-app request
```

### Authentication (Clerk SSO)

The creator platform uses **the same Clerk instance** (`clerk.airfold.co`) as the main airfold iOS app:

1. **Single identity** — a creator who signs up in the iOS app already has an account.
2. **JWT flow** — Clerk issues a JWT on sign-in. The React app sends it as `Authorization: Bearer <jwt>` to the API.
3. **No separate registration** — if you have an airfold account, you can access the creator dashboard.

### Dev Mode

A "DEV SKIP" button on the login page enables dev mode, which bypasses Clerk auth and uses mock data for all API calls. This lets you run the dashboard without a backend.

## QAU Definition

**QAU** = **Qualified Active User** — a user who opens a creator's app on **3+ different days** in a week, with each session **at least 1 minute** long. Must be authenticated with a verified .edu email and not flagged as bot/fake traffic.

## Payment Structure

- **$2 per QAU per week** — flat rate
- Weekly cap: **$2,000** | Monthly cap: **$5,000**
- **Payouts are monthly** — earnings accumulate weekly, paid out once per month
- If the monthly cap is hit, the excess amount rolls over to the next month's payout cycle

## Tech Stack

- **React 18** + **Vite** + **TypeScript**
- **@clerk/clerk-react** — authentication (same Clerk instance as iOS app)
- **Tailwind CSS v4** — airfold light theme with custom `@theme` variables
- **Recharts** — charts (bar, line, area)
- **React Router v6** — client-side routing
- **Framer Motion** — page animations and transitions
- **Croogla 4F** — custom brand font for "airfold" text
- **Haptic feedback** — `navigator.vibrate()` on main CTAs for mobile

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
# Edit .env if needed (defaults point to production)
```

### Development
```bash
npm run dev
```
Open [http://localhost:5173](http://localhost:5173)

### Network Access (LAN)
```bash
npx vite --host 0.0.0.0
```

### Build
```bash
npm run build
```

## Folder Structure

```
src/
  components/          # Shared UI (Logo, StatCard, Badge, Charts, AppSelector)
  context/             # Auth hooks (wraps Clerk, dev mode toggle)
  data/                # Mock data (18 creators with varied patterns)
  hooks/               # Custom hooks (useAnimatedNumber, useCreatorData)
  services/            # API client (sends Clerk JWT to backend)
  layouts/
    PublicLayout/      # Landing + Login
    DashboardLayout/   # Bottom nav with haptic feedback (post-login)
  pages/
    Landing/           # Platform home with featured creators
    Login/             # Clerk SignIn + dev skip
    Dashboard/
      Overview/        # Monthly payout summary, horizontal app cards, stats
      Earnings/        # Weekly charts, breakdown table, cap rollover
      Analytics/       # DAU, retention, sessions
      Leaderboard/     # Top creators ranking with period filter
      Calculator/      # Interactive earnings estimator
      HealthScore/     # Traffic quality, flags, eligibility
  types/               # TypeScript interfaces
  utils/
    earnings.ts        # Earnings calculations and formatting
    haptic.ts          # Haptic feedback utility
  App.tsx              # ClerkProvider + Router setup
  main.tsx             # Entry point
  index.css            # Tailwind config + brand font + custom utilities
public/
  fonts/
    croogla_4f-regular.otf  # Brand font for "airfold" text
```

## API Endpoints Summary

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/v1/creator/earnings` | GET | Weekly earnings for all creator's apps |
| `/v1/creator/earnings/app/{appId}` | GET | Weekly earnings for a single app |
| `/v1/creator/health` | GET | Aggregated health score across all apps |
| `/v1/app/{appId}/health` | GET | Health metrics for a single app |
| `/v1/leaderboard` | GET | Top creators ranked by QAU |
| `/v1/analytics/creator` | GET | Usage analytics (DAU, retention, sessions) |
| `/v1/app` | GET | List of creator's apps |

## Roadmap

- [x] Clerk authentication (same SSO as iOS app)
- [x] API service layer (JWT-authenticated calls to backend)
- [x] Analytics endpoints (ClickHouse queries via API)
- [x] Creator earnings endpoints (backend)
- [x] Health score endpoints (backend)
- [x] Leaderboard endpoint (backend)
- [x] Wire dashboard pages to real API (with dev mode fallback to mocks)
- [x] Brand font (Croogla 4F) for airfold text
- [x] Haptic feedback on mobile CTAs
- [x] Monthly payout messaging with cap rollover
- [ ] Stripe payout integration
- [ ] Admin panel for reviewing flagged creators
- [ ] Real-time QAU tracking
- [ ] Creator messaging / support chat
- [ ] Public creator profiles

## License

MIT License - see [LICENSE](LICENSE) for details.
