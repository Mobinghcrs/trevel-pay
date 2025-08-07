import React, { useState } from 'react';
import { ICONS } from '../../constants';
import { authenticate } from '../../services/apiService';

interface LoginPageProps {
  onLogin: (user: { name: string, email: string, role: 'user' | 'agent' | 'guest' | 'merchant' | 'admin', userId?: string }) => void;
}

type LoginRole = 'traveler' | 'agent' | 'merchant';

const LoginPage: React.FC<LoginPageProps> = ({ onLogin }) => {
  const [activeRole, setActiveRole] = useState<LoginRole>('traveler');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    try {
      const apiRole = activeRole === 'traveler' ? 'user' : activeRole;
      // The backend determines the role based on credentials
      const user = await authenticate(email, password, apiRole);
      onLogin(user);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGuestLogin = () => {
    onLogin({ name: 'Guest', email: '', role: 'guest', userId: '@guest' });
  };

  const placeholderEmail = activeRole === 'traveler' 
    ? 'user@example.com' 
    : activeRole === 'agent' 
    ? 'agent@example.com'
    : 'merchant@example.com';

  return (
    <div 
      className="flex items-center justify-center min-h-screen p-4"
    >
      <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl p-8 text-slate-800 border border-slate-200">
        
        <div className="text-center mb-8">
          <div className="inline-block p-3 bg-teal-100 rounded-full mb-4">
            <span className="text-teal-600 h-8 w-8 block">{ICONS.logo}</span>
          </div>
          <h2 className="text-3xl font-bold text-slate-900">Welcome to TRAVEL PAY</h2>
          <p className="text-slate-600 mt-2">Your journey starts here.</p>
        </div>

        {/* Role Selector */}
        <div className="w-full bg-slate-100 rounded-lg p-1 flex mb-6">
          <button 
            onClick={() => setActiveRole('traveler')}
            className={`w-1/3 py-2 rounded-md text-sm font-semibold transition-colors ${activeRole === 'traveler' ? 'bg-teal-600 text-white shadow' : 'text-slate-600 hover:bg-white/80'}`}
          >
            Traveler
          </button>
          <button
            onClick={() => setActiveRole('agent')}
            className={`w-1/3 py-2 rounded-md text-sm font-semibold transition-colors ${activeRole === 'agent' ? 'bg-teal-600 text-white shadow' : 'text-slate-600 hover:bg-white/80'}`}
          >
            Agent
          </button>
           <button
            onClick={() => setActiveRole('merchant')}
            className={`w-1/3 py-2 rounded-md text-sm font-semibold transition-colors ${activeRole === 'merchant' ? 'bg-teal-600 text-white shadow' : 'text-slate-600 hover:bg-white/80'}`}
          >
            Merchant
          </button>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label htmlFor="email" className="sr-only">Email address</label>
            <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                    <span className="text-slate-400">{ICONS.atSymbol}</span>
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-3 py-3 bg-slate-100 border border-slate-300 rounded-md placeholder-slate-400 focus:ring-2 focus:ring-teal-500 focus:outline-none"
                  placeholder={placeholderEmail}
                />
            </div>
          </div>
          <div>
            <label htmlFor="password"  className="sr-only">Password</label>
            <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                    <span className="text-slate-400">{ICONS.lockClosed}</span>
                </div>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-3 py-3 bg-slate-100 border border-slate-300 rounded-md placeholder-slate-400 focus:ring-2 focus:ring-teal-500 focus:outline-none"
                  placeholder="password"
                />
            </div>
          </div>
          {error && <p className="text-xs text-red-500 text-center">{error}</p>}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-teal-600 text-white px-4 py-3 rounded-lg font-semibold hover:bg-teal-700 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-white focus:ring-teal-500 disabled:bg-teal-600/50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Signing In...' : 'Sign In'}
          </button>
        </form>
        
        <div className="text-center mt-6">
            <button
                onClick={handleGuestLogin}
                className="text-sm font-medium text-slate-600 hover:text-teal-600 transition-colors"
            >
                Continue as Guest
            </button>
        </div>
        
        <div className="text-center text-xs text-slate-400 mt-8">
            <a href="#/admin" className="hover:text-teal-600 transition-colors">
                Admin Panel Login
            </a>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;