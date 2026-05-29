// src/lib/collectors/sync.ts
import { db } from "../db";
import { calculateTrustScore } from "../trust-score";
import { VisitKoreaCollector } from "./visitKoreaCollector";
import { NewsCollector } from "./newsCollector";
import { LocalGovernmentCollector } from "./localGovernmentCollector";
import { UserSubmissionCollector } from "./userSubmissionCollector";
import { CollectedFestival } from "./types";
import { isLikelyStockImage, isUsableUrl, normalizeCollectedFestival, normalizeRegion, normalizeUrl } from "./quality";
import { isValidDate, normalizeDateRange } from "@/lib/dates";
import { Festival, FestivalSource } from "@prisma/client";

export type ScrapedFestival = CollectedFestival & {
  sourceType: "LOCAL_GOV" | "NEWS" | "USER_SUBMIT" | "VISIT_KOREA";
};

export interface SyncReport {
  collectedCount: number;
  skippedCount: number;
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
  const sourceUrl = normalizeUrl(scraped.sourceUrl);
  if (sourceUrl && isSpecificSourceUrl(sourceUrl) && existing.sources.some((source) => normalizeUrl(source.url) === sourceUrl)) {
    return true;
  }

  const nameScore = getNameSimilarity(scraped.name, existing.name);
  const regionMatches = hasRegionOverlap(scraped.region, existing.region);
  const datesMatch = datesOverlapOrNear(scraped.startDate, scraped.endDate, existing.startDate, existing.endDate);

  if (nameScore >= 0.82 && datesMatch) return true;
  if (nameScore >= 0.68 && regionMatches && datesMatch) return true;

  return false;
}

function isSpecificSourceUrl(url: string) {
  try {
    const parsed = new URL(url);
    const path = parsed.pathname.replace(/\/+$/, "");

    if (parsed.hostname === "korean.visitkorea.or.kr" && path === "/main/fes_main.do") {
      return false;
    }

    return path.length > 1 || parsed.searchParams.size > 0;
  } catch {
    return false;
  }
}

function getStorageSourceUrl(festival: CollectedFestival) {
  const sourceUrl = normalizeUrl(festival.sourceUrl);
  if (sourceUrl && isSpecificSourceUrl(sourceUrl)) return sourceUrl;

  return normalizeUrl(festival.officialUrl) || sourceUrl;
}

function normalizeNameForMatch(value: string) {
  return value
    .toLowerCase()
    .replace(/20\d{2}/g, "")
    .replace(/제\s*\d+\s*회/g, "")
    .replace(/[()[\]{}'"]/g, "")
    .replace(/[·ㆍ]/g, "")
    .replace(/\s+/g, "")
    .replace(/축제|페스티벌|문화제|대축제|박람회|행사/g, "");
}

function getNameSimilarity(a: string, b: string) {
  const left = normalizeNameForMatch(a);
  const right = normalizeNameForMatch(b);

  if (!left || !right) return 0;
  if (left === right) return 1;
  if (left.includes(right) || right.includes(left)) {
    return Math.min(left.length, right.length) / Math.max(left.length, right.length);
  }

  const leftTokens = new Set(left.match(/[가-힣a-z0-9]{2,}/g) || [left]);
  const rightTokens = new Set(right.match(/[가-힣a-z0-9]{2,}/g) || [right]);
  const intersection = [...leftTokens].filter((token) => rightTokens.has(token)).length;
  const union = new Set([...leftTokens, ...rightTokens]).size;

  return union === 0 ? 0 : intersection / union;
}

function hasRegionOverlap(left: string, right: string) {
  const normalizedLeft = normalizeRegion(left);
  const normalizedRight = normalizeRegion(right);

  if (normalizedLeft === "전국" || normalizedRight === "전국") return false;
  return normalizedLeft.includes(normalizedRight) || normalizedRight.includes(normalizedLeft);
}

function datesOverlapOrNear(
  scrapedStart: Date,
  scrapedEnd: Date,
  existingStart: Date,
  existingEnd: Date,
) {
  const toleranceMs = 3 * 24 * 60 * 60 * 1000;
  const scrapedStartMs = scrapedStart.getTime() - toleranceMs;
  const scrapedEndMs = scrapedEnd.getTime() + toleranceMs;
  const existingStartMs = existingStart.getTime();
  const existingEndMs = existingEnd.getTime();

  return scrapedStartMs <= existingEndMs && scrapedEndMs >= existingStartMs;
}

function prepareScrapedFestival(item: ScrapedFestival): { item: ScrapedFestival | null; warnings: string[] } {
  const normalized = normalizeCollectedFestival(item) as ScrapedFestival;
  const dateRange = normalizeDateRange(normalized.startDate, normalized.endDate);
  const warnings: string[] = [];

  if (!normalized.name || normalized.name.length < 2) {
    return { item: null, warnings: ["축제명이 비어 있거나 너무 짧음"] };
  }

  if (!dateRange || !isValidDate(dateRange.startDate) || !isValidDate(dateRange.endDate)) {
    return { item: null, warnings: [`"${normalized.name}" 날짜가 유효하지 않음`] };
  }

  const sourceUrl = getStorageSourceUrl(normalized);
  if (!sourceUrl) {
    warnings.push(`"${normalized.name}" 출처 URL이 없어 신뢰도 감산`);
  } else if (!isSpecificSourceUrl(sourceUrl)) {
    warnings.push(`"${normalized.name}" 직접 상세 출처가 아닌 대표 URL만 확인됨`);
  }

  return {
    item: {
      ...normalized,
      startDate: dateRange.startDate,
      endDate: dateRange.endDate,
    },
    warnings,
  };
}

function buildTrustScoreInput(festival: CollectedFestival, sourceTypes: string[], sourceCount: number) {
  const sourceUrl = getStorageSourceUrl(festival);

  return {
    hasOfficialUrl: isUsableUrl(festival.officialUrl),
    sourceTypes,
    hasDate: isValidDate(festival.startDate) && isValidDate(festival.endDate),
    hasAddress: !!festival.address,
    hasParkingOrShuttle: festival.hasParking || festival.hasShuttle,
    hasUsableSourceUrl: !!sourceUrl && isSpecificSourceUrl(sourceUrl),
    sourceCount,
    hasDescription: !!festival.description,
    hasRealImage: !!festival.imageUrl && !isLikelyStockImage(festival.imageUrl),
  };
}

/**
 * 모든 Collector들을 구동하여 최신 데이터를 수집하고,
 * DB 내 기존 축제 목록과의 유사도를 비교하여 병합(Merge) 또는 자율 승인(Auto-Approval)을 적용합니다.
 */
export async function syncFestivals(): Promise<SyncReport> {
  console.log("[SyncEngine] 자율 수집 및 교차 검증 배치 엔진을 기동합니다.");
  
  const report: SyncReport = {
    collectedCount: 0,
    skippedCount: 0,
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
      return data.map(item => {
        const prepared = prepareScrapedFestival({
          ...item,
          sourceType: collector.sourceType
        });

        if (prepared.warnings.length > 0) {
          report.details.push(...prepared.warnings.map((warning) => `[품질 경고] ${warning}`));
        }

        if (!prepared.item) {
          report.skippedCount++;
          return null;
        }

        return prepared.item;
      }).filter((item): item is ScrapedFestival => item !== null);
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

  // 3. 기존 DB 데이터 로드 (중복 판정에 필요한 출처 포함)
  const existingFestivals = await db.festival.findMany({
    include: {
      sources: true
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
      const updatedImageUrl = (() => {
        // 새 수집 이미지가 비스톡 공식 이미지면 우선 채택
        if (scraped.imageUrl && !isLikelyStockImage(scraped.imageUrl)) return scraped.imageUrl;
        // 기존 이미지가 실제 이미지라면 유지
        if (matched.imageUrl && !isLikelyStockImage(matched.imageUrl)) return matched.imageUrl;
        return null;
      })();
      const updatedOfficialUrl = normalizeUrl(matched.officialUrl) || normalizeUrl(scraped.officialUrl) || null;
      
      const updatedParking = matched.hasParking || scraped.hasParking;
      const updatedShuttle = matched.hasShuttle || scraped.hasShuttle;
      const updatedPet = matched.isPetFriendly || scraped.isPetFriendly;
      const updatedChild = matched.isChildFriendly || scraped.isChildFriendly;

      // 출처 리스트 업데이트
      const normalizedScrapedSourceUrl = getStorageSourceUrl(scraped);
      const sourceExists = normalizedScrapedSourceUrl
        ? matched.sources.some(s => normalizeUrl(s.url) === normalizedScrapedSourceUrl)
        : false;
      if (normalizedScrapedSourceUrl && !sourceExists) {
        const createdSource = await db.festivalSource.create({
          data: {
            festivalId: matched.id,
            name: scraped.sourceName,
            url: normalizedScrapedSourceUrl,
            type: scraped.sourceType
          }
        });
        // 최신 리스트 동기화
        matched.sources.push(createdSource);
        console.log(`[SyncEngine] [출처 추가] ID: ${matched.id} 에 새로운 출처 (${scraped.sourceType}) 등록`);
      }

      // 신뢰도 점수 재연산
      const uniqueSourceTypes = Array.from(new Set(matched.sources.map(s => s.type)));
      const creditableSourceCount = matched.sources.filter((source) => {
        const url = normalizeUrl(source.url);
        return !!url && isSpecificSourceUrl(url);
      }).length;
      const trustScoreInput = buildTrustScoreInput({
        ...scraped,
        description: updatedDescription || undefined,
        officialUrl: updatedOfficialUrl || undefined,
        address: matched.address || scraped.address || undefined,
        imageUrl: updatedImageUrl || undefined,
        hasParking: updatedParking,
        hasShuttle: updatedShuttle,
        isPetFriendly: updatedPet,
        isChildFriendly: updatedChild,
      }, uniqueSourceTypes, creditableSourceCount);
      trustScoreInput.hasUsableSourceUrl = creditableSourceCount > 0;
      const newScore = calculateTrustScore(trustScoreInput);

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

      Object.assign(matched, {
        description: updatedDescription,
        imageUrl: updatedImageUrl,
        officialUrl: updatedOfficialUrl,
        hasParking: updatedParking,
        hasShuttle: updatedShuttle,
        isPetFriendly: updatedPet,
        isChildFriendly: updatedChild,
        trustScore: newScore,
        status: newStatus
      });

      report.mergedCount++;
    } else {
      // --- 케이스 B: 존재하지 않음 -> 신규 생성 및 신뢰도 판단 ---
      console.log(`[SyncEngine] [신규 발견] "${scraped.name}" 데이터 저장 절차 시작`);

      const normalizedScrapedSourceUrl = getStorageSourceUrl(scraped);
      const initialSourceTypes = [scraped.sourceType];
      const trustScore = calculateTrustScore(buildTrustScoreInput(scraped, initialSourceTypes, normalizedScrapedSourceUrl && isSpecificSourceUrl(normalizedScrapedSourceUrl) ? 1 : 0));

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
      const createdFestival = await db.$transaction(async (tx) => {
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

        const source = normalizedScrapedSourceUrl
          ? await tx.festivalSource.create({
              data: {
                festivalId: fest.id,
                name: scraped.sourceName,
                url: normalizedScrapedSourceUrl,
                type: scraped.sourceType
              }
            })
          : null;

        return { fest, source };
      });

      existingFestivals.push({
        ...createdFestival.fest,
        sources: createdFestival.source ? [createdFestival.source] : [],
      });
    }
  }

  console.log("[SyncEngine] 동기화 작업이 완전히 완료되었습니다.", report);
  return report;
}
