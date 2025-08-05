import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { Product } from '../../types';

interface ProductFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (productData: Omit<Product, 'id' | 'storeId'> | Product) => void;
  product: Product | null;
}

const ProductFormModal: React.FC<ProductFormModalProps> = ({ isOpen, onClose, onSave, product }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: 0,
    imageUrl: '',
    category: '',
  });
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (product) {
      setFormData({ 
        name: product.name, 
        description: product.description,
        price: product.price,
        imageUrl: product.imageUrl,
        category: product.category,
      });
    } else {
      setFormData({ name: '', description: '', price: 0, imageUrl: '', category: '' });
    }
  }, [product]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    const dataToSave = { ...formData, price: Number(formData.price) };
    if (product) {
      await onSave({ ...product, ...dataToSave });
    } else {
      await onSave(dataToSave);
    }
    setIsSaving(false);
  };

  if (!isOpen) return null;

  return ReactDOM.createPortal(
    <div className="fixed inset-0 bg-black/60 flex justify-center items-center z-50 p-4" onClick={onClose}>
      <div className="bg-white border border-slate-200 rounded-xl w-full max-w-lg" onClick={e => e.stopPropagation()}>
        <form onSubmit={handleSubmit}>
          <div className="p-4 border-b border-slate-200">
            <h2 className="text-lg font-bold text-slate-900">{product ? 'Edit Product' : 'Add New Product'}</h2>
          </div>
          <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-slate-600 mb-1">Product Name</label>
              <input id="name" type="text" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} required className="w-full px-3 py-2 bg-slate-100 border-slate-300 rounded-md text-slate-900 focus:outline-none focus:ring-2 focus:ring-cyan-500" />
            </div>
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-slate-600 mb-1">Description</label>
              <textarea id="description" value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} required rows={3} className="w-full px-3 py-2 bg-slate-100 border-slate-300 rounded-md text-slate-900 focus:outline-none focus:ring-2 focus:ring-cyan-500"></textarea>
            </div>
             <div className="grid grid-cols-2 gap-4">
                <div>
                    <label htmlFor="price" className="block text-sm font-medium text-slate-600 mb-1">Price ($)</label>
                    <input id="price" type="number" step="0.01" value={formData.price} onChange={e => setFormData({ ...formData, price: Number(e.target.value) })} required className="w-full px-3 py-2 bg-slate-100 border-slate-300 rounded-md text-slate-900 focus:outline-none focus:ring-2 focus:ring-cyan-500" />
                </div>
                <div>
                    <label htmlFor="category" className="block text-sm font-medium text-slate-600 mb-1">Category</label>
                    <input id="category" type="text" value={formData.category} onChange={e => setFormData({ ...formData, category: e.target.value })} required className="w-full px-3 py-2 bg-slate-100 border-slate-300 rounded-md text-slate-900 focus:outline-none focus:ring-2 focus:ring-cyan-500" />
                </div>
            </div>
            <div>
              <label htmlFor="imageUrl" className="block text-sm font-medium text-slate-600 mb-1">Image URL</label>
              <input id="imageUrl" type="text" value={formData.imageUrl} onChange={e => setFormData({ ...formData, imageUrl: e.target.value })} required className="w-full px-3 py-2 bg-slate-100 border-slate-300 rounded-md text-slate-900 focus:outline-none focus:ring-2 focus:ring-cyan-500" />
            </div>
          </div>
          <div className="flex justify-end gap-4 p-4 bg-slate-50 border-t border-slate-200">
            <button type="button" onClick={onClose} className="bg-slate-200 px-4 py-2 rounded-md font-semibold text-slate-800">Cancel</button>
            <button type="submit" disabled={isSaving} className="bg-cyan-500 px-4 py-2 rounded-md font-semibold text-white disabled:bg-slate-400">{isSaving ? 'Saving...' : 'Save Product'}</button>
          </div>
        </form>
      </div>
    </div>,
    document.body
  );
};

export default ProductFormModal;
