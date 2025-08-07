import React, { useState, useEffect } from 'react';
import { GiftCard } from '../../types';
import { getGiftCardListings, createGiftCardOrder } from '../../services/apiService';
import { useNavigation } from '../../contexts/NavigationContext';
import Card from '../../components/Card';
import Spinner from '../../components/Spinner';
import { ICONS } from '../../constants';
import GiftCardListingCard from './components/GiftCardListingCard';
import SellGiftCardForm from './components/SellGiftCardForm';
import Modal from '../../components/Modal';
import PaymentModal from '../../components/PaymentModal';

type GiftCardTab = 'buy' | 'sell';

const GiftCardsPage: React.FC = () => {
    const [activeTab, setActiveTab] = useState<GiftCardTab>('buy');
    const [listings, setListings] = useState<GiftCard[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Purchase flow state
    const [selectedCard, setSelectedCard] = useState<GiftCard | null>(null);
    const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
    const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
    const [paymentWasSuccessful, setPaymentWasSuccessful] = useState(false);

    const { navigate } = useNavigation();

    const fetchListings = async () => {
        setIsLoading(true);
        try {
            const data = await getGiftCardListings();
            setListings(data);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to load gift cards.');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (activeTab === 'buy') {
            fetchListings();
        }
    }, [activeTab]);

    const handleBuyClick = (card: GiftCard) => {
        setSelectedCard(card);
        setIsConfirmModalOpen(true);
    };

    const handleConfirmPurchase = () => {
        setIsConfirmModalOpen(false);
        setIsPaymentModalOpen(true);
    };
    
    const handlePaymentSuccess = async () => {
        if (!selectedCard) return;
        try {
            await createGiftCardOrder(selectedCard.id);
            setPaymentWasSuccessful(true);
        } catch (e) {
            throw e; // Re-throw to be caught by payment modal
        }
    };
    
    const handleModalClose = () => {
        setIsPaymentModalOpen(false);
        if (paymentWasSuccessful) {
            alert('Gift card purchased successfully!');
            navigate('orders');
        }
    };

    return (
        <>
            <div className="max-w-4xl mx-auto">
                <div className="text-center mb-8">
                     <div className="w-24 h-24 bg-teal-100 text-teal-600 rounded-full flex items-center justify-center mx-auto mb-4">
                        {ICONS.giftCard}
                    </div>
                    <h1 className="text-3xl font-bold text-slate-900">Gift Card Marketplace</h1>
                    <p className="text-slate-600 mt-1">Buy discounted gift cards or sell your own for cash.</p>
                </div>

                <div className="flex justify-center border-b border-slate-200 mb-8">
                    <button onClick={() => setActiveTab('buy')} className={`px-6 py-3 font-semibold ${activeTab === 'buy' ? 'text-teal-600 border-b-2 border-teal-600' : 'text-slate-500'}`}>Buy</button>
                    <button onClick={() => setActiveTab('sell')} className={`px-6 py-3 font-semibold ${activeTab === 'sell' ? 'text-teal-600 border-b-2 border-teal-600' : 'text-slate-500'}`}>Sell</button>
                </div>

                {activeTab === 'buy' ? (
                    isLoading ? <Spinner message="Loading gift cards..." /> :
                    error ? <p className="text-center text-red-500">{error}</p> :
                    listings.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {listings.map(card => <GiftCardListingCard key={card.id} giftCard={card} onBuy={handleBuyClick} />)}
                        </div>
                    ) : <p className="text-center text-slate-500 py-8">No gift cards are for sale right now.</p>
                ) : (
                    <SellGiftCardForm />
                )}
            </div>

            {selectedCard && (
                 <Modal isOpen={isConfirmModalOpen} onClose={() => setIsConfirmModalOpen(false)} title="Confirm Purchase">
                     <div className="space-y-4">
                        <p className="text-slate-600">You are about to purchase the following gift card:</p>
                        <div className="bg-slate-100 p-4 rounded-lg space-y-2">
                             <div className="flex justify-between"><span className="text-slate-600">Brand:</span> <span className="font-semibold">{selectedCard.brand}</span></div>
                             <div className="flex justify-between"><span className="text-slate-600">Card Value:</span> <span className="font-mono">${selectedCard.balance.toFixed(2)}</span></div>
                             <div className="flex justify-between font-bold text-lg"><span className="text-slate-800">Your Price:</span> <span className="font-mono text-teal-600">${selectedCard.price.toFixed(2)}</span></div>
                        </div>
                        <div className="flex justify-end gap-4 pt-4">
                            <button onClick={() => setIsConfirmModalOpen(false)} className="bg-slate-200 text-slate-800 px-4 py-2 rounded-md font-semibold">Cancel</button>
                            <button onClick={handleConfirmPurchase} className="bg-teal-600 text-white px-4 py-2 rounded-md font-semibold">Proceed to Pay</button>
                        </div>
                     </div>
                 </Modal>
            )}

            {selectedCard && (
                <PaymentModal
                    isOpen={isPaymentModalOpen}
                    onClose={handleModalClose}
                    amount={selectedCard.price}
                    onSuccess={handlePaymentSuccess}
                />
            )}
        </>
    );
};

export default GiftCardsPage;