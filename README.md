# Airfold Creator Platform

University platform where creators build mini-apps and earn based on real user engagement. Serving 34K+ students across campus.

![Landing Page](screenshots/landing.png)
![Dashboard Overview](screenshots/dashboard.png)
![Earnings](screenshots/earnings.png)

## What is Airfold?

Airfold is a university platform with 34,000+ students. Inside Airfold, creators can build and publish mini-apps — anything from campus food delivery to study groups to confession boards. Creators who promote their apps and drive engagement get paid based on **Qualified Active Users (QAU)**.

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
| **Overview** | Earnings this week, QAU count, streak status, multiplier progress |
| **Earnings** | Weekly earnings chart, streak timeline, detailed payout table, cap usage |
| **Analytics** | DAU trends, QAU vs unique users, retention curve, session duration, traffic sources |
| **Leaderboard** | Top 20 creators ranked by QAU with streak multipliers |
| **Calculator** | Interactive earnings estimator with sliders for QAU, streak, and platform % |
| **Health Score** | Traffic quality score, anti-gaming flags, rating status, eligibility |

## Payment Structure

### Base Rate
- **$2 per QAU per week**

### QAU Definition
A **Qualified Active User** is a unique user who:
- Opens the app at least once during the week
- Spends a minimum session time (not a bounce)
- Is not flagged as bot/fake traffic

### Streak Multipliers
Consecutive weeks maintaining 70%+ of peak QAU:

| Streak | Multiplier |
|--------|-----------|
| Week 1-2 | 1.0x |
| Week 3-4 | 1.3x |
| Week 5-8 | 1.6x |
| Week 9+ | 2.0x |

### Platform Kickback
- QAUs from **Airfold platform**: 1.5x value
- QAUs from **external links**: 1.0x value

### Signup Bonus
- **$2 per new Airfold signup** attributed to creator's app

### Caps
- Weekly cap: **$2,000**
- Monthly cap: **$5,000**

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

- **React 18** + **Vite** - fast dev and builds
- **TypeScript** - type safety throughout
- **Tailwind CSS v4** - utility-first styling with dark theme
- **Recharts** - charts (bar, line, area, pie)
- **React Router** - client-side routing
- **Framer Motion** - animations
- **Mock data** - 18 creators with varied engagement patterns

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
  assets/              # Static assets
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
      Overview/        # Earnings summary, QAU trend, multiplier status
      Earnings/        # Charts, tables, cap usage
      Analytics/       # DAU, retention, sessions, traffic sources
      Leaderboard/     # Top creators ranking
      Calculator/      # Interactive earnings estimator
      HealthScore/     # Traffic quality, flags, eligibility
  types/               # TypeScript interfaces
  utils/               # Earnings calculations (JSDoc documented)
  App.tsx              # Router setup
  main.tsx             # Entry point
  index.css            # Tailwind config + custom utilities
```

## Environment Variables

No environment variables are required for the demo. All data is mocked.

For production, the following would be needed:

| Variable | Description |
|----------|-------------|
| `VITE_API_URL` | Backend API endpoint |
| `VITE_CLERK_PUBLISHABLE_KEY` | Clerk auth key |
| `VITE_STRIPE_PUBLISHABLE_KEY` | Stripe for payouts |

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
- [ ] Push notifications for streak warnings
- [ ] Creator app submission flow
- [ ] App review and approval system
- [ ] Real-time QAU tracking
- [ ] Creator messaging / support chat
- [ ] Public creator profiles

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

MIT License - see [LICENSE](LICENSE) for details.
