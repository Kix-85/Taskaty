import { formatMessageTime } from "@/lib/dateUtils";
import { Message as MessageType } from "@/services/messagesApi";

interface MessageProps {
  message: MessageType;
  isOwnMessage: boolean;
}

export function Message({ message, isOwnMessage }: MessageProps) {
  return (
    <div className={`flex ${isOwnMessage ? "justify-end" : "justify-start"}`}>
      <div 
        className={`max-w-[80%] rounded-lg p-2 ${
          isOwnMessage 
            ? "bg-primary text-primary-foreground" 
            : "bg-accent"
        }`}
      >
        <pre className="font-sans whitespace-pre-wrap break-words">
          {message.content}
        </pre>
        <div 
          className={`text-xs mt-1 ${isOwnMessage ? "text-primary-foreground/70" : "text-muted-foreground"}`}
        >
          {formatMessageTime(message.timestamp)}
        </div>
      </div>
    </div>
  );
} 