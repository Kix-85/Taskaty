import { useState } from 'react';
import type { TaskGroups } from '@/types/task';

interface CalendarProps {
  tasks: TaskGroups;
}

const Calendar = ({ tasks }: CalendarProps) => {
  const [currentDate, setCurrentDate] = useState(new Date());

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const firstDayOfMonth = new Date(year, month, 1).getDay();
    return { daysInMonth, firstDayOfMonth };
  };

  const { daysInMonth, firstDayOfMonth } = getDaysInMonth(currentDate);

  const renderCalendarDays = () => {
    const days = [];
    const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 
                       'July', 'August', 'September', 'October', 'November', 'December'];

    // Add month header
    days.push(
      <div key="month-header" className="col-span-7 text-center py-2 font-semibold text-lg text-gray-900 dark:text-white">
        {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
      </div>
    );

    // Add day names header
    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    dayNames.forEach(day => {
      days.push(
        <div key={day} className="text-center py-2 font-medium text-sm text-gray-600 dark:text-gray-400">
          {day}
        </div>
      );
    });

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push(<div key={`empty-${i}`} className="aspect-square"></div>);
    }

    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const isToday = new Date().toDateString() === new Date(currentDate.getFullYear(), currentDate.getMonth(), day).toDateString();
      
      days.push(
        <div
          key={day}
          className={`aspect-square p-2 border border-gray-200 dark:border-gray-700 rounded-lg 
            ${isToday ? 'bg-primary-100 dark:bg-primary-900' : 'bg-white dark:bg-gray-800'}
            hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200`}
        >
          <div className="text-sm font-medium text-gray-900 dark:text-white mb-1">
            {day}
          </div>
          <div className="space-y-1">
            {Object.entries(tasks).map(([status, taskList]) => {
              const dayTasks = taskList.filter(task => {
                const taskDate = new Date(task.dueDate);
                return taskDate.getDate() === day && 
                       taskDate.getMonth() === currentDate.getMonth() && 
                       taskDate.getFullYear() === currentDate.getFullYear();
              });

              if (dayTasks.length === 0) return null;

              return (
                <div key={status} className="text-xs truncate">
                  <span className={`inline-block w-2 h-2 rounded-full mr-1 ${
                    status === 'To Do' ? 'bg-yellow-500' :
                    status === 'In Progress' ? 'bg-blue-500' :
                    'bg-green-500'
                  }`}></span>
                  {dayTasks.length} {status}
                </div>
              );
            })}
          </div>
        </div>
      );
    }

    return days;
  };

  return (
    <div className="w-full">
      <div className="grid grid-cols-7 gap-2 sm:gap-4">
        {renderCalendarDays()}
      </div>
    </div>
  );
};

export default Calendar;
