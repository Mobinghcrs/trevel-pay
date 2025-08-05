import React, { useState } from 'react';
import { ICONS } from '../../constants';
import { clearCurrentUser } from '../../services/currentUser';
import MerchantDashboard from './MerchantDashboard';
// Future components can be added here
// import TransactionHistoryPage from './TransactionHistoryPage';
// import MerchantProfilePage from './MerchantProfilePage';

type MerchantPage = 'dashboard' | 'history' | 'profile';

const NavItem: React.FC<{ icon: React.ReactNode; label: string; isActive: boolean; onClick: () => void; }> = ({ icon, label, isActive, onClick }) => (
    <li>
        <button onClick={onClick} className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-colors ${isActive ? 'bg-teal-600 text-white' : 'text-slate-300 hover:bg-slate-700'}`}>
            {icon}
            <span>{label}</span>
        </button>
    </li>
);

const MerchantPanel: React.FC = () => {
    const [page, setPage] = useState<MerchantPage>('dashboard');

    const handleLogout = () => {
        clearCurrentUser();
        window.location.hash = '#/';
        window.dispatchEvent(new Event('authchange'));
    };

    const renderPage = () => {
        switch (page) {
            case 'dashboard':
                return <MerchantDashboard />;
            // case 'history':
            //     return <TransactionHistoryPage />;
            // case 'profile':
            //     return <MerchantProfilePage />;
            default:
                return <MerchantDashboard />;
        }
    };

    return (
        <div className="min-h-screen font-sans flex bg-slate-100 text-slate-800">
            {/* Sidebar */}
            <aside className="w-64 bg-slate-800 flex-shrink-0 flex flex-col text-white">
                <div className="h-16 flex items-center px-6 border-b border-slate-700">
                    <div className="flex items-center gap-3">
                        <span className="text-teal-400">{ICONS.buildingStorefront}</span>
                        <h1 className="text-lg font-bold">Merchant Panel</h1>
                    </div>
                </div>
                <nav className="flex-1 px-4 py-6">
                    <ul className="space-y-2">
                        <NavItem icon={ICONS.dashboard} label="Dashboard" isActive={page === 'dashboard'} onClick={() => setPage('dashboard')} />
                        <NavItem icon={ICONS.orders} label="History" isActive={page === 'history'} onClick={() => alert('History page coming soon!')} />
                        <NavItem icon={ICONS.user} label="Profile" isActive={page === 'profile'} onClick={() => alert('Profile page coming soon!')} />
                    </ul>
                </nav>
                <div className="px-4 py-4 border-t border-slate-700">
                    <button onClick={handleLogout} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium text-slate-300 hover:bg-slate-700">
                        {ICONS.logout}
                        <span>Logout</span>
                    </button>
                </div>
            </aside>
            {/* Main Content */}
            <main className="flex-1 p-6 lg:p-10 overflow-y-auto">
                {renderPage()}
            </main>
        </div>
    );
};

export default MerchantPanel;
