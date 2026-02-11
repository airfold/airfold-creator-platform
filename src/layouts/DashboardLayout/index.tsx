import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Logo from '../../components/Logo';

const navItems = [
  { to: '/dashboard', label: 'Overview', icon: '📊' },
  { to: '/dashboard/earnings', label: 'Earnings', icon: '💰' },
  { to: '/dashboard/analytics', label: 'Analytics', icon: '📈' },
  { to: '/dashboard/leaderboard', label: 'Leaderboard', icon: '🏆' },
  { to: '/dashboard/calculator', label: 'Calculator', icon: '🧮' },
  { to: '/dashboard/health', label: 'Health Score', icon: '🛡️' },
];

export default function DashboardLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-af-surface flex">
      {/* Sidebar */}
      <aside className="fixed left-0 top-0 bottom-0 w-64 bg-white border-r border-af-light-gray flex flex-col z-40">
        <div className="p-6 border-b border-af-light-gray">
          <Logo size="md" />
        </div>
        <nav className="flex-1 p-4 space-y-1">
          {navItems.map(item => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/dashboard'}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? 'bg-af-tint-soft text-af-tint'
                    : 'text-af-medium-gray hover:text-af-deep-charcoal hover:bg-af-surface'
                }`
              }
            >
              <span className="text-base">{item.icon}</span>
              {item.label}
            </NavLink>
          ))}
        </nav>
        <div className="p-4 border-t border-af-light-gray">
          <div className="bg-af-surface rounded-xl p-3">
            <p className="text-xs text-af-medium-gray mb-1">Logged in as</p>
            <p className="text-sm font-semibold text-af-deep-charcoal truncate">{user?.name}</p>
            <p className="text-xs text-af-medium-gray truncate">{user?.email}</p>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 ml-64">
        {/* Top bar */}
        <header className="sticky top-0 z-30 bg-af-surface/80 backdrop-blur-xl border-b border-af-light-gray">
          <div className="h-16 px-8 flex items-center justify-between">
            <div />
            <div className="flex items-center gap-4">
              <div className="w-8 h-8 rounded-full bg-af-tint flex items-center justify-center text-sm font-bold text-white">
                {user?.name?.charAt(0) || 'U'}
              </div>
              <button onClick={handleLogout} className="text-sm text-af-medium-gray hover:text-af-deep-charcoal transition-colors cursor-pointer bg-transparent border-none">
                Logout
              </button>
            </div>
          </div>
        </header>

        <main className="p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
