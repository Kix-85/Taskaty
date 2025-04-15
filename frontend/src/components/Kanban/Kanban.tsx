// components/KanbanBoard.tsx
"use client";

import { DragDropContext, Draggable, DropResult } from "@hello-pangea/dnd";
import { Box } from "@mui/material";
import { useState } from "react";
import styles from './Kanban.module.css';
import KanbanColumn from "@/components/KanColumn/KanColumn";
import Card from "@/components/Card/Card";

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
        <div className={styles.div}>
            <DragDropContext onDragEnd={onDragEnd}>
                <Box sx={{ display: "flex", gap: 3, padding: 4, overflowX: "auto" }}>
                    {Object.entries(columns).map(([columnId, tasks]) => (
                        <KanbanColumn key={columnId} title={columnId} columnId={columnId}>
                            {tasks.map((task, index) => (
                                <Draggable key={task.id} draggableId={task.id} index={index}>
                                    {(provided) => (
                                        <div
                                            ref={provided.innerRef}
                                            {...provided.draggableProps}
                                            {...provided.dragHandleProps}
                                        >
                                            <Card type={1} title={task.content} status={task.status}  id={task.id} subscribes={2345}/>
                                        </div>
                                    )}
                                </Draggable>
                            ))}
                        </KanbanColumn>
                    ))}
                </Box>
            </DragDropContext>
        </div>
    );
}

export default Kanban;