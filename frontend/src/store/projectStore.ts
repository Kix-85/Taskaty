import { create } from 'zustand';
import { projectService, Project } from '@/services/projectService';

interface ProjectStore {
  projects: Project[];
  loading: boolean;
  error: string | null;
  fetchProjects: () => Promise<void>;
  createProject: (projectData: Omit<Project, '_id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updateProject: (id: string, projectData: Partial<Project>) => Promise<void>;
  deleteProject: (id: string) => Promise<void>;
}

export const useProjectStore = create<ProjectStore>((set) => ({
  projects: [],
  loading: false,
  error: null,

  fetchProjects: async () => {
    set({ loading: true, error: null });
    try {
      const response = await projectService.getAllProjects();
      set({ projects: response.data, loading: false });
    } catch (error) {
      set({ error: 'Failed to fetch projects', loading: false });
    }
  },

  createProject: async (projectData) => {
    set({ loading: true, error: null });
    try {
      await projectService.createProject(projectData);
      const response = await projectService.getAllProjects();
      set({ projects: response.data, loading: false });
    } catch (error) {
      set({ error: 'Failed to create project', loading: false });
    }
  },

  updateProject: async (id, projectData) => {
    set({ loading: true, error: null });
    try {
      await projectService.updateProject(id, projectData);
      const response = await projectService.getAllProjects();
      set({ projects: response.data, loading: false });
    } catch (error) {
      set({ error: 'Failed to update project', loading: false });
    }
  },

  deleteProject: async (id) => {
    set({ loading: true, error: null });
    try {
      await projectService.deleteProject(id);
      const response = await projectService.getAllProjects();
      set({ projects: response.data, loading: false });
    } catch (error) {
      set({ error: 'Failed to delete project', loading: false });
    }
  },
})); 