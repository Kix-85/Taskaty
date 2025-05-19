import api from '@/lib/axios';
import { useAuthStore } from '@/store/authStore';

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
  getUserProfile: async () => {
    try {
      const response = await api.get('/user/me');
      return response.data;
    } catch (error: any) {
      if (error.response?.status === 401) {
        useAuthStore.getState().clearUser();
      }
      throw new Error(error.response?.data?.message || 'Failed to fetch user profile');
    }
  },

  // verify token
  verifyToken: async () => {
    try {
      const response = await api.get('/user/verify-token');
      return response;
    } catch (error: any) {
      if (error.response?.status === 401) {
        useAuthStore.getState().clearUser();
      }
      throw error;
    }
  },

  // Get user by ID
  getUserById: async (id: string) => {
    try {
      const response = await api.get(`/user/${id}`);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to fetch user');
    }
  },

  // Update user profile
  updateUserProfile: async (formData: FormData) => {
    try {
      const response = await api.put('/user/me', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        timeout: 30000, // Increase timeout for file uploads
      });
      return response.data;
    } catch (error: any) {
      if (error.response?.status === 401) {
        useAuthStore.getState().clearUser();
      }
      throw new Error(error.response?.data?.message || 'Error updating profile');
    }
  },

  // Update user settings
  updateSettings: async (settings: Record<string, any>) => {
    try {
      const response = await api.put('/user/settings', settings);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to update settings');
    }
  },

  // Search users
  searchUsers: async (query: string) => {
    try {
      const response = await api.get(`/user/search?q=${query}`);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to search users');
    }
  },

  // Get user statistics
  getUserStatistics: async (userId: string) => {
    try {
      const response = await api.get(`/user/${userId}/statistics`);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to fetch statistics');
    }
  },

  // Update user status
  updateStatus: async (userId: string, status: User['status']) => {
    try {
      const response = await api.put(`/user/${userId}/status`, { status });
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to update status');
    }
  },

  // Reset user password
  resetUserPassword: async (data: {
    email: string;
    newPassword: string;
    confirmPassword: string;
  }) => {
    try {
      const response = await api.post('/auth/reset-pass', data);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to reset password');
    }
  }
}; 