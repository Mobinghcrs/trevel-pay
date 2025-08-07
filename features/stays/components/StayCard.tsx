import React from 'react';
import { Stay } from '../../../types';
import Card from '../../../components/Card';
import { ICONS } from '../../../constants';

interface StayCardProps {
  stay: Stay;
  onSelect: () => void;
}

const StayCard: React.FC<StayCardProps> = ({ stay, onSelect }) => {
  return (
    <Card onClick={onSelect} className="flex flex-col group overflow-hidden border-slate-200">
      <div className="relative">
        <img src={stay.images[0]} alt={stay.name} className="h-56 w-full object-cover transition-transform duration-300 group-hover:scale-110" />
        <div className="absolute top-2 right-2 bg-black/50 text-white text-xs font-bold px-2 py-1 rounded-md flex items-center gap-1">
            <div className="h-4 w-4 text-amber-300">{ICONS.star}</div>
            <span>{stay.rating}</span>
        </div>
        <div className="absolute top-2 left-2 bg-white/90 text-slate-800 text-xs font-bold px-2 py-1 rounded-md">
            {stay.type}
        </div>
      </div>
      <div className="p-4 flex flex-col flex-grow">
        <div>
            <h3 className="text-lg font-bold text-slate-800 truncate">{stay.name}</h3>
            <p className="text-sm text-slate-500">{stay.location}</p>
        </div>
        <div className="mt-auto flex justify-between items-end pt-2">
          <div>
            <p className="text-xl font-bold text-slate-900">${stay.pricePerNight.toLocaleString()}</p>
            <p className="text-xs text-slate-500">/ per night</p>
          </div>
          <button className="text-sm font-semibold text-sky-700 bg-sky-100 hover:bg-sky-200 px-3 py-1.5 rounded-md transition-colors">
            View
          </button>
        </div>
      </div>
    </Card>
  );
};

export default StayCard;