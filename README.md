# 🎪 동네축제 (local-festival-hub) MVP

> **대한민국 구석구석 숨겨져 있던 소규모 골목 축제, 동네 장터, 플리마켓, 음악 버스킹을 한곳에 모으는 통합 검색 및 제보 시스템**

대형 메이저 관광 웹사이트들이 소외시킨 작은 로컬 행사들의 정보 격차를 **사용자 제보(User Submission), 관리자 교차 검수망, 정보 신뢰도 평가 점수(Trust Score) 알고리즘**을 통해 실시간으로 해소하는 모바일 우선 반응형 통합 웹 앱입니다.

---

## 🛠️ 추천 기술 스택

- **Core & Framework:** Next.js App Router (16.2.6), React (19.2.4), TypeScript, ESM
- **Styling:** Tailwind CSS v4, Vanilla CSS 토큰 테마, Lucide-React
- **Database & ORM:** SQLite, Prisma ORM (v7.8.0)
- **Database Engine Driver:** `@prisma/adapter-better-sqlite3`, `better-sqlite3` (Prisma 7 표준 드라이버 어댑터 규격)
- **Scripting Runner:** `tsx`, `dotenv`

---

## 🏗️ 프로젝트 주요 구조

```txt
local-festival-hub/
├── prisma/
│   ├── migrations/      # 데이터베이스 DDL 마이그레이션 이력
│   ├── dev.db           # SQLite 로컬 실물 데이터베이스 파일
│   ├── schema.prisma    # Prisma 7 스키마 선언
│   └── seed.ts          # 고품질 테스트 데이터셋 시드 스크립트 (10개 축제 + 2개 제보)
├── src/
│   ├── app/
│   │   ├── admin/       # 관리자 승인/반려/신뢰점수 조정 및 어드민 액션
│   │   ├── festivals/   # 축제 상세 조회 정보 카드 & 지도 마운트 플레이스홀더
│   │   ├── submit/      # 누락 축제 유효성 검사 제보 폼 & 제보 액션
│   │   ├── globals.css  # 프리미엄 HSL 테마 디자인 토큰 및 `@starting-style` 모바일 팝오버
│   │   ├── layout.tsx   # SEO 최적화 메타데이터 및 글로벌 사이트 헤더 레이아웃
│   │   └── page.tsx     # 메인 다차원 검색/필터/정렬 서버 사이드 대시보드
│   ├── components/
│   │   ├── festivals/   # 축제 카드, 필터 사이드바/드로어, 서치박스, 정렬 셀렉터
│   │   ├── layout/      # 스크롤 엣지 블러 효과 `SiteHeader` 컴포넌트
│   │   └── ui/          # 자체 제작 경량 UI 컴포넌트 세트 (Button, Badge, Card, Input, Select)
│   ├── lib/
│   │   ├── collectors/  # 공공 API / 고시공고 / 지역 뉴스 / 제보 결합 모사 수집기 세트
│   │   ├── db.ts        # Prisma 7 싱글톤 인스턴스 어댑터 (절대경로 해결사 적용)
│   │   └── trust-score.ts # 데이터 신뢰도 연산 가산/감산 공식
└── package.json         # 패키지 의존성 및 스크립트 잠금
```

---

## 🚀 빠른 시작 가이드 (Quick Start)

이 프로젝트는 별도의 외부 데이터베이스나 인프라 서버 구축 없이 로컬에서 원스톱으로 마이그레이션부터 서버 기동까지 10초 만에 완수할 수 있도록 최적화되어 있습니다.

### 1. 패키지 설치
프로젝트 루트 폴더로 진입하여 필요한 모든 의존성을 복원합니다.
```bash
npm install
```

### 2. 데이터베이스 초기화 & 마이그레이션 실행
Prisma 7 마이그레이션을 실행하여 로컬 SQLite 실물 파일 데이터베이스(`dev.db`)를 작성합니다.
```bash
npx prisma migrate dev --name init
```

### 3. 고품질 샘플 데이터셋 적재 (Seeding)
Prisma 7 네이티브 시드 시스템을 통해 영산포 홍어·한우축제 등 10개의 다이내믹 시뮬레이션 축제 데이터와 2건의 제보 내역을 적재합니다.
```bash
npx prisma db seed
```

### 4. 로컬 개발 서버 기동
로컬 호스트에서 즉시 프리미엄 MVP 서비스를 미리 봅니다.
```bash
npm run dev
```
- 브라우저를 통해 `http://localhost:3000`으로 접속합니다.

---

## ⚡ Prisma 7 드라이버 어댑터 및 절대경로 처리 설명

1. **Rust 엔진 제거 및 Driver Adapter 구조:**
   - Prisma 7부터는 성능 최적화와 메모리 경량화를 위해 내부 Rust 커넥션 바이너리 엔진이 완전 제거되었습니다. 
   - 따라서 SQLite 실체 접근을 위해 `@prisma/adapter-better-sqlite3`와 `better-sqlite3` 모듈을 조합하여 명시적인 드라이버 어댑터를 생성하고 `PrismaClient({ adapter })` 형태로 주입하여 가동합니다.
   
2. **SQLite 절대경로 해결사 (`db.ts`):**
   - 개발 서버 구동 시점의 작업 디렉터리(`Cwd`)와 Prisma CLI가 마이그레이션/시딩을 수행하는 환경적 작업 디렉터리 간의 차이로 인해 상대 경로가 틀어질 위험이 존재합니다.
   - 이를 방지하기 위해 `lib/db.ts`에 `path.resolve(process.cwd(), "prisma/dev.db")`를 도입해 언제나 일체형의 **절대경로** 데이터베이스 링커를 구성함으로써 오차 없이 연결됩니다.
