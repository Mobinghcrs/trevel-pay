
import React from 'react';
import { Hotel, Room } from '../../types';
import Card from '../../components/Card';
import { ICONS } from '../../constants';

interface HotelResultsProps {
  hotels: Hotel[];
  onSelectRoom: (hotel: Hotel, room: Room) => void;
}

const StarRating: React.FC<{ rating: number }> = ({ rating }) => {
    return (
        <div className="flex items-center">
            {[...Array(5)].map((_, i) => (
                <svg key={i} className={`h-5 w-5 ${i < Math.round(rating) ? 'text-amber-400' : 'text-gray-300'}`} fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
            ))}
        </div>
    );
};

const HotelCard: React.FC<{ hotel: Hotel, onSelectRoom: (hotel: Hotel, room: Room) => void }> = ({ hotel, onSelectRoom }) => {
  return (
    <Card className="bg-white border-slate-200 overflow-hidden flex flex-col lg:flex-row">
      <div className="lg:w-1/3 xl:w-2/5">
        <img src={hotel.imageUrl} alt={`Exterior of ${hotel.name}`} className="h-48 w-full object-cover lg:h-full" />
      </div>
      <div className="p-5 flex flex-col flex-grow lg:w-2/3 xl:w-3/5">
        <div className="flex justify-between items-start">
            <div>
                <h3 className="text-xl font-bold text-slate-900">{hotel.name}</h3>
                <StarRating rating={hotel.rating} />
            </div>
            <div className="text-right flex-shrink-0 ml-4">
                <p className="text-slate-500 text-sm">from</p>
                <p className="text-2xl font-bold text-sky-600">${hotel.pricePerNight.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                <p className="text-slate-500 text-sm">/night</p>
            </div>
        </div>
        <p className="text-slate-600 my-3 text-sm flex-grow">{hotel.description}</p>
        <div className="flex flex-wrap gap-2 mb-4">
            {hotel.amenities.slice(0, 4).map(amenity => (
                <span key={amenity} className="text-xs bg-slate-100 text-slate-600 px-2 py-1 rounded-full">{amenity}</span>
            ))}
        </div>
        <div className="border-t border-slate-200 pt-3 mt-auto">
            <h4 className="font-semibold text-slate-800 mb-2">Available Rooms:</h4>
            <div className="space-y-2">
                {hotel.rooms.map(room => (
                    <div key={room.id} className="bg-slate-50 p-3 rounded-md flex justify-between items-center border border-slate-200">
                        <div>
                            <p className="font-semibold text-slate-800">{room.name}</p>
                            <p className="text-xs text-slate-500">Capacity: {room.capacity} | Beds: {room.beds}</p>
                        </div>
                        <div className="text-right">
                            <p className="font-bold text-lg text-slate-800">${room.price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                             <button onClick={() => onSelectRoom(hotel, room)} className="bg-sky-600 text-white px-3 py-1 text-sm rounded-md hover:bg-sky-500 transition-colors font-semibold">
                                Book
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
      </div>
    </Card>
  );
};

const HotelResults: React.FC<HotelResultsProps> = ({ hotels, onSelectRoom }) => {
  if (hotels.length === 0) {
    return <div className="text-center py-10 text-slate-500">No hotels found for your search criteria.</div>;
  }

  return (
    <div className="space-y-6">
      {hotels.map(hotel => (
        <HotelCard key={hotel.id} hotel={hotel} onSelectRoom={onSelectRoom} />
      ))}
    </div>
  );
};

export default HotelResults;