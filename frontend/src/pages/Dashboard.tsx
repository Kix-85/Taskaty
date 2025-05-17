/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import api from "@/lib/axios";
import { mockTasks, mockProjects } from "@/lib/mockData";

interface ApiResponse {
  tasks: any[];
  projects: any[];
}

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalTasks: 0,
    completedTasks: 0,
    activeProjects: 0,
    tasksDueToday: 0
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const tasksResponse = await api.get('/task/me');
        const projectsResponse = await api.get('/project/me');
        
        const tasks = (tasksResponse.data as ApiResponse).tasks;
        const projects = (projectsResponse.data as ApiResponse).projects;
        
        const today = new Date().toISOString().split('T')[0];
        setStats({
          totalTasks: tasks.length,
          completedTasks: tasks.filter((task: any) => task.status === 'Done').length,
          activeProjects: projects.filter((project: any) => project.status === 'Active').length,
          tasksDueToday: tasks.filter((task: any) => task.dueDate === today).length
        });
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      }
    };

    fetchData();
  }, []);

  const completionRate = stats.totalTasks > 0 
    ? (stats.completedTasks / stats.totalTasks) * 100 
    : 0;

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-bold">Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Total Tasks</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{stats.totalTasks}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Completed Tasks</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{stats.completedTasks}</p>
            <Progress value={completionRate} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Active Projects</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{stats.activeProjects}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Tasks Due Today</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{stats.tasksDueToday}</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Recent Tasks</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {mockTasks.slice(0, 5).map((task) => (
                <div key={task.id} className="flex items-center justify-between p-2 border rounded">
                  <div>
                    <p className="font-medium">{task.title}</p>
                    <p className="text-sm text-gray-500">{task.status}</p>
                  </div>
                  <Progress value={task.progress} className="w-24" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Active Projects</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {mockProjects.filter(p => p.status === 'Active').map((project) => (
                <div key={project.id} className="p-2 border rounded">
                  <p className="font-medium">{project.name}</p>
                  <p className="text-sm text-gray-500">{project.description}</p>
                  <p className="text-sm text-gray-500">Due: {new Date(project.dueDate).toLocaleDateString()}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;