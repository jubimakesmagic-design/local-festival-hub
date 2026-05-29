"use client";

import { AlertTriangle, RotateCcw } from "lucide-react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  console.error("[AppErrorBoundary]", error);

  return (
    <div className="min-h-[70vh] bg-background px-4 py-16">
      <div className="mx-auto max-w-xl rounded-lg border border-border bg-card p-8 text-center shadow-sm">
        <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-lg bg-destructive/10 text-destructive">
          <AlertTriangle size={28} />
        </div>
        <h1 className="text-2xl font-bold text-foreground">잠시 연결이 고르지 않습니다</h1>
        <p className="mt-3 text-sm leading-7 text-muted-foreground">
          축제 데이터베이스나 수집 결과를 읽는 중 문제가 발생했습니다. 다시 시도하면 최신 상태로 재요청합니다.
        </p>
        <button
          type="button"
          onClick={reset}
          className="press-button mt-6 h-11 rounded-lg px-5 text-sm font-semibold"
        >
          <RotateCcw size={17} className="mr-2 shrink-0" />
          다시 불러오기
        </button>
      </div>
    </div>
  );
}
