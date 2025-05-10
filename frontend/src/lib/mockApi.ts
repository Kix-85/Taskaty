import { mockResponses, mockTasks, mockProjects } from './mockData';

interface RequestData {
  [key: string]: unknown;
}

interface ApiResponse<T = unknown> {
  data: T;
}

const USE_MOCK = true; // Toggle this to switch between mock and real API

export const mockApi = {
  post: async (url: string, data: RequestData): Promise<ApiResponse> => {
    if (!USE_MOCK) return null;

    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 500));

    // Handle different endpoints
    if (url.includes('/auth/login')) {
      return { data: mockResponses.login };
    }
    if (url.includes('/auth/register')) {
      return { data: mockResponses.register };
    }
    if (url.includes('/task')) {
      const newTask = {
        ...data,
        id: String(mockTasks.length + 1),
        createdBy: mockResponses.login.user,
        assignees: [mockResponses.login.user],
        comments: [],
        progress: 0,
        status: 'To Do'
      };
      return { data: { success: true, task: newTask } };
    }
    if (url.includes('/project')) {
      const newProject = {
        ...data,
        id: String(mockProjects.length + 1),
        leader: mockResponses.login.user,
        teamMembers: [mockResponses.login.user],
        tasks: [],
        lastViews: []
      };
      return { data: { success: true, project: newProject } };
    }
    return { data: { success: true } };
  },

  get: async (url: string): Promise<ApiResponse> => {
    if (!USE_MOCK) return null;

    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 500));

    // Handle different endpoints
    if (url.includes('/auth/verify-token')) {
      return { data: mockResponses.verifyToken };
    }
    if (url.includes('/task/me')) {
      return { data: mockResponses.getTasks };
    }
    if (url.includes('/project/me')) {
      return { data: mockResponses.getProjects };
    }
    if (url.includes('/task/')) {
      const taskId = url.split('/').pop();
      const task = mockTasks.find(t => t.id === taskId);
      return { data: { success: true, task } };
    }
    if (url.includes('/project/')) {
      const projectId = url.split('/').pop();
      const project = mockProjects.find(p => p.id === projectId);
      return { data: { success: true, project } };
    }
    return { data: { success: true } };
  },

  put: async (url: string, data: RequestData): Promise<ApiResponse> => {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 500));

    if (url.includes('/task/')) {
      const taskId = url.split('/').pop();
      const task = mockTasks.find(t => t.id === taskId);
      return { data: { success: true, task: { ...task, ...data } } };
    }
    if (url.includes('/project/')) {
      const projectId = url.split('/').pop();
      const project = mockProjects.find(p => p.id === projectId);
      return { data: { success: true, project: { ...project, ...data } } };
    }
    return { data: { success: true } };
  },

  delete: async (url: string): Promise<ApiResponse> => {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 500));

    if (url.includes('/task/') || url.includes('/project/')) {
      return { data: { success: true, message: 'Deleted successfully' } };
    }
    return { data: { success: true } };
  }
}; 