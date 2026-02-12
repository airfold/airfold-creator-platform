import AppSelector from '../../../components/AppSelector';
import { useCreatorHealth } from '../../../hooks/useCreatorData';
import { useSelectedApp } from '../../../context/AppContext';

function formatSessionTime(seconds: number): string {
  if (seconds >= 60) return `${Math.floor(seconds / 60)}m ${seconds % 60}s`;
  return `${seconds}s`;
}

export default function HealthScore() {
  const { selectedAppId } = useSelectedApp();
  const { data: healthData, isLoading } = useCreatorHealth(selectedAppId);

  if (isLoading) {
    return (
      <div className="space-y-4">
        <h1 className="text-2xl font-bold text-af-deep-charcoal">Health</h1>
        <div className="h-40 rounded-2xl animate-pulse bg-af-surface" />
      </div>
    );
  }

  const score = healthData?.score ?? 80;
  const flags = healthData?.flags ?? [];
  const metrics = healthData?.metrics;
  const scoreColor = score >= 80 ? '#22c55e' : score >= 50 ? '#f97316' : '#ef4444';
  const scoreBg = score >= 80 ? 'bg-green-50' : score >= 50 ? 'bg-orange-50' : 'bg-red-50';
  const statusLabel = score >= 80 ? "You're good" : score >= 50 ? 'Needs work' : 'Fix this';

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-bold text-af-deep-charcoal">Health</h1>
        <p className="text-sm text-af-medium-gray">{selectedAppId ? 'Selected App' : 'All Apps'}</p>
      </div>

      <AppSelector />

      {/* Big score */}
      <div className={`${scoreBg} rounded-2xl p-6 text-center`}>
        <div className="text-6xl font-black mb-1" style={{ color: scoreColor }}>{score}</div>
        <div className="text-sm font-semibold text-af-deep-charcoal">{statusLabel}</div>
        <div className="text-xs text-af-medium-gray mt-0.5">
          {score >= 80 ? 'Eligible for payouts' : score >= 50 ? 'At risk — improve metrics below' : 'Under review — fix flagged issues'}
        </div>
      </div>

      {/* Quick metrics 2x2 */}
      <div className="grid grid-cols-2 gap-3">
        <div className="glass-card p-4 text-center">
          <div className="text-2xl font-bold text-af-deep-charcoal">{metrics?.same_ip_percent ?? 0}%</div>
          <div className="text-xs text-af-medium-gray mt-0.5">Same IP</div>
          <div className={`text-[10px] font-semibold mt-1 ${(metrics?.same_ip_percent ?? 0) > 20 ? 'text-danger' : 'text-success'}`}>
            {(metrics?.same_ip_percent ?? 0) > 20 ? 'Too high' : 'Good'}
          </div>
        </div>
        <div className="glass-card p-4 text-center">
          <div className="text-2xl font-bold text-af-deep-charcoal">{metrics?.bounce_rate ?? 0}%</div>
          <div className="text-xs text-af-medium-gray mt-0.5">Bounce Rate</div>
          <div className={`text-[10px] font-semibold mt-1 ${(metrics?.bounce_rate ?? 0) > 50 ? 'text-danger' : 'text-success'}`}>
            {(metrics?.bounce_rate ?? 0) > 50 ? 'Too high' : 'Good'}
          </div>
        </div>
        <div className="glass-card p-4 text-center">
          <div className="text-2xl font-bold text-af-deep-charcoal">{formatSessionTime(metrics?.avg_session_seconds ?? 0)}</div>
          <div className="text-xs text-af-medium-gray mt-0.5">Avg Session</div>
          <div className={`text-[10px] font-semibold mt-1 ${(metrics?.avg_session_seconds ?? 0) < 60 ? 'text-danger' : 'text-success'}`}>
            {(metrics?.avg_session_seconds ?? 0) < 60 ? 'Too short' : 'Solid'}
          </div>
        </div>
        <div className="glass-card p-4 text-center">
          <div className="text-2xl font-bold text-af-deep-charcoal">{score}<span className="text-sm font-normal text-af-medium-gray">/100</span></div>
          <div className="text-xs text-af-medium-gray mt-0.5">Overall</div>
          <div className={`text-[10px] font-semibold mt-1 ${score >= 80 ? 'text-success' : score >= 50 ? 'text-warning' : 'text-danger'}`}>
            {score >= 80 ? 'Eligible' : score >= 50 ? 'At risk' : 'Review'}
          </div>
        </div>
      </div>

      {/* Flags */}
      {flags.length > 0 && (
        <div className="glass-card p-4">
          <h3 className="text-sm font-semibold text-af-deep-charcoal mb-2">Flags</h3>
          <div className="flex flex-wrap gap-2">
            {flags.map(flag => (
              <span key={flag} className="text-xs font-medium text-danger bg-red-50 px-2.5 py-1 rounded-full">
                {flag.replace(/_/g, ' ')}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
