import React, { useState, useRef, useEffect } from 'react';
import { getAiMarketAnalysisStream } from '../../services/apiService';
import Card from '../../components/Card';
import { ICONS } from '../../constants';

// A simple markdown-to-HTML parser for bold text
const parseMarkdown = (text: string) => {
    return text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
};

const AiAnalystPage: React.FC = () => {
    const [query, setQuery] = useState('');
    const [response, setResponse] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const responseEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        responseEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [response]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!query.trim() || isLoading) return;

        setIsLoading(true);
        setError(null);
        setResponse('');

        try {
            const stream = getAiMarketAnalysisStream(query);
            for await (const chunk of stream) {
                setResponse(prev => prev + chunk);
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An unknown error occurred.');
        } finally {
            setIsLoading(false);
        }
    };
    
    const presetQueries = [
        "What is the short-term outlook for Bitcoin?",
        "Compare Ethereum and Solana for developers.",
        "What are the risks of P2P trading?",
    ];

    return (
        <div className="max-w-2xl mx-auto">
            <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-slate-900 flex items-center justify-center gap-3">
                    <span className="text-cyan-600">{ICONS.aiAnalyst}</span>
                    <span>AI Market Analyst</span>
                </h2>
                <p className="text-slate-600 mt-2">Ask anything about crypto and fiat markets. Powered by Gemini.</p>
            </div>

            <Card className="p-6 border-slate-200">
                <form onSubmit={handleSubmit}>
                    <textarea
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="e.g., What are the latest trends in the crypto market?"
                        className="w-full p-3 bg-white border border-slate-300 rounded-md text-slate-900 focus:ring-2 focus:ring-cyan-500 focus:outline-none"
                        rows={3}
                        disabled={isLoading}
                    />
                    <button type="submit" disabled={isLoading || !query.trim()} className="w-full mt-3 bg-cyan-600 text-white px-4 py-3 rounded-md font-semibold hover:bg-cyan-500 transition-all duration-200 disabled:bg-slate-400 disabled:cursor-not-allowed">
                        {isLoading ? 'Thinking...' : 'Get Analysis'}
                    </button>
                </form>
                 <div className="mt-4 text-sm text-slate-500">
                    <p>Or try a preset question:</p>
                    <div className="flex flex-wrap gap-2 mt-2">
                        {presetQueries.map(q => (
                            <button key={q} onClick={() => setQuery(q)} className="text-xs bg-slate-100 hover:bg-slate-200 text-slate-700 px-2 py-1 rounded-md transition-colors">
                                {q}
                            </button>
                        ))}
                    </div>
                </div>
            </Card>

            {(isLoading || response || error) && (
                 <Card className="mt-6 p-6 border-slate-200">
                    {error && <div className="text-red-600 bg-red-100 p-4 rounded-md">{error}</div>}
                    {response && (
                        <div className="prose prose-sm max-w-none text-slate-800">
                           <p dangerouslySetInnerHTML={{ __html: parseMarkdown(response) }}></p>
                           {isLoading && <span className="inline-block w-2 h-4 bg-slate-600 animate-ping ml-1"></span>}
                        </div>
                    )}
                     <div ref={responseEndRef} />
                </Card>
            )}
        </div>
    );
};

export default AiAnalystPage;
