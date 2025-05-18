import { useState, useEffect } from 'react';
import { messageService, type User, type Conversation } from '@/services/messageService';
import { Chat } from '@/components/Chat/Chat';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Search, Phone, Video } from 'lucide-react';
import { toast } from 'sonner';
import { format } from 'date-fns';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { socketService } from '@/services/socketService';
import Cookies from 'js-cookie';

const Messages = () => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<User[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isCallActive, setIsCallActive] = useState(false);
  const userId = Cookies.get('userId');

  useEffect(() => {
    loadConversations();
    const socket = socketService.connect();

    socket.on('user-online', (userId) => {
      setConversations(prev => prev.map(conv => {
        const participant = conv.participants.find(p => p._id === userId);
        if (participant) {
          participant.status = 'online';
        }
        return conv;
      }));
    });

    socket.on('user-offline', (userId) => {
      setConversations(prev => prev.map(conv => {
        const participant = conv.participants.find(p => p._id === userId);
        if (participant) {
          participant.status = 'offline';
        }
        return conv;
      }));
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const loadConversations = async () => {
    try {
      const data = await messageService.getConversations();
      setConversations(data);
    } catch (error) {
      console.error('Error loading conversations:', error);
      toast.error('Failed to load conversations');
    }
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;

    try {
      setIsSearching(true);
      const results = await messageService.searchUsers(searchQuery);
      setSearchResults(results.filter(user => user._id !== userId));
    } catch (error) {
      console.error('Error searching users:', error);
      toast.error('Failed to search users');
    } finally {
      setIsSearching(false);
    }
  };

  const startChat = (user: User) => {
    setSelectedUser(user);
    // Check if conversation exists, if not create one
    const existingConv = conversations.find(conv => 
      conv.participants.some(p => p._id === user._id)
    );
    if (!existingConv) {
      setConversations(prev => [{
        _id: `temp-${Date.now()}`,
        participants: [user],
        lastMessage: {} as any,
        unreadCount: 0
      }, ...prev]);
    }
  };

  const initiateCall = async (type: 'video' | 'voice') => {
    if (!selectedUser) return;

    try {
      const { roomId } = await messageService.initiateCall(selectedUser._id, type);
      setIsCallActive(true);
      // The Chat component will handle the actual call using the roomId
    } catch (error) {
      console.error('Error initiating call:', error);
      toast.error('Failed to initiate call');
    }
  };

  return (
    <div className="flex h-full">
      {/* Sidebar */}
      <div className="w-80 border-r flex flex-col">
        <div className="p-4 border-b">
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" className="w-full">
                <Search className="w-4 h-4 mr-2" />
                Search Users
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Search Users</DialogTitle>
                <DialogDescription>
                  Search for users to start a conversation
                </DialogDescription>
              </DialogHeader>
              <div className="flex gap-2">
                <Input
                  placeholder="Search by name or email..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                />
                <Button onClick={handleSearch} disabled={isSearching}>
                  Search
                </Button>
              </div>
              <ScrollArea className="h-[300px] mt-4">
                {searchResults.map((user) => (
                  <div
                    key={user._id}
                    className="flex items-center gap-3 p-2 hover:bg-accent rounded-lg cursor-pointer"
                    onClick={() => {
                      startChat(user);
                      setSearchQuery('');
                      setSearchResults([]);
                    }}
                  >
                    <Avatar>
                      <AvatarImage src={user.avatar} />
                      <AvatarFallback>{user.name[0]}</AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-medium">{user.name}</div>
                      <div className="text-sm text-muted-foreground">{user.email}</div>
                    </div>
                  </div>
                ))}
              </ScrollArea>
            </DialogContent>
          </Dialog>
        </div>
        <ScrollArea className="flex-1">
          {conversations.map((conversation) => {
            const otherUser = conversation.participants.find(p => p._id !== userId);
            if (!otherUser) return null;

            return (
              <div
                key={conversation._id}
                className={`p-4 hover:bg-accent cursor-pointer ${
                  selectedUser?._id === otherUser._id ? 'bg-accent' : ''
                }`}
                onClick={() => setSelectedUser(otherUser)}
              >
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <Avatar>
                      <AvatarImage src={otherUser.avatar} />
                      <AvatarFallback>{otherUser.name[0]}</AvatarFallback>
                    </Avatar>
                    <div
                      className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-background ${
                        otherUser.status === 'online' ? 'bg-green-500' : 'bg-gray-500'
                      }`}
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <div className="font-medium truncate">{otherUser.name}</div>
                      {conversation.lastMessage?.createdAt && (
                        <span className="text-xs text-muted-foreground">
                          {format(new Date(conversation.lastMessage.createdAt), 'HH:mm')}
                        </span>
                      )}
                    </div>
                    {conversation.lastMessage?.content && (
                      <div className="text-sm text-muted-foreground truncate">
                        {conversation.lastMessage.content}
                      </div>
                    )}
                  </div>
                  {conversation.unreadCount > 0 && (
                    <Badge variant="secondary">{conversation.unreadCount}</Badge>
                  )}
                </div>
              </div>
            );
          })}
        </ScrollArea>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col">
        {selectedUser ? (
          <>
            <div className="p-4 border-b flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Avatar>
                  <AvatarImage src={selectedUser.avatar} />
                  <AvatarFallback>{selectedUser.name[0]}</AvatarFallback>
                </Avatar>
                <div>
                  <div className="font-medium">{selectedUser.name}</div>
                  <div className="text-sm text-muted-foreground">
                    {selectedUser.status === 'online' ? 'Online' : 'Offline'}
                  </div>
                </div>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => initiateCall('voice')}
                  disabled={isCallActive}
                >
                  <Phone className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => initiateCall('video')}
                  disabled={isCallActive}
                >
                  <Video className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <div className="flex-1">
              <Chat
                roomId={`chat-${selectedUser._id}`}
                onClose={() => setSelectedUser(null)}
              />
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-muted-foreground">
            Select a conversation or search for users to start chatting
          </div>
        )}
      </div>
    </div>
  );
};

export default Messages;