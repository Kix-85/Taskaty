export type Task = {
  id: string;
  title: string;
  content: string;
  description: string;
  startDate: string;
  dueDate: string;
  priority: "low" | "medium" | "high";
  progress: number;
  assignees: { name: string; initial: string }[];
  status: string;
  subscribes: number;
};

export type TaskGroups = {
  "To Do": Task[];
  "In Progress": Task[];
  "Done": Task[];
}; 