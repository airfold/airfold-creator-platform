import { motion } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import AppSelector from '../../../components/AppSelector';
import { useCurrentCreator } from '../../../hooks/useCreatorData';
import { useSelectedApp } from '../../../context/AppContext';
import { getCreatorTotalQAU } from '../../../data/creators';
import {
  calculateWeeklyEarnings,
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

export default function Earnings() {
  const creator = useCurrentCreator();
  const { selectedAppId } = useSelectedApp();

  const selectedApp = selectedAppId ? creator.apps.find(a => a.id === selectedAppId) : null;
  const weeklyQAU = selectedApp ? selectedApp.weeklyQAU : getCreatorTotalQAU(creator);

  const weeklyData = weeklyQAU.map((qau, i) => {
    const e = calculateWeeklyEarnings(qau);
    return {
      week: `W${i + 1}`,
      qau,
      earnings: e.earnings,
      payout: e.capped,
    };
  });

  const monthlyResult = calculateMonthlyEarnings(weeklyData.slice(-4).map(w => w.payout));

  const subtitle = selectedApp ? selectedApp.appName : creator.apps.length > 1 ? 'All Apps' : creator.apps[0]?.appName ?? '';

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-bold text-af-deep-charcoal mb-0.5">Earnings</h1>
        <p className="text-sm text-af-medium-gray">{subtitle} · Weekly and monthly payouts</p>
      </div>

      <AppSelector />

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-4">
        <h3 className="text-base font-semibold text-af-deep-charcoal mb-4">Weekly Earnings</h3>
        <ResponsiveContainer width="100%" height={240}>
          <BarChart data={weeklyData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#E5E5EA" />
            <XAxis dataKey="week" stroke="#8E8E93" fontSize={10} />
            <YAxis stroke="#8E8E93" fontSize={10} tickFormatter={v => `$${v}`} width={40} />
            <Tooltip contentStyle={tooltipStyle} formatter={(value) => [formatCurrency(Number(value)), 'Payout']} />
            <Bar dataKey="payout" fill="#BD295A" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="glass-card overflow-hidden">
        <div className="p-4 pb-0">
          <h3 className="text-base font-semibold text-af-deep-charcoal mb-3">Weekly Breakdown</h3>
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
              {weeklyData.map((w, i) => (
                <tr key={i} className={`border-b border-af-light-gray ${i === 7 ? 'bg-af-tint-soft' : ''}`}>
                  <td className="px-3 py-2.5 font-medium text-af-deep-charcoal">{w.week}</td>
                  <td className="text-right px-3 py-2.5 text-af-charcoal">{w.qau.toLocaleString()}</td>
                  <td className="text-right px-3 py-2.5 text-af-charcoal">{formatCurrency(w.earnings)}</td>
                  <td className="text-right px-3 py-2.5 font-bold text-af-tint">{formatCurrency(w.payout)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>

      {monthlyResult.capApplied && (
        <p className="text-xs text-af-medium-gray text-center">Weekly earnings limit reached this period.</p>
      )}
    </div>
  );
}
