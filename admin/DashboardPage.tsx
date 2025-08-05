

import React, { useState, useEffect } from 'react';
import { ICONS } from '../constants';
import StatCard from './components/StatCard';
import LineChart from './components/charts/LineChart';
import BarChart from './components/charts/BarChart';
import { getAdminCashRequests, getAdminRevenueData, getAdminP2PVolume, getAdminTopCurrencies } from '../services/apiService';
import { RevenueDataPoint, P2PVolume, TopCurrency } from '../types';
import Spinner from '../components/Spinner';

const AnalyticsCard: React.FC<{title: string, icon: React.ReactNode, children: React.ReactNode}> = ({title, icon, children}) => (
     <div className="bg-white border border-slate-200 rounded-xl shadow-lg p-5">
        <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
            <span className="text-teal-600">{icon}</span>
            {title}
        </h3>
        {children}
    </div>
);

const DashboardPage: React.FC = () => {
    const [pendingRequests, setPendingRequests] = useState(0);
    
    // Analytics State
    const [revenueData, setRevenueData] = useState<RevenueDataPoint[]>([]);
    const [p2pVolume, setP2pVolume] = useState<P2PVolume | null>(null);
    const [topCurrencies, setTopCurrencies] = useState<TopCurrency[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchDashboardData = async () => {
            setIsLoading(true);
            try {
                const [requests, revenue, volume, currencies] = await Promise.all([
                    getAdminCashRequests(),
                    getAdminRevenueData(),
                    getAdminP2PVolume(),
                    getAdminTopCurrencies(),
                ]);
                
                const pending = requests.filter(r => r.status === 'Pending').length;
                setPendingRequests(pending);

                setRevenueData(revenue);
                setP2pVolume(volume);
                setTopCurrencies(currencies);

            } catch (error) {
                console.error("Failed to fetch dashboard data", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchDashboardData();
    }, []);

    return (
        <div>
            <h1 className="text-3xl font-bold text-slate-900 mb-6">Admin Dashboard</h1>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <StatCard 
                    title="Pending Forex Requests"
                    value={pendingRequests.toString()}
                    icon={ICONS.exchange}
                    color="text-yellow-500"
                />
                <StatCard 
                    title="Total Flights Booked"
                    value="1,287"
                    icon={ICONS.plane}
                    color="text-blue-500"
                />
                <StatCard 
                    title="Active Users"
                    value="452"
                    icon={ICONS.users}
                    color="text-green-500"
                />
                 <StatCard 
                    title="System Status"
                    value="Operational"
                    icon={<div className="h-4 w-4 rounded-full bg-green-500 animate-pulse"></div>}
                    color="text-green-500"
                />
            </div>

            <div className="mb-8">
                <h2 className="text-2xl font-bold text-slate-900 mb-4">Business Intelligence & Analytics</h2>
                {isLoading ? (
                    <Spinner message="Loading analytics..." />
                ) : (
                    <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                        <AnalyticsCard title="Revenue Over Time (USD)" icon={ICONS.trendingUp}>
                             <LineChart data={revenueData} />
                        </AnalyticsCard>
                        <div className="space-y-6">
                            <AnalyticsCard title="P2P Trade Volume" icon={ICONS.chartBar}>
                               {p2pVolume && <BarChart data={p2pVolume} />}
                            </AnalyticsCard>
                            <AnalyticsCard title="Top Traded Currencies (by Volume)" icon={ICONS.currencyDollar}>
                                <ul className="space-y-3">
                                    {topCurrencies.map(c => (
                                        <li key={c.symbol} className="flex justify-between items-center text-sm">
                                            <span className="font-semibold text-slate-800">{c.name} ({c.symbol})</span>
                                            <span className="font-mono text-slate-900">${c.volumeUSD.toLocaleString(undefined, {minimumFractionDigits: 2})}</span>
                                        </li>
                                    ))}
                                </ul>
                            </AnalyticsCard>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default DashboardPage;