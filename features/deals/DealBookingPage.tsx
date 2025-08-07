import React, { useState } from 'react';
import { Deal, ShippingAddress, HotelGuest } from '../../types';
import { useNavigation } from '../../contexts/NavigationContext';
import Card from '../../components/Card';
import PaymentModal from '../../components/PaymentModal';
import { createDealOrder } from '../../services/apiService';

// --- Form Sub-components ---

const BookerInfoForm: React.FC<{ onSubmit: (details: Pick<HotelGuest, 'fullName' | 'email'>) => void }> = ({ onSubmit }) => {
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit({ fullName, email });
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label htmlFor="fullName" className="block text-sm font-medium text-slate-700 mb-1">Full Name</label>
                <input id="fullName" type="text" value={fullName} onChange={e => setFullName(e.target.value)} required className="w-full bg-white border border-slate-300 rounded-md px-3 py-2" placeholder="Primary Guest / Booker" />
            </div>
            <div>
                <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-1">Email Address</label>
                <input id="email" type="email" value={email} onChange={e => setEmail(e.target.value)} required className="w-full bg-white border border-slate-300 rounded-md px-3 py-2" placeholder="For booking confirmation" />
            </div>
            <button type="submit" className="w-full bg-teal-600 text-white py-3 rounded-md font-semibold hover:bg-teal-700">
                Confirm & Pay
            </button>
        </form>
    );
};

const ShippingAddressForm: React.FC<{ onSubmit: (details: ShippingAddress) => void }> = ({ onSubmit }) => {
    const [address, setAddress] = useState<ShippingAddress>({ fullName: '', streetAddress: '', city: '', postalCode: '', country: '' });

    const handleChange = (field: keyof ShippingAddress, value: string) => {
        setAddress(prev => ({ ...prev, [field]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit(address);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label htmlFor="fullName" className="block text-sm font-medium text-slate-700 mb-1">Full Name</label>
                <input id="fullName" value={address.fullName} onChange={e => handleChange('fullName', e.target.value)} required className="w-full bg-white border border-slate-300 rounded-md px-3 py-2" />
            </div>
            <div>
                <label htmlFor="streetAddress" className="block text-sm font-medium text-slate-700 mb-1">Street Address</label>
                <input id="streetAddress" value={address.streetAddress} onChange={e => handleChange('streetAddress', e.target.value)} required className="w-full bg-white border border-slate-300 rounded-md px-3 py-2" />
            </div>
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label htmlFor="city" className="block text-sm font-medium text-slate-700 mb-1">City</label>
                    <input id="city" value={address.city} onChange={e => handleChange('city', e.target.value)} required className="w-full bg-white border border-slate-300 rounded-md px-3 py-2" />
                </div>
                <div>
                    <label htmlFor="postalCode" className="block text-sm font-medium text-slate-700 mb-1">Postal Code</label>
                    <input id="postalCode" value={address.postalCode} onChange={e => handleChange('postalCode', e.target.value)} required className="w-full bg-white border border-slate-300 rounded-md px-3 py-2" />
                </div>
            </div>
            <div>
                <label htmlFor="country" className="block text-sm font-medium text-slate-700 mb-1">Country</label>
                <input id="country" value={address.country} onChange={e => handleChange('country', e.target.value)} required className="w-full bg-white border border-slate-300 rounded-md px-3 py-2" />
            </div>
            <button type="submit" className="w-full bg-teal-600 text-white py-3 rounded-md font-semibold hover:bg-teal-700">
                Confirm & Pay
            </button>
        </form>
    );
};

// --- Main Component ---

interface DealBookingPageProps {
    context: {
        deal: Deal;
    };
}

const DealBookingPage: React.FC<DealBookingPageProps> = ({ context }) => {
    const { deal } = context;
    const { navigate } = useNavigation();
    
    const [bookingDetails, setBookingDetails] = useState<Pick<HotelGuest, 'fullName' | 'email'> | ShippingAddress | null>(null);
    const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
    const [paymentWasSuccessful, setPaymentWasSuccessful] = useState(false);

    const dealPrice = deal.originalPrice * (1 - deal.discountPercentage / 100);

    const handleInfoSubmit = (details: Pick<HotelGuest, 'fullName' | 'email'> | ShippingAddress) => {
        setBookingDetails(details);
        setIsPaymentModalOpen(true);
    };

    const handlePaymentSuccess = async () => {
        if (!bookingDetails) return;
        try {
            await createDealOrder(deal, bookingDetails);
            setPaymentWasSuccessful(true);
        } catch (e) {
            throw e; // Re-throw to be caught by the payment modal
        }
    };
    
    const handleModalClose = () => {
        setIsPaymentModalOpen(false);
        if (paymentWasSuccessful) {
            alert('Deal purchased successfully!');
            navigate('orders');
        }
    };
    
    const formTitle = deal.category === 'product' ? 'Shipping Information' : 'Booker Information';

    return (
        <>
            <div className="max-w-3xl mx-auto">
                <button onClick={() => navigate('deals')} className="text-sm text-teal-600 hover:underline mb-4 font-semibold">&larr; Back to All Deals</button>
                <h1 className="text-3xl font-bold text-slate-900 mb-6">Complete Your Deal Purchase</h1>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
                    {/* Deal Summary */}
                    <Card className="p-4 border-slate-200">
                        <img src={deal.imageUrl} alt={deal.title} className="w-full h-48 object-cover rounded-lg mb-4" />
                        <h2 className="text-xl font-bold text-slate-800">{deal.title}</h2>
                        <div className="flex items-baseline gap-3 my-2">
                             <p className="text-slate-500 line-through text-lg">${deal.originalPrice.toLocaleString('en-US')}</p>
                             <p className="text-red-600 font-bold text-3xl">${dealPrice.toLocaleString('en-US')}</p>
                        </div>
                        <p className="text-sm text-slate-600">{deal.soldCount} of {deal.totalAvailable} sold.</p>
                    </Card>

                    {/* Information Form */}
                    <Card className="p-6 border-slate-200">
                        <h3 className="text-xl font-bold text-slate-800 mb-4">{formTitle}</h3>
                        {deal.category === 'product' ? (
                            <ShippingAddressForm onSubmit={handleInfoSubmit as (details: ShippingAddress) => void} />
                        ) : (
                            <BookerInfoForm onSubmit={handleInfoSubmit as (details: Pick<HotelGuest, 'fullName' | 'email'>) => void} />
                        )}
                    </Card>
                </div>
            </div>

            <PaymentModal
                isOpen={isPaymentModalOpen}
                onClose={handleModalClose}
                amount={dealPrice}
                onSuccess={handlePaymentSuccess}
            />
        </>
    );
};

export default DealBookingPage;