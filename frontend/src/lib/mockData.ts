import { Task } from '@/types/task';

export const mockUser = {
  id: "1",
  name: "John Doe",
  email: "john@example.com",
  isAccountVerified: true,
  birthDate: "1990-01-01",
  avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=John'
};

export const mockTasks: Task[] = [
  {
    id: "1",
    title: "Design Homepage",
    content: "Create a modern and responsive homepage design",
    description: "Create a modern and responsive homepage design",
    status: "In Progress",
    priority: "high",
    progress: 75,
    startDate: "2024-03-20",
    dueDate: "2024-03-25",
    assignees: [{ name: "John Doe", initial: "JD" }],
    subscribes: 2
  },
  {
    id: "2",
    title: "Implement Authentication",
    content: "Set up user authentication system",
    description: "Set up user authentication system",
    status: "To Do",
    priority: "high",
    progress: 0,
    startDate: "2024-03-22",
    dueDate: "2024-03-28",
    assignees: [{ name: "John Doe", initial: "JD" }],
    subscribes: 1
  },
  {
    id: "3",
    title: "Database Schema",
    content: "Design and implement database schema",
    description: "Design and implement database schema",
    status: "Done",
    priority: "medium",
    progress: 100,
    startDate: "2024-03-10",
    dueDate: "2024-03-15",
    assignees: [{ name: "John Doe", initial: "JD" }],
    subscribes: 3
  },
  {
    id: "4",
    title: "API Documentation",
    content: "Write comprehensive API documentation",
    description: "Write comprehensive API documentation",
    status: "To Do",
    priority: "low",
    progress: 0,
    startDate: "2024-03-25",
    dueDate: "2024-04-01",
    assignees: [{ name: "John Doe", initial: "JD" }],
    subscribes: 1
  },
  {
    id: "5",
    title: "Unit Tests",
    content: "Write unit tests for core functionality",
    description: "Write unit tests for core functionality",
    status: "In Progress",
    priority: "medium",
    progress: 40,
    startDate: "2024-03-18",
    dueDate: "2024-03-30",
    assignees: [{ name: "John Doe", initial: "JD" }],
    subscribes: 2
  }
];

export const mockProjects = [
  {
    id: "1",
    name: "Taskaty Development",
    description: "Main project for Taskaty application development",
    status: "Active",
    dueDate: "2024-04-30",
    leader: mockUser,
    teamMembers: [mockUser],
    tasks: mockTasks,
    lastViews: [
      {
        user: mockUser,
        date: "2024-03-20T15:00:00Z"
      }
    ]
  },
  {
    id: "2",
    name: "UI/UX Improvements",
    description: "Enhance user interface and experience",
    status: "Planning",
    dueDate: "2024-05-15",
    leader: mockUser,
    teamMembers: [mockUser],
    tasks: [],
    lastViews: []
  }
];

// Mock API responses
export const mockResponses = {
  login: {
    success: true,
    user: mockUser,
    message: "Login successful"
  },
  register: {
    success: true,
    message: "Registration successful. Please check your email for verification."
  },
  verifyToken: {
    authenticated: true,
    user: mockUser
  },
  getTasks: {
    success: true,
    tasks: mockTasks
  },
  getProjects: {
    success: true,
    projects: mockProjects
  }
}; 