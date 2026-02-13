import { Component, useState, useEffect } from 'react';
import type { ReactNode, ErrorInfo } from 'react';
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
import HealthScore from './pages/Dashboard/HealthScore';
import StripeCallback from './pages/Dashboard/StripeCallback';
import { isNativeMode, initNativeToken } from './context/AuthContext';
import { AppProvider } from './context/AppContext';

class ErrorBoundary extends Component<{ children: ReactNode }, { hasError: boolean }> {
  state = { hasError: false };
  static getDerivedStateFromError() { return { hasError: true }; }
  componentDidCatch(error: Error, info: ErrorInfo) { console.error('Dashboard error:', error, info); }
  render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center justify-center min-h-screen p-6 text-center">
          <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center mb-4">
            <svg className="w-6 h-6 text-red-500" viewBox="0 0 24 24" fill="none"><path d="M6 18L18 6M6 6l12 12" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/></svg>
          </div>
          <h2 className="text-lg font-bold text-af-deep-charcoal mb-1">Something went wrong</h2>
          <p className="text-sm text-af-medium-gray mb-4">Try refreshing the page</p>
          <button onClick={() => window.location.reload()} className="px-4 py-2 rounded-xl bg-af-tint text-white text-sm font-semibold cursor-pointer active:opacity-80">
            Refresh
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

// Pick up native token from iOS WKWebView sessionStorage injection
initNativeToken();

function LoadingScreen() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white">
      <div className="w-10 h-10 rounded-full border-[3px] border-af-light-gray border-t-af-tint animate-spin mb-4" />
      <p className="text-sm text-af-medium-gray font-medium">Loading dashboard...</p>
    </div>
  );
}

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const [checked, setChecked] = useState(false);
  const [allowed, setAllowed] = useState(false);

  useEffect(() => {
    if (import.meta.env.DEV || isNativeMode()) {
      setAllowed(true);
      setChecked(true);
      return;
    }
    // Show loader for 1.5s to let WKWebView inject the token into sessionStorage.
    // The iOS userScript fires at document start but can race with React hydration.
    const timer = setTimeout(() => {
      setAllowed(isNativeMode());
      setChecked(true);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  if (!checked) return <LoadingScreen />;
  if (allowed) return <>{children}</>;
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
        <Route path="health" element={<HealthScore />} />
        <Route path="stripe-callback" element={<StripeCallback />} />
      </Route>
      {/* Catch old /login route */}
      <Route path="/login" element={<Navigate to="/" replace />} />
      {/* 404 catch-all */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}
