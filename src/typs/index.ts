export type Card = {
  id: string;
  title: string;
  content: string;
  status: string;
};

export type Column = {
  id: string;
  title: string;
  cardIds: string[];
};

export type KanbanData = {
  cards: Record<string, Card>;
  columns: Record<string, Column>;
  columnOrder: string[];
};