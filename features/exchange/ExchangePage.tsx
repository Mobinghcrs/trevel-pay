import React, { useState, useEffect } from 'react';
import { ICONS } from '../../constants';
import MarketRates from './MarketRates';
import P2PMarketplace from './P2PMarketplace';
import BankExchange from './BankExchange';
import CashDeliveryPage from './CashDeliveryPage';
import SwapPage from './SwapPage';
import AiAnalystPage from './AiAnalystPage';
import { ExchangeTab } from '../../types';

interface TabInfo {
    id: ExchangeTab;
    label: string;
    icon: React.ReactNode;
}

const tabs: TabInfo[] = [
    { id: 'rates', label: 'Market Rates', icon: ICONS.exchangeMarketRates },
    { id: 'swap', label: 'Swap', icon: ICONS.swap },
    { id: 'p2p', label: 'P2P Trade', icon: ICONS.exchangeP2P },
    { id: 'bank', label: 'Bank Transfer', icon: ICONS.exchangeBankTransfer },
    { id: 'delivery', label: 'Cash Delivery', icon: ICONS.exchangeCashDelivery },
    { id: 'ai-analyst', label: 'AI Analyst', icon: ICONS.aiAnalyst },
];

const IconTabButton: React.FC<{
    tab: TabInfo;
    isActive: boolean;
    onClick: () => void;
}> = ({ tab, isActive, onClick }) => {
    const activeClasses = 'bg-teal-100 text-teal-600';
    const inactiveClasses = 'text-slate-500 hover:bg-slate-100 hover:text-teal-600';

    return (
        <div className="relative group flex flex-col items-center">
            <button
                onClick={onClick}
                className={`p-4 rounded-lg transition-all duration-200 ${isActive ? activeClasses : inactiveClasses}`}
                aria-label={tab.label}
            >
                <div className="h-6 w-6">{tab.icon}</div>
            </button>
            <div
                className="absolute bottom-full mb-2 w-max px-3 py-1.5 text-xs font-semibold text-white bg-slate-900 border border-slate-700 rounded-md shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none"
                role="tooltip"
            >
                {tab.label}
            </div>
        </div>
    );
};


interface ExchangePageProps {
    context?: any;
}

const ExchangePage: React.FC<ExchangePageProps> = ({ context }) => {
    const [activeTab, setActiveTab] = useState<ExchangeTab>('rates');

    useEffect(() => {
        if (context?.tab) {
            setActiveTab(context.tab);
        }
    }, [context]);

    const renderContent = () => {
        switch (activeTab) {
            case 'rates':
                return <MarketRates />;
            case 'swap':
                return <SwapPage context={context} />;
            case 'p2p':
                return <P2PMarketplace />;
            case 'bank':
                return <BankExchange context={context} />;
            case 'delivery':
                return <CashDeliveryPage />;
            case 'ai-analyst':
                return <AiAnalystPage />;
            default:
                return null;
        }
    };

    return (
        <div>
            <div className="mb-8 text-center">
                <h1 className="text-3xl font-bold text-slate-900">Market Watch & Exchange</h1>
                <p className="text-slate-600 mt-1">From market rates to AI analysis, manage it all here.</p>
            </div>

            <div className="flex justify-center border-b border-slate-200 mb-8" role="tablist" aria-label="Exchange features">
                <div className="flex items-center gap-2 sm:gap-4 -mb-px">
                     {tabs.map((tab) => (
                        <IconTabButton
                            key={tab.id}
                            tab={tab}
                            isActive={activeTab === tab.id}
                            onClick={() => setActiveTab(tab.id)}
                        />
                    ))}
                </div>
            </div>
            
            <div role="tabpanel">
                {renderContent()}
            </div>
        </div>
    );
};

export default ExchangePage;