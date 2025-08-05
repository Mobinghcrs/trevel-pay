import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { Agent } from '../../types';

interface AgentFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (agentData: Omit<Agent, 'id'> | Agent) => void;
  agent: Agent | null;
}

const initialAgentState: Omit<Agent, 'id'> = {
    name: '',
    address: '',
    city: '',
    country: '',
    phone: '',
    operatingHours: '',
    latitude: 0,
    longitude: 0,
};

const AgentFormModal: React.FC<AgentFormModalProps> = ({ isOpen, onClose, onSave, agent }) => {
  const [formData, setFormData] = useState<Omit<Agent, 'id'> | Agent>(initialAgentState);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (agent) {
      setFormData(agent);
    } else {
      setFormData(initialAgentState);
    }
  }, [agent, isOpen]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: parseFloat(value) || 0 }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    await onSave(formData);
    setIsSaving(false);
  };

  if (!isOpen) return null;

  return ReactDOM.createPortal(
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center z-50 p-4" onClick={onClose}>
      <div className="bg-white border border-slate-200 rounded-xl shadow-2xl w-full max-w-2xl transform transition-all text-slate-800" onClick={(e) => e.stopPropagation()}>
        <form onSubmit={handleSubmit}>
            <div className="flex justify-between items-center p-4 border-b border-slate-200">
                <h2 className="text-lg font-bold text-slate-900">{agent ? 'Edit Agent' : 'Add New Agent'}</h2>
                <button type="button" onClick={onClose} className="p-2 text-slate-400 hover:text-slate-800 hover:bg-slate-100 rounded-full" aria-label="Close dialog">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
            </div>
            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4 max-h-[70vh] overflow-y-auto">
                <div className="md:col-span-2">
                    <label htmlFor="name" className="block text-sm font-medium text-slate-600 mb-1">Agent Name</label>
                    <input id="name" name="name" type="text" value={formData.name} onChange={handleChange} required className="w-full px-3 py-2 bg-slate-100 border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500" />
                </div>
                <div className="md:col-span-2">
                    <label htmlFor="address" className="block text-sm font-medium text-slate-600 mb-1">Address</label>
                    <input id="address" name="address" type="text" value={formData.address} onChange={handleChange} required className="w-full px-3 py-2 bg-slate-100 border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500" />
                </div>
                <div>
                    <label htmlFor="city" className="block text-sm font-medium text-slate-600 mb-1">City</label>
                    <input id="city" name="city" type="text" value={formData.city} onChange={handleChange} required className="w-full px-3 py-2 bg-slate-100 border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500" />
                </div>
                 <div>
                    <label htmlFor="country" className="block text-sm font-medium text-slate-600 mb-1">Country</label>
                    <input id="country" name="country" type="text" value={formData.country} onChange={handleChange} required className="w-full px-3 py-2 bg-slate-100 border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500" />
                </div>
                 <div className="md:col-span-2">
                    <label htmlFor="phone" className="block text-sm font-medium text-slate-600 mb-1">Phone Number</label>
                    <input id="phone" name="phone" type="text" value={formData.phone} onChange={handleChange} required className="w-full px-3 py-2 bg-slate-100 border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500" />
                </div>
                 <div className="md:col-span-2">
                    <label htmlFor="operatingHours" className="block text-sm font-medium text-slate-600 mb-1">Operating Hours</label>
                    <input id="operatingHours" name="operatingHours" type="text" value={formData.operatingHours} onChange={handleChange} required className="w-full px-3 py-2 bg-slate-100 border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500" placeholder="e.g., Mon-Fri: 9am - 6pm" />
                </div>
                <div>
                    <label htmlFor="latitude" className="block text-sm font-medium text-slate-600 mb-1">Latitude</label>
                    <input id="latitude" name="latitude" type="number" step="any" value={formData.latitude} onChange={handleNumberChange} required className="w-full px-3 py-2 bg-slate-100 border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500" />
                </div>
                <div>
                    <label htmlFor="longitude" className="block text-sm font-medium text-slate-600 mb-1">Longitude</label>
                    <input id="longitude" name="longitude" type="number" step="any" value={formData.longitude} onChange={handleNumberChange} required className="w-full px-3 py-2 bg-slate-100 border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500" />
                </div>
            </div>

            <div className="flex justify-end gap-4 p-4 bg-slate-50 border-t border-slate-200 rounded-b-xl">
                 <button type="button" onClick={onClose} className="bg-slate-200 text-slate-800 px-5 py-2 rounded-md font-semibold hover:bg-slate-300 transition-colors">
                    Cancel
                </button>
                <button type="submit" disabled={isSaving} className="bg-cyan-500 text-white px-5 py-2 rounded-md font-semibold hover:bg-cyan-600 transition-colors disabled:bg-slate-400 disabled:cursor-wait">
                    {isSaving ? 'Saving...' : 'Save Agent'}
                </button>
            </div>
        </form>
      </div>
    </div>,
    document.body
  );
};

export default AgentFormModal;
