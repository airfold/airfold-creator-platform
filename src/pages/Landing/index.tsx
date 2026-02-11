import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Logo from '../../components/Logo';
import SparklineChart from '../../components/SparklineChart';
import { creators, platformStats } from '../../data/creators';
import { formatNumber, formatCurrency, getStreakTierLabel, getStreakTierColor } from '../../utils/earnings';

const featuredCreators = creators
  .filter(c => c.healthScore > 80 && c.weeklyQAU[7] > 200)
  .sort((a, b) => b.weeklyQAU[7] - a.weeklyQAU[7])
  .slice(0, 6);

const stats = [
  { label: 'Active Creators', value: formatNumber(platformStats.totalCreators) },
  { label: 'Apps Live', value: formatNumber(platformStats.totalAppsLive) },
  { label: 'QAUs This Week', value: formatNumber(platformStats.totalQAUThisWeek) },
  { label: 'Total Paid Out', value: formatCurrency(platformStats.totalPaidOut) },
];

const steps = [
  { num: '01', title: 'Build an app', desc: 'Create a mini-app for your campus community using our tools and templates.' },
  { num: '02', title: 'Grow your users', desc: 'Promote your app on campus. Every qualified active user counts toward your earnings.' },
  { num: '03', title: 'Get paid', desc: 'Earn $2 per QAU weekly with streak multipliers up to 2x. Cash out every week.' },
];

export default function Landing() {
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-accent-blue/5 via-accent-purple/5 to-transparent" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-accent-blue/10 rounded-full blur-[120px]" />

        <div className="relative max-w-7xl mx-auto px-6 pt-32 pb-24 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="inline-flex items-center gap-2 glass-card px-4 py-2 mb-8">
              <span className="w-2 h-2 rounded-full bg-success animate-pulse" />
              <span className="text-sm text-white/60">34,000+ students on campus</span>
            </div>

            <h1 className="text-6xl md:text-8xl font-black mb-6 leading-tight">
              <span className="gradient-text">Build.</span>{' '}
              <span className="text-white">Launch.</span>{' '}
              <span className="gradient-text">Earn.</span>
            </h1>

            <p className="text-xl text-white/50 max-w-2xl mx-auto mb-10">
              Create mini-apps for your campus, grow real users, and earn based on engagement.
              The creator economy, powered by <Logo size="sm" />.
            </p>

            <div className="flex items-center justify-center gap-4">
              <Link to="/login" className="btn-primary text-lg px-8 py-4">
                Start Creating
              </Link>
              <a href="#how-it-works" className="btn-secondary text-lg px-8 py-4">
                Learn More
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats bar */}
      <section className="border-y border-white/5 bg-navy-900/30">
        <div className="max-w-7xl mx-auto px-6 py-8 grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              className="text-center"
            >
              <div className="text-3xl font-bold gradient-text">{s.value}</div>
              <div className="text-sm text-white/40 mt-1">{s.label}</div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Featured Creator Apps */}
      <section className="max-w-7xl mx-auto px-6 py-24">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold mb-4">Featured Creator Apps</h2>
          <p className="text-white/40 text-lg">Top performing apps built by student creators</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredCreators.map((creator, i) => (
            <motion.div
              key={creator.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="glass-card-hover p-6"
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="font-bold text-lg">{creator.appName}</h3>
                  <p className="text-sm text-white/40">by {creator.name}</p>
                </div>
                <span
                  className="text-xs font-semibold px-2.5 py-1 rounded-full border"
                  style={{
                    color: getStreakTierColor(creator.streakWeek),
                    borderColor: getStreakTierColor(creator.streakWeek) + '40',
                    backgroundColor: getStreakTierColor(creator.streakWeek) + '15',
                  }}
                >
                  {getStreakTierLabel(creator.streakWeek)}
                </span>
              </div>

              <div className="mb-4">
                <SparklineChart data={creator.weeklyQAU} />
              </div>

              <div className="flex items-center justify-between text-sm">
                <div>
                  <span className="text-white/40">QAU: </span>
                  <span className="font-semibold">{formatNumber(creator.weeklyQAU[7])}</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="text-warning">{'★'.repeat(Math.round(creator.rating))}</span>
                  <span className="text-white/40">{creator.rating}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="max-w-7xl mx-auto px-6 py-24">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold mb-4">How It Works</h2>
          <p className="text-white/40 text-lg">Three steps to start earning as a creator</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map((step, i) => (
            <motion.div
              key={step.num}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15 }}
              className="glass-card p-8 relative overflow-hidden"
            >
              <span className="absolute top-4 right-6 text-6xl font-black text-white/5">{step.num}</span>
              <div className="relative">
                <h3 className="text-xl font-bold mb-3 gradient-text">{step.title}</h3>
                <p className="text-white/50 leading-relaxed">{step.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-7xl mx-auto px-6 py-24">
        <div className="glass-card p-16 text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-accent-blue/10 to-accent-purple/10" />
          <div className="relative">
            <h2 className="text-4xl font-bold mb-4">Ready to build?</h2>
            <p className="text-white/50 text-lg mb-8 max-w-xl mx-auto">
              Join hundreds of student creators earning real money by building apps their campus actually uses.
            </p>
            <Link to="/login" className="btn-primary text-lg px-10 py-4">
              Creator Login
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/5 bg-navy-900/30">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <Logo size="sm" />
            <div className="flex items-center gap-8 text-sm text-white/30">
              <span className="hover:text-white/50 cursor-pointer transition-colors">About</span>
              <span className="hover:text-white/50 cursor-pointer transition-colors">Terms</span>
              <span className="hover:text-white/50 cursor-pointer transition-colors">Privacy</span>
              <span className="hover:text-white/50 cursor-pointer transition-colors">Support</span>
            </div>
            <p className="text-sm text-white/20">&copy; 2026 Airfold. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
