export interface Message {
    id: string;
    content: string;
    sender: 'user' | 'system';
    timestamp: Date;
}

export interface FloatingChatProps {
    title?: string;
    initialMessage?: string;
    onSendMessage?: (message: string) => Promise<void>;
    customResponse?: (message: string) => Promise<string>;
    primaryColor?: string;
}