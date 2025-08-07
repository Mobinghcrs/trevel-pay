


import React, { useState, useMemo } from 'react';
import { UserProfile, RevenueSettings } from '../../types';
import { findUserByUserId, initiateUserTransfer, getRevenueSettings, getUserProfile } from '../../services/apiService';
import Card from '../../components/Card';
import Spinner from '../../components/Spinner';
import { ICONS } from '../../constants';

type TransferStep = 'find' | 'amount' | 'confirm' | 'success';

const UserTransferPage: React.FC = () => {
    const [step, setStep] = useState<TransferStep>('find');
    const [userId, setUserId] = useState('');
    const [foundUser, setFoundUser] = useState<UserProfile | null>(null);
    const [amount, setAmount] = useState('');
    const [currency, setCurrency] = useState('USD');
    const [fee, setFee] = useState(0);
    const [feeModel, setFeeModel] = useState<RevenueSettings['userTransfer'] | null>(null);
    const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
    
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const resetState = () => {
        setStep('find');
        setUserId('');
        setFoundUser(null);
        setAmount('');
        setFee(0);
        setError(null);
    };

    const handleFindUser = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);
        try {
            const [user, settings, me] = await Promise.all([
                findUserByUserId(userId.startsWith('@') ? userId : `@${userId}`),
                getRevenueSettings(),
                getUserProfile()
            ]);
             if (user.userId === me.userId) {
                throw new Error("You cannot send money to yourself.");
            }
            setFoundUser(user);
            setFeeModel(settings.userTransfer);
            setCurrentUser(me);
            if (me.wallets.length > 0) {
                setCurrency(me.wallets[0].currency);
            }
            setStep('amount');
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to find user.');
        } finally {
            setIsLoading(false);
        }
    };
    
    const handleAmountSubmit = () => {
        const numAmount = parseFloat(amount);
        if (isNaN(numAmount) || numAmount <= 0) {
            setError("Please enter a valid amount.");
            return;
        }
        if (feeModel) {
            const calculatedFee = feeModel.type === 'fixed' 
                ? feeModel.value 
                : numAmount * (feeModel.value / 100);
            setFee(calculatedFee);
        }
        setStep('confirm');
    };

    const handleConfirmTransfer = async () => {
        if (!foundUser) return;
        setIsLoading(true);
        setError(null);
        try {
            await initiateUserTransfer(foundUser.userId, parseFloat(amount), currency);
            setStep('success');
        } catch(err) {
            setError(err instanceof Error ? err.message : 'Transfer failed.');
            setStep('amount'); // Go back to amount step on failure
        } finally {
            setIsLoading(false);
        }
    };

    const totalDeducted = parseFloat(amount || '0') + fee;
    const selectedWallet = currentUser?.wallets.find(w => w.currency === currency);

    const renderContent = () => {
        switch (step) {
            case 'success':
                return (
                    <div className="text-center p-4">
                        <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-4">
                            <svg className="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg>
                        </div>
                        <h2 className="text-xl font-bold">Transfer Successful!</h2>
                        <p className="text-slate-600 mt-2">{amount} {currency} has been sent to {foundUser?.name}.</p>
                        <button onClick={resetState} className="mt-6 w-full bg-teal-600 text-white py-2 rounded-md font-semibold">
                            Make Another Transfer
                        </button>
                    </div>
                );
            case 'confirm':
                return (
                    <div className="space-y-4">
                        <h3 className="text-lg font-bold text-center">Confirm Transfer</h3>
                        <div className="bg-slate-100 p-4 rounded-lg space-y-2">
                             <div className="flex justify-between"><span className="text-slate-600">To:</span> <span className="font-semibold">{foundUser?.name} ({foundUser?.userId})</span></div>
                             <div className="flex justify-between"><span className="text-slate-600">Amount:</span> <span className="font-mono font-semibold">{parseFloat(amount).toFixed(2)} {currency}</span></div>
                             <div className="flex justify-between"><span className="text-slate-600">Fee:</span> <span className="font-mono font-semibold">{fee.toFixed(2)} {currency}</span></div>
                             <div className="flex justify-between text-lg font-bold border-t pt-2 mt-2"><span className="text-slate-800">Total:</span> <span className="font-mono">{totalDeducted.toFixed(2)} {currency}</span></div>
                        </div>
                        <div className="flex gap-4">
                            <button onClick={() => setStep('amount')} className="w-full bg-slate-200 py-2 rounded-md font-semibold">Back</button>
                            <button onClick={handleConfirmTransfer} disabled={isLoading} className="w-full bg-green-600 text-white py-2 rounded-md font-semibold disabled:bg-slate-400">
                                {isLoading ? 'Sending...' : 'Confirm & Send'}
                            </button>
                        </div>
                    </div>
                );
            case 'amount':
                return (
                    <div className="space-y-4">
                         <div className="text-center">
                            <p className="text-sm text-slate-500">Sending to:</p>
                            <img src={foundUser?.avatarUrl} alt={foundUser?.name} className="w-16 h-16 rounded-full mx-auto my-2" />
                            <h3 className="font-bold">{foundUser?.name}</h3>
                            <p className="text-sm text-slate-500 font-mono">{foundUser?.userId}</p>
                        </div>
                        <div>
                            <label htmlFor="currency" className="block text-sm font-medium text-slate-700 mb-1">From Wallet</label>
                            <select id="currency" value={currency} onChange={e => setCurrency(e.target.value)} className="w-full bg-slate-100 border-slate-300 rounded-md px-3 py-2">
                               {currentUser?.wallets.map(w => <option key={w.currency} value={w.currency}>{w.name} ({w.currency})</option>)}
                            </select>
                            <p className="text-xs text-slate-500 mt-1">Balance: {selectedWallet?.balance.toLocaleString(undefined, {minimumFractionDigits: 2})}</p>
                        </div>
                        <div>
                            <label htmlFor="amount" className="block text-sm font-medium text-slate-700 mb-1">Amount</label>
                            <input id="amount" type="number" value={amount} onChange={e => setAmount(e.target.value)} required className="w-full bg-slate-100 border-slate-300 rounded-md px-3 py-2 text-2xl font-mono text-right" placeholder="0.00" />
                        </div>
                        {error && <p className="text-xs text-red-600 text-center">{error}</p>}
                        <div className="flex gap-4">
                            <button onClick={() => setStep('find')} className="w-full bg-slate-200 py-2 rounded-md font-semibold">Back</button>
                            <button onClick={handleAmountSubmit} className="w-full bg-teal-600 text-white py-2 rounded-md font-semibold">Continue</button>
                        </div>
                    </div>
                );
            case 'find':
            default:
                return (
                    <form onSubmit={handleFindUser} className="space-y-4">
                        <div>
                            <label htmlFor="userid-search" className="block text-sm font-medium text-slate-700 mb-1">Recipient's User ID</label>
                            <div className="relative">
                                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                                    <span className="text-slate-400">{ICONS.atSymbol}</span>
                                </div>
                                <input id="userid-search" type="text" value={userId} onChange={e => setUserId(e.target.value)} required placeholder="username" className="w-full bg-slate-100 border-slate-300 rounded-md pl-10 px-3 py-2" />
                            </div>
                        </div>
                        {error && <p className="text-xs text-red-600 text-center">{error}</p>}
                        <button type="submit" disabled={isLoading} className="w-full bg-teal-600 text-white py-3 rounded-md font-semibold hover:bg-teal-700 disabled:bg-slate-400">
                            {isLoading ? 'Searching...' : 'Find Recipient'}
                        </button>
                    </form>
                );
        }
    };

    return (
        <div className="max-w-md mx-auto">
             <div className="text-center mb-6">
                 <div className="w-20 h-20 bg-teal-100 text-teal-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  {ICONS.userArrows}
                </div>
                <h1 className="text-2xl font-bold text-slate-900">Send Money</h1>
                <p className="text-slate-600 mt-1">Transfer funds to another TRAVEL PAY user instantly.</p>
            </div>
            <Card className="p-6">{renderContent()}</Card>
        </div>
    );
};

export default UserTransferPage;