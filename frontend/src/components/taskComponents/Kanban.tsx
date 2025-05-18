import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import type { Task, TaskGroups } from '@/types/task';
import TaskCard from './TaskCard';

interface KanbanProps {
  tasks: TaskGroups;
  onTaskMove: (result: any) => void;
  onTaskEdit: (task: Task) => void;
}

const Kanban = ({ tasks, onTaskMove, onTaskEdit }: KanbanProps) => {
  return (
    <DragDropContext onDragEnd={onTaskMove}>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-2 md:p-4">
        {Object.entries(tasks).map(([status, taskList]) => (
          <Card key={status} className="bg-muted/50">
            <CardHeader className="pb-2 sticky top-0 z-10 bg-muted/50 backdrop-blur-sm">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg font-medium">{status}</CardTitle>
                <span className="text-sm text-muted-foreground">
                  {taskList.length} {taskList.length === 1 ? 'task' : 'tasks'}
                </span>
              </div>
            </CardHeader>
            <CardContent className="p-2">
              <ScrollArea className="h-[calc(100vh-12rem)]">
                <Droppable droppableId={status}>
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                      className={`space-y-3 min-h-[200px] transition-colors duration-200 rounded-lg p-2 ${
                        snapshot.isDraggingOver ? 'bg-muted/80' : ''
                      } ${taskList.length === 0 ? 'flex items-center justify-center border-2 border-dashed' : ''}`}
                    >
                      {taskList.length === 0 && !snapshot.isDraggingOver && (
                        <p className="text-muted-foreground text-center text-sm">
                          Drop tasks here
                        </p>
                      )}
                      {taskList.map((task, index) => (
                        <Draggable
                          key={task._id}
                          draggableId={task._id}
                          index={index}
                        >
                          {(provided, snapshot) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              className={`transition-all duration-200 ${
                                snapshot.isDragging ? 'shadow-lg scale-105' : ''
                              }`}
                            >
                              <TaskCard
                                task={task}
                                onEdit={onTaskEdit}
                              />
                            </div>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </ScrollArea>
            </CardContent>
          </Card>
        ))}
      </div>
    </DragDropContext>
  );
};

export default Kanban;
