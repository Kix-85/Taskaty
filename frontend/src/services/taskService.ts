import api from '@/lib/axios';
import { Task } from '@/types/task';

export const taskService = {
  // Get all tasks
  getAllTasks: async () => {
    const response = await api.get('/task/me');
    console.log('Response from getAllTasks from taskService: ', response)
    return response.data;
  },

  // Get task by ID
  getTaskById: async (id: string) => {
    const response = await api.get(`/task/${id}`);
    console.log('Response from getTaskById from taskService: ', response)
    return response.data;
  },

  // Create new task
  createTask: async (taskData: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => {
    const response = await api.post('/task', taskData);
    console.log('Response from createTask from taskService: ', response)
    return response.data;
  },

  // Update task
  updateTask: async (id: string, taskData: Partial<Task>) => {
    const response = await api.put(`/task/${id}`, taskData);
    console.log('Response from updateTask from taskService: ', response)
    return response.data;
  },

  // Delete task
  deleteTask: async (id: string) => {
    const response = await api.delete(`/task/${id}`);
    console.log('Response from deleteTask from taskService: ', response)
    return response.data;
  },

  // Get tasks by project
  getTasksByProject: async (projectId: string) => {
    const response = await api.get(`/task/project/${projectId}`);
    console.log('Response from getTasksByProject from taskService: ', response)
    return response.data;
  },

  // Get tasks by user
  getTasksByUser: async (userId: string) => {
    const response = await api.get(`/task/user/${userId}`);
    console.log('Response from getTasksByUser from taskService: ', response)
    return response.data;
  }
}; 