import React from 'react';
import { P2POffer } from '../../../types';
import Card from '../../../components/Card';

interface P2POfferCardProps {
  offer: P2POffer;
  onTrade: (offer: P2POffer) => void;
}

const P2POfferCard: React.FC<P2POfferCardProps> = ({ offer, onTrade }) => {
    const isBuy = offer.type === 'BUY';
    const actionText = isBuy ? 'Buy USD' : 'Sell USD';
    const actionButtonClass = isBuy 
        ? 'bg-green-600 hover:bg-green-500'
        : 'bg-red-600 hover:bg-red-500';

    return (
        <Card className="p-4 flex flex-col md:flex-row md:items-center gap-4 border-slate-200 bg-white">
            <div className="flex-grow">
                <div className="flex justify-between items-start">
                    <div>
                        <p className="font-bold text-slate-800 flex items-center gap-2">
                            {offer.userName}
                            <span className="text-xs font-normal text-teal-700 bg-teal-100 px-2 py-0.5 rounded-full" aria-label={`Rating: ${offer.userRating.toFixed(1)} out of 5 stars`}>
                                ★ {offer.userRating.toFixed(1)}
                            </span>
                        </p>
                        <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-sm text-slate-500">
                           <p>Price: <span className="font-mono text-slate-800">{offer.pricePerUnit.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} LCU</span></p>
                           <p>Trade Amount: <span className="font-mono text-slate-800">{offer.amountAvailable.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} {offer.currency}</span></p>
                        </div>
                    </div>
                    <div className="flex-shrink-0 md:hidden">
                        <button onClick={() => onTrade(offer)} className={`${actionButtonClass} text-white px-4 py-2 rounded-md text-sm font-semibold transition-colors`}>
                            {actionText}
                        </button>
                    </div>
                </div>
                <div className="mt-3 border-t border-slate-200 pt-3">
                    <p className="text-xs text-slate-400 mb-1">Payment Methods</p>
                    <div className="flex flex-wrap gap-2">
                        {offer.paymentMethods.map(method => (
                            <span key={method} className="text-xs bg-slate-200 text-slate-700 px-2 py-1 rounded">
                                {method}
                            </span>
                        ))}
                    </div>
                </div>
            </div>
             <div className="flex-shrink-0 hidden md:block">
                <button onClick={() => onTrade(offer)} className={`${actionButtonClass} text-white px-4 py-2 rounded-md font-semibold transition-colors`}>
                    {actionText}
                </button>
            </div>
        </Card>
    );
};

export default P2POfferCard;