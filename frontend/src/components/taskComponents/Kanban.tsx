import { DragDropContext, Draggable, DropResult } from "@hello-pangea/dnd";
import KanbanColumn from "./KanbanColumn";
import Card from "./Card";
import { Task } from "@/types/task";

type TaskGroups = {
  "To Do": Task[];
  "In Progress": Task[];
  "Done": Task[];
};

type KanbanProps = {
  tasks: TaskGroups;
  onTaskMove: (result: DropResult) => void;
};

function Kanban({ tasks, onTaskMove }: KanbanProps) {
  return (
    <div className="rounded-lg border bg-card/50 backdrop-blur-sm shadow-sm h-full w-full">
      <DragDropContext onDragEnd={onTaskMove}>
        <div className="flex gap-3 p-4 overflow-x-auto w-full h-full">
          {Object.entries(tasks).map(([columnId, columnTasks]) => (
            <KanbanColumn 
              key={columnId} 
              title={`${columnId} ${columnTasks.length}`} 
              columnId={columnId}
            >
              {columnTasks.map((task, index) => (
                <Draggable key={task.id} draggableId={task.id} index={index}>
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      style={{
                        ...provided.draggableProps.style,
                        width: snapshot.isDragging ? "300px" : "100%",
                      }}
                    >
                      <Card 
                        type={1} 
                        title={task.content} 
                        status={task.status}  
                        id={task.id} 
                        subscribes={task.subscribes}
                      />
                    </div>
                  )}
                </Draggable>
              ))}
            </KanbanColumn>
          ))}
        </div>
      </DragDropContext>
    </div>
  );
}

export default Kanban;
