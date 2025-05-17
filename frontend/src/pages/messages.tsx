import { useState } from "react";
import { UserList } from "@/components/UserList";
import { ChatArea } from "@/components/ChatArea";
import { Button } from "@/components/ui/button";
import { UserRound, ArrowLeft } from "lucide-react";
import { cn } from "@/lib/utils";
import { useMediaQuery } from "@/hooks/use-media-query";
import { BotChat } from '@/components/BotChat';

// Mock user data for testing
const mockCurrentUser = {
  _id: "current-user-id",
  name: "Current User",
  email: "user@example.com",
  avatar: ""
};

export default function Chat() {
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const isMobile = useMediaQuery("(max-width: 768px)");

  const handleSelectUser = (userId: string) => {
    setSelectedUserId(userId);
  };

  const handleBackToList = () => {
    setSelectedUserId(null);
  };

  // On mobile, show either user list or chat area based on selection
  const showUserList = !isMobile || !selectedUserId;
  const showChatArea = !isMobile || selectedUserId;

  return (
    <div className="h-screen flex flex-col">
      {/* Header */}
      <header className="h-16 border-b flex items-center justify-between px-4 bg-card">
        <div className="flex items-center gap-2">
          {isMobile && selectedUserId && (
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={handleBackToList}
              className="mr-2 lg:hidden"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
          )}
          <h1 className="text-xl font-bold text-card-foreground">Messages</h1>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="bg-primary/10 p-2 rounded-full">
              <UserRound className="h-5 w-5 text-primary" />
            </div>
            <span className="font-medium text-foreground hidden sm:inline-block">{mockCurrentUser.name}</span>
          </div>
        </div>
      </header>
      
      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* User List - Hidden on mobile when chat is open */}
        <div className={cn(
          "transition-[width] duration-300 ease-in-out",
          showUserList ? "w-full md:w-80" : "w-0 md:w-80"
        )}>
          {showUserList && (
            <UserList 
              selectedUserId={selectedUserId} 
              onSelectUser={handleSelectUser}
              currentUserId={mockCurrentUser._id}
            />
          )}
        </div>
        
        {/* Chat Area - Full width on mobile when open */}
        <div className={cn(
          "transition-[width] duration-300 ease-in-out flex-1 relative",
          showChatArea ? "w-full" : "w-0"
        )}>
          {showChatArea && (
            <>
              <ChatArea 
                selectedUserId={selectedUserId}
                currentUser={mockCurrentUser}
              />
              <div className="absolute bottom-0 right-0">
                <BotChat />
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}