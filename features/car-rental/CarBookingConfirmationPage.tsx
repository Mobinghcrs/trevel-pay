

import React, { useState } from 'react';
import { Car, Driver } from '../../types';
import Card from '../../components/Card';
import CarBookingBreadcrumbs from './CarBookingBreadcrumbs';
import PaymentModal from '../../components/PaymentModal';

interface CarBookingConfirmationPageProps {
  car: Car;
  driver: Driver;
  pickupDate: string;
  dropoffDate: string;
  location: string;
  onConfirm: (totalPrice: number) => Promise<void>;
  onBookingComplete: () => void;
  onBack: () => void;
}

const ConfirmationItem: React.FC<{ label: string, children: React.ReactNode }> = ({ label, children }) => (
    <div>
        <p className="text-sm text-slate-500">{label}</p>
        <div className="font-semibold text-slate-800">{children}</div>
    </div>
);

const CarBookingConfirmationPage: React.FC<CarBookingConfirmationPageProps> = ({ car, driver, pickupDate, dropoffDate, location, onConfirm, onBookingComplete, onBack }) => {
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [paymentWasSuccessful, setPaymentWasSuccessful] = useState(false);
  
  const rentalDays = Math.ceil((new Date(dropoffDate).getTime() - new Date(pickupDate).getTime()) / (1000 * 3600 * 24)) || 1;
  const subtotal = rentalDays * car.pricePerDay;
  const taxes = subtotal * 0.09; // 9% tax/fee assumption
  const totalPrice = subtotal + taxes;

  const formatDate = (dateString: string) => new Date(dateString).toLocaleDateString('en-US', { weekday: 'short', month: 'long', day: 'numeric', year: 'numeric' });
  
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
        <CarBookingBreadcrumbs currentStep="confirmation" />
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-slate-900">Confirm Your Reservation</h1>
              <p className="text-slate-600 mt-1">Please review your booking details before final confirmation.</p>
          </div>
          
          <Card className="p-6 md:p-8 bg-white border-slate-200">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* Car & Driver Info */}
                  <div>
                      <img src={car.imageUrl} alt={`${car.brand} ${car.name}`} className="rounded-lg mb-4 w-full h-48 object-cover"/>
                      <h2 className="text-2xl font-bold text-slate-900">{car.brand} {car.name}</h2>
                      <p className="text-slate-500 mb-4">Type: {car.type}</p>
                      
                       <div className="grid grid-cols-2 gap-4 border-y border-slate-200 py-4">
                          <ConfirmationItem label="Pickup">
                              <p>{location}</p>
                              <p className="text-sm font-normal">{formatDate(pickupDate)}</p>
                          </ConfirmationItem>
                           <ConfirmationItem label="Drop-off">
                              <p>{location}</p>
                              <p className="text-sm font-normal">{formatDate(dropoffDate)}</p>
                          </ConfirmationItem>
                      </div>

                      <div className="mt-4">
                          <h3 className="text-lg font-semibold text-slate-800 mb-2">Driver Details</h3>
                          <ConfirmationItem label="Primary Driver">
                              <p>{driver.fullName}</p>
                              <p className="text-sm font-normal">License: {driver.licenseNumber}</p>
                          </ConfirmationItem>
                      </div>
                  </div>

                  {/* Price Summary */}
                  <div className="bg-slate-50 p-6 rounded-lg h-fit">
                      <h3 className="text-xl font-bold text-slate-800 mb-4 border-b border-slate-200 pb-2">Price Summary</h3>
                      <div className="space-y-2 text-slate-600">
                          <div className="flex justify-between">
                              <span>${car.pricePerDay.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} x {rentalDays} {rentalDays > 1 ? 'days' : 'day'}</span>
                              <span>${subtotal.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                          </div>
                          <div className="flex justify-between">
                              <span>Taxes & Fees</span>
                              <span>${taxes.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                          </div>
                          <div className="flex justify-between text-slate-800 font-bold text-xl border-t border-slate-300 pt-3 mt-3">
                              <span>Total Price</span>
                              <span>${totalPrice.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                          </div>
                      </div>
                  </div>
              </div>
               {/* Action Buttons */}
              <div className="mt-8 flex justify-between items-center border-t border-slate-200 pt-6">
                  <button onClick={onBack} className="bg-slate-200 text-slate-700 px-8 py-3 rounded-md font-semibold hover:bg-slate-300 transition-colors">
                  Back
                  </button>
                  <button onClick={() => setIsPaymentModalOpen(true)} className="bg-green-600 text-white px-8 py-3 rounded-md font-semibold hover:bg-green-500 transition-colors text-lg">
                  Confirm & Pay
                  </button>
              </div>
          </Card>
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

export default CarBookingConfirmationPage;