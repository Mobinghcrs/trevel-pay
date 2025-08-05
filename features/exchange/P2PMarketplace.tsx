import React, { useState, useEffect, useCallback } from 'react';
import { P2POffer, P2PTradeStep, P2PCurrencyType } from '../../types';
import { getP2POffers } from '../../services/apiService';
import { useNavigation } from '../../contexts/NavigationContext';

import Card from '../../components/Card';
import Spinner from '../../components/Spinner';
import P2POfferCard from './p2p/P2POfferCard';
import P2PSelectionPage from './p2p/P2PSelectionPage';
import P2PTradeDetailPage from './p2p/P2PTradeDetailPage';

const P2PMarketplace: React.FC = () => {
    const [step, setStep] = useState<P2PTradeStep>('selection');
    const [currencyType, setCurrencyType] = useState<P2PCurrencyType | null>(null);
    const [selectedOffer, setSelectedOffer] = useState<P2POffer | null>(null);
    
    const [offers, setOffers] = useState<P2POffer[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    
    const { navigate } = useNavigation();

    const fetchData = useCallback(async () => {
        if (currencyType === null) return;
        setIsLoading(true);
        setError(null);
        try {
            // In a real app, currencyType would be passed to the API
            const offerData = await getP2POffers(); 
            setOffers(offerData);
        } catch (err) {
            console.error(err);
            setError(err instanceof Error ? err.message : 'An unknown error occurred.');
        } finally {
            setIsLoading(false);
        }
    }, [currencyType]);

    useEffect(() => {
        if (step === 'list') {
            fetchData();
        }
    }, [step, fetchData]);

    const handleSelectCurrencyType = (type: P2PCurrencyType) => {
        setCurrencyType(type);
        setStep('list');
    };

    const handleSelectTrade = (offer: P2POffer) => {
        setSelectedOffer(offer);
        setStep('trade');
    };

    const handleBackToList = () => {
        setSelectedOffer(null);
        setStep('list');
    };
    
    const handleBackToSelection = () => {
        setCurrencyType(null);
        setStep('selection');
    }
    
    const handleTradeComplete = () => {
        alert("Trade successful! Your order has been placed.");
        setStep('selection');
        setSelectedOffer(null);
        setCurrencyType(null);
        navigate('orders');
    }

    // Render logic based on the current step
    if (step === 'selection') {
        return <P2PSelectionPage onSelect={handleSelectCurrencyType} />;
    }

    if (step === 'trade' && selectedOffer) {
        return <P2PTradeDetailPage offer={selectedOffer} onBack={handleBackToList} onTradeComplete={handleTradeComplete} />;
    }

    // Default to the list view
    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <button onClick={handleBackToSelection} className="text-cyan-600 hover:text-cyan-500 font-semibold transition-colors">
                    &larr; Back to Type Selection
                </button>
                 <h2 className="text-xl font-bold text-slate-900 capitalize">{currencyType} Currency P2P Market</h2>
            </div>
            
            {isLoading && <Spinner message="Finding P2P offers..." />}
            {error && !offers.length && <div className="text-center text-red-600 bg-red-100 p-4 rounded-md">{error}</div>}
            
            {!isLoading && !error && (
                <Card className="p-4 mb-6 bg-slate-50 border-slate-200">
                    <p className="text-slate-600">
                        Showing {currencyType} P2P offers. Prices are against a fictional local currency (LCU).
                    </p>
                </Card>
            )}

            {!isLoading && offers.length > 0 && (
                 <div className="space-y-4">
                    {offers.map((offer) => <P2POfferCard key={offer.id} offer={offer} onTrade={handleSelectTrade} />)}
                </div>
            )}

            {!isLoading && offers.length === 0 && !error && (
                <Card className="p-8 text-center text-slate-500 bg-slate-50 border-slate-200">
                    No offers found for this category.
                </Card>
            )}
        </div>
    );
};

export default P2PMarketplace;
