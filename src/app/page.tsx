// src/app/page.tsx
import { db } from "@/lib/db";
import { FestivalCard } from "@/components/festivals/FestivalCard";
import { FestivalFilters } from "@/components/festivals/FestivalFilters";
import { FestivalSearch } from "@/components/festivals/FestivalSearch";
import { FestivalSort } from "@/components/festivals/FestivalSort";
import { CalendarDays, CheckCircle2, Database, Map } from "lucide-react";
import { Suspense } from "react";
import { Prisma } from "@prisma/client";

export interface PageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function Home({ searchParams }: PageProps) {
  // Next.js 15/16 표준: searchParams는 비동기 프로미스이므로 반드시 await 처리합니다.
  const resolvedParams = await searchParams;

  const q = typeof resolvedParams.q === "string" ? resolvedParams.q.trim() : "";
  const region = typeof resolvedParams.region === "string" ? resolvedParams.region : "all";
  const category = typeof resolvedParams.category === "string" ? resolvedParams.category : "all";
  const month = typeof resolvedParams.month === "string" ? resolvedParams.month : "all";
  const sort = typeof resolvedParams.sort === "string" ? resolvedParams.sort : "trust";
  const rangeStart = typeof resolvedParams.start === "string" ? resolvedParams.start : "";
  const rangeEnd = typeof resolvedParams.end === "string" ? resolvedParams.end : "";

  const hasParking = resolvedParams.parking === "true";
  const hasShuttle = resolvedParams.shuttle === "true";
  const isPetFriendly = resolvedParams.pet === "true";
  const isChildFriendly = resolvedParams.child === "true";

  // --- Prisma Query 조건 조립 ---
  const where: Prisma.FestivalWhereInput = {
    status: "VERIFIED", // 일반 화면은 검수 완료된 건만 표시
  };
  const andConditions: Prisma.FestivalWhereInput[] = [];

  // 1. 검색어 필터 (이름, 설명, 지역, 주소 및 관련 상세 프로그램/초대가수 명칭 포함 여부)
  if (q) {
    where.OR = [
      { name: { contains: q } },
      { description: { contains: q } },
      { region: { contains: q } },
      { address: { contains: q } },
      {
        programs: {
          some: {
            OR: [
              { name: { contains: q } },
              { content: { contains: q } }
            ]
          }
        }
      }
    ];
  }

  // 2. 지역 필터
  if (region !== "all") {
    where.region = { contains: region };
  }

  // 3. 카테고리 필터
  if (category !== "all") {
    where.category = category;
  }

  // 4. 편의 옵션 필터 (체크된 옵션만 필터 조건에 포함)
  if (hasParking) where.hasParking = true;
  if (hasShuttle) where.hasShuttle = true;
  if (isPetFriendly) where.isPetFriendly = true;
  if (isChildFriendly) where.isChildFriendly = true;

  // 5. 개최 월 필터 (2026년 기준 월별 기간 오버랩 판정)
  if (month !== "all") {
    const mNum = Number(month);
    if (!isNaN(mNum)) {
      const pad = (n: number) => String(n).padStart(2, "0");
      const lastDay = new Date(2026, mNum, 0).getDate();
      const startOfMonth = new Date(`2026-${pad(mNum)}-01T00:00:00+09:00`);
      const endOfMonth = new Date(`2026-${pad(mNum)}-${pad(lastDay)}T23:59:59+09:00`);
      andConditions.push({
        startDate: { lte: endOfMonth },
        endDate: { gte: startOfMonth },
      });
    }
  }

  // 6. 날짜 범위 필터 (선택한 기간과 축제 기간이 하루라도 겹치면 노출)
  const parseDateInput = (value: string, endOfDay = false) => {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return null;
    return new Date(`${value}T${endOfDay ? "23:59:59" : "00:00:00"}+09:00`);
  };

  const parsedStart = parseDateInput(rangeStart);
  const parsedEnd = parseDateInput(rangeEnd, true);
  if (parsedStart || parsedEnd) {
    let searchStart = parsedStart ?? parseDateInput(rangeEnd)!;
    let searchEnd = parsedEnd ?? parseDateInput(rangeStart, true)!;

    if (searchStart > searchEnd) {
      [searchStart, searchEnd] = [searchEnd, searchStart];
    }

    andConditions.push({
      startDate: { lte: searchEnd },
      endDate: { gte: searchStart },
    });
  }

  // 7. 진행 상태 필터 (progress)
  // 날짜 범위 검색 중에는 기본값을 전체로 두어 과거 날짜도 검색 가능합니다.
  const progressDefault = parsedStart || parsedEnd ? "all" : "active";
  const progress = typeof resolvedParams.progress === "string" ? resolvedParams.progress : progressDefault;
  const demoToday = new Date("2026-05-25T17:39:43+09:00");

  if (progress === "active") {
    andConditions.push({ endDate: { gte: demoToday } });
  } else if (progress === "ongoing") {
    andConditions.push({
      startDate: { lte: demoToday },
      endDate: { gte: demoToday },
    });
  } else if (progress === "upcoming") {
    andConditions.push({ startDate: { gt: demoToday } });
  } else if (progress === "ended") {
    andConditions.push({ endDate: { lt: demoToday } });
  }

  if (andConditions.length > 0) {
    where.AND = andConditions;
  }

  // --- 정렬 조건 조립 ---
  let orderBy: Prisma.FestivalOrderByWithRelationInput = {};
  if (sort === "newest") {
    orderBy = { createdAt: "desc" };
  } else if (sort === "date") {
    orderBy = { startDate: "asc" };
  } else if (sort === "views") {
    orderBy = { views: "desc" };
  } else {
    // 기본값: 신뢰도순
    orderBy = { trustScore: "desc" };
  }

  // DB 조회 실행
  const festivals = await db.festival.findMany({
    where,
    orderBy,
  });
  // 실시간 라이브 통계 추출
  const totalCount = festivals.length;
  const now = new Date();
  const activeCount = festivals.filter(f => {
    const start = new Date(f.startDate);
    const end = new Date(f.endDate);
    return start <= now && end >= now;
  }).length;
  const verifiedCount = festivals.filter(f => f.trustScore >= 80).length;

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-3 py-5 pb-24 md:px-6 md:py-10 md:pb-10">
        
        <section className="hidden md:block mb-5 rounded-lg border border-border bg-card p-4 shadow-sm md:mb-8 md:p-7">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-2xl space-y-3">
              <div className="inline-flex items-center gap-2 rounded-full border border-border bg-secondary px-3 py-1.5 text-sm font-bold text-primary">
                <Database size={16} />
                전국 축제 통합 수집
              </div>
              <h1 className="text-2xl font-extrabold tracking-tight text-foreground md:text-4xl leading-tight">
                공식 출처와 실제 이미지를 우선한 축제 탐색
                믿을 수 있는 축제 정보만 모았습니다
              </h1>
              <p className="text-[0.95rem] leading-7 text-muted-foreground md:text-base">
                한국관광공사, 지자체, 지역 언론, 사용자 제보를 교차 수집하고 깨진 출처와 범용 스톡 이미지는 걸러냅니다.
              </p>
            </div>

             <div className="grid w-full grid-cols-3 gap-2 md:w-auto md:min-w-[400px] md:gap-3">
              {[
                { label: "검색 결과", value: totalCount, icon: Database },
                { label: "진행 중", value: activeCount, icon: CalendarDays },
                { label: "고신뢰", value: verifiedCount, icon: CheckCircle2 }
              ].map((stat) => {
                const Icon = stat.icon;
                return (
                  <div key={stat.label} className="flex min-h-24 flex-col items-start justify-between gap-2 rounded-lg border border-border bg-background p-3 md:justify-center md:gap-3 md:p-4">
                    <div className="flex items-center gap-1.5">
                      <Icon size={18} className="text-primary shrink-0" />
                      <span className="block text-xs font-bold leading-snug text-muted-foreground md:text-sm">{stat.label}</span>
                    </div>
                    <strong className="block text-xl font-extrabold text-foreground md:text-2xl">{stat.value}개</strong>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        <section className="mb-5 rounded-lg border border-border bg-card p-3 shadow-sm md:mb-6 md:p-5">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between md:gap-4">
            <div className="w-full md:flex-1">
              <Suspense fallback={<div className="h-10 bg-muted/20 animate-pulse rounded-lg" />}>
                <FestivalSearch />
              </Suspense>
            </div>
            <div className="flex w-full flex-col gap-2 sm:flex-row sm:items-center sm:justify-between md:w-auto md:justify-end md:gap-4 shrink-0">
              <span className="text-sm font-bold text-muted-foreground md:text-base shrink-0">
                총 {totalCount}개의 축제 표시
              </span>
              <Suspense fallback={<div className="h-10 w-48 bg-muted/20 animate-pulse rounded-lg" />}>
                <FestivalSort />
              </Suspense>
            </div>
          </div>
        </section>

        <section className="flex flex-col lg:flex-row gap-8 items-start">
          
          {/* 다차원 상세 필터 */}
          <Suspense fallback={<div className="w-72 h-96 bg-muted/20 animate-pulse rounded-lg" />}>
            <FestivalFilters />
          </Suspense>

          {/* 축제 카드 리스트 Grid */}
          <div className="flex-1 w-full">
            {festivals.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                {festivals.map((fest) => (
                  <div key={fest.id}>
                    <FestivalCard festival={fest} />
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-card border-2 border-dashed border-border rounded-2xl p-10 md:p-16 text-center space-y-4 max-w-md mx-auto mt-8 shadow-sm">
                <div className="h-16 w-16 rounded-full bg-secondary flex items-center justify-center text-muted-foreground mx-auto">
                  <Map size={32} />
                </div>
                <div className="space-y-2">
                  <h4 className="text-xl font-extrabold text-foreground font-serif">검색 결과가 없습니다</h4>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    다른 단어로 검색하시거나 필터 선택을 줄여보세요. 유효한 공식 출처가 확인되는 대로 신속하게 최신 로컬 축제 소식을 업데이트하겠습니다.
                  </p>
                </div>
              </div>
            )}
          </div>
        </section>

      </div>
    </div>
  );
}
