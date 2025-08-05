import React, { useState, useEffect, useCallback } from 'react';
import { Agent } from '../types';
import { getAdminAgents, createAdminAgent, updateAdminAgent, deleteAdminAgent } from '../services/apiService';
import Spinner from '../components/Spinner';
import { ICONS } from '../constants';
import AgentTableRow from './components/AgentTableRow';
import AgentFormModal from './components/AgentFormModal';

const AgentManagementPage: React.FC = () => {
    const [agents, setAgents] = useState<Agent[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingAgent, setEditingAgent] = useState<Agent | null>(null);

    const fetchAgents = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            const data = await getAdminAgents();
            setAgents(data);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to load agents.");
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchAgents();
    }, [fetchAgents]);
    
    const handleOpenModal = (agent: Agent | null = null) => {
        setEditingAgent(agent);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingAgent(null);
    };

    const handleSaveAgent = async (agentData: Omit<Agent, 'id'> | Agent) => {
        try {
            if ('id' in agentData && agentData.id) {
                const { id, ...updateData } = agentData;
                await updateAdminAgent(id, updateData);
            } else {
                await createAdminAgent(agentData as Omit<Agent, 'id'>);
            }
            fetchAgents();
            handleCloseModal();
        } catch (err) {
            alert(`Error saving agent: ${err instanceof Error ? err.message : 'Unknown error'}`);
        }
    };
    
    const handleDeleteAgent = async (agentId: string) => {
        if (confirm('Are you sure you want to permanently delete this agent?')) {
            try {
                await deleteAdminAgent(agentId);
                fetchAgents();
            } catch (err) {
                 alert(`Error deleting agent: ${err instanceof Error ? err.message : 'Unknown error'}`);
            }
        }
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-slate-900">Agent Management</h1>
                <button 
                    onClick={() => handleOpenModal()}
                    className="flex items-center gap-2 bg-cyan-500 text-white px-4 py-2 rounded-md font-semibold hover:bg-cyan-600 transition-colors"
                >
                    <span className="h-5 w-5">{ICONS.add}</span>
                    <span>Add New Agent</span>
                </button>
            </div>
            <p className="text-slate-600 mb-8 max-w-3xl">
                Manage the trusted representative offices where users can physically top-up their wallets.
            </p>

            {error && <div className="text-center text-red-600 bg-red-100 p-4 rounded-md mb-4">{error}</div>}
            
            <div className="bg-white border border-slate-200 rounded-lg overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-slate-200">
                        <thead className="bg-slate-50">
                            <tr>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Name</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Location</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Contact</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Hours</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-slate-200">
                            {isLoading ? (
                                <tr><td colSpan={5}><Spinner message="Loading agents..." /></td></tr>
                            ) : agents.length === 0 ? (
                                <tr><td colSpan={5} className="text-center p-8 text-slate-500">No agents defined. Add one to get started.</td></tr>
                            ) : (
                                agents.map(agent => (
                                    <AgentTableRow 
                                        key={agent.id} 
                                        agent={agent} 
                                        onEdit={() => handleOpenModal(agent)}
                                        onDelete={() => handleDeleteAgent(agent.id)}
                                    />
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {isModalOpen && (
                 <AgentFormModal
                    isOpen={isModalOpen}
                    onClose={handleCloseModal}
                    onSave={handleSaveAgent}
                    agent={editingAgent}
                />
            )}
        </div>
    );
};

export default AgentManagementPage;
