
export interface Task {
  id: string;
  title: string;
  description: string;
  dueDate: string;
  priority: "low" | "medium" | "high";
  progress: number;
  assignees: { name: string; initial: string }[];
}

export const tasks: Task[] = [
  {
    id: "task-1",
    title: "Redesign homepage",
    description: "Update the homepage with new branding and improve user experience",
    dueDate: "May 10",
    priority: "high",
    progress: 65,
    assignees: [
      { name: "Alex Johnson", initial: "A" },
      { name: "Maria Garcia", initial: "M" }
    ]
  },
  {
    id: "task-2",
    title: "Implement authentication",
    description: "Set up OAuth and email registration flows with proper security measures",
    dueDate: "May 15",
    priority: "high",
    progress: 30,
    assignees: [
      { name: "James Wilson", initial: "J" }
    ]
  },
  {
    id: "task-3",
    title: "Create onboarding flow",
    description: "Design and implement user onboarding experience for new users",
    dueDate: "May 20",
    priority: "medium",
    progress: 10,
    assignees: [
      { name: "Sarah Brown", initial: "S" },
      { name: "Alex Johnson", initial: "A" }
    ]
  },
  {
    id: "task-4",
    title: "Optimize performance",
    description: "Improve loading times and reduce bundle size for better user experience",
    dueDate: "May 25",
    priority: "medium",
    progress: 0,
    assignees: [
      { name: "James Wilson", initial: "J" },
      { name: "David Lee", initial: "D" }
    ]
  },
  {
    id: "task-5",
    title: "Write documentation",
    description: "Create comprehensive documentation for the codebase and APIs",
    dueDate: "May 18",
    priority: "low",
    progress: 45,
    assignees: [
      { name: "Emily Chen", initial: "E" }
    ]
  },
  {
    id: "task-6",
    title: "Bug fixes for release",
    description: "Address critical bugs before the upcoming product release",
    dueDate: "May 8",
    priority: "high",
    progress: 80,
    assignees: [
      { name: "David Lee", initial: "D" },
      { name: "Maria Garcia", initial: "M" }
    ]
  }
];

export const projectStats = {
  totalTasks: 24,
  completedTasks: 12,
  inProgressTasks: 8,
  upcomingTasks: 4,
  overdueTask: 2,
};
