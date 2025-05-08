import React from 'react';
import DayBox from './DayBox';
import { Task } from '@/types/task';

interface CalendarGridProps {
  tasks: Record<string, Task[]>;
  currentMonth: number;
  currentYear: number;
}

const CalendarGrid: React.FC<CalendarGridProps> = ({ tasks, currentMonth, currentYear }) => {
  const firstDay = new Date(currentYear, currentMonth, 1);
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const startDay = (firstDay.getDay() + 6) % 7;

  const renderDays = () => {
    const days = [];

    for (let i = 0; i < daysInMonth; i++) {
      const date = new Date(currentYear, currentMonth, i + 1);
      const isoDate = date.toISOString().split('T')[0];
      const tasksForDate = tasks[isoDate] || [];
      days.push(
        <DayBox 
          key={isoDate} 
          date={date} 
          tasks={tasksForDate} 
        />
      );
    }

    return days;
  };

  const daysOfTheWeek = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  return (
    <div className="grid grid-cols-7 h-full">
      {/* Days of week headers */}
      <div className="col-span-7 grid grid-cols-7 border-b">
        {daysOfTheWeek.map((day, index) => (
          <div 
            key={index} 
            className="p-2 text-sm font-medium text-muted-foreground text-center"
          >
            {day}
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="col-span-7 grid grid-cols-7 auto-rows-fr">
        {/* Empty slots */}
        {[...Array(startDay)].map((_, index) => (
          <div 
            key={`empty-${index}`} 
            className="border border-border/50 bg-muted/10"
          />
        ))}

        {/* Actual days */}
        {renderDays()}
      </div>
    </div>
  );
};

export default CalendarGrid;
