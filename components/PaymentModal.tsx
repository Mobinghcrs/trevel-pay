import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';

type PaymentStatus = 'idle' | 'processing' | 'success' | 'error';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  amount: number;
  onSuccess: () => Promise<void>;
}

const PaymentModal: React.FC<PaymentModalProps> = ({ isOpen, onClose, amount, onSuccess }) => {
  const [status, setStatus] = useState<PaymentStatus>('idle');

  // Reset status when modal is reopened
  useEffect(() => {
    if (isOpen) {
      setStatus('idle');
    }
  }, [isOpen]);

  const handlePayment = async () => {
    setStatus('processing');
    try {
      // Simulate network delay for payment
      await new Promise(resolve => setTimeout(resolve, 1500));
      // Call the actual booking/order creation function
      await onSuccess();
      setStatus('success');
      // Close modal after a short delay to show success message
      setTimeout(() => {
        onClose();
      }, 1000);
    } catch (err) {
      console.error("Payment/Booking failed:", err);
      setStatus('error');
    }
  };

  if (!isOpen) return null;
  
  const renderContent = () => {
    switch (status) {
        case 'processing':
            return (
                <div className="flex flex-col items-center justify-center h-48">
                    <div className="w-12 h-12 rounded-full animate-spin border-4 border-dashed border-teal-500 border-t-transparent"></div>
                    <p className="text-slate-600 mt-4">Processing payment...</p>
                </div>
            );
        case 'success':
            return (
                <div className="flex flex-col items-center justify-center h-48">
                    <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center">
                        <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                    </div>
                    <p className="text-slate-800 font-semibold mt-4">Payment Successful!</p>
                </div>
            );
        case 'error':
            return (
                 <div className="space-y-4 text-center">
                    <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mx-auto">
                        <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                    </div>
                    <h3 className="text-lg font-bold text-slate-800">Payment Failed</h3>
                    <p className="text-slate-600 text-sm">There was an issue processing your payment. Please try again.</p>
                     <div className="pt-2">
                        <button onClick={onClose} className="w-full bg-slate-200 text-slate-800 px-4 py-2 rounded-md font-semibold hover:bg-slate-300">
                            Close
                        </button>
                    </div>
                </div>
            );
        case 'idle':
        default:
            return (
                <div className="space-y-4">
                    <p className="text-center text-slate-600">You are about to pay:</p>
                    <p className="text-center text-4xl font-bold text-slate-900">${amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                    <div className="pt-4">
                        <button onClick={handlePayment} className="w-full bg-teal-600 text-white px-4 py-3 rounded-md font-semibold hover:bg-teal-500 transition-all duration-200">
                            Pay Now
                        </button>
                    </div>
                </div>
            );
    }
  }

  return ReactDOM.createPortal(
    <div
      className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center z-[100]"
      onClick={onClose}
      aria-modal="true"
      role="dialog"
    >
      <div
        className="bg-white border border-slate-200 rounded-xl shadow-2xl w-full max-w-sm m-4 transform transition-all"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center p-4 border-b border-slate-200">
          <h2 className="text-lg font-bold text-slate-900">Confirm Payment</h2>
          <button
            onClick={onClose}
            className="text-slate-500 hover:text-slate-800 transition-colors p-1 rounded-full hover:bg-slate-100"
            aria-label="Close dialog"
            disabled={status === 'processing' || status === 'success'}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="p-6">
            {renderContent()}
        </div>
      </div>
    </div>,
    document.body
  );
};

export default PaymentModal;