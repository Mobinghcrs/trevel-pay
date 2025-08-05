
import React, { useState, useEffect, useMemo } from 'react';
import { LedgerEntry, FinancialAccount } from '../../types';
import { getGeneralLedger, getChartOfAccounts } from '../../services/apiService';
import Spinner from '../../components/Spinner';

const ReportsPage: React.FC = () => {
    const [entries, setEntries] = useState<LedgerEntry[]>([]);
    const [accounts, setAccounts] = useState<FinancialAccount[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // For now, we simulate a fixed date range. A real app would have date pickers.
    const dateRange = {
        start: new Date('2023-01-01'),
        end: new Date(),
    };

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            try {
                const [ledgerData, accountsData] = await Promise.all([getGeneralLedger(), getChartOfAccounts()]);
                setEntries(ledgerData);
                setAccounts(accountsData);
            } catch (err) {
                setError(err instanceof Error ? err.message : "Failed to load financial data for reports.");
            } finally {
                setIsLoading(false);
            }
        };
        fetchData();
    }, []);

    const pnlData = useMemo(() => {
        const revenueAccounts = accounts.filter(a => a.type === 'Revenue').map(a => a.id);
        const expenseAccounts = accounts.filter(a => a.type === 'Expense').map(a => a.id);

        const revenues = entries
            .filter(e => revenueAccounts.includes(e.accountId))
            .reduce((acc, entry) => acc + (entry.type === 'credit' ? entry.amount : -entry.amount), 0);

        const expenses = entries
            .filter(e => expenseAccounts.includes(e.accountId))
            .reduce((acc, entry) => acc + (entry.type === 'debit' ? entry.amount : -entry.amount), 0);
        
        const netProfit = revenues - expenses;
        return { revenues, expenses, netProfit };
    }, [entries, accounts]);

    if (isLoading) return <Spinner message="Generating financial reports..." />;
    if (error) return <div className="text-center text-red-600 bg-red-100 p-4 rounded-md">{error}</div>;

    return (
        <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Financial Reports</h2>
            <div className="max-w-2xl mx-auto bg-white border border-gray-200 rounded-lg shadow-sm p-6">
                <div className="text-center mb-4">
                    <h3 className="text-xl font-bold text-gray-900">Profit & Loss Statement</h3>
                    <p className="text-sm text-gray-500">For the period ending {dateRange.end.toLocaleDateString()}</p>
                </div>
                <div className="space-y-3">
                    <div className="flex justify-between items-center border-b pb-2">
                        <span className="font-semibold text-gray-800">Total Revenue</span>
                        <span className="font-mono font-semibold text-green-600">${pnlData.revenues.toLocaleString(undefined, {minimumFractionDigits: 2})}</span>
                    </div>
                    <div className="flex justify-between items-center border-b pb-2">
                        <span className="font-semibold text-gray-800">Total Expenses (Cost of Services)</span>
                        <span className="font-mono font-semibold text-red-600">(${pnlData.expenses.toLocaleString(undefined, {minimumFractionDigits: 2})})</span>
                    </div>
                    <div className="flex justify-between items-center border-t-2 border-black pt-2 text-lg">
                        <span className="font-bold text-gray-900">Net Profit</span>
                        <span className={`font-mono font-bold ${pnlData.netProfit >= 0 ? 'text-gray-900' : 'text-red-600'}`}>
                            ${pnlData.netProfit.toLocaleString(undefined, {minimumFractionDigits: 2})}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ReportsPage;
