import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import PublicLayout from './layouts/PublicLayout';
import DashboardLayout from './layouts/DashboardLayout';

const queryClient = new QueryClient({
  defaultOptions: { queries: { retry: 1, refetchOnWindowFocus: false } },
});
import Landing from './pages/Landing';
import Overview from './pages/Dashboard/Overview';
import Earnings from './pages/Dashboard/Earnings';
import Analytics from './pages/Dashboard/Analytics';
import Leaderboard from './pages/Dashboard/Leaderboard';
import Calculator from './pages/Dashboard/Calculator';
import HealthScore from './pages/Dashboard/HealthScore';
import { isDevMode, isNativeMode, initNativeToken } from './context/AuthContext';
import { AppProvider } from './context/AppContext';

// Pick up native token from iOS WKWebView sessionStorage injection
initNativeToken();

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  if (import.meta.env.DEV || isDevMode() || isNativeMode()) {
    return <>{children}</>;
  }
  // Not authenticated — redirect to landing (no standalone login)
  return <Navigate to="/" replace />;
}

function AppRoutes() {
  return (
    <Routes>
      <Route element={<PublicLayout />}>
        <Route path="/" element={<Landing />} />
      </Route>
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <AppProvider>
              <DashboardLayout />
            </AppProvider>
          </ProtectedRoute>
        }
      >
        <Route index element={<Overview />} />
        <Route path="earnings" element={<Earnings />} />
        <Route path="analytics" element={<Analytics />} />
        <Route path="leaderboard" element={<Leaderboard />} />
        <Route path="calculator" element={<Calculator />} />
        <Route path="health" element={<HealthScore />} />
      </Route>
      {/* Catch old /login route */}
      <Route path="/login" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </QueryClientProvider>
  );
}
