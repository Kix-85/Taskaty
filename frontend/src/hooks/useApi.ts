// import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
// import { taskService, Task } from '@/services/taskService';
// import { projectService, Project } from '@/services/projectService';
// import { messageService, Message } from '@/services/messageService';
// import { userService, User } from '@/services/userService';

// // Task hooks
// export const useTasks = () => {
//   return useQuery({
//     queryKey: ['tasks'],
//     queryFn: taskService.getAllTasks
//   });
// };

// export const useTask = (id: string) => {
//   return useQuery({
//     queryKey: ['task', id],
//     queryFn: () => taskService.getTaskById(id)
//   });
// };

// export const useCreateTask = () => {
//   const queryClient = useQueryClient();
//   return useMutation({
//     mutationFn: taskService.createTask,
//     onSuccess: () => {
//       queryClient.invalidateQueries({ queryKey: ['tasks'] });
//     }
//   });
// };

// // Project hooks
// export const useProjects = () => {
//   return useQuery({
//     queryKey: ['projects'],
//     queryFn: projectService.getAllProjects
//   });
// };

// export const useProject = (id: string) => {
//   return useQuery({
//     queryKey: ['project', id],
//     queryFn: () => projectService.getProjectById(id)
//   });
// };

// export const useCreateProject = () => {
//   const queryClient = useQueryClient();
//   return useMutation({
//     mutationFn: projectService.createProject,
//     onSuccess: () => {
//       queryClient.invalidateQueries({ queryKey: ['projects'] });
//     }
//   });
// };

// // Message hooks
// export const useMessages = () => {
//   return useQuery({
//     queryKey: ['messages'],
//     queryFn: messageService.getAllMessages
//   });
// };

// export const useMessagesBetweenUsers = (userId1: string, userId2: string) => {
//   return useQuery({
//     queryKey: ['messages', userId1, userId2],
//     queryFn: () => messageService.getMessagesBetweenUsers(userId1, userId2)
//   });
// };

// export const useSendMessage = () => {
//   const queryClient = useQueryClient();
//   return useMutation({
//     mutationFn: messageService.sendMessage,
//     onSuccess: () => {
//       queryClient.invalidateQueries({ queryKey: ['messages'] });
//     }
//   });
// };

// // User hooks
// export const useCurrentUser = () => {
//   return useQuery({
//     queryKey: ['user', 'me'],
//     queryFn: userService.getCurrentUser
//   });
// };

// export const useUser = (id: string) => {
//   return useQuery({
//     queryKey: ['user', id],
//     queryFn: () => userService.getUserById(id)
//   });
// };

// export const useUpdateProfile = () => {
//   const queryClient = useQueryClient();
//   return useMutation({
//     mutationFn: userService.updateProfile,
//     onSuccess: () => {
//       queryClient.invalidateQueries({ queryKey: ['user'] });
//     }
//   });
// }; 