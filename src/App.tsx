import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ClerkProvider, SignedIn, SignedOut } from '@clerk/clerk-react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import PublicLayout from './layouts/PublicLayout';
import DashboardLayout from './layouts/DashboardLayout';

const queryClient = new QueryClient({
  defaultOptions: { queries: { retry: 1, refetchOnWindowFocus: false } },
});
import Landing from './pages/Landing';
import Login from './pages/Login';
import Overview from './pages/Dashboard/Overview';
import Earnings from './pages/Dashboard/Earnings';
import Analytics from './pages/Dashboard/Analytics';
import Leaderboard from './pages/Dashboard/Leaderboard';
import Calculator from './pages/Dashboard/Calculator';
import HealthScore from './pages/Dashboard/HealthScore';
import { isDevMode } from './context/AuthContext';
import { AppProvider } from './context/AppContext';

const CLERK_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  if (isDevMode()) {
    return <>{children}</>;
  }
  return (
    <>
      <SignedIn>{children}</SignedIn>
      <SignedOut><Navigate to="/login" replace /></SignedOut>
    </>
  );
}

function AppRoutes() {
  return (
    <Routes>
      <Route element={<PublicLayout />}>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
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
    </Routes>
  );
}

export default function App() {
  return (
    <ClerkProvider publishableKey={CLERK_KEY} afterSignOutUrl="/">
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </QueryClientProvider>
    </ClerkProvider>
  );
}
