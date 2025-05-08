import { useState, useEffect } from "react";
import { Sidebar } from "@/components/Sidebar";
import { ChatSidebar } from "@/components/ChatSidebar";
import { ChatArea } from "@/components/ChatArea";
import { MessageInput } from "@/components/MessageInput";
import { ChatHeader } from "@/components/ChatHeader";
import { mockContacts } from "@/data/mockChatData";
import { messagesApi, Message } from "@/services/messagesApi";
import { toast } from "sonner";

const Messages = () => {
  const [currentContactId, setCurrentContactId] = useState(mockContacts[0]?.id || "");
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const currentContact = mockContacts.find(contact => contact.id === currentContactId);

  useEffect(() => {
    const fetchMessages = async () => {
      if (!currentContactId) return;
      
      try {
        setIsLoading(true);
        setError(null);
        const data = await messagesApi.getMessages(currentContactId);
        setMessages(data);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to fetch messages';
        setError(errorMessage);
        toast.error(errorMessage);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMessages();
  }, [currentContactId]);

  const handleSendMessage = async (content: string) => {
    if (!content.trim() || !currentContactId) return;

    try {
      const newMessage = {
        content,
        senderId: "current-user",
        receiverId: currentContactId,
        timestamp: new Date().toISOString(),
      };

      const sentMessage = await messagesApi.sendMessage(newMessage);
      setMessages(prev => [...prev, sentMessage]);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to send message';
      toast.error(errorMessage);
    }
  };

  return (
    <div className="flex min-h-screen bg-background">
      {/* <Sidebar /> */}
      <main className="flex-1 ml-0 md:ml-1 transition-all duration-300 flex flex-col h-screen">
        {currentContact ? (
          <>
            <ChatHeader contact={currentContact} />
            <div className="flex flex-1 overflow-hidden">
              <div className="flex-1 flex flex-col h-full">
                <ChatArea 
                  messages={messages} 
                  currentContact={currentContact}
                  isLoading={isLoading}
                  error={error}
                />
                <MessageInput onSendMessage={handleSendMessage} />
              </div>
              <ChatSidebar 
                contacts={mockContacts} 
                currentContactId={currentContactId}
                setCurrentContactId={setCurrentContactId}
              />
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <p className="text-muted-foreground text-lg">Select a contact to start messaging</p>
          </div>
        )}
      </main>
    </div>
  );
}

export default Messages;
