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
  getUserProfile: async () => {
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
  },  // Update user profile
  updateUserProfile: async (formData: FormData) => {
    try {
      console.log("Uploading profile data...");
      const response = await api.put('/user/me', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        timeout: 30000, // Increase timeout for file uploads
      });
      console.log("Response from updateUserProfile: ", response);
      return response.data;
    } catch (error: any) {
      console.error('Profile update error:', error);
      if (error.response) {
        throw new Error(error.response.data.message || 'Error updating profile');
      } else if (error.request) {
        throw new Error('No response from server. Please try again.');
      } else {
        throw new Error('Error updating profile: ' + error.message);
      }
    }
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