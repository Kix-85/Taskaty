
import { DragDropContext, Draggable, DropResult } from "@hello-pangea/dnd";
import { useState } from "react";
import KanbanColumn from "./KanbanColumn";
import Card from "./Card";

const initialData = {
  todo: [{ id: "1", content: "Task 1", status: "low" }, { id: "2", content: "Task 2", status: "high" }],
  inProgress: [{ id: "3", content: "Task 3", status: "low" }],
  review: [{ id: "5", content: "task 5", status: "low" }, { id: "6", content: "task 6", status: "high" }],
  done: [{ id: "4", content: "Task 4", status: "medium" }],
};

function Kanban() {
  const [columns, setColumns] = useState(initialData);

  const onDragEnd = (result: DropResult) => {
    const { source, destination } = result;
    if (!destination) return;

    const sourceCol = [...columns[source.droppableId as keyof typeof columns]];
    const destCol = [...columns[destination.droppableId as keyof typeof columns]];
    const [movedItem] = sourceCol.splice(source.index, 1);
    
    if (source.droppableId === destination.droppableId) {
      sourceCol.splice(destination.index, 0, movedItem);
      setColumns((prev) => ({
        ...prev,
        [source.droppableId]: sourceCol,
      }));
    } else {
      destCol.splice(destination.index, 0, movedItem);
      setColumns((prev) => ({
        ...prev,
        [source.droppableId]: sourceCol,
        [destination.droppableId]: destCol,
      }));
    }
  };

  return (
    <div className="rounded-lg border bg-card/50 backdrop-blur-sm shadow-sm h-full w-full">
      <DragDropContext onDragEnd={onDragEnd}>
        <div className="flex gap-3 p-4 overflow-x-auto w-full h-full">
          {Object.entries(columns).map(([columnId, tasks]) => (
            <KanbanColumn 
              key={columnId} 
              title={`${columnId} ${tasks.length}`} 
              columnId={columnId}
            >
              {tasks.map((task, index) => (
                <Draggable key={task.id} draggableId={task.id} index={index}>
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      className={`rounded-xl border border-dashed border-border w-full transition-transform duration-200 ${snapshot.isDragging ? "z-50 shadow-lg scale-[1.02]" : ""}`}
                    >
                      <Card 
                        type={1} 
                        title={task.content} 
                        status={task.status}  
                        id={task.id} 
                        subscribes={2345}
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
