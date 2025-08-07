import React, { useState } from 'react';
import { Tour } from '../../types';
import Card from '../../components/Card';
import { ICONS } from '../../constants';

interface TourDetailPageProps {
    tour: Tour;
    onBookNow: (date: string, guests: number) => void;
    onBack: () => void;
}

const TourDetailPage: React.FC<TourDetailPageProps> = ({ tour, onBookNow, onBack }) => {
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
    const [guestCount, setGuestCount] = useState(1);
    const [mainImage, setMainImage] = useState(tour.images[0]);

    const handleBookNow = () => {
        onBookNow(selectedDate, guestCount);
    };

    return (
        <div className="max-w-5xl mx-auto">
             <button onClick={onBack} className="text-sm text-teal-600 hover:underline mb-4 font-semibold">&larr; Back to All Tours</button>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                <div className="lg:col-span-2">
                    <Card className="p-0 border-slate-200">
                        <img src={mainImage} alt={tour.name} className="w-full h-80 object-cover rounded-t-lg" />
                         <div className="p-2 flex gap-2">
                            {tour.images.map((img, index) => (
                                <img 
                                    key={index}
                                    src={img}
                                    alt={`${tour.name} thumbnail ${index + 1}`}
                                    onClick={() => setMainImage(img)}
                                    className={`w-20 h-20 object-cover rounded-md cursor-pointer border-2 ${mainImage === img ? 'border-teal-500' : 'border-transparent hover:border-teal-300'}`}
                                />
                            ))}
                        </div>
                        <div className="p-6">
                            <h1 className="text-3xl font-bold text-slate-900">{tour.name}</h1>
                            <p className="text-slate-600 mt-4">{tour.description}</p>

                            <h2 className="text-xl font-bold text-slate-800 mt-6 pt-4 border-t">Itinerary</h2>
                            <ul className="mt-4 space-y-3">
                                {tour.itinerary.map((item, index) => (
                                    <li key={index} className="flex items-start gap-3">
                                        <div className="w-16 text-right font-mono text-teal-600 flex-shrink-0">{item.time}</div>
                                        <div className="font-semibold text-slate-700">{item.activity}</div>
                                    </li>
                                ))}
                            </ul>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6 pt-4 border-t">
                                <div>
                                    <h2 className="text-xl font-bold text-slate-800 mb-2">What's Included</h2>
                                    <ul className="list-disc list-inside space-y-1 text-slate-600">
                                        {tour.inclusions.map(item => <li key={item}>{item}</li>)}
                                    </ul>
                                </div>
                                 <div>
                                    <h2 className="text-xl font-bold text-slate-800 mb-2">What's Not Included</h2>
                                    <ul className="list-disc list-inside space-y-1 text-slate-600">
                                        {tour.exclusions.map(item => <li key={item}>{item}</li>)}
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </Card>
                </div>

                <div className="lg:col-span-1 sticky top-24">
                    <Card className="p-6 border-slate-200">
                        <p className="text-2xl font-bold text-slate-900">${tour.pricePerPerson.toFixed(2)} <span className="text-base font-normal text-slate-600">/ person</span></p>
                        <div className="space-y-4 mt-4">
                            <div>
                                <label htmlFor="tour-date" className="block text-sm font-medium text-slate-700 mb-1">Date</label>
                                <input id="tour-date" type="date" value={selectedDate} onChange={e => setSelectedDate(e.target.value)} className="w-full bg-slate-100 border-slate-300 rounded-md px-3 py-2" />
                            </div>
                             <div>
                                <label htmlFor="tour-guests" className="block text-sm font-medium text-slate-700 mb-1">Guests</label>
                                <input id="tour-guests" type="number" min="1" value={guestCount} onChange={e => setGuestCount(Number(e.target.value))} className="w-full bg-slate-100 border-slate-300 rounded-md px-3 py-2" />
                            </div>
                        </div>
                        <button onClick={handleBookNow} className="w-full mt-6 bg-teal-600 text-white py-3 rounded-md font-semibold text-lg hover:bg-teal-700 transition-colors">
                            Book Now
                        </button>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default TourDetailPage;