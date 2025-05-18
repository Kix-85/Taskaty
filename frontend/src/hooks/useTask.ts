import { useState, useCallback, useEffect } from 'react';
import { taskService, CreateTaskDTO } from '@/services/taskService';
import { Task } from '@/types/task';
import { toast } from 'sonner';

export const useTask = (autoFetch: boolean = true) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchTasks = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await taskService.getAllTasks();
      setTasks(data);
      return data;
    } catch (err) {
      setError('Failed to fetch tasks');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Auto fetch tasks on mount if autoFetch is true
  useEffect(() => {
    if (autoFetch) {
      fetchTasks();
    }
  }, [autoFetch, fetchTasks]);

  const createTask = useCallback(async (taskData: CreateTaskDTO) => {
    setLoading(true);
    setError(null);
    try {
      const newTask = await taskService.createTask(taskData);
      setTasks(prev => [...prev, newTask]);
      // Refresh tasks to ensure we have the latest data
      await fetchTasks();
      return newTask;
    } catch (err) {
      setError('Failed to create task');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [fetchTasks]);

  const updateTask = useCallback(async (taskId: string, taskData: Partial<CreateTaskDTO>) => {
    setLoading(true);
    setError(null);
    try {
      const updatedTask = await taskService.updateTask(taskId, taskData);
      setTasks(prev => prev.map(task => 
        task._id === taskId ? updatedTask : task
      ));
      // Refresh tasks to ensure we have the latest data
      await fetchTasks();
      return updatedTask;
    } catch (err) {
      setError('Failed to update task');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [fetchTasks]);

  const getTasksByProject = useCallback(async (projectId: string) => {
    setLoading(true);
    setError(null);
    try {
      const data = await taskService.getTasksByProject(projectId);
      setTasks(data);
      return data;
    } catch (err) {
      setError('Failed to fetch project tasks');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const getTasksByUser = useCallback(async (userId: string) => {
    setLoading(true);
    setError(null);
    try {
      const data = await taskService.getTasksByUser(userId);
      setTasks(data);
      return data;
    } catch (err) {
      setError('Failed to fetch user tasks');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Function to refresh tasks manually
  const refreshTasks = useCallback(async () => {
    return fetchTasks();
  }, [fetchTasks]);

  return {
    tasks,
    loading,
    error,
    fetchTasks,
    createTask,
    updateTask,
    getTasksByProject,
    getTasksByUser,
    refreshTasks
  };
}; 