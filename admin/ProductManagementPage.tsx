import React, { useState, useEffect, useCallback } from 'react';
import { Store, Product } from '../types';
import { getAdminProducts, createAdminProduct, updateAdminProduct, deleteAdminProduct } from '../services/apiService';
import Spinner from '../components/Spinner';
import { ICONS } from '../constants';
import ProductFormModal from './components/ProductFormModal';

interface ProductManagementPageProps {
    store: Store;
    onBack: () => void;
}

const ProductManagementPage: React.FC<ProductManagementPageProps> = ({ store, onBack }) => {
    const [products, setProducts] = useState<Product[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState<Product | null>(null);

    const fetchProducts = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            const data = await getAdminProducts(store.id);
            setProducts(data);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to load products.");
        } finally {
            setIsLoading(false);
        }
    }, [store.id]);

    useEffect(() => {
        fetchProducts();
    }, [fetchProducts]);

    const handleOpenModal = (product: Product | null = null) => {
        setEditingProduct(product);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingProduct(null);
    };

    const handleSaveProduct = async (productData: Omit<Product, 'id' | 'storeId'> | Product) => {
        try {
            if ('id' in productData) {
                await updateAdminProduct(productData.id, productData);
            } else {
                await createAdminProduct({ ...productData, storeId: store.id });
            }
            fetchProducts();
            handleCloseModal();
        } catch (err) {
            alert(`Error saving product: ${err instanceof Error ? err.message : 'Unknown error'}`);
        }
    };

    const handleDeleteProduct = async (productId: string) => {
        if (confirm('Are you sure you want to permanently delete this product?')) {
            try {
                await deleteAdminProduct(productId);
                fetchProducts();
            } catch (err) {
                alert(`Error deleting product: ${err instanceof Error ? err.message : 'Unknown error'}`);
            }
        }
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <div>
                    <button onClick={onBack} className="text-sm text-cyan-600 hover:text-cyan-500 mb-2">&larr; Back to All Stores</button>
                    <h1 className="text-3xl font-bold text-slate-900">Manage Products for <span className="text-cyan-600">{store.name}</span></h1>
                </div>
                <button
                    onClick={() => handleOpenModal()}
                    className="flex items-center gap-2 bg-cyan-500 text-white px-4 py-2 rounded-md font-semibold hover:bg-cyan-600 transition-colors"
                >
                    <span className="h-5 w-5">{ICONS.add}</span>
                    <span>Add New Product</span>
                </button>
            </div>

            {error && <div className="text-center text-red-600 bg-red-100 p-4 rounded-md mb-4">{error}</div>}

            <div className="bg-white border border-slate-200 rounded-lg overflow-hidden">
                <table className="min-w-full divide-y divide-slate-200">
                    <thead className="bg-slate-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Product</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Category</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Price</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200">
                        {isLoading ? (
                            <tr><td colSpan={4}><Spinner message="Loading products..." /></td></tr>
                        ) : products.length === 0 ? (
                            <tr><td colSpan={4} className="text-center p-8 text-slate-500">No products found for this store.</td></tr>
                        ) : (
                            products.map(product => (
                                <tr key={product.id} className="hover:bg-slate-50">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <img src={product.imageUrl} alt={product.name} className="h-10 w-10 rounded-md bg-slate-100 object-cover" />
                                            <span className="font-semibold text-slate-900">{product.name}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-slate-500">{product.category}</td>
                                    <td className="px-6 py-4 text-sm font-mono text-slate-900">${product.price.toFixed(2)}</td>
                                    <td className="px-6 py-4">
                                        <div className="flex gap-4">
                                            <button onClick={() => handleOpenModal(product)} className="text-cyan-600 hover:text-cyan-500">Edit</button>
                                            <button onClick={() => handleDeleteProduct(product.id)} className="text-red-600 hover:text-red-500">Delete</button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {isModalOpen && (
                <ProductFormModal
                    isOpen={isModalOpen}
                    onClose={handleCloseModal}
                    onSave={handleSaveProduct}
                    product={editingProduct}
                />
            )}
        </div>
    );
};

export default ProductManagementPage;
