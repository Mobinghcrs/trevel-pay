import React, { useMemo } from 'react';
import { UserProfile, InvestableAsset } from '../../../types';
import Card from '../../../components/Card';

interface PortfolioSummaryCardProps {
    profile: UserProfile | null;
    marketData: InvestableAsset[];
}

const PortfolioSummaryCard: React.FC<PortfolioSummaryCardProps> = ({ profile, marketData }) => {
    const { totalValue, totalCost, totalPandL, pandlPercentage } = useMemo(() => {
        if (!profile || !profile.investments || profile.investments.length === 0 || marketData.length === 0) {
            return { totalValue: 0, totalCost: 0, totalPandL: 0, pandlPercentage: 0 };
        }

        const marketPriceMap = new Map(marketData.map(asset => [asset.symbol, asset.price]));

        let totalValue = 0;
        let totalCost = 0;

        for (const investment of profile.investments) {
            const currentPrice = marketPriceMap.get(investment.assetSymbol);
            if (currentPrice) {
                totalValue += investment.amount * currentPrice;
                totalCost += investment.amount * investment.avgCostBasis;
            }
        }

        const totalPandL = totalValue - totalCost;
        const pandlPercentage = totalCost > 0 ? (totalPandL / totalCost) * 100 : 0;

        return { totalValue, totalCost, totalPandL, pandlPercentage };

    }, [profile, marketData]);

    const isPositive = totalPandL >= 0;

    return (
        <Card className="p-6 bg-slate-800 text-white border-slate-700">
            <div className="flex justify-between items-start">
                <div>
                    <p className="text-sm text-slate-400">Total Portfolio Value</p>
                    <p className="text-4xl font-bold mt-1">${totalValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                </div>
                <div className={`px-3 py-1.5 rounded-md text-sm font-bold ${isPositive ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                    {isPositive ? '+' : ''}{pandlPercentage.toFixed(2)}%
                </div>
            </div>
            <div className="mt-4 text-sm">
                <span className="text-slate-400">Profit/Loss: </span>
                <span className={`font-semibold ${isPositive ? 'text-green-400' : 'text-red-400'}`}>
                   ${totalPandL.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </span>
            </div>
        </Card>
    );
};

export default PortfolioSummaryCard;