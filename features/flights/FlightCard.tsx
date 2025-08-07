import React from 'react';
import { Flight } from '../../types';
import { ICONS } from '../../constants';

interface FlightCardProps {
  flight: Flight;
  onSelectFlight: (flight: Flight) => void;
}

const FlightPath: React.FC = () => (
    <div className="relative h-6 flex items-center">
        <div className="absolute w-full border-t-2 border-dashed border-slate-300"></div>
        <div className="absolute left-0 w-3 h-3 bg-white border-2 border-slate-400 rounded-full"></div>
        <div className="absolute left-1/2 -translate-x-1/2 text-teal-500 bg-white px-1">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 transform rotate-45" viewBox="0 0 20 20" fill="currentColor">
                <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
            </svg>
        </div>
        <div className="absolute right-0 w-3 h-3 bg-white border-2 border-teal-500 rounded-full"></div>
    </div>
);


const FlightCard: React.FC<FlightCardProps> = ({ flight, onSelectFlight }) => {
  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });
  };
  
  const getFlightTypeText = (type?: 'Systemic' | 'Charter') => {
    if (type === 'Charter') return 'Charter';
    return 'Systemic';
  };
  
  const typeStyle = flight.type === 'Charter' 
    ? "bg-blue-100 text-blue-800"
    : "bg-orange-100 text-orange-800";

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-slate-200/80 overflow-hidden relative transition-all duration-300 hover:shadow-xl hover:-translate-y-px">
        {/* Ticket cut-out effect */}
        <div className="absolute top-1/2 -translate-y-1/2 -left-3 w-6 h-6 rounded-full bg-slate-50 border-r-2 border-dashed border-slate-200"></div>
        <div className="absolute top-1/2 -translate-y-1/2 -right-3 w-6 h-6 rounded-full bg-slate-50 border-l-2 border-dashed border-slate-200"></div>
        
        <div className="p-5">
            {/* Top section */}
            <div className="flex justify-between items-center mb-4">
                {/* Placeholder for logo */}
                 <div className="w-10 h-10 bg-slate-200 rounded-full flex items-center justify-center text-slate-500 font-bold text-sm border">
                    {flight.airline.substring(0,2).toUpperCase()}
                </div>
                <span className="font-semibold text-slate-800">{flight.airline}</span>
                {flight.type && <span className={`text-xs font-bold px-3 py-1 rounded-full ${typeStyle}`}>{getFlightTypeText(flight.type)}</span>}
            </div>
            
            {/* Times and Path */}
            <div className="flex justify-between items-center text-center">
                <div className="w-1/3">
                    <p className="text-2xl font-bold text-slate-900 font-mono">{formatTime(flight.departureTime).split(' ')[0]}</p>
                    <p className="text-sm text-slate-500">{formatTime(flight.departureTime).split(' ')[1]}</p>
                    <p className="font-semibold text-slate-800 mt-1">{flight.origin.code}</p>
                </div>
                <div className="w-1/3 px-2">
                    <FlightPath />
                </div>
                <div className="w-1/3">
                    <p className="text-2xl font-bold text-slate-900 font-mono">{formatTime(flight.arrivalTime).split(' ')[0]}</p>
                    <p className="text-sm text-slate-500">{formatTime(flight.arrivalTime).split(' ')[1]}</p>
                    <p className="font-semibold text-slate-800 mt-1">{flight.destination.code}</p>
                </div>
            </div>

            {/* Separator */}
            <div className="my-4 border-t border-dashed border-slate-300"></div>

            {/* Bottom section */}
            <div className="flex justify-between items-center">
                <div className="flex items-center gap-4 text-sm text-slate-600">
                    <div className="flex items-center gap-1.5">
                        <span className="text-slate-400">{ICONS.hashtag}</span>
                        <span>{flight.flightNumber}</span>
                    </div>
                     <div className="flex items-center gap-1.5">
                        <span className="text-slate-400">{ICONS.users}</span>
                        <span>{flight.duration}</span>
                    </div>
                </div>
                <div className="text-right">
                    <p className="text-2xl font-bold text-teal-600">${flight.price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                    <p className="text-xs text-slate-500">Total Price</p>
                </div>
            </div>
        </div>
        <button onClick={() => onSelectFlight(flight)} className="w-full bg-teal-600 text-white font-bold py-3 hover:bg-teal-700 transition-colors">
            Select Flight
        </button>
    </div>
  );
};

export default FlightCard;