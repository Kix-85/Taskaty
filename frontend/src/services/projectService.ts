import api from '@/lib/axios';

export interface Project {
  _id: string;
  name: string;
  description: string;
  status: string;
  progress?: number;
  dueDate?: string;
  members: string[];
  createdAt: string;
  updatedAt: string;  
}

export const projectService = {
  // Get all projects
  getAllProjects: async () => {
    const response = await api.get('/project/me');
    console.log('Response from getAllProjects: ', response);
    return response;
  },

  // Get project by ID
  getProjectById: async (id: string) => {
    const response = await api.get(`/project/${id}`);
    return response.data;
  },

  // Create new project
  createProject: async (projectData: Omit<Project, '_id' | 'createdAt' | 'updatedAt'>) => {
    const response = await api.post('/project/me', projectData);
    return response;
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