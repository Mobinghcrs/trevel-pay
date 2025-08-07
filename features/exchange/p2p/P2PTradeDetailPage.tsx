import React, { useState, useMemo } from 'react';
import { P2POffer } from '../../../types';
import Card from '../../../components/Card';
import Modal from '../../../components/Modal';
import { createP2POrder } from '../../../services/apiService';

interface P2PTradeDetailPageProps {
  offer: P2POffer;
  onBack: () => void;
  onTradeComplete: () => void;
}

const P2PTradeDetailPage: React.FC<P2PTradeDetailPageProps> = ({ offer, onBack, onTradeComplete }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const isBuyOffer = offer.type === 'BUY'; // User is buying USD from someone selling it. User needs LCU, gets USD.

  const tradeActionText = isBuyOffer ? 'Buy' : 'Sell';
  const actionButtonClass = isBuyOffer ? 'bg-green-600 hover:bg-green-500' : 'bg-red-600 hover:bg-red-500';

  const total = offer.amountAvailable * offer.pricePerUnit;

  const handleTrade = () => {
      setIsModalOpen(true);
  };
  
  const handleConfirmTrade = async () => {
    try {
        await createP2POrder({
            offer: offer,
            tradeAmount: offer.amountAvailable,
            totalPrice: total,
            localCurrency: 'LCU',
        });
        
        setIsModalOpen(false);
        onTradeComplete();

    } catch (e) {
        if(e instanceof Error) {
            alert(`Trade Failed: ${e.message}`);
        } else {
            alert("An unknown error occurred during the trade.");
        }
        setIsModalOpen(false);
    }
  };


  return (
    <>
      <div className="max-w-2xl mx-auto">
        <div className="mb-6">
            <button onClick={onBack} className="text-teal-600 hover:text-teal-500 font-semibold transition-colors mb-4">
                &larr; Back to Offers
            </button>
            <h1 className="text-3xl font-bold text-slate-900">Initiate Trade</h1>
            <p className="text-slate-600 mt-1">You are about to trade with <span className="font-semibold text-slate-700">{offer.userName}</span>.</p>
        </div>

        <Card className='border-slate-200'>
            <div className="p-6 space-y-6">
                
                <div className="bg-slate-100 p-4 rounded-lg space-y-3">
                    <div className="flex justify-between items-center">
                        <span className="text-slate-600">Amount to {tradeActionText.toLowerCase()}</span>
                        <span className="font-mono text-slate-800 font-bold text-lg">{offer.amountAvailable.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} {offer.currency}</span>
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="text-slate-600">Price per {offer.currency}</span>
                        <span className="font-mono text-slate-800">{offer.pricePerUnit.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} LCU</span>
                    </div>
                    <div className="flex justify-between items-center text-lg border-t border-slate-200 pt-3">
                        <span className="font-semibold text-slate-700">Total to pay</span>
                        <span className="font-mono font-bold text-teal-600">{total.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} LCU</span>
                    </div>
                </div>

                <div className="border-t border-slate-200 pt-4">
                    <h3 className="font-semibold text-slate-800 mb-2">Seller's Receiving Preference</h3>
                    <div className="bg-slate-50 border border-slate-200 rounded-lg p-3">
                        {offer.payoutDetails.type === 'wallet' ? (
                            <div>
                                <p className="font-semibold text-slate-800">Receive in App Wallet</p>
                                <p className="text-sm text-slate-600">Seller will receive funds in their <span className="font-mono">{offer.payoutDetails.currency}</span> wallet.</p>
                            </div>
                        ) : (
                            <div>
                                <p className="font-semibold text-slate-800">Receive in Bank Account</p>
                                <ul className="text-sm text-slate-600 mt-1 space-y-0.5">
                                    <li><strong>Name:</strong> {offer.payoutDetails.recipient.fullName}</li>
                                    <li><strong>Bank:</strong> {offer.payoutDetails.recipient.bankName}</li>
                                    <li><strong>Account:</strong> <span className="font-mono">{offer.payoutDetails.recipient.accountNumber}</span></li>
                                </ul>
                            </div>
                        )}
                    </div>
                </div>

                <div className="border-t border-slate-200 pt-4">
                    <p className="text-sm text-slate-500 mb-2">Your available payment methods</p>
                     <div className="flex flex-wrap gap-2">
                        {offer.paymentMethods.map(method => (
                            <span key={method} className="text-sm bg-slate-200 text-slate-700 px-3 py-1 rounded-md">
                                {method}
                            </span>
                        ))}
                    </div>
                </div>

                <button onClick={handleTrade} className={`w-full text-white px-4 py-3 rounded-md font-semibold transition-all duration-200 ${actionButtonClass}`}>
                    {tradeActionText} {offer.currency}
                </button>
            </div>
        </Card>
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Confirm Transaction">
          <div className="space-y-4 text-slate-800">
              <p className="text-slate-600">Please review the details of your transaction before confirming.</p>
              <div className="bg-slate-100 p-4 rounded-lg space-y-2">
                  <div className="flex justify-between"><span className="text-slate-600">Action:</span> <span className="font-semibold text-slate-800">{tradeActionText} {offer.currency}</span></div>
                  <div className="flex justify-between"><span className="text-slate-600">Amount:</span> <span className="font-mono font-semibold text-slate-800">{offer.amountAvailable.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} {offer.currency}</span></div>
                  <div className="flex justify-between"><span className="text-slate-600">Total Price:</span> <span className="font-mono font-semibold text-slate-800">{total.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} LCU</span></div>
              </div>
              <div className="flex justify-end gap-4 pt-4">
                  <button onClick={() => setIsModalOpen(false)} className="bg-slate-200 text-slate-800 px-4 py-2 rounded-md font-semibold hover:bg-slate-300 transition-colors">
                      Cancel
                  </button>
                  <button onClick={handleConfirmTrade} className={`${actionButtonClass} text-white px-4 py-2 rounded-md font-semibold transition-colors`}>
                      Confirm & Transfer
                  </button>
              </div>
          </div>
      </Modal>
    </>
  );
};

export default P2PTradeDetailPage;