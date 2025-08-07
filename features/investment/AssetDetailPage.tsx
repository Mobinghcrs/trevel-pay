import React, { useState } from 'react';
import { InvestableAsset } from '../../types';
import { generateAssetSummary } from '../../services/apiService';
import Card from '../../components/Card';
import Spinner from '../../components/Spinner';

// This is a placeholder for a real charting library like TradingView or Chart.js
const CandlestickChartPlaceholder: React.FC<{ data: any[] }> = ({ data }) => (
    <div className="w-full h-80 bg-slate-800 rounded-lg flex items-center justify-center text-slate-400 border border-slate-700">
        <p>[Candlestick Chart for {data.length} periods]</p>
    </div>
);

const AssetDetailPage: React.FC<{
    asset: InvestableAsset;
    onBack: () => void;
    onTrade: (type: 'BUY' | 'SELL') => void;
}> = ({ asset, onBack, onTrade }) => {
    const [aiSummary, setAiSummary] = useState<string | null>(null);
    const [isLoadingSummary, setIsLoadingSummary] = useState(false);

    const fetchAiSummary = async () => {
        setIsLoadingSummary(true);
        try {
            const summary = await generateAssetSummary(asset.name);
            setAiSummary(summary);
        } catch (error) {
            setAiSummary(error instanceof Error ? error.message : "Could not load summary.");
        } finally {
            setIsLoadingSummary(false);
        }
    };
    
    const isPositiveChange = asset.change24h >= 0;

    return (
        <div>
             <button onClick={onBack} className="text-sm text-teal-600 hover:underline mb-4 font-semibold">&larr; Back to Portfolio</button>
             <div className="flex items-center justify-between mb-4">
                 <div>
                    <h1 className="text-4xl font-bold text-slate-900">{asset.name} ({asset.symbol})</h1>
                    <p className="text-3xl font-mono text-slate-800 mt-2">${asset.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                 </div>
                 <div className={`px-4 py-2 rounded-lg ${isPositiveChange ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                    <span className="font-bold text-lg">{isPositiveChange ? '+' : ''}{asset.change24h.toFixed(2)}%</span>
                    <span className="text-sm ml-2">24h</span>
                 </div>
             </div>

             <CandlestickChartPlaceholder data={asset.history} />
             
             <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
                <Card className="p-6 border-slate-200">
                    <h2 className="text-xl font-bold mb-4">Market Stats</h2>
                    <div className="space-y-2 text-sm">
                        <div className="flex justify-between"><span className="text-slate-600">Market Cap</span> <span className="font-mono">${asset.marketCap.toLocaleString()}</span></div>
                        <div className="flex justify-between"><span className="text-slate-600">24h Volume</span> <span className="font-mono">${asset.volume24h.toLocaleString()}</span></div>
                    </div>
                </Card>
                 <Card className="p-6 border-slate-200">
                    <h2 className="text-xl font-bold mb-4">AI Summary (Gemini)</h2>
                    {isLoadingSummary ? <Spinner message="Generating summary..." /> : (
                        aiSummary ? <p className="text-sm text-slate-700">{aiSummary}</p> : <button onClick={fetchAiSummary} className="text-teal-600 font-semibold">Get AI Summary</button>
                    )}
                </Card>
             </div>
             
             <div className="fixed bottom-4 left-1/2 -translate-x-1/2 w-[calc(100%-2rem)] max-w-md mx-auto z-20 md:relative md:max-w-none md:w-full md:bottom-auto md:left-auto md:translate-x-0 md:mt-8">
                 <div className="bg-white/80 backdrop-blur-md border border-slate-200 shadow-2xl rounded-xl p-3 flex gap-4">
                    <button onClick={() => onTrade('BUY')} className="w-full bg-green-600 text-white py-3 rounded-lg font-bold text-lg hover:bg-green-700">Buy</button>
                    <button onClick={() => onTrade('SELL')} className="w-full bg-red-600 text-white py-3 rounded-lg font-bold text-lg hover:bg-red-700">Sell</button>
                </div>
            </div>
        </div>
    );
};

export default AssetDetailPage;