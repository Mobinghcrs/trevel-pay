
import React from 'react';
import { Car } from '../../types';
import Card from '../../components/Card';
import { ICONS } from '../../constants';

interface CarCardProps {
  car: Car;
  onSelect: (car: Car) => void;
}

const Spec: React.FC<{ icon: React.ReactNode, label: string }> = ({ icon, label }) => (
    <div className="flex items-center gap-2 text-slate-600">
        <span className="text-sky-600">{icon}</span>
        <span className="text-sm font-medium">{label}</span>
    </div>
);

const CarCard: React.FC<CarCardProps> = ({ car, onSelect }) => {
  return (
    <Card className="flex flex-col bg-white border-slate-200 group overflow-hidden">
      <div className="relative">
        <img src={car.imageUrl} alt={`${car.brand} ${car.name}`} className="h-48 w-full object-cover transition-transform duration-300 group-hover:scale-110" />
        <div className="absolute top-2 right-2 bg-sky-600 text-white text-xs font-bold px-2 py-1 rounded-full">{car.type}</div>
      </div>
      <div className="p-4 flex flex-col flex-grow">
        <h3 className="text-lg font-bold text-slate-900">{car.brand} {car.name}</h3>
        <div className="grid grid-cols-3 gap-2 my-4 text-center">
            <Spec icon={ICONS.users} label={`${car.seats} Seats`} />
            <Spec icon={ICONS.cog} label={car.transmission} />
            <Spec icon={ICONS.fuel} label={car.fuel} />
        </div>
        <div className="mt-auto flex justify-between items-center pt-4 border-t border-slate-200">
            <div>
                <p className="text-xl font-bold text-slate-800">${car.pricePerDay.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                <p className="text-xs text-slate-500">/ per day</p>
            </div>
            <button
                onClick={() => onSelect(car)}
                className="bg-sky-600 text-white px-4 py-2 rounded-md font-semibold hover:bg-sky-500 transition-colors duration-200"
            >
                Book Now
            </button>
        </div>
      </div>
    </Card>
  );
};

export default CarCard;