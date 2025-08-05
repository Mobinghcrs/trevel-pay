

import React, { useState } from 'react';
import { AdminPage } from '../types';
import Sidebar from './Sidebar';
import DashboardPage from './DashboardPage';
import CashRequestsAdminPage from './CashRequestsAdminPage';
import UserManagementPage from './UserManagementPage';
import RevenueModelPage from './RevenueModelPage';
import FlightManagementPage from './FlightManagementPage';
import StoreManagementPage from './StoreManagementPage';
import PromotionsAdminPage from './PromotionsAdminPage';
import AgentManagementPage from './AgentManagementPage';
import RolesPermissionsPage from './RolesPermissionsPage';
import FinancePage from './FinancePage';

const AdminPanel: React.FC = () => {
    const [page, setPage] = useState<AdminPage>('dashboard');
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const renderPage = () => {
        switch (page) {
            case 'dashboard':
                return <DashboardPage />;
            case 'forex-requests':
                return <CashRequestsAdminPage />;
            case 'flight-management':
                return <FlightManagementPage />
            case 'user-management':
                return <UserManagementPage />;
            case 'store-management':
                return <StoreManagementPage />;
            case 'revenue-models':
                return <RevenueModelPage />;
            case 'promotions':
                return <PromotionsAdminPage />;
            case 'agent-management':
                return <AgentManagementPage />;
            case 'roles-permissions':
                return <RolesPermissionsPage />;
            case 'finance':
                return <FinancePage />;
            default:
                return <DashboardPage />;
        }
    };
    
    return (
        <div className="min-h-screen font-sans flex bg-slate-100 text-slate-800">
            <Sidebar 
                activePage={page} 
                setPage={setPage} 
                isOpen={isSidebarOpen}
                setIsOpen={setIsSidebarOpen}
            />
            <div className="flex-1 flex flex-col min-w-0">
                <header className="lg:hidden bg-white border-b border-slate-200 h-16 flex items-center px-4 sticky top-0 z-30 flex-shrink-0">
                    <button onClick={() => setIsSidebarOpen(true)} className="p-2 text-slate-600 rounded-md hover:bg-slate-100">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                        </svg>
                    </button>
                    <h1 className="text-lg font-bold ml-4 capitalize text-slate-900">{page.replace(/-/g, ' ')}</h1>
                </header>
                <main className="flex-1 p-6 lg:p-10 overflow-y-auto">
                    {renderPage()}
                </main>
            </div>
        </div>
    );
};

export default AdminPanel;