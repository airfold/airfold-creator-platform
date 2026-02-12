import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Logo from '../../components/Logo';
import SparklineChart from '../../components/SparklineChart';
import { creators, platformStats } from '../../data/creators';
import { formatNumber, formatCurrency } from '../../utils/earnings';

const featuredCreators = creators
  .filter(c => c.healthScore > 80 && c.weeklyQAU[7] > 20)
  .sort((a, b) => b.weeklyQAU[7] - a.weeklyQAU[7])
  .slice(0, 4);

const stats = [
  { label: 'Active Creators', value: formatNumber(platformStats.totalCreators) },
  { label: 'Apps Live', value: formatNumber(platformStats.totalAppsLive) },
  { label: 'QAUs This Week', value: formatNumber(platformStats.totalQAUThisWeek) },
  { label: 'Total Paid Out', value: formatCurrency(platformStats.totalPaidOut) },
];

const steps = [
  { num: '01', title: 'Build an app', desc: 'Create a mini-app for your campus community using our tools and templates.' },
  { num: '02', title: 'Grow your users', desc: 'Promote your app on campus. Every qualified active user counts toward your earnings.' },
  { num: '03', title: 'Get paid', desc: '100 QAU = $200/week. 500 QAU = $1,000/week. Cash out every week.' },
];

export default function Landing() {
  const [showTop, setShowTop] = useState(false);

  useEffect(() => {
    const onScroll = () => setShowTop(window.scrollY > 400);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-af-tint-soft/50 via-white to-white" />
        <div className="relative max-w-7xl mx-auto px-5 pt-20 pb-16 text-center">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
            <div className="inline-flex items-center gap-2 bg-af-tint-soft rounded-full px-3 py-1.5 mb-6 border border-af-tint/10">
              <span className="w-2 h-2 rounded-full bg-success animate-pulse" />
              <span className="text-xs text-af-charcoal">34,000+ students on campus</span>
            </div>
            <h1 className="text-4xl font-black mb-4 leading-tight text-af-deep-charcoal">
              <span className="text-af-tint">Build.</span> Launch. <span className="text-af-tint">Earn.</span>
            </h1>
            <p className="text-base text-af-medium-gray max-w-sm mx-auto mb-8">
              Create mini-apps for your campus, grow real users, and earn based on engagement.
            </p>
            <div className="flex flex-col items-center gap-3">
              <Link to="/login" className="btn-primary text-base px-8 py-3.5 w-full max-w-xs">Start Creating</Link>
              <a href="#how-it-works" className="btn-secondary text-base px-8 py-3.5 w-full max-w-xs text-center">Learn More</a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats bar */}
      <section className="border-y border-af-light-gray bg-af-surface">
        <div className="max-w-7xl mx-auto px-5 py-5 grid grid-cols-2 gap-4">
          {stats.map((s, i) => (
            <motion.div key={s.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} className="text-center">
              <div className="text-xl font-bold text-af-tint">{s.value}</div>
              <div className="text-xs text-af-medium-gray mt-0.5">{s.label}</div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Featured Creator Apps */}
      <section className="max-w-7xl mx-auto px-5 py-12">
        <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="text-center mb-8">
          <h2 className="text-2xl font-bold text-af-deep-charcoal mb-2">Featured Creator Apps</h2>
          <p className="text-af-medium-gray text-sm">Top performing apps built by student creators</p>
        </motion.div>
        <div className="space-y-3">
          {featuredCreators.map((creator, i) => (
            <motion.div key={creator.id} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.05 }} className="glass-card-hover p-4">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="font-bold text-base text-af-deep-charcoal">{creator.appName}</h3>
                  <p className="text-xs text-af-medium-gray">by {creator.name}</p>
                </div>
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-af-tint-soft text-af-tint border border-af-tint/10">
                  {formatNumber(creator.weeklyQAU[7])} QAU
                </span>
              </div>
              <div className="mb-3"><SparklineChart data={creator.weeklyQAU} height={50} /></div>
              <div className="flex items-center justify-between text-xs">
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
        <div className="max-w-7xl mx-auto px-5 py-12">
          <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="text-center mb-8">
            <h2 className="text-2xl font-bold text-af-deep-charcoal mb-2">How It Works</h2>
            <p className="text-af-medium-gray text-sm">Three steps to start earning as a creator</p>
          </motion.div>
          <div className="space-y-3">
            {steps.map((step, i) => (
              <motion.div key={step.num} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="glass-card p-5 relative overflow-hidden">
                <span className="absolute top-3 right-4 text-4xl font-black text-af-light-gray/50">{step.num}</span>
                <div className="relative">
                  <h3 className="text-base font-bold mb-1.5 text-af-tint">{step.title}</h3>
                  <p className="text-sm text-af-charcoal leading-relaxed">{step.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-af-light-gray">
        <div className="px-5 py-8">
          <div className="flex flex-col items-center gap-4 text-center">
            <Logo size="sm" />
            <div className="flex items-center gap-6 text-xs text-af-medium-gray">
              <span className="active:text-af-deep-charcoal cursor-pointer">About</span>
              <span className="active:text-af-deep-charcoal cursor-pointer">Terms</span>
              <span className="active:text-af-deep-charcoal cursor-pointer">Privacy</span>
              <span className="active:text-af-deep-charcoal cursor-pointer">Support</span>
            </div>
            <p className="text-xs text-af-medium-gray">&copy; 2026 Airfold. All rights reserved.</p>
          </div>
        </div>
      </footer>

      {/* Back to top */}
      <AnimatePresence>
        {showTop && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="fixed bottom-20 right-4 z-50 w-11 h-11 rounded-full bg-af-tint text-white shadow-lg flex items-center justify-center active:scale-95 transition-transform"
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M10 15V5M10 5l-4 4M10 5l4 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}
