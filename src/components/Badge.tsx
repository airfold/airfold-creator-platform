interface BadgeProps {
  label: string;
  color?: 'tint' | 'green' | 'amber' | 'red' | 'gray';
}

const colorMap = {
  tint: 'bg-af-tint-soft text-af-tint border-af-tint/20',
  green: 'bg-green-50 text-success border-success/20',
  amber: 'bg-orange-50 text-warning border-warning/20',
  red: 'bg-red-50 text-danger border-danger/20',
  gray: 'bg-af-surface text-af-medium-gray border-af-light-gray',
};

export default function Badge({ label, color = 'tint' }: BadgeProps) {
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${colorMap[color]}`}>
      {label}
    </span>
  );
}
