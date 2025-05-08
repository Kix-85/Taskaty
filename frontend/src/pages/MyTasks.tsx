import { useState, useEffect } from "react";
import axios from "axios";
import Kanban from "@/components/taskComponents/Kanban";
import List from "@/components/taskComponents/List";
import Calendar from "@/components/taskComponents/Calendar";
import { Button } from "@/components/ui/button";
import { Kanban as KanbanIcon, List as ListIcon, CalendarDays } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Task, TaskGroups } from "@/types/task";

const MyTasks = () => {
  const [selectedView, setSelectedView] = useState<string>('Calendar');
  const [tasks, setTasks] = useState<TaskGroups>({
    "To Do": [],
    "In Progress": [],
    "Done": []
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const response = await axios.get('/api/tasks');
        // Ensure each group is an array
        const formattedTasks: TaskGroups = {
          "To Do": Array.isArray(response.data["To Do"]) ? response.data["To Do"] : [],
          "In Progress": Array.isArray(response.data["In Progress"]) ? response.data["In Progress"] : [],
          "Done": Array.isArray(response.data["Done"]) ? response.data["Done"] : []
        };
        setTasks(formattedTasks);
      } catch (err) {
        setError('Failed to fetch tasks. Please try again later.');
        console.error('Error fetching tasks:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTasks();
  }, []);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleTaskMove = async (result: any) => {
    try {
      // Optimistically update the UI
      const { source, destination } = result;
      if (!destination) return;

      const sourceCol = [...tasks[source.droppableId as keyof TaskGroups]];
      const destCol = [...tasks[destination.droppableId as keyof TaskGroups]];
      const [movedItem] = sourceCol.splice(source.index, 1);
      
      const newTasks = { ...tasks };
      if (source.droppableId === destination.droppableId) {
        sourceCol.splice(destination.index, 0, movedItem);
        newTasks[source.droppableId as keyof TaskGroups] = sourceCol;
      } else {
        destCol.splice(destination.index, 0, movedItem);
        newTasks[source.droppableId as keyof TaskGroups] = sourceCol;
        newTasks[destination.droppableId as keyof TaskGroups] = destCol;
      }
      setTasks(newTasks);

      // Send update to backend
      await axios.put(`/api/tasks/${movedItem.id}`, {
        status: destination.droppableId
      });
    } catch (err) {
      // Revert the optimistic update on error
      console.error('Error updating task:', err);
      // You might want to refetch the tasks here to ensure sync
      const response = await axios.get('/api/tasks');
      setTasks(response.data);
    }
  };

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="space-y-4">
          <Skeleton className="h-8 w-full" />
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-32 w-full" />
        </div>
      );
    }

    if (error) {
      return (
        <div className="text-center py-8">
          <p className="text-destructive">{error}</p>
          <Button 
            variant="outline" 
            className="mt-4"
            onClick={() => window.location.reload()}
          >
            Retry
          </Button>
        </div>
      );
    }

    return (
      <>
        {selectedView === 'Kanban' && <Kanban tasks={tasks} onTaskMove={handleTaskMove} />}
        {selectedView === 'List' && <List tasks={tasks} />}
        {selectedView === 'Calendar' && <Calendar tasks={tasks} />}
      </>
    );
  };
  
  return (
    <div className="h-full flex flex-col bg-background">
      <div className="sticky top-0 z-10 bg-background/95 backdrop-blur-sm px-4 py-3 border-b">
        <h1 className="text-2xl font-bold mb-1">My Tasks</h1>
        <p className="text-muted-foreground text-sm mb-3">Manage and organize your tasks</p>
        
        <div className="flex justify-center sm:justify-start">
          <div className="inline-flex rounded-lg shadow-sm bg-background/80 backdrop-blur-sm p-1">
            <Button 
              variant={selectedView === 'Kanban' ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedView('Kanban')}
              className="flex items-center"
            >
              <KanbanIcon size={16} className="mr-1" />
              <span className="hidden sm:inline">Kanban</span>
            </Button>
            
            <Button 
              variant={selectedView === 'List' ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedView('List')}
              className="flex items-center"
            >
              <ListIcon size={16} className="mr-1" />
              <span className="hidden sm:inline">List</span>
            </Button>
            
            <Button 
              variant={selectedView === 'Calendar' ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedView('Calendar')}
              className="flex items-center"
            >
              <CalendarDays size={16} className="mr-1" />
              <span className="hidden sm:inline">Calendar</span>
            </Button>
          </div>
        </div>
      </div>

      <div className="flex-1 p-4 overflow-auto">
        {renderContent()}
      </div>
    </div>
  );
};

export default MyTasks;
