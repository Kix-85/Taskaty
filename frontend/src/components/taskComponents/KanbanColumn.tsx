
import { Droppable } from "@hello-pangea/dnd";

type KanbanColumnProps = {
  title: string;
  columnId: string;
  children: React.ReactNode;
}

const KanbanColumn = ({ title, columnId, children }: KanbanColumnProps) => {
  return (
    <Droppable droppableId={columnId}>
      {(provided) => (
        <div
          ref={provided.innerRef}
          {...provided.droppableProps}
          className="w-[95%] md:w-1/2 xl:w-1/4 flex flex-wrap items-center flex-col min-h-screen bg-black/20 rounded-xl p-2.5"
        >
          <h6 className="text-center mb-2 text-[#95accb] font-semibold">
            {title}
          </h6>
          <div className="flex flex-col w-[95%] items-center gap-2"> 
            {children}
            {provided.placeholder}
          </div>
        </div>
      )}
    </Droppable>
  );
};

export default KanbanColumn;
