import React, { useState, useRef, useEffect, useMemo } from "react";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { useDroppable } from "@dnd-kit/core";
import { useKanbanContext } from "../context/KanbanContext";
import Card from "./Card";
import * as XLSX from "xlsx";

interface IProps {
  column: { id: string; title: string; cardIds: string[] };
}

const Column: React.FC<IProps> = ({ column }) => {
  const { data, addCard, editCard, deleteCard, editColumn, deleteColumn } =
    useKanbanContext();

  const [showAddForm, setShowAddForm] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newContent, setNewContent] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editTitle, setEditTitle] = useState(column.title);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleAdd = () => {
    if (newTitle.trim() && newContent.trim()) {
      addCard(column.id, newTitle, newContent);
      setNewTitle("");
      setNewContent("");
      setShowAddForm(false);
    }
  };

  const handleSaveColumn = () => {
    if (editTitle.trim()) {
      editColumn(column.id, editTitle.trim());
      setEditMode(false);
    }
  };

  const handleExportToExcel = () => {
    const columnCards = column.cardIds.map((id, index) => ({
      "#": index + 1,
      العنوان: data.cards[id]?.title || "",
      الوصف: data.cards[id]?.content || "",
    }));

    const ws = XLSX.utils.json_to_sheet(columnCards);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, column.title);
    XLSX.writeFile(wb, `${column.title}.xlsx`);
  };

  // ✅ استخدام useMemo لضمان التحديث الصحيح
  const filteredCardIds = useMemo(() => {
    return column.cardIds.filter((id) => {
      const card = data.cards[id];
      if (!card) return false;
      const query = searchQuery.toLowerCase();
      return (
        card.title.toLowerCase().includes(query) ||
        card.content.toLowerCase().includes(query)
      );
    });
  }, [column.cardIds, data.cards, searchQuery]);

  const { setNodeRef: setDroppableRef, isOver } = useDroppable({ id: column.id });

  if (editMode) {
    return (
      <div className="w-80 bg-gray-50 dark:bg-gray-600 rounded-lg p-3 flex-shrink-0">
        <div className="flex items-center gap-2 mb-3">
          <input
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
            className="flex-1 w-36 p-1 text-sm font-medium border rounded dark:bg-gray-700 dark:text-white"
            autoFocus
          />
          <button
            onClick={handleSaveColumn}
            className="text-xs bg-blue-500 text-white px-2 py-1 rounded"
          >
            حفظ
          </button>
          <button
            onClick={() => {
              setEditMode(false);
              setEditTitle(column.title);
            }}
            className="text-xs bg-gray-300 dark:bg-gray-600 text-gray-700 dark:text-white px-2 py-1 rounded"
          >
            إلغاء
          </button>
        </div>
        <div
          ref={setDroppableRef}
          className={`min-h-[100px] rounded p-1 ${
            isOver ? "bg-blue-100 dark:bg-blue-900/30" : ""
          }`}
        >
          <SortableContext
            items={column.cardIds}
            strategy={verticalListSortingStrategy}
          >
            <div className="space-y-2">
              {column.cardIds.map((id) => (
                <Card key={id} id={id} />
              ))}
            </div>
          </SortableContext>
        </div>
        {showAddForm ? (
          <div className="mt-2 p-3 bg-white dark:bg-gray-700 rounded-lg border border-dashed border-gray-300 dark:border-gray-500">
            <input
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              className="w-full mb-2 p-2 border rounded text-sm dark:bg-gray-600 dark:text-white"
              placeholder="عنوان المهمة"
            />
            <textarea
              value={newContent}
              onChange={(e) => setNewContent(e.target.value)}
              className="w-full mb-2 p-2 border rounded text-sm dark:bg-gray-600 dark:text-white"
              placeholder="شرح المهمة"
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
            className="w-full mt-2 p-2 border-2 border-dashed border-gray-300 dark:border-gray-500 rounded-lg text-gray-500 dark:text-gray-300 hover:border-gray-400 hover:text-gray-600 text-sm flex items-center justify-center gap-2"
          >
            + إضافة مهمة
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="w-80 bg-gray-50 dark:bg-gray-600 rounded-lg p-3 flex-shrink-0">
      <div className="flex justify-between items-center mb-3">
        <h2 className="font-medium dark:text-white text-gray-600">
          {column.title} ({filteredCardIds.length})
        </h2>

        <div className="relative" ref={menuRef}>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setMenuOpen(!menuOpen);
            }}
            className="font-bold cursor-pointer text-gray-500 hover:text-gray-700 dark:text-gray-300 p-1"
          >
            ⋮
          </button>
          {menuOpen && (
            <div className="absolute left-0 mt-1 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-10 py-2">
              <div className="px-3 mb-2">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder=" بحث..."
                  className="w-full px-2 py-1 text-xs border rounded dark:bg-gray-700 dark:text-white dark:border-gray-600"
                  onClick={(e) => e.stopPropagation()}
                />
              </div>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setEditMode(true);
                  setMenuOpen(false);
                }}
                className="w-full text-right px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                تعديل
              </button>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleExportToExcel();
                  setMenuOpen(false);
                }}
                className="w-full text-right px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                تصدير Excel
              </button>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  deleteColumn(column.id);
                  setMenuOpen(false);
                }}
                className="w-full text-right px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-b-lg"
              >
                حذف
              </button>
            </div>
          )}
        </div>
      </div>

      <div
        ref={setDroppableRef}
        className={`min-h-[100px] rounded p-1 ${
          isOver ? "bg-blue-100 dark:bg-blue-900/30" : ""
        }`}
      >
        <SortableContext
          items={filteredCardIds}
          strategy={verticalListSortingStrategy}
        >
          <div className="space-y-2">
            {filteredCardIds.map((id) => (
              <Card key={id} id={id} />
            ))}
          </div>
        </SortableContext>
      </div>

      {showAddForm ? (
        <div className="mt-2 p-3 bg-white dark:bg-gray-700 rounded-lg border border-dashed border-gray-300 dark:border-gray-500">
          <input
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            className="w-full mb-2 p-2 border rounded text-sm dark:bg-gray-600 dark:text-white"
            placeholder="عنوان المهمة"
          />
          <textarea
            value={newContent}
            onChange={(e) => setNewContent(e.target.value)}
            className="w-full mb-2 p-2 border rounded text-sm dark:bg-gray-600 dark:text-white"
            placeholder="شرح المهمة"
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
          className="w-full mt-2 p-2 border-2 border-dashed border-gray-300 dark:border-gray-500 rounded-lg text-gray-500 dark:text-gray-300 hover:border-gray-400 hover:text-gray-600 text-sm flex items-center justify-center gap-2"
        >
          + إضافة مهمة
        </button>
      )}
    </div>
  );
};

export default Column;