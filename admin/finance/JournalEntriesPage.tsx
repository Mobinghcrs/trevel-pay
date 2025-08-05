
import React, { useState, useEffect } from 'react';
import { JournalEntry } from '../../types';
import { getJournalEntries } from '../../services/apiService';
import Spinner from '../../components/Spinner';

const JournalEntriesPage: React.FC = () => {
    const [entries, setEntries] = useState<JournalEntry[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [expandedEntry, setExpandedEntry] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            try {
                const data = await getJournalEntries();
                setEntries(data.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()));
            } catch (err) {
                setError(err instanceof Error ? err.message : "Failed to load journal entries.");
            } finally {
                setIsLoading(false);
            }
        };
        fetchData();
    }, []);

    const toggleExpand = (id: string) => {
        setExpandedEntry(expandedEntry === id ? null : id);
    };

    if (isLoading) return <Spinner message="Loading journal entries..." />;
    if (error) return <div className="text-center text-red-600 bg-red-100 p-4 rounded-md">{error}</div>;

    return (
        <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Journal Entries</h2>
            <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Description</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Reference ID</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {entries.map(entry => (
                                <React.Fragment key={entry.id}>
                                    <tr onClick={() => toggleExpand(entry.id)} className="cursor-pointer hover:bg-gray-50">
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{new Date(entry.timestamp).toLocaleString()}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{entry.description}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-500">{entry.relatedDocumentId}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-800">${entry.entries.find(e => e.type === 'debit')?.amount.toFixed(2)}</td>
                                    </tr>
                                    {expandedEntry === entry.id && (
                                        <tr>
                                            <td colSpan={4} className="p-4 bg-gray-100">
                                                <div className="p-4 bg-white rounded-md border">
                                                    <h4 className="font-bold mb-2">Accounting Details:</h4>
                                                    <table className="min-w-full text-sm">
                                                        <thead>
                                                            <tr className="border-b">
                                                                <th className="py-1 text-left font-medium">Account</th>
                                                                <th className="py-1 text-right font-medium">Debit</th>
                                                                <th className="py-1 text-right font-medium">Credit</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            {entry.entries.map(line => (
                                                                <tr key={line.id} className="border-b last:border-b-0">
                                                                    <td className="py-1">{line.accountName}</td>
                                                                    <td className="py-1 text-right font-mono">{line.type === 'debit' ? `$${line.amount.toFixed(2)}` : ''}</td>
                                                                    <td className="py-1 text-right font-mono">{line.type === 'credit' ? `$${line.amount.toFixed(2)}` : ''}</td>
                                                                </tr>
                                                            ))}
                                                        </tbody>
                                                    </table>
                                                </div>
                                            </td>
                                        </tr>
                                    )}
                                </React.Fragment>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default JournalEntriesPage;
