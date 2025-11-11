
import { useState, useEffect } from "react";
import type { IKanbanData } from "../types";

const initialData: IKanbanData = {
  cards: {
    "card-1": { id: "card-1", title: "المهمة 1", content: "وصف المهمة", status: "todo" },
  },
  columns: {
    todo: { id: "todo", title: "قائمة المهام", cardIds: ["card-1"] },
  },
  columnOrder: ["todo"],
};

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
    setData(prev => ({
      ...prev,
      cards: { ...prev.cards, [newId]: { id: newId, title, content, status: columnId } },
      columns: {
        ...prev.columns,
        [columnId]: { ...prev.columns[columnId], cardIds: [...prev.columns[columnId].cardIds, newId] }
      },
    }));
  };

  const editCard = (cardId: string, title: string, content: string) => {
    setData(prev => ({
      ...prev,
      cards: { ...prev.cards, [cardId]: { ...prev.cards[cardId], title, content } },
    }));
  };

  const deleteCard = (cardId: string) => {
    setData(prev => {
      const card = prev.cards[cardId];
      if (!card) return prev;
      const { [cardId]: _, ...newCards } = prev.cards;
      const newColumns = { ...prev.columns };
      newColumns[card.status] = {
        ...newColumns[card.status],
        cardIds: newColumns[card.status].cardIds.filter(id => id !== cardId),
      };
      return { ...prev, cards: newCards, columns: newColumns };
    });
  };

  const moveCard = (cardId: string, fromColumn: string, toColumn: string, newIndex: number) => {
    setData(prev => {
      const newColumns = { ...prev.columns };
      newColumns[fromColumn] = { ...newColumns[fromColumn], cardIds: newColumns[fromColumn].cardIds.filter(id => id !== cardId) };
      const newCardIds = [...newColumns[toColumn].cardIds];
      newCardIds.splice(newIndex, 0, cardId);
      newColumns[toColumn] = { ...newColumns[toColumn], cardIds: newCardIds };
      return { ...prev, cards: { ...prev.cards, [cardId]: { ...prev.cards[cardId], status: toColumn } }, columns: newColumns };
    });
  };

  const reorderCards = (columnId: string, cardIds: string[]) => {
    setData(prev => ({ ...prev, columns: { ...prev.columns, [columnId]: { ...prev.columns[columnId], cardIds } } }));
  };

  const addColumn = (title: string) => {
    if (!title.trim()) return;
    const newId = `column-${Date.now()}`;
    setData(prev => ({
      ...prev,
      columns: {
        ...prev.columns,
        [newId]: { id: newId, title, cardIds: [] }
      },
      columnOrder: [...prev.columnOrder, newId]
    }));
  };

  const deleteColumn = (columnId: string) => {
    if (data.columns[columnId]?.cardIds.length > 0) {
      alert("لا يمكن حذف عمود يحتوي على مهام. احذف المهام أولاً.");
      return;
    }
    setData(prev => {
      const { [columnId]: _, ...newColumns } = prev.columns;
      const newColumnOrder = prev.columnOrder.filter(id => id !== columnId);
      return {
        ...prev,
        columns: newColumns,
        columnOrder: newColumnOrder
      };
    });
  };

  const editColumn = (columnId: string, title: string) => {
    setData(prev => ({
      ...prev,
      columns: {
        ...prev.columns,
        [columnId]: { ...prev.columns[columnId], title }
      }
    }));
  };

  return { data, addCard, editCard, deleteCard, moveCard, reorderCards, addColumn, deleteColumn, editColumn };
};
