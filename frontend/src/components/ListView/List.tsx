"use client"
import Card from "../Card/Card"
import { DragDropContext, Draggable, Droppable, DropResult } from "@hello-pangea/dnd";
import style from "./List.module.css"
import { useState } from "react";
const List = () => {
    const initialData = {
        toDo: [{ id: "1", content: "Task 1", status: "low" }, { id: "2", content: "Task 2", status: "high" }],
        inProgress: [{ id: "3", content: "Task 3", status: "low" }],
        review: [{ id: "5", content: "task 5", status: "low" }, { id: "6", content: "task 6", status: "high" }],
        done: [{ id: "4", content: "Task 4", status: "medium" }],
    };
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
        <div className={style.div}>
        <DragDropContext onDragEnd={onDragEnd}>
                <div className={style.board}>
                    {Object.entries(columns).map(([columnId, tasks]) => (
                        <Droppable droppableId={columnId} key={columnId}>
                            {(provided) => (
                                <div
                                    className={style.listGroup}
                                    ref={provided.innerRef}
                                    {...provided.droppableProps}
                                >
                                    <h3>{columnId} {tasks.length}</h3>
                                    {tasks.map((task, index) => (
                                        <Draggable key={task.id} draggableId={task.id} index={index}>
                                            {(provided,snapshot) => (
                                                <div
                                                    ref={provided.innerRef}
                                                    {...provided.draggableProps}
                                                    {...provided.dragHandleProps}
                                                    className={`${style.dashed} ${snapshot.isDragging?style.dragging:style.dashed} ${style.smoothDnd}`}
                                                >
                                                    <Card
                                                        type={3}
                                                        title={task.content}
                                                        status={task.status}
                                                        id={task.id}
                                                        subscribes={2345}
                                                    />
                                                </div>
                                            )}
                                        </Draggable>
                                    ))}
                                    {provided.placeholder}
                                </div>
                            )}
                        </Droppable>
                    ))}
                </div>
        </DragDropContext>
        </div>

    )

}

export default List;