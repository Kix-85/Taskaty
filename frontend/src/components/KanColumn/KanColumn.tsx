import { Droppable } from "@hello-pangea/dnd";
import {Typography } from "@mui/material";
import style from "./KanColumn.module.css"
import "../../styles/globals.css"

type KanbanColumnProps = {
    title: string;
    columnId: string;
    children: React.ReactNode;
}

const KanbanColumn: React.FC<KanbanColumnProps> = ({ title, columnId, children }) => {
    return (
        <Droppable droppableId={columnId} >
            {(provided) => (
                <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className={`w-95/100 md:w-1/2 xl:w-1/4 flex flex-wrap items-center flex-col min-h-screen bg-black-20 rounded-xl ${style.column}`}>
                    <Typography variant="h6" align="center" gutterBottom className={style.typography}>
                        {title}
                    </Typography>
                    <div className="flex flex-col w-95/100 items-center gap-2"> 
                        {children}
                        {provided.placeholder}
                    </div>
                </div>
            )}
        </Droppable>
    );
};

export default KanbanColumn;