import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import type { Task, TaskGroups } from "@/types/task";

interface KanbanProps {
  tasks: TaskGroups;
  onTaskMove?: (result: any) => void;
}

const Kanban = ({ tasks, onTaskMove }: KanbanProps) => {
  const handleDragEnd = (result: any) => {
    if (!result.destination || !onTaskMove) return;
    onTaskMove(result);
  };

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {Object.entries(tasks).map(([status, statusTasks]) => (
          <div key={status} className="bg-gray-50 rounded-lg p-4">
            <h3 className="text-lg font-semibold mb-4 capitalize">{status}</h3>
            <Droppable droppableId={status}>
              {(provided) => (
                <div
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                  className="space-y-4 min-h-[200px]"
                >
                  {statusTasks.map((task, index) => (
                    <Draggable key={task.id} draggableId={task.id} index={index}>
                      {(provided) => (
                        <Card
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          className="hover:shadow-md transition-shadow"
                        >
                          <CardContent className="p-4">
                            <div className="flex justify-between items-start mb-2">
                              <h3 className="font-medium">{task.title}</h3>
                              <span className={`px-2 py-1 rounded text-white text-sm ${
                                task.status === 'To Do' ? 'bg-gray-500' :
                                task.status === 'In Progress' ? 'bg-blue-500' :
                                'bg-green-500'
                              }`}>
                                {task.status}
                              </span>
                            </div>
                            <p className="text-sm text-gray-500 mb-4">{task.description}</p>
                            <div className="space-y-2">
                              <div className="flex justify-between text-sm">
                                <span>Progress</span>
                                <span>{task.progress}%</span>
                              </div>
                              <Progress value={task.progress} />
                              <div className="flex justify-between text-sm text-gray-500">
                                <span>Due: {new Date(task.dueDate).toLocaleDateString()}</span>
                                <span>Priority: {task.priority}</span>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </div>
        ))}
      </div>
    </DragDropContext>
  );
};

export default Kanban;
