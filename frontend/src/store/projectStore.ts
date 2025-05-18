import { create } from 'zustand';
import { projectService, Project } from '@/services/projectService';

interface ProjectStore {
  projects: Project[];
  loading: boolean;
  error: string | null;
  fetchProjects: () => Promise<void>;
  createProject: (projectData: Omit<Project, '_id' | 'createdAt' | 'updatedAt' | 'tasks' | 'progress'>) => Promise<void>;
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
      const projects = await projectService.getAllProjects();
      set({ projects, loading: false });
    } catch (error) {
      set({ error: 'Failed to fetch projects', loading: false, projects: [] });
    }
  },

  createProject: async (projectData) => {
    set({ loading: true, error: null });
    try {
      await projectService.createProject(projectData);
      const projects = await projectService.getAllProjects();
      set({ projects, loading: false });
    } catch (error) {
      set({ error: 'Failed to create project', loading: false });
    }
  },

  updateProject: async (id, projectData) => {
    set({ loading: true, error: null });
    try {
      await projectService.updateProject(id, projectData);
      const projects = await projectService.getAllProjects();
      set({ projects, loading: false });
    } catch (error) {
      set({ error: 'Failed to update project', loading: false });
    }
  },

  deleteProject: async (id) => {
    set({ loading: true, error: null });
    try {
      await projectService.deleteProject(id);
      const projects = await projectService.getAllProjects();
      set({ projects, loading: false });
    } catch (error) {
      set({ error: 'Failed to delete project', loading: false });
    }
  },
})); 