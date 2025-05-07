
import React from "react";
import { TaskCard } from "@/components/TaskCard";

const List: React.FC = () => {
  // Sample task data
  const tasks = [
    {
      title: "Design System",
      description: "Create a comprehensive design system for the application",
      dueDate: "Tomorrow",
      priority: "high" as const,
      progress: 60,
      assignees: [{ name: "John Doe", initial: "J" }, { name: "Jane Smith", initial: "S" }]
    },
    {
      title: "API Integration",
      description: "Connect backend services with the frontend application",
      dueDate: "Next week",
      priority: "medium" as const,
      progress: 30,
      assignees: [{ name: "Alex Johnson", initial: "A" }]
    },
    {
      title: "User Testing",
      description: "Conduct user testing sessions to gather feedback",
      dueDate: "In 2 days",
      priority: "low" as const,
      progress: 10,
      assignees: [{ name: "Mike Brown", initial: "M" }, { name: "Sarah Lee", initial: "S" }]
    },
    {
      title: "Documentation",
      description: "Write documentation for developers and end users",
      dueDate: "Friday",
      priority: "medium" as const,
      progress: 80,
      assignees: [{ name: "Emily Chen", initial: "E" }]
    }
  ];

  return (
    <div className="p-2 space-y-4 rounded-lg border bg-card/50 backdrop-blur-sm shadow-sm h-full">
      {tasks.map((task, index) => (
        <TaskCard
          key={index}
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
  );
};

export default List;
