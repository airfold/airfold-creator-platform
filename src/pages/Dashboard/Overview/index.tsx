import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import StatCard from '../../../components/StatCard';
import { useCurrentCreator } from '../../../hooks/useCreatorData';
import { useSelectedApp } from '../../../context/AppContext';
import { getCreatorTotalQAU } from '../../../data/creators';
import { haptic } from '../../../utils/haptic';
import {
  calculateWeeklyEarnings,
  calculateMonthlyEarnings,
  formatCurrency,
  formatNumber,
  percentChange,
} from '../../../utils/earnings';

const MAX_VISIBLE_APPS = 4;

export default function Overview() {
  const creator = useCurrentCreator();
  const navigate = useNavigate();
  const { setSelectedAppId } = useSelectedApp();
  const [showAllApps, setShowAllApps] = useState(false);

  const totalQAU = getCreatorTotalQAU(creator);
  const currentQAU = totalQAU[7];
  const lastWeekQAU = totalQAU[6];
  const qauChange = percentChange(currentQAU, lastWeekQAU);
  const earnings = calculateWeeklyEarnings(currentQAU);

  // Monthly calculation from last 4 weeks
  const last4Weeks = totalQAU.slice(-4).map(q => calculateWeeklyEarnings(q).capped);
  const monthly = calculateMonthlyEarnings(last4Weeks);

  const visibleApps = showAllApps ? creator.apps : creator.apps.slice(0, MAX_VISIBLE_APPS);
  const hasMoreApps = creator.apps.length > MAX_VISIBLE_APPS;

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-bold text-af-deep-charcoal mb-0.5">Overview</h1>
        <p className="text-sm text-af-medium-gray">Welcome back, {creator.name.split(' ')[0]}</p>
      </div>

      {/* App cards — horizontal scroll on mobile */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-semibold text-af-deep-charcoal">Your Apps</h3>
          <span className="text-xs text-af-medium-gray">{creator.apps.length} app{creator.apps.length !== 1 ? 's' : ''}</span>
        </div>
        <div className="flex gap-2.5 overflow-x-auto pb-2 -mx-1 px-1 scrollbar-hide snap-x snap-mandatory">
          {visibleApps.map((app, idx) => {
            const appEarnings = calculateWeeklyEarnings(app.weeklyQAU[7]);
            const appChange = percentChange(app.weeklyQAU[7], app.weeklyQAU[6]);
            return (
              <motion.div
                key={app.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: idx * 0.04 }}
                className="glass-card p-3 min-w-[140px] max-w-[160px] shrink-0 snap-start cursor-pointer active:scale-[0.97] transition-transform"
                onClick={() => { haptic(); setSelectedAppId(app.id); navigate('/dashboard/analytics'); }}
              >
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-7 h-7 rounded-lg bg-af-tint-soft flex items-center justify-center shrink-0">
                    <span className="text-af-tint text-[10px] font-bold">{app.appName.charAt(0)}</span>
                  </div>
                  <div className="min-w-0">
                    <h4 className="text-xs font-bold text-af-deep-charcoal truncate">{app.appName}</h4>
                    <p className="text-[9px] text-af-medium-gray">{app.category}</p>
                  </div>
                </div>
                <div className="flex items-end justify-between">
                  <div>
                    <div className="text-sm font-bold text-af-tint">{formatCurrency(appEarnings.capped)}</div>
                    <div className="text-[10px] text-af-medium-gray">{formatNumber(app.weeklyQAU[7])} QAU</div>
                  </div>
                  {appChange !== 0 && (
                    <span className={`text-[10px] font-semibold ${appChange >= 0 ? 'text-success' : 'text-danger'}`}>
                      {appChange >= 0 ? '+' : ''}{appChange}%
                    </span>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
        {hasMoreApps && !showAllApps && (
          <button
            onClick={() => { haptic(); setShowAllApps(true); }}
            className="text-xs font-medium text-af-tint mt-1 cursor-pointer"
          >
            Show all {creator.apps.length} apps
          </button>
        )}
        {showAllApps && hasMoreApps && (
          <button
            onClick={() => { haptic(); setShowAllApps(false); }}
            className="text-xs font-medium text-af-medium-gray mt-1 cursor-pointer"
          >
            Show less
          </button>
        )}
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 gap-3">
        <StatCard label="This Month" value={monthly.capped} prefix="$" />
        <StatCard label="QAU This Week" value={currentQAU} change={qauChange} />
        <StatCard label="Weekly Earnings" value={earnings.capped} prefix="$" />
        <StatCard label="Total Apps" value={creator.apps.length} />
      </div>

      {/* Monthly Payout Summary */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="glass-card p-4">
        <h3 className="text-base font-semibold text-af-deep-charcoal mb-3">Monthly Payout</h3>

        <div className="bg-af-surface rounded-xl p-3 mb-3">
          <div className="text-xs text-af-medium-gray mb-0.5">Current cycle</div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-af-tint">{formatCurrency(monthly.capped)}</span>
            {monthly.capApplied && (
              <span className="text-[10px] text-warning font-medium">Cap reached</span>
            )}
          </div>
        </div>

        <div className="space-y-1.5 text-xs">
          <div className="flex justify-between">
            <span className="text-af-medium-gray">Weekly cap</span>
            <span className="text-af-deep-charcoal font-medium">$2,000 / week</span>
          </div>
          <div className="flex justify-between">
            <span className="text-af-medium-gray">Monthly cap</span>
            <span className="text-af-deep-charcoal font-medium">$5,000 / month</span>
          </div>
          <div className="flex justify-between">
            <span className="text-af-medium-gray">Rate</span>
            <span className="text-af-deep-charcoal font-medium">$2 per QAU</span>
          </div>
          <div className="flex justify-between">
            <span className="text-af-medium-gray">Payout schedule</span>
            <span className="text-af-deep-charcoal font-medium">Monthly</span>
          </div>
          <div className="flex justify-between pt-1.5 border-t border-af-light-gray font-semibold">
            <span className="text-af-deep-charcoal">Next payout</span>
            <span className="text-af-tint">{formatCurrency(monthly.capped)}</span>
          </div>
        </div>

        {monthly.capApplied && (
          <div className="mt-3 bg-af-tint-soft rounded-xl p-3 text-xs text-af-tint">
            You earned {formatCurrency(monthly.total)} this month but the monthly cap is $5,000. The excess {formatCurrency(monthly.total - monthly.capped)} will be added to your next month's payout cycle.
          </div>
        )}
      </motion.div>

      {/* Earnings breakdown */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }} className="glass-card p-4">
        <h3 className="text-base font-semibold text-af-deep-charcoal mb-3">This Week</h3>

        <div className="space-y-1.5 text-xs">
          <div className="flex justify-between">
            <span className="text-af-medium-gray">QAU count</span>
            <span className="text-af-deep-charcoal font-medium">{formatNumber(currentQAU)}</span>
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

        {earnings.capApplied && (
          <div className="mt-3 bg-af-tint-soft rounded-xl p-3 text-xs text-af-tint">
            Weekly cap reached. The excess {formatCurrency(earnings.earnings - earnings.capped)} will be added to your next month's payout cycle.
          </div>
        )}
      </motion.div>
    </div>
  );
}
