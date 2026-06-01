# 동네축제 (local-festival-hub)

대한민국의 소규모 지역 축제, 동네 장터, 플리마켓, 버스킹 정보를 한곳에서 검색하고 제보할 수 있는 오픈소스 웹 애플리케이션입니다.

**English summary:** Local Festival Hub is an open-source Next.js app for discovering and maintaining data about small local festivals, markets, flea markets, and busking events in Korea.

[Live demo](https://local-festival-hub.vercel.app) · [Report an issue](https://github.com/jubimakesmagic-design/local-festival-hub/issues) · [Contributing](./CONTRIBUTING.md) · [Security](./SECURITY.md)

---

## Why This Exists

대형 관광 포털에는 큰 축제와 공식 행사 위주로 정보가 모입니다. 반면 골목 상권의 작은 행사, 지역 주민 주도 장터, 동네 음악 공연, 단기 플리마켓은 흩어진 공고와 SNS 게시물 속에 묻히기 쉽습니다.

Local Festival Hub는 이런 정보 격차를 줄이기 위해 다음 흐름을 제공합니다.

- 모바일 우선 검색, 필터, 정렬 UI
- 누락된 행사 정보를 시민이 제보하는 제출 폼
- 관리자가 제보를 검수하고 승인/반려하는 운영 화면
- 출처와 데이터 품질을 반영하는 신뢰도 점수 모델
- 공공 API, 고시공고, 지역 뉴스, 사용자 제보를 결합할 수 있는 수집기 구조

현재 저장소는 MVP 단계이며, 로컬 SQLite와 샘플 데이터로 바로 실행할 수 있도록 구성되어 있습니다.

## Maintainer Scope

이 프로젝트는 `jubimakesmagic-design`이 주 책임자로 관리합니다. 주요 유지관리 범위는 다음과 같습니다.

- Next.js App Router 기반 검색/상세/제보/관리자 UX 유지보수
- Prisma 7, SQLite, seed 데이터, 마이그레이션 관리
- 신뢰도 점수 계산 로직과 데이터 검수 흐름 개선
- 접근성, 모바일 사용성, 성능, 릴리스 품질 관리
- 이슈 분류, PR 리뷰, 보안 제보 대응, 릴리스 노트 작성

## Features

- 축제/장터/버스킹 정보 검색, 필터, 정렬
- 행사 상세 페이지와 지도 영역 마운트 포인트
- 사용자 제보 폼과 유효성 검사
- 관리자 승인/반려/신뢰도 조정 액션
- Prisma 기반 SQLite 로컬 데이터베이스
- 샘플 축제 데이터와 제보 데이터 seed
- 모바일 중심 반응형 UI

## Tech Stack

- **Framework:** Next.js App Router, React, TypeScript, ESM
- **Styling:** Tailwind CSS v4, CSS design tokens, Lucide React
- **Database:** SQLite
- **ORM:** Prisma 7
- **Driver:** `@prisma/adapter-better-sqlite3`, `better-sqlite3`
- **Tooling:** `tsx`, `dotenv`, ESLint

## Project Structure

```txt
local-festival-hub/
├── prisma/
│   ├── migrations/      # Database migration history
│   ├── dev.db           # Local SQLite development database
│   ├── schema.prisma    # Prisma 7 schema
│   └── seed.ts          # Sample festivals and user submissions
├── src/
│   ├── app/
│   │   ├── admin/       # Admin review and trust-score actions
│   │   ├── festivals/   # Festival detail pages
│   │   ├── submit/      # User submission flow
│   │   ├── globals.css  # Design tokens and global styles
│   │   ├── layout.tsx   # Metadata and global layout
│   │   └── page.tsx     # Search/filter/sort dashboard
│   ├── components/
│   │   ├── festivals/   # Search, filters, cards, sort controls
│   │   ├── layout/      # Site shell components
│   │   └── ui/          # Lightweight UI primitives
│   └── lib/
│       ├── collectors/  # Public API/news/submission collector prototypes
│       ├── db.ts        # Prisma singleton and SQLite path handling
│       └── trust-score.ts
└── package.json
```

## Quick Start

### 1. Install dependencies

```bash
npm install
```

### 2. Initialize the database

```bash
npx prisma migrate dev --name init
```

### 3. Seed sample data

```bash
npx prisma db seed
```

### 4. Start the development server

```bash
npm run dev
```

Open `http://localhost:3000` in your browser.

## Available Scripts

```bash
npm run dev      # Start local development server
npm run build    # Generate Prisma client and build Next.js app
npm run start    # Start production server
npm run lint     # Run ESLint
```

## Roadmap

- Connect live public data sources for regional festival notices
- Add source attribution and duplicate detection
- Improve trust-score explainability for admins and contributors
- Add map integration for festival locations
- Add automated checks for submitted event dates and venue addresses
- Add end-to-end tests for search, submission, and admin review flows

## Contributing

Contributions are welcome. Good first areas include accessibility fixes, data-source collectors, documentation, tests, UI polish, and trust-score improvements.

Please read [CONTRIBUTING.md](./CONTRIBUTING.md) before opening an issue or pull request.

## Security

Please do not open public issues for sensitive vulnerabilities. See [SECURITY.md](./SECURITY.md) for the reporting process.

## License

This project is released under the [MIT License](./LICENSE).
