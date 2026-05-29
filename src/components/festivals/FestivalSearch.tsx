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
    <div className="grid w-full gap-4 xl:grid-cols-[minmax(320px,0.95fr)_minmax(360px,1fr)] xl:items-end">
      <div className="space-y-2">
        <div className="flex min-h-8 items-center justify-between gap-2">
          <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
            <CalendarRange size={18} className="shrink-0 text-primary" />
            <span>방문 기간</span>
          </div>
          {(currentStart || currentEnd) && (
            <button
              type="button"
              onClick={clearDateRange}
              className="inline-flex min-h-8 items-center gap-1 rounded-md border border-border bg-background px-2.5 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              <X size={14} />
              기간 지우기
            </button>
          )}
        </div>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <label className="space-y-2">
            <span className="block text-xs font-medium text-muted-foreground">시작일</span>
            <input
              type="date"
              value={currentStart}
              onChange={(e) => updateDateRange("start", e.target.value)}
              className="h-12 w-full rounded-lg border border-border bg-background px-3 text-base font-medium text-foreground focus-visible:border-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/20"
            />
          </label>
          <label className="space-y-2">
            <span className="block text-xs font-medium text-muted-foreground">종료일</span>
            <input
              type="date"
              value={currentEnd}
              onChange={(e) => updateDateRange("end", e.target.value)}
              className="h-12 w-full rounded-lg border border-border bg-background px-3 text-base font-medium text-foreground focus-visible:border-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/20"
            />
          </label>
        </div>
      </div>

      <form onSubmit={handleSearchSubmit} className="space-y-2">
        <label className="block text-sm font-semibold text-foreground" htmlFor="festival-keyword">
          축제명 또는 지역
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
              className="!h-12 !rounded-lg border-border bg-background pl-11 !text-base !font-medium"
            />
            <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-muted-foreground">
              <Search size={19} />
            </div>
          </div>
          <button
            type="submit"
            className="inline-flex h-12 cursor-pointer items-center justify-center rounded-lg bg-primary px-5 text-base font-semibold text-primary-foreground shadow-sm transition-colors hover:bg-primary/92"
          >
            검색
          </button>
        </div>
      </form>
    </div>
  );
}
