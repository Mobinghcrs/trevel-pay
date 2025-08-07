import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Transaction, UserProfile } from '../../types';
import { ICONS } from '../../constants';
import { getMerchantRecentTransactions, findUserForPayment, createPaymentRequest } from '../../services/apiService';
import Spinner from '../../components/Spinner';
import QRCode from 'react-qr-code';

type PaymentMode = 'qr' | 'user_search';

const StatCard: React.FC<{ title: string; value: string | number; icon: React.ReactNode }> = ({ title, value, icon }) => (
    <div className="bg-white p-6 rounded-lg shadow-md border border-slate-200 flex items-center gap-4">
        <div className="p-3 bg-teal-100 text-teal-600 rounded-full">{icon}</div>
        <div>
            <p className="text-sm font-medium text-slate-500">{title}</p>
            <p className="text-2xl font-bold text-slate-900">{value}</p>
        </div>
    </div>
);

const MerchantDashboard: React.FC = () => {
    const [recentTransactions, setRecentTransactions] = useState<Transaction[]>([]);
    const [mode, setMode] = useState<PaymentMode>('qr');
    
    // Form state
    const [amount, setAmount] = useState('');
    const [currency, setCurrency] = useState('USD');
    const [userSearch, setUserSearch] = useState('');
    
    // Control state
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [foundUser, setFoundUser] = useState<UserProfile | null>(null);
    const [qrValue, setQrValue] = useState<string | null>(null);
    const [requestSent, setRequestSent] = useState(false);

    const resetForm = useCallback(() => {
        setAmount('');
        setUserSearch('');
        setFoundUser(null);
        setError(null);
        setQrValue(null);
        setRequestSent(false);
    }, []);

    const fetchTransactions = useCallback(async () => {
        try {
            const transactions = await getMerchantRecentTransactions();
            setRecentTransactions(transactions);
            // If a pending transaction is now completed, reset the form
            if (qrValue && transactions.some(t => t.status === 'Completed' && JSON.parse(qrValue).paymentId === t.id)) {
                resetForm();
            }
            if (requestSent && transactions.some(t => t.status === 'Completed')) {
                 resetForm();
            }
        } catch (e) {
            console.error("Failed to fetch recent transactions", e);
        }
    }, [qrValue, requestSent, resetForm]);

    useEffect(() => {
        fetchTransactions(); // Initial fetch
        const interval = setInterval(fetchTransactions, 2000); // Poll every 2 seconds
        return () => clearInterval(interval);
    }, [fetchTransactions]);

    const handleFindUser = async () => {
        if (!userSearch.trim()) return;
        setIsLoading(true);
        setError(null);
        setFoundUser(null);
        try {
            const user = await findUserForPayment(userSearch);
            setFoundUser(user);
        } catch (err) {
            setError(err instanceof Error ? err.message : "User not found.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleCreateRequest = async () => {
        if (!amount || parseFloat(amount) <= 0) {
            setError("Please enter a valid amount.");
            return;
        }
        setIsLoading(true);
        setError(null);
        try {
            const requestData = {
                amount: parseFloat(amount),
                currency,
                mode,
                userId: foundUser?.email,
            };
            const result = await createPaymentRequest(requestData);
            if (mode === 'qr') {
                setQrValue(JSON.stringify(result));
            } else {
                setRequestSent(true);
            }
        } catch(err) {
            setError(err instanceof Error ? err.message : "Failed to create request.");
        } finally {
            setIsLoading(false);
        }
    };

    const summary = useMemo(() => {
        const completed = recentTransactions.filter(t => t.status === 'Completed');
        const salesToday = completed.reduce((sum, tx) => sum + tx.amount, 0);
        return {
            sales: `$${salesToday.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
            transactions: completed.length,
        };
    }, [recentTransactions]);

    return (
        <div>
            <h1 className="text-3xl font-bold text-slate-900 mb-6">Dashboard</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                <StatCard title="Sales Today" value={summary.sales} icon={ICONS.currencyDollar} />
                <StatCard title="Transactions Today" value={summary.transactions} icon={ICONS.chartBar} />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Payment Request Panel */}
                <div className="bg-white p-6 rounded-lg shadow-md border border-slate-200">
                    <h2 className="text-xl font-bold text-slate-800 mb-4">Create Payment Request</h2>
                    
                    {qrValue ? (
                         <div className="text-center flex flex-col items-center">
                            <h3 className="font-semibold">Scan QR Code to Pay</h3>
                            <p className="text-2xl font-bold my-2">{amount} {currency}</p>
                            <div className="bg-white p-4 rounded-lg border inline-block">
                                <QRCode value={qrValue} size={200} />
                            </div>
                            <p className="text-sm text-slate-500 mt-4">Waiting for payment...</p>
                            <button onClick={resetForm} className="mt-4 bg-slate-200 text-slate-700 px-4 py-2 rounded-md font-semibold">Cancel</button>
                        </div>
                    ) : requestSent ? (
                        <div className="text-center flex flex-col items-center justify-center h-full">
                             <h3 className="font-semibold text-lg">Payment Request Sent!</h3>
                             <p className="text-slate-600">Waiting for {foundUser?.name} to confirm the payment of <span className="font-bold">{amount} {currency}</span>.</p>
                             <button onClick={resetForm} className="mt-4 bg-slate-200 text-slate-700 px-4 py-2 rounded-md font-semibold">New Transaction</button>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {/* Amount Input */}
                            <div>
                                <label className="block text-sm font-medium text-slate-600 mb-1">Amount</label>
                                <div className="flex">
                                    <input type="number" value={amount} onChange={e => setAmount(e.target.value)} placeholder="0.00" className="flex-grow w-full px-3 py-2 bg-slate-100 border-slate-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-teal-500" />
                                    <select value={currency} onChange={e => setCurrency(e.target.value)} className="bg-slate-200 border-y border-r border-slate-300 px-3 rounded-r-md font-semibold">
                                        <option>USD</option>
                                        <option>EUR</option>
                                    </select>
                                </div>
                            </div>
                            
                            {/* Mode Toggle */}
                             <div className="flex bg-slate-100 rounded-lg p-1">
                                <button onClick={() => setMode('qr')} className={`w-1/2 py-2 text-sm font-semibold rounded-md ${mode === 'qr' ? 'bg-white shadow' : ''}`}>QR Code</button>
                                <button onClick={() => setMode('user_search')} className={`w-1/2 py-2 text-sm font-semibold rounded-md ${mode === 'user_search' ? 'bg-white shadow' : ''}`}>Find User</button>
                            </div>

                            {/* User Search Section */}
                            {mode === 'user_search' && (
                                <div>
                                    <label className="block text-sm font-medium text-slate-600 mb-1">Traveler's Email</label>
                                    <div className="flex gap-2">
                                        <input type="email" value={userSearch} onChange={e => setUserSearch(e.target.value)} placeholder="user@example.com" className="flex-grow w-full px-3 py-2 bg-slate-100 border-slate-300 rounded-md" />
                                        <button onClick={handleFindUser} disabled={isLoading} className="bg-slate-200 px-4 rounded-md font-semibold hover:bg-slate-300">Find</button>
                                    </div>
                                    {isLoading && <Spinner message="Searching..."/>}
                                    {foundUser && (
                                        <div className="mt-2 p-2 bg-green-50 border border-green-200 rounded-md flex items-center gap-2">
                                            <img src={foundUser.avatarUrl} className="w-8 h-8 rounded-full" alt="" />
                                            <p className="text-sm font-semibold text-green-800">Found: {foundUser.name}</p>
                                        </div>
                                    )}
                                </div>
                            )}
                            
                            {error && <p className="text-xs text-red-600">{error}</p>}

                            <button onClick={handleCreateRequest} disabled={isLoading || (mode === 'user_search' && !foundUser)} className="w-full bg-teal-600 text-white py-3 rounded-md font-bold text-lg hover:bg-teal-700 disabled:bg-slate-400">
                                {mode === 'qr' ? 'Generate QR' : 'Send Request'}
                            </button>
                        </div>
                    )}
                </div>

                {/* Recent Transactions */}
                <div className="bg-white p-6 rounded-lg shadow-md border border-slate-200">
                    <h2 className="text-xl font-bold text-slate-800 mb-4">Recent Transactions</h2>
                    <div className="space-y-3">
                        {recentTransactions.length === 0 ? (
                            <p className="text-slate-500 text-center py-8">No transactions yet today.</p>
                        ) : (
                            recentTransactions.map(tx => (
                                <div key={tx.id} className={`p-3 rounded-md flex justify-between items-center transition-all duration-500 ${tx.status === 'Pending' ? 'bg-amber-50' : 'bg-green-50'}`}>
                                    <div>
                                        <p className="font-semibold text-slate-800">{tx.userName}</p>
                                        <p className="text-xs text-slate-500">{new Date(tx.timestamp).toLocaleTimeString()}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-mono font-bold text-slate-900">{tx.amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} {tx.currency}</p>
                                        <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${tx.status === 'Pending' ? 'bg-amber-100 text-amber-800' : 'bg-green-100 text-green-800'}`}>{tx.status}</span>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MerchantDashboard;