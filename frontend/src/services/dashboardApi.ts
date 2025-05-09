import axios from 'axios';
import Cookies from 'js-cookie';
import { toast } from 'sonner';

const API_URL = '/api/dashboard';

// Create axios instance with default config
const api = axios.create({
  baseURL: 'http://localhost:3000',
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
  id: string;
  title: string;
  description: string;
  dueDate: string;
  priority: "low" | "medium" | "high";
  progress: number;
  assignees: { name: string; initial: string }[];
}

export interface ProjectStats {
  totalTasks: number;
  completedTasks: number;
  inProgressTasks: number;
  upcomingTasks: number;
  overdueTask: number;
}

// Mock data
const mockProjectStats: ProjectStats = {
  totalTasks: 24,
  completedTasks: 12,
  inProgressTasks: 8,
  upcomingTasks: 4,
  overdueTask: 2,
};

// const mockTasks: Task[] = [
//   {
//     id: "task-1",
//     title: "Redesign homepage",
//     description: "Update the homepage with new branding and improve user experience",
//     dueDate: "May 10",
//     priority: "high",
//     progress: 65,
//     assignees: [
//       { name: "Alex Johnson", initial: "A" },
//       { name: "Maria Garcia", initial: "M" }
//     ]
//   },
//   {
//     id: "task-2",
//     title: "Implement authentication",
//     description: "Set up OAuth and email registration flows with proper security measures",
//     dueDate: "May 15",
//     priority: "high",
//     progress: 30,
//     assignees: [
//       { name: "James Wilson", initial: "J" }
//     ]
//   }
// ];

export const dashboardApi = {
  // Get project statistics
  getProjectStats: async (): Promise<ProjectStats> => {
    // Return mock data directly
    return mockProjectStats;
  },

  // Get today's tasks
  getTodayTasks: async (): Promise<Task[]> => {
    // Return mock data directly
    return mockTasks;
  },

  // Get upcoming tasks
  getUpcomingTasks: async (): Promise<Task[]> => {
    // Return mock data directly
    return mockTasks;
  }
}; 