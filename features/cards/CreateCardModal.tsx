import React, { useState, useEffect } from 'react';
import Modal from '../../components/Modal';
import { Wallet } from '../../types';
import { getUserProfile, createVirtualCard } from '../../services/apiService';
import Spinner from '../../components/Spinner';

interface CreateCardModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
}

const CreateCardModal: React.FC<CreateCardModalProps> = ({ isOpen, onClose, onSuccess }) => {
    const [fiatWallets, setFiatWallets] = useState<Wallet[]>([]);
    const [selectedWallet, setSelectedWallet] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [isCreating, setIsCreating] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!isOpen) return;

        const fetchWallets = async () => {
            setIsLoading(true);
            setError(null);
            try {
                const profile = await getUserProfile();
                const userFiatWallets = profile.wallets.filter(w => w.type === 'Fiat');
                setFiatWallets(userFiatWallets);
                if (userFiatWallets.length > 0) {
                    setSelectedWallet(userFiatWallets[0].currency);
                }
            } catch (e) {
                setError(e instanceof Error ? e.message : "Failed to load wallets.");
            } finally {
                setIsLoading(false);
            }
        };

        fetchWallets();
    }, [isOpen]);

    const handleCreate = async () => {
        if (!selectedWallet) {
            setError("Please select a wallet to link the card to.");
            return;
        }
        setIsCreating(true);
        setError(null);
        try {
            await createVirtualCard(selectedWallet);
            onSuccess();
        } catch (e) {
            setError(e instanceof Error ? e.message : "Failed to create card.");
        } finally {
            setIsCreating(false);
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Create New Virtual Card">
            {isLoading ? <Spinner message="Loading wallets..." /> : (
                <div className="space-y-4">
                    <p className="text-gray-600">
                        Create a new TRAVEL PAY virtual card. This card will be linked to one of your fiat currency wallets and can be used for payments within the app.
                    </p>
                    
                    {fiatWallets.length > 0 ? (
                        <div>
                            <label htmlFor="wallet-select" className="block text-sm font-medium text-gray-700 mb-1">
                                Link card to wallet:
                            </label>
                             <select
                                id="wallet-select"
                                value={selectedWallet}
                                onChange={(e) => setSelectedWallet(e.target.value)}
                                className="w-full bg-white border border-gray-300 rounded-md px-3 py-2 text-gray-900 focus:ring-2 focus:ring-teal-500 focus:outline-none"
                            >
                                {fiatWallets.map(w => (
                                    <option key={w.currency} value={w.currency}>
                                        {w.name} ({w.balance.toFixed(2)} {w.currency})
                                    </option>
                                ))}
                            </select>
                        </div>
                    ) : (
                        <p className="text-center text-amber-700 bg-amber-100 p-3 rounded-md">
                            You need a Fiat wallet (e.g., USD, EUR) to create a virtual card. Please add one in your profile.
                        </p>
                    )}
                    
                    {error && <p className="text-sm text-red-600">{error}</p>}
                    
                    <div className="flex justify-end gap-4 pt-4">
                        <button onClick={onClose} className="bg-gray-200 text-gray-800 px-4 py-2 rounded-md font-semibold hover:bg-gray-300 transition-colors">
                            Cancel
                        </button>
                        <button 
                            onClick={handleCreate} 
                            disabled={isCreating || fiatWallets.length === 0}
                            className="bg-teal-600 text-white px-4 py-2 rounded-md font-semibold hover:bg-teal-700 transition-colors disabled:bg-gray-400"
                        >
                            {isCreating ? 'Creating...' : 'Create Card'}
                        </button>
                    </div>
                </div>
            )}
        </Modal>
    );
};

export default CreateCardModal;