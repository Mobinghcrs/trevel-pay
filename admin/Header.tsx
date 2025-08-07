
import React, { useState } from 'react';
import { ICONS } from '../constants';
import { getCurrentUser, clearCurrentUser } from '../services/currentUser';

interface HeaderProps {
    pageTitle: string;
    onMenuClick: () => void;
}

const Header: React.FC<HeaderProps> = ({ pageTitle, onMenuClick }) => {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const user = getCurrentUser();

    const handleLogout = () => {
      clearCurrentUser();
      window.location.hash = '#/';
      window.dispatchEvent(new Event('authchange'));
    }

    return (
        <header className="bg-white border-b border-slate-200 h-16 flex items-center px-6 sticky top-0 z-30 flex-shrink-0">
            <button onClick={onMenuClick} className="lg:hidden p-2 -ml-2 mr-2 text-slate-600 rounded-md hover:bg-slate-100">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
            </button>
            
            {/* Search Bar */}
            <div className="relative hidden md:block">
                <input 
                    type="text" 
                    placeholder="Search..."
                    className="w-64 bg-slate-100 border border-slate-200 rounded-md pl-10 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
                 <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <svg className="h-5 w-5 text-slate-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                </div>
            </div>

            <div className="ml-auto flex items-center gap-4">
                 {/* Can add more icons here like notifications, etc. */}
                
                {/* Profile Dropdown */}
                <div className="relative">
                    <button onClick={() => setIsDropdownOpen(!isDropdownOpen)} className="flex items-center gap-2">
                        <img src="https://i.pravatar.cc/150?u=admin" alt="Admin" className="h-8 w-8 rounded-full bg-slate-200" />
                        <div className="hidden md:block text-left">
                            <p className="text-sm font-semibold text-slate-800">{user?.name || 'Admin'}</p>
                            <p className="text-xs text-slate-500 capitalize">{user?.role || 'Administrator'}</p>
                        </div>
                    </button>
                    {isDropdownOpen && (
                        <div className="absolute right-0 mt-2 w-48 bg-white border rounded-md shadow-lg py-1 z-40">
                            <a href="#" className="block px-4 py-2 text-sm text-slate-700 hover:bg-slate-100">Profile</a>
                            <a href="#" className="block px-4 py-2 text-sm text-slate-700 hover:bg-slate-100">Settings</a>
                            <div className="border-t my-1"></div>
                            <button onClick={handleLogout} className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-100">
                                Logout
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
};

export default Header;
