import { useEffect, useRef, useState } from "react";

const Card: React.FC<{
  id: string;
  title: string;
  content: string;
  onDelete: (id: string) => void;
  onEdit: (id: string, title: string, content: string) => void;
}> = ({ id, title, content, onDelete, onEdit }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editTitle, setEditTitle] = useState(title);
  const [editContent, setEditContent] = useState(content);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSave = () => {
    if (editTitle.trim() && editContent.trim()) {
      onEdit(id, editTitle, editContent);
      setEditMode(false);
    }
  };

  if (editMode) {
    return (
      <div className="p-3 bg-white dark:bg-gray-700 rounded-lg border border-gray-100 mb-2">
        <input
          type="text"
          value={editTitle}
          onChange={(e) => setEditTitle(e.target.value)}
          className="w-full mb-2 p-2 border rounded text-sm dark:bg-gray-600 dark:text-white"
          placeholder="عنوان المهمة"
        />
        <textarea
          value={editContent}
          onChange={(e) => setEditContent(e.target.value)}
          className="w-full mb-2 p-2 border rounded text-sm dark:bg-gray-600 dark:text-white"
          placeholder="وصف المهمة"
          rows={2}
        />
        <div className="flex gap-2">
          <button
            onClick={handleSave}
            className="px-3 py-1 bg-blue-500 text-white text-sm rounded hover:bg-blue-600"
          >
            حفظ
          </button>
          <button
            onClick={() => {
              setEditMode(false);
              setEditTitle(title);
              setEditContent(content);
            }}
            className="px-3 py-1 bg-gray-300 dark:bg-gray-600 text-gray-700 dark:text-white text-sm rounded hover:bg-gray-400"
          >
            إلغاء
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-3 bg-white dark:bg-gray-700 rounded-lg border border-gray-100 mb-2 relative">
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <h3 className="font-medium text-sm dark:text-white text-gray-800 mb-2">
            {title}
          </h3>
          <p className="text-sm text-gray-400 dark:text-gray-200 font-normal">
            {content}
          </p>
        </div>
        <div className="relative" ref={menuRef}>
          <button
            type="button"
            onClick={() => setMenuOpen(!menuOpen)}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-300 p-1"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
            </svg>
          </button>
          {menuOpen && (
            <div className="absolute left-0 mt-2 w-32 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-10">
              <button
                onClick={() => {
                  setEditMode(true);
                  setMenuOpen(false);
                }}
                className="w-full text-right px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-t-lg"
              >
                تعديل
              </button>
              <button
                onClick={() => {
                  onDelete(id);
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
    </div>
  );
};
export default Card;
