
import React from 'react';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import QRCode from 'react-qr-code';
import { FlightOrder } from '../../types';
import { ICONS } from '../../constants';

interface FlightTicketPageProps {
  order: FlightOrder;
  onNewBooking: () => void;
}

const Ticket: React.FC<{ order: FlightOrder, passengerName: string, seat: string }> = ({ order, passengerName, seat }) => {
    const { flight } = order;
    const formatTime = (dateString: string) => new Date(dateString).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
    const boardingTime = new Date(new Date(flight.departureTime).getTime() - 45 * 60000);
    const qrValue = JSON.stringify({
        bookingId: order.id,
        passenger: passengerName,
        flight: flight.flightNumber,
        seat: seat,
    });

    return (
        <div className="bg-white rounded-lg shadow-lg flex flex-col md:flex-row overflow-hidden border border-slate-200">
            {/* Main Ticket Info */}
            <div className="flex-grow p-5">
                <div className="flex justify-between items-center pb-2">
                    <span className="font-bold text-teal-600">{flight.airline}</span>
                    <span className="text-xs text-slate-500">Boarding Pass</span>
                </div>
                <div className="flex justify-between items-end my-2 border-y border-slate-200 py-3">
                    <div>
                        <p className="text-sm text-slate-500">{flight.origin.city}</p>
                        <p className="text-4xl font-light text-slate-900">{flight.origin.code}</p>
                    </div>
                    <div className="text-slate-400 self-center">{ICONS.plane}</div>
                    <div className="text-right">
                        <p className="text-sm text-slate-500">{flight.destination.city}</p>
                        <p className="text-4xl font-light text-slate-900">{flight.destination.code}</p>
                    </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <p className="text-xs text-slate-500">Passenger</p>
                        <p className="font-semibold text-slate-800">{passengerName}</p>
                    </div>
                    <div className="text-right">
                        <p className="text-xs text-slate-500">Flight</p>
                        <p className="font-semibold text-slate-800">{flight.flightNumber}</p>
                    </div>
                </div>
            </div>
            {/* Stub Info */}
            <div className="bg-slate-50 border-t-2 border-dashed border-slate-300 md:border-t-0 md:border-l-2 p-5 flex flex-col justify-between md:w-1/3">
                 <div className="grid grid-cols-2 gap-4 text-center">
                    <div>
                        <p className="text-xs text-slate-500">Gate</p>
                        <p className="font-bold text-xl text-slate-800">{order.gate}</p>
                    </div>
                    <div>
                        <p className="text-xs text-slate-500">Seat</p>
                        <p className="font-bold text-xl text-slate-800">{seat}</p>
                    </div>
                    <div className="col-span-2">
                        <p className="text-xs text-slate-500">Boarding Time</p>
                        <p className="font-bold text-xl text-slate-800">{formatTime(boardingTime.toISOString())}</p>
                    </div>
                 </div>
                 <div className="flex justify-center items-center mt-3">
                    <div className="bg-white p-1 border">
                         <QRCode value={qrValue} size={96} />
                    </div>
                 </div>
            </div>
        </div>
    );
};


const FlightBookingSuccessPage: React.FC<FlightTicketPageProps> = ({ order, onNewBooking }) => {
    const handleDownloadPDF = () => {
        const doc = new jsPDF();
        
        doc.setFontSize(22);
        doc.text("Flight E-Ticket", 14, 22);
        doc.setFontSize(12);
        doc.text(`Booking ID: ${order.id}`, 14, 30);
        
        const tableData = order.passengers.map(p => {
            const seat = order.seatAssignments.find(s => s.passengerId === p.id)?.seat || 'N/A';
            return [p.name, p.idOrPassport, seat];
        });

        (doc as any).autoTable({
            startY: 40,
            head: [['Passenger Name', 'ID/Passport', 'Seat']],
            body: tableData,
            theme: 'grid',
        });
        
        const finalY = (doc as any).lastAutoTable.finalY + 10;
        
        doc.setFontSize(14);
        doc.text("Flight Details", 14, finalY);
        (doc as any).autoTable({
            startY: finalY + 5,
            body: [
                ['Airline', order.flight.airline],
                ['Flight Number', order.flight.flightNumber],
                ['Route', `${order.flight.origin.city} (${order.flight.origin.code}) to ${order.flight.destination.city} (${order.flight.destination.code})`],
                ['Departure', new Date(order.flight.departureTime).toLocaleString()],
                ['Arrival', new Date(order.flight.arrivalTime).toLocaleString()],
                ['Gate', order.gate],
            ],
            theme: 'striped',
        });

        doc.save(`TravelPay_Flight_Ticket_${order.id.slice(-6)}.pdf`);
    };
  
    return (
        <div>
            <div className="text-center mb-8">
                <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-4">
                     <svg className="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg>
                </div>
                <h1 className="text-3xl font-bold text-slate-900">Your ticket has been successfully issued</h1>
                <p className="text-slate-600 mt-2">Please find your boarding pass below. A copy has been sent to your email.</p>
            </div>
            
            <div className="max-w-3xl mx-auto space-y-6">
                {order.passengers.map(passenger => {
                    const seatInfo = order.seatAssignments.find(s => s.passengerId === passenger.id);
                    return <Ticket key={passenger.id} order={order} passengerName={passenger.name} seat={seatInfo?.seat || 'N/A'} />
                })}
            </div>

            <div className="max-w-3xl mx-auto mt-8 flex flex-col sm:flex-row gap-4">
                <button onClick={handleDownloadPDF} className="w-full bg-green-600 text-white px-4 py-3 rounded-md font-semibold hover:bg-green-500 transition-all duration-200 flex items-center justify-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                    Download PDF
                </button>
                <button onClick={onNewBooking} className="w-full bg-teal-600 text-white px-4 py-3 rounded-md font-semibold hover:bg-teal-700 transition-all duration-200">
                    Book Another Flight
                </button>
            </div>
        </div>
    );
};

export default FlightBookingSuccessPage;
