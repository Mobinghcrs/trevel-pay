import React, { useState } from 'react';
import { Flight, Passenger } from '../../types';
import Card from '../../components/Card';
import BookingBreadcrumbs from './BookingBreadcrumbs';
import { ICONS } from '../../constants';
import PaymentModal from '../../components/PaymentModal';

interface BookingConfirmationPageProps {
  flight: Flight;
  passengers: Passenger[];
  onConfirm: (totalPrice: number) => Promise<void>;
  onBack: () => void;
  onBookingComplete: () => void;
}

const BookingConfirmationPage: React.FC<BookingConfirmationPageProps> = ({ flight, passengers, onConfirm, onBack, onBookingComplete }) => {
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [paymentWasSuccessful, setPaymentWasSuccessful] = useState(false);

  const totalPrice = flight.price * passengers.length;
  const formatTime = (dateString: string) => new Date(dateString).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  const formatDate = (dateString: string) => new Date(dateString).toLocaleDateString([], { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

  const handlePaymentSuccess = async () => {
    await onConfirm(totalPrice);
    setPaymentWasSuccessful(true);
  };

  const handleModalClose = () => {
    setIsPaymentModalOpen(false);
    if (paymentWasSuccessful) {
      onBookingComplete();
    }
  };

  return (
    <>
      <div>
        <BookingBreadcrumbs currentStep="confirmation" />
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-slate-900">Confirm Your Booking</h1>
              <p className="text-slate-600 mt-1">Please review the details below before confirming your payment.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
            {/* Flight Details */}
            <Card className="p-0 border-slate-200">
              <div className="p-4 bg-slate-50 rounded-t-lg">
                <h2 className="text-xl font-bold text-slate-800">Flight Details</h2>
              </div>
              <div className="p-4 space-y-4">
                  <div className="text-center bg-slate-100 p-3 rounded-lg">
                      <p className="font-semibold text-teal-600">{formatDate(flight.departureTime)}</p>
                  </div>
                   <div className="flex justify-between items-center">
                      <div>
                          <p className="text-2xl font-bold text-slate-800">{flight.origin.code}</p>
                          <p className="text-slate-500">{flight.origin.city}</p>
                      </div>
                       <div className="flex-shrink-0 text-center text-slate-500">
                          <span className="text-teal-500">{ICONS.plane}</span>
                          <p className="text-xs">{flight.duration}</p>
                      </div>
                       <div className="text-right">
                          <p className="text-2xl font-bold text-slate-800">{flight.destination.code}</p>
                          <p className="text-slate-500">{flight.destination.city}</p>
                      </div>
                  </div>
                  <div className="text-sm space-y-2 border-t border-slate-200 pt-4">
                       <div className="flex justify-between"><span className="text-slate-600">Departure Time</span><span className="font-mono text-slate-800">{formatTime(flight.departureTime)}</span></div>
                       <div className="flex justify-between"><span className="text-slate-600">Arrival Time</span><span className="font-mono text-slate-800">{formatTime(flight.arrivalTime)}</span></div>
                       <div className="flex justify-between"><span className="text-slate-600">Airline</span><span className="font-semibold text-slate-800">{flight.airline}</span></div>
                       <div className="flex justify-between"><span className="text-slate-600">Flight Number</span><span className="font-mono text-slate-800">{flight.flightNumber}</span></div>
                  </div>
              </div>
            </Card>
            
            {/* Passenger & Price Details */}
            <div className="space-y-8">
              <Card className="border-slate-200">
                  <div className="p-4 bg-slate-50 rounded-t-lg">
                      <h2 className="text-xl font-bold text-slate-800">Passengers</h2>
                  </div>
                  <ul className="p-4 space-y-3 divide-y divide-slate-200">
                      {passengers.map((passenger) => (
                          <li key={passenger.id} className="pt-3 first:pt-0 flex items-start gap-3">
                             <span className="text-slate-500 pt-1">{ICONS.user}</span>
                             <div>
                                  <p className="font-medium text-slate-800">{passenger.name}</p>
                                  <p className="text-sm text-slate-500 font-mono">ID/Passport: {passenger.idOrPassport}</p>
                             </div>
                          </li>
                      ))}
                  </ul>
              </Card>

              <Card className="border-slate-200">
                  <div className="p-4 bg-slate-50 rounded-t-lg">
                       <h2 className="text-xl font-bold text-slate-800">Price Summary</h2>
                  </div>
                  <div className="p-4 space-y-2">
                      <div className="flex justify-between text-slate-600">
                          <span>Ticket Price</span>
                          <span>${flight.price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                      </div>
                       <div className="flex justify-between text-slate-600">
                          <span>Passengers</span>
                          <span>x {passengers.length}</span>
                      </div>
                      <div className="flex justify-between text-slate-900 font-bold text-xl border-t border-slate-200 pt-3 mt-3">
                          <span>Total Price</span>
                          <span>${totalPrice.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                      </div>
                  </div>
              </Card>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="mt-8 flex justify-between items-center">
              <button onClick={onBack} className="bg-slate-200 text-slate-800 px-8 py-3 rounded-md font-semibold hover:bg-slate-300 transition-colors">
                Back
              </button>
              <button onClick={() => setIsPaymentModalOpen(true)} className="bg-green-600 text-white px-8 py-3 rounded-md font-semibold hover:bg-green-500 transition-colors text-lg">
                Confirm & Pay
              </button>
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

export default BookingConfirmationPage;