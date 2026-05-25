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

  // 1. 상세 조회 및 조회수 증가 (Server Action/RSC 동시 처리)
  let festival;
  try {
    // 트랜잭션 또는 단일 업데이트 후 조회
    festival = await db.festival.update({
      where: { id: festivalId },
      data: { views: { increment: 1 } },
      include: {
        sources: true,
        programs: true
      }
    });
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

  const defaultImage = "/images/gokseong_roses.png";
  const heroImage = festival.imageUrl || defaultImage;

  return (
    <div className="min-h-screen pb-20 relative bg-background">

      {/* 1. 자이언트 히어로 배너 영역 - 화사하고 맑은 와이드 이미지 */}
      <section className="relative h-[320px] md:h-[400px] w-full overflow-hidden border-b border-border/50 bg-background">
        <Image
          src={heroImage}
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
        
        {/* 상단 액션 바 */}
        <div className="absolute top-6 left-4 md:left-8 z-20">
          <Link 
            href="/"
            className="flex items-center space-x-2 px-4 py-2 bg-card text-foreground border border-border/60 text-xs font-bold hover:scale-102 hover:bg-secondary transition-all shadow-[2px_2px_8px_rgba(0,0,0,0.05)] rounded-lg"
          >
            <ArrowLeft size={13} className="text-primary shrink-0" />
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
          <h1 className="text-2xl md:text-4xl lg:text-4.5xl font-black text-white leading-tight tracking-tight drop-shadow-lg font-serif">
            {festival.name}
          </h1>
          <p className="text-white/95 text-xs md:text-sm max-w-2xl font-medium drop-shadow-md leading-relaxed font-serif">
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
                <Info size={15} className="text-primary shrink-0" />
                <span className="font-serif">행사 상세 정보첩</span>
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs font-bold leading-relaxed">
                <div className="space-y-4">
                  <div className="flex items-start space-x-3 text-muted-foreground">
                    <MapPin size={15} className="text-primary shrink-0 mt-0.5" />
                    <div className="space-y-0.5">
                      <span className="text-[10px] text-muted-foreground/60 font-typewriter block uppercase">LOCATION / 개최 위치</span>
                      <span className="text-foreground">{festival.address || festival.region}</span>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3 text-muted-foreground">
                    <Calendar size={15} className="text-primary shrink-0 mt-0.5" />
                    <div className="space-y-0.5">
                      <span className="text-[10px] text-muted-foreground/60 font-typewriter block uppercase">SCHEDULE / 개최 기간</span>
                      <span className="text-foreground">{formatDate(festival.startDate)} - {formatDate(festival.endDate)}</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-start space-x-3 text-muted-foreground">
                    <Eye size={15} className="text-primary shrink-0 mt-0.5" />
                    <div className="space-y-0.5">
                      <span className="text-[10px] text-muted-foreground/60 font-typewriter block uppercase">VIEWS / 조회수</span>
                      <span className="text-foreground">{festival.views}회 기록을 열어봄</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* 편의 옵션 보드 */}
              <div className="pt-5 border-t border-dashed border-border space-y-3.5">
                <span className="text-[10px] font-bold text-muted-foreground/80 font-typewriter block uppercase">CONVENIENCE / 제공 서비스</span>
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
                        <Icon size={16} className="mb-1" />
                        <span className="text-[10px] font-bold">{opt.flag ? opt.label : opt.fallback}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* 프로그램 일정표 타임라인 테이블 */}
            <div className="bg-card border border-border/60 p-6 md:p-8 shadow-xl shadow-primary/5 rounded-2xl space-y-4">
              <h3 className="text-sm font-extrabold text-foreground border-b border-dashed border-border pb-3 flex items-center space-x-1.5 mb-2">
                <Clock size={15} className="text-primary shrink-0" />
                <span className="font-serif">축제 세부 일정기록</span>
              </h3>

              {festival.programs && festival.programs.length > 0 ? (
                <div className="overflow-hidden border border-border/60 rounded-xl">
                  <table className="w-full text-xs font-semibold border-collapse text-left bg-background/10">
                    <thead className="bg-secondary/70 text-[10px] font-bold text-muted-foreground font-typewriter border-b border-border/60">
                      <tr>
                        <th className="px-4 py-3 w-[120px]">TIME</th>
                        <th className="px-4 py-3 w-[200px]">PROGRAM</th>
                        <th className="px-4 py-3">DESCRIPTION</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border/40 text-xs font-medium">
                      {festival.programs.map((prog) => (
                        <tr key={prog.id} className="hover:bg-secondary/30 transition-colors">
                          <td className="px-4 py-3.5 font-bold font-typewriter text-primary">{prog.time || "상시 운영"}</td>
                          <td className="px-4 py-3.5 font-bold text-foreground font-serif">{prog.name}</td>
                          <td className="px-4 py-3.5 text-muted-foreground leading-relaxed">{prog.content || "-"}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="border border-dashed border-border rounded-xl p-8 text-center text-xs text-muted-foreground/80 bg-secondary/10">
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
              <h3 className="text-xs font-extrabold text-foreground border-b border-dashed border-border pb-3 flex items-center space-x-1.5 font-typewriter uppercase">
                <ShieldCheck size={15} className="text-primary shrink-0" />
                <span>AUDIT ARCHIVE</span>
              </h3>

              {/* 신뢰도 점수 및 등급 게이지 */}
              <div className="space-y-2.5">
                <div className="flex items-center justify-between text-xs font-bold">
                  <span className="text-muted-foreground">종합 기록 신뢰도</span>
                  <span className={`${scoreDetails.text} font-typewriter`}>{festival.trustScore}%</span>
                </div>
                <div className="h-2 w-full bg-secondary border border-border/40 rounded-full overflow-hidden shadow-inner">
                  <div 
                    className={`h-full rounded-full ${scoreDetails.bg}`}
                    style={{ width: `${festival.trustScore}%` }}
                  />
                </div>
                <div className="flex items-center justify-between text-[10px] font-bold">
                  <span className="text-muted-foreground/60">검수 등급</span>
                  <span className={`font-bold ${scoreDetails.text}`}>{scoreDetails.label}</span>
                </div>
              </div>

              {/* 공식 웹사이트 아웃링크 - 프레스 스타일 버튼 */}
              {festival.officialUrl ? (
                <a
                  href={festival.officialUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center justify-center space-x-1.5 w-full h-11 text-xs font-bold rounded-lg cursor-pointer press-button shadow-md"
                >
                  <Link2 size={13} />
                  <span>공식 기록 보러가기</span>
                  <ExternalLink size={10} />
                </a>
              ) : (
                <div className="flex items-center justify-center space-x-1.5 w-full h-11 bg-secondary/15 text-muted-foreground text-xs font-bold rounded-lg border border-dashed border-border select-none font-typewriter uppercase">
                  <span>NO OFFICIAL SITE</span>
                </div>
              )}

              {/* 교차 검증 크롤러/제보 출처 */}
              <div className="space-y-3">
                <span className="text-[10px] font-bold text-muted-foreground/80 font-typewriter block uppercase">CROSS REFERENCES ({festival.sources.length})</span>
                {festival.sources.length > 0 ? (
                  <div className="space-y-2">
                    {festival.sources.map((src) => (
                      <a
                        key={src.id}
                        href={src.url}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center justify-between px-3 py-2.5 border border-border/60 bg-background hover:bg-secondary hover:text-primary transition-all text-xs font-bold rounded-lg"
                      >
                        <span className="truncate max-w-[150px] font-serif">{src.name}</span>
                        <div className="flex items-center space-x-1 shrink-0 text-muted-foreground/60 text-[9px] font-typewriter">
                          <span>OPEN</span>
                          <ExternalLink size={9} />
                        </div>
                      </a>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-4 border border-dashed border-border/60 rounded-lg text-xs text-muted-foreground/50 bg-secondary/5 font-serif">
                    교차 검증된 참조 서류가 비어있습니다.
                  </div>
                )}
              </div>
            </div>

            {/* 검수망 안내 */}
            <div className="rounded-2xl border border-border/60 bg-secondary/10 p-5 text-xs text-muted-foreground/80 leading-relaxed shadow-sm">
              <span className="font-bold text-foreground block mb-1 font-serif">기록 검수 가이드</span>
              축제 정보는 지자체 공지, 한국관광공사 데이터, 지역 언론, 사용자 제보를 함께 대조해 검수합니다. 정보 수정이나 폐지 요청은 제보함을 통해 제출하실 수 있습니다.
            </div>

          </div>
        </div>

      </section>
    </div>
  );
}
