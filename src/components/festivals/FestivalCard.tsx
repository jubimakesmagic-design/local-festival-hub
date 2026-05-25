// src/components/festivals/FestivalCard.tsx
import Link from "next/link";
import { 
  Car, 
  Bus, 
  PawPrint, 
  Baby, 
  Calendar, 
  MapPin, 
  Eye, 
  CheckCircle2, 
  Info 
} from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { FestivalStatusBadge } from "./FestivalStatusBadge";

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

  const formattedCategory = categoryLabels[festival.category] || festival.category;

  // 날짜 포맷터 (YYYY.MM.DD)
  const formatDate = (date: Date) => {
    const d = new Date(date);
    return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, "0")}.${String(d.getDate()).padStart(2, "0")}`;
  };

  // 신뢰도 점수 색상 및 레벨 판별
  const getTrustScoreColor = (score: number) => {
    if (score >= 80) return "bg-accent text-accent font-bold";
    if (score >= 50) return "bg-amber-500 text-amber-600 font-bold";
    return "bg-primary text-primary font-bold";
  };

  const scoreColor = getTrustScoreColor(festival.trustScore);

  // 기본 이미지 폴백
  const defaultImage = "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=800&auto=format&fit=crop";
  const imageToShow = festival.imageUrl || defaultImage;

  return (
    <div className="group overflow-hidden relative flex flex-col h-full polaroid-panel rounded-xl">
      {/* 마스킹 테이프 아날로그 데코 */}
      <div className={`masking-tape ${festival.id % 2 === 0 ? "masking-tape-stripe" : ""}`} />

      {/* 카드 이미지 상단 - 폴라로이드 사진 인셋 스타일 */}
      <div className="relative aspect-video w-full overflow-hidden bg-muted border border-border/60 rounded-lg">
        <img
          src={imageToShow}
          alt={festival.name}
          className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        
        {/* 우상단 빈티지 소인 데코 - 골든 스티커 느낌 */}
        {festival.trustScore >= 80 && (
          <div className="absolute top-2.5 right-2.5 flex items-center space-x-1.5 bg-gradient-to-r from-amber-400 to-amber-500 text-white text-[9px] font-black px-2 py-0.5 rounded-full shadow-md rotate-3 border border-amber-300">
            <CheckCircle2 size={10} className="shrink-0 text-white animate-pulse" />
            <span>VERIFIED</span>
          </div>
        )}

        {/* 좌하단 아날로그 진행상태 태그 */}
        <div className="absolute bottom-2 left-2 flex gap-1 items-center">
          <FestivalStatusBadge startDate={festival.startDate} endDate={festival.endDate} />
        </div>
      </div>

      {/* 카드 바디 */}
      <div className="flex flex-col flex-1 pt-4">
        {/* 제목 및 설명 */}
        <div className="flex-1">
          <div className="flex items-center space-x-2 text-[10px] font-extrabold text-muted-foreground font-typewriter uppercase mb-1.5">
            <MapPin size={11} className="text-primary/70 shrink-0" />
            <span>{festival.region}</span>
            <span>•</span>
            <span className="text-primary stamp-badge px-1.5 py-0.5">{formattedCategory}</span>
          </div>
          <Link href={`/festivals/${festival.id}`} className="block">
            <h4 className="text-base font-extrabold text-foreground font-serif leading-tight group-hover:text-primary transition-colors line-clamp-1 mb-2">
              {festival.name}
            </h4>
          </Link>
          <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed mb-3.5">
            {festival.description || "이 축제에 대한 소박하고 따뜻한 소식들이 기록 대기 중입니다."}
          </p>
        </div>

        {/* 상세 아이콘 태그 - 아날로그 이중 대시 테두리 */}
        <div className="flex flex-wrap gap-3 py-2.5 my-2 border-y border-dashed border-border/80 text-muted-foreground">
          {festival.hasParking && (
            <div className="flex items-center space-x-1 text-[10px]" title="주차공간 제공">
              <Car size={13} className="text-primary shrink-0" />
              <span className="font-bold">주차장</span>
            </div>
          )}
          {festival.hasShuttle && (
            <div className="flex items-center space-x-1 text-[10px]" title="셔틀버스 운영">
              <Bus size={13} className="text-primary shrink-0" />
              <span className="font-bold">셔틀편</span>
            </div>
          )}
          {festival.isPetFriendly && (
            <div className="flex items-center space-x-1 text-[10px]" title="반려동물 동반 가능">
              <PawPrint size={13} className="text-primary shrink-0" />
              <span className="font-bold">반려동물</span>
            </div>
          )}
          {festival.isChildFriendly && (
            <div className="flex items-center space-x-1 text-[10px]" title="아이와 함께 추천">
              <Baby size={13} className="text-primary shrink-0" />
              <span className="font-bold">아이동반</span>
            </div>
          )}
        </div>

        {/* 신뢰도 점수 그래프 - 아날로그 계기판 감성 */}
        <div className="space-y-1.5 mb-4">
          <div className="flex items-center justify-between text-[11px] font-bold">
            <span className="text-muted-foreground flex items-center space-x-1">
              <span>기록 신뢰지수</span>
              <span title="지자체 출처, 공식 사이트 유무, 편의정보 유무 등으로 자동 계산되는 신뢰 수준입니다.">
                <Info size={10} className="text-muted-foreground/60 cursor-help" />
              </span>
            </span>
            <span className={`font-bold font-typewriter ${scoreColor.split(" ")[1]}`}>{festival.trustScore}%</span>
          </div>
          <div className="h-1.5 w-full bg-secondary border border-border/40 rounded-full overflow-hidden shadow-inner">
            <div
              className={`h-full transition-all duration-500 rounded-full ${scoreColor.split(" ")[0]}`}
              style={{ width: `${festival.trustScore}%` }}
            />
          </div>
        </div>

        {/* 하단 메타 정보 (기간 / 조회수) - 타자기 서체 */}
        <div className="flex items-center justify-between text-[10px] font-bold text-muted-foreground font-typewriter border-t border-border/30 pt-3">
          <span className="flex items-center space-x-1">
            <Calendar size={11} className="shrink-0" />
            <span>{formatDate(festival.startDate)} - {formatDate(festival.endDate)}</span>
          </span>
          <span className="flex items-center space-x-1">
            <Eye size={11} className="shrink-0" />
            <span>VIEWS: {festival.views}</span>
          </span>
        </div>

        {/* 카드 하단 액션 버튼 */}
        <div className="pt-4">
          <Link href={`/festivals/${festival.id}`} className="block">
            <button className="w-full h-10 text-xs font-bold rounded-lg press-button cursor-pointer">
              기록첩 펼쳐보기
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}
