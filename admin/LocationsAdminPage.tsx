// This is a new file: admin/LocationsAdminPage.tsx

import React, { useState, useEffect, useCallback } from 'react';
import { Country, City, Airport } from '../types';
import * as api from '../services/apiService';
import Spinner from '../components/Spinner';
import Card from '../components/Card';
import Modal from '../components/Modal';
import { ICONS } from '../constants';

type LocationTab = 'countries' | 'cities' | 'airports';

const LocationsAdminPage: React.FC = () => {
    const [activeTab, setActiveTab] = useState<LocationTab>('countries');
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const [countries, setCountries] = useState<Country[]>([]);
    const [cities, setCities] = useState<City[]>([]);
    const [airports, setAirports] = useState<Airport[]>([]);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingItem, setEditingItem] = useState<Country | City | Airport | null>(null);
    const [modalMode, setModalMode] = useState<'add' | 'edit'>('add');

    const fetchData = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            const [countriesData, citiesData, airportsData] = await Promise.all([
                api.getAdminCountries(),
                api.getAdminCities(),
                api.getAdminAirports(),
            ]);
            setCountries(countriesData);
            setCities(citiesData);
            setAirports(airportsData);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to load location data.");
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const handleOpenModal = (mode: 'add' | 'edit', item: Country | City | Airport | null = null) => {
        setModalMode(mode);
        setEditingItem(item);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingItem(null);
    };

    const handleSave = async (data: any) => {
        try {
            if (modalMode === 'add') {
                if (activeTab === 'countries') await api.createAdminCountry(data);
                if (activeTab === 'cities') await api.createAdminCity(data);
                if (activeTab === 'airports') await api.createAdminAirport(data);
            } else if (editingItem) {
                if (activeTab === 'countries') await api.updateAdminCountry(editingItem.id, data);
                if (activeTab === 'cities') await api.updateAdminCity(editingItem.id, data);
                if (activeTab === 'airports') await api.updateAdminAirport(editingItem.id, data);
            }
            fetchData();
            handleCloseModal();
        } catch (err) {
            alert(`Error saving: ${err instanceof Error ? err.message : 'Unknown error'}`);
        }
    };
    
    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this item? This may also delete related cities and airports.')) return;
        try {
            if (activeTab === 'countries') await api.deleteAdminCountry(id);
            if (activeTab === 'cities') await api.deleteAdminCity(id);
            if (activeTab === 'airports') await api.deleteAdminAirport(id);
            fetchData();
        } catch (err) {
            alert(`Error deleting: ${err instanceof Error ? err.message : 'Unknown error'}`);
        }
    }

    const renderContent = () => {
        if (isLoading) return <Spinner message="Loading locations..." />;
        if (error) return <p className="text-red-500 text-center">{error}</p>;

        switch(activeTab) {
            case 'countries': return <CountriesTable countries={countries} onEdit={(c) => handleOpenModal('edit', c)} onDelete={handleDelete} />;
            case 'cities': return <CitiesTable cities={cities} countries={countries} onEdit={(c) => handleOpenModal('edit', c)} onDelete={handleDelete} />;
            case 'airports': return <AirportsTable airports={airports} cities={cities} onEdit={(a) => handleOpenModal('edit', a)} onDelete={handleDelete} />;
            default: return null;
        }
    };
    
    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-slate-900">Locations & Routes</h1>
                <button onClick={() => handleOpenModal('add')} className="flex items-center gap-2 bg-cyan-500 text-white px-4 py-2 rounded-md font-semibold hover:bg-cyan-600">
                    {ICONS.add} <span>Add New {activeTab.slice(0, -1)}</span>
                </button>
            </div>
            
             <div className="flex items-center gap-2 border-b border-slate-200 mb-6">
                {(['countries', 'cities', 'airports'] as LocationTab[]).map(tab => (
                    <button key={tab} onClick={() => setActiveTab(tab)} className={`px-4 py-2 text-sm font-semibold capitalize transition-colors ${activeTab === tab ? 'text-teal-600 border-b-2 border-teal-600' : 'text-slate-500 hover:text-slate-800'}`}>
                        {tab}
                    </button>
                ))}
            </div>

            <Card className="overflow-hidden">
                <div className="overflow-x-auto">
                    {renderContent()}
                </div>
            </Card>

            {isModalOpen && (
                <LocationFormModal
                    isOpen={isModalOpen}
                    onClose={handleCloseModal}
                    onSave={handleSave}
                    mode={modalMode}
                    tab={activeTab}
                    item={editingItem}
                    countries={countries}
                    cities={cities}
                />
            )}
        </div>
    );
};

// --- Table Components ---

const CountriesTable: React.FC<{ countries: Country[], onEdit: (c: Country) => void, onDelete: (id: string) => void }> = ({ countries, onEdit, onDelete }) => (
    <table className="min-w-full divide-y divide-slate-200">
        <thead className="bg-slate-50">
            <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Country Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Code</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Actions</th>
            </tr>
        </thead>
        <tbody className="divide-y divide-slate-200">
            {countries.map(c => (
                <tr key={c.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900">{c.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500 font-mono">{c.code}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium flex gap-4">
                        <button onClick={() => onEdit(c)} className="text-cyan-600 hover:text-cyan-500">Edit</button>
                        <button onClick={() => onDelete(c.id)} className="text-red-600 hover:text-red-500">Delete</button>
                    </td>
                </tr>
            ))}
        </tbody>
    </table>
);

const CitiesTable: React.FC<{ cities: City[], countries: Country[], onEdit: (c: City) => void, onDelete: (id: string) => void }> = ({ cities, countries, onEdit, onDelete }) => (
     <table className="min-w-full divide-y divide-slate-200">
        <thead className="bg-slate-50">
            <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">City Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Country</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Actions</th>
            </tr>
        </thead>
        <tbody className="divide-y divide-slate-200">
            {cities.map(city => (
                <tr key={city.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900">{city.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">{countries.find(c => c.id === city.countryId)?.name || 'N/A'}</td>
                     <td className="px-6 py-4 whitespace-nowrap text-sm font-medium flex gap-4">
                        <button onClick={() => onEdit(city)} className="text-cyan-600 hover:text-cyan-500">Edit</button>
                        <button onClick={() => onDelete(city.id)} className="text-red-600 hover:text-red-500">Delete</button>
                    </td>
                </tr>
            ))}
        </tbody>
    </table>
);

const AirportsTable: React.FC<{ airports: Airport[], cities: City[], onEdit: (a: Airport) => void, onDelete: (id: string) => void }> = ({ airports, cities, onEdit, onDelete }) => (
    <table className="min-w-full divide-y divide-slate-200">
        <thead className="bg-slate-50">
            <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Airport Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">IATA Code</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">City</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Actions</th>
            </tr>
        </thead>
        <tbody className="divide-y divide-slate-200">
            {airports.map(airport => (
                <tr key={airport.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900">{airport.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-slate-500">{airport.iataCode}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">{cities.find(c => c.id === airport.cityId)?.name || 'N/A'}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium flex gap-4">
                        <button onClick={() => onEdit(airport)} className="text-cyan-600 hover:text-cyan-500">Edit</button>
                        <button onClick={() => onDelete(airport.id)} className="text-red-600 hover:text-red-500">Delete</button>
                    </td>
                </tr>
            ))}
        </tbody>
    </table>
);


// --- Modal & Form Component ---
interface LocationFormModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (data: any) => void;
    mode: 'add' | 'edit';
    tab: LocationTab;
    item: Country | City | Airport | null;
    countries: Country[];
    cities: City[];
}

const LocationFormModal: React.FC<LocationFormModalProps> = ({ isOpen, onClose, onSave, mode, tab, item, countries, cities }) => {
    const [formData, setFormData] = useState<any>({});

    useEffect(() => {
        setFormData(item || {});
    }, [item]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave(formData);
    };

    const renderFormFields = () => {
        if (tab === 'countries') {
            return <>
                <div>
                    <label className="block text-sm font-medium text-slate-600 mb-1">Country Name</label>
                    <input name="name" value={formData.name || ''} onChange={handleChange} required className="w-full px-3 py-2 bg-slate-100 border-slate-300 rounded-md" />
                </div>
                <div>
                    <label className="block text-sm font-medium text-slate-600 mb-1">Country Code (2-letter)</label>
                    <input name="code" value={formData.code || ''} onChange={handleChange} required maxLength={2} className="w-full px-3 py-2 bg-slate-100 border-slate-300 rounded-md" />
                </div>
            </>;
        }
        if (tab === 'cities') {
            return <>
                <div>
                    <label className="block text-sm font-medium text-slate-600 mb-1">City Name</label>
                    <input name="name" value={formData.name || ''} onChange={handleChange} required className="w-full px-3 py-2 bg-slate-100 border-slate-300 rounded-md" />
                </div>
                 <div>
                    <label className="block text-sm font-medium text-slate-600 mb-1">Country</label>
                    <select name="countryId" value={formData.countryId || ''} onChange={handleChange} required className="w-full px-3 py-2 bg-slate-100 border-slate-300 rounded-md">
                        <option value="" disabled>Select a country</option>
                        {countries.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                    </select>
                </div>
            </>;
        }
        if (tab === 'airports') {
             return <>
                <div>
                    <label className="block text-sm font-medium text-slate-600 mb-1">Airport Name</label>
                    <input name="name" value={formData.name || ''} onChange={handleChange} required className="w-full px-3 py-2 bg-slate-100 border-slate-300 rounded-md" />
                </div>
                <div>
                    <label className="block text-sm font-medium text-slate-600 mb-1">IATA Code (3-letter)</label>
                    <input name="iataCode" value={formData.iataCode || ''} onChange={handleChange} required maxLength={3} className="w-full px-3 py-2 bg-slate-100 border-slate-300 rounded-md" />
                </div>
                 <div>
                    <label className="block text-sm font-medium text-slate-600 mb-1">City</label>
                    <select name="cityId" value={formData.cityId || ''} onChange={handleChange} required className="w-full px-3 py-2 bg-slate-100 border-slate-300 rounded-md">
                        <option value="" disabled>Select a city</option>
                        {cities.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                    </select>
                </div>
            </>;
        }
        return null;
    }

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={`${mode === 'add' ? 'Add' : 'Edit'} ${tab.slice(0, -1)}`}>
            <form onSubmit={handleSubmit} className="space-y-4">
                {renderFormFields()}
                <div className="flex justify-end gap-4 pt-2">
                    <button type="button" onClick={onClose} className="bg-slate-200 px-4 py-2 rounded-md font-semibold text-slate-800">Cancel</button>
                    <button type="submit" className="bg-cyan-500 px-4 py-2 rounded-md font-semibold text-white">Save</button>
                </div>
            </form>
        </Modal>
    );
};

export default LocationsAdminPage;
