import React, { useState } from 'react';
import { ProductOrder } from '../../types';
import Card from '../../components/Card';
import Modal from '../../components/Modal';

const ProductOrderCard: React.FC<{ order: ProductOrder }> = ({ order }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);

    return (
        <>
            <Card className="border-slate-200">
                <div className="p-4 flex flex-col sm:flex-row items-start sm:items-center gap-4">
                    <div className="flex-shrink-0">
                        <img src={order.product.imageUrl} alt={order.product.name} className="h-20 w-20 rounded-lg object-cover bg-slate-200" />
                    </div>

                    <div className="flex-grow grid grid-cols-2 sm:grid-cols-4 gap-4 items-center w-full">
                        <div>
                            <p className="font-bold text-slate-800">{order.product.name}</p>
                            <p className="text-sm text-slate-500">{order.product.category}</p>
                        </div>

                        <div>
                            <p className="text-sm text-slate-500">Amount Paid</p>
                            <p className="font-mono font-semibold text-slate-800">${order.totalPrice.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                        </div>
                        
                        <div>
                            <p className="text-sm text-slate-500">Shipping To</p>
                            <p className="text-sm text-slate-700 font-semibold">{order.shippingAddress.city}, {order.shippingAddress.country}</p>
                        </div>

                        <div className="col-span-2 sm:col-span-1 text-left sm:text-right">
                            <button onClick={() => setIsModalOpen(true)} className="text-sm font-semibold text-sky-600 hover:text-sky-500">
                                View Details
                            </button>
                        </div>
                    </div>
                </div>
            </Card>

            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Order Details">
                <div className="space-y-4 text-slate-800">
                    <div className="text-center">
                        <p className="text-sm text-slate-500">Order ID</p>
                        <p className="font-mono text-xs">{order.id}</p>
                    </div>
                    <div className="bg-slate-100 p-4 rounded-lg space-y-3">
                        <h3 className="font-bold">Product</h3>
                        <div className="flex items-center gap-4">
                            <img src={order.product.imageUrl} alt={order.product.name} className="h-16 w-16 rounded-md object-cover bg-white"/>
                            <p className="font-semibold text-slate-800">{order.product.name}</p>
                        </div>
                    </div>
                    <div className="bg-slate-100 p-4 rounded-lg space-y-3">
                        <h3 className="font-bold">Shipping To</h3>
                        <p><strong>{order.shippingAddress.fullName}</strong></p>
                        <p className="text-sm">{order.shippingAddress.streetAddress}</p>
                        <p className="text-sm">{order.shippingAddress.city}, {order.shippingAddress.postalCode}</p>
                        <p className="text-sm">{order.shippingAddress.country}</p>
                    </div>
                    <div className="bg-slate-100 p-4 rounded-lg space-y-3">
                        <h3 className="font-bold">Payment</h3>
                        <div className="flex justify-between"><span className="text-slate-600">Total Paid:</span> <span className="font-mono font-semibold">${order.totalPrice.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span></div>
                        <div className="flex justify-between"><span className="text-slate-600">Date:</span> <span>{new Date(order.timestamp).toLocaleString()}</span></div>
                    </div>
                    <button onClick={() => setIsModalOpen(false)} className="w-full mt-4 bg-slate-200 text-slate-800 px-4 py-2 rounded-md font-semibold hover:bg-slate-300 transition-colors">
                        Close
                    </button>
                </div>
            </Modal>
        </>
    );
};

export default ProductOrderCard;