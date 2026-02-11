import { motion } from 'framer-motion';
import StatCard from '../../../components/StatCard';
import SparklineChart from '../../../components/SparklineChart';
import Badge from '../../../components/Badge';
import ProgressBar from '../../../components/ProgressBar';
import { getCurrentCreator } from '../../../data/creators';
import {
  calculateWeeklyEarnings,
  formatCurrency,
  formatNumber,
  percentChange,
  getStreakMultiplier,
  getStreakTierLabel,
  getStreakTierColor,
  WEEKLY_CAP,
} from '../../../utils/earnings';

export default function Overview() {
  const creator = getCurrentCreator();
  const currentQAU = creator.weeklyQAU[7];
  const lastWeekQAU = creator.weeklyQAU[6];
  const qauChange = percentChange(currentQAU, lastWeekQAU);

  const earnings = calculateWeeklyEarnings(currentQAU, creator.streakWeek, creator.platformPercent);
  const multiplier = getStreakMultiplier(creator.streakWeek);
  const tierLabel = getStreakTierLabel(creator.streakWeek);
  const tierColor = getStreakTierColor(creator.streakWeek);

  const nextMultiplier = creator.streakWeek <= 2 ? 1.3 : creator.streakWeek <= 4 ? 1.6 : creator.streakWeek <= 8 ? 2.0 : 2.0;
  const nextTierWeek = creator.streakWeek <= 2 ? 3 : creator.streakWeek <= 4 ? 5 : creator.streakWeek <= 8 ? 9 : 0;
  const progressToNext = nextTierWeek > 0
    ? ((creator.streakWeek - (nextTierWeek <= 3 ? 0 : nextTierWeek <= 5 ? 2 : 4)) /
       (nextTierWeek - (nextTierWeek <= 3 ? 0 : nextTierWeek <= 5 ? 2 : 4) - 0)) * 100
    : 100;

  const monthlyProjection = earnings.capped * 4.3;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-1">Overview</h1>
        <p className="text-white/40">Welcome back, {creator.name.split(' ')[0]}</p>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Earnings This Week"
          value={earnings.capped}
          prefix="$"
          icon={<span className="text-2xl">💰</span>}
        />
        <StatCard
          label="QAU This Week"
          value={currentQAU}
          change={qauChange}
          icon={<span className="text-2xl">👥</span>}
        />
        <StatCard
          label="Streak Week"
          value={creator.streakWeek}
          icon={<span className="text-2xl">🔥</span>}
        />
        <StatCard
          label="Monthly Projection"
          value={Math.round(monthlyProjection)}
          prefix="$"
          icon={<span className="text-2xl">📈</span>}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* QAU Trend */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="glass-card p-6"
        >
          <h3 className="text-lg font-semibold mb-1">QAU Trend (Last 8 Weeks)</h3>
          <p className="text-sm text-white/40 mb-4">Qualified Active Users over time</p>
          <SparklineChart data={creator.weeklyQAU} height={140} />
          <div className="flex justify-between mt-4 text-xs text-white/30">
            <span>8 weeks ago</span>
            <span>This week</span>
          </div>
        </motion.div>

        {/* Multiplier status */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="glass-card p-6"
        >
          <h3 className="text-lg font-semibold mb-4">Multiplier Status</h3>

          <div className="flex items-center gap-4 mb-6">
            <div
              className="w-16 h-16 rounded-2xl flex items-center justify-center text-2xl font-black"
              style={{ backgroundColor: tierColor + '20', color: tierColor }}
            >
              {multiplier}x
            </div>
            <div>
              <Badge label={tierLabel} color={multiplier >= 2 ? 'amber' : multiplier >= 1.6 ? 'purple' : multiplier >= 1.3 ? 'blue' : 'gray'} />
              <p className="text-sm text-white/40 mt-1">Week {creator.streakWeek} streak</p>
            </div>
          </div>

          {nextTierWeek > 0 ? (
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-white/50">Progress to {nextMultiplier}x</span>
                <span className="text-white/70">{nextTierWeek - creator.streakWeek} weeks to go</span>
              </div>
              <ProgressBar value={Math.max(progressToNext, 10)} max={100} showValue={false} />
            </div>
          ) : (
            <p className="text-sm text-success">Max multiplier reached!</p>
          )}

          <div className="mt-6 pt-4 border-t border-white/5">
            <h4 className="text-sm font-medium text-white/50 mb-3">Earnings Breakdown</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-white/40">Base ({formatNumber(currentQAU)} QAU x $2)</span>
                <span>{formatCurrency(earnings.baseEarnings)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/40">Platform bonus ({creator.platformPercent}%)</span>
                <span className="text-success">+{formatCurrency(earnings.platformBonus)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/40">Streak multiplier ({multiplier}x)</span>
                <span className="text-accent-purple">applied</span>
              </div>
              <div className="flex justify-between pt-2 border-t border-white/5 font-semibold">
                <span>Total this week</span>
                <span className="gradient-text">{formatCurrency(earnings.capped)}</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Weekly cap usage */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="glass-card p-6"
      >
        <h3 className="text-lg font-semibold mb-4">Weekly Cap Usage</h3>
        <ProgressBar
          value={earnings.capped}
          max={WEEKLY_CAP}
          label={`${formatCurrency(earnings.capped)} / ${formatCurrency(WEEKLY_CAP)}`}
        />
        {earnings.capApplied && (
          <p className="text-sm text-warning mt-2">You've hit the weekly cap! Excess earnings don't carry over.</p>
        )}
      </motion.div>
    </div>
  );
}
