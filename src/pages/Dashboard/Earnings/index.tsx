import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import AppSelector from '../../../components/AppSelector';
import { useCreatorEarnings } from '../../../hooks/useCreatorData';
import { useSelectedApp } from '../../../context/AppContext';
import {
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
  const { selectedAppId } = useSelectedApp();
  const { data: earningsData, isLoading } = useCreatorEarnings(selectedAppId);

  const weeklyData = (earningsData?.weekly ?? []).map((w, i) => ({
    week: `W${i + 1}`,
    qau: w.qau,
    earnings: w.gross,
    payout: w.capped,
  }));

  const monthlyResult = calculateMonthlyEarnings(weeklyData.slice(-4).map(w => w.payout));

  const subtitle = selectedAppId
    ? (earningsData?.weekly?.[0]?.app_name ?? 'App')
    : 'All Apps';

  if (isLoading) {
    return (
      <div className="space-y-5">
        <div>
          <h1 className="text-2xl font-bold text-af-deep-charcoal mb-0.5">Earnings</h1>
          <p className="text-sm text-af-medium-gray">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-bold text-af-deep-charcoal mb-0.5">Earnings</h1>
        <p className="text-sm text-af-medium-gray">{subtitle} · Paid monthly</p>
      </div>

      <AppSelector />

      <div className="glass-card p-4">
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
      </div>

      <div className="glass-card overflow-hidden">
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
                <tr key={i} className={`border-b border-af-light-gray ${i === weeklyData.length - 1 ? 'bg-af-tint-soft' : ''}`}>
                  <td className="px-3 py-2.5 font-medium text-af-deep-charcoal">{w.week}</td>
                  <td className="text-right px-3 py-2.5 text-af-charcoal">{w.qau.toLocaleString()}</td>
                  <td className="text-right px-3 py-2.5 text-af-charcoal">{formatCurrency(w.earnings)}</td>
                  <td className="text-right px-3 py-2.5 font-bold text-af-tint">{formatCurrency(w.payout)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {monthlyResult.capApplied && (
        <div className="bg-af-tint-soft rounded-xl p-3 text-xs text-af-tint">
          Monthly cap reached. The excess {formatCurrency(monthlyResult.total - monthlyResult.capped)} will be added to your next month's payout cycle.
        </div>
      )}
    </div>
  );
}
