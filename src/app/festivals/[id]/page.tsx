// src/app/festivals/[id]/page.tsx
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { FestivalStatusBadge } from "@/components/festivals/FestivalStatusBadge";
import { FestivalMapPlaceholder } from "@/components/festivals/FestivalMapPlaceholder";
import { Badge } from "@/components/ui/Badge";

import { 
  ArrowLeft, 
  Car, 
  Bus, 
  PawPrint, 
  Baby, 
  Calendar, 
  MapPin, 
  Eye, 
  Link2, 
  ShieldCheck, 
  Clock, 
  Info,
  ExternalLink
} from "lucide-react";
import { isLikelyStockImage } from "@/lib/collectors/quality";

export interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function FestivalDetailPage({ params }: PageProps) {
  // Next.js 15/16 표준: params는 비동기 프로미스이므로 반드시 await 처리합니다.
  const resolvedParams = await params;
  const festivalId = Number(resolvedParams.id);

  if (isNaN(festivalId)) {
    notFound();
  }

  // 1. 상세 조회 및 조회수 증가 (서버리스 환경에서의 읽기 전용 데이터베이스 예외 처리)
  let festival;
  try {
    // 먼저 단순 조회를 실행합니다 (읽기 동작은 100% 정상 작동)
    festival = await db.festival.findUnique({
      where: { id: festivalId },
      include: {
        sources: true,
        programs: true
      }
    });

    if (!festival) {
      notFound();
    }

    // 서버리스(Vercel 등) 환경에서는 SQLite 파일 시스템이 읽기 전용이므로 조회수 증가 시 에러가 날 수 있습니다.
    // 이 경우 에러를 무시하고 축제 상세 정보를 정상적으로 보여줍니다.
    try {
      await db.festival.update({
        where: { id: festivalId },
        data: { views: { increment: 1 } }
      });
      festival.views += 1; // 화면 표시용으로 조회수 1 증가
    } catch {
      console.warn("[DetailPage] 서버리스 읽기 전용 환경으로 인해 조회수 증가가 스킵되었습니다 (정상 동작).");
    }
  } catch (e) {
    console.error("[DetailPage] 축제 상세 조회 실패:", e);
    notFound();
  }

  if (!festival) {
    notFound();
  }

  const categoryLabels: Record<string, string> = {
    FOOD: "먹거리 축제",
    NATURE: "자연/경관",
    CULTURE: "전통/문화",
    ART: "전시/예술",
    MUSIC: "공연/음악",
    OTHER: "기타 행사"
  };

  const formattedCategory = categoryLabels[festival.category] || festival.category;

  const formatDate = (date: Date) => {
    const d = new Date(date);
    return `${d.getFullYear()}년 ${String(d.getMonth() + 1).padStart(2, "0")}월 ${String(d.getDate()).padStart(2, "0")}일`;
  };

  // 신뢰도 점수 레벨 색상
  const getTrustScoreDetails = (score: number) => {
    if (score >= 80) return { bg: "bg-emerald-500", text: "text-emerald-600 dark:text-emerald-400", border: "border-emerald-500/20", label: "매우 높음 (공식 입증)" };
    if (score >= 50) return { bg: "bg-amber-500", text: "text-amber-600 dark:text-amber-400", border: "border-amber-500/20", label: "보통 (출처 검증)" };
    return { bg: "bg-rose-500", text: "text-rose-600 dark:text-rose-400", border: "border-rose-500/20", label: "낮음 (제보 검수 중)" };
  };

  const scoreDetails = getTrustScoreDetails(festival.trustScore);
  const hasRealPoster = festival.imageUrl && !isLikelyStockImage(festival.imageUrl);

  let gradientClass = "from-slate-900 via-slate-950 to-background";
  switch (festival.category) {
    case "FOOD":
      gradientClass = "from-amber-950/90 via-orange-950/60 to-background";
      break;
    case "NATURE":
      gradientClass = "from-emerald-950/90 via-teal-950/60 to-background";
      break;
    case "CULTURE":
      gradientClass = "from-stone-900/90 via-amber-950/30 to-background";
      break;
    case "ART":
      gradientClass = "from-rose-950/90 via-pink-950/60 to-background";
      break;
    case "MUSIC":
      gradientClass = "from-violet-950/90 via-indigo-950/60 to-background";
      break;
    case "OTHER":
    default:
      gradientClass = "from-blue-950/90 via-slate-900/60 to-background";
      break;
  }

  return (
    <div className="min-h-screen pb-20 relative bg-background">

      {/* 1. 자이언트 히어로 배너 영역 - 공식 이미지가 있을 때만 크게 노출 */}
      <section className={`relative w-full overflow-hidden border-b border-border/50 ${
        hasRealPoster 
          ? "h-[320px] md:h-[400px] bg-background" 
          : `h-[220px] md:h-[260px] bg-gradient-to-b ${gradientClass}`
      }`}>
        {hasRealPoster ? (
          <>
            <Image
              src={festival.imageUrl!}
              alt={festival.name}
              width={1600}
              height={600}
              sizes="100vw"
              priority
              unoptimized
              className="h-full w-full object-cover transition-transform duration-700"
            />
            {/* 화사한 반투명 그라데이션 스크린 */}
            <div className="absolute inset-0 bg-gradient-to-t from-background via-background/15 to-black/25" />
          </>
        ) : (
          <>
            {/* 세련된 미세 선 그리드 배킹 */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-[size:16px_24px] pointer-events-none" />
            <span className="absolute bottom-[-10%] right-[-2%] text-[6rem] md:text-[9rem] font-black text-white/[0.015] tracking-tighter uppercase select-none pointer-events-none">
              {festival.category}
            </span>
          </>
        )}
        
        {/* 상단 액션 바 */}
        <div className="absolute top-6 left-4 md:left-8 z-20">
          <Link 
            href="/"
            className="flex min-h-12 items-center space-x-2 rounded-lg border border-border/60 bg-card px-4 py-2 text-base font-extrabold text-foreground shadow-[2px_2px_8px_rgba(0,0,0,0.05)] transition-all hover:scale-[1.02] hover:bg-secondary"
          >
            <ArrowLeft size={16} className="text-primary shrink-0" />
            <span>둘러보기로 돌아가기</span>
          </Link>
        </div>

        {/* 히어로 바디 텍스트 정보 */}
        <div className="absolute bottom-6 md:bottom-10 inset-x-4 md:inset-x-8 z-10 max-w-5xl mx-auto flex flex-col items-start gap-3">
          <div className="flex flex-wrap gap-2 items-center">
            <Badge variant="primary" className="stamp-badge border-primary/50 text-primary font-bold">
              {formattedCategory}
            </Badge>
            <FestivalStatusBadge startDate={festival.startDate} endDate={festival.endDate} />
          </div>
          <h1 className="text-2xl md:text-4xl lg:text-5xl font-black text-white leading-tight tracking-tight drop-shadow-lg font-serif">
            {festival.name}
          </h1>
          <p className="text-white/95 text-sm md:text-base max-w-2xl font-medium drop-shadow-md leading-relaxed font-serif line-clamp-1">
            {festival.description || "이 동네 축제에 대한 따뜻한 소식들이 곧 채워질 예정입니다."}
          </p>
        </div>
      </section>

      {/* 2. 상세 컨텐츠 섹션 */}
      <section className="max-w-5xl mx-auto px-4 md:px-8 mt-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          
          {/* 좌측 메인 디테일 및 프로그램 테이블 (2/3 면적) */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* 기본 및 편의 사양 상세 정보 보드 */}
            <div className="bg-card border border-border/60 p-6 md:p-8 shadow-xl shadow-primary/5 rounded-2xl space-y-6">
              <h3 className="text-sm font-extrabold text-foreground border-b border-dashed border-border pb-3 flex items-center space-x-1.5">
                <Info size={18} className="text-primary shrink-0" />
                <span className="font-serif">행사 상세 정보첩</span>
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm font-bold leading-relaxed">
                <div className="space-y-4">
                  <div className="flex items-start space-x-3 text-muted-foreground">
                    <MapPin size={18} className="text-primary shrink-0 mt-0.5" />
                    <div className="space-y-0.5">
                      <span className="text-sm text-muted-foreground block font-bold">📍 개최 위치</span>
                      <span className="text-foreground">{festival.address || festival.region}</span>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3 text-muted-foreground">
                    <Calendar size={18} className="text-primary shrink-0 mt-0.5" />
                    <div className="space-y-0.5">
                      <span className="text-sm text-muted-foreground block font-bold">📅 개최 기간</span>
                      <span className="text-foreground">{formatDate(festival.startDate)} - {formatDate(festival.endDate)}</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-start space-x-3 text-muted-foreground">
                    <Eye size={18} className="text-primary shrink-0 mt-0.5" />
                    <div className="space-y-0.5">
                      <span className="text-sm text-muted-foreground block font-bold">👁️ 조회수</span>
                      <span className="text-foreground">{festival.views}회 기록을 열어봄</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* 편의 옵션 보드 */}
              <div className="pt-5 border-t border-dashed border-border space-y-3.5">
                <span className="text-sm font-bold text-muted-foreground block">🎪 제공 서비스</span>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {[
                    { flag: festival.hasParking, icon: Car, label: "주차장 제공", fallback: "주차 미제공" },
                    { flag: festival.hasShuttle, icon: Bus, label: "셔틀편 있음", fallback: "셔틀 미운영" },
                    { flag: festival.isPetFriendly, icon: PawPrint, label: "반려동물 동반", fallback: "반려 금지" },
                    { flag: festival.isChildFriendly, icon: Baby, label: "아이동반 추천", fallback: "성인 대상" }
                  ].map((opt, idx) => {
                    const Icon = opt.icon;
                    return (
                      <div 
                        key={idx}
                        className={`flex flex-col items-center justify-center p-3.5 rounded-xl border text-center transition-all ${
                          opt.flag
                            ? "bg-secondary/60 text-primary border-primary/20 shadow-sm"
                            : "bg-background text-muted-foreground/30 border-border/40"
                        }`}
                      >
                        <Icon size={22} className="mb-1" />
                        <span className="text-sm font-bold">{opt.flag ? opt.label : opt.fallback}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* 프로그램 일정표 타임라인 테이블 */}
            <div className="bg-card border border-border/60 p-6 md:p-8 shadow-xl shadow-primary/5 rounded-2xl space-y-4">
              <h3 className="text-sm font-extrabold text-foreground border-b border-dashed border-border pb-3 flex items-center space-x-1.5 mb-2">
                <Clock size={18} className="text-primary shrink-0" />
                <span className="font-serif">축제 세부 일정기록</span>
              </h3>

              {festival.programs && festival.programs.length > 0 ? (
                <>
                  {/* 1. 데스크톱 뷰: 표 형식 테이블 */}
                  <div className="hidden md:block overflow-hidden border border-border/60 rounded-xl">
                    <table className="w-full text-sm font-semibold border-collapse text-left bg-background/10">
                      <thead className="bg-secondary/70 text-sm font-bold text-muted-foreground border-b border-border/60">
                        <tr>
                          <th className="px-4 py-3.5 w-[120px]">시간</th>
                          <th className="px-4 py-3.5 w-[200px]">프로그램</th>
                          <th className="px-4 py-3.5">내용</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border/40 text-sm font-medium">
                        {festival.programs.map((prog) => (
                          <tr key={prog.id} className="hover:bg-secondary/30 transition-colors">
                            <td className="px-4 py-3.5 font-bold text-primary">{prog.time || "상시 운영"}</td>
                            <td className="px-4 py-3.5 font-bold text-foreground font-serif">{prog.name}</td>
                            <td className="px-4 py-3.5 text-muted-foreground leading-relaxed">{prog.content || "-"}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* 2. 모바일 뷰: 어르신 친화 카드형 타임라인 (기본 3개 노출, 초과 시 '더보기' 접이식) */}
                  <div className="block md:hidden space-y-3">
                    {festival.programs.slice(0, 3).map((prog) => (
                      <div key={prog.id} className="border border-border/60 bg-background p-4 rounded-xl space-y-2 text-left">
                        <div className="flex items-center">
                          <span className="text-xs font-bold text-primary bg-primary/10 px-2.5 py-1 rounded-md">{prog.time || "상시 운영"}</span>
                        </div>
                        <h4 className="text-base font-extrabold text-foreground font-serif">{prog.name}</h4>
                        <p className="text-sm text-muted-foreground leading-relaxed">{prog.content || "-"}</p>
                      </div>
                    ))}

                    {festival.programs.length > 3 && (
                      <details className="group w-full">
                        <summary className="list-none cursor-pointer focus:outline-none">
                          <div className="flex items-center justify-center h-12 w-full bg-secondary hover:bg-secondary/80 text-primary font-bold rounded-xl text-sm transition-all group-open:hidden cursor-pointer select-none">
                            📋 세부 일정 더보기 ({festival.programs.length - 3}개 더 있음)
                          </div>
                        </summary>
                        <div className="space-y-3 mt-3">
                          {festival.programs.slice(3).map((prog) => (
                            <div key={prog.id} className="border border-border/60 bg-background p-4 rounded-xl space-y-2 text-left animate-slide-up">
                              <div className="flex items-center">
                                <span className="text-xs font-bold text-primary bg-primary/10 px-2.5 py-1 rounded-md">{prog.time || "상시 운영"}</span>
                              </div>
                              <h4 className="text-base font-extrabold text-foreground font-serif">{prog.name}</h4>
                              <p className="text-sm text-muted-foreground leading-relaxed">{prog.content || "-"}</p>
                            </div>
                          ))}
                        </div>
                      </details>
                    )}
                  </div>
                </>
              ) : (
                <div className="border border-dashed border-border rounded-xl p-8 text-center text-sm text-muted-foreground/80 bg-secondary/10">
                  <p className="font-bold mb-1">상세 일정 정보가 기입되지 않았습니다.</p>
                  <p>이 행사는 지자체 장터 또는 상설 플리마켓 위주로 고정된 프로그램 타임라인이 제공되지 않습니다.</p>
                </div>
              )}
            </div>

            {/* 가상 지도 인스턴스 마운트 영역 */}
            {festival.address && (
              <FestivalMapPlaceholder address={festival.address} festivalName={festival.name} />
            )}

          </div>

          {/* 우측 사이드바: 신뢰성 검증 정보 (1/3 면적) */}
          <div className="space-y-6">
            
            {/* 정보 검증 & 신뢰성 수치 보드 */}
            <div className="bg-card border border-border/60 p-6 shadow-xl shadow-primary/5 rounded-2xl space-y-6">
              <h3 className="text-sm font-extrabold text-foreground border-b border-dashed border-border pb-3 flex items-center space-x-1.5">
                <ShieldCheck size={18} className="text-primary shrink-0" />
                <span>🛡️ 정보 검증 현황</span>
              </h3>

              {/* 신뢰도 점수 및 등급 게이지 */}
              <div className="space-y-2.5">
                <div className="flex items-center justify-between text-sm font-bold">
                  <span className="text-muted-foreground">종합 기록 신뢰도</span>
                  <span className={`${scoreDetails.text} font-typewriter`}>{festival.trustScore}%</span>
                </div>
                <div className="h-2 w-full bg-secondary border border-border/40 rounded-full overflow-hidden shadow-inner">
                  <div 
                    className={`h-full rounded-full ${scoreDetails.bg}`}
                    style={{ width: `${festival.trustScore}%` }}
                  />
                </div>
                <div className="flex items-center justify-between text-sm font-bold">
                  <span className="text-muted-foreground/60">검수 등급</span>
                  <span className={`font-bold ${scoreDetails.text}`}>{scoreDetails.label}</span>
                </div>
              </div>

              {/* 공식 웹사이트 아웃링크 - 프레스 스타일 버튼 (더 정밀한 출처 상세 주소가 있으면 우선 연동) */}
              {(() => {
                // 더 정확하고 직접적인 지자체 공식 상세 출처(LOCAL_GOV 등)가 있으면 우선적으로 활용합니다.
                const preciseSource = festival.sources.find(s => s.type === "LOCAL_GOV" || s.type === "VISIT_KOREA") || festival.sources[0];
                const targetUrl = preciseSource?.url || festival.officialUrl;

                return targetUrl ? (
                  <a
                    href={targetUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center justify-center space-x-2 w-full h-14 text-base font-bold rounded-xl cursor-pointer press-button shadow-md"
                  >
                    <Link2 size={16} className="shrink-0" />
                    <span>공식 상세기록 보러가기</span>
                    <ExternalLink size={12} className="shrink-0" />
                  </a>
                ) : (
                  <div className="flex items-center justify-center space-x-2 w-full h-14 bg-secondary/15 text-muted-foreground text-sm font-bold rounded-xl border border-dashed border-border select-none">
                    <span>공식 사이트 정보 없음</span>
                  </div>
                );
              })()}

              {/* 교차 검증 크롤러/제보 출처 */}
              <div className="space-y-3">
                <span className="text-sm font-bold text-muted-foreground block">📋 교차 검증 출처 ({festival.sources.length})</span>
                {festival.sources.length > 0 ? (
                  <div className="space-y-2">
                    {festival.sources.map((src) => (
                      <a
                        key={src.id}
                        href={src.url}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center justify-between px-3 py-2.5 border border-border/60 bg-background hover:bg-secondary hover:text-primary transition-all text-sm font-bold rounded-lg"
                      >
                        <span className="truncate max-w-[200px] font-serif">{src.name}</span>
                        <div className="flex items-center space-x-1 shrink-0 text-muted-foreground/60 text-xs">
                          <span>열기</span>
                          <ExternalLink size={11} />
                        </div>
                      </a>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-4 border border-dashed border-border/60 rounded-lg text-sm text-muted-foreground/50 bg-secondary/5 font-serif">
                    교차 검증된 참조 서류가 비어있습니다.
                  </div>
                )}
              </div>
            </div>

            {/* 검수망 안내 */}
            <div className="rounded-2xl border border-border/60 bg-secondary/10 p-5 text-sm text-muted-foreground/80 leading-relaxed shadow-sm">
              <span className="font-bold text-foreground block mb-1 font-serif">기록 검수 가이드</span>
              축제 정보는 지자체 공지, 한국관광공사 데이터, 지역 언론의 최신 공식 기록을 함께 상호 교차 대조하여 안전하게 검수 및 등재합니다.
            </div>

          </div>
        </div>

      </section>
    </div>
  );
}
