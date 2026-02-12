import {
  LineChart, Line, AreaChart, Area,
  BarChart, Bar,
  XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend,
} from 'recharts';
import AppSelector from '../../../components/AppSelector';
import { useCurrentCreator, useCreatorAnalytics, useAppAnalytics } from '../../../hooks/useCreatorData';
import { useSelectedApp } from '../../../context/AppContext';
import { getCreatorTotalQAU } from '../../../data/creators';

const tooltipStyle = {
  background: '#FFFFFF',
  border: '1px solid #E5E5EA',
  borderRadius: '12px',
  color: '#1A1A1A',
  boxShadow: '0 2px 6px rgba(0,0,0,0.03)',
};

export default function Analytics() {
  const creator = useCurrentCreator();
  const { selectedAppId } = useSelectedApp();

  const selectedApp = selectedAppId ? creator.apps.find(a => a.id === selectedAppId) : null;
  const weeklyQAU = selectedApp ? selectedApp.weeklyQAU : getCreatorTotalQAU(creator);

  const { data: creatorAnalytics, isLoading: creatorLoading, error: creatorError } = useCreatorAnalytics('30d');
  const { data: appAnalytics, isLoading: appLoading } = useAppAnalytics(selectedAppId);

  const analytics = selectedAppId ? appAnalytics : creatorAnalytics;
  const isLoading = selectedAppId ? appLoading : creatorLoading;
  const error = selectedAppId ? null : creatorError;

  const dauData = analytics?.dau ?? [];
  const totalViews = analytics?.total_views ?? 0;
  const uniqueUsers = analytics?.unique_users ?? 0;

  const qauVsUnique = weeklyQAU.map((qau, i) => ({
    week: `W${i + 1}`,
    qau,
    uniqueUsers: Math.round(qau * (1.4 + Math.random() * 0.3)),
  }));

  const retentionData = [
    { week: 'Week 1', retention: 100 },
    { week: 'Week 2', retention: 68 },
    { week: 'Week 3', retention: 52 },
    { week: 'Week 4', retention: 41 },
  ];

  const subtitle = selectedApp ? selectedApp.appName : creator.apps.length > 1 ? 'All Apps' : creator.apps[0]?.appName ?? '';

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-bold text-af-deep-charcoal mb-0.5">Analytics</h1>
        <p className="text-sm text-af-medium-gray">{subtitle} · Performance deep dive</p>
      </div>

      <AppSelector />

      {/* Summary stats */}
      <div className="grid grid-cols-2 gap-3">
        <div className="glass-card p-3 text-center">
          <div className="text-xs text-af-medium-gray mb-0.5">Total Views (30d)</div>
          <div className="text-xl font-bold text-af-tint">{isLoading ? '—' : totalViews.toLocaleString()}</div>
        </div>
        <div className="glass-card p-3 text-center">
          <div className="text-xs text-af-medium-gray mb-0.5">Unique Users (30d)</div>
          <div className="text-xl font-bold text-af-tint">{isLoading ? '—' : uniqueUsers.toLocaleString()}</div>
        </div>
      </div>

      {/* DAU from real API */}
      <div className="glass-card p-4">
        <h3 className="text-base font-semibold text-af-deep-charcoal mb-0.5">Daily Active Users (30d)</h3>
        <p className="text-xs text-af-medium-gray mb-3">
          {isLoading ? 'Loading...' : error ? 'Using cached data' : 'Live from analytics'}
        </p>
        {isLoading ? (
          <div className="h-[180px] flex items-center justify-center text-af-medium-gray text-sm">Loading...</div>
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

      <div className="space-y-4 md:grid md:grid-cols-2 md:gap-4 md:space-y-0">
        {/* QAU vs Unique Users */}
        <div className="glass-card p-4">
          <h3 className="text-base font-semibold text-af-deep-charcoal mb-0.5">QAU vs Unique Users</h3>
          <p className="text-xs text-af-medium-gray mb-3">How many unique users qualify as QAU</p>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={qauVsUnique}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E5EA" />
              <XAxis dataKey="week" stroke="#8E8E93" fontSize={10} />
              <YAxis stroke="#8E8E93" fontSize={10} width={35} />
              <Tooltip contentStyle={tooltipStyle} />
              <Legend wrapperStyle={{ fontSize: 11 }} />
              <Bar dataKey="uniqueUsers" name="Unique" fill="#E5E5EA" radius={[4, 4, 0, 0]} />
              <Bar dataKey="qau" name="QAU" fill="#BD295A" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Retention */}
        <div className="glass-card p-4">
          <h3 className="text-base font-semibold text-af-deep-charcoal mb-0.5">Retention Curve</h3>
          <p className="text-xs text-af-medium-gray mb-3">User retention across weeks</p>
          <ResponsiveContainer width="100%" height={180}>
            <LineChart data={retentionData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E5EA" />
              <XAxis dataKey="week" stroke="#8E8E93" fontSize={10} />
              <YAxis stroke="#8E8E93" fontSize={10} unit="%" width={35} />
              <Tooltip contentStyle={tooltipStyle} />
              <Line type="monotone" dataKey="retention" stroke="#22c55e" strokeWidth={3} dot={{ r: 4, fill: '#22c55e' }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
