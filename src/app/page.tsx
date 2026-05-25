// src/app/page.tsx
import { db } from "@/lib/db";
import { FestivalCard } from "@/components/festivals/FestivalCard";
import { FestivalFilters } from "@/components/festivals/FestivalFilters";
import { FestivalSearch } from "@/components/festivals/FestivalSearch";
import { FestivalSort } from "@/components/festivals/FestivalSort";
import { SlidersHorizontal, Map, Sparkles, Compass } from "lucide-react";
import { Suspense } from "react";

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
  const where: any = {
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
      const lastDays: Record<number, number> = { 4: 30, 5: 31, 6: 30, 7: 31 };
      const lastDay = lastDays[mNum] || 31;
      const startOfMonth = new Date(`2026-${pad(mNum)}-01T00:00:00+09:00`);
      const endOfMonth = new Date(`2026-${pad(mNum)}-${pad(lastDay)}T23:59:59+09:00`);
      where.startDate = { lte: endOfMonth };
      where.endDate = { gte: startOfMonth };
    }
  }

  // --- 정렬 조건 조립 ---
  let orderBy: any = {};
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
    <div className="min-h-screen py-10 relative overflow-hidden bg-background">
      <div className="container mx-auto px-4 md:px-6 relative z-10">
        
        {/* 상단 화사하고 프리미엄한 축제 광장 히어로 배너 */}
        <section className="mb-12 text-center max-w-4xl mx-auto space-y-6 animate-slide-up pt-6 relative">
          <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full border border-primary/30 bg-primary/5 text-primary text-xs font-extrabold tracking-wider stamp-badge animate-fade-in mx-auto">
            <Compass size={14} className="text-primary animate-spin-slow" />
            <span className="font-typewriter uppercase tracking-wider text-[10px]">LOCAL FESTIVAL NOTEBOOK</span>
          </div>
          
          <h2 className="text-3xl md:text-5xl lg:text-5.5xl font-black tracking-tight text-foreground font-serif leading-tight">
            발길 닿는 곳마다 마주하는,<br />
            우리 동네 <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">숨은 축제 기록첩</span>
          </h2>
          
          <p className="text-xs md:text-base text-muted-foreground font-medium max-w-xl mx-auto leading-relaxed">
            대형 공식 사이트에는 없는 따뜻하고 소박한 동네 소식, 이웃들의 장터, 마을 골목 버스킹까지 직접 찾고 실시간 제보해 나갑니다.
          </p>

          {/* 실시간 라이브 통계 스티커 보드 */}
          <div className="grid grid-cols-3 gap-3 md:gap-4 max-w-2xl mx-auto pt-4 pb-2">
            <div className="bg-card border border-border/80 p-3 rounded-xl shadow-md shadow-primary/5 hover:scale-103 transition-transform">
              <span className="block text-[10px] md:text-xs font-bold text-muted-foreground uppercase font-typewriter">TOTAL RECORDS</span>
              <span className="block text-lg md:text-2xl font-black text-primary font-typewriter pt-1">{totalCount}개</span>
            </div>
            <div className="bg-card border border-border/80 p-3 rounded-xl shadow-md shadow-primary/5 hover:scale-103 transition-transform">
              <span className="block text-[10px] md:text-xs font-bold text-muted-foreground uppercase font-typewriter">ONGOING NOW</span>
              <span className="block text-lg md:text-2xl font-black text-accent font-typewriter pt-1">{activeCount}개</span>
            </div>
            <div className="bg-card border border-border/80 p-3 rounded-xl shadow-md shadow-primary/5 hover:scale-103 transition-transform">
              <span className="block text-[10px] md:text-xs font-bold text-muted-foreground uppercase font-typewriter">VERIFIED ARCHIVES</span>
              <span className="block text-lg md:text-2xl font-black text-primary font-typewriter pt-1">{verifiedCount}개</span>
            </div>
          </div>

          <hr className="diary-divider max-w-[240px] mx-auto opacity-60" />
        </section>

        {/* 검색 및 정렬 컨트롤 보드 */}
        <section className="mb-10 max-w-4xl mx-auto bg-card border border-border/80 p-5 md:p-6 shadow-xl shadow-primary/5 rounded-2xl space-y-4 animate-slide-up">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="w-full md:flex-1">
              <Suspense fallback={<div className="h-10 bg-muted/20 animate-pulse rounded-lg" />}>
                <FestivalSearch />
              </Suspense>
            </div>
            <div className="flex w-full md:w-auto items-center justify-between md:justify-end gap-4 shrink-0">
              <span className="text-[11px] font-bold text-muted-foreground font-typewriter uppercase">
                RECORDS: <span className="text-primary font-black">{totalCount}</span> FOUND
              </span>
              <Suspense fallback={<div className="h-10 w-48 bg-muted/20 animate-pulse rounded-lg" />}>
                <FestivalSort />
              </Suspense>
            </div>
          </div>
        </section>

        {/* 메인 레이아웃: 좌측 다이어리 필터 북마크 + 우측 스크랩 북 카드 리스트 */}
        <section className="flex flex-col lg:flex-row gap-8 items-start">
          
          {/* 다차원 상세 필터 */}
          <Suspense fallback={<div className="w-72 h-96 bg-muted/20 animate-pulse rounded-lg" />}>
            <FestivalFilters />
          </Suspense>

          {/* 축제 카드 리스트 Grid */}
          <div className="flex-1 w-full">
            {festivals.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                {festivals.map((fest) => (
                  <div key={fest.id} className="animate-slide-up relative">
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
