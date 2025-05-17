import axios from 'axios';
import Cookies from 'js-cookie';
import { toast } from 'sonner';
import { API_CONFIG } from '../config/api';

const API_URL = '/api/task';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_CONFIG.baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // This is important for cookies
});

// Add request interceptor for auth token
api.interceptors.request.use((config) => {
  const token = Cookies.get('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Add response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized access
      toast.error('Session expired. Please login again.');
      // You might want to redirect to login page here
    }
    return Promise.reject(error);
  }
);

export interface Task {
  id: string;
  name: string;
  description: string;
  dueDate: string;
  status: string;
  progress: number;
  assignedTo: { name: string; email: string }[];
  project: {
    name: string;
    logo: string;
    description: string;
    status: string;
    activity: string;
    dueDate: string;
  };
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
      const response = await api.get(`${API_URL}/me`);
      const tasks = response.data;
      
      const stats: ProjectStats = {
        totalTasks: tasks.length,
        completedTasks: tasks.filter((task: Task) => task.status === 'completed').length,
        inProgressTasks: tasks.filter((task: Task) => task.status === 'in-progress').length,
        upcomingTasks: tasks.filter((task: Task) => {
          const dueDate = new Date(task.dueDate);
          const today = new Date();
          return dueDate > today && task.status !== 'completed';
        }).length,
        overdueTasks: tasks.filter((task: Task) => {
          const dueDate = new Date(task.dueDate);
          const today = new Date();
          return dueDate < today && task.status !== 'completed';
        }).length,
      };
      
      return stats;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(error.response?.data?.message || 'Failed to fetch project stats');
      }
      throw error;
    }
  },

  // Get today's tasks
  getTodayTasks: async (): Promise<Task[]> => {
    try {
      const response = await api.get(`${API_URL}/me`);
      const tasks = response.data;
      
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);
      
      return tasks.filter((task: Task) => {
        const taskDate = new Date(task.dueDate);
        return taskDate >= today && taskDate < tomorrow;
      });
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(error.response?.data?.message || 'Failed to fetch today\'s tasks');
      }
      throw error;
    }
  },

  // Get upcoming tasks
  getUpcomingTasks: async (): Promise<Task[]> => {
    try {
      const response = await api.get(`${API_URL}/me`);
      const tasks = response.data;
      
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      return tasks
        .filter((task: Task) => {
          const taskDate = new Date(task.dueDate);
          return taskDate > today && task.status !== 'completed';
        })
        .sort((a: Task, b: Task) => {
          return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
        });
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(error.response?.data?.message || 'Failed to fetch upcoming tasks');
      }
      throw error;
    }
  }
}; 