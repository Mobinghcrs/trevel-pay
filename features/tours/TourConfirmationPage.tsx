import React, { useState } from 'react';
import { Tour, TourBookingOrder } from '../../types';
import { createTourBooking } from '../../services/apiService';
import Card from '../../components/Card';
import PaymentModal from '../../components/PaymentModal';

interface TourConfirmationPageProps {
  tour: Tour;
  bookingDetails: { date: string; guests: number };
  onBookingComplete: (order: TourBookingOrder) => void;
  onBack: () => void;
}

const TourConfirmationPage: React.FC<TourConfirmationPageProps> = ({ tour, bookingDetails, onBookingComplete, onBack }) => {
    const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
    
    const totalPrice = tour.pricePerPerson * bookingDetails.guests;
    const formatDate = (dateString: string) => new Date(dateString).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

    const handlePaymentSuccess = async () => {
        const newOrder = await createTourBooking(tour, bookingDetails.date, bookingDetails.guests, totalPrice);
        onBookingComplete(newOrder);
    };

    return (
        <>
            <div className="max-w-2xl mx-auto">
                <button onClick={onBack} className="text-sm text-teal-600 hover:underline mb-4 font-semibold">&larr; Back to Tour Details</button>
                <h1 className="text-3xl font-bold text-slate-900 text-center mb-6">Confirm Your Booking</h1>
                <Card className="p-6 border-slate-200">
                    <div className="flex items-center gap-4 pb-4 border-b border-slate-200">
                        <img src={tour.images[0]} alt={tour.name} className="w-24 h-24 object-cover rounded-lg" />
                        <div>
                            <h2 className="text-xl font-bold text-slate-800">{tour.name}</h2>
                            <p className="text-sm text-slate-500">{tour.destination}</p>
                        </div>
                    </div>
                    <div className="space-y-2 mt-4">
                        <div className="flex justify-between"><span className="text-slate-600">Date:</span><span className="font-semibold">{formatDate(bookingDetails.date)}</span></div>
                        <div className="flex justify-between"><span className="text-slate-600">Guests:</span><span className="font-semibold">{bookingDetails.guests}</span></div>
                        <div className="flex justify-between"><span className="text-slate-600">Price per Guest:</span><span className="font-mono">${tour.pricePerPerson.toFixed(2)}</span></div>
                        <div className="flex justify-between text-xl font-bold border-t pt-3 mt-3">
                            <span>Total Price:</span><span className="font-mono">${totalPrice.toFixed(2)}</span>
                        </div>
                    </div>
                    <button onClick={() => setIsPaymentModalOpen(true)} className="w-full mt-6 bg-green-600 text-white py-3 rounded-md font-semibold text-lg hover:bg-green-500">
                        Confirm & Pay
                    </button>
                </Card>
            </div>

            <PaymentModal
                isOpen={isPaymentModalOpen}
                onClose={() => setIsPaymentModalOpen(false)}
                amount={totalPrice}
                onSuccess={handlePaymentSuccess}
            />
        </>
    );
};

export default TourConfirmationPage;