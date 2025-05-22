'use client';

import { Message } from './types';

interface ChatMessageProps {
    message: Message;
    primaryColor?: string;
}

export default function ChatMessage({ message, primaryColor = '#5D5CDE' }: ChatMessageProps) {
    const isUser = message.sender === 'user';
    const timeString = new Intl.DateTimeFormat('default', {
        hour: 'numeric',
        minute: 'numeric',
    }).format(new Date(message.timestamp));

    return (
        <div className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
            <div className="max-w-[85%]">
                <div
                    className={`${
                        isUser
                            ? 'text-white rounded-t-lg rounded-bl-lg'
                            : 'bg-global-color-text text-gray-500 rounded-t-lg rounded-br-lg'
                    } p-3 shadow-sm`}
                    style={{ backgroundColor: isUser ? primaryColor : undefined }}
                >
                    <p className="whitespace-pre-wrap break-words">{message.content}</p>
                </div>
                <div className={`text-xs text-gray-500 dark:text-gray-400 mt-1 ${isUser ? 'text-right' : ''}`}>
                    {isUser ? 'You' : 'Solmix'} · {timeString}
                </div>
            </div>
        </div>
    );
}