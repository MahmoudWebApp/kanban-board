export interface ICard {
  id: string;
  title: string;
  content: string;
  status: string;
}

export interface IColumn {
  id: string;
  title: string;
  cardIds: string[];
}

export type IKanbanData = {
  cards: Record<string, ICard>;
  columns: Record<string, IColumn>;
  columnOrder: string[];
};