import React from 'react';
import { TopUpOrder } from '../../types';
import Card from '../../components/Card';
import { ICONS } from '../../constants';

interface ChargeOrderCardProps {
  order: TopUpOrder;
}

const ChargeOrderCard: React.FC<ChargeOrderCardProps> = ({ order }) => {
    return (
        <Card className="border-slate-200 p-0 overflow-hidden">
            <div className="p-4 flex flex-col sm:flex-row items-start sm:items-center gap-4">
                <div className="flex-shrink-0">
                    <div className={`p-3 rounded-full bg-slate-100 text-teal-600`}>
                        {ICONS.charge}
                    </div>
                </div>

                <div className="flex-grow grid grid-cols-2 sm:grid-cols-4 gap-4 items-center w-full">
                    <div>
                        <p className={`font-bold text-lg text-slate-800`}>Mobile Top-up</p>
                        <p className="text-xs text-slate-500">{new Date(order.timestamp).toLocaleString()}</p>
                    </div>

                    <div>
                        <p className="text-sm text-slate-500">Operator</p>
                        <p className="font-semibold text-slate-800">{order.operator}</p>
                    </div>

                    <div>
                        <p className="text-sm text-slate-500">Number</p>
                        <p className="font-mono font-semibold text-slate-800">{order.mobileNumber}</p>
                    </div>

                    <div>
                        <p className="text-sm text-slate-500">Amount</p>
                        <p className="font-mono font-semibold text-slate-800">{order.amount.toLocaleString('en-US')} IRR</p>
                    </div>
                </div>
            </div>
            {order.purchasedByAgentInfo && (
                <div className="px-4 py-1 bg-slate-100 text-xs text-slate-600 border-t text-center sm:text-left">
                    Purchased via Agent: <strong>{order.purchasedByAgentInfo.agentName}</strong>
                </div>
            )}
        </Card>
    );
};

export default ChargeOrderCard;