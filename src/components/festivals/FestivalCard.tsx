// src/components/festivals/FestivalCard.tsx
import Link from "next/link";
import Image from "next/image";
import type React from "react";
import {
  Baby,
  Bus,
  Calendar,
  Car,
  CheckCircle2,
  ExternalLink,
  Eye,
  Info,
  MapPin,
  PawPrint,
  Utensils,
  Trees,
  Compass,
  Palette,
  Music as MusicIcon,
  Sparkles,
  ImageOff
} from "lucide-react";
import { FestivalStatusBadge } from "./FestivalStatusBadge";
import { CATEGORY_FALLBACK_IMAGES, isLikelyStockImage } from "@/lib/collectors/quality";

export interface FestivalCardProps {
  festival: {
    id: number;
    name: string;
    description: string | null;
    region: string;
    address: string | null;
    startDate: Date;
    endDate: Date;
    category: string;
    officialUrl: string | null;
    imageUrl: string | null;
    hasParking: boolean;
    hasShuttle: boolean;
    isPetFriendly: boolean;
    isChildFriendly: boolean;
    congestionStatus: string;
    trustScore: number;
    views: number;
    status: string;
  };
}

export function FestivalCard({ festival }: FestivalCardProps) {
  const categoryLabels: Record<string, string> = {
    FOOD: "먹거리",
    NATURE: "자연/경관",
    CULTURE: "전통/문화",
    ART: "전시/예술",
    MUSIC: "공연/음악",
    OTHER: "기타 행사"
  };

  const formatDate = (date: Date) => {
    const d = new Date(date);
    return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, "0")}.${String(d.getDate()).padStart(2, "0")}`;
  };

  const getTrustScoreColor = (score: number) => {
    if (score >= 80) return "bg-accent text-accent";
    if (score >= 50) return "bg-amber-500 text-amber-600";
    return "bg-primary text-primary";
  };

  const scoreColor = getTrustScoreColor(festival.trustScore);
  const hasRealPoster = festival.imageUrl && !isLikelyStockImage(festival.imageUrl);
  const formattedCategory = categoryLabels[festival.category] || festival.category;

  const renderPlaceholder = () => {
    let gradientClass = "from-slate-800 to-slate-950";
    let icon = <ImageOff size={28} className="text-slate-400" />;
    let textBadgeColor = "bg-slate-500/10 text-slate-400 border-slate-500/20";
    
    switch (festival.category) {
      case "FOOD":
        gradientClass = "from-amber-950 via-orange-950/70 to-slate-950";
        icon = <Utensils size={32} className="text-amber-400/90" />;
        textBadgeColor = "bg-amber-400/10 text-amber-400 border-amber-400/20";
        break;
      case "NATURE":
        gradientClass = "from-emerald-950 via-teal-950/70 to-slate-950";
        icon = <Trees size={32} className="text-emerald-400/90" />;
        textBadgeColor = "bg-emerald-400/10 text-emerald-400 border-emerald-400/20";
        break;
      case "CULTURE":
        gradientClass = "from-stone-900 via-amber-950/40 to-slate-950";
        icon = <Compass size={32} className="text-amber-500/90" />;
        textBadgeColor = "bg-amber-500/10 text-amber-500 border-amber-500/20";
        break;
      case "ART":
        gradientClass = "from-rose-950 via-pink-950/70 to-slate-950";
        icon = <Palette size={32} className="text-rose-400/90" />;
        textBadgeColor = "bg-rose-400/10 text-rose-400 border-rose-400/20";
        break;
      case "MUSIC":
        gradientClass = "from-violet-950 via-indigo-950/70 to-slate-950";
        icon = <MusicIcon size={32} className="text-violet-400/90" />;
        textBadgeColor = "bg-violet-400/10 text-violet-400 border-violet-400/20";
        break;
      case "OTHER":
      default:
        gradientClass = "from-blue-950 via-slate-900 to-slate-950";
        icon = <Sparkles size={32} className="text-blue-400/90" />;
        textBadgeColor = "bg-blue-400/10 text-blue-400 border-blue-400/20";
        break;
    }

    return (
      <div className={`relative flex h-full w-full flex-col items-center justify-center p-6 text-center select-none overflow-hidden transition-transform duration-500 group-hover:scale-105 bg-gradient-to-b ${gradientClass}`}>
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px] pointer-events-none" />
        <span className="absolute bottom-[-10%] right-[-5%] text-[5rem] font-black text-white/[0.02] tracking-tighter uppercase select-none">
          {festival.category}
        </span>
        <div className="z-10 flex flex-col items-center gap-3">
          <div className="rounded-2xl bg-white/[0.03] border border-white/[0.08] p-4 shadow-inner backdrop-blur-sm">
            {icon}
          </div>
          <div className="flex flex-col items-center gap-1.5 mt-1">
            <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold tracking-wider border uppercase ${textBadgeColor}`}>
              {formattedCategory}
            </span>
            <span className="text-xs font-bold text-white/40 tracking-tight">공식 포스터 준비중</span>
          </div>
        </div>
      </div>
    );
  };

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-lg border border-border bg-card shadow-sm transition hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-md">
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-muted">
        {hasRealPoster ? (
          <Image
            src={festival.imageUrl!}
            alt={festival.name}
            width={640}
            height={480}
            sizes="(min-width: 1280px) 28vw, (min-width: 768px) 45vw, 92vw"
            unoptimized
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          renderPlaceholder()
        )}

        {festival.trustScore >= 80 && (
          <div className="absolute right-3 top-3 flex items-center gap-1 rounded-full bg-card/95 px-2.5 py-1 text-xs font-bold text-accent shadow-sm">
            <CheckCircle2 size={14} className="shrink-0" />
            <span>검증됨</span>
          </div>
        )}

        <div className="absolute bottom-3 left-3">
          <FestivalStatusBadge startDate={festival.startDate} endDate={festival.endDate} />
        </div>
      </div>

      <div className="flex flex-1 flex-col p-3.5 sm:p-4">
        <div className="flex-1">
          <div className="mb-2 flex flex-wrap items-center gap-1.5 text-sm font-bold text-muted-foreground sm:gap-2">
            <MapPin size={15} className="shrink-0 text-primary/80" />
            <span>{festival.region}</span>
            <span className="h-1 w-1 rounded-full bg-border" />
            <span className="text-primary">{formattedCategory}</span>
          </div>

          <Link href={`/festivals/${festival.id}`} className="block">
            <h2 className="mb-2 line-clamp-2 text-lg font-extrabold leading-snug text-foreground transition-colors group-hover:text-primary sm:text-xl">
              {festival.name}
            </h2>
          </Link>

          <p className="mb-4 line-clamp-3 text-sm leading-6 text-muted-foreground sm:leading-7">
            {festival.description || "축제 소개가 아직 보강 중입니다. 공식 출처가 확인되는 대로 업데이트됩니다."}
          </p>
        </div>

        <div className="mb-4 flex min-h-8 flex-wrap gap-2 border-y border-border py-3 text-muted-foreground">
          {festival.hasParking && <FeaturePill icon={Car} label="주차" title="주차공간 제공" />}
          {festival.hasShuttle && <FeaturePill icon={Bus} label="셔틀" title="셔틀버스 운영" />}
          {festival.isPetFriendly && <FeaturePill icon={PawPrint} label="반려동물" title="반려동물 동반 가능" />}
          {festival.isChildFriendly && <FeaturePill icon={Baby} label="아이" title="아이와 함께 추천" />}
        </div>

        <div className="mb-4 space-y-2">
          <div className="flex items-center justify-between text-sm font-bold">
            <span className="flex items-center gap-1 text-muted-foreground">
              <span>출처 신뢰도</span>
              <span title="지자체 출처, 공식 사이트 유무, 편의정보 유무 등으로 자동 계산되는 신뢰 수준입니다.">
                <Info size={14} className="cursor-help text-muted-foreground/60" />
              </span>
            </span>
            <span className={`font-bold ${scoreColor.split(" ")[1]}`}>{festival.trustScore}%</span>
          </div>
          <div className="h-2.5 w-full overflow-hidden rounded-full bg-secondary">
            <div className={`h-full rounded-full transition-all duration-500 ${scoreColor.split(" ")[0]}`} style={{ width: `${festival.trustScore}%` }} />
          </div>
        </div>

        <div className="flex flex-col gap-2 border-t border-border pt-3 text-sm font-bold text-muted-foreground sm:flex-row sm:items-center sm:justify-between sm:gap-3">
          <span className="flex min-w-0 items-center gap-1 leading-snug">
            <Calendar size={15} className="shrink-0" />
            <span>{formatDate(festival.startDate)} - {formatDate(festival.endDate)}</span>
          </span>
          <span className="flex shrink-0 items-center gap-1">
            <Eye size={15} className="shrink-0" />
            <span>{festival.views}</span>
          </span>
        </div>

        <div className="grid grid-cols-[1fr_auto] gap-2 pt-4">
          <Link href={`/festivals/${festival.id}`} className="block">
            <button className="h-12 w-full cursor-pointer rounded-md text-base font-bold press-button">
              자세히 보기
            </button>
          </Link>
          {festival.officialUrl && (
            <a
              href={festival.officialUrl}
              target="_blank"
              rel="noreferrer"
              className="flex h-12 w-12 items-center justify-center rounded-md border border-border bg-background text-muted-foreground transition hover:border-primary hover:text-primary"
              title="공식 사이트 열기"
            >
              <ExternalLink size={18} />
            </a>
          )}
        </div>
      </div>
    </article>
  );
}

function FeaturePill({
  icon: Icon,
  label,
  title
}: {
  icon: React.ComponentType<{ size?: number; className?: string }>;
  label: string;
  title: string;
}) {
  return (
    <div className="flex items-center gap-1 rounded-full bg-secondary px-2.5 py-1.5 text-xs font-bold" title={title}>
      <Icon size={14} className="shrink-0 text-primary" />
      <span>{label}</span>
    </div>
  );
}
