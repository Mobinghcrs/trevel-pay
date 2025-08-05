import React, { useState, useCallback, useEffect } from 'react';
import { Flight, FlightBookingStep, Passenger, FlightOrder } from '../../types';
import { searchFlights, createFlightBooking } from '../../services/apiService';
import Spinner from '../../components/Spinner';
import FlightResults from './FlightResults';
import PassengerInfoPage from './PassengerInfoPage';
import BookingConfirmationPage from './BookingConfirmationPage';
import FlightBookingSuccessPage from './FlightBookingSuccessPage';
import DateScroller from './DateScroller';
import FlightSearchForm from './FlightSearchForm';
import { ICONS } from '../../constants';

interface FlightSearchPageProps {
  context?: {
    origin?: string;
    destination?: string;
    date?: string;
  } | null;
}

const FlightSearchPage: React.FC<FlightSearchPageProps> = ({ context }) => {
  // Search form state
  const [origin, setOrigin] = useState(context?.origin || 'New York');
  const [destination, setDestination] = useState(context?.destination || 'London');
  const [date, setDate] = useState(context?.date || new Date().toISOString().split('T')[0]);
  
  // View State: 'search' or 'results'
  const [view, setView] = useState<'search' | 'results'>(context ? 'results' : 'search');

  // API state
  const [flights, setFlights] = useState<Flight[] | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const performSearch = useCallback(async (searchOrigin: string, searchDestination: string, searchDate: string) => {
    // Update state for results page header and form pre-population
    setOrigin(searchOrigin);
    setDestination(searchDestination);
    setDate(searchDate);

    setIsLoading(true);
    setError(null);
    setFlights(null);
    setView('results'); // Switch view to results

    try {
      const results = await searchFlights(searchOrigin, searchDestination, searchDate);
      setFlights(results);
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : 'An unknown error occurred.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Trigger initial search if context is provided (e.g., from AI assistant)
  useEffect(() => {
    if (context) {
      performSearch(
        context.origin || 'New York',
        context.destination || 'London',
        context.date || new Date().toISOString().split('T')[0]
      );
    }
  // This should only run when context changes.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [context]);

  const handleDateChange = (newDate: string) => {
    performSearch(origin, destination, newDate);
  };
  
  const handleModifySearch = () => {
    setView('search');
    setFlights(null);
    setError(null);
  };

  const handleSelectFlight = (flight: Flight) => {
    setSelectedFlight(flight);
    setStep('passengers');
  };

  const handlePassengerSubmit = (passengerData: Passenger[]) => {
    setPassengers(passengerData);
    setStep('confirmation');
  };

  const handleBookingConfirmed = async (totalPrice: number) => {
    if (!selectedFlight || !passengers.length) {
      throw new Error("Missing flight or passenger information for booking.");
    }
    try {
      const newBooking = await createFlightBooking(selectedFlight, passengers, totalPrice);
      setBookingResult(newBooking);
    } catch (err) {
      console.error("Booking creation failed:", err);
      throw err; // Re-throw to be caught by the payment modal
    }
  };

  const proceedToTicketStep = () => {
    setStep('ticket');
  };
  
  const handleBack = () => {
    if (step === 'ticket') {
      setView('search'); // Go back to the main search form
      setSelectedFlight(null);
      setPassengers([]);
      setBookingResult(null);
    } else if (step === 'confirmation') {
        setStep('passengers');
    } else if (step === 'passengers') {
        setStep('search'); // This state corresponds to the results view now
        setSelectedFlight(null);
    }
  }

  // Booking flow state
  const [step, setStep] = useState<FlightBookingStep>('search');
  const [selectedFlight, setSelectedFlight] = useState<Flight | null>(null);
  const [passengers, setPassengers] = useState<Passenger[]>([]);
  const [bookingResult, setBookingResult] = useState<FlightOrder | null>(null);

  // Render booking flow pages if we've moved past the results step
  if (step === 'passengers' && selectedFlight) {
    return <PassengerInfoPage flight={selectedFlight} onSubmit={handlePassengerSubmit} onBack={handleBack} />;
  }
  
  if (step === 'confirmation' && selectedFlight) {
    return (
      <BookingConfirmationPage
        flight={selectedFlight}
        passengers={passengers}
        onConfirm={handleBookingConfirmed}
        onBack={handleBack}
        onBookingComplete={proceedToTicketStep}
      />
    );
  }
  
  if (step === 'ticket' && bookingResult) {
    return <FlightBookingSuccessPage order={bookingResult} onNewBooking={handleBack} />
  }

  // Main view rendering logic
  if (view === 'search') {
    return (
      <FlightSearchForm
        onSearch={performSearch}
        initialOrigin={origin}
        initialDestination={destination}
        initialDate={date}
        isLoading={isLoading}
      />
    );
  }

  // Results view
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-slate-900">Flight Tickets</h1>
        <p className="text-slate-600 mt-1">From {origin} to {destination}</p>
      </div>

      <div className="mb-6">
        <DateScroller currentDate={date} onDateChange={handleDateChange} />
      </div>

      <div className="flex items-center gap-4 mb-6">
        <button onClick={handleModifySearch} className="flex-1 bg-white border border-slate-300 rounded-lg py-2 px-4 text-slate-700 font-semibold flex items-center justify-center gap-2 hover:bg-slate-100 transition-colors">
            {ICONS.edit}
            Modify Search
        </button>
        <button className="flex-1 bg-white border border-slate-300 rounded-lg py-2 px-4 text-slate-700 font-semibold flex items-center justify-center gap-2 hover:bg-slate-100 transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12" /></svg>
          Sort
        </button>
        <button className="flex-1 bg-white border border-slate-300 rounded-lg py-2 px-4 text-slate-700 font-semibold flex items-center justify-center gap-2 hover:bg-slate-100 transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1v-2zM14 10a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 01-1 1h-2a1 1 0 01-1-1v-2z" /></svg>
          Filter
        </button>
      </div>
      
      {isLoading && <Spinner message="Finding flights..." />}
      {error && !isLoading && <div className="text-center text-red-600 bg-red-100 p-4 rounded-md mb-4 border border-red-200">{error}</div>}
      {flights && <FlightResults flights={flights} onSelectFlight={handleSelectFlight} />}
    </div>
  );
};

export default FlightSearchPage;
