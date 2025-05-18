import { createContext, useContext, useState, ReactNode } from 'react';
import { ChatBot } from '@/components/Chat/ChatBot';

interface ChatBotContextType {
  showChat: boolean;
  setShowChat: (show: boolean) => void;
  minimized: boolean;
  setMinimized: (minimized: boolean) => void;
  context: string;
  setContext: (context: string) => void;
}

const ChatBotContext = createContext<ChatBotContextType | undefined>(undefined);

export const useChatBot = () => {
  const context = useContext(ChatBotContext);
  if (!context) {
    throw new Error('useChatBot must be used within a ChatBotProvider');
  }
  return context;
};

interface ChatBotProviderProps {
  children: ReactNode;
}

export const ChatBotProvider = ({ children }: ChatBotProviderProps) => {
  const [showChat, setShowChat] = useState(false);
  const [minimized, setMinimized] = useState(false);
  const [context, setContext] = useState('');

  return (
    <ChatBotContext.Provider
      value={{
        showChat,
        setShowChat,
        minimized,
        setMinimized,
        context,
        setContext
      }}
    >
      {children}
      {showChat && (
        <ChatBot
          context={context}
          minimized={minimized}
          onClose={() => setShowChat(false)}
          onMinimize={() => setMinimized(!minimized)}
        />
      )}
    </ChatBotContext.Provider>
  );
}; 