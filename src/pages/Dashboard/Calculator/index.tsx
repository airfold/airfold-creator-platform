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
        <h1 className="text-3xl font-bold text-af-deep-charcoal mb-1">Earnings Calculator</h1>
        <p className="text-af-medium-gray">Estimate your potential earnings</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-6 space-y-8">
          <div>
            <div className="flex justify-between mb-2">
              <label className="text-sm font-medium text-af-charcoal">Expected QAU</label>
              <span className="text-sm font-bold text-af-tint">{qau.toLocaleString()}</span>
            </div>
            <input type="range" min={0} max={1500} step={10} value={qau} onChange={e => setQAU(Number(e.target.value))} className="w-full accent-af-tint" />
            <div className="flex justify-between text-xs text-af-medium-gray mt-1">
              <span>0</span>
              <span>1,500</span>
            </div>
          </div>

          <div>
            <div className="flex justify-between mb-2">
              <label className="text-sm font-medium text-af-charcoal">Current Streak Week</label>
              <span className="text-sm font-bold" style={{ color: tierColor }}>Week {streakWeek} ({tierLabel})</span>
            </div>
            <input type="range" min={1} max={15} step={1} value={streakWeek} onChange={e => setStreakWeek(Number(e.target.value))} className="w-full accent-af-tint" />
            <div className="flex justify-between text-xs text-af-medium-gray mt-1">
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
                <div key={t.range} className={`flex-1 text-center py-2 rounded-lg text-xs font-medium border ${
                  t.active ? 'bg-af-tint-soft text-af-tint border-af-tint/20' : 'bg-af-surface text-af-medium-gray border-af-light-gray'
                }`}>
                  <div className="font-bold">{t.mult}</div>
                  <div className="text-[10px] opacity-60">W{t.range}</div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <div className="flex justify-between mb-2">
              <label className="text-sm font-medium text-af-charcoal">% Users from Airfold Platform</label>
              <span className="text-sm font-bold text-af-tint">{platformPercent}%</span>
            </div>
            <input type="range" min={0} max={100} step={5} value={platformPercent} onChange={e => setPlatformPercent(Number(e.target.value))} className="w-full accent-af-tint" />
            <div className="flex justify-between text-xs text-af-medium-gray mt-1">
              <span>0% (all external)</span>
              <span>100% (all platform)</span>
            </div>
            <p className="text-xs text-af-medium-gray mt-2">Platform users = 1.5x value, External users = 1.0x value</p>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="space-y-4">
          <div className="glass-card p-6">
            <h3 className="text-sm text-af-medium-gray mb-3">Earnings Breakdown</h3>
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-af-medium-gray">Base earnings ({qau} QAU x $2)</span>
                <span className="font-medium text-af-deep-charcoal">{formatCurrency(earnings.baseEarnings)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-af-medium-gray">Platform bonus (1.5x on {platformPercent}%)</span>
                <span className="font-medium text-success">+{formatCurrency(earnings.platformBonus)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-af-medium-gray">Streak multiplier</span>
                <span className="font-medium text-af-tint">{multiplier}x</span>
              </div>
              <div className="border-t border-af-light-gray pt-3 flex justify-between">
                <span className="font-semibold text-af-deep-charcoal">Weekly Total</span>
                <span className="text-2xl font-bold text-af-tint">{formatCurrency(earnings.capped)}</span>
              </div>
            </div>
          </div>

          <div className="glass-card p-6">
            <h3 className="text-sm text-af-medium-gray mb-3">Monthly Projection</h3>
            <span className="text-3xl font-bold text-af-tint">{formatCurrency(Math.round(monthlyProjection))}</span>
            <span className="text-af-medium-gray text-sm ml-2">/month</span>
          </div>

          <div className="glass-card p-6 space-y-4">
            <h3 className="text-sm text-af-medium-gray">Cap Warnings</h3>
            <ProgressBar value={earnings.capped} max={WEEKLY_CAP} label={`Weekly: ${formatCurrency(earnings.capped)} / ${formatCurrency(WEEKLY_CAP)}`} />
            <ProgressBar value={monthlyProjection} max={MONTHLY_CAP} label={`Monthly: ${formatCurrency(Math.round(monthlyProjection))} / ${formatCurrency(MONTHLY_CAP)}`} />
            {earnings.capApplied && (
              <div className="bg-orange-50 border border-warning/20 rounded-xl p-3 text-sm text-warning">
                Weekly cap reached! You're leaving {formatCurrency(earnings.subtotal - WEEKLY_CAP)} on the table.
              </div>
            )}
            {monthlyProjection >= MONTHLY_CAP && (
              <div className="bg-orange-50 border border-warning/20 rounded-xl p-3 text-sm text-warning">
                Monthly cap would be reached at this rate.
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
