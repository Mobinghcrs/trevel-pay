import React, { useState, useEffect } from 'react';
import { UserProfile, InvestableAsset } from '../../types';
import { getUserProfile, getInvestableAssets } from '../../services/apiService';
import Spinner from '../../components/Spinner';
import PortfolioSummaryCard from './components/PortfolioSummaryCard';
import AssetRow from './components/AssetRow';
import Card from '../../components/Card';
import AssetDetailPage from './AssetDetailPage';
import TradeModal from './TradeModal';
import { ICONS } from '../../constants';

type InvestmentView = 'list' | 'detail';

const InvestmentPage: React.FC = () => {
    // View control state
    const [view, setView] = useState<InvestmentView>('list');
    const [selectedAsset, setSelectedAsset] = useState<InvestableAsset | null>(null);
    
    // Trade modal state
    const [isTradeModalOpen, setIsTradeModalOpen] = useState(false);
    const [tradeType, setTradeType] = useState<'BUY' | 'SELL'>('BUY');
    
    // Data state
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [marketAssets, setMarketAssets] = useState<InvestableAsset[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchData = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const [profileData, assetsData] = await Promise.all([
                getUserProfile(),
                getInvestableAssets()
            ]);
            setProfile(profileData);
            setMarketAssets(assetsData);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to load investment data.');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleSelectAsset = (asset: InvestableAsset) => {
        setSelectedAsset(asset);
        setView('detail');
    };

    const handleOpenTradeModal = (type: 'BUY' | 'SELL') => {
        setTradeType(type);
        setIsTradeModalOpen(true);
    };

    const handleTradeSuccess = () => {
        setIsTradeModalOpen(false);
        fetchData(); // Refetch all data to update portfolio and balances
    };

    const handleBackToList = () => {
        setView('list');
        setSelectedAsset(null);
    };

    if (isLoading) {
        return <Spinner message="Loading investment data..." />;
    }
    
    if (error) {
        return <p className="text-center text-red-500">{error}</p>;
    }

    if (view === 'detail' && selectedAsset) {
        return <AssetDetailPage asset={selectedAsset} onBack={handleBackToList} onTrade={handleOpenTradeModal} />;
    }

    return (
        <>
            <div className="text-center mb-8">
                 <div className="w-24 h-24 bg-teal-100 text-teal-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  {ICONS.investment}
                </div>
                <h1 className="text-3xl font-bold text-slate-900">Investments</h1>
                <p className="text-slate-600 mt-1">Manage your portfolio and explore the crypto market.</p>
            </div>
            
            <PortfolioSummaryCard profile={profile} marketData={marketAssets} />

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8 items-start">
                <Card className="p-0 border-slate-200">
                    <h2 className="text-xl font-bold text-slate-800 p-4 border-b">Your Portfolio</h2>
                    <div className="divide-y divide-slate-200">
                        {profile?.investments && profile.investments.length > 0 ? (
                            profile.investments.map(investment => {
                                const assetData = marketAssets.find(a => a.symbol === investment.assetSymbol);
                                if (!assetData) return null;
                                return <AssetRow key={assetData.symbol} asset={assetData} holding={investment} onClick={() => handleSelectAsset(assetData)} />;
                            })
                        ) : (
                            <p className="p-6 text-center text-slate-500">You have no investments yet.</p>
                        )}
                    </div>
                </Card>
                 <Card className="p-0 border-slate-200">
                    <h2 className="text-xl font-bold text-slate-800 p-4 border-b">Market</h2>
                     <div className="divide-y divide-slate-200">
                        {marketAssets.map(asset => (
                            <AssetRow key={asset.symbol} asset={asset} onClick={() => handleSelectAsset(asset)} />
                        ))}
                    </div>
                </Card>
            </div>
            
            {selectedAsset && (
                 <TradeModal 
                    isOpen={isTradeModalOpen}
                    onClose={() => setIsTradeModalOpen(false)}
                    asset={selectedAsset}
                    tradeType={tradeType}
                    onSuccess={handleTradeSuccess}
                    profile={profile!}
                />
            )}
        </>
    );
};

export default InvestmentPage;