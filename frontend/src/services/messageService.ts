import api from '@/lib/axios';

export interface User {
  _id: string;
  name: string;
  email: string;
  avatar?: string;
  status?: 'online' | 'offline';
}

export interface Message {
  _id: string;
  sender: User;
  receiver: User;
  content: string;
  messageType: 'text' | 'file' | 'image';
  createdAt: string;
  read: boolean;
}

export interface Conversation {
  _id: string;
  participants: User[];
  lastMessage: Message;
  unreadCount: number;
}

class MessageService {
  async searchUsers(query: string): Promise<User[]> {
    const response = await api.get(`/user/search?q=${query}`);
    return response.data;
  }

  async getConversations(): Promise<Conversation[]> {
    const response = await api.get('/messages/history');
    return response.data;
  }

  async getConversation(userId: string): Promise<Message[]> {
    const response = await api.get(`/messages/${userId}`);
    return response.data;
  }

  async markAsRead(senderId: string): Promise<void> {
    await api.post(`/messages/read/${senderId}`);
  }

  async initiateCall(userId: string, type: 'video' | 'voice'): Promise<{ roomId: string }> {
    const response = await api.post(`/messages/call/initiate`, {
      userId,
      type
    });
    return response.data;
  }

  async acceptCall(callId: string): Promise<void> {
    await api.post(`/messages/call/accept/${callId}`);
  }

  async rejectCall(callId: string): Promise<void> {
    await api.post(`/messages/call/reject/${callId}`);
  }

  async endCall(callId: string): Promise<void> {
    await api.post(`/messages/call/end/${callId}`);
  }
}

export const messageService = new MessageService(); 