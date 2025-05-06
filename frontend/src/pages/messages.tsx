
import { useState } from "react";
import { Sidebar } from "@/components/Sidebar";
import { ChatSidebar } from "@/components/ChatSidebar";
import { ChatArea } from "@/components/ChatArea";
import { MessageInput } from "@/components/MessageInput";
import { ChatHeader } from "@/components/ChatHeader";
import { mockContacts, mockMessages } from "@/data/mockChatData";

const Messages = () => {
  const [currentContactId, setCurrentContactId] = useState(mockContacts[0]?.id || "");
  const [messages, setMessages] = useState(mockMessages);

  const currentContact = mockContacts.find(contact => contact.id === currentContactId);

  const handleSendMessage = (message: string) => {
    if (message.trim()) {
      const newMessage = {
        id: `msg-${Date.now()}`,
        senderId: "current-user",
        receiverId: currentContactId,
        content: message,
        timestamp: new Date().toISOString(),
      };
      
      setMessages([...messages, newMessage]);
    }
  };

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <main className="flex-1 ml-0 md:ml-16 transition-all duration-300 flex flex-col h-screen">
        {currentContact ? (
          <>
            <ChatHeader contact={currentContact} />
            <div className="flex flex-1 overflow-hidden">
              <div className="flex-1 flex flex-col h-full">
                <ChatArea 
                  messages={messages.filter(
                    msg => msg.senderId === currentContactId || msg.receiverId === currentContactId
                  )} 
                  currentContact={currentContact} 
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
