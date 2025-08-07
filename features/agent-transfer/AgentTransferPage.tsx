import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { UserProfile, ESimPlan, TopUpOrder, ESimOrder } from '../../types';
import * as api from '../../services/apiService';
import Card from '../../components/Card';
import Spinner from '../../components/Spinner';
import { ICONS } from '../../constants';
import Modal from '../../components/Modal';

type Step = 'find' | 'services';
type ActiveModal = 'none' | 'credit' | 'top-up' | 'esim';
type Operator = 'Hamrahe Aval' | 'Irancell' | 'Rightel' | 'Shatel' | 'Unknown';

// --- Reusable Components ---

const UserCard: React.FC<{ user: UserProfile, onBack: () => void }> = ({ user, onBack }) => (
    <div className="text-center mb-4 border-b pb-4">
        <button onClick={onBack} className="text-sm text-teal-600 hover:underline mb-2">&larr; Find another user</button>
        <img src={user.avatarUrl} alt={user.name} className="w-20 h-20 rounded-full mx-auto mb-2" />
        <h2 className="font-bold text-lg">{user.name}</h2>
        <p className="text-sm text-gray-500">{user.email}</p>
    </div>
);

// --- Modal Components ---

const CreditUserModal: React.FC<{ user: UserProfile, onClose: () => void }> = ({ user, onClose }) => {
    const [amount, setAmount] = useState('');
    const [currency, setCurrency] = useState('USD');
    const [agentProfile, setAgentProfile] = useState<UserProfile | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        api.getUserProfile().then(setAgentProfile);
    }, []);

    const handleTransfer = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);
        try {
            await api.agentTransferToUser(user.email, parseFloat(amount), currency);
            alert(`Successfully credited ${amount} ${currency} to ${user.name}.`);
            onClose();
        } catch(err) {
            setError(err instanceof Error ? err.message : 'Transfer failed.');
        } finally {
            setIsLoading(false);
        }
    };
    
    const agentWallet = agentProfile?.wallets.find(w => w.currency === currency);

    return (
        <form onSubmit={handleTransfer} className="space-y-4">
            <div>
                <label htmlFor="currency" className="block text-sm font-medium text-gray-700 mb-1">Currency</label>
                <select id="currency" value={currency} onChange={e => setCurrency(e.target.value)} className="w-full bg-slate-100 border-slate-300 rounded-md px-3 py-2">
                    {agentProfile?.wallets.map(w => <option key={w.currency} value={w.currency}>{w.name} ({w.currency})</option>)}
                </select>
                {agentWallet && <p className="text-xs text-slate-500 mt-1">Your balance: {agentWallet.balance.toLocaleString()}</p>}
            </div>
            <div>
                <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-1">Amount to Credit</label>
                <input id="amount" type="number" value={amount} onChange={e=> setAmount(e.target.value)} required className="w-full bg-slate-100 border-slate-300 rounded-md px-3 py-2" />
            </div>
            {error && <p className="text-xs text-red-600 text-center">{error}</p>}
            <div className="flex justify-end gap-4 pt-2">
                <button type="button" onClick={onClose} className="bg-slate-200 text-slate-800 py-2 px-4 rounded-md font-semibold hover:bg-slate-300">Cancel</button>
                <button type="submit" disabled={isLoading} className="bg-teal-600 text-white py-2 px-4 rounded-md font-semibold hover:bg-teal-700 disabled:bg-slate-400">
                    {isLoading ? 'Processing...' : 'Confirm Credit'}
                </button>
            </div>
        </form>
    );
};

const TopUpUserModal: React.FC<{ user: UserProfile, onClose: () => void }> = ({ user, onClose }) => {
    const [mobileNumber, setMobileNumber] = useState('');
    const [amount, setAmount] = useState('50000');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const detectedOperator: Operator = useMemo(() => {
        const prefixes: { [key in Operator]?: string[] } = {
            'Hamrahe Aval': ['091'], 'Irancell': ['093', '090'], 'Rightel': ['092'], 'Shatel': ['0998']
        };
        for (const op in prefixes) {
            if (prefixes[op as Operator]?.some(p => mobileNumber.startsWith(p))) {
                return op as Operator;
            }
        }
        return 'Unknown';
    }, [mobileNumber]);

    const handlePurchase = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);
        try {
            await api.agentCreateTopUpForUser(user.email, {
                operator: detectedOperator,
                mobileNumber,
                amount: parseInt(amount)
            });
            alert(`Successfully purchased top-up for ${mobileNumber}.`);
            onClose();
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Purchase failed.');
        } finally {
            setIsLoading(false);
        }
    };
    
    return (
        <form onSubmit={handlePurchase} className="space-y-4">
             <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Mobile Number</label>
                <input type="tel" value={mobileNumber} onChange={e => setMobileNumber(e.target.value)} required placeholder="e.g., 0912..." className="w-full bg-slate-100 border-slate-300 rounded-md px-3 py-2" />
                {detectedOperator !== 'Unknown' && <p className="text-xs text-teal-600 mt-1">Operator: {detectedOperator}</p>}
            </div>
             <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Amount (IRR)</label>
                <select value={amount} onChange={e => setAmount(e.target.value)} className="w-full bg-slate-100 border-slate-300 rounded-md px-3 py-2">
                    <option value="50000">50,000 IRR</option>
                    <option value="100000">100,000 IRR</option>
                    <option value="200000">200,000 IRR</option>
                </select>
            </div>
            {error && <p className="text-xs text-red-600 text-center">{error}</p>}
            <div className="flex justify-end gap-4 pt-2">
                <button type="button" onClick={onClose} className="bg-slate-200 text-slate-800 py-2 px-4 rounded-md font-semibold">Cancel</button>
                <button type="submit" disabled={isLoading} className="bg-teal-600 text-white py-2 px-4 rounded-md font-semibold disabled:bg-slate-400">
                    {isLoading ? 'Processing...' : 'Purchase Top-up'}
                </button>
            </div>
        </form>
    );
};

const ESimUserModal: React.FC<{ user: UserProfile, onClose: () => void }> = ({ user, onClose }) => {
    const [country, setCountry] = useState('Turkey');
    const [plans, setPlans] = useState<ESimPlan[]>([]);
    const [selectedPlanId, setSelectedPlanId] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchPlans = async () => {
            setIsLoading(true);
            try {
                const planData = await api.getESimPlans(country);
                setPlans(planData);
                if (planData.length > 0) setSelectedPlanId(planData[0].id);
            } catch (err) { setError(err instanceof Error ? err.message : "Could not fetch plans."); }
            finally { setIsLoading(false); }
        };
        fetchPlans();
    }, [country]);

     const handlePurchase = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);
        try {
            await api.agentPurchaseESimForUser(user.email, selectedPlanId);
            alert(`Successfully purchased eSIM for ${user.name}.`);
            onClose();
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Purchase failed.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
         <form onSubmit={handlePurchase} className="space-y-4">
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Country</label>
                <select value={country} onChange={e => setCountry(e.target.value)} className="w-full bg-slate-100 border-slate-300 rounded-md px-3 py-2">
                    <option value="Turkey">Turkey</option>
                    <option value="UAE">UAE</option>
                    <option value="USA">USA</option>
                </select>
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Plan</label>
                {isLoading && !plans.length ? <Spinner/> :
                <select value={selectedPlanId} onChange={e => setSelectedPlanId(e.target.value)} className="w-full bg-slate-100 border-slate-300 rounded-md px-3 py-2">
                    {plans.map(p => <option key={p.id} value={p.id}>{p.dataAmountGB}GB / {p.validityDays} Days - ${p.priceUSD.toFixed(2)}</option>)}
                </select>}
            </div>
            {error && <p className="text-xs text-red-600 text-center">{error}</p>}
            <div className="flex justify-end gap-4 pt-2">
                <button type="button" onClick={onClose} className="bg-slate-200 text-slate-800 py-2 px-4 rounded-md font-semibold">Cancel</button>
                <button type="submit" disabled={isLoading} className="bg-teal-600 text-white py-2 px-4 rounded-md font-semibold disabled:bg-slate-400">
                    {isLoading ? 'Processing...' : 'Purchase eSIM'}
                </button>
            </div>
        </form>
    );
};


// --- Main Page ---

const AgentTransferPage: React.FC = () => {
    const [step, setStep] = useState<Step>('find');
    const [email, setEmail] = useState('');
    const [foundUser, setFoundUser] = useState<UserProfile | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [activeModal, setActiveModal] = useState<ActiveModal>('none');
    
    const handleFindUser = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);
        setFoundUser(null);
        try {
            const user = await api.findUserForAgent(email);
            setFoundUser(user);
            setStep('services');
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to find user.');
        } finally {
            setIsLoading(false);
        }
    };
    
    const handleReset = () => {
        setStep('find');
        setEmail('');
        setFoundUser(null);
        setError(null);
    };

    const renderModalContent = () => {
        if (!foundUser) return null;
        switch(activeModal) {
            case 'credit': return <CreditUserModal user={foundUser} onClose={() => setActiveModal('none')} />;
            case 'top-up': return <TopUpUserModal user={foundUser} onClose={() => setActiveModal('none')} />;
            case 'esim': return <ESimUserModal user={foundUser} onClose={() => setActiveModal('none')} />;
            default: return null;
        }
    };

    return (
        <div className="max-w-md mx-auto">
            <div className="text-center mb-6">
                 <div className="w-20 h-20 bg-teal-100 text-teal-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  {ICONS.userPlus}
                </div>
                <h1 className="text-2xl font-bold text-slate-900">Agent Service Center</h1>
                <p className="text-slate-600 mt-1">Provide services to TRAVEL PAY users.</p>
            </div>

            <Card className="p-6">
                {step === 'find' ? (
                    <form onSubmit={handleFindUser} className="space-y-4">
                        <h2 className="font-bold text-center">Find User</h2>
                        <div>
                            <label htmlFor="email-search" className="block text-sm font-medium text-slate-700 mb-1">User Email</label>
                            <input id="email-search" type="email" value={email} onChange={e => setEmail(e.target.value)} required placeholder="user@example.com" className="w-full bg-slate-100 border-slate-300 rounded-md px-3 py-2" />
                        </div>
                        {error && <p className="text-xs text-red-600 text-center">{error}</p>}
                        <button type="submit" disabled={isLoading} className="w-full bg-teal-600 text-white py-3 rounded-md font-semibold hover:bg-teal-700 disabled:bg-slate-400">
                            {isLoading ? 'Searching...' : 'Find User'}
                        </button>
                    </form>
                ) : foundUser && (
                    <div>
                        <UserCard user={foundUser} onBack={handleReset} />
                        <div className="space-y-3 mt-4">
                           <button onClick={() => setActiveModal('credit')} className="w-full flex items-center gap-3 p-3 bg-slate-100 hover:bg-slate-200 rounded-lg">
                                {ICONS.wallet}<span>Credit Wallet</span>
                           </button>
                            <button onClick={() => setActiveModal('top-up')} className="w-full flex items-center gap-3 p-3 bg-slate-100 hover:bg-slate-200 rounded-lg">
                                {ICONS.charge}<span>Mobile Top-up</span>
                           </button>
                            <button onClick={() => setActiveModal('esim')} className="w-full flex items-center gap-3 p-3 bg-slate-100 hover:bg-slate-200 rounded-lg">
                                {ICONS.sim}<span>Buy eSIM</span>
                           </button>
                        </div>
                    </div>
                )}
            </Card>

            <Modal isOpen={activeModal !== 'none'} onClose={() => setActiveModal('none')} title="Provide Service">
                {renderModalContent()}
            </Modal>
        </div>
    );
};

export default AgentTransferPage;