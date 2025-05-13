import axios from 'axios';
import { create } from 'zustand';
import { toast } from 'sonner';
import Cookies from 'js-cookie';
import { mockTasks } from '@/lib/mockData';
import type { Task, TaskGroups } from '@/types/task';

// API Configuration
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
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
      // Clear the token on unauthorized
      Cookies.remove('token');
      toast.error('Session expired. Please login again.');
      window.location.href = '/auth';
    }
    return Promise.reject(error);
  }
);

// Zustand Store
interface TaskStore {
  tasks: TaskGroups;
  isLoading: boolean;
  error: string | null;
  fetchTasks: () => Promise<void>;
  createTask: (task: Omit<Task, 'id'>) => Promise<void>;
  updateTask: (id: string, task: Partial<Task>) => Promise<void>;
  deleteTask: (id: string) => Promise<void>;
  moveTask: (taskId: string, sourceStatus: keyof TaskGroups, destinationStatus: keyof TaskGroups, index: number) => Promise<void>;
}

const groupTasksByStatus = (tasks: Task[]): TaskGroups => {
  return {
    'To Do': tasks.filter(task => task.status === 'To Do'),
    'In Progress': tasks.filter(task => task.status === 'In Progress'),
    'Done': tasks.filter(task => task.status === 'Done')
  };
};

export const useTaskStore = create<TaskStore>((set, get) => ({
  tasks: {
    'To Do': [],
    'In Progress': [],
    'Done': []
  },
  isLoading: false,
  error: null,

  fetchTasks: async () => {
    set({ isLoading: true, error: null });
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      const groupedTasks = groupTasksByStatus(mockTasks);
      set({ tasks: groupedTasks, isLoading: false });
    } catch (error) {
      set({ error: 'Failed to fetch tasks', isLoading: false });
    }
  },

  createTask: async (taskData) => {
    try {
      set({ isLoading: true, error: null });
      const response = await api.post('/task', taskData);
      const newTask = response.data;
      
      set((state) => ({
        tasks: {
          ...state.tasks,
          'To Do': [...state.tasks['To Do'], newTask],
          isLoading: false
        }
      }));
      
      toast.success('Task created successfully');
    } catch (error) {
      set({ error: 'Failed to create task', isLoading: false });
      toast.error('Failed to create task');
    }
  },

  updateTask: async (id, taskData) => {
    try {
      set({ isLoading: true, error: null });
      const response = await api.put(`/task/${id}`, taskData);
      const updatedTask = response.data;
      
      set((state) => {
        const newTasks = {
          ...state.tasks,
          'To Do': state.tasks['To Do'].map((task) =>
            task.id === id ? updatedTask : task
          ),
          'In Progress': state.tasks['In Progress'].map((task) =>
            task.id === id ? updatedTask : task
          ),
          'Done': state.tasks['Done'].map((task) =>
            task.id === id ? updatedTask : task
          )
        };
        return { tasks: newTasks, isLoading: false };
      });
      
      toast.success('Task updated successfully');
    } catch (error) {
      set({ error: 'Failed to update task', isLoading: false });
      toast.error('Failed to update task');
    }
  },

  deleteTask: async (id) => {
    try {
      set({ isLoading: true, error: null });
      await api.delete(`/task/${id}`);
      
      set((state) => {
        const newTasks = {
          ...state.tasks,
          'To Do': state.tasks['To Do'].filter((task) => task.id !== id),
          'In Progress': state.tasks['In Progress'].filter((task) => task.id !== id),
          'Done': state.tasks['Done'].filter((task) => task.id !== id)
        };
        return { tasks: newTasks, isLoading: false };
      });
      
      toast.success('Task deleted successfully');
    } catch (error) {
      set({ error: 'Failed to delete task', isLoading: false });
      toast.error('Failed to delete task');
    }
  },

  moveTask: async (taskId: string, sourceStatus: keyof TaskGroups, destinationStatus: keyof TaskGroups, index: number) => {
    set(state => {
      const newTasks = { ...state.tasks };
      const task = newTasks[sourceStatus].find(t => t.id === taskId);
      
      if (!task) return state;
      
      // Remove from source
      newTasks[sourceStatus] = newTasks[sourceStatus].filter(t => t.id !== taskId);
      
      // Add to destination
      const updatedTask = { ...task, status: destinationStatus };
      newTasks[destinationStatus].splice(index, 0, updatedTask);
      
      return { tasks: newTasks };
    });
  }
}));

// Export API functions for direct use if needed
export const taskApi = {
  getAll: () => api.get('/task/me'),
  getById: (id: string) => api.get(`/task/${id}`),
  create: (task: Omit<Task, 'id'>) => api.post('/task', task),
  update: (id: string, task: Partial<Task>) => api.put(`/task/${id}`, task),
  delete: (id: string) => api.delete(`/task/${id}`),
  move: (taskId: string, sourceStatus: keyof TaskGroups, destinationStatus: keyof TaskGroups, newIndex: number) =>
    api.put(`/task/${taskId}/move`, { sourceStatus, destinationStatus, newIndex })
}; 