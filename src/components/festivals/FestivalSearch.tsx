// src/components/festivals/FestivalSearch.tsx
"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { CalendarRange, Search, X } from "lucide-react";
import { Input } from "@/components/ui/Input";

export function FestivalSearch() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const q = searchParams.get("q") || "";
  const currentStart = searchParams.get("start") || "";
  const currentEnd = searchParams.get("end") || "";
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

  const updateDateRange = (key: "start" | "end", nextValue: string) => {
    const params = new URLSearchParams(searchParams.toString());

    if (nextValue) {
      params.set(key, nextValue);
      if (!searchParams.has("progress")) {
        params.delete("progress");
      }
    } else {
      params.delete(key);
    }

    router.push(`/?${params.toString()}`);
  };

  const clearDateRange = () => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete("start");
    params.delete("end");
    router.push(`/?${params.toString()}`);
  };

  return (
    <div className="w-full space-y-4">
      <div className="rounded-lg border border-border bg-background p-4">
        <div className="mb-3 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 text-base font-extrabold text-foreground">
            <CalendarRange size={20} className="text-primary" />
            <span>언제 가시나요?</span>
          </div>
          {(currentStart || currentEnd) && (
            <button
              type="button"
              onClick={clearDateRange}
              className="inline-flex min-h-10 items-center gap-1 rounded border border-border bg-card px-3 text-sm font-bold text-muted-foreground transition hover:text-foreground"
            >
              <X size={15} />
              지우기
            </button>
          )}
        </div>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <label className="space-y-2">
            <span className="block text-base font-extrabold text-foreground">시작일</span>
            <input
              type="date"
              value={currentStart}
              onChange={(e) => updateDateRange("start", e.target.value)}
              className="h-14 w-full rounded-lg border-2 border-border bg-card px-4 text-lg font-extrabold text-foreground focus-visible:border-primary focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary/20"
            />
          </label>
          <label className="space-y-2">
            <span className="block text-base font-extrabold text-foreground">종료일</span>
            <input
              type="date"
              value={currentEnd}
              onChange={(e) => updateDateRange("end", e.target.value)}
              className="h-14 w-full rounded-lg border-2 border-border bg-card px-4 text-lg font-extrabold text-foreground focus-visible:border-primary focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary/20"
            />
          </label>
        </div>
      </div>

      <form onSubmit={handleSearchSubmit} className="space-y-2">
        <label className="block text-base font-extrabold text-foreground" htmlFor="festival-keyword">
          축제 이름 또는 지역
        </label>
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-[1fr_auto]">
          <div className="relative">
            <Input
              id="festival-keyword"
              type="search"
              enterKeyHint="search"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder="예: 강릉, 꽃축제"
              className="pl-12 bg-background border-border !h-14 !rounded-lg !border-2 !text-lg !font-bold"
            />
            <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-muted-foreground">
              <Search size={22} />
            </div>
          </div>
          <button
            type="submit"
            className="h-14 rounded-lg bg-primary px-6 text-lg font-extrabold text-primary-foreground transition hover:bg-primary/90 cursor-pointer"
          >
            검색하기
          </button>
        </div>
      </form>
    </div>
  );
}
