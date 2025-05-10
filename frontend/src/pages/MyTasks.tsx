/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect } from 'react';
import { useTaskStore } from '@/services/taskApi';
import Kanban from '@/components/taskComponents/Kanban';
import List from '@/components/taskComponents/List';
import Calendar from '@/components/taskComponents/Calendar';
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState } from 'react';

const MyTasks = () => {
  const { tasks, fetchTasks, moveTask } = useTaskStore();
  const [selectedView, setSelectedView] = useState<'Kanban' | 'List' | 'Calendar'>('Kanban');

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const handleTaskMove = (result: any) => {
    if (!result.destination) return;

    const { source, destination, draggableId } = result;
    moveTask(
      draggableId,
      source.droppableId as keyof typeof tasks,
      destination.droppableId as keyof typeof tasks,
      destination.index
    );
  };

  return (
    <div className="container mx-auto p-4">
      <Tabs defaultValue="Kanban" className="w-full" onValueChange={(value) => setSelectedView(value as typeof selectedView)}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="Kanban">Kanban</TabsTrigger>
          <TabsTrigger value="List">List</TabsTrigger>
          <TabsTrigger value="Calendar">Calendar</TabsTrigger>
        </TabsList>
      </Tabs>

      <div className="mt-4">
        {selectedView === 'Kanban' && <Kanban tasks={tasks} onTaskMove={handleTaskMove} />}
        {selectedView === 'List' && <List tasks={tasks} onTaskMove={handleTaskMove} />}
        {selectedView === 'Calendar' && <Calendar tasks={tasks} />}
      </div>
    </div>
  );
};

export default MyTasks;
