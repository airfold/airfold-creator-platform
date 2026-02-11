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
    <div className="min-h-screen bg-navy-950 flex">
      {/* Sidebar */}
      <aside className="fixed left-0 top-0 bottom-0 w-64 bg-navy-900/50 border-r border-white/5 flex flex-col z-40">
        <div className="p-6 border-b border-white/5">
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
                    ? 'bg-accent-blue/10 text-accent-blue border border-accent-blue/20'
                    : 'text-white/50 hover:text-white hover:bg-white/5 border border-transparent'
                }`
              }
            >
              <span className="text-base">{item.icon}</span>
              {item.label}
            </NavLink>
          ))}
        </nav>
        <div className="p-4 border-t border-white/5">
          <div className="glass-card p-3">
            <p className="text-xs text-white/40 mb-1">Logged in as</p>
            <p className="text-sm font-semibold text-white truncate">{user?.name}</p>
            <p className="text-xs text-white/40 truncate">{user?.email}</p>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 ml-64">
        {/* Top bar */}
        <header className="sticky top-0 z-30 bg-navy-950/80 backdrop-blur-xl border-b border-white/5">
          <div className="h-16 px-8 flex items-center justify-between">
            <div />
            <div className="flex items-center gap-4">
              <div className="w-8 h-8 rounded-full bg-gradient-to-r from-accent-blue to-accent-purple flex items-center justify-center text-sm font-bold">
                {user?.name?.charAt(0) || 'U'}
              </div>
              <button onClick={handleLogout} className="text-sm text-white/50 hover:text-white transition-colors cursor-pointer bg-transparent border-none">
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
