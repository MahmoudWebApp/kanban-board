import { useEffect, useState } from "react";
import "./App.css";
import Board from "./components/Board";

function App() {
  const [darkMode, setDarkMode] = useState(
    () => localStorage.getItem("darkMode") === "true"
  );

  useEffect(() => {
    localStorage.setItem("darkMode", darkMode.toString());
    if (darkMode) document.documentElement.classList.add("dark");
    else document.documentElement.classList.remove("dark");
  }, [darkMode]);
  return (
    <div
      className="font-expoArabic min-h-screen bg-white dark:bg-gray-900 grid grid-rows-[auto_1fr]"
      dir="rtl"
    >
      <header className="p-4 bg-white dark:bg-gray-900 flex w-full justify-between
       items-center border-b border-gray-300 dark:border-white">
        <h1 className="text-xl text-gray-600 dark:text-white font-medium">
          طلبات التوظيف
        </h1>
        <button
          onClick={() => setDarkMode(!darkMode)}
          className="px-4 py-2 text-xs text-gray-600 dark:text-white bg-gray-200 dark:bg-gray-700 rounded"
        >
          {darkMode ? "☀️ وضع نهاري" : "🌙 وضع ليلي"}
        </button>
      </header>

      <section className="p-6 bg-white dark:bg-gray-700 overflow-y-auto">
        <Board />
      </section>
    </div>
  );
}

export default App;
