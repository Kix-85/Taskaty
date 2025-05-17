import React, { useState, useRef, useEffect } from 'react';
import { Message } from './Message';
import { MessageInput } from './MessageInput';
import { Bot, X, Minimize2, Maximize2 } from 'lucide-react';

interface BotMessage {
    _id: string;
    sender: {
        _id: string;
        name: string;
        avatar?: string;
    };
    content: string;
    messageType: 'text' | 'emoji' | 'file';
    timestamp: string;
    isRead: boolean;
}

const BOT_INFO = {
    _id: 'bot-1',
    name: 'Taskaty Bot',
    avatar: '/bot-avatar.png' // You can add a bot avatar image
};

const INITIAL_MESSAGE: BotMessage = {
    _id: 'welcome-1',
    sender: BOT_INFO,
    content: "👋 Hi! I'm your Taskaty assistant. I can help you with:\n\n• Creating and managing tasks\n• Setting up projects\n• Understanding task priorities\n• Tracking progress\n• And much more!\n\nHow can I help you today?",
    messageType: 'text',
    timestamp: new Date().toISOString(),
    isRead: true
};

export function BotChat() {
    const [isOpen, setIsOpen] = useState(false);
    const [isMinimized, setIsMinimized] = useState(false);
    const [messages, setMessages] = useState<BotMessage[]>([INITIAL_MESSAGE]);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        if (isOpen) {
            scrollToBottom();
        }
    }, [messages, isOpen]);

    const handleSendMessage = async (content: string, type: 'text' | 'emoji' | 'file') => {
        // Add user message
        const userMessage: BotMessage = {
            _id: `user-${Date.now()}`,
            sender: {
                _id: 'user-1',
                name: 'You'
            },
            content,
            messageType: type,
            timestamp: new Date().toISOString(),
            isRead: true
        };

        setMessages(prev => [...prev, userMessage]);

        // Simulate bot response (you can replace this with actual bot logic)
        setTimeout(() => {
            const botResponse: BotMessage = {
                _id: `bot-${Date.now()}`,
                sender: BOT_INFO,
                content: "I'm here to help you manage your tasks effectively. What would you like to know about Taskaty?",
                messageType: 'text',
                timestamp: new Date().toISOString(),
                isRead: true
            };
            setMessages(prev => [...prev, botResponse]);
        }, 1000);
    };

    return (
        <>
            {/* Bot Button */}
            <button
                onClick={() => setIsOpen(true)}
                className={`absolute bottom-[100px] right-[10px] sm:right-[20px] md:right-[30px] p-2 bg-blue-500 text-white rounded-full shadow-lg hover:bg-blue-600 transition-all duration-200 z-50 ${
                    isOpen ? 'hidden' : 'flex items-center justify-center'
                }`}
            >
                <Bot className="w-5 h-5" />
            </button>

            {/* Chat Window */}
            {isOpen && (
                <div className={`absolute bottom-[60px] right-[10px] w-80 bg-white dark:bg-gray-800 rounded-lg shadow-xl transition-all duration-200 z-50 ${
                    isMinimized ? 'h-16' : 'h-[400px]'
                }`}>
                    {/* Header */}
                    <div className="flex items-center justify-between p-3 border-b dark:border-gray-700 bg-white dark:bg-gray-800 rounded-t-lg">
                        <div className="flex items-center gap-2">
                            <div className="bg-blue-100 dark:bg-blue-900 p-1.5 rounded-full">
                                <Bot className="w-4 h-4 text-blue-500" />
                            </div>
                            <span className="font-medium text-sm text-gray-900 dark:text-white">Taskaty Assistant</span>
                        </div>
                        <div className="flex items-center gap-1">
                            <button
                                onClick={() => setIsMinimized(!isMinimized)}
                                className="p-1 rounded-lg text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                            >
                                {isMinimized ? <Maximize2 className="w-3.5 h-3.5" /> : <Minimize2 className="w-3.5 h-3.5" />}
                            </button>
                            <button
                                onClick={() => setIsOpen(false)}
                                className="p-1 rounded-lg text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                            >
                                <X className="w-3.5 h-3.5" />
                            </button>
                        </div>
                    </div>

                    {/* Messages */}
                    {!isMinimized && (
                        <>
                            <div className="h-[calc(400px-7rem)] overflow-y-auto p-3 space-y-3 bg-gray-50 dark:bg-gray-900">
                                {messages.map((message) => (
                                    <Message
                                        key={message._id}
                                        message={message}
                                        isOwnMessage={message.sender._id === 'user-1'}
                                    />
                                ))}
                                <div ref={messagesEndRef} />
                            </div>

                            {/* Input */}
                            <div className="border-t dark:border-gray-700 bg-white dark:bg-gray-800 rounded-b-lg">
                                <MessageInput
                                    onSendMessage={handleSendMessage}
                                />
                            </div>
                        </>
                    )}
                </div>
            )}
        </>
    );
} 