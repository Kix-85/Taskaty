import { create } from 'zustand';
import { toast } from 'sonner';
import { taskService } from '@/services/taskService';
import type { Task, TaskGroups } from '@/types/task';

interface TaskStore {
  tasks: TaskGroups;
  isLoading: boolean;
  error: string | null;
  fetchTasks: () => Promise<void>;
  createTask: (task: Omit<Task, '_id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updateTask: (id: string, task: Partial<Task>) => Promise<void>;
  deleteTask: (id: string) => Promise<void>;
  moveTask: (taskId: string, sourceStatus: keyof TaskGroups, destinationStatus: keyof TaskGroups, index: number) => Promise<void>;
}

const groupTasksByStatus = (tasks: Task[]): TaskGroups => {
  console.log('Grouping tasks:', tasks);
  
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
  };

  const grouped = {
    'To Do': tasks.filter(task => task.status === 'todo'),
    'In Progress': tasks.filter(task => task.status === 'in progress'),
    'Done': tasks.filter(task => task.status === 'done')
  };

  console.log('Grouped tasks:', grouped);
  return grouped;
};

export const useTaskStore = create<TaskStore>((set, get) => ({
  tasks: {
    'To Do': [],
    'In Progress': [],
    'Done': []
  },
  isLoading: false,
  error: null,

  fetchTasks: async () => {
    set({ isLoading: true, error: null });
    try {
      const tasks = await taskService.getAllTasks();
      console.log("Response from fetchTasks from taskService: ", tasks);
      const groupedTasks = groupTasksByStatus(tasks);
      set({ tasks: groupedTasks, isLoading: false });
    } catch (error) {
      set({ error: 'Failed to fetch tasks', isLoading: false });
      toast.error('Failed to fetch tasks');
    }
  },

  createTask: async (taskData) => {
    try {
      set({ isLoading: true, error: null });
      const newTask = await taskService.createTask(taskData);
      console.log("Response from createTask from taskService: ", newTask);

      set((state) => ({
        tasks: {
          ...state.tasks,
          'To Do': [...state.tasks['To Do'], newTask] // new tasks go to 'To Do'
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
      console.log("Response from updateTask from taskService: ", updatedTask);
      set((state) => {
        const newTasks: TaskGroups = {
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
      console.log("Response from deleteTask from taskService: ", id);

      set((state) => {
        const newTasks: TaskGroups = {
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
    try {
      // Map UI status to backend status
      const statusMap = {
        'To Do': 'todo',
        'In Progress': 'in progress',
        'Done': 'done'
      };

      set(state => {
        const newTasks = { ...state.tasks };
        const task = newTasks[sourceStatus].find(t => t._id === taskId);
        if (!task) return state;

        // Remove from source
        newTasks[sourceStatus] = newTasks[sourceStatus].filter(t => t._id !== taskId);

        // Add to destination with updated status
        const updatedTask = { 
          ...task, 
          status: statusMap[destinationStatus]
        };
        newTasks[destinationStatus].splice(index, 0, updatedTask);

        return { tasks: newTasks };
      });

      // Update the task in the backend with the correct status
      await taskService.updateTask(taskId, { 
        status: statusMap[destinationStatus]
      });
    } catch (error) {
      console.error('Error moving task:', error);
      toast.error('Failed to move task');
      // Revert the state if the backend update fails
      await get().fetchTasks();
    }
  }
}));
