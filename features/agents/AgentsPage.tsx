import React, { useState, useEffect, useMemo } from 'react';
import { Agent } from '../../types';
import { getAgents } from '../../services/apiService';
import Card from '../../components/Card';
import Spinner from '../../components/Spinner';
import { ICONS } from '../../constants';

const AgentCard: React.FC<{ agent: Agent }> = ({ agent }) => (
    <Card className="p-5 border-gray-200 flex flex-col gap-3">
        <div>
            <h3 className="text-lg font-bold text-gray-900">{agent.name}</h3>
            <p className="text-sm text-gray-500">{agent.city}, {agent.country}</p>
        </div>
        <div className="text-sm text-gray-700 border-t border-gray-200 pt-3">
            <p><strong>Address:</strong> {agent.address}</p>
            <p><strong>Phone:</strong> {agent.phone}</p>
            <p><strong>Hours:</strong> {agent.operatingHours}</p>
        </div>
    </Card>
);

const AgentsPage: React.FC = () => {
    const [agents, setAgents] = useState<Agent[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const fetchAgents = async () => {
            setIsLoading(true);
            setError(null);
            try {
                const data = await getAgents();
                setAgents(data);
            } catch (err) {
                setError(err instanceof Error ? err.message : "Failed to load agent locations.");
            } finally {
                setIsLoading(false);
            }
        };
        fetchAgents();
    }, []);

    const filteredAgents = useMemo(() => {
        if (!searchTerm) return agents;
        return agents.filter(agent =>
            agent.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            agent.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
            agent.country.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [agents, searchTerm]);

    return (
        <div>
            <div className="text-center mb-8">
                <div className="w-24 h-24 bg-teal-100 text-teal-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    {ICONS.buildingStorefront}
                </div>
                <h1 className="text-3xl font-bold text-gray-900">Find Our Agents</h1>
                <p className="text-gray-600 mt-1">Visit our trusted representatives to top-up your wallet with cash.</p>
            </div>

            <div className="max-w-xl mx-auto mb-8">
                 <input
                    type="text"
                    placeholder="Search by name, city, or country..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
            </div>

            {isLoading && <Spinner message="Loading agent locations..." />}
            {error && <div className="text-center text-red-600 bg-red-100 p-4 rounded-md">{error}</div>}
            
            {!isLoading && !error && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredAgents.length > 0 ? (
                        filteredAgents.map(agent => <AgentCard key={agent.id} agent={agent} />)
                    ) : (
                        <p className="md:col-span-2 lg:col-span-3 text-center text-gray-500 py-8">
                            No agents found matching your search.
                        </p>
                    )}
                </div>
            )}
        </div>
    );
};

export default AgentsPage;