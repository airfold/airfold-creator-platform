import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import SparklineChart from '../../../components/SparklineChart';
import { useCurrentCreator } from '../../../hooks/useCreatorData';
import { useSelectedApp } from '../../../context/AppContext';
import { getCreatorTotalQAU, getCreatorAvgHealthScore } from '../../../data/creators';
import { haptic } from '../../../utils/haptic';
import {
  calculateWeeklyEarnings,
  calculateMonthlyEarnings,
  formatCurrency,
  formatNumber,
  percentChange,
} from '../../../utils/earnings';

const COLLAPSED_COUNT = 4;
const MONTHLY_CAP = 5000;

export default function Overview() {
  const creator = useCurrentCreator();
  const navigate = useNavigate();
  const { setSelectedAppId } = useSelectedApp();
  const [expanded, setExpanded] = useState(false);

  const totalQAU = getCreatorTotalQAU(creator);
  const currentQAU = totalQAU[7];
  const lastWeekQAU = totalQAU[6];
  const qauChange = percentChange(currentQAU, lastWeekQAU);
  const weekly = calculateWeeklyEarnings(currentQAU);

  const last4Weeks = totalQAU.slice(-4).map(q => calculateWeeklyEarnings(q).capped);
  const monthly = calculateMonthlyEarnings(last4Weeks);
  const healthScore = getCreatorAvgHealthScore(creator);

  // Sort apps by current week QAU descending (top earners first)
  const sortedApps = useMemo(
    () => [...creator.apps].sort((a, b) => b.weeklyQAU[7] - a.weeklyQAU[7]),
    [creator.apps],
  );

  const hasMoreApps = sortedApps.length > COLLAPSED_COUNT;
  const visibleApps = expanded ? sortedApps : sortedApps.slice(0, COLLAPSED_COUNT);

  return (
    <div className="space-y-4">
      {/* Hero — the money */}
      <div className="rounded-2xl bg-gradient-to-br from-af-tint to-[#8B1D42] p-5 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-20 h-20 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2" />

        <div className="relative">
          <p className="text-white/70 text-xs font-medium mb-1">This month</p>
          <div className="flex items-baseline gap-2">
            <span className="text-4xl font-black tracking-tight">{formatCurrency(monthly.capped)}</span>
            {qauChange !== 0 && (
              <span className={`text-sm font-semibold px-2 py-0.5 rounded-full ${qauChange >= 0 ? 'bg-white/20 text-white' : 'bg-red-400/30 text-red-100'}`}>
                {qauChange >= 0 ? '+' : ''}{qauChange}%
              </span>
            )}
          </div>

          <div className="mt-4 mb-1 flex items-center justify-between text-[11px]">
            <span className="text-white/60">{formatCurrency(monthly.capped)} of {formatCurrency(MONTHLY_CAP)}</span>
            <span className="text-white/80 font-medium">{Math.min(Math.round((monthly.capped / MONTHLY_CAP) * 100), 100)}%</span>
          </div>
          <div className="h-1.5 bg-white/15 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${Math.min((monthly.capped / MONTHLY_CAP) * 100, 100)}%` }}
              transition={{ duration: 1, ease: 'easeOut', delay: 0.3 }}
              className="h-full rounded-full bg-white/90"
            />
          </div>

          {monthly.capApplied && (
            <p className="text-[11px] text-white/70 mt-2">
              Cap reached — excess {formatCurrency(monthly.total - monthly.capped)} rolls to next month
            </p>
          )}

          <div className="flex items-center gap-4 mt-4 pt-3 border-t border-white/10">
            <div className="flex-1">
              <p className="text-white/50 text-[10px] mb-0.5">This week</p>
              <p className="text-base font-bold">{formatCurrency(weekly.capped)}</p>
            </div>
            <div className="w-px h-8 bg-white/15" />
            <div className="flex-1">
              <p className="text-white/50 text-[10px] mb-0.5">QAU</p>
              <p className="text-base font-bold">{formatNumber(currentQAU)}</p>
            </div>
            <div className="w-px h-8 bg-white/15" />
            <div className="flex-1">
              <p className="text-white/50 text-[10px] mb-0.5">Health</p>
              <p className="text-base font-bold">{healthScore}<span className="text-xs font-normal text-white/50">/100</span></p>
            </div>
          </div>
        </div>
      </div>

      {/* QAU Trend — mini sparkline */}
      <div
        className="glass-card p-3 flex items-center gap-3 cursor-pointer active:scale-[0.98] transition-transform"
        onClick={() => { haptic(); navigate('/dashboard/earnings'); }}
      >
        <div className="flex-1 min-w-0">
          <p className="text-[11px] text-af-medium-gray mb-0.5">8-week trend</p>
          <p className="text-sm font-bold text-af-deep-charcoal">{formatNumber(currentQAU)} QAU this week</p>
        </div>
        <div className="w-24 shrink-0">
          <SparklineChart data={totalQAU} height={36} />
        </div>
        <svg className="w-4 h-4 text-af-medium-gray shrink-0" viewBox="0 0 16 16" fill="none"><path d="M6 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
      </div>

      {/* Apps */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-semibold text-af-deep-charcoal">Your Apps</h3>
          <span className="text-[11px] text-af-medium-gray">{sortedApps.length} app{sortedApps.length !== 1 ? 's' : ''}</span>
        </div>

        {/* Scrollable container when expanded with many apps */}
        <div
          className={`space-y-1.5 ${expanded && sortedApps.length > 8 ? 'max-h-[420px] overflow-y-auto overscroll-contain' : ''}`}
          style={expanded && sortedApps.length > 8 ? { WebkitOverflowScrolling: 'touch' } : undefined}
        >
          {visibleApps.map((app) => {
            const appEarnings = calculateWeeklyEarnings(app.weeklyQAU[7]);
            const appChange = percentChange(app.weeklyQAU[7], app.weeklyQAU[6]);
            return (
              <div
                key={app.id}
                className="glass-card p-3 flex items-center gap-3 cursor-pointer active:scale-[0.98] transition-transform"
                onClick={() => { haptic(); setSelectedAppId(app.id); navigate('/dashboard/analytics'); }}
              >
                <div className="w-9 h-9 rounded-xl bg-af-tint-soft flex items-center justify-center shrink-0">
                  <span className="text-af-tint text-xs font-bold">{app.appName.charAt(0)}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-semibold text-af-deep-charcoal truncate">{app.appName}</h4>
                  <p className="text-[11px] text-af-medium-gray">{formatNumber(app.weeklyQAU[7])} QAU</p>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-sm font-bold text-af-tint">{formatCurrency(appEarnings.capped)}</p>
                  {appChange !== 0 && (
                    <p className={`text-[10px] font-semibold ${appChange >= 0 ? 'text-success' : 'text-danger'}`}>
                      {appChange >= 0 ? '+' : ''}{appChange}%
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {hasMoreApps && (
          <button
            onClick={() => { haptic(); setExpanded(!expanded); }}
            className="w-full text-center text-xs font-medium text-af-tint mt-2 py-2 cursor-pointer active:opacity-70"
          >
            {expanded ? 'Show less' : `Show all ${sortedApps.length} apps`}
          </button>
        )}
      </div>
    </div>
  );
}
