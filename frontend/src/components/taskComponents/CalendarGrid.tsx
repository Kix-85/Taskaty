
import React from 'react';
import DayBox from './DayBox';

interface CalendarGridProps {
  tasks: Record<string, string[]>;
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
        <DayBox key={isoDate} date={date} tasks={tasksForDate} />
      );
    }

    return days;
  };

  const daysOfTheWeek = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  return (
    <div className="grid grid-cols-7 p-4 h-full">
      {/* Days of week headers */}
      {daysOfTheWeek.map((day, index) => (
        <div key={index} className="text-white font-sm font-lighter pl-2 border border-white/10 backdrop-filter backdrop-blur-md">{day}</div>
      ))}

      {/* Empty slots */}
      {[...Array(startDay)].map((_, index) => (
        <div key={`empty-${index}`} className="h-28"></div>
      ))}

      {/* Actual days */}
      {renderDays()}
    </div>
  );
};

export default CalendarGrid;
