interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const sizes = {
  sm: { icon: 'w-6 h-6', text: 'text-xl' },
  md: { icon: 'w-8 h-8', text: 'text-2xl' },
  lg: { icon: 'w-12 h-12', text: 'text-4xl' },
};

export default function Logo({ size = 'md', className = '' }: LogoProps) {
  return (
    <span className={`inline-flex items-center gap-2 font-black tracking-tight ${sizes[size].text} ${className}`}>
      <img src="/icon.png" alt="Airfold" className={`${sizes[size].icon} rounded-lg`} />
      <span className="text-af-tint">airfold</span>
    </span>
  );
}
