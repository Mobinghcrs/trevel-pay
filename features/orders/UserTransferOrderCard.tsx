
import React from 'react';
import { UserTransferOrder } from '../../types';
import Card from '../../components/Card';
import { ICONS } from '../../constants';
import { getCurrentUser } from '../../services/currentUser';

interface UserTransferOrderCardProps {
  order: UserTransferOrder;
}

const UserTransferOrderCard: React.FC<UserTransferOrderCardProps> = ({ order }) => {
    const currentUser = getCurrentUser();
    const isSender = currentUser?.email === order.senderEmail;

    const actionText = isSender ? 'Sent to' : 'Received from';
    const otherPartyName = isSender ? order.receiverName : order.senderName;
    const amount = isSender ? -(order.amountSent) : order.amountReceived;
    const colorClass = isSender ? 'text-red-600' : 'text-green-600';
    const icon = isSender ? ICONS.arrowRight : ICONS.add;

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
                        <p className={`font-bold text-lg text-slate-800`}>User Transfer</p>
                        <p className="text-xs text-slate-500">{new Date(order.timestamp).toLocaleString()}</p>
                    </div>

                    <div>
                        <p className="text-sm text-slate-500">{actionText}</p>
                        <p className="font-semibold text-slate-800">{otherPartyName}</p>
                    </div>

                    <div>
                        <p className="text-sm text-slate-500">Amount</p>
                        <p className={`font-mono font-semibold ${colorClass}`}>{amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2, signDisplay: 'always' })} {order.currency}</p>
                    </div>
                    
                    {isSender && (
                         <div>
                            <p className="text-sm text-slate-500">Fee Paid</p>
                            <p className="font-mono font-semibold text-slate-600">{order.fee.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} {order.currency}</p>
                        </div>
                    )}
                </div>
            </div>
        </Card>
    );
};

export default UserTransferOrderCard;
