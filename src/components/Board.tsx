// src/components/Board.tsx
import { useState } from "react";
import Column from "./Column";
import {
  DndContext,
  DragOverlay,
  closestCorners,
  PointerSensor,
  KeyboardSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import type {
  DragStartEvent,
  DragOverEvent,
  DragEndEvent,
} from "@dnd-kit/core";
import { sortableKeyboardCoordinates, arrayMove } from "@dnd-kit/sortable";
import type { IKanbanData } from "../types";

interface BoardProps {
  data: IKanbanData;
  addCard: (columnId: string, title: string, content: string) => void;
  editCard: (cardId: string, title: string, content: string) => void;
  deleteCard: (cardId: string) => void;
  moveCard: (
    cardId: string,
    fromColumn: string,
    toColumn: string,
    newIndex: number
  ) => void;
  reorderCards: (columnId: string, cardIds: string[]) => void;
  deleteColumn: (columnId: string) => void;
  editColumn: (columnId: string, title: string) => void;
}

const Board: React.FC<BoardProps> = ({
  data,
  addCard,
  editCard,
  deleteCard,
  moveCard,
  reorderCards,
  deleteColumn,
  editColumn,
}) => {
  const [activeId, setActiveId] = useState<string | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const handleDragStart = ({ active }: DragStartEvent) =>
    setActiveId(active.id as string);

  const handleDragOver = ({ active, over }: DragOverEvent) => {
    if (!over || !active.id) return;
    const activeCard = data.cards[active.id as string];
    if (!activeCard) return;

    const activeColumn = activeCard.status;
    const overId = over.id;

    const isOverColumn = !data.cards[overId as string];
    const overColumn = isOverColumn
      ? (overId as string)
      : data.cards[overId as string]?.status;

    if (!overColumn || activeColumn === overColumn) return;

    const overColumnData = data.columns[overColumn];
    if (!overColumnData) return;

    const overIndex = isOverColumn
      ? overColumnData.cardIds.length
      : overColumnData.cardIds.indexOf(overId as string);

    moveCard(active.id as string, activeColumn, overColumn, overIndex);
  };

  const handleDragEnd = ({ active, over }: DragEndEvent) => {
    setActiveId(null);
    if (!over || !active.id) return;

    const activeCard = data.cards[active.id as string];
    if (!activeCard) return;

    const column = data.columns[activeCard.status];
    const oldIndex = column.cardIds.indexOf(active.id as string);
    const newIndex = column.cardIds.indexOf(over.id as string);

    if (oldIndex !== newIndex && newIndex !== -1) {
      reorderCards(column.id, arrayMove(column.cardIds, oldIndex, newIndex));
    }
  };

  const activeCard = activeId ? data.cards[activeId] : null;

  return (
    <div className="flex  gap-4 pb-4 min-w-full">
      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
      >
        <div className="flex gap-4  flex-wrap pb-4">
          {data.columnOrder.map((id) => (
            <Column
              key={id}
              column={data.columns[id]}
              cards={data.cards}
              onAddCard={addCard}
              onEditCard={editCard}
              onDeleteCard={deleteCard}
              onDeleteColumn={deleteColumn}
              onEditColumn={editColumn}
            />
          ))}
        </div>
        <DragOverlay>
          {activeCard && (
            <div className="p-3 bg-white dark:bg-gray-700 rounded-lg border border-gray-100 shadow-lg cursor-grabbing">
              <h3 className="font-medium text-sm dark:text-white text-gray-800 mb-2">
                {activeCard.title}
              </h3>
              <p className="text-sm text-gray-400 dark:text-gray-200 font-normal">
                {activeCard.content}
              </p>
            </div>
          )}
        </DragOverlay>
      </DndContext>
    </div>
  );
};

export default Board;
