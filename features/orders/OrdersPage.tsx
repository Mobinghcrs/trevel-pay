


import React, { useState, useEffect, useCallback } from 'react';
import { ICONS } from '../../constants';
import { Order } from '../../types';
import Card from '../../components/Card';
import P2POrderCard from './P2POrderCard';
import ProductOrderCard from './ProductOrderCard';
import BankTransferOrderCard from './BankTransferOrderCard';
import FlightOrderCard from './FlightOrderCard';
import HotelOrderCard from './HotelOrderCard';
import UserTransferOrderCard from './UserTransferOrderCard';
import TaxiOrderCard from './TaxiOrderCard';
import ESimOrderCard from './ESimOrderCard';
import { getOrders } from '../../services/apiService';
import Spinner from '../../components/Spinner';

const OrdersPage: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchOrders = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const fetchedOrders = await getOrders();
      setOrders(fetchedOrders);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load orders.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, []);
  
  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const renderOrderCard = (order: Order) => {
    switch (order.type) {
        case 'p2p':
            return <P2POrderCard key={order.id} order={order} />;
        case 'product':
            return <ProductOrderCard key={order.id} order={order} />;
        case 'bank':
            return <BankTransferOrderCard key={order.id} order={order} />;
        case 'flight':
            return <FlightOrderCard key={order.id} order={order} />;
        case 'hotel':
            return <HotelOrderCard key={order.id} order={order} />;
        case 'user-transfer':
            return <UserTransferOrderCard key={order.id} order={order} />;
        case 'taxi':
            return <TaxiOrderCard key={order.id} order={order} />;
        case 'esim':
            return <ESimOrderCard key={order.id} order={order} />;
        default:
            return null;
    }
  }

  if (isLoading) {
    return <Spinner message="Loading your orders..." />
  }

  return (
    <div>
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-gray-900">My Orders</h1>
        <p className="text-gray-600 mt-1">Review your recent transactions and purchases.</p>
      </div>
      
      {error && <div className="text-center text-red-600 bg-red-100 p-4 rounded-md mb-4 border border-red-200">{error}</div>}

      {!error && orders.length === 0 ? (
         <Card className="p-12 bg-white border-gray-200">
            <div className="flex flex-col items-center justify-center text-center">
                <div className="h-20 w-20 text-gray-400 mb-4">{ICONS.orders}</div>
                <h2 className="text-2xl font-bold text-gray-800">No Orders Yet</h2>
                <p className="text-gray-500 mt-2">Your completed transactions will appear here.</p>
            </div>
        </Card>
      ) : (
        <div className="space-y-4">
            {orders.map(renderOrderCard)}
        </div>
      )}
    </div>
  );
};

export default OrdersPage;