import axios from 'axios';

const API_URL = '/api/messages';

// Create axios instance with default config
const api = axios.create({
  baseURL: 'http://localhost:3000',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor for auth token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export interface Message {
  id: string;
  content: string;
  senderId: string;
  receiverId: string;
  timestamp: string;
}

export const messagesApi = {
  // Get messages between current user and a contact
  getMessages: async (contactId: string): Promise<Message[]> => {
    try {
      const response = await api.get(`${API_URL}/${contactId}`);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(error.response?.data?.message || 'Failed to fetch messages');
      }
      throw error;
    }
  },

  // Send a new message
  sendMessage: async (message: Omit<Message, 'id'>): Promise<Message> => {
    try {
      const response = await api.post(API_URL, message);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(error.response?.data?.message || 'Failed to send message');
      }
      throw error;
    }
  },

  // Get all conversations
  getConversations: async () => {
    try {
      const response = await api.get(`${API_URL}/conversations`);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(error.response?.data?.message || 'Failed to fetch conversations');
      }
      throw error;
    }
  }
}; 