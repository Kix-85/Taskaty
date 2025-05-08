import React from "react";
import TaskCard from "@/components/TaskCard";

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

const List: React.FC<ListProps> = ({ tasks }) => {
  return (
    <div className="p-2 space-y-4 rounded-lg border bg-card/50 backdrop-blur-sm shadow-sm h-full">
      {Object.entries(tasks).map(([status, statusTasks]) => (
        <div key={status} className="mb-6">
          <h3 className="text-lg font-semibold mb-3 capitalize">{status}</h3>
          <div className="space-y-4">
            {statusTasks.map((task) => (
              <TaskCard
                key={task.id}
                title={task.title}
                description={task.description}
                dueDate={task.dueDate}
                priority={task.priority}
                progress={task.progress}
                assignees={task.assignees}
                className="transition-all duration-200 hover:shadow-md"
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default List;
