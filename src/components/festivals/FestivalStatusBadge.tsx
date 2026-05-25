// src/components/festivals/FestivalStatusBadge.tsx
import { Badge } from "@/components/ui/Badge";

export interface FestivalStatusBadgeProps {
  startDate: Date;
  endDate: Date;
}

export function FestivalStatusBadge({ startDate, endDate }: FestivalStatusBadgeProps) {
  // 데모의 시점 일관성을 위해 현재 기준 시점을 '2026-05-25T17:39:43+09:00'로 통일합니다.
  const now = new Date("2026-05-25T17:39:43+09:00");
  const start = new Date(startDate);
  const end = new Date(endDate);

  let status: "ONGOING" | "ENDING_SOON" | "UPCOMING" | "ENDED" = "UPCOMING";
  
  if (end < now) {
    status = "ENDED";
  } else if (start <= now && now <= end) {
    // 종료 3일 이내인 경우 종료 임박
    const threeDaysMs = 3 * 24 * 60 * 60 * 1000;
    const isEndingSoon = (end.getTime() - now.getTime()) <= threeDaysMs;
    status = isEndingSoon ? "ENDING_SOON" : "ONGOING";
  } else {
    status = "UPCOMING";
  }

  const badgeProps = {
    ONGOING: { variant: "success" as const, label: "진행중" },
    ENDING_SOON: { variant: "accent" as const, label: "종료임박" },
    UPCOMING: { variant: "primary" as const, label: "예정" },
    ENDED: { variant: "secondary" as const, label: "종료됨" }
  };

  const current = badgeProps[status];

  return (
    <Badge variant={current.variant} className="font-semibold shadow-sm">
      {current.label}
    </Badge>
  );
}
