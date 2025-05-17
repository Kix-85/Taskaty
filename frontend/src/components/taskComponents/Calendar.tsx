import { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import type { Task, TaskGroups } from "@/types/task";
import TaskEditModal from './TaskEditModal';

interface CalendarProps {
  tasks: TaskGroups;
}

const Calendar = ({ tasks }: CalendarProps) => {
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  // Flatten all tasks into a single array
  const allTasks = Object.values(tasks).flat();

  // Group tasks by due date
  const tasksByDate = allTasks.reduce((acc, task) => {
    if (!task.dueDate) return acc;
    const date = new Date(task.dueDate).toLocaleDateString();
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(task);
    return acc;
  }, {} as Record<string, Task[]>);

  // Sort dates
  const sortedDates = Object.keys(tasksByDate).sort((a, b) => 
    new Date(a).getTime() - new Date(b).getTime()
  );

  const handleTaskClick = (task: Task) => {
    setSelectedTask(task);
    setIsEditModalOpen(true);
  };

  return (
    <>
      <div className="space-y-6">
        {sortedDates.map(date => (
          <div key={date} className="bg-card rounded-lg p-4 border">
            <h3 className="text-lg font-semibold mb-4 text-foreground">{date}</h3>
            <div className="space-y-4">
              {tasksByDate[date].map(task => {
                if (!task || !task._id) {
                  console.warn('Skipping task with no _id:', task);
                  return null;
                }

                return (
                  <Card 
                    key={`${date}-${task._id}`} 
                    className="hover:shadow-md transition-all duration-200 bg-card cursor-pointer"
                    onClick={() => handleTaskClick(task)}
                  >
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-medium text-foreground">{task.name}</h3>
                        <span className={`px-2 py-1 rounded text-white text-sm ${
                          task.status === 'todo' ? 'bg-gray-500' :
                          task.status === 'in progress' ? 'bg-blue-500' :
                          'bg-green-500'
                        }`}>
                          {task.status}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground mb-4">{task.description}</p>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm text-foreground">
                          <span>Progress</span>
                          <span>{task.progress || 0}%</span>
                        </div>
                        <Progress value={task.progress || 0} />
                        <div className="flex justify-between text-sm text-muted-foreground">
                          <span>Priority: {task.priority}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        ))}
      </div>

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
    </>
  );
};

export default Calendar;
