// src/app/admin/page.tsx
import { db } from "@/lib/db";
import { AdminDashboardClient } from "./AdminDashboardClient";
import { Sparkles, ShieldAlert } from "lucide-react";

export const revalidate = 0; // 실시간 변경 상태를 즉각 반영하기 위해 캐시 끔

export default async function AdminPage() {
  // 1. 모든 제보 내역 조회 (최신 등록 순)
  const submissions = await db.userSubmission.findMany({
    orderBy: { createdAt: "desc" }
  });

  // 2. 모든 등록 축제 조회 (이름 가나다 순)
  const festivals = await db.festival.findMany({
    orderBy: { name: "asc" }
  });

  return (
    <div className="min-h-screen py-10 relative bg-background">

      <div className="container mx-auto px-4 md:px-6 relative z-10">
        
        {/* 상단 관리자 안내 헤더 - 다이어리 검수 대장 */}
        <section className="mb-10 text-center max-w-2xl mx-auto space-y-3">
          <div className="inline-flex items-center space-x-1.5 px-3 py-1.5 border border-dashed border-rose-500/40 text-rose-500 text-xs font-bold stamp-badge uppercase font-typewriter">
            <ShieldAlert size={12} className="shrink-0" />
            <span>ARCHIVE AUDIT CENTRE</span>
          </div>
          <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight text-foreground font-serif">
            기록 검수 대장
          </h2>
          <p className="text-xs text-muted-foreground leading-relaxed max-w-md mx-auto font-medium">
            동네 탐험대원들로부터 접수된 소박한 누락 제보 기록을 하나씩 고찰·심사하고, 등록된 소규모 축제들의 현지 정보 신뢰지수를 엄밀히 재계산하여 기록첩에 등재합니다.
          </p>
          
          {/* 간이 Bypass Auth 배너 */}
          <div className="max-w-md mx-auto p-3.5 border border-primary/30 bg-secondary/50 text-[10px] text-primary font-bold leading-relaxed shadow-sm rounded font-typewriter uppercase">
            🛡️ DEMO MODE: AUTHENTICATION BYPASSED FOR TESTING
          </div>
        </section>


        {/* 클라이언트 사이드 대시보드 인터페이스 마운트 */}
        <AdminDashboardClient 
          initialSubmissions={JSON.parse(JSON.stringify(submissions))} 
          initialFestivals={JSON.parse(JSON.stringify(festivals))} 
        />

      </div>
    </div>
  );
}
