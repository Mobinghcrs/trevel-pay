

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
import Header from './Header';
import LocationsAdminPage from './LocationsAdminPage';

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
            case 'locations-routes':
                return <LocationsAdminPage />;
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
                <Header 
                    pageTitle={page.replace(/-/g, ' ')}
                    onMenuClick={() => setIsSidebarOpen(true)}
                />
                <main className="flex-1 p-6 overflow-y-auto">
                    {renderPage()}
                </main>
            </div>
        </div>
    );
};

export default AdminPanel;