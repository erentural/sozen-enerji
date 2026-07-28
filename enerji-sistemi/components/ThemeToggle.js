"use client";

import { useState, useEffect } from "react";
import { Sun, Moon } from "lucide-react";

export default function ThemeToggle() {
  const [isDark, setIsDark] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Sayfa ilk yüklendiğinde HTML'de 'dark' class'ı var mı kontrol et
    const hasDarkClass = document.documentElement.classList.contains("dark");
    setIsDark(hasDarkClass);
  }, []);

  const toggleTheme = () => {
    if (isDark) {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
      setIsDark(false);
    } else {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
      setIsDark(true);
    }
  };

  // Hydration hatasını önlemek için component yüklenene kadar boş bir div render et
  if (!mounted) return <div className="w-10 h-10 ml-3"></div>;

  return (
    <button
      onClick={toggleTheme}
      className="ml-3 p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-amber-500 dark:text-amber-400 hover:bg-slate-200 dark:hover:bg-slate-700 transition-all duration-300 shadow-sm flex items-center justify-center group"
      title={isDark ? "Aydınlık Moda Geç" : "Karanlık Moda Geç"}
    >
      {isDark ? (
        <Sun className="w-5 h-5 group-hover:rotate-90 transition-transform duration-500" />
      ) : (
        <Moon className="w-5 h-5 group-hover:-rotate-12 transition-transform duration-300" />
      )}
    </button>
  );
}