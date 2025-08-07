import React, { useState, useMemo, useEffect } from 'react';
import Modal from '../../components/Modal';
import { InvestableAsset, UserProfile } from '../../types';
import { createInvestmentOrder } from '../../services/apiService';

interface TradeModalProps {
    isOpen: boolean;
    onClose: () => void;
    asset: InvestableAsset;
    tradeType: 'BUY' | 'SELL';
    profile: UserProfile;
    onSuccess: () => void;
}

const TradeModal: React.FC<TradeModalProps> = ({ isOpen, onClose, asset, tradeType, profile, onSuccess }) => {
    const [amountAsset, setAmountAsset] = useState('');
    const [amountUSD, setAmountUSD] = useState('');
    const [selectedWalletCurrency, setSelectedWalletCurrency] = useState('USD');
    
    const [isProcessing, setIsProcessing] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Reset state when modal opens or asset changes
    useEffect(() => {
        if (isOpen) {
            setAmountAsset('');
            setAmountUSD('');
            setIsProcessing(false);
            setError(null);
            // Default to first available fiat wallet for buys
            if (tradeType === 'BUY') {
                const firstFiat = profile.wallets.find(w => w.type === 'Fiat');
                if (firstFiat) setSelectedWalletCurrency(firstFiat.currency);
            }
        }
    }, [isOpen, asset, tradeType, profile]);

    const handleAmountChange = (value: string,inputType: 'asset' | 'usd') => {
        const numericValue = parseFloat(value);
        if (value === '' || isNaN(numericValue)) {
            setAmountAsset('');
            setAmountUSD('');
            return;
        }

        if (inputType === 'asset') {
            setAmountAsset(value);
            setAmountUSD((numericValue * asset.price).toFixed(2));
        } else {
            setAmountUSD(value);
            setAmountAsset((numericValue / asset.price).toFixed(8));
        }
    };

    // --- Calculations ---
    const numericAmountUSD = parseFloat(amountUSD) || 0;
    const numericAmountAsset = parseFloat(amountAsset) || 0;
    const fee = numericAmountUSD * 0.005; // 0.5% fee
    const totalCost = numericAmountUSD + fee;
    const totalProceeds = numericAmountUSD - fee;
    
    // --- Wallet Logic ---
    const userAssetHolding = profile.investments.find(inv => inv.assetSymbol === asset.symbol)?.amount || 0;
    const selectedFiatWallet = profile.wallets.find(w => w.currency === selectedWalletCurrency);

    const canProceed = useMemo(() => {
        if (tradeType === 'BUY') {
            return selectedFiatWallet && selectedFiatWallet.balance >= totalCost && numericAmountUSD > 0;
        } else { // SELL
            return userAssetHolding >= numericAmountAsset && numericAmountAsset > 0;
        }
    }, [tradeType, selectedFiatWallet, totalCost, userAssetHolding, numericAmountAsset, numericAmountUSD]);

    const handleConfirm = async () => {
        if (!canProceed) {
            setError("Cannot proceed with transaction. Check balance and amounts.");
            return;
        }
        setIsProcessing(true);
        setError(null);
        try {
            await createInvestmentOrder(tradeType, asset, numericAmountAsset, numericAmountUSD, selectedWalletCurrency);
            onSuccess();
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An unexpected error occurred.');
        } finally {
            setIsProcessing(false);
        }
    };
    
    return (
        <Modal isOpen={isOpen} onClose={onClose} title={`${tradeType} ${asset.name} (${asset.symbol})`}>
            <div className="space-y-4">
                {/* Inputs */}
                <div className="p-3 bg-slate-50 rounded-lg">
                    <label className="text-xs text-slate-500">{tradeType === 'BUY' ? 'Pay with' : 'Sell to'}</label>
                     <select 
                        value={selectedWalletCurrency} 
                        onChange={e => setSelectedWalletCurrency(e.target.value)}
                        className="w-full bg-transparent font-semibold focus:outline-none"
                    >
                        {profile.wallets.filter(w => w.type === 'Fiat').map(w => (
                             <option key={w.currency} value={w.currency}>{w.name} ({w.balance.toFixed(2)} {w.currency})</option>
                        ))}
                    </select>
                </div>
                 <div className="p-3 bg-slate-50 rounded-lg">
                    <label className="text-xs text-slate-500">Amount</label>
                    <div className="flex items-center gap-2">
                         <input 
                            type="number" 
                            value={amountAsset}
                            onChange={e => handleAmountChange(e.target.value, 'asset')}
                            placeholder="0.00"
                            className="w-full bg-transparent text-2xl font-mono focus:outline-none"
                        />
                        <span className="font-semibold">{asset.symbol}</span>
                    </div>
                </div>
                <div className="text-center text-slate-500">=</div>
                 <div className="p-3 bg-slate-50 rounded-lg">
                     <div className="flex items-center gap-2">
                         <input 
                            type="number" 
                            value={amountUSD}
                            onChange={e => handleAmountChange(e.target.value, 'usd')}
                            placeholder="0.00"
                            className="w-full bg-transparent text-2xl font-mono focus:outline-none"
                        />
                        <span className="font-semibold">{selectedWalletCurrency}</span>
                    </div>
                </div>

                {/* Summary */}
                <div className="text-sm space-y-1 pt-2 border-t">
                    <div className="flex justify-between"><span className="text-slate-600">Price</span> <span>1 {asset.symbol} ≈ ${asset.price.toFixed(2)}</span></div>
                    <div className="flex justify-between"><span className="text-slate-600">Fee (0.5%)</span> <span>${fee.toFixed(2)}</span></div>
                    <div className="flex justify-between font-bold text-base mt-2 pt-2 border-t">
                        {tradeType === 'BUY' ? (
                             <><span>Total Cost</span> <span>${totalCost.toFixed(2)}</span></>
                        ) : (
                             <><span>Total Proceeds</span> <span>${totalProceeds.toFixed(2)}</span></>
                        )}
                    </div>
                </div>

                {error && <p className="text-center text-red-600 text-sm">{error}</p>}
                
                <button onClick={handleConfirm} disabled={!canProceed || isProcessing} className={`w-full py-3 rounded-lg text-white font-bold text-lg transition-colors ${tradeType === 'BUY' ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700'} disabled:bg-slate-400`}>
                    {isProcessing ? 'Processing...' : `Confirm ${tradeType}`}
                </button>
            </div>
        </Modal>
    );
};

export default TradeModal;