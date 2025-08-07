
import React from 'react';
import { TaxiOrder } from '../../types';
import Card from '../../components/Card';
import { ICONS } from '../../constants';

interface TaxiOrderCardProps {
  order: TaxiOrder;
}

const TaxiOrderCard: React.FC<TaxiOrderCardProps> = ({ order }) => {
    return (
        <Card className="border-slate-200">
            <div className="p-4 flex flex-col sm:flex-row items-start sm:items-center gap-4">
                <div className="flex-shrink-0">
                    <div className="p-3 rounded-full bg-slate-100 text-teal-600">
                        {ICONS.taxi}
                    </div>
                </div>

                <div className="flex-grow grid grid-cols-2 sm:grid-cols-4 gap-4 items-center w-full">
                    <div>
                        <p className="font-bold text-lg text-slate-800">Taxi Ride</p>
                        <p className="text-xs text-slate-500">{new Date(order.timestamp).toLocaleString()}</p>
                    </div>

                    <div>
                        <p className="text-sm text-slate-500">Route</p>
                        <p className="font-semibold text-slate-800 truncate">{order.from} &rarr; {order.to}</p>
                    </div>

                    <div>
                        <p className="text-sm text-slate-500">Provider</p>
                        <p className="font-semibold text-slate-800">{order.provider}</p>
                    </div>

                    <div>
                        <p className="text-sm text-slate-500">Price</p>
                        <p className="font-mono font-semibold text-slate-800">{order.price.toLocaleString('fa-IR')} IRR</p>
                    </div>
                </div>
            </div>
        </Card>
    );
};

export default TaxiOrderCard;
