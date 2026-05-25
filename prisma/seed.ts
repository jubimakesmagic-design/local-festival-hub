// prisma/seed.ts
import { PrismaClient } from "@prisma/client";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import path from "path";

const adapter = new PrismaBetterSqlite3({
  url: "file:" + path.resolve(process.cwd(), "prisma/dev.db")
});
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("🧹 데이터베이스 초기화 중...");
  await prisma.festivalProgram.deleteMany();
  await prisma.festivalSource.deleteMany();
  await prisma.festival.deleteMany();
  await prisma.userSubmission.deleteMany();

  console.log("🌱 실물 데이터 시딩 중...");

  // 1. 제22회 영산포 홍어·한우축제 (진행했음 - 2026년 5월 22일 ~ 5월 24일)
  await prisma.festival.create({
    data: {
      name: "제22회 영산포 홍어·한우축제",
      description: "영산강의 선선한 봄바람과 함께 영산포의 전통 삭힌 홍어와 맛 좋은 나주 한우를 풍성하게 즐기는 맛의 축제입니다. 16만㎡ 규모의 화려한 꽃양귀비 정원 포토존과 다채로운 버스킹 공연, 미식 체험이 펼쳐졌습니다.",
      region: "전남 나주시",
      address: "영산강 둔치체육공원 일원 (전라남도 나주시 영산동 252-1)",
      startDate: new Date("2026-05-22T10:00:00+09:00"),
      endDate: new Date("2026-05-24T22:00:00+09:00"),
      category: "FOOD",
      officialUrl: "https://www.naju.go.kr/tour",
      imageUrl: "https://images.unsplash.com/photo-1544025162-d76694265947?w=800&auto=format&fit=crop",
      hasParking: true,
      hasShuttle: true,
      isPetFriendly: true,
      isChildFriendly: true,
      congestionStatus: "NORMAL",
      trustScore: 95,
      views: 312,
      status: "VERIFIED",
      sources: {
        create: [
          { name: "나주시청 관광 포털", url: "https://www.naju.go.kr/tour/cultural/festival/speciality/01", type: "LOCAL_GOV" },
          { name: "나주문화재단 축제 공지사항", url: "https://www.njcf.or.kr", type: "LOCAL_GOV" }
        ]
      },
      programs: {
        create: [
          { name: "나주들애찬 한우 & 홍어 특별 할인 판매장", time: "10:00 - 21:00", content: "최고급 나주 한우 30% 및 국내산/수입산 홍어 최대 50% 현장 할인" },
          { name: "초청가수 대동 한마당 (박서진, 류지광 등)", time: "18:30 - 21:00", content: "류지광, 박서진, 신승태 등 대세 트롯 가수들의 화려한 개막 축하공연" },
          { name: "영산강 꽃양귀비 밭 힐링 포토존 & 상시 체험", time: "상시 운영", content: "에어바운스, 키다리 풍선아트, 랜덤플레이댄스 및 버블쇼 체험" }
        ]
      }
    }
  });

  // 2. 가평 자라섬 꽃 페스타 (진행중 - 2026년 5월 23일 ~ 6월 14일)
  await prisma.festival.create({
    data: {
      name: "2026 가평 자라섬 꽃 페스타",
      description: "자라섬 남도 일원을 가득 채우는 봄꽃의 대향연! '푸른 물결 위, 화려한 꽃의 항해'를 주제로 양귀비, 수국, 델피늄 등 형형색색의 봄꽃 정원이 가평의 자연과 어우러져 펼쳐집니다. 관람권 구매 시 가평사랑상품권 5천원을 환급해 드립니다.",
      region: "경기 가평군",
      address: "자라섬 남도 일원 (경기도 가평군 가평읍 자라섬로 60)",
      startDate: new Date("2026-05-23T08:00:00+09:00"),
      endDate: new Date("2026-06-14T18:00:00+09:00"),
      category: "NATURE",
      officialUrl: "https://www.gptour.go.kr",
      imageUrl: "https://images.unsplash.com/photo-1560717789-0ac7c58ac90a?w=800&auto=format&fit=crop",
      hasParking: true,
      hasShuttle: false,
      isPetFriendly: true,
      isChildFriendly: true,
      congestionStatus: "NORMAL",
      trustScore: 98,
      views: 489,
      status: "VERIFIED",
      sources: {
        create: [
          { name: "가평군 문화관광 공식 포털", url: "https://www.gptour.go.kr/festival/jara-flower", type: "LOCAL_GOV" }
        ]
      },
      programs: {
        create: [
          { name: "봄꽃 남도 정원 관람 & 인생 포토존", time: "08:00 - 18:00", content: "양귀비, 델피늄, 수국 등 10만 9천㎡ 규모의 대형 테마 정원 산책" },
          { name: "주말 어쿠스틱 버스킹 & 힐링 도보 투어", time: "주말/공휴일 수시", content: "자라섬 남도 숲길에서 즐기는 밴드 버스킹 및 전문 도설사 투어" },
          { name: "가평사랑상품권 환급 & 친환경 무료 전기차 운영", time: "상시 운영", content: "관내 음식점/카페 이용 지원 및 자라섬 입구~남도 입구 무료 이동" }
        ]
      }
    }
  });

  // 3. 제19회 원주 용수골 꽃양귀비축제 (진행중 - 2026년 5월 20일 ~ 6월 7일)
  await prisma.festival.create({
    data: {
      name: "제19회 원주 용수골 꽃양귀비축제",
      description: "전국에서 유일하게 '리(里)' 단위 마을 주민들이 합심하여 손수 일구어낸 빨간 양귀비꽃의 바다! 1만 3천 평의 너른 축제장을 수놓은 꽃양귀비와 다양한 계절 꽃들 사이에서 소박하고 평화로운 농촌 정취를 만끽해보세요.",
      region: "강원 원주시",
      address: "판부면 서곡리 용수골길 311 (원주 판부면 서곡리 일대)",
      startDate: new Date("2026-05-20T09:00:00+09:00"),
      endDate: new Date("2026-06-07T18:00:00+09:00"),
      category: "NATURE",
      officialUrl: "http://www.yongsoogol.co.kr",
      imageUrl: "https://images.unsplash.com/photo-1461988310307-d11d0b9e4a35?w=800&auto=format&fit=crop",
      hasParking: true,
      hasShuttle: false,
      isPetFriendly: false,
      isChildFriendly: true,
      congestionStatus: "NORMAL",
      trustScore: 92,
      views: 245,
      status: "VERIFIED",
      sources: {
        create: [
          { name: "용수골 꽃양귀비마을 공식 사이트", url: "http://www.yongsoogol.co.kr", type: "LOCAL_GOV" }
        ]
      },
      programs: {
        create: [
          { name: "꽃밭 사이를 달리는 깡통열차 체험", time: "09:00 - 17:30 (상시)", content: "드넓은 양귀비 꽃밭 중심을 시원하게 질주하는 시그니처 깡통 기차 체험" },
          { name: "꽃양귀비 가든 마켓 & 수공예 부스", time: "상시 운영", content: "마을 주민들이 만든 양귀비 비누, 기념 손수건, 빨간 우산 및 모종 판매" },
          { name: "친환경 꽃양귀비 티셔츠 & 자연물 공예 만들기", time: "상시 운영", content: "직접 꽃 문양을 염색해보는 핸드메이드 소품 제작 교실" }
        ]
      }
    }
  });

  // 4. 대구 서문시장 야시장 대축제 (진행중 - 주말 금/토/일 상시 개장)
  await prisma.festival.create({
    data: {
      name: "대구 서문시장 야시장 시즌 축제",
      description: "대구의 대표적인 밤문화 핫플레이스 서문시장 야시장의 열정적인 스트리트 페스티벌! 매주 금, 토, 일 저녁 7시부터 열리는 길거리 맛집들과 화려한 상설 청년 뮤지션 버스킹, 가요제가 골목을 가득 채웁니다.",
      region: "대구 중구",
      address: "서문시장 야시장 거리 일대 (대구광역시 중구 큰장로26길 45)",
      startDate: new Date("2026-06-05T19:00:00+09:00"),
      endDate: new Date("2026-06-07T23:30:00+09:00"),
      category: "FOOD",
      officialUrl: "http://www.nightseomun.com",
      imageUrl: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800&auto=format&fit=crop",
      hasParking: true,
      hasShuttle: false,
      isPetFriendly: true,
      isChildFriendly: true,
      congestionStatus: "NORMAL",
      trustScore: 88,
      views: 198,
      status: "VERIFIED",
      sources: {
        create: [
          { name: "대구전통시장진흥원 공식 소식", url: "http://www.nightseomun.com/notice/1", type: "LOCAL_GOV" }
        ]
      },
      programs: {
        create: [
          { name: "글로벌 퓨전 스트리트 푸드 마켓", time: "19:00 - 23:30", content: "막창, 납작만두, 큐브스테이크, 야채뚱땡 삼겹말이 등 퓨전 야식 퍼레이드" },
          { name: "야외 광장 청년 거리 버스킹 배틀", time: "20:00 - 22:30", content: "대구 인디 뮤지션들과 비보이 댄스팀의 화려한 라이브 거리 무대" },
          { name: "제9회 서문가요제 현장 예선전", time: "매주 토요일 21:00", content: "현장 방문객 누구나 즉석 참여할 수 있는 열린 노래방 축제" }
        ]
      }
    }
  });

  // 5. 담양 대나무축제 (진행했음 - 2026년 5월 1일 ~ 5월 5일)
  await prisma.festival.create({
    data: {
      name: "2026 담양 대나무축제",
      description: "죽녹원과 관방제림의 아름다운 자연을 녹여낸 최고의 야간 힐링형 축제! '빛나라 빛나, 대나무!'를 주제로 야간 미디어 파사드, 밤하늘을 수놓는 드론쇼, 그리고 대나무숲 속 야외 영화관을 아우르는 체류형 명품 축제입니다.",
      region: "전남 담양군",
      address: "죽녹원, 전남도립대학교 앞 관방천 및 담빛음악당 일원",
      startDate: new Date("2026-05-01T09:00:00+09:00"),
      endDate: new Date("2026-05-05T18:00:00+09:00"),
      category: "CULTURE",
      officialUrl: "http://www.bamboofestival.co.kr",
      imageUrl: "https://images.unsplash.com/photo-1502082553048-f009c37129b9?w=800&auto=format&fit=crop",
      hasParking: true,
      hasShuttle: true,
      isPetFriendly: false,
      isChildFriendly: true,
      congestionStatus: "NORMAL",
      trustScore: 99,
      views: 541,
      status: "VERIFIED",
      sources: {
        create: [
          { name: "담양군 대나무축제추진위원회", url: "http://www.bamboofestival.co.kr", type: "LOCAL_GOV" }
        ]
      },
      programs: {
        create: [
          { name: "개막 축하공연 (YB 윤도현 밴드) & 드론 라이팅 쇼", time: "5/1 18:30 - 21:00", content: "록 밴드 YB의 시원한 라이브와 500대 미니 드론이 만드는 대나무 조형 불빛 쇼" },
          { name: "대나무숲 야간 영화관 & 관방천 조명터널", time: "매일 19:30 - 21:30", content: "죽녹원 야간 무료 개장 및 대숲 사이로 상영되는 어쿠스틱 시네마" },
          { name: "친환경 대뗏목 타기 & 대나무 물총 서바이벌", time: "상시 운영", content: "관방천 위를 떠다니는 뗏목 조타 체험 및 패밀리 물총 쏘기 놀이" }
        ]
      }
    }
  });

  // 6. 부산 태종대 태종사 수국 축제 (예정 - 2026년 6월 27일 ~ 7월 5일)
  await prisma.festival.create({
    data: {
      name: "부산 태종사 수국 축제",
      description: "영도 절벽 아래 시원한 부산 바다 바람을 머금고 화려하게 피어난 형형색색 수국의 바다! 태종대 유원지 깊숙이 자리한 태종사 경내에 흐드러지게 핀 거대한 수국 터널을 걸으며 힐링의 순간을 만나보세요.",
      region: "부산 영도구",
      address: "태종대 유원지 내 태종사 일원 (부산광역시 영도구 전망로 119)",
      startDate: new Date("2026-06-27T09:00:00+09:00"),
      endDate: new Date("2026-07-05T18:00:00+09:00"),
      category: "NATURE",
      imageUrl: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&auto=format&fit=crop",
      hasParking: true,
      hasShuttle: true,
      isPetFriendly: true,
      isChildFriendly: true,
      congestionStatus: "NORMAL",
      trustScore: 82,
      views: 184,
      status: "VERIFIED",
      sources: {
        create: [
          { name: "비짓부산 공식 관광 포털", url: "https://www.visitbusan.net", type: "LOCAL_GOV" }
        ]
      },
      programs: {
        create: [
          { name: "태종사 명품 오색 수국 꽃길 투어", time: "09:00 - 18:00", content: "사찰 경내 3천여 그루의 대단지 수국 나무 군락지 힐링 산책" },
          { name: "태종대 다누비 순환 열차 연계 탑승", time: "상시 운영", content: "태종대 정문에서 태종사 입구까지 숲속을 가로지르는 귀여운 꼬마 열차 여행" },
          { name: "수국 야외 다도 체험 & 사진 엽서 교환소", time: "11:00 - 16:00", content: "은은한 수국차 시음과 소중한 이에게 보내는 축제 엽서 쓰기" }
        ]
      }
    }
  });

  // 7. 세종 금강 이응다리 버스킹 데이 (예정 - 2026년 5월 26일 저녁)
  await prisma.festival.create({
    data: {
      name: "세종 금강 이응다리 버스킹 데이",
      description: "국내 최장 보행용 보행교인 세종 금강 '이응다리' 남측 광장에서 선선한 저녁 강바람을 맞으며 즐기는 청년 예술가들의 감성 멜로디! 이응다리의 아름다운 야경 LED 조명과 잔잔한 선율의 콜라보레이션입니다.",
      region: "세종시",
      address: "금강보행교(이응다리) 남측 광장 및 2층 수변공연장 일원",
      startDate: new Date("2026-05-26T18:00:00+09:00"),
      endDate: new Date("2026-05-26T21:00:00+09:00"),
      category: "MUSIC",
      officialUrl: "https://www.sjtc.or.kr",
      imageUrl: "https://images.unsplash.com/photo-1501386761578-eac5c94b800a?w=800&auto=format&fit=crop",
      hasParking: true,
      hasShuttle: false,
      isPetFriendly: true,
      isChildFriendly: true,
      congestionStatus: "NORMAL",
      trustScore: 85,
      views: 120,
      status: "VERIFIED",
      sources: {
        create: [
          { name: "세종시 문화관광 포털", url: "https://www.sejong.go.kr/tour", type: "LOCAL_GOV" }
        ]
      },
      programs: {
        create: [
          { name: "어쿠스틱 밴드 감성 라이브", time: "18:00 - 19:30", content: "로컬 인디 뮤지션들의 금강 강바람 어쿠스틱 콘서트" },
          { name: "재즈 & 블루스 LED 야경 음악회", time: "19:30 - 21:00", content: "이응다리 야간 점등과 어우러지는 로맨틱 재즈 앙상블" }
        ]
      }
    }
  });

  // 10. 춘천 레고랜드 어린이 야간개장 페스티벌 (진행했음 - 2026년 5월 3일 ~ 5월 5일)
  await prisma.festival.create({
    data: {
      name: "춘천 레고랜드 어린이 야간개장 페스티벌",
      description: "어린이날 골든위크를 맞아 펼쳐지는 가족 친화형 빛과 블록의 환상 축제! 오후 9시까지 이어지는 야간 연장 운영과 함께 오색빛 조명으로 빛나는 레고 빌리지 전체의 라이트쇼, 대형 미니 드론 불꽃쇼가 하늘을 가득 메웁니다.",
      region: "강원 춘천시",
      address: "레고랜드 코리아 리조트 일대 (강원특별자치도 춘천시 하중도길 128)",
      startDate: new Date("2026-05-03T10:00:00+09:00"),
      endDate: new Date("2026-05-05T21:00:00+09:00"),
      category: "ART",
      officialUrl: "https://www.legoland.kr",
      imageUrl: "https://images.unsplash.com/photo-1564981797816-1043d01117da?w=800&auto=format&fit=crop",
      hasParking: true,
      hasShuttle: true,
      isPetFriendly: false,
      isChildFriendly: true,
      congestionStatus: "HIGH",
      trustScore: 92,
      views: 421,
      status: "VERIFIED",
      sources: {
        create: [
          { name: "레고랜드 코리아 리조트 공식 운영캘린더", url: "https://www.legoland.kr", type: "LOCAL_GOV" }
        ]
      },
      programs: {
        create: [
          { name: "레고 빌리지 3D 미디어 라이트 파사드 쇼", time: "20:00 - 20:30", content: "초대형 레고 시계탑에 쏘아 올리는 인터랙티브 3D 맵핑 화려한 레이저쇼" },
          { name: "밤하늘 드론 불꽃놀이 피날레 (레고 시티 페스타)", time: "20:45 - 21:00", content: "300대의 레고 테마 드론이 연출하는 불꽃와 야간 드론 불꽃 스토리 쇼" },
          { name: "어린이날 특별 레고 캐릭터 특별 퍼레이드", time: "14:00 / 16:30", content: "레고 랜드 시그니처 프렌즈 피규어 인형들이 총출동하는 야외 댄스 퍼레이드" }
        ]
      }
    }
  });

  // 11. 제49회 보성다향대축제 (예정 - 2026년 5월 1일 ~ 5월 5일)
  await prisma.festival.create({
    data: {
      name: "제49회 보성다향대축제",
      description: "대한민국 최대의 차 문화 축제! '천년 보성 차, 세계를 품다'를 테마로 한국차소리문화공원에서 초록빛 찻잎이 물드는 5월의 향기를 만끽해 보세요. 찻잎 따기, 차 만들기, 다례 체험 등 다채로운 프로그램과 특별 초청 공연이 펼쳐집니다.",
      region: "전남 보성군",
      address: "한국차소리문화공원 일원 (전라남도 보성군 보성읍 녹차로 983)",
      startDate: new Date("2026-05-01T09:00:00+09:00"),
      endDate: new Date("2026-05-05T18:00:00+09:00"),
      category: "CULTURE",
      officialUrl: "http://dahyang.boseong.go.kr",
      imageUrl: "https://images.unsplash.com/photo-1597481499750-3e6b22637e12?w=800&auto=format&fit=crop",
      hasParking: true,
      hasShuttle: true,
      isPetFriendly: false,
      isChildFriendly: true,
      congestionStatus: "NORMAL",
      trustScore: 97,
      views: 384,
      status: "VERIFIED",
      sources: {
        create: [
          { name: "보성군청 관광체험 포털", url: "http://dahyang.boseong.go.kr", type: "LOCAL_GOV" }
        ]
      },
      programs: {
        create: [
          { name: "보성티마스터컵 & 전통 다례 시연", time: "10:30 - 12:00", content: "전국 최고의 차 장인들이 펼치는 전통 다례 법식 시연 및 티 믹솔로지 챔피언십" },
          { name: "초록빛 잎사귀 찻잎 따기 & 수제 차 만들기", time: "09:00 - 17:00 (상시)", content: "다원에서 직접 신선한 찻잎을 수확하고 솥에 덖어보는 전통 수제 차 제작 체험" },
          { name: "보성 그린 콘서트 (YB 윤도현 밴드, 이찬원 등)", time: "5/2 19:00 - 21:00", content: "녹차 밭을 배경으로 울려 퍼지는 YB 밴드와 대세 찬또배기 이찬원의 그린 힐링 음악회" }
        ]
      }
    }
  });

  // 12. 2026 진주남강유등축제 (예정 - 2026년 10월 3일 ~ 10월 18일)
  await prisma.festival.create({
    data: {
      name: "2026 진주남강유등축제",
      description: "임진왜란 진주성 전투에서 성 밖의 의병과 교신하고 가족에게 안부를 전하던 군사 신호이자 통신 수단이었던 유등이 평화와 희망의 등불로 다시 태어납니다. 수만 개의 오색 유등이 남강을 가득 수놓는 한국 최고의 밤빛 페스티벌입니다.",
      region: "경남 진주시",
      address: "진주성 및 남강 일원 (경상남도 진주시 본성동 415)",
      startDate: new Date("2026-10-03T18:00:00+09:00"),
      endDate: new Date("2026-10-18T23:00:00+09:00"),
      category: "CULTURE",
      officialUrl: "http://www.yudeung.com",
      imageUrl: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=800&auto=format&fit=crop",
      hasParking: true,
      hasShuttle: true,
      isPetFriendly: true,
      isChildFriendly: true,
      congestionStatus: "NORMAL",
      trustScore: 99,
      views: 612,
      status: "VERIFIED",
      sources: {
        create: [
          { name: "진주문화예술재단 축제 운영위원회", url: "http://www.yudeung.com", type: "LOCAL_GOV" }
        ]
      },
      programs: {
        create: [
          { name: "남강 유등 띄우기 & 소망등 터널 걷기", time: "18:00 - 23:00 (상시)", content: "직접 소망을 적어 남강 물결 위에 유등을 띄워 보내고 4만 개의 등불로 이루어진 터널 산책" },
          { name: "멀티미디어 불꽃쇼 & 워터 라이트 레이저쇼", time: "개막일/폐막일 20:00", content: "촉석루와 남강을 배경으로 밤하늘을 수놓는 환상적인 미디어 드론쇼와 불꽃 퍼레이드" },
          { name: "전통 탈놀이 & 대한민국 등(燈) 공모 전시전", time: "13:00 - 22:00", content: "예술가들이 수작업으로 구현한 기상천외한 대형 등 작품 전시 및 상설 풍물 국악 예술제" }
        ]
      }
    }
  });

  // 13. 제33회 태백산 눈축제 (진행했음 - 2026년 1월 16일 ~ 1월 25일)
  await prisma.festival.create({
    data: {
      name: "제33회 태백산 눈축제",
      description: "해발 800m 청정 고원 태백에서 펼쳐지는 하얀 눈의 나라! 거대한 스케일의 초대형 눈조각 전시물들과 다이내믹한 겨울 액티비티가 결합하여 추위를 잊게 만드는 환상적인 겨울 축제입니다.",
      region: "강원 태백시",
      address: "태백산국립공원 당골광장 일원 (강원특별자치도 태백시 소도동 325)",
      startDate: new Date("2026-01-16T09:00:00+09:00"),
      endDate: new Date("2026-01-25T17:00:00+09:00"),
      category: "NATURE",
      officialUrl: "http://tbsnow.or.kr",
      imageUrl: "https://images.unsplash.com/photo-1485594050903-8e8ee7b071a8?w=800&auto=format&fit=crop",
      hasParking: true,
      hasShuttle: true,
      isPetFriendly: false,
      isChildFriendly: true,
      congestionStatus: "NORMAL",
      trustScore: 94,
      views: 215,
      status: "VERIFIED",
      sources: {
        create: [
          { name: "태백시 축제위원회", url: "http://tbsnow.or.kr", type: "LOCAL_GOV" }
        ]
      },
      programs: {
        create: [
          { name: "국내외 조각 거장들의 초대형 눈조각 전시", time: "09:00 - 17:00 (상시)", content: "당골광장에 조각된 성바오로 대성당, 자유의 여신상, 신화 속 영웅들의 눈부신 조각 전시" },
          { name: "태백산 눈꽃 전국 등반대회", time: "1/25 09:00 - 15:00", content: "눈 덮인 태백산 천제단까지 오르는 겨울 산악인들의 흰 눈꽃 등반 축제" },
          { name: "이색 화로 겨울 먹거리 장터 & 대형 눈썰매장", time: "10:00 - 16:30", content: "군고구마, 화로 삼겹 구이를 맛볼 수 있는 추억의 먹거리존 및 30m 길이의 신나는 눈썰매" }
        ]
      }
    }
  });

  // 14. 2026 강릉단오제 (예정 - 2026년 6월 15일 ~ 6월 22일)
  await prisma.festival.create({
    data: {
      name: "2026 강릉단오제",
      description: "천년의 역사, 인류의 문화유산! 유네스코 인류무형문화유산에 등재된 한국 최대의 전통 민속 축제입니다. 신주빚기, 대관령산신제부터 영신행차, 단오굿, 관노가면극까지 전통과 현대가 어우러진 신명나는 축제입니다.",
      region: "강원 강릉시",
      address: "강릉 남대천 행사정 일원 (강원특별자치도 강릉시 노암동 9-3)",
      startDate: new Date("2026-06-15T09:00:00+09:00"),
      endDate: new Date("2026-06-22T22:00:00+09:00"),
      category: "CULTURE",
      officialUrl: "http://www.danojefestival.or.kr",
      imageUrl: "https://images.unsplash.com/photo-1538481199705-c710c4e965fc?w=800&auto=format&fit=crop",
      hasParking: true,
      hasShuttle: true,
      isPetFriendly: true,
      isChildFriendly: true,
      congestionStatus: "NORMAL",
      trustScore: 98,
      views: 456,
      status: "VERIFIED",
      sources: {
        create: [
          { name: "(사)강릉단오제위원회 공식 아카이브", url: "http://www.danojefestival.or.kr", type: "LOCAL_GOV" }
        ]
      },
      programs: {
        create: [
          { name: "단오굿 & 전통 영신행차 퍼레이드", time: "일정 내 수시 (야간)", content: "강릉 시내를 관통하여 남대천 단오장까지 이어지는 신명나는 등불 퍼레이드와 단오제 수호신 굿" },
          { name: "유네스코 등재 무언 가면극 '관노가면극' 상설 공연", time: "14:00 / 17:00", content: "말없이 몸짓과 춤으로만 소통하는 국내 유일의 무언 가면극 무료 야외 공연" },
          { name: "신주(神酒) 및 수리취떡 나눔 체험", time: "11:00 - 15:00", content: "단오 신들에게 바쳤던 신주 막걸리와 쌉싸름한 수리취 떡을 무료로 시식해보는 풍속 문화 체험" }
        ]
      }
    }
  });

  // 15. 제44회 금산세계인삼축제 (예정 - 2026년 10월 2일 ~ 10월 11일)
  await prisma.festival.create({
    data: {
      name: "제44회 금산세계인삼축제",
      description: "생명의 고향 금산에서 펼쳐지는 건강과 활력의 대축제! 하늘이 내린 선물, 인삼의 뛰어난 효능을 직접 느끼고 오감을 깨우는 웰니스 축제입니다. 건강 마사지, 스파, 홍삼 족욕 및 직접 인삼밭에서 삼을 캐보는 역동적인 체험이 가득합니다.",
      region: "충남 금산군",
      address: "금산인삼관 광장 및 인삼약초거리 일원 (충청남도 금산군 금산읍 인삼광장로 30)",
      startDate: new Date("2026-10-02T10:00:00+09:00"),
      endDate: new Date("2026-10-11T21:00:00+09:00"),
      category: "FOOD",
      officialUrl: "http://www.insamfestival.co.kr",
      imageUrl: "https://images.unsplash.com/photo-1584269600464-37b1b58a9fe7?w=800&auto=format&fit=crop",
      hasParking: true,
      hasShuttle: true,
      isPetFriendly: false,
      isChildFriendly: true,
      congestionStatus: "NORMAL",
      trustScore: 95,
      views: 318,
      status: "VERIFIED",
      sources: {
        create: [
          { name: "금산축제관광재단 공식 고시", url: "http://www.insamfestival.co.kr", type: "LOCAL_GOV" }
        ]
      },
      programs: {
        create: [
          { name: "금산인삼 캐기 현장 체험 여행", time: "10:00 - 16:30 (상시)", content: "진짜 인삼밭에 들어가 심마니가 되어 크고 알찬 2026년산 수삼을 직접 수확해보는 체험 (캔 인삼 구매 가능)" },
          { name: "K-인삼 웰니스 테라피 & 홍삼 족욕 스파", time: "10:00 - 18:00", content: "따뜻한 홍삼 우림물에 발을 담그는 힐링 족욕관 및 맞춤 인삼 천연 팩 피부 체험" },
          { name: "금산 인삼 삼계탕 페스티벌 & 미식 장터", time: "11:00 - 20:30", content: "인삼 삼계탕, 홍삼 튀김, 인삼 동동주 등 오직 금산에서만 즐기는 건강 레시피 파티" }
        ]
      }
    }
  });

  // 16. 제64회 진해군항제 (진행했음 - 2026년 3월 25일 ~ 4월 3일)
  await prisma.festival.create({
    data: {
      name: "제64회 진해군항제",
      description: "대한민국 최대의 벚꽃 축제이자 해군 모항의 낭만이 어우러진 봄의 향연! 36만 그루의 왕벚나무가 일제히 만개하여 터널을 이루는 여좌천 로망스다리와, 웅장한 군악의장 페스티벌이 전 세계 관광객을 맞이합니다.",
      region: "경남 창원시",
      address: "진해 중원로터리 및 여좌천 일원 (경상남도 창원시 진해구 통신동 1)",
      startDate: new Date("2026-03-25T09:00:00+09:00"),
      endDate: new Date("2026-04-03T22:00:00+09:00"),
      category: "NATURE",
      officialUrl: "http://culture.changwon.go.kr",
      imageUrl: "https://images.unsplash.com/photo-1522383225653-ed111181a951?w=800&auto=format&fit=crop",
      hasParking: true,
      hasShuttle: true,
      isPetFriendly: true,
      isChildFriendly: true,
      congestionStatus: "NORMAL",
      trustScore: 99,
      views: 742,
      status: "VERIFIED",
      sources: {
        create: [
          { name: "창원시 관광과 축제 기획부 공지", url: "http://culture.changwon.go.kr", type: "LOCAL_GOV" }
        ]
      },
      programs: {
        create: [
          { name: "여좌천 로망스다리 야간 벚꽃 미디어 레이저쇼", time: "19:00 - 22:00 (상시)", content: "벚꽃 터널 아래 여좌천 물줄기를 아름답게 비추는 홀로그램과 LED 일루미네이션 쇼" },
          { name: "진해 군악의장 페스티벌 & 영신행차", time: "3/27 - 3/29 주간/야간", content: "대한민국 육·해·공군 및 해병대 군악의장대가 펼치는 역동적이고 웅장한 특수 퍼레이드 및 합동 연주회" },
          { name: "공군 특수비행팀 '블랙이글스' 벚꽃 에어쇼", time: "3/28 14:00", content: "벚꽃 눈이 내리는 진해 하늘을 시속 800km로 가르며 화려한 공중 곡예비행을 선보이는 스펙터클 무대" }
        ]
      }
    }
  });

  // 17. 2026 화천산천어축제 (진행했음 - 2026년 1월 10일 ~ 2월 1일)
  await prisma.festival.create({
    data: {
      name: "2026 화천산천어축제",
      description: "'얼지 않는 인정, 녹지 않는 추억!' 세계 4대 겨울 축제로 꼽히는 대한민국 대표 겨울 페스티벌입니다. 두께 30cm가 넘는 깨끗한 화천천 얼음 위에서 짜릿한 손맛을 느끼는 얼음낚시와 맨손 산천어 포획의 열기가 매서운 추위를 녹입니다.",
      region: "강원 화천군",
      address: "화천천 일원 (강원특별자치도 화천군 화천읍 산천어길 137)",
      startDate: new Date("2026-01-10T09:00:00+09:00"),
      endDate: new Date("2026-02-01T18:00:00+09:00"),
      category: "FOOD",
      officialUrl: "http://www.narafestival.com",
      imageUrl: "https://images.unsplash.com/photo-1518084478521-41f89a2e6427?w=800&auto=format&fit=crop",
      hasParking: true,
      hasShuttle: true,
      isPetFriendly: false,
      isChildFriendly: true,
      congestionStatus: "NORMAL",
      trustScore: 96,
      views: 489,
      status: "VERIFIED",
      sources: {
        create: [
          { name: "(재)나라나라 축제조직위원회", url: "http://www.narafestival.com", type: "LOCAL_GOV" }
        ]
      },
      programs: {
        create: [
          { name: "산천어 얼음낚시 & 현장 구이터 서비스", time: "09:00 - 18:00 (상시)", content: "직접 잡은 신선한 산천어를 소금을 뿌려 은박지에 싸서 단 15분 만에 구워내는 대형 화로 구이터 운영" },
          { name: "매서운 한겨울 수중 '산천어 맨손잡기' 스포츠대회", time: "11:00 / 13:00 / 15:00", content: "반팔과 반바지 차림으로 대형 원형 풀장에 들어가 펄떡거리는 산천어를 온몸으로 잡는 이색 도전" },
          { name: "실내얼음조각광장 & 선등거리 불빛 점등", time: "17:00 - 21:00", content: "중국 하얼빈 조각 장인들이 정교하게 조각한 대형 얼음 건축물 전시 및 화천읍내 오색 선등거리 점등" }
        ]
      }
    }
  });

  // 18. 2026 안동국제탈춤페스티벌 (예정 - 2026년 9월 25일 ~ 10월 4일)
  await prisma.festival.create({
    data: {
      name: "2026 안동국제탈춤페스티벌",
      description: "신명나는 탈놀이와 대동 난장! '세계를 하나로 만드는 탈과 탈춤'을 테마로, 국가지정 무형문화재인 하회별신굿탈놀이와 전 세계의 다채로운 전통 민속 탈춤단이 한데 어우러져 거리 전체가 거대한 극장으로 변합니다.",
      region: "경북 안동시",
      address: "안동 탈춤공원 및 원도심 일원 (경상북도 안동시 육사로 239)",
      startDate: new Date("2026-09-25T10:00:00+09:00"),
      endDate: new Date("2026-10-04T22:00:00+09:00"),
      category: "CULTURE",
      officialUrl: "http://www.maskdance.com",
      imageUrl: "https://images.unsplash.com/photo-1506157786151-b8491531f063?w=800&auto=format&fit=crop",
      hasParking: true,
      hasShuttle: true,
      isPetFriendly: true,
      isChildFriendly: true,
      congestionStatus: "NORMAL",
      trustScore: 97,
      views: 395,
      status: "VERIFIED",
      sources: {
        create: [
          { name: "안동축제관광재단 아카이브", url: "http://www.maskdance.com", type: "LOCAL_GOV" }
        ]
      },
      programs: {
        create: [
          { name: "하회별신굿탈놀이 상설 마당극 공연", time: "11:00 / 15:00 (매일)", content: "하회마을에서 보존되어 온 양반, 선비, 각시, 초랭이 등 익살스러운 풍자와 해학의 하회 탈놀이 오리지널 무대" },
          { name: "세계 탈놀이 경연대회 & 대동 난장 퍼레이드", time: "야간 19:30 - 21:30", content: "전 세계 가면 댄스팀과 일반 시민들이 다 같이 가면을 쓰고 거리로 나와 댄스 일렉트릭 일탈을 즐기는 퍼레이드" },
          { name: "나만의 안동 전통 하회탈 조각 & 채색 체험 교실", time: "10:00 - 18:00", content: "나무나 한지를 이용해 직접 초랭이, 양반탈을 다듬고 오색 염료로 채색해보는 창작 아트 클래스" }
        ]
      }
    }
  });

  // 19. 제38회 여주도자기축제 (예정 - 2026년 5월 16일 ~ 5월 24일)
  await prisma.festival.create({
    data: {
      name: "제38회 여주도자기축제",
      description: "흙과 불, 그리고 예술의 만남! 여주 천년의 도자 역사 속에서 탄생한 현대적이고 실용적인 생활 자기부터 장인들의 명품 예술 도자기까지 한자리에서 감상하고 합리적인 가격에 구매할 수 있는 전통 공예 페스티벌입니다.",
      region: "경기 여주시",
      address: "신륵사 관광지 일원 (경기도 여주시 신륵사길 7)",
      startDate: new Date("2026-05-16T10:00:00+09:00"),
      endDate: new Date("2026-05-24T18:00:00+09:00"),
      category: "ART",
      officialUrl: "http://www.yeojuceramic.or.kr",
      imageUrl: "https://images.unsplash.com/photo-1576016770956-debb63d900ad?w=800&auto=format&fit=crop",
      hasParking: true,
      hasShuttle: true,
      isPetFriendly: true,
      isChildFriendly: true,
      congestionStatus: "NORMAL",
      trustScore: 93,
      views: 198,
      status: "VERIFIED",
      sources: {
        create: [
          { name: "여주세종문화관광재단 홍보팀", url: "http://www.yeojuceramic.or.kr", type: "LOCAL_GOV" }
        ]
      },
      programs: {
        create: [
          { name: "여주 도예 장인들의 물레 시연 & 흙 밟기 놀이", time: "11:00 / 14:00 (수시)", content: "도자 명장들이 즉석에서 거대한 백자 항아리를 빚어내는 환상적인 물레 퍼포먼스와 온 가족이 부드러운 도자 흙을 밟아보는 촉감 체험" },
          { name: "스트레스 타파! '여주 도자기 접시 깨기' 대회", time: "주말 15:00 - 16:30", content: "마음에 쌓인 스트레스를 적은 뒤, 도자 타겟을 향해 도자기 접시를 시원하게 던져 깨뜨리는 이색 엔터테인먼트 경연대회" },
          { name: "나만의 핸드메이드 도자기 물레 페인팅 체험", time: "상시 운영", content: "도자 물레를 직접 돌려 컵이나 접시 형태를 잡고, 은은한 안료로 손수 무늬를 그려 가마에 구워 배송받는 실용 체험" }
        ]
      }
    }
  });

  // 20. 2026 인천 부평풍물대축제 (예정 - 2026년 9월 18일 ~ 9월 20일)
  await prisma.festival.create({
    data: {
      name: "2026 인천 부평풍물대축제",
      description: "'두드려라! 울려라! 하나가 되라!' 8차선 부평대로를 통째로 막고 펼쳐지는 대한민국 유일의 거리 대풍물 축제입니다. 신명나는 소리와 몸짓, 그리고 국악과 현대 음악이 크로스오버되는 버스킹 축제의 정수를 맛보실 수 있습니다.",
      region: "인천 부평구",
      address: "부평대로 차 없는 거리 일원 (인천광역시 부평구 부평대로 24)",
      startDate: new Date("2026-09-18T11:00:00+09:00"),
      endDate: new Date("2026-09-20T21:30:00+09:00"),
      category: "MUSIC",
      officialUrl: "http://www.bpf.or.kr",
      imageUrl: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800&auto=format&fit=crop",
      hasParking: false,
      hasShuttle: false,
      isPetFriendly: true,
      isChildFriendly: true,
      congestionStatus: "NORMAL",
      trustScore: 95,
      views: 289,
      status: "VERIFIED",
      sources: {
        create: [
          { name: "부평구축제위원회 및 부평문화원 공식 가이드", url: "http://www.bpf.or.kr", type: "LOCAL_GOV" }
        ]
      },
      programs: {
        create: [
          { name: "인천/부평 연합 대풍물 퍼레이드 & 초대형 강강술래", time: "9/19 14:00 - 16:30", content: "1,000여 명의 연합 풍물패가 부평대로를 꽉 채우며 행진하는 퍼레이드와 대동 강강술래 연출" },
          { name: "청년 국악 크로스오버 버스킹 & 락 풍물 난장", time: "18:00 - 21:00 (상시)", content: "가야금, 대금 연주와 락 일렉트릭 사운드가 결합한 청년 밴드들의 야외 대동 락 콘서트" },
          { name: "퓨전 탈춤 힙합 댄스 배틀 및 길거리 야시장", time: "12:00 - 21:30", content: "전통 탈춤 춤사위를 재해석한 비보이/힙합 댄스 크루들의 역동적인 무대 및 부평 먹거리 푸드 마켓 운영" }
        ]
      }
    }
  });

  // 21. 제23회 광안리 어방축제 (진행했음 - 2026년 5월 8일 ~ 5월 10일)
  await prisma.festival.create({
    data: {
      name: "제23회 광안리 어방축제",
      description: "부산 광안리해수욕장에서 화려하게 열리는 옛 조선시대 수군 군영 축제! 광안대교의 찬란한 야경을 벗 삼아, 횃불을 켜고 그물을 던져 고기를 잡던 전통 어업 문화 '어방(漁坊)'을 재현하는 해변 체험형 고유 문화 축제입니다.",
      region: "부산 수영구",
      address: "광안리해수욕장 일원 (부산광역시 수영구 광안해변로 219)",
      startDate: new Date("2026-05-08T10:00:00+09:00"),
      endDate: new Date("2026-05-10T22:00:00+09:00"),
      category: "CULTURE",
      officialUrl: "http://www.suyeong.go.kr/eobang",
      imageUrl: "https://images.unsplash.com/photo-1548678957-f831e21b223c?w=800&auto=format&fit=crop",
      hasParking: true,
      hasShuttle: true,
      isPetFriendly: true,
      isChildFriendly: true,
      congestionStatus: "NORMAL",
      trustScore: 96,
      views: 521,
      status: "VERIFIED",
      sources: {
        create: [
          { name: "부산 수영구청 문화체육과 공식 포털", url: "http://www.suyeong.go.kr/eobang", type: "LOCAL_GOV" }
        ]
      },
      programs: {
        create: [
          { name: "대형 어방 뮤지컬 '진두어화(津頭漁火)' 밤바다 재현", time: "20:00 - 21:30 (매일)", content: "광안리 해변 앞바다에 배 수십 척이 횃불을 밝히며 전통 멸치잡이를 재현하고, 대교 레이저쇼와 함께하는 대형 야외 뮤지컬" },
          { name: "해변 맨손 활어 잡기 스포츠 & 어방 그물 끌기", time: "11:00 / 14:00 / 16:30", content: "모래사장 위 대형 풀장에 들어가 활어를 맨손으로 잡고, 전통 대형 그물을 협동하여 당겨보는 관객 액티브 놀이" },
          { name: "조선시대 경상좌수사 행렬 역사 고증 퍼레이드", time: "5/9 15:30 - 17:00", content: "좌수영 취타대, 수군 전통 무예 시연단, 조선 포졸 등 500여 명의 웅장한 가두 퍼레이드" }
        ]
      }
    }
  });

  // 8. 양평 용문산 산나물 축제 (진행했음 - 2026년 4월 24일 ~ 4월 26일)
  await prisma.festival.create({
    data: {
      name: "양평 용문산 산나물 축제",
      description: "양평의 대표 특산물인 건강한 산나물을 마음껏 즐기는 웰빙 봄 축제! '임금님 수라상'이라는 주제 아래 셰프와의 컬래버 요리 대회와 대규모 진상행렬, 그리고 반려견 피크닉존까지 대규모로 진행되었습니다.",
      region: "경기 양평군",
      address: "용문산 관광지 일원 (경기도 양평군 용문면 용문산로 782)",
      startDate: new Date("2026-04-24T10:00:00+09:00"),
      endDate: new Date("2026-04-26T18:00:00+09:00"),
      category: "FOOD",
      officialUrl: "https://www.ypsannamul.kr",
      imageUrl: "https://images.unsplash.com/photo-1547592180-85f173990554?w=800&auto=format&fit=crop",
      hasParking: true,
      hasShuttle: true,
      isPetFriendly: true,
      isChildFriendly: true,
      congestionStatus: "NORMAL",
      trustScore: 96,
      views: 289,
      status: "VERIFIED",
      sources: {
        create: [
          { name: "양평군 용문산산나물축제추진위원회", url: "https://www.ypsannamul.kr", type: "LOCAL_GOV" }
        ]
      },
      programs: {
        create: [
          { name: "산나물 임금님 진상 행렬 & 500인분 초대형 비빔밥", time: "4/24 11:00 - 13:00", content: "전통 고증 취타대 퍼레이드 및 주민과 함께 비비는 무료 나눔 시식 퍼포먼스" },
          { name: "김도윤 셰프와 함께하는 '산나물 녹색 요리교실'", time: "4/25 14:00 - 15:30", content: "스타 셰프의 친환경 레시피 전수 및 일반인 경연대회 피드백" },
          { name: "댕댕이와 산나물 피크닉존 (댕이트 엔 양평)", time: "상시 운영", content: "반려견 동반 가족들을 위한 펜스 설치 안전 놀이터 및 수제 유기농 산나물 간식 체험" }
        ]
      }
    }
  });

  // 9. 서천 자연산 광어·도미 축제 (진행했음 - 2026년 5월 1일 ~ 5월 17일)
  await prisma.festival.create({
    data: {
      name: "서천 자연산 광어·도미 축제",
      description: "서해 청정 앞바다에서 갓 건져 올린 자연산 활어의 짜릿한 맛과 바다 풍경의 만남! 마량진항의 그림 같은 낙조를 감상하며 어부 직송 신선한 광어와 도미를 합리적인 가격의 대규모 포장마차존에서 배부르게 맛보실 수 있습니다.",
      region: "충남 서천군",
      address: "서면 마량진항 일원 (충청남도 서천군 서면 마량리 339-2)",
      startDate: new Date("2026-05-01T10:00:00+09:00"),
      endDate: new Date("2026-05-17T22:00:00+09:00"),
      category: "FOOD",
      officialUrl: "https://www.seocheon.go.kr/tour",
      imageUrl: "https://images.unsplash.com/photo-1534482421-64566f976cfa?w=800&auto=format&fit=crop",
      hasParking: true,
      hasShuttle: false,
      isPetFriendly: false,
      isChildFriendly: true,
      congestionStatus: "HIGH",
      trustScore: 94,
      views: 341,
      status: "VERIFIED",
      sources: {
        create: [
          { name: "서천군청 문화관광 공식 포털", url: "https://www.seocheon.go.kr/tour/festival/flatfish", type: "LOCAL_GOV" }
        ]
      },
      programs: {
        create: [
          { name: "광어 맨손 잡기 체험 (어린이 및 가족 대상)", time: "주말 11:00 / 14:00", content: "대형 풀장에서 펄떡거리는 자연산 광어를 직접 맨손으로 포획하는 체험 스포츠" },
          { name: "마량진항 어부 직송 즉석 경매 및 수산시장", time: "16:00 - 17:00", content: "어부들이 갓 잡아온 횟감을 도매가 이하 즉흥 경매로 낙찰받는 행사" }
        ]
      }
    }
  });

  // 10. 춘천 레고랜드 어린이 야간개장 페스티벌 (진행했음 - 2026년 5월 3일 ~ 5월 5일)
  await prisma.festival.create({
    data: {
      name: "춘천 레고랜드 어린이 야간개장 페스티벌",
      description: "어린이날 골든위크를 맞아 펼쳐지는 가족 친화형 빛과 블록의 환상 축제! 오후 9시까지 이어지는 야간 연장 운영과 함께 오색빛 조명으로 빛나는 레고 빌리지 전체의 라이트쇼, 대형 미니 드론 불꽃쇼가 하늘을 가득 메웁니다.",
      region: "강원 춘천시",
      address: "레고랜드 코리아 리조트 일대 (강원특별자치도 춘천시 하중도길 128)",
      startDate: new Date("2026-05-03T10:00:00+09:00"),
      endDate: new Date("2026-05-05T21:00:00+09:00"),
      category: "ART",
      officialUrl: "https://www.legoland.kr",
      imageUrl: "https://images.unsplash.com/photo-1564981797816-1043d01117da?w=800&auto=format&fit=crop",
      hasParking: true,
      hasShuttle: true,
      isPetFriendly: false,
      isChildFriendly: true,
      congestionStatus: "HIGH",
      trustScore: 92,
      views: 421,
      status: "VERIFIED",
      sources: {
        create: [
          { name: "레고랜드 코리아 리조트 공식 운영캘린더", url: "https://www.legoland.kr", type: "LOCAL_GOV" }
        ]
      },
      programs: {
        create: [
          { name: "레고 빌리지 3D 미디어 라이트 파사드 쇼", time: "20:00 - 20:30", content: "초대형 레고 시계탑에 쏘아 올리는 인터랙티브 3D 맵핑 화려한 레이저쇼" },
          { name: "밤하늘 드론 불꽃놀이 피날레 (레고 시티 페스타)", time: "20:45 - 21:00", content: "300대의 레고 테마 드론이 연출하는 불꽃과 야간 드론 불꽃 스토리 쇼" },
          { name: "어린이날 특별 레고 캐릭터 특별 퍼레이드", time: "14:00 / 16:30", content: "레고 랜드 시그니처 프렌즈 피규어 인형들이 총출동하는 야외 댄스 퍼레이드" }
        ]
      }
    }
  });

  // 11. 미검수 제보 데이터 2건 (UserSubmission)
  await prisma.userSubmission.create({
    data: {
      name: "완도 전복 웰빙 시식 축제",
      description: "완도 해조류 센터 앞 야외 광장에서 열리는 무료 전복 시식 및 직판 행사입니다. 주민 제보로 제보되었습니다.",
      region: "전남 완도군",
      address: "완도읍 해변공원로 84 (완도해조류센터 야외광장)",
      dateRange: "2026-06-10 ~ 2026-06-12",
      category: "FOOD",
      sourceUrl: "http://www.wando.go.kr/news/123",
      submitterEmail: "wando_abalone@daum.net",
      submitterContact: "010-8888-9999",
      status: "PENDING"
    }
  });

  await prisma.userSubmission.create({
    data: {
      name: "파주 헤이리 마을 골목 플리마켓",
      description: "헤이리 예술마을 청년 공예 작가들이 여는 친환경 아날로그 가죽/도자기 플리마켓 행사입니다. 소규모 소박한 행사입니다.",
      region: "경기 파주시",
      address: "탄현면 헤이리마을길 70-21 일원",
      dateRange: "2026-06-06 ~ 2026-06-07",
      category: "ART",
      sourceUrl: "https://heyri.net/board/market",
      submitterEmail: "artpaju@naver.com",
      submitterContact: "010-1234-5678",
      status: "PENDING"
    }
  });

  console.log("✅ 실물 데이터 시딩 완료!");
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
