# Airfold Creator Platform

University platform where creators build mini-apps and earn based on real user engagement. Serving 34K+ students across campus.

![Banner](public/banner.png)

## What is Airfold?

Airfold is a university platform with 34,000+ students. Inside Airfold, creators can build and publish mini-apps — anything from campus food delivery to study groups to confession boards. Creators who promote their apps and drive engagement get paid based on **Qualified Active Users (QAU)**.

## QAU Definition

**QAU** stands for **Qualified Active User**.

A QAU is a user who opens the creator's app on **3 or more different days** in a single week. Each session must be **at least 1 minute long** to count as a valid open. The user must have a verified `.edu` email to be eligible.

### How It Works

- A **week** runs Monday 00:00 UTC through Sunday 23:59 UTC.
- A **session** is counted when a user opens the app and stays for at least 1 minute.
- The **same day** only counts once — if a user opens the app 5 times on Tuesday, that's still 1 day.
- A user must open the app on **3 or more separate days** within the same week to be counted as a QAU for that week.

### Examples

| User | Mon | Tue | Wed | Thu | Fri | Days Active | QAU? |
|------|-----|-----|-----|-----|-----|-------------|------|
| Alice | 3min | — | 2min | — | 5min | 3 | Yes |
| Bob | 45sec | 2min | — | — | — | 1 (Mon doesn't count — under 1min) | No |
| Carol | 1min | 1min | 30sec | — | — | 2 (Wed doesn't count — under 1min) | No |
| Dave | 2min | 4min | 1min | 3min | — | 4 | Yes |

### Key Rules

- Sessions under 1 minute **do not count** toward that day.
- Only verified `.edu` email users are eligible.
- Bot traffic and flagged accounts are excluded.

## App Flow

```
Landing Page → Creator Login (.edu) → Creator Dashboard
```

### Landing Page
- Hero section with platform stats
- Featured creator apps with sparkline charts
- How it works (3-step creator program explanation)
- Call to action for creator sign-up

### Creator Login
- `.edu` email validation
- Redirects to dashboard on success
- Demo: any `.edu` email + any password works

### Creator Dashboard
Six pages accessible via sidebar navigation:

| Page | Description |
|------|-------------|
| **Overview** | Earnings this week, QAU count, weekly cap usage |
| **Earnings** | Weekly earnings chart, detailed payout table, cap progress |
| **Analytics** | DAU trends, QAU vs unique users, retention curve, session duration |
| **Leaderboard** | Top 20 creators ranked by QAU with earnings |
| **Calculator** | Interactive earnings estimator with QAU slider |
| **Health Score** | Traffic quality score, anti-gaming flags, rating status, eligibility |

## Payment Structure

### Rate
- **$2 per QAU per week** — simple, flat rate

### Caps
- Weekly cap: **$2,000**
- Monthly cap: **$5,000**

### How Payouts Work
1. Count QAU for the week
2. Multiply by $2
3. Cap at $2,000 per week
4. Monthly total capped at $5,000

### Example

| Week | QAU | QAU x $2 | Payout |
|------|-----|----------|--------|
| W1 | 400 | $800 | $800 |
| W2 | 650 | $1,300 | $1,300 |
| W3 | 1,200 | $2,400 | $2,000 (capped) |
| W4 | 500 | $1,000 | $900 (monthly cap hit at $5,000) |
| **Total** | | | **$5,000** |

## Anti-Gaming Rules

Traffic quality is monitored via the Health Score system:

| Metric | Threshold |
|--------|-----------|
| Same IP cluster | < 20% of traffic |
| Bounce rate | < 50% |
| Avg session time | > 1 minute |
| App rating | >= 3.0 from 15+ ratings |

Creators flagged for suspicious activity enter review. Repeated violations result in payout suspension.

## Tech Stack

- **React 18** + **Vite** — fast dev and builds
- **TypeScript** — type safety throughout
- **Tailwind CSS v4** — utility-first styling with light Airfold theme
- **Recharts** — charts (bar, line, area)
- **React Router** — client-side routing
- **Framer Motion** — animations
- **Mock data** — 18 creators with varied engagement patterns

## Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn

### Install
```bash
git clone https://github.com/airfold/airfold-creator-platform.git
cd airfold-creator-platform
npm install
```

### Development
```bash
npm run dev
```
Open [http://localhost:5173](http://localhost:5173)

### Build
```bash
npm run build
```

### Preview Production Build
```bash
npm run preview
```

## Folder Structure

```
src/
  assets/              # Static assets (icon, banner)
  components/          # Shared UI (Logo, StatCard, Badge, Charts, ProgressBar)
  context/             # Auth context (login state management)
  data/                # Mock data (18 creators with varied patterns)
  hooks/               # Custom hooks (useAnimatedNumber)
  layouts/
    PublicLayout/      # Landing + Login (no sidebar)
    DashboardLayout/   # Sidebar + topbar (post-login)
  pages/
    Landing/           # Airfold platform home
    Login/             # .edu login form
    Dashboard/
      Overview/        # Earnings summary, QAU trend, cap usage
      Earnings/        # Charts, tables, cap progress
      Analytics/       # DAU, retention, sessions
      Leaderboard/     # Top creators ranking
      Calculator/      # Interactive earnings estimator
      HealthScore/     # Traffic quality, flags, eligibility
  types/               # TypeScript interfaces
  utils/               # Earnings calculations
  App.tsx              # Router setup
  main.tsx             # Entry point
  index.css            # Tailwind config + custom utilities
```

## Mock Data

18 creators with realistic patterns:
- **Steady growers**: Maya Chen, Priya Patel, David Park
- **Plateau**: Chris Taylor, Marcus Johnson
- **Declining**: Tyler Kim
- **Near weekly cap**: Aisha Okafor
- **Suspicious/flagged**: Alex Volkov (same IP cluster, bot pattern), Diego Morales (suspicious spike)
- **Brand new (Week 1)**: Sam Fisher

## Roadmap

- [ ] Real authentication (Clerk)
- [ ] Stripe payout integration
- [ ] `.edu` email verification
- [ ] Admin panel for reviewing flagged creators
- [ ] Creator app submission flow
- [ ] App review and approval system
- [ ] Real-time QAU tracking
- [ ] Creator messaging / support chat
- [ ] Public creator profiles

## License

MIT License - see [LICENSE](LICENSE) for details.
