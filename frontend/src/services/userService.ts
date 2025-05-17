import api from '@/lib/axios';

export interface User {
  id: string;
  username: string;
  name: string;
  email: string;
  bio?: string;
  profileImage?: string;
  role?: 'user' | 'admin';
  status?: 'active' | 'inactive' | 'suspended';
  statistics?: {
    tasksCompleted: number;
    lastActive: string;
  };
  createdAt: string;
  updatedAt: string;
}

export const userService = {
  // Get current user profile
  getCurrentUser: async () => {
    const response = await api.get('/user/me');
    return response.data;
  },

  // verify token
  verifyToken: async () => {
    const response = await api.get('/user/verify-token', { withCredentials: true });
    console.log('From user service: ', response);
    return response;
  },

  // Get user by ID
  getUserById: async (id: string) => {
    const response = await api.get(`/user/${id}`);
    return response.data;
  },

  // Update user profile
  updateProfile: async (userData: Partial<User>) => {
    const response = await api.put('/user/profile', userData);
    return response.data;
  },

  // Update user settings
  updateSettings: async (settings: Record<string, any>) => {
    const response = await api.put('/user/settings', settings);
    return response.data;
  },

  // Search users
  searchUsers: async (query: string) => {
    const response = await api.get(`/user/search?q=${query}`);
    return response.data;
  },

  // Get user statistics
  getUserStatistics: async (userId: string) => {
    const response = await api.get(`/user/${userId}/statistics`);
    return response.data;
  },

  // Update user status
  updateStatus: async (userId: string, status: User['status']) => {
    const response = await api.put(`/user/${userId}/status`, { status });
    return response.data;
  }
}; 