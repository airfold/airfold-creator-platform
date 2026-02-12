import { SignIn, SignedIn } from '@clerk/clerk-react';
import { Navigate, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import Logo from '../../components/Logo';
import { enableDevMode, isDevMode } from '../../context/AuthContext';

export default function Login() {
  const navigate = useNavigate();

  if (isDevMode()) {
    return <Navigate to="/dashboard" replace />;
  }

  const handleDevSkip = () => {
    enableDevMode();
    navigate('/dashboard');
  };

  return (
    <>
      <SignedIn>
        <Navigate to="/dashboard" replace />
      </SignedIn>
      <div className="min-h-screen flex items-center justify-center px-6 -mt-16 bg-af-surface">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md"
        >
          <div className="text-center mb-8">
            <Logo size="lg" className="mb-4 inline-block" />
            <h1 className="text-2xl font-bold text-af-deep-charcoal mt-4">Creator Dashboard</h1>
            <p className="text-af-medium-gray text-sm mt-2">Sign in with your Airfold account</p>
          </div>
          <SignIn
            routing="hash"
            forceRedirectUrl="/dashboard"
            appearance={{
              variables: {
                colorPrimary: '#BD295A',
                borderRadius: '0.75rem',
              },
              elements: {
                card: 'shadow-none bg-transparent',
                rootBox: 'w-full',
                footerAction: { display: 'none' },
              },
            }}
          />
          <div className="mt-6 text-center">
            <button
              onClick={handleDevSkip}
              className="px-4 py-2 text-xs font-mono text-af-medium-gray border border-dashed border-af-light-gray rounded-lg hover:text-af-tint hover:border-af-tint transition-colors cursor-pointer"
            >
              DEV SKIP
            </button>
          </div>
        </motion.div>
      </div>
    </>
  );
}
