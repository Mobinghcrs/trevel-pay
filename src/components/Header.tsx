import React from 'react';
import { AuthState } from '@/types';
import { ICONS } from '@/constants';
import { useNavigation } from '@/contexts/NavigationContext';
import { clearCurrentUser } from '@/services/currentUser';

interface HeaderProps {
  auth: AuthState;
  onLogout: () => void;
}

const NavLink: React.FC<{
  onClick: () => void;
  children: React.ReactNode;
}> = ({ onClick, children }) => (
  <button onClick={onClick} className="text-slate-600 hover:text-teal-600 transition-colors duration-200 font-medium">
    {children}
  </button>
);

const Header: React.FC<HeaderProps> = ({ auth, onLogout }) => {
  const { navigate } = useNavigation();

  const handleFullLogout = () => {
    clearCurrentUser();
    onLogout();
    window.dispatchEvent(new Event('authchange'));
  };
  
  const getPanelLink = () => {
      if (auth.user?.role === 'admin') {
          return <a href="#/admin" className="text-teal-600 hover:text-teal-500 border border-slate-300 px-3 py-1 rounded-md text-sm font-semibold transition-colors">Admin Panel</a>;
      }
      if (auth.user?.role === 'merchant') {
          return <a href="#/merchant" className="text-teal-600 hover:text-teal-500 border border-slate-300 px-3 py-1 rounded-md text-sm font-semibold transition-colors">Merchant Panel</a>;
      }
      return null;
  }
  
  return (
    <header className="bg-white/80 backdrop-blur-md border-b border-slate-200/80 sticky top-0 z-40">
      <nav className="container mx-auto px-6 py-4 flex justify-between items-center">
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate('home')}>
          <span className="text-teal-600">{ICONS.logo}</span>
          <h1 className="text-xl font-bold text-slate-900">TRAVEL PAY</h1>
        </div>
        {auth.isLoggedIn && (
          <div className="hidden md:flex items-center gap-6">
            <NavLink onClick={() => navigate('home')}>Home</NavLink>
            <NavLink onClick={() => navigate('flights')}>Flights</NavLink>
            <NavLink onClick={() => navigate('exchange')}>Exchange</NavLink>
            <NavLink onClick={() => navigate('profile')}>Profile</NavLink>
            {getPanelLink()}
            <button
              onClick={handleFullLogout}
              className="bg-teal-600 text-white px-4 py-2 rounded-md text-sm font-semibold hover:bg-teal-700 transition-colors duration-200"
            >
              Logout
            </button>
          </div>
        )}
      </nav>
    </header>
  );
};

export default Header;
