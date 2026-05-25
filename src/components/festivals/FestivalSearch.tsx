// src/components/festivals/FestivalSearch.tsx
"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/Input";

export function FestivalSearch() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const q = searchParams.get("q") || "";
  const [value, setValue] = useState(q);
  const [prevQ, setPrevQ] = useState(q);

  if (q !== prevQ) {
    setValue(q);
    setPrevQ(q);
  }

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams(searchParams.toString());
    
    if (value.trim()) {
      params.set("q", value.trim());
    } else {
      params.delete("q");
    }
    
    // 검색 시 페이지네이션 초기화 및 검색어 적용
    router.push(`/?${params.toString()}`);
  };

  return (
    <form onSubmit={handleSearchSubmit} className="relative w-full">
      <Input
        type="search"
        enterKeyHint="search"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="축제 이름, 지역 검색"
        className="pl-11 pr-20 bg-background/50 border-border/80 !h-12 !text-base sm:!h-14 sm:pr-24"
      />
      <div className="absolute inset-y-0 left-3.5 flex items-center pointer-events-none text-muted-foreground/60">
        <Search size={19} />
      </div>
      <button
        type="submit"
        className="absolute right-1.5 top-1.5 h-10 px-3.5 rounded-lg bg-primary text-primary-foreground text-sm font-bold hover:bg-primary/90 transition-all cursor-pointer sm:right-2 sm:top-2 sm:px-5 sm:text-base"
      >
        검색
      </button>
    </form>
  );
}
