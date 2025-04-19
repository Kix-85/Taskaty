"use client";
import React, { useState } from 'react';
import CalendarGrid from '../../components/Calendar/CalendarGrid';

const Calendar: React.FC = () => {
    // State for managing the selected view (Kanban, List, Calendar, etc.)
    const [selectedView, setSelectedView] = useState('Calendar');

    // State for managing the current month and year
    const [currentMonth, setCurrentMonth] = useState(2);
    const [currentYear, setCurrentYear] = useState(2024);

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

    // Handler for switching between views (Kanban, List, Calendar, etc.)
    const handleTabChange = (view: string) => {
        setSelectedView(view);
    };

    // Handler for changing the month and year
    const handleMonthChange = (month: number, year: number) => {
        setCurrentMonth(month);
        setCurrentYear(year);
    };

    console.log('Calendar view')

    return (
        <div className="bg-gray-900 min-h-screen flex flex-col p-2">
            {/* You can add your header and pass the handle methods as props to change the props internally */}

            <div className="mt-4">
                {selectedView === 'Calendar' && (
                    <CalendarGrid
                        tasks={tasks}
                        currentMonth={currentMonth}
                        currentYear={currentYear}
                    />
                )}
            </div>
        </div>

    );
};

export default Calendar;