import React from 'react';
import { GiftCard } from '../../../types';
import Card from '../../../components/Card';

interface GiftCardListingCardProps {
    giftCard: GiftCard;
    onBuy: (card: GiftCard) => void;
}

const GiftCardListingCard: React.FC<GiftCardListingCardProps> = ({ giftCard, onBuy }) => {
    const discount = ((giftCard.balance - giftCard.price) / giftCard.balance) * 100;

    return (
        <Card className="flex flex-col group overflow-hidden border-slate-200 p-0">
            <div className="bg-slate-100 p-4 flex justify-center items-center h-24">
                <img src={giftCard.logoUrl} alt={`${giftCard.brand} logo`} className="max-h-12 max-w-[120px] object-contain" />
            </div>
            <div className="p-4 flex flex-col flex-grow">
                <h3 className="text-lg font-bold text-slate-800">{giftCard.brand}</h3>
                <div className="my-3">
                    <p className="text-sm text-slate-500">Card Value</p>
                    <p className="text-2xl font-bold text-slate-900">${giftCard.balance.toFixed(2)}</p>
                </div>
                <div className="mt-auto pt-3 border-t border-slate-200">
                    <div className="flex justify-between items-center">
                         <div>
                            <p className="text-sm text-slate-500">Your Price</p>
                            <p className="text-lg font-bold text-teal-600">${giftCard.price.toFixed(2)}</p>
                        </div>
                        <span className="text-sm font-semibold bg-red-100 text-red-700 px-2 py-1 rounded-md">
                            {discount.toFixed(0)}% OFF
                        </span>
                    </div>
                    <button
                        onClick={() => onBuy(giftCard)}
                        className="w-full mt-4 bg-teal-600 text-white py-2 rounded-md font-semibold hover:bg-teal-700 transition-colors"
                    >
                        Buy Now
                    </button>
                </div>
            </div>
        </Card>
    );
};

export default GiftCardListingCard;
