import { useEffect, useState } from "react";
import "./App.css";
import Board from "./components/Board";
import Header from "./components/Header";
import { KanbanProvider } from "./context/KanbanContext";

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
    <KanbanProvider>
      <div
        className="font-expoArabic min-h-screen bg-white dark:bg-gray-900 grid grid-rows-[auto_1fr]"
        dir="rtl"
      >
        <Header darkMode={darkMode} setDarkMode={setDarkMode} />
        <section className="p-6 bg-white dark:bg-gray-800 overflow-y-auto">
          <Board />
        </section>
      </div>
    </KanbanProvider>
  );
}

export default App;