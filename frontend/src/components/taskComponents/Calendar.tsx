import React, { useState } from 'react';
import CalendarGrid from './CalendarGrid';
import { Task, TaskGroups } from '@/types/task';

type CalendarProps = {
  tasks: TaskGroups;
};

const Calendar: React.FC<CalendarProps> = ({ tasks }) => {
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());

  // Convert task groups to calendar format, including both start and due dates
  const calendarTasks = Object.values(tasks).reduce((acc, taskGroup) => {
    taskGroup.forEach(task => {
      // Add task to start date
      if (!acc[task.startDate]) {
        acc[task.startDate] = [];
      }
      acc[task.startDate].push(task);

      // Add task to due date if different from start date
      if (task.dueDate !== task.startDate) {
        if (!acc[task.dueDate]) {
          acc[task.dueDate] = [];
        }
        acc[task.dueDate].push(task);
      }
    });
    return acc;
  }, {} as Record<string, Task[]>);

  const handleMonthChange = (month: number, year: number) => {
    setCurrentMonth(month);
    setCurrentYear(year);
  };

  return (
    <div className="h-full flex flex-col rounded-lg border bg-card/50 backdrop-blur-sm shadow-sm">
      <div className="flex items-center justify-between p-4 border-b">
        <h2 className="text-xl font-semibold">
          {new Date(currentYear, currentMonth).toLocaleString('default', { month: 'long', year: 'numeric' })}
        </h2>
        <div className="flex gap-2">
          <button
            onClick={() => handleMonthChange(currentMonth - 1, currentYear)}
            className="p-2 hover:bg-accent rounded-md transition-colors"
          >
            ←
          </button>
          <button
            onClick={() => handleMonthChange(currentMonth + 1, currentYear)}
            className="p-2 hover:bg-accent rounded-md transition-colors"
          >
            →
          </button>
        </div>
      </div>
      <div className="flex-1 overflow-auto">
        <CalendarGrid
          tasks={calendarTasks}
          currentMonth={currentMonth}
          currentYear={currentYear}
        />
      </div>
    </div>
  );
};

export default Calendar;
