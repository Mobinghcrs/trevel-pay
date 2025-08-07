
import React, { useState, useEffect, useCallback } from 'react';
import { Tour, TourBookingStep, TourBookingOrder } from '../../types';
import { searchTours } from '../../services/apiService';
import Spinner from '../../components/Spinner';
import TourCard from './TourCard';
import TourDetailPage from './TourDetailPage';
import TourConfirmationPage from './TourConfirmationPage';
import TourSuccessPage from './TourSuccessPage';
import { ICONS } from '../../constants';

const ToursPage: React.FC = () => {
    // Flow control state
    const [step, setStep] = useState<TourBookingStep>('list');
    const [selectedTour, setSelectedTour] = useState<Tour | null>(null);
    const [bookingDetails, setBookingDetails] = useState<{ date: string, guests: number } | null>(null);
    const [finalOrder, setFinalOrder] = useState<TourBookingOrder | null>(null);

    // Data state
    const [tours, setTours] = useState<Tour[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchTours = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            // Dummy parameters for now, as the backend returns all tours
            const results = await searchTours('', '');
            setTours(results);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to load tours.');
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        if (step === 'list') {
            fetchTours();
        }
    }, [step, fetchTours]);
    
    const handleSelectTour = (tour: Tour) => {
        setSelectedTour(tour);
        setStep('details');
    };

    const handleBookNow = (date: string, guests: number) => {
        setBookingDetails({ date, guests });
        setStep('confirmation');
    };

    const handleBookingComplete = (order: TourBookingOrder) => {
        setFinalOrder(order);
        setStep('success');
    };

    const handleBack = () => {
        if (step === 'details') setStep('list');
        if (step === 'confirmation') setStep('details');
    };

    const resetFlow = () => {
        setStep('list');
        setSelectedTour(null);
        setBookingDetails(null);
        setFinalOrder(null);
    };

    const renderContent = () => {
        if (isLoading && step === 'list') return <Spinner message="Discovering amazing tours..." />;
        if (error) return <p className="text-center text-red-500">{error}</p>;

        switch(step) {
            case 'details':
                return selectedTour && <TourDetailPage tour={selectedTour} onBookNow={handleBookNow} onBack={handleBack} />;
            case 'confirmation':
                return selectedTour && bookingDetails && <TourConfirmationPage tour={selectedTour} bookingDetails={bookingDetails} onBookingComplete={handleBookingComplete} onBack={handleBack} />;
            case 'success':
                return finalOrder && <TourSuccessPage order={finalOrder} onNewBooking={resetFlow} />;
            case 'list':
            default:
                return (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {tours.map(tour => <TourCard key={tour.id} tour={tour} onSelect={() => handleSelectTour(tour)} />)}
                    </div>
                );
        }
    };

    return (
        <div>
            <div className="text-center mb-8">
                <div className="w-24 h-24 bg-teal-100 text-teal-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  {ICONS.tourism}
                </div>
                <h1 className="text-3xl font-bold text-slate-900">Tours & Activities</h1>
                <p className="text-slate-600 mt-1">Book unforgettable experiences around the world.</p>
            </div>

            {renderContent()}
        </div>
    );
};

export default ToursPage;