import React from 'react';
import { Wallet } from '../../types';
import Card from '../../components/Card';
import { ICONS } from '../../constants';
import { useNavigation } from '../../contexts/NavigationContext';

interface WalletCardProps {
    wallet: Wallet;
    onDelete: (currency: string) => void;
}

const getWalletStyle = (type: Wallet['type']) => {
    switch (type) {
        case 'Fiat':
            return { icon: ICONS.bank, bg: 'bg-green-100', text: 'text-green-600', label: 'Fiat Wallet' };
        case 'Crypto':
            return { icon: ICONS.bitcoin, bg: 'bg-orange-100', text: 'text-orange-600', label: 'Crypto Wallet' };
        case 'Rewards':
            return { icon: ICONS.star, bg: 'bg-indigo-100', text: 'text-indigo-600', label: 'Rewards Wallet' };
        default:
            return { icon: ICONS.wallet, bg: 'bg-slate-100', text: 'text-slate-600', label: 'Wallet' };
    }
};

const WalletCard: React.FC<WalletCardProps> = ({ wallet, onDelete }) => {
    const { navigate } = useNavigation();
    const { icon, bg, text, label } = getWalletStyle(wallet.type);

    const handleAction = () => {
        if (wallet.type === 'Fiat' || wallet.type === 'Crypto') {
            navigate('exchange', { tab: 'swap', fromCurrency: wallet.currency });
        }
    };

    return (
        <Card className="p-4 flex items-center gap-4 border-slate-200">
            <div className={`flex-shrink-0 p-3 rounded-full ${bg} ${text}`}>
                <div className="h-6 w-6">{icon}</div>
            </div>
            <div className="flex-grow">
                <div className="flex justify-between items-start">
                    <div>
                        <p className="font-bold text-slate-800">{wallet.name}</p>
                        <p className="text-xs text-slate-500">{label}</p>
                    </div>
                    <div className="text-right">
                        <p className="font-mono font-semibold text-lg text-slate-800">{wallet.balance.toLocaleString(undefined, { maximumFractionDigits: wallet.type === 'Crypto' ? 8 : 2 })}</p>
                        <p className="text-xs text-slate-500">{wallet.currency}</p>
                    </div>
                </div>
            </div>
            <div className="flex items-center gap-2">
                 <button
                    onClick={handleAction}
                    className="p-2 text-slate-500 hover:text-teal-500 hover:bg-slate-100 rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    aria-label={`Exchange ${wallet.currency}`}
                    disabled={wallet.type === 'Rewards'}
                >
                    <div className="h-5 w-5">{ICONS.swap}</div>
                </button>
                <button
                    onClick={() => onDelete(wallet.currency)}
                    className="p-2 text-slate-500 hover:text-red-500 hover:bg-slate-100 rounded-full transition-colors"
                    aria-label={`Delete ${wallet.currency} wallet`}
                >
                    <div className="h-5 w-5">{ICONS.trash}</div>
                </button>
            </div>
        </Card>
    );
};

export default WalletCard;