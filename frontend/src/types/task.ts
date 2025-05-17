export type Task = {
  _id: string;
  name: string;
  description: string;
  status: string;
  priority: "low" | "medium" | "high";
  progress?: number;
  dueDate?: string;
  project?: {
    _id: string;
    name: string;
  };
  assignees?: { name: string; initial: string }[];
  comments?: any[];
  createdAt?: string;
  updatedAt?: string;
};

export type TaskGroups = {
  "To Do": Task[];
  "In Progress": Task[];
  "Done": Task[];
}; 