import React, { useState } from 'react';
import { Flight, Passenger } from '../../types';
import Card from '../../components/Card';
import BookingBreadcrumbs from './BookingBreadcrumbs';
import { ICONS } from '../../constants';

const createNewPassenger = (): Passenger => ({
    id: Date.now().toString() + Math.random(),
    name: '',
    idOrPassport: '',
    dateOfBirth: '',
    passportExpirationDate: '',
    countryOfBirth: '',
    issuingCountry: '',
});

const PassengerInfoPage: React.FC<{
  flight: Flight;
  onSubmit: (passengers: Passenger[]) => void;
  onBack: () => void;
}> = ({ flight, onSubmit, onBack }) => {
  const [passengers, setPassengers] = useState<Passenger[]>([createNewPassenger()]);

  const handlePassengerChange = (index: number, field: keyof Omit<Passenger, 'id'>, value: string) => {
    const updatedPassengers = [...passengers];
    updatedPassengers[index][field] = value;
    setPassengers(updatedPassengers);
  };

  const addPassenger = () => {
    setPassengers([...passengers, createNewPassenger()]);
  };

  const removePassenger = (index: number) => {
    if (passengers.length > 1) {
      const updatedPassengers = passengers.filter((_, i) => i !== index);
      setPassengers(updatedPassengers);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    for (const p of passengers) {
        if (!p.name.trim() || !p.idOrPassport.trim() || !p.dateOfBirth) {
            alert('Please fill out all required fields for each passenger (Full Name, ID/Passport, and Date of Birth).');
            return;
        }
    }
    onSubmit(passengers);
  };

  const formatTime = (dateString: string) => new Date(dateString).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  return (
    <div>
      <BookingBreadcrumbs currentStep="passengers" />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        <div className="lg:col-span-2">
          <Card className='border-slate-200'>
            <div className="p-6 border-b border-slate-200">
              <h1 className="text-2xl font-bold text-slate-900">Passenger Information</h1>
              <p className="text-slate-600 mt-1">Please enter the details for each passenger.</p>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              {passengers.map((passenger, index) => (
                <Card key={passenger.id} className="p-4 bg-slate-50 border-slate-200">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="font-bold text-slate-800">Passenger {index + 1}</h3>
                        {passengers.length > 1 && (
                            <button
                            type="button"
                            onClick={() => removePassenger(index)}
                            className="p-2 text-slate-500 hover:text-red-500 hover:bg-slate-200 rounded-full transition-colors"
                            aria-label={`Remove Passenger ${index + 1}`}
                            >
                            {ICONS.trash}
                            </button>
                        )}
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="md:col-span-2">
                            <label htmlFor={`name-${index}`} className="block text-sm font-medium text-slate-700 mb-1">Full Name</label>
                            <input id={`name-${index}`} type="text" value={passenger.name} onChange={(e) => handlePassengerChange(index, 'name', e.target.value)} className="w-full bg-white border border-slate-300 rounded-md px-3 py-2 text-slate-900 focus:ring-2 focus:ring-teal-500 focus:outline-none" required />
                        </div>
                        <div>
                            <label htmlFor={`id-${index}`} className="block text-sm font-medium text-slate-700 mb-1">National ID / Passport No.</label>
                            <input id={`id-${index}`} type="text" value={passenger.idOrPassport} onChange={(e) => handlePassengerChange(index, 'idOrPassport', e.target.value)} className="w-full bg-white border border-slate-300 rounded-md px-3 py-2 text-slate-900 focus:ring-2 focus:ring-teal-500 focus:outline-none" required />
                        </div>
                        <div>
                            <label htmlFor={`dob-${index}`} className="block text-sm font-medium text-slate-700 mb-1">Date of Birth</label>
                            <input id={`dob-${index}`} type="date" value={passenger.dateOfBirth} onChange={(e) => handlePassengerChange(index, 'dateOfBirth', e.target.value)} className="w-full bg-white border border-slate-300 rounded-md px-3 py-2 text-slate-900 focus:ring-2 focus:ring-teal-500 focus:outline-none" required />
                        </div>
                        <div>
                            <label htmlFor={`expiry-${index}`} className="block text-sm font-medium text-slate-700 mb-1">Passport Expiry Date</label>
                            <input id={`expiry-${index}`} type="date" value={passenger.passportExpirationDate} onChange={(e) => handlePassengerChange(index, 'passportExpirationDate', e.target.value)} className="w-full bg-white border border-slate-300 rounded-md px-3 py-2 text-slate-900 focus:ring-2 focus:ring-teal-500 focus:outline-none" />
                        </div>
                         <div>
                            <label htmlFor={`country-birth-${index}`} className="block text-sm font-medium text-slate-700 mb-1">Country of Birth</label>
                            <input id={`country-birth-${index}`} type="text" value={passenger.countryOfBirth} onChange={(e) => handlePassengerChange(index, 'countryOfBirth', e.target.value)} className="w-full bg-white border border-slate-300 rounded-md px-3 py-2 text-slate-900 focus:ring-2 focus:ring-teal-500 focus:outline-none" />
                        </div>
                         <div className="md:col-span-2">
                            <label htmlFor={`country-issue-${index}`} className="block text-sm font-medium text-slate-700 mb-1">Issuing Country</label>
                            <input id={`country-issue-${index}`} type="text" value={passenger.issuingCountry} onChange={(e) => handlePassengerChange(index, 'issuingCountry', e.target.value)} className="w-full bg-white border border-slate-300 rounded-md px-3 py-2 text-slate-900 focus:ring-2 focus:ring-teal-500 focus:outline-none" />
                        </div>
                    </div>
                </Card>
              ))}
               <button
                  type="button"
                  onClick={addPassenger}
                  className="flex items-center gap-2 text-teal-600 hover:text-teal-500 font-semibold py-2 px-3 rounded-md bg-teal-100 hover:bg-teal-200 transition-colors"
                >
                  <span className="h-5 w-5">{ICONS.add}</span>
                  <span>Add another passenger</span>
                </button>
                 <div className="flex justify-between items-center pt-4 border-t border-slate-200 mt-2">
                    <button type="button" onClick={onBack} className="bg-slate-200 text-slate-800 px-6 py-2 rounded-md font-semibold hover:bg-slate-300 transition-colors">
                      Back
                    </button>
                    <button type="submit" className="bg-teal-600 text-white px-6 py-2 rounded-md font-semibold hover:bg-teal-700 transition-colors">
                      Continue
                    </button>
                </div>
            </form>
          </Card>
        </div>
        <div className="lg:col-span-1">
            <Card className="p-4 sticky top-24 bg-slate-50 border-slate-200">
                 <h2 className="text-lg font-bold text-slate-800 mb-3 border-b border-slate-200 pb-3">Flight Summary</h2>
                 <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                        <span className="text-slate-600">{flight.origin.city} ({flight.origin.code})</span>
                        <span className="text-slate-600">to</span>
                        <span className="text-slate-600">{flight.destination.city} ({flight.destination.code})</span>
                    </div>
                     <div className="flex justify-between items-center text-center bg-white p-2 rounded-md">
                        <div>
                            <p className="font-semibold text-slate-800">{formatTime(flight.departureTime)}</p>
                            <p className="text-slate-500">{flight.origin.code}</p>
                        </div>
                         <div className="text-slate-500">{flight.duration}</div>
                         <div>
                            <p className="font-semibold text-slate-800">{formatTime(flight.arrivalTime)}</p>
                            <p className="text-slate-500">{flight.destination.code}</p>
                        </div>
                    </div>
                     <div className="flex justify-between">
                        <span className="text-slate-600">Airline</span>
                        <span className="text-slate-900 font-semibold">{flight.airline}</span>
                    </div>
                    <div className="flex justify-between border-t border-slate-200 pt-3">
                        <span className="text-slate-600">Price per ticket</span>
                        <span className="text-slate-900 font-semibold">${flight.price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                    </div>
                 </div>
            </Card>
        </div>
      </div>
    </div>
  );
};

export default PassengerInfoPage;