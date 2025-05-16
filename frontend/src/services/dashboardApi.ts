import axios from 'axios';
import Cookies from 'js-cookie';
import { toast } from 'sonner';

const API_URL = '/api/dashboard';

// Create axios instance with default config
const api = axios.create({
  baseURL: 'https://app3000.maayn.me',
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
  console.log('Making API request to:', config.url);
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
  _id: string;
  name: string;
  description: string;
  dueDate: string;
  priority: "low" | "medium" | "high";
  progress: number;
  assignedTo?: Array<{
    _id: string;
    name: string;
    email: string;
  }>;
}

export interface ProjectStats {
  totalTasks: number;
  completedTasks: number;
  inProgressTasks: number;
  upcomingTasks: number;
  overdueTask: number;
  projects: Array<{
    id: string;
    name: string;
    description: string;
    status: string;
    dueDate: string;
  }>;
}

export const dashboardApi = {
  // Get project statistics
  getProjectStats: async (): Promise<ProjectStats> => {
    try {
      const response = await api.get('/api/project/me');
      const projects = response.data;
      
      // Calculate stats from real data
      const stats: ProjectStats = {
        totalTasks: 0,
        completedTasks: 0,
        inProgressTasks: 0,
        upcomingTasks: 0,
        overdueTask: 0,
        projects: projects.map((project: any) => ({
          id: project._id,
          name: project.name,
          description: project.description,
          status: project.status,
          dueDate: project.dueDate
        }))
      };

      return stats;
    } catch (error) {
      console.error('Error fetching project stats:', error);
      throw error;
    }
  },

  // Get today's tasks
  getTodayTasks: async (): Promise<Task[]> => {
    try {
      const response = await api.get('/api/tasks/me');
      return response.data;
    } catch (error) {
      console.error('Error fetching today\'s tasks:', error);
      throw error;
    }
  },

  // Get upcoming tasks
  getUpcomingTasks: async (): Promise<Task[]> => {
    try {
      const response = await api.get('/api/tasks/me');
      return response.data;
    } catch (error) {
      console.error('Error fetching upcoming tasks:', error);
      throw error;
    }
  }
}; 