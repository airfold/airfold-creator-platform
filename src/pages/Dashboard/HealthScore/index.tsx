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

  const score = healthData?.score ?? 80;
  const metrics = healthData?.metrics;
  const scoreColor = score >= 80 ? '#22c55e' : score >= 50 ? '#f97316' : '#ef4444';
  const scoreBg = score >= 80 ? 'bg-green-50' : score >= 50 ? 'bg-orange-50' : 'bg-red-50';

  const sameIp = metrics?.same_ip_percent ?? 0;
  const bounce = metrics?.bounce_rate ?? 0;
  const session = metrics?.avg_session_seconds ?? 0;

  // green / orange / red status per metric
  const sessionStatus: 'green' | 'orange' | 'red' = session >= 60 ? 'green' : session >= 30 ? 'orange' : 'red';
  const bounceStatus: 'green' | 'orange' | 'red' = bounce <= 40 ? 'green' : bounce <= 60 ? 'orange' : 'red';
  const trafficStatus: 'green' | 'orange' | 'red' = sameIp <= 15 ? 'green' : sameIp <= 30 ? 'orange' : 'red';

  const statusColors = {
    green: { bg: 'bg-green-50', text: 'text-green-500', dot: 'bg-green-500' },
    orange: { bg: 'bg-orange-50', text: 'text-orange-500', dot: 'bg-orange-500' },
    red: { bg: 'bg-red-50', text: 'text-red-500', dot: 'bg-red-500' },
  };

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
        <div className={`${isLoading ? 'bg-af-surface' : scoreBg} rounded-2xl p-6 text-center`}>
          {isLoading ? (
            <>
              <div className="h-14 w-20 rounded mx-auto mb-1 animate-pulse bg-af-light-gray" />
              <div className="h-4 w-24 rounded mx-auto mb-1 animate-pulse bg-af-light-gray" />
              <div className="h-3 w-40 rounded mx-auto animate-pulse bg-af-light-gray" />
            </>
          ) : (
            <>
              <div className="text-6xl font-black mb-1" style={{ color: scoreColor }}>{score}</div>
              <div className="text-sm font-semibold text-af-deep-charcoal">
                {score >= 80 ? 'Looking great' : score >= 50 ? 'Needs attention' : 'Action required'}
              </div>
              <div className="text-xs text-af-medium-gray mt-0.5">
                {score >= 80 ? 'Your app qualifies for payouts' : score >= 50 ? 'Improve the flagged areas to stay eligible' : 'Fix the issues below to keep earning'}
              </div>
            </>
          )}
        </div>

        {/* Score breakdown — unified card */}
        <div className="glass-card overflow-hidden">
          <div className="px-4 pt-4 pb-2">
            <h3 className="text-sm font-semibold text-af-deep-charcoal">Score breakdown</h3>
          </div>

          {/* Session time */}
          <div className="px-4 py-3 border-t border-af-light-gray flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${isLoading ? 'bg-af-surface' : statusColors[sessionStatus].bg}`}>
              <svg className={`w-5 h-5 ${isLoading ? 'text-af-medium-gray' : statusColors[sessionStatus].text}`} viewBox="0 0 20 20" fill="none"><circle cx="10" cy="10" r="7.5" stroke="currentColor" strokeWidth="1.5"/><path d="M10 6v4.5l3 1.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-semibold text-af-deep-charcoal">Time in app</div>
              {isLoading ? <div className="h-3 w-36 rounded animate-pulse bg-af-surface mt-1" /> : (
                <div className="text-xs text-af-medium-gray">
                  {sessionStatus === 'green' && `${formatSessionTime(session)} avg — users stick around`}
                  {sessionStatus === 'orange' && `${formatSessionTime(session)} avg — sessions are a bit short`}
                  {sessionStatus === 'red' && `${formatSessionTime(session)} avg — add more content to keep users in`}
                </div>
              )}
            </div>
            <div className="shrink-0">
              {isLoading ? <div className="h-7 w-7 rounded-full animate-pulse bg-af-surface" /> : (
                <span className={`inline-flex items-center justify-center w-7 h-7 rounded-full text-sm font-bold ${statusColors[sessionStatus].bg} ${statusColors[sessionStatus].text}`}>
                  {sessionStatus === 'green' ? '✓' : '✗'}
                </span>
              )}
            </div>
          </div>

          {/* Returning users */}
          <div className="px-4 py-3 border-t border-af-light-gray flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${isLoading ? 'bg-af-surface' : statusColors[bounceStatus].bg}`}>
              <svg className={`w-5 h-5 ${isLoading ? 'text-af-medium-gray' : statusColors[bounceStatus].text}`} viewBox="0 0 20 20" fill="none"><path d="M10 3v4m0 0l-2-2m2 2l2-2M10 17v-4m0 0l-2 2m2-2l2 2M3 10h4m0 0L5 8m2 2L5 12M17 10h-4m0 0l2-2m-2 2l2 2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-semibold text-af-deep-charcoal">Returning users</div>
              {isLoading ? <div className="h-3 w-40 rounded animate-pulse bg-af-surface mt-1" /> : (
                <div className="text-xs text-af-medium-gray">
                  {bounceStatus === 'green' && `${100 - bounce}% come back — great retention`}
                  {bounceStatus === 'orange' && `${100 - bounce}% come back — could be better`}
                  {bounceStatus === 'red' && `Only ${100 - bounce}% come back — make your app more engaging`}
                </div>
              )}
            </div>
            <div className="shrink-0">
              {isLoading ? <div className="h-7 w-7 rounded-full animate-pulse bg-af-surface" /> : (
                <span className={`inline-flex items-center justify-center w-7 h-7 rounded-full text-sm font-bold ${statusColors[bounceStatus].bg} ${statusColors[bounceStatus].text}`}>
                  {bounceStatus === 'green' ? '✓' : '✗'}
                </span>
              )}
            </div>
          </div>

          {/* Real traffic */}
          <div className="px-4 py-3 border-t border-af-light-gray flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${isLoading ? 'bg-af-surface' : statusColors[trafficStatus].bg}`}>
              <svg className={`w-5 h-5 ${isLoading ? 'text-af-medium-gray' : statusColors[trafficStatus].text}`} viewBox="0 0 20 20" fill="none"><path d="M13.5 6.5a3.5 3.5 0 11-7 0 3.5 3.5 0 017 0zM4 16c0-2.5 2.5-4.5 6-4.5s6 2 6 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-semibold text-af-deep-charcoal">Real traffic</div>
              {isLoading ? <div className="h-3 w-32 rounded animate-pulse bg-af-surface mt-1" /> : (
                <div className="text-xs text-af-medium-gray">
                  {trafficStatus === 'green' && `${100 - sameIp}% organic — traffic looks legit`}
                  {trafficStatus === 'orange' && `${100 - sameIp}% organic — some traffic looks suspicious`}
                  {trafficStatus === 'red' && `${sameIp}% from same source — share your app more widely`}
                </div>
              )}
            </div>
            <div className="shrink-0">
              {isLoading ? <div className="h-7 w-7 rounded-full animate-pulse bg-af-surface" /> : (
                <span className={`inline-flex items-center justify-center w-7 h-7 rounded-full text-sm font-bold ${statusColors[trafficStatus].bg} ${statusColors[trafficStatus].text}`}>
                  {trafficStatus === 'green' ? '✓' : '✗'}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {showRules && <QAURulesSheet onClose={() => setShowRules(false)} />}
    </div>
  );
}
