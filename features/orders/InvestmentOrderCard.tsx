import React from 'react';
import { InvestmentOrder } from '../../types';
import Card from '../../components/Card';
import { ICONS } from '../../constants';

interface InvestmentOrderCardProps {
  order: InvestmentOrder;
}

const InvestmentOrderCard: React.FC<InvestmentOrderCardProps> = ({ order }) => {
    const isBuy = order.orderType === 'BUY';
    const actionText = isBuy ? 'Bought' : 'Sold';
    const colorClass = isBuy ? 'text-green-600' : 'text-red-600';
    const icon = ICONS.investment;
    
    return (
        <Card className="border-slate-200">
            <div className="p-4 flex flex-col sm:flex-row items-start sm:items-center gap-4">
                <div className="flex-shrink-0">
                    <div className={`p-3 rounded-full bg-slate-100 ${colorClass}`}>
                        {icon}
                    </div>
                </div>

                <div className="flex-grow grid grid-cols-2 sm:grid-cols-4 gap-4 items-center w-full">
                    <div>
                        <p className={`font-bold text-lg ${colorClass}`}>{actionText} {order.asset.symbol}</p>
                        <p className="text-xs text-slate-500">{new Date(order.timestamp).toLocaleString()}</p>
                    </div>

                    <div>
                        <p className="text-sm text-slate-500">Amount</p>
                        <p className="font-mono font-semibold text-slate-800">{order.amountAsset.toFixed(8)}</p>
                    </div>

                    <div>
                        <p className="text-sm text-slate-500">Value</p>
                        <p className="font-mono font-semibold text-slate-800">${order.amountUSD.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                    </div>

                    <div>
                        <p className="text-sm text-slate-500">Price per Unit</p>
                        <p className="font-mono font-semibold text-slate-800">${order.pricePerUnit.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                    </div>
                </div>
            </div>
        </Card>
    );
};

export default InvestmentOrderCard;