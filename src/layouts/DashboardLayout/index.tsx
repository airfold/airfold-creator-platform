import { useEffect } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useAuth, isDevMode, enableDevMode, clearDevMode } from '../../context/AuthContext';
import { setTokenGetter } from '../../services/api';
import { haptic } from '../../utils/haptic';
import DesktopBlocker from '../../components/DesktopBlocker';
import { useSelectedApp } from '../../context/AppContext';
import { useCurrentCreator } from '../../hooks/useCreatorData';

const NavIcon = ({ d, active }: { d: string; active: boolean }) => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={active ? '#BD295A' : '#8E8E93'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d={d} />
  </svg>
);

const navItems = [
  { to: '/dashboard', label: 'Overview', iconPath: 'M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z M9 22V12h6v10' },
  { to: '/dashboard/earnings', label: 'Earnings', iconPath: 'M12 1v22 M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6' },
  { to: '/dashboard/analytics', label: 'Analytics', iconPath: 'M18 20V10 M12 20V4 M6 20v-6' },
  { to: '/dashboard/leaderboard', label: 'Board', iconPath: 'M6 9H4.5a2.5 2.5 0 0 1 0-5C7 4 7 7 7 7 M18 9h1.5a2.5 2.5 0 0 0 0-5C17 4 17 7 17 7 M4 22h16 M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20 7 22 M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20 17 22 M18 2H6v7a6 6 0 0 0 12 0V2Z' },
  { to: '/dashboard/calculator', label: 'Calc', iconPath: 'M4 4h16v16H4z M8 8h8 M8 12h8 M8 16h3' },
  { to: '/dashboard/health', label: 'Health', iconPath: 'M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z' },
];

export default function DashboardLayout() {
  const { user, getToken } = useAuth();
  const navigate = useNavigate();
  const { selectedAppId } = useSelectedApp();
  const creator = useCurrentCreator();
  const selectedApp = selectedAppId ? creator.apps.find(a => a.id === selectedAppId) : null;

  useEffect(() => {
    setTokenGetter(getToken);
  }, [getToken]);

  return (
    <>
      <DesktopBlocker />
      <div className="min-h-screen bg-af-surface lg:hidden">
        {/* Top bar */}
        <header className="sticky top-0 z-30 bg-white border-b border-af-light-gray safe-top">
          <div className="h-14 px-4 flex items-center justify-between">
            <div className="cursor-pointer" onClick={() => navigate('/dashboard')}>
              <span className="font-brand text-lg text-af-tint tracking-tight">airfold</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="text-right">
                <p className="text-xs font-semibold text-af-deep-charcoal leading-tight truncate max-w-[120px]">{user?.name}</p>
                {selectedApp && <p className="text-[10px] text-af-medium-gray leading-tight truncate max-w-[120px]">{selectedApp.appName}</p>}
              </div>
              {isDevMode() ? (
                <button
                  onClick={() => { clearDevMode(); window.location.reload(); }}
                  className="text-[9px] font-mono font-bold text-af-tint border border-af-tint/30 rounded px-1.5 py-0.5 active:opacity-70"
                >
                  DEV
                </button>
              ) : (
                <button
                  onClick={() => { enableDevMode(); window.location.reload(); }}
                  className="text-[9px] font-mono text-af-medium-gray/40 border border-dashed border-af-light-gray/50 rounded px-1.5 py-0.5 active:text-af-tint active:border-af-tint"
                >
                  DEV
                </button>
              )}
            </div>
          </div>
        </header>

        {/* Main content */}
        <main className="px-4 md:px-8 pt-4 pb-24 md:max-w-2xl md:mx-auto">
          <Outlet />
        </main>

        {/* Bottom navigation */}
        <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-af-light-gray safe-bottom">
          <div className="flex items-center justify-around h-16 px-1">
            {navItems.map(item => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === '/dashboard'}
                onClick={() => haptic()}
                className={({ isActive }) =>
                  `flex flex-col items-center justify-center gap-0.5 py-1 px-2 rounded-xl text-[10px] font-medium transition-all min-w-[52px] ${
                    isActive
                      ? 'text-af-tint'
                      : 'text-af-medium-gray active:text-af-deep-charcoal'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <NavIcon d={item.iconPath} active={isActive} />
                    <span>{item.label}</span>
                  </>
                )}
              </NavLink>
            ))}
          </div>
        </nav>
      </div>
    </>
  );
}
