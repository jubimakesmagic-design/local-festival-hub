// src/components/layout/ThemeToggle.tsx
"use client";

import { useEffect, useState } from "react";
import { Sun, Moon } from "lucide-react";

export function ThemeToggle() {
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // 1. 마운트 시 브라우저 설정 로드
    setMounted(true);
    const savedTheme = localStorage.getItem("theme");
    const isSystemDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    
    if (savedTheme === "dark" || (!savedTheme && isSystemDark)) {
      setTheme("dark");
      document.documentElement.classList.add("dark");
    } else {
      setTheme("light");
      document.documentElement.classList.remove("dark");
    }
  }, []);

  const toggleTheme = () => {
    if (theme === "light") {
      setTheme("dark");
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      setTheme("light");
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  };

  // SSR Hydration 에러 방지용 플레이스홀더
  if (!mounted) {
    return <div className="w-9 h-9 border border-dashed border-border rounded" />;
  }

  return (
    <button
      onClick={toggleTheme}
      className="h-9 w-9 rounded border border-dashed border-border/80 bg-card hover:bg-secondary/40 text-foreground flex items-center justify-center transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer relative overflow-hidden group shadow-sm"
      title={theme === "light" ? "밤 축제 모드로 변경 (다크)" : "낮 축제 모드로 변경 (라이트)"}
    >
      <div className="relative w-5 h-5 flex items-center justify-center transition-transform duration-500 group-hover:rotate-45">
        {theme === "light" ? (
          <Moon size={16} className="text-primary shrink-0 transition-all duration-300" />
        ) : (
          <Sun size={16} className="text-accent shrink-0 transition-all duration-300" />
        )}
      </div>
    </button>
  );
}
