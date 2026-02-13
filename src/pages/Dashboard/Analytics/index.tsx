import {
  AreaChart, Area,
  BarChart, Bar,
  XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid,
} from 'recharts';
import AppSelector from '../../../components/AppSelector';
import { useMyApps, useCreatorAnalytics, useAppAnalytics, useCreatorEarnings } from '../../../hooks/useCreatorData';
import { useSelectedApp } from '../../../context/AppContext';

const tooltipStyle = {
  background: '#FFFFFF',
  border: '1px solid #E5E5EA',
  borderRadius: '12px',
  color: '#1A1A1A',
  boxShadow: '0 2px 6px rgba(0,0,0,0.03)',
};

export default function Analytics() {
  const { data: apps } = useMyApps();
  const { selectedAppId } = useSelectedApp();
  const { data: earnings } = useCreatorEarnings(selectedAppId);

  const selectedApp = selectedAppId && apps ? apps.find(a => a.id === selectedAppId) : null;

  const { data: creatorAnalytics, isLoading: creatorLoading, error: creatorError } = useCreatorAnalytics('30d');
  const { data: appAnalytics, isLoading: appLoading, error: appError } = useAppAnalytics(selectedAppId);

  const analytics = selectedAppId ? appAnalytics : creatorAnalytics;
  const isLoading = selectedAppId ? appLoading : creatorLoading;
  const error = selectedAppId ? appError : creatorError;

  const dauData = analytics?.dau ?? [];
  const totalViews = analytics?.total_views ?? 0;
  const uniqueUsers = analytics?.unique_users ?? 0;

  // QAU trend from earnings data
  const qauTrend = (() => {
    if (earnings?.weekly?.length) {
      const weekMap = new Map<string, number>();
      earnings.weekly.forEach(w => {
        weekMap.set(w.week_start, (weekMap.get(w.week_start) ?? 0) + w.qau);
      });
      return [...weekMap.entries()]
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([, qau], i) => ({
          week: `W${i + 1}`,
          qau,
        }));
    }
    // Fallback: single bar from current user_counts
    const totalQAU = apps?.reduce((sum, a) => sum + (a.user_count ?? 0), 0) ?? 0;
    return [{ week: 'Now', qau: totalQAU }];
  })();

  const subtitle = selectedApp
    ? selectedApp.name
    : apps && apps.length > 1
      ? 'All Apps'
      : apps?.[0]?.name ?? '';

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-bold text-af-deep-charcoal mb-0.5">Analytics</h1>
        <p className="text-sm text-af-medium-gray">{subtitle}</p>
      </div>

      <AppSelector />

      <div className="space-y-5">
      {/* Summary stats */}
      <div className="grid grid-cols-2 gap-3">
        <div className="glass-card p-3 text-center">
          <div className="text-xs text-af-medium-gray mb-0.5">Views (30d)</div>
          {isLoading ? (
            <div className="h-6 w-16 rounded animate-pulse bg-af-surface mx-auto" />
          ) : (
            <div className="text-xl font-bold text-af-tint">{totalViews.toLocaleString()}</div>
          )}
        </div>
        <div className="glass-card p-3 text-center">
          <div className="text-xs text-af-medium-gray mb-0.5">Unique (30d)</div>
          {isLoading ? (
            <div className="h-6 w-16 rounded animate-pulse bg-af-surface mx-auto" />
          ) : (
            <div className="text-xl font-bold text-af-tint">{uniqueUsers.toLocaleString()}</div>
          )}
        </div>
      </div>

      {/* DAU from real API */}
      <div className="glass-card p-4">
        <h3 className="text-sm font-semibold text-af-deep-charcoal mb-3">DAU (30d)</h3>
        {isLoading ? (
          <div className="h-[180px] rounded-xl animate-pulse bg-af-surface" />
        ) : error ? (
          <div className="h-[180px] flex items-center justify-center text-af-medium-gray text-sm">No data available</div>
        ) : (
          <ResponsiveContainer width="100%" height={180}>
            <AreaChart data={dauData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E5EA" />
              <XAxis dataKey="day" stroke="#8E8E93" fontSize={10} tickFormatter={(v) => v.slice(5)} />
              <YAxis stroke="#8E8E93" fontSize={10} width={35} />
              <Tooltip contentStyle={tooltipStyle} />
              <defs>
                <linearGradient id="dauGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#BD295A" stopOpacity={0.15} />
                  <stop offset="100%" stopColor="#BD295A" stopOpacity={0} />
                </linearGradient>
              </defs>
              <Area type="monotone" dataKey="users" stroke="#BD295A" strokeWidth={2} fill="url(#dauGrad)" />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </div>

      {/* Weekly QAU */}
      <div className="glass-card p-4">
        <h3 className="text-sm font-semibold text-af-deep-charcoal mb-3">Weekly QAU</h3>
        {isLoading ? (
          <div className="h-[180px] rounded-xl animate-pulse bg-af-surface" />
        ) : (
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={qauTrend}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E5EA" />
              <XAxis dataKey="week" stroke="#8E8E93" fontSize={10} />
              <YAxis stroke="#8E8E93" fontSize={10} width={35} />
              <Tooltip contentStyle={tooltipStyle} />
              <Bar dataKey="qau" name="QAU" fill="#BD295A" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
      </div>
    </div>
  );
}
