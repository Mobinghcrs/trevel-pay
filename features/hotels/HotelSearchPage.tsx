
import React, { useState, useCallback, useEffect } from 'react';
import { Hotel, Room, HotelGuest, HotelBookingStep, HotelBookingOrder } from '../../types';
import { searchHotels } from '../../services/apiService';
import Card from '../../components/Card';
import Spinner from '../../components/Spinner';
import HotelResults from './HotelResults';
import HotelGuestInfoPage from './HotelGuestInfoPage';
import HotelConfirmationPage from './HotelConfirmationPage';
import HotelBookingSuccessPage from './HotelBookingSuccessPage';

interface HotelSearchPageProps {
  context?: {
    destination?: string;
    checkInDate?: string;
    checkOutDate?: string;
  } | null;
}

const HotelSearchPage: React.FC<HotelSearchPageProps> = ({ context }) => {
  // Search form state
  const [destination, setDestination] = useState('Paris');
  const [checkIn, setCheckIn] = useState(new Date().toISOString().split('T')[0]);
  const [checkOut, setCheckOut] = useState(() => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  });
  const [guests, setGuests] = useState(2);
  
  // API and flow state
  const [hotels, setHotels] = useState<Hotel[] | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Booking flow state
  const [step, setStep] = useState<HotelBookingStep>('search');
  const [selected, setSelected] = useState<{hotel: Hotel, room: Room} | null>(null);
  const [guestInfo, setGuestInfo] = useState<HotelGuest[]>([]);
  const [bookingResult, setBookingResult] = useState<HotelBookingOrder | null>(null);


  const performSearch = useCallback(async (searchDest: string, searchCheckIn: string, searchCheckOut: string, searchGuests: number) => {
    setIsLoading(true);
    setError(null);
    setHotels(null);
    // Reset the entire flow on a new search
    setStep('search');
    setSelected(null);
    setGuestInfo([]);
    setBookingResult(null);

    try {
      const results = await searchHotels(searchDest, searchCheckIn, searchCheckOut, searchGuests);
      setHotels(results);
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : 'An unknown error occurred.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (context) {
      const searchDest = context.destination || destination;
      const searchCheckIn = context.checkInDate || checkIn;
      const searchCheckOut = context.checkOutDate || checkOut;

      setDestination(searchDest);
      setCheckIn(searchCheckIn);
      setCheckOut(searchCheckOut);
      
      if (searchDest) {
        performSearch(searchDest, searchCheckIn, searchCheckOut, guests);
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [context, performSearch]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    performSearch(destination, checkIn, checkOut, guests);
  };

  const handleSelectRoom = (hotel: Hotel, room: Room) => {
    setSelected({ hotel, room });
    setStep('guests');
  };

  const handleGuestInfoSubmit = (guestsData: HotelGuest[]) => {
    setGuestInfo(guestsData);
    setStep('confirmation');
  };

  const handleBookingComplete = (order: HotelBookingOrder) => {
    setBookingResult(order);
    setStep('success');
  };
  
  const handleBack = () => {
    if (step === 'success') {
      // Go back to a fresh search
      performSearch(destination, checkIn, checkOut, guests);
    } else if (step === 'confirmation') {
        setStep('guests');
    } else if (step === 'guests') {
        setStep('search');
        setSelected(null);
    }
  }

  if (step === 'guests' && selected) {
    return <HotelGuestInfoPage hotel={selected.hotel} room={selected.room} onSubmit={handleGuestInfoSubmit} onBack={handleBack} />;
  }
  
  if (step === 'confirmation' && selected) {
    return <HotelConfirmationPage hotel={selected.hotel} room={selected.room} guests={guestInfo} checkIn={checkIn} checkOut={checkOut} onBookingComplete={handleBookingComplete} onBack={handleBack} />;
  }

  if (step === 'success' && bookingResult) {
      return <HotelBookingSuccessPage order={bookingResult} onNewBooking={handleBack} />
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900">Book Your Perfect Stay</h1>
        <p className="text-slate-600 mt-1">Find hotels worldwide with our AI-powered search.</p>
      </div>

      <Card className="p-6 mb-8 bg-white border border-slate-200">
        <form onSubmit={handleSearchSubmit} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 items-end">
          <div className="flex flex-col lg:col-span-2">
            <label htmlFor="destination" className="text-sm font-medium text-slate-700 mb-1">Destination</label>
            <input id="destination" type="text" value={destination} onChange={(e) => setDestination(e.target.value)} className="bg-white border border-slate-300 rounded-md px-3 py-2 text-slate-900 focus:ring-2 focus:ring-sky-500 focus:outline-none" placeholder="e.g., Paris" />
          </div>
          <div className="flex flex-col">
            <label htmlFor="checkin" className="text-sm font-medium text-slate-700 mb-1">Check-in</label>
            <input id="checkin" type="date" value={checkIn} onChange={(e) => setCheckIn(e.target.value)} className="bg-white border border-slate-300 rounded-md px-3 py-2 text-slate-900 focus:ring-2 focus:ring-sky-500 focus:outline-none" />
          </div>
          <div className="flex flex-col">
            <label htmlFor="checkout" className="text-sm font-medium text-slate-700 mb-1">Check-out</label>
            <input id="checkout" type="date" value={checkOut} onChange={(e) => setCheckOut(e.target.value)} className="bg-white border border-slate-300 rounded-md px-3 py-2 text-slate-900 focus:ring-2 focus:ring-sky-500 focus:outline-none" />
          </div>
          <button type="submit" disabled={isLoading} className="bg-sky-600 text-white px-4 py-2 rounded-md font-semibold hover:bg-sky-500 transition-colors duration-200 disabled:bg-slate-500 disabled:cursor-not-allowed h-fit w-full">
            {isLoading ? 'Searching...' : 'Search Hotels'}
          </button>
        </form>
      </Card>
      
      {isLoading && <Spinner message="Finding hotels..." />}
      {error && !isLoading && <div className="text-center text-red-600 bg-red-100 p-4 rounded-md mb-4 border border-red-200">{error}</div>}
      {hotels && <HotelResults hotels={hotels} onSelectRoom={handleSelectRoom} />}
       {!isLoading && !hotels && (
        <div className="text-center py-10 text-slate-500">
            <p>Your hotel search results will appear here.</p>
        </div>
      )}
    </div>
  );
};

export default HotelSearchPage;
