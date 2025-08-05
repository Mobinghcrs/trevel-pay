import React, { useState } from 'react';
import Card from '../../components/Card';
import { COMMON_FIAT_CURRENCIES } from '../../constants';
import { createCashDeliveryRequest } from '../../services/apiService';

const CashDeliveryPage: React.FC = () => {
    const [currency, setCurrency] = useState('USD');
    const [amount, setAmount] = useState('100');
    const [country, setCountry] = useState('');
    const [city, setCity] = useState('');
    const [address, setAddress] = useState('');
    const [contact, setContact] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!currency || !amount || !country || !city || !address || !contact) {
            alert('Please fill out all fields.');
            return;
        }
        setIsLoading(true);
        try {
            await createCashDeliveryRequest({
                currency,
                amount,
                country,
                city,
                address,
                contact,
            });
            
            alert('Your cash delivery request has been submitted and is pending review in the admin panel.');
            
            // Reset form
            setCurrency('USD');
            setAmount('100');
            setCountry('');
            setCity('');
            setAddress('');
            setContact('');

        } catch (error) {
            console.error('Failed to save cash delivery request:', error);
            alert(`There was an error submitting your request: ${error instanceof Error ? error.message : 'Unknown error'}`);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex justify-center">
            <Card className="max-w-lg w-full border-slate-200">
                <div className="p-6 border-b border-slate-200">
                    <h2 className="text-xl font-bold text-slate-900">Request Cash Delivery</h2>
                    <p className="text-sm text-slate-600">Get foreign currency delivered to your location. Perfect for tourists.</p>
                </div>
                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="cash-currency" className="block text-sm font-medium text-slate-700 mb-1">Currency</label>
                            <select
                                id="cash-currency"
                                value={currency}
                                onChange={e => setCurrency(e.target.value)}
                                className="w-full bg-white border border-slate-300 rounded-md px-3 py-2 text-slate-900 focus:ring-2 focus:ring-teal-500 focus:outline-none"
                            >
                                {COMMON_FIAT_CURRENCIES.map(c => <option key={c.symbol} value={c.symbol}>{c.name} ({c.symbol})</option>)}
                            </select>
                        </div>
                        <div>
                            <label htmlFor="cash-amount" className="block text-sm font-medium text-slate-700 mb-1">Amount</label>
                            <input
                                id="cash-amount"
                                type="number"
                                value={amount}
                                onChange={e => setAmount(e.target.value)}
                                className="w-full bg-white border border-slate-300 rounded-md px-3 py-2 text-slate-900 focus:ring-2 focus:ring-teal-500 focus:outline-none"
                                placeholder="e.g., 500"
                                required
                            />
                        </div>
                    </div>
                     <div>
                        <label htmlFor="cash-country" className="block text-sm font-medium text-slate-700 mb-1">Country</label>
                        <input
                            id="cash-country"
                            type="text"
                            value={country}
                            onChange={e => setCountry(e.target.value)}
                            className="w-full bg-white border border-slate-300 rounded-md px-3 py-2 text-slate-900 focus:ring-2 focus:ring-teal-500 focus:outline-none"
                            placeholder="e.g., Japan"
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="cash-city" className="block text-sm font-medium text-slate-700 mb-1">City</label>
                        <input
                            id="cash-city"
                            type="text"
                            value={city}
                            onChange={e => setCity(e.target.value)}
                            className="w-full bg-white border border-slate-300 rounded-md px-3 py-2 text-slate-900 focus:ring-2 focus:ring-teal-500 focus:outline-none"
                            placeholder="e.g., Tokyo"
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="cash-address" className="block text-sm font-medium text-slate-700 mb-1">Delivery Address</label>
                        <textarea
                            id="cash-address"
                            value={address}
                            onChange={e => setAddress(e.target.value)}
                            className="w-full bg-white border border-slate-300 rounded-md px-3 py-2 text-slate-900 focus:ring-2 focus:ring-teal-500 focus:outline-none"
                            placeholder="e.g., 123 Main Street, Shibuya Crossing"
                            rows={3}
                            required
                        ></textarea>
                    </div>
                     <div>
                        <label htmlFor="cash-contact" className="block text-sm font-medium text-slate-700 mb-1">Contact Phone Number</label>
                        <input
                            id="cash-contact"
                            type="tel"
                            value={contact}
                            onChange={e => setContact(e.target.value)}
                            className="w-full bg-white border border-slate-300 rounded-md px-3 py-2 text-slate-900 focus:ring-2 focus:ring-teal-500 focus:outline-none"
                            placeholder="For delivery coordination"
                            required
                        />
                    </div>
                    <button type="submit" disabled={isLoading} className="w-full bg-teal-600 text-white px-4 py-3 rounded-md font-semibold hover:bg-teal-700 transition-all duration-200 disabled:bg-slate-400">
                        {isLoading ? 'Submitting...' : 'Request Delivery'}
                    </button>
                </form>
            </Card>
        </div>
    );
};

export default CashDeliveryPage;