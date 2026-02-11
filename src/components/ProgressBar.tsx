import { motion } from 'framer-motion';

interface ProgressBarProps {
  value: number;
  max: number;
  label?: string;
  showValue?: boolean;
  color?: string;
}

export default function ProgressBar({ value, max, label, showValue = true, color }: ProgressBarProps) {
  const percent = Math.min((value / max) * 100, 100);
  const isNearMax = percent >= 80;

  return (
    <div>
      {(label || showValue) && (
        <div className="flex justify-between items-center mb-1.5">
          {label && <span className="text-sm text-white/50">{label}</span>}
          {showValue && (
            <span className={`text-sm font-semibold ${isNearMax ? 'text-warning' : 'text-white/70'}`}>
              {Math.round(percent)}%
            </span>
          )}
        </div>
      )}
      <div className="h-2 bg-white/10 rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${percent}%` }}
          transition={{ duration: 1, ease: 'easeOut' }}
          className="h-full rounded-full"
          style={{
            background: color || (isNearMax
              ? 'linear-gradient(90deg, #f59e0b, #ef4444)'
              : 'linear-gradient(90deg, #3b82f6, #8b5cf6)'),
          }}
        />
      </div>
    </div>
  );
}
