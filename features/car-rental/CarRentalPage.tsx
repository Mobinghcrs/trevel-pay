
import React, { useState, useCallback, useEffect } from 'react';
import { Car, CarBooking, CarBookingStep, Driver } from '../../types';
import { searchCars, createCarBooking } from '../../services/apiService';
import Card from '../../components/Card';
import Spinner from '../../components/Spinner';
import CarCard from './CarCard';
import CarDetailPage from './CarDetailPage';
import CarDriverInfoPage from './CarDriverInfoPage';
import CarBookingConfirmationPage from './CarBookingConfirmationPage';
import CarBookingSuccessPage from './CarBookingSuccessPage';

interface CarRentalPageProps {
  context?: {
    destination?: string;
    checkInDate?: string;
    checkOutDate?: string;
  } | null;
}

const CarRentalPage: React.FC<CarRentalPageProps> = ({ context }) => {
  // Search form state
  const [location, setLocation] = useState('Tehran');
  const [pickupDate, setPickupDate] = useState(new Date().toISOString().split('T')[0]);
  const [dropoffDate, setDropoffDate] = useState(() => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 2);
    return tomorrow.toISOString().split('T')[0];
  });
  
  // API and flow state
  const [cars, setCars] = useState<Car[] | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Booking flow state
  const [step, setStep] = useState<CarBookingStep>('search');
  const [selectedCar, setSelectedCar] = useState<Car | null>(null);
  const [driver, setDriver] = useState<Driver | null>(null);
  const [bookingResult, setBookingResult] = useState<CarBooking | null>(null);

  const performSearch = useCallback(async (searchLocation: string, searchPickup: string, searchDropoff: string) => {
    setIsLoading(true);
    setError(null);
    setCars(null);
    setStep('search');
    setSelectedCar(null);
    setDriver(null);
    setBookingResult(null);

    try {
      const results = await searchCars(searchLocation, searchPickup, searchDropoff);
      setCars(results);
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? `Network error or failed fetch to /cars?location=${searchLocation}&pickupDate=${searchPickup}&dropoffDate=${searchDropoff}: ${err.message}` : 'An unknown error occurred.');
    } finally {
      setIsLoading(false);
    }
  }, []);
  
  useEffect(() => {
    const searchLocation = context?.destination || location;
    const searchPickup = context?.checkInDate || pickupDate;
    const searchDropoff = context?.checkOutDate || dropoffDate;

    if (context) {
        setLocation(searchLocation);
        setPickupDate(searchPickup);
        setDropoffDate(searchDropoff);
    }

    performSearch(searchLocation, searchPickup, searchDropoff);
  // We only want this to run once on mount, or when context is provided.
  // The performSearch function is stable.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [context, performSearch]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    performSearch(location, pickupDate, dropoffDate);
  };
  
  const handleSelectCar = (car: Car) => {
    setSelectedCar(car);
    setStep('details');
  };
  
  const handleProceedToDriverInfo = () => {
    setStep('driver');
  };

  const handleDriverInfoSubmit = (driverInfo: Driver) => {
    setDriver(driverInfo);
    setStep('confirmation');
  };
  
  const handleBookingConfirmed = async (totalPrice: number) => {
    if (!selectedCar || !driver) {
      throw new Error("Missing car or driver information for booking.");
    }

    try {
      const newBooking = await createCarBooking(
        selectedCar,
        driver,
        pickupDate,
        dropoffDate,
        location,
        totalPrice
      );
      setBookingResult(newBooking);
    } catch (err) {
      console.error("Booking creation failed:", err);
      throw err;
    }
  };

  const proceedToSuccessStep = () => {
    setStep('success');
  };
  
  const handleBack = () => {
    if (step === 'success') {
        performSearch(location, pickupDate, dropoffDate);
    } else if (step === 'confirmation') {
        setStep('driver');
    } else if (step === 'driver') {
        setStep('details');
    } else if (step === 'details') {
        setStep('search');
        setSelectedCar(null);
    }
  }

  const renderContent = () => {
      switch(step) {
          case 'details':
              return selectedCar ? <CarDetailPage car={selectedCar} onReserve={handleProceedToDriverInfo} onBack={handleBack} pickupDate={pickupDate} dropoffDate={dropoffDate} /> : null;
          case 'driver':
              return selectedCar ? <CarDriverInfoPage car={selectedCar} onSubmit={handleDriverInfoSubmit} onBack={handleBack} /> : null;
          case 'confirmation':
              return (selectedCar && driver) ? <CarBookingConfirmationPage car={selectedCar} driver={driver} onConfirm={handleBookingConfirmed} onBack={handleBack} onBookingComplete={proceedToSuccessStep} pickupDate={pickupDate} dropoffDate={dropoffDate} location={location} /> : null;
          case 'success':
              return bookingResult ? <CarBookingSuccessPage booking={bookingResult} onNewBooking={() => performSearch(location, pickupDate, dropoffDate)} /> : null;
          case 'search':
          default:
              return (
                  <>
                    {isLoading && <Spinner message="Finding available cars..." />}
                    {error && !isLoading && <div className="text-center text-red-600 bg-red-100 p-4 rounded-md mb-4 border border-red-200">{error}</div>}
                    {cars && cars.length > 0 && (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {cars.map(car => <CarCard key={car.id} car={car} onSelect={handleSelectCar} />)}
                        </div>
                    )}
                    {!isLoading && (!cars || cars.length === 0) && !error && (
                        <div className="text-center py-10 text-slate-500">
                            <p>No cars found for the selected criteria. Please try a different search.</p>
                        </div>
                    )}
                  </>
              );
      }
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900">Rent a Car</h1>
        <p className="text-slate-600 mt-1">Explore our fleet and book your ride with ease.</p>
      </div>

      <Card className="p-6 mb-8 bg-white border border-slate-200">
        <form onSubmit={handleSearchSubmit} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
          <div className="flex flex-col lg:col-span-2">
            <label htmlFor="location" className="text-sm font-medium text-slate-700 mb-1">City</label>
            <input id="location" type="text" value={location} onChange={(e) => setLocation(e.target.value)} className="bg-white border border-slate-300 rounded-md px-3 py-2 text-slate-900 focus:ring-2 focus:ring-sky-500 focus:outline-none" placeholder="e.g., Tehran" />
          </div>
          <div className="flex flex-col">
            <label htmlFor="pickup" className="text-sm font-medium text-slate-700 mb-1">Pickup Date</label>
            <input id="pickup" type="date" value={pickupDate} onChange={(e) => setPickupDate(e.target.value)} className="bg-white border border-slate-300 rounded-md px-3 py-2 text-slate-900 focus:ring-2 focus:ring-sky-500 focus:outline-none" />
          </div>
          <div className="flex flex-col">
            <label htmlFor="dropoff" className="text-sm font-medium text-slate-700 mb-1">Drop-off Date</label>
            <input id="dropoff" type="date" value={dropoffDate} onChange={(e) => setDropoffDate(e.target.value)} className="bg-white border border-slate-300 rounded-md px-3 py-2 text-slate-900 focus:ring-2 focus:ring-sky-500 focus:outline-none" />
          </div>
          <button type="submit" disabled={isLoading} className="bg-sky-600 text-white px-4 py-2 rounded-md font-semibold hover:bg-sky-500 transition-colors duration-200 disabled:bg-slate-500 disabled:cursor-not-allowed h-fit w-full">
            {isLoading ? 'Searching...' : 'Search Cars'}
          </button>
        </form>
      </Card>
      
      {renderContent()}
    </div>
  );
};

export default CarRentalPage;
