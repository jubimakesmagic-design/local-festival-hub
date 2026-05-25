// src/components/festivals/FestivalSort.tsx
"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Select } from "@/components/ui/Select";

export function FestivalSort() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // 기본 정렬: 신뢰도순 ('trust')
  const currentSort = searchParams.get("sort") || "trust";

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("sort", e.target.value);
    router.push(`/?${params.toString()}`);
  };

  return (
    <div className="w-full sm:w-48">
      <Select 
        value={currentSort} 
        onChange={handleSortChange} 
        className="bg-card border-border/80 text-xs font-bold h-10 py-2 shadow-sm"
      >
        <option value="trust">신뢰도 점수 순</option>
        <option value="newest">최근 등록순</option>
        <option value="date">축제 시작일순</option>
        <option value="views">조회 인기순</option>
      </Select>
    </div>
  );
}
