import React from 'react';
import { Agent } from '../../types';
import { ICONS } from '../../constants';

interface AgentTableRowProps {
    agent: Agent;
    onEdit: () => void;
    onDelete: () => void;
}

const AgentTableRow: React.FC<AgentTableRowProps> = ({ agent, onEdit, onDelete }) => {
    return (
        <tr className="hover:bg-slate-50 transition-colors">
            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900">{agent.name}</td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                <div>{agent.address}</div>
                <div>{agent.city}, {agent.country}</div>
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-700 font-mono">{agent.phone}</td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">{agent.operatingHours}</td>
            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <div className="flex items-center gap-4">
                    <button onClick={onEdit} className="text-cyan-600 hover:text-cyan-500 transition-colors flex items-center gap-1">
                        {ICONS.edit} Edit
                    </button>
                    <button onClick={onDelete} className="text-red-600 hover:text-red-500 transition-colors flex items-center gap-1">
                        {ICONS.trash} Delete
                    </button>
                </div>
            </td>
        </tr>
    );
};

export default AgentTableRow;
