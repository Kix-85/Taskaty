/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Clock, CheckCircle2, AlertCircle, AlertTriangle, Plus, Calendar, Users, ArrowUpRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useTaskStore } from "@/store/taskStore";
import { projectService, Project } from "@/services/projectService";
import type { Task } from "@/types/task";

interface DashboardStats {
  totalTasks: number;
  completedTasks: number;
  activeProjects: number;
  tasksDueToday: number;
  overdueTasks: number;
  urgentTasks: number;
  teamMembers: number;
}

const Dashboard = () => {
  const navigate = useNavigate();
  const { tasks, fetchTasks } = useTaskStore();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<DashboardStats>({
    totalTasks: 0,
    completedTasks: 0,
    activeProjects: 0,
    tasksDueToday: 0,
    overdueTasks: 0,
    urgentTasks: 0,
    teamMembers: 0
  });
  const [recentTasks, setRecentTasks] = useState<Task[]>([]);
  const [activeProjects, setActiveProjects] = useState<Project[]>([]);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const [tasksData, projectsData] = await Promise.all([
          fetchTasks(),
          projectService.getAllProjects()
        ]);
        setActiveProjects(projectsData || []);
      } catch (error) {
        console.error('Error loading dashboard data:', error);
        toast.error('Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [fetchTasks]);

  useEffect(() => {
    if (!tasks) return;

    const allTasks = Object.values(tasks).flat();
    const today = new Date().toISOString().split('T')[0];
    
    const overdueTasks = allTasks.filter((task: Task) => 
      task.dueDate && new Date(task.dueDate) < new Date() && task.status !== 'done'
    );
    const urgentTasks = allTasks.filter((task: Task) => 
      task.priority === 'urgent' && task.status !== 'done'
    );

    // Calculate unique team members
    const uniqueTeamMembers = new Set(
      allTasks.flatMap((task: Task) => 
        Array.isArray(task.assignedTo) 
          ? task.assignedTo.map(member => member?._id).filter(Boolean)
          : []
      )
    );

    setStats({
      totalTasks: allTasks.length,
      completedTasks: allTasks.filter((task: Task) => task.status === 'done').length,
      activeProjects: activeProjects.filter((project: Project) => project?.status === 'Active').length,
      tasksDueToday: allTasks.filter((task: Task) => task.dueDate === today).length,
      overdueTasks: overdueTasks.length,
      urgentTasks: urgentTasks.length,
      teamMembers: uniqueTeamMembers.size
    });

    // Sort tasks by due date and get the 5 most recent
    setRecentTasks(
      allTasks
        .sort((a: Task, b: Task) => 
          new Date(b.updatedAt || 0).getTime() - new Date(a.updatedAt || 0).getTime()
        )
        .slice(0, 5)
    );

    // Get active projects
    setActiveProjects(
      activeProjects
        .filter((project: Project) => 
          project?.dueDate && 
          new Date(project.dueDate) > new Date()
        )
        .slice(0, 3)
    );
  }, [tasks, activeProjects]);

  const completionRate = stats.totalTasks > 0 
    ? (stats.completedTasks / stats.totalTasks) * 100 
    : 0;

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'bg-red-100 text-red-600';
      case 'high': return 'bg-orange-100 text-orange-600';
      case 'medium': return 'bg-yellow-100 text-yellow-600';
      case 'low': return 'bg-green-100 text-green-600';
      default: return 'bg-gray-100 text-gray-600';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Just Started': return 'bg-blue-100 text-blue-600';
      case 'In Progress': return 'bg-amber-100 text-amber-600';
      case 'Almost Done': return 'bg-green-100 text-green-600';
      default: return 'bg-gray-100 text-gray-600';
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <div className="flex flex-col md:flex-row gap-2 w-full md:w-auto">
          <Button onClick={() => navigate('/myTasks')} variant="outline" className="w-full md:w-auto">
            <Calendar className="h-4 w-4 mr-2" />
            View Calendar
          </Button>
          <Button onClick={() => navigate('/myTasks')} className="w-full md:w-auto">
            <Plus className="h-4 w-4 mr-2" />
            New Task
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {loading ? (
          Array(4).fill(0).map((_, i) => (
            <Card key={i}>
              <CardHeader className="pb-2">
                <Skeleton className="h-4 w-24" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-8 w-16" />
              </CardContent>
            </Card>
          ))
        ) : (
          <>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Total Tasks</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <p className="text-3xl font-bold">{stats.totalTasks}</p>
                  <div className="bg-primary/10 p-2 rounded-full">
                    <Clock className="h-4 w-4 text-primary" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Completed Tasks</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-3xl font-bold">{stats.completedTasks}</p>
                    <Progress value={completionRate} className="mt-2 w-24" />
                  </div>
                  <div className="bg-green-100 p-2 rounded-full">
                    <CheckCircle2 className="h-4 w-4 text-green-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Active Projects</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <p className="text-3xl font-bold">{stats.activeProjects}</p>
                  <div className="bg-blue-100 p-2 rounded-full">
                    <Users className="h-4 w-4 text-blue-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Tasks Due Today</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <p className="text-3xl font-bold">{stats.tasksDueToday}</p>
                  <div className="bg-orange-100 p-2 rounded-full">
                    <AlertTriangle className="h-4 w-4 text-orange-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Recent Tasks</CardTitle>
                <CardDescription>Your most recently updated tasks</CardDescription>
              </div>
              <Button variant="ghost" size="sm" onClick={() => navigate('/myTasks')}>
                View All
                <ArrowUpRight className="h-4 w-4 ml-1" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[300px]">
              {loading ? (
                Array(5).fill(0).map((_, i) => (
                  <div key={i} className="flex items-center justify-between p-4 border-b">
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-32" />
                      <Skeleton className="h-3 w-24" />
                    </div>
                    <Skeleton className="h-4 w-16" />
                  </div>
                ))
              ) : (
                <div className="space-y-4">
                  {recentTasks.map((task) => (
                    <div 
                      key={task._id} 
                      className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent/50 cursor-pointer transition-colors"
                      onClick={() => navigate(`/myTasks?task=${task._id}`)}
                    >
                      <div>
                        <p className="font-medium">{task.name}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant="outline" className={getStatusColor(task.status)}>
                            {task.status}
                          </Badge>
                          {task.priority && (
                            <Badge variant="outline" className={getPriorityColor(task.priority)}>
                              {task.priority}
                            </Badge>
                          )}
                        </div>
                      </div>
                      <Progress value={task.progress} className="w-24" />
                    </div>
                  ))}
                </div>
              )}
            </ScrollArea>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Active Projects</CardTitle>
                <CardDescription>Projects you're currently working on</CardDescription>
              </div>
              <Button variant="ghost" size="sm" onClick={() => navigate('/projects')}>
                View All
                <ArrowUpRight className="h-4 w-4 ml-1" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[300px]">
              {loading ? (
                Array(3).fill(0).map((_, i) => (
                  <div key={i} className="p-4 border-b">
                    <Skeleton className="h-4 w-48 mb-2" />
                    <Skeleton className="h-3 w-32" />
                  </div>
                ))
              ) : (
                <div className="space-y-4">
                  {activeProjects.map((project) => (
                    <div 
                      key={project._id}
                      className="p-4 border rounded-lg hover:bg-accent/50 cursor-pointer transition-colors"
                      onClick={() => navigate(`/projects/${project._id}`)}
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="font-medium">{project.name}</p>
                          <p className="text-sm text-muted-foreground mt-1">{project.description}</p>
                        </div>
                        <Badge variant="outline" className={getStatusColor(project.status)}>
                          {project.status}
                        </Badge>
                      </div>
                      <div className="mt-4">
                        <div className="flex items-center justify-between text-sm mb-1">
                          <span>Progress</span>
                          <span>{project.progress || 0}%</span>
                        </div>
                        <Progress value={project.progress || 0} className="h-2" />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </ScrollArea>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Overdue Tasks</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <p className="text-3xl font-bold">{stats.overdueTasks}</p>
              <div className="bg-red-100 p-2 rounded-full">
                <AlertCircle className="h-4 w-4 text-red-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Urgent Tasks</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <p className="text-3xl font-bold">{stats.urgentTasks}</p>
              <div className="bg-orange-100 p-2 rounded-full">
                <AlertTriangle className="h-4 w-4 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Team Members</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <p className="text-3xl font-bold">{stats.teamMembers}</p>
              <div className="bg-blue-100 p-2 rounded-full">
                <Users className="h-4 w-4 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;