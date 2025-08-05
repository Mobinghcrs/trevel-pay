import React, { useState, useCallback } from 'react';
import { UserProfile, Wallet, VirtualCard } from '../../types';
import { findUserForAgent, agentTransferToUser, getUserProfile, findUserByCardNumber } from '../../services/apiService';
import Card from '../../components/Card';
import Spinner from '../../components/Spinner';
import { ICONS } from '../../constants';

type AgentActionTab = 'credit' | 'card-inquiry';

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

const CreditUserContent: React.FC = () => {
    const [step, setStep] = useState<'find' | 'transfer'>('find');
    const [email, setEmail] = useState('');
    const [foundUser, setFoundUser] = useState<UserProfile | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Transfer state
    const [amount, setAmount] = useState('');
    const [currency, setCurrency] = useState('USD');
    const [agentProfile, setAgentProfile] = useState<UserProfile | null>(null);

    const handleFindUser = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);
        setFoundUser(null);
        try {
            const user = await findUserForAgent(email);
            const agent = await getUserProfile();
            setFoundUser(user);
            setAgentProfile(agent);
            setCurrency(agent.wallets[0]?.currency || 'USD');
            setStep('transfer');
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to find user.');
        } finally {
            setIsLoading(false);
        }
    };
    
    const handleTransfer = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!foundUser) return;
        setIsLoading(true);
        setError(null);
        try {
            await agentTransferToUser(foundUser.email, parseFloat(amount), currency);
            alert(`Successfully transferred ${amount} ${currency} to ${foundUser.name}.`);
            setStep('find');
            setEmail('');
            setFoundUser(null);
            setAmount('');
        } catch(err) {
             setError(err instanceof Error ? err.message : 'Transfer failed.');
        } finally {
            setIsLoading(false);
        }
    }
    
    const agentWallet = agentProfile?.wallets.find(w => w.currency === currency);

    if (step === 'transfer' && foundUser && agentProfile) {
         return (
             <div>
                <div className="text-center mb-4 border-b pb-4">
                    <img src={foundUser.avatarUrl} alt={foundUser.name} className="w-20 h-20 rounded-full mx-auto mb-2" />
                    <h2 className="font-bold text-lg">{foundUser.name}</h2>
                    <p className="text-sm text-gray-500">{foundUser.email}</p>
                </div>
                <form onSubmit={handleTransfer} className="space-y-4">
                    <div>
                        <label htmlFor="currency" className="block text-sm font-medium text-gray-700 mb-1">Currency</label>
                        <select id="currency" value={currency} onChange={e => setCurrency(e.target.value)} className="w-full bg-slate-100 border-slate-300 rounded-md px-3 py-2">
                            {agentProfile.wallets.map(w => <option key={w.currency} value={w.currency}>{w.name} ({w.currency})</option>)}
                        </select>
                        {agentWallet && <p className="text-xs text-slate-500 mt-1">Your balance: {agentWallet.balance.toLocaleString()}</p>}
                    </div>
                     <div>
                        <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-1">Amount to Transfer</label>
                        <input id="amount" type="number" value={amount} onChange={e=> setAmount(e.target.value)} required className="w-full bg-slate-100 border-slate-300 rounded-md px-3 py-2" />
                    </div>
                    {error && <p className="text-xs text-red-600 text-center">{error}</p>}
                    <div className="flex gap-4 pt-2">
                         <button type="button" onClick={() => setStep('find')} className="w-full bg-slate-200 text-slate-800 py-2 rounded-md font-semibold hover:bg-slate-300">
                            Back
                        </button>
                        <button type="submit" disabled={isLoading} className="w-full bg-teal-600 text-white py-2 rounded-md font-semibold hover:bg-teal-700 disabled:bg-slate-400">
                            {isLoading ? 'Processing...' : 'Confirm Transfer'}
                        </button>
                    </div>
                </form>
             </div>
         )
    }

    return (
        <div>
             <form onSubmit={handleFindUser} className="space-y-4">
                 <div>
                    <label htmlFor="email-search" className="block text-sm font-medium text-slate-700 mb-1">User Email</label>
                    <input id="email-search" type="email" value={email} onChange={e => setEmail(e.target.value)} required placeholder="user@example.com" className="w-full bg-slate-100 border-slate-300 rounded-md px-3 py-2" />
                </div>
                {error && <p className="text-xs text-red-600 text-center">{error}</p>}
                <button type="submit" disabled={isLoading} className="w-full bg-teal-600 text-white py-3 rounded-md font-semibold hover:bg-teal-700 disabled:bg-slate-400">
                    {isLoading ? 'Searching...' : 'Find User'}
                </button>
            </form>
        </div>
    );
};

const CardInquiryContent: React.FC = () => {
    const [cardNumber, setCardNumber] = useState('');
    const [result, setResult] = useState<{ user: UserProfile, card: VirtualCard } | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSearch = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!cardNumber.trim()) return;
        setIsLoading(true);
        setError(null);
        setResult(null);
        try {
            const data = await findUserByCardNumber(cardNumber);
            setResult(data);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Search failed.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div>
            <form onSubmit={handleSearch} className="space-y-4">
                <div>
                    <label htmlFor="card-number-search" className="block text-sm font-medium text-slate-700 mb-1">Virtual Card Number</label>
                    <input id="card-number-search" type="text" value={cardNumber} onChange={e => setCardNumber(e.target.value)} required placeholder="Enter the full card number" className="w-full bg-slate-100 border-slate-300 rounded-md px-3 py-2" />
                </div>
                {error && <p className="text-xs text-red-600 text-center">{error}</p>}
                <button type="submit" disabled={isLoading} className="w-full bg-teal-600 text-white py-3 rounded-md font-semibold hover:bg-teal-700 disabled:bg-slate-400">
                    {isLoading ? 'Searching...' : 'Search Card'}
                </button>
            </form>

            {isLoading && <div className="mt-4"><Spinner message="Searching..." /></div>}
            
            {result && (
                <div className="mt-6 border-t pt-6">
                    <h3 className="font-bold text-lg text-slate-800 mb-2">Card Holder Information</h3>
                    <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
                        <div className="flex items-center gap-4">
                            <img src={result.user.avatarUrl} alt={result.user.name} className="w-16 h-16 rounded-full" />
                            <div>
                                <p className="font-bold text-slate-900">{result.user.name}</p>
                                <p className="text-sm text-slate-600">{result.user.email}</p>
                            </div>
                        </div>
                        <div className="mt-4 border-t pt-4 space-y-2 text-sm">
                            <div className="flex justify-between">
                                <span className="text-slate-500">Card Status:</span>
                                <span className={`font-bold px-2 py-0.5 rounded-full text-xs ${result.card.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>{result.card.status}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-slate-500">Linked Wallet:</span>
                                <span className="font-mono text-slate-700">{result.card.walletCurrency}</span>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

const AgentTransferPage: React.FC = () => {
    const [activeTab, setActiveTab] = useState<AgentActionTab>('credit');
    
    return (
        <div className="max-w-md mx-auto">
            <div className="text-center mb-6">
                 <div className="w-20 h-20 bg-teal-100 text-teal-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  {ICONS.userPlus}
                </div>
                <h1 className="text-2xl font-bold text-slate-900">Agent Actions</h1>
                <p className="text-slate-600 mt-1">Credit user wallets or inquire about virtual cards.</p>
            </div>

            <Card className="overflow-hidden">
                <div className="flex border-b border-slate-200">
                    <TabButton label="Credit User" isActive={activeTab === 'credit'} onClick={() => setActiveTab('credit')} />
                    <TabButton label="Card Inquiry" isActive={activeTab === 'card-inquiry'} onClick={() => setActiveTab('card-inquiry')} />
                </div>
                <div className="p-6">
                    {activeTab === 'credit' ? <CreditUserContent /> : <CardInquiryContent />}
                </div>
            </Card>
        </div>
    );
};

export default AgentTransferPage;
