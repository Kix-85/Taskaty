
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Contact } from "@/data/mockChatData";

interface ChatSidebarProps {
  contacts: Contact[];
  currentContactId: string;
  setCurrentContactId: (id: string) => void;
}

export function ChatSidebar({ contacts, currentContactId, setCurrentContactId }: ChatSidebarProps) {
  return (
    <div className="w-64 border-l border-border hidden md:flex flex-col">
      <div className="p-4 border-b border-border">
        <h2 className="font-semibold text-lg">Contacts</h2>
      </div>
      <ScrollArea className="flex-1">
        <div className="p-2">
          {contacts.map(contact => (
            <button
              key={contact.id}
              className={`w-full flex items-center p-2 rounded-md mb-2 transition-colors ${
                contact.id === currentContactId 
                  ? "bg-accent text-accent-foreground" 
                  : "hover:bg-accent/50"
              }`}
              onClick={() => setCurrentContactId(contact.id)}
            >
              <div className="relative">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={contact.avatar} alt={contact.name} />
                  <AvatarFallback>
                    {contact.name.split(" ").map(name => name[0]).join("")}
                  </AvatarFallback>
                </Avatar>
                <span 
                  className={`absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-background ${
                    contact.status === "online" ? "bg-green-500" : "bg-gray-400"
                  }`} 
                />
              </div>
              
              <div className="ml-3 flex-1 overflow-hidden">
                <div className="flex justify-between items-center">
                  <p className="font-medium truncate">{contact.name}</p>
                  {contact.unreadCount ? (
                    <Badge variant="secondary" className="ml-2 px-2 py-0.5 text-xs">
                      {contact.unreadCount}
                    </Badge>
                  ) : null}
                </div>
                <p className="text-xs text-muted-foreground truncate">
                  {contact.status === "online" 
                    ? "Online" 
                    : contact.lastSeen 
                      ? `Last seen ${contact.lastSeen}` 
                      : "Offline"}
                </p>
              </div>
            </button>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}
