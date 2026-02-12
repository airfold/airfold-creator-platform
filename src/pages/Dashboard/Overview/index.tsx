import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import SparklineChart from '../../../components/SparklineChart';
import { useMyApps, useCreatorEarnings, useCreatorHealth } from '../../../hooks/useCreatorData';
import { useSelectedApp } from '../../../context/AppContext';
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
  const { data: apps, isLoading: appsLoading } = useMyApps();
  const { data: earnings } = useCreatorEarnings();
  const { data: health } = useCreatorHealth();
  const navigate = useNavigate();
  const { setSelectedAppId } = useSelectedApp();
  const [expanded, setExpanded] = useState(false);

  // Current QAU from apps (always available once loaded)
  const currentQAU = apps?.reduce((sum, app) => sum + (app.user_count ?? 0), 0) ?? 0;
  const weeklyEarnings = calculateWeeklyEarnings(currentQAU);

  // Weekly QAU trend from earnings API (8 weeks) — fallback to flat if unavailable
  const qauTrend = useMemo(() => {
    if (!earnings?.weekly?.length) return null;
    // Group by week_start, sum QAU across apps
    const weekMap = new Map<string, number>();
    earnings.weekly.forEach(w => {
      weekMap.set(w.week_start, (weekMap.get(w.week_start) ?? 0) + w.qau);
    });
    const values = [...weekMap.entries()].sort(([a], [b]) => a.localeCompare(b)).map(([, v]) => v);
    return values.length >= 2 ? values : null;
  }, [earnings]);

  const lastWeekQAU = qauTrend && qauTrend.length >= 2 ? qauTrend[qauTrend.length - 2] : 0;
  const trendCurrentQAU = qauTrend ? qauTrend[qauTrend.length - 1] : currentQAU;
  const qauChange = lastWeekQAU > 0 ? percentChange(trendCurrentQAU, lastWeekQAU) : 0;

  // Monthly earnings from earnings API or estimate from current week
  const monthly = useMemo(() => {
    if (earnings?.totals) {
      const t = earnings.totals;
      return { capped: t.total_capped, total: t.total_gross, capApplied: t.total_gross > t.total_capped };
    }
    return calculateMonthlyEarnings([weeklyEarnings.capped, weeklyEarnings.capped, weeklyEarnings.capped, weeklyEarnings.capped]);
  }, [earnings, weeklyEarnings]);

  const healthScore = health?.score ?? null;

  // Sort apps by user_count descending
  const sortedApps = useMemo(
    () => (apps ? [...apps].sort((a, b) => (b.user_count ?? 0) - (a.user_count ?? 0)) : []),
    [apps],
  );

  const hasMoreApps = sortedApps.length > COLLAPSED_COUNT;
  const visibleApps = expanded ? sortedApps : sortedApps.slice(0, COLLAPSED_COUNT);

  if (appsLoading) {
    return (
      <div className="space-y-4">
        {/* Hero skeleton */}
        <div className="rounded-2xl bg-gradient-to-br from-af-tint/60 to-[#8B1D42]/60 p-5 h-52">
          <div className="h-3 w-20 rounded bg-white/20 animate-pulse mb-2" />
          <div className="h-10 w-32 rounded bg-white/20 animate-pulse mb-6" />
          <div className="h-1.5 w-full rounded-full bg-white/15 animate-pulse mb-4" />
          <div className="flex gap-4 pt-3 border-t border-white/10">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="flex-1 space-y-1">
                <div className="h-2.5 w-12 rounded bg-white/15 animate-pulse" />
                <div className="h-5 w-16 rounded bg-white/20 animate-pulse" />
              </div>
            ))}
          </div>
        </div>
        {/* Trend skeleton */}
        <div className="glass-card p-3 flex items-center gap-3">
          <div className="flex-1 space-y-1.5">
            <div className="h-3 w-20 rounded animate-pulse bg-af-surface" />
            <div className="h-4 w-28 rounded animate-pulse bg-af-surface" />
          </div>
          <div className="w-24 h-9 rounded animate-pulse bg-af-surface" />
        </div>
        {/* Apps skeleton */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <div className="h-4 w-20 rounded animate-pulse bg-af-surface" />
            <div className="h-3 w-12 rounded animate-pulse bg-af-surface" />
          </div>
          {[...Array(3)].map((_, i) => (
            <div key={i} className="glass-card p-3 flex items-center gap-3 mb-1.5">
              <div className="w-9 h-9 rounded-xl animate-pulse bg-af-surface" />
              <div className="flex-1 space-y-1.5">
                <div className="h-3.5 w-24 rounded animate-pulse bg-af-surface" />
                <div className="h-3 w-14 rounded animate-pulse bg-af-surface" />
              </div>
              <div className="h-4 w-16 rounded animate-pulse bg-af-surface" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Hero — the money */}
      <div className="rounded-2xl bg-gradient-to-br from-af-tint to-[#8B1D42] p-5 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-20 h-20 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2" />

        <div className="relative">
          <p className="text-white/70 text-xs font-medium mb-1">This Month</p>
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
              <p className="text-base font-bold">{formatCurrency(weeklyEarnings.capped)}</p>
            </div>
            <div className="w-px h-8 bg-white/15" />
            <div className="flex-1">
              <p className="text-white/50 text-[10px] mb-0.5">QAU</p>
              <p className="text-base font-bold">{formatNumber(currentQAU)}</p>
            </div>
            <div className="w-px h-8 bg-white/15" />
            <div className="flex-1">
              <p className="text-white/50 text-[10px] mb-0.5">Health</p>
              <p className="text-base font-bold">
                {healthScore !== null ? <>{healthScore}<span className="text-xs font-normal text-white/50">/100</span></> : '—'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* QAU Trend — mini sparkline (only if we have historical data) */}
      {qauTrend && (
        <div
          className="glass-card p-3 flex items-center gap-3 cursor-pointer active:scale-[0.98] transition-transform"
          onClick={() => { haptic(); navigate('/dashboard/earnings'); }}
        >
          <div className="flex-1 min-w-0">
            <p className="text-[11px] text-af-medium-gray mb-0.5">{qauTrend.length}-week trend</p>
            <p className="text-sm font-bold text-af-deep-charcoal">{formatNumber(trendCurrentQAU)} QAU this week</p>
          </div>
          <div className="w-24 shrink-0">
            <SparklineChart data={qauTrend} height={36} />
          </div>
          <svg className="w-4 h-4 text-af-medium-gray shrink-0" viewBox="0 0 16 16" fill="none"><path d="M6 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
        </div>
      )}

      {/* Apps */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-semibold text-af-deep-charcoal">Your Apps</h3>
          <span className="text-[11px] text-af-medium-gray">{sortedApps.length} app{sortedApps.length !== 1 ? 's' : ''}</span>
        </div>

        <div
          className={`space-y-1.5 ${expanded && sortedApps.length > 8 ? 'max-h-[420px] overflow-y-auto overscroll-contain' : ''}`}
          style={expanded && sortedApps.length > 8 ? { WebkitOverflowScrolling: 'touch' } : undefined}
        >
          {visibleApps.map((app) => {
            const appQAU = app.user_count ?? 0;
            const appEarnings = calculateWeeklyEarnings(appQAU);
            return (
              <div
                key={app.id}
                className="glass-card p-3 flex items-center gap-3 cursor-pointer active:scale-[0.98] transition-transform"
                onClick={() => { haptic(); setSelectedAppId(app.id); navigate('/dashboard/analytics'); }}
              >
                <div className="w-9 h-9 rounded-xl bg-af-tint-soft flex items-center justify-center shrink-0">
                  <span className="text-af-tint text-xs font-bold">{app.name.charAt(0)}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-semibold text-af-deep-charcoal truncate">{app.name}</h4>
                  <p className="text-[11px] text-af-medium-gray">{formatNumber(appQAU)} QAU</p>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-sm font-bold text-af-tint">{formatCurrency(appEarnings.capped)}</p>
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
