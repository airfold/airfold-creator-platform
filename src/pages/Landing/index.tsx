import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Logo from '../../components/Logo';
import { platformStats } from '../../data/creators';
import { formatNumber, formatCurrency } from '../../utils/earnings';

const stats = [
  { label: 'Creators', value: formatNumber(platformStats.totalCreators) },
  { label: 'Apps Live', value: formatNumber(platformStats.totalAppsLive) },
  { label: 'Weekly Users', value: formatNumber(platformStats.totalQAUThisWeek) },
  { label: 'Paid Out', value: formatCurrency(platformStats.totalPaidOut) },
];

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, delay },
});

export default function Landing() {
  const [showTop, setShowTop] = useState(false);

  useEffect(() => {
    const onScroll = () => setShowTop(window.scrollY > 400);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <div className="min-h-screen bg-white">
      {/* Nav */}
      <nav className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-af-light-gray/50">
        <div className="max-w-6xl mx-auto px-5 md:px-10 py-3 flex items-center justify-between">
          <Logo size="sm" />
          <a
            href="https://apps.apple.com/app/airfold"
            className="btn-primary text-sm px-5 py-2"
          >
            Start Creating
          </a>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-af-tint-soft/50 via-white to-white" />
        <div className="relative max-w-6xl mx-auto px-5 md:px-10 pt-16 md:pt-28 pb-14 md:pb-20 text-center">
          <motion.div {...fadeUp()}>
            <div className="inline-flex items-center gap-2 bg-af-tint-soft rounded-full px-4 py-1.5 mb-6 border border-af-tint/10">
              <span className="w-2 h-2 rounded-full bg-success animate-pulse" />
              <span className="text-xs md:text-sm text-af-charcoal font-medium">
                {formatCurrency(platformStats.totalPaidOut)} paid to creators
              </span>
            </div>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-black mb-4 leading-tight text-af-deep-charcoal">
              Build Apps.<br />
              <span className="text-af-tint">Get Paid.</span>
            </h1>
            <p className="text-base md:text-lg text-af-medium-gray max-w-md mx-auto mb-8">
              airfold AI builds it. You grow it on campus. We pay you every week.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <a href="https://apps.apple.com/app/airfold" className="btn-primary text-base md:text-lg px-8 py-3.5 inline-block">
                Start Creating
              </a>
              <a href="#how-it-works" className="btn-secondary text-base md:text-lg px-8 py-3.5 inline-block">
                How It Works
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats */}
      <section className="border-y border-af-light-gray bg-af-surface">
        <div className="max-w-6xl mx-auto px-5 md:px-10 py-5 md:py-8 grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
          {stats.map((s, i) => (
            <motion.div key={s.label} {...fadeUp(i * 0.08)} className="text-center">
              <div className="text-2xl md:text-3xl font-black text-af-tint">{s.value}</div>
              <div className="text-xs md:text-sm text-af-medium-gray mt-1">{s.label}</div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="bg-white">
        <div className="max-w-6xl mx-auto px-5 md:px-10 py-14 md:py-24">
          <motion.h2 {...fadeUp()} className="text-2xl md:text-4xl font-black text-af-deep-charcoal text-center mb-3">
            How It Works
          </motion.h2>
          <motion.p {...fadeUp(0.1)} className="text-sm md:text-base text-af-medium-gray text-center mb-10 md:mb-14 max-w-lg mx-auto">
            No coding required. No upfront cost. Just your ideas and your campus.
          </motion.p>
          <div className="grid md:grid-cols-3 gap-4 md:gap-6">
            {[
              {
                num: '01',
                title: 'Create',
                desc: 'Describe your app idea in plain English. Our AI builds a fully working app in minutes — design, logic, everything.',
                icon: '✨',
              },
              {
                num: '02',
                title: 'Grow',
                desc: 'Share your app with friends, classmates, and your campus. Every active user you bring counts toward your earnings.',
                icon: '📈',
              },
              {
                num: '03',
                title: 'Earn',
                desc: '$2 per qualified active user, paid weekly. Top creators earn up to $5,000/month. Real money, real fast.',
                icon: '💰',
              },
            ].map((step, i) => (
              <motion.div key={step.num} {...fadeUp(i * 0.12)} className="glass-card p-6 md:p-8 relative overflow-hidden">
                <span className="absolute top-3 right-4 text-4xl md:text-5xl font-black text-af-light-gray/30">{step.num}</span>
                <div className="text-3xl mb-3">{step.icon}</div>
                <h3 className="text-lg md:text-xl font-bold text-af-deep-charcoal mb-2">{step.title}</h3>
                <p className="text-sm md:text-base text-af-charcoal leading-relaxed">{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Why creators love it */}
      <section className="bg-af-surface">
        <div className="max-w-6xl mx-auto px-5 md:px-10 py-14 md:py-24">
          <motion.h2 {...fadeUp()} className="text-2xl md:text-4xl font-black text-af-deep-charcoal text-center mb-10 md:mb-14">
            Why Creators Love It
          </motion.h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            {[
              { icon: '🧠', title: 'Zero Coding', desc: 'AI does the engineering. You just describe what you want.' },
              { icon: '⚡', title: 'Launch in Minutes', desc: 'From idea to live app in under 10 minutes.' },
              { icon: '💸', title: 'Weekly Payouts', desc: 'Earn every week via Stripe. No minimums to start.' },
              { icon: '📊', title: 'Real-Time Dashboard', desc: 'Track users, earnings, and app health in one place.' },
            ].map((item, i) => (
              <motion.div key={item.title} {...fadeUp(i * 0.08)} className="glass-card p-5 md:p-6 text-center">
                <div className="text-3xl mb-3">{item.icon}</div>
                <h3 className="text-base md:text-lg font-bold text-af-deep-charcoal mb-1.5">{item.title}</h3>
                <p className="text-sm text-af-medium-gray">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Earnings breakdown */}
      <section className="bg-white">
        <div className="max-w-6xl mx-auto px-5 md:px-10 py-14 md:py-24">
          <motion.h2 {...fadeUp()} className="text-2xl md:text-4xl font-black text-af-deep-charcoal text-center mb-3">
            The Math Is Simple
          </motion.h2>
          <motion.p {...fadeUp(0.1)} className="text-sm md:text-base text-af-medium-gray text-center mb-10 md:mb-14 max-w-lg mx-auto">
            More users = more money. No tricks.
          </motion.p>
          <div className="grid sm:grid-cols-3 gap-4 md:gap-6 max-w-3xl mx-auto">
            {[
              { users: '50', earnings: '$100/wk', label: 'Getting started' },
              { users: '250', earnings: '$500/wk', label: 'Growing fast' },
              { users: '500+', earnings: '$1,000+/wk', label: 'Top creator' },
            ].map((tier, i) => (
              <motion.div key={tier.users} {...fadeUp(i * 0.1)} className="glass-card p-6 text-center">
                <div className="text-3xl md:text-4xl font-black text-af-tint mb-1">{tier.earnings}</div>
                <div className="text-sm font-semibold text-af-deep-charcoal mb-1">{tier.users} active users</div>
                <div className="text-xs text-af-medium-gray">{tier.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="bg-af-surface">
        <div className="max-w-3xl mx-auto px-5 md:px-10 py-14 md:py-24">
          <motion.h2 {...fadeUp()} className="text-2xl md:text-4xl font-black text-af-deep-charcoal text-center mb-10 md:mb-14">
            Questions? Answered.
          </motion.h2>
          <div className="space-y-4">
            {[
              { q: 'Do I need to know how to code?', a: 'Nope. Just describe your app idea and airfold AI builds it for you. No coding, no design skills needed.' },
              { q: 'How do I get paid?', a: 'We pay weekly via Stripe direct deposit. Set up takes 2 minutes from the Creator Dashboard.' },
              { q: 'What counts as a qualified active user?', a: 'A user who opens and meaningfully uses your app during the week. No fake accounts, no bots — real engagement.' },
              { q: "What if my app doesn't get users?", a: "That's okay! There's no penalty. Keep improving your app, share it more, and earnings will follow." },
              { q: 'Is there a cap on earnings?', a: 'Creators can earn up to $5,000/month. Top performers may qualify for higher limits.' },
            ].map((faq, i) => (
              <motion.div key={i} {...fadeUp(i * 0.06)} className="glass-card p-5 md:p-6">
                <h3 className="text-sm md:text-base font-bold text-af-deep-charcoal mb-1.5">{faq.q}</h3>
                <p className="text-sm text-af-medium-gray leading-relaxed">{faq.a}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="bg-gradient-to-b from-white to-af-tint-soft/30">
        <div className="max-w-6xl mx-auto px-5 md:px-10 py-16 md:py-28 text-center">
          <motion.div {...fadeUp()}>
            <h2 className="text-3xl md:text-5xl font-black text-af-deep-charcoal mb-3">
              Ready to start earning?
            </h2>
            <p className="text-base md:text-lg text-af-medium-gray mb-8 max-w-md mx-auto">
              Other students are already making money. Your turn.
            </p>
            <a href="https://apps.apple.com/app/airfold" className="btn-primary text-base md:text-lg px-10 py-4 inline-block">
              Download airfold
            </a>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-af-light-gray bg-white py-8 sm:py-12 px-5 sm:px-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6 sm:gap-8">
            <a href="https://airfold.co" className="flex items-center gap-3">
              <img src="/icon.png" alt="airfold" className="w-10 h-10 rounded-xl shadow-sm" />
              <div className="flex flex-col justify-center">
                <span className="text-xl text-af-tint leading-tight font-brand">airfold</span>
                <span className="text-xs text-af-medium-gray leading-tight">Creator Program</span>
              </div>
            </a>

            <div className="flex items-center gap-6 sm:gap-8 text-sm">
              <a href="https://airfold.co" className="text-af-medium-gray hover:text-af-tint transition-colors">About</a>
              <a href="https://airfold.co/#/pp" className="text-af-medium-gray hover:text-af-tint transition-colors">Privacy</a>
              <a href="https://airfold.co/#/tos" className="text-af-medium-gray hover:text-af-tint transition-colors">Terms</a>
              <a href="mailto:apple@airfold.co" className="text-af-medium-gray hover:text-af-tint transition-colors">Contact</a>
            </div>

            <p className="text-sm text-af-medium-gray">&copy; 2026 Airfold</p>
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
            className="fixed bottom-6 right-6 z-50 w-12 h-12 rounded-full bg-af-tint text-white shadow-lg flex items-center justify-center hover:bg-af-tint-light transition-colors cursor-pointer"
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M10 15V5M10 5l-4 4M10 5l4 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}
