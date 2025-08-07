import React from 'react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import QRCode from 'react-qr-code';
import { CarBooking } from '../../types';
import Card from '../../components/Card';

interface CarBookingSuccessPageProps {
  booking: CarBooking;
  onNewBooking: () => void;
}

const DetailItem: React.FC<{ label: string, value: string }> = ({ label, value }) => (
    <div className="flex justify-between text-sm">
        <span className="text-slate-500">{label}</span>
        <span className="font-semibold text-slate-800">{value}</span>
    </div>
);

const CarBookingSuccessPage: React.FC<CarBookingSuccessPageProps> = ({ booking, onNewBooking }) => {
    const formatDate = (dateString: string) => new Date(dateString).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
    const qrValue = JSON.stringify({ bookingId: booking.id, driver: booking.driver.fullName, car: booking.car.name });

    const handleDownloadPDF = () => {
        const doc = new jsPDF();
        doc.setFontSize(22);
        doc.text("Car Rental Voucher", 14, 22);
        doc.setFontSize(12);
        doc.text(`Booking ID: ${booking.id}`, 14, 30);

        autoTable(doc, {
            startY: 40,
            head: [['Item', 'Details']],
            body: [
                ['Car', `${booking.car.brand} ${booking.car.name} (${booking.car.type})`],
                ['Driver', `${booking.driver.fullName}`],
                ['License No.', `${booking.driver.licenseNumber}`],
                ['Pickup', `${booking.location} on ${formatDate(booking.pickupDate)}`],
                ['Drop-off', `${booking.location} on ${formatDate(booking.dropoffDate)}`],
                ['Total Paid', `$${booking.totalPrice.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`],
            ],
            theme: 'striped',
        });
        
        doc.save(`TravelPay_Car_Voucher_${booking.id.slice(-6)}.pdf`);
    };

  return (
    <div className="max-w-md mx-auto">
        <div className="text-center mb-6">
            <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-4">
                <svg className="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg>
            </div>
            <h1 className="text-2xl font-bold text-slate-900">Booking Confirmed!</h1>
            <p className="text-slate-600 mt-2">Your rental voucher is ready. A copy has been sent to your email.</p>
        </div>
        
        <Card className="p-6 md:p-8 bg-white border border-slate-200">
            <div className="text-center mb-4">
                 <div className="flex justify-center items-center my-3">
                    <div className="bg-white p-2 border">
                         <QRCode value={qrValue} size={128} />
                    </div>
                 </div>
                <h2 className="font-bold text-slate-800 text-lg">Reservation Voucher</h2>
            </div>
            
            <div className="text-left border-t border-slate-200 pt-4 space-y-2">
                <DetailItem label="Booking ID" value={booking.id} />
                <DetailItem label="Car" value={`${booking.car.brand} ${booking.car.name}`} />
                <DetailItem label="Driver" value={booking.driver.fullName} />
                <DetailItem label="Pickup" value={`${booking.location} on ${formatDate(booking.pickupDate)}`} />
                <DetailItem label="Drop-off" value={`${booking.location} on ${formatDate(booking.dropoffDate)}`} />
                 <div className="flex justify-between text-lg font-bold text-slate-900 border-t border-slate-300 pt-3 mt-3">
                    <span>Total Paid</span>
                    <span>${booking.totalPrice.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                </div>
            </div>

             <div className="mt-8 flex flex-col gap-2">
                <button onClick={handleDownloadPDF} className="w-full bg-green-600 text-white px-4 py-2 rounded-md font-semibold hover:bg-green-500 flex items-center justify-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                    Download Voucher
                </button>
                <button onClick={onNewBooking} className="w-full bg-sky-600 text-white px-4 py-2 rounded-md font-semibold hover:bg-sky-700">
                    Book Another Car
                </button>
            </div>
        </Card>
    </div>
  );
};

export default CarBookingSuccessPage;