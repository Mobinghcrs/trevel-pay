import React, { useState } from 'react';
import { Wallet } from '../../types';
import Card from '../../components/Card';
import { COMMON_CRYPTO_CURRENCIES, COMMON_FIAT_CURRENCIES } from '../../constants';

interface AddWalletFormProps {
    onAddWallet: (wallet: Wallet) => void;
    onCancel: () => void;
}

const AddWalletForm: React.FC<AddWalletFormProps> = ({ onAddWallet, onCancel }) => {
    const [type, setType] = useState<Wallet['type']>('Crypto');
    const [selectedAsset, setSelectedAsset] = useState('');
    const [customName, setCustomName] = useState('');
    const [customSymbol, setCustomSymbol] = useState('');
    const [balance, setBalance] = useState('0');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
        let walletData: { name: string; currency: string; };

        if (type === 'Crypto' || type === 'Fiat') {
            if (!selectedAsset) {
                alert('Please select an asset from the list.');
                return;
            }
            const { name, symbol } = JSON.parse(selectedAsset);
            walletData = { name, currency: symbol };
        } else { // Rewards
            if (!customName || !customSymbol) {
                alert("Please enter a name and symbol for the rewards wallet.");
                return;
            }
            walletData = { name: customName, currency: customSymbol.toUpperCase() };
        }

        onAddWallet({
            ...walletData,
            type,
            balance: parseFloat(balance) || 0,
        });
    };
    
    return (
        <Card className="p-6 border-2 border-teal-500/50 bg-white">
            <form onSubmit={handleSubmit} className="space-y-4">
                <h3 className="text-lg font-bold text-gray-900">Add New Wallet</h3>
                <div>
                    <label htmlFor="wallet-type" className="block text-sm font-medium text-gray-700 mb-1">Wallet Type</label>
                    <select
                        id="wallet-type"
                        value={type}
                        onChange={(e) => {
                            setType(e.target.value as Wallet['type']);
                            setSelectedAsset('');
                        }}
                        className="w-full bg-white border border-gray-300 rounded-md px-3 py-2 text-gray-900 focus:ring-2 focus:ring-teal-500 focus:outline-none"
                    >
                        <option value="Crypto">Crypto</option>
                        <option value="Fiat">Fiat</option>
                        <option value="Rewards">Rewards</option>
                    </select>
                </div>
                
                {type === 'Crypto' && (
                    <div>
                        <label htmlFor="crypto-select" className="block text-sm font-medium text-gray-700 mb-1">Select Crypto Asset</label>
                        <select
                            id="crypto-select"
                            value={selectedAsset}
                            onChange={(e) => setSelectedAsset(e.target.value)}
                            required
                             className="w-full bg-white border border-gray-300 rounded-md px-3 py-2 text-gray-900 focus:ring-2 focus:ring-teal-500 focus:outline-none"
                        >
                            <option value="" disabled>-- Select an asset --</option>
                            {COMMON_CRYPTO_CURRENCIES.map(c => (
                                <option key={c.symbol} value={JSON.stringify(c)}>
                                    {c.name} ({c.symbol})
                                </option>
                            ))}
                        </select>
                    </div>
                )}
                
                {type === 'Fiat' && (
                    <div>
                        <label htmlFor="fiat-select" className="block text-sm font-medium text-gray-700 mb-1">Select Fiat Currency</label>
                        <select
                            id="fiat-select"
                            value={selectedAsset}
                            onChange={(e) => setSelectedAsset(e.target.value)}
                            required
                            className="w-full bg-white border border-gray-300 rounded-md px-3 py-2 text-gray-900 focus:ring-2 focus:ring-teal-500 focus:outline-none"
                        >
                             <option value="" disabled>-- Select a currency --</option>
                            {COMMON_FIAT_CURRENCIES.map(c => (
                                <option key={c.symbol} value={JSON.stringify(c)}>
                                    {c.name} ({c.symbol})
                                </option>
                            ))}
                        </select>
                    </div>
                )}

                {type === 'Rewards' && (
                    <>
                        <div>
                            <label htmlFor="wallet-name" className="block text-sm font-medium text-gray-700 mb-1">Reward Name</label>
                            <input
                                id="wallet-name"
                                type="text"
                                value={customName}
                                onChange={(e) => setCustomName(e.target.value)}
                                placeholder="e.g., Loyalty Points"
                                required
                                className="w-full bg-white border border-gray-300 rounded-md px-3 py-2 text-gray-900 focus:ring-2 focus:ring-teal-500 focus:outline-none"
                            />
                        </div>
                        <div>
                            <label htmlFor="wallet-currency" className="block text-sm font-medium text-gray-600 mb-1">Reward Symbol</label>
                            <input
                                id="wallet-currency"
                                type="text"
                                value={customSymbol}
                                onChange={(e) => setCustomSymbol(e.target.value)}
                                placeholder="e.g., LP"
                                required
                                className="w-full bg-white border border-gray-300 rounded-md px-3 py-2 text-gray-900 focus:ring-2 focus:ring-teal-500 focus:outline-none"
                            />
                        </div>
                    </>
                )}

                <div>
                    <label htmlFor="wallet-balance" className="block text-sm font-medium text-gray-700 mb-1">Initial Balance</label>
                    <input
                        id="wallet-balance"
                        type="number"
                        step="any"
                        value={balance}
                        onChange={(e) => setBalance(e.target.value)}
                        className="w-full bg-white border border-gray-300 rounded-md px-3 py-2 text-gray-900 focus:ring-2 focus:ring-teal-500 focus:outline-none"
                    />
                </div>

                <div className="flex justify-end gap-4 pt-2">
                    <button type="button" onClick={onCancel} className="bg-gray-200 text-gray-800 px-4 py-2 rounded-md font-semibold hover:bg-gray-300 transition-colors">
                        Cancel
                    </button>
                    <button type="submit" className="bg-teal-600 text-white px-4 py-2 rounded-md font-semibold hover:bg-teal-700 transition-colors">
                        Add Wallet
                    </button>
                </div>
            </form>
        </Card>
    );
};

export default AddWalletForm;