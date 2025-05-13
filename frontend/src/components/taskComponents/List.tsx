import React, { useState } from "react";
import TaskCard from "@/components/TaskCard";
import { X, Pencil, Eye, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import type { Task, TaskGroups } from "@/types/task";

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
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  const handleTaskDoubleClick = (task: Task) => {
    setSelectedTask(task);
  };

  const handleDragEnd = (result: any) => {
    if (!result.destination || !onTaskMove) return;
    onTaskMove(result);
  };

  return (
    <>
      <DragDropContext onDragEnd={handleDragEnd}>
        {Object.entries(tasks).map(([status, statusTasks]) => (
          <div key={status} className="mb-8">
            <h3 className="text-lg font-semibold mb-4 capitalize">{status}</h3>
            <Droppable droppableId={status}>
              {(provided) => (
                <div
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                  className="space-y-4"
                >
                  {statusTasks.map((task, index) => (
                    <Draggable key={task.id} draggableId={task.id} index={index}>
                      {(provided) => (
                        <Card
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          className="hover:shadow-md transition-shadow"
                        >
                          <CardContent className="p-4">
                            <div className="flex justify-between items-start mb-2">
                              <h3 className="font-medium">{task.title}</h3>
                              <span className={`px-2 py-1 rounded text-white text-sm ${
                                task.status === 'To Do' ? 'bg-gray-500' :
                                task.status === 'In Progress' ? 'bg-blue-500' :
                                'bg-green-500'
                              }`}>
                                {task.status}
                              </span>
                            </div>
                            <p className="text-sm text-gray-500 mb-4">{task.description}</p>
                            <div className="space-y-2">
                              <div className="flex justify-between text-sm">
                                <span>Progress</span>
                                <span>{task.progress}%</span>
                              </div>
                              <Progress value={task.progress} />
                              <div className="flex justify-between text-sm text-gray-500">
                                <span>Due: {new Date(task.dueDate).toLocaleDateString()}</span>
                                <span>Priority: {task.priority}</span>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </div>
        ))}
      </DragDropContext>
      {selectedTask && (
        <TaskModal task={selectedTask} onClose={() => setSelectedTask(null)} />
      )}
    </>
  );
};

export default List;
