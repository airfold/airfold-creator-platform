import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  calculateWeeklyEarnings,
  formatCurrency,
  getStreakMultiplier,
  getStreakTierLabel,
  getStreakTierColor,
  WEEKLY_CAP,
  MONTHLY_CAP,
} from '../../../utils/earnings';
import ProgressBar from '../../../components/ProgressBar';

export default function Calculator() {
  const [qau, setQAU] = useState(500);
  const [streakWeek, setStreakWeek] = useState(5);
  const [platformPercent, setPlatformPercent] = useState(60);

  const earnings = calculateWeeklyEarnings(qau, streakWeek, platformPercent);
  const multiplier = getStreakMultiplier(streakWeek);
  const tierLabel = getStreakTierLabel(streakWeek);
  const tierColor = getStreakTierColor(streakWeek);
  const monthlyProjection = Math.min(earnings.capped * 4.3, MONTHLY_CAP);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-1">Earnings Calculator</h1>
        <p className="text-white/40">Estimate your potential earnings</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Inputs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card p-6 space-y-8"
        >
          <div>
            <div className="flex justify-between mb-2">
              <label className="text-sm font-medium text-white/50">Expected QAU</label>
              <span className="text-sm font-bold text-accent-blue">{qau.toLocaleString()}</span>
            </div>
            <input
              type="range"
              min={0}
              max={1500}
              step={10}
              value={qau}
              onChange={e => setQAU(Number(e.target.value))}
              className="w-full accent-accent-blue"
            />
            <div className="flex justify-between text-xs text-white/20 mt-1">
              <span>0</span>
              <span>1,500</span>
            </div>
          </div>

          <div>
            <div className="flex justify-between mb-2">
              <label className="text-sm font-medium text-white/50">Current Streak Week</label>
              <span className="text-sm font-bold" style={{ color: tierColor }}>
                Week {streakWeek} ({tierLabel})
              </span>
            </div>
            <input
              type="range"
              min={1}
              max={15}
              step={1}
              value={streakWeek}
              onChange={e => setStreakWeek(Number(e.target.value))}
              className="w-full accent-accent-purple"
            />
            <div className="flex justify-between text-xs text-white/20 mt-1">
              <span>Week 1</span>
              <span>Week 15</span>
            </div>

            <div className="flex gap-1 mt-3">
              {[
                { range: '1-2', mult: '1.0x', active: streakWeek <= 2 },
                { range: '3-4', mult: '1.3x', active: streakWeek >= 3 && streakWeek <= 4 },
                { range: '5-8', mult: '1.6x', active: streakWeek >= 5 && streakWeek <= 8 },
                { range: '9+', mult: '2.0x', active: streakWeek >= 9 },
              ].map(t => (
                <div key={t.range} className={`flex-1 text-center py-2 rounded-lg text-xs font-medium ${
                  t.active ? 'bg-accent-purple/20 text-accent-purple border border-accent-purple/30' : 'bg-white/5 text-white/30'
                }`}>
                  <div className="font-bold">{t.mult}</div>
                  <div className="text-[10px] opacity-60">W{t.range}</div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <div className="flex justify-between mb-2">
              <label className="text-sm font-medium text-white/50">% Users from Airfold Platform</label>
              <span className="text-sm font-bold text-accent-blue">{platformPercent}%</span>
            </div>
            <input
              type="range"
              min={0}
              max={100}
              step={5}
              value={platformPercent}
              onChange={e => setPlatformPercent(Number(e.target.value))}
              className="w-full accent-accent-blue"
            />
            <div className="flex justify-between text-xs text-white/20 mt-1">
              <span>0% (all external)</span>
              <span>100% (all platform)</span>
            </div>
            <p className="text-xs text-white/30 mt-2">
              Platform users = 1.5x value, External users = 1.0x value
            </p>
          </div>
        </motion.div>

        {/* Results */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="space-y-4"
        >
          <div className="glass-card p-6">
            <h3 className="text-sm text-white/40 mb-3">Earnings Breakdown</h3>
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-white/50">Base earnings ({qau} QAU x $2)</span>
                <span className="font-medium">{formatCurrency(earnings.baseEarnings)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-white/50">Platform bonus (1.5x on {platformPercent}%)</span>
                <span className="font-medium text-success">+{formatCurrency(earnings.platformBonus)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-white/50">Streak multiplier</span>
                <span className="font-medium text-accent-purple">{multiplier}x</span>
              </div>
              <div className="border-t border-white/5 pt-3 flex justify-between">
                <span className="font-semibold">Weekly Total</span>
                <span className="text-2xl font-bold gradient-text">{formatCurrency(earnings.capped)}</span>
              </div>
            </div>
          </div>

          <div className="glass-card p-6">
            <h3 className="text-sm text-white/40 mb-3">Monthly Projection</h3>
            <span className="text-3xl font-bold gradient-text">{formatCurrency(Math.round(monthlyProjection))}</span>
            <span className="text-white/30 text-sm ml-2">/month</span>
          </div>

          <div className="glass-card p-6 space-y-4">
            <h3 className="text-sm text-white/40">Cap Warnings</h3>
            <ProgressBar
              value={earnings.capped}
              max={WEEKLY_CAP}
              label={`Weekly: ${formatCurrency(earnings.capped)} / ${formatCurrency(WEEKLY_CAP)}`}
            />
            <ProgressBar
              value={monthlyProjection}
              max={MONTHLY_CAP}
              label={`Monthly: ${formatCurrency(Math.round(monthlyProjection))} / ${formatCurrency(MONTHLY_CAP)}`}
            />
            {earnings.capApplied && (
              <div className="bg-warning/10 border border-warning/20 rounded-xl p-3 text-sm text-warning">
                Weekly cap reached! You're leaving {formatCurrency(earnings.subtotal - WEEKLY_CAP)} on the table.
              </div>
            )}
            {monthlyProjection >= MONTHLY_CAP && (
              <div className="bg-warning/10 border border-warning/20 rounded-xl p-3 text-sm text-warning">
                Monthly cap would be reached at this rate.
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
