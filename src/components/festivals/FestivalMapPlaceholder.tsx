// src/components/festivals/FestivalMapPlaceholder.tsx
import { MapPin, Navigation, ExternalLink } from "lucide-react";
import { Card } from "@/components/ui/Card";

export interface FestivalMapPlaceholderProps {
  address: string;
  festivalName: string;
}

export function FestivalMapPlaceholder({ address, festivalName }: FestivalMapPlaceholderProps) {
  const kakaoMapSearchUrl = `https://map.kakao.com/?q=${encodeURIComponent(address)}`;
  const naverMapSearchUrl = `https://map.naver.com/v5/search/${encodeURIComponent(address)}`;

  return (
    <Card className="overflow-hidden border-border bg-card">
      <div className="grid gap-4 p-5 md:grid-cols-[1fr_auto] md:items-center md:p-6">
        <div className="flex gap-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <MapPin size={22} />
          </div>
          <div>
            <h2 className="text-base font-semibold text-foreground">{festivalName} 위치</h2>
            <p className="mt-1 text-sm leading-6 text-muted-foreground">{address}</p>
          </div>
        </div>

        <div className="flex w-full gap-2 md:w-auto">
          <a
            href={kakaoMapSearchUrl}
            target="_blank"
            rel="noreferrer"
            className="flex h-10 flex-1 items-center justify-center gap-1.5 rounded-lg border border-border bg-background px-3 text-sm font-semibold text-foreground transition-colors hover:border-primary hover:text-primary md:flex-initial"
          >
            <Navigation size={15} />
            <span>카카오맵</span>
            <ExternalLink size={13} />
          </a>
          <a
            href={naverMapSearchUrl}
            target="_blank"
            rel="noreferrer"
            className="flex h-10 flex-1 items-center justify-center gap-1.5 rounded-lg border border-border bg-background px-3 text-sm font-semibold text-foreground transition-colors hover:border-primary hover:text-primary md:flex-initial"
          >
            <Navigation size={15} />
            <span>네이버 지도</span>
            <ExternalLink size={13} />
          </a>
        </div>
      </div>
    </Card>
  );
}
