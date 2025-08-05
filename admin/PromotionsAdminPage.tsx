import React, { useState, useEffect, useCallback } from 'react';
import { PromoSlide } from '../types';
import { getAdminPromoSlides, createAdminPromoSlide, updateAdminPromoSlide, deleteAdminPromoSlide } from '../services/apiService';
import Spinner from '../components/Spinner';
import { ICONS } from '../constants';
import PromoTableRow from './components/PromoTableRow';
import PromoFormModal from './components/PromoFormModal';

const PromotionsAdminPage: React.FC = () => {
    const [slides, setSlides] = useState<PromoSlide[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingSlide, setEditingSlide] = useState<PromoSlide | null>(null);

    const fetchSlides = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            const data = await getAdminPromoSlides();
            setSlides(data);
        } catch (err) {
            console.error(err);
            setError(err instanceof Error ? err.message : "Failed to load promo slides.");
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchSlides();
    }, [fetchSlides]);
    
    const handleOpenModal = (slide: PromoSlide | null = null) => {
        setEditingSlide(slide);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingSlide(null);
    };

    const handleSaveSlide = async (slideData: Omit<PromoSlide, 'id'> | PromoSlide) => {
        try {
            if ('id' in slideData && slideData.id) {
                const { id, ...updateData } = slideData;
                await updateAdminPromoSlide(id, updateData);
            } else {
                await createAdminPromoSlide(slideData as Omit<PromoSlide, 'id'>);
            }
            fetchSlides();
            handleCloseModal();
        } catch (err) {
            alert(`Error saving slide: ${err instanceof Error ? err.message : 'Unknown error'}`);
        }
    };
    
    const handleDeleteSlide = async (slideId: string) => {
        if (confirm('Are you sure you want to permanently delete this promotional slide?')) {
            try {
                await deleteAdminPromoSlide(slideId);
                fetchSlides();
            } catch (err) {
                 alert(`Error deleting slide: ${err instanceof Error ? err.message : 'Unknown error'}`);
            }
        }
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-slate-900">Promotions Management</h1>
                <button 
                    onClick={() => handleOpenModal()}
                    className="flex items-center gap-2 bg-cyan-500 text-white px-4 py-2 rounded-md font-semibold hover:bg-cyan-600 transition-colors"
                >
                    <span className="h-5 w-5">{ICONS.add}</span>
                    <span>Add New Slide</span>
                </button>
            </div>
            <p className="text-slate-600 mb-8 max-w-3xl">
                Manage the promotional slides that appear on the guest homepage. Add, edit, or delete slides to keep your welcome message fresh and engaging.
            </p>

            {error && <div className="text-center text-red-600 bg-red-100 p-4 rounded-md mb-4">{error}</div>}
            
            <div className="bg-white border border-slate-200 rounded-lg overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-slate-200">
                        <thead className="bg-slate-50">
                            <tr>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Title</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Subtitle</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Icon</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Link</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-slate-200">
                            {isLoading ? (
                                <tr><td colSpan={5}><Spinner message="Loading slides..." /></td></tr>
                            ) : slides.length === 0 ? (
                                <tr><td colSpan={5} className="text-center p-8 text-slate-500">No promotional slides found.</td></tr>
                            ) : (
                                slides.map(slide => (
                                    <PromoTableRow 
                                        key={slide.id} 
                                        slide={slide} 
                                        onEdit={() => handleOpenModal(slide)}
                                        onDelete={() => handleDeleteSlide(slide.id)}
                                    />
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {isModalOpen && (
                 <PromoFormModal
                    isOpen={isModalOpen}
                    onClose={handleCloseModal}
                    onSave={handleSaveSlide}
                    slide={editingSlide}
                />
            )}
        </div>
    );
};

export default PromotionsAdminPage;
