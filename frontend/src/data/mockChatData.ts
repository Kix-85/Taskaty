
export interface Contact {
  id: string;
  name: string;
  avatar: string;
  status: "online" | "offline";
  lastSeen?: string;
  unreadCount?: number;
}

export interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  content: string;
  timestamp: string;
}

export const mockContacts: Contact[] = [
  {
    id: "contact-1",
    name: "Alex Johnson",
    avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=80&h=80",
    status: "online",
    unreadCount: 3
  },
  {
    id: "contact-2",
    name: "Maria Garcia",
    avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=80&h=80",
    status: "offline",
    lastSeen: "13 min ago"
  },
  {
    id: "contact-3",
    name: "James Wilson",
    avatar: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?auto=format&fit=crop&w=80&h=80",
    status: "online"
  },
  {
    id: "contact-4",
    name: "Sarah Brown",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=80&h=80",
    status: "offline",
    lastSeen: "2 hours ago",
    unreadCount: 1
  },
  {
    id: "contact-5",
    name: "David Lee",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=80&h=80",
    status: "online"
  },
  {
    id: "contact-6",
    name: "Emily Chen",
    avatar: "https://images.unsplash.com/photo-1524250502761-1ac6f2e30d43?auto=format&fit=crop&w=80&h=80",
    status: "offline",
    lastSeen: "Yesterday"
  }
];

export const mockMessages: Message[] = [
  {
    id: "msg-1",
    senderId: "contact-1",
    receiverId: "current-user",
    content: "Hey there! How's it going with the project?",
    timestamp: "2025-05-03T10:23:00.000Z"
  },
  {
    id: "msg-2",
    senderId: "current-user",
    receiverId: "contact-1",
    content: "It's coming along well! Just finishing up the UI components.",
    timestamp: "2025-05-03T10:25:00.000Z"
  },
  {
    id: "msg-3",
    senderId: "contact-1",
    receiverId: "current-user",
    content: "That's great to hear! Can you share a preview when you're done?",
    timestamp: "2025-05-03T10:30:00.000Z"
  },
  {
    id: "msg-4",
    senderId: "current-user",
    receiverId: "contact-1",
    content: "Sure thing! I'll send it over by end of day.",
    timestamp: "2025-05-03T10:32:00.000Z"
  },
  {
    id: "msg-5",
    senderId: "contact-2",
    receiverId: "current-user",
    content: "Don't forget about our meeting tomorrow at 2pm!",
    timestamp: "2025-05-03T09:15:00.000Z"
  },
  {
    id: "msg-6",
    senderId: "current-user",
    receiverId: "contact-2",
    content: "I've got it on my calendar. See you then!",
    timestamp: "2025-05-03T09:20:00.000Z"
  },
  {
    id: "msg-7",
    senderId: "contact-3",
    receiverId: "current-user",
    content: "Just pushed the latest code changes. Can you review when you get a chance?",
    timestamp: "2025-05-02T16:45:00.000Z"
  }
];
