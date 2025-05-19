import axios from 'axios';
import Cookies from 'js-cookie';
import { toast } from 'sonner';
import { API_CONFIG } from '../config/api';
import { authService } from './authService';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_CONFIG.baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

// Add request interceptor for auth token
api.interceptors.request.use(async (config) => {
  const token = Cookies.get('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Add response interceptor for handling token refresh and auth errors
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // If error is 401 and we haven't tried to refresh the token yet
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const token = Cookies.get('token');
        if (token) {
          // Try to refresh the token
          const response = await authService.verifyToken(token);
          const newToken = response.data.token;
          
          // Update the original request with new token
          originalRequest.headers.Authorization = `Bearer ${newToken}`;
          
          // Retry the original request
          return api(originalRequest);
        }
      } catch (refreshError) {
        console.error('Token refresh failed:', refreshError);
        // If token refresh fails, redirect to login
        window.location.href = '/auth';
        return Promise.reject(refreshError);
      }
    }

    // Handle other errors
    if (error.response?.status === 401) {
      window.location.href = '/auth';
    }
    return Promise.reject(error);
  }
);

export interface Task {
  _id: string;
  name: string;
  description: string;
  dueDate: string;
  status: 'todo' | 'in progress' | 'done';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  progress: number;
  assignedTo: {
    _id: string;
    name: string;
    email: string;
  }[];
  project: {
    _id: string;
    name: string;
    logo: string;
    description: string;
    status: string;
    activity: string;
    dueDate: string;
  };
  createdBy: {
    _id: string;
    name: string;
    email: string;
  };
  tags: string[];
  isRecurring: boolean;
  recurrencePattern: 'daily' | 'weekly' | 'monthly' | 'none';
  createdAt: string;
  updatedAt: string;
  subtasks: { _id: string; title: string; description?: string; completed: boolean }[];
}

export interface ProjectStats {
  totalTasks: number;
  completedTasks: number;
  inProgressTasks: number;
  upcomingTasks: number;
  overdueTasks: number;
}

export const dashboardApi = {
  // Get project statistics
  getProjectStats: async (): Promise<ProjectStats> => {
    try {
      const response = await api.get('/task/me');  // Remove /api prefix since it's in baseURL
      const tasks: Task[] = response.data;
      
      const stats: ProjectStats = {
        totalTasks: tasks.length,
        completedTasks: tasks.filter((task) => task.status === 'done').length,
        inProgressTasks: tasks.filter((task) => task.status === 'in progress').length,
        upcomingTasks: tasks.filter((task) => {
          if (!task.dueDate) return false;
          const dueDate = new Date(task.dueDate);
          const today = new Date();
          today.setHours(0, 0, 0, 0);
          return dueDate > today && task.status !== 'done';
        }).length,
        overdueTasks: tasks.filter((task) => {
          if (!task.dueDate) return false;
          const dueDate = new Date(task.dueDate);
          const today = new Date();
          today.setHours(0, 0, 0, 0);
          return dueDate < today && task.status !== 'done';
        }).length,
      };
      
      return stats;
    } catch (error: any) {
      console.error('Error fetching project stats:', error);
      toast.error(error.response?.data?.message || 'Failed to fetch project statistics');
      throw error;
    }
  },

  // Get today's tasks
  getTodayTasks: async (): Promise<Task[]> => {
    try {
      const response = await api.get('/task/me');  // Remove /api prefix
      const tasks: Task[] = response.data;
      
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);
      
      return tasks.filter((task) => {
        if (!task.dueDate) return false;
        const taskDate = new Date(task.dueDate);
        return taskDate >= today && taskDate < tomorrow;
      });
    } catch (error: any) {
      console.error('Error fetching today\'s tasks:', error);
      toast.error(error.response?.data?.message || 'Failed to fetch today\'s tasks');
      throw error;
    }
  },

  // Get upcoming tasks
  getUpcomingTasks: async (): Promise<Task[]> => {
    try {
      const response = await api.get('/task/me');  // Remove /api prefix
      const tasks: Task[] = response.data;
      
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      return tasks
        .filter((task) => {
          if (!task.dueDate) return false;
          const taskDate = new Date(task.dueDate);
          return taskDate > today && task.status !== 'done';
        })
        .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime());
    } catch (error: any) {
      console.error('Error fetching upcoming tasks:', error);
      toast.error(error.response?.data?.message || 'Failed to fetch upcoming tasks');
      throw error;
    }
  },

  // Get overdue tasks
  getOverdueTasks: async (): Promise<Task[]> => {
    try {
      const response = await api.get('/task/me');  // Remove /api prefix
      const tasks: Task[] = response.data;
      
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      return tasks
        .filter((task) => {
          if (!task.dueDate) return false;
          const taskDate = new Date(task.dueDate);
          return taskDate < today && task.status !== 'done';
        })
        .sort((a, b) => new Date(b.dueDate).getTime() - new Date(a.dueDate).getTime());
    } catch (error: any) {
      console.error('Error fetching overdue tasks:', error);
      toast.error(error.response?.data?.message || 'Failed to fetch overdue tasks');
      throw error;
    }
  }
}; 