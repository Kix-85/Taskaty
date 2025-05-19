import api from '@/lib/axios';
import { toast } from 'sonner';
import { taskService } from './taskService';

export interface Project {
  _id: string;
  name: string;
  description: string;
  status: string;
  progress: number;
  dueDate?: string;
  members: string[];
  tasks: string[];
  createdAt: string;
  updatedAt: string;
}

export const projectService = {
  // Get all projects
  getAllProjects: async () => {
    try {
      const response = await api.get('/project/me');
      return response.data;
    } catch (error: any) {
      console.error('Error fetching projects:', error);
      toast.error(error.response?.data?.message || 'Failed to fetch projects');
      throw error;
    }
  },

  // Get project by ID
  getProjectById: async (id: string) => {
    try {
      const response = await api.get(`/project/${id}`);
      return response.data;
    } catch (error: any) {
      console.error('Error fetching project:', error);
      toast.error(error.response?.data?.message || 'Failed to fetch project details');
      throw error;
    }
  },

  // Create new project
  createProject: async (projectData: Omit<Project, '_id' | 'createdAt' | 'updatedAt' | 'tasks' | 'progress'>) => {
    try {
      const response = await api.post('/project/me', projectData);
      toast.success('Project created successfully');
      return response.data;
    } catch (error: any) {
      console.error('Error creating project:', error);
      toast.error(error.response?.data?.message || 'Failed to create project');
      throw error;
    }
  },

  // Update project
  updateProject: async (id: string, projectData: Partial<Project>) => {
    try {
      const response = await api.put(`/project/${id}`, projectData);
      toast.success('Project updated successfully');
      return response.data;
    } catch (error: any) {
      console.error('Error updating project:', error);
      toast.error(error.response?.data?.message || 'Failed to update project');
      throw error;
    }
  },

  // Delete project
  deleteProject: async (id: string) => {
    try {
      await api.delete(`/project/${id}`);
      toast.success('Project deleted successfully');
    } catch (error: any) {
      console.error('Error deleting project:', error);
      toast.error(error.response?.data?.message || 'Failed to delete project');
      throw error;
    }
  },

  // Add member to project
  addMember: async (projectId: string, userId: string) => {
    const response = await api.post(`/project/${projectId}/members`, { userId });
    return response.data;
  },

  // Remove member from project
  removeMember: async (projectId: string, userId: string) => {
    const response = await api.delete(`/project/${projectId}/members/${userId}`);
    return response.data;
  },

  // Calculate and update project progress
  updateProjectProgress: async (projectId: string) => {
    try {
      const tasks = await taskService.getTasksByProject(projectId);
      if (!tasks.length) {
        await projectService.updateProject(projectId, { progress: 0 });
        return;
      }

      const totalTasks = tasks.length;
      const completedTasks = tasks.filter(task => task.status === 'done').length;
      const progress = Math.round((completedTasks / totalTasks) * 100);

      await projectService.updateProject(projectId, { progress });
      return progress;
    } catch (error: any) {
      console.error('Error updating project progress:', error);
      toast.error('Failed to update project progress');
      throw error;
    }
  }
}; 