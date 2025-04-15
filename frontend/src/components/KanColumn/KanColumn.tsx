// components/KanbanColumn.tsx
import { Droppable } from "@hello-pangea/dnd";
import { Box, Paper, Typography } from "@mui/material";
// import React from "react";

type KanbanColumnProps = {
    title: string;
    columnId: string;
    children: React.ReactNode;
}

const KanbanColumn: React.FC<KanbanColumnProps> = ({ title, columnId, children }) => {
    return (
        <Droppable droppableId={columnId}>
            {(provided) => (
                <Paper
                    elevation={3}
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    sx={{
                        width: 275,
                        minHeight: "100vh",
                        p: 2,
                        backgroundColor: "#f5f5f5",
                        display: "flex",
                        flexDirection: "column",
                    }}
                >
                    <Typography variant="h6" align="center" gutterBottom>
                        {title}
                    </Typography>
                    <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                        {children}
                        {provided.placeholder}
                    </Box>
                </Paper>
            )}
        </Droppable>
    );
};

export default KanbanColumn;