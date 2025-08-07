import React, { useState } from 'react';
import Card from '../../../components/Card';

const SellGiftCardForm: React.FC = () => {
    const [brand, setBrand] = useState('');
    const [balance, setBalance] = useState('');
    const [price, setPrice] = useState('');
    const [cardNumber, setCardNumber] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // In a real app, this would submit to the backend for validation and listing.
        // Here, we just simulate the success message.
        alert(`Your ${brand} gift card with a balance of $${balance} has been listed for sale at $${price}.`);
        // Reset form
        setBrand('');
        setBalance('');
        setPrice('');
        setCardNumber('');
    };

    const discount = (parseFloat(balance) > 0 && parseFloat(price) > 0)
        ? (((parseFloat(balance) - parseFloat(price)) / parseFloat(balance)) * 100).toFixed(1)
        : '0';

    return (
        <Card className="max-w-lg mx-auto p-6 border-slate-200">
            <h2 className="text-2xl font-bold text-slate-900 mb-1">Sell Your Gift Card</h2>
            <p className="text-slate-600 mb-6">Enter the details below to list your card on the marketplace.</p>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label htmlFor="brand" className="block text-sm font-medium text-slate-700 mb-1">Brand</label>
                    <input id="brand" type="text" value={brand} onChange={e => setBrand(e.target.value)} required placeholder="e.g., Amazon, Starbucks" className="w-full bg-slate-100 border-slate-300 rounded-md p-2" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label htmlFor="balance" className="block text-sm font-medium text-slate-700 mb-1">Card Balance ($)</label>
                        <input id="balance" type="number" step="0.01" value={balance} onChange={e => setBalance(e.target.value)} required placeholder="50.00" className="w-full bg-slate-100 border-slate-300 rounded-md p-2" />
                    </div>
                     <div>
                        <label htmlFor="price" className="block text-sm font-medium text-slate-700 mb-1">Selling Price ($)</label>
                        <input id="price" type="number" step="0.01" value={price} onChange={e => setPrice(e.target.value)} required placeholder="45.00" className="w-full bg-slate-100 border-slate-300 rounded-md p-2" />
                    </div>
                </div>
                 {parseFloat(discount) > 0 &&
                    <p className="text-sm text-center text-green-600 bg-green-50 p-2 rounded-md">
                        You're offering a {discount}% discount.
                    </p>
                }
                <div>
                    <label htmlFor="cardNumber" className="block text-sm font-medium text-slate-700 mb-1">Card Number (mock)</label>
                    <input id="cardNumber" type="text" value={cardNumber} onChange={e => setCardNumber(e.target.value)} required placeholder="Enter the gift card number" className="w-full bg-slate-100 border-slate-300 rounded-md p-2" />
                </div>
                <div className="text-xs text-slate-500 pt-2 border-t">
                    <strong>Note:</strong> In a real application, we would securely validate the card balance before listing. Funds from the sale will be held in escrow and released to your wallet upon confirmation by the buyer.
                </div>
                <button type="submit" className="w-full bg-teal-600 text-white py-3 rounded-md font-semibold text-lg hover:bg-teal-700">
                    List My Card
                </button>
            </form>
        </Card>
    );
};

export default SellGiftCardForm;
