'use client';

import { useState, useEffect } from 'react';
import { Message, FloatingChatProps } from './types';
import ChatWindow from './ChatWindow';

export default function FloatingChat({
                                         title = 'Solmix AI Assistant',
                                         initialMessage = 'Hello! How do you want to edit your Smart Contract?',
                                         onSendMessage,
                                         customResponse,
                                         primaryColor = '#f27b48',
                                     }: FloatingChatProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<Message[]>([]);
    const [isDarkMode, setIsDarkMode] = useState(false);

    // Initialize chat with welcome message
    useEffect(() => {
        setMessages([
            {
                id: '1',
                content: initialMessage,
                sender: 'system',
                timestamp: new Date(),
            },
        ]);
    }, [initialMessage]);

    // Handle dark mode detection
    useEffect(() => {
        // Check initial dark mode preference
        if (typeof window !== 'undefined') {
            const darkModeMediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
            setIsDarkMode(darkModeMediaQuery.matches);

            // Add listener for changes
            const darkModeHandler = (event: MediaQueryListEvent) => {
                setIsDarkMode(event.matches);
            };

            darkModeMediaQuery.addEventListener('change', darkModeHandler);

            // Clean up listener
            return () => {
                darkModeMediaQuery.removeEventListener('change', darkModeHandler);
            };
        }
    }, []);

    // Apply dark mode class to document
    useEffect(() => {
        if (isDarkMode) {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    }, [isDarkMode]);

    const toggleChat = () => {
        setIsOpen(!isOpen);
    };

    const handleSendMessage = async (message: string) => {
        // Add user message
        const userMessage: Message = {
            id: Date.now().toString(),
            content: message,
            sender: 'user',
            timestamp: new Date(),
        };

        setMessages((prevMessages) => [...prevMessages, userMessage]);

        // Call the custom handler if provided
        if (onSendMessage) {
            await onSendMessage(message);
        }

        // Handle response
        setTimeout(async () => {
            //let responseContent = `Thanks for your message! This is a demo response to: "${message}"`;
            let responseContent = `Timeout.`;

            // Get custom response if provided
            if (customResponse) {
                try {
                    responseContent = await customResponse(message);
                } catch (error) {
                    console.error('Error getting custom response:', error);
                }
            }

            const systemMessage: Message = {
                id: (Date.now() + 1).toString(),
                content: responseContent,
                sender: 'system',
                timestamp: new Date(),
            };

            setMessages((prevMessages) => [...prevMessages, systemMessage]);
        }, 1000);
    };

    return (
        <div className="fixed bottom-7 right-7 z-50 flex flex-col items-end">
            {isOpen && (
                <ChatWindow
                    messages={messages}
                    onSendMessage={handleSendMessage}
                    onClose={toggleChat}
                    title={title}
                    primaryColor={primaryColor}
                />
            )}

            <button
                onClick={toggleChat}
                className="mt-4 text-white rounded-full w-14 h-14 flex items-center justify-center shadow-xl transition-transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-offset-2"
                style={{
                    backgroundColor: primaryColor,
                    '--tw-ring-color': primaryColor,
                } as React.CSSProperties}
            >
                {isOpen ? (
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                    </svg>
                )}
            </button>
        </div>
    );
}