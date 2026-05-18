import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Lock, LogIn, UserPlus, Loader2 } from 'lucide-react';
import { signIn, signUp } from '../services/supabase';
import { toast } from 'sonner';

export default function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      if (isLogin) {
        const { data, error } = await signIn(email, password);
        if (error) throw error;
        toast.success('Logged in successfully!');
        navigate('/dashboard');
      } else {
        const { data, error } = await signUp(email, password);
        if (error) throw error;
        toast.success('Signed up successfully! Please check your email for verification.');
        setIsLogin(true);
      }
    } catch (error) {
      toast.error(error.message || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4" style={{ background: 'linear-gradient(180deg, #020617 0%, #0F172A 100%)' }}>
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card w-full max-w-md p-8"
        style={{ background: 'rgba(15, 23, 42, 0.85)', borderColor: 'rgba(148, 163, 184, 0.15)' }}
      >
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">DisasterSense AI</h1>
          <p className="text-sm text-slate-400">
            {isLogin ? 'Welcome back! Please login to your account.' : 'Create a new account to get started.'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="text-xs font-medium text-slate-400 block mb-2">Email Address</label>
            <div className="relative flex items-center">
              <Mail size={16} className="absolute left-3 text-slate-500" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl text-sm text-white placeholder-slate-500 outline-none transition-all"
                style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(148, 163, 184, 0.15)' }}
                required
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-medium text-slate-400 block mb-2">Password</label>
            <div className="relative flex items-center">
              <Lock size={16} className="absolute left-3 text-slate-500" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl text-sm text-white placeholder-slate-500 outline-none transition-all"
                style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(148, 163, 184, 0.15)' }}
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full btn-glow flex items-center justify-center gap-2 py-2.5 text-sm font-semibold disabled:opacity-50"
            style={{ background: 'linear-gradient(135deg, #3B82F6 0%, #06B6D4 100%)' }}
          >
            {loading ? (
              <Loader2 size={16} className="animate-spin" />
            ) : isLogin ? (
              <><LogIn size={16} /> Login</>
            ) : (
              <><UserPlus size={16} /> Sign Up</>
            )}
          </button>
        </form>

        <div className="mt-6 text-center">
          <button
            onClick={() => setIsLogin(!isLogin)}
            className="text-sm text-slate-400 hover:text-white transition-colors"
          >
            {isLogin ? "Don't have an account? Sign Up" : 'Already have an account? Login'}
          </button>
        </div>
      </motion.div>
    </div>
  );
}
