// src/components/festivals/FestivalSearch.tsx
"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/Input";

export function FestivalSearch() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // URL에서 'q' 매개변수를 읽어서 검색 기본값 설정
  const [value, setValue] = useState(searchParams.get("q") || "");

  useEffect(() => {
    setValue(searchParams.get("q") || "");
  }, [searchParams]);

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
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="축제명, 장소, 출처 등 키워드로 찾아보세요..."
        className="pl-11 pr-20 bg-background/50 border-border/80"
      />
      <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-muted-foreground/60">
        <Search size={16} />
      </div>
      <button
        type="submit"
        className="absolute right-2 top-1.5 h-8 px-4 rounded-lg bg-primary text-primary-foreground text-xs font-bold hover:bg-primary/90 transition-all cursor-pointer"
      >
        검색
      </button>
    </form>
  );
}
