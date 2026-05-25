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

  const hasParking = resolvedParams.parking === "true";
  const hasShuttle = resolvedParams.shuttle === "true";
  const isPetFriendly = resolvedParams.pet === "true";
  const isChildFriendly = resolvedParams.child === "true";

  // --- Prisma Query 조건 조립 ---
  const where: Prisma.FestivalWhereInput = {
    status: "VERIFIED", // 일반 화면은 검수 완료된 건만 표시
  };

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
      where.startDate = { lte: endOfMonth };
      where.endDate = { gte: startOfMonth };
    }
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
      <div className="container mx-auto px-4 py-8 md:px-6 md:py-10">
        
        <section className="mb-8 rounded-lg border border-border bg-card p-5 shadow-sm md:p-7">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-2xl space-y-3">
              <div className="inline-flex items-center gap-2 rounded-full border border-border bg-secondary px-3 py-1 text-xs font-bold text-primary">
                <Database size={14} />
                전국 축제 통합 수집
              </div>
              <h1 className="text-3xl font-extrabold tracking-tight text-foreground md:text-4xl">
                공식 출처와 실제 이미지를 우선한 축제 탐색
              </h1>
              <p className="text-sm leading-6 text-muted-foreground md:text-base">
                한국관광공사, 지자체, 지역 언론, 사용자 제보를 교차 수집하고 깨진 출처와 범용 스톡 이미지는 걸러냅니다.
              </p>
            </div>

            <div className="grid grid-cols-3 gap-2 sm:min-w-[360px]">
              {[
                { label: "검색 결과", value: totalCount, icon: Database },
                { label: "진행 중", value: activeCount, icon: CalendarDays },
                { label: "고신뢰", value: verifiedCount, icon: CheckCircle2 }
              ].map((stat) => {
                const Icon = stat.icon;
                return (
                  <div key={stat.label} className="rounded-lg border border-border bg-background p-3">
                    <Icon size={15} className="mb-2 text-primary" />
                    <span className="block text-[11px] font-semibold text-muted-foreground">{stat.label}</span>
                    <strong className="mt-1 block text-xl font-extrabold text-foreground">{stat.value}개</strong>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        <section className="mb-6 rounded-lg border border-border bg-card p-4 shadow-sm md:p-5">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="w-full md:flex-1">
              <Suspense fallback={<div className="h-10 bg-muted/20 animate-pulse rounded-lg" />}>
                <FestivalSearch />
              </Suspense>
            </div>
            <div className="flex w-full md:w-auto items-center justify-between md:justify-end gap-4 shrink-0">
              <span className="text-xs font-bold text-muted-foreground">
                {totalCount}건 표시
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
              <div className="bg-card border-2 border-dashed border-border rounded-xl p-16 text-center space-y-4 max-w-md mx-auto mt-8 shadow-sm">
                <div className="h-14 w-14 rounded-full bg-secondary flex items-center justify-center text-muted-foreground mx-auto">
                  <Map size={24} />
                </div>
                <div className="space-y-1.5">
                  <h4 className="font-extrabold text-foreground font-serif">기록된 발자취가 없습니다</h4>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    다른 키워드로 찾아보거나 필터 조건을 줄여보세요. 아직 여기에 기록되지 않은 작은 동네 축제를 알고 계시다면 바로 제보해 주세요!
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
