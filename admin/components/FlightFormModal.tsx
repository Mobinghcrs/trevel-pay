import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { Flight } from '../../types';

interface FlightFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (flightData: Omit<Flight, 'id'> | Flight) => void;
  flight: Flight | null;
}

const initialFlightState: Omit<Flight, 'id'> = {
    flightNumber: '',
    airline: '',
    origin: { code: '', city: '' },
    destination: { code: '', city: '' },
    departureTime: '',
    arrivalTime: '',
    duration: '',
    price: 0,
    type: 'Systemic',
};

const FlightFormModal: React.FC<FlightFormModalProps> = ({ isOpen, onClose, onSave, flight }) => {
  const [formData, setFormData] = useState<Omit<Flight, 'id'> | Flight>(initialFlightState);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (flight) {
      setFormData({
          ...flight,
          departureTime: new Date(flight.departureTime).toISOString().slice(0, 16),
          arrivalTime: new Date(flight.arrivalTime).toISOString().slice(0, 16),
      });
    } else {
      setFormData(initialFlightState);
    }
  }, [flight, isOpen]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleNestedChange = (parent: 'origin' | 'destination', field: 'code' | 'city', value: string) => {
    setFormData(prev => ({
        ...prev,
        [parent]: {
            ...prev[parent],
            [field]: value
        }
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    // Convert local datetime strings back to full ISO strings for saving
    const dataToSave = {
        ...formData,
        departureTime: new Date(formData.departureTime).toISOString(),
        arrivalTime: new Date(formData.arrivalTime).toISOString(),
        price: Number(formData.price)
    };
    await onSave(dataToSave);
    setIsSaving(false);
  };

  if (!isOpen) return null;

  return ReactDOM.createPortal(
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center z-50 p-4" onClick={onClose}>
      <div className="bg-white border border-slate-200 rounded-xl shadow-2xl w-full max-w-2xl transform transition-all text-slate-800" onClick={(e) => e.stopPropagation()}>
        <form onSubmit={handleSubmit}>
            <div className="flex justify-between items-center p-4 border-b border-slate-200">
                <h2 className="text-lg font-bold text-slate-900">{flight ? 'Edit Flight' : 'Add New Flight'}</h2>
                <button type="button" onClick={onClose} className="p-2 text-slate-400 hover:text-slate-800 hover:bg-slate-100 rounded-full" aria-label="Close dialog">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
            </div>
            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4 max-h-[70vh] overflow-y-auto">
                {/* Flight Details */}
                <div className="md:col-span-2 grid grid-cols-3 gap-4">
                    <div>
                        <label htmlFor="airline" className="block text-sm font-medium text-slate-600 mb-1">Airline</label>
                        <input id="airline" name="airline" type="text" value={formData.airline} onChange={handleChange} required className="w-full px-3 py-2 bg-slate-100 border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500" />
                    </div>
                     <div>
                        <label htmlFor="flightNumber" className="block text-sm font-medium text-slate-600 mb-1">Flight Number</label>
                        <input id="flightNumber" name="flightNumber" type="text" value={formData.flightNumber} onChange={handleChange} required className="w-full px-3 py-2 bg-slate-100 border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500" />
                    </div>
                    <div>
                        <label htmlFor="type" className="block text-sm font-medium text-slate-600 mb-1">Flight Type</label>
                        <select id="type" name="type" value={formData.type || 'Systemic'} onChange={handleChange} className="w-full px-3 py-2 bg-slate-100 border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500">
                            <option value="Systemic">Systemic</option>
                            <option value="Charter">Charter</option>
                        </select>
                    </div>
                </div>

                {/* Origin */}
                <div className="space-y-4 p-4 border border-slate-200 rounded-lg">
                    <h3 className="font-semibold text-slate-900">Origin</h3>
                     <div>
                        <label htmlFor="originCity" className="block text-sm font-medium text-slate-600 mb-1">City</label>
                        <input id="originCity" type="text" value={formData.origin.city} onChange={e => handleNestedChange('origin', 'city', e.target.value)} required className="w-full px-3 py-2 bg-slate-100 border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500" />
                    </div>
                     <div>
                        <label htmlFor="originCode" className="block text-sm font-medium text-slate-600 mb-1">Airport Code</label>
                        <input id="originCode" type="text" value={formData.origin.code} onChange={e => handleNestedChange('origin', 'code', e.target.value)} required className="w-full px-3 py-2 bg-slate-100 border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500" />
                    </div>
                </div>

                 {/* Destination */}
                <div className="space-y-4 p-4 border border-slate-200 rounded-lg">
                    <h3 className="font-semibold text-slate-900">Destination</h3>
                     <div>
                        <label htmlFor="destinationCity" className="block text-sm font-medium text-slate-600 mb-1">City</label>
                        <input id="destinationCity" type="text" value={formData.destination.city} onChange={e => handleNestedChange('destination', 'city', e.target.value)} required className="w-full px-3 py-2 bg-slate-100 border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500" />
                    </div>
                     <div>
                        <label htmlFor="destinationCode" className="block text-sm font-medium text-slate-600 mb-1">Airport Code</label>
                        <input id="destinationCode" type="text" value={formData.destination.code} onChange={e => handleNestedChange('destination', 'code', e.target.value)} required className="w-full px-3 py-2 bg-slate-100 border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500" />
                    </div>
                </div>

                {/* Schedule & Price */}
                <div className="md:col-span-2 grid grid-cols-2 gap-4">
                    <div>
                        <label htmlFor="departureTime" className="block text-sm font-medium text-slate-600 mb-1">Departure Time</label>
                        <input id="departureTime" name="departureTime" type="datetime-local" value={formData.departureTime} onChange={handleChange} required className="w-full px-3 py-2 bg-slate-100 border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500" />
                    </div>
                    <div>
                        <label htmlFor="arrivalTime" className="block text-sm font-medium text-slate-600 mb-1">Arrival Time</label>
                        <input id="arrivalTime" name="arrivalTime" type="datetime-local" value={formData.arrivalTime} onChange={handleChange} required className="w-full px-3 py-2 bg-slate-100 border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500" />
                    </div>
                     <div>
                        <label htmlFor="duration" className="block text-sm font-medium text-slate-600 mb-1">Duration</label>
                        <input id="duration" name="duration" type="text" value={formData.duration} onChange={handleChange} required placeholder="e.g., 8h 30m" className="w-full px-3 py-2 bg-slate-100 border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500" />
                    </div>
                    <div>
                        <label htmlFor="price" className="block text-sm font-medium text-slate-600 mb-1">Price ($)</label>
                        <input id="price" name="price" type="number" step="0.01" value={formData.price} onChange={handleChange} required className="w-full px-3 py-2 bg-slate-100 border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500" />
                    </div>
                </div>
            </div>

            <div className="flex justify-end gap-4 p-4 bg-slate-50 border-t border-slate-200 rounded-b-xl">
                 <button type="button" onClick={onClose} className="bg-slate-200 text-slate-800 px-5 py-2 rounded-md font-semibold hover:bg-slate-300 transition-colors">
                    Cancel
                </button>
                <button type="submit" disabled={isSaving} className="bg-cyan-500 text-white px-5 py-2 rounded-md font-semibold hover:bg-cyan-600 transition-colors disabled:bg-slate-400 disabled:cursor-wait">
                    {isSaving ? 'Saving...' : 'Save Flight'}
                </button>
            </div>
        </form>
      </div>
    </div>,
    document.body
  );
};

export default FlightFormModal;
