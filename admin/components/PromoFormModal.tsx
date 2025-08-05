import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { PromoSlide, Page } from '../../types';
import { ICONS } from '../../constants';

interface PromoFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (slideData: Omit<PromoSlide, 'id'> | PromoSlide) => void;
  slide: PromoSlide | null;
}

const initialSlideState: Omit<PromoSlide, 'id'> = {
    title: '',
    subtitle: '',
    icon: 'logo',
    link: 'home',
};

const availablePages: Page[] = ['home', 'flights', 'hotel', 'exchange', 'car-rental', 'shopping', 'profile', 'orders'];
const availableIcons = Object.keys(ICONS);

const PromoFormModal: React.FC<PromoFormModalProps> = ({ isOpen, onClose, onSave, slide }) => {
  const [formData, setFormData] = useState<Omit<PromoSlide, 'id'>>(initialSlideState);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (slide) {
      setFormData({
          title: slide.title,
          subtitle: slide.subtitle,
          icon: slide.icon,
          link: slide.link,
      });
    } else {
      setFormData(initialSlideState);
    }
  }, [slide, isOpen]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    const dataToSave = slide ? { ...slide, ...formData } : formData;
    await onSave(dataToSave);
    setIsSaving(false);
  };

  if (!isOpen) return null;

  return ReactDOM.createPortal(
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center z-50 p-4" onClick={onClose}>
      <div className="bg-white border border-slate-200 rounded-xl shadow-2xl w-full max-w-lg transform transition-all text-slate-800" onClick={(e) => e.stopPropagation()}>
        <form onSubmit={handleSubmit}>
            <div className="flex justify-between items-center p-4 border-b border-slate-200">
                <h2 className="text-lg font-bold text-slate-900">{slide ? 'Edit Promo Slide' : 'Add New Promo Slide'}</h2>
                <button type="button" onClick={onClose} className="p-2 text-slate-400 hover:text-slate-800 hover:bg-slate-100 rounded-full" aria-label="Close dialog">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
            </div>
            <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
                <div>
                    <label htmlFor="title" className="block text-sm font-medium text-slate-600 mb-1">Title</label>
                    <input id="title" name="title" type="text" value={formData.title} onChange={handleChange} required className="w-full px-3 py-2 bg-slate-100 border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500" />
                </div>
                <div>
                    <label htmlFor="subtitle" className="block text-sm font-medium text-slate-600 mb-1">Subtitle</label>
                    <input id="subtitle" name="subtitle" type="text" value={formData.subtitle} onChange={handleChange} required className="w-full px-3 py-2 bg-slate-100 border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label htmlFor="icon" className="block text-sm font-medium text-slate-600 mb-1">Icon</label>
                        <select id="icon" name="icon" value={formData.icon} onChange={handleChange} required className="w-full px-3 py-2 bg-slate-100 border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500 capitalize">
                            {availableIcons.map(iconKey => (
                                <option key={iconKey} value={iconKey}>{iconKey}</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label htmlFor="link" className="block text-sm font-medium text-slate-600 mb-1">Link To Page</label>
                        <select id="link" name="link" value={formData.link} onChange={handleChange} required className="w-full px-3 py-2 bg-slate-100 border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500 capitalize">
                             {availablePages.map(page => (
                                <option key={page} value={page}>{page}</option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>

            <div className="flex justify-end gap-4 p-4 bg-slate-50 border-t border-slate-200 rounded-b-xl">
                 <button type="button" onClick={onClose} className="bg-slate-200 text-slate-800 px-5 py-2 rounded-md font-semibold hover:bg-slate-300 transition-colors">
                    Cancel
                </button>
                <button type="submit" disabled={isSaving} className="bg-cyan-500 text-white px-5 py-2 rounded-md font-semibold hover:bg-cyan-600 transition-colors disabled:bg-slate-400 disabled:cursor-wait">
                    {isSaving ? 'Saving...' : 'Save Slide'}
                </button>
            </div>
        </form>
      </div>
    </div>,
    document.body
  );
};

export default PromoFormModal;
