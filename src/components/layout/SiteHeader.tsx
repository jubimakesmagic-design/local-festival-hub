// src/components/layout/SiteHeader.tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Compass, MapPin, PlusCircle, ShieldAlert } from "lucide-react";
import { ThemeToggle } from "./ThemeToggle";

export function SiteHeader() {
  const pathname = usePathname();

  const links = [
    { href: "/", label: "축제 둘러보기", icon: MapPin },
    { href: "/submit", label: "축제 제보하기", icon: PlusCircle },
    { href: "/admin", label: "관리자 검수", icon: ShieldAlert },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/50 bg-background/80 backdrop-blur-md transition-all duration-300">
      <div className="container mx-auto px-4 md:px-6 h-16 flex items-center justify-between">
        {/* 로고 영역 - 아날로그 수공예 🧭 소인 */}
        <Link href="/" className="flex items-center space-x-2.5 group">
          <div className="h-9 w-9 stamp-badge flex items-center justify-center group-hover:rotate-12 transition-transform duration-300">
            <Compass size={18} className="text-primary" />
          </div>
          <span className="font-extrabold text-xl tracking-tight font-serif text-foreground">
            동네축제
          </span>
        </Link>

        {/* 네비게이션 및 테마 스위처 */}
        <div className="flex items-center space-x-2 sm:space-x-3">
          <nav className="flex items-center space-x-1 sm:space-x-2">
            {links.map((link) => {
              const Icon = link.icon;
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`flex items-center space-x-1.5 px-3 py-1.5 text-xs font-bold transition-all duration-200 border border-dashed rounded ${
                    isActive
                      ? "bg-card text-primary border-primary/50 stamp-badge"
                      : "text-muted-foreground border-transparent hover:border-border hover:bg-secondary/40 hover:text-foreground"
                  }`}
                >
                  <Icon size={13} className="shrink-0" />
                  <span className="hidden sm:inline">{link.label}</span>
                </Link>
              );
            })}
          </nav>
          <div className="border-l border-border/60 h-5 my-auto mx-1 hidden sm:block" />
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}

