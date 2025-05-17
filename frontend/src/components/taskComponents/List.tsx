import React, { useState } from "react";
import TaskCard from "@/components/TaskCard";
import { X, Pencil, Eye, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import type { Task, TaskGroups } from "@/types/task";
import { useTaskStore } from '@/store/taskStore';
import { toast } from 'sonner';
import TaskEditModal from './TaskEditModal';

interface ListProps {
  tasks: TaskGroups;
  onTaskMove?: (result: any) => void;
}

const TaskModal = ({ task, onClose }: { task: Task | null; onClose: () => void }) => {
  if (!task) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="relative w-full max-w-xl bg-white rounded-lg shadow dark:bg-gray-800 p-4">
        <div className="flex justify-between mb-4">
          <div className="text-lg text-gray-900 dark:text-white">
            <h3 className="font-semibold">{task.title}</h3>
            <p className="font-bold text-primary">{task.priority}</p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:bg-gray-200 hover:text-gray-900 rounded-lg p-1.5"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <dl>
          <dt className="mb-2 font-semibold text-gray-900 dark:text-white">Description</dt>
          <dd className="mb-4 text-gray-500 dark:text-gray-400">{task.description}</dd>
          <dt className="mb-2 font-semibold text-gray-900 dark:text-white">Due Date</dt>
          <dd className="mb-4 text-gray-500 dark:text-gray-400">{task.dueDate}</dd>
          <dt className="mb-2 font-semibold text-gray-900 dark:text-white">Progress</dt>
          <dd className="mb-4 text-gray-500 dark:text-gray-400">{task.progress}%</dd>
        </dl>
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <Button variant="default" className="flex items-center">
              <Pencil className="w-4 h-4 mr-1" />
              Edit
            </Button>
            <Button variant="outline" className="flex items-center">
              <Eye className="w-4 h-4 mr-1" />
              Preview
            </Button>
          </div>
          <Button variant="destructive" className="flex items-center">
            <Trash2 className="w-4 h-4 mr-1" />
            Delete
          </Button>
        </div>
      </div>
    </div>
  );
};

const List = ({ tasks, onTaskMove }: ListProps) => {
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
        {Object.entries(tasks).map(([status, statusTasks]) => (
          <div key={status} className="mb-8">
            <h3 className="text-lg font-semibold mb-4 capitalize text-foreground">{status}</h3>
            <Droppable droppableId={status}>
              {(provided, snapshot) => (
                <div
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                  className={`space-y-4 min-h-[200px] p-4 rounded-lg transition-colors duration-200 ${
                    snapshot.isDraggingOver 
                      ? 'bg-primary/10 border-2 border-dashed border-primary' 
                      : 'bg-card/50 border border-border'
                  }`}
                >
                  {statusTasks.length === 0 ? (
                    <div className="h-[200px] flex items-center justify-center text-muted-foreground">
                      Drop tasks here
                    </div>
                  ) : (
                    statusTasks.map((task, index) => {
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
                          {(provided, snapshot) => (
                            <Card
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              className={`hover:shadow-md transition-all duration-200 bg-card cursor-pointer ${
                                snapshot.isDragging ? 'shadow-lg scale-[1.02]' : ''
                              }`}
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
                    })
                  )}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </div>
        ))}
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

export default List;
