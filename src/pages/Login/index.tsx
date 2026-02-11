import { useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import Logo from '../../components/Logo';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email.includes('.edu')) {
      setError('Please use a .edu email address');
      return;
    }

    if (!password) {
      setError('Please enter a password');
      return;
    }

    login(email);
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-6 -mt-16 bg-af-surface">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card p-10 w-full max-w-md"
      >
        <div className="text-center mb-8">
          <Logo size="lg" className="mb-4 inline-block" />
          <h1 className="text-2xl font-bold text-af-deep-charcoal mt-4">Creator Dashboard</h1>
          <p className="text-af-medium-gray text-sm mt-2">Sign in with your .edu email</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-af-charcoal mb-2">Email</label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="you@university.edu"
              className="w-full bg-white border border-af-light-gray rounded-xl px-4 py-3 text-af-deep-charcoal placeholder:text-af-medium-gray/50 focus:outline-none focus:border-af-tint focus:ring-1 focus:ring-af-tint transition-all"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-af-charcoal mb-2">Password</label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="Enter your password"
              className="w-full bg-white border border-af-light-gray rounded-xl px-4 py-3 text-af-deep-charcoal placeholder:text-af-medium-gray/50 focus:outline-none focus:border-af-tint focus:ring-1 focus:ring-af-tint transition-all"
            />
          </div>

          {error && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-danger text-sm"
            >
              {error}
            </motion.p>
          )}

          <button type="submit" className="btn-primary w-full text-center py-3.5">
            Sign in to Creator Dashboard
          </button>
        </form>

        <p className="text-center text-xs text-af-medium-gray mt-8">
          Demo: any .edu email + any password works
        </p>
      </motion.div>
    </div>
  );
}
