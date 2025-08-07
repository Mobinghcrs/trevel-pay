import React, { useState, useEffect } from 'react';
import { Deal } from '../../types';
import { getDeals } from '../../services/apiService';
import Spinner from '../../components/Spinner';
import DealCard from './DealCard';

const DealsPage: React.FC = () => {
    const [deals, setDeals] = useState<Deal[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchDeals = async () => {
            setIsLoading(true);
            try {
                const data = await getDeals();
                setDeals(data);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Failed to load deals.');
            } finally {
                setIsLoading(false);
            }
        };
        fetchDeals();
    }, []);

    if (isLoading) {
        return <Spinner message="Finding the hottest deals..." />;
    }

    if (error) {
        return <div className="text-center text-red-500 bg-red-100 p-4 rounded-md">{error}</div>;
    }

    return (
        <div>
            <div className="text-center mb-8">
                <h1 className="text-3xl font-bold text-slate-900">Hot Deals</h1>
                <p className="text-slate-600 mt-1">Don't miss these amazing offers with 50% or more in savings!</p>
            </div>
            
            <div className="space-y-6">
                {deals.length > 0 ? (
                    deals.map(deal => <DealCard key={deal.id} deal={deal} />)
                ) : (
                    <p className="text-center text-slate-500 py-10">There are no special deals available right now.</p>
                )}
            </div>
        </div>
    );
};

export default DealsPage;
