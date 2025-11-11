import React, { createContext, useContext } from "react";
import { useKanban } from "../hooks/useKanban";
import type { IKanbanData } from "../types";

type KanbanContextType = {
  data: IKanbanData;
  addCard: (columnId: string, title: string, content: string) => void;
  editCard: (cardId: string, title: string, content: string) => void;
  deleteCard: (cardId: string) => void;
  moveCard: (cardId: string, fromColumn: string, toColumn: string, newIndex: number) => void;
  reorderCards: (columnId: string, cardIds: string[]) => void;
  addColumn: (title: string) => void;
  deleteColumn: (columnId: string) => void;
  editColumn: (columnId: string, title: string) => void;
};

const KanbanContext = createContext<KanbanContextType | undefined>(undefined);

export const KanbanProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const kanban = useKanban();
  return <KanbanContext.Provider value={kanban}>{children}</KanbanContext.Provider>;
};

export const useKanbanContext = () => {
  const context = useContext(KanbanContext);
  if (!context) {
    throw new Error("useKanbanContext must be used within KanbanProvider");
  }
  return context;
};