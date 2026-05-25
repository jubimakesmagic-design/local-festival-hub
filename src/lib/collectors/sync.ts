// src/lib/collectors/sync.ts
import { db } from "../db";
import { calculateTrustScore } from "../trust-score";
import { VisitKoreaCollector } from "./visitKoreaCollector";
import { NewsCollector } from "./newsCollector";
import { LocalGovernmentCollector } from "./localGovernmentCollector";
import { UserSubmissionCollector } from "./userSubmissionCollector";
import { CollectedFestival } from "./types";
import { isLikelyStockImage, isUsableUrl, normalizeCollectedFestival } from "./quality";
import { Festival, FestivalSource } from "@prisma/client";

export type ScrapedFestival = CollectedFestival & {
  sourceType: "LOCAL_GOV" | "NEWS" | "USER_SUBMIT" | "VISIT_KOREA";
};

export interface SyncReport {
  collectedCount: number;
  mergedCount: number;
  createdVerifiedCount: number;
  createdReviewCount: number;
  details: string[];
}

type ExistingFestival = Festival & {
  sources: FestivalSource[];
};

/**
 * 두 축제가 동일한 축제인지 유사도를 판단하는 헬퍼 함수
 */
function isDuplicate(scraped: CollectedFestival, existing: ExistingFestival): boolean {
  // 1. 이름 정규화 및 유사성 판단 (공백 및 특수문자 제거 후 상호 포함 여부)
  const normExistingName = existing.name.replace(/[\s\-_]+/g, "").toLowerCase();
  const normScrapedName = scraped.name.replace(/[\s\-_]+/g, "").toLowerCase();
  const nameMatches = normExistingName.includes(normScrapedName) || normScrapedName.includes(normExistingName);

  // 2. 시작일 일치 여부
  const existingStart = new Date(existing.startDate).toDateString();
  const scrapedStart = new Date(scraped.startDate).toDateString();
  const sameStart = existingStart === scrapedStart;

  // 3. 지역 오버랩 여부 (예: "전남 나주시" 와 "전남 나주시 영산동" 등 상호 매칭)
  const regionOverlap = 
    existing.region.includes(scraped.region) || 
    scraped.region.includes(existing.region);

  // 날짜가 같으면서 이름이 유사하거나, 날짜와 지역이 일치하는 경우 동일 축제로 판정
  if (sameStart && (nameMatches || regionOverlap)) {
    return true;
  }

  return false;
}

/**
 * 모든 Collector들을 구동하여 최신 데이터를 수집하고,
 * DB 내 기존 축제 목록과의 유사도를 비교하여 병합(Merge) 또는 자율 승인(Auto-Approval)을 적용합니다.
 */
export async function syncFestivals(): Promise<SyncReport> {
  console.log("[SyncEngine] 자율 수집 및 교차 검증 배치 엔진을 기동합니다.");
  
  const report: SyncReport = {
    collectedCount: 0,
    mergedCount: 0,
    createdVerifiedCount: 0,
    createdReviewCount: 0,
    details: []
  };

  // 1. 수집기 인스턴스화
  const collectors = [
    new VisitKoreaCollector(),
    new NewsCollector(),
    new LocalGovernmentCollector(),
    new UserSubmissionCollector()
  ];

  // 2. 외부 데이터 일괄 수집
  const collectedBySource = await Promise.all(collectors.map(async (collector) => {
    try {
      const data = await collector.collect({});
      console.log(`[SyncEngine] [${collector.sourceName}] 수집 성공 - ${data.length}건`);
      return data.map(item => ({
        ...normalizeCollectedFestival(item),
        sourceType: collector.sourceType
      }));
    } catch (error) {
      console.error(`[SyncEngine] [${collector.sourceName}] 수집 중 에러 발생:`, error);
      report.details.push(`[수집 에러] ${collector.sourceName} 호출 실패`);
      return [];
    }
  }));

  const allCollected: ScrapedFestival[] = collectedBySource.flat();

  report.collectedCount = allCollected.length;

  if (allCollected.length === 0) {
    report.details.push("수집된 축제 데이터가 없어 동기화 작업을 조기 종료합니다.");
    return report;
  }

  // 3. 기존 DB 데이터 로드 (출처 및 프로그램 포함)
  const existingFestivals = await db.festival.findMany({
    include: {
      sources: true,
      programs: true
    }
  });

  // 4. 순차적 병합 및 가공 처리
  for (const scraped of allCollected) {
    const matched = existingFestivals.find(existing => isDuplicate(scraped, existing));

    if (matched) {
      // --- 케이스 A: 이미 존재함 -> 데이터 병합(Merge) 및 신뢰도 가산 ---
      console.log(`[SyncEngine] [병합 대상 발견] "${scraped.name}" -> 기존 ID: ${matched.id} ("${matched.name}")`);
      
      // 누락된 필드 보완 (데이터 풍부화)
      const updatedDescription = matched.description || scraped.description || null;
      const updatedImageUrl = (!matched.imageUrl || isLikelyStockImage(matched.imageUrl)) ? (scraped.imageUrl || matched.imageUrl || null) : matched.imageUrl;
      const updatedOfficialUrl = isUsableUrl(matched.officialUrl) ? matched.officialUrl : (scraped.officialUrl || null);
      
      const updatedParking = matched.hasParking || scraped.hasParking;
      const updatedShuttle = matched.hasShuttle || scraped.hasShuttle;
      const updatedPet = matched.isPetFriendly || scraped.isPetFriendly;
      const updatedChild = matched.isChildFriendly || scraped.isChildFriendly;

      // 출처 리스트 업데이트
      const sourceExists = matched.sources.some(s => s.url === scraped.sourceUrl);
      if (!sourceExists) {
        await db.festivalSource.create({
          data: {
            festivalId: matched.id,
            name: scraped.sourceName,
            url: scraped.sourceUrl,
            type: scraped.sourceType
          }
        });
        // 최신 리스트 동기화
        matched.sources.push({
          id: 0,
          festivalId: matched.id,
          name: scraped.sourceName,
          url: scraped.sourceUrl,
          type: scraped.sourceType
        });
        console.log(`[SyncEngine] [출처 추가] ID: ${matched.id} 에 새로운 출처 (${scraped.sourceType}) 등록`);
      }

      // 신뢰도 점수 재연산
      const uniqueSourceTypes = Array.from(new Set(matched.sources.map(s => s.type)));
      const newScore = calculateTrustScore({
        hasOfficialUrl: !!updatedOfficialUrl,
        sourceTypes: uniqueSourceTypes,
        hasDate: true,
        hasAddress: !!(matched.address || scraped.address),
        hasParkingOrShuttle: updatedParking || updatedShuttle
      });

      const oldScore = matched.trustScore;
      let newStatus = matched.status;

      // 70점 돌파 시 자동 승인 승격
      if (newScore >= 70 && matched.status === "NEEDS_REVIEW") {
        newStatus = "VERIFIED";
        report.details.push(`[자동 승인 승격] "${matched.name}" (신뢰도 점수: ${oldScore}점 ➡️ ${newScore}점으로 상승, 70점 이상 자동 승인)`);
      } else {
        report.details.push(`[데이터 병합] "${matched.name}" (신뢰도 점수: ${oldScore}점 ➡️ ${newScore}점 반영)`);
      }

      // DB 업데이트 적용
      await db.festival.update({
        where: { id: matched.id },
        data: {
          description: updatedDescription,
          imageUrl: updatedImageUrl,
          officialUrl: updatedOfficialUrl,
          hasParking: updatedParking,
          hasShuttle: updatedShuttle,
          isPetFriendly: updatedPet,
          isChildFriendly: updatedChild,
          trustScore: newScore,
          status: newStatus
        }
      });

      report.mergedCount++;
    } else {
      // --- 케이스 B: 존재하지 않음 -> 신규 생성 및 신뢰도 판단 ---
      console.log(`[SyncEngine] [신규 발견] "${scraped.name}" 데이터 저장 절차 시작`);

      const initialSourceTypes = [scraped.sourceType];
      const trustScore = calculateTrustScore({
        hasOfficialUrl: !!scraped.officialUrl,
        sourceTypes: initialSourceTypes,
        hasDate: true,
        hasAddress: !!scraped.address,
        hasParkingOrShuttle: scraped.hasParking || scraped.hasShuttle
      });

      // 자율 검증 필터링 (70점 이상 즉시 배포, 미만 시 검수 대기함)
      const status = trustScore >= 70 ? "VERIFIED" : "NEEDS_REVIEW";

      if (status === "VERIFIED") {
        report.createdVerifiedCount++;
        report.details.push(`[자율 검증 승인] 신규 축제 "${scraped.name}" 자동 등록 (점수: ${trustScore}점, 즉시 노출)`);
      } else {
        report.createdReviewCount++;
        report.details.push(`[검수 보류 등록] 신규 축제 "${scraped.name}" 등록 (점수: ${trustScore}점, 관리자 검수 대기)`);
      }

      // 신규 페스티벌 및 출처 등록 트랜잭션 실행
      await db.$transaction(async (tx) => {
        const fest = await tx.festival.create({
          data: {
            name: scraped.name,
            description: scraped.description || null,
            region: scraped.region,
            address: scraped.address || null,
            startDate: scraped.startDate,
            endDate: scraped.endDate,
            category: scraped.category,
            officialUrl: scraped.officialUrl || null,
            imageUrl: scraped.imageUrl || null,
            hasParking: scraped.hasParking,
            hasShuttle: scraped.hasShuttle,
            isPetFriendly: scraped.isPetFriendly,
            isChildFriendly: scraped.isChildFriendly,
            trustScore: trustScore,
            status: status
          }
        });

        await tx.festivalSource.create({
          data: {
            festivalId: fest.id,
            name: scraped.sourceName,
            url: scraped.sourceUrl,
            type: scraped.sourceType
          }
        });
      });
    }
  }

  console.log("[SyncEngine] 동기화 작업이 완전히 완료되었습니다.", report);
  return report;
}
