

import React from 'react';
import { AdminPage } from '../types';
import { ICONS } from '../constants';

interface SidebarProps {
    activePage: AdminPage;
    setPage: (page: AdminPage) => void;
    isOpen: boolean;
    setIsOpen: (isOpen: boolean) => void;
}

const NavItem: React.FC<{
    icon: React.ReactNode;
    label: string;
    isActive: boolean;
    onClick: () => void;
}> = ({ icon, label, isActive, onClick }) => {
    const baseClasses = "flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-colors duration-150";
    const activeClasses = "bg-teal-600 text-white shadow-sm";
    const inactiveClasses = "text-slate-300 hover:bg-slate-700 hover:text-white";

    return (
        <li>
            <a href="#" onClick={e => { e.preventDefault(); onClick(); }} className={`${baseClasses} ${isActive ? activeClasses : inactiveClasses}`}>
                {icon}
                <span className="flex-1">{label}</span>
            </a>
        </li>
    );
};


const Sidebar: React.FC<SidebarProps> = ({ activePage, setPage, isOpen, setIsOpen }) => {
    
    const handleNavClick = (page: AdminPage) => {
        setPage(page);
        if (window.innerWidth < 1024) { // 'lg' breakpoint
            setIsOpen(false);
        }
    };

    return (
        <>
            <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-slate-800 flex-shrink-0 flex flex-col transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : '-translate-x-full'} lg:relative lg:translate-x-0`}>
                <div className="h-16 flex items-center px-6 border-b border-slate-700">
                    <a href="#" className="flex items-center gap-3">
                        <span className="text-teal-400">{ICONS.logo}</span>
                        <h1 className="text-xl font-bold text-white">Admin Panel</h1>
                    </a>
                </div>
                <nav className="flex-1 px-4 py-6">
                    <ul className="space-y-2">
                        <NavItem
                            icon={ICONS.dashboard}
                            label="Dashboard"
                            isActive={activePage === 'dashboard'}
                            onClick={() => handleNavClick('dashboard')}
                        />
                         <NavItem
                            icon={ICONS.calculator}
                            label="Finance"
                            isActive={activePage === 'finance'}
                            onClick={() => handleNavClick('finance')}
                        />
                         <NavItem
                            icon={ICONS.megaphone}
                            label="Promotions"
                            isActive={activePage === 'promotions'}
                            onClick={() => handleNavClick('promotions')}
                        />
                        <NavItem
                            icon={ICONS.users}
                            label="User Management"
                            isActive={activePage === 'user-management'}
                            onClick={() => handleNavClick('user-management')}
                        />
                         <NavItem
                            icon={ICONS.shieldCheck}
                            label="Roles & Permissions"
                            isActive={activePage === 'roles-permissions'}
                            onClick={() => handleNavClick('roles-permissions')}
                        />
                        <NavItem
                            icon={ICONS.exchange}
                            label="Forex Requests"
                            isActive={activePage === 'forex-requests'}
                            onClick={() => handleNavClick('forex-requests')}
                        />
                        <NavItem
                            icon={ICONS.plane}
                            label="Flight Management"
                            isActive={activePage === 'flight-management'}
                            onClick={() => handleNavClick('flight-management')}
                        />
                        <NavItem
                            icon={ICONS.store}
                            label="Store Management"
                            isActive={activePage === 'store-management'}
                            onClick={() => handleNavClick('store-management')}
                        />
                        <NavItem
                            icon={ICONS.mapPin}
                            label="Agent Management"
                            isActive={activePage === 'agent-management'}
                            onClick={() => handleNavClick('agent-management')}
                        />
                        <NavItem
                            icon={ICONS.cog}
                            label="Revenue Models"
                            isActive={activePage === 'revenue-models'}
                            onClick={() => handleNavClick('revenue-models')}
                        />
                    </ul>
                </nav>
                <div className="px-4 py-4 border-t border-slate-700">
                    <a href="#/" className="text-sm text-slate-400 hover:text-teal-400">← Back to TRAVEL PAY</a>
                </div>
            </aside>
             {isOpen && <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setIsOpen(false)}></div>}
        </>
    );
};

export default Sidebar;