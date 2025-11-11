import { useState } from "react";
import type {  ICard, IColumn } from "../types";
import Card from "./Card";

const Column: React.FC<{
  column: IColumn;
  cards: Record<string, ICard>;
  onAddCard: (columnId: string, title: string, content: string) => void;
  onDeleteCard: (cardId: string) => void;
  onEditCard: (cardId: string, title: string, content: string) => void;
}> = ({ column, cards, onAddCard, onDeleteCard, onEditCard }) => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newContent, setNewContent] = useState("");

  const handleAdd = () => {
    if (newTitle.trim() && newContent.trim()) {
      onAddCard(column.id, newTitle, newContent);
      setNewTitle("");
      setNewContent("");
      setShowAddForm(false);
    }
  };

  return (
    <div className="w-80 bg-gray-50 dark:bg-gray-600 rounded-lg p-3 flex-shrink-0">
      <h2 className="font-medium dark:text-white text-gray-600 mb-3">
        {column.title} ({column.cardIds.length})
      </h2>
      <div className="space-y-2">
        {column.cardIds.map((id: any) => (
          <Card
            key={id}
            id={id}
            title={cards[id].title}
            content={cards[id].content}
            onDelete={onDeleteCard}
            onEdit={onEditCard}
          />
        ))}
      </div>
      {showAddForm ? (
        <div className="mt-2 p-3 bg-white dark:bg-gray-700 rounded-lg border border-dashed border-gray-300 dark:border-gray-500">
          <input
            type="text"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            className="w-full mb-2 p-2 border rounded text-sm dark:bg-gray-600 dark:text-white"
            placeholder="عنوان المهمة"
          />
          <textarea
            value={newContent}
            onChange={(e) => setNewContent(e.target.value)}
            className="w-full mb-2 p-2 border rounded text-sm dark:bg-gray-600 dark:text-white"
            placeholder="هذا شرح للمهمة وقد يكون شرح غير مكتمل"
            rows={2}
          />
          <div className="flex gap-2">
            <button
              onClick={handleAdd}
              className="px-3 py-1 bg-blue-500 text-white text-sm rounded hover:bg-blue-600"
            >
              إضافة
            </button>
            <button
              onClick={() => {
                setShowAddForm(false);
                setNewTitle("");
                setNewContent("");
              }}
              className="px-3 py-1 bg-gray-300 dark:bg-gray-600 text-gray-700 dark:text-white text-sm rounded hover:bg-gray-400"
            >
              إلغاء
            </button>
          </div>
        </div>
      ) : (
        <button
          onClick={() => setShowAddForm(true)}
          className="w-full mt-2 p-2 border-2 border-dashed border-gray-300 dark:border-gray-500 rounded-lg text-gray-500 dark:text-gray-300 hover:border-gray-400 hover:text-gray-600 dark:hover:border-gray-400 text-sm flex items-center justify-center gap-2"
        >
          <span className="text-xl">+</span>
          إضافة مهمة
        </button>
      )}
    </div>
  );
};
export default Column;
