// src/components/festivals/FestivalCard.tsx
import Link from "next/link";
import Image from "next/image";
import type React from "react";
import {
  ArrowRight,
  Baby,
  Bus,
  Calendar,
  Car,
  CheckCircle2,
  ExternalLink,
  Eye,
  Info,
  MapPin,
  PawPrint
} from "lucide-react";
import { FestivalStatusBadge } from "./FestivalStatusBadge";
import { isLikelyStockImage } from "@/lib/collectors/quality";

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

  const getTrustScoreTone = (score: number) => {
    if (score >= 80) {
      return { bar: "bg-emerald-500", text: "text-emerald-600 dark:text-emerald-400", label: "공식 확인" };
    }
    if (score >= 50) {
      return { bar: "bg-amber-500", text: "text-amber-600 dark:text-amber-400", label: "출처 확인" };
    }
    return { bar: "bg-primary", text: "text-primary", label: "검수 중" };
  };

  const scoreTone = getTrustScoreTone(festival.trustScore);
  const hasRealPoster = festival.imageUrl && !isLikelyStockImage(festival.imageUrl);
  const formattedCategory = categoryLabels[festival.category] || festival.category;
  const features = [
    { enabled: festival.hasParking, icon: Car, label: "주차", title: "주차공간 제공" },
    { enabled: festival.hasShuttle, icon: Bus, label: "셔틀", title: "셔틀버스 운영" },
    { enabled: festival.isPetFriendly, icon: PawPrint, label: "반려동물", title: "반려동물 동반 가능" },
    { enabled: festival.isChildFriendly, icon: Baby, label: "아이", title: "아이와 함께 추천" }
  ].filter((feature) => feature.enabled);

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-lg border border-border bg-card shadow-sm transition hover:-translate-y-0.5 hover:border-primary/35 hover:shadow-md">
      {hasRealPoster && (
        <div className="relative aspect-[16/10] w-full overflow-hidden bg-muted">
          <Image
            src={festival.imageUrl!}
            alt={festival.name}
            width={640}
            height={480}
            sizes="(min-width: 1280px) 28vw, (min-width: 768px) 45vw, 92vw"
            unoptimized
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
          />

          {festival.trustScore >= 80 && (
            <div className="absolute right-3 top-3 flex items-center gap-1 rounded-md bg-card/95 px-2 py-1 text-xs font-semibold text-emerald-600 shadow-sm dark:text-emerald-400">
              <CheckCircle2 size={14} className="shrink-0" />
              <span>확인됨</span>
            </div>
          )}

          <div className="absolute left-3 top-3">
            <FestivalStatusBadge startDate={festival.startDate} endDate={festival.endDate} />
          </div>
        </div>
      )}

      <div className="flex flex-1 flex-col p-4">
        <div className="flex-1">
          <div className="mb-2 flex items-start justify-between gap-2">
            <div className="flex flex-wrap items-center gap-1.5 text-sm font-medium text-muted-foreground">
              <MapPin size={16} className="shrink-0 text-primary/80" />
              <span>{festival.region}</span>
              <span className="h-1 w-1 rounded-full bg-border" />
              <span className="text-primary">{formattedCategory}</span>
            </div>
            {!hasRealPoster && (
              <div className="shrink-0">
                <FestivalStatusBadge startDate={festival.startDate} endDate={festival.endDate} />
              </div>
            )}
          </div>

          <Link href={`/festivals/${festival.id}`} className="block">
            <h2 className="mb-2 line-clamp-2 text-lg font-semibold leading-snug text-foreground transition-colors group-hover:text-primary md:text-xl">
              {festival.name}
            </h2>
          </Link>

          <p className="mb-4 line-clamp-3 text-sm leading-6 text-muted-foreground">
            {festival.description || "축제 소개가 준비 중입니다."}
          </p>
        </div>

        {features.length > 0 && (
          <div className="mb-4 flex min-h-9 flex-wrap gap-2 border-y border-border py-3 text-muted-foreground">
            {features.map((feature) => (
              <FeaturePill key={feature.label} icon={feature.icon} label={feature.label} title={feature.title} />
            ))}
          </div>
        )}

        <div className="mb-4 space-y-2">
          <div className="flex items-center justify-between text-sm font-medium">
            <span className="flex items-center gap-1.5 text-muted-foreground">
              <span>{scoreTone.label}</span>
              <span title="지자체 출처, 공식 사이트 유무, 편의정보 유무 등으로 자동 계산되는 신뢰 수준입니다.">
                <Info size={14} className="cursor-help text-muted-foreground/60" />
              </span>
            </span>
            <span className={`font-semibold ${scoreTone.text}`}>{festival.trustScore}%</span>
          </div>
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-secondary">
            <div className={`h-full rounded-full transition-all duration-500 ${scoreTone.bar}`} style={{ width: `${festival.trustScore}%` }} />
          </div>
        </div>

        <div className="flex flex-col gap-2 border-t border-border pt-3 text-sm font-medium text-muted-foreground sm:flex-row sm:items-center sm:justify-between sm:gap-3">
          <span className="flex min-w-0 items-center gap-1 leading-snug">
            <Calendar size={16} className="shrink-0" />
            <span>{formatDate(festival.startDate)} - {formatDate(festival.endDate)}</span>
          </span>
          <span className="flex shrink-0 items-center gap-1">
            <Eye size={15} className="shrink-0" />
            <span>{festival.views}</span>
          </span>
        </div>

        <div className="grid grid-cols-[1fr_auto] gap-2 pt-4">
          <Link href={`/festivals/${festival.id}`} className="press-button flex h-11 w-full items-center justify-center gap-2 rounded-lg text-sm font-semibold">
            <span>상세 보기</span>
            <ArrowRight size={16} className="shrink-0" />
          </Link>
          {festival.officialUrl && (
            <a
              href={festival.officialUrl}
              target="_blank"
              rel="noreferrer"
              className="flex h-11 w-11 items-center justify-center rounded-lg border border-border bg-background text-muted-foreground transition-colors hover:border-primary hover:text-primary"
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
    <div className="flex min-h-8 items-center gap-1.5 rounded-md bg-secondary px-2.5 py-1 text-xs font-medium" title={title}>
      <Icon size={15} className="shrink-0 text-primary" />
      <span>{label}</span>
    </div>
  );
}
