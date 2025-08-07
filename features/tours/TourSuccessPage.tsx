import React from 'react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import QRCode from 'react-qr-code';
import { TourBookingOrder } from '../../types';
import Card from '../../components/Card';
import { ICONS } from '../../constants';

interface TourSuccessPageProps {
  order: TourBookingOrder;
  onNewBooking: () => void;
}

const TourSuccessPage: React.FC<TourSuccessPageProps> = ({ order, onNewBooking }) => {
    const formatDate = (dateString: string) => new Date(dateString).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
    const qrValue = JSON.stringify({ bookingId: order.id, tour: order.tour.name, guests: order.guests });

    const handleDownloadPDF = () => {
        const doc = new jsPDF();
        doc.setFontSize(22);
        doc.text("Tour & Activity Voucher", 14, 22);
        doc.setFontSize(12);
        doc.text(`Booking ID: ${order.id}`, 14, 30);
        
        autoTable(doc, {
            startY: 40,
            body: [
                ['Tour Name', order.tour.name],
                ['Destination', order.tour.destination],
                ['Date', formatDate(order.bookingDate)],
                ['Number of Guests', order.guests.toString()],
                ['Total Paid', `$${order.totalPrice.toFixed(2)}`],
            ],
        });
        
        doc.save(`TravelPay_Tour_Voucher_${order.id.slice(-6)}.pdf`);
    };

    return (
        <div className="max-w-md mx-auto">
            <div className="text-center mb-6">
                <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-4">
                    <svg className="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg>
                </div>
                <h1 className="text-2xl font-bold text-slate-900">Booking Confirmed!</h1>
                <p className="text-slate-600 mt-2">Your voucher is ready. Present this at the start of your tour.</p>
            </div>
            
            <Card className="p-6 border-slate-200">
                <div className="text-center mb-4">
                     <div className="flex justify-center items-center my-3">
                        <div className="bg-white p-2 border">
                             <QRCode value={qrValue} size={128} />
                        </div>
                     </div>
                    <h2 className="font-bold text-slate-800 text-lg">{order.tour.name}</h2>
                </div>
                
                <div className="text-left border-t border-slate-200 pt-4 space-y-2 text-sm">
                    <div className="flex justify-between"><span>Booking ID:</span><span className="font-mono">{order.id}</span></div>
                    <div className="flex justify-between"><span>Date:</span><span className="font-semibold">{formatDate(order.bookingDate)}</span></div>
                    <div className="flex justify-between"><span>Guests:</span><span className="font-semibold">{order.guests}</span></div>
                    <div className="flex justify-between text-lg font-bold border-t pt-3 mt-3">
                        <span>Total Paid:</span>
                        <span>${order.totalPrice.toFixed(2)}</span>
                    </div>
                </div>

                 <div className="mt-8 flex flex-col gap-2">
                    <button onClick={handleDownloadPDF} className="w-full bg-slate-600 text-white py-2 rounded-md font-semibold hover:bg-slate-700 flex items-center justify-center gap-2">
                        {ICONS.orders} Download Voucher
                    </button>
                    <button onClick={onNewBooking} className="w-full bg-teal-600 text-white py-2 rounded-md font-semibold hover:bg-teal-700">
                        Book Another Tour
                    </button>
                </div>
            </Card>
        </div>
    );
};

export default TourSuccessPage;