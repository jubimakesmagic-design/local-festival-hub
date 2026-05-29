// src/app/page.tsx
import { db } from "@/lib/db";
import { FestivalCard } from "@/components/festivals/FestivalCard";
import { FestivalFilters } from "@/components/festivals/FestivalFilters";
import { FestivalSearch } from "@/components/festivals/FestivalSearch";
import { FestivalSort } from "@/components/festivals/FestivalSort";
import { CalendarDays, CheckCircle2, Database, Map, MapPin } from "lucide-react";
import { Suspense } from "react";
import { Prisma } from "@prisma/client";
import { getFestivalNow, parseKoreaDateInput } from "@/lib/dates";

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
  const parsedStart = parseKoreaDateInput(rangeStart);
  const parsedEnd = parseKoreaDateInput(rangeEnd, true);
  if (parsedStart || parsedEnd) {
    let searchStart = parsedStart ?? parseKoreaDateInput(rangeEnd)!;
    let searchEnd = parsedEnd ?? parseKoreaDateInput(rangeStart, true)!;

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
  const today = getFestivalNow();

  if (progress === "active") {
    andConditions.push({ endDate: { gte: today } });
  } else if (progress === "ongoing") {
    andConditions.push({
      startDate: { lte: today },
      endDate: { gte: today },
    });
  } else if (progress === "upcoming") {
    andConditions.push({ startDate: { gt: today } });
  } else if (progress === "ended") {
    andConditions.push({ endDate: { lt: today } });
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
  const now = getFestivalNow();
  const activeCount = festivals.filter(f => {
    const start = new Date(f.startDate);
    const end = new Date(f.endDate);
    return start <= now && end >= now;
  }).length;
  const verifiedCount = festivals.filter(f => f.trustScore >= 80).length;

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto max-w-7xl px-4 py-6 pb-24 md:px-6 md:py-8 md:pb-10">
        <section className="mb-5 border-b border-border pb-5 md:mb-6 md:pb-6">
          <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end">
            <div className="max-w-3xl">
              <div className="mb-2 flex items-center gap-2 text-sm font-medium text-primary">
                <MapPin size={16} className="shrink-0" />
                <span>전국 로컬 축제 안내</span>
              </div>
              <h1 className="text-2xl font-bold leading-tight tracking-normal text-foreground md:text-3xl">
                날짜와 지역에 맞는 동네축제를 찾아보세요
              </h1>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground md:text-base">
                공식 출처가 확인된 축제 정보를 기준으로 기간, 지역, 편의 조건을 빠르게 좁힐 수 있습니다.
              </p>
            </div>

            <div className="grid grid-cols-3 gap-2 lg:min-w-[360px]">
              {[
                { label: "검색 결과", value: totalCount, icon: Database },
                { label: "진행 중", value: activeCount, icon: CalendarDays },
                { label: "고신뢰", value: verifiedCount, icon: CheckCircle2 }
              ].map((stat) => {
                const Icon = stat.icon;
                return (
                  <div key={stat.label} className="min-h-20 rounded-lg border border-border bg-card p-3 shadow-sm">
                    <div className="flex items-center gap-1.5 text-muted-foreground">
                      <Icon size={16} className="shrink-0 text-primary" />
                      <span className="text-xs font-medium leading-snug md:text-sm">{stat.label}</span>
                    </div>
                    <strong className="mt-2 block text-xl font-bold text-foreground md:text-2xl">{stat.value}개</strong>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        <section className="mb-6 rounded-lg border border-border bg-card p-3 shadow-sm md:p-4">
          <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end">
            <div className="w-full">
              <Suspense fallback={<div className="h-10 bg-muted/20 animate-pulse rounded-lg" />}>
                <FestivalSearch />
              </Suspense>
            </div>
            <div className="flex w-full flex-col gap-2 sm:flex-row sm:items-end sm:justify-between lg:w-64 lg:flex-col lg:items-stretch lg:justify-end">
              <span className="text-sm font-medium text-muted-foreground">
                현재 조건 <strong className="font-semibold text-foreground">{totalCount}개</strong>
              </span>
              <Suspense fallback={<div className="h-10 w-48 bg-muted/20 animate-pulse rounded-lg" />}>
                <FestivalSort />
              </Suspense>
            </div>
          </div>
        </section>

        <section className="flex flex-col items-start gap-6 lg:flex-row">
          <Suspense fallback={<div className="w-72 h-96 bg-muted/20 animate-pulse rounded-lg" />}>
            <FestivalFilters />
          </Suspense>

          <div className="w-full flex-1">
            {festivals.length > 0 ? (
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
                {festivals.map((fest) => (
                  <div key={fest.id}>
                    <FestivalCard festival={fest} />
                  </div>
                ))}
              </div>
            ) : (
              <div className="mx-auto mt-6 max-w-md rounded-lg border border-dashed border-border bg-card p-8 text-center shadow-sm md:p-10">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-lg bg-secondary text-muted-foreground">
                  <Map size={26} />
                </div>
                <div className="mt-4 space-y-2">
                  <h4 className="text-lg font-semibold text-foreground">검색 결과가 없습니다</h4>
                  <p className="text-sm leading-6 text-muted-foreground">
                    검색어를 바꾸거나 선택한 조건을 줄여보세요.
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
