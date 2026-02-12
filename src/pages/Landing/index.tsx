import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Logo from '../../components/Logo';
import { platformStats } from '../../data/creators';
import { formatNumber, formatCurrency } from '../../utils/earnings';

const stats = [
  { label: 'Creators', value: formatNumber(platformStats.totalCreators) },
  { label: 'Apps', value: formatNumber(platformStats.totalAppsLive) },
  { label: 'QAU', value: formatNumber(platformStats.totalQAUThisWeek) },
  { label: 'Paid Out', value: formatCurrency(platformStats.totalPaidOut) },
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
        <div className="relative max-w-7xl mx-auto px-5 pt-20 pb-14 text-center">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
            <div className="inline-flex items-center gap-2 bg-af-tint-soft rounded-full px-3 py-1.5 mb-5 border border-af-tint/10">
              <span className="w-2 h-2 rounded-full bg-success animate-pulse" />
              <span className="text-xs text-af-charcoal font-medium">{formatCurrency(platformStats.totalPaidOut)} paid to creators</span>
            </div>
            <h1 className="text-4xl font-black mb-3 leading-tight text-af-deep-charcoal">
              Build Apps.<br /><span className="text-af-tint">Get Paid.</span>
            </h1>
            <p className="text-sm text-af-medium-gray max-w-xs mx-auto mb-7">
              airfold AI builds it. You grow it. We pay you.
            </p>
            <a href="https://apps.apple.com/app/airfold" className="btn-primary text-base px-8 py-3.5 inline-block">Start Creating</a>
          </motion.div>
        </div>
      </section>

      {/* Stats */}
      <section className="border-y border-af-light-gray bg-af-surface">
        <div className="max-w-7xl mx-auto px-5 py-4 grid grid-cols-4 gap-3">
          {stats.map((s, i) => (
            <motion.div key={s.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }} className="text-center">
              <div className="text-lg font-black text-af-tint">{s.value}</div>
              <div className="text-[10px] text-af-medium-gray">{s.label}</div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* How it works — minimal */}
      <section id="how-it-works" className="bg-af-surface">
        <div className="max-w-7xl mx-auto px-5 py-10">
          <h2 className="text-xl font-black text-af-deep-charcoal text-center mb-5">3 Steps</h2>
          <div className="space-y-2 md:grid md:grid-cols-3 md:gap-3 md:space-y-0">
            <div className="glass-card p-4 relative overflow-hidden">
              <span className="absolute top-2 right-3 text-3xl font-black text-af-light-gray/40">01</span>
              <h3 className="text-sm font-bold text-af-tint mb-0.5">Create</h3>
              <p className="text-xs text-af-charcoal">Describe your idea. airfold AI builds it.</p>
            </div>
            <div className="glass-card p-4 relative overflow-hidden">
              <span className="absolute top-2 right-3 text-3xl font-black text-af-light-gray/40">02</span>
              <h3 className="text-sm font-bold text-af-tint mb-0.5">Grow</h3>
              <p className="text-xs text-af-charcoal">Share on campus. Users = money.</p>
            </div>
            <div className="glass-card p-4 relative overflow-hidden">
              <span className="absolute top-2 right-3 text-3xl font-black text-af-light-gray/40">03</span>
              <h3 className="text-sm font-bold text-af-tint mb-0.5">Earn</h3>
              <p className="text-xs text-af-charcoal">Up to $5K/mo. Paid weekly.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="text-center py-10 px-5">
        <h2 className="text-xl font-black text-af-deep-charcoal mb-2">Ready?</h2>
        <p className="text-sm text-af-medium-gray mb-5">Others are already earning. Don't miss out.</p>
        <a href="https://apps.apple.com/app/airfold" className="btn-primary text-base px-8 py-3.5 inline-block">Get the App</a>
      </section>

      {/* Footer */}
      <footer className="border-t border-af-light-gray">
        <div className="px-5 py-6">
          <div className="flex flex-col items-center gap-3 text-center">
            <Logo size="sm" />
            <div className="flex items-center gap-6 text-xs text-af-medium-gray">
              <a href="https://airfold.co" target="_blank" rel="noopener noreferrer" className="active:text-af-deep-charcoal">About</a>
              <a href="https://airfold.co/tos" target="_blank" rel="noopener noreferrer" className="active:text-af-deep-charcoal">Terms</a>
              <a href="https://airfold.co/pp" target="_blank" rel="noopener noreferrer" className="active:text-af-deep-charcoal">Privacy</a>
              <a href="mailto:apple@airfold.co" className="active:text-af-deep-charcoal">Support</a>
            </div>
            <p className="text-[10px] text-af-medium-gray">&copy; 2026 <span className="font-brand">airfold</span></p>
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
