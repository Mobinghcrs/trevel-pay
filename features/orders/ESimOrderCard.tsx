import React, { useState } from 'react';
import { ESimOrder } from '../../types';
import Card from '../../components/Card';
import { ICONS } from '../../constants';
import Modal from '../../components/Modal';
import QRCode from 'react-qr-code';

const ESimOrderCard: React.FC<{ order: ESimOrder }> = ({ order }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);

    return (
        <>
            <Card className="border-slate-200 p-0 overflow-hidden">
                <div className="p-4 flex flex-col sm:flex-row items-start sm:items-center gap-4">
                    <div className="flex-shrink-0">
                        <div className="p-3 rounded-full bg-slate-100 text-teal-600">
                            {ICONS.sim}
                        </div>
                    </div>

                    <div className="flex-grow grid grid-cols-2 sm:grid-cols-4 gap-4 items-center w-full">
                        <div>
                            <p className="font-bold text-lg text-slate-800">eSIM Purchase</p>
                            <p className="text-xs text-slate-500">{new Date(order.timestamp).toLocaleString()}</p>
                        </div>

                        <div>
                            <p className="text-sm text-slate-500">Country</p>
                            <p className="font-semibold text-slate-800">{order.plan.country}</p>
                        </div>

                        <div>
                            <p className="text-sm text-slate-500">Plan</p>
                            <p className="font-semibold text-slate-800">{order.plan.dataAmountGB}GB / {order.plan.validityDays} days</p>
                        </div>
                        
                        <div className="flex items-center justify-between sm:justify-start gap-4 col-span-2 sm:col-span-1">
                             <div className="text-right">
                                <p className="text-sm text-slate-500">Price Paid</p>
                                <p className="font-mono font-semibold text-slate-800">${order.plan.priceUSD.toFixed(2)}</p>
                            </div>
                             <button onClick={() => setIsModalOpen(true)} className="text-sm font-semibold text-teal-600 hover:text-teal-500">
                                View Details
                            </button>
                        </div>
                    </div>
                </div>
                 {order.purchasedByAgentInfo && (
                    <div className="px-4 py-1 bg-slate-100 text-xs text-slate-600 border-t text-center sm:text-left">
                        Purchased via Agent: <strong>{order.purchasedByAgentInfo.agentName}</strong>
                    </div>
                )}
            </Card>

            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="eSIM Order Details">
                 <div className="space-y-4">
                    <div className="text-center">
                        <p className="text-sm text-slate-500">Order ID</p>
                        <p className="font-mono text-xs">{order.id}</p>
                    </div>
                    <div className="bg-slate-100 p-4 rounded-lg space-y-3">
                        <h3 className="font-bold">Activation QR Code</h3>
                        <div className="flex justify-center items-center my-2">
                            <div className="bg-white p-2 border inline-block">
                                <QRCode value={order.qrCodeValue} size={150} />
                            </div>
                        </div>
                        <p className="text-xs text-center text-slate-600">Scan this code in your phone's cellular settings to install.</p>
                    </div>
                    <div className="bg-slate-100 p-4 rounded-lg space-y-2 text-sm">
                        <h3 className="font-bold mb-2">Purchase Summary</h3>
                        <div className="flex justify-between"><span className="text-slate-600">Date:</span> <span>{new Date(order.timestamp).toLocaleString()}</span></div>
                        <div className="flex justify-between"><span className="text-slate-600">Country:</span> <span className="font-semibold">{order.plan.country}</span></div>
                        <div className="flex justify-between"><span className="text-slate-600">Plan:</span> <span className="font-semibold">{order.plan.dataAmountGB}GB / {order.plan.validityDays} days</span></div>
                        <div className="flex justify-between font-bold border-t pt-2 mt-2"><span className="text-slate-800">Total Paid:</span> <span className="font-mono">${order.plan.priceUSD.toFixed(2)}</span></div>
                    </div>
                    <button onClick={() => setIsModalOpen(false)} className="w-full mt-2 bg-slate-200 text-slate-800 px-4 py-2 rounded-md font-semibold hover:bg-slate-300 transition-colors">
                        Close
                    </button>
                </div>
            </Modal>
        </>
    );
};

export default ESimOrderCard;