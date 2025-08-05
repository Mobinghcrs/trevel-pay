import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import { PaymentRequest } from '../../../types';
import { ICONS } from '../../../constants';

interface PaymentRequestModalProps {
    request: PaymentRequest;
    onConfirm: () => Promise<void>;
    onCancel: () => void;
}

type Status = 'idle' | 'processing' | 'success';

const PaymentRequestModal: React.FC<PaymentRequestModalProps> = ({ request, onConfirm, onCancel }) => {
    const [status, setStatus] = useState<Status>('idle');

    const handleConfirm = async () => {
        setStatus('processing');
        try {
            // In a real app, this would trigger biometric/PIN prompt
            // For this concept, we simulate a delay
            await new Promise(res => setTimeout(res, 1500)); 
            await onConfirm();
            setStatus('success');
        } catch (e) {
            // The parent component handles the error alert
            setStatus('idle');
        }
    };

    const renderContent = () => {
        if (status === 'processing') {
            return (
                <div className="flex flex-col items-center justify-center h-40">
                    <div className="w-10 h-10 rounded-full animate-spin border-4 border-dashed border-teal-500 border-t-transparent"></div>
                    <p className="text-slate-600 mt-4">Processing...</p>
                </div>
            )
        }
        
        return (
             <div className="space-y-4">
                <div className="text-center">
                    <p className="text-sm text-slate-500">You are paying</p>
                    <div className="flex items-center justify-center gap-3 my-2">
                        <img src={request.merchantLogoUrl} alt={request.merchantName} className="w-10 h-10 rounded-full bg-slate-200" />
                        <p className="text-xl font-bold text-slate-800">{request.merchantName}</p>
                    </div>
                    <p className="text-4xl font-bold text-slate-900">${request.amount.toFixed(2)}</p>
                    <p className="text-sm text-slate-500">{request.currency}</p>
                </div>
                <div className="flex justify-between gap-4 pt-4">
                    <button onClick={onCancel} className="w-full bg-slate-200 text-slate-800 py-3 rounded-md font-semibold hover:bg-slate-300">
                        Cancel
                    </button>
                    <button onClick={handleConfirm} className="w-full bg-teal-600 text-white py-3 rounded-md font-semibold hover:bg-teal-700 flex items-center justify-center gap-2">
                        {ICONS.shieldCheck}
                        <span>Confirm Payment</span>
                    </button>
                </div>
            </div>
        )
    }

    return ReactDOM.createPortal(
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center z-[100] p-4">
            <div className="bg-white border border-slate-200 rounded-xl shadow-2xl w-full max-w-sm m-4 transform transition-all">
                <div className="p-6">
                    {renderContent()}
                </div>
            </div>
        </div>,
        document.body
    );
};

export default PaymentRequestModal;
