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
import type { DragStartEvent, DragOverEvent, DragEndEvent } from "@dnd-kit/core";
import { sortableKeyboardCoordinates, arrayMove } from "@dnd-kit/sortable";
import { useKanbanContext } from "../context/KanbanContext";

const Board: React.FC = () => {
  const { data, moveCard, reorderCards } = useKanbanContext();
  const [activeId, setActiveId] = useState<string | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragStart = ({ active }: DragStartEvent) => {
    setActiveId(String(active.id));
  };

  const handleDragOver = ({ active, over }: DragOverEvent) => {
    if (!over || !active.id) return;

    const activeId = String(active.id);
    const overId = String(over.id);

    const activeCard = data.cards[activeId];
    if (!activeCard) return;

    const activeColumn = activeCard.status;
    const isOverColumn = !data.cards[overId];
    const overColumn = isOverColumn ? overId : data.cards[overId]?.status;

    if (!overColumn || activeColumn === overColumn) return;
    const overColumnData = data.columns[overColumn];
    if (!overColumnData) return;

    const overIndex = isOverColumn
      ? overColumnData.cardIds.length
      : overColumnData.cardIds.indexOf(overId);

    moveCard(activeId, activeColumn, overColumn, overIndex);
  };

  const handleDragEnd = ({ active, over }: DragEndEvent) => {
    setActiveId(null);
    if (!over || !active.id) return;

    const activeId = String(active.id);
    const overId = String(over.id);

    const activeCard = data.cards[activeId];
    if (!activeCard) return;

    const column = data.columns[activeCard.status];
    const oldIndex = column.cardIds.indexOf(activeId);
    const newIndex = column.cardIds.indexOf(overId);

    if (oldIndex !== newIndex && newIndex !== -1) {
      reorderCards(column.id, arrayMove(column.cardIds, oldIndex, newIndex));
    }
  };

  const activeCard = activeId ? data.cards[activeId] : null;

  return (
    <div className="flex gap-4 pb-4 min-w-full">
      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
      >
        <div className="flex gap-4 flex-wrap pb-4">
          {data.columnOrder.map((id) => (
            <Column key={id} column={data.columns[id]} />
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