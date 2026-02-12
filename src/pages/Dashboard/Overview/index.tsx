import { motion } from 'framer-motion';
import StatCard from '../../../components/StatCard';
import SparklineChart from '../../../components/SparklineChart';
import ProgressBar from '../../../components/ProgressBar';
import { getCurrentCreator } from '../../../data/creators';
import {
  calculateWeeklyEarnings,
  formatCurrency,
  formatNumber,
  percentChange,
  WEEKLY_CAP,
} from '../../../utils/earnings';

export default function Overview() {
  const creator = getCurrentCreator();
  const currentQAU = creator.weeklyQAU[7];
  const lastWeekQAU = creator.weeklyQAU[6];
  const qauChange = percentChange(currentQAU, lastWeekQAU);
  const earnings = calculateWeeklyEarnings(currentQAU);
  const monthlyProjection = earnings.capped * 4.3;

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-bold text-af-deep-charcoal mb-0.5">Overview</h1>
        <p className="text-sm text-af-medium-gray">Welcome back, {creator.name.split(' ')[0]}</p>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <StatCard label="Earnings This Week" value={earnings.capped} prefix="$" icon={<span className="text-2xl">💰</span>} />
        <StatCard label="QAU This Week" value={currentQAU} change={qauChange} icon={<span className="text-2xl">👥</span>} />
        <StatCard label="QAU Last Week" value={lastWeekQAU} icon={<span className="text-2xl">📊</span>} />
        <StatCard label="Monthly Projection" value={Math.round(monthlyProjection)} prefix="$" icon={<span className="text-2xl">📈</span>} />
      </div>

      {/* QAU Trend */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="glass-card p-4">
        <h3 className="text-base font-semibold text-af-deep-charcoal mb-0.5">QAU Trend (8 Weeks)</h3>
        <p className="text-xs text-af-medium-gray mb-3">Qualified Active Users over time</p>
        <SparklineChart data={creator.weeklyQAU} height={100} />
        <div className="flex justify-between mt-3 text-[10px] text-af-medium-gray">
          <span>8 weeks ago</span>
          <span>This week</span>
        </div>
      </motion.div>

      {/* Earnings breakdown */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="glass-card p-4">
        <h3 className="text-base font-semibold text-af-deep-charcoal mb-3">Earnings Breakdown</h3>

        <div className="bg-af-surface rounded-xl p-3 mb-3">
          <div className="text-xs text-af-medium-gray mb-0.5">This Week</div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-af-tint">{formatCurrency(earnings.capped)}</span>
            {earnings.capApplied && <span className="text-[10px] text-warning font-medium">CAP APPLIED</span>}
          </div>
        </div>

        <div className="space-y-1.5 text-xs">
          <div className="flex justify-between">
            <span className="text-af-medium-gray">QAU count</span>
            <span className="text-af-deep-charcoal font-medium">{formatNumber(currentQAU)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-af-medium-gray">Rate per QAU</span>
            <span className="text-af-deep-charcoal font-medium">$2</span>
          </div>
          <div className="flex justify-between">
            <span className="text-af-medium-gray">Gross earnings</span>
            <span className="text-af-deep-charcoal font-medium">{formatCurrency(earnings.earnings)}</span>
          </div>
          <div className="flex justify-between pt-1.5 border-t border-af-light-gray font-semibold">
            <span className="text-af-deep-charcoal">Payout</span>
            <span className="text-af-tint">{formatCurrency(earnings.capped)}</span>
          </div>
        </div>
      </motion.div>

      {/* Weekly cap usage */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="glass-card p-4">
        <h3 className="text-sm font-semibold text-af-deep-charcoal mb-3">Weekly Cap Usage</h3>
        <ProgressBar value={earnings.capped} max={WEEKLY_CAP} label={`${formatCurrency(earnings.capped)} / ${formatCurrency(WEEKLY_CAP)}`} />
        {earnings.capApplied && (
          <p className="text-xs text-warning mt-2">{"You've hit the weekly cap! Excess earnings don't carry over."}</p>
        )}
      </motion.div>
    </div>
  );
}
