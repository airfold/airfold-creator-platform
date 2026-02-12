import Logo from './Logo';

export default function DesktopBlocker() {
  return (
    <div className="hidden md:flex fixed inset-0 z-[100] bg-gradient-to-b from-af-tint-soft/50 via-white to-white items-center justify-center">
      <div className="text-center px-8 max-w-md">
        <Logo size="lg" className="mb-8 inline-block" />

        <div className="mb-8">
          <div className="text-6xl mb-4">📱</div>
          <h1 className="text-3xl font-bold text-af-deep-charcoal mb-3">Mobile Experience Only</h1>
          <p className="text-af-medium-gray leading-relaxed text-lg">
            The Creator Dashboard is optimized for mobile devices. Please open this page on your phone for the best experience.
          </p>
        </div>

        <div className="glass-card p-6 text-left space-y-4">
          <div>
            <p className="text-sm font-semibold text-af-deep-charcoal mb-1">Option 1: Visit on your phone</p>
            <div className="bg-af-surface rounded-xl px-4 py-3">
              <p className="text-sm text-af-tint font-mono break-all">{window.location.href}</p>
            </div>
          </div>
          <div className="border-t border-af-light-gray pt-4">
            <p className="text-sm font-semibold text-af-deep-charcoal mb-1">Option 2: Use browser DevTools</p>
            <p className="text-xs text-af-medium-gray">Open DevTools (F12) and toggle device emulation to preview in mobile mode.</p>
          </div>
        </div>

        <p className="text-xs text-af-medium-gray mt-6">Built with care for mobile-first creators</p>
      </div>
    </div>
  );
}
