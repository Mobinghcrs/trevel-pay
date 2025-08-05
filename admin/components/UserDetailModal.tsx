import React, { useState, useEffect, useCallback } from 'react';
import ReactDOM from 'react-dom';
import { AdminUser, Wallet, VirtualCard } from '../../types';
import { ICONS, COMMON_CRYPTO_CURRENCIES, COMMON_FIAT_CURRENCIES } from '../../constants';
import { 
    updateAdminUser, 
    updateAdminUserStatus, 
    adminAddUserWallet, 
    adminUpdateUserWallet, 
    adminDeleteUserWallet,
    getAdminVirtualCards,
    createAdminVirtualCard,
    updateAdminVirtualCardStatus
} from '../../services/apiService';
import Spinner from '../../components/Spinner';

interface UserDetailModalProps {
  user: AdminUser;
  isOpen: boolean;
  onClose: () => void;
  onUserUpdate: () => void;
}

const UserDetailModal: React.FC<UserDetailModalProps> = ({ user, isOpen, onClose, onUserUpdate }) => {
  const [activeTab, setActiveTab] = useState<'profile' | 'wallets' | 'cards' | 'actions'>(
      user.accountType === 'Guest' ? 'actions' : 'profile'
  );
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Editable states
  const [profileData, setProfileData] = useState({ name: user.name, email: user.email, avatarUrl: user.avatarUrl });
  const [wallets, setWallets] = useState<Wallet[]>(user.wallets);
  const [isAddingWallet, setIsAddingWallet] = useState(false);

  useEffect(() => {
    setProfileData({ name: user.name, email: user.email, avatarUrl: user.avatarUrl });
    setWallets(user.wallets);
    setError(null);
    setIsSaving(false);
    setIsAddingWallet(false);
    setActiveTab(user.accountType === 'Guest' ? 'actions' : 'profile');
  }, [user]);

  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [onClose]);
  
  const handleSaveProfile = async () => {
    setIsSaving(true);
    setError(null);
    try {
        await updateAdminUser(user.id, profileData);
        onUserUpdate();
        alert("Profile updated successfully!");
    } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to save profile.");
    } finally {
        setIsSaving(false);
    }
  };

  const handleStatusChange = async (newStatus: 'Active' | 'Suspended') => {
      if (!confirm(`Are you sure you want to ${newStatus === 'Active' ? 'activate' : 'suspend'} this user?`)) return;
      setIsSaving(true);
      setError(null);
      try {
          await updateAdminUserStatus(user.id, newStatus);
          onUserUpdate();
          onClose(); // Close modal after major action
      } catch (err) {
          setError(err instanceof Error ? err.message : "Failed to update status.");
      } finally {
          setIsSaving(false);
      }
  };

  if (!isOpen) return null;

  const renderContent = () => {
    switch(activeTab) {
        case 'profile': return <ProfileEditor data={profileData} setData={setProfileData} onSave={handleSaveProfile} isSaving={isSaving} />;
        case 'wallets': return <WalletManager userId={user.id} wallets={wallets} setWallets={setWallets} onUserUpdate={onUserUpdate} isAdding={isAddingWallet} setIsAdding={setIsAddingWallet} />;
        case 'cards': return <CardManager user={user} />;
        case 'actions': return <AdminActions user={user} onStatusChange={handleStatusChange} isSaving={isSaving} />;
    }
  }

  return ReactDOM.createPortal(
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-50 p-4" onClick={onClose}>
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl transform transition-all text-slate-800 flex overflow-hidden" onClick={(e) => e.stopPropagation()}>
        {/* Sidebar */}
        <div className="w-1/3 bg-slate-800 p-4 rounded-l-xl">
            <div className="text-center mb-6">
                <img src={user.avatarUrl} alt={user.name} className="w-20 h-20 rounded-full mx-auto border-4 border-slate-700 shadow-md" />
                <h3 className="font-bold mt-2 text-ellipsis overflow-hidden text-white">{user.name}</h3>
                <p className="text-xs text-slate-400 text-ellipsis overflow-hidden">{user.email}</p>
                <p className={`mt-2 text-xs font-bold px-2 py-0.5 rounded-full inline-block ${user.accountType === 'Registered' ? 'bg-blue-200/20 text-blue-300' : 'bg-slate-600 text-slate-300'}`}>
                    {user.accountType} Account
                </p>
            </div>
            <ul className="space-y-2">
                <TabButton label="Profile" icon={ICONS.user} isActive={activeTab === 'profile'} onClick={() => setActiveTab('profile')} disabled={user.accountType === 'Guest'} />
                <TabButton label="Wallets" icon={ICONS.wallet} isActive={activeTab === 'wallets'} onClick={() => setActiveTab('wallets')} disabled={user.accountType === 'Guest'} />
                <TabButton label="Cards" icon={ICONS.creditCard} isActive={activeTab === 'cards'} onClick={() => setActiveTab('cards')} disabled={user.accountType === 'Guest'} />
                <TabButton label="Admin Actions" icon={ICONS.userCog} isActive={activeTab === 'actions'} onClick={() => setActiveTab('actions')} />
            </ul>
        </div>
        {/* Main Content */}
        <div className="w-2/3 p-6 relative overflow-y-auto max-h-[90vh]">
             <button onClick={onClose} className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-800 hover:bg-slate-100 rounded-full transition-colors" aria-label="Close dialog">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
            {error && <div className="bg-red-100 border border-red-200 text-red-700 p-3 rounded-md mb-4 text-sm">{error}</div>}
            {renderContent()}
        </div>
      </div>
    </div>,
    document.body
  );
};

// --- Sub-components for the Modal ---

const TabButton: React.FC<{ label: string; icon: React.ReactNode; isActive: boolean; onClick: () => void; disabled?: boolean; }> = ({ label, icon, isActive, onClick, disabled = false }) => (
    <li>
        <button 
            onClick={onClick} 
            disabled={disabled}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-colors duration-150 ${
                isActive ? 'bg-cyan-600 text-white shadow' : 'text-slate-300 hover:bg-slate-700 hover:text-white'
            } ${
                disabled ? 'opacity-50 cursor-not-allowed hover:bg-transparent hover:text-slate-300' : ''
            }`}
        >
           <span className="h-5 w-5">{icon}</span> {label}
        </button>
    </li>
);

const ProfileEditor: React.FC<{ data: any; setData: any; onSave: () => void; isSaving: boolean }> = ({ data, setData, onSave, isSaving }) => (
    <div>
        <h2 className="text-2xl font-bold mb-4 text-slate-900">Edit Profile</h2>
        <div className="space-y-4">
            <div>
                <label htmlFor="name" className="block text-sm font-medium text-slate-600 mb-1">Full Name</label>
                <input id="name" type="text" value={data.name} onChange={e => setData({...data, name: e.target.value})} className="w-full px-3 py-2 bg-slate-100 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500" />
            </div>
            <div>
                <label htmlFor="email" className="block text-sm font-medium text-slate-600 mb-1">Email</label>
                <input id="email" type="email" value={data.email} onChange={e => setData({...data, email: e.target.value})} className="w-full px-3 py-2 bg-slate-100 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500" />
            </div>
             <div>
                <label htmlFor="avatarUrl" className="block text-sm font-medium text-slate-600 mb-1">Avatar URL</label>
                <input id="avatarUrl" type="text" value={data.avatarUrl} onChange={e => setData({...data, avatarUrl: e.target.value})} className="w-full px-3 py-2 bg-slate-100 border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500" />
            </div>
            <div className="pt-4 flex justify-end">
                <button onClick={onSave} disabled={isSaving} className="bg-cyan-500 text-white px-5 py-2 rounded-md font-semibold hover:bg-cyan-600 transition-colors disabled:bg-slate-400 disabled:cursor-wait">
                    {isSaving ? 'Saving...' : 'Save Changes'}
                </button>
            </div>
        </div>
    </div>
);

const WalletManager: React.FC<{ userId: string, wallets: Wallet[], setWallets: React.Dispatch<React.SetStateAction<Wallet[]>>, onUserUpdate: () => void, isAdding: boolean, setIsAdding: (isAdding: boolean) => void }> = ({ userId, wallets, setWallets, onUserUpdate, isAdding, setIsAdding }) => {
    
    const handleBalanceChange = (currency: string, newBalance: string) => {
        const updatedWallets = wallets.map(w => w.currency === currency ? { ...w, balance: parseFloat(newBalance) || 0 } : w);
        setWallets(updatedWallets);
    };

    const handleSaveWallet = async (currency: string, balance: number) => {
        if (!confirm('Are you sure you want to update this balance?')) return;
        try {
            await adminUpdateUserWallet(userId, currency, balance);
            onUserUpdate();
            alert("Balance updated!");
        } catch (err) {
            alert(`Error: ${err instanceof Error ? err.message : 'Failed to update wallet'}`);
        }
    };
    
    const handleDeleteWallet = async (currency: string) => {
        if (!confirm(`Are you sure you want to DELETE the ${currency} wallet for this user? This cannot be undone.`)) return;
        try {
            await adminDeleteUserWallet(userId, currency);
            onUserUpdate();
        } catch (err) {
            alert(`Error: ${err instanceof Error ? err.message : 'Failed to delete wallet'}`);
        }
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-4">
                 <h2 className="text-2xl font-bold text-slate-900">Wallet Management</h2>
                 {!isAdding && <button onClick={() => setIsAdding(true)} className="flex items-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-700 px-3 py-1.5 rounded-md text-sm font-semibold">{ICONS.add} Add Wallet</button>}
            </div>
            {isAdding && <AddWalletFormAdmin userId={userId} onUserUpdate={onUserUpdate} onCancel={() => setIsAdding(false)} />}
            <div className="space-y-3 max-h-96 overflow-y-auto pr-2 -mr-2">
                {wallets.length > 0 ? wallets.map(w => (
                     <div key={w.currency} className="bg-slate-50 p-3 rounded-md flex items-center gap-4 border border-slate-200">
                        <div className="flex-grow">
                            <p className="font-bold text-slate-800">{w.name} <span className="text-slate-500 font-normal">({w.currency})</span></p>
                            <p className="text-xs text-slate-500">{w.type}</p>
                        </div>
                        <input type="number" value={w.balance} onChange={e => handleBalanceChange(w.currency, e.target.value)} className="w-32 px-2 py-1 bg-white border border-slate-300 rounded-md text-right font-mono" />
                        <button onClick={() => handleSaveWallet(w.currency, w.balance)} className="p-2 text-cyan-600 hover:bg-slate-200 rounded-md" aria-label="Save balance">{ICONS.edit}</button>
                        <button onClick={() => handleDeleteWallet(w.currency)} className="p-2 text-red-500 hover:bg-slate-200 rounded-md" aria-label="Delete wallet">{ICONS.trash}</button>
                    </div>
                )) : <p className="text-slate-500 text-center p-4">This user has no wallets.</p>}
            </div>
        </div>
    )
};

const AddWalletFormAdmin: React.FC<{userId: string; onUserUpdate: () => void; onCancel: () => void;}> = ({ userId, onUserUpdate, onCancel }) => {
    const [type, setType] = useState<Wallet['type']>('Crypto');
    const [selectedAsset, setSelectedAsset] = useState('');
    const [balance, setBalance] = useState('0');
    const [isSaving, setIsSaving] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);
        try {
            if (!selectedAsset) {
                alert('Please select a currency.');
                return;
            }
            const { name, symbol } = JSON.parse(selectedAsset);
            await adminAddUserWallet(userId, { name, currency: symbol, type, balance: parseFloat(balance) });
            onUserUpdate();
            onCancel();
        } catch(err) {
            alert(`Error: ${err instanceof Error ? err.message : 'Failed to add wallet'}`);
        } finally {
            setIsSaving(false);
        }
    }

    return (
        <div className="bg-slate-100 p-4 rounded-lg mb-4 border border-slate-200">
            <h3 className="font-bold mb-2 text-slate-800">Add New Wallet</h3>
            <form onSubmit={handleSubmit} className="grid grid-cols-3 gap-3 items-end">
                <select value={type} onChange={e => setType(e.target.value as Wallet['type'])} className="px-3 py-2 bg-white border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500">
                    <option>Crypto</option>
                    <option>Fiat</option>
                    <option>Rewards</option>
                </select>
                <select value={selectedAsset} onChange={e => setSelectedAsset(e.target.value)} required className="px-3 py-2 bg-white border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500">
                    <option value="" disabled>-- Select --</option>
                    {(type === 'Crypto' ? COMMON_CRYPTO_CURRENCIES : COMMON_FIAT_CURRENCIES).map(c => <option key={c.symbol} value={JSON.stringify(c)}>{c.name}</option>)}
                </select>
                <input type="number" value={balance} onChange={e => setBalance(e.target.value)} placeholder="Balance" className="px-3 py-2 bg-white border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500" />
                <div className="col-span-3 flex justify-end gap-2">
                    <button type="button" onClick={onCancel} className="bg-slate-200 hover:bg-slate-300 px-3 py-1.5 rounded-md text-sm font-semibold">Cancel</button>
                    <button type="submit" disabled={isSaving} className="bg-cyan-500 hover:bg-cyan-600 text-white px-3 py-1.5 rounded-md text-sm font-semibold disabled:bg-slate-400">{isSaving ? 'Adding...' : 'Add'}</button>
                </div>
            </form>
        </div>
    )
}

const AdminVirtualCardDisplay: React.FC<{ cardHolderName: string, currency: string }> = ({ cardHolderName, currency }) => (
    <div className="w-full h-48 rounded-xl shadow-lg relative flex flex-col justify-between p-5 text-white flex-shrink-0 bg-gradient-to-br from-gray-800 to-black overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(#ffffff22_1px,transparent_1px)] [background-size:16px_16px] opacity-50"></div>
        <div className="absolute inset-0 bg-black/10 rounded-xl"></div>
        
        <div className="flex justify-between items-start z-10">
            <span className="font-bold text-lg">TRAVEL PAY</span>
            <span className="font-bold text-lg">{currency}</span>
        </div>

        <div className="z-10">
            <p className="font-mono text-xl tracking-wider">5558 88XX XXXX XXXX</p>
        </div>

        <div className="flex justify-between items-end z-10 text-sm">
            <div>
                <p className="text-xs opacity-80">Card Holder</p>
                <p className="font-semibold uppercase">{cardHolderName}</p>
            </div>
            <div>
                <p className="text-xs opacity-80">Expires</p>
                <p className="font-mono">MM/YY</p>
            </div>
        </div>
    </div>
);


const CardManager: React.FC<{ user: AdminUser }> = ({ user }) => {
    const [cards, setCards] = useState<VirtualCard[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isIssuing, setIsIssuing] = useState(false);
    const [selectedWallet, setSelectedWallet] = useState<string>('');
    const fiatWallets = user.wallets.filter(w => w.type === 'Fiat');

    const fetchCards = useCallback(async () => {
        try {
            const data = await getAdminVirtualCards(user.email);
            setCards(data.sort((a,b) => b.id.localeCompare(a.id)));
        } catch (e) {
            console.error(e);
        } finally {
            setIsLoading(false);
        }
    }, [user.email]);
    
    useEffect(() => {
        fetchCards();
        if (fiatWallets.length > 0 && !selectedWallet) {
            setSelectedWallet(fiatWallets[0].currency);
        }
    }, [user.email, fiatWallets, selectedWallet, fetchCards]);

    const handleIssueCard = async () => {
        if (!selectedWallet) {
            alert("Please select a wallet to link the card to.");
            return;
        }
        setIsIssuing(true);
        try {
            await createAdminVirtualCard(user.email, selectedWallet);
            await fetchCards();
        } catch (e) {
            alert(`Failed to issue card: ${e instanceof Error ? e.message : 'Unknown error'}`);
        } finally {
            setIsIssuing(false);
        }
    };
    
    const handleToggleStatus = async (card: VirtualCard) => {
        const newStatus = card.status === 'Active' ? 'Frozen' : 'Active';
        if (!confirm(`Are you sure you want to ${newStatus.toLowerCase()} card ending in ${card.cardNumber.slice(-4)}?`)) return;

        try {
            await updateAdminVirtualCardStatus(card.id, newStatus);
            await fetchCards();
        } catch (e) {
            alert(`Failed to update status: ${e instanceof Error ? e.message : 'Unknown error'}`);
        }
    };
    
    return (
        <div>
            <h2 className="text-2xl font-bold text-slate-900 mb-4">Virtual Cards</h2>
            <div className="bg-slate-50 p-4 rounded-lg mb-6 border border-slate-200">
                <h3 className="font-bold mb-2 text-slate-800">Issue New Card for {user.name}</h3>
                {fiatWallets.length > 0 ? (
                    <div className="grid grid-cols-2 gap-4 items-center">
                        <AdminVirtualCardDisplay cardHolderName={user.name} currency={selectedWallet} />
                        <div className="space-y-3">
                             <select value={selectedWallet} onChange={e => setSelectedWallet(e.target.value)} className="w-full px-3 py-2 bg-white border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500">
                                {fiatWallets.map(w => <option key={w.currency} value={w.currency}>{w.name} ({w.currency})</option>)}
                            </select>
                            <button onClick={handleIssueCard} disabled={isIssuing} className="w-full bg-cyan-500 hover:bg-cyan-600 text-white px-4 py-2 rounded-md font-semibold disabled:bg-slate-400">{isIssuing ? 'Issuing...' : 'Issue Card'}</button>
                        </div>
                    </div>
                ) : (
                    <p className="text-sm text-slate-600">This user needs a Fiat wallet before a card can be issued.</p>
                )}
            </div>
            
             <h3 className="font-bold text-slate-800 mb-2">Issued Cards</h3>
            {isLoading ? <Spinner message="Loading cards..." /> : (
                <div className="border border-slate-200 rounded-lg overflow-hidden">
                    <table className="min-w-full divide-y divide-slate-200">
                        <thead className="bg-slate-50">
                            <tr>
                                <th className="px-4 py-2 text-left text-xs font-medium text-slate-500 uppercase">Card Number</th>
                                <th className="px-4 py-2 text-left text-xs font-medium text-slate-500 uppercase">Wallet</th>
                                <th className="px-4 py-2 text-left text-xs font-medium text-slate-500 uppercase">Status</th>
                                <th className="px-4 py-2 text-left text-xs font-medium text-slate-500 uppercase">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200">
                            {cards.length > 0 ? cards.map(card => (
                                <tr key={card.id}>
                                    <td className="px-4 py-2 font-mono text-sm text-slate-700">•••• {card.cardNumber.slice(-4)}</td>
                                    <td className="px-4 py-2 text-sm text-slate-700">{card.walletCurrency}</td>
                                    <td className="px-4 py-2"><span className={`text-xs font-bold px-2 py-0.5 rounded-full ${card.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>{card.status}</span></td>
                                    <td className="px-4 py-2">
                                        <button onClick={() => handleToggleStatus(card)} className="text-sm text-cyan-600 hover:underline">
                                            {card.status === 'Active' ? 'Freeze' : 'Unfreeze'}
                                        </button>
                                    </td>
                                </tr>
                            )) : <tr><td colSpan={4} className="text-center p-4 text-slate-500 text-sm">No cards issued yet.</td></tr>}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};


const AdminActions: React.FC<{ user: AdminUser; onStatusChange: (status: 'Active' | 'Suspended') => void, isSaving: boolean }> = ({ user, onStatusChange, isSaving }) => (
    <div>
        <h2 className="text-2xl font-bold mb-4 text-slate-900">Admin Actions</h2>
        <div className="space-y-4">
            <div className="bg-slate-100 p-4 rounded-lg border border-slate-200">
                <h3 className="font-bold text-slate-800 mb-2">Change Status</h3>
                <p className="text-sm text-slate-600 mb-3">
                    Current status is <span className={`font-bold ${user.status === 'Active' ? 'text-green-600' : 'text-red-600'}`}>{user.status}</span>.
                    Suspending a user will prevent them from logging in.
                </p>
                <div className="flex gap-2">
                    {user.status === 'Suspended' ? (
                        <button onClick={() => onStatusChange('Active')} disabled={isSaving} className="flex items-center gap-2 bg-green-100 text-green-700 hover:bg-green-200 px-3 py-1.5 rounded-md text-sm font-semibold disabled:opacity-50">
                            <span className="h-5 w-5">{ICONS.shieldCheck}</span> Activate User
                        </button>
                    ) : (
                         <button onClick={() => onStatusChange('Suspended')} disabled={isSaving} className="flex items-center gap-2 bg-red-100 text-red-700 hover:bg-red-200 px-3 py-1.5 rounded-md text-sm font-semibold disabled:opacity-50">
                            <span className="h-5 w-5">{ICONS.shieldExclamation}</span> Suspend User
                        </button>
                    )}
                </div>
            </div>
            <div className="bg-slate-100 p-4 rounded-lg border border-slate-200">
                <h3 className="font-bold text-slate-800 mb-2">Delete User</h3>
                <p className="text-sm text-slate-600 mb-3">
                    Permanently deleting a user and all their data is an irreversible action.
                </p>
                <button disabled className="flex items-center gap-2 bg-slate-200 text-slate-500 px-3 py-1.5 rounded-md text-sm font-semibold cursor-not-allowed">
                    <span className="h-5 w-5">{ICONS.trash}</span> Delete User (Disabled)
                </button>
            </div>
        </div>
    </div>
);

export default UserDetailModal;