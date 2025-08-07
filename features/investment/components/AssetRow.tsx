import React from 'react';
import { InvestableAsset, Investment } from '../../../types';

const ChangeIndicator: React.FC<{ value: number }> = ({ value }) => {
    const isPositive = value >= 0;
    return (
        <span className={`text-sm font-semibold ${isPositive ? 'text-green-500' : 'text-red-500'}`}>
            {isPositive ? '+' : ''}{value.toFixed(2)}%
        </span>
    );
};

interface AssetRowProps {
    asset: InvestableAsset;
    holding?: Investment;
    onClick: () => void;
}

const AssetRow: React.FC<AssetRowProps> = ({ asset, holding, onClick }) => {
    const currentHoldingValue = holding ? holding.amount * asset.price : 0;

    return (
        <button onClick={onClick} className="w-full p-4 grid grid-cols-3 items-center gap-4 text-left hover:bg-slate-50 transition-colors">
            {/* Asset Name and Symbol */}
            <div className="col-span-1">
                <p className="font-bold text-slate-800">{asset.name}</p>
                <p className="text-sm text-slate-500">{asset.symbol}</p>
            </div>
            {/* Price and Change (or Holdings for portfolio view) */}
            <div className="col-span-1 text-right">
                {holding ? (
                    <>
                        <p className="font-mono font-semibold text-slate-800">${currentHoldingValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                        <p className="text-sm text-slate-500 font-mono">{holding.amount.toFixed(6)} {asset.symbol}</p>
                    </>
                ) : (
                    <>
                        <p className="font-mono font-semibold text-slate-800">${asset.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                    </>
                )}
            </div>
            {/* 24h Change */}
            <div className="col-span-1 text-right">
                <ChangeIndicator value={asset.change24h} />
            </div>
        </button>
    );
};

export default AssetRow;