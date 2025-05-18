import React, { useState, useRef, useEffect } from 'react';
import { Message } from './Message';
import { MessageInput } from './MessageInput';
import { Bot, X, Minimize2, Maximize2 } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Send } from "lucide-react";
import { cn } from "@/lib/utils";

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

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

interface BotChatProps {
  onClose: () => void;
  className?: string;
}

export function BotChat({ onClose, className }: BotChatProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = { role: 'user', content: input.trim() } as Message;
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      // Simulate AI response - replace with actual API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      const aiMessage = { role: 'assistant', content: 'This is a sample response.' } as Message;
      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error('Error getting AI response:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={cn(
      "fixed bottom-4 right-4 w-full max-w-[90vw] md:max-w-[400px] bg-background rounded-lg shadow-lg border flex flex-col",
      "h-[80vh] md:h-[600px] z-50",
      className
    )}>
      <div className="flex items-center justify-between p-4 border-b">
        <div className="flex items-center gap-2">
          <Bot className="h-5 w-5" />
          <h2 className="font-semibold">AI Assistant</h2>
        </div>
        <Button variant="ghost" size="icon" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>
      </div>

      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4">
          {messages.map((message, i) => (
            <div
              key={i}
              className={cn(
                "flex w-full",
                message.role === 'user' ? 'justify-end' : 'justify-start'
              )}
            >
              <div
                className={cn(
                  "max-w-[80%] rounded-lg px-4 py-2",
                  message.role === 'user'
                    ? 'bg-primary text-primary-foreground ml-4'
                    : 'bg-muted mr-4'
                )}
              >
                <p className="text-sm whitespace-pre-wrap break-words">
                  {message.content}
                </p>
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-muted rounded-lg px-4 py-2 mr-4">
                <div className="flex gap-1">
                  <span className="animate-bounce">●</span>
                  <span className="animate-bounce delay-100">●</span>
                  <span className="animate-bounce delay-200">●</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </ScrollArea>

      <form onSubmit={handleSubmit} className="p-4 border-t">
        <div className="flex gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your message..."
            className="flex-1"
            disabled={isLoading}
          />
          <Button type="submit" size="icon" disabled={isLoading}>
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </form>
    </div>
  );
} 