// src/app/admin/page.tsx
import { db } from "@/lib/db";
import { AdminDashboardClient } from "./AdminDashboardClient";
import { ShieldAlert } from "lucide-react";

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
    <div className="relative min-h-screen bg-background py-10">
      <div className="container relative z-10 mx-auto px-4 md:px-6">
        <section className="mx-auto mb-8 max-w-2xl space-y-3 text-center">
          <div className="inline-flex items-center space-x-1.5 rounded-lg border border-rose-500/20 bg-rose-500/10 px-3 py-1.5 text-xs font-semibold text-rose-600 dark:text-rose-400">
            <ShieldAlert size={12} className="shrink-0" />
            <span>관리자</span>
          </div>
          <h2 className="text-2xl font-bold tracking-normal text-foreground md:text-3xl">
            제보 및 축제 관리
          </h2>
          <p className="mx-auto max-w-md text-sm font-medium leading-6 text-muted-foreground">
            접수된 제보를 검토하고 등록된 축제의 신뢰도 점수를 조정합니다.
          </p>
          
          <div className="mx-auto max-w-md rounded-lg border border-primary/20 bg-secondary/50 p-3 text-xs font-medium leading-5 text-primary shadow-sm">
            데모 환경에서는 관리자 인증이 생략되어 있습니다.
          </div>
        </section>

        <AdminDashboardClient 
          initialSubmissions={JSON.parse(JSON.stringify(submissions))} 
          initialFestivals={JSON.parse(JSON.stringify(festivals))} 
        />

      </div>
    </div>
  );
}
