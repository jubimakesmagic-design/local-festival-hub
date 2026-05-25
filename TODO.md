# 동네축제 (local-festival-hub) 향후 로드맵 & 개발 할 일 (TODO)

본 MVP 프로젝트는 안정적인 **제보-검수-배포** 흐름 및 다차원 검색/정렬을 완성한 최적의 프로토타입입니다. 향후 프로덕션급 서비스로 확장할 때 구현해야 할 핵심 스펙과 가이드를 정리해 둡니다.

---

## 🗺️ 1. 실물 지도 SDK 연동 (Kakao / Naver Map)
- **목표:** 현재의 3D 뷰어 카드 `FestivalMapPlaceholder.tsx` 대신, 네이티브 웹 지도 스크립트를 주입하여 실제 위치에 핀을 꼽고 마커를 표시합니다.
- **개발 단계:**
  1. 각 지도 플랫폼 개발자 콘솔에서 API Key 발급
  2. `src/app/layout.tsx` 혹은 상세 페이지 내 `next/script`를 통해 카카오/네이버 지도 비동기 로드
  3. `window.kakao.maps` 인스턴스를 활용해 주소 변환(Geocoding) 및 지도 렌더링 구현
  ```ts
  // 주소로 좌표를 검색합니다
  geocoder.addressSearch(address, function(result, status) {
    if (status === kakao.maps.services.Status.OK) {
      var coords = new kakao.maps.LatLng(result[0].y, result[0].x);
      // 지도의 중심을 결과값으로 받은 위치로 이동시킵니다
      map.setCenter(coords);
    }
  });
  ```

---

## 🔐 2. 관리자 인증 및 보안 장벽 구성 (Next-Auth / Middleware)
- **목표:** 일반인 누구나 접근할 수 있는 현재의 `/admin` 대시보드 진입을 차단하고, 실제 관리자 계정만 가드합니다.
- **개발 단계:**
  1. `next-auth` 또는 `authjs` 라이브러리 추가 설치
  2. `src/middleware.ts` 파일을 생성하여 `/admin` 하위 경로로 진입하는 모든 요청에 대해 어드민 권한 세션 및 JWT 검사 가드 적용
  ```ts
  export { default } from "next-auth/middleware";
  export const config = { matcher: ["/admin/:path*"] };
  ```

---

## 🕷️ 3. 실제 Collectors 크롤러 모듈 연동
- **목표:** 현재 모사(Mock)되고 있는 4개 수집기 모듈에 크롤링 또는 공공 API 연동 코드를 탑재하여 대용량 배치를 돌립니다.
- **개발 단계:**
  1. `visitKoreaCollector.ts`: 공공데이터포털 관광 API에서 축제 정보 엔드포인트를 호출하고 한글 형태소 파서 연동
  2. `newsCollector.ts`: `cheerio` 또는 `puppeteer`를 사용해 주요 지역 일간지의 행사 소식 칼럼 자동 정규식 파싱 탑재
  3. `cron` 스케줄 또는 Next.js `Route Handlers`를 구축하여 일 1회 자동 배치 수집 가동

---

## 🛰️ 4. 모바일 GPS 기반 '내 근처 축제' 거리 계산
- **목표:** 모바일 기기의 현 위치(GPS 위경도) 정보를 브라우저 `navigator.geolocation` API로 수집하여 내 주변 반경 X km 이내의 행사를 찾습니다.
- **개발 단계:**
  1. DB 테이블에 위도(`latitude`) 및 경도(`longitude`) 수치 필드 추가
  2. SQLite의 Haversine 공식 연동 또는 어플리케이션 레이어에서 지구 구면 삼각법 공식을 사용해 거리 연산 수행
