
import React, { useState, useEffect, useMemo } from 'react';
import { LedgerEntry, FinancialAccount } from '../../types';
import { getGeneralLedger, getChartOfAccounts } from '../../services/apiService';
import Spinner from '../../components/Spinner';

const GeneralLedgerPage: React.FC = () => {
    const [entries, setEntries] = useState<LedgerEntry[]>([]);
    const [accounts, setAccounts] = useState<FinancialAccount[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [filterAccount, setFilterAccount] = useState<string>('all');

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            try {
                const [ledgerData, accountsData] = await Promise.all([getGeneralLedger(), getChartOfAccounts()]);
                const entriesWithNames = ledgerData.map(entry => ({
                    ...entry,
                    accountName: accountsData.find(acc => acc.id === entry.accountId)?.name || 'Unknown Account'
                }));
                setEntries(entriesWithNames.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()));
                setAccounts(accountsData);
            } catch (err) {
                setError(err instanceof Error ? err.message : "Failed to load ledger data.");
            } finally {
                setIsLoading(false);
            }
        };
        fetchData();
    }, []);

    const filteredEntries = useMemo(() => {
        if (filterAccount === 'all') {
            return entries;
        }
        return entries.filter(entry => entry.accountId === filterAccount);
    }, [entries, filterAccount]);

    if (isLoading) return <Spinner message="Loading general ledger..." />;
    if (error) return <div className="text-center text-red-600 bg-red-100 p-4 rounded-md">{error}</div>;

    return (
        <div>
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold text-gray-800">General Ledger</h2>
                <div className="flex items-center gap-2">
                    <label htmlFor="accountFilter" className="text-sm font-medium text-gray-700">Filter by Account:</label>
                    <select
                        id="accountFilter"
                        value={filterAccount}
                        onChange={e => setFilterAccount(e.target.value)}
                        className="px-3 py-1.5 bg-white border border-gray-300 rounded-md text-sm"
                    >
                        <option value="all">All Accounts</option>
                        {accounts.map(acc => <option key={acc.id} value={acc.id}>{acc.name}</option>)}
                    </select>
                </div>
            </div>
            <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
                 <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Account</th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Debit</th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Credit</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {filteredEntries.map(entry => (
                                <tr key={entry.id}>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(entry.timestamp).toLocaleString()}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{entry.accountName}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-right font-mono">{entry.type === 'debit' ? `$${entry.amount.toFixed(2)}` : ''}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-right font-mono">{entry.type === 'credit' ? `$${entry.amount.toFixed(2)}` : ''}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default GeneralLedgerPage;
