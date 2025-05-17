/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from 'react';
import { useTaskStore } from '@/store/taskStore';
import { useProjectStore } from '@/store/projectStore';
import Kanban from '@/components/taskComponents/Kanban';
import List from '@/components/taskComponents/List';
import Calendar from '@/components/taskComponents/Calendar';
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import type { Task, TaskGroups } from '@/types/task';

const MyTasks = () => {
  const { tasks, fetchTasks, moveTask } = useTaskStore();
  const { projects, fetchProjects } = useProjectStore();
  const [selectedView, setSelectedView] = useState<'Kanban' | 'List' | 'Calendar'>('Kanban');
  const [selectedProject, setSelectedProject] = useState<string>('all');

  useEffect(() => {
    fetchTasks();
    fetchProjects();
  }, [fetchTasks, fetchProjects]);

  const handleTaskMove = (result: any) => {
    if (!result.destination) return;

    const { source, destination, draggableId } = result;
    moveTask(
      draggableId,
      source.droppableId as keyof TaskGroups,
      destination.droppableId as keyof TaskGroups,
      destination.index
    );
  };

  const filterTasksByProject = (taskGroups: TaskGroups): TaskGroups => {
    if (selectedProject === 'all') return taskGroups;

    return {
      'To Do': taskGroups['To Do'].filter(task => task.project?._id === selectedProject),
      'In Progress': taskGroups['In Progress'].filter(task => task.project?._id === selectedProject),
      'Done': taskGroups['Done'].filter(task => task.project?._id === selectedProject)
    };
  };

  const filteredTasks = filterTasksByProject(tasks);

  // For Calendar view, we need to group tasks by status
  const calendarTasks: TaskGroups = {
    'To Do': Object.values(filteredTasks).flat().filter(task => task.status === 'todo'),
    'In Progress': Object.values(filteredTasks).flat().filter(task => task.status === 'in progress'),
    'Done': Object.values(filteredTasks).flat().filter(task => task.status === 'done')
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-4">
        <Tabs defaultValue="Kanban" className="w-full" onValueChange={(value) => setSelectedView(value as typeof selectedView)}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="Kanban">Kanban</TabsTrigger>
            <TabsTrigger value="List">List</TabsTrigger>
            <TabsTrigger value="Calendar">Calendar</TabsTrigger>
          </TabsList>
        </Tabs>

        <div className="w-64">
          <Label htmlFor="project">Filter by Project</Label>
          <Select
            value={selectedProject}
            onValueChange={setSelectedProject}
          >
            <SelectTrigger>
              <SelectValue placeholder="All Projects" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Projects</SelectItem>
              {projects.map((project) => (
                <SelectItem key={project._id} value={project._id}>
                  {project.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="mt-4">
        {selectedView === 'Kanban' && <Kanban tasks={filteredTasks} onTaskMove={handleTaskMove} />}
        {selectedView === 'List' && <List tasks={filteredTasks} onTaskMove={handleTaskMove} />}
        {selectedView === 'Calendar' && <Calendar tasks={calendarTasks} />}
      </div>
    </div>
  );
};

export default MyTasks;
