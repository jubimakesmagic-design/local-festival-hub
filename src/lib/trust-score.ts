// lib/trust-score.ts

export interface TrustScoreParams {
  hasOfficialUrl: boolean;
  sourceTypes: string[]; // LOCAL_GOV, NEWS, USER_SUBMIT, VISIT_KOREA
  hasDate: boolean;
  hasAddress: boolean;
  hasParkingOrShuttle: boolean;
}

/**
 * 축제 정보의 신뢰도 점수를 계산합니다. (0 ~ 100점)
 * 
 * [점수 로직]
 * - 기본 50점 시작
 * - 가산:
 *   - 공식 URL 있음: +20
 *   - 지자체/문화재단 출처 포함: +15
 *   - 뉴스 출처 포함: +10
 *   - 날짜 명확: +10
 *   - 주소 명확(지번/도로명): +5
 *   - 주차/셔틀 버스 정보 있음: +5
 * - 감산:
 *   - 사용자 제보로만 구성됨: -15
 *   - 공식 URL 없음: -10
 *   - 날짜 불명확: -20
 *   - 출처 URL 없음: -20
 */
export function calculateTrustScore(params: TrustScoreParams): number {
  let score = 50;

  // --- 가산 조건 ---
  if (params.hasOfficialUrl) {
    score += 20;
  }
  
  if (params.sourceTypes.includes("LOCAL_GOV") || params.sourceTypes.includes("VISIT_KOREA")) {
    score += 15;
  }
  
  if (params.sourceTypes.includes("NEWS")) {
    score += 10;
  }
  
  if (params.hasDate) {
    score += 10;
  }
  
  if (params.hasAddress) {
    score += 5;
  }
  
  if (params.hasParkingOrShuttle) {
    score += 5;
  }

  // --- 감산 조건 ---
  const isOnlyUserSubmitted = params.sourceTypes.length === 1 && params.sourceTypes[0] === "USER_SUBMIT";
  if (isOnlyUserSubmitted) {
    score -= 15;
  }

  if (!params.hasOfficialUrl) {
    score -= 10;
  }

  if (!params.hasDate) {
    score -= 20;
  }

  if (params.sourceTypes.length === 0) {
    score -= 20;
  }

  // 0~100 사이로 클램프
  return Math.max(0, Math.min(100, score));
}
