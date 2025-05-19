import { useEffect, useRef, useState } from "react";
import { Message } from "./Message";
import { MessageInput } from "./MessageInput";
import { Button } from "./ui/button";
import { Video, Phone, PhoneOff } from "lucide-react";
import { Dialog, DialogContent } from "./ui/dialog";
import { ScrollArea } from "./ui/scroll-area";

interface MessageType {
  _id: string;
  sender: {
    _id: string;
    name: string;
    avatar: string;
  };
  receiver: {
    _id: string;
    name: string;
    avatar: string;
  };
  content: string;
  messageType: "text" | "emoji" | "file";
  timestamp: string;
  isRead: boolean;
}

// Mock messages for testing
const mockMessages: MessageType[] = [
  {
    _id: "msg1",
    sender: {
      _id: "user-1",
      name: "John Doe",
      avatar: ""
    },
    receiver: {
      _id: "current-user-id",
      name: "Current User",
      avatar: ""
    },
    content: "Hey there!",
    messageType: "text",
    timestamp: new Date(Date.now() - 1000 * 60 * 5).toISOString(), // 5 minutes ago
    isRead: true
  },
  {
    _id: "msg2",
    sender: {
      _id: "current-user-id",
      name: "Current User",
      avatar: ""
    },
    receiver: {
      _id: "user-1",
      name: "John Doe",
      avatar: ""
    },
    content: "Hi! How are you?",
    messageType: "text",
    timestamp: new Date(Date.now() - 1000 * 60 * 4).toISOString(), // 4 minutes ago
    isRead: true
  }
];

interface ChatAreaProps {
  selectedUserId: string | null;
  currentUser: {
    _id: string;
    name: string;
    avatar?: string;
  };
}

export function ChatArea({ selectedUserId, currentUser }: ChatAreaProps) {
  const [messages, setMessages] = useState<MessageType[]>(mockMessages);
  const [callActive, setCallActive] = useState(false);
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = (content: string, type: "text" | "emoji" | "file" = "text") => {
    if (!selectedUserId) return;

    const newMessage: MessageType = {
      _id: `msg${Date.now()}`,
      sender: {
        _id: currentUser._id,
        name: currentUser.name,
        avatar: currentUser.avatar || ""
      },
      receiver: {
        _id: selectedUserId,
        name: "John Doe", // In a real app, this would be the selected user's name
        avatar: ""
      },
      content,
      messageType: type,
      timestamp: new Date().toISOString(),
      isRead: false
    };

    setMessages(prev => [...prev, newMessage]);
  };

  const handleStartCall = async (video: boolean) => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video,
        audio: true
      });

      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream;
      }

      setCallActive(true);
    } catch (error) {
      console.error("Error accessing media devices:", error);
    }
  };

  const handleEndCall = () => {
    if (localVideoRef.current?.srcObject) {
      const tracks = (localVideoRef.current.srcObject as MediaStream).getTracks();
      tracks.forEach(track => track.stop());
    }
    setCallActive(false);
  };

  if (!selectedUserId) {
    return (
      <div className="flex-1 flex items-center justify-center bg-muted/10">
        <p className="text-muted-foreground">Select a user to start chatting</p>
      </div>
    );
  }

  const filteredMessages = messages.filter(
    msg => 
      (msg.sender._id === selectedUserId && msg.receiver._id === currentUser._id) ||
      (msg.sender._id === currentUser._id && msg.receiver._id === selectedUserId)
  );

  return (
    <div className="flex-1 flex flex-col h-full bg-background">
      <div className="p-4 border-b flex justify-between items-center bg-card">
        <h2 className="text-xl font-semibold text-card-foreground">Chat</h2>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => handleStartCall(true)}
            disabled={callActive}
          >
            <Video className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={() => handleStartCall(false)}
            disabled={callActive}
          >
            <Phone className="h-4 w-4" />
          </Button>
          {callActive && (
            <Button
              variant="destructive"
              size="icon"
              onClick={handleEndCall}
            >
              <PhoneOff className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>

    <ScrollArea className="flex-1 p-4">
      <div className="space-y-4">
          {filteredMessages.map((message) => (
          <Message
              key={message._id}
            message={message}
              isOwnMessage={message.sender._id === currentUser._id}
          />
        ))}
          <div ref={messagesEndRef} />
      </div>
    </ScrollArea>

      <MessageInput receiverId={selectedUserId} onSendMessage={handleSendMessage} />

      <Dialog open={callActive} onOpenChange={open => !open && handleEndCall()}>
        <DialogContent className="sm:max-w-[800px]">
          <div className="grid grid-cols-2 gap-4">
            <div className="relative">
              <video
                ref={localVideoRef}
                autoPlay
                muted
                playsInline
                className="w-full rounded-lg"
              />
              <span className="absolute bottom-2 left-2 bg-black/50 text-white px-2 py-1 rounded">
                You
              </span>
            </div>
            <div className="relative">
              <video
                ref={remoteVideoRef}
                autoPlay
                playsInline
                className="w-full rounded-lg"
              />
              <span className="absolute bottom-2 left-2 bg-black/50 text-white px-2 py-1 rounded">
                Remote User
              </span>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}