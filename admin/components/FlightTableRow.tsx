import React from 'react';
import { Flight } from '../../types';
import { ICONS } from '../../constants';

interface FlightTableRowProps {
    flight: Flight;
    onEdit: () => void;
    onDelete: () => void;
}

const FlightTableRow: React.FC<FlightTableRowProps> = ({ flight, onEdit, onDelete }) => {
    
    const formatTime = (dateString: string) => {
        return new Date(dateString).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false });
    };

    return (
        <tr className="hover:bg-slate-50 transition-colors">
            <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm font-medium text-slate-900">{flight.airline}</div>
                <div className="text-sm text-slate-500 font-mono">{flight.flightNumber}</div>
            </td>
            <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center gap-2 text-sm text-slate-900">
                    <span className="font-bold">{flight.origin.code}</span>
                    <span className="text-slate-400">{ICONS.arrowRight}</span>
                    <span className="font-bold">{flight.destination.code}</span>
                </div>
                <div className="text-xs text-slate-500">
                    {flight.origin.city} to {flight.destination.city}
                </div>
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-700 font-mono">
                {formatTime(flight.departureTime)} - {formatTime(flight.arrivalTime)} ({flight.duration})
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-slate-900">
                ${flight.price.toFixed(2)}
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <div className="flex items-center gap-4">
                    <button onClick={onEdit} className="text-cyan-600 hover:text-cyan-500 transition-colors flex items-center gap-1">
                        {ICONS.edit} Edit
                    </button>
                    <button onClick={onDelete} className="text-red-600 hover:text-red-500 transition-colors flex items-center gap-1">
                        {ICONS.trash} Delete
                    </button>
                </div>
            </td>
        </tr>
    );
};

export default FlightTableRow;
