import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { UserProfile, Wallet } from '../../types';
import { getUserProfile, swapAssets, getPhysicalRates } from '../../services/apiService';
import Card from '../../components/Card';
import Spinner from '../../components/Spinner';
import { ICONS } from '../../constants';
import Modal from '../../components/Modal';

interface SwapPageProps {
  context?: {
    fromCurrency?: string;
    toCurrency?: string;
    amount?: number;
  } | null;
}

const SwapPage: React.FC<SwapPageProps> = ({ context }) => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [rates, setRates] = useState<Record<string, number>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [fromCurrency, setFromCurrency] = useState('BTC');
  const [toCurrency, setToCurrency] = useState('USD');
  const [fromAmount, setFromAmount] = useState('');
  
  const [isConfirming, setIsConfirming] = useState(false);
  const [isSwapping, setIsSwapping] = useState(false);

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [profileData, physicalRates] = await Promise.all([
        getUserProfile(),
        getPhysicalRates(),
      ]);
      setProfile(profileData);
      
      const allRates: Record<string, number> = { 'USD': 1 };
      physicalRates.forEach(r => allRates[r.code] = r.rate);
      // Mock crypto rates for swapping logic
      allRates['BTC'] = 1 / 65000;
      allRates['ETH'] = 1 / 3500;
      allRates['Points'] = 1 / 0.01; // 1 point = $0.01
      allRates['LCU'] = 1 / 3550; // Fictional local currency
      setRates(allRates);

    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : 'Failed to load data.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);
  
  useEffect(() => {
      if (context && profile) {
          if (context.fromCurrency && profile.wallets.some(w => w.currency === context.fromCurrency)) {
              setFromCurrency(context.fromCurrency);
          }
          if (context.toCurrency && profile.wallets.some(w => w.currency === context.toCurrency)) {
              setToCurrency(context.toCurrency);
          }
          if (context.amount) {
              setFromAmount(context.amount.toString());
          }
      }
  }, [context, profile]);

  const toAmount = useMemo(() => {
    const amount = parseFloat(fromAmount);
    if (isNaN(amount) || !rates[fromCurrency] || !rates[toCurrency]) return '';
    
    // Convert from -> USD -> to
    const amountInUSD = amount / rates[fromCurrency];
    const result = amountInUSD * rates[toCurrency];

    return result.toFixed(6).replace(/\.?0+$/, ''); // Format and remove trailing zeros
  }, [fromAmount, fromCurrency, toCurrency, rates]);
  
  const fromWallet = useMemo(() => profile?.wallets.find(w => w.currency === fromCurrency), [profile, fromCurrency]);

  const handleSwap = async () => {
      setIsSwapping(true);
      setError(null);
      try {
          const updatedProfile = await swapAssets(fromCurrency, toCurrency, parseFloat(fromAmount));
          setProfile(updatedProfile);
          setFromAmount('');
          setIsConfirming(false);
          alert('Swap successful!');
      } catch (err) {
          setError(err instanceof Error ? err.message : 'An unknown error occurred during swap.');
          alert(`Swap Failed: ${err instanceof Error ? err.message : 'Unknown error'}`);
          setIsConfirming(false);
      } finally {
          setIsSwapping(false);
      }
  }
  
  const openConfirmation = () => {
      if (!fromAmount || parseFloat(fromAmount) <= 0) {
          alert("Please enter a valid amount.");
          return;
      }
      if (fromWallet && fromWallet.balance < parseFloat(fromAmount)) {
          alert("Insufficient balance.");
          return;
      }
      setIsConfirming(true);
  }

  if (isLoading) return <Spinner message="Loading your wallets..." />;
  if (error) return <div className="text-center text-red-600 bg-red-100 p-4 rounded-md">{error}</div>;

  return (
    <div className="flex justify-center">
      <Card className="max-w-md w-full bg-white border-slate-200">
        <div className="p-6 border-b border-slate-200">
          <h2 className="text-xl font-bold text-slate-900">Instant Swap</h2>
          <p className="text-sm text-slate-600">Exchange assets in your wallets instantly.</p>
        </div>
        <div className="p-6 space-y-4">
            {/* From Input */}
            <div className="p-4 bg-slate-50 rounded-lg border border-slate-200">
                <label className="text-sm font-medium text-slate-500 mb-1 block">From</label>
                <div className="flex items-center gap-2">
                    <input
                        type="number"
                        value={fromAmount}
                        onChange={e => setFromAmount(e.target.value)}
                        placeholder="0.0"
                        className="w-full bg-transparent text-2xl font-mono text-slate-900 focus:outline-none"
                    />
                    <select value={fromCurrency} onChange={e => setFromCurrency(e.target.value)} className="bg-slate-200 border border-slate-300 rounded-md px-3 py-2 text-slate-900 font-semibold focus:ring-2 focus:ring-cyan-500 focus:outline-none">
                        {profile?.wallets.map(w => <option key={w.currency} value={w.currency}>{w.currency}</option>)}
                    </select>
                </div>
                {fromWallet && <p className="text-xs text-slate-500 mt-1">Balance: {fromWallet.balance.toLocaleString()}</p>}
            </div>

            {/* To Input */}
            <div className="p-4 bg-slate-50 rounded-lg border border-slate-200">
                <label className="text-sm font-medium text-slate-500 mb-1 block">To</label>
                <div className="flex items-center gap-2">
                    <input
                        type="text"
                        value={toAmount}
                        disabled
                        placeholder="0.0"
                        className="w-full bg-transparent text-2xl font-mono text-slate-500 focus:outline-none cursor-not-allowed"
                    />
                    <select value={toCurrency} onChange={e => setToCurrency(e.target.value)} className="bg-slate-200 border border-slate-300 rounded-md px-3 py-2 text-slate-900 font-semibold focus:ring-2 focus:ring-cyan-500 focus:outline-none">
                        {profile?.wallets.map(w => <option key={w.currency} value={w.currency}>{w.currency}</option>)}
                    </select>
                </div>
            </div>
            
            <button onClick={openConfirmation} className="w-full bg-cyan-600 text-white px-4 py-3 rounded-md font-semibold hover:bg-cyan-500 transition-all duration-200 disabled:bg-slate-400">
                Swap
            </button>
        </div>
        <Modal isOpen={isConfirming} onClose={() => setIsConfirming(false)} title="Confirm Swap">
             <div className="space-y-4 text-slate-800">
              <p className="text-slate-600">Please review your swap details.</p>
              <div className="bg-slate-100 p-4 rounded-lg space-y-2">
                  <div className="flex justify-between"><span className="text-slate-600">From:</span> <span className="font-mono font-semibold text-slate-800">{fromAmount} {fromCurrency}</span></div>
                  <div className="flex justify-between"><span className="text-slate-600">To:</span> <span className="font-mono font-semibold text-slate-800">{toAmount} {toCurrency}</span></div>
              </div>
              <div className="flex justify-end gap-4 pt-4">
                  <button onClick={() => setIsConfirming(false)} className="bg-slate-200 text-slate-800 px-4 py-2 rounded-md font-semibold hover:bg-slate-300 transition-colors">
                      Cancel
                  </button>
                  <button onClick={handleSwap} disabled={isSwapping} className="bg-cyan-600 text-white px-4 py-2 rounded-md font-semibold transition-colors disabled:bg-slate-400">
                      {isSwapping ? 'Processing...' : 'Confirm Swap'}
                  </button>
              </div>
          </div>
        </Modal>
      </Card>
    </div>
  );
};

export default SwapPage;
