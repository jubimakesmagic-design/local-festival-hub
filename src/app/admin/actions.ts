// src/app/admin/actions.ts
"use server";

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { calculateTrustScore } from "@/lib/trust-score";
import { syncFestivals } from "@/lib/collectors/sync";

/**
 * 1. 사용자 제보 건을 정식 승인하여 Festival 테이블로 마이그레이션 생성합니다.
 */
export async function approveSubmissionAction(submissionId: number, customScore?: number) {
  try {
    // 제보서 조회
    const submission = await db.userSubmission.findUnique({
      where: { id: submissionId }
    });

    if (!submission) {
      return { success: false, error: "존재하지 않는 제보 건입니다." };
    }

    if (submission.status !== "PENDING") {
      return { success: false, error: "이미 처리가 완료된 제보서입니다." };
    }

    // 일시 문자열 파싱 ("2026-10-12 ~ 2026-10-14")
    let startDate = new Date();
    let endDate = new Date();
    if (submission.dateRange && submission.dateRange.includes("~")) {
      const parts = submission.dateRange.split("~").map(p => p.trim());
      if (parts[0]) startDate = new Date(parts[0]);
      if (parts[1]) endDate = new Date(parts[1]);
    }

    // 신뢰도 알고리즘 연동 자동 계산 (수동 입력 값이 없는 경우 적용)
    let calculatedScore = customScore;
    if (calculatedScore === undefined || calculatedScore === null) {
      calculatedScore = calculateTrustScore({
        hasOfficialUrl: !!submission.sourceUrl,
        sourceTypes: ["USER_SUBMIT"],
        hasDate: !!submission.dateRange,
        hasAddress: !!submission.address,
        hasParkingOrShuttle: false
      });
    }

    // 트랜잭션 단위로 Festival 생성 및 제보 상태 업데이트 진행
    const result = await db.$transaction(async (tx) => {
      // (1) Festival 생성
      const festival = await tx.festival.create({
        data: {
          name: submission.name,
          description: submission.description,
          region: submission.region,
          address: submission.address,
          startDate,
          endDate,
          category: submission.category,
          officialUrl: submission.sourceUrl || null,
          trustScore: calculatedScore,
          status: "VERIFIED", // 즉시 검증 배포
          views: 0
        }
      });

      // (2) 출처 링크 등록
      if (submission.sourceUrl) {
        await tx.festivalSource.create({
          data: {
            festivalId: festival.id,
            name: `${submission.submitterEmail || "익명 제보자"} 제보 출처`,
            url: submission.sourceUrl,
            type: "USER_SUBMIT"
          }
        });
      }

      // (3) 제보 상태 변경
      await tx.userSubmission.update({
        where: { id: submissionId },
        data: { status: "APPROVED" }
      });

      return festival;
    });

    console.log(`[AdminAction] 제보 승인 및 축제 신규 마이그레이션 완료 (Festival ID: ${result.id})`);
    
    // 캐시 전체 재검증
    revalidatePath("/");
    revalidatePath("/admin");
    
    return { success: true, festivalId: result.id };
  } catch (error) {
    console.error("[AdminAction] 제보 승인 처리 오류:", error);
    return { success: false, error: "승인 처리 중 서버 내부 오류가 발생했습니다." };
  }
}

/**
 * 2. 사용자 제보 건을 반려(거절) 처리합니다.
 */
export async function rejectSubmissionAction(submissionId: number) {
  try {
    const submission = await db.userSubmission.update({
      where: { id: submissionId },
      data: { status: "REJECTED" }
    });

    console.log(`[AdminAction] 제보 반려 처리 완료 (ID: ${submission.id})`);

    revalidatePath("/admin");
    return { success: true };
  } catch (error) {
    console.error("[AdminAction] 제보 반려 오류:", error);
    return { success: false, error: "반려 처리 중 서버 내부 오류가 발생했습니다." };
  }
}

/**
 * 3. 정식 등록된 축제의 신뢰도 점수를 관리자가 강제로 조정합니다.
 */
export async function adjustFestivalScoreAction(festivalId: number, newScore: number) {
  try {
    if (newScore < 0 || newScore > 100) {
      return { success: false, error: "점수는 0점에서 100점 사이여야 합니다." };
    }

    const festival = await db.festival.update({
      where: { id: festivalId },
      data: { trustScore: newScore }
    });

    console.log(`[AdminAction] 축제 신뢰도 점수 수동 조정 완료 (ID: ${festival.id}, 점수: ${newScore}점)`);

    revalidatePath("/");
    revalidatePath(`/festivals/${festivalId}`);
    revalidatePath("/admin");

    return { success: true };
  } catch (error) {
    console.error("[AdminAction] 신뢰도 점수 조정 오류:", error);
    return { success: false, error: "점수 조정 처리 중 오류가 발생했습니다." };
  }
}

/**
 * 4. 공공 API 및 외부 소스에서 축제를 자동 크롤링하고 자율 검증 및 중복 병합을 실행합니다.
 */
export async function runAutomatedSyncAction() {
  try {
    const report = await syncFestivals();
    
    // 페이지 캐시 갱신
    revalidatePath("/");
    revalidatePath("/admin");
    
    return { success: true, report };
  } catch (error) {
    console.error("[AdminAction] 자동 수집 및 자율 검증 오류:", error);
    return { success: false, error: "자동 수집 과정 중 서버 오류가 발생했습니다." };
  }
}
