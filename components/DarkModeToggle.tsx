"use client";
import React from "react";
import { Moon, Sun } from "lucide-react";

export default function DarkModeToggle() {
  const [theme, setTheme] = React.useState<string>("light");

  React.useEffect(() => {
    const saved =
      typeof window !== "undefined" ? localStorage.getItem("theme") : null;
    if (saved) setTheme(saved);
    if (!saved && window.matchMedia) {
      const prefersDark = window.matchMedia(
        "(prefers-color-scheme: dark)"
      ).matches;
      setTheme(prefersDark ? "dark" : "light");
    }
  }, []);

  React.useEffect(() => {
    if (typeof window !== "undefined") {
      document.documentElement.classList.toggle("dark", theme === "dark");
      localStorage.setItem("theme", theme);
    }
  }, [theme]);

  return (
    <button
      aria-label="Toggle dark mode"
      className="fixed bottom-6 right-6 z-50 rounded-full border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 shadow-lg p-3 flex items-center justify-center transition-colors hover:bg-gray-100 dark:hover:bg-gray-800"
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
    >
      {theme === "dark" ? (
        <Moon className="h-6 w-6 text-brand-mint" />
      ) : (
        <Sun className="h-6 w-6 text-brand-ember" />
      )}
    </button>
  );
}
