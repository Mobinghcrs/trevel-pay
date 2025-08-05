import React, { useState, useEffect } from 'react';
import { UserProfile, Wallet } from '../../types';
import Card from '../../components/Card';
import { ICONS } from '../../constants';
import UserProfileCard from './UserProfileCard';
import WalletCard from './WalletCard';
import AddWalletForm from './AddWalletForm';
import { getUserProfile, updateUserProfile, addWallet, deleteWallet } from '../../services/apiService';
import Spinner from '../../components/Spinner';

interface ProfilePageProps {
    isGuest: boolean;
}

const GuestOverlay: React.FC = () => (
    <div className="absolute inset-0 bg-slate-50/80 backdrop-blur-sm z-10 flex flex-col items-center justify-center text-center p-4 rounded-xl">
        <div className="p-3 bg-teal-100 rounded-full text-teal-600 mb-4">
            {ICONS.lockClosed}
        </div>
        <h3 className="text-lg font-bold text-slate-800">Feature locked for guests</h3>
        <p className="text-slate-600">Please sign in as a user to manage your profile and wallets.</p>
    </div>
);

const ProfilePage: React.FC<ProfilePageProps> = ({ isGuest }) => {
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isEditingProfile, setIsEditingProfile] = useState(false);
    const [isAddingWallet, setIsAddingWallet] = useState(false);

    useEffect(() => {
        if (isGuest) {
            setIsLoading(false);
            return;
        }
        const loadProfile = async () => {
            setIsLoading(true);
            try {
                const fetchedProfile = await getUserProfile();
                setProfile(fetchedProfile);
            } catch (err) {
                console.error("Failed to load or fetch profile", err);
                setError(err instanceof Error ? err.message : 'Failed to load profile.');
            } finally {
                setIsLoading(false);
            }
        };
        loadProfile();
    }, [isGuest]);

    const handleProfileSave = async (updatedInfo: { name: string; email: string }) => {
        try {
            const updatedProfile = await updateUserProfile(updatedInfo);
            setProfile(updatedProfile);
            setIsEditingProfile(false);
        } catch (error) {
            alert(`Failed to save profile: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    };

    const handleAddWallet = async (newWallet: Wallet) => {
        try {
            const updatedProfile = await addWallet(newWallet);
            setProfile(updatedProfile);
            setIsAddingWallet(false);
        } catch (error) {
             alert(`Failed to add wallet: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    };
    
    const handleDeleteWallet = async (currency: string) => {
        if(confirm(`Are you sure you want to delete the ${currency} wallet?`)) {
            try {
                const updatedProfile = await deleteWallet(currency);
                setProfile(updatedProfile);
            } catch (error) {
                alert(`Failed to delete wallet: ${error instanceof Error ? error.message : 'Unknown error'}`);
            }
        }
    };
    
    if (isLoading) return <Spinner message="Loading your profile..."/>;
    if (error) return <div className="text-center text-red-500 bg-red-100 p-4 rounded-md">{error}</div>;

    const profileData = profile || {
        name: 'Guest',
        email: 'guest@example.com',
        memberSince: new Date().toISOString(),
        avatarUrl: 'https://i.pravatar.cc/150?u=guest',
        wallets: [],
    };
    
    return (
        <div className="relative">
            {isGuest && <GuestOverlay />}
            <div className="mb-8 text-center">
                <h1 className="text-3xl font-bold text-slate-900">User Profile</h1>
                <p className="text-slate-600 mt-1">Your personal dashboard and wallets.</p>
            </div>

            <div className={`grid grid-cols-1 lg:grid-cols-3 gap-8 items-start ${isGuest ? 'blur-sm' : ''}`}>
                <div className="lg:col-span-1">
                    <UserProfileCard
                        profile={profileData}
                        isEditing={isEditingProfile}
                        onSave={handleProfileSave}
                        onEdit={() => setIsEditingProfile(true)}
                        onCancel={() => setIsEditingProfile(false)}
                        isGuest={isGuest}
                     />
                </div>
                <div className="lg:col-span-2 space-y-4">
                    <div className="flex justify-between items-center px-1">
                        <h2 className="text-xl font-bold text-slate-900">My Wallets</h2>
                        {!isAddingWallet && (
                            <button
                                onClick={() => setIsAddingWallet(true)}
                                disabled={isGuest}
                                className="flex items-center gap-2 text-teal-600 hover:text-teal-500 font-semibold py-2 px-3 rounded-md bg-teal-100 hover:bg-teal-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <span className="h-5 w-5">{ICONS.add}</span>
                                <span>Add Wallet</span>
                            </button>
                        )}
                    </div>
                    {isAddingWallet && (
                        <AddWalletForm
                            onAddWallet={handleAddWallet}
                            onCancel={() => setIsAddingWallet(false)}
                        />
                    )}
                    {profileData.wallets.length > 0 ? (
                        profileData.wallets.map((wallet) => (
                            <WalletCard key={wallet.currency} wallet={wallet} onDelete={handleDeleteWallet} />
                        ))
                    ) : (
                        !isAddingWallet && (
                            <Card className="p-8 text-center border-2 border-dashed border-slate-300 bg-slate-50">
                                <p className="text-slate-600">You don't have any wallets yet.</p>
                                <p className="text-slate-500 text-sm">Click "Add Wallet" to create your first one.</p>
                            </Card>
                        )
                    )}
                </div>
            </div>
        </div>
    );
};

export default ProfilePage;