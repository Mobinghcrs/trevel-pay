
import React, { useState, useEffect } from 'react';
import { FinancialSummary } from '../../types';
import { getFinancialSummary } from '../../services/apiService';
import Spinner from '../../components/Spinner';
import StatCard from '../components/StatCard';
import { ICONS } from '../../constants';

const FinancialDashboard: React.FC = () => {
    const [summary, setSummary] = useState<FinancialSummary | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            try {
                const data = await getFinancialSummary();
                setSummary(data);
            } catch (err) {
                setError(err instanceof Error ? err.message : "Failed to load financial summary.");
            } finally {
                setIsLoading(false);
            }
        };
        fetchData();
    }, []);

    if (isLoading) {
        return <Spinner message="Loading financial data..." />;
    }

    if (error || !summary) {
        return <div className="text-center text-red-600 bg-red-100 p-4 rounded-md">{error || "Could not load data."}</div>;
    }

    return (
        <div>
            <h2 className="text-2xl font-bold text-slate-800 mb-4">Financial Overview</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                    title="Total Revenue"
                    value={`$${summary.totalRevenue.toLocaleString(undefined, { minimumFractionDigits: 2 })}`}
                    icon={ICONS.currencyDollar}
                    color="green"
                />
                <StatCard
                    title="Net Profit"
                    value={`$${summary.netProfit.toLocaleString(undefined, { minimumFractionDigits: 2 })}`}
                    icon={ICONS.trendingUp}
                    color="blue"
                />
                <StatCard
                    title="User Liabilities (Float)"
                    value={`$${summary.userLiabilities.toLocaleString(undefined, { minimumFractionDigits: 2 })}`}
                    icon={ICONS.users}
                    color="yellow"
                />
                <StatCard
                    title="House Liquidity"
                    value={`$${summary.houseLiquidity.toLocaleString(undefined, { minimumFractionDigits: 2 })}`}
                    icon={ICONS.bank}
                    color="violet"
                />
            </div>
            <div className="mt-8 bg-white border border-slate-200 rounded-lg p-6">
                <h3 className="text-lg font-bold text-slate-900 mb-4">Charts & Reports</h3>
                <p className="text-slate-600">Additional charts for revenue breakdown, expense analysis, and cash flow will be displayed here in a future update.</p>
            </div>
        </div>
    );
};

export default FinancialDashboard;
