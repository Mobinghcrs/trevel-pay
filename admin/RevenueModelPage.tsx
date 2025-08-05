import React, { useState, useEffect, useCallback } from 'react';
import { RevenueSettings } from '../types';
import Spinner from '../components/Spinner';
import RevenueModelCard from './components/RevenueModelCard';
import { getRevenueSettings, updateRevenueSettings } from '../services/apiService';

const RevenueModelPage: React.FC = () => {
    const [settings, setSettings] = useState<RevenueSettings | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchSettings = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            const data = await getRevenueSettings();
            setSettings(data);
        } catch (err) {
            console.error(err);
            setError(err instanceof Error ? err.message : "Failed to load revenue settings.");
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchSettings();
    }, [fetchSettings]);

    const handleSave = async () => {
        if (!settings) return;
        setIsSaving(true);
        setError(null);
        try {
            await updateRevenueSettings(settings);
            alert("Revenue models updated successfully!");
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to save settings.");
            alert(`Error: ${err instanceof Error ? err.message : "Failed to save settings."}`);
        } finally {
            setIsSaving(false);
        }
    };

    if (isLoading) {
        return <Spinner message="Loading revenue models..." />;
    }

    if (error || !settings) {
        return <div className="text-center text-red-600 bg-red-100 p-4 rounded-md">{error || "Could not load settings."}</div>;
    }

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-slate-900">Revenue Model Management</h1>
                <button 
                    onClick={handleSave}
                    disabled={isSaving}
                    className="bg-teal-600 text-white px-5 py-2 rounded-md font-semibold hover:bg-teal-700 transition-colors disabled:bg-slate-400 disabled:cursor-wait"
                >
                    {isSaving ? 'Saving...' : 'Save All Changes'}
                </button>
            </div>
            
            <p className="text-slate-600 mb-8 max-w-3xl">
                Configure how the application earns revenue. You can set a fixed fee (e.g., $5) or a percentage-based commission for each service. Changes will apply to all future transactions.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <RevenueModelCard
                    title="Flight Bookings"
                    feeModel={settings.flightBooking}
                    onChange={(newModel) => setSettings({ ...settings, flightBooking: newModel })}
                />
                <RevenueModelCard
                    title="Hotel Bookings"
                    feeModel={settings.hotelBooking}
                    onChange={(newModel) => setSettings({ ...settings, hotelBooking: newModel })}
                />
                 <RevenueModelCard
                    title="Marketplace Commission"
                    feeModel={settings.marketplaceCommission}
                    onChange={(newModel) => setSettings({ ...settings, marketplaceCommission: newModel })}
                />
                 <div className="md:col-span-2 lg:col-span-3">
                    <div className="bg-white border border-slate-200 rounded-lg p-5">
                         <h3 className="text-lg font-bold text-slate-900 mb-4">Exchange Fees</h3>
                         <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <RevenueModelCard
                                title="P2P Exchange Fee"
                                feeModel={settings.exchange.p2p}
                                onChange={(newModel) => setSettings({ ...settings, exchange: {...settings.exchange, p2p: newModel }})}
                                compact
                            />
                            <RevenueModelCard
                                title="Bank Transfer Fee"
                                feeModel={settings.exchange.bankTransfer}
                                onChange={(newModel) => setSettings({ ...settings, exchange: {...settings.exchange, bankTransfer: newModel }})}
                                compact
                            />
                            <RevenueModelCard
                                title="Cash Delivery Fee"
                                feeModel={settings.exchange.cashDelivery}
                                onChange={(newModel) => setSettings({ ...settings, exchange: {...settings.exchange, cashDelivery: newModel }})}
                                compact
                            />
                        </div>
                    </div>
                 </div>
            </div>
        </div>
    );
};

export default RevenueModelPage;