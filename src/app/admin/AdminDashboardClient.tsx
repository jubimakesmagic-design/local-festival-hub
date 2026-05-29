// src/app/admin/AdminDashboardClient.tsx
"use client";

import { useState } from "react";
import { 
  Check, 
  X, 
  Sliders, 
  ListTodo, 
  Inbox, 
  ExternalLink,
  ChevronRight,
  TrendingUp,
  AlertCircle,
  RefreshCw,
  Compass
} from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Input } from "@/components/ui/Input";
import { UserSubmission, Festival } from "@prisma/client";
import type { SyncReport } from "@/lib/collectors/sync";
import { 
  approveSubmissionAction, 
  rejectSubmissionAction, 
  adjustFestivalScoreAction,
  runAutomatedSyncAction
} from "./actions";

export interface AdminDashboardClientProps {
  initialSubmissions: UserSubmission[];
  initialFestivals: Festival[];
}

export function formatExternalUrl(url: string) {
  if (!url) return "";
  if (/^https?:\/\//i.test(url)) {
    return url;
  }
  return `https://${url}`;
}

export function AdminDashboardClient({ 
  initialSubmissions, 
  initialFestivals 
}: AdminDashboardClientProps) {
  const [activeTab, setActiveTab] = useState<"submissions" | "festivals">("submissions");
  const [submissions, setSubmissions] = useState(initialSubmissions);
  const [festivals, setFestivals] = useState(initialFestivals);

  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [toastMsg, setToastMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);
  
  const [syncLoading, setSyncLoading] = useState(false);
  const [syncReport, setSyncReport] = useState<SyncReport | null>(null);

  // 개별 축제별 수동 입력 스코어 로컬 상태 관리
  const [tempScores, setTempScores] = useState<Record<number, number | "">>({});

  const showToast = (type: "success" | "error", text: string) => {
    setToastMsg({ type, text });
    setTimeout(() => setToastMsg(null), 4000);
  };

  // 1. 제보 승인 처리
  const handleApprove = async (submissionId: number) => {
    const idStr = `approve-${submissionId}`;
    setLoadingId(idStr);
    
    // 혹시 입력한 임시 수동 점수가 있다면 함께 전송
    const customScore = tempScores[submissionId];
    const scoreToPass = (customScore === "" || customScore === undefined) ? undefined : customScore;

    try {
      const res = await approveSubmissionAction(submissionId, scoreToPass);
      if (res.success) {
        showToast("success", "제보가 승인되었으며 축제로 정상 생성 및 배포되었습니다!");
        
        // 제보 리스트 상태 실시간 차감 반영
        setSubmissions(submissions.map(sub => 
          sub.id === submissionId ? { ...sub, status: "APPROVED" } : sub
        ));
      } else {
        showToast("error", res.error || "승인 처리에 실패했습니다.");
      }
    } catch (e) {
      console.error(e);
      showToast("error", "인터넷 통신 장애가 발생했습니다.");
    } finally {
      setLoadingId(null);
    }
  };

  // 2. 제보 반려 처리
  const handleReject = async (submissionId: number) => {
    const idStr = `reject-${submissionId}`;
    setLoadingId(idStr);

    try {
      const res = await rejectSubmissionAction(submissionId);
      if (res.success) {
        showToast("success", "해당 제보 건이 반려 처리되었습니다.");
        setSubmissions(submissions.map(sub => 
          sub.id === submissionId ? { ...sub, status: "REJECTED" } : sub
        ));
      } else {
        showToast("error", res.error || "반려 처리에 실패했습니다.");
      }
    } catch (e) {
      console.error(e);
      showToast("error", "인터넷 통신 장애가 발생했습니다.");
    } finally {
      setLoadingId(null);
    }
  };

  // 3. 신뢰도 수동 조정 적용
  const handleAdjustScore = async (festivalId: number) => {
    const idStr = `adjust-${festivalId}`;
    const scoreToApply = tempScores[festivalId];

    if (scoreToApply === undefined || scoreToApply === "") {
      showToast("error", "0점부터 100점 사이의 유효한 점수를 입력해주세요.");
      return;
    }

    if (scoreToApply < 0 || scoreToApply > 100) {
      showToast("error", "0점부터 100점 사이의 유효한 점수를 입력해주세요.");
      return;
    }

    setLoadingId(idStr);

    try {
      const res = await adjustFestivalScoreAction(festivalId, scoreToApply);
      if (res.success) {
        showToast("success", "신뢰도 점수가 성공적으로 조정되었습니다!");
        
        // 페스티벌 리스트 로컬 상태 실시간 반영
        setFestivals(festivals.map(fest => 
          fest.id === festivalId ? { ...fest, trustScore: scoreToApply } : fest
        ));
      } else {
        showToast("error", res.error || "점수 변경에 실패했습니다.");
      }
    } catch (e) {
      console.error(e);
      showToast("error", "인터넷 통신 장애가 발생했습니다.");
    } finally {
      setLoadingId(null);
    }
  };

  const handleScoreInputChange = (id: number, val: string) => {
    const num = parseInt(val);
    if (!isNaN(num)) {
      setTempScores({ ...tempScores, [id]: Math.max(0, Math.min(100, num)) });
    } else if (val === "") {
      setTempScores({ ...tempScores, [id]: "" });
    }
  };

  // 4. 자동 동기화 및 자율 검증 실행
  const handleAutomatedSync = async () => {
    setSyncLoading(true);
    setSyncReport(null);
    try {
      const res = await runAutomatedSyncAction();
      if (res.success && res.report) {
        setSyncReport(res.report);
        showToast("success", "자동 수집 및 자율 검증이 성공적으로 완료되었습니다!");
      } else {
        showToast("error", res.error || "자동 수집 중 오류가 발생했습니다.");
      }
    } catch (e) {
      console.error(e);
      showToast("error", "서버 통신 중 오류가 발생했습니다.");
    } finally {
      setSyncLoading(false);
    }
  };

  const pendingSubmissions = submissions.filter(s => s.status === "PENDING");
  const processedSubmissions = submissions.filter(s => s.status !== "PENDING");

  return (
    <div className="space-y-6">
      
      {/* 토스트 노티바 - 빈티지 스탬프 알림 */}
      {toastMsg && (
        <div className={`fixed top-20 right-4 z-50 p-4 rounded border-2 shadow-md flex items-center space-x-2.5 animate-slide-up ${
          toastMsg.type === "success" 
            ? "bg-card border-accent text-accent"
            : "bg-card border-primary text-primary"
        }`}>
          <AlertCircle size={16} className="shrink-0" />
          <span className="text-xs font-bold leading-none">{toastMsg.text}</span>
        </div>
      )}

      <div className="relative space-y-4 overflow-hidden rounded-lg border border-border bg-card p-5 shadow-sm md:p-6">
        <div className="relative z-10 flex flex-col justify-between gap-5 md:flex-row md:items-center">
          <div className="flex-1 space-y-1.5 text-sm font-medium">
            <div className="inline-flex items-center space-x-1 rounded-md border border-accent/25 bg-accent/10 px-2.5 py-1 text-xs font-semibold text-accent">
              <Compass size={12} className="shrink-0" />
              <span>수집 상태</span>
            </div>
            <h3 className="flex items-center gap-1.5 text-base font-semibold tracking-normal text-foreground">
              <span>수집 및 출처 검토</span>
            </h3>
            <p className="max-w-2xl text-sm leading-6 text-muted-foreground">
              공공 API, 지자체 공지, 지역 소식에서 축제 정보를 수집하고 지역·기간·출처 기준으로 중복 여부를 확인합니다.
            </p>
          </div>
          <div className="shrink-0 w-full md:w-auto">
            <button
              disabled={syncLoading}
              onClick={handleAutomatedSync}
              className="flex h-10 w-full cursor-pointer items-center justify-center gap-2 rounded-lg border border-primary bg-primary px-5 text-sm font-semibold text-primary-foreground shadow-sm transition-colors hover:bg-primary/92 disabled:cursor-not-allowed disabled:opacity-60 md:w-auto"
            >
              <RefreshCw size={13} className={syncLoading ? "animate-spin shrink-0" : "shrink-0"} />
              <span>{syncLoading ? "수집 중..." : "수집 실행"}</span>
            </button>
          </div>
        </div>

        {syncReport && (
          <div className="mt-4 space-y-4 rounded-lg border border-accent/30 bg-background p-5">
            <div className="flex items-center justify-between">
              <h4 className="flex items-center gap-1.5 text-sm font-semibold text-accent">
                <Check size={14} />
                <span>동기화 결과</span>
              </h4>
              <button
                className="h-8 cursor-pointer rounded-lg border border-accent/30 bg-secondary/30 px-3 text-xs font-semibold text-accent transition-colors hover:bg-secondary"
                onClick={() => window.location.reload()}
              >
                새로고침
              </button>
            </div>
            
            <div className="grid grid-cols-2 gap-3 text-xs font-medium sm:grid-cols-5">
              <div className="space-y-1 rounded-lg border border-border bg-card p-3 text-center">
                <span className="block text-muted-foreground">수집</span>
                <span className="text-base font-bold text-foreground">{syncReport.collectedCount}건</span>
              </div>
              <div className="space-y-1 rounded-lg border border-border bg-card p-3 text-center">
                <span className="block text-muted-foreground">제외</span>
                <span className="text-base font-bold text-muted-foreground">{syncReport.skippedCount}건</span>
              </div>
              <div className="space-y-1 rounded-lg border border-border bg-card p-3 text-center">
                <span className="block text-muted-foreground">병합</span>
                <span className="text-base font-bold text-primary">{syncReport.mergedCount}건</span>
              </div>
              <div className="space-y-1 rounded-lg border border-border bg-card p-3 text-center">
                <span className="block text-muted-foreground">등록</span>
                <span className="text-base font-bold text-accent">{syncReport.createdVerifiedCount}건</span>
              </div>
              <div className="space-y-1 rounded-lg border border-border bg-card p-3 text-center">
                <span className="block text-muted-foreground">검토 필요</span>
                <span className="text-base font-bold text-primary">{syncReport.createdReviewCount}건</span>
              </div>
            </div>

            {syncReport.details && syncReport.details.length > 0 && (
              <div className="space-y-1 text-xs">
                <span className="block font-semibold text-muted-foreground">처리 로그</span>
                <div className="max-h-32 space-y-1.5 overflow-y-auto rounded-lg border border-border bg-card p-3 text-xs leading-5 text-muted-foreground">
                  {syncReport.details.map((detail: string, idx: number) => (
                    <div key={idx} className="border-b border-border/20 pb-1 last:border-b-0 last:pb-0">
                      {detail}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      <div className="flex border-b border-border pb-px gap-4">
        <button
          onClick={() => setActiveTab("submissions")}
          className={`flex cursor-pointer items-center space-x-1.5 border-b-2 pb-2.5 text-sm font-semibold transition-colors ${
            activeTab === "submissions"
              ? "border-primary text-primary"
              : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
        >
          <Inbox size={14} className="shrink-0" />
          <span>제보함</span>
          {pendingSubmissions.length > 0 && (
            <span className="flex h-5 items-center justify-center rounded-sm bg-primary px-1.5 text-xs font-semibold text-primary-foreground">
              {pendingSubmissions.length}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab("festivals")}
          className={`flex cursor-pointer items-center space-x-1.5 border-b-2 pb-2.5 text-sm font-semibold transition-colors ${
            activeTab === "festivals"
              ? "border-primary text-primary"
              : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
        >
          <Sliders size={14} className="shrink-0" />
          <span>신뢰도 관리</span>
        </button>
      </div>

      {/* 컨텐츠 보드 */}
      {activeTab === "submissions" ? (
        <div className="space-y-6 animate-slide-up">
          <div className="space-y-4 rounded-lg border border-border bg-card p-5 shadow-sm md:p-6">
            <div className="mb-2">
              <h3 className="flex items-center space-x-1.5 text-sm font-semibold text-foreground">
                <ListTodo size={15} className="text-primary shrink-0" />
                <span>검토 대기 제보 ({pendingSubmissions.length}건)</span>
              </h3>
            </div>

            {pendingSubmissions.length > 0 ? (
              <div className="space-y-4">
                {pendingSubmissions.map((sub) => (
                  <div 
                    key={sub.id} 
                    className="relative flex flex-col items-start justify-between gap-4 rounded-lg border border-border bg-background p-4 transition-colors hover:border-primary/40 md:flex-row md:items-center"
                  >
                    <div className="flex-1 space-y-1.5 text-sm font-medium leading-relaxed">
                      <div className="flex items-center space-x-2 text-xs font-medium">
                        <span className="rounded-md bg-primary/10 px-2 py-0.5 text-primary">{sub.category}</span>
                        <span className="text-muted-foreground">{sub.region}</span>
                      </div>
                      <h4 className="text-base font-semibold tracking-normal text-foreground">
                        {sub.name}
                      </h4>
                      <p className="line-clamp-2 text-sm leading-6 text-muted-foreground">
                        {sub.description || "소개글이 없습니다."}
                      </p>
                      <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
                        <span>{sub.dateRange}</span>
                        {sub.address && <span>{sub.address}</span>}
                        {sub.submitterEmail && <span>{sub.submitterEmail}</span>}
                      </div>

                      {sub.sourceUrl && (
                        <a 
                          href={formatExternalUrl(sub.sourceUrl)} 
                          target="_blank" 
                          rel="noreferrer" 
                          className="inline-flex items-center space-x-1 text-xs font-semibold text-primary hover:underline"
                        >
                          <ChevronRight size={10} />
                          <span>출처 링크 열기</span>
                          <ExternalLink size={8} />
                        </a>
                      )}
                    </div>

                    <div className="flex items-center gap-2.5 w-full md:w-auto shrink-0 border-t md:border-t-0 border-border/40 pt-3.5 md:pt-0">
                      <div className="flex w-full items-center space-x-1.5 text-xs font-medium md:w-auto">
                        <span className="shrink-0 text-muted-foreground">점수</span>
                        <Input
                          type="number"
                          placeholder="자동"
                          min="0"
                          max="100"
                          value={tempScores[sub.id] ?? ""}
                          onChange={(e) => handleScoreInputChange(sub.id, e.target.value)}
                          className="h-9 w-16 bg-background px-1 text-center text-xs"
                        />
                      </div>

                      <div className="flex gap-2 w-full md:w-auto">
                        <button
                          disabled={loadingId !== null}
                          className="flex h-9 w-10 cursor-pointer items-center justify-center rounded-lg border border-border bg-secondary text-xs text-primary transition-colors hover:bg-primary hover:text-white disabled:cursor-not-allowed disabled:opacity-60"
                          onClick={() => handleReject(sub.id)}
                          title="반려"
                        >
                          {loadingId === `reject-${sub.id}` ? ".." : <X size={13} />}
                        </button>
                        <button
                          disabled={loadingId !== null}
                          className="flex h-9 cursor-pointer items-center justify-center space-x-1 rounded-lg border border-accent bg-accent px-4 text-xs font-semibold text-accent-foreground shadow-sm transition-colors hover:bg-accent/90 disabled:cursor-not-allowed disabled:opacity-60"
                          onClick={() => handleApprove(sub.id)}
                        >
                          <span>{loadingId === `approve-${sub.id}` ? "처리중.." : "승인"}</span>
                          {loadingId !== `approve-${sub.id}` && <Check size={13} className="shrink-0" />}
                        </button>
                      </div>
                    </div>

                  </div>
                ))}
              </div>
            ) : (
              <div className="rounded-lg border border-dashed border-border bg-secondary/15 p-10 text-center text-sm text-muted-foreground">
                검토할 제보가 없습니다.
              </div>
            )}
          </div>

          {processedSubmissions.length > 0 && (
            <div className="space-y-4 rounded-lg border border-border bg-card p-5 shadow-sm">
              <div className="mb-2">
                <h3 className="text-sm font-semibold text-foreground">
                  처리 완료 ({processedSubmissions.length}건)
                </h3>
              </div>
              <div className="space-y-2 text-sm font-medium">
                {processedSubmissions.map((sub) => (
                  <div 
                    key={sub.id}
                    className="flex items-center justify-between rounded-lg border border-border bg-background/50 p-3 text-sm"
                  >
                    <div className="space-y-1">
                      <span className="line-clamp-1 font-semibold text-foreground">{sub.name}</span>
                      <span className="text-xs text-muted-foreground">{sub.region}</span>
                    </div>
                    <Badge variant={sub.status === "APPROVED" ? "success" : "destructive"}>
                      {sub.status === "APPROVED" ? "승인됨" : "반려됨"}
                    </Badge>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>
      ) : (
        <div className="space-y-6 animate-slide-up">
          <div className="space-y-4 rounded-lg border border-border bg-card p-5 shadow-sm md:p-6">
            <div className="mb-2">
              <h3 className="flex items-center space-x-1.5 text-sm font-semibold text-foreground">
                <TrendingUp size={15} className="text-primary shrink-0" />
                <span>신뢰도 조정 ({festivals.length}건)</span>
              </h3>
            </div>

            <div className="space-y-4">
              {festivals.map((fest) => {
                const hasPendingScore = tempScores[fest.id] !== undefined && tempScores[fest.id] !== fest.trustScore;
                return (
                  <div 
                    key={fest.id}
                    className="flex flex-col items-start justify-between gap-4 rounded-lg border border-border bg-background/40 p-4 transition-colors hover:border-primary/30 sm:flex-row sm:items-center"
                  >
                    <div className="flex-1 space-y-1 text-sm font-medium leading-relaxed">
                      <div className="flex items-center space-x-2 text-xs font-medium">
                        <span className="rounded-md bg-primary/10 px-2 py-0.5 text-primary">{fest.category}</span>
                        <span className="text-muted-foreground">{fest.region}</span>
                      </div>
                      <h4 className="text-base font-semibold tracking-normal text-foreground">
                        {fest.name}
                      </h4>
                      <span className="block text-xs font-medium text-muted-foreground">
                        현재 점수 <span className="font-semibold text-primary">{fest.trustScore}%</span>
                      </span>
                    </div>

                    <div className="flex items-center gap-3 w-full sm:w-auto border-t sm:border-t-0 border-border/40 pt-3.5 sm:pt-0">
                      <div className="flex w-full items-center space-x-2 text-xs font-medium sm:w-auto">
                        <span className="shrink-0 text-muted-foreground">새 점수</span>
                        <Input
                          type="number"
                          placeholder={String(fest.trustScore)}
                          min="0"
                          max="100"
                          value={tempScores[fest.id] ?? ""}
                          onChange={(e) => handleScoreInputChange(fest.id, e.target.value)}
                          className="h-9 w-20 bg-background px-1 text-center text-xs"
                        />
                      </div>
                      <button
                        disabled={loadingId !== null || !hasPendingScore}
                        className={`h-9 w-full shrink-0 cursor-pointer rounded-lg border px-4 text-xs font-semibold sm:w-auto ${
                          hasPendingScore 
                            ? "border-primary bg-primary text-primary-foreground shadow-sm" 
                            : "bg-secondary border-border text-muted-foreground cursor-not-allowed"
                        }`}
                        onClick={() => handleAdjustScore(fest.id)}
                      >
                        {loadingId === `adjust-${fest.id}` ? ".." : "적용"}
                      </button>
                    </div>

                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
