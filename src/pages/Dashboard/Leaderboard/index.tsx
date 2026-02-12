import { useState } from 'react';
import { motion } from 'framer-motion';
import { useAllCreators } from '../../../hooks/useCreatorData';
import { formatNumber, formatCurrency } from '../../../utils/earnings';

type Period = 'week' | 'month' | 'all';

function getQAU(weeklyQAU: number[], period: Period): number {
  switch (period) {
    case 'week': return weeklyQAU[7];
    case 'month': return weeklyQAU.slice(-4).reduce((s, v) => s + v, 0);
    case 'all': return weeklyQAU.reduce((s, v) => s + v, 0);
  }
}

export default function Leaderboard() {
  const { creators, currentCreatorId } = useAllCreators();
  const [period, setPeriod] = useState<Period>('week');

  const sorted = [...creators]
    .map(c => ({ ...c, qau: getQAU(c.weeklyQAU, period) }))
    .sort((a, b) => b.qau - a.qau)
    .slice(0, 20);

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-bold text-af-deep-charcoal mb-0.5">Leaderboard</h1>
        <p className="text-sm text-af-medium-gray mb-3">Top creators ranked by QAU</p>
        <div className="flex gap-2">
          {(['week', 'month', 'all'] as Period[]).map(p => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
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

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card overflow-hidden">
        <div className="divide-y divide-af-light-gray">
          {sorted.map((c, i) => {
            const isCurrentUser = c.id === currentCreatorId;
            const weekEarnings = Math.min(c.qau * 2, period === 'week' ? 2000 : period === 'month' ? 5000 : Infinity);

            return (
              <motion.div
                key={c.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.02 }}
                className={`flex items-center gap-3 px-4 py-3 ${
                  isCurrentUser ? 'bg-af-tint-soft border-l-2 border-l-af-tint' : ''
                }`}
              >
                <span className={`w-7 text-center font-bold text-af-deep-charcoal ${i < 3 ? 'text-base' : 'text-xs'}`}>
                  {i === 0 && '🥇'}
                  {i === 1 && '🥈'}
                  {i === 2 && '🥉'}
                  {i > 2 && `#${i + 1}`}
                </span>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
                  isCurrentUser ? 'bg-af-tint text-white' : 'bg-af-surface text-af-charcoal'
                }`}>
                  {c.name.charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1">
                    <span className={`text-sm font-medium truncate ${isCurrentUser ? 'text-af-tint' : 'text-af-deep-charcoal'}`}>{c.name}</span>
                    {isCurrentUser && <span className="text-[10px] text-af-tint shrink-0">(You)</span>}
                  </div>
                  <span className="text-xs text-af-medium-gray truncate block">{c.appName}</span>
                </div>
                <div className="text-right shrink-0">
                  <div className="text-sm font-bold text-af-tint">{formatCurrency(weekEarnings)}</div>
                  <div className="text-[10px] text-af-medium-gray">{formatNumber(c.qau)} QAU</div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </motion.div>
    </div>
  );
}
