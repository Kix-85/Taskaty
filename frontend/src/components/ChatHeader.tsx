
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { PhoneCall, Video, Plus } from "lucide-react";
import { Contact } from "@/data/mockChatData";

interface ChatHeaderProps {
  contact: Contact;
}

export function ChatHeader({ contact }: ChatHeaderProps) {
  return (
    <div className="h-14 border-b border-border flex items-center justify-between px-2">
      <div className="flex items-center">
        <div className="relative">
          <Avatar className="h-8 w-8">
            <AvatarImage src={contact.avatar} alt={contact.name} />
            <AvatarFallback>
              {contact.name.split(" ").map(name => name[0]).join("")}
            </AvatarFallback>
          </Avatar>
          <span 
            className={`absolute bottom-0 right-0 h-2 w-2 rounded-full border-2 border-background ${
              contact.status === "online" ? "bg-green-500" : "bg-gray-400"
            }`} 
          />
        </div>
        
        <div className="ml-2">
          <p className="font-medium text-sm">{contact.name}</p>
          <p className="text-xs text-muted-foreground">
            {contact.status === "online" 
              ? "Online" 
              : contact.lastSeen 
                ? `Last seen ${contact.lastSeen}` 
                : "Offline"}
          </p>
        </div>
      </div>
      
      <div className="flex items-center gap-1">
        <Button variant="ghost" size="icon" className="text-foreground h-8 w-8">
          <PhoneCall size={18} />
        </Button>
        <Button variant="ghost" size="icon" className="text-foreground h-8 w-8">
          <Video size={18} />
        </Button>
        <Button variant="secondary" size="sm" className="ml-1 h-8 text-xs">
          <Plus size={14} className="mr-1" />
          Add Task
        </Button>
      </div>
    </div>
  );
}
