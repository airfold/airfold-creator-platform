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
           │  GET /v1/app/*/health (per-app)        │ ClickHouse Cloud
           │  GET /v1/analytics/* (usage stats)     │   ↕
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
2. **No web login flow** — visiting `creators.airfold.co` directly shows a landing page with an "Open in airfold App" link. There is no sign-in button on the web.
3. **Token-based auth** — the React app reads the JWT from `sessionStorage('native_token')` and sends it as `Authorization: Bearer <jwt>` to the API.

### Dev Mode

A small "DEV" button next to the logo in the dashboard header enables dev mode, which bypasses auth and uses mock data for all API calls. This lets you run the dashboard without a backend or the iOS app.

---

## Dashboard Tabs

### Overview
Hero earnings card showing the big number (this month's total), a progress bar toward the $5,000 monthly cap, and inline stats (this week's earnings, QAU count, health score). Below that, a tappable 8-week QAU sparkline linking to the Earnings tab, and a list of all your apps with per-app earnings and growth percentage. "Show all" toggle if you have more than 4 apps.

**API**: `GET /v1/creator/earnings`

### Earnings
Detailed earnings view with a bar chart showing weekly QAU and earnings over the last 8 weeks, plus a weekly breakdown table. Shows cap progress — when the monthly $5,000 cap is hit, it tells the creator the excess rolls over to the next month's payout cycle. Supports per-app filtering via the app selector.

**API**: `GET /v1/creator/earnings` (all apps) or `GET /v1/creator/earnings/app/{appId}` (single app)

### Analytics
Usage analytics: DAU sparkline, retention rate, average session duration, and total sessions. Displays weekly trends in a line chart. Per-app filtering supported.

**API**: `GET /v1/analytics/creator` — aggregates from ClickHouse `app_events`

### Leaderboard
Ranked list of top creators by QAU. Supports weekly/monthly/all-time period switching. Shows the current creator's rank highlighted. Top 3 get colored rank badges.

**API**: `GET /v1/leaderboard?period={week|month|all}&limit=20`

### Calculator
Interactive earnings estimator. Drag a slider to set projected QAU, see estimated weekly and monthly earnings. When the cap is reached, a rollover notice explains that excess earnings carry over to the next month's payout cycle. Pure client-side — no API calls.

### Health Score
Traffic quality dashboard. Shows an overall health score (0-100), eligibility status, and individual metrics: same-IP percentage, bounce rate, average session duration, app rating, and any flags. Per-app filtering supported.

**API**: `GET /v1/creator/health` (aggregated) or `GET /v1/app/{appId}/health` (single app)

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
- **Weekly cap**: $2,000 (= 1,000 QAU max per week)
- **Monthly cap**: $5,000
- **Payouts are monthly** — weekly earnings accumulate, paid out once at the end of the month
- If you hit the monthly cap, the excess rolls over to the next month's payout cycle
- Earnings are per-creator (summed across all your apps), not per-app

## Tech Stack

- **React 18** + **Vite** + **TypeScript**
- **Tailwind CSS v4** — airfold light theme with custom `@theme` variables
- **Recharts** — charts (bar, line, area, sparklines)
- **React Router v6** — client-side routing
- **Framer Motion** — page animations and transitions
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
  components/          # Shared UI (Logo, SparklineChart, AppSelector, Badge, ProgressBar)
  context/             # Auth hooks (native JWT + dev mode), AppContext
  data/                # Mock data (creators, platform stats)
  hooks/               # Custom hooks (useCreatorData)
  services/            # API client (sends JWT to backend)
  layouts/
    PublicLayout/      # Landing page (no login)
    DashboardLayout/   # Bottom nav with haptic feedback (authenticated)
  pages/
    Landing/           # Marketing page with featured creators + App Store link
    Dashboard/
      Overview/        # Hero earnings card, app list, QAU sparkline
      Earnings/        # Weekly charts, breakdown table, cap rollover
      Analytics/       # DAU, retention, sessions
      Leaderboard/     # Top creators ranking with period filter
      Calculator/      # Interactive earnings estimator with rollover notice
      HealthScore/     # Traffic quality, flags, eligibility
  types/               # TypeScript interfaces
  utils/
    earnings.ts        # Earnings calculations and formatting
    haptic.ts          # Haptic feedback utility
  App.tsx              # Router setup (no ClerkProvider — auth via native JWT)
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

- [x] Native JWT auth (iOS app WKWebView injection)
- [x] API service layer (JWT-authenticated calls to backend)
- [x] Analytics endpoints (ClickHouse queries via API)
- [x] Creator earnings endpoints (backend)
- [x] Health score endpoints (backend)
- [x] Leaderboard endpoint (backend)
- [x] Wire dashboard pages to real API (with dev mode fallback to mocks)
- [x] Brand font (Croogla 4F) for airfold text
- [x] Haptic feedback on mobile CTAs
- [x] Monthly payout messaging with cap rollover
- [x] Remove standalone web login (app-only access)
- [x] Cloudflare Pages deployment
- [ ] Health score computation pipeline (scheduled job)
- [ ] Stripe payout integration
- [ ] Admin panel for reviewing flagged creators
- [ ] Real-time QAU tracking
- [ ] Creator messaging / support chat
- [ ] Public creator profiles

## License

MIT License - see [LICENSE](LICENSE) for details.
