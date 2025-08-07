import React, { useState } from 'react';
import { BankTransferOrder } from '../../types';
import Card from '../../components/Card';
import { ICONS } from '../../constants';
import Modal from '../../components/Modal';

interface BankTransferOrderCardProps {
  order: BankTransferOrder;
}

const statusText: { [key in BankTransferOrder['status']]: string } = {
  Processing: 'Processing',
  Completed: 'Completed',
  Failed: 'Failed',
};

const StatusBadge: React.FC<{ status: BankTransferOrder['status'] }> = ({ status }) => {
    const colorClasses = {
        Processing: "bg-amber-100 text-amber-800",
        Completed: "bg-green-100 text-green-800",
        Failed: "bg-red-100 text-red-800",
    };
    return <span className={`px-2 py-1 text-xs font-semibold rounded-full ${colorClasses[status]}`}>{statusText[status]}</span>;
}

const BankTransferOrderCard: React.FC<BankTransferOrderCardProps> = ({ order }) => {
    const [isReceiptOpen, setIsReceiptOpen] = useState(false);

    return (
        <>
            <Card className="border-slate-200">
                <div className="p-4 flex flex-col sm:flex-row items-start sm:items-center gap-4">
                    <div className="flex-shrink-0">
                        <div className="p-3 rounded-full bg-slate-100 text-teal-600">
                            {ICONS.exchangeBankTransfer}
                        </div>
                    </div>

                    <div className="flex-grow grid grid-cols-2 sm:grid-cols-4 gap-4 items-center w-full">
                        <div>
                            <p className="font-bold text-lg text-slate-800">Bank Transfer</p>
                            <p className="text-xs text-slate-500">{new Date(order.timestamp).toLocaleString()}</p>
                        </div>

                        <div>
                            <p className="text-sm text-slate-500">Sent</p>
                            <p className="font-mono font-semibold text-red-600">- {order.fromAmount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} {order.fromCurrency}</p>
                        </div>

                        <div>
                            <p className="text-sm text-slate-500">Received</p>
                            <p className="font-mono font-semibold text-green-600">+ {order.toAmount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} {order.toCurrency}</p>
                        </div>
                        
                        <div className="flex items-center justify-between sm:justify-start gap-4 col-span-2 sm:col-span-1">
                            <StatusBadge status={order.status} />
                             <button onClick={() => setIsReceiptOpen(true)} className="text-sm font-semibold text-teal-600 hover:text-teal-500">
                                View Receipt
                            </button>
                        </div>
                    </div>
                </div>
            </Card>

            <Modal isOpen={isReceiptOpen} onClose={() => setIsReceiptOpen(false)} title="Bank Transfer Receipt">
                <div className="space-y-4 text-slate-800">
                     <div className="text-center">
                        <p className="text-sm text-slate-500">Transaction ID</p>
                        <p className="font-mono text-xs">{order.id}</p>
                    </div>
                    <div className="bg-slate-100 p-4 rounded-lg space-y-3">
                        <h3 className="font-bold">Transaction Details</h3>
                         <div className="flex justify-between"><span className="text-slate-600">Date:</span> <span>{new Date(order.timestamp).toLocaleString()}</span></div>
                         <div className="flex justify-between"><span className="text-slate-600">Status:</span> <StatusBadge status={order.status} /></div>
                    </div>
                     <div className="bg-slate-100 p-4 rounded-lg space-y-3">
                        <h3 className="font-bold">Amounts</h3>
                        <div className="flex justify-between"><span className="text-slate-600">You Sent:</span> <span className="font-mono font-semibold">{order.fromAmount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} {order.fromCurrency}</span></div>
                        <div className="flex justify-between"><span className="text-slate-600">Recipient Received:</span> <span className="font-mono font-semibold">{order.toAmount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} {order.toCurrency}</span></div>
                    </div>
                    <div className="bg-slate-100 p-4 rounded-lg space-y-3">
                         <h3 className="font-bold">Recipient</h3>
                        <div className="flex justify-between"><span className="text-slate-600">Name:</span> <span>{order.recipient.fullName}</span></div>
                        <div className="flex justify-between"><span className="text-slate-600">Account No:</span> <span className="font-mono">{order.recipient.accountNumber}</span></div>
                        <div className="flex justify-between"><span className="text-slate-600">Bank:</span> <span>{order.recipient.bankName}</span></div>
                    </div>
                     <button onClick={() => setIsReceiptOpen(false)} className="w-full mt-4 bg-slate-200 text-slate-800 px-4 py-2 rounded-md font-semibold hover:bg-slate-300 transition-colors">
                        Close
                    </button>
                </div>
            </Modal>
        </>
    );
};

export default BankTransferOrderCard;