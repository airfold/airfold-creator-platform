import { motion } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import Badge from '../../../components/Badge';
import ProgressBar from '../../../components/ProgressBar';
import { getCurrentCreator } from '../../../data/creators';
import {
  calculateWeeklyEarnings,
  formatCurrency,
  getStreakMultiplier,
  getStreakTierLabel,
  WEEKLY_CAP,
  MONTHLY_CAP,
} from '../../../utils/earnings';

export default function Earnings() {
  const creator = getCurrentCreator();

  const weeklyData = creator.weeklyQAU.map((qau, i) => {
    const week = i + 1;
    const streakAtWeek = Math.max(0, creator.streakWeek - (7 - i));
    const multiplier = getStreakMultiplier(Math.max(streakAtWeek, 1));
    const e = calculateWeeklyEarnings(qau, Math.max(streakAtWeek, 1), creator.platformPercent);
    return {
      week: `W${week}`,
      qau,
      baseEarnings: e.baseEarnings,
      multiplier,
      totalPayout: e.capped,
      tier: getStreakTierLabel(Math.max(streakAtWeek, 1)),
    };
  });

  const monthlyTotal = weeklyData.slice(-4).reduce((sum, w) => sum + w.totalPayout, 0);
  const cappedMonthly = Math.min(monthlyTotal, MONTHLY_CAP);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-1">Earnings</h1>
        <p className="text-white/40">Track your weekly and monthly payouts</p>
      </div>

      {/* Weekly Earnings Chart */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card p-6"
      >
        <h3 className="text-lg font-semibold mb-6">Weekly Earnings</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={weeklyData}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
            <XAxis dataKey="week" stroke="rgba(255,255,255,0.3)" fontSize={12} />
            <YAxis stroke="rgba(255,255,255,0.3)" fontSize={12} tickFormatter={v => `$${v}`} />
            <Tooltip
              contentStyle={{
                background: '#1a1f36',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '12px',
                color: '#fff',
              }}
              formatter={(value) => [formatCurrency(Number(value)), 'Earnings']}
            />
            <Bar dataKey="totalPayout" fill="url(#barGradient)" radius={[6, 6, 0, 0]} />
            <defs>
              <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#8b5cf6" />
                <stop offset="100%" stopColor="#3b82f6" />
              </linearGradient>
            </defs>
          </BarChart>
        </ResponsiveContainer>
      </motion.div>

      {/* Streak Timeline */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="glass-card p-6"
      >
        <h3 className="text-lg font-semibold mb-4">Streak Multiplier Timeline</h3>
        <div className="flex gap-2 overflow-x-auto pb-2">
          {weeklyData.map((w, i) => (
            <div key={i} className="flex-shrink-0 text-center">
              <div className={`w-14 h-14 rounded-xl flex items-center justify-center text-sm font-bold mb-1 ${
                i === 7 ? 'bg-accent-blue/20 border-2 border-accent-blue' : 'bg-white/5 border border-white/10'
              }`}>
                {w.multiplier}x
              </div>
              <span className="text-xs text-white/30">{w.week}</span>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Detailed Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="glass-card overflow-hidden"
      >
        <div className="p-6 pb-0">
          <h3 className="text-lg font-semibold mb-4">Weekly Breakdown</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/5">
                <th className="text-left px-6 py-3 text-white/40 font-medium">Week</th>
                <th className="text-right px-6 py-3 text-white/40 font-medium">QAU</th>
                <th className="text-right px-6 py-3 text-white/40 font-medium">Base ($2 x QAU)</th>
                <th className="text-right px-6 py-3 text-white/40 font-medium">Multiplier</th>
                <th className="text-right px-6 py-3 text-white/40 font-medium">Total Payout</th>
              </tr>
            </thead>
            <tbody>
              {weeklyData.map((w, i) => (
                <tr key={i} className={`border-b border-white/5 ${i === 7 ? 'bg-accent-blue/5' : ''}`}>
                  <td className="px-6 py-3 font-medium">
                    {w.week} <Badge label={w.tier} color={w.multiplier >= 2 ? 'amber' : w.multiplier >= 1.6 ? 'purple' : w.multiplier >= 1.3 ? 'blue' : 'gray'} />
                  </td>
                  <td className="text-right px-6 py-3">{w.qau.toLocaleString()}</td>
                  <td className="text-right px-6 py-3">{formatCurrency(w.baseEarnings)}</td>
                  <td className="text-right px-6 py-3 font-semibold">{w.multiplier}x</td>
                  <td className="text-right px-6 py-3 font-bold gradient-text">{formatCurrency(w.totalPayout)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* Cap Usage */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="glass-card p-6"
        >
          <h3 className="text-lg font-semibold mb-4">Weekly Cap</h3>
          <ProgressBar
            value={weeklyData[7].totalPayout}
            max={WEEKLY_CAP}
            label={`${formatCurrency(weeklyData[7].totalPayout)} / ${formatCurrency(WEEKLY_CAP)}`}
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          className="glass-card p-6"
        >
          <h3 className="text-lg font-semibold mb-4">Monthly Running Total</h3>
          <ProgressBar
            value={cappedMonthly}
            max={MONTHLY_CAP}
            label={`${formatCurrency(cappedMonthly)} / ${formatCurrency(MONTHLY_CAP)}`}
          />
        </motion.div>
      </div>
    </div>
  );
}
