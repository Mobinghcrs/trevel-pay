import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { PhysicalCurrency, BankRecipientDetails, UserProfile } from '../../types';
import { getPhysicalRates, getUserProfile, createBankTransferOrder } from '../../services/apiService';
import Card from '../../components/Card';
import Spinner from '../../components/Spinner';
import { ICONS } from '../../constants';
import { useNavigation } from '../../contexts/NavigationContext';

type ExchangeStep = 'entry' | 'recipient' | 'confirmation';

interface BankExchangeProps {
    context?: {
        fromCurrency?: string;
        toCurrency?: string;
        amount?: number;
    } | null;
}

const StepHeader: React.FC<{ title: string; onBack?: () => void }> = ({ title, onBack }) => (
    <div className="p-6 border-b border-slate-200 flex items-center gap-4">
        {onBack && (
            <button onClick={onBack} className="p-2 rounded-full hover:bg-slate-100 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" /></svg>
            </button>
        )}
        <h2 className="text-xl font-bold text-slate-900">{title}</h2>
    </div>
);

const BankExchange: React.FC<BankExchangeProps> = ({ context }) => {
    const { navigate } = useNavigation();

    // Data state
    const [rates, setRates] = useState<PhysicalCurrency[]>([]);
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Flow state
    const [step, setStep] = useState<ExchangeStep>('entry');
    const [isProcessing, setIsProcessing] = useState(false);

    // Form state
    const [fromCurrency, setFromCurrency] = useState('USD');
    const [toCurrency, setToCurrency] = useState('EUR');
    const [fromAmount, setFromAmount] = useState<string>('1000');
    const [recipient, setRecipient] = useState<BankRecipientDetails>({
        fullName: '',
        accountNumber: '',
        bankName: '',
    });

    const fetchData = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            const [ratesData, profileData] = await Promise.all([getPhysicalRates(), getUserProfile()]);
            setRates(ratesData);
            setProfile(profileData);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to load exchange data.");
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    useEffect(() => {
        if (context) {
            if (context.fromCurrency) setFromCurrency(context.fromCurrency);
            if (context.toCurrency) setToCurrency(context.toCurrency);
            if (context.amount) setFromAmount(context.amount.toString());
        }
    }, [context]);

    const availableCurrencies = useMemo(() => {
        return profile?.wallets.filter(w => w.type === 'Fiat').map(w => w.currency) || [];
    }, [profile]);
    
    const { toAmount, exchangeRate } = useMemo(() => {
        const usdRates: Record<string, number> = { 'USD': 1 };
        rates.forEach(r => { usdRates[r.code] = 1 / r.rate });

        const fromRate = usdRates[fromCurrency];
        const toRate = usdRates[toCurrency];
        
        if (!fromRate || !toRate) return { toAmount: '0.00', exchangeRate: 'N/A' };
        
        const rate = toRate / fromRate;
        const amount = parseFloat(fromAmount);
        
        if (isNaN(amount)) return { toAmount: '0.00', exchangeRate: rate.toFixed(4) };
        
        return {
            toAmount: (amount * rate).toFixed(2),
            exchangeRate: `1 ${fromCurrency} ≈ ${rate.toFixed(4)} ${toCurrency}`
        };
    }, [fromAmount, fromCurrency, toCurrency, rates]);

    const handleNext = () => {
        if (step === 'entry') {
            if (parseFloat(fromAmount) <= 0 || isNaN(parseFloat(fromAmount))) {
                alert("Please enter a valid amount.");
                return;
            }
            const fromWallet = profile?.wallets.find(w => w.currency === fromCurrency);
            if (!fromWallet || fromWallet.balance < parseFloat(fromAmount)) {
                alert(`Insufficient balance in your ${fromCurrency} wallet.`);
                return;
            }
            setStep('recipient');
        } else if (step === 'recipient') {
             if (!recipient.fullName.trim() || !recipient.accountNumber.trim() || !recipient.bankName.trim()) {
                alert("Please fill in all recipient details.");
                return;
            }
            setStep('confirmation');
        }
    };
    
    const handleConfirm = async () => {
        setIsProcessing(true);
        setError(null);
        try {
            await createBankTransferOrder({
                fromCurrency,
                toCurrency,
                fromAmount: parseFloat(fromAmount),
                toAmount: parseFloat(toAmount),
                recipient
            });
            alert("Bank transfer initiated successfully! You can view the order in the Orders page.");
            navigate('orders');
        } catch (err) {
             const message = err instanceof Error ? err.message : "An unknown error occurred.";
             setError(message);
             alert(`Failed to initiate transfer: ${message}`);
        } finally {
            setIsProcessing(false);
        }
    };

    const handleBack = () => {
        if (step === 'confirmation') setStep('recipient');
        else if (step === 'recipient') setStep('entry');
    };

    if (isLoading) return <Spinner message="Loading exchange details..." />;
    if (error && !profile) return <div className="text-center text-red-600 bg-red-100 p-4 rounded-md">{error}</div>;

    const renderContent = () => {
        switch(step) {
            case 'recipient':
                return (
                    <>
                        <StepHeader title="Recipient Details" onBack={handleBack} />
                        <div className="p-6 space-y-4">
                            <div>
                                <label htmlFor="fullName" className="block text-sm font-medium text-slate-700 mb-1">Recipient's Full Name</label>
                                <input id="fullName" value={recipient.fullName} onChange={e => setRecipient({...recipient, fullName: e.target.value})} className="w-full bg-white border border-slate-300 rounded-md px-3 py-2 text-slate-900 focus:ring-2 focus:ring-teal-500" required />
                            </div>
                            <div>
                                <label htmlFor="accountNumber" className="block text-sm font-medium text-slate-700 mb-1">Account Number (IBAN)</label>
                                <input id="accountNumber" value={recipient.accountNumber} onChange={e => setRecipient({...recipient, accountNumber: e.target.value})} className="w-full bg-white border border-slate-300 rounded-md px-3 py-2 text-slate-900 focus:ring-2 focus:ring-teal-500" required />
                            </div>
                            <div>
                                <label htmlFor="bankName" className="block text-sm font-medium text-slate-700 mb-1">Bank Name</label>
                                <input id="bankName" value={recipient.bankName} onChange={e => setRecipient({...recipient, bankName: e.target.value})} className="w-full bg-white border border-slate-300 rounded-md px-3 py-2 text-slate-900 focus:ring-2 focus:ring-teal-500" required />
                            </div>
                            <button onClick={handleNext} className="w-full mt-2 bg-teal-600 text-white px-4 py-3 rounded-md font-semibold hover:bg-teal-700">Continue</button>
                        </div>
                    </>
                );
            case 'confirmation':
                return (
                    <>
                        <StepHeader title="Confirm Transfer" onBack={handleBack} />
                        <div className="p-6 space-y-4">
                            <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 space-y-2">
                                <div className="flex justify-between"><span className="text-slate-600">You Send</span><span className="font-mono font-semibold text-red-600">- {parseFloat(fromAmount).toFixed(2)} {fromCurrency}</span></div>
                                <div className="flex justify-between"><span className="text-slate-600">They Receive</span><span className="font-mono font-semibold text-green-600">+ {toAmount} {toCurrency}</span></div>
                            </div>
                             <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
                                <h4 className="font-semibold mb-2">Recipient:</h4>
                                <div className="text-sm space-y-1">
                                    <p><strong>Name:</strong> {recipient.fullName}</p>
                                    <p><strong>Bank:</strong> {recipient.bankName}</p>
                                    <p><strong>Account:</strong> <span className="font-mono">{recipient.accountNumber}</span></p>
                                </div>
                            </div>
                            <button onClick={handleConfirm} disabled={isProcessing} className="w-full mt-2 bg-green-600 text-white px-4 py-3 rounded-md font-semibold hover:bg-green-500 disabled:bg-slate-400">
                                {isProcessing ? 'Processing...' : 'Confirm & Send'}
                            </button>
                        </div>
                    </>
                );
            case 'entry':
            default:
                return (
                    <>
                        <StepHeader title="International Bank Transfer" />
                        <div className="p-6 space-y-4">
                            <div className="p-4 bg-slate-50 rounded-lg border border-slate-200">
                                <label className="text-sm font-medium text-slate-500 mb-1 block">You send</label>
                                <div className="flex items-center gap-2">
                                    <input type="number" value={fromAmount} onChange={e => setFromAmount(e.target.value)} placeholder="0.0" className="w-full bg-transparent text-2xl font-mono text-slate-900 focus:outline-none" />
                                    <select value={fromCurrency} onChange={e => setFromCurrency(e.target.value)} className="bg-slate-200 border border-slate-300 rounded-md px-3 py-2 text-slate-900 font-semibold focus:ring-2 focus:ring-teal-500">
                                        {availableCurrencies.map(c => <option key={c} value={c}>{c}</option>)}
                                    </select>
                                </div>
                            </div>
                            <div className="p-4 bg-slate-50 rounded-lg border border-slate-200">
                                <label className="text-sm font-medium text-slate-500 mb-1 block">Recipient gets</label>
                                <div className="flex items-center gap-2">
                                    <input type="text" value={toAmount} disabled className="w-full bg-transparent text-2xl font-mono text-slate-500 cursor-not-allowed" />
                                    <select value={toCurrency} onChange={e => setToCurrency(e.target.value)} className="bg-slate-200 border border-slate-300 rounded-md px-3 py-2 text-slate-900 font-semibold focus:ring-2 focus:ring-teal-500">
                                         {rates.map(r => <option key={r.code} value={r.code}>{r.code}</option>)}
                                    </select>
                                </div>
                            </div>
                            <div className="text-center text-sm font-mono text-slate-500">{exchangeRate}</div>
                            <button onClick={handleNext} className="w-full mt-2 bg-teal-600 text-white px-4 py-3 rounded-md font-semibold hover:bg-teal-700">Continue</button>
                        </div>
                    </>
                );
        }
    };

    return (
        <Card className="max-w-xl mx-auto border-slate-200">
            {renderContent()}
        </Card>
    );
};

export default BankExchange;