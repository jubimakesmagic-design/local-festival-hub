// src/components/festivals/FestivalFilters.tsx
"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Check, RotateCcw, SlidersHorizontal, X } from "lucide-react";

export function FestivalFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // URL 쿼리 상태 파싱
  const currentRegion = searchParams.get("region") || "all";
  const currentCategory = searchParams.get("category") || "all";
  const currentMonth = searchParams.get("month") || "all";
  const hasDateRange = searchParams.has("start") || searchParams.has("end");
  const hasParking = searchParams.get("parking") === "true";
  const hasShuttle = searchParams.get("shuttle") === "true";
  const isPetFriendly = searchParams.get("pet") === "true";
  const isChildFriendly = searchParams.get("child") === "true";
  const currentProgress = searchParams.get("progress") || (hasDateRange ? "all" : "active");

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

  const progressOptions = [
    { value: "active", label: "진행 중 및 예정" },
    { value: "all", label: "전체 축제 (지난 축제 포함)" },
    { value: "ongoing", label: "지금 진행 중" },
    { value: "upcoming", label: "앞으로 열림" },
    { value: "ended", label: "종료됨" }
  ];

  // 단일 매개변수 실시간 업데이트 함수
  const updateFilterParam = (key: string, value: string | boolean) => {
    const params = new URLSearchParams(searchParams.toString());
    
    if (key === "progress") {
      if (value === "active") {
        params.delete(key);
      } else {
        params.set(key, String(value));
      }
    } else {
      if (value === "all" || value === false || value === "") {
        params.delete(key);
      } else {
        params.set(key, String(value));
      }
    }
    
    router.push(`/?${params.toString()}`);
  };

  // 모든 필터 초기화
  const handleResetFilters = () => {
    router.push("/");
  };

  const filterContent = (
    <div className="space-y-6 text-sm font-medium">
      <div className="space-y-2.5">
        <h5 className="text-sm font-semibold text-foreground">지역</h5>
        <div className="grid max-h-72 grid-cols-2 gap-2 overflow-y-auto pr-1">
          {regions.map((reg) => {
            const isSelected = currentRegion === reg.value;
            return (
              <button
                key={reg.value}
                onClick={() => updateFilterParam("region", reg.value)}
                className={`flex min-h-11 cursor-pointer items-center justify-between rounded-lg border px-3 py-2.5 text-left text-sm font-medium transition-colors ${
                  isSelected
                    ? "border-primary bg-primary text-primary-foreground shadow-sm"
                    : "border-border bg-background text-foreground hover:bg-secondary/60"
                }`}
              >
                <span>{reg.label}</span>
                {isSelected && <Check size={14} className="text-primary-foreground shrink-0" />}
              </button>
            );
          })}
        </div>
      </div>

      <div className="space-y-2.5">
        <h5 className="text-sm font-semibold text-foreground">개최 월</h5>
        <div className="grid grid-cols-4 gap-1.5">
          {months.map((m) => {
            const isSelected = currentMonth === m.value;
            return (
              <button
                key={m.value}
                onClick={() => updateFilterParam("month", m.value)}
                className={`flex min-h-10 cursor-pointer items-center justify-center rounded-lg border py-2 text-sm font-medium transition-colors ${
                  isSelected
                    ? "border-primary bg-primary text-primary-foreground shadow-sm"
                    : "border-border bg-background text-foreground hover:bg-secondary/60"
                }`}
              >
                <span>{m.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="space-y-2.5">
        <h5 className="text-sm font-semibold text-foreground">분야</h5>
        <div className="flex flex-col space-y-1.5">
          {categories.map((cat) => {
            const isSelected = currentCategory === cat.value;
            return (
              <button
                key={cat.value}
                onClick={() => updateFilterParam("category", cat.value)}
                className={`flex min-h-11 cursor-pointer items-center justify-between rounded-lg border px-3 py-2.5 text-left text-sm font-medium transition-colors ${
                  isSelected
                    ? "border-primary bg-primary text-primary-foreground shadow-sm"
                    : "border-border bg-background text-foreground hover:bg-secondary/60"
                }`}
              >
                <span>{cat.label}</span>
                {isSelected && <Check size={14} className="text-primary-foreground shrink-0" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* 진행 상태 필터 */}
      <div className="space-y-2.5">
        <h5 className="text-sm font-semibold text-foreground">진행 상태</h5>
        <div className="flex flex-col space-y-1.5">
          {progressOptions.map((prog) => {
            const isSelected = currentProgress === prog.value;
            return (
              <button
                key={prog.value}
                onClick={() => updateFilterParam("progress", prog.value)}
                className={`flex min-h-11 cursor-pointer items-center justify-between rounded-lg border px-3 py-2.5 text-left text-sm font-medium transition-colors ${
                  isSelected
                    ? "border-primary bg-primary text-primary-foreground shadow-sm"
                    : "border-border bg-background text-foreground hover:bg-secondary/60"
                }`}
              >
                <span>{prog.label}</span>
                {isSelected && <Check size={14} className="text-primary-foreground shrink-0" />}
              </button>
            );
          })}
        </div>
      </div>

      <div className="space-y-2.5">
        <h5 className="text-sm font-semibold text-foreground">편의정보</h5>
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
                className="flex min-h-11 cursor-pointer items-center space-x-3 rounded-lg border border-border bg-background px-3 py-2.5 text-sm font-medium transition-colors hover:bg-secondary/60"
              >
                <input
                  type="checkbox"
                  checked={opt.val}
                  onChange={(e) => updateFilterParam(opt.key, e.target.checked)}
                  className="h-5 w-5 cursor-pointer rounded-sm border-border text-primary focus:ring-primary/20"
                />
                <span>{opt.label}</span>
              </label>
            );
          })}

        </div>
      </div>

      <button 
        className="flex h-11 w-full cursor-pointer items-center justify-center rounded-lg border border-border bg-background text-sm font-semibold text-foreground transition-colors hover:bg-secondary/70" 
        onClick={handleResetFilters}
      >
        <RotateCcw size={16} className="mr-2 shrink-0 text-muted-foreground" />
        조건 초기화
      </button>
    </div>
  );

  return (
    <>
      <aside className="hidden w-64 shrink-0 lg:block">
        <div className="sticky top-20 rounded-lg border border-border bg-card p-4 shadow-sm">
          <div className="mb-4 flex flex-row items-center justify-between border-b border-border pb-3">
            <h4 className="flex items-center space-x-1.5 text-sm font-semibold text-foreground">
              <SlidersHorizontal size={16} className="text-primary" />
              <span>조건</span>
            </h4>
          </div>
          <div>{filterContent}</div>
        </div>
      </aside>

      <div className="mb-5 w-full lg:hidden">
        <button
          onClick={() => (document.getElementById("filter-dialog") as HTMLDialogElement)?.showModal()}
          className="flex h-12 w-full cursor-pointer items-center justify-center space-x-2 rounded-lg border border-primary bg-primary px-4 py-3 text-base font-semibold text-primary-foreground shadow-sm transition-colors hover:bg-primary/92"
        >
          <SlidersHorizontal size={20} />
          <span>조건 열기</span>
        </button>
      </div>

      <dialog
        id="filter-dialog"
        className="fixed inset-x-0 bottom-0 top-auto m-0 max-h-[92dvh] w-full overflow-y-auto rounded-t-lg border-t border-border bg-card p-4 shadow-2xl backdrop:bg-black/45 backdrop:backdrop-blur-sm focus:outline-none lg:hidden"
      >
        <div className="flex flex-col h-full">
          <div className="mb-5 flex items-center justify-between border-b border-border/40 pb-4">
            <h4 className="flex items-center space-x-2 text-base font-semibold text-foreground">
              <SlidersHorizontal size={20} className="text-primary" />
              <span>조건</span>
            </h4>
            <button
              onClick={() => (document.getElementById("filter-dialog") as HTMLDialogElement)?.close()}
              className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-lg bg-secondary text-muted-foreground transition-colors hover:text-foreground"
              aria-label="필터 닫기"
            >
              <X size={20} />
            </button>
          </div>
          <div className="flex-1 overflow-y-auto pb-[calc(4rem+env(safe-area-inset-bottom))]">{filterContent}</div>
        </div>
      </dialog>
    </>
  );
}
