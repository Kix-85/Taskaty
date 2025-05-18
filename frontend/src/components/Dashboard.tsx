import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import TaskCard from "@/components/TaskCard";
import { Button } from "@/components/ui/button";
import { Plus, ChevronRight } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { dashboardApi, Task, ProjectStats } from "@/services/dashboardApi";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";
import { CreateTaskModal } from "@/components/CreateTaskModal";
import TaskEditModal from "@/components/taskComponents/TaskEditModal";

const Dashboard = () => {
  const [projectStats, setProjectStats] = useState<ProjectStats | null>(null);
  const [todayTasks, setTodayTasks] = useState<Task[]>([]);
  const [upcomingTasks, setUpcomingTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const fetchDashboardData = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const stats = await dashboardApi.getProjectStats();
      const today = await dashboardApi.getTodayTasks();
      const upcoming = await dashboardApi.getUpcomingTasks();

      setProjectStats(stats);
      setTodayTasks(today || []);
      setUpcomingTasks(upcoming || []);

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch dashboard data';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const handleTaskCreated = () => {
    fetchDashboardData();
    setIsCreateModalOpen(false);
  };

  const handleTaskClick = (task: Task) => {
    setSelectedTask(task);
    setIsEditModalOpen(true);
  };

  if (isLoading) {
    return (
      <div className="flex flex-col min-h-screen animate-fade-in">
        <div className="sticky top-0 z-10 bg-background p-6 pb-4 border-b">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <Skeleton className="h-8 w-48 mb-2" />
              <Skeleton className="h-4 w-64" />
            </div>
            <Skeleton className="h-10 w-32" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 mt-6">
            {[...Array(5)].map((_, i) => (
              <Card key={`skeleton-${i}`}>
                <CardHeader className="pb-2">
                  <Skeleton className="h-4 w-24" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-8 w-16" />
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-destructive">{error}</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen animate-fade-in">
      <div className="sticky top-0 z-10 bg-background p-6 pb-4 border-b">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold">Welcome back!</h1>
            <p className="text-muted-foreground">Here's an overview of your tasks.</p>
          </div>
          <Button 
            className="w-full md:w-auto"
            onClick={() => setIsCreateModalOpen(true)}
          >
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
              <div className="text-2xl font-bold">{projectStats?.totalTasks || 0}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Completed</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-500">{projectStats?.completedTasks || 0}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">In Progress</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-500">{projectStats?.inProgressTasks || 0}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Upcoming</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-500">{projectStats?.upcomingTasks || 0}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Overdue</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-500">{projectStats?.overdueTasks || 0}</div>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="p-6 flex-1 overflow-hidden flex flex-col md:flex-row gap-6">
        <ScrollArea className="flex-1">
          <div className="grid grid-cols-1 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
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
                  {todayTasks.map((task) => (
                    <div 
                      key={task._id} 
                      onClick={() => handleTaskClick(task)}
                      className="cursor-pointer hover:opacity-80 transition-opacity"
                    >
                      <TaskCard
                        title={task.name}
                        description={task.description}
                        dueDate={task.dueDate}
                        status={task.status}
                        progress={task.progress}
                        assignedTo={task.assignedTo}
                      />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
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
                  {upcomingTasks.map((task) => (
                    <div 
                      key={task._id} 
                      onClick={() => handleTaskClick(task)}
                      className="cursor-pointer hover:opacity-80 transition-opacity"
                    >
                      <TaskCard
                        title={task.name}
                        description={task.description}
                        dueDate={task.dueDate}
                        status={task.status}
                        progress={task.progress}
                        assignedTo={task.assignedTo}
                      />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </ScrollArea>
      </div>

      <CreateTaskModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onTaskCreated={handleTaskCreated}
      />

      {selectedTask && (
        <TaskEditModal
          isOpen={isEditModalOpen}
          onClose={() => {
            setIsEditModalOpen(false);
            setSelectedTask(null);
          }}
          task={selectedTask}
          onTaskUpdated={fetchDashboardData}
        />
      )}
    </div>
  );
};

export default Dashboard;
