/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from "react";
import Kanban from "@/components/taskComponents/Kanban";
import List from "@/components/taskComponents/List";
import Calendar from "@/components/taskComponents/Calendar";
import { Button } from "@/components/ui/button";
import { Kanban as KanbanIcon, List as ListIcon, CalendarDays } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useTaskStore } from "@/services/taskApi";

const MyTasks = () => {
  const [selectedView, setSelectedView] = useState<string>('Calendar');
  const { tasks, isLoading, error, fetchTasks, moveTask } = useTaskStore();

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const handleTaskMove = async (result: any) => {
    const { source, destination } = result;
    if (!destination) return;

    await moveTask(
      result.draggableId,
      source.droppableId,
      destination.droppableId,
      destination.index
    );
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
            onClick={() => fetchTasks()}
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
