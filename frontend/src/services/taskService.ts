import api from '@/lib/axios';

export interface Task {
  id: string;
  title: string;
  description: string;
  status: 'todo' | 'in-progress' | 'completed';
  priority: 'low' | 'medium' | 'high';
  dueDate: string;
  assignedTo: string;
  projectId?: string;
  createdAt: string;
  updatedAt: string;
}

export const taskService = {
  // Get all tasks
  getAllTasks: async () => {
    const response = await api.get('/task');
    return response.data;
  },

  // Get task by ID
  getTaskById: async (id: string) => {
    const response = await api.get(`/task/${id}`);
    return response.data;
  },

  // Create new task
  createTask: async (taskData: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => {
    const response = await api.post('/task', taskData);
    return response.data;
  },

  // Update task
  updateTask: async (id: string, taskData: Partial<Task>) => {
    const response = await api.put(`/task/${id}`, taskData);
    return response.data;
  },

  // Delete task
  deleteTask: async (id: string) => {
    const response = await api.delete(`/task/${id}`);
    return response.data;
  },

  // Get tasks by project
  getTasksByProject: async (projectId: string) => {
    const response = await api.get(`/task/project/${projectId}`);
    return response.data;
  },

  // Get tasks by user
  getTasksByUser: async (userId: string) => {
    const response = await api.get(`/task/user/${userId}`);
    return response.data;
  }
}; 