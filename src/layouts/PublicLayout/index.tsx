import { Outlet, Link, useLocation } from 'react-router-dom';
import Logo from '../../components/Logo';

export default function PublicLayout() {
  const location = useLocation();
  const isLanding = location.pathname === '/';

  return (
    <div className="min-h-screen bg-white">
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-xl border-b border-af-light-gray">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link to="/">
            <Logo size="md" />
          </Link>
          <div className="flex items-center gap-4">
            {isLanding && (
              <Link to="/login" className="btn-primary text-sm">
                Creator Login
              </Link>
            )}
          </div>
        </div>
      </nav>
      <main className="pt-16">
        <Outlet />
      </main>
    </div>
  );
}
