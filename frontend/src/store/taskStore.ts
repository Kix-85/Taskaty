import { create } from 'zustand';
import { toast } from 'sonner';
import { taskService } from '@/services/taskService';
import type { Task, TaskGroups, SubTask } from '@/types/task';

interface TaskStore {
  tasks: TaskGroups;
  isLoading: boolean;
  error: string | null;
  expandedTaskId: string | null;
  setExpandedTaskId: (taskId: string | null) => void;
  fetchTasks: () => Promise<void>;
  createTask: (task: Omit<Task, '_id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updateTask: (id: string, task: Partial<Task>) => Promise<void>;
  deleteTask: (id: string) => Promise<void>;
  moveTask: (taskId: string, sourceStatus: keyof TaskGroups, destinationStatus: keyof TaskGroups, index: number) => Promise<void>;
  createSubTask: (taskId: string, subtask: Partial<SubTask>) => Promise<void>;
  updateSubTask: (taskId: string, subtaskId: string, updates: Partial<SubTask>) => Promise<void>;
  deleteSubTask: (taskId: string, subtaskId: string) => Promise<void>;
  filterByProject: (projectId: string) => Promise<void>;
}

const groupTasksByStatus = (tasks: Task[]): TaskGroups => {
  // Ensure tasks is an array
  if (!Array.isArray(tasks)) {
    console.error('Tasks is not an array:', tasks);
    return {
      'To Do': [],
      'In Progress': [],
      'Done': []
    };
  }

  // Map backend status to UI status
  const statusMap = {
    'todo': 'To Do',
    'in progress': 'In Progress',
    'done': 'Done'
  } as const;

  const grouped = {
    'To Do': tasks.filter(task => statusMap[task.status] === 'To Do'),
    'In Progress': tasks.filter(task => statusMap[task.status] === 'In Progress'),
    'Done': tasks.filter(task => statusMap[task.status] === 'Done')
  };

  return grouped;
};

// Helper function to update a task in all groups
const updateTaskInGroups = (tasks: TaskGroups, taskId: string, updater: (task: Task) => Task): TaskGroups => {
  return {
    'To Do': tasks['To Do'].map(task => task._id === taskId ? updater(task) : task),
    'In Progress': tasks['In Progress'].map(task => task._id === taskId ? updater(task) : task),
    'Done': tasks['Done'].map(task => task._id === taskId ? updater(task) : task)
  };
};

export const useTaskStore = create<TaskStore>((set, get) => ({
  tasks: {
    'To Do': [],
    'In Progress': [],
    'Done': []
  },
  isLoading: false,
  error: null,
  expandedTaskId: null,

  setExpandedTaskId: (taskId) => set({ expandedTaskId: taskId }),

  fetchTasks: async () => {
    set({ isLoading: true, error: null });
    try {
      const tasks = await taskService.getAllTasks();
      const groupedTasks = groupTasksByStatus(tasks);
      set({ tasks: groupedTasks, isLoading: false });
    } catch (error) {
      set({ error: 'Failed to fetch tasks', isLoading: false });
      toast.error('Failed to fetch tasks');
    }
  },

  filterByProject: async (projectId) => {
    set({ isLoading: true, error: null });
    try {
      const tasks = await taskService.getTasksByProject(projectId);
      const groupedTasks = groupTasksByStatus(tasks);
      set({ tasks: groupedTasks, isLoading: false });
    } catch (error) {
      set({ error: 'Failed to fetch project tasks', isLoading: false });
      toast.error('Failed to fetch project tasks');
    }
  },

  createTask: async (taskData) => {
    try {
      set({ isLoading: true, error: null });
      const newTask = await taskService.createTask(taskData);

      set((state) => ({
        tasks: {
          ...state.tasks,
          'To Do': [...state.tasks['To Do'], newTask]
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
      const updatedTask = await taskService.updateTask(id, taskData);

      set((state) => {
        const newTasks = {
          'To Do': state.tasks['To Do'].map(task => task._id === id ? updatedTask : task),
          'In Progress': state.tasks['In Progress'].map(task => task._id === id ? updatedTask : task),
          'Done': state.tasks['Done'].map(task => task._id === id ? updatedTask : task)
        };
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
      await taskService.deleteTask(id);

      set((state) => {
        const newTasks = {
          'To Do': state.tasks['To Do'].filter(task => task._id !== id),
          'In Progress': state.tasks['In Progress'].filter(task => task._id !== id),
          'Done': state.tasks['Done'].filter(task => task._id !== id)
        };
        return { tasks: newTasks, isLoading: false };
      });

      toast.success('Task deleted successfully');
    } catch (error) {
      set({ error: 'Failed to delete task', isLoading: false });
      toast.error('Failed to delete task');
    }
  },

  moveTask: async (taskId, sourceStatus, destinationStatus, index) => {
    const statusMap = {
      'To Do': 'todo',
      'In Progress': 'in progress',
      'Done': 'done'
    } as const;

    // Store the current state for potential rollback
    const previousState = get().tasks;

    try {
      // Get task before updating
      const taskToMove = previousState[sourceStatus].find(t => t._id === taskId);
      if (!taskToMove) {
        throw new Error('Task not found');
      }

      // Optimistically update UI
      set(state => {
        const newTasks = { ...state.tasks };
        
        // Remove from source
        newTasks[sourceStatus] = newTasks[sourceStatus].filter(t => t._id !== taskId);
        
        // Add to destination
        const updatedTask = { 
          ...taskToMove, 
          status: statusMap[destinationStatus as keyof typeof statusMap]
        };
        
        newTasks[destinationStatus] = [
          ...newTasks[destinationStatus].slice(0, index),
          updatedTask,
          ...newTasks[destinationStatus].slice(index)
        ];

        return { tasks: newTasks };
      });

      // Make API call
      await taskService.updateTask(taskId, { 
        status: statusMap[destinationStatus as keyof typeof statusMap]
      });

      toast.success('Task moved successfully');
    } catch (error: any) {
      // Revert to previous state on error
      set({ tasks: previousState });
      console.error('Error moving task:', error);
      toast.error(error.message || 'Failed to move task');
    }
  },

  createSubTask: async (taskId, subtask) => {
    try {
      const updatedTask = await taskService.createSubTask(taskId, subtask);
      
      // Update the task in the store
      set(state => ({
        tasks: updateTaskInGroups(state.tasks, taskId, () => updatedTask)
      }));

      toast.success('Subtask added successfully');
    } catch (error: any) {
      console.error('Error adding subtask:', error);
      toast.error(error.message || 'Failed to add subtask');
    }
  },

  updateSubTask: async (taskId, subtaskId, updates) => {
    try {
      const updatedTask = await taskService.updateSubTask(taskId, subtaskId, updates);
      
      // Update the task in the store
      set(state => ({
        tasks: updateTaskInGroups(state.tasks, taskId, () => updatedTask)
      }));

      toast.success('Subtask updated successfully');
    } catch (error: any) {
      console.error('Error updating subtask:', error);
      toast.error(error.message || 'Failed to update subtask');
    }
  },

  deleteSubTask: async (taskId, subtaskId) => {
    try {
      const updatedTask = await taskService.deleteSubTask(taskId, subtaskId);
      
      // Update the task in the store
      set(state => ({
        tasks: updateTaskInGroups(state.tasks, taskId, () => updatedTask)
      }));

      toast.success('Subtask deleted successfully');
    } catch (error: any) {
      console.error('Error deleting subtask:', error);
      toast.error(error.message || 'Failed to delete subtask');
    }
  }
}));
