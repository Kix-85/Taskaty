
import React, { useState } from 'react';
import CalendarGrid from './CalendarGrid';

const Calendar: React.FC = () => {
  // State for managing the current month and year
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());

  // Example tasks data (you can replace this with API data later)
  const tasks: Record<string, string[]> = {
    '2024-04-01': ['Create a design system'],
    '2024-04-04': ['API Integration: Connect services'],
    '2024-04-05': ['Creating an interactive prototype'],
    '2024-04-06': ['Performance Optimization'],
    '2024-04-07': ['Design informative artboards'],
    '2024-04-08': ['Pre-Publishing: Collect feedback'],
    '2024-04-10': ['Audience analysis. Study user behavior'],
    '2024-04-11': ['Design the application layout'],
    '2024-04-12': ['Function Implementation'],
    '2024-04-13': ['Multi-User Support: Implement features'],
  };

  // Handler for changing the month and year
  const handleMonthChange = (month: number, year: number) => {
    setCurrentMonth(month);
    setCurrentYear(year);
  };

  return (
    <div className="h-full flex flex-col rounded-lg border bg-card/50 backdrop-blur-sm shadow-sm">
      <div className="flex-1">
        <CalendarGrid
          tasks={tasks}
          currentMonth={currentMonth}
          currentYear={currentYear}
        />
      </div>
    </div>
  );
};

export default Calendar;
