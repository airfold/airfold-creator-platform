import { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import AppSelector from '../../../components/AppSelector';
import { useCreatorEarnings, usePayoutStatus } from '../../../hooks/useCreatorData';
import { startConnectOnboarding, refreshOnboardingLink } from '../../../services/api';
import { useSelectedApp } from '../../../context/AppContext';
import {
  calculateMonthlyEarnings,
  formatCurrency,
} from '../../../utils/earnings';

const tooltipStyle = {
  background: '#FFFFFF',
  border: '1px solid #E5E5EA',
  borderRadius: '12px',
  color: '#1A1A1A',
  boxShadow: '0 2px 6px rgba(0,0,0,0.03)',
};

function PayoutCard() {
  const { data: status, isLoading } = usePayoutStatus();
  const [busy, setBusy] = useState(false);

  if (isLoading || !status) {
    return (
      <div className="glass-card p-4">
        <div className="h-12 rounded-xl animate-pulse bg-af-surface" />
      </div>
    );
  }

  const handleSetup = async () => {
    setBusy(true);
    try {
      const res = await startConnectOnboarding();
      window.location.href = res.url;
    } catch {
      setBusy(false);
    }
  };

  const handleComplete = async () => {
    setBusy(true);
    try {
      const res = await refreshOnboardingLink();
      window.location.href = res.url;
    } catch {
      setBusy(false);
    }
  };

  // State 3: Connected & enabled
  if (status.onboarding_complete && status.payouts_enabled) {
    return (
      <div className="glass-card p-4 flex items-center gap-3">
        <div className="w-8 h-8 rounded-full bg-green-50 flex items-center justify-center flex-shrink-0">
          <svg className="w-4 h-4 text-green-600" viewBox="0 0 24 24" fill="none">
            <path d="M5 13l4 4L19 7" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
        <div>
          <p className="text-sm font-semibold text-af-deep-charcoal">Payouts active</p>
          <p className="text-xs text-af-medium-gray">Your Stripe account is connected and ready to receive payouts.</p>
        </div>
      </div>
    );
  }

  // State 2: Onboarding incomplete
  if (status.has_account && !status.onboarding_complete) {
    return (
      <div className="glass-card p-4 flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-amber-50 flex items-center justify-center flex-shrink-0">
            <svg className="w-4 h-4 text-amber-600" viewBox="0 0 24 24" fill="none">
              <path d="M12 9v4m0 4h.01M12 3l9.66 16.5H2.34L12 3z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <div>
            <p className="text-sm font-semibold text-af-deep-charcoal">Setup incomplete</p>
            <p className="text-xs text-af-medium-gray">Finish your Stripe account setup to receive payouts.</p>
          </div>
        </div>
        <button
          onClick={handleComplete}
          disabled={busy}
          className="px-4 py-2 rounded-xl bg-af-tint text-white text-xs font-semibold cursor-pointer active:opacity-80 disabled:opacity-50 flex-shrink-0"
        >
          {busy ? 'Loading...' : 'Complete setup'}
        </button>
      </div>
    );
  }

  // State 1: Not connected
  return (
    <div className="glass-card p-4 flex items-center justify-between gap-3">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-full bg-af-tint-soft flex items-center justify-center flex-shrink-0">
          <svg className="w-4 h-4 text-af-tint" viewBox="0 0 24 24" fill="none">
            <path d="M2 10h20M2 14h20M6 18V6M18 18V6" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          </svg>
        </div>
        <div>
          <p className="text-sm font-semibold text-af-deep-charcoal">Set up payouts</p>
          <p className="text-xs text-af-medium-gray">Connect a Stripe account to receive your earnings.</p>
        </div>
      </div>
      <button
        onClick={handleSetup}
        disabled={busy}
        className="px-4 py-2 rounded-xl bg-af-tint text-white text-xs font-semibold cursor-pointer active:opacity-80 disabled:opacity-50 flex-shrink-0"
      >
        {busy ? 'Loading...' : 'Set up'}
      </button>
    </div>
  );
}

export default function Earnings() {
  const { selectedAppId } = useSelectedApp();
  const { data: earningsData, isLoading } = useCreatorEarnings(selectedAppId);

  // Aggregate by week_start (API returns per-app-per-week rows in "All Apps" view)
  const weeklyData = (() => {
    const byWeek = new Map<string, { qau: number; earnings: number; payout: number }>();
    for (const w of earningsData?.weekly ?? []) {
      const existing = byWeek.get(w.week_start);
      if (existing) {
        existing.qau += w.qau;
        existing.earnings += w.gross;
        existing.payout += w.capped;
      } else {
        byWeek.set(w.week_start, { qau: w.qau, earnings: w.gross, payout: w.capped });
      }
    }
    return Array.from(byWeek.entries()).map(([, data], i) => ({
      week: `W${i + 1}`,
      ...data,
    }));
  })();

  const monthlyResult = calculateMonthlyEarnings(weeklyData.slice(-4).map(w => w.payout));

  const subtitle = selectedAppId
    ? (earningsData?.weekly?.[0]?.app_name ?? 'App')
    : 'All Apps';

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-bold text-af-deep-charcoal mb-0.5">Earnings</h1>
        <p className="text-sm text-af-medium-gray">{subtitle}</p>
      </div>

      <PayoutCard />

      <AppSelector />

      <div className="space-y-5">
      <div className="glass-card p-4">
        <h3 className="text-sm font-semibold text-af-deep-charcoal mb-3">Weekly</h3>
        {isLoading ? (
          <div className="h-[240px] rounded-xl animate-pulse bg-af-surface" />
        ) : (
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={weeklyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E5EA" />
              <XAxis dataKey="week" stroke="#8E8E93" fontSize={10} />
              <YAxis stroke="#8E8E93" fontSize={10} tickFormatter={v => `$${v}`} width={40} />
              <Tooltip contentStyle={tooltipStyle} formatter={(value) => [formatCurrency(Number(value)), 'Payout']} />
              <Bar dataKey="payout" fill="#BD295A" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>

      <div className="glass-card overflow-hidden">
        <div className="p-4 pb-0">
          <h3 className="text-sm font-semibold text-af-deep-charcoal mb-3">Breakdown</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-af-light-gray">
                <th className="text-left px-3 py-2.5 text-af-medium-gray font-medium">Week</th>
                <th className="text-right px-3 py-2.5 text-af-medium-gray font-medium">QAU</th>
                <th className="text-right px-3 py-2.5 text-af-medium-gray font-medium">Gross</th>
                <th className="text-right px-3 py-2.5 text-af-medium-gray font-medium">Payout</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                [...Array(4)].map((_, i) => (
                  <tr key={i} className="border-b border-af-light-gray">
                    <td className="px-3 py-2.5"><div className="h-3 w-8 rounded animate-pulse bg-af-surface" /></td>
                    <td className="px-3 py-2.5 text-right"><div className="h-3 w-10 rounded animate-pulse bg-af-surface ml-auto" /></td>
                    <td className="px-3 py-2.5 text-right"><div className="h-3 w-12 rounded animate-pulse bg-af-surface ml-auto" /></td>
                    <td className="px-3 py-2.5 text-right"><div className="h-3 w-12 rounded animate-pulse bg-af-surface ml-auto" /></td>
                  </tr>
                ))
              ) : (
                weeklyData.map((w, i) => (
                  <tr key={i} className={`border-b border-af-light-gray ${i === weeklyData.length - 1 ? 'bg-af-tint-soft' : ''}`}>
                    <td className="px-3 py-2.5 font-medium text-af-deep-charcoal">{w.week}</td>
                    <td className="text-right px-3 py-2.5 text-af-charcoal">{w.qau.toLocaleString()}</td>
                    <td className="text-right px-3 py-2.5 text-af-charcoal">{formatCurrency(w.earnings)}</td>
                    <td className="text-right px-3 py-2.5 font-bold text-af-tint">{formatCurrency(w.payout)}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {!isLoading && monthlyResult.capApplied && (
        <div className="bg-af-tint-soft rounded-xl p-3 text-xs text-af-tint">
          Cap reached — {formatCurrency(monthlyResult.total - monthlyResult.capped)} rolls to next month.
        </div>
      )}
      </div>
    </div>
  );
}
