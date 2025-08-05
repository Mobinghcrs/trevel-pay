import React, { useState, useEffect, useCallback } from 'react';
import { Store } from '../types';
import { getAdminStores, createAdminStore, updateAdminStore, deleteAdminStore } from '../services/apiService';
import Spinner from '../components/Spinner';
import { ICONS } from '../constants';
import StoreFormModal from './components/StoreFormModal';
import ProductManagementPage from './ProductManagementPage';

const StoreManagementPage: React.FC = () => {
    const [stores, setStores] = useState<Store[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingStore, setEditingStore] = useState<Store | null>(null);
    const [managingStore, setManagingStore] = useState<Store | null>(null);

    const fetchStores = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            const data = await getAdminStores();
            setStores(data);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to load stores.");
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchStores();
    }, [fetchStores]);
    
    const handleOpenModal = (store: Store | null = null) => {
        setEditingStore(store);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingStore(null);
    };

    const handleSaveStore = async (storeData: Omit<Store, 'id'> | Store) => {
        try {
            if ('id' in storeData) {
                await updateAdminStore(storeData.id, storeData);
            } else {
                await createAdminStore(storeData);
            }
            fetchStores();
            handleCloseModal();
        } catch (err) {
            alert(`Error saving store: ${err instanceof Error ? err.message : 'Unknown error'}`);
        }
    };
    
    const handleDeleteStore = async (storeId: string) => {
        if (confirm('Are you sure you want to permanently delete this store and all its products?')) {
            try {
                await deleteAdminStore(storeId);
                fetchStores();
            } catch (err) {
                 alert(`Error deleting store: ${err instanceof Error ? err.message : 'Unknown error'}`);
            }
        }
    };

    if (managingStore) {
        return <ProductManagementPage store={managingStore} onBack={() => setManagingStore(null)} />;
    }

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-slate-900">Store Management</h1>
                <button 
                    onClick={() => handleOpenModal()}
                    className="flex items-center gap-2 bg-cyan-500 text-white px-4 py-2 rounded-md font-semibold hover:bg-cyan-600 transition-colors"
                >
                    <span className="h-5 w-5">{ICONS.add}</span>
                    <span>Add New Store</span>
                </button>
            </div>

            {error && <div className="text-center text-red-600 bg-red-100 p-4 rounded-md mb-4">{error}</div>}
            
            <div className="bg-white border border-slate-200 rounded-lg overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-slate-200">
                        <thead className="bg-slate-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Store</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Description</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-slate-200">
                            {isLoading ? (
                                <tr><td colSpan={3}><Spinner message="Loading stores..." /></td></tr>
                            ) : stores.length === 0 ? (
                                <tr><td colSpan={3} className="text-center p-8 text-slate-500">No stores found. Add one to get started.</td></tr>
                            ) : (
                                stores.map(store => (
                                    <tr key={store.id} className="hover:bg-slate-50 transition-colors">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center gap-3">
                                                <img src={store.logoUrl} alt={store.name} className="h-10 w-10 rounded-lg bg-slate-100 object-contain p-1"/>
                                                <span className="font-semibold text-slate-900">{store.name}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-slate-500 max-w-sm truncate">{store.description}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                            <div className="flex items-center gap-4">
                                                <button onClick={() => setManagingStore(store)} className="text-green-600 hover:text-green-500">Manage Products</button>
                                                <button onClick={() => handleOpenModal(store)} className="text-cyan-600 hover:text-cyan-500">Edit</button>
                                                <button onClick={() => handleDeleteStore(store.id)} className="text-red-600 hover:text-red-500">Delete</button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {isModalOpen && (
                 <StoreFormModal
                    isOpen={isModalOpen}
                    onClose={handleCloseModal}
                    onSave={handleSaveStore}
                    store={editingStore}
                />
            )}
        </div>
    );
};

export default StoreManagementPage;
