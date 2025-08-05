import React, { useState, useRef, useEffect } from 'react';
import { ICONS } from '../constants';
import { AiIntent, Page } from '../types';
import { getIntentFromQuery } from '../services/apiService';
import { useNavigation } from '../contexts/NavigationContext';

interface Message {
    id: number;
    text: string;
    sender: 'user' | 'ai' | 'system';
}

const AiChatAssistant: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const { navigate } = useNavigation();
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(scrollToBottom, [messages]);

    const addMessage = (text: string, sender: Message['sender']) => {
        setMessages(prev => [...prev, { id: Date.now(), text, sender }]);
    };

    const handleSend = async () => {
        if (!input.trim()) return;
        const userInput = input;
        addMessage(userInput, 'user');
        setInput('');
        setIsLoading(true);

        try {
            const intent: AiIntent = await getIntentFromQuery(userInput);
            
            if (intent.service !== 'unknown' && intent.service) {
                let confirmationText = `Sure! I can help with that. Taking you to ${intent.service}...`;
                if(intent.service === 'flights' && intent.parameters.destination) {
                    confirmationText = `Finding flights to ${intent.parameters.destination}. One moment...`
                } else if (intent.service === 'hotel' && intent.parameters.destination) {
                    confirmationText = `Looking for hotels in ${intent.parameters.destination}. Let's go...`
                }
                addMessage(confirmationText, 'ai');
                
                setTimeout(() => {
                    navigate(intent.service as Page, intent.parameters);
                    setIsOpen(false);
                }, 1000);

            } else {
                addMessage("I'm sorry, I can only help with flights, hotels, currency exchange, car rentals, and shopping. Please try rephrasing your request.", 'ai');
            }
        } catch (error) {
            console.error(error);
            const errorMessage = error instanceof Error ? error.message : "An unknown error occurred.";
            addMessage(`Sorry, I ran into a problem: ${errorMessage}`, 'system');
        } finally {
            setIsLoading(false);
        }
    };
    
    const handleSuggestionClick = (query: string) => {
        setInput(query);
        // We need a timeout to allow the state to update before sending
        setTimeout(() => {
            // Find the form and submit it programmatically
            const form = document.getElementById('ai-chat-form');
            if (form) {
                // We create a synthetic submit event
                const submitEvent = new Event('submit', { bubbles: true, cancelable: true });
                form.dispatchEvent(submitEvent);
            }
        }, 100);
    }
    
    useEffect(() => {
        if (isOpen && messages.length === 0) {
            addMessage("Hello! How can I help you today? You can ask me to find flights, hotels, or exchange rates.", 'ai');
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isOpen]);

    const suggestions = [
        "Find a flight to Paris tomorrow",
        "Book a hotel in Tehran for 3 nights",
        "Swap 100 EUR to USD"
    ];

    return (
        <>
            <button
                onClick={() => setIsOpen(true)}
                className="fixed bottom-24 md:bottom-8 right-4 md:right-8 z-50 w-16 h-16 bg-teal-600 text-white rounded-full shadow-2xl flex items-center justify-center hover:bg-teal-700 transition-transform hover:scale-110"
                aria-label="Open AI Assistant"
            >
                <div className="w-8 h-8">{ICONS.aiChat}</div>
            </button>

            {isOpen && (
                <div className="fixed inset-0 bg-black/30 z-[99] animate-fade-in" onClick={() => setIsOpen(false)} />
            )}
            
            <div className={`fixed bottom-24 md:bottom-8 right-4 md:right-8 z-[100] w-[calc(100%-2rem)] max-w-md h-[70vh] bg-white border border-gray-200 rounded-2xl shadow-2xl flex flex-col transition-transform duration-300 ease-in-out ${isOpen ? 'scale-100 opacity-100' : 'scale-95 opacity-0 pointer-events-none'}`}>
                <header className="p-4 border-b border-gray-200 flex justify-between items-center">
                    <h3 className="font-bold text-gray-800 flex items-center gap-2">
                        <span className="text-teal-600">{ICONS.aiChat}</span> AI Assistant
                    </h3>
                    <button onClick={() => setIsOpen(false)} className="p-1 rounded-full text-gray-500 hover:bg-gray-100">&times;</button>
                </header>

                <div className="flex-1 p-4 overflow-y-auto">
                    <div className="space-y-4">
                        {messages.map(msg => (
                            <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                                <p className={`max-w-xs px-4 py-2 rounded-2xl ${msg.sender === 'user' ? 'bg-teal-600 text-white rounded-br-none' : msg.sender === 'ai' ? 'bg-gray-200 text-gray-800 rounded-bl-none' : 'bg-red-100 text-red-800'}`}>
                                    {msg.text}
                                </p>
                            </div>
                        ))}
                         {isLoading && <div className="text-gray-400 text-sm">AI is thinking...</div>}
                    </div>
                    <div ref={messagesEndRef} />
                </div>
                
                {messages.length <= 1 && (
                    <div className="p-4 border-t border-gray-200">
                        <p className="text-sm text-gray-500 mb-2">Suggestions:</p>
                        <div className="flex flex-wrap gap-2">
                            {suggestions.map(s => <button key={s} onClick={() => handleSuggestionClick(s)} className="text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 px-2 py-1 rounded-md">{s}</button>)}
                        </div>
                    </div>
                )}


                <form id="ai-chat-form" onSubmit={(e) => { e.preventDefault(); handleSend(); }} className="p-4 border-t border-gray-200 flex items-center gap-2">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Message AI Assistant..."
                        className="flex-1 w-full bg-gray-100 border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-teal-500 focus:outline-none"
                        disabled={isLoading}
                    />
                    <button type="submit" disabled={isLoading || !input.trim()} className="bg-teal-600 text-white rounded-lg p-2 disabled:bg-gray-400">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg>
                    </button>
                </form>
            </div>
        </>
    );
};

export default AiChatAssistant;