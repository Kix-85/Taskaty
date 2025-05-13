import api from '@/lib/axios';

export interface Project {
  id: string;
  name: string;
  description: string;
  status: 'active' | 'archived' | 'completed';
  members: string[];
  createdAt: string;
  updatedAt: string;
}

export const projectService = {
  // Get all projects
  getAllProjects: async () => {
    const response = await api.get('/project');
    return response.data;
  },

  // Get project by ID
  getProjectById: async (id: string) => {
    const response = await api.get(`/project/${id}`);
    return response.data;
  },

  // Create new project
  createProject: async (projectData: Omit<Project, 'id' | 'createdAt' | 'updatedAt'>) => {
    const response = await api.post('/project', projectData);
    return response.data;
  },

  // Update project
  updateProject: async (id: string, projectData: Partial<Project>) => {
    const response = await api.put(`/project/${id}`, projectData);
    return response.data;
  },

  // Delete project
  deleteProject: async (id: string) => {
    const response = await api.delete(`/project/${id}`);
    return response.data;
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
  }
}; 