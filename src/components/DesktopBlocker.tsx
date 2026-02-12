import Logo from './Logo';

export default function DesktopBlocker() {
  return (
    <div className="hidden md:flex fixed inset-0 z-[100] bg-gradient-to-b from-af-tint-soft/50 via-white to-white items-center justify-center">
      <div className="text-center px-8 max-w-lg">
        <Logo size="lg" className="mb-10 inline-block" />

        <div className="text-6xl mb-6">📱</div>
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
