
import React from 'react';

interface DayBoxProps {
  date: Date;
  tasks: string[];
}

const DayBox: React.FC<DayBoxProps> = ({ date, tasks }) => {
  const dayNumber = date.getDate();

  return (
    <div className="relative h-28 backdrop-filter backdrop-blur-md border border-white/10 p-1 text-white shadow-md hover:bg-white/10 transition-all duration-200">
      <p className="absolute top-1 right-2 text-xs opacity-70">{dayNumber}</p>

      <div className="flex flex-col space-y-1 mt-5 overflow-hidden">
        {tasks.slice(0, 3).map((task, index) => (
          <div
            key={index}
            className="bg-white/20 rounded-md px-2 py-1 text-xs truncate backdrop-blur-md"
          >
            {task}
          </div>
        ))}

        {tasks.length > 3 && (
          <div className="text-xs text-gray-300">+{tasks.length - 3} more</div>
        )}
      </div>
    </div>
  );
};

export default DayBox;
