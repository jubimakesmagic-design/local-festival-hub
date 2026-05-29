// src/components/layout/ThemeToggle.tsx
"use client";

import { useEffect, useState } from "react";
import { Sun, Moon } from "lucide-react";

export function ThemeToggle() {
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // 1. 마운트 시 브라우저 설정 로드
    // eslint-disable-next-line react-hooks/set-state-in-effect
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

  if (!mounted) {
    return <div className="h-10 w-10 animate-pulse rounded-lg border border-border" />;
  }

  return (
    <button
      onClick={toggleTheme}
      className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-lg border border-border bg-card text-foreground shadow-sm transition-colors hover:bg-secondary/60"
      title={theme === "light" ? "어두운 화면으로 보기" : "밝은 화면으로 보기"}
    >
      {theme === "light" ? (
        <Moon size={18} className="shrink-0 text-muted-foreground" />
      ) : (
        <Sun size={18} className="shrink-0 text-accent" />
      )}
    </button>
  );
}
