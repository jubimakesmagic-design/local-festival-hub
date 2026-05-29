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
    if (score >= 80) return { bg: "bg-emerald-500", text: "text-emerald-600 dark:text-emerald-400", border: "border-emerald-500/20", label: "공식 확인" };
    if (score >= 50) return { bg: "bg-amber-500", text: "text-amber-600 dark:text-amber-400", border: "border-amber-500/20", label: "출처 확인" };
    return { bg: "bg-primary", text: "text-primary", border: "border-primary/20", label: "검수 중" };
  };

  const scoreDetails = getTrustScoreDetails(festival.trustScore);
  const hasRealPoster = festival.imageUrl && !isLikelyStockImage(festival.imageUrl);
  const targetSource = festival.sources.find(s => s.type === "LOCAL_GOV" || s.type === "VISIT_KOREA") || festival.sources[0];
  const targetUrl = targetSource?.url || festival.officialUrl;
  const serviceOptions = [
    { flag: festival.hasParking, icon: Car, label: "주차", fallback: "정보 없음" },
    { flag: festival.hasShuttle, icon: Bus, label: "셔틀", fallback: "정보 없음" },
    { flag: festival.isPetFriendly, icon: PawPrint, label: "반려동물", fallback: "확인 필요" },
    { flag: festival.isChildFriendly, icon: Baby, label: "아이 동반", fallback: "확인 필요" }
  ];

  let gradientClass = "from-secondary via-card to-background";
  switch (festival.category) {
    case "FOOD":
      gradientClass = "from-amber-500/10 via-card to-background";
      break;
    case "NATURE":
      gradientClass = "from-emerald-500/10 via-card to-background";
      break;
    case "CULTURE":
      gradientClass = "from-stone-500/10 via-card to-background";
      break;
    case "ART":
      gradientClass = "from-rose-500/10 via-card to-background";
      break;
    case "MUSIC":
      gradientClass = "from-violet-500/10 via-card to-background";
      break;
    case "OTHER":
    default:
      gradientClass = "from-sky-500/10 via-card to-background";
      break;
  }

  return (
    <div className="min-h-screen bg-background pb-16">
      <section className={`relative overflow-hidden border-b border-border ${hasRealPoster ? "min-h-[340px] md:min-h-[420px]" : `bg-gradient-to-b ${gradientClass}`}`}>
        {hasRealPoster && (
          <>
            <Image
              src={festival.imageUrl!}
              alt={festival.name}
              width={1600}
              height={700}
              sizes="100vw"
              priority
              unoptimized
              className="absolute inset-0 h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-black/20" />
          </>
        )}

        <div className={`relative z-10 mx-auto flex max-w-6xl flex-col px-4 py-8 md:px-8 ${hasRealPoster ? "min-h-[340px] justify-end text-white md:min-h-[420px]" : "min-h-[260px] justify-end text-foreground"}`}>
          <Link
            href="/"
            className={`mb-8 inline-flex min-h-10 w-fit items-center gap-2 rounded-lg border px-3 text-sm font-medium shadow-sm transition-colors ${
              hasRealPoster
                ? "border-white/30 bg-black/25 text-white hover:bg-black/35"
                : "border-border bg-card text-foreground hover:bg-secondary/70"
            }`}
          >
            <ArrowLeft size={16} className="shrink-0" />
            <span>목록으로</span>
          </Link>

          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="primary" className={hasRealPoster ? "border-white/30 bg-white/15 text-white" : ""}>
              {formattedCategory}
            </Badge>
            <FestivalStatusBadge startDate={festival.startDate} endDate={festival.endDate} />
          </div>
          <h1 className="mt-3 max-w-4xl text-3xl font-bold leading-tight tracking-normal md:text-5xl">
            {festival.name}
          </h1>
          <p className={`mt-3 max-w-2xl text-sm leading-6 md:text-base ${hasRealPoster ? "text-white/85" : "text-muted-foreground"}`}>
            {festival.description || "축제 소개가 준비 중입니다."}
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-8 md:px-8">
        <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
          <div className="space-y-6">
            <section className="rounded-lg border border-border bg-card p-5 shadow-sm md:p-6">
              <div className="mb-5 flex items-center gap-2 border-b border-border pb-3">
                <Info size={18} className="shrink-0 text-primary" />
                <h2 className="text-base font-semibold text-foreground">기본 정보</h2>
              </div>

              <div className="grid grid-cols-1 gap-4 text-sm md:grid-cols-2">
                <div className="flex items-start gap-3">
                  <MapPin size={18} className="mt-0.5 shrink-0 text-primary" />
                  <div>
                    <div className="font-medium text-muted-foreground">위치</div>
                    <div className="mt-1 font-semibold text-foreground">{festival.address || festival.region}</div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Calendar size={18} className="mt-0.5 shrink-0 text-primary" />
                  <div>
                    <div className="font-medium text-muted-foreground">기간</div>
                    <div className="mt-1 font-semibold text-foreground">{formatDate(festival.startDate)} - {formatDate(festival.endDate)}</div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Eye size={18} className="mt-0.5 shrink-0 text-primary" />
                  <div>
                    <div className="font-medium text-muted-foreground">조회수</div>
                    <div className="mt-1 font-semibold text-foreground">{festival.views}회</div>
                  </div>
                </div>
              </div>

              <div className="mt-6 border-t border-border pt-5">
                <h3 className="mb-3 text-sm font-semibold text-foreground">편의정보</h3>
                <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                  {serviceOptions.map((opt) => {
                    const Icon = opt.icon;
                    return (
                      <div
                        key={opt.label}
                        className={`rounded-lg border p-3 text-sm ${
                          opt.flag
                            ? "border-primary/20 bg-primary/10 text-primary"
                            : "border-border bg-background text-muted-foreground"
                        }`}
                      >
                        <Icon size={20} className="mb-2" />
                        <div className="font-semibold">{opt.flag ? opt.label : opt.fallback}</div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </section>

            <section className="rounded-lg border border-border bg-card p-5 shadow-sm md:p-6">
              <div className="mb-5 flex items-center gap-2 border-b border-border pb-3">
                <Clock size={18} className="shrink-0 text-primary" />
                <h2 className="text-base font-semibold text-foreground">프로그램</h2>
              </div>

              {festival.programs && festival.programs.length > 0 ? (
                <>
                  <div className="hidden overflow-hidden rounded-lg border border-border md:block">
                    <table className="w-full border-collapse bg-background text-left text-sm">
                      <thead className="border-b border-border bg-secondary/60 text-muted-foreground">
                        <tr>
                          <th className="w-[120px] px-4 py-3 font-semibold">시간</th>
                          <th className="w-[220px] px-4 py-3 font-semibold">프로그램</th>
                          <th className="px-4 py-3 font-semibold">내용</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border/60">
                        {festival.programs.map((prog) => (
                          <tr key={prog.id} className="transition-colors hover:bg-secondary/35">
                            <td className="px-4 py-3 font-semibold text-primary">{prog.time || "상시 운영"}</td>
                            <td className="px-4 py-3 font-semibold text-foreground">{prog.name}</td>
                            <td className="px-4 py-3 leading-6 text-muted-foreground">{prog.content || "-"}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  <div className="space-y-3 md:hidden">
                    {festival.programs.map((prog) => (
                      <div key={prog.id} className="rounded-lg border border-border bg-background p-4">
                        <span className="inline-flex rounded-md bg-primary/10 px-2 py-1 text-xs font-semibold text-primary">{prog.time || "상시 운영"}</span>
                        <h3 className="mt-2 text-base font-semibold text-foreground">{prog.name}</h3>
                        <p className="mt-1 text-sm leading-6 text-muted-foreground">{prog.content || "-"}</p>
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                <div className="rounded-lg border border-dashed border-border bg-background p-6 text-center text-sm leading-6 text-muted-foreground">
                  등록된 세부 일정이 없습니다.
                </div>
              )}
            </section>

            {festival.address && (
              <FestivalMapPlaceholder address={festival.address} festivalName={festival.name} />
            )}
          </div>

          <aside className="space-y-4 lg:sticky lg:top-24">
            <section className="rounded-lg border border-border bg-card p-5 shadow-sm">
              <div className="mb-5 flex items-center gap-2 border-b border-border pb-3">
                <ShieldCheck size={18} className="shrink-0 text-primary" />
                <h2 className="text-base font-semibold text-foreground">출처 확인</h2>
              </div>

              <div className="space-y-2.5">
                <div className="flex items-center justify-between text-sm font-medium">
                  <span className="text-muted-foreground">신뢰도</span>
                  <span className={scoreDetails.text}>{festival.trustScore}%</span>
                </div>
                <div className="h-2 w-full overflow-hidden rounded-full bg-secondary">
                  <div className={`h-full rounded-full ${scoreDetails.bg}`} style={{ width: `${festival.trustScore}%` }} />
                </div>
                <div className="flex items-center justify-between text-sm font-medium">
                  <span className="text-muted-foreground">상태</span>
                  <span className={scoreDetails.text}>{scoreDetails.label}</span>
                </div>
              </div>

              {targetUrl ? (
                <a
                  href={targetUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="press-button mt-5 flex h-11 w-full items-center justify-center gap-2 rounded-lg text-sm font-semibold"
                >
                  <Link2 size={16} className="shrink-0" />
                  <span>공식 정보 열기</span>
                  <ExternalLink size={14} className="shrink-0" />
                </a>
              ) : (
                <div className="mt-5 flex h-11 items-center justify-center rounded-lg border border-dashed border-border bg-background text-sm font-medium text-muted-foreground">
                  공식 링크 없음
                </div>
              )}

              <div className="mt-5 space-y-3">
                <h3 className="text-sm font-semibold text-foreground">참고 출처 ({festival.sources.length})</h3>
                {festival.sources.length > 0 ? (
                  <div className="space-y-2">
                    {festival.sources.map((src) => (
                      <a
                        key={src.id}
                        href={src.url}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center justify-between gap-3 rounded-lg border border-border bg-background px-3 py-2.5 text-sm font-medium transition-colors hover:border-primary/40 hover:text-primary"
                      >
                        <span className="min-w-0 truncate">{src.name}</span>
                        <ExternalLink size={13} className="shrink-0 text-muted-foreground" />
                      </a>
                    ))}
                  </div>
                ) : (
                  <div className="rounded-lg border border-dashed border-border bg-background p-4 text-center text-sm text-muted-foreground">
                    등록된 참고 출처가 없습니다.
                  </div>
                )}
              </div>
            </section>

            <div className="rounded-lg border border-border bg-secondary/30 p-4 text-sm leading-6 text-muted-foreground">
              정보는 지자체 공지, 관광 데이터, 지역 소식, 사용자 제보를 함께 확인해 반영합니다.
            </div>
          </aside>
        </div>
      </section>
    </div>
  );
}
