import { Outlet, Link, useLocation } from 'react-router-dom';
import Logo from '../../components/Logo';
import DesktopBlocker from '../../components/DesktopBlocker';

export default function PublicLayout() {
  const location = useLocation();
  const isLanding = location.pathname === '/';

  return (
    <>
      <DesktopBlocker />
      <div className="min-h-screen bg-white md:hidden">
        <nav className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-xl border-b border-af-light-gray safe-top">
          <div className="px-4 h-14 flex items-center justify-between">
            <Link to="/">
              <Logo size="sm" />
            </Link>
            <div className="flex items-center gap-3">
              {isLanding && (
                <Link to="/login" className="bg-af-tint text-white px-4 py-2 rounded-xl text-sm font-semibold">
                  Login
                </Link>
              )}
            </div>
          </div>
        </nav>
        <main className="pt-14">
          <Outlet />
        </main>
      </div>
    </>
  );
}
