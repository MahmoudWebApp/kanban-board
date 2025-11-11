import { useEffect, useState } from "react";
import type { IKanbanData } from "../types";

// Initial Data
const initialData: IKanbanData = {
  cards: {
    "card-1": {
      id: "card-1",
      title: "المهمة ",
      content: "وصف المهمة",
      status: "todo",
    },
  },
  columns: {
    todo: { id: "todo", title: "قيد المراجعة", cardIds: ["card-1"] },
    inprogress: { id: "inprogress", title: "قيد العمل", cardIds: [] },
    done: { id: "done", title: "منتهية", cardIds: [] },
  },
  columnOrder: ["todo", "inprogress", "done"],
};

// Custom Hook
export const useKanban = () => {
  const [data, setData] = useState<IKanbanData>(() => {
    const saved = localStorage.getItem("kanban-data");
    return saved ? JSON.parse(saved) : initialData;
  });

  useEffect(() => {
    localStorage.setItem("kanban-data", JSON.stringify(data));
  }, [data]);

  const addCard = (columnId: string, title: string, content: string) => {
    const newId = `card-${Date.now()}`;
    setData((prev) => ({
      ...prev,
      cards: {
        ...prev.cards,
        [newId]: { id: newId, title, content, status: columnId },
      },
      columns: {
        ...prev.columns,
        [columnId]: {
          ...prev.columns[columnId],
          cardIds: [...prev.columns[columnId].cardIds, newId],
        },
      },
    }));
  };

  const editCard = (cardId: string, title: string, content: string) => {
    setData((prev) => ({
      ...prev,
      cards: {
        ...prev.cards,
        [cardId]: { ...prev.cards[cardId], title, content },
      },
    }));
  };

  const deleteCard = (cardId: string) => {
    setData((prev) => {
      const card = prev.cards[cardId];
      if (!card) return prev;
      const { [cardId]: _, ...newCards } = prev.cards;
      const newColumns = { ...prev.columns };
      newColumns[card.status] = {
        ...newColumns[card.status],
        cardIds: newColumns[card.status].cardIds.filter((id) => id !== cardId),
      };
      return { ...prev, cards: newCards, columns: newColumns };
    });
  };

  return { data, addCard, editCard, deleteCard };
};