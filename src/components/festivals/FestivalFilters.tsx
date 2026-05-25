// src/components/festivals/FestivalFilters.tsx
"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Check, RotateCcw, SlidersHorizontal } from "lucide-react";

export function FestivalFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // URL 쿼리 상태 파싱
  const currentRegion = searchParams.get("region") || "all";
  const currentCategory = searchParams.get("category") || "all";
  const currentMonth = searchParams.get("month") || "all";
  const hasParking = searchParams.get("parking") === "true";
  const hasShuttle = searchParams.get("shuttle") === "true";
  const isPetFriendly = searchParams.get("pet") === "true";
  const isChildFriendly = searchParams.get("child") === "true";

  const regions = [
    { value: "all", label: "전국 전체" },
    { value: "서울", label: "서울" },
    { value: "부산", label: "부산" },
    { value: "대구", label: "대구" },
    { value: "인천", label: "인천" },
    { value: "광주", label: "광주" },
    { value: "대전", label: "대전" },
    { value: "울산", label: "울산" },
    { value: "세종", label: "세종" },
    { value: "경기", label: "경기도" },
    { value: "강원", label: "강원도" },
    { value: "충북", label: "충청북도" },
    { value: "충남", label: "충청남도" },
    { value: "전북", label: "전라북도" },
    { value: "전남", label: "전라남도" },
    { value: "경북", label: "경상북도" },
    { value: "경남", label: "경상남도" },
    { value: "제주", label: "제주" }
  ];

  const categories = [
    { value: "all", label: "전체 카테고리" },
    { value: "FOOD", label: "먹거리 축제" },
    { value: "NATURE", label: "자연/경관" },
    { value: "CULTURE", label: "전통/문화" },
    { value: "ART", label: "전시/예술" },
    { value: "MUSIC", label: "공연/음악" },
    { value: "OTHER", label: "기타 행사" }
  ];

  const months = [
    { value: "all", label: "전체" },
    ...Array.from({ length: 12 }, (_, idx) => ({ value: String(idx + 1), label: `${idx + 1}월` }))
  ];

  // 단일 매개변수 실시간 업데이트 함수
  const updateFilterParam = (key: string, value: string | boolean) => {
    const params = new URLSearchParams(searchParams.toString());
    
    if (value === "all" || value === false || value === "") {
      params.delete(key);
    } else {
      params.set(key, String(value));
    }
    
    router.push(`/?${params.toString()}`);
  };

  // 모든 필터 초기화
  const handleResetFilters = () => {
    router.push("/");
  };

  const filterContent = (
    <div className="space-y-6 text-sm font-semibold">
      {/* 1. 지역 대시보드 필터 */}
      <div className="space-y-2.5">
        <h5 className="text-[11px] font-bold text-muted-foreground">지역</h5>
        <div className="grid max-h-72 grid-cols-2 gap-2 overflow-y-auto pr-1">
          {regions.map((reg) => {
            const isSelected = currentRegion === reg.value;
            return (
              <button
                key={reg.value}
                onClick={() => updateFilterParam("region", reg.value)}
                className={`flex items-center justify-between px-3 py-1.5 text-xs font-bold border transition-all text-left rounded cursor-pointer ${
                  isSelected
                    ? "bg-primary text-primary-foreground border-primary shadow-sm"
                    : "bg-background border-border hover:bg-secondary/40 text-foreground"
                }`}
              >
                <span>{reg.label}</span>
                {isSelected && <Check size={11} className="text-primary-foreground shrink-0" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* 개최 월별 필터 */}
      <div className="space-y-2.5">
        <h5 className="text-[11px] font-bold text-muted-foreground">개최 월</h5>
        <div className="grid grid-cols-4 gap-1.5">
          {months.map((m) => {
            const isSelected = currentMonth === m.value;
            return (
              <button
                key={m.value}
                onClick={() => updateFilterParam("month", m.value)}
                className={`flex items-center justify-center py-1.5 text-xs font-bold border transition-all rounded cursor-pointer ${
                  isSelected
                    ? "bg-primary text-primary-foreground border-primary shadow-sm"
                    : "bg-background border-border hover:bg-secondary/40 text-foreground"
                }`}
              >
                <span>{m.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. 카테고리별 아날로그 필터 */}
      <div className="space-y-2.5">
        <h5 className="text-[11px] font-bold text-muted-foreground">분야</h5>
        <div className="flex flex-col space-y-1.5">
          {categories.map((cat) => {
            const isSelected = currentCategory === cat.value;
            return (
              <button
                key={cat.value}
                onClick={() => updateFilterParam("category", cat.value)}
                className={`flex items-center justify-between px-3 py-2.5 text-xs font-bold border transition-all text-left rounded cursor-pointer ${
                  isSelected
                    ? "bg-primary text-primary-foreground border-primary shadow-sm"
                    : "bg-background border-border hover:bg-secondary/40 text-foreground"
                }`}
              >
                <span>{cat.label}</span>
                {isSelected && <Check size={11} className="text-primary-foreground shrink-0" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. 편의/옵션 다차원 필터 */}
      <div className="space-y-2.5">
        <h5 className="text-[11px] font-bold text-muted-foreground">편의정보</h5>
        <div className="space-y-2">
          {[
            { key: "parking", val: hasParking, label: "주차공간 제공" },
            { key: "shuttle", val: hasShuttle, label: "셔틀버스 운영" },
            { key: "pet", val: isPetFriendly, label: "반려동물 동반 가능" },
            { key: "child", val: isChildFriendly, label: "아이와 가기 좋은 곳" }
          ].map((opt) => {
            return (
              <label
                key={opt.key}
                className="flex items-center space-x-2.5 px-3 py-2 bg-background border border-border rounded hover:bg-secondary/40 transition-colors text-xs font-bold cursor-pointer"
              >
                <input
                  type="checkbox"
                  checked={opt.val}
                  onChange={(e) => updateFilterParam(opt.key, e.target.checked)}
                  className="h-3.5 w-3.5 rounded-sm border-border text-primary focus:ring-primary/20 cursor-pointer"
                />
                <span>{opt.label}</span>
              </label>
            );
          })}

        </div>
      </div>

      {/* 4. 초기화 액션 */}
      <button 
        className="w-full text-xs font-bold h-9 press-button cursor-pointer flex items-center justify-center rounded" 
        onClick={handleResetFilters}
      >
        <RotateCcw size={12} className="mr-1.5 shrink-0" />
        필터 및 검색 초기화
      </button>
    </div>
  );

  return (
    <>
      {/* 데스크톱 사이드바 뷰 - 여행자 기록 대장 북마크 감성 */}
      <aside className="hidden lg:block w-72 shrink-0">
        <div className="sticky top-20 rounded-lg border border-border bg-card p-5 shadow-sm">
          <div className="flex flex-row items-center justify-between pb-4 border-b border-border mb-4">
            <h4 className="text-sm flex items-center space-x-1.5 font-extrabold text-foreground">
              <SlidersHorizontal size={14} className="text-primary" />
              <span>상세 조건</span>
            </h4>
          </div>
          <div>{filterContent}</div>
        </div>
      </aside>

      {/* 모바일 하단 플로팅 필터 트리거 */}
      <div className="lg:hidden fixed bottom-6 left-1/2 -translate-x-1/2 z-40">
        <button
          onClick={() => (document.getElementById("filter-dialog") as HTMLDialogElement)?.showModal()}
          className="rounded shadow-2xl bg-primary text-primary-foreground font-bold flex items-center space-x-1.5 px-5 py-2.5 text-xs h-10 border border-primary hover:scale-105 active:scale-95 transition-all cursor-pointer"
        >
          <SlidersHorizontal size={14} />
          <span>상세 조건 필터</span>
        </button>
      </div>

      {/* 모바일 전용 네이티브 바텀시트 <dialog> */}
      <dialog
        id="filter-dialog"
        className="lg:hidden fixed inset-x-0 bottom-0 top-auto m-0 w-full rounded-t-3xl max-h-[85vh] bg-card border-t border-border shadow-2xl p-6 focus:outline-none backdrop:bg-black/50 backdrop:backdrop-blur-sm animate-slide-down overflow-y-auto"
      >
        <div className="flex flex-col h-full">
          {/* 드로어 헤더 */}
          <div className="flex items-center justify-between pb-4 border-b border-border/40 mb-5">
            <h4 className="text-base font-extrabold flex items-center space-x-1.5 font-serif text-foreground">
              <SlidersHorizontal size={16} className="text-primary" />
              <span>상세 조건 필터</span>
            </h4>
            <button
              onClick={() => (document.getElementById("filter-dialog") as HTMLDialogElement)?.close()}
              className="h-8 w-8 rounded bg-secondary flex items-center justify-center font-bold text-muted-foreground hover:text-foreground active:scale-90 transition-transform cursor-pointer text-sm"
            >
              ✕
            </button>
          </div>
          {/* 드로어 컨텐츠 */}
          <div className="flex-1 overflow-y-auto pb-10">{filterContent}</div>
        </div>
      </dialog>
    </>
  );
}
