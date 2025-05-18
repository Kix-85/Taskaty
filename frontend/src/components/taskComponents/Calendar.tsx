import { useState, useMemo } from 'react';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight } from 'lucide-react';
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { Task, TaskGroups } from '@/types/task';
import TaskCard from './TaskCard';
import { format, isSameDay, isToday } from 'date-fns';

interface CalendarViewProps {
  tasks: TaskGroups;
  onTaskEdit: (task: Task) => void;
}

const Calendar = ({ tasks, onTaskEdit }: CalendarViewProps) => {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [view, setView] = useState<'month' | 'day'>('month');

  const allTasks = Object.values(tasks).flat();

  const getTasksForDate = (date: Date) => {
    return allTasks.filter(task => {
      if (!task.dueDate) return false;
      const taskDate = new Date(task.dueDate);
      return isSameDay(taskDate, date);
    });
  };

  const tasksByDate = useMemo(() => {
    const map = new Map<string, Task[]>();
    allTasks.forEach(task => {
      if (!task.dueDate) return;
      const dateStr = format(new Date(task.dueDate), 'yyyy-MM-dd');
      const existing = map.get(dateStr) || [];
      map.set(dateStr, [...existing, task]);
    });
    return map;
  }, [allTasks]);

  const selectedDateTasks = date ? getTasksForDate(date) : [];

  const modifiers = useMemo(() => {
    const today = new Date();
    return {
      taskDay: (day: Date) => {
        const dateStr = format(day, 'yyyy-MM-dd');
        return tasksByDate.has(dateStr);
      },
      today: (day: Date) => isToday(day)
    };
  }, [tasksByDate]);

  const modifiersStyles = {
    taskDay: {
      backgroundColor: 'var(--primary-50)',
      borderRadius: '50%'
    },
    today: {
      backgroundColor: 'var(--primary-100)',
      borderRadius: '50%',
      fontWeight: 'bold'
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-[300px_1fr] gap-4">
      <div className="space-y-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="flex items-center gap-2">
              <CalendarIcon className="h-5 w-5" />
              Calendar
            </CardTitle>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setView(view === 'month' ? 'day' : 'month')}
              >
                {view === 'month' ? 'Day View' : 'Month View'}
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <CalendarComponent
              mode="single"
              selected={date}
              onSelect={setDate}
              className="rounded-md border"
              modifiers={modifiers}
              modifiersStyles={modifiersStyles}
              components={{
                DayContent: ({ date }) => {
                  const dateStr = format(date, 'yyyy-MM-dd');
                  const tasksForDay = tasksByDate.get(dateStr) || [];
                  return (
                    <div className="relative w-full h-full flex items-center justify-center">
                      <span>{format(date, 'd')}</span>
                      {tasksForDay.length > 0 && (
                        <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 flex gap-0.5">
                          {tasksForDay.slice(0, 3).map((_, i) => (
                            <div
                              key={i}
                              className="w-1 h-1 rounded-full bg-primary"
                            />
                          ))}
                          {tasksForDay.length > 3 && (
                            <div className="w-1 h-1 rounded-full bg-primary opacity-50" />
                          )}
                        </div>
                      )}
                    </div>
                  );
                }
              }}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Task Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span>Total Tasks</span>
                <Badge variant="outline">{allTasks.length}</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span>Due Today</span>
                <Badge variant="outline">
                  {getTasksForDate(new Date()).length}
                </Badge>
              </div>
              <div className="flex justify-between items-center">
                <span>Selected Date</span>
                <Badge variant="outline">
                  {date ? selectedDateTasks.length : 0}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle>
            {date ? (
              <div className="flex items-center gap-4">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => {
                    const newDate = new Date(date);
                    newDate.setDate(newDate.getDate() - 1);
                    setDate(newDate);
                  }}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <span>
                  {format(date, 'EEEE, MMMM d, yyyy')}
                </span>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => {
                    const newDate = new Date(date);
                    newDate.setDate(newDate.getDate() + 1);
                    setDate(newDate);
                  }}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              'Select a date'
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[calc(100vh-300px)]">
            <div className="space-y-4">
              {selectedDateTasks.length === 0 ? (
                <div className="text-center text-muted-foreground py-8">
                  No tasks due on this date
                </div>
              ) : (
                selectedDateTasks.map(task => (
                  <TaskCard
                    key={task._id}
                    task={task}
                    onEdit={onTaskEdit}
                  />
                ))
              )}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
};

export default Calendar;
