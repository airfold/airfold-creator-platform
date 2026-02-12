import { motion } from 'framer-motion';
import { useAnimatedNumber } from '../hooks/useAnimatedNumber';

interface StatCardProps {
  label: string;
  value: number;
  prefix?: string;
  suffix?: string;
  change?: number;
}

export default function StatCard({ label, value, prefix = '', suffix = '', change }: StatCardProps) {
  const animated = useAnimatedNumber(value);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-card p-4"
    >
      <span className="text-xs text-af-medium-gray font-medium leading-tight block mb-1.5">{label}</span>
      <div className="flex items-end gap-2">
        <span className="text-2xl font-bold text-af-deep-charcoal">
          {prefix}{animated.toLocaleString()}{suffix}
        </span>
        {change !== undefined && (
          <span className={`text-xs font-semibold mb-0.5 ${change >= 0 ? 'text-success' : 'text-danger'}`}>
            {change >= 0 ? '+' : ''}{change}%
          </span>
        )}
      </div>
    </motion.div>
  );
}
