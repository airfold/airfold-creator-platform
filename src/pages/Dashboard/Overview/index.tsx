import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import StatCard from '../../../components/StatCard';
import SparklineChart from '../../../components/SparklineChart';
import { useCurrentCreator } from '../../../hooks/useCreatorData';
import { useSelectedApp } from '../../../context/AppContext';
import { getCreatorTotalQAU } from '../../../data/creators';
import {
  calculateWeeklyEarnings,
  formatCurrency,
  formatNumber,
  percentChange,
} from '../../../utils/earnings';

function categoryEmoji(category: string) {
  return category === 'Social' ? '💕' : category === 'Education' ? '📚' : category === 'Food' ? '🍔' : category === 'Fitness' ? '💪' : '📱';
}

export default function Overview() {
  const creator = useCurrentCreator();
  const navigate = useNavigate();
  const { setSelectedAppId } = useSelectedApp();

  const totalQAU = getCreatorTotalQAU(creator);
  const currentQAU = totalQAU[7];
  const lastWeekQAU = totalQAU[6];
  const qauChange = percentChange(currentQAU, lastWeekQAU);
  const earnings = calculateWeeklyEarnings(currentQAU);
  const monthlyProjection = earnings.capped * 4.3;

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-bold text-af-deep-charcoal mb-0.5">Overview</h1>
        <p className="text-sm text-af-medium-gray">Welcome back, {creator.name.split(' ')[0]}</p>
      </div>

      {/* App cards */}
      <div className="space-y-3">
        {creator.apps.map((app, idx) => {
          const appEarnings = calculateWeeklyEarnings(app.weeklyQAU[7]);
          return (
            <motion.div
              key={app.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              className="glass-card p-4 flex items-center gap-3 cursor-pointer active:scale-[0.98] transition-transform"
              onClick={() => { setSelectedAppId(app.id); navigate('/dashboard/analytics'); }}
            >
              <div className="w-10 h-10 rounded-xl bg-af-tint-soft flex items-center justify-center text-xl shrink-0">
                {categoryEmoji(app.category)}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-sm text-af-deep-charcoal truncate">{app.appName}</h3>
                <p className="text-[10px] text-af-medium-gray">{app.category}</p>
              </div>
              <div className="w-16 h-8 shrink-0">
                <SparklineChart data={app.weeklyQAU} height={32} />
              </div>
              <div className="text-right shrink-0">
                <div className="text-xs font-bold text-af-tint">{formatCurrency(appEarnings.capped)}</div>
                <div className="text-[10px] text-af-medium-gray">{formatNumber(app.weeklyQAU[7])} QAU</div>
              </div>
            </motion.div>
          );
        })}
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <StatCard label="Earnings This Week" value={earnings.capped} prefix="$" icon={<span className="text-2xl">💰</span>} />
        <StatCard label="QAU This Week" value={currentQAU} change={qauChange} icon={<span className="text-2xl">👥</span>} />
        <StatCard label="QAU Last Week" value={lastWeekQAU} icon={<span className="text-2xl">📊</span>} />
        <StatCard label="Monthly Projection" value={Math.round(monthlyProjection)} prefix="$" icon={<span className="text-2xl">📈</span>} />
      </div>

      {/* QAU Trend */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="glass-card p-4">
        <h3 className="text-base font-semibold text-af-deep-charcoal mb-0.5">QAU Trend (8 Weeks)</h3>
        <p className="text-xs text-af-medium-gray mb-3">Qualified Active Users over time{creator.apps.length > 1 ? ' (all apps)' : ''}</p>
        <SparklineChart data={totalQAU} height={140} />
        <div className="flex justify-between mt-3 text-[10px] text-af-medium-gray">
          <span>8 weeks ago</span>
          <span>This week</span>
        </div>
      </motion.div>

      {/* Earnings breakdown */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="glass-card p-4">
        <h3 className="text-base font-semibold text-af-deep-charcoal mb-3">Earnings Breakdown</h3>

        <div className="bg-af-surface rounded-xl p-3 mb-3">
          <div className="text-xs text-af-medium-gray mb-0.5">This Week</div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-af-tint">{formatCurrency(earnings.capped)}</span>
            {earnings.capApplied && <span className="text-[10px] text-af-medium-gray">Limit reached</span>}
          </div>
        </div>

        <div className="space-y-1.5 text-xs">
          <div className="flex justify-between">
            <span className="text-af-medium-gray">QAU count</span>
            <span className="text-af-deep-charcoal font-medium">{formatNumber(currentQAU)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-af-medium-gray">Rate per QAU</span>
            <span className="text-af-deep-charcoal font-medium">$2</span>
          </div>
          <div className="flex justify-between">
            <span className="text-af-medium-gray">Gross earnings</span>
            <span className="text-af-deep-charcoal font-medium">{formatCurrency(earnings.earnings)}</span>
          </div>
          <div className="flex justify-between pt-1.5 border-t border-af-light-gray font-semibold">
            <span className="text-af-deep-charcoal">Payout</span>
            <span className="text-af-tint">{formatCurrency(earnings.capped)}</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
