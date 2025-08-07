import React from 'react';
import { TourBookingOrder } from '../../types';
import Card from '../../components/Card';
import { ICONS } from '../../constants';

interface TourOrderCardProps {
  order: TourBookingOrder;
}

const TourOrderCard: React.FC<TourOrderCardProps> = ({ order }) => {
    const formatDate = (dateString: string) => new Date(dateString).toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' });

    return (
        <Card className="border-slate-200">
            <div className="p-4 flex items-center gap-4">
                <div className="p-3 rounded-full bg-slate-100 text-teal-600">
                    {ICONS.tourism}
                </div>
                <div className="flex-grow grid grid-cols-2 sm:grid-cols-4 gap-4 items-center w-full">
                    <div>
                        <p className="font-bold text-lg text-slate-800">Tour Booking</p>
                        <p className="text-xs text-slate-500">{new Date(order.timestamp).toLocaleString()}</p>
                    </div>
                    <div>
                        <p className="text-sm text-slate-500">Tour</p>
                        <p className="font-semibold text-slate-800 truncate">{order.tour.name}</p>
                    </div>
                    <div>
                        <p className="text-sm text-slate-500">Date</p>
                        <p className="font-semibold text-slate-800">{formatDate(order.bookingDate)}</p>
                    </div>
                    <div>
                        <p className="text-sm text-slate-500">Total Price</p>
                        <p className="font-mono font-semibold text-slate-800">${order.totalPrice.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                    </div>
                </div>
            </div>
        </Card>
    );
};

export default TourOrderCard;