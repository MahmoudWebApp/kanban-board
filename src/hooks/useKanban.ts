import { useState, useEffect } from 'react';
import type { KanbanData } from '../types';


const initialData: KanbanData = {
  cards: {
    'card-1': { id: 'card-1', title: 'المهمة 1', content: 'أنهِ لوحة كانبان', status: 'todo' },
  },
  columns: {
    'todo': { id: 'todo', title: 'للعمل', cardIds: ['card-1'] },
    'inprogress': { id: 'inprogress', title: 'قيد التنفيذ', cardIds: [] },
    'done': { id: 'done', title: 'منتهية', cardIds: [] },
  },
  columnOrder: ['todo', 'inprogress', 'done'],
};

export const useKanban = () => {
  const [data, setData] = useState<KanbanData>(() => {
    const saved = localStorage.getItem('kanban-data');
    return saved ? JSON.parse(saved) : initialData;
  });

  useEffect(() => {
    localStorage.setItem('kanban-data', JSON.stringify(data));
  }, [data]);

  const addCard = (columnId: string, title: string, content: string) => {
    const newId = `card-${Date.now()}`;
    setData(prev => ({
      ...prev,
      cards: { ...prev.cards, [newId]: { id: newId, title, content, status: columnId } },
      columns: {
        ...prev.columns,
        [columnId]: { ...prev.columns[columnId], cardIds: [...prev.columns[columnId].cardIds, newId] },
      },
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

  const moveCard = (cardId: string, toColumnId: string) => {
    setData(prev => {
      const card = prev.cards[cardId];
      if (!card) return prev;
      const fromCol = prev.columns[card.status];
      const toCol = prev.columns[toColumnId];
      return {
        ...prev,
        cards: { ...prev.cards, [cardId]: { ...card, status: toColumnId } },
        columns: {
          ...prev.columns,
          [card.status]: { ...fromCol, cardIds: fromCol.cardIds.filter(id => id !== cardId) },
          [toColumnId]: { ...toCol, cardIds: [...toCol.cardIds, cardId] },
        },
      };
    });
  };

  return { data, addCard, deleteCard, moveCard };
};