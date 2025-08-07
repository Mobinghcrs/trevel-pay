
import React, { useState, useEffect } from 'react';
import { ICONS } from '../constants';
import StatCard from './components/StatCard';
import LineChart from './components/charts/LineChart';
import BarChart from './components/charts/BarChart';
import { getAdminCashRequests, getAdminRevenueData, getAdminP2PVolume, getAdminTopCurrencies } from '../services/apiService';
import { RevenueDataPoint, P2PVolume, TopCurrency } from '../types';
import Spinner from '../components/Spinner';
import Card from '../components/Card';

const PageTitle: React.FC = () => (
    <div className="flex justify-between items-center mb-6">
        <div>
            <h1 className="text-2xl font-bold text-slate-900">Dashboard</h1>
            <p className="text-sm text-slate-500">Welcome to the TRAVEL PAY admin dashboard.</p>
        </div>
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
            <PageTitle />
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <StatCard 
                    title="Pending Forex"
                    value={pendingRequests.toString()}
                    icon={ICONS.exchange}
                    color="yellow"
                />
                <StatCard 
                    title="Flights Booked"
                    value="1,287"
                    icon={ICONS.plane}
                    color="blue"
                />
                <StatCard 
                    title="Active Users"
                    value="452"
                    icon={ICONS.users}
                    color="green"
                />
                 <StatCard 
                    title="Total Revenue"
                    value="$125,430"
                    icon={ICONS.currencyDollar}
                    color="violet"
                />
            </div>

            <div className="mb-8">
                {isLoading ? (
                    <Spinner message="Loading analytics..." />
                ) : (
                    <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                        <Card className="p-5 xl:col-span-2">
                             <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                                <span className="text-teal-600">{ICONS.trendingUp}</span>
                                Revenue Over Time (USD)
                            </h3>
                             <LineChart data={revenueData} />
                        </Card>
                        <div className="space-y-6">
                            <Card className="p-5">
                                 <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                                    <span className="text-teal-600">{ICONS.chartBar}</span>
                                    P2P Trade Volume
                                </h3>
                               {p2pVolume && <BarChart data={p2pVolume} />}
                            </Card>
                            <Card className="p-5">
                                 <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                                    <span className="text-teal-600">{ICONS.currencyDollar}</span>
                                    Top Traded Currencies
                                </h3>
                                <ul className="space-y-3">
                                    {topCurrencies.map(c => (
                                        <li key={c.symbol} className="flex justify-between items-center text-sm">
                                            <span className="font-semibold text-slate-800">{c.name} ({c.symbol})</span>
                                            <span className="font-mono text-slate-900">${c.volumeUSD.toLocaleString(undefined, {minimumFractionDigits: 2})}</span>
                                        </li>
                                    ))}
                                </ul>
                            </Card>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default DashboardPage;
