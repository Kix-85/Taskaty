import React, { useState, useRef, useEffect } from 'react';
import { Message } from './Message';
import { MessageInput } from './MessageInput';
import { Bot, X, Minimize2, Maximize2, Loader2 } from 'lucide-react';
import api from '@/lib/axios';

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

interface BotChatProps {
    bottom?: number;
    right?: number;
    context?: 'dashboard' | 'tasks' | 'settings' | 'messages';
}

const BOT_INFO = {
    _id: 'bot-1',
    name: 'Taskaty Bot',
    avatar: '/bot-avatar.png'
};

// Function to generate AI response using backend API
const generateAIResponse = async (message: string, context: string, conversationHistory: BotMessage[]): Promise<string> => {
    try {
        console.log('Sending request to backend:', {
            message,
            context,
            historyLength: conversationHistory.length
        });

        const response = await api.post('/chat/message', {
            message,
            context,
            history: conversationHistory
        });

        console.log('Received response from backend:', response.data);
        
        if (!response.data || !response.data.response) {
            throw new Error('Invalid response format from backend');
        }

        return response.data.response;
    } catch (error: any) {
        console.error('Error getting AI response:', error);
        if (error.response?.data?.message) {
            throw new Error(error.response.data.message);
        }
        throw new Error('Failed to get response from AI service');
    }
};

export function BotChat({ bottom = 6, right = 6, context = 'tasks' }: BotChatProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [isMinimized, setIsMinimized] = useState(false);
    const [messages, setMessages] = useState<BotMessage[]>([{
        _id: 'welcome-1',
        sender: BOT_INFO,
        content: `👋 Hi! I'm your Taskaty assistant. I can help you with anything related to ${context}. What would you like to know?`,
        messageType: 'text',
        timestamp: new Date().toISOString(),
        isRead: true
    }]);
    const [isTyping, setIsTyping] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const abortControllerRef = useRef<AbortController | null>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        if (isOpen) {
            scrollToBottom();
        }
    }, [messages, isOpen]);

    // Cleanup function for aborting ongoing requests
    useEffect(() => {
        return () => {
            if (abortControllerRef.current) {
                abortControllerRef.current.abort();
            }
        };
    }, []);

    const handleSendMessage = async (content: string, type: 'text' | 'emoji' | 'file') => {
        console.log('Handling send message:', { content, type, context });
        
        // Cancel any ongoing request
        if (abortControllerRef.current) {
            console.log('Cancelling previous request');
            abortControllerRef.current.abort();
        }

        // Create new abort controller
        abortControllerRef.current = new AbortController();

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

        console.log('Adding user message to chat:', userMessage);
        setMessages(prev => [...prev, userMessage]);
        setIsTyping(true);

        try {
            console.log('Requesting AI response...');
            const aiResponse = await generateAIResponse(content, context, messages);
            console.log('Received AI response:', aiResponse);
            
            const botResponse: BotMessage = {
                _id: `bot-${Date.now()}`,
                sender: BOT_INFO,
                content: aiResponse,
                messageType: 'text',
                timestamp: new Date().toISOString(),
                isRead: true
            };
            
            console.log('Adding bot response to chat:', botResponse);
            setMessages(prev => [...prev, botResponse]);
        } catch (error: any) {
            console.error('Error in handleSendMessage:', error);
            const errorMessage: BotMessage = {
                _id: `bot-${Date.now()}`,
                sender: BOT_INFO,
                content: error.message || "I apologize, but I'm having trouble connecting right now. Could you try asking again in a moment?",
                messageType: 'text',
                timestamp: new Date().toISOString(),
                isRead: true
            };
            setMessages(prev => [...prev, errorMessage]);
        } finally {
            setIsTyping(false);
            abortControllerRef.current = null;
        }
    };

    return (
        <>
            {/* Bot Button */}
            <button
                onClick={() => setIsOpen(true)}
                className={`absolute bottom-[${bottom}px] right-[${right}px] sm:right-[${2*right}px] md:right-[${3*right}px] p-2 bg-blue-500 text-white rounded-full shadow-lg hover:bg-blue-600 transition-all duration-200 z-50 ${
                    isOpen ? 'hidden' : 'flex items-center justify-center'
                }`}
            >
                <Bot className="w-5 h-5" />
            </button>

            {/* Chat Window */}
            {isOpen && (
                <div 
                    className={`absolute w-80 bg-white dark:bg-gray-800 rounded-lg shadow-xl transition-all duration-200 z-50 ${
                        isMinimized ? 'h-16' : 'h-[400px]'
                    }`}
                    style={{ 
                        bottom: `${bottom + 50}px`, 
                        right: `${right}px` 
                    }}
                >
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
                                {isTyping && (
                                    <div className="flex items-center gap-2 text-gray-500">
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                        <span className="text-sm">Assistant is typing...</span>
                                    </div>
                                )}
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