import React, { useState } from "react";
import TaskCard from "@/components/TaskCard";
import { X, Pencil, Eye, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";

type Task = {
  id: string;
  title: string;
  description: string;
  dueDate: string;
  priority: "low" | "medium" | "high";
  progress: number;
  assignees: { name: string; initial: string }[];
  status: string;
};

type TaskGroups = {
  "To Do": Task[];
  "In Progress": Task[];
  "Done": Task[];
};

type ListProps = {
  tasks: TaskGroups;
};

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

const List: React.FC<ListProps> = ({ tasks }) => {
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  const handleTaskDoubleClick = (task: Task) => {
    setSelectedTask(task);
  };

  return (
    <>
      <div className="p-2 space-y-4 rounded-lg border bg-card/50 backdrop-blur-sm shadow-sm h-full">
        {Object.entries(tasks).map(([status, statusTasks]) => (
          <div key={status} className="mb-6">
            <h3 className="text-lg font-semibold mb-3 capitalize">{status}</h3>
            <div className="space-y-4">
              {statusTasks.map((task) => (
                <div
                  key={task.id}
                  onDoubleClick={() => handleTaskDoubleClick(task)}
                  className="cursor-pointer"
                >
                  <TaskCard
                    title={task.title}
                    description={task.description}
                    dueDate={task.dueDate}
                    priority={task.priority}
                    progress={task.progress}
                    assignees={task.assignees}
                    className="transition-all duration-200 hover:shadow-md"
                  />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
      {selectedTask && (
        <TaskModal task={selectedTask} onClose={() => setSelectedTask(null)} />
      )}
    </>
  );
};

export default List;
