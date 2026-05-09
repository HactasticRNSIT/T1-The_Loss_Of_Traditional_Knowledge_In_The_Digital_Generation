import { useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { Leaf, LogIn } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { useAuth } from '../../hooks/AuthContext';

export const LoginPage = () => {
  const navigate = useNavigate();
  const { signIn } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await signIn(email, password);
      navigate('/dashboard');
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Sign in failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <Card className="p-8">
          <div className="mb-8 flex flex-col items-center text-center">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-forest-100 text-forest-600 dark:bg-forest-900/50 dark:text-forest-400 shadow-inner">
              <Leaf className="h-8 w-8" />
            </div>
            <h2 className="font-serif text-3xl font-bold text-earth-900 dark:text-earth-50">Welcome Back</h2>
            <p className="mt-2 text-earth-600 dark:text-earth-400">Continue your journey of wisdom.</p>
          </div>

          {error && (
            <div className="mb-4 rounded-xl border border-terracotta-200 bg-terracotta-50 p-3 text-sm text-terracotta-700 dark:border-terracotta-800 dark:bg-terracotta-900/30 dark:text-terracotta-400">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-earth-700 dark:text-earth-300">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full rounded-xl border border-earth-200 bg-earth-50/50 px-4 py-3 text-earth-900 outline-none transition-all focus:border-earth-500 focus:ring-2 focus:ring-earth-500/20 dark:border-earth-700 dark:bg-earth-800/50 dark:text-earth-100"
                placeholder="elder@village.com"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-earth-700 dark:text-earth-300">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full rounded-xl border border-earth-200 bg-earth-50/50 px-4 py-3 text-earth-900 outline-none transition-all focus:border-earth-500 focus:ring-2 focus:ring-earth-500/20 dark:border-earth-700 dark:bg-earth-800/50 dark:text-earth-100"
                placeholder="••••••••"
              />
            </div>
            <Button type="submit" className="w-full mt-6" size="lg" isLoading={loading} disabled={loading}>
              <LogIn className="mr-2 h-5 w-5" /> Sign In
            </Button>
          </form>

          <div className="mt-6 text-center text-sm text-earth-600 dark:text-earth-400">
            Don't have an account?{' '}
            <Link to="/signup" className="font-semibold text-earth-800 hover:text-terracotta-600 dark:text-earth-200 transition-colors">
              Join the village
            </Link>
          </div>
        </Card>
      </motion.div>
    </div>
  );
};
