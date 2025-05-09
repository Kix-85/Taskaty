import axios from 'axios';
import { create } from 'zustand';
import { toast } from 'sonner';
import Cookies from 'js-cookie';

// Types
export interface Task {
  id: string;
  title: string;
  description: string;
  content: string;
  startDate: string;
  dueDate: string;
  priority: 'low' | 'medium' | 'high';
  status: 'To Do' | 'In Progress' | 'Done';
  progress: number;
  assignees: { name: string; initial: string }[];
  projectId?: string;
  subscribes: number;
}

export interface TaskGroups {
  'To Do': Task[];
  'In Progress': Task[];
  'Done': Task[];
}

// API Configuration
const API_URL = '/api/task/me';

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

// Zustand Store
interface TaskStore {
  tasks: TaskGroups;
  isLoading: boolean;
  error: string | null;
  fetchTasks: () => Promise<void>;
  createTask: (task: Omit<Task, 'id'>) => Promise<void>;
  updateTask: (id: string, task: Partial<Task>) => Promise<void>;
  deleteTask: (id: string) => Promise<void>;
  moveTask: (taskId: string, sourceStatus: keyof TaskGroups, destinationStatus: keyof TaskGroups, newIndex: number) => Promise<void>;
}

export const useTaskStore = create<TaskStore>((set, get) => ({
  tasks: {
    'To Do': [],
    'In Progress': [],
    'Done': []
  },
  isLoading: false,
  error: null,

  fetchTasks: async () => {
    try {
      set({ isLoading: true, error: null });
      const response = await api.get(API_URL);
      set({ tasks: response.data, isLoading: false });
    } catch (error) {
      set({ error: 'Failed to fetch tasks', isLoading: false });
      toast.error('Failed to fetch tasks');
    }
  },

  createTask: async (taskData) => {
    try {
      set({ isLoading: true, error: null });
      const response = await api.post(API_URL, taskData);
      const newTask = response.data;
      
      set((state) => ({
        tasks: {
          ...state.tasks,
          [newTask.status]: [...state.tasks[newTask.status], newTask]
        },
        isLoading: false
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
      const response = await api.put(`${API_URL}/${id}`, taskData);
      const updatedTask = response.data;
      
      set((state) => {
        const newTasks = { ...state.tasks };
        
        // Remove task from old status if status changed
        if (taskData.status && taskData.status !== updatedTask.status) {
          Object.keys(newTasks).forEach((status) => {
            newTasks[status as keyof TaskGroups] = newTasks[status as keyof TaskGroups].filter(
              (task) => task.id !== id
            );
          });
        }
        
        // Add/update task in new status
        newTasks[updatedTask.status] = newTasks[updatedTask.status].map((task) =>
          task.id === id ? updatedTask : task
        );
        
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
      await api.delete(`${API_URL}/${id}`);
      
      set((state) => {
        const newTasks = { ...state.tasks };
        Object.keys(newTasks).forEach((status) => {
          newTasks[status as keyof TaskGroups] = newTasks[status as keyof TaskGroups].filter(
            (task) => task.id !== id
          );
        });
        return { tasks: newTasks, isLoading: false };
      });
      
      toast.success('Task deleted successfully');
    } catch (error) {
      set({ error: 'Failed to delete task', isLoading: false });
      toast.error('Failed to delete task');
    }
  },

  moveTask: async (taskId, sourceStatus, destinationStatus, newIndex) => {
    try {
      set({ isLoading: true, error: null });
      
      // Optimistically update UI
      set((state) => {
        const newTasks = { ...state.tasks };
        const task = newTasks[sourceStatus].find((t) => t.id === taskId);
        
        if (!task) return state;
        
        // Remove from source
        newTasks[sourceStatus] = newTasks[sourceStatus].filter((t) => t.id !== taskId);
        
        // Add to destination
        const updatedTask = { ...task, status: destinationStatus };
        newTasks[destinationStatus].splice(newIndex, 0, updatedTask);
        
        return { tasks: newTasks };
      });
      
      // Update backend
      await api.put(`${API_URL}/${taskId}`, {
        status: destinationStatus,
        index: newIndex
      });
      
      set({ isLoading: false });
    } catch (error) {
      set({ error: 'Failed to move task', isLoading: false });
      toast.error('Failed to move task');
      // Revert optimistic update
      get().fetchTasks();
    }
  }
}));

// Export API functions for direct use if needed
export const taskApi = {
  getAll: () => api.get(API_URL),
  getById: (id: string) => api.get(`${API_URL}/${id}`),
  create: (task: Omit<Task, 'id'>) => api.post(API_URL, task),
  update: (id: string, task: Partial<Task>) => api.put(`${API_URL}/${id}`, task),
  delete: (id: string) => api.delete(`${API_URL}/${id}`),
  move: (taskId: string, sourceStatus: keyof TaskGroups, destinationStatus: keyof TaskGroups, newIndex: number) =>
    api.put(`${API_URL}/${taskId}/move`, { sourceStatus, destinationStatus, newIndex })
}; 