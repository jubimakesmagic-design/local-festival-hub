// src/components/festivals/FestivalMapPlaceholder.tsx
import { MapPin, Navigation, ExternalLink } from "lucide-react";
import { Card } from "@/components/ui/Card";

export interface FestivalMapPlaceholderProps {
  address: string;
  festivalName: string;
}

export function FestivalMapPlaceholder({ address, festivalName }: FestivalMapPlaceholderProps) {
  // 인코딩된 주소 링크 생성 (카카오 맵 검색용)
  const kakaoMapSearchUrl = `https://map.kakao.com/?q=${encodeURIComponent(address)}`;
  const naverMapSearchUrl = `https://map.naver.com/v5/search/${encodeURIComponent(address)}`;

  return (
    <Card className="overflow-hidden border border-border/60 bg-secondary/20 relative shadow-inner">
      {/* 가상 3D 격자 무늬 배경 지도 모사 */}
      <div 
        className="w-full h-72 flex flex-col items-center justify-center p-6 text-center space-y-4 relative"
        style={{
          backgroundImage: `
            radial-gradient(circle, hsl(var(--border)) 1.5px, transparent 1.5px),
            linear-gradient(to right, rgba(0, 0, 0, 0.03) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(0, 0, 0, 0.03) 1px, transparent 1px)
          `,
          backgroundSize: "24px 24px, 48px 48px, 48px 48px",
          backgroundPosition: "center center"
        }}
      >
        {/* 장식용 등고선 원형 모양 */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 border border-primary/5 rounded-full pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 border border-primary/5 rounded-full pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 border border-primary/5 rounded-full pointer-events-none" />

        {/* 중심 마커 포인트 */}
        <div className="relative z-10 flex flex-col items-center">
          {/* 마커 펄스 효과 */}
          <span className="absolute inline-flex h-12 w-12 rounded-full bg-primary/20 animate-ping opacity-75" />
          <div className="h-14 w-14 rounded-full bg-gradient-to-tr from-primary to-accent text-white flex items-center justify-center shadow-lg shadow-primary/30 relative z-20">
            <MapPin size={26} className="animate-bounce" />
          </div>
        </div>

        {/* 지도 메타 알림 정보 */}
        <div className="relative z-10 space-y-1.5 max-w-sm">
          <span className="inline-flex px-2 py-0.5 rounded-md bg-primary/10 text-primary text-[10px] font-black uppercase border border-primary/20">
            API Placeholder
          </span>
          <h5 className="font-extrabold text-foreground text-sm tracking-tight">
            {festivalName} 상세 위치
          </h5>
          <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">
            {address}
          </p>
        </div>

        {/* 지도 API 연결 안내 레이어 (유리 블러 패널) */}
        <div className="absolute bottom-4 inset-x-4 glass-panel border border-border/60 rounded-xl p-3.5 flex flex-col sm:flex-row items-center justify-between gap-3 text-left">
          <div className="space-y-0.5 text-center sm:text-left">
            <span className="text-[10px] font-bold text-muted-foreground">DEVELOPER NOTICE</span>
            <p className="text-[11px] font-semibold text-foreground leading-tight">
              이 영역은 <strong>Kakao Map SDK</strong> 또는 <strong>Naver Map API</strong>를 연동하는 마운트 지점입니다.
            </p>
          </div>
          <div className="flex gap-2 shrink-0 w-full sm:w-auto">
            <a 
              href={kakaoMapSearchUrl}
              target="_blank"
              rel="noreferrer"
              className="flex-1 sm:flex-initial h-8 px-3 rounded-lg bg-yellow-400 text-yellow-950 hover:bg-yellow-300 text-[11px] font-black flex items-center justify-center gap-1 active:scale-95 transition-transform"
            >
              <Navigation size={11} />
              <span>카카오맵</span>
              <ExternalLink size={10} />
            </a>
            <a 
              href={naverMapSearchUrl}
              target="_blank"
              rel="noreferrer"
              className="flex-1 sm:flex-initial h-8 px-3 rounded-lg bg-emerald-500 text-white hover:bg-emerald-400 text-[11px] font-black flex items-center justify-center gap-1 active:scale-95 transition-transform"
            >
              <Navigation size={11} />
              <span>네이버 지도</span>
              <ExternalLink size={10} />
            </a>
          </div>
        </div>
      </div>
    </Card>
  );
}
