import React, { useState } from "react";
import TaskCard from "@/components/TaskCard";
import { X, Pencil, Eye, Trash2, ChevronDown, ChevronUp, CheckSquare, Square } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';
import { Card, CardContent } from "@/components/ui/card";
import type { Task, TaskGroups, SubTask } from "@/types/task";
import { useTaskStore } from '@/store/taskStore';
import { toast } from 'sonner';
import TaskEditModal from './TaskEditModal';
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

interface ListProps {
  tasks: TaskGroups;
  onTaskMove: (result: DropResult) => void;
  onTaskEdit: (task: Task) => void;
}

interface TaskItemProps {
  task: Task;
  onEdit: () => void;
}

const TaskItem = ({ task, onEdit }: TaskItemProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const { updateTask } = useTaskStore();

  const handleSubtaskToggle = async (subtask: SubTask) => {
    try {
      const updatedSubtasks = task.subtasks.map(st => 
        st._id === subtask._id ? { ...st, completed: !st.completed } : st
      );
      
      await updateTask(task._id, { 
        subtasks: updatedSubtasks,
        progress: Math.round((updatedSubtasks.filter(st => st.completed).length / updatedSubtasks.length) * 100)
      });
      toast.success('Subtask updated');
    } catch (error) {
      toast.error('Failed to update subtask');
    }
  };

  return (
    <Collapsible open={isExpanded} onOpenChange={setIsExpanded}>
      <div className="bg-card rounded-lg border p-4 space-y-4">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <h3 className="font-semibold text-lg">{task.name}</h3>
              {task.priority && (
                <Badge variant={task.priority === 'urgent' ? 'destructive' : 'outline'}>
                  {task.priority}
                </Badge>
              )}
            </div>
            <p className="text-sm text-muted-foreground">{task.description}</p>
          </div>
          <Button variant="ghost" size="icon" onClick={() => setIsExpanded(!isExpanded)}>
            {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </Button>
        </div>

        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-4">
            {task.dueDate && (
              <span className="text-muted-foreground">
                Due: {new Date(task.dueDate).toLocaleDateString()}
              </span>
            )}
            {task.project && (
              <Badge variant="outline" className="font-normal">
                {task.project.name}
              </Badge>
            )}
          </div>
          <Button variant="outline" size="sm" onClick={onEdit}>
            Edit
          </Button>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Progress</span>
            <span>{task.progress}%</span>
          </div>
          <Progress value={task.progress} className="h-2" />
        </div>

        <CollapsibleContent>
          {task.subtasks.length > 0 && (
            <div className="space-y-2 mt-4">
              <h4 className="font-medium text-sm">Subtasks</h4>
              <div className="space-y-2">
                {task.subtasks.map((subtask) => (
                  <div
                    key={subtask._id}
                    className="flex items-center gap-2 p-2 rounded-md hover:bg-accent"
                    onClick={() => handleSubtaskToggle(subtask)}
                  >
                    {subtask.completed ? (
                      <CheckSquare className="h-4 w-4" />
                    ) : (
                      <Square className="h-4 w-4" />
                    )}
                    <span className={subtask.completed ? 'line-through text-muted-foreground' : ''}>
                      {subtask.title}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {task.assignedTo && task.assignedTo.length > 0 && (
            <div className="mt-4">
              <h4 className="font-medium text-sm mb-2">Assigned To</h4>
              <div className="flex -space-x-2">
                {task.assignedTo.map((user) => (
                  <div
                    key={user._id}
                    className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-xs border-2 border-background"
                    title={user.name}
                  >
                    {user.name.charAt(0)}
                  </div>
                ))}
              </div>
            </div>
          )}

          {task.tags && task.tags.length > 0 && (
            <div className="mt-4">
              <h4 className="font-medium text-sm mb-2">Tags</h4>
              <div className="flex flex-wrap gap-2">
                {task.tags.map((tag) => (
                  <Badge key={tag} variant="secondary">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </CollapsibleContent>
      </div>
    </Collapsible>
  );
};

const List = ({ tasks, onTaskMove, onTaskEdit }: ListProps) => {
  const { updateTask } = useTaskStore();
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const handleDragEnd = async (result: DropResult) => {
    if (!result.destination || !onTaskMove) return;

    const { source, destination, draggableId } = result;
    
    const sourceStatus = source.droppableId;
    const task = tasks[sourceStatus as keyof TaskGroups]?.find(t => t._id === draggableId);

    if (!task) return;

    const statusMap: { [key: string]: 'todo' | 'in progress' | 'done' } = {
      'To Do': 'todo',
      'In Progress': 'in progress',
      'Done': 'done'
    };

    const newStatus = statusMap[destination.droppableId];
    if (!newStatus) return;

    try {
      await updateTask(task._id, { status: newStatus });
      onTaskMove(result);
      toast.success('Task status updated successfully');
    } catch (error) {
      toast.error('Failed to update task status');
      console.error('Error updating task status:', error);
    }
  };

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <ScrollArea className="h-[calc(100vh-12rem)]">
        <div className="space-y-4 p-2 md:p-4">
          {Object.entries(tasks).map(([status, taskList]) => (
            <div key={status} className="space-y-2">
              <h3 className="font-medium text-sm text-muted-foreground">
                {status} ({taskList.length})
              </h3>
              <Droppable droppableId={status}>
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className={`space-y-2 min-h-[50px] transition-colors duration-200 rounded-lg ${
                      snapshot.isDraggingOver ? 'bg-muted/50' : ''
                    }`}
                  >
                    {taskList.map((task, index) => (
                      <Draggable
                        key={task._id}
                        draggableId={task._id}
                        index={index}
                      >
                        {(provided, snapshot) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            className={`transition-all duration-200 ${
                              snapshot.isDragging ? 'shadow-lg scale-105' : ''
                            }`}
                          >
                            <TaskItem
                              task={task}
                              onEdit={() => {
                                setSelectedTask(task);
                                setIsEditModalOpen(true);
                              }}
                            />
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                    {taskList.length === 0 && !snapshot.isDraggingOver && (
                      <div className="flex items-center justify-center h-[50px] border-2 border-dashed rounded-lg">
                        <p className="text-sm text-muted-foreground">Drop tasks here</p>
                      </div>
                    )}
                  </div>
                )}
              </Droppable>
            </div>
          ))}
        </div>
      </ScrollArea>

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
    </DragDropContext>
  );
};

export default List;
