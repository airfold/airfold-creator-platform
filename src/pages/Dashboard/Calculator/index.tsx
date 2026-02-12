import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  calculateWeeklyEarnings,
  calculateMonthlyEarnings,
  formatCurrency,
} from '../../../utils/earnings';

export default function Calculator() {
  const [qau, setQAU] = useState(500);

  const earnings = calculateWeeklyEarnings(qau);
  const monthlyProjection = calculateMonthlyEarnings([earnings.capped, earnings.capped, earnings.capped, earnings.capped]);

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-bold text-af-deep-charcoal mb-0.5">Earnings Calculator</h1>
        <p className="text-sm text-af-medium-gray">Estimate your potential earnings</p>
      </div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-4 space-y-5">
        <div>
          <div className="flex justify-between mb-2">
            <label className="text-sm font-medium text-af-charcoal">Expected QAU / Week</label>
            <span className="text-sm font-bold text-af-tint">{qau.toLocaleString()}</span>
          </div>
          <input type="range" min={0} max={1500} step={10} value={qau} onChange={e => setQAU(Number(e.target.value))} className="w-full accent-af-tint h-2" />
          <div className="flex justify-between text-xs text-af-medium-gray mt-1">
            <span>0</span>
            <span>1,500</span>
          </div>
        </div>

        <div className="bg-af-surface rounded-xl p-4">
          <h4 className="text-xs font-medium text-af-charcoal mb-2">Payment Structure</h4>
          <div className="space-y-1.5 text-xs">
            <div className="flex justify-between">
              <span className="text-af-medium-gray">Rate</span>
              <span className="text-af-deep-charcoal font-medium">$2 per QAU / week</span>
            </div>
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-2 md:grid-cols-2 gap-3">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="glass-card p-4">
          <h3 className="text-xs text-af-medium-gray mb-1">Weekly Payout</h3>
          <span className="text-2xl font-bold text-af-tint">{formatCurrency(earnings.capped)}</span>
          <div className="text-[10px] text-af-medium-gray mt-1">{qau.toLocaleString()} QAU x $2</div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="glass-card p-4">
          <h3 className="text-xs text-af-medium-gray mb-1">Monthly Projection</h3>
          <span className="text-2xl font-bold text-af-tint">{formatCurrency(monthlyProjection.capped)}</span>
          <div className="text-[10px] text-af-medium-gray mt-1">per month</div>
        </motion.div>
      </div>

      {(earnings.capApplied || monthlyProjection.capApplied) && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="text-xs text-af-medium-gray text-center">
          {earnings.capApplied && <p>Weekly earnings limit reached at this QAU level.</p>}
          {monthlyProjection.capApplied && <p>Monthly earnings limit would be reached at this rate.</p>}
        </motion.div>
      )}
    </div>
  );
}
