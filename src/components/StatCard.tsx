import { motion } from 'framer-motion';
import { useAnimatedNumber } from '../hooks/useAnimatedNumber';

interface StatCardProps {
  label: string;
  value: number;
  prefix?: string;
  suffix?: string;
  change?: number;
  icon?: React.ReactNode;
}

export default function StatCard({ label, value, prefix = '', suffix = '', change, icon }: StatCardProps) {
  const animated = useAnimatedNumber(value);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-card p-6"
    >
      <div className="flex items-start justify-between mb-3">
        <span className="text-sm text-white/50 font-medium">{label}</span>
        {icon && <span className="text-accent-blue">{icon}</span>}
      </div>
      <div className="flex items-end gap-3">
        <span className="text-3xl font-bold text-white">
          {prefix}{animated.toLocaleString()}{suffix}
        </span>
        {change !== undefined && (
          <span className={`text-sm font-semibold mb-1 ${change >= 0 ? 'text-success' : 'text-danger'}`}>
            {change >= 0 ? '+' : ''}{change}%
          </span>
        )}
      </div>
    </motion.div>
  );
}
