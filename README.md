# Airfold Creator Platform

Creator dashboard for the Airfold mini-app platform. Creators sign in with the same account they use in the Airfold iOS app and see real analytics, earnings, and health scores for their published apps.

<p align="center">
  <img src="public/icon.png" alt="Airfold" width="80" />
</p>

<p align="center">
  <img src="public/banner.png" alt="The new era of social apps" width="100%" />
</p>

## Architecture

### How It Works Under the Hood

```
┌──────────────────┐      Clerk JWT       ┌────────────────────┐
│  Creator Platform │ ──────────────────▶  │   Airfold API      │
│  (React SPA)      │                      │   (FastAPI/GCR)    │
└──────────┬────────┘                      └────────┬───────────┘
           │                                        │
           │  GET /v1/app         (my apps)         │ Neon PostgreSQL
           │  GET /v1/analytics/* (dashboard stats) │   ↕
           │                                        │ ClickHouse Cloud
           │                                        │   ↕
           │                                        │ app_events table
           └────────────────────────────────────────┘
                                                      ↑
                                              Cloudflare Dispatcher
                                              writes 'view' event on
                                              every mini-app request
```

### Authentication (Clerk SSO)

The creator platform uses **the same Clerk instance** (`clerk.airfold.co`) as the main Airfold iOS app. This means:

1. **Single identity** — a creator who signs up in the iOS app already has an account. They sign into the web dashboard with the same credentials (Google, Apple, email, etc.).
2. **JWT flow** — Clerk issues a JWT on sign-in. The React app sends it as `Authorization: Bearer <jwt>` to the Airfold API. The API validates it against Clerk's JWKS endpoint and resolves the user.
3. **No separate registration** — there is no `.edu` gate or separate sign-up. If you have an Airfold account, you can access the creator dashboard.

### Data Flow

| Data | Source | How |
|------|--------|-----|
| **My Apps** | Neon PostgreSQL via API | `GET /v1/app` returns all apps owned by the authenticated user |
| **Analytics** | ClickHouse via API | `GET /v1/analytics/creator` aggregates `app_events` by the creator's `worker_name`s |
| **App Events** | Cloudflare Dispatcher | Every request to `*.apps.airfold.co` writes a `view` event with user_id, timestamp, geo, device |
| **User Profile** | Clerk | Name, email, avatar fetched client-side via `useUser()` |

### Key Environment Variables

| Variable | Value |
|----------|-------|
| `VITE_CLERK_PUBLISHABLE_KEY` | Clerk publishable key (same instance as iOS app) |
| `VITE_API_URL` | Airfold API endpoint (Cloud Run) |

## QAU Definition

**QAU** = **Qualified Active User** — a user who opens a creator's app on **3+ different days** in a week, with each session **at least 1 minute** long.

## Payment Structure

- **$2 per QAU per week** — flat rate
- Weekly cap: **$2,000** | Monthly cap: **$5,000**

## Tech Stack

- **React 18** + **Vite** + **TypeScript**
- **@clerk/clerk-react** — authentication (same Clerk instance as iOS app)
- **Tailwind CSS v4** — Airfold light theme
- **Recharts** — charts (bar, line, area)
- **React Router v6** — client-side routing
- **Framer Motion** — animations

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
  components/          # Shared UI (Logo, StatCard, Badge, Charts, ProgressBar)
  context/             # Auth hooks (wraps Clerk)
  data/                # Mock data (18 creators with varied patterns)
  hooks/               # Custom hooks (useAnimatedNumber)
  services/            # API client (sends Clerk JWT to backend)
  layouts/
    PublicLayout/      # Landing + Login
    DashboardLayout/   # Sidebar + topbar (post-login)
  pages/
    Landing/           # Platform home
    Login/             # Clerk SignIn component
    Dashboard/
      Overview/        # Earnings summary, QAU trend, cap usage
      Earnings/        # Charts, tables, cap progress
      Analytics/       # DAU, retention, sessions
      Leaderboard/     # Top creators ranking
      Calculator/      # Interactive earnings estimator
      HealthScore/     # Traffic quality, flags, eligibility
  types/               # TypeScript interfaces
  utils/               # Earnings calculations
  App.tsx              # ClerkProvider + Router setup
  main.tsx             # Entry point
  index.css            # Tailwind config + custom utilities
```

## Roadmap

- [x] Clerk authentication (same SSO as iOS app)
- [x] API service layer (JWT-authenticated calls to backend)
- [x] Analytics endpoints (ClickHouse queries via API)
- [ ] Wire dashboard pages to real API data (replace mock data)
- [ ] Stripe payout integration
- [ ] Admin panel for reviewing flagged creators
- [ ] Real-time QAU tracking
- [ ] Creator messaging / support chat
- [ ] Public creator profiles

## License

MIT License - see [LICENSE](LICENSE) for details.
