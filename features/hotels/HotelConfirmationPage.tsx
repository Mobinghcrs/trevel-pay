

import React, { useState } from 'react';
import { Hotel, Room, HotelGuest, HotelBookingOrder } from '../../types';
import { createHotelBooking } from '../../services/apiService';
import Card from '../../components/Card';
import HotelBookingBreadcrumbs from './HotelBookingBreadcrumbs';
import PaymentModal from '../../components/PaymentModal';

interface HotelConfirmationPageProps {
  hotel: Hotel;
  room: Room;
  guests: HotelGuest[];
  checkIn: string;
  checkOut: string;
  onBookingComplete: (order: HotelBookingOrder) => void;
  onBack: () => void;
}

const HotelConfirmationPage: React.FC<HotelConfirmationPageProps> = ({ hotel, room, guests, checkIn, checkOut, onBookingComplete, onBack }) => {
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [paymentWasSuccessful, setPaymentWasSuccessful] = useState(false);
  const [finalOrder, setFinalOrder] = useState<HotelBookingOrder | null>(null);

  const nights = Math.ceil((new Date(checkOut).getTime() - new Date(checkIn).getTime()) / (1000 * 3600 * 24));
  const roomTotal = room.price * nights;
  const taxes = roomTotal * 0.15; // 15% tax/fee assumption
  const totalPrice = roomTotal + taxes;

  const formatDate = (dateString: string) => new Date(dateString).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

  const primaryGuest = guests[0];

  const handlePaymentSuccess = async () => {
    const newOrder = await createHotelBooking(hotel, room, guests, checkIn, checkOut, totalPrice);
    setFinalOrder(newOrder);
    setPaymentWasSuccessful(true);
  };

  const handleModalClose = () => {
    setIsPaymentModalOpen(false);
    if (paymentWasSuccessful && finalOrder) {
      onBookingComplete(finalOrder);
    }
  };

  return (
    <>
      <div>
        <HotelBookingBreadcrumbs currentStep="confirmation" />
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-slate-900">Confirm Your Booking</h1>
              <p className="text-slate-600 mt-1">Review the details below and proceed to payment.</p>
          </div>
          
          <div className="bg-white text-slate-800 rounded-xl shadow-2xl p-6 md:p-8">
              <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
                  {/* Left side: Hotel Info & Image */}
                  <div className="md:col-span-3">
                      <img src={hotel.imageUrl} alt={`Exterior of ${hotel.name}`} className="rounded-lg mb-4 w-full h-48 object-cover"/>
                      <h2 className="text-2xl font-bold text-slate-900">{hotel.name}</h2>
                      <p className="text-slate-500 mb-4">{hotel.description}</p>
                      
                      <div className="grid grid-cols-2 gap-4 text-center border-t border-b border-slate-200 py-4 my-4">
                          <div>
                              <p className="text-sm text-slate-500">Check-in</p>
                              <p className="font-bold text-slate-800">{formatDate(checkIn)}</p>
                          </div>
                          <div>
                              <p className="text-sm text-slate-500">Check-out</p>
                              <p className="font-bold text-slate-800">{formatDate(checkOut)}</p>
                          </div>
                      </div>

                      <h3 className="text-lg font-semibold text-slate-800">Guest Information</h3>
                      <div className="text-slate-600 mt-2">
                          <p><strong>Name:</strong> {primaryGuest.fullName}</p>
                          <p><strong>Email:</strong> {primaryGuest.email}</p>
                          {primaryGuest.phone && <p><strong>Phone:</strong> {primaryGuest.phone}</p>}
                      </div>
                  </div>

                  {/* Right side: Price Summary */}
                  <div className="md:col-span-2">
                      <Card className="bg-slate-50 border-slate-200">
                          <div className="p-4">
                              <h3 className="text-lg font-bold text-slate-800 mb-4 border-b border-slate-200 pb-2">Price Summary</h3>
                              <div className="space-y-2 text-slate-600">
                                  <div className="flex justify-between">
                                      <span>{room.name} ({nights} {nights > 1 ? 'nights' : 'night'})</span>
                                      <span>${roomTotal.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                                  </div>
                                  <div className="flex justify-between">
                                      <span>Taxes & Fees (est.)</span>
                                      <span>${taxes.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                                  </div>
                                  <div className="flex justify-between text-slate-800 font-bold text-xl border-t border-slate-300 pt-3 mt-3">
                                      <span>Total Price</span>
                                      <span>${totalPrice.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                                  </div>
                              </div>
                          </div>
                      </Card>
                  </div>
              </div>
              {/* Action Buttons */}
              <div className="mt-8 flex justify-between items-center border-t border-slate-200 pt-6">
                  <button onClick={onBack} className="bg-slate-200 text-slate-700 px-8 py-3 rounded-md font-semibold hover:bg-slate-300 transition-colors">
                  Back
                  </button>
                  <button onClick={() => setIsPaymentModalOpen(true)} className="bg-sky-600 text-white px-8 py-3 rounded-md font-semibold hover:bg-sky-500 transition-colors text-lg">
                  Confirm & Pay
                  </button>
              </div>
          </div>
        </div>
      </div>
      <PaymentModal
        isOpen={isPaymentModalOpen}
        onClose={handleModalClose}
        amount={totalPrice}
        onSuccess={handlePaymentSuccess}
      />
    </>
  );
};

export default HotelConfirmationPage;