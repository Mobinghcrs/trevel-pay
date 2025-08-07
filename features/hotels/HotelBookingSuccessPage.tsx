
import React from 'react';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import QRCode from 'react-qr-code';
import { HotelBookingOrder } from '../../types';
import Card from '../../components/Card';
import { ICONS } from '../../constants';

interface HotelBookingSuccessPageProps {
  order: HotelBookingOrder;
  onNewBooking: () => void;
}

const DetailItem: React.FC<{ label: string, value: string | React.ReactNode }> = ({ label, value }) => (
    <div className="flex justify-between py-2 border-b border-slate-200 text-sm">
        <span className="text-slate-500">{label}</span>
        <span className="font-semibold text-slate-800 text-right">{value}</span>
    </div>
);

const HotelBookingSuccessPage: React.FC<HotelBookingSuccessPageProps> = ({ order, onNewBooking }) => {
    const formatDate = (dateString: string) => new Date(dateString).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
    const qrValue = JSON.stringify({ bookingId: order.id, guest: order.guests[0].fullName, hotel: order.hotel.name });
    
    const nights = Math.ceil((new Date(order.checkOutDate).getTime() - new Date(order.checkInDate).getTime()) / (1000 * 3600 * 24));

    const handleDownloadPDF = () => {
        const doc = new jsPDF();
        doc.setFontSize(22);
        doc.text("Hotel Booking Voucher", 14, 22);
        doc.setFontSize(12);
        doc.text(`Booking ID: ${order.id}`, 14, 30);
        doc.text(`Guest: ${order.guests[0].fullName}`, 14, 36);

        (doc as any).autoTable({
            startY: 45,
            head: [['Item', 'Details']],
            body: [
                ['Hotel', order.hotel.name],
                ['Room', order.room.name],
                ['Check-in', formatDate(order.checkInDate)],
                ['Check-out', `${formatDate(order.checkOutDate)} (${nights} nights)`],
                ['Total Paid', `$${order.totalPrice.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`],
            ],
            theme: 'striped',
        });
        
        doc.save(`TravelPay_Hotel_Voucher_${order.id.slice(-6)}.pdf`);
    };

  return (
    <div className="max-w-lg mx-auto">
        <div className="text-center mb-6">
            <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-4">
                <svg className="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg>
            </div>
            <h1 className="text-2xl font-bold text-slate-900">Booking Confirmed!</h1>
            <p className="text-slate-600 mt-2">Your hotel voucher is ready. Please present it at check-in.</p>
        </div>
        
        <Card className="p-6 md:p-8 bg-white border border-slate-200">
            <div className="text-center mb-4">
                <div className="flex justify-center items-center my-3">
                    <div className="bg-white p-2 border">
                         <QRCode value={qrValue} size={128} />
                    </div>
                </div>
                <h2 className="font-bold text-slate-800 text-lg">{order.hotel.name}</h2>
                <p className="text-sm text-slate-500">Booking Voucher</p>
            </div>
            
            <div className="text-left border-t border-slate-200 pt-4 space-y-2">
                <DetailItem label="Booking ID" value={<span className="font-mono">{order.id}</span>} />
                <DetailItem label="Guest" value={order.guests[0].fullName} />
                <DetailItem label="Room" value={order.room.name} />
                <DetailItem label="Check-in" value={formatDate(order.checkInDate)} />
                <DetailItem label="Check-out" value={`${formatDate(order.checkOutDate)}`} />
                <DetailItem label="Duration" value={`${nights} ${nights > 1 ? 'nights' : 'night'}`} />
                 <div className="flex justify-between text-lg font-bold text-slate-900 border-t border-slate-300 pt-3 mt-3">
                    <span>Total Paid</span>
                    <span>${order.totalPrice.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                </div>
            </div>

             <div className="mt-8 flex flex-col gap-2">
                <button onClick={handleDownloadPDF} className="w-full bg-green-600 text-white px-4 py-2 rounded-md font-semibold hover:bg-green-500 flex items-center justify-center gap-2">
                    {ICONS.orders}
                    Download Voucher
                </button>
                <button onClick={onNewBooking} className="w-full bg-sky-600 text-white px-4 py-2 rounded-md font-semibold hover:bg-sky-700">
                    Book Another Hotel
                </button>
            </div>
        </Card>
    </div>
  );
};

export default HotelBookingSuccessPage;