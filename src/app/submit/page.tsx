// src/app/submit/page.tsx
"use client";

import { useState } from "react";
import Link from "next/link";
import { 
  Compass, 
  MapPin, 
  Calendar, 
  Info, 
  Send, 
  CheckCircle,
  FileText
} from "lucide-react";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { submitFestivalAction } from "./actions";

export default function SubmitFestivalPage() {
  const [formData, setFormData] = useState<{
    name: string;
    description: string;
    region: string;
    address: string;
    dateRange: string;
    category: "FOOD" | "CULTURE" | "ART" | "MUSIC" | "NATURE" | "OTHER";
    sourceUrl: string;
    submitterEmail: string;
    submitterContact: string;
  }>({
    name: "",
    description: "",
    region: "",
    address: "",
    dateRange: "",
    category: "FOOD",
    sourceUrl: "",
    submitterEmail: "",
    submitterContact: ""
  });

  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");

    // 유효성 검사
    if (!formData.name.trim()) return setErrorMsg("축제명을 입력해 주세요.");
    if (!formData.region.trim()) return setErrorMsg("개최 지역(예: 전남 나주시)을 입력해 주세요.");
    if (!formData.dateRange.trim()) return setErrorMsg("기간(예: 2026-10-12 ~ 2026-10-14)을 입력해 주세요.");
    if (!formData.category) return setErrorMsg("카테고리를 선택해 주세요.");

    setIsLoading(true);
    
    try {
      const res = await submitFestivalAction(formData);
      if (res.success) {
        setIsSuccess(true);
      } else {
        setErrorMsg(res.error || "제보 저장 중 오류가 발생했습니다.");
      }
    } catch (err) {
      console.error(err);
      setErrorMsg("인터넷 연결을 확인하고 다시 시도해 주세요.");
    } finally {
      setIsLoading(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="relative flex min-h-screen items-center justify-center bg-background px-4 py-16">
        <div className="relative z-10 mx-auto w-full max-w-md space-y-6 rounded-lg border border-border bg-card p-8 text-center shadow-sm">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-lg bg-accent/15 text-accent">
            <CheckCircle size={32} />
          </div>
          
          <div className="space-y-2">
            <h3 className="text-2xl font-bold text-foreground">제보가 접수되었습니다</h3>
            <p className="text-sm leading-6 text-muted-foreground">
              보내주신 내용은 출처 확인 후 목록에 반영됩니다.
            </p>
          </div>

          <div className="flex flex-col gap-2 border-t border-border/40 pt-4">
            <Link href="/" className="w-full">
              <button className="press-button h-11 w-full cursor-pointer rounded-lg text-sm font-semibold">
                목록으로 돌아가기
              </button>
            </Link>
            <button 
              onClick={() => {
                setIsSuccess(false);
                setFormData({
                  name: "",
                  description: "",
                  region: "",
                  address: "",
                  dateRange: "",
                  category: "FOOD",
                  sourceUrl: "",
                  submitterEmail: "",
                  submitterContact: ""
                });
              }}
              className="cursor-pointer py-2 text-sm font-medium text-primary hover:underline"
            >
              다른 축제 제보하기
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-background py-10">
      <div className="container relative z-10 mx-auto max-w-2xl px-4">
        <div className="mb-8 space-y-3 text-center">
          <div className="inline-flex items-center space-x-1.5 rounded-lg border border-primary/20 bg-primary/10 px-3 py-1.5 text-xs font-semibold text-primary">
            <Compass size={12} className="shrink-0" />
            <span>축제 제보</span>
          </div>
          <h2 className="text-2xl font-bold tracking-normal text-foreground md:text-3xl">
            새로운 동네축제 제보하기
          </h2>
          <p className="mx-auto max-w-md text-sm font-medium leading-6 text-muted-foreground">
            목록에 없는 지역 행사나 축제가 있다면 알려주세요. 확인 가능한 출처가 있으면 더 빠르게 반영됩니다.
          </p>
        </div>

        <div className="relative space-y-6 overflow-hidden rounded-lg border border-border bg-card p-6 shadow-sm md:p-8">
          <div className="mb-4 border-b border-border pb-4">
            <h4 className="flex items-center space-x-1.5 text-sm font-semibold text-foreground">
              <FileText size={15} className="text-primary shrink-0" />
              <span>제보 내용</span>
            </h4>
          </div>
          
          <div>
            <form onSubmit={handleSubmit} className="space-y-5 text-sm font-medium">
              <div className="space-y-1.5">
                <label className="flex items-center space-x-1 text-sm font-medium text-muted-foreground">
                  <span>행사/축제 명칭</span>
                  <span className="text-primary font-bold">*</span>
                </label>
                <Input
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  placeholder="예: 영산포 홍어·한우축제, 성북동 플리마켓 등"
                  className="border-border bg-background"
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="flex items-center space-x-1 text-sm font-medium text-muted-foreground">
                    <MapPin size={13} className="text-primary/70" />
                    <span>개최 행정지역</span>
                    <span className="text-primary font-bold">*</span>
                  </label>
                  <Input
                    value={formData.region}
                    onChange={(e) => setFormData({...formData, region: e.target.value})}
                    placeholder="예: 전남 나주시, 서울 성북구"
                    className="border-border bg-background"
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="flex items-center space-x-1 text-sm font-medium text-muted-foreground">
                    <Compass size={13} className="text-primary/70" />
                    <span>축제 카테고리</span>
                    <span className="text-primary font-bold">*</span>
                  </label>
                  <Select
                    value={formData.category}
                    onChange={(e) => setFormData({...formData, category: e.target.value as "FOOD" | "CULTURE" | "ART" | "MUSIC" | "NATURE" | "OTHER"})}
                    className="border-border bg-background text-sm font-medium"
                  >
                    <option value="FOOD">먹거리 축제</option>
                    <option value="NATURE">자연/경관</option>
                    <option value="CULTURE">전통/문화</option>
                    <option value="ART">전시/예술</option>
                    <option value="MUSIC">공연/음악</option>
                    <option value="OTHER">기타 행사</option>
                  </Select>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-medium text-muted-foreground">상세 주소 (선택)</label>
                <Input
                  value={formData.address}
                  onChange={(e) => setFormData({...formData, address: e.target.value})}
                  placeholder="예: 영산강 둔치체육공원 야외광장, 나주평야 일원"
                  className="border-border bg-background"
                />
              </div>

              <div className="space-y-1.5">
                <label className="flex items-center space-x-1 text-sm font-medium text-muted-foreground">
                  <Calendar size={13} className="text-primary/70" />
                  <span>행사 개최 기간</span>
                  <span className="text-primary font-bold">*</span>
                </label>
                <Input
                  value={formData.dateRange}
                  onChange={(e) => setFormData({...formData, dateRange: e.target.value})}
                  placeholder="예: 2026-10-12 ~ 2026-10-14 (형식 준수)"
                  className="border-border bg-background"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-medium text-muted-foreground">행사 소개 내용</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  placeholder="축제의 핵심 프로그램과 로컬 장터 이야기들을 간략히 남겨주세요."
                  className="flex min-h-[112px] w-full rounded-lg border border-border bg-background px-4 py-3 text-sm ring-offset-background transition-colors placeholder:text-muted-foreground focus-visible:border-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/20 disabled:cursor-not-allowed disabled:opacity-50"
                />
              </div>

              <div className="space-y-1.5">
                <label className="flex items-center space-x-1 text-sm font-medium text-muted-foreground">
                  <span>확인 가능한 URL</span>
                  <span title="블로그 소식, 지자체 공문, 현지 뉴스 URL 등을 첨부해주시면 신뢰지수가 더 높게 계산되어 신속히 반영됩니다.">
                    <Info size={11} className="text-muted-foreground/60 cursor-help" />
                  </span>
                </label>
                <Input
                  value={formData.sourceUrl}
                  onChange={(e) => setFormData({...formData, sourceUrl: e.target.value})}
                  placeholder="예: https://www.naju.go.kr/news/123"
                  className="border-border bg-background"
                />
              </div>

              <div className="space-y-4 border-t border-border pt-4">
                <span className="block text-sm font-semibold text-foreground">제보자 연락처 (선택)</span>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-sm text-muted-foreground">이메일 주소</label>
                    <Input
                      type="email"
                      value={formData.submitterEmail}
                      onChange={(e) => setFormData({...formData, submitterEmail: e.target.value})}
                      placeholder="local_expert@daum.net"
                      className="border-border bg-background"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-sm text-muted-foreground">전화번호</label>
                    <Input
                      type="tel"
                      value={formData.submitterContact}
                      onChange={(e) => setFormData({...formData, submitterContact: e.target.value})}
                      placeholder="010-XXXX-XXXX"
                      className="border-border bg-background"
                    />
                  </div>
                </div>
              </div>

              {errorMsg && (
                <div className="rounded-lg border border-destructive/20 bg-destructive/5 p-3.5 text-sm font-medium text-destructive">
                  {errorMsg}
                </div>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className="flex h-11 w-full cursor-pointer items-center justify-center space-x-1.5 rounded-lg border border-primary bg-primary font-semibold text-primary-foreground shadow-sm transition-colors hover:bg-primary/92 disabled:cursor-not-allowed disabled:opacity-60"
              >
                <Send size={14} className="shrink-0" />
                <span>{isLoading ? "저장 중..." : "제보 제출"}</span>
              </button>

            </form>
          </div>
        </div>

      </div>
    </div>
  );
}
