import { useState } from 'react';
import { motion } from 'framer-motion';
import Badge from '../../../components/Badge';
import { creators, currentCreatorId } from '../../../data/creators';
import { formatNumber, getStreakMultiplier, getStreakTierLabel } from '../../../utils/earnings';

type Period = 'week' | 'month' | 'all';

function getQAU(weeklyQAU: number[], period: Period): number {
  switch (period) {
    case 'week': return weeklyQAU[7];
    case 'month': return weeklyQAU.slice(-4).reduce((s, v) => s + v, 0);
    case 'all': return weeklyQAU.reduce((s, v) => s + v, 0);
  }
}

export default function Leaderboard() {
  const [period, setPeriod] = useState<Period>('week');

  const sorted = [...creators]
    .map(c => ({ ...c, qau: getQAU(c.weeklyQAU, period) }))
    .sort((a, b) => b.qau - a.qau)
    .slice(0, 20);

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold mb-1">Leaderboard</h1>
          <p className="text-white/40">Top creators ranked by QAU</p>
        </div>
        <div className="flex gap-2">
          {(['week', 'month', 'all'] as Period[]).map(p => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all cursor-pointer border-none ${
                period === p
                  ? 'bg-accent-blue/20 text-accent-blue border border-accent-blue/30'
                  : 'bg-white/5 text-white/40 hover:text-white hover:bg-white/10'
              }`}
            >
              {p === 'week' ? 'This Week' : p === 'month' ? 'This Month' : 'All Time'}
            </button>
          ))}
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card overflow-hidden"
      >
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/5">
                <th className="text-left px-6 py-4 text-white/40 font-medium w-16">Rank</th>
                <th className="text-left px-6 py-4 text-white/40 font-medium">Creator</th>
                <th className="text-left px-6 py-4 text-white/40 font-medium">App</th>
                <th className="text-right px-6 py-4 text-white/40 font-medium">QAU</th>
                <th className="text-right px-6 py-4 text-white/40 font-medium">Streak</th>
                <th className="text-right px-6 py-4 text-white/40 font-medium">Multiplier</th>
              </tr>
            </thead>
            <tbody>
              {sorted.map((c, i) => {
                const isCurrentUser = c.id === currentCreatorId;
                const multiplier = getStreakMultiplier(c.streakWeek);
                const tierLabel = getStreakTierLabel(c.streakWeek);

                return (
                  <motion.tr
                    key={c.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.03 }}
                    className={`border-b border-white/5 transition-colors ${
                      isCurrentUser ? 'bg-accent-blue/5 border-l-2 border-l-accent-blue' : 'hover:bg-white/5'
                    }`}
                  >
                    <td className="px-6 py-4">
                      <span className={`font-bold ${i < 3 ? 'text-lg' : ''}`}>
                        {i === 0 && '🥇'}
                        {i === 1 && '🥈'}
                        {i === 2 && '🥉'}
                        {i > 2 && `#${i + 1}`}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
                          isCurrentUser ? 'bg-gradient-to-r from-accent-blue to-accent-purple' : 'bg-white/10'
                        }`}>
                          {c.name.charAt(0)}
                        </div>
                        <div>
                          <span className={`font-medium ${isCurrentUser ? 'text-accent-blue' : ''}`}>{c.name}</span>
                          {isCurrentUser && <span className="text-xs text-accent-blue ml-2">(You)</span>}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-white/60">{c.appName}</td>
                    <td className="text-right px-6 py-4 font-semibold">{formatNumber(c.qau)}</td>
                    <td className="text-right px-6 py-4">
                      {c.streakWeek > 0 ? `Week ${c.streakWeek}` : '-'}
                    </td>
                    <td className="text-right px-6 py-4">
                      <Badge
                        label={`${multiplier}x ${tierLabel}`}
                        color={multiplier >= 2 ? 'amber' : multiplier >= 1.6 ? 'purple' : multiplier >= 1.3 ? 'blue' : 'gray'}
                      />
                    </td>
                  </motion.tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
}
