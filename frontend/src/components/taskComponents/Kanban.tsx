import { useState } from 'react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import type { Task, TaskGroups } from "@/types/task";
import { useTaskStore } from '@/store/taskStore';
import { toast } from 'sonner';
import TaskEditModal from './TaskEditModal';

interface KanbanProps {
  tasks: TaskGroups;
  onTaskMove?: (result: any) => void;
}

const Kanban = ({ tasks, onTaskMove }: KanbanProps) => {
  const { updateTask } = useTaskStore();
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const handleDragEnd = async (result: any) => {
    if (!result.destination || !onTaskMove) return;

    const { source, destination, draggableId } = result;
    const task = tasks[source.droppableId].find(t => t._id === draggableId);

    if (!task) return;

    // Map the display status to the backend status
    const statusMap: { [key: string]: string } = {
      'To Do': 'todo',
      'In Progress': 'in progress',
      'Done': 'done'
    };

    // Get the backend status value
    const backendStatus = statusMap[destination.droppableId];

    // Update local state immediately for instant feedback
    onTaskMove(result);

    try {
      // Update task status in the backend
      await updateTask(task._id, { status: backendStatus });
      toast.success('Task status updated successfully');
    } catch (error) {
      // If backend update fails, revert the local state
      onTaskMove({
        ...result,
        source: result.destination,
        destination: result.source
      });
      toast.error('Failed to update task status');
      console.error('Error updating task status:', error);
    }
  };

  const handleTaskClick = (task: Task) => {
    setSelectedTask(task);
    setIsEditModalOpen(true);
  };

  return (
    <>
      <DragDropContext onDragEnd={handleDragEnd}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {Object.entries(tasks).map(([status, statusTasks]) => {
            console.log(`Rendering ${status} column with ${statusTasks.length} tasks:`, statusTasks);
            return (
              <div key={status} className="bg-card rounded-lg p-4 border">
                <h3 className="text-lg font-semibold mb-4 capitalize text-foreground">{status}</h3>
                <Droppable droppableId={status}>
                  {(provided) => (
                    <div
                      {...provided.droppableProps}
                      ref={provided.innerRef}
                      className="space-y-4 min-h-[200px]"
                    >
                      {statusTasks.map((task, index) => {
                        console.log('Rendering task:', task);
                        if (!task || !task._id) {
                          console.warn('Skipping task with no _id:', task);
                          return null;
                        }
                        
                        return (
                          <Draggable 
                            key={task._id} 
                            draggableId={String(task._id)} 
                            index={index}
                          >
                            {(provided) => (
                              <Card
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                                className="hover:shadow-md transition-shadow bg-card cursor-pointer"
                                onClick={() => handleTaskClick(task)}
                              >
                                <CardContent className="p-4">
                                  <div className="flex justify-between items-start mb-2">
                                    <h3 className="font-medium text-foreground">{task.name}</h3>
                                    <span className={`px-2 py-1 rounded text-white text-sm ${
                                      status === 'To Do' ? 'bg-gray-500' :
                                      status === 'In Progress' ? 'bg-blue-500' :
                                      'bg-green-500'
                                    }`}>
                                      {status}
                                    </span>
                                  </div>
                                  <p className="text-sm text-muted-foreground mb-4">{task.description}</p>
                                  <div className="space-y-2">
                                    <div className="flex justify-between text-sm text-foreground">
                                      <span>Progress</span>
                                      <span>{task.progress || 0}%</span>
                                    </div>
                                    <Progress value={task.progress || 0} />
                                    <div className="flex justify-between text-sm text-muted-foreground">
                                      <span>Due: {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'No due date'}</span>
                                      <span>Priority: {task.priority}</span>
                                    </div>
                                  </div>
                                </CardContent>
                              </Card>
                            )}
                          </Draggable>
                        );
                      })}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </div>
            );
          })}
        </div>
      </DragDropContext>

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
    </>
  );
};

export default Kanban;
