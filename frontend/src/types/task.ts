export interface SubTask {
  _id: string;
  title: string;
  description?: string;
  completed: boolean;
}

export interface Task {
  _id: string;
  name: string;
  description: string;
  project?: {
    _id: string;
    name: string;
    logo?: string;
  };
  status: 'todo' | 'in progress' | 'done';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  dueDate?: string;
  assignedTo?: {
    _id: string;
    name: string;
    email: string;
    avatar?: string;
  }[];
  createdBy?: {
    _id: string;
    name: string;
    email: string;
    avatar?: string;
  };
  tags?: string[];
  subtasks: SubTask[];
  attachments?: {
    name: string;
    url: string;
    type: string;
  }[];
  comments?: {
    _id: string;
    user: {
      _id: string;
      name: string;
      email: string;
      avatar?: string;
    };
    content: string;
    createdAt: string;
  }[];
  estimatedTime?: number;
  actualTime?: number;
  progress: number;
  isRecurring?: boolean;
  recurrencePattern?: 'daily' | 'weekly' | 'monthly' | 'none';
  createdAt: string;
  updatedAt: string;
}

export interface TaskGroups {
  'To Do': Task[];
  'In Progress': Task[];
  'Done': Task[];
} 