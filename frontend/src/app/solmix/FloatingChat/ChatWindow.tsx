'use client';

import { useState, useRef, useEffect } from 'react';
import { Message } from './types';
import ChatMessage from './ChatMessage';

interface ChatWindowProps {
    messages: Message[];
    onSendMessage: (message: string) => void;
    onClose: () => void;
    title?: string;
    primaryColor?: string;
}

export default function ChatWindow({
                                       messages,
                                       onSendMessage,
                                       onClose,
                                       title = 'Solmix AI Assistant',
                                       primaryColor = '#f27b48',
                                   }: ChatWindowProps) {
    const [currentMessage, setCurrentMessage] = useState('');
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSendMessage = () => {
        if (!currentMessage.trim()) return;
        onSendMessage(currentMessage);
        setCurrentMessage('');
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    };

    return (
        <div className="bg-white rounded-lg shadow-lg w-full max-w-sm overflow-hidden transition-all duration-300 transform flex flex-col">
            {/* Chat Header */}
            <div
                className="text-white px-4 py-3 flex justify-between items-center"
                style={{ backgroundColor: primaryColor }}
            >
                <div className="flex items-center">
                    <div className="w-2 h-2 bg-green-400 rounded-full mr-2"></div>
                    <h3 className="font-medium">{title}</h3>
                </div>
                <button
                    onClick={onClose}
                    className="text-white hover:text-gray-200 focus:outline-none"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
            </div>

            {/* Chat Messages */}
            <div className="flex-1 p-4 overflow-y-auto max-h-96 space-y-3">
                {messages.map((msg) => (
                    <ChatMessage key={msg.id} message={msg} primaryColor={primaryColor} />
                ))}
                <div ref={messagesEndRef} />
            </div>

            {/* Chat Input */}
            <div className="border-t border-gray-200 dark:border-gray-700 p-3 flex items-center space-x-2">
                <input
                    type="text"
                    placeholder="Type a message..."
                    value={currentMessage}
                    onChange={(e) => setCurrentMessage(e.target.value)}
                    onKeyDown={handleKeyDown}
                    className="flex-1 border border-gray-300 dark:border-gray-600 rounded-full px-4 py-2 text-base focus:outline-none focus:ring-2 focus:border-transparent bg-global-color-text text-gray-500 placeholder-gray-500 dark:placeholder-gray-400"
                    style={{
                        '--tw-ring-color': primaryColor,
                    } as React.CSSProperties}
                />
                <button
                    onClick={handleSendMessage}
                    disabled={!currentMessage.trim()}
                    className="text-white rounded-full w-10 h-10 flex items-center justify-center transition-colors disabled:opacity-50"
                    style={{ backgroundColor: currentMessage.trim() ? primaryColor : undefined }}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                    </svg>
                </button>
            </div>
        </div>
    );
}