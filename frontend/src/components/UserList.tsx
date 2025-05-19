import { ScrollArea } from "./ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Badge } from "./ui/badge";
import { Input } from "./ui/input";
import { Search } from "lucide-react";
import { useState } from "react";

// Mock users data for testing
const mockUsers = [
  {
    _id: "user-1",
    name: "John Doe",
    email: "john@example.com",
    avatar: "",
    status: "online" as const
  },
  {
    _id: "user-2",
    name: "Jane Smith",
    email: "jane@example.com",
    avatar: "",
    status: "offline" as const
  },
  {
    _id: "user-3",
    name: "Bob Johnson",
    email: "bob@example.com",
    avatar: "",
    status: "online" as const
  }
];

interface UserListProps {
  selectedUserId: string | null;
  onSelectUser: (userId: string) => void;
  currentUserId: string;
}

export function UserList({
  selectedUserId,
  onSelectUser,
  currentUserId
}: UserListProps) {
  const [searchQuery, setSearchQuery] = useState("");

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  const filteredUsers = mockUsers
    .filter(u => u._id !== currentUserId)
    .filter(u => 
      u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.email.toLowerCase().includes(searchQuery.toLowerCase())
    );

  return (
    <div className="h-full border-r bg-card">
      {/* Search Bar */}
      <div className="p-4 border-b">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search users..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 w-full"
          />
        </div>
      </div>
      
      <ScrollArea className="h-[calc(100%-5rem)]">
        <div className="p-4 space-y-2">
          {filteredUsers.length === 0 ? (
            <p className="text-center text-muted-foreground py-4">
              No users found
            </p>
          ) : (
            filteredUsers.map(user => (
              <button
                key={user._id}
                onClick={() => onSelectUser(user._id)}
            className={`
                  w-full flex items-center gap-3 p-3 rounded-lg transition-colors
                  ${selectedUserId === user._id 
                    ? 'bg-primary/10 text-primary'
                    : 'hover:bg-muted'
                  }
            `}
              >
              <Avatar>
                  <AvatarImage src={user.avatar} />
                  <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
              </Avatar>
              
                <div className="flex-1 text-left min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-medium truncate">{user.name}</span>
                    {user.status === 'online' && (
                      <Badge variant="secondary" className="text-xs bg-green-500 text-white hover:bg-green-600 shrink-0">
                        Online
                      </Badge>
              )}
            </div>
                  <p className="text-sm text-muted-foreground truncate">
                    {user.email}
                  </p>
              </div>
              </button>
            ))
                )}
              </div>
      </ScrollArea>
    </div>
  );
}