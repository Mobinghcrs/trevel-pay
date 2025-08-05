
import React, { useState } from 'react';
import { Car, Driver } from '../../types';
import Card from '../../components/Card';
import CarBookingBreadcrumbs from './CarBookingBreadcrumbs';

interface CarDriverInfoPageProps {
  car: Car;
  onSubmit: (driver: Driver) => void;
  onBack: () => void;
}

const CarDriverInfoPage: React.FC<CarDriverInfoPageProps> = ({ car, onSubmit, onBack }) => {
  const [driver, setDriver] = useState<Omit<Driver, 'id'>>({
    fullName: '',
    dateOfBirth: '',
    licenseNumber: '',
  });

  const handleDriverChange = (field: keyof typeof driver, value: string) => {
    setDriver(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!driver.fullName.trim() || !driver.dateOfBirth || !driver.licenseNumber.trim()) {
      alert('Please fill out all driver information fields.');
      return;
    }
    onSubmit({ ...driver, id: Date.now().toString() });
  };

  return (
    <div>
      <CarBookingBreadcrumbs currentStep="driver" />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        <div className="lg:col-span-2">
          <Card className="bg-white border-slate-200">
            <div className="p-6 border-b border-slate-200">
              <h1 className="text-2xl font-bold text-slate-900">Driver Information</h1>
              <p className="text-slate-600 mt-1">Please enter the details for the primary driver.</p>
            </div>
            <form onSubmit={handleSubmit} className="p-6">
              <div className="space-y-4">
                <div>
                  <label htmlFor="fullName" className="block text-sm font-medium text-slate-700 mb-1">Full Name</label>
                  <input id="fullName" type="text" value={driver.fullName} onChange={(e) => handleDriverChange('fullName', e.target.value)} className="w-full bg-white border border-slate-300 rounded-md px-3 py-2 text-slate-900 focus:ring-2 focus:ring-sky-500 focus:outline-none" required placeholder="As it appears on the license" />
                </div>
                 <div>
                  <label htmlFor="licenseNumber" className="block text-sm font-medium text-slate-700 mb-1">Driver's License Number</label>
                  <input id="licenseNumber" type="text" value={driver.licenseNumber} onChange={(e) => handleDriverChange('licenseNumber', e.target.value)} className="w-full bg-white border border-slate-300 rounded-md px-3 py-2 text-slate-900 focus:ring-2 focus:ring-sky-500 focus:outline-none" required />
                </div>
                <div>
                  <label htmlFor="dateOfBirth" className="block text-sm font-medium text-slate-700 mb-1">Date of Birth</label>
                  <input id="dateOfBirth" type="date" value={driver.dateOfBirth} onChange={(e) => handleDriverChange('dateOfBirth', e.target.value)} className="w-full bg-white border border-slate-300 rounded-md px-3 py-2 text-slate-900 focus:ring-2 focus:ring-sky-500 focus:outline-none" required />
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
            <h2 className="text-lg font-bold text-slate-800 mb-3 border-b border-slate-200 pb-3">Your Car</h2>
            <img src={car.imageUrl} alt={car.name} className="rounded-lg mb-3" />
            <p className="font-bold text-base text-slate-900">{car.brand} {car.name}</p>
            <p className="text-sm text-slate-600">{car.type}</p>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CarDriverInfoPage;
