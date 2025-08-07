import React, { useState } from 'react';
import { Stay } from '../../types';
import Card from '../../components/Card';

interface StaysDetailPageProps {
  stay: Stay;
  checkInDate: string;
  checkOutDate: string;
  onReserve: () => void;
  onBack: () => void;
}

const DetailItem: React.FC<{ label: string, value: string | number }> = ({ label, value }) => (
    <div className="flex justify-between py-2 border-b border-slate-200">
        <span className="text-slate-600">{label}</span>
        <span className="font-semibold text-slate-800">{value}</span>
    </div>
);

const StaysDetailPage: React.FC<StaysDetailPageProps> = ({ stay, checkInDate, checkOutDate, onReserve, onBack }) => {
  const [mainImage, setMainImage] = useState(stay.images[0]);

  const rentalNights = Math.ceil((new Date(checkOutDate).getTime() - new Date(checkInDate).getTime()) / (1000 * 3600 * 24)) || 1;
  const totalPrice = rentalNights * stay.pricePerNight;

  const formatDate = (dateString: string) => new Date(dateString).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });

  return (
    <div>
        <button onClick={onBack} className="text-sm text-sky-600 hover:underline mb-4 font-semibold">&larr; Back to Search Results</button>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            <div className="lg:col-span-2">
                <Card className="bg-white border-slate-200 p-0">
                    <img src={mainImage} alt={stay.name} className="w-full h-96 object-cover rounded-t-lg" />
                    <div className="p-2 flex gap-2">
                        {stay.images.map((img, index) => (
                            <img 
                                key={index}
                                src={img}
                                alt={`${stay.name} view ${index + 1}`}
                                onClick={() => setMainImage(img)}
                                className={`w-24 h-24 object-cover rounded-md cursor-pointer border-2 ${mainImage === img ? 'border-sky-500' : 'border-transparent hover:border-sky-300'}`}
                            />
                        ))}
                    </div>
                    <div className="p-6">
                        <span className="text-sm font-semibold text-sky-600 uppercase">{stay.type}</span>
                        <h1 className="text-3xl font-bold text-slate-900">{stay.name}</h1>
                        <p className="text-slate-500 mt-1">{stay.location}</p>
                        <p className="text-slate-600 mt-4">{stay.description}</p>

                        <h2 className="text-xl font-bold text-slate-800 mt-8 mb-4 border-t border-slate-200 pt-6">Amenities</h2>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                            {stay.amenities.map(feature => (
                                <div key={feature} className="flex items-center gap-2 text-sm">
                                    <span className="text-sky-500">&#10003;</span>
                                    <span>{feature}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </Card>
            </div>
            <div className="lg:col-span-1 sticky top-24">
                <Card className="bg-white border-slate-200 p-6">
                    <h2 className="text-xl font-bold text-slate-800 mb-4">Booking Summary</h2>
                    <div className="space-y-4">
                        <div className="bg-slate-100 p-3 rounded-lg">
                            <DetailItem label="Check-in" value={formatDate(checkInDate)} />
                            <DetailItem label="Check-out" value={formatDate(checkOutDate)} />
                        </div>
                         <div className="space-y-2 pt-4 border-t border-slate-200">
                            <DetailItem label="Price per night" value={`$${stay.pricePerNight.toLocaleString()}`} />
                            <DetailItem label="Nights" value={rentalNights} />
                            <div className="flex justify-between items-center pt-2 mt-2 border-t border-slate-300">
                                <span className="text-lg font-bold text-slate-800">Total Price</span>
                                <span className="text-2xl font-bold text-sky-600">${totalPrice.toLocaleString()}</span>
                            </div>
                        </div>
                        <div className="flex flex-col gap-2 pt-4">
                            <button onClick={onReserve} className="w-full bg-sky-600 text-white px-4 py-3 rounded-md font-semibold hover:bg-sky-500 transition-all duration-200 text-lg">
                                Reserve Now
                            </button>
                        </div>
                    </div>
                </Card>
            </div>
        </div>
    </div>
  );
};

export default StaysDetailPage;