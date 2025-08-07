
import React, { useState, useCallback } from 'react';
import { UserProfile } from '../../types';
import { ICONS } from '../../constants';
import { findUserForPayment, createPaymentRequest } from '../../services/apiService';
import Spinner from '../../components/Spinner';
import QRCode from 'react-qr-code';

type PaymentMode = 'qr' | 'user_search';

const TabButton: React.FC<{
    label: string;
    isActive: boolean;
    onClick: () => void;
}> = ({ label, isActive, onClick }) => (
    <button
        onClick={onClick}
        className={`w-1/2 py-3 text-sm font-bold transition-colors duration-200 ${
            isActive
                ? 'border-b-2 border-teal-600 text-teal-600'
                : 'border-b-2 border-transparent text-slate-500 hover:text-slate-800'
        }`}
    >
        {label}
    </button>
);

const NumericKeypad: React.FC<{ onKeyPress: (key: string) => void }> = ({ onKeyPress }) => {
    const keys = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '.', '0', '⌫'];
    return (
        <div className="grid grid-cols-3 gap-2">
            {keys.map(key => (
                <button
                    key={key}
                    onClick={() => onKeyPress(key)}
                    className="py-4 bg-slate-200 text-slate-800 rounded-lg text-2xl font-semibold hover:bg-slate-300 transition-colors"
                >
                    {key}
                </button>
            ))}
        </div>
    );
};

const MerchantPosPage: React.FC = () => {
    const [mode, setMode] = useState<PaymentMode>('qr');
    const [amount, setAmount] = useState('0');
    const [currency] = useState('USD');
    const [userSearch, setUserSearch] = useState('');
    const [foundUser, setFoundUser] = useState<UserProfile | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [qrValue, setQrValue] = useState<string | null>(null);
    const [requestSent, setRequestSent] = useState(false);

    const resetState = useCallback(() => {
        setAmount('0');
        setUserSearch('');
        setFoundUser(null);
        setError(null);
        setQrValue(null);
        setRequestSent(false);
    }, []);

    const handleKeyPress = (key: string) => {
        if (qrValue || requestSent) return;
        if (key === '⌫') {
            setAmount(prev => prev.length > 1 ? prev.slice(0, -1) : '0');
        } else if (key === '.' && amount.includes('.')) {
            return;
        } else {
            setAmount(prev => (prev === '0' && key !== '.') ? key : prev + key);
        }
    };

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
        const numericAmount = parseFloat(amount);
        if (!numericAmount || numericAmount <= 0) {
            setError("Please enter a valid amount.");
            return;
        }
        setIsLoading(true);
        setError(null);
        try {
            const requestData = { amount: numericAmount, currency, mode, userId: foundUser?.email };
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

    return (
        <div className="max-w-md mx-auto bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
            <div className="flex border-b border-slate-200">
                <TabButton label="QR Code Payment" isActive={mode === 'qr'} onClick={() => setMode('qr')} />
                <TabButton label="Request from User" isActive={mode === 'user_search'} onClick={() => setMode('user_search')} />
            </div>

            <div className="p-6">
                {qrValue ? (
                    <div className="text-center flex flex-col items-center">
                        <h3 className="font-semibold text-slate-800">Scan QR Code to Pay</h3>
                        <p className="text-3xl font-bold my-2 text-teal-600">${parseFloat(amount).toLocaleString('en-US', {minimumFractionDigits: 2})} <span className="text-xl">{currency}</span></p>
                        <div className="bg-white p-4 rounded-lg border inline-block">
                            <QRCode value={qrValue} size={200} />
                        </div>
                        <p className="text-sm text-slate-500 mt-4">Waiting for payment...</p>
                        <button onClick={resetState} className="mt-4 bg-slate-200 text-slate-700 px-6 py-2 rounded-md font-semibold">Cancel</button>
                    </div>
                ) : requestSent ? (
                    <div className="text-center flex flex-col items-center justify-center h-[400px]">
                         <h3 className="font-semibold text-lg text-slate-800">Payment Request Sent!</h3>
                         <p className="text-slate-600">Waiting for {foundUser?.name} to confirm the payment of <span className="font-bold">${parseFloat(amount).toLocaleString('en-US', {minimumFractionDigits: 2})} {currency}</span>.</p>
                         <button onClick={resetState} className="mt-6 bg-slate-200 text-slate-700 px-6 py-2 rounded-md font-semibold">New Transaction</button>
                    </div>
                ) : (
                    <div className="space-y-4">
                        <div className="bg-slate-800 text-white p-4 rounded-lg text-right">
                            <p className="text-4xl font-mono tracking-wider">{parseFloat(amount).toLocaleString('en-US')}</p>
                            <p className="text-lg font-mono -mt-1">{currency}</p>
                        </div>

                        {mode === 'user_search' && (
                             <div>
                                <label className="block text-sm font-medium text-slate-600 mb-1">Traveler's Email</label>
                                <div className="flex gap-2">
                                    <input type="email" value={userSearch} onChange={e => setUserSearch(e.target.value)} placeholder="user@example.com" className="flex-grow w-full px-3 py-2 bg-slate-100 border-slate-300 rounded-md" />
                                    <button onClick={handleFindUser} disabled={isLoading} className="bg-slate-200 px-4 rounded-md font-semibold hover:bg-slate-300">Find</button>
                                </div>
                                {isLoading && !foundUser && <Spinner message="Searching..."/>}
                                {foundUser && (
                                    <div className="mt-2 p-2 bg-green-50 border border-green-200 rounded-md flex items-center gap-2">
                                        <img src={foundUser.avatarUrl} className="w-8 h-8 rounded-full" alt={foundUser.name} />
                                        <p className="text-sm font-semibold text-green-800">Found: {foundUser.name}</p>
                                    </div>
                                )}
                            </div>
                        )}
                        
                        <NumericKeypad onKeyPress={handleKeyPress} />
                        
                        {error && <p className="text-xs text-red-600 text-center">{error}</p>}
                        
                        <button 
                            onClick={handleCreateRequest} 
                            disabled={isLoading || (mode === 'user_search' && !foundUser)} 
                            className="w-full bg-teal-600 text-white py-4 rounded-lg font-bold text-lg hover:bg-teal-700 disabled:bg-slate-400 transition-colors"
                        >
                            {mode === 'qr' ? 'Generate QR Code' : 'Send Payment Request'}
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default MerchantPosPage;