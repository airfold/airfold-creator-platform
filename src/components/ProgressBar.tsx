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
          {label && <span className="text-sm text-af-medium-gray">{label}</span>}
          {showValue && (
            <span className={`text-sm font-semibold ${isNearMax ? 'text-warning' : 'text-af-charcoal'}`}>
              {Math.round(percent)}%
            </span>
          )}
        </div>
      )}
      <div className="h-2 bg-af-surface rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${percent}%` }}
          transition={{ duration: 1, ease: 'easeOut' }}
          className="h-full rounded-full"
          style={{
            background: color || (isNearMax ? '#f97316' : '#BD295A'),
          }}
        />
      </div>
    </div>
  );
}
