
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { AdminUser } from '../types';
import { getAdminUsers, createAdminUser } from '../services/apiService';
import Spinner from '../components/Spinner';
import UserTableRow from './components/UserTableRow';
import UserDetailModal from './components/UserDetailModal';
import { ICONS } from '../constants';
import UserFormModal from './components/UserFormModal';
import Card from '../components/Card';

const UserManagementPage: React.FC = () => {
    const [users, setUsers] = useState<AdminUser[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedUser, setSelectedUser] = useState<AdminUser | null>(null);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

    const fetchUsers = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            const data = await getAdminUsers();
            setUsers(data);
        } catch (err) {
            console.error(err);
            setError(err instanceof Error ? err.message : "Failed to load users.");
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchUsers();
    }, [fetchUsers]);

    const filteredUsers = useMemo(() => {
        if (!searchTerm) return users;
        return users.filter(user =>
            user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.email.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [users, searchTerm]);

    const handleViewDetails = (user: AdminUser) => {
        setSelectedUser(user);
    };

    const handleModalClose = () => {
        setSelectedUser(null);
    };

    const handleUserUpdate = () => {
        fetchUsers(); // Re-fetch all users to get the latest data
    };
    
    const handleCreateUser = async (newUserData: any) => {
        try {
            await createAdminUser(newUserData);
            fetchUsers();
            setIsCreateModalOpen(false);
        } catch (err) {
            alert(`Error creating user: ${err instanceof Error ? err.message : 'Unknown error'}`);
        }
    };

    return (
        <div>
            <h1 className="text-2xl font-bold text-slate-900 mb-6">User Management</h1>

            {error && <div className="text-center text-red-600 bg-red-100 p-4 rounded-md mb-4">{error}</div>}
            
            <Card className="overflow-hidden">
                <div className="p-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-slate-50/50 border-b border-slate-200">
                     <input
                        type="text"
                        placeholder="Search by name or email..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full md:w-64 px-4 py-2 bg-white border border-slate-300 rounded-md text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500"
                    />
                     <button 
                        onClick={() => setIsCreateModalOpen(true)}
                        className="flex items-center justify-center gap-2 bg-teal-600 text-white px-4 py-2 rounded-md font-semibold hover:bg-teal-700 transition-colors"
                    >
                        <span className="h-5 w-5">{ICONS.add}</span>
                        <span>Create User</span>
                    </button>
                </div>
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-slate-200">
                        <thead className="bg-slate-50">
                            <tr>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">User</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Status</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Role</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Account Type</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Joined</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Total Balance (USD)</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200">
                            {isLoading ? (
                                <tr><td colSpan={7}><Spinner message="Loading users..." /></td></tr>
                            ) : filteredUsers.length === 0 ? (
                                <tr><td colSpan={7} className="text-center p-8 text-slate-500">No users found.</td></tr>
                            ) : (
                                filteredUsers.map(user => (
                                    <UserTableRow key={user.id} user={user} onViewDetails={handleViewDetails} />
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </Card>

            {selectedUser && (
                <UserDetailModal
                    user={selectedUser}
                    isOpen={!!selectedUser}
                    onClose={handleModalClose}
                    onUserUpdate={handleUserUpdate}
                />
            )}
            
            <UserFormModal
                isOpen={isCreateModalOpen}
                onClose={() => setIsCreateModalOpen(false)}
                onSave={handleCreateUser}
            />

        </div>
    );
};

export default UserManagementPage;
