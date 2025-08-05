

import React from 'react';
import { Page } from '../types';
import { ICONS } from '../constants';
import { useNavigation } from '../contexts/NavigationContext';

interface BottomNavBarProps {
  currentPage: Page;
  onLogout: () => void;
}

const NavItem: React.FC<{
  label: string;
  icon: React.ReactNode;
  isActive: boolean;
  onClick: () => void;
}> = ({ label, icon, isActive, onClick }) => {
  const activeClasses = 'text-teal-600';
  const inactiveClasses = 'text-slate-500 hover:text-slate-800';
  return (
    <button
      onClick={onClick}
      className={`flex flex-col items-center justify-center gap-1 w-full pt-2 pb-1 transition-colors duration-200 ${isActive ? activeClasses : inactiveClasses}`}
      aria-current={isActive}
    >
      <div className="h-6 w-6">{icon}</div>
      <span className="text-xs font-medium">{label}</span>
    </button>
  );
};

const BottomNavBar: React.FC<BottomNavBarProps> = ({ currentPage, onLogout }) => {
    const { navigate } = useNavigation();

    const navItems: { page: Page; label: string; icon: React.ReactNode }[] = [
        { page: 'home', label: 'Home', icon: ICONS.home },
        { page: 'cards', label: 'Cards', icon: ICONS.creditCard },
        { page: 'orders', label: 'Orders', icon: ICONS.orders },
        { page: 'profile', label: 'Profile', icon: ICONS.userNav },
    ];
    
    // Treat other main pages as being under the 'home' tab for highlighting purposes
    const isPageActive = (page: Page) => {
        if ((currentPage === 'flights' || currentPage === 'hotel' || currentPage === 'exchange' || currentPage === 'car-rental' || currentPage === 'shopping' || currentPage === 'agents') && page === 'home') return true;
        return currentPage === page;
    }

    return (
        <footer className="fixed bottom-4 left-1/2 -translate-x-1/2 w-[calc(100%-2rem)] max-w-sm mx-auto z-50 md:hidden">
            <nav className="flex justify-around items-stretch h-16 bg-white/80 backdrop-blur-md border border-slate-200/80 shadow-2xl rounded-2xl">
                 {navItems.map(item => (
                    <NavItem 
                        key={item.page}
                        label={item.label}
                        icon={item.icon}
                        isActive={isPageActive(item.page)}
                        onClick={() => navigate(item.page)}
                    />
                 ))}
                 <NavItem
                    key="logout"
                    label="Logout"
                    icon={ICONS.logout}
                    isActive={false}
                    onClick={onLogout}
                 />
            </nav>
        </footer>
    );
};

export default BottomNavBar;