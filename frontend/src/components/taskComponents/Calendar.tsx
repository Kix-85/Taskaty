import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import type { Task, TaskGroups } from "@/types/task";

interface CalendarProps {
  tasks: TaskGroups;
}

const Calendar = ({ tasks }: CalendarProps) => {
  // Flatten all tasks into a single array
  const allTasks = Object.values(tasks).flat();

  // Group tasks by due date
  const tasksByDate = allTasks.reduce((acc, task) => {
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

  return (
    <div className="space-y-6">
      {sortedDates.map(date => (
        <div key={date} className="bg-gray-50 rounded-lg p-4">
          <h3 className="text-lg font-semibold mb-4">{date}</h3>
          <div className="space-y-4">
            {tasksByDate[date].map(task => (
              <Card key={task.id} className="hover:shadow-md transition-shadow">
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
                      <span>Priority: {task.priority}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default Calendar;
