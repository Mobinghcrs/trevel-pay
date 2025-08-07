import React, { useState, useEffect } from 'react';
import { UserProfile } from '../../types';
import Card from '../../components/Card';
import { ICONS } from '../../constants';

interface UserProfileCardProps {
    profile: UserProfile;
    isEditing: boolean;
    onSave: (data: { name: string; email: string }) => void;
    onEdit: () => void;
    onCancel: () => void;
    isGuest: boolean;
}

const UserProfileCard: React.FC<UserProfileCardProps> = ({ profile, isEditing, onSave, onEdit, onCancel, isGuest }) => {
    const [formData, setFormData] = useState({ name: profile.name, email: profile.email });

    useEffect(() => {
        setFormData({ name: profile.name, email: profile.email });
    }, [profile]);

    const handleSave = () => {
        onSave(formData);
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
        });
    }

    return (
        <Card className="p-6 border-slate-200">
            {isEditing ? (
                <div className="flex flex-col items-center text-center space-y-4">
                    <h2 className="text-xl font-bold text-slate-900">Edit Profile</h2>
                    <div>
                        <label htmlFor="name" className="text-sm font-medium text-slate-700 mb-1 text-left block">Name</label>
                        <input
                            id="name"
                            type="text"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            className="w-full bg-white border border-slate-300 rounded-md px-3 py-2 text-slate-900 focus:ring-2 focus:ring-teal-500 focus:outline-none"
                        />
                    </div>
                    <div>
                        <label htmlFor="email" className="text-sm font-medium text-slate-700 mb-1 text-left block">Email</label>
                        <input
                            id="email"
                            type="email"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            className="w-full bg-white border border-slate-300 rounded-md px-3 py-2 text-slate-900 focus:ring-2 focus:ring-teal-500 focus:outline-none"
                        />
                    </div>
                    <div className="flex justify-center gap-4 pt-2 w-full">
                        <button onClick={onCancel} className="w-full bg-slate-200 text-slate-800 px-4 py-2 rounded-md font-semibold hover:bg-slate-300 transition-colors">Cancel</button>
                        <button onClick={handleSave} className="w-full bg-teal-600 text-white px-4 py-2 rounded-md font-semibold hover:bg-teal-700 transition-colors">Save</button>
                    </div>
                </div>
            ) : (
                <div className="text-center flex flex-col items-center">
                    <img 
                        src={profile.avatarUrl} 
                        alt={`${profile.name}'s avatar`} 
                        className="w-24 h-24 rounded-full border-4 border-white shadow-md mb-4 bg-slate-200"
                        onError={(e) => { e.currentTarget.src = 'https://i.pravatar.cc/150'; }}
                    />
                    <h2 className="text-2xl font-bold text-slate-900">{profile.name}</h2>
                    <p className="text-slate-600">{profile.email}</p>
                    <p className="text-slate-500 font-mono text-sm mt-1">{profile.userId}</p>
                    <p className="mt-4 text-xs text-slate-500 bg-slate-100 px-3 py-1 rounded-full">
                        Member since {formatDate(profile.memberSince)}
                    </p>
                    <button
                        onClick={onEdit}
                        disabled={isGuest}
                        className="mt-6 w-full flex items-center justify-center gap-2 text-slate-700 hover:bg-slate-200 font-semibold py-2 px-4 rounded-md bg-slate-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {ICONS.edit}
                        <span>Edit Profile</span>
                    </button>
                </div>
            )}
        </Card>
    );
};

export default UserProfileCard;