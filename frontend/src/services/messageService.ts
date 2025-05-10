import api from '@/lib/axios';

export interface Message {
  id: string;
  content: string;
  sender: string;
  receiver: string;
  read: boolean;
  createdAt: string;
}

export const messageService = {
  // Get all messages
  getAllMessages: async () => {
    const response = await api.get('/message');
    return response.data;
  },

  // Get messages between two users
  getMessagesBetweenUsers: async (userId1: string, userId2: string) => {
    const response = await api.get(`/message/between/${userId1}/${userId2}`);
    return response.data;
  },

  // Send new message
  sendMessage: async (messageData: Omit<Message, 'id' | 'createdAt' | 'read'>) => {
    const response = await api.post('/message', messageData);
    return response.data;
  },

  // Mark message as read
  markAsRead: async (messageId: string) => {
    const response = await api.put(`/message/${messageId}/read`);
    return response.data;
  },

  // Delete message
  deleteMessage: async (messageId: string) => {
    const response = await api.delete(`/message/${messageId}`);
    return response.data;
  },

  // Get unread message count
  getUnreadCount: async () => {
    const response = await api.get('/message/unread/count');
    return response.data;
  }
}; 