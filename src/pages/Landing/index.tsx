import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Logo from '../../components/Logo';
import SparklineChart from '../../components/SparklineChart';
import { creators, platformStats } from '../../data/creators';
import { formatNumber, formatCurrency } from '../../utils/earnings';

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
  { num: '03', title: 'Get paid', desc: 'Earn $2 per QAU every week. Grow your user base and cash out weekly.' },
];

export default function Landing() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-af-tint-soft/50 via-white to-white" />
        <div className="relative max-w-7xl mx-auto px-6 pt-32 pb-24 text-center">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
            <div className="inline-flex items-center gap-2 bg-af-tint-soft rounded-full px-4 py-2 mb-8 border border-af-tint/10">
              <span className="w-2 h-2 rounded-full bg-success animate-pulse" />
              <span className="text-sm text-af-charcoal">34,000+ students on campus</span>
            </div>
            <h1 className="text-6xl md:text-8xl font-black mb-6 leading-tight text-af-deep-charcoal">
              <span className="text-af-tint">Build.</span> Launch. <span className="text-af-tint">Earn.</span>
            </h1>
            <p className="text-xl text-af-medium-gray max-w-2xl mx-auto mb-10">
              Create mini-apps for your campus, grow real users, and earn based on engagement.
              The creator economy, powered by <Logo size="sm" />.
            </p>
            <div className="flex items-center justify-center gap-4">
              <Link to="/login" className="btn-primary text-lg px-8 py-4">Start Creating</Link>
              <a href="#how-it-works" className="btn-secondary text-lg px-8 py-4">Learn More</a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats bar */}
      <section className="border-y border-af-light-gray bg-af-surface">
        <div className="max-w-7xl mx-auto px-6 py-8 grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((s, i) => (
            <motion.div key={s.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} className="text-center">
              <div className="text-3xl font-bold text-af-tint">{s.value}</div>
              <div className="text-sm text-af-medium-gray mt-1">{s.label}</div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Featured Creator Apps */}
      <section className="max-w-7xl mx-auto px-6 py-24">
        <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="text-center mb-16">
          <h2 className="text-4xl font-bold text-af-deep-charcoal mb-4">Featured Creator Apps</h2>
          <p className="text-af-medium-gray text-lg">Top performing apps built by student creators</p>
        </motion.div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredCreators.map((creator, i) => (
            <motion.div key={creator.id} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="glass-card-hover p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="font-bold text-lg text-af-deep-charcoal">{creator.appName}</h3>
                  <p className="text-sm text-af-medium-gray">by {creator.name}</p>
                </div>
                <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-af-tint-soft text-af-tint border border-af-tint/10">
                  {formatNumber(creator.weeklyQAU[7])} QAU
                </span>
              </div>
              <div className="mb-4"><SparklineChart data={creator.weeklyQAU} /></div>
              <div className="flex items-center justify-between text-sm">
                <div>
                  <span className="text-af-medium-gray">Earning: </span>
                  <span className="font-semibold text-af-deep-charcoal">{formatCurrency(creator.weeklyQAU[7] * 2)}/wk</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="text-warning">{'★'.repeat(Math.round(creator.rating))}</span>
                  <span className="text-af-medium-gray">{creator.rating}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="bg-af-surface">
        <div className="max-w-7xl mx-auto px-6 py-24">
          <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="text-center mb-16">
            <h2 className="text-4xl font-bold text-af-deep-charcoal mb-4">How It Works</h2>
            <p className="text-af-medium-gray text-lg">Three steps to start earning as a creator</p>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {steps.map((step, i) => (
              <motion.div key={step.num} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.15 }} className="glass-card p-8 relative overflow-hidden">
                <span className="absolute top-4 right-6 text-6xl font-black text-af-light-gray/50">{step.num}</span>
                <div className="relative">
                  <h3 className="text-xl font-bold mb-3 text-af-tint">{step.title}</h3>
                  <p className="text-af-charcoal leading-relaxed">{step.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-7xl mx-auto px-6 py-24">
        <div className="bg-af-tint-soft rounded-2xl p-16 text-center border border-af-tint/10">
          <h2 className="text-4xl font-bold text-af-deep-charcoal mb-4">Ready to build?</h2>
          <p className="text-af-charcoal text-lg mb-8 max-w-xl mx-auto">
            Join hundreds of student creators earning real money by building apps their campus actually uses.
          </p>
          <Link to="/login" className="btn-primary text-lg px-10 py-4">Creator Login</Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-af-light-gray">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <Logo size="sm" />
            <div className="flex items-center gap-8 text-sm text-af-medium-gray">
              <span className="hover:text-af-deep-charcoal cursor-pointer transition-colors">About</span>
              <span className="hover:text-af-deep-charcoal cursor-pointer transition-colors">Terms</span>
              <span className="hover:text-af-deep-charcoal cursor-pointer transition-colors">Privacy</span>
              <span className="hover:text-af-deep-charcoal cursor-pointer transition-colors">Support</span>
            </div>
            <p className="text-sm text-af-medium-gray">&copy; 2026 Airfold. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
