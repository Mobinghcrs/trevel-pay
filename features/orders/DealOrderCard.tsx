import React from 'react';
import { DealOrder } from '../../types';
import Card from '../../components/Card';
import { ICONS } from '../../constants';

interface DealOrderCardProps {
  order: DealOrder;
}

const DealOrderCard: React.FC<DealOrderCardProps> = ({ order }) => {
    return (
        <Card className="border-slate-200">
            <div className="p-4 flex flex-col sm:flex-row items-start sm:items-center gap-4">
                <div className="flex-shrink-0">
                    <div className="p-3 rounded-full bg-red-100 text-red-600">
                        {ICONS.fire}
                    </div>
                </div>

                <div className="flex-grow grid grid-cols-2 sm:grid-cols-4 gap-4 items-center w-full">
                    <div>
                        <p className="font-bold text-lg text-slate-800">Hot Deal Purchase</p>
                        <p className="text-xs text-slate-500">{new Date(order.timestamp).toLocaleString()}</p>
                    </div>

                    <div className="col-span-2">
                        <p className="text-sm text-slate-500">{order.deal.title}</p>
                        <p className="font-semibold text-slate-800 capitalize">{order.deal.category} Deal</p>
                    </div>
                    
                    <div>
                        <p className="text-sm text-slate-500">Price Paid</p>
                        <p className="font-mono font-semibold text-slate-800">${order.totalPrice.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                    </div>
                </div>
            </div>
        </Card>
    );
};

export default DealOrderCard;