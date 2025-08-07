import React, { useState } from 'react';
import { ICONS } from '../constants';
import { setCurrentUser } from '../services/currentUser';

const AdminLoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    // This is a simple placeholder for admin auth
    // In a real app, this would be a proper API call
    if (email === 'admin@example.com' && password === 'password') {
        // Simulate a delay
        await new Promise(res => setTimeout(res, 500));
        // This will trigger the global 'authchange' event
        // that the Router listens to, causing a re-render and route change.
        const mockAdmin = { name: 'Admin', email: 'admin@example.com', role: 'admin' as const };
        setCurrentUser(mockAdmin);
        window.dispatchEvent(new Event('authchange'));
        window.location.hash = '#/admin/dashboard';
    } else {
        setError('Invalid credentials. Please try again.');
        setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen font-sans p-4">
      <div className="w-full max-w-md">
        <div className="flex justify-center items-center gap-3 mb-8">
            <span className="text-teal-500">{ICONS.logo}</span>
            <h1 className="text-2xl font-bold text-slate-800">TRAVEL PAY Admin</h1>
        </div>
      
        <div className="bg-white border border-slate-200 rounded-lg shadow-2xl p-8">
          <h2 className="text-xl font-bold text-center text-slate-900 mb-2">Admin Panel Login</h2>
          <p className="text-slate-500 text-center text-sm mb-6">Enter your administrator credentials.</p>

          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label htmlFor="email" className="sr-only">Email</label>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                    <span className="text-slate-400">{ICONS.atSymbol}</span>
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-3 py-2 bg-slate-100 border border-slate-300 rounded-md text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500"
                  placeholder="admin@example.com"
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
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-3 py-2 bg-slate-100 border border-slate-300 rounded-md text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500"
                  placeholder="password"
                />
              </div>
            </div>

            {error && <p className="text-sm text-red-500 text-center">{error}</p>}

            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-white focus:ring-teal-500 disabled:bg-slate-500 disabled:cursor-wait transition-colors"
              >
                {isLoading ? 'Signing in...' : 'Sign In'}
              </button>
            </div>
          </form>

           <div className="text-center mt-6 text-xs text-slate-500 bg-slate-100/50 p-3 rounded-md">
                <p><span className="font-semibold">Demo Credentials:</span></p>
                <p>Email: <span className="font-mono">admin@example.com</span></p>
                <p>Password: <span className="font-mono">password</span></p>
            </div>
        </div>
         <p className="mt-8 text-center text-sm text-slate-500">
          <a href="#/" className="font-medium text-teal-600 hover:text-teal-500">
            &larr; Back to main application
          </a>
        </p>
      </div>
    </div>
  );
};

export default AdminLoginPage;