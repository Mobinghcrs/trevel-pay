
import React, { useState, MouseEvent, useEffect, useMemo } from 'react';
import { RideOption, TaxiOrder, RideProvider, TaxiStep } from '../../types';
import { searchRides, bookRide } from '../../services/apiService';
import Card from '../../components/Card';
import Spinner from '../../components/Spinner';
import { ICONS } from '../../constants';

// --- Helper Components for the Map UI ---

const MapPin: React.FC<{ coords: { x: number, y: number }, type: 'from' | 'to' }> = ({ coords, type }) => {
    const isFrom = type === 'from';
    const color = isFrom ? 'text-teal-500' : 'text-red-500';
    const icon = isFrom ? ICONS.mapPin : ICONS.flag;
    
    return (
        <div 
            className={`absolute transform -translate-x-1/2 -translate-y-full ${color} transition-all duration-300 ease-in-out`}
            style={{ left: coords.x, top: coords.y, pointerEvents: 'none' }}
        >
            <div className="h-8 w-8">{icon}</div>
        </div>
    );
};

const LocationInput: React.FC<{
    label: string;
    value: string;
    onChange: (value: string) => void;
    onFocus: () => void;
    isActive: boolean;
    placeholder: string;
}> = ({ label, value, onChange, onFocus, isActive, placeholder }) => (
    <div>
        <label className="text-sm font-medium text-slate-700 mb-1 block">{label}</label>
        <input 
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onFocus={onFocus}
            placeholder={placeholder}
            className={`w-full bg-slate-100 border border-slate-300 rounded-md px-3 py-2 text-slate-900 transition-all ${isActive ? 'ring-2 ring-teal-500' : ''}`}
        />
    </div>
);

// --- Main Page Components ---

const RideOptions: React.FC<{ options: RideOption[]; onSelect: (option: RideOption) => void; }> = ({ options, onSelect }) => {
    const groupedOptions = options.reduce((acc, option) => {
        if (!acc[option.provider]) {
            acc[option.provider] = [];
        }
        acc[option.provider].push(option);
        return acc;
    }, {} as Record<RideProvider, RideOption[]>);

    const providers = Object.keys(groupedOptions) as RideProvider[];

    if (providers.length === 0) {
        return <p className="text-center text-slate-500 py-4">No rides found.</p>;
    }

    const providerDetails = {
        Snapp: { color: 'bg-green-500', initial: 'S' },
        Tapsi: { color: 'bg-orange-500', initial: 'T' },
    };

    return (
        <div className="space-y-6">
            {providers.map(provider => (
                <Card key={provider} className="p-0 border-slate-200 overflow-hidden">
                    <div className="p-4 bg-slate-50 flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-full ${providerDetails[provider].color} text-white flex items-center justify-center font-bold text-lg`}>
                            {providerDetails[provider].initial}
                        </div>
                        <h3 className="text-lg font-bold text-slate-800">{provider}</h3>
                    </div>
                    <div className="divide-y divide-slate-200">
                        {groupedOptions[provider].sort((a,b) => a.price - b.price).map(option => (
                            <button
                                key={option.rideType}
                                onClick={() => onSelect(option)}
                                className="w-full flex items-center justify-between p-4 hover:bg-teal-50 transition-colors text-left"
                            >
                                <div className="flex items-center gap-4">
                                    <div className="text-slate-500">{option.rideType === 'Eco' ? ICONS.car : ICONS.taxi}</div>
                                    <div>
                                        <p className="font-semibold text-slate-800">{option.rideType}</p>
                                        <p className="text-xs text-slate-500">~{option.eta} min away</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="font-bold text-slate-900">{option.price.toLocaleString('fa-IR')} <span className="text-sm font-normal">IRR</span></p>
                                </div>
                            </button>
                        ))}
                    </div>
                </Card>
            ))}
        </div>
    );
};

const PaymentConfirmation: React.FC<{ option: RideOption; onConfirm: () => void; onBack: () => void; }> = ({ option, onConfirm, onBack }) => (
    <Card className="p-6 border-slate-200">
        <h2 className="text-xl font-bold text-center mb-4">Confirm Your Ride</h2>
        <div className="bg-slate-100 p-4 rounded-lg space-y-2">
            <div className="flex justify-between">
                <span className="text-slate-600">Provider</span>
                <span className="font-semibold">{option.provider}</span>
            </div>
            <div className="flex justify-between">
                <span className="text-slate-600">Ride Type</span>
                <span className="font-semibold">{option.rideType}</span>
            </div>
            <div className="flex justify-between text-lg font-bold border-t pt-2 mt-2">
                <span>Total Price</span>
                <span className="font-mono">{option.price.toLocaleString('fa-IR')} IRR</span>
            </div>
        </div>
        <p className="text-xs text-center text-slate-500 my-4">Payment will be deducted from your wallet.</p>
        <div className="flex gap-4">
            <button onClick={onBack} className="w-full bg-slate-200 py-2 rounded-md font-semibold">Back</button>
            <button onClick={onConfirm} className="w-full bg-green-600 text-white py-2 rounded-md font-semibold hover:bg-green-500">Confirm &amp; Pay</button>
        </div>
    </Card>
);

const BookingProgress: React.FC<{ onCancel: () => void }> = ({ onCancel }) => (
    <div className="text-center p-8 flex flex-col items-center">
        <Spinner message="Finding a driver..." />
        <p className="text-slate-500 mt-4">This should only take a moment.</p>
        <button onClick={onCancel} className="mt-6 bg-red-100 text-red-700 px-4 py-2 rounded-md font-semibold hover:bg-red-200">
            Cancel Ride
        </button>
    </div>
);

const RideTracking: React.FC<{ order: TaxiOrder; onNewRide: () => void }> = ({ order, onNewRide }) => {
    const handleShare = () => {
        const shareText = `I'm on my way in a ${order.provider} (${order.driverInfo.carModel}).\nDriver: ${order.driverInfo.name}\nLicense Plate: ${order.driverInfo.licensePlate}.\n\nTrack my ride: [Simulated Link]`;
        if (navigator.share) {
            navigator.share({
                title: 'My Taxi Ride Details',
                text: shareText,
            }).catch(console.error);
        } else {
            // Fallback for browsers that don't support Web Share API
            navigator.clipboard.writeText(shareText).then(() => {
                alert('Ride details copied to clipboard!');
            }, (err) => {
                alert('Could not copy ride details. Please share them manually.');
                console.error('Could not copy text: ', err);
            });
        }
    };

    return (
     <Card className="p-6 border-slate-200">
        <h2 className="text-xl font-bold text-center mb-4">Driver is on the way!</h2>
        <div className="bg-slate-100 rounded-lg p-4 mb-4">
            <p className="text-center text-slate-600">Your driver will arrive in approximately <span className="font-bold text-teal-600">5 minutes</span>.</p>
        </div>
        <div className="flex items-center gap-4 p-4 border rounded-lg">
            <div className={`w-12 h-12 rounded-full ${order.provider === 'Snapp' ? 'bg-green-500' : 'bg-orange-500'} text-white flex items-center justify-center font-bold text-2xl`}>
                {order.driverInfo.name.charAt(0)}
            </div>
            <div>
                <p className="font-bold text-slate-800">{order.driverInfo.name}</p>
                <p className="text-sm text-slate-500">{order.driverInfo.carModel} &bull; ★ {order.driverInfo.rating}</p>
                <p className="text-sm font-mono bg-slate-200 px-2 py-1 rounded-md inline-block mt-1">{order.driverInfo.licensePlate}</p>
            </div>
        </div>
        <div className="mt-4 h-48 bg-slate-200 rounded-lg flex items-center justify-center">
            <p className="text-slate-500">[Mock Map of Driver Location]</p>
        </div>
        <div className="mt-4 flex flex-col sm:flex-row gap-2">
            <button onClick={handleShare} className="w-full bg-slate-600 text-white py-3 rounded-md font-semibold hover:bg-slate-700 flex items-center justify-center gap-2">
                {ICONS.share}
                <span>Share Ride</span>
            </button>
            <button onClick={onNewRide} className="w-full bg-teal-600 text-white py-3 rounded-md font-semibold hover:bg-teal-700">
                Request New Ride
            </button>
        </div>
    </Card>
    );
};


// --- Geocoding Simulation ---
const geocode = (address: string): { x: number; y: number } | null => {
    if (!address.trim()) return null;
    let hash = 0;
    for (let i = 0; i < address.length; i++) {
        const char = address.charCodeAt(i);
        hash = (hash << 5) - hash + char;
        hash |= 0; // Convert to 32bit integer
    }

    // These dimensions should match the map's aspect ratio
    const mapWidth = 500; 
    const mapHeight = 320;
    
    const x = (Math.abs(hash) % (mapWidth - 60)) + 30; // Keep pins away from edges
    const y = (Math.abs(hash >> 8) % (mapHeight - 60)) + 30;

    return { x, y };
};

const TaxiPage: React.FC<{ context?: any }> = ({ context }) => {
    // Flow state
    const [step, setStep] = useState<TaxiStep>('map_selection');
    
    // Location state
    const [selecting, setSelecting] = useState<'from' | 'to'>('from');
    const [country, setCountry] = useState('Iran');
    const [city, setCity] = useState('Tehran');
    const [origin, setOrigin] = useState('');
    const [destination, setDestination] = useState('');
    const [fromCoords, setFromCoords] = useState<{ x: number, y: number } | null>(null);
    const [toCoords, setToCoords] = useState<{ x: number, y: number } | null>(null);

    // API & Booking State
    const [rideOptions, setRideOptions] = useState<RideOption[]>([]);
    const [selectedOption, setSelectedOption] = useState<RideOption | null>(null);
    const [bookedOrder, setBookedOrder] = useState<TaxiOrder | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    
    const locations = {
      Iran: ['Tehran', 'Isfahan', 'Shiraz'],
      USA: ['New York', 'Los Angeles', 'Chicago'],
      France: ['Paris', 'Marseille', 'Lyon'],
    };

    // Update map pins when text inputs change
    useEffect(() => { setFromCoords(geocode(origin)); }, [origin]);
    useEffect(() => { setToCoords(geocode(destination)); }, [destination]);

    const resetSearch = () => {
        setStep('map_selection');
        setSelecting('from');
        setOrigin('');
        setDestination('');
        setRideOptions([]);
        setSelectedOption(null);
        setBookedOrder(null);
        setError(null);
    };

    const handleMapClick = (e: MouseEvent<HTMLDivElement>) => {
        if (step !== 'map_selection' || !selecting) return;

        const rect = e.currentTarget.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const mockAddress = `${city} | ${Math.round(x)}, ${Math.round(y)}`;

        if (selecting === 'from') {
            setOrigin(mockAddress);
            setSelecting('to');
        } else {
            setDestination(mockAddress);
            setSelecting(null);
        }
    };
    
    const handleSearchRides = async () => {
        if (!origin || !destination) return;
        setIsLoading(true);
        setError(null);
        try {
            const options = await searchRides(origin, destination);
            setRideOptions(options);
            setStep('options');
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to find rides.');
            setStep('map_selection');
        } finally {
            setIsLoading(false);
        }
    };
    
    const handleSelectRide = (option: RideOption) => {
        setSelectedOption(option);
        setStep('payment');
    };

    const handleConfirmBooking = async () => {
        if (!selectedOption) return;
        setStep('booking');
        try {
            // Simulate payment processing and finding driver
            await new Promise(res => setTimeout(res, 2500)); 
            const order = await bookRide(selectedOption, origin, destination);
            setBookedOrder(order);
            setStep('tracking');
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to book ride.');
            setStep('options'); // Go back to options if booking fails
        }
    };
    
    const citiesForSelectedCountry = useMemo(() => locations[country as keyof typeof locations] || [], [country]);
    
    useEffect(() => {
        setCity(citiesForSelectedCountry[0]);
    }, [citiesForSelectedCountry]);

    const renderContent = () => {
        switch (step) {
            case 'options': return <RideOptions options={rideOptions} onSelect={handleSelectRide} />;
            case 'payment': return selectedOption && <PaymentConfirmation option={selectedOption} onConfirm={handleConfirmBooking} onBack={() => setStep('options')} />;
            case 'booking': return <BookingProgress onCancel={() => setStep('options')} />;
            case 'tracking': return bookedOrder && <RideTracking order={bookedOrder} onNewRide={resetSearch} />;
            case 'map_selection': default:
                return (
                    <Card className="p-4 sm:p-6 bg-white border border-slate-200">
                        <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-sm font-medium text-slate-700 mb-1 block">Country</label>
                                    <select value={country} onChange={e => setCountry(e.target.value)} className="w-full bg-slate-100 border border-slate-300 rounded-md px-3 py-2 text-slate-900">
                                        {Object.keys(locations).map(c => <option key={c} value={c}>{c}</option>)}
                                    </select>
                                </div>
                                <div>
                                     <label className="text-sm font-medium text-slate-700 mb-1 block">City</label>
                                    <select value={city} onChange={e => setCity(e.target.value)} className="w-full bg-slate-100 border border-slate-300 rounded-md px-3 py-2 text-slate-900">
                                        {citiesForSelectedCountry.map(c => <option key={c} value={c}>{c}</option>)}
                                    </select>
                                </div>
                            </div>
                            <LocationInput label="Origin" value={origin} onChange={setOrigin} onFocus={() => setSelecting('from')} isActive={selecting === 'from'} placeholder="Type or click map for origin" />
                            <LocationInput label="Destination" value={destination} onChange={setDestination} onFocus={() => setSelecting('to')} isActive={selecting === 'to'} placeholder="Type or click map for destination"/>
                            
                            <div onClick={handleMapClick} className="relative w-full h-64 sm:h-80 bg-slate-200 rounded-lg cursor-crosshair overflow-hidden border border-slate-300">
                                <img src="https://www.mapbox.com/images/demos/satellite-streets-v11.png" className="absolute inset-0 w-full h-full object-cover opacity-50" alt="Map background" />
                                <div className="absolute inset-0 bg-black/10"></div>
                                {fromCoords && <MapPin coords={fromCoords} type="from" />}
                                {toCoords && <MapPin coords={toCoords} type="to" />}
                                {selecting && <p className="absolute top-2 left-2 bg-black/50 text-white text-xs px-2 py-1 rounded-md">Click to select {selecting}</p>}
                            </div>

                             <button onClick={handleSearchRides} disabled={!origin || !destination || isLoading} className="w-full bg-teal-600 text-white py-3 rounded-md font-semibold hover:bg-teal-700 disabled:bg-slate-400">
                                {isLoading ? 'Searching...' : 'Confirm Route & View Prices'}
                            </button>
                        </div>
                    </Card>
                );
        }
    };

    return (
        <div>
            <div className="text-center mb-8">
                <h1 className="text-3xl font-bold text-slate-900">Request a Ride</h1>
                <p className="text-slate-600 mt-1">Select your route to begin.</p>
            </div>
            
            {error && <p className="text-red-500 text-center mb-4">{error}</p>}

            {step !== 'map_selection' && step !== 'tracking' && (
                <div className="mb-4">
                    <button onClick={resetSearch} className="text-sm text-teal-600 hover:underline">&larr; Change Route</button>
                </div>
            )}
            
            {renderContent()}
        </div>
    );
};

export default TaxiPage;
