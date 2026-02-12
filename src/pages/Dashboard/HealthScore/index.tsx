import { useState } from 'react';
import AppSelector from '../../../components/AppSelector';
import { useCreatorHealth } from '../../../hooks/useCreatorData';
import { useSelectedApp } from '../../../context/AppContext';

function formatSessionTime(seconds: number): string {
  if (seconds >= 60) return `${Math.floor(seconds / 60)}m ${seconds % 60}s`;
  return `${seconds}s`;
}

function QAURulesSheet({ onClose }: { onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center" onClick={onClose}>
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
      <div
        className="relative w-full max-w-md bg-white rounded-t-2xl p-5 pb-8 animate-slide-up"
        onClick={e => e.stopPropagation()}
      >
        <div className="w-10 h-1 bg-af-light-gray rounded-full mx-auto mb-4" />
        <h3 className="text-lg font-bold text-af-deep-charcoal mb-1">What counts as a QAU?</h3>
        <p className="text-xs text-af-medium-gray mb-4">A Qualified Active User must meet all of these:</p>

        <div className="space-y-3">
          <div className="flex items-start gap-3 bg-af-surface rounded-xl p-3">
            <div className="w-8 h-8 rounded-full bg-af-tint-soft flex items-center justify-center shrink-0">
              <svg className="w-4 h-4 text-af-tint" viewBox="0 0 16 16" fill="none"><rect x="2" y="3" width="12" height="10" rx="1.5" stroke="currentColor" strokeWidth="1.5"/><path d="M2 6h12M5 3v-1M11 3v-1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
            </div>
            <div>
              <div className="text-sm font-semibold text-af-deep-charcoal">3+ days per week</div>
              <div className="text-xs text-af-medium-gray">Must open your app on at least 3 different days (Mon–Sun)</div>
            </div>
          </div>

          <div className="flex items-start gap-3 bg-af-surface rounded-xl p-3">
            <div className="w-8 h-8 rounded-full bg-af-tint-soft flex items-center justify-center shrink-0">
              <svg className="w-4 h-4 text-af-tint" viewBox="0 0 16 16" fill="none"><circle cx="8" cy="8" r="6" stroke="currentColor" strokeWidth="1.5"/><path d="M8 5v3.5l2.5 1.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
            </div>
            <div>
              <div className="text-sm font-semibold text-af-deep-charcoal">1 min per session</div>
              <div className="text-xs text-af-medium-gray">Quick bounces are filtered out — each visit must be 60s+</div>
            </div>
          </div>

          <div className="flex items-start gap-3 bg-af-surface rounded-xl p-3">
            <div className="w-8 h-8 rounded-full bg-af-tint-soft flex items-center justify-center shrink-0">
              <svg className="w-4 h-4 text-af-tint" viewBox="0 0 16 16" fill="none"><path d="M13.5 6.5a3.5 3.5 0 11-7 0 3.5 3.5 0 017 0zM4 16c0-2.5 2.5-4.5 6-4.5s6 2 6 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
            </div>
            <div>
              <div className="text-sm font-semibold text-af-deep-charcoal">Not flagged</div>
              <div className="text-xs text-af-medium-gray">No bot traffic, fake accounts, or same-IP farming</div>
            </div>
          </div>
        </div>

        <button
          onClick={onClose}
          className="w-full mt-5 py-2.5 rounded-xl bg-af-tint text-white text-sm font-semibold active:opacity-80 cursor-pointer"
        >
          Got it
        </button>
      </div>
    </div>
  );
}

export default function HealthScore() {
  const { selectedAppId } = useSelectedApp();
  const { data: healthData, isLoading } = useCreatorHealth(selectedAppId);
  const [showRules, setShowRules] = useState(false);

  if (isLoading) {
    return (
      <div className="space-y-4">
        <h1 className="text-2xl font-bold text-af-deep-charcoal">Health</h1>
        <div className="h-10 rounded-xl animate-pulse bg-af-surface" />
        <div className="h-40 rounded-2xl animate-pulse bg-af-surface" />
        <div className="grid grid-cols-3 gap-3">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-20 rounded-2xl animate-pulse bg-af-surface" />
          ))}
        </div>
      </div>
    );
  }

  const score = healthData?.score ?? 80;
  const flags = healthData?.flags ?? [];
  const metrics = healthData?.metrics;
  const scoreColor = score >= 80 ? '#22c55e' : score >= 50 ? '#f97316' : '#ef4444';
  const scoreBg = score >= 80 ? 'bg-green-50' : score >= 50 ? 'bg-orange-50' : 'bg-red-50';

  const sameIp = metrics?.same_ip_percent ?? 0;
  const bounce = metrics?.bounce_rate ?? 0;
  const session = metrics?.avg_session_seconds ?? 0;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-af-deep-charcoal">Health</h1>
          <p className="text-sm text-af-medium-gray">{selectedAppId ? 'Selected App' : 'All Apps'}</p>
        </div>
        <button
          onClick={() => setShowRules(true)}
          className="w-7 h-7 rounded-full bg-af-surface flex items-center justify-center text-af-medium-gray active:bg-af-light-gray cursor-pointer"
          aria-label="QAU rules"
        >
          <svg className="w-3.5 h-3.5" viewBox="0 0 14 14" fill="none"><circle cx="7" cy="7" r="6" stroke="currentColor" strokeWidth="1.5"/><path d="M5.5 5.5c0-1.1.67-1.75 1.5-1.75s1.5.65 1.5 1.75c0 .7-.5 1-1 1.25-.25.13-.5.38-.5.75" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/><circle cx="7" cy="10" r="0.6" fill="currentColor"/></svg>
        </button>
      </div>

      <AppSelector />

      <div className="space-y-4">
        {/* Score card */}
        <div className={`${scoreBg} rounded-2xl p-6 text-center`}>
          <div className="text-6xl font-black mb-1" style={{ color: scoreColor }}>{score}</div>
          <div className="text-sm font-semibold text-af-deep-charcoal">
            {score >= 80 ? 'Looking great' : score >= 50 ? 'Needs attention' : 'Action required'}
          </div>
          <div className="text-xs text-af-medium-gray mt-0.5">
            {score >= 80 ? 'Your app qualifies for payouts' : score >= 50 ? 'Improve the flagged areas to stay eligible' : 'Fix the issues below to keep earning'}
          </div>
        </div>

        {/* Metrics — human-readable */}
        <div className="space-y-2.5">
          {/* Session time */}
          <div className="glass-card p-4 flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${session >= 60 ? 'bg-green-50' : 'bg-red-50'}`}>
              <svg className={`w-5 h-5 ${session >= 60 ? 'text-green-500' : 'text-red-500'}`} viewBox="0 0 20 20" fill="none"><circle cx="10" cy="10" r="7.5" stroke="currentColor" strokeWidth="1.5"/><path d="M10 6v4.5l3 1.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-semibold text-af-deep-charcoal">Avg time in app</div>
              <div className="text-xs text-af-medium-gray">{session >= 60 ? 'Users are sticking around' : 'Users leave too quickly'}</div>
            </div>
            <div className="text-right shrink-0">
              <div className="text-lg font-bold text-af-deep-charcoal">{formatSessionTime(session)}</div>
              <div className={`text-[10px] font-semibold ${session >= 60 ? 'text-green-500' : 'text-red-500'}`}>
                {session >= 60 ? 'Good' : 'Under 1 min'}
              </div>
            </div>
          </div>

          {/* Repeat visitors (bounce = opposite) */}
          <div className="glass-card p-4 flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${bounce <= 50 ? 'bg-green-50' : 'bg-red-50'}`}>
              <svg className={`w-5 h-5 ${bounce <= 50 ? 'text-green-500' : 'text-red-500'}`} viewBox="0 0 20 20" fill="none"><path d="M10 3v4m0 0l-2-2m2 2l2-2M10 17v-4m0 0l-2 2m2-2l2 2M3 10h4m0 0L5 8m2 2L5 12M17 10h-4m0 0l2-2m-2 2l2 2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-semibold text-af-deep-charcoal">One-time visitors</div>
              <div className="text-xs text-af-medium-gray">{bounce <= 50 ? 'Most users come back' : 'Too many leave after 1 visit'}</div>
            </div>
            <div className="text-right shrink-0">
              <div className="text-lg font-bold text-af-deep-charcoal">{bounce}%</div>
              <div className={`text-[10px] font-semibold ${bounce <= 50 ? 'text-green-500' : 'text-red-500'}`}>
                {bounce <= 50 ? 'Good' : 'Too high'}
              </div>
            </div>
          </div>

          {/* Unique users (same IP = suspicious) */}
          <div className="glass-card p-4 flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${sameIp <= 20 ? 'bg-green-50' : 'bg-red-50'}`}>
              <svg className={`w-5 h-5 ${sameIp <= 20 ? 'text-green-500' : 'text-red-500'}`} viewBox="0 0 20 20" fill="none"><path d="M13.5 6.5a3.5 3.5 0 11-7 0 3.5 3.5 0 017 0zM4 16c0-2.5 2.5-4.5 6-4.5s6 2 6 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-semibold text-af-deep-charcoal">User authenticity</div>
              <div className="text-xs text-af-medium-gray">{sameIp <= 20 ? 'Traffic looks organic' : 'Some traffic looks suspicious'}</div>
            </div>
            <div className="text-right shrink-0">
              <div className="text-lg font-bold text-af-deep-charcoal">{100 - sameIp}%</div>
              <div className={`text-[10px] font-semibold ${sameIp <= 20 ? 'text-green-500' : 'text-red-500'}`}>
                {sameIp <= 20 ? 'Organic' : 'Flagged'}
              </div>
            </div>
          </div>
        </div>

        {/* Flags — friendly wording */}
        {flags.length > 0 && (
          <div className="bg-red-50 rounded-xl p-4">
            <h3 className="text-sm font-semibold text-red-600 mb-2">Things to fix</h3>
            <div className="space-y-1.5">
              {flags.map(flag => (
                <div key={flag} className="flex items-center gap-2 text-xs text-red-600">
                  <span className="w-1.5 h-1.5 rounded-full bg-red-400 shrink-0" />
                  {flag === 'same_ip_cluster' && 'Too many visits from the same source — share your app more widely'}
                  {flag === 'high_bounce_rate' && 'Most users only visit once — make your app more engaging'}
                  {flag === 'low_session_time' && 'Sessions are under 1 minute — add more content to keep users in'}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {showRules && <QAURulesSheet onClose={() => setShowRules(false)} />}
    </div>
  );
}
