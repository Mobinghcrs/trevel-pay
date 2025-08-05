import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { Store } from '../../types';

interface StoreFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (storeData: Omit<Store, 'id'> | Store) => void;
  store: Store | null;
}

const StoreFormModal: React.FC<StoreFormModalProps> = ({ isOpen, onClose, onSave, store }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    logoUrl: '',
  });
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (store) {
      setFormData({ name: store.name, description: store.description, logoUrl: store.logoUrl });
    } else {
      setFormData({ name: '', description: '', logoUrl: '' });
    }
  }, [store]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    if (store) {
      await onSave({ ...store, ...formData });
    } else {
      await onSave(formData);
    }
    setIsSaving(false);
  };

  if (!isOpen) return null;

  return ReactDOM.createPortal(
    <div className="fixed inset-0 bg-black/60 flex justify-center items-center z-50 p-4" onClick={onClose}>
      <div className="bg-white border border-slate-200 rounded-xl w-full max-w-lg" onClick={e => e.stopPropagation()}>
        <form onSubmit={handleSubmit}>
          <div className="p-4 border-b border-slate-200">
            <h2 className="text-lg font-bold text-slate-900">{store ? 'Edit Store' : 'Add New Store'}</h2>
          </div>
          <div className="p-6 space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-slate-600 mb-1">Store Name</label>
              <input id="name" type="text" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} required className="w-full px-3 py-2 bg-slate-100 border-slate-300 rounded-md text-slate-900 focus:outline-none focus:ring-2 focus:ring-cyan-500" />
            </div>
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-slate-600 mb-1">Description</label>
              <textarea id="description" value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} required rows={3} className="w-full px-3 py-2 bg-slate-100 border-slate-300 rounded-md text-slate-900 focus:outline-none focus:ring-2 focus:ring-cyan-500"></textarea>
            </div>
            <div>
              <label htmlFor="logoUrl" className="block text-sm font-medium text-slate-600 mb-1">Logo URL</label>
              <input id="logoUrl" type="text" value={formData.logoUrl} onChange={e => setFormData({ ...formData, logoUrl: e.target.value })} required className="w-full px-3 py-2 bg-slate-100 border-slate-300 rounded-md text-slate-900 focus:outline-none focus:ring-2 focus:ring-cyan-500" />
            </div>
          </div>
          <div className="flex justify-end gap-4 p-4 bg-slate-50 border-t border-slate-200">
            <button type="button" onClick={onClose} className="bg-slate-200 px-4 py-2 rounded-md font-semibold text-slate-800">Cancel</button>
            <button type="submit" disabled={isSaving} className="bg-cyan-500 px-4 py-2 rounded-md font-semibold text-white disabled:bg-slate-400">{isSaving ? 'Saving...' : 'Save'}</button>
          </div>
        </form>
      </div>
    </div>,
    document.body
  );
};

export default StoreFormModal;
