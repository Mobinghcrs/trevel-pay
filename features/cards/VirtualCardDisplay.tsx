import React, { useState, useMemo } from 'react';
import { VirtualCard } from '../../types';
import { ICONS } from '../../constants';
import { updateVirtualCardStatus } from '../../services/apiService';

interface VirtualCardDisplayProps {
    card: VirtualCard;
    onUpdate: () => void;
}

const getCurrencySymbol = (currency: string): string => {
    const symbols: { [key: string]: string } = {
        'USD': '$', 'EUR': '€', 'GBP': '£', 'JPY': '¥', 'BTC': 'Ƀ', 'ETH': 'Ξ', 'USDT': '₮'
    };
    return symbols[currency] || currency;
}

const VirtualCardDisplay: React.FC<VirtualCardDisplayProps> = ({ card, onUpdate }) => {
    const [showDetails, setShowDetails] = useState(false);
    const [isUpdating, setIsUpdating] = useState(false);

    const maskedCardNumber = `•••• •••• •••• ${card.cardNumber.slice(-4)}`;
    const formattedCardNumber = card.cardNumber.replace(/(\d{4})/g, '$1 ').trim();
    
    const handleToggleStatus = async () => {
        const newStatus = card.status === 'Active' ? 'Frozen' : 'Active';
        if (!confirm(`Are you sure you want to ${newStatus.toLowerCase()} this card?`)) return;

        setIsUpdating(true);
        try {
            await updateVirtualCardStatus(card.id, newStatus);
            onUpdate();
        } catch(e) {
            alert(`Failed to update card status: ${e instanceof Error ? e.message : 'Unknown error'}`);
        } finally {
            setIsUpdating(false);
        }
    };
    
    const isCrypto = useMemo(() => ['BTC', 'ETH', 'USDT', 'SOL', 'XRP'].includes(card.walletCurrency), [card.walletCurrency]);

    const auroraClasses = isCrypto 
        ? { one: 'bg-rose-500', two: 'bg-fuchsia-500', three: 'bg-indigo-500' }
        : { one: 'bg-teal-400', two: 'bg-sky-400', three: 'bg-emerald-400' };

    return (
        <div className="flex flex-col md:flex-row gap-4 items-center">
            {/* Card Visual */}
            <div className="relative w-full max-w-sm h-56 rounded-2xl overflow-hidden group">
                {/* Background Blobs */}
                <div className={`absolute top-0 -left-1/2 w-72 h-72 ${auroraClasses.one} rounded-full mix-blend-screen filter blur-3xl opacity-40 group-hover:opacity-60 transition-opacity duration-500 animate-blob`}></div>
                <div className={`absolute top-0 -right-1/2 w-72 h-72 ${auroraClasses.two} rounded-full mix-blend-screen filter blur-3xl opacity-40 group-hover:opacity-60 transition-opacity duration-500 animate-blob animation-delay-2000`}></div>
                <div className={`absolute -bottom-1/2 left-1/4 w-72 h-72 ${auroraClasses.three} rounded-full mix-blend-screen filter blur-3xl opacity-40 group-hover:opacity-60 transition-opacity duration-500 animate-blob animation-delay-4000`}></div>
                
                {/* Glassmorphic Card */}
                <div className={`absolute inset-0 bg-black/20 backdrop-blur-xl rounded-2xl border border-white/20 p-5 flex flex-col justify-between transition-all duration-300 ${card.status !== 'Active' ? 'opacity-60' : ''}`}>
                    {/* Top Row: Chip & Brand */}
                    <div className="flex justify-between items-start z-10">
                        <div className="w-12 h-8 bg-gradient-to-br from-yellow-300 to-yellow-500 rounded-md border border-yellow-600/50 relative overflow-hidden">
                            <div className="w-8 h-6 bg-gradient-to-br from-yellow-200 to-yellow-400 rounded-sm absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 border-l border-t border-yellow-200/50"></div>
                        </div>
                        <span className="font-bold text-lg text-white/90 drop-shadow-md pt-1">TRAVEL PAY</span>
                    </div>

                    {/* Card Number */}
                    <div className="z-10 text-white text-left">
                        <p className="font-mono text-xl md:text-2xl tracking-wider drop-shadow-md">{showDetails ? formattedCardNumber : maskedCardNumber}</p>
                    </div>

                    {/* Bottom Row */}
                    <div className="flex justify-between items-end z-10 text-sm text-white/90">
                        <div>
                            <p className="text-xs opacity-80">Card Holder</p>
                            <p className="font-semibold uppercase drop-shadow-sm">{card.cardHolderName}</p>
                        </div>
                        <div className="flex items-end gap-4">
                             <div className="text-right">
                                <p className="text-xs opacity-80">Expires / CVV</p>
                                <p className="font-mono drop-shadow-sm">{card.expiryDate} / {showDetails ? card.cvv : '•••'}</p>
                            </div>
                            <div className="flex items-center gap-1">
                                <span className="text-2xl font-bold text-white/80 drop-shadow-md -mb-1">{getCurrencySymbol(card.walletCurrency)}</span>
                                <svg width="24" height="24" viewBox="0 0 24 24" className="w-8 h-8 text-white/80 transform rotate-90" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M7.5 14.5C9.98528 16.9853 14.0147 16.9853 16.5 14.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                                    <path d="M10.5 11.5C11.4706 12.4706 12.5294 12.4706 13.5 11.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                                    <path d="M4.5 17.5C8.64214 21.6421 15.3579 21.6421 19.5 17.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                                </svg>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {/* Controls */}
            <div className="flex flex-row md:flex-col gap-2 p-2">
                 <div className={`text-xs font-bold px-2 py-1 rounded-full text-center mb-1 hidden md:block ${card.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>{card.status}</div>
                 <button onClick={() => setShowDetails(!showDetails)} className="flex items-center justify-center gap-2 text-sm text-slate-700 hover:text-teal-600 bg-white/50 backdrop-blur-sm border border-white/20 hover:bg-white/80 p-2 rounded-lg font-semibold transition-colors">
                    <div className="w-5 h-5">{showDetails ? ICONS.lockClosed : ICONS.creditCard}</div>
                    <span className="hidden md:inline">Details</span>
                </button>
                 <button onClick={handleToggleStatus} disabled={isUpdating} className="flex items-center justify-center gap-2 text-sm text-slate-700 hover:text-teal-600 bg-white/50 backdrop-blur-sm border border-white/20 hover:bg-white/80 p-2 rounded-lg font-semibold transition-colors disabled:opacity-50">
                    <div className="w-5 h-5">{card.status === 'Active' ? ICONS.userX : ICONS.shieldCheck}</div>
                    <span className="hidden md:inline">{isUpdating ? '...' : card.status === 'Active' ? 'Freeze' : 'Unfreeze'}</span>
                </button>
            </div>
        </div>
    );
};

export default VirtualCardDisplay;
