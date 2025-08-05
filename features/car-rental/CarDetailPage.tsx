
import React from 'react';
import { Car } from '../../types';
import Card from '../../components/Card';
import { ICONS } from '../../constants';
import CarBookingBreadcrumbs from './CarBookingBreadcrumbs';

interface CarDetailPageProps {
  car: Car;
  pickupDate: string;
  dropoffDate: string;
  onReserve: () => void;
  onBack: () => void;
}

const DetailItem: React.FC<{ label: string, value: string | number }> = ({ label, value }) => (
    <div className="flex justify-between py-2 border-b border-slate-200">
        <span className="text-slate-600">{label}</span>
        <span className="font-semibold text-slate-800">{value}</span>
    </div>
);

const CarDetailPage: React.FC<CarDetailPageProps> = ({ car, pickupDate, dropoffDate, onReserve, onBack }) => {

  const rentalDays = Math.ceil((new Date(dropoffDate).getTime() - new Date(pickupDate).getTime()) / (1000 * 3600 * 24)) || 1;
  const totalPrice = rentalDays * car.pricePerDay;

  const formatDate = (dateString: string) => new Date(dateString).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });

  return (
    <div>
        <CarBookingBreadcrumbs currentStep="details" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            <div className="lg:col-span-2">
                <Card className="bg-white border-slate-200">
                    <img src={car.imageUrl} alt={`${car.brand} ${car.name}`} className="w-full h-80 object-cover rounded-t-lg" />
                    <div className="p-6">
                        <h1 className="text-3xl font-bold text-slate-900">{car.brand} {car.name}</h1>
                        <div className="flex flex-wrap gap-2 mt-4">
                            {car.features.map(feature => (
                                <span key={feature} className="text-xs bg-slate-100 text-slate-700 px-3 py-1 rounded-full font-medium">
                                    {feature}
                                </span>
                            ))}
                        </div>

                        <h2 className="text-xl font-bold text-slate-800 mt-8 mb-4 border-t border-slate-200 pt-6">Specifications</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2">
                            <DetailItem label="Car Type" value={car.type} />
                            <DetailItem label="Seats" value={car.seats} />
                            <DetailItem label="Transmission" value={car.transmission} />
                            <DetailItem label="Fuel Type" value={car.fuel} />
                        </div>
                    </div>
                </Card>
            </div>
            <div className="lg:col-span-1 sticky top-24">
                <Card className="bg-white border-slate-200 p-6">
                    <h2 className="text-xl font-bold text-slate-800 mb-4">Booking Summary</h2>
                    <div className="space-y-4">
                        <div className="bg-slate-100 p-3 rounded-lg">
                            <DetailItem label="Pickup Date" value={formatDate(pickupDate)} />
                            <DetailItem label="Drop-off Date" value={formatDate(dropoffDate)} />
                        </div>
                         <div className="space-y-2 pt-4 border-t border-slate-200">
                            <DetailItem label="Price per day" value={`$${car.pricePerDay.toFixed(2)}`} />
                            <DetailItem label="Rental Days" value={rentalDays} />
                            <div className="flex justify-between items-center pt-2 mt-2 border-t border-slate-300">
                                <span className="text-lg font-bold text-slate-800">Total Price</span>
                                <span className="text-2xl font-bold text-sky-600">${totalPrice.toFixed(2)}</span>
                            </div>
                        </div>
                        <div className="flex flex-col gap-2 pt-4">
                            <button onClick={onReserve} className="w-full bg-sky-600 text-white px-4 py-3 rounded-md font-semibold hover:bg-sky-500 transition-all duration-200 text-lg">
                                Continue
                            </button>
                             <button onClick={onBack} className="w-full bg-slate-200 text-slate-800 px-4 py-2 rounded-md font-semibold hover:bg-slate-300 transition-colors">
                                &larr; Back to Search
                            </button>
                        </div>
                    </div>
                </Card>
            </div>
        </div>
    </div>
  );
};

export default CarDetailPage;