// src/components/layout/SiteHeader.tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Compass, MapPin, PlusCircle, ShieldAlert } from "lucide-react";
import { ThemeToggle } from "./ThemeToggle";

export function SiteHeader() {
  const pathname = usePathname();

  const links = [
    { href: "/", label: "둘러보기", icon: MapPin },
    { href: "/submit", label: "제보하기", icon: PlusCircle },
    { href: "/admin", label: "관리", icon: ShieldAlert },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/70 bg-background/95 backdrop-blur-md">
      <div className="container mx-auto flex h-15 items-center justify-between px-4 md:h-16 md:px-6">
        <Link href="/" className="group flex min-h-11 items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-card text-primary shadow-sm transition-colors group-hover:border-primary/40">
            <Compass size={20} />
          </div>
          <span className="text-xl font-bold tracking-normal text-foreground md:text-2xl">
            동네축제
          </span>
        </Link>

        <div className="flex items-center gap-2 sm:gap-3">
          <nav className="flex items-center gap-1">
            {links.map((link) => {
              const Icon = link.icon;
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`flex min-h-10 items-center gap-2 rounded-lg border px-3 text-sm font-medium transition-colors ${
                    isActive
                      ? "border-primary/25 bg-primary/10 text-primary"
                      : "border-transparent text-muted-foreground hover:border-border hover:bg-secondary/60 hover:text-foreground"
                  }`}
                >
                  <Icon size={16} className="shrink-0" />
                  <span className="hidden sm:inline">{link.label}</span>
                </Link>
              );
            })}
          </nav>
          <div className="hidden h-5 border-l border-border sm:block" />
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
