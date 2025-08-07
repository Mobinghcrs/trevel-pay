import React, { useState, useEffect } from 'react';
import Card from '../../components/Card';
import { ICONS } from '../../constants';
import { getFlightSearchLocations } from '../../services/apiService';

interface FlightSearchFormProps {
  onSearch: (origin: string, destination: string, date: string) => void;
  initialOrigin: string;
  initialDestination: string;
  initialDate: string;
  isLoading: boolean;
}

const FlightSearchForm: React.FC<FlightSearchFormProps> = ({ onSearch, initialOrigin, initialDestination, initialDate, isLoading }) => {
  const [origin, setOrigin] = useState(initialOrigin);
  const [destination, setDestination] = useState(initialDestination);
  const [date, setDate] = useState(initialDate);
  const [locations, setLocations] = useState<{ name: string; code: string }[]>([]);

  useEffect(() => {
    const fetchLocations = async () => {
        try {
            const data = await getFlightSearchLocations();
            setLocations(data);
        } catch (error) {
            console.error("Failed to load flight locations", error);
            // Handle error, maybe show a message to the user
        }
    };
    fetchLocations();
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (origin === destination) {
      alert("Origin and destination cannot be the same.");
      return;
    }
    onSearch(origin, destination, date);
  };

  return (
    <div>
      <div className="text-center mb-8">
        <div className="w-24 h-24 bg-teal-100 text-teal-600 rounded-full flex items-center justify-center mx-auto mb-4">
          {ICONS.plane}
        </div>
        <h1 className="text-3xl font-bold text-slate-900">Find Your Next Flight</h1>
        <p className="text-slate-600 mt-1">Search for the best flight deals across the globe.</p>
      </div>

      <Card className="p-6 bg-white border border-slate-200/80 shadow-lg max-w-3xl mx-auto">
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4 items-end">
          <div className="flex flex-col">
            <label htmlFor="origin" className="text-sm font-medium text-slate-700 mb-1">Origin</label>
            <select id="origin" value={origin} onChange={(e) => setOrigin(e.target.value)} className="w-full bg-slate-50 border border-slate-300 rounded-md px-3 py-2 text-slate-900 focus:ring-2 focus:ring-teal-500 focus:outline-none appearance-none">
              {locations.map(loc => (
                <option key={loc.code} value={loc.name.split(',')[0].trim()}>{loc.name} ({loc.code})</option>
              ))}
            </select>
          </div>
          <div className="flex flex-col">
            <label htmlFor="destination" className="text-sm font-medium text-slate-700 mb-1">Destination</label>
            <select id="destination" value={destination} onChange={(e) => setDestination(e.target.value)} className="w-full bg-slate-50 border border-slate-300 rounded-md px-3 py-2 text-slate-900 focus:ring-2 focus:ring-teal-500 focus:outline-none appearance-none">
              {locations.map(loc => (
                <option key={loc.code} value={loc.name.split(',')[0].trim()}>{loc.name} ({loc.code})</option>
              ))}
            </select>
          </div>
          <div className="flex flex-col md:col-span-2">
            <label htmlFor="date" className="text-sm font-medium text-slate-700 mb-1">Departure Date</label>
            <input id="date" type="date" value={date} onChange={(e) => setDate(e.target.value)} className="w-full bg-slate-50 border border-slate-300 rounded-md px-3 py-2 text-slate-900 focus:ring-2 focus:ring-teal-500 focus:outline-none" />
          </div>
          <button type="submit" disabled={isLoading} className="md:col-span-2 bg-teal-600 text-white px-4 py-3 rounded-md font-semibold hover:bg-teal-700 transition-colors duration-200 disabled:bg-slate-400 disabled:cursor-not-allowed h-fit w-full mt-2 text-lg">
            {isLoading ? 'Searching...' : 'Search Flights'}
          </button>
        </form>
      </Card>
    </div>
  );
};

export default FlightSearchForm;