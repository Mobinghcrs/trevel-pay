import React, { useState, useEffect } from 'react';
import { Deal, Page } from '../../types';
import Card from '../../components/Card';
import { useNavigation } from '../../contexts/NavigationContext';

const CountdownTimer: React.FC<{ targetDate: string }> = ({ targetDate }) => {
    const calculateTimeLeft = () => {
        const difference = +new Date(targetDate) - +new Date();
        let timeLeft = { days: 0, hours: 0, minutes: 0, seconds: 0 };

        if (difference > 0) {
            timeLeft = {
                days: Math.floor(difference / (1000 * 60 * 60 * 24)),
                hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
                minutes: Math.floor((difference / 1000 / 60) % 60),
                seconds: Math.floor((difference / 1000) % 60),
            };
        }
        return timeLeft;
    };

    const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

    useEffect(() => {
        const timer = setTimeout(() => {
            setTimeLeft(calculateTimeLeft());
        }, 1000);

        return () => clearTimeout(timer);
    });

    const { days, hours, minutes, seconds } = timeLeft;
    const hasTimeLeft = days > 0 || hours > 0 || minutes > 0 || seconds > 0;

    return (
        <div className="text-xs text-red-700 font-semibold">
            {hasTimeLeft ? (
                <div className="flex items-center gap-2">
                    <span>Ends in:</span>
                    <span className="font-mono" dir="ltr">{`${String(days).padStart(2, '0')}:${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`}</span>
                </div>
            ) : (
                <span>Expired</span>
            )}
        </div>
    );
};


const DealCard: React.FC<{ deal: Deal }> = ({ deal }) => {
    const { navigate } = useNavigation();
    
    const handleSelect = () => {
        navigate('deal-booking', { deal });
    };

    const progressPercentage = (deal.soldCount / deal.totalAvailable) * 100;

    const dealPrice = deal.originalPrice * (1 - deal.discountPercentage / 100);

    const categoryTranslations: {[key: string]: string} = {
        hotel: 'Hotel',
        tour: 'Tour',
        product: 'Product'
    }

    return (
        <Card onClick={handleSelect} className="flex flex-col md:flex-row gap-0 overflow-hidden border-slate-200 group">
            <div className="relative md:w-1/3">
                <img src={deal.imageUrl} alt={deal.title} className="w-full h-48 md:h-full object-cover transition-transform duration-300 group-hover:scale-110" />
                <div className="absolute top-3 left-3 bg-red-600 text-white font-bold px-3 py-1.5 rounded-md text-lg">
                    {deal.discountPercentage}% OFF
                </div>
            </div>
            <div className="p-5 flex flex-col flex-grow md:w-2/3">
                <span className="text-sm font-semibold text-teal-600 mb-1 uppercase">{categoryTranslations[deal.category]}</span>
                <h3 className="text-xl font-bold text-slate-900 mb-2 flex-grow">{deal.title}</h3>
                
                <div className="flex items-end gap-4 mb-4">
                    <p className="text-slate-500 line-through text-lg">${deal.originalPrice.toLocaleString('en-US')}</p>
                    <p className="text-red-600 font-bold text-3xl">${dealPrice.toLocaleString('en-US')}</p>
                </div>

                <div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5 mb-1">
                        <div className="bg-teal-500 h-2.5 rounded-full" style={{ width: `${progressPercentage}%` }}></div>
                    </div>
                    <div className="flex justify-between text-xs text-gray-600">
                        <span>{deal.soldCount} sold</span>
                        <CountdownTimer targetDate={deal.validUntil} />
                    </div>
                </div>
            </div>
        </Card>
    );
};

export default DealCard;