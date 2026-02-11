interface BadgeProps {
  label: string;
  color?: 'blue' | 'purple' | 'green' | 'amber' | 'red' | 'gray';
}

const colorMap = {
  blue: 'bg-accent-blue/20 text-accent-blue border-accent-blue/30',
  purple: 'bg-accent-purple/20 text-accent-purple border-accent-purple/30',
  green: 'bg-success/20 text-success border-success/30',
  amber: 'bg-warning/20 text-warning border-warning/30',
  red: 'bg-danger/20 text-danger border-danger/30',
  gray: 'bg-white/10 text-white/60 border-white/20',
};

export default function Badge({ label, color = 'blue' }: BadgeProps) {
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${colorMap[color]}`}>
      {label}
    </span>
  );
}
