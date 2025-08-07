import React from 'react';
import { Tour } from '../../types';
import Card from '../../components/Card';
import { ICONS } from '../../constants';

interface TourCardProps {
  tour: Tour;
  onSelect: () => void;
}

const TourCard: React.FC<TourCardProps> = ({ tour, onSelect }) => {
  return (
    <Card onClick={onSelect} className="flex flex-col group overflow-hidden border-slate-200">
      <div className="relative">
        <img src={tour.images[0]} alt={tour.name} className="h-48 w-full object-cover transition-transform duration-300 group-hover:scale-110" />
        <div className="absolute top-2 right-2 bg-black/50 text-white text-xs font-bold px-2 py-1 rounded-md flex items-center gap-1">
            <div className="h-4 w-4 text-amber-300">{ICONS.star}</div>
            <span>{tour.rating}</span>
        </div>
      </div>
      <div className="p-4 flex flex-col flex-grow">
        <div>
            <p className="text-xs font-semibold text-teal-600 uppercase">{tour.destination}</p>
            <h3 className="text-lg font-bold text-slate-800 truncate h-14">{tour.name}</h3>
        </div>
        <div className="mt-auto flex justify-between items-end pt-2">
          <div>
            <p className="text-xs text-slate-500">From</p>
            <p className="text-xl font-bold text-slate-900">${tour.pricePerPerson.toLocaleString('en-US', { minimumFractionDigits: 2 })}</p>
            <p className="text-xs text-slate-500">per person</p>
          </div>
          <button className="text-sm font-semibold text-teal-700 bg-teal-100 hover:bg-teal-200 px-3 py-1.5 rounded-md transition-colors">
            View Details
          </button>
        </div>
      </div>
    </Card>
  );
};

export default TourCard;
