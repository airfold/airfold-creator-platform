import { useState } from 'react';
import { useLeaderboard } from '../../../hooks/useCreatorData';

import { haptic } from '../../../utils/haptic';

type Period = 'week' | 'month' | 'all';

export default function Leaderboard() {
  const [period, setPeriod] = useState<Period>('week');
  const { data: leaderboardData, isLoading } = useLeaderboard(period);

  const entries = leaderboardData?.entries ?? [];
  const myRank = leaderboardData?.my_rank;

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-bold text-af-deep-charcoal mb-3">Leaderboard</h1>
        <div className="flex gap-2">
          {(['week', 'month', 'all'] as Period[]).map(p => (
            <button
              key={p}
              onClick={() => { haptic(); setPeriod(p); }}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer border ${
                period === p
                  ? 'bg-af-tint-soft text-af-tint border-af-tint/20'
                  : 'bg-white text-af-medium-gray active:text-af-deep-charcoal border-af-light-gray'
              }`}
            >
              {p === 'week' ? 'Week' : p === 'month' ? 'Month' : 'All'}
            </button>
          ))}
        </div>
      </div>

      {isLoading ? (
        <div className="glass-card p-8 text-center text-af-medium-gray text-sm">Loading...</div>
      ) : (
        <div className="glass-card overflow-hidden">
          <div className="divide-y divide-af-light-gray">
            {entries.map((entry) => {
              const isCurrentUser = myRank != null && entry.rank === myRank.rank;

              return (
                <div
                  key={entry.user_id}
                  className={`flex items-center gap-3 px-4 py-3 ${
                    isCurrentUser ? 'bg-af-tint-soft border-l-2 border-l-af-tint' : ''
                  }`}
                >
                  <span className={`w-7 text-center font-bold ${entry.rank <= 3 ? 'text-sm text-af-tint' : 'text-xs text-af-deep-charcoal'}`}>
                    #{entry.rank}
                  </span>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
                    isCurrentUser ? 'bg-af-tint text-white' : 'bg-af-surface text-af-charcoal'
                  }`}>
                    {entry.avatar ? (
                      <img src={entry.avatar} alt="" className="w-full h-full rounded-full object-cover" />
                    ) : (
                      entry.name.charAt(0)
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1">
                      <span className={`text-sm font-medium truncate ${isCurrentUser ? 'text-af-tint' : 'text-af-deep-charcoal'}`}>{entry.name}</span>
                      {isCurrentUser && <span className="text-[10px] text-af-tint shrink-0">(You)</span>}
                    </div>
                    <span className="text-xs text-af-medium-gray truncate block">{entry.app_count} app{entry.app_count !== 1 ? 's' : ''}</span>
                  </div>
                  <div className="text-right shrink-0">
                    <div className="text-xs text-af-medium-gray">{entry.app_count > 1 ? `${entry.app_count} apps` : '1 app'}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
