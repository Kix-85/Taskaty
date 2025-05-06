
import { useEffect, useRef } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Contact, Message } from "@/data/mockChatData";
import { formatMessageTime } from "@/lib/dateUtils";

interface ChatAreaProps {
  messages: Message[];
  currentContact: Contact;
}

export function ChatArea({ messages, currentContact }: ChatAreaProps) {
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <ScrollArea className="flex-1 p-2">
      <div className="space-y-2 pb-2">
        {messages.length === 0 ? (
          <div className="flex items-center justify-center h-full py-10">
            <p className="text-muted-foreground">
              No messages yet. Start the conversation!
            </p>
          </div>
        ) : (
          messages.map(message => {
            const isCurrentUser = message.senderId === "current-user";
            return (
              <div 
                key={message.id} 
                className={`flex ${isCurrentUser ? "justify-end" : "justify-start"}`}
              >
                <div 
                  className={`max-w-[80%] rounded-lg p-2 ${
                    isCurrentUser 
                      ? "bg-primary text-primary-foreground" 
                      : "bg-accent"
                  }`}
                >
                  <pre className="font-sans whitespace-pre-wrap break-words">
                    {message.content}
                  </pre>
                  <div 
                    className={`text-xs mt-1 ${isCurrentUser ? "text-primary-foreground/70" : "text-muted-foreground"}`}
                  >
                    {formatMessageTime(message.timestamp)}
                  </div>
                </div>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>
    </ScrollArea>
  );
}
