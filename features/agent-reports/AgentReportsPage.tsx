import React, { useState, useEffect, useCallback, useMemo } from 'react';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { AgentTransaction } from '../../types';
import { getAgentTransactionHistory } from '../../services/apiService';
import Spinner from '../../components/Spinner';
import Card from '../../components/Card';
import { ICONS } from '../../constants';

const StatCard: React.FC<{ title: string; value: string; }> = ({ title, value }) => (
    <div className="bg-white p-4 rounded-lg shadow border border-gray-200">
        <p className="text-sm font-medium text-gray-500">{title}</p>
        <p className="text-2xl font-bold text-gray-900">{value}</p>
    </div>
);

const AgentReportsPage: React.FC = () => {
    const [transactions, setTransactions] = useState<AgentTransaction[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const [startDate, setStartDate] = useState(() => {
        const date = new Date();
        date.setDate(date.getDate() - 30);
        return date.toISOString().split('T')[0];
    });
    const [endDate, setEndDate] = useState(new Date().toISOString().split('T')[0]);

    const fetchTransactions = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            const data = await getAgentTransactionHistory(startDate, endDate);
            setTransactions(data.sort((a,b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()));
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to load transaction history.");
        } finally {
            setIsLoading(false);
        }
    }, [startDate, endDate]);

    useEffect(() => {
        fetchTransactions();
    }, [fetchTransactions]);

    const summary = useMemo(() => {
        const totalTransactions = transactions.length;
        const totalVolume = transactions.reduce((sum, tx) => sum + tx.amount, 0);
        const totalCommission = transactions.reduce((sum, tx) => sum + tx.commission, 0);
        const mostCommonCurrency = transactions.length > 0 ? transactions.reduce((acc, tx) => {
            acc[tx.currency] = (acc[tx.currency] || 0) + 1;
            return acc;
        }, {} as Record<string, number>) : {};
        const topCurrency = Object.keys(mostCommonCurrency).sort((a,b) => mostCommonCurrency[b] - mostCommonCurrency[a])[0] || 'N/A';
        
        return {
            totalTransactions,
            totalVolume: totalVolume.toLocaleString(undefined, { minimumFractionDigits: 2 }),
            totalCommission: totalCommission.toLocaleString(undefined, { minimumFractionDigits: 2, style: 'currency', currency: topCurrency === 'N/A' ? 'USD' : topCurrency }),
            topCurrency
        };
    }, [transactions]);

    const handleExportPDF = () => {
        const doc = new jsPDF();
        (doc as any).autoTable({
            head: [['Date', 'User Email', 'Amount', 'Commission']],
            body: transactions.map(tx => [
                new Date(tx.timestamp).toLocaleString(),
                tx.userEmail,
                `${tx.amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ${tx.currency}`,
                `${tx.commission.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ${tx.currency}`
            ]),
            didDrawPage: (data: any) => {
                doc.text('Agent Transaction Report', 14, 15);
                doc.setFontSize(10);
                doc.text(`Period: ${startDate} to ${endDate}`, 14, 20);
            }
        });
        doc.save(`agent_report_${startDate}_to_${endDate}.pdf`);
    };

    return (
        <div>
            <div className="flex flex-col md:flex-row justify-between md:items-center mb-6 gap-4">
                <h1 className="text-3xl font-bold text-gray-900">Agent Reports</h1>
                <div className="flex items-center gap-2">
                    <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} className="bg-white border border-gray-300 rounded-md px-3 py-1.5 text-gray-900 text-sm"/>
                    <span>to</span>
                    <input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} className="bg-white border border-gray-300 rounded-md px-3 py-1.5 text-gray-900 text-sm"/>
                    <button onClick={handleExportPDF} disabled={transactions.length === 0} className="ml-2 flex items-center gap-2 bg-teal-600 text-white px-3 py-1.5 rounded-md text-sm font-semibold hover:bg-teal-700 disabled:bg-gray-400">
                        {ICONS.orders}
                        <span>Export PDF</span>
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <StatCard title="Total Transactions" value={summary.totalTransactions.toString()} />
                <StatCard title={`Total Volume (${summary.topCurrency})`} value={summary.totalVolume} />
                <StatCard title="Total Commission Earned" value={summary.totalCommission} />
            </div>
            
             <div className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date & Time</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">User</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount Credited</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Commission Earned</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Transaction ID</th>
                            </tr>
                        </thead>
                         <tbody className="bg-white divide-y divide-gray-200">
                            {isLoading ? (
                                <tr><td colSpan={5}><Spinner message="Loading transactions..." /></td></tr>
                            ) : error ? (
                                <tr><td colSpan={5} className="text-center p-8 text-red-500">{error}</td></tr>
                            ) : transactions.length === 0 ? (
                                <tr><td colSpan={5} className="text-center p-8 text-gray-500">No transactions found for this period.</td></tr>
                            ) : (
                                transactions.map(tx => (
                                    <tr key={tx.id}>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{new Date(tx.timestamp).toLocaleString()}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">{tx.userEmail}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 font-mono">{tx.amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} {tx.currency}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600 font-mono font-semibold">{tx.commission.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} {tx.currency}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-500">{tx.id.slice(-8)}</td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default AgentReportsPage;