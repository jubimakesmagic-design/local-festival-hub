// scratch/mass-seed.ts
import { PrismaClient } from "@prisma/client";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import path from "path";

const adapter = new PrismaBetterSqlite3({
  url: "file:" + path.resolve(process.cwd(), "prisma/dev.db")
});
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("🧹 기존 데이터 삭제 중...");
  await prisma.festivalProgram.deleteMany();
  await prisma.festivalSource.deleteMany();
  await prisma.festival.deleteMany();
  await prisma.userSubmission.deleteMany();

  console.log("🌱 대한민국 대표 실물 축제 41선 적재 시작...");

  const festivalsData = [
    {
      name: "제64회 진해군항제",
      description: "대한민국 최대 규모의 봄꽃 축제! 36만 그루의 왕벚나무가 일제히 꽃망울을 터트려 장관을 이루는 여좌천 로망스다리, 경화역 철길을 따라 해군의 요람이자 모항인 진해에서 펼쳐지는 봄의 대향연입니다.",
      region: "경남 창원시",
      address: "경상남도 창원시 진해구 통신동 중원로터리 및 여좌천 일원",
      startDate: new Date("2026-03-25T09:00:00+09:00"),
      endDate: new Date("2026-04-03T22:00:00+09:00"),
      category: "NATURE",
      officialUrl: "http://culture.changwon.go.kr",
      imageUrl: "/images/jinhae_gunhangje.png",
      hasParking: true,
      hasShuttle: true,
      isPetFriendly: true,
      isChildFriendly: true,
      congestionStatus: "HIGH",
      trustScore: 99,
      views: 1240,
      status: "VERIFIED",
      sources: [
        { name: "창원시 공식 축제 포털", url: "http://culture.changwon.go.kr", type: "LOCAL_GOV" }
      ],
      programs: [
        { name: "여좌천 로망스다리 벚꽃 별빛쇼", time: "18:00 - 22:00", content: "여좌천 꽃터널 아래 화려하게 펼쳐지는 경관조명 및 일루미네이션 쇼" },
        { name: "진해 군악의장 페스티벌", time: "상시 운영", content: "육해공군 및 해병대 군악의장대의 절도 있고 웅장한 의장 퍼레이드" }
      ]
    },
    {
      name: "제29회 보령 머드축제",
      description: "전 세계인이 온몸에 진흙을 바르고 하나 되는 글로벌 대표 해변 축제! 대천해수욕장의 깨끗한 머드를 원료로 개발된 대형 머드탕, 슬라이드, 머드 몹신, 컬러 머드 체험 등 짜릿하고 다이내믹한 즐거움을 선사합니다.",
      region: "충남 보령시",
      address: "충청남도 보령시 신흑동 대천해수욕장 머드광장 일원",
      startDate: new Date("2026-07-17T10:00:00+09:00"),
      endDate: new Date("2026-07-26T18:00:00+09:00"),
      category: "CULTURE",
      officialUrl: "https://www.mudfestival.or.kr",
      imageUrl: "/images/boryeong_mud.png",
      hasParking: true,
      hasShuttle: true,
      isPetFriendly: false,
      isChildFriendly: true,
      congestionStatus: "HIGH",
      trustScore: 100,
      views: 980,
      status: "VERIFIED",
      sources: [
        { name: "보령축제관광재단 공식 누리집", url: "https://www.mudfestival.or.kr", type: "LOCAL_GOV" }
      ],
      programs: [
        { name: "대형 머드탕 & 머드 슬라이드", time: "10:00 - 18:00", content: "초대형 에어바운스 슬라이드와 머드탕 속에서 벌어지는 게임 스포츠" },
        { name: "머드 몹신 (Mud Mob Scene)", time: "13:30 / 16:00", content: "EDM 음악과 함께 공중에서 쏟아지는 머드 물포를 맞으며 춤추는 댄스 파티" }
      ]
    },
    {
      name: "2026 안동국제탈춤페스티벌",
      description: "한국의 미와 흥을 세계에 알리는 신명나는 탈춤의 대향연! 국가지정 무형문화재인 하회별신굿탈놀이와 세계 각국의 다채로운 전통 가면극단이 모여 탈과 탈춤을 테마로 거리를 거대한 문화 무대로 만듭니다.",
      region: "경북 안동시",
      address: "경상북도 안동시 육사로 239 안동 탈춤공원 및 원도심 일원",
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
      trustScore: 98,
      views: 740,
      status: "VERIFIED",
      sources: [
        { name: "안동축제관광재단 공식 고시", url: "http://www.maskdance.com", type: "LOCAL_GOV" }
      ],
      programs: [
        { name: "하회별신굿탈놀이 상설 공연", time: "11:00 / 15:00", content: "역사와 전통을 자랑하는 하회탈놀이의 해학과 유쾌한 마당극 무대" },
        { name: "세계 탈놀이 경연대회 및 대동 난장", time: "19:30 - 21:00", content: "관람객과 공연단이 모두 가면을 쓰고 어우러져 춤추는 대규모 댄스 퍼레이드" }
      ]
    },
    {
      name: "2026 진주남강유등축제",
      description: "임진왜란 진주성 전투의 역사적 숨결이 흐르는 남강 위에 평화와 희망의 유등 수만 개를 띄우는 대한민국 대표 빛 축제! 물, 불, 빛이 한데 어우러지는 촉석루와 남강의 환상적인 야경을 수놓습니다.",
      region: "경남 진주시",
      address: "경상남도 진주시 본성동 415 진주성 및 남강 일원",
      startDate: new Date("2026-10-03T18:00:00+09:00"),
      endDate: new Date("2026-10-18T23:00:00+09:00"),
      category: "CULTURE",
      officialUrl: "http://www.yudeung.com",
      imageUrl: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=800&auto=format&fit=crop",
      hasParking: true,
      hasShuttle: true,
      isPetFriendly: true,
      isChildFriendly: true,
      congestionStatus: "HIGH",
      trustScore: 99,
      views: 1120,
      status: "VERIFIED",
      sources: [
        { name: "진주문화예술재단 축제위원회", url: "http://www.yudeung.com", type: "LOCAL_GOV" }
      ],
      programs: [
        { name: "남강 유등 띄우기 & 소망등 터널", time: "18:00 - 23:00", content: "소망을 적어 강에 유등을 직접 띄워 보내고 4만 개의 터널 속을 산책하는 힐링 코스" },
        { name: "남강 워터라이트 레이저 미디어쇼", time: "20:00 / 22:00", content: "남강 물길을 따라 화려하게 펼쳐지는 특수 레이저 및 대형 드론 쇼" }
      ]
    },
    {
      name: "2026 화천산천어축제",
      description: "세계 4대 겨울 축제로 꼽히는 대한민국 대표 겨울 얼음 축제! 맑고 깨끗한 화천천 30cm 얼음판 위에서 얼음낚시와 차가운 물속으로 들어가 맨손으로 산천어를 잡아 즉석에서 구워 먹는 최고의 쾌감을 선사합니다.",
      region: "강원 화천군",
      address: "강원특별자치도 화천군 화천읍 산천어길 137 화천천 일원",
      startDate: new Date("2026-01-10T09:00:00+09:00"),
      endDate: new Date("2026-02-01T18:00:00+09:00"),
      category: "FOOD",
      officialUrl: "http://www.narafestival.com",
      imageUrl: "https://images.unsplash.com/photo-1518084478521-41f89a2e6427?w=800&auto=format&fit=crop",
      hasParking: true,
      hasShuttle: true,
      isPetFriendly: false,
      isChildFriendly: true,
      congestionStatus: "HIGH",
      trustScore: 97,
      views: 890,
      status: "VERIFIED",
      sources: [
        { name: "재단법인 나라 공식 사이트", url: "http://www.narafestival.com", type: "LOCAL_GOV" }
      ],
      programs: [
        { name: "산천어 얼음낚시 & 대형 숯불구이터", time: "09:00 - 18:00", content: "얼음 낚시터에서 직접 잡은 산천어를 15분 만에 맛있게 숯불에 구워내는 현장 미식 서비스" },
        { name: "산천어 맨손잡기 스포츠", time: "11:00 / 13:00 / 15:00", content: "매서운 얼음바람 속 반팔 반바지 차림으로 풀장에 뛰어들어 산천어를 움켜쥐는 이색 체험" }
      ]
    },
    {
      name: "2026 담양 대나무축제",
      description: "푸르른 죽녹원의 대나무 숲길과 관방제림의 고즈넉한 정취가 흐르는 대표 힐링 문화 축제! 대나무의 청정한 기운 속에서 야간 미디어 파사드, 밤하늘 드론 불빛쇼, 대나무 물총 서바이벌 등 다채로운 친환경 놀이가 어우러집니다.",
      region: "전남 담양군",
      address: "전라남도 담양군 담양읍 죽녹원로 119 죽녹원 및 관방천 일원",
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
      views: 650,
      status: "VERIFIED",
      sources: [
        { name: "담양군 대나무축제추진위원회", url: "http://www.bamboofestival.co.kr", type: "LOCAL_GOV" }
      ],
      programs: [
        { name: "드론 라이팅 쇼 & 죽녹원 야간 개장", time: "19:30 - 21:00", content: "500대의 미니 드론이 수놓는 대나무 모양 야경과 고즈넉한 밤의 대숲 힐링 산책" },
        { name: "대나무 뗏목 타기 및 대나무 물총 쏘기", time: "상시 운영", content: "관방천 맑은 물 위에서 즐기는 대나무 뗏목과 패밀리 시원한 물놀이 배틀" }
      ]
    },
    {
      name: "제49회 보성다향대축제",
      description: "초록빛 물결이 파도치는 아름다운 보성 다원에서 펼쳐지는 웰니스 차 문화 축제! 한국의 천년 차 문화를 체험하며, 신선한 햇찻잎 따기, 전통 수제 차 덖기, 다례 명인 시연 등 초록의 오월 향기에 취해보세요.",
      region: "전남 보성군",
      address: "전라남도 보성군 보성읍 녹차로 983 한국차소리문화공원 일원",
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
      trustScore: 98,
      views: 520,
      status: "VERIFIED",
      sources: [
        { name: "보성군청 관광 공식 포털", url: "http://dahyang.boseong.go.kr", type: "LOCAL_GOV" }
      ],
      programs: [
        { name: "수제 차 만들기 & 찻잎 따기 체험", time: "10:00 - 17:00", content: "푸른 다원에서 찻잎을 직접 채취해 솥에 뜨겁게 덖어보며 수제 차를 직접 제작" },
        { name: "보성 그린 힐링 음악회 (이찬원, YB 등)", time: "5/2 19:00", content: "드넓은 차 밭을 무대로 울려 퍼지는 록 밴드와 대세 가수들의 초록 콘서트" }
      ]
    },
    {
      name: "2026 강릉단오제",
      description: "천년의 역사를 자랑하며 유네스코 인류무형문화유산에 등재된 국내 최대 규모의 종합 민속 축제! 대관령 산신제, 신주 빚기부터 영신행차 퍼레이드, 관노가면극 무료 야외극, 대동 신명나는 단오굿이 펼쳐집니다.",
      region: "강원 강릉시",
      address: "강원특별자치도 강릉시 노암동 9-3 강릉 남대천 행사정 일원",
      startDate: new Date("2026-06-15T09:00:00+09:00"),
      endDate: new Date("2026-06-22T22:00:00+09:00"),
      category: "CULTURE",
      officialUrl: "http://www.danojefestival.or.kr",
      imageUrl: "https://images.unsplash.com/photo-1538481199705-c710c4e965fc?w=800&auto=format&fit=crop",
      hasParking: true,
      hasShuttle: true,
      isPetFriendly: true,
      isChildFriendly: true,
      congestionStatus: "HIGH",
      trustScore: 100,
      views: 710,
      status: "VERIFIED",
      sources: [
        { name: "강릉단오제위원회 공식 아카이브", url: "http://www.danojefestival.or.kr", type: "LOCAL_GOV" }
      ],
      programs: [
        { name: "단오 신명나는 영신행차 퍼레이드", time: "일정 내 야간", content: "시민들과 농악단이 한데 어우러져 남대천 행사장까지 횃불과 등을 들고 걷는 풍물 행진" },
        { name: "무언 가면희 '관노가면극' 무료 공연", time: "14:00 / 17:00", content: "한국 유일의 대사 없이 춤과 몸짓으로만 해학과 정감을 연출하는 무형문화재 공연" }
      ]
    },
    {
      name: "제44회 금산세계인삼축제",
      description: "하늘이 내린 선물, 금산 인삼의 모든 효능을 한자리에서 느끼는 웰니스 건강 대축제! 직접 흙투성이 인삼밭에 들어가 심마니가 되어 크고 알찬 수삼을 캐보는 영양 가득한 체험과 삼계탕 페스타가 어우러집니다.",
      region: "충남 금산군",
      address: "충청남도 금산군 금산읍 인삼광장로 30 금산인삼관 일원",
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
      trustScore: 97,
      views: 480,
      status: "VERIFIED",
      sources: [
        { name: "금산축제관광재단 공식 누리집", url: "http://www.insamfestival.co.kr", type: "LOCAL_GOV" }
      ],
      programs: [
        { name: "금산 진짜 인삼 캐기 체험", time: "10:00 - 16:30", content: "실제 인삼 다원에서 심마니가 되어 삽으로 크고 단단한 수삼을 캐보는 액티브 농가 체험" },
        { name: "홍삼 스파 & 천연 인삼 족욕관", time: "상시 운영", content: "홍삼을 듬뿍 우려낸 뜨거운 족욕 스파탕에 발을 담그는 웰니스 피로회복 힐링 서비스" }
      ]
    },
    {
      name: "제33회 태백산 눈축제",
      description: "눈부신 은빛으로 물든 태백산 국립공원 아래 펼쳐지는 신비로운 겨울 동화의 세계! 전 세계 눈 조각 거장들이 공들여 빚은 메머드급 초대형 눈조각 전시와 눈썰매장, 겨울 등반대회가 활기차게 운영됩니다.",
      region: "강원 태백시",
      address: "강원특별자치도 태백시 소도동 325 태백산국립공원 당골광장 일원",
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
      trustScore: 95,
      views: 410,
      status: "VERIFIED",
      sources: [
        { name: "태백시 공식 축제 공시", url: "http://tbsnow.or.kr", type: "LOCAL_GOV" }
      ],
      programs: [
        { name: "초대형 눈조각 전시 & 이색 눈 미로", time: "09:00 - 17:00", content: "세계의 대성당이나 상상 속의 동물을 대규모 하얀 눈더미 위에 정교하게 조각한 거장 전시회" },
        { name: "태백산 눈꽃 전국 등반대회", time: "1/25 09:00", content: "순백의 눈꽃과 서리꽃이 장관을 이루는 태백산 천제단까지 겨울 등반가들의 산악 축제" }
      ]
    },
    {
      name: "양평 용문산 산나물 축제",
      description: "양평의 용문산 깊은 골짜기에서 자라 임금님 수라상에 올랐던 귀한 친환경 산나물의 향연! 싱그러운 봄 향기와 함께 500인분 초대형 나물 비빔밥 비비기 퍼포먼스, 반려견 피크닉 등 친환경 웰빙 파티입니다.",
      region: "경기 양평군",
      address: "경기도 양평군 용문면 용문산로 782 용문산 관광지 일원",
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
      views: 330,
      status: "VERIFIED",
      sources: [
        { name: "양평군 산나물축제추진위원회", url: "https://www.ypsannamul.kr", type: "LOCAL_GOV" }
      ],
      programs: [
        { name: "임금님 진상 행렬 & 500인분 비빔밥 비비기", time: "4/24 11:00", content: "궁중 진상 행렬을 고증하여 재현하고 시민들이 다 함께 비빈 비빔밥을 무료로 시식" },
        { name: "댕댕이 동반 산나물 소풍 피크닉", time: "상시 운영", content: "반려가족을 위해 넓은 잔디 공원에 마련한 펜스 놀이터 및 유기농 반려견 전용 간식 코너" }
      ]
    },
    {
      name: "서천 자연산 광어·도미 축제",
      description: "서해 마량진항 앞바다에서 갓 잡아 올려 쫄깃하고 달콤한 자연산 활어 맛의 대잔치! 붉게 물드는 아름다운 마량진항 낙조 아래, 수변 야외 천막 식당에서 시세보다 훨씬 알찬 가격에 미식을 만끽할 수 있습니다.",
      region: "충남 서천군",
      address: "충청남도 서천군 서면 마량리 339-2 마량진항 일원",
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
      trustScore: 95,
      views: 390,
      status: "VERIFIED",
      sources: [
        { name: "서천군청 공식 문화관광 포털", url: "https://www.seocheon.go.kr/tour", type: "LOCAL_GOV" }
      ],
      programs: [
        { name: "어린이 광어 맨손 잡기 스포츠", time: "주말 11:00 / 14:00", content: "모래사장 위 대형 에어바운스 풀장 속 펄떡거리는 광어들을 두 손으로 직접 낚는 어린이 게임" },
        { name: "마량진항 즉석 어부 직송 수산물 경매", time: "16:00 - 17:00", content: "현장에서 경매사의 입담과 함께 저렴한 도매 가격에 횟감을 직거래로 낙찰받는 행사" }
      ]
    },
    {
      name: "2026 인천 부평풍물대축제",
      description: "왕복 8차선 부평대로를 이틀간 전면 통제하고 도로 위에서 흥겹게 질주하는 국내 유일의 초대형 대풍물 거리 축제! 전통 국악 장단과 현대 일렉트로닉/락 사운드가 결합한 버스킹 등 소리의 카타르시스를 맛볼 수 있습니다.",
      region: "인천 부평구",
      address: "인천광역시 부평구 부평대로 24 부평대로 차 없는 거리 일원",
      startDate: new Date("2026-09-18T11:00:00+09:00"),
      endDate: new Date("2026-09-20T21:30:00+09:00"),
      category: "MUSIC",
      officialUrl: "http://www.bpf.or.kr",
      imageUrl: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800&auto=format&fit=crop",
      hasParking: false,
      hasShuttle: false,
      isPetFriendly: true,
      isChildFriendly: true,
      congestionStatus: "HIGH",
      trustScore: 98,
      views: 450,
      status: "VERIFIED",
      sources: [
        { name: "부평구축제위원회 및 풍물원 가이드", url: "http://www.bpf.or.kr", type: "LOCAL_GOV" }
      ],
      programs: [
        { name: "1000명 연합 대풍물 퍼레이드", time: "9/19 14:00", content: "부평대로를 가득 채우며 징, 괭과리, 장구 소리와 함께 진군하는 초대형 민속 가두 퍼레이드" },
        { name: "청년 락풍물 크로스오버 콘서트", time: "19:00 - 21:00", content: "일렉트릭 락 밴드와 상모돌리기 풍물패가 함께 무대 위에서 펼치는 격정적인 콜라보 콘서트" }
      ]
    },
    {
      name: "제23회 광안리 어방축제",
      description: "눈부신 광안대교 야경 아래 모래사장에서 역동적으로 만나는 옛 수군 군영 축제! 조선시대 해군 전통 어업 기지였던 어방(漁坊)의 멸치 그물 끌기 문화를 고증하여 해변 마당에서 펼치는 독보적인 체험형 축제입니다.",
      region: "부산 수영구",
      address: "부산광역시 수영구 광안해변로 219 광안리해수욕장 일원",
      startDate: new Date("2026-05-08T10:00:00+09:00"),
      endDate: new Date("2026-05-10T22:00:00+09:00"),
      category: "CULTURE",
      officialUrl: "http://www.suyeong.go.kr/eobang",
      imageUrl: "https://images.unsplash.com/photo-1548678957-f831e21b223c?w=800&auto=format&fit=crop",
      hasParking: true,
      hasShuttle: true,
      isPetFriendly: true,
      isChildFriendly: true,
      congestionStatus: "HIGH",
      trustScore: 99,
      views: 780,
      status: "VERIFIED",
      sources: [
        { name: "수영구청 문화관광과 공식 안내", url: "http://www.suyeong.go.kr/eobang", type: "LOCAL_GOV" }
      ],
      programs: [
        { name: "밤바다 대형 뮤지컬 '진두어화'", time: "20:00 - 21:30", content: "밤의 광안리 바다 위에 횃불을 밝힌 배 수십 척이 진격하며 멸치잡이를 고증하는 야외 뮤지컬" },
        { name: "조선 수군 경상좌수사 가두 퍼레이드", time: "5/9 15:30", content: "전통 고증 군악대와 갑옷 수군, 포졸 500여 명이 수변 도로를 가로지르는 웅장한 퍼레이드" }
      ]
    },
    {
      name: "제26회 이천쌀문화축제",
      description: "황금 들녘 이천에서 수확한 기름진 햅쌀의 맛을 만끽하는 최고의 농촌 추수 대동 대잔치! 600m 길이의 무지개 가래떡 만들기 기네스 도전, 대형 가마솥에 장작불을 때서 2000인분의 기름진 가마솥 쌀밥 비벼 나눔하기 등이 진행됩니다.",
      region: "경기 이천시",
      address: "경기도 이천시 모가면 공원로 169 이천농업테마공원 일원",
      startDate: new Date("2026-10-14T10:00:00+09:00"),
      endDate: new Date("2026-10-18T18:00:00+09:00"),
      category: "FOOD",
      officialUrl: "https://www.2000rice.co.kr",
      imageUrl: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800&auto=format&fit=crop",
      hasParking: true,
      hasShuttle: true,
      isPetFriendly: true,
      isChildFriendly: true,
      congestionStatus: "NORMAL",
      trustScore: 98,
      views: 440,
      status: "VERIFIED",
      sources: [
        { name: "이천쌀문화축제 추진위원회", url: "https://www.2000rice.co.kr", type: "LOCAL_GOV" }
      ],
      programs: [
        { name: "이천이천인분 가마솥 쌀밥 시식 나눔", time: "12:00 / 14:00", content: "초대형 무쇠 가마솥에 장작 불을 지펴 보슬보슬 지어낸 햅쌀밥에 나물을 비벼 단돈 2,000원에 나눔 시식" },
        { name: "600m 기네스 무지개 가래떡 뽑기", time: "주말 수시", content: "수많은 참가자들이 함께 긴 무지개 색 가래떡을 끊어지지 않고 뽑아 나눠 가지는 대동 스포츠" }
      ]
    },
    {
      name: "제33회 광주세계김치축제",
      description: "맛과 멋의 고장 광주에서 열리는 유네스코 창의도시 광주의 자랑, 세계 김치 대축제! 김치 장인 명인들의 숨겨진 비법을 배우는 김치 아카데미, 산지 직배송 양념으로 버무리는 대규모 김장 장터 등 미식 가득한 웰빙 축제입니다.",
      region: "광주 남구",
      address: "광주광역시 남구 김치로 60 광주김치타운 일원",
      startDate: new Date("2026-10-23T10:00:00+09:00"),
      endDate: new Date("2026-10-26T20:00:00+09:00"),
      category: "FOOD",
      officialUrl: "https://kimchi.gwangju.go.kr",
      imageUrl: "https://images.unsplash.com/photo-1584269600464-37b1b58a9fe7?w=800&auto=format&fit=crop",
      hasParking: true,
      hasShuttle: true,
      isPetFriendly: false,
      isChildFriendly: true,
      congestionStatus: "NORMAL",
      trustScore: 97,
      views: 310,
      status: "VERIFIED",
      sources: [
        { name: "광주광역시 문화체육관광 포털", url: "https://kimchi.gwangju.go.kr", type: "LOCAL_GOV" }
      ],
      programs: [
        { name: "대한민국 김치 명인 콘테스트 & 전시회", time: "11:00 - 16:30", content: "최고의 김치 장인을 뽑는 요리 본선전과 명인들이 빚은 독보적인 전통 김치 전시회" },
        { name: "광주 맛집 배추 김장 담그기 대장터", time: "상시 운영", content: "절임배추와 특제 양념을 현장에서 알찬 공장 가격에 사서 직접 김장을 담가 택배로 보내는 체험" }
      ]
    },
    {
      name: "2026 순천만 국가정원 갈대축제",
      description: "대한민국 제1호 국가정원이자 유네스코 세계자연유산인 순천만습지에서 화려하게 펼쳐지는 가을 갈대의 대향연! 해을 넘기는 황금빛 노을 아래 서정적인 피아노 연주와 습지 힐링 도보 투어를 체험할 수 있는 최고 힐링 여행입니다.",
      region: "전남 순천시",
      address: "전라남도 순천시 국가정원호반로 47 순천만국가정원 및 습지 일원",
      startDate: new Date("2026-10-15T09:00:00+09:00"),
      endDate: new Date("2026-10-31T20:00:00+09:00"),
      category: "NATURE",
      officialUrl: "https://scbay.suncheon.go.kr",
      imageUrl: "https://images.unsplash.com/photo-1500627869374-13cd993b1115?w=800&auto=format&fit=crop",
      hasParking: true,
      hasShuttle: true,
      isPetFriendly: false,
      isChildFriendly: true,
      congestionStatus: "HIGH",
      trustScore: 100,
      views: 940,
      status: "VERIFIED",
      sources: [
        { name: "순천만국가정원 운영포털", url: "https://scbay.suncheon.go.kr", type: "LOCAL_GOV" }
      ],
      programs: [
        { name: "노을 갈대밭 클래식 콘서트", time: "17:00 - 18:30", content: "갈대 숲길 사이로 지는 낙조를 바라보며 감상하는 서정적인 야외 클래식/어쿠스틱 공연" },
        { name: "순천만습지 에코 숲길 전문 해설 투어", time: "상시 운영", content: "전문 에코 해설사와 함께 갈대밭 데크길을 횡단하며 야생 조류와 생태를 탐방하는 힐링 걷기" }
      ]
    },
    {
      name: "2026 울산대공원 장미축제",
      description: "화려한 오월, 수백만 송이의 전 세계 명품 장미들이 울산대공원 장미계곡을 가득 메우는 눈부신 봄 축제! 은은한 장미 향기와 함께 미디어 맵핑 레이저 파사드, 국내 최정상 뮤지션들의 밤빛 로맨스 음악회가 함께 열립니다.",
      region: "울산 남구",
      address: "울산광역시 남구 대공원로 94 울산대공원 장미원 일원",
      startDate: new Date("2026-05-20T09:00:00+09:00"),
      endDate: new Date("2026-05-25T22:00:00+09:00"),
      category: "NATURE",
      officialUrl: "https://www.ulsan.go.kr",
      imageUrl: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=800&auto=format&fit=crop",
      hasParking: true,
      hasShuttle: false,
      isPetFriendly: true,
      isChildFriendly: true,
      congestionStatus: "NORMAL",
      trustScore: 97,
      views: 390,
      status: "VERIFIED",
      sources: [
        { name: "울산광역시청 관광 공고", url: "https://www.ulsan.go.kr/tour", type: "LOCAL_GOV" }
      ],
      programs: [
        { name: "미디어 아트로 빛나는 장미 파사드 라이트쇼", time: "20:00 - 21:30", content: "은빛 장미 정원 전체에 쏘아 올리는 감각적인 입체 3D 홀로그램 및 일루미네이션 쇼" },
        { name: "오감 힐링 장미 다도 & 천연 향수 교실", time: "11:00 - 17:00", content: "향기로운 장미꽃차 무료 시음과 자신만의 천연 장미 향수를 조향하여 소장해가는 창작 클래스" }
      ]
    },
    {
      name: "제28회 함평 나비대축제",
      description: "나비와 꽃, 곤충이 어우러지는 친환경 생태 체험 축제! 화려한 봄꽃 정원에서 날아다니는 수만 마리의 아름다운 나비와 함께 다채로운 자연 생태 전시, 친환경 농경 체험을 온 가족이 함께 즐겨보세요.",
      region: "전남 함평군",
      address: "전라남도 함평군 함평읍 곤재로 27 함평엑스포공원 일원",
      startDate: new Date("2026-04-28T09:00:00+09:00"),
      endDate: new Date("2026-05-07T18:00:00+09:00"),
      category: "NATURE",
      officialUrl: "https://www.hampyeong.go.kr/expo",
      imageUrl: "https://images.unsplash.com/photo-1560717789-0ac7c58ac90a?w=800&auto=format&fit=crop",
      hasParking: true,
      hasShuttle: true,
      isPetFriendly: true,
      isChildFriendly: true,
      congestionStatus: "NORMAL",
      trustScore: 99,
      views: 520,
      status: "VERIFIED",
      sources: [
        { name: "함평엑스포공원 공식 사이트", url: "https://www.hampyeong.go.kr/expo", type: "LOCAL_GOV" }
      ],
      programs: [
        { name: "날아라 나비야 야외 날리기 체험", time: "11:00 / 14:00", content: "어린이들이 예쁜 나비를 야외 정원에 손으로 직접 날려 보내며 교감하는 생태 교육 스포츠" },
        { name: "열대 곤충 및 VR 나비 숲 탐험관", time: "상시 운영", content: "가상현실 안경을 착용하고 거대한 판타지 나비 숲길 속을 여행해 보는 어린이 미래 테마파크" }
      ]
    },
    {
      name: "제40회 이천 도자기축제",
      description: "대한민국 대표 도자 예술의 고장 이천에서 열리는 명품 도자 축제! 100여 개가 넘는 도자 공방들이 참여하는 세련되고 감각적인 리빙 도자기 마켓, 명장들의 물레 시연, 직접 구워가는 흙놀이 클래스가 펼쳐집니다.",
      region: "경기 이천시",
      address: "경기도 이천시 신둔면 도자예술로 52 이천도자예술마을 예스파크 일원",
      startDate: new Date("2026-04-24T10:00:00+09:00"),
      endDate: new Date("2026-05-03T18:00:00+09:00"),
      category: "ART",
      officialUrl: "https://www.icheon.go.kr/ceramic",
      imageUrl: "https://images.unsplash.com/photo-1576016770956-debb63d900ad?w=800&auto=format&fit=crop",
      hasParking: true,
      hasShuttle: true,
      isPetFriendly: true,
      isChildFriendly: true,
      congestionStatus: "NORMAL",
      trustScore: 98,
      views: 430,
      status: "VERIFIED",
      sources: [
        { name: "이천시청 관광과 공식 가이드", url: "https://www.icheon.go.kr", type: "LOCAL_GOV" }
      ],
      programs: [
        { name: "여주 도예 명장의 물레 페인팅 숯 가마 쇼", time: "주말 14:00", content: "이천 최고의 도자 장인이 즉석에서 물레를 연출해 대형 항아리를 빚고 그림을 새기는 퍼포먼스" },
        { name: "나만의 리빙 컵 도자기 구워가기", time: "상시 운영", content: "돌아가는 물레 위 흙을 직접 컵으로 빚고, 초벌 자기에 무늬를 칠해 가마에 구워 택배로 배송" }
      ]
    },
    {
      name: "제28회 제주 들불축제",
      description: "제주의 대표 전통 역사 생태 문화 축제! 무사 안녕과 한 해의 풍요로운 행복을 기원하며 제주의 푸른 자연 새별오름 전체에 들불을 놓는 웅장한 불과 빛의 스토리 쇼가 밤하늘을 수놓습니다.",
      region: "제주 제주시",
      address: "제주특별자치도 제주시 애월읍 봉성리 산59-8 새별오름 일원",
      startDate: new Date("2026-03-12T14:00:00+09:00"),
      endDate: new Date("2026-03-15T21:00:00+09:00"),
      category: "CULTURE",
      officialUrl: "https://www.jejurelease.or.kr",
      imageUrl: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=800&auto=format&fit=crop",
      hasParking: true,
      hasShuttle: true,
      isPetFriendly: false,
      isChildFriendly: true,
      congestionStatus: "HIGH",
      trustScore: 99,
      views: 740,
      status: "VERIFIED",
      sources: [
        { name: "제주 관광공사 공식 가이드", url: "https://www.visitjeju.net", type: "LOCAL_GOV" }
      ],
      programs: [
        { name: "오름 전체 활활 태우기 '들불 놓기' 피날레", time: "3/14 19:30 - 21:00", content: "축구장 수십 개 크기의 새별오름 억새 밭에 일제히 방화선을 켜 대형 불의 파도를 연출하는 대장관" },
        { name: "제주 마상 마무 무예 쇼 & 횃불 행진", time: "16:00 / 18:30", content: "몽골리안 마상 무예단의 고난이도 달리는 말 위 묘기 및 달집 주변 횃불 기원 행렬" }
      ]
    },
    {
      name: "2026 영암 왕인문화축제",
      description: "찬란한 백제 문화를 꽃피운 왕인박사의 뜻을 기리는 전통 인문 예술 축제! 벚꽃이 흐드러지게 흩날리는 백제 유적지에서 수백 명의 재현팀이 펼치는 대규모 행렬 퍼레이드와 로컬 풍물 장터가 흥겨움을 더합니다.",
      region: "전남 영암군",
      address: "전라남도 영암군 군서면 임백로 340 왕인박사유적지 일원",
      startDate: new Date("2026-04-02T10:00:00+09:00"),
      endDate: new Date("2026-04-05T18:00:00+09:00"),
      category: "CULTURE",
      officialUrl: "http://www.yeongam.go.kr/home/plaza",
      imageUrl: "https://images.unsplash.com/photo-1506157786151-b8491531f063?w=800&auto=format&fit=crop",
      hasParking: true,
      hasShuttle: true,
      isPetFriendly: true,
      isChildFriendly: true,
      congestionStatus: "NORMAL",
      trustScore: 96,
      views: 310,
      status: "VERIFIED",
      sources: [
        { name: "영암군 문화재 포털", url: "http://www.yeongam.go.kr", type: "LOCAL_GOV" }
      ],
      programs: [
        { name: "백제 왕인박사 일본 도도 행렬 퍼레이드", time: "4/4 14:00 - 16:30", content: "백제 전통 의상을 입은 취타대와 신하들 500명이 영암 시내에서 강가까지 행진하는 역사 복원 대퍼레이드" },
        { name: "구림 로컬 한옥마을 다도 & 전통 한지 체험", time: "상시 운영", content: "전통 구림 마을 고택 툇마루에서 즐기는 따뜻한 차 시음과 한지 전통 조명 등 만들기" }
      ]
    },
    {
      name: "2026 부산국제록페스티벌",
      description: "대한민국에서 가장 깊은 역사와 낭만을 간직한 메이저 야외 록/인디 페스티벌! 삼락생태공원의 광활한 잔디 정원 위에서 세계 정상급 아티스트들과 청춘 관객들이 격정적인 슬램과 에너지를 나누는 록의 해방구입니다.",
      region: "부산 사상구",
      address: "부산광역시 사상구 삼락동 29-61 삼락생태공원 일원",
      startDate: new Date("2026-10-02T12:00:00+09:00"),
      endDate: new Date("2026-10-04T22:00:00+09:00"),
      category: "MUSIC",
      officialUrl: "https://www.busanrockfestival.com",
      imageUrl: "https://images.unsplash.com/photo-1501386761578-eac5c94b800a?w=800&auto=format&fit=crop",
      hasParking: true,
      hasShuttle: true,
      isPetFriendly: false,
      isChildFriendly: false,
      congestionStatus: "HIGH",
      trustScore: 99,
      views: 890,
      status: "VERIFIED",
      sources: [
        { name: "부산문화관광축제조직위원회", url: "https://www.busanrockfestival.com", type: "LOCAL_GOV" }
      ],
      programs: [
        { name: "메인 '삼락 스테이지' 국내외 헤드라이너 라이브", time: "14:00 - 22:00", content: "초호화 다국적 글로벌 밴드 및 국내 최정상 인디 록 밴드들의 압도적인 라이브 사운드" },
        { name: "그린 바이브 피크닉존 & 록앤롤 푸드 스트리트", time: "상시 운영", content: "돗자리를 펴고 누워 즐기는 서브 스테이지 버스킹과 시원한 수제 맥주 가득한 푸드트럭 숲" }
      ]
    },
    {
      name: "제44회 단양 소백산 철쭉제",
      description: "연분홍 철쭉꽃으로 물든 장엄한 소백산 국립공원의 봄 절경을 배경으로 열리는 꽃의 축제! 남한강 물길을 따라 설계된 상상의 거리 광장에서 펼쳐지는 소백산 철쭉 가요제, 숲속 어쿠스틱 콘서트가 펼쳐집니다.",
      region: "충북 단양군",
      address: "충청북도 단양군 단양읍 상상의 거리 및 소백산 일원",
      startDate: new Date("2026-05-21T09:00:00+09:00"),
      endDate: new Date("2026-05-24T18:00:00+09:00"),
      category: "NATURE",
      officialUrl: "https://www.danyang.go.kr",
      imageUrl: "https://images.unsplash.com/photo-1461988310307-d11d0b9e4a35?w=800&auto=format&fit=crop",
      hasParking: true,
      hasShuttle: false,
      isPetFriendly: true,
      isChildFriendly: true,
      congestionStatus: "NORMAL",
      trustScore: 96,
      views: 290,
      status: "VERIFIED",
      sources: [
        { name: "단양군 문화관광 아카이브", url: "https://www.danyang.go.kr", type: "LOCAL_GOV" }
      ],
      programs: [
        { name: "소백산 철쭉 힐링 전국 등반대회", time: "5/23 09:00", content: "철쭉 군락지가 하얗고 분홍빛으로 활짝 핀 소백산 연화봉 코스를 등산하며 정화하는 운동" },
        { name: "수변 잔디광장 퓨전 국악 철쭉 버스킹", time: "16:00 - 18:00", content: "단양강 선선한 강바람 속 울려 퍼지는 현대 해금, 가야금 앙상블의 무료 라이브" }
      ]
    },
    {
      name: "제27회 하동 야생차문화축제",
      description: "천년 왕의 녹차, 참 좋은 하동 야생 차! 지리산 자락 아래 첫 야생 차 나무 시배지에서 은은한 녹차의 향과 정취를 느끼는 웰니스 문화 축제입니다. 명품 다례 시연과 찻잎 수확, 다도 교실이 진행됩니다.",
      region: "경남 하동군",
      address: "경상남도 하동군 화개면 쌍계사길 57 하동 야생차박물관 일원",
      startDate: new Date("2026-05-01T09:00:00+09:00"),
      endDate: new Date("2026-05-05T18:00:00+09:00"),
      category: "CULTURE",
      officialUrl: "http://www.hadong.go.kr/tea",
      imageUrl: "https://images.unsplash.com/photo-1597481499750-3e6b22637e12?w=800&auto=format&fit=crop",
      hasParking: true,
      hasShuttle: true,
      isPetFriendly: false,
      isChildFriendly: true,
      congestionStatus: "NORMAL",
      trustScore: 98,
      views: 310,
      status: "VERIFIED",
      sources: [
        { name: "하동군청 공식 야생차 포털", url: "http://www.hadong.go.kr", type: "LOCAL_GOV" }
      ],
      programs: [
        { name: "다원에서 찻잎 따기 & 나만의 차 가공", time: "10:00 - 16:30", content: "명품 다원의 신선한 찻잎을 꺾어 가공실에서 덖고 부벼 봉투에 밀봉해 가져가는 나만의 티메이킹" },
        { name: "천년 고찰 쌍계사 숲길 녹차 웰니스 도보 투어", time: "상시 운영", content: "천년 숲길의 대나무 소리를 들으며 해설사와 함께 명상 숲을 걷고 시음하는 걷기" }
      ]
    },
    {
      name: "제33회 연천 구석기축제",
      description: "전 세계 고고학 교과서를 바꾼 아슐리안형 주먹도끼 유적의 고장 연천에서 벌어지는 선사 유적 모험! 전곡리 유적지 잔디광장 일원에서 구석기인들이 고기를 화로에 구워 먹던 방식을 흥미진진하게 재현합니다.",
      region: "경기 연천군",
      address: "경기도 연천군 전곡읍 양연로 1510 전곡리 유적 일원",
      startDate: new Date("2026-05-02T10:00:00+09:00"),
      endDate: new Date("2026-05-05T21:00:00+09:00"),
      category: "CULTURE",
      officialUrl: "https://www.yeoncheon.go.kr/gooseokgi",
      imageUrl: "https://images.unsplash.com/photo-1564981797816-1043d01117da?w=800&auto=format&fit=crop",
      hasParking: true,
      hasShuttle: true,
      isPetFriendly: true,
      isChildFriendly: true,
      congestionStatus: "NORMAL",
      trustScore: 97,
      views: 430,
      status: "VERIFIED",
      sources: [
        { name: "연천군청 선사유적관리단", url: "https://www.yeoncheon.go.kr", type: "LOCAL_GOV" }
      ],
      programs: [
        { name: "100m 길이의 '구석기 숯불 바베큐' 체험", time: "10:30 - 18:00", content: "직접 구석기 꼬챙이에 끼운 생고기를 메머드급 대형 야외 숯 화로 터에서 노릇하게 직접 구워 맛보는 미식 캠핑" },
        { name: "세계 선사 고고학 주먹도끼 석기 제작 쇼", time: "상시 운영", content: "외국 저명 고고학 학자들이 직접 흑요석 등을 깨뜨려 주먹도끼 사냥 석기를 빚어내는 교육 세미나" }
      ]
    },
    {
      name: "제23회 홍성 남당항 새조개축제",
      description: "서해 청정 보물 남당항에서 한겨울~봄 최고의 미식을 느끼는 제철 새조개 축제! 새의 머리와 부리 모양을 똑 닮아 새조개라 불리며 쫄깃한 식감과 천연 아미노산 단맛이 풍성한 명품 조개를 합리적인 상인 가격에 즐깁니다.",
      region: "충남 홍성군",
      address: "충청남도 홍성군 서부면 남당항로 213 남당항 일원",
      startDate: new Date("2026-01-23T09:00:00+09:00"),
      endDate: new Date("2026-03-31T22:00:00+09:00"),
      category: "FOOD",
      officialUrl: "https://www.hongseong.go.kr/tour",
      imageUrl: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800&auto=format&fit=crop",
      hasParking: true,
      hasShuttle: false,
      isPetFriendly: true,
      isChildFriendly: true,
      congestionStatus: "NORMAL",
      trustScore: 96,
      views: 290,
      status: "VERIFIED",
      sources: [
        { name: "홍성군청 축제 공고실", url: "https://www.hongseong.go.kr", type: "LOCAL_GOV" }
      ],
      programs: [
        { name: "남당항 명품 새조개 샤브샤브 먹거리존", time: "10:00 - 22:00", content: "신선한 채소 맑은 육수에 싱싱한 새조개를 단 5초간 담가 데쳐 먹는 남당항 오리지널 식당가 운영" },
        { name: "주말 수산물 깜짝 반값 경매 스포츠", time: "주말 14:00", content: "제철 새조개, 주꾸미, 키조개를 즉석에서 도매 반값에 입찰하여 박스째 수령해 가는 현장 낙찰 대잔치" }
      ]
    },
    {
      name: "제22회 영양 산나물축제",
      description: "전국 최저 미세먼지와 최고 청정 자연을 자부하는 영양의 일월산 깊은 숲의 기운을 수확하는 웰빙 먹거리 축제! 참나물, 곰취, 취나물 등 향긋하고 연한 산나물을 농민 직접 직판장 부스에서 만나볼 수 있습니다.",
      region: "경북 영양군",
      address: "경상북도 영양군 영양읍 군민회관길 18 군민회관 및 일월산 일원",
      startDate: new Date("2026-05-07T10:00:00+09:00"),
      endDate: new Date("2026-05-10T18:00:00+09:00"),
      category: "FOOD",
      officialUrl: "http://www.yyg.go.kr/tour",
      imageUrl: "https://images.unsplash.com/photo-1547592180-85f173990554?w=800&auto=format&fit=crop",
      hasParking: true,
      hasShuttle: false,
      isPetFriendly: true,
      isChildFriendly: true,
      congestionStatus: "NORMAL",
      trustScore: 97,
      views: 310,
      status: "VERIFIED",
      sources: [
        { name: "영양축제관광재단 공식 고시", url: "http://www.yyg.go.kr", type: "LOCAL_GOV" }
      ],
      programs: [
        { name: "일월산 맑은 산나물 수확 체험 투어", time: "09:00 - 15:00", content: "일월산 산자락의 자연 다원을 해설사와 동행하며 부드러운 산나물을 등바구니에 직접 따 담는 체험" },
        { name: "영양 특산 산나물 나들이 야외 비빔밥 페스타", time: "12:00", content: "일월산 참나물과 영양 고추장 소스를 곁들여 대형 나무 솥에 비빈 전통 비빔밥 무료 시식" }
      ]
    },
    {
      name: "장항항 수산물 꼴갑축제",
      description: "이색적인 이름만큼이나 제철 꼴뚜기와 갑오징어 미식의 진수를 맛볼 수 있는 유쾌한 수산물 축제! 서천의 넓은 갯벌과 서해 조류에서 키운 살이 두툼한 갑오징어 숙회/회무침과 쫄깃하고 부드러운 꼴뚜기를 먹습니다.",
      region: "충남 서천군",
      address: "충청남도 서천군 장항읍 장항항 물양장 일원",
      startDate: new Date("2026-05-29T10:00:00+09:00"),
      endDate: new Date("2026-06-07T22:00:00+09:00"),
      category: "FOOD",
      officialUrl: "https://www.seocheon.go.kr/tour",
      imageUrl: "/images/kkolgap_festival.png",
      hasParking: true,
      hasShuttle: false,
      isPetFriendly: true,
      isChildFriendly: true,
      congestionStatus: "NORMAL",
      trustScore: 96,
      views: 450,
      status: "VERIFIED",
      sources: [
        { name: "서천군 서면 수산업협동조합 공지", url: "https://www.seocheon.go.kr", type: "LOCAL_GOV" }
      ],
      programs: [
        { name: "제철 꼴뚜기 무침 & 갑오징어 튀김 미식가 광장", time: "10:00 - 22:00", content: "장항항 바닷바람을 맞으며 야외 데크에서 꼴뚜기 회와 고소한 갑오징어 튀김을 맛보는 수변 광장" },
        { name: "맨손 수산물 잡기 대동 낚시 배틀", time: "주말 수시", content: "원형 대형 풀장에서 맨손으로 제철 갑오징어와 참광어를 움켜잡아 전리품으로 가져가는 게임" }
      ]
    },
    {
      name: "제26회 무주반딧불축제",
      description: "대한민국 천연기념물 제322호 반딧불이와 함께하는 청정 환경 생태 축제! 깊어가는 여름밤 무주의 깨끗한 계곡 속을 거닐며 어둠 속에서 스스로 영롱한 빛줄기를 쏘아 올리는 반딧불이를 직접 탐험하는 감동적인 힐링입니다.",
      region: "전북 무주군",
      address: "전북특별자치도 무주군 무주읍 한풍루로 326 지남공원 및 반딧불이 서식지 일원",
      startDate: new Date("2026-08-29T10:00:00+09:00"),
      endDate: new Date("2026-09-06T22:00:00+09:00"),
      category: "NATURE",
      officialUrl: "http://www.firefly.or.kr",
      imageUrl: "https://images.unsplash.com/photo-1502082553048-f009c37129b9?w=800&auto=format&fit=crop",
      hasParking: true,
      hasShuttle: true,
      isPetFriendly: false,
      isChildFriendly: true,
      congestionStatus: "NORMAL",
      trustScore: 98,
      views: 520,
      status: "VERIFIED",
      sources: [
        { name: "무주반딧불축제 제전위원회", url: "http://www.firefly.or.kr", type: "LOCAL_GOV" }
      ],
      programs: [
        { name: "한밤의 반딧불이 신비 서식지 탐사 (선착순 신청)", time: "19:30 - 22:00", content: "안내 전문가와 숲속 깊은 서식지로 들어서서 어두운 밤하늘 수만 마리 은빛 반딧불이 군무를 관찰" },
        { name: "남대천 반디 낙화놀이 & 드론 파이어웍스 쇼", time: "20:30", content: "남대천 강물 위를 가로지르는 전통 낙화 줄불놀이와 대형 드론 조명이 만드는 야간 피날레" }
      ]
    },
    {
      name: "제16회 청도반시축제",
      description: "대한민국 유일의 씨 없는 맛있는 감, 청도 반시(盤枾)를 널리 알리는 주홍빛 가을 미식 축제! 과육이 연하고 수분이 가득한 주홍빛 감을 수확하고 시식하며, 청도 소싸움 경기장과 연계해 액티브하게 진행됩니다.",
      region: "경북 청도군",
      address: "경상북도 청도군 화양읍 동천길 113 청도 야외공연장 일원",
      startDate: new Date("2026-10-09T10:00:00+09:00"),
      endDate: new Date("2026-10-11T18:00:00+09:00"),
      category: "FOOD",
      officialUrl: "http://www.cheongdobansi.co.kr",
      imageUrl: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800&auto=format&fit=crop",
      hasParking: true,
      hasShuttle: true,
      isPetFriendly: true,
      isChildFriendly: true,
      congestionStatus: "NORMAL",
      trustScore: 97,
      views: 280,
      status: "VERIFIED",
      sources: [
        { name: "청도군청 문화관광과 공식 안내", url: "http://www.cheongdo.go.kr", type: "LOCAL_GOV" }
      ],
      programs: [
        { name: "청도 명품 반시 따기 & 곶감 깎기 교실", time: "상시 운영", content: "감 과수원에 직접 들어가 씨 없는 감을 따고 전통 기계로 감 껍질을 깎아 곶감을 매다는 체험" },
        { name: "반시 퓨전 베이커리 & 디저트 미식마켓", time: "11:00 - 17:30", content: "감 타르트, 감 샌드위치, 감 막걸리 등 오직 청도에서만 맛보는 과일 레시피 마켓" }
      ]
    },
    {
      name: "제27회 영덕대게축제",
      description: "고려 태조 왕건 수라상에 올랐던 천년 미식, 영덕 대게의 진미를 만나는 대표적인 동해 미식 대축제! 강구항 해변 물양장 일원 야외 천막 시장가에서 살이 꽉 찬 대게를 쪄서 김이 모락모락 나는 다리를 뜯는 행복을 안겨줍니다.",
      region: "경북 영덕군",
      address: "경상북도 영덕군 강구면 강구항 일원",
      startDate: new Date("2026-02-26T09:00:00+09:00"),
      endDate: new Date("2026-03-01T18:00:00+09:00"),
      category: "FOOD",
      officialUrl: "http://www.ydcrabfestival.com",
      imageUrl: "https://images.unsplash.com/photo-1534482421-64566f976cfa?w=800&auto=format&fit=crop",
      hasParking: true,
      hasShuttle: true,
      isPetFriendly: true,
      isChildFriendly: true,
      congestionStatus: "HIGH",
      trustScore: 98,
      views: 740,
      status: "VERIFIED",
      sources: [
        { name: "영덕대게축제추진위원회 고시실", url: "http://www.ydcrabfestival.com", type: "LOCAL_GOV" }
      ],
      programs: [
        { name: "영덕 대게 깜짝 즉석 경매 (초저렴)", time: "11:00 / 14:30 / 16:30", content: "강구항 위판장에서 진짜 영덕 대게를 감정 가격 절반 이하에 즉흥 경매로 획득하는 축제의 꽃" },
        { name: "영덕대게 싣고 달리기 거리 릴레이", time: "주말 수시", content: "시민들과 상인들이 함께 대형 대게 모형 리어카를 몰고 장애물 코스를 달려 상품을 타는 운동" }
      ]
    },
    {
      name: "제44회 진도 신비의 바닷길 축제",
      description: "세계적으로 널리 알려진 한국판 '모세의 기적'! 조수간만의 차로 인하여 진도 회동리와 의신면 모도리 사이 바다가 약 2.8km 폭 40m로 완전히 갈라져 갯벌 바닥이 드러나는 장엄한 자연 경관을 직접 횡단하며 걷는 명품 축제입니다.",
      region: "전남 진도군",
      address: "전라남도 진도군 고군면 회동리 일원",
      startDate: new Date("2026-03-28T15:00:00+09:00"),
      endDate: new Date("2026-03-31T19:00:00+09:00"),
      category: "CULTURE",
      officialUrl: "https://www.jindo.go.kr",
      imageUrl: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&auto=format&fit=crop",
      hasParking: true,
      hasShuttle: true,
      isPetFriendly: true,
      isChildFriendly: true,
      congestionStatus: "HIGH",
      trustScore: 100,
      views: 820,
      status: "VERIFIED",
      sources: [
        { name: "진도군청 관광 홍보 포털", url: "https://www.jindo.go.kr/tour", type: "LOCAL_GOV" }
      ],
      programs: [
        { name: "신비의 바닷길 횃불 횡단 걷기", time: "갈라지는 시간대 (주로 오후)", content: "바닷길이 열리는 시점에 일제히 갯벌 바닥으로 내려가 횃불을 들고 모도 섬까지 걸어가 보는 모험" },
        { name: "진도 전통 민속 북놀이 & 강강술래", time: "행사 기간 수시", content: "바닷가 백사장을 배경으로 울려 퍼지는 진도 특유의 힘찬 북놀이와 오리지널 강강술래 한마당" }
      ]
    },
    {
      name: "제26회 기장 멸치 축제",
      description: "부산 기장 대변항의 파도를 가르고 잡아 올린 통통한 봄 멸치의 쫄깃하고 고소한 미식 대축제! 현장에서 바로 뼈를 발라 미나리 양념장에 새콤하게 비벼낸 멸치회와 노릇한 멸치구이 냄새가 포구를 가득 채웁니다.",
      region: "부산 기장군",
      address: "부산광역시 기장군 기장읍 대변항 일원",
      startDate: new Date("2026-04-24T10:00:00+09:00"),
      endDate: new Date("2026-04-26T22:00:00+09:00"),
      category: "FOOD",
      officialUrl: "http://www.gijang.go.kr/tour",
      imageUrl: "https://images.unsplash.com/photo-1534482421-64566f976cfa?w=800&auto=format&fit=crop",
      hasParking: true,
      hasShuttle: false,
      isPetFriendly: true,
      isChildFriendly: true,
      congestionStatus: "HIGH",
      trustScore: 97,
      views: 310,
      status: "VERIFIED",
      sources: [
        { name: "기장군청 공식 대변항 가이드", url: "http://www.gijang.go.kr", type: "LOCAL_GOV" }
      ],
      programs: [
        { name: "대변항 포구 기장 멸치회 무료 시식회", time: "12:00 - 13:30", content: "대형 양푼에 기장 멸치와 상큼한 나물들을 가득 비벼 선착순 관광객 1000명에게 무료 나눔" },
        { name: "대변 수변 부스 멸치 구이 연탄 파티", time: "상시 운영", content: "항구 부두에 연탄 화로 테이블을 깔고 통통한 대형 멸치에 소금을 뿌려 구워 맛보는 선창 미식" }
      ]
    },
    {
      name: "제63회 수원화성문화제",
      description: "조선 22대 정조대왕의 원대한 효심과 부국강병의 꿈이 서려 있는 수원화성 성곽을 배경으로 펼쳐지는 초대형 역사 문화 축제! 정조대왕 능행차 공동 재현 퍼레이드와 화려한 화성 야간 낙성연이 장관을 연출합니다.",
      region: "경기 수원시",
      address: "경기도 수원시 팔달구 정조로 825 수원화성 행궁 및 연무대 일원",
      startDate: new Date("2026-10-09T09:00:00+09:00"),
      endDate: new Date("2026-10-12T22:00:00+09:00"),
      category: "CULTURE",
      officialUrl: "http://www.shcf.or.kr",
      imageUrl: "https://images.unsplash.com/photo-1564981797816-1043d01117da?w=800&auto=format&fit=crop",
      hasParking: true,
      hasShuttle: true,
      isPetFriendly: true,
      isChildFriendly: true,
      congestionStatus: "HIGH",
      trustScore: 99,
      views: 940,
      status: "VERIFIED",
      sources: [
        { name: "수원문화재단 공식 누리집", url: "http://www.shcf.or.kr", type: "LOCAL_GOV" }
      ],
      programs: [
        { name: "정조대왕 능행차 완벽 고증 퍼레이드", time: "10/10 13:00 - 17:00", content: "서울에서 수원화성까지 행진하는 군마, 장수, 나인 1,500명이 수원 성벽 아래 통과하는 초대형 복원 쇼" },
        { name: "창룡문 낙성연 야간 미디어 레이저쇼", time: "20:00", content: "화성 창룡문 성벽을 스크린 삼아 화려하게 수놓는 야간 파이어 미디어 맵핑 레이저 파사드" }
      ]
    },
    {
      name: "제38회 춘천 마임 축제",
      description: "몸짓, 몸 소리, 그리고 현대 마임의 진수! 춘천 수변 공원을 비롯한 거리 곳곳을 아방가르드하고 역동적인 예술 놀이터로 바꾸는 아시아 대표 공연 예술 페스티벌입니다. 물의 도시 춘천에서 소리와 불의 짜릿함을 선사합니다.",
      region: "강원 춘천시",
      address: "강원특별자치도 춘천시 평화로 26 춘천 삼천동 수변공원 및 시내 거리 일원",
      startDate: new Date("2026-05-24T13:00:00+09:00"),
      endDate: new Date("2026-05-31T23:30:00+09:00"),
      category: "ART",
      officialUrl: "http://www.mimefestival.com",
      imageUrl: "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?w=800&auto=format&fit=crop",
      hasParking: true,
      hasShuttle: true,
      isPetFriendly: true,
      isChildFriendly: true,
      congestionStatus: "NORMAL",
      trustScore: 98,
      views: 310,
      status: "VERIFIED",
      sources: [
        { name: "춘천마임축제 사무국 공시", url: "http://www.mimefestival.com", type: "LOCAL_GOV" }
      ],
      programs: [
        { name: "아수라장 (Water Festival) 개막 퍼포먼스", time: "5/24 13:00", content: "도로 통제 후 일반 관객들과 마임 예술가들이 음악에 맞춰 대형 물대포 물총 싸움을 즐기는 개막 댄스" },
        { name: "도깨비 난장 (Fire & Body Art Night)", time: "금/토 20:00 - 02:00", content: "밤새도록 춘천 강변 수변 공원에서 벌어지는 격렬한 불 조각 예술 마임과 아방가르드 댄스 밤샘 난장" }
      ]
    },
    {
      name: "제28회 원주 한지 문화제",
      description: "은은하고 강인한 우리의 전통 종이 한지(韓紙)의 참 매력을 담은 창작 공예 페스티벌! 원주 한지테마파크 전체 정원에 형형색색의 오색 한지 등 수천 개를 점등하여 환상적인 오색 조명 터널을 걷는 예술적 순간을 선물합니다.",
      region: "강원 원주시",
      address: "강원특별자치도 원주시 한지공원길 151 원주한지테마파크 일원",
      startDate: new Date("2026-05-02T10:00:00+09:00"),
      endDate: new Date("2026-05-06T21:00:00+09:00"),
      category: "ART",
      officialUrl: "http://www.wonjuhanji.co.kr",
      imageUrl: "https://images.unsplash.com/photo-1461988310307-d11d0b9e4a35?w=800&auto=format&fit=crop",
      hasParking: true,
      hasShuttle: false,
      isPetFriendly: true,
      isChildFriendly: true,
      congestionStatus: "NORMAL",
      trustScore: 96,
      views: 210,
      status: "VERIFIED",
      sources: [
        { name: "원주한지문화제 위원회", url: "http://www.wonjuhanji.co.kr", type: "LOCAL_GOV" }
      ],
      programs: [
        { name: "오색 한지 등불 터널 야간 점등", time: "18:00 - 21:00", content: "마을 주민들과 아티스트들이 손수 빚은 오색 한지 캐릭터 등 3000개가 정원에 일제히 켜지는 힐링 산책길" },
        { name: "전통 방식 한지 뜨기 & 창작 조명 제작", time: "상시 운영", content: "수조 속 닥나무 풀을 대 발로 직접 떠서 한지 종이를 제조하고, 직접 무늬를 놓아 조명을 조립" }
      ]
    },
    {
      name: "2026 풍기인삼축제",
      description: "소백산 맑은 바람과 비옥한 토양에서 자라 육질이 단단하고 향이 깊은 풍기 인삼의 맛과 건강 대잔치! 영주 서천 둔치 행사장에서 은은한 삼 향기와 함께, 진짜 삼 밭에서 수삼을 수확하고 맛보는 웰니스 힐링 여행입니다.",
      region: "경북 영주시",
      address: "경상북도 영주시 풍기읍 남원천변 행사 광장 일원",
      startDate: new Date("2026-10-10T10:00:00+09:00"),
      endDate: new Date("2026-10-18T20:00:00+09:00"),
      category: "FOOD",
      officialUrl: "http://www.punggiinsam.com",
      imageUrl: "https://images.unsplash.com/photo-1584269600464-37b1b58a9fe7?w=800&auto=format&fit=crop",
      hasParking: true,
      hasShuttle: true,
      isPetFriendly: false,
      isChildFriendly: true,
      congestionStatus: "NORMAL",
      trustScore: 97,
      views: 310,
      status: "VERIFIED",
      sources: [
        { name: "영주시청 관광진흥과 공식 가이드", url: "http://www.yeongju.go.kr", type: "LOCAL_GOV" }
      ],
      programs: [
        { name: "소백산 진짜 풍기 인삼 캐기 여행", time: "10:00 - 16:00", content: "인삼 농장에 등반하여 영양을 듬뿍 머금은 6년근 풍기 수삼을 직접 삽으로 캐서 수확" },
        { name: "풍기 인삼 튀김 & 삼 맥주 수변 광장", time: "상시 운영", content: "바삭하고 달콤 쌉싸름한 초대형 인삼 튀김과 시원한 인삼 가공 맥주를 수변 부스에서 맛보는 미식 광장" }
      ]
    },
    {
      name: "제28회 문경 찻사발 축제",
      description: "흙, 불, 그리고 장인의 손길로 빚어낸 한국 전통 도자기 사발의 역사적인 숨결! 문경새재 도립공원의 아름다운 숲길 고택 세트장에서 펼쳐지는 역사 도예 마켓과 발물레 시연, 망댕이가마 전통 굽기 체험이 진행됩니다.",
      region: "경북 문경시",
      address: "경상북도 문경시 문경읍 새재로 932 문경새재 오픈세트장 일원",
      startDate: new Date("2026-04-25T10:00:00+09:00"),
      endDate: new Date("2026-05-03T18:00:00+09:00"),
      category: "ART",
      officialUrl: "http://www.sabal21.com",
      imageUrl: "https://images.unsplash.com/photo-1576016770956-debb63d900ad?w=800&auto=format&fit=crop",
      hasParking: true,
      hasShuttle: true,
      isPetFriendly: true,
      isChildFriendly: true,
      congestionStatus: "NORMAL",
      trustScore: 98,
      views: 290,
      status: "VERIFIED",
      sources: [
        { name: "문경문화관광재단 공식 고시", url: "http://www.sabal21.com", type: "LOCAL_GOV" }
      ],
      programs: [
        { name: "명장의 문경 전통 망댕이가마 불 지피기 시연", time: "일정 내 주말", content: "흙 벽돌로 빚은 한국 전통 망댕이 가마에 장작을 때서 1300도 고온으로 찻사발을 굽는 전통 예술 시연" },
        { name: "나만의 다례 사발 빚기 & 말차 시음", time: "상시 운영", content: "도자 흙을 조물조물 만져 사발을 형태 잡고, 은은한 도자기에 우려낸 제주 말차를 전통 다례로 맛보는 코스" }
      ]
    },
    {
      name: "제28회 봉화 은어 축제",
      description: "오염되지 않은 깨끗한 봉화 낙동강 상류의 맑은 물에서 자란 은빛 영양 가득 은어와의 짜릿한 여름 전쟁! 내성천 수변공원 시원한 물웅덩이 속으로 그물과 반두를 들고 들어가 은어를 쫓는 다이내믹한 힐링 스포츠입니다.",
      region: "경북 봉화군",
      address: "경상북도 봉화군 봉화읍 내성천변 체육공원 일원",
      startDate: new Date("2026-07-25T09:00:00+09:00"),
      endDate: new Date("2026-08-02T18:00:00+09:00"),
      category: "FOOD",
      officialUrl: "http://www.bhsilverfish.co.kr",
      imageUrl: "https://images.unsplash.com/photo-1518084478521-41f89a2e6427?w=800&auto=format&fit=crop",
      hasParking: true,
      hasShuttle: false,
      isPetFriendly: false,
      isChildFriendly: true,
      congestionStatus: "HIGH",
      trustScore: 97,
      views: 540,
      status: "VERIFIED",
      sources: [
        { name: "봉화군 축제운영위원회 가이드", url: "http://www.bhsilverfish.co.kr", type: "LOCAL_GOV" }
      ],
      programs: [
        { name: "내성천 반두 들고 은어 잡기 스포츠", time: "10:30 / 13:30 / 15:30", content: "수천 명의 참가자들과 함께 내성천 맑은 물속으로 들어가 전통 반두 그물로 은어를 포획하는 액티브" },
        { name: "잡은 은어 현장 참숯 구이터 서비스", time: "상시 운영", content: "직접 잡은 신선한 수박 향이 가득한 은어를 소금을 뿌려 은박지에 감싸 참숯 그릴 화로에 노릇하게 구워 먹기" }
      ]
    },
    {
      name: "제26회 산청 한방 약초 축제",
      description: "지리산의 정기와 건강한 기운이 자라나는 청정 고장 산청에서 몸과 마음의 기운을 다스리는 웰니스 건강 대축제! 기품 있는 동의보감촌 한옥마을에서 즐기는 전통 약초 마켓, 체질 진단 족욕 등 한방 힐링의 끝을 맛보세요.",
      region: "경남 산청군",
      address: "경상남도 산청군 금서면 동의보감로 555 동의보감촌 일원",
      startDate: new Date("2026-09-26T10:00:00+09:00"),
      endDate: new Date("2026-10-05T18:00:00+09:00"),
      category: "FOOD",
      officialUrl: "http://www.scherb.or.kr",
      imageUrl: "https://images.unsplash.com/photo-1584269600464-37b1b58a9fe7?w=800&auto=format&fit=crop",
      hasParking: true,
      hasShuttle: true,
      isPetFriendly: false,
      isChildFriendly: true,
      congestionStatus: "NORMAL",
      trustScore: 98,
      views: 380,
      status: "VERIFIED",
      sources: [
        { name: "산청군청 한방산업과 가이드", url: "http://www.sancheong.go.kr", type: "LOCAL_GOV" }
      ],
      programs: [
        { name: "동의보감촌 기 바위체험 & 한방 약초 족욕", time: "상시 운영", content: "지리산의 좋은 기를 뿜는 거대 기바위를 만져 소망을 빌고 따뜻한 한방 약재물에 발을 씻는 족욕 테라피" },
        { name: "나만의 보약 쌍화차 웰니스 덖기 교실", time: "11:00 / 15:00", content: "산청 토종 약재 9가지를 전문가와 직접 가공하여 주머니에 넣어 가져가 끓여 마시는 창작 한방 교실" }
      ]
    }
  ];

  for (const fest of festivalsData) {
    try {
      const created = await prisma.festival.create({
        data: {
          name: fest.name,
          description: fest.description,
          region: fest.region,
          address: fest.address,
          startDate: fest.startDate,
          endDate: fest.endDate,
          category: fest.category,
          officialUrl: fest.officialUrl,
          imageUrl: fest.imageUrl,
          hasParking: fest.hasParking,
          hasShuttle: fest.hasShuttle,
          isPetFriendly: fest.isPetFriendly,
          isChildFriendly: fest.isChildFriendly,
          congestionStatus: fest.congestionStatus,
          trustScore: fest.trustScore,
          views: fest.views,
          status: fest.status,
          sources: {
            create: fest.sources
          },
          programs: {
            create: fest.programs
          }
        }
      });
      console.log(`✅ [성공] ${created.name} 등록 완료 (ID: ${created.id})`);
    } catch (e) {
      console.error(`❌ [에러] ${fest.name} 등록 중 예외 발생:`, e);
    }
  }

  console.log(`🎉 대한민국 대표 실물 축제 35선 데이터베이스 안전 적재 완료!`);
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
