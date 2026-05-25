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
  Sparkles,
  Compass
} from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { 
  approveSubmissionAction, 
  rejectSubmissionAction, 
  adjustFestivalScoreAction,
  runAutomatedSyncAction
} from "./actions";

export interface AdminDashboardClientProps {
  initialSubmissions: any[];
  initialFestivals: any[];
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
  const [syncReport, setSyncReport] = useState<any | null>(null);

  // 개별 축제별 수동 입력 스코어 로컬 상태 관리
  const [tempScores, setTempScores] = useState<Record<number, number>>({});

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

    try {
      const res = await approveSubmissionAction(submissionId, customScore);
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

    if (scoreToApply === undefined || scoreToApply < 0 || scoreToApply > 100) {
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
      setTempScores({ ...tempScores, [id]: "" as any });
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

      {/* 자율 검증 및 자동 수집 제어반 - 빈티지 나무 오피스 게시판 느낌 */}
      <div className="bg-card border-2 border-primary/50 shadow-[4px_4px_0px_0px_hsl(var(--primary))] p-5 md:p-6 animate-slide-up rounded space-y-4 relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-5 relative z-10">
          <div className="space-y-1.5 flex-1 text-sm font-semibold">
            <div className="inline-flex items-center space-x-1 px-2.5 py-0.5 border border-dashed border-accent/40 text-accent text-[10px] font-bold stamp-badge bg-card">
              <Compass size={10} className="text-accent animate-spin-slow shrink-0" />
              <span>AUTONOMOUS ENGINE ACTIVE</span>
            </div>
            <h3 className="text-base font-extrabold text-foreground tracking-tight flex items-center gap-1.5 font-serif">
              <span>🤖 실시간 자율 크롤링 & AI 교차 검증 대장</span>
            </h3>
            <p className="text-xs text-muted-foreground leading-relaxed max-w-2xl font-medium">
              작동 시 공공 API, 지자체 고문 서류, 뉴스 기록을 실시간 수집합니다. 수집된 소식은 <strong>지오코딩 및 서리 매핑 알고리즘</strong>을 통해 대조되며, 신뢰 점수가 <strong>70% 이상인 경우 즉시 기록첩에 연동 배포(VERIFIED)</strong> 처리됩니다.
            </p>
          </div>
          <div className="shrink-0 w-full md:w-auto">
            <button
              disabled={syncLoading}
              onClick={handleAutomatedSync}
              className="w-full md:w-auto font-extrabold text-xs tracking-tight h-10 px-5 border border-primary bg-primary text-primary-foreground flex items-center justify-center gap-2 cursor-pointer transition-all shadow-[2px_2px_0px_0px_var(--color-primary)] active:translate-x-0.5 active:translate-y-0.5 rounded"
            >
              <RefreshCw size={13} className={syncLoading ? "animate-spin shrink-0" : "shrink-0"} />
              <span>{syncLoading ? "자동 수집 및 검수 중..." : "자동 수집 및 자율 검수 실행"}</span>
            </button>
          </div>
        </div>

        {/* 수집 동기화 보고서 모달/카드 오버레이 */}
        {syncReport && (
          <div className="mt-4 p-5 border-2 border-dashed border-accent/40 bg-card rounded animate-fade-in space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-black text-accent flex items-center gap-1.5 font-typewriter">
                <Check size={14} />
                <span>SYNC & AUDIT REPORT</span>
              </h4>
              <button
                className="h-7 px-3 rounded text-[10px] font-bold border border-accent/40 bg-secondary/30 text-accent cursor-pointer press-button"
                onClick={() => window.location.reload()}
              >
                완료하고 새로고침 🔄
              </button>
            </div>
            
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-bold font-typewriter">
              <div className="bg-background border border-border p-3 rounded text-center space-y-1 shadow-[2px_2px_0px_0px_var(--color-border)]">
                <span className="text-[9px] text-muted-foreground block">COLLECTED</span>
                <span className="text-base font-black text-foreground">{syncReport.collectedCount} records</span>
              </div>
              <div className="bg-background border border-border p-3 rounded text-center space-y-1 shadow-[2px_2px_0px_0px_var(--color-border)]">
                <span className="text-[9px] text-muted-foreground block">MERGED</span>
                <span className="text-base font-black text-primary">{syncReport.mergedCount} records</span>
              </div>
              <div className="bg-background border border-border p-3 rounded text-center space-y-1 shadow-[2px_2px_0px_0px_var(--color-border)]">
                <span className="text-[9px] text-muted-foreground block">AUTO VERIFIED</span>
                <span className="text-base font-black text-accent">{syncReport.createdVerifiedCount} records</span>
              </div>
              <div className="bg-background border border-border p-3 rounded text-center space-y-1 shadow-[2px_2px_0px_0px_var(--color-border)]">
                <span className="text-[9px] text-muted-foreground block">PENDING REVIEW</span>
                <span className="text-base font-black text-primary">{syncReport.createdReviewCount} records</span>
              </div>
            </div>

            {/* 디테일 상세 로그 스크롤 보드 */}
            {syncReport.details && syncReport.details.length > 0 && (
              <div className="space-y-1 text-xs">
                <span className="text-[10px] text-muted-foreground font-bold font-typewriter block">ENGINE LOGS:</span>
                <div className="bg-background border border-border rounded p-3 max-h-32 overflow-y-auto text-[10px] font-mono leading-relaxed space-y-1.5 text-muted-foreground shadow-inner">
                  {syncReport.details.map((detail: string, idx: number) => (
                    <div key={idx} className="border-b border-border/20 pb-1 last:border-b-0 last:pb-0">
                      • {detail}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* 탭 네비게이션 컨트롤 - 다이어리 북마크 카드 캡 */}
      <div className="flex border-b border-border pb-px gap-4">
        <button
          onClick={() => setActiveTab("submissions")}
          className={`flex items-center space-x-1.5 pb-2.5 text-xs font-bold border-b-2 transition-all cursor-pointer font-typewriter ${
            activeTab === "submissions"
              ? "border-primary text-primary font-extrabold"
              : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
        >
          <Inbox size={14} className="shrink-0" />
          <span>SUBMISSIONS MAILBOX</span>
          {pendingSubmissions.length > 0 && (
            <span className="h-4.5 px-1.5 rounded-sm bg-primary text-primary-foreground text-[9px] font-black flex items-center justify-center font-typewriter">
              {pendingSubmissions.length}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab("festivals")}
          className={`flex items-center space-x-1.5 pb-2.5 text-xs font-bold border-b-2 transition-all cursor-pointer font-typewriter ${
            activeTab === "festivals"
              ? "border-primary text-primary font-extrabold"
              : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
        >
          <Sliders size={14} className="shrink-0" />
          <span>FESTIVAL TRUST SCORES</span>
        </button>
      </div>

      {/* 컨텐츠 보드 */}
      {activeTab === "submissions" ? (
        <div className="space-y-6 animate-slide-up">
          {/* 대기 제보 섹션 */}
          <div className="bg-card border-2 border-border p-5 md:p-6 shadow-[4px_4px_0px_0px_hsl(var(--border))] rounded space-y-4">
            <div className="mb-2">
              <h3 className="text-sm font-extrabold text-foreground flex items-center space-x-1.5 font-serif">
                <ListTodo size={15} className="text-primary shrink-0" />
                <span>제보 심사 대기 기록 ({pendingSubmissions.length}건)</span>
              </h3>
            </div>

            {pendingSubmissions.length > 0 ? (
              <div className="space-y-4">
                {pendingSubmissions.map((sub) => (
                  <div 
                    key={sub.id} 
                    className="flex flex-col md:flex-row items-start md:items-center justify-between p-4 border border-border bg-background rounded-sm gap-4 hover:border-primary/40 transition-colors relative"
                  >
                    <div className="space-y-1.5 flex-1 text-xs font-semibold leading-relaxed">
                      <div className="flex items-center space-x-2 text-[10px] font-bold font-typewriter uppercase">
                        <span className="text-primary stamp-badge px-1.5 py-0.5">{sub.category}</span>
                        <span className="text-muted-foreground">{sub.region}</span>
                      </div>
                      <h4 className="font-extrabold text-foreground tracking-tight text-sm font-serif">
                        {sub.name}
                      </h4>
                      <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">
                        {sub.description || "기록된 본문 소개글이 비어있습니다."}
                      </p>
                      <div className="flex flex-wrap gap-x-4 gap-y-1 text-[10px] text-muted-foreground/60 font-typewriter">
                        <span>🗓️ {sub.dateRange}</span>
                        {sub.address && <span>📍 {sub.address}</span>}
                        {sub.submitterEmail && <span>📧 {sub.submitterEmail}</span>}
                      </div>

                      {/* 출처 링크 아웃 */}
                      {sub.sourceUrl && (
                        <a 
                          href={formatExternalUrl(sub.sourceUrl)} 
                          target="_blank" 
                          rel="noreferrer" 
                          className="inline-flex items-center space-x-1 text-[10px] text-primary font-bold hover:underline font-typewriter"
                        >
                          <ChevronRight size={10} />
                          <span>VIEW CROSS-REFERENCE LINK</span>
                          <ExternalLink size={8} />
                        </a>
                      )}
                    </div>

                    {/* 승인/반려 조작 액션 */}
                    <div className="flex items-center gap-2.5 w-full md:w-auto shrink-0 border-t md:border-t-0 border-border/40 pt-3.5 md:pt-0">
                      {/* 수동 점수 override 인풋 */}
                      <div className="flex items-center space-x-1.5 w-full md:w-auto text-xs font-bold">
                        <span className="text-[10px] text-muted-foreground shrink-0 font-typewriter">SCORE</span>
                        <Input
                          type="number"
                          placeholder="자동"
                          min="0"
                          max="100"
                          value={tempScores[sub.id] ?? ""}
                          onChange={(e) => handleScoreInputChange(sub.id, e.target.value)}
                          className="h-8 w-16 text-center text-xs px-1 bg-background border-border font-typewriter"
                        />
                      </div>

                      <div className="flex gap-2 w-full md:w-auto">
                        <button
                          disabled={loadingId !== null}
                          className="h-8 w-10 border border-border text-xs text-primary bg-secondary hover:bg-primary hover:text-white cursor-pointer rounded flex items-center justify-center transition-all"
                          onClick={() => handleReject(sub.id)}
                          title="반려"
                        >
                          {loadingId === `reject-${sub.id}` ? ".." : <X size={13} />}
                        </button>
                        <button
                          disabled={loadingId !== null}
                          className="h-8 px-4 border border-accent bg-accent text-accent-foreground text-xs font-bold flex items-center justify-center space-x-1 cursor-pointer rounded shadow-[2px_2px_0px_0px_rgba(74,107,83,0.3)] active:translate-x-0.5 active:translate-y-0.5 transition-all"
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
              <div className="border border-dashed border-border rounded p-10 text-center text-xs text-muted-foreground bg-secondary/15 font-serif">
                심사대기함이 비어있습니다. 새로운 로컬 탐험 기록 제보가 아직 없습니다.
              </div>
            )}
          </div>

          {/* 완료 제보 내역 섹션 */}
          {processedSubmissions.length > 0 && (
            <div className="bg-card border-2 border-border p-5 shadow-[4px_4px_0px_0px_hsl(var(--border))] rounded space-y-4">
              <div className="mb-2">
                <h3 className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider font-typewriter">
                  PROCESSED ARCHIVE LOG / 처리 기록 대장 ({processedSubmissions.length}건)
                </h3>
              </div>
              <div className="space-y-2 text-xs font-bold leading-none">
                {processedSubmissions.map((sub) => (
                  <div 
                    key={sub.id}
                    className="flex items-center justify-between p-3 border border-border bg-background/50 rounded text-xs font-semibold"
                  >
                    <div className="space-y-1">
                      <span className="font-bold text-foreground line-clamp-1 font-serif">{sub.name}</span>
                      <span className="text-[10px] text-muted-foreground/60 font-typewriter">{sub.region}</span>
                    </div>
                    <Badge variant={sub.status === "APPROVED" ? "success" : "destructive"} className="font-typewriter text-[9px]">
                      {sub.status === "APPROVED" ? "APPROVED" : "REJECTED"}
                    </Badge>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>
      ) : (
        /* 등록 축제 신뢰도 강제 조정 탭 */
        <div className="space-y-6 animate-slide-up">
          <div className="bg-card border-2 border-border p-5 md:p-6 shadow-[4px_4px_0px_0px_hsl(var(--border))] rounded space-y-4">
            <div className="mb-2">
              <h3 className="text-sm font-extrabold text-foreground flex items-center space-x-1.5 font-serif">
                <TrendingUp size={15} className="text-primary shrink-0" />
                <span>데이터 신뢰지수 실시간 조정 ({festivals.length}건)</span>
              </h3>
            </div>

            <div className="space-y-4">
              {festivals.map((fest) => {
                const hasPendingScore = tempScores[fest.id] !== undefined && tempScores[fest.id] !== fest.trustScore;
                return (
                  <div 
                    key={fest.id}
                    className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 border border-border bg-background/40 rounded-sm gap-4 hover:border-primary/20 transition-all"
                  >
                    <div className="space-y-1 flex-1 text-xs font-semibold leading-relaxed">
                      <div className="flex items-center space-x-2 text-[10px] font-bold font-typewriter uppercase">
                        <span className="text-primary stamp-badge px-1.5 py-0.5">{fest.category}</span>
                        <span className="text-muted-foreground">{fest.region}</span>
                      </div>
                      <h4 className="font-extrabold text-foreground tracking-tight text-sm font-serif">
                        {fest.name}
                      </h4>
                      <span className="text-[10px] text-muted-foreground/60 font-bold block font-typewriter">
                        CURRENT TRUST INDEX: <span className="font-black text-primary">{fest.trustScore}%</span>
                      </span>
                    </div>

                    {/* 조작 필드 */}
                    <div className="flex items-center gap-3 w-full sm:w-auto border-t sm:border-t-0 border-border/40 pt-3.5 sm:pt-0">
                      <div className="flex items-center space-x-2 w-full sm:w-auto text-xs font-bold">
                        <span className="text-[10px] text-muted-foreground font-bold shrink-0 font-typewriter">NEW SCORE</span>
                        <Input
                          type="number"
                          placeholder={String(fest.trustScore)}
                          min="0"
                          max="100"
                          value={tempScores[fest.id] ?? ""}
                          onChange={(e) => handleScoreInputChange(fest.id, e.target.value)}
                          className="h-8 w-20 text-center text-xs px-1 bg-background border-border font-typewriter"
                        />
                      </div>
                      <button
                        disabled={loadingId !== null || !hasPendingScore}
                        className={`h-8 px-4 border text-xs font-bold shrink-0 cursor-pointer w-full sm:w-auto rounded ${
                          hasPendingScore 
                            ? "bg-primary border-primary text-primary-foreground shadow-[2px_2px_0px_0px_var(--color-primary)] active:translate-x-0.5 active:translate-y-0.5" 
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

