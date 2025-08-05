
import React, { useState, useEffect } from 'react';
import { FinancialAccount } from '../../types';
import { getChartOfAccounts } from '../../services/apiService';
import Spinner from '../../components/Spinner';

const ChartOfAccountsPage: React.FC = () => {
    const [accounts, setAccounts] = useState<FinancialAccount[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            try {
                const data = await getChartOfAccounts();
                setAccounts(data);
            } catch (err) {
                setError(err instanceof Error ? err.message : "Failed to load chart of accounts.");
            } finally {
                setIsLoading(false);
            }
        };
        fetchData();
    }, []);
    
    const renderAccountsByType = (type: FinancialAccount['type']) => {
        return accounts.filter(acc => acc.type === type).map(acc => (
             <tr key={acc.id} className="border-b last:border-b-0">
                <td className="px-4 py-2 text-sm font-mono text-gray-500">{acc.id}</td>
                <td className="px-4 py-2 text-sm text-gray-800">{acc.name}</td>
            </tr>
        ));
    };

    if (isLoading) return <Spinner message="Loading chart of accounts..." />;
    if (error) return <div className="text-center text-red-600 bg-red-100 p-4 rounded-md">{error}</div>;

    return (
        <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Chart of Accounts</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
                {(['Asset', 'Liability', 'Equity', 'Revenue', 'Expense'] as FinancialAccount['type'][]).map(type => (
                    <div key={type} className="bg-white border border-gray-200 rounded-lg shadow-sm">
                        <h3 className="px-4 py-2 text-lg font-bold text-gray-900 bg-gray-50 border-b">{type}s</h3>
                        <table className="min-w-full">
                            <tbody>
                               {renderAccountsByType(type)}
                            </tbody>
                        </table>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ChartOfAccountsPage;
