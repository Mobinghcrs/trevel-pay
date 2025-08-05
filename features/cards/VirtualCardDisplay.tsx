import React, { useState } from 'react';
import { VirtualCard } from '../../types';
import { ICONS } from '../../constants';
import { updateVirtualCardStatus } from '../../services/apiService';

interface VirtualCardDisplayProps {
    card: VirtualCard;
    onUpdate: () => void;
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
    
    return (
        <div className="flex flex-col md:flex-row gap-4 items-center">
            {/* Card Visual */}
            <div className={`w-full max-w-sm h-56 rounded-xl shadow-lg relative flex flex-col justify-between p-5 text-white flex-shrink-0 bg-gradient-to-br from-gray-800 to-black overflow-hidden`}>
                <div className={`absolute inset-0 bg-[radial-gradient(#ffffff22_1px,transparent_1px)] [background-size:16px_16px] transition-opacity duration-300 ${card.status !== 'Active' ? 'opacity-20' : 'opacity-50'}`}></div>
                <div className="absolute inset-0 bg-black/10 rounded-xl"></div>
                
                <div className="flex justify-between items-start z-10">
                    <span className="font-bold text-lg">TRAVEL PAY</span>
                    <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${card.status === 'Active' ? 'bg-green-500/80' : 'bg-red-500/80'}`}>{card.status}</span>
                </div>

                <div className="z-10">
                    <p className="font-mono text-xl md:text-2xl tracking-wider">{showDetails ? formattedCardNumber : maskedCardNumber}</p>
                </div>

                <div className="flex justify-between items-end z-10 text-sm">
                    <div>
                        <p className="text-xs opacity-80">Card Holder</p>
                        <p className="font-semibold uppercase">{card.cardHolderName}</p>
                    </div>
                    <div>
                        <p className="text-xs opacity-80">Expires</p>
                        <p className="font-mono">{card.expiryDate}</p>
                    </div>
                     <div>
                        <p className="text-xs opacity-80">CVV</p>
                        <p className="font-mono">{showDetails ? card.cvv : '•••'}</p>
                    </div>
                </div>
            </div>
            {/* Controls */}
            <div className="flex flex-row md:flex-col gap-2 p-2">
                <button onClick={() => setShowDetails(!showDetails)} className="flex items-center gap-2 text-sm text-gray-600 hover:text-teal-600 bg-gray-100 hover:bg-teal-100 p-2 rounded-md font-semibold transition-colors">
                    <div className="w-5 h-5">{showDetails ? ICONS.lockClosed : ICONS.creditCard}</div>
                    <span className="hidden md:inline">{showDetails ? 'Hide' : 'Show'} Details</span>
                </button>
                 <button onClick={handleToggleStatus} disabled={isUpdating} className="flex items-center gap-2 text-sm text-gray-600 hover:text-teal-600 bg-gray-100 hover:bg-teal-100 p-2 rounded-md font-semibold transition-colors disabled:opacity-50">
                    <div className="w-5 h-5">{card.status === 'Active' ? ICONS.userX : ICONS.shieldCheck}</div>
                    <span className="hidden md:inline">{isUpdating ? 'Updating...' : card.status === 'Active' ? 'Freeze' : 'Unfreeze'}</span>
                </button>
            </div>
        </div>
    );
};

export default VirtualCardDisplay;