"use client";

import { createContext, useContext, useState, useEffect } from "react";

const ThemeContext = createContext();

export function ThemeProvider({ children }) {
  const [themeForm, setThemeForm] = useState({
    mode: "light", 
    accent: "blue", 
    compactMode: false,
  });
  const [mounted, setMounted] = useState(false);

  // Tema verilerini tarayıcıdan çek ve HTML'e uygula
  useEffect(() => {
    const savedTheme = localStorage.getItem("sozen_admin_theme");
    if (savedTheme) {
      try {
        const parsedTheme = JSON.parse(savedTheme);
        setThemeForm(parsedTheme);
        if (parsedTheme.mode === "dark") {
          document.documentElement.classList.add("dark");
        } else {
          document.documentElement.classList.remove("dark");
        }
      } catch (e) {
        console.error(e);
      }
    }
    setMounted(true);
  }, []);

  // Temayı anında güncelleyen fonksiyon
  const handleThemeChange = (key, value) => {
    const updatedTheme = { ...themeForm, [key]: value };
    setThemeForm(updatedTheme);
    localStorage.setItem("sozen_admin_theme", JSON.stringify(updatedTheme));

    if (key === "mode") {
      if (value === "dark") {
        document.documentElement.classList.add("dark");
      } else if (value === "light") {
        document.documentElement.classList.remove("dark");
      } else {
        if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
          document.documentElement.classList.add("dark");
        } else {
          document.documentElement.classList.remove("dark");
        }
      }
    }
  };

  // Renk Haritası
  const themeColors = {
    blue: { bg: "bg-[#02529C]", text: "text-[#02529C]", border: "border-[#02529C]", focus: "focus:border-[#02529C]", hoverBg: "hover:bg-blue-800" },
    amber: { bg: "bg-amber-500", text: "text-amber-500", border: "border-amber-500", focus: "focus:border-amber-500", hoverBg: "hover:bg-amber-600" },
    emerald: { bg: "bg-emerald-600", text: "text-emerald-600", border: "border-emerald-600", focus: "focus:border-emerald-600", hoverBg: "hover:bg-emerald-700" }
  };

  const currentTheme = themeColors[themeForm.accent] || themeColors.blue;

  if (!mounted) return <div className="min-h-screen bg-slate-50 dark:bg-slate-900"></div>;

  return (
    <ThemeContext.Provider value={{ themeForm, handleThemeChange, currentTheme }}>
      {/* Tüm Admin panelinin arka planını karanlık moda göre ayarlayan ana sarmalayıcı */}
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900 transition-colors duration-300">
        {children}
      </div>
    </ThemeContext.Provider>
  );
}

export const useTheme = () => useContext(ThemeContext);