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
      <div className="min-h-screen py-16 relative flex items-center justify-center bg-background">
        <div className="max-w-md w-full mx-auto bg-card border-2 border-border p-8 text-center space-y-6 shadow-[4px_4px_0px_0px_hsl(var(--border))] animate-slide-up relative z-10 rounded">
          <div className="h-16 w-16 rounded-full bg-accent/15 text-accent flex items-center justify-center mx-auto shadow-sm">
            <CheckCircle size={32} />
          </div>
          
          <div className="space-y-2">
            <h3 className="text-2xl font-extrabold text-foreground font-serif">제보가 우편함에 접수되었습니다!</h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              작성해 주신 소중한 우리 동네 축제 제보가 성공적으로 여행 검수 대장에 기입되었습니다. 출처 정보 대조 단계를 거쳐 기록 신뢰지수를 산출한 후 기록첩에 연동됩니다.
            </p>
          </div>

          <div className="border-t border-border/40 pt-4 flex flex-col gap-2">
            <Link href="/" className="w-full">
              <button className="w-full text-xs font-bold h-10 shadow-sm cursor-pointer press-button rounded bg-primary text-primary-foreground">
                기록첩 목록으로 돌아가기
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
              className="text-xs text-primary font-bold hover:underline cursor-pointer py-2 font-typewriter"
            >
              WRITE ANOTHER RECORD
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-10 relative bg-background">
      <div className="container mx-auto px-4 max-w-2xl relative z-10">
        
        {/* 상단 안내 */}
        <div className="text-center mb-10 space-y-3">
          <div className="inline-flex items-center space-x-1.5 px-3 py-1.5 border border-dashed border-primary/50 text-primary text-xs font-bold stamp-badge uppercase font-typewriter">
            <Compass size={12} className="text-primary animate-spin-slow" />
            <span>SUBMIT NEW RECORD</span>
          </div>
          <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight text-foreground font-serif">
            새로운 동네축제 제보하기
          </h2>
          <p className="text-xs text-muted-foreground max-w-md mx-auto font-medium leading-relaxed">
            아지랑이처럼 피어오르는 작고 아늑한 동네 플리마켓, 골목 버스킹, 이웃들의 소소한 장터 소식이 있다면 정성껏 제보해 주세요. 탐험대 검수 대장을 거쳐 기록첩에 등재됩니다.
          </p>
        </div>

        {/* 제보 폼 카드 - 엽서/편지지 감성 */}
        <div className="bg-card border-2 border-border shadow-[4px_4px_0px_0px_hsl(var(--border))] rounded p-6 md:p-8 space-y-6 relative overflow-hidden">
          <div className="border-b border-dashed border-border pb-4 mb-4">
            <h4 className="text-xs flex items-center space-x-1.5 font-extrabold text-foreground uppercase font-typewriter">
              <FileText size={15} className="text-primary shrink-0" />
              <span>MEMOIRE DE VOYAGE / 제보장</span>
            </h4>
          </div>
          
          <div>
            <form onSubmit={handleSubmit} className="space-y-5 text-sm font-semibold">
              
              {/* 축제 이름 */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-muted-foreground flex items-center space-x-1">
                  <span>행사/축제 명칭</span>
                  <span className="text-primary font-bold">*</span>
                </label>
                <Input
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  placeholder="예: 영산포 홍어·한우축제, 성북동 플리마켓 등"
                  className="bg-background/40 border-border"
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* 개최 지역 */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-muted-foreground flex items-center space-x-1">
                    <MapPin size={13} className="text-primary/70" />
                    <span>개최 행정지역</span>
                    <span className="text-primary font-bold">*</span>
                  </label>
                  <Input
                    value={formData.region}
                    onChange={(e) => setFormData({...formData, region: e.target.value})}
                    placeholder="예: 전남 나주시, 서울 성북구"
                    className="bg-background/40 border-border"
                    required
                  />
                </div>

                {/* 카테고리 */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-muted-foreground flex items-center space-x-1">
                    <Compass size={13} className="text-primary/70" />
                    <span>축제 카테고리</span>
                    <span className="text-primary font-bold">*</span>
                  </label>
                  <Select
                    value={formData.category}
                    onChange={(e) => setFormData({...formData, category: e.target.value as "FOOD" | "CULTURE" | "ART" | "MUSIC" | "NATURE" | "OTHER"})}
                    className="bg-background/40 border-border font-serif text-xs font-bold"
                  >
                    <option value="FOOD">🍣 먹거리 축제</option>
                    <option value="NATURE">🌸 자연/경관</option>
                    <option value="CULTURE">🏛️ 전통/문화</option>
                    <option value="ART">🎨 전시/예술</option>
                    <option value="MUSIC">🎵 공연/음악</option>
                    <option value="OTHER">🪁 기타 행사</option>
                  </Select>
                </div>
              </div>

              {/* 상세 주소 */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-muted-foreground">상세 주소 (선택)</label>
                <Input
                  value={formData.address}
                  onChange={(e) => setFormData({...formData, address: e.target.value})}
                  placeholder="예: 영산강 둔치체육공원 야외광장, 나주평야 일원"
                  className="bg-background/40 border-border"
                />
              </div>

              {/* 축제 기간 */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-muted-foreground flex items-center space-x-1">
                  <Calendar size={13} className="text-primary/70" />
                  <span>행사 개최 기간</span>
                  <span className="text-primary font-bold">*</span>
                </label>
                <Input
                  value={formData.dateRange}
                  onChange={(e) => setFormData({...formData, dateRange: e.target.value})}
                  placeholder="예: 2026-10-12 ~ 2026-10-14 (형식 준수)"
                  className="bg-background/40 border-border font-typewriter"
                  required
                />
              </div>

              {/* 상세 소개 */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-muted-foreground">행사 소개 내용</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  placeholder="축제의 핵심 프로그램과 로컬 장터 이야기들을 간략히 남겨주세요."
                  className="flex min-h-[100px] w-full rounded border border-border bg-background/40 px-4 py-2.5 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary/45 focus-visible:border-primary disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-200"
                />
              </div>

              {/* 참고 출처 URL */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-muted-foreground flex items-center space-x-1">
                  <span>교차 확인용 URL 출처</span>
                  <span title="블로그 소식, 지자체 공문, 현지 뉴스 URL 등을 첨부해주시면 신뢰지수가 더 높게 계산되어 신속히 반영됩니다.">
                    <Info size={11} className="text-muted-foreground/60 cursor-help" />
                  </span>
                </label>
                <Input
                  value={formData.sourceUrl}
                  onChange={(e) => setFormData({...formData, sourceUrl: e.target.value})}
                  placeholder="예: https://www.naju.go.kr/news/123"
                  className="bg-background/40 border-border"
                />
              </div>

              {/* 제보자 연락망 */}
              <div className="border-t border-dashed border-border pt-4 space-y-4">
                <span className="text-[10px] font-bold text-muted-foreground/80 font-typewriter block uppercase">SUBMITTER INFO / 제보자 통신망 (선택)</span>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[11px] text-muted-foreground">이메일 주소</label>
                    <Input
                      type="email"
                      value={formData.submitterEmail}
                      onChange={(e) => setFormData({...formData, submitterEmail: e.target.value})}
                      placeholder="local_expert@daum.net"
                      className="bg-background/40 border-border"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[11px] text-muted-foreground">전화번호</label>
                    <Input
                      type="tel"
                      value={formData.submitterContact}
                      onChange={(e) => setFormData({...formData, submitterContact: e.target.value})}
                      placeholder="010-XXXX-XXXX"
                      className="bg-background/40 border-border font-typewriter"
                    />
                  </div>
                </div>
              </div>

              {/* 오류 안내 */}
              {errorMsg && (
                <div className="p-3.5 rounded border border-primary/20 bg-primary/5 text-primary font-bold text-xs">
                  ⚠️ {errorMsg}
                </div>
              )}

              {/* 제출 버튼 */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full font-bold flex items-center justify-center space-x-1.5 h-11 bg-primary text-primary-foreground border border-primary hover:bg-primary/95 transition-all shadow-[3px_3px_0px_0px_var(--color-primary)] active:translate-x-0.5 active:translate-y-0.5 cursor-pointer rounded"
              >
                <Send size={14} className="shrink-0" />
                <span>{isLoading ? "기록 전송 중..." : "동네축제 제보서 제출하기"}</span>
              </button>

            </form>
          </div>
        </div>

      </div>
    </div>
  );
}
