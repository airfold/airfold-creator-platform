import { useEffect } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { UserButton } from '@clerk/clerk-react';
import { useAuth } from '../../context/AuthContext';
import { setTokenGetter } from '../../services/api';
import Logo from '../../components/Logo';
import DesktopBlocker from '../../components/DesktopBlocker';

const navItems = [
  { to: '/dashboard', label: 'Overview', icon: '📊' },
  { to: '/dashboard/earnings', label: 'Earnings', icon: '💰' },
  { to: '/dashboard/analytics', label: 'Analytics', icon: '📈' },
  { to: '/dashboard/leaderboard', label: 'Board', icon: '🏆' },
  { to: '/dashboard/calculator', label: 'Calc', icon: '🧮' },
  { to: '/dashboard/health', label: 'Health', icon: '🛡️' },
];

export default function DashboardLayout() {
  const { user, getToken } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    setTokenGetter(getToken);
  }, [getToken]);

  return (
    <>
      <DesktopBlocker />
      <div className={`min-h-screen bg-af-surface ${import.meta.env.PROD ? 'md:hidden' : ''}`}>
        {/* Top bar */}
        <header className="sticky top-0 z-30 bg-white/90 backdrop-blur-xl border-b border-af-light-gray safe-top">
          <div className="h-14 px-4 flex items-center justify-between">
            <div className="cursor-pointer" onClick={() => navigate('/dashboard')}>
              <Logo size="sm" />
            </div>
            <div className="flex items-center gap-3">
              <div className="text-right mr-1">
                <p className="text-xs font-semibold text-af-deep-charcoal leading-tight truncate max-w-[120px]">{user?.name}</p>
              </div>
              <UserButton
                afterSignOutUrl="/"
                appearance={{
                  variables: { colorPrimary: '#BD295A' },
                  elements: { avatarBox: 'w-8 h-8' },
                }}
              />
            </div>
          </div>
        </header>

        {/* Main content */}
        <main className="px-4 pt-4 pb-24">
          <Outlet />
        </main>

        {/* Bottom navigation */}
        <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-xl border-t border-af-light-gray safe-bottom">
          <div className="flex items-center justify-around h-16 px-1">
            {navItems.map(item => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === '/dashboard'}
                className={({ isActive }) =>
                  `flex flex-col items-center justify-center gap-0.5 py-1 px-2 rounded-xl text-[10px] font-medium transition-all min-w-[52px] ${
                    isActive
                      ? 'text-af-tint'
                      : 'text-af-medium-gray active:text-af-deep-charcoal'
                  }`
                }
              >
                <span className="text-lg leading-none">{item.icon}</span>
                <span>{item.label}</span>
              </NavLink>
            ))}
          </div>
        </nav>
      </div>
    </>
  );
}
