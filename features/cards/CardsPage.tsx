import React, { useState, useEffect, useCallback } from 'react';
import { VirtualCard } from '../../types';
import { getVirtualCards } from '../../services/apiService';
import Spinner from '../../components/Spinner';
import Card from '../../components/Card';
import { ICONS } from '../../constants';
import VirtualCardDisplay from './VirtualCardDisplay';
import CreateCardModal from './CreateCardModal';

const CardsPage: React.FC = () => {
    const [cards, setCards] = useState<VirtualCard[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    
    const fetchCards = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            const data = await getVirtualCards();
            setCards(data);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to load cards.");
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchCards();
    }, [fetchCards]);

    const handleCardCreated = () => {
        fetchCards();
        setIsCreateModalOpen(false);
    };

    const handleCardUpdated = () => {
        fetchCards();
    };

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

                {!isLoading && cards.length > 0 && (
                    <div className="space-y-6">
                        {cards.map(card => (
                            <VirtualCardDisplay key={card.id} card={card} onUpdate={handleCardUpdated} />
                        ))}
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