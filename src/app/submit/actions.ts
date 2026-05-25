// src/app/submit/actions.ts
"use server";

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";

export interface SubmissionFormData {
  name: string;
  description?: string;
  region: string;
  address?: string;
  dateRange: string; // 예: "2026-10-12 ~ 2026-10-14"
  category: "FOOD" | "CULTURE" | "ART" | "MUSIC" | "NATURE" | "OTHER";
  sourceUrl?: string;
  submitterEmail?: string;
  submitterContact?: string;
}

/**
 * 사용자가 제보한 축제 정보를 데이터베이스에 안전하게 기록합니다.
 */
export async function submitFestivalAction(formData: SubmissionFormData) {
  try {
    if (!formData.name || !formData.region || !formData.dateRange || !formData.category) {
      return { success: false, error: "필수 정보를 모두 입력해주세요." };
    }

    const submission = await db.userSubmission.create({
      data: {
        name: formData.name,
        description: formData.description || null,
        region: formData.region,
        address: formData.address || null,
        dateRange: formData.dateRange,
        category: formData.category,
        sourceUrl: formData.sourceUrl || null,
        submitterEmail: formData.submitterEmail || null,
        submitterContact: formData.submitterContact || null,
        status: "PENDING"
      }
    });

    console.log(`[SubmitAction] 신규 제보 수집 완료 (ID: ${submission.id})`);
    
    // 관리자 페이지에 캐시가 비워지도록 재검증 요청
    revalidatePath("/admin");

    return { success: true, id: submission.id };
  } catch (error) {
    console.error("[SubmitAction] 제보 DB 저장 실패:", error);
    return { success: false, error: "서버 저장 실패. 입력 값을 확인해주세요." };
  }
}
