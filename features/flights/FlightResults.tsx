import React from 'react';
import { Flight } from '../../types';
import FlightCard from './FlightCard';

interface FlightResultsProps {
  flights: Flight[];
  onSelectFlight: (flight: Flight) => void;
}

const FlightResults: React.FC<FlightResultsProps> = ({ flights, onSelectFlight }) => {
  if (flights.length === 0) {
    return <div className="text-center py-10 text-slate-500">No flights found for the selected criteria.</div>;
  }

  return (
    <div>
      <div className="space-y-6">
        {flights.map((flight) => (
          <FlightCard key={flight.id} flight={flight} onSelectFlight={onSelectFlight} />
        ))}
      </div>
    </div>
  );
};

export default FlightResults;
