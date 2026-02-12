import Logo from './Logo';

export default function DesktopBlocker() {
  return (
    <div className="hidden lg:flex fixed inset-0 z-[100] bg-gradient-to-b from-af-tint-soft/50 via-white to-white items-center justify-center">
      <div className="text-center px-8 max-w-lg">
        <Logo size="lg" className="mb-10 inline-block" />

        <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-af-tint-soft flex items-center justify-center">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#BD295A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="5" y="2" width="14" height="20" rx="2" ry="2" /><line x1="12" y1="18" x2="12.01" y2="18" />
          </svg>
        </div>
        <h1 className="text-3xl font-bold text-af-deep-charcoal mb-3">
          Mobile Access Only
        </h1>
        <p className="text-af-medium-gray leading-relaxed text-lg mb-10 max-w-sm mx-auto">
          The Airfold Creator Dashboard is built for on-the-go creators. Open this page on your phone to get started.
        </p>

        <a
          href={window.location.href}
          className="btn-primary text-lg px-10 py-4 inline-block"
        >
          Open on Mobile
        </a>

        <p className="text-xs text-af-medium-gray mt-8">
          Scan this page's URL with your phone camera or share the link to yourself.
        </p>
      </div>
    </div>
  );
}
