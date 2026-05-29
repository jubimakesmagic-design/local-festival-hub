// lib/collectors/userSubmissionCollector.ts
import { FestivalCollector, CollectedFestival, CollectParams } from "./types";
import { db } from "../db";
import { parseDateRangeInput } from "@/lib/dates";
import { normalizeCollectedFestival } from "./quality";

export class UserSubmissionCollector implements FestivalCollector {
  sourceName = "사용자 다이렉트 제보 및 검수망";
  sourceType = "USER_SUBMIT" as const;

  async collect(params: CollectParams): Promise<CollectedFestival[]> {
    console.log(`[UserSubmissionCollector] 데이터 수집 시작 (조건: ${JSON.stringify(params)})`);

    // 이 수집기는 실제 DB의 UserSubmission 테이블에서 승인(APPROVED)된 건들을 가져오는 것을 모사하거나
    // 아직 승인되지 않고 검수 대기 중인 목록 중 실시간 동기화 테스트용 데이터를 반환합니다.
    try {
      const submissions = await db.userSubmission.findMany({
        where: {
          status: "APPROVED"
        }
      });

      return submissions.flatMap(sub => {
        const parsedRange = parseDateRangeInput(sub.dateRange);

        if (!parsedRange) {
          console.warn(`[UserSubmissionCollector] 날짜 형식이 잘못되어 제외: ${sub.name}`);
          return [];
        }

        return normalizeCollectedFestival({
          name: sub.name,
          description: sub.description || undefined,
          region: sub.region,
          address: sub.address || undefined,
          startDate: parsedRange.startDate,
          endDate: parsedRange.endDate,
          category: (sub.category as "FOOD" | "CULTURE" | "ART" | "MUSIC" | "NATURE" | "OTHER") || "OTHER",
          officialUrl: sub.sourceUrl || undefined,
          hasParking: false,
          hasShuttle: false,
          isPetFriendly: true,
          isChildFriendly: true,
          sourceName: `${sub.submitterEmail || "익명 제보자"} 제보`,
          sourceUrl: sub.sourceUrl || ""
        });
      });
    } catch (e) {
      console.error("[UserSubmissionCollector] DB 조회 에러 (폴백 모드 전환)", e);
      return [];
    }
  }
}
