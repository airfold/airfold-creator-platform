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

const tooltipStyle = {
  background: '#FFFFFF',
  border: '1px solid #E5E5EA',
  borderRadius: '12px',
  color: '#1A1A1A',
  boxShadow: '0 2px 6px rgba(0,0,0,0.03)',
};

export default function Earnings() {
  const creator = getCurrentCreator();

  const weeklyData = creator.weeklyQAU.map((qau, i) => {
    const streakAtWeek = Math.max(0, creator.streakWeek - (7 - i));
    const multiplier = getStreakMultiplier(Math.max(streakAtWeek, 1));
    const e = calculateWeeklyEarnings(qau, Math.max(streakAtWeek, 1), creator.platformPercent);
    return {
      week: `W${i + 1}`,
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
        <h1 className="text-3xl font-bold text-af-deep-charcoal mb-1">Earnings</h1>
        <p className="text-af-medium-gray">Track your weekly and monthly payouts</p>
      </div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-6">
        <h3 className="text-lg font-semibold text-af-deep-charcoal mb-6">Weekly Earnings</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={weeklyData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#E5E5EA" />
            <XAxis dataKey="week" stroke="#8E8E93" fontSize={12} />
            <YAxis stroke="#8E8E93" fontSize={12} tickFormatter={v => `$${v}`} />
            <Tooltip contentStyle={tooltipStyle} formatter={(value) => [formatCurrency(Number(value)), 'Earnings']} />
            <Bar dataKey="totalPayout" fill="#BD295A" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="glass-card p-6">
        <h3 className="text-lg font-semibold text-af-deep-charcoal mb-4">Streak Multiplier Timeline</h3>
        <div className="flex gap-2 overflow-x-auto pb-2">
          {weeklyData.map((w, i) => (
            <div key={i} className="flex-shrink-0 text-center">
              <div className={`w-14 h-14 rounded-xl flex items-center justify-center text-sm font-bold mb-1 ${
                i === 7 ? 'bg-af-tint-soft border-2 border-af-tint text-af-tint' : 'bg-af-surface border border-af-light-gray text-af-charcoal'
              }`}>
                {w.multiplier}x
              </div>
              <span className="text-xs text-af-medium-gray">{w.week}</span>
            </div>
          ))}
        </div>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="glass-card overflow-hidden">
        <div className="p-6 pb-0">
          <h3 className="text-lg font-semibold text-af-deep-charcoal mb-4">Weekly Breakdown</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-af-light-gray">
                <th className="text-left px-6 py-3 text-af-medium-gray font-medium">Week</th>
                <th className="text-right px-6 py-3 text-af-medium-gray font-medium">QAU</th>
                <th className="text-right px-6 py-3 text-af-medium-gray font-medium">Base ($2 x QAU)</th>
                <th className="text-right px-6 py-3 text-af-medium-gray font-medium">Multiplier</th>
                <th className="text-right px-6 py-3 text-af-medium-gray font-medium">Total Payout</th>
              </tr>
            </thead>
            <tbody>
              {weeklyData.map((w, i) => (
                <tr key={i} className={`border-b border-af-light-gray ${i === 7 ? 'bg-af-tint-soft' : ''}`}>
                  <td className="px-6 py-3 font-medium text-af-deep-charcoal">
                    {w.week} <Badge label={w.tier} color={w.multiplier >= 2 ? 'amber' : w.multiplier >= 1.3 ? 'tint' : 'gray'} />
                  </td>
                  <td className="text-right px-6 py-3 text-af-charcoal">{w.qau.toLocaleString()}</td>
                  <td className="text-right px-6 py-3 text-af-charcoal">{formatCurrency(w.baseEarnings)}</td>
                  <td className="text-right px-6 py-3 font-semibold text-af-deep-charcoal">{w.multiplier}x</td>
                  <td className="text-right px-6 py-3 font-bold text-af-tint">{formatCurrency(w.totalPayout)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="glass-card p-6">
          <h3 className="text-lg font-semibold text-af-deep-charcoal mb-4">Weekly Cap</h3>
          <ProgressBar value={weeklyData[7].totalPayout} max={WEEKLY_CAP} label={`${formatCurrency(weeklyData[7].totalPayout)} / ${formatCurrency(WEEKLY_CAP)}`} />
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }} className="glass-card p-6">
          <h3 className="text-lg font-semibold text-af-deep-charcoal mb-4">Monthly Running Total</h3>
          <ProgressBar value={cappedMonthly} max={MONTHLY_CAP} label={`${formatCurrency(cappedMonthly)} / ${formatCurrency(MONTHLY_CAP)}`} />
        </motion.div>
      </div>
    </div>
  );
}
