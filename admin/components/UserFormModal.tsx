import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import { AdminUser } from '../../types';

interface UserFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (userData: any) => Promise<void>;
}

const UserFormModal: React.FC<UserFormModalProps> = ({ isOpen, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'User' as AdminUser['role'],
    status: 'Active' as AdminUser['status'],
    accountType: 'Registered' as AdminUser['accountType'],
  });
  const [isSaving, setIsSaving] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    await onSave(formData);
    // The parent component will close the modal on success
    setIsSaving(false);
  };
  
  if (!isOpen) return null;

  return ReactDOM.createPortal(
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center z-50 p-4" onClick={onClose}>
      <div className="bg-white border border-slate-200 rounded-xl shadow-2xl w-full max-w-lg" onClick={e => e.stopPropagation()}>
        <form onSubmit={handleSubmit}>
          <div className="p-4 border-b border-slate-200">
            <h2 className="text-lg font-bold text-slate-900">Create New User</h2>
          </div>
          <div className="p-6 space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-slate-600 mb-1">Full Name</label>
              <input id="name" name="name" type="text" value={formData.name} onChange={handleChange} required className="w-full px-3 py-2 bg-slate-100 border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500" />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-slate-600 mb-1">Email</label>
              <input id="email" name="email" type="email" value={formData.email} onChange={handleChange} required className="w-full px-3 py-2 bg-slate-100 border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500" />
            </div>
             <div>
              <label htmlFor="password" className="block text-sm font-medium text-slate-600 mb-1">Password</label>
              <input id="password" name="password" type="password" value={formData.password} onChange={handleChange} required className="w-full px-3 py-2 bg-slate-100 border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500" />
            </div>
            <div>
                <label htmlFor="role" className="block text-sm font-medium text-slate-600 mb-1">Role</label>
                <select id="role" name="role" value={formData.role} onChange={handleChange} className="w-full px-3 py-2 bg-slate-100 border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500">
                    <option value="User">User</option>
                    <option value="Support">Support</option>
                    <option value="Finance">Finance</option>
                    <option value="Admin">Admin</option>
                </select>
            </div>
          </div>
          <div className="flex justify-end gap-4 p-4 bg-slate-50 border-t border-slate-200">
            <button type="button" onClick={onClose} className="bg-slate-200 px-4 py-2 rounded-md font-semibold text-slate-800">Cancel</button>
            <button type="submit" disabled={isSaving} className="bg-cyan-500 px-4 py-2 rounded-md font-semibold text-white disabled:bg-slate-400">{isSaving ? 'Creating...' : 'Create User'}</button>
          </div>
        </form>
      </div>
    </div>,
    document.body
  );
};

export default UserFormModal;
