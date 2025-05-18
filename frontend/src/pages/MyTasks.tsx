/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from 'react';
import { useTaskStore } from '@/store/taskStore';
import { useProjectStore } from '@/store/projectStore';
import Kanban from '@/components/taskComponents/Kanban';
import List from '@/components/taskComponents/List';
import Calendar from '@/components/taskComponents/Calendar';
import { BotChat } from '@/components/BotChat';
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Filter, Search, Bot, Plus, Clock, Tag, Users, Check, AlertCircle, AlertTriangle } from "lucide-react";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger, SheetClose } from "@/components/ui/sheet";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import type { Task, TaskGroups } from '@/types/task';
import TaskEditModal from '@/components/taskComponents/TaskEditModal';
import CreateTaskModal from '@/components/taskComponents/CreateTaskModal';
import { useLocation } from 'react-router-dom';
import { useChatBot } from '@/providers/ChatBotProvider';
import { ScrollArea } from '@/components/ui/scroll-area';
import { toast } from 'sonner';

const MyTasks = () => {
  const location = useLocation();
  const { tasks, fetchTasks, moveTask, filterByProject, updateTask } = useTaskStore();
  const { projects, fetchProjects } = useProjectStore();
  const [selectedView, setSelectedView] = useState<'Kanban' | 'List' | 'Calendar'>('Kanban');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [currentProjectId, setCurrentProjectId] = useState<string | null>(null);
  const [filters, setFilters] = useState({
    priority: 'all',
    status: 'all',
    dueDate: 'all',
    assignedToMe: false,
    hasSubtasks: false,
    tags: [] as string[],
    progress: 'all'
  });
  const { setShowChat, setContext } = useChatBot();
  const [isFilterSheetOpen, setIsFilterSheetOpen] = useState(false);
  const [availableTags, setAvailableTags] = useState<string[]>([]);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  useEffect(() => {
    // Extract unique tags from all tasks
    const tags = new Set<string>();
    Object.values(tasks).flat().forEach(task => {
      task.tags?.forEach(tag => tags.add(tag));
    });
    setAvailableTags(Array.from(tags));
  }, [tasks]);

  useEffect(() => {
    // Check if there's a project ID in the URL search params
    const searchParams = new URLSearchParams(location.search);
    const projectId = searchParams.get('projectId');
    
    if (projectId) {
      setCurrentProjectId(projectId);
      filterByProject(projectId);
    } else {
      fetchTasks();
    }
  }, [location.search, fetchTasks, filterByProject]);

  useEffect(() => {
    if (currentProjectId) {
      filterByProject(currentProjectId);
    } else {
      fetchTasks();
    }
  }, [currentProjectId, filterByProject, fetchTasks]);

  const handleTaskMove = async (result: any) => {
    if (!result.destination) return;

    const { source, destination, draggableId } = result;
    
    const sourceStatus = source.droppableId;
    const destinationStatus = destination.droppableId;

    if (!sourceStatus || !destinationStatus) return;

    try {
      await moveTask(
        draggableId,
        sourceStatus as keyof TaskGroups,
        destinationStatus as keyof TaskGroups,
        destination.index
      );
      toast.success('Task moved successfully');
    } catch (error) {
      toast.error('Failed to move task');
    }
  };

  const handleTaskEdit = (task: Task) => {
    setSelectedTask(task);
    setIsEditModalOpen(true);
  };

  const handleFilterChange = (key: keyof typeof filters, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const handleTagToggle = (tag: string) => {
    setFilters(prev => ({
      ...prev,
      tags: prev.tags.includes(tag)
        ? prev.tags.filter(t => t !== tag)
        : [...prev.tags, tag]
    }));
  };

  const handleProjectChange = (projectId: string) => {
    setCurrentProjectId(projectId === 'all' ? null : projectId);
  };

  const handleAskAI = () => {
    setContext('tasks');
    setShowChat(true);
  };

  // Filter and search tasks
  const filteredAndSearchedTasks = Object.entries(tasks).reduce((acc, [status, taskList]) => {
    let filtered = taskList;

    // Apply filters
    if (filters.priority !== 'all') {
      filtered = filtered.filter(task => task.priority === filters.priority);
    }
    if (filters.status !== 'all') {
      filtered = filtered.filter(task => task.status === filters.status);
    }
    if (filters.dueDate !== 'all') {
      const today = new Date();
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);
      const nextWeek = new Date(today);
      nextWeek.setDate(nextWeek.getDate() + 7);

      filtered = filtered.filter(task => {
        if (!task.dueDate) return false;
        const dueDate = new Date(task.dueDate);
        switch (filters.dueDate) {
          case 'today':
            return dueDate.toDateString() === today.toDateString();
          case 'tomorrow':
            return dueDate.toDateString() === tomorrow.toDateString();
          case 'week':
            return dueDate <= nextWeek && dueDate >= today;
          case 'overdue':
            return dueDate < today;
          default:
            return true;
        }
      });
    }

    if (filters.assignedToMe) {
      filtered = filtered.filter(task => 
        task.assignedTo?.some(user => user._id === localStorage.getItem('userId'))
      );
    }

    if (filters.hasSubtasks) {
      filtered = filtered.filter(task => task.subtasks?.length > 0);
    }

    if (filters.tags.length > 0) {
      filtered = filtered.filter(task =>
        task.tags?.some(tag => filters.tags.includes(tag))
      );
    }

    if (filters.progress !== 'all') {
      filtered = filtered.filter(task => {
        switch (filters.progress) {
          case 'not-started':
            return task.progress === 0;
          case 'in-progress':
            return task.progress > 0 && task.progress < 100;
          case 'completed':
            return task.progress === 100;
          default:
            return true;
        }
      });
    }

    // Apply search
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(task =>
        task.name.toLowerCase().includes(query) ||
        task.description.toLowerCase().includes(query) ||
        task.tags?.some(tag => tag.toLowerCase().includes(query)) ||
        task.subtasks?.some(subtask => 
          subtask.title.toLowerCase().includes(query) ||
          subtask.description?.toLowerCase().includes(query)
        )
      );
    }

    return { ...acc, [status]: filtered };
  }, {} as TaskGroups);

  // Transform tasks for calendar view
  const calendarTasks = Object.values(tasks)
    .flat()
    .map(task => ({
      ...task,
      start: new Date(task.dueDate),
      end: new Date(task.dueDate),
      title: task.name,
      color: task.priority === 'urgent' ? 'red' : 
             task.priority === 'high' ? 'orange' :
             task.priority === 'medium' ? 'blue' : 'green'
    }));

  const taskStats = {
    total: Object.values(tasks).flat().length,
    completed: Object.values(tasks).flat().filter(task => task.status === 'done').length,
    overdue: Object.values(tasks).flat().filter(task => {
      if (!task.dueDate) return false;
      return new Date(task.dueDate) < new Date() && task.status !== 'done';
    }).length,
    urgent: Object.values(tasks).flat().filter(task => task.priority === 'urgent').length
  };

  const transformedTasks: TaskGroups = {
    'To Do': calendarTasks.filter(task => task.status === 'todo'),
    'In Progress': calendarTasks.filter(task => task.status === 'in progress'),
    'Done': calendarTasks.filter(task => task.status === 'done')
  };

  return (
    <div className="container mx-auto p-4 space-y-6">
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex flex-col gap-2 md:flex-row md:items-center">
            <Select value={currentProjectId || 'all'} onValueChange={handleProjectChange}>
              <SelectTrigger className="w-full md:w-[200px]">
                <SelectValue placeholder="All Projects" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Projects</SelectItem>
                {projects.map(project => (
                  <SelectItem key={project._id} value={project._id}>
                    {project.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <div className="flex items-center gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search tasks..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-8"
                />
              </div>

              <Sheet open={isFilterSheetOpen} onOpenChange={setIsFilterSheetOpen}>
                <SheetTrigger asChild>
                  <Button variant="outline" size="icon" className="shrink-0">
                    <Filter className="h-4 w-4" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-full sm:max-w-lg">
                  <SheetHeader>
                    <SheetTitle>Filter Tasks</SheetTitle>
                    <SheetDescription>
                      Apply filters to find specific tasks
                    </SheetDescription>
                  </SheetHeader>
                  <ScrollArea className="h-[calc(100vh-8rem)] py-4">
                    <div className="space-y-6">
                      <div className="space-y-2">
                        <Label>Priority</Label>
                        <RadioGroup
                          value={filters.priority}
                          onValueChange={(value) => handleFilterChange('priority', value)}
                        >
                          <div className="space-y-1">
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="all" id="priority-all" />
                              <Label htmlFor="priority-all">All</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="urgent" id="priority-urgent" />
                              <Label htmlFor="priority-urgent">Urgent</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="high" id="priority-high" />
                              <Label htmlFor="priority-high">High</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="medium" id="priority-medium" />
                              <Label htmlFor="priority-medium">Medium</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="low" id="priority-low" />
                              <Label htmlFor="priority-low">Low</Label>
                            </div>
                          </div>
                        </RadioGroup>
                      </div>

                      <Separator />

                      <div className="space-y-2">
                        <Label>Due Date</Label>
                        <RadioGroup
                          value={filters.dueDate}
                          onValueChange={(value) => handleFilterChange('dueDate', value)}
                        >
                          <div className="space-y-1">
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="all" id="due-all" />
                              <Label htmlFor="due-all">All</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="today" id="due-today" />
                              <Label htmlFor="due-today">Today</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="tomorrow" id="due-tomorrow" />
                              <Label htmlFor="due-tomorrow">Tomorrow</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="week" id="due-week" />
                              <Label htmlFor="due-week">This Week</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="overdue" id="due-overdue" />
                              <Label htmlFor="due-overdue">Overdue</Label>
                            </div>
                          </div>
                        </RadioGroup>
                      </div>

                      <Separator />

                      <div className="space-y-2">
                        <Label>Progress</Label>
                        <RadioGroup
                          value={filters.progress}
                          onValueChange={(value) => handleFilterChange('progress', value)}
                        >
                          <div className="space-y-1">
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="all" id="progress-all" />
                              <Label htmlFor="progress-all">All</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="not-started" id="progress-not-started" />
                              <Label htmlFor="progress-not-started">Not Started</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="in-progress" id="progress-in-progress" />
                              <Label htmlFor="progress-in-progress">In Progress</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="completed" id="progress-completed" />
                              <Label htmlFor="progress-completed">Completed</Label>
                            </div>
                          </div>
                        </RadioGroup>
                      </div>

                      <Separator />

                      <div className="space-y-4">
                        <div className="flex items-center space-x-2">
                          <Switch
                            id="assigned-to-me"
                            checked={filters.assignedToMe}
                            onCheckedChange={(checked) => handleFilterChange('assignedToMe', checked)}
                          />
                          <Label htmlFor="assigned-to-me">Assigned to me</Label>
                        </div>

                        <div className="flex items-center space-x-2">
                          <Switch
                            id="has-subtasks"
                            checked={filters.hasSubtasks}
                            onCheckedChange={(checked) => handleFilterChange('hasSubtasks', checked)}
                          />
                          <Label htmlFor="has-subtasks">Has subtasks</Label>
                        </div>
                      </div>

                      <Separator />

                      <div className="space-y-2">
                        <Label>Tags</Label>
                        <div className="flex flex-wrap gap-2">
                          {availableTags.map(tag => (
                            <Badge
                              key={tag}
                              variant={filters.tags.includes(tag) ? 'default' : 'outline'}
                              className="cursor-pointer"
                              onClick={() => handleTagToggle(tag)}
                            >
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      <SheetClose asChild>
                        <Button className="w-full">Apply Filters</Button>
                      </SheetClose>
                    </div>
                  </ScrollArea>
                </SheetContent>
              </Sheet>

              <Button variant="outline" size="icon" onClick={handleAskAI}>
                <Bot className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <Button onClick={() => setIsCreateModalOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Create Task
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-card rounded-lg p-4 flex items-center gap-4">
            <div className="bg-primary/10 p-3 rounded-full">
              <Clock className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Tasks</p>
              <p className="text-2xl font-semibold">{taskStats.total}</p>
            </div>
          </div>
          <div className="bg-card rounded-lg p-4 flex items-center gap-4">
            <div className="bg-green-100 p-3 rounded-full">
              <Check className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Completed</p>
              <p className="text-2xl font-semibold">{taskStats.completed}</p>
            </div>
          </div>
          <div className="bg-card rounded-lg p-4 flex items-center gap-4">
            <div className="bg-red-100 p-3 rounded-full">
              <AlertCircle className="h-6 w-6 text-red-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Overdue</p>
              <p className="text-2xl font-semibold">{taskStats.overdue}</p>
            </div>
          </div>
          <div className="bg-card rounded-lg p-4 flex items-center gap-4">
            <div className="bg-orange-100 p-3 rounded-full">
              <AlertTriangle className="h-6 w-6 text-orange-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Urgent</p>
              <p className="text-2xl font-semibold">{taskStats.urgent}</p>
            </div>
          </div>
        </div>
      </div>

      <Tabs value={selectedView} onValueChange={(value: string) => setSelectedView(value as any)}>
        <TabsList>
          <TabsTrigger value="Kanban">Kanban</TabsTrigger>
          <TabsTrigger value="List">List</TabsTrigger>
          <TabsTrigger value="Calendar">Calendar</TabsTrigger>
        </TabsList>
      </Tabs>

      <div className="mt-6">
        {selectedView === 'Kanban' && (
          <Kanban
            tasks={filteredAndSearchedTasks}
            onTaskMove={handleTaskMove}
            onTaskEdit={handleTaskEdit}
          />
        )}
        {selectedView === 'List' && (
          <List
            tasks={filteredAndSearchedTasks}
            onTaskMove={handleTaskMove}
            onTaskEdit={handleTaskEdit}
          />
        )}
        {selectedView === 'Calendar' && (
          <Calendar
            tasks={transformedTasks}
            onTaskEdit={handleTaskEdit}
          />
        )}
      </div>

      {selectedTask && (
        <TaskEditModal
          isOpen={isEditModalOpen}
          onClose={() => {
            setIsEditModalOpen(false);
            setSelectedTask(null);
          }}
          task={selectedTask}
        />
      )}

      <CreateTaskModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
      />
    </div>
  );
};

export default MyTasks;
