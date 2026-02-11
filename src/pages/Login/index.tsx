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
    <div className="min-h-screen flex items-center justify-center px-6 -mt-16">
      <div className="absolute inset-0 bg-gradient-to-b from-accent-blue/5 via-transparent to-transparent" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card p-10 w-full max-w-md relative"
      >
        <div className="text-center mb-8">
          <Logo size="lg" className="mb-4 inline-block" />
          <h1 className="text-2xl font-bold mt-4">Creator Dashboard</h1>
          <p className="text-white/40 text-sm mt-2">Sign in with your .edu email</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-white/50 mb-2">Email</label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="you@university.edu"
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/20 focus:outline-none focus:border-accent-blue/50 focus:ring-1 focus:ring-accent-blue/50 transition-all"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-white/50 mb-2">Password</label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="Enter your password"
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/20 focus:outline-none focus:border-accent-blue/50 focus:ring-1 focus:ring-accent-blue/50 transition-all"
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

        <p className="text-center text-xs text-white/20 mt-8">
          Demo: any .edu email + any password works
        </p>
      </motion.div>
    </div>
  );
}
