import React from 'react';

type Task = {
  id: string;
  title: string;
  description: string;
  startDate: string;
  dueDate: string;
  priority: "low" | "medium" | "high";
  progress: number;
  assignees: { name: string; initial: string }[];
  status: string;
};

interface DayBoxProps {
  date: Date;
  tasks: Task[];
}

const DayBox: React.FC<DayBoxProps> = ({ date, tasks }) => {
  const isToday = new Date().toDateString() === date.toDateString();
  const isCurrentMonth = date.getMonth() === new Date().getMonth();
  const isoDate = date.toISOString().split('T')[0];

  // Filter tasks that either start or are due on this date
  const relevantTasks = tasks.filter(task => 
    task.startDate === isoDate || task.dueDate === isoDate
  );

  return (
    <div 
      className={`
        min-h-[120px] p-2 border border-border/50
        ${isToday ? 'bg-accent/10' : ''}
        ${!isCurrentMonth ? 'bg-muted/5' : ''}
        hover:bg-accent/5 transition-colors
      `}
    >
      <div className="flex justify-between items-start mb-1">
        <span className={`
          text-sm font-medium
          ${isToday ? 'text-accent-foreground' : 'text-muted-foreground'}
          ${!isCurrentMonth ? 'opacity-50' : ''}
        `}>
          {date.getDate()}
        </span>
        {relevantTasks.length > 0 && (
          <span className="text-xs bg-primary/10 text-primary px-1.5 py-0.5 rounded-full">
            {relevantTasks.length}
          </span>
        )}
      </div>
      
      <div className="space-y-1">
        {relevantTasks.slice(0, 3).map((task) => (
          <div
            key={task.id}
            className="text-xs p-1 rounded bg-card hover:bg-accent/10 transition-colors cursor-pointer"
            title={task.title}
          >
            <div className="truncate">{task.title}</div>
            <div className="flex items-center gap-1 mt-0.5">
              <div className={`
                w-1.5 h-1.5 rounded-full
                ${task.priority === 'high' ? 'bg-red-500' : 
                  task.priority === 'medium' ? 'bg-yellow-500' : 'bg-green-500'}
              `} />
              <span className="text-[10px] text-muted-foreground">
                {task.startDate === isoDate ? 'Starts' : 'Due'}
              </span>
            </div>
          </div>
        ))}
        {relevantTasks.length > 3 && (
          <div className="text-xs text-muted-foreground text-center">
            +{relevantTasks.length - 3} more
          </div>
        )}
      </div>
    </div>
  );
};

export default DayBox;
