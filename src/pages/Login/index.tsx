import { SignIn, SignedIn } from '@clerk/clerk-react';
import { Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import Logo from '../../components/Logo';

export default function Login() {
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
              },
            }}
          />
        </motion.div>
      </div>
    </>
  );
}
