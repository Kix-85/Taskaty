import api from '@/lib/axios';
import { Task } from '@/types/task';
import { toast } from 'sonner';

export interface SubTask {
  title: string;
  completed: boolean;
}

export interface CreateTaskDTO {
  name: string;
  description?: string;
  project?: string;
  status: 'todo' | 'in progress' | 'done';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  dueDate?: Date;
  assignedTo?: string[];
  tags?: string[];
  estimatedTime?: number;
  progress?: number;
  subtasks?: SubTask[];
  isRecurring?: boolean;
  recurrencePattern?: 'daily' | 'weekly' | 'monthly' | 'none';
}

export const taskService = {
  // Get all tasks
  getAllTasks: async () => {
    try {
      const response = await api.get('/task/me');
      if (!response.data) {
        throw new Error('No data received from server');
      }
      return response.data;
    } catch (error: any) {
      console.error('Error fetching tasks:', error);
      toast.error(error.response?.data?.message || 'Failed to fetch tasks');
      throw error;
    }
  },

  // Get task by ID
  getTaskById: async (id: string) => {
    try {
      const response = await api.get(`/task/${id}`);
      if (!response.data) {
        throw new Error('No data received from server');
      }
      return response.data;
    } catch (error: any) {
      console.error('Error fetching task:', error);
      toast.error(error.response?.data?.message || 'Failed to fetch task details');
      throw error;
    }
  },

  // Create new task
  createTask: async (taskData: CreateTaskDTO) => {
    try {
      if (!taskData.name) {
        throw new Error('Task name is required');
      }

      // Calculate initial progress based on subtasks
      let progress = 0;
      if (taskData.subtasks && taskData.subtasks.length > 0) {
        const completedSubtasks = taskData.subtasks.filter(st => st.completed).length;
        progress = Math.round((completedSubtasks / taskData.subtasks.length) * 100);
      } else {
        progress = taskData.status === 'done' ? 100 : 0;
      }

      const response = await api.post('/task', {
        ...taskData,
        dueDate: taskData.dueDate ? new Date(taskData.dueDate).toISOString() : undefined,
        status: taskData.status || 'todo',
        priority: taskData.priority || 'medium',
        progress
      });

      if (!response.data) {
        throw new Error('No data received from server');
      }
      toast.success('Task created successfully');
      return response.data;
    } catch (error: any) {
      console.error('Error creating task:', error);
      const errorMessage = error.response?.data?.message || 'Failed to create task';
      toast.error(errorMessage);
      throw error;
    }
  },

  // Update task
  updateTask: async (id: string, taskData: Partial<CreateTaskDTO>) => {
    try {
      // Calculate progress if subtasks are present
      let progress = taskData.progress;
      if (taskData.subtasks) {
        const completedSubtasks = taskData.subtasks.filter(st => st.completed).length;
        progress = Math.round((completedSubtasks / taskData.subtasks.length) * 100);
      } else if (taskData.status === 'done') {
        progress = 100;
      } else if (taskData.status === 'todo') {
        progress = 0;
      }

      const response = await api.put(`/task/${id}`, {
        ...taskData,
        progress,
        dueDate: taskData.dueDate ? new Date(taskData.dueDate).toISOString() : undefined
      });
      
      if (!response.data) {
        throw new Error('No data received from server');
      }
      toast.success('Task updated successfully');
      return response.data;
    } catch (error: any) {
      console.error('Error updating task:', error);
      toast.error(error.response?.data?.message || 'Failed to update task');
      throw error;
    }
  },

  // Delete task
  deleteTask: async (id: string) => {
    const response = await api.delete(`/task/${id}`);
    console.log('Response from deleteTask from taskService: ', response)
    return response.data;
  },

  // Get tasks by project
  getTasksByProject: async (projectId: string) => {
    try {
      const response = await api.get(`/task/project/${projectId}`);
      if (!response.data) {
        throw new Error('No data received from server');
      }
      return response.data;
    } catch (error: any) {
      console.error('Error fetching project tasks:', error);
      toast.error(error.response?.data?.message || 'Failed to fetch project tasks');
      throw error;
    }
  },

  // Get tasks by user
  getTasksByUser: async (userId: string) => {
    try {
      const response = await api.get(`/task/user/${userId}`);
      if (!response.data) {
        throw new Error('No data received from server');
      }
      return response.data;
    } catch (error: any) {
      console.error('Error fetching user tasks:', error);
      toast.error(error.response?.data?.message || 'Failed to fetch user tasks');
      throw error;
    }
  },

  // Add subtask
  createSubTask: async (taskId: string, subtask: SubTask) => {
    try {
      const response = await api.post(`/task/${taskId}/subtask`, subtask);
      if (!response.data) {
        throw new Error('No data received from server');
      }
      toast.success('Subtask added successfully');
      return response.data;
    } catch (error: any) {
      console.error('Error adding subtask:', error);
      toast.error(error.response?.data?.message || 'Failed to add subtask');
      throw error;
    }
  },

  // Update subtask
  updateSubTask: async (taskId: string, subTaskId: string, updates: Partial<SubTask>) => {
    try {
      const response = await api.put(`/task/${taskId}/subtask/${subTaskId}`, updates);
      if (!response.data) {
        throw new Error('No data received from server');
      }
      toast.success('Subtask updated successfully');
      return response.data;
    } catch (error: any) {
      console.error('Error updating subtask:', error);
      toast.error(error.response?.data?.message || 'Failed to update subtask');
      throw error;
    }
  },

  // Delete subtask
  deleteSubTask: async (taskId: string, subTaskId: string) => {
    try {
      const response = await api.delete(`/task/${taskId}/subtask/${subTaskId}`);
      if (!response.data) {
        throw new Error('No data received from server');
      }
      toast.success('Subtask deleted successfully');
      return response.data;
    } catch (error: any) {
      console.error('Error deleting subtask:', error);
      toast.error(error.response?.data?.message || 'Failed to delete subtask');
      throw error;
    }
  }
}; 