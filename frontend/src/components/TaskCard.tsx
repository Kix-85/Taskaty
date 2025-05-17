import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

interface TaskCardProps {
  title: string;
  description: string;
  dueDate: string;
  status: string;
  progress: number;
  assignedTo: { name: string; email: string }[];
  className?: string;
}

const TaskCard = ({
  title,
  description,
  dueDate,
  status,
  progress,
  assignedTo = [],
  className,
}: TaskCardProps) => {
  const statusColors = {
    'completed': "bg-green-100 text-green-800",
    'in-progress': "bg-yellow-100 text-yellow-800",
    'todo': "bg-blue-100 text-blue-800",
    'overdue': "bg-red-100 text-red-800",
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className={cn("task-card p-4 rounded-lg shadow-sm border bg-card", className)}>
      <div className="flex justify-between items-start mb-2">
        <h3 className="font-semibold text-gray-800">{title}</h3>
        <Badge className={cn("font-normal", statusColors[status as keyof typeof statusColors] || "bg-gray-100 text-gray-800")}>
          {status}
        </Badge>
      </div>
      <p className="text-sm text-gray-600 mb-3 line-clamp-2">{description}</p>
      <div className="mb-3">
        <div className="flex justify-between text-xs text-gray-500 mb-1">
          <span>Progress</span>
          <span>{progress}%</span>
        </div>
        <Progress value={progress} className="h-1.5" />
      </div>
      <div className="flex justify-between items-center">
        <div className="flex -space-x-2">
          {assignedTo.map((assignee, index) => (
            <div
              key={assignee.email}
              className="w-7 h-7 rounded-full bg-blue-500 flex items-center justify-center text-white text-xs font-medium border-2 border-white"
              title={assignee.name}
            >
              {getInitials(assignee.name)}
            </div>
          ))}
        </div>
        <span className="text-xs text-gray-500">Due {new Date(dueDate).toLocaleDateString()}</span>
      </div>
    </div>
  );
};

export default TaskCard;
