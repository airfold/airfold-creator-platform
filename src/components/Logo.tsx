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
      <span className="bg-gradient-to-r from-accent-blue to-accent-purple bg-clip-text text-transparent">a</span>
      <span className="text-white">irfold</span>
    </span>
  );
}
