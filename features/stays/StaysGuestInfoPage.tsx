import React, { useState } from 'react';
import { Stay, HotelGuest } from '../../types';
import Card from '../../components/Card';

interface StaysGuestInfoPageProps {
  stay: Stay;
  onSubmit: (guests: HotelGuest[]) => void;
  onBack: () => void;
}

const createNewGuest = (): HotelGuest => ({
    id: Date.now().toString(),
    fullName: '',
    email: '',
    phone: '',
});

const StaysGuestInfoPage: React.FC<StaysGuestInfoPageProps> = ({ stay, onSubmit, onBack }) => {
  const [guest, setGuest] = useState<HotelGuest>(createNewGuest());

  const handleGuestChange = (field: keyof Omit<HotelGuest, 'id'>, value: string) => {
    setGuest(prev => ({...prev, [field]: value}));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!guest.fullName.trim() || !guest.email.trim()) {
        alert('Please fill out your Full Name and Email address.');
        return;
    }
    onSubmit([guest]);
  };

  return (
    <div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        <div className="lg:col-span-2">
          <Card className="bg-white border-slate-200">
            <div className="p-6 border-b border-slate-200">
              <h1 className="text-2xl font-bold text-slate-900">Guest Information</h1>
              <p className="text-slate-600 mt-1">Please enter the details for the primary guest.</p>
            </div>
            <form onSubmit={handleSubmit} className="p-6">
                <div className="space-y-4">
                    <div>
                        <label htmlFor="fullName" className="block text-sm font-medium text-slate-700 mb-1">Full Name</label>
                        <input id="fullName" type="text" value={guest.fullName} onChange={(e) => handleGuestChange('fullName', e.target.value)} className="w-full bg-white border border-slate-300 rounded-md px-3 py-2 text-slate-900 focus:ring-2 focus:ring-sky-500 focus:outline-none" required placeholder="As it appears on your ID"/>
                    </div>
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-1">Email Address</label>
                        <input id="email" type="email" value={guest.email} onChange={(e) => handleGuestChange('email', e.target.value)} className="w-full bg-white border border-slate-300 rounded-md px-3 py-2 text-slate-900 focus:ring-2 focus:ring-sky-500 focus:outline-none" required placeholder="For booking confirmation"/>
                    </div>
                    <div>
                        <label htmlFor="phone" className="block text-sm font-medium text-slate-700 mb-1">Phone Number (Optional)</label>
                        <input id="phone" type="tel" value={guest.phone} onChange={(e) => handleGuestChange('phone', e.target.value)} className="w-full bg-white border border-slate-300 rounded-md px-3 py-2 text-slate-900 focus:ring-2 focus:ring-sky-500 focus:outline-none" placeholder="For urgent contact"/>
                    </div>
                </div>
                 <div className="flex justify-between items-center pt-6 border-t border-slate-200 mt-6">
                    <button type="button" onClick={onBack} className="bg-slate-200 text-slate-800 px-6 py-2 rounded-md font-semibold hover:bg-slate-300 transition-colors">
                      Back
                    </button>
                    <button type="submit" className="bg-sky-600 text-white px-6 py-2 rounded-md font-semibold hover:bg-sky-500 transition-colors">
                      Continue to Confirmation
                    </button>
                </div>
            </form>
          </Card>
        </div>
        <div className="lg:col-span-1">
            <Card className="p-4 bg-slate-50 border-slate-200 sticky top-24">
                 <h2 className="text-lg font-bold text-slate-800 mb-3 border-b border-slate-200 pb-3">Booking Summary</h2>
                 <div className="space-y-3 text-sm">
                    <img src={stay.images[0]} alt={stay.name} className="rounded-lg mb-3" />
                    <p className="font-bold text-base text-slate-900">{stay.name}</p>
                    <div className="flex justify-between">
                        <span className="text-slate-600">Type</span>
                        <span className="text-slate-900 font-semibold">{stay.type}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-slate-600">Price per night</span>
                        <span className="text-slate-900 font-semibold">${stay.pricePerNight.toLocaleString()}</span>
                    </div>
                 </div>
            </Card>
        </div>
      </div>
    </div>
  );
};

export default StaysGuestInfoPage;