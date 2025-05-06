"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { TaskCard } from "@/components/TaskCard";
import { Button } from "@/components/ui/button";
import { Plus, ChevronRight } from "lucide-react";

// Mock data - in a real app you'd fetch this from an API
const tasks = [
  {
    id: "task-1",
    title: "Redesign homepage",
    description: "Update the homepage with new branding and improve user experience",
    dueDate: "May 10",
    priority: "high" as const,
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
    priority: "high" as const,
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
    priority: "medium" as const,
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
    priority: "medium" as const,
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
    priority: "low" as const,
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
    priority: "high" as const,
    progress: 80,
    assignees: [
      { name: "David Lee", initial: "D" },
      { name: "Maria Garcia", initial: "M" }
    ]
  }
];

const projectStats = {
  totalTasks: 24,
  completedTasks: 12,
  inProgressTasks: 8,
  upcomingTasks: 4,
  overdueTask: 2,
};

export function Dashboard() {
  const { totalTasks, completedTasks, inProgressTasks, upcomingTasks, overdueTask } = projectStats;

  return (
    <div className="flex flex-col min-h-screen animate-fade-in">
      <div className="sticky top-0 z-10 bg-background p-6 pb-4 border-b">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold">Welcome back!</h1>
            <p className="text-muted-foreground">Here's an overview of your tasks.</p>
          </div>
          <Button className="w-full md:w-auto">
            <Plus size={16} className="mr-2" />
            Add New Task
          </Button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 mt-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Total Tasks</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalTasks}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Completed</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-500">{completedTasks}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">In Progress</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-500">{inProgressTasks}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Upcoming</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-500">{upcomingTasks}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Overdue</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-500">{overdueTask}</div>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="p-6 flex-1 overflow-auto">
        <div className="grid grid-cols-1 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2 sticky top-0 bg-card z-10">
              <div className="space-y-1">
                <CardTitle>Today's Tasks</CardTitle>
                <CardDescription>Your tasks that require attention today.</CardDescription>
              </div>
              <Button variant="ghost" size="sm" className="gap-1">
                View All <ChevronRight size={16} />
              </Button>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {tasks.slice(0, 3).map((task) => (
                  <TaskCard
                    key={task.id}
                    title={task.title}
                    description={task.description}
                    dueDate={task.dueDate}
                    priority={task.priority}
                    progress={task.progress}
                    assignees={task.assignees}
                  />
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2 sticky top-0 bg-card z-10">
              <div className="space-y-1">
                <CardTitle>Upcoming Tasks</CardTitle>
                <CardDescription>Tasks scheduled for the coming days.</CardDescription>
              </div>
              <Button variant="ghost" size="sm" className="gap-1">
                View All <ChevronRight size={16} />
              </Button>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {tasks.slice(3, 6).map((task) => (
                  <TaskCard
                    key={task.id}
                    title={task.title}
                    description={task.description}
                    dueDate={task.dueDate}
                    priority={task.priority}
                    progress={task.progress}
                    assignees={task.assignees}
                  />
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
