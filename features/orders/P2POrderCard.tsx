import React from 'react';
import { P2POrder } from '../../types';
import Card from '../../components/Card';
import { ICONS } from '../../constants';

interface P2POrderCardProps {
  order: P2POrder;
}

const P2POrderCard: React.FC<P2POrderCardProps> = ({ order }) => {
    // Note: The perspective is from the user who initiated the trade.
    // A 'BUY' offer means the user was buying the asset (e.g. USD).
    const isBuy = order.offer.type === 'BUY';
    const actionText = isBuy ? 'Bought' : 'Sold';
    const colorClass = isBuy ? 'text-green-600' : 'text-red-600';
    
    return (
        <Card className="border-slate-200">
            <div className="p-4 flex flex-col sm:flex-row items-start sm:items-center gap-4">
                <div className="flex-shrink-0">
                    <div className={`p-3 rounded-full bg-slate-100 ${colorClass}`}>
                        {isBuy ? ICONS.add : ICONS.arrowRight}
                    </div>
                </div>

                <div className="flex-grow grid grid-cols-2 sm:grid-cols-4 gap-4 items-center w-full">
                    <div>
                        <p className={`font-bold text-lg ${colorClass}`}>{actionText} {order.offer.currency}</p>
                        <p className="text-xs text-slate-500">{new Date(order.timestamp).toLocaleString()}</p>
                    </div>

                    <div>
                        <p className="text-sm text-slate-500">Amount</p>
                        <p className="font-mono font-semibold text-slate-800">{order.tradeAmount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} {order.offer.currency}</p>
                    </div>

                    <div>
                        <p className="text-sm text-slate-500">Total Price</p>
                        <p className="font-mono font-semibold text-slate-800">{order.totalPrice.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} {order.localCurrency}</p>
                    </div>

                    <div>
                        <p className="text-sm text-slate-500">Counterparty</p>
                        <p className="font-semibold text-slate-800">{order.offer.userName}</p>
                    </div>
                </div>
            </div>
        </Card>
    );
};

export default P2POrderCard;