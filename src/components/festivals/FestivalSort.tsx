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
    <label className="block w-full space-y-2 sm:w-60">
      <span className="block text-base font-extrabold text-foreground md:hidden">정렬 방식</span>
      <Select 
        value={currentSort} 
        onChange={handleSortChange} 
        className="h-14 rounded-lg border-2 border-border bg-card py-3 text-lg font-extrabold shadow-sm"
      >
        <option value="trust">신뢰도 높은 순</option>
        <option value="newest">최근 등록순</option>
        <option value="date">축제 시작일순</option>
        <option value="views">조회 인기순</option>
      </Select>
    </label>
  );
}
