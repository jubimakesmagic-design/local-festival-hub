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
        placeholder="🔍 축제 이름이나 지역을 입력하세요"
        className="pl-12 pr-24 bg-background/50 border-border/80 !h-14 !text-base"
      />
      <div className="absolute inset-y-0 left-3.5 flex items-center pointer-events-none text-muted-foreground/60">
        <Search size={20} />
      </div>
      <button
        type="submit"
        className="absolute right-2 top-2 h-10 px-5 rounded-xl bg-primary text-primary-foreground text-base font-bold hover:bg-primary/90 transition-all cursor-pointer"
      >
        검색
      </button>
    </form>
  );
}
