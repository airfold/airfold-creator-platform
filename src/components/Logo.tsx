interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const sizes = {
  sm: 'text-xl',
  md: 'text-2xl',
  lg: 'text-4xl',
};

export default function Logo({ size = 'md', className = '' }: LogoProps) {
  return (
    <span className={`font-black tracking-tight ${sizes[size]} ${className}`}>
      <span className="text-af-tint">a</span>
      <span className="text-af-deep-charcoal">irfold</span>
    </span>
  );
}
