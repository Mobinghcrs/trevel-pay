import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { VirtualCard, UserProfile } from '../../types';
import { getVirtualCards, getUserProfile } from '../../services/apiService';
import Spinner from '../../components/Spinner';
import Card from '../../components/Card';
import { ICONS } from '../../constants';
import VirtualCardDisplay from './VirtualCardDisplay';
import CreateCardModal from './CreateCardModal';

const CardsPage: React.FC = () => {
    const [cards, setCards] = useState<VirtualCard[]>([]);
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    
    const fetchData = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            const [cardData, profileData] = await Promise.all([
                getVirtualCards(),
                getUserProfile()
            ]);
            setCards(cardData);
            setProfile(profileData);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to load card data.");
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const handleCardCreated = () => {
        fetchData();
        setIsCreateModalOpen(false);
    };

    const handleCardUpdated = () => {
        fetchData();
    };

    const { physicalCards, digitalCards } = useMemo(() => {
        if (!profile) return { physicalCards: [], digitalCards: [] };
        
        const walletTypeMap = new Map(profile.wallets.map(w => [w.currency, w.type]));
        
        const physical = cards.filter(c => walletTypeMap.get(c.walletCurrency) === 'Fiat');
        const digital = cards.filter(c => walletTypeMap.get(c.walletCurrency) === 'Crypto');

        return { physicalCards: physical, digitalCards: digital };
    }, [cards, profile]);

    return (
        <>
            <div>
                <div className="flex flex-col md:flex-row justify-between md:items-center mb-8 gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">My Cards</h1>
                        <p className="text-gray-600 mt-1">Manage your TRAVEL PAY virtual cards.</p>
                    </div>
                    <button 
                        onClick={() => setIsCreateModalOpen(true)}
                        className="flex items-center justify-center gap-2 bg-teal-600 text-white px-4 py-2 rounded-md font-semibold hover:bg-teal-700 transition-colors self-start md:self-center"
                    >
                        <span className="h-5 w-5">{ICONS.add}</span>
                        <span>Create Card</span>
                    </button>
                </div>

                {isLoading && <Spinner message="Loading your cards..." />}
                {error && <div className="text-center text-red-600 bg-red-100 p-4 rounded-md">{error}</div>}

                {!isLoading && !error && cards.length === 0 && (
                     <Card className="p-12 text-center border-2 border-dashed border-gray-300 bg-gray-50">
                        <h2 className="text-xl font-bold text-gray-800">No Cards Found</h2>
                        <p className="text-gray-500 mt-2">Click "Create Card" to get started.</p>
                    </Card>
                )}
                
                 {!isLoading && !error && cards.length > 0 && (
                    <div className="space-y-10">
                        {/* Physical Currency Cards */}
                        <div>
                            <h2 className="text-xl font-bold text-slate-800 mb-4">Physical Currency Cards</h2>
                            {physicalCards.length > 0 ? (
                                <div className="space-y-6">
                                    {physicalCards.map(card => (
                                        <VirtualCardDisplay key={card.id} card={card} onUpdate={handleCardUpdated} />
                                    ))}
                                </div>
                            ) : (
                                <p className="text-slate-500">No cards linked to physical currencies (e.g., USD, EUR).</p>
                            )}
                        </div>

                        {/* Digital Currency Cards */}
                        <div>
                            <h2 className="text-xl font-bold text-slate-800 mb-4">Digital Currency Cards</h2>
                             {digitalCards.length > 0 ? (
                                <div className="space-y-6">
                                    {digitalCards.map(card => (
                                        <VirtualCardDisplay key={card.id} card={card} onUpdate={handleCardUpdated} />
                                    ))}
                                </div>
                            ) : (
                                <p className="text-slate-500">No cards linked to digital currencies (e.g., BTC, ETH).</p>
                            )}
                        </div>
                    </div>
                )}
            </div>
            
            <CreateCardModal
                isOpen={isCreateModalOpen}
                onClose={() => setIsCreateModalOpen(false)}
                onSuccess={handleCardCreated}
            />
        </>
    );
};

export default CardsPage;