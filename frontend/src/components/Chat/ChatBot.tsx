import { useState, useEffect, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Bot, X, Minimize2, Maximize2 } from "lucide-react";
import { toast } from 'sonner';
import Cookies from 'js-cookie';

interface Message {
  id: string;
  text: string;
  isBot: boolean;
  timestamp: Date;
}

interface ChatBotProps {
  context?: string;
  minimized?: boolean;
  onClose?: () => void;
  onMinimize?: () => void;
}

export const ChatBot = ({ context, minimized = false, onClose, onMinimize }: ChatBotProps) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  // Get user info from cookies
  const userName = Cookies.get('userName') || 'User';

  useEffect(() => {
    // Add initial greeting
    if (messages.length === 0) {
      setMessages([
        {
          id: '1',
          text: `Hi ${userName}! I'm your AI assistant. ${context ? "I'm here to help you with " + context : "How can I help you today?"}`,
          isBot: true,
          timestamp: new Date()
        }
      ]);
    }
  }, [context, userName]);

  useEffect(() => {
    // Scroll to bottom when new messages arrive
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;

    const userMessage: Message = {
      id: Math.random().toString(),
      text: inputMessage,
      isBot: false,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    try {
      const token = Cookies.get('token');
      if (!token) {
        throw new Error('Authentication token not found');
      }

      const response = await fetch('/api/chat/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          message: inputMessage,
          context: context || '',
          history: messages.slice(-5).map(m => ({
            role: m.isBot ? 'assistant' : 'user',
            content: m.text
          }))
        })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `Server responded with status ${response.status}`);
      }

      const data = await response.json();
      
      if (!data.response) {
        throw new Error('Invalid response format from server');
      }

      const botMessage: Message = {
        id: Math.random().toString(),
        text: data.response,
        isBot: true,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error('Error getting bot response:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to get response from assistant';
      toast.error(errorMessage);
      
      // Add error message to chat
      const errorBotMessage: Message = {
        id: Math.random().toString(),
        text: "I'm sorry, I encountered an error. Please try again.",
        isBot: true,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorBotMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  if (minimized) {
    return (
      <Button
        className="fixed bottom-4 right-4 p-2"
        onClick={onMinimize}
      >
        <Bot className="h-4 w-4" />
      </Button>
    );
  }

  return (
    <Card className="fixed bottom-4 right-4 w-80 shadow-lg">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">AI Assistant</CardTitle>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={onMinimize}
            className="h-8 w-8"
          >
            {minimized ? <Maximize2 className="h-4 w-4" /> : <Minimize2 className="h-4 w-4" />}
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="h-8 w-8"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>

      <CardContent>
        <ScrollArea className="h-[300px] pr-4" ref={scrollAreaRef}>
          <div className="flex flex-col gap-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex gap-2 ${
                  !message.isBot ? 'flex-row-reverse' : ''
                }`}
              >
                <Avatar className="h-8 w-8">
                  {message.isBot ? (
                    <Bot className="h-5 w-5" />
                  ) : (
                    <AvatarFallback>{userName[0].toUpperCase()}</AvatarFallback>
                  )}
                </Avatar>
                <div
                  className={`rounded-lg p-2 max-w-[70%] ${
                    !message.isBot
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted'
                  }`}
                >
                  <p className="text-sm whitespace-pre-wrap">{message.text}</p>
                  <span className="text-xs opacity-70">
                    {new Date(message.timestamp).toLocaleTimeString()}
                  </span>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex gap-2">
                <Avatar className="h-8 w-8">
                  <Bot className="h-5 w-5" />
                </Avatar>
                <div className="rounded-lg p-2 bg-muted">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 rounded-full bg-foreground/30 animate-bounce" />
                    <div className="w-2 h-2 rounded-full bg-foreground/30 animate-bounce [animation-delay:0.2s]" />
                    <div className="w-2 h-2 rounded-full bg-foreground/30 animate-bounce [animation-delay:0.4s]" />
                  </div>
                </div>
              </div>
            )}
          </div>
        </ScrollArea>
      </CardContent>

      <CardFooter>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
          className="flex w-full gap-2"
        >
          <Input
            placeholder="Type a message..."
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            disabled={isLoading}
          />
          <Button type="submit" disabled={isLoading}>
            Send
          </Button>
        </form>
      </CardFooter>
    </Card>
  );
}; 