import React, { useState } from 'react';
import FinancialDashboard from './finance/FinancialDashboard';
import JournalEntriesPage from './finance/JournalEntriesPage';
import GeneralLedgerPage from './finance/GeneralLedgerPage';
import ChartOfAccountsPage from './finance/ChartOfAccountsPage';
import ReportsPage from './finance/ReportsPage';
import { ICONS } from '../constants';

type FinanceTab = 'dashboard' | 'journal' | 'ledger' | 'coa' | 'reports';

const FinancePage: React.FC = () => {
    const [activeTab, setActiveTab] = useState<FinanceTab>('dashboard');

    const renderContent = () => {
        switch (activeTab) {
            case 'dashboard':
                return <FinancialDashboard />;
            case 'journal':
                return <JournalEntriesPage />;
            case 'ledger':
                return <GeneralLedgerPage />;
            case 'coa':
                return <ChartOfAccountsPage />;
            case 'reports':
                return <ReportsPage />;
            default:
                return null;
        }
    };

    const TabButton: React.FC<{ tabId: FinanceTab; label: string; }> = ({ tabId, label }) => {
        const isActive = activeTab === tabId;
        return (
            <button
                onClick={() => setActiveTab(tabId)}
                className={`px-4 py-2 text-sm font-semibold rounded-md transition-colors ${
                    isActive ? 'bg-teal-600 text-white' : 'text-slate-600 hover:bg-slate-200'
                }`}
            >
                {label}
            </button>
        );
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-slate-900 flex items-center gap-3">
                    <span className="text-teal-600">{ICONS.calculator}</span>
                    <span>Finance Center</span>
                </h1>
            </div>
            <p className="text-slate-600 mb-8 max-w-3xl">
                A professional double-entry accounting system providing a real-time, accurate view of all financial operations across travel and exchange services.
            </p>

            <div className="flex items-center gap-2 border-b border-slate-200 mb-6">
                <TabButton tabId="dashboard" label="Dashboard" />
                <TabButton tabId="journal" label="Journal Entries" />
                <TabButton tabId="ledger" label="General Ledger" />
                <TabButton tabId="coa" label="Chart of Accounts" />
                <TabButton tabId="reports" label="Reports" />
            </div>

            <div>
                {renderContent()}
            </div>
        </div>
    );
};

export default FinancePage;