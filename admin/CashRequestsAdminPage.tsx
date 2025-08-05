

import React, { useState, useEffect, useCallback } from 'react';
import { CashDeliveryRequest } from '../types';
import { getAdminCashRequests, updateAdminCashRequestStatus } from '../services/apiService';
import Card from '../components/Card';
import Spinner from '../components/Spinner';

const StatusBadge: React.FC<{ status: CashDeliveryRequest['status'] }> = ({ status }) => {
    const baseClasses = "px-2 py-1 text-xs font-semibold rounded-full";
    let colorClasses = "";
    switch (status) {
        case 'Pending': colorClasses = "bg-yellow-100 text-yellow-800"; break;
        case 'Approved': colorClasses = "bg-green-100 text-green-800"; break;
        case 'Declined': colorClasses = "bg-red-100 text-red-800"; break;
    }
    return <span className={`${baseClasses} ${colorClasses}`}>{status}</span>
}

const CashRequestsAdminPage: React.FC = () => {
    const [requests, setRequests] = useState<CashDeliveryRequest[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchRequests = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            const savedRequests = await getAdminCashRequests();
            setRequests(savedRequests.sort((a,b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()));
        } catch (err) {
            console.error("Failed to load requests", err);
            setError(err instanceof Error ? err.message : 'Failed to load requests.');
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchRequests();
    }, [fetchRequests]);

    const handleUpdateStatus = async (id: string, status: 'Approved' | 'Declined') => {
        try {
            await updateAdminCashRequestStatus(id, status);
            fetchRequests(); // Re-fetch to get the latest state
        } catch (err) {
            alert(`Failed to update status: ${err instanceof Error ? err.message : 'Unknown error'}`);
            console.error("Failed to update request status", err);
        }
    };

    return (
        <div>
            <h1 className="text-3xl font-bold text-slate-900 mb-6">Cash Delivery Requests</h1>
            {error && <div className="text-center text-red-600 bg-red-100 p-4 rounded-md mb-4">{error}</div>}
            <div className="bg-white border border-slate-200 rounded-xl shadow-lg overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-slate-200">
                        <thead className="bg-slate-50">
                            <tr>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Request ID</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Date</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Amount</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Location</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Status</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200">
                            {isLoading ? (
                                <tr><td colSpan={6}><Spinner message="Loading requests..."/></td></tr>
                            ) : requests.length === 0 ? (
                                <tr><td colSpan={6} className="text-center p-8 text-slate-500">No cash delivery requests found.</td></tr>
                            ) : (
                                requests.map(req => (
                                    <tr key={req.id} className="hover:bg-slate-50 transition-colors">
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-slate-500">{req.id.slice(-6)}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-800">{new Date(req.timestamp).toLocaleString()}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-slate-900">{req.amount} {req.currency}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-800">{req.city}, {req.country}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm"><StatusBadge status={req.status} /></td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                            {req.status === 'Pending' && (
                                                <div className="flex gap-2">
                                                    <button onClick={() => handleUpdateStatus(req.id, 'Approved')} className="text-green-600 hover:text-green-500 transition-colors">Approve</button>
                                                    <button onClick={() => handleUpdateStatus(req.id, 'Declined')} className="text-red-600 hover:text-red-500 transition-colors">Decline</button>
                                                </div>
                                            )}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default CashRequestsAdminPage;