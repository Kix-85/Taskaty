import { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Edit, ChevronDown, ChevronUp, Plus, Trash, Calendar, Clock } from "lucide-react";
import { useTaskStore } from "@/store/taskStore";
import { Task, SubTask } from "@/types/task";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { format } from "date-fns";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

interface TaskCardProps {
  task: Task;
  onEdit: (task: Task) => void;
}

const TaskCard = ({ task, onEdit }: TaskCardProps) => {
  const { expandedTaskId, setExpandedTaskId, createSubTask, updateSubTask, deleteSubTask } = useTaskStore();
  const [newSubTask, setNewSubTask] = useState({ title: '', description: '' });
  const [isAddingSubTask, setIsAddingSubTask] = useState(false);

  const isExpanded = expandedTaskId === task._id;

  const handleExpandClick = () => {
    setExpandedTaskId(isExpanded ? null : task._id);
  };

  const handleAddSubTaskClick = () => {
    setIsAddingSubTask(true);
  };

  const handleSubTaskSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSubTask.title.trim()) return;

    try {
      await createSubTask(task._id, {
        title: newSubTask.title,
        description: newSubTask.description,
        completed: false
      });
      setNewSubTask({ title: '', description: '' });
      setIsAddingSubTask(false);
    } catch (error) {
      console.error('Error creating subtask:', error);
    }
  };

  const handleSubTaskToggle = async (subTask: SubTask) => {
    try {
      await updateSubTask(task._id, subTask._id, {
        ...subTask,
        completed: !subTask.completed
      });
    } catch (error) {
      console.error('Error updating subtask:', error);
    }
  };

  const handleSubTaskDelete = async (subTaskId: string) => {
    try {
      await deleteSubTask(task._id, subTaskId);
    } catch (error) {
      console.error('Error deleting subtask:', error);
    }
  };

  const getPriorityColor = (priority: Task['priority']) => {
    switch (priority) {
      case 'high':
        return 'bg-red-500/10 text-red-700 dark:text-red-400';
      case 'medium':
        return 'bg-yellow-500/10 text-yellow-700 dark:text-yellow-400';
      case 'low':
        return 'bg-green-500/10 text-green-700 dark:text-green-400';
      default:
        return 'bg-gray-500/10 text-gray-700 dark:text-gray-400';
    }
  };

  const getStatusColor = (status: Task['status']) => {
    switch (status) {
      case 'todo':
        return 'bg-gray-500/10 text-gray-700 dark:text-gray-400';
      case 'in progress':
        return 'bg-blue-500/10 text-blue-700 dark:text-blue-400';
      case 'done':
        return 'bg-green-500/10 text-green-700 dark:text-green-400';
      default:
        return 'bg-gray-500/10 text-gray-700 dark:text-gray-400';
    }
  };

  const calculateProgress = () => {
    if (!task.subtasks?.length) return task.progress || 0;
    const completed = task.subtasks.filter(st => st.completed).length;
    return Math.round((completed / task.subtasks.length) * 100);
  };

  return (
    <Card className="w-full transition-all duration-200 hover:shadow-md group">
      <CardHeader className="space-y-2 p-4">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 space-y-1">
            <CardTitle className="text-base line-clamp-2">{task.name}</CardTitle>
            <CardDescription className="line-clamp-2">
              {task.description}
            </CardDescription>
          </div>
          <div className="flex items-start gap-1">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onEdit(task)}
                  className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <Edit className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Edit task</TooltipContent>
            </Tooltip>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleExpandClick}
              className="h-8 w-8"
            >
              {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </Button>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 items-center">
          <Badge variant="secondary" className={getPriorityColor(task.priority)}>
            {task.priority}
          </Badge>
          <Badge variant="secondary" className={getStatusColor(task.status)}>
            {task.status}
          </Badge>
          {task.project && (
            <Badge variant="outline" className="max-w-[150px] truncate">
              {task.project.name}
            </Badge>
          )}
        </div>

        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <Calendar className="h-4 w-4" />
            <span>{format(new Date(task.dueDate), 'MMM d')}</span>
          </div>
          <div className="flex items-center gap-1">
            <Clock className="h-4 w-4" />
            <span>{format(new Date(task.dueDate), 'h:mm a')}</span>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-4 pt-0">
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Progress</span>
            <span className="font-medium">{calculateProgress()}%</span>
          </div>
          <Progress value={calculateProgress()} className="h-2" />
        </div>

        {task.assignees && task.assignees.length > 0 && (
          <div className="mt-4 flex items-center gap-2">
            <div className="flex -space-x-2">
              {task.assignees.map((assignee, index) => (
                <Tooltip key={assignee._id}>
                  <TooltipTrigger asChild>
                    <Avatar className="h-6 w-6 border-2 border-background">
                      <AvatarImage src={assignee.avatar} alt={assignee.name} />
                      <AvatarFallback>
                        {assignee.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                  </TooltipTrigger>
                  <TooltipContent>{assignee.name}</TooltipContent>
                </Tooltip>
              ))}
            </div>
            {task.assignees.length > 3 && (
              <span className="text-sm text-muted-foreground">
                +{task.assignees.length - 3} more
              </span>
            )}
          </div>
        )}

        {isExpanded && (
          <div className="mt-4 space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-medium">Subtasks</h4>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleAddSubTaskClick}
                className="h-8 px-2"
              >
                <Plus className="h-4 w-4 mr-1" />
                Add
              </Button>
            </div>

            {isAddingSubTask && (
              <form onSubmit={handleSubTaskSubmit} className="space-y-2">
                <Input
                  placeholder="Subtask title"
                  value={newSubTask.title}
                  onChange={(e) => setNewSubTask({ ...newSubTask, title: e.target.value })}
                  className="text-sm"
                />
                <Textarea
                  placeholder="Description (optional)"
                  value={newSubTask.description}
                  onChange={(e) => setNewSubTask({ ...newSubTask, description: e.target.value })}
                  className="text-sm min-h-[60px]"
                />
                <div className="flex justify-end gap-2">
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsAddingSubTask(false)}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" size="sm">
                    Add Subtask
                  </Button>
                </div>
              </form>
            )}

            <div className="space-y-2">
              {task.subtasks?.map((subTask) => (
                <div
                  key={subTask._id}
                  className="flex items-start gap-2 p-2 rounded-lg hover:bg-muted/50"
                >
                  <Checkbox
                    checked={subTask.completed}
                    onCheckedChange={() => handleSubTaskToggle(subTask)}
                  />
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm ${subTask.completed ? 'line-through text-muted-foreground' : ''}`}>
                      {subTask.title}
                    </p>
                    {subTask.description && (
                      <p className="text-xs text-muted-foreground line-clamp-2">
                        {subTask.description}
                      </p>
                    )}
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleSubTaskDelete(subTask._id)}
                    className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Trash className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default TaskCard; 