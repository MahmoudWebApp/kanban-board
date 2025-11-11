import { useState } from "react";
import { useKanbanContext } from "../context/KanbanContext";

interface HeaderProps {
  darkMode: boolean;
  setDarkMode: (value: boolean) => void;
}

const Header: React.FC<HeaderProps> = ({ darkMode, setDarkMode }) => {
  const [showAddColumn, setShowAddColumn] = useState(false);
  const [newColumnTitle, setNewColumnTitle] = useState("");
  const { addColumn } = useKanbanContext();

  const handleAddColumn = () => {
    if (newColumnTitle.trim()) {
      addColumn(newColumnTitle.trim());
      setNewColumnTitle("");
      setShowAddColumn(false);
    }
  };

  return (
    <header className="p-4 bg-white dark:bg-gray-900 flex sm:flex-nowrap flex-wrap gap-4 w-full justify-between items-center border-b border-gray-300 dark:border-gray-700">
      <h1 className="text-xl text-gray-600 dark:text-white font-medium">
        طلبات التوظيف
      </h1>
      <div className="flex items-center gap-3 flex-wrap">
        {showAddColumn ? (
          <div className="flex gap-2">
            <input
              value={newColumnTitle}
              onChange={(e) => setNewColumnTitle(e.target.value)}
              placeholder="اسم العمود الجديد"
              className="px-3 md:w-64 w-36 py-1 text-sm border rounded dark:bg-gray-800 dark:text-white dark:border-gray-600"
              autoFocus
              onKeyDown={(e) => e.key === "Enter" && handleAddColumn()}
            />
            <button
              onClick={handleAddColumn}
              className="px-3 py-1 bg-blue-500 text-white text-xs rounded hover:bg-blue-600"
            >
              إنشاء
            </button>
            <button
              onClick={() => {
                setShowAddColumn(false);
                setNewColumnTitle("");
              }}
              className="px-3 py-1 bg-gray-300 dark:bg-gray-600 text-gray-700 dark:text-white text-xs rounded hover:bg-gray-400"
            >
              إلغاء
            </button>
          </div>
        ) : (
          <button
            onClick={() => setShowAddColumn(true)}
            className="px-3 py-2 bg-green-500 text-white text-xs rounded hover:bg-green-600 flex items-center gap-1"
          >
            + إضافة عمود
          </button>
        )}
        <button
          onClick={() => setDarkMode(!darkMode)}
          className="px-4 py-2 text-xs text-gray-600 dark:text-white bg-gray-200 dark:bg-gray-700 rounded"
        >
          <span className="hidden md:inline">
            {darkMode ? "☀️ وضع نهاري" : "🌙 وضع ليلي"}
          </span>
          <span className="md:hidden">{darkMode ? "☀️" : "🌙"}</span>
        </button>
      </div>
    </header>
  );
};

export default Header;