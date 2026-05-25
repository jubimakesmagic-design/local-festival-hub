// prisma/mass-festivals.ts
// 전국 축제 대량 시딩 데이터 (봄·여름·가을·겨울)
// 기존 seed.ts 22개 축제와 중복되지 않는 약 92개 축제

import { PrismaClient } from "@prisma/client";

// 카테고리별 Unsplash 이미지
const CATEGORY_IMAGES: Record<string, string> = {
  FOOD: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800&auto=format&fit=crop",
  NATURE: "https://images.unsplash.com/photo-1490750967868-88aa4f44baee?w=800&auto=format&fit=crop",
  CULTURE: "https://images.unsplash.com/photo-1533669955142-6a73332af4db?w=800&auto=format&fit=crop",
  ART: "https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=800&auto=format&fit=crop",
  MUSIC: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800&auto=format&fit=crop",
  OTHER: "https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=800&auto=format&fit=crop",
};

interface FestivalInput {
  name: string;
  description: string;
  region: string;
  address: string;
  startDate: string;
  endDate: string;
  category: string;
  officialUrl: string;
  hasParking: boolean;
  hasShuttle: boolean;
  isPetFriendly: boolean;
  isChildFriendly: boolean;
}

// ── 봄 축제 데이터 (28개) ──
const springFestivals: FestivalInput[] = [
  {"name":"광양 매화축제","description":"전남 광양 매화마을 일원에서 열리는 봄의 첫 꽃 축제. 섬진강변의 하얀 매화꽃이 만개하며 매실 체험과 지역 먹거리를 즐길 수 있습니다.","region":"전남 광양시","address":"전라남도 광양시 다압면 매화마을 일원","startDate":"2026-03-13","endDate":"2026-03-22","category":"NATURE","officialUrl":"https://gwangyang.go.kr/tour","hasParking":true,"hasShuttle":true,"isPetFriendly":true,"isChildFriendly":true},
  {"name":"구례 산수유꽃축제","description":"지리산 자락 구례군에서 열리는 노란 산수유꽃의 향연. 산수유 시식 체험, 전통 차 시음, 온천 관광과 연계한 힐링 여행이 가능합니다.","region":"전남 구례군","address":"전라남도 구례군 산동면 지리산온천 관광지 일원","startDate":"2026-03-14","endDate":"2026-03-22","category":"NATURE","officialUrl":"https://sansuyu.go.kr","hasParking":true,"hasShuttle":true,"isPetFriendly":true,"isChildFriendly":true},
  {"name":"제주 들불축제","description":"제주도 새별오름에서 봄을 맞이하며 열리는 불의 축제. 오름에 불을 놓아 해충을 없애고 새 봄을 기원하는 전통 행사입니다.","region":"제주 제주시","address":"제주특별자치도 제주시 애월읍 봉성리 새별오름","startDate":"2026-03-09","endDate":"2026-03-14","category":"CULTURE","officialUrl":"https://firefestivaljeju.com","hasParking":true,"hasShuttle":true,"isPetFriendly":false,"isChildFriendly":true},
  {"name":"에버랜드 튤립축제","description":"용인 에버랜드에서 100만 송이 이상의 튤립이 장관을 이루는 대규모 봄꽃 축제. 다양한 테마 정원과 놀이기구를 함께 즐길 수 있습니다.","region":"경기 용인시","address":"경기도 용인시 처인구 포곡읍 에버랜드로 199","startDate":"2026-03-20","endDate":"2026-04-30","category":"NATURE","officialUrl":"https://www.everland.com","hasParking":true,"hasShuttle":true,"isPetFriendly":false,"isChildFriendly":true},
  {"name":"논산 딸기축제","description":"충남 논산의 대표 특산물 딸기를 주제로 한 체험형 축제. 딸기 수확 체험, 시식, 딸기잼 만들기 등 프로그램이 풍성합니다.","region":"충남 논산시","address":"충청남도 논산시 부적면 논산시민가족공원 일원","startDate":"2026-03-26","endDate":"2026-03-29","category":"FOOD","officialUrl":"https://www.nonsan.go.kr","hasParking":true,"hasShuttle":false,"isPetFriendly":true,"isChildFriendly":true},
  {"name":"화개장터 벚꽃축제","description":"경남 하동군 화개면의 십리벚꽃길에서 열리는 로맨틱한 봄 축제. 사랑하는 사람과 함께 걸으면 사랑이 이루어진다는 전설의 벚꽃길입니다.","region":"경남 하동군","address":"경상남도 하동군 화개면 쌍계로 일원","startDate":"2026-03-27","endDate":"2026-03-29","category":"NATURE","officialUrl":"https://www.hadong.go.kr","hasParking":true,"hasShuttle":true,"isPetFriendly":true,"isChildFriendly":true},
  {"name":"태안 세계튤립꽃박람회","description":"세계 5대 튤립 축제로 불리는 대규모 봄꽃 박람회. 수백만 송이의 튤립이 코리아플라워파크를 수놓으며 야간 빛 축제도 운영됩니다.","region":"충남 태안군","address":"충청남도 태안군 남면 마검포길 200 코리아플라워파크","startDate":"2026-04-01","endDate":"2026-05-06","category":"NATURE","officialUrl":"https://www.koreaflowerpark.com","hasParking":true,"hasShuttle":false,"isPetFriendly":true,"isChildFriendly":true},
  {"name":"영등포 여의도 봄꽃축제","description":"서울 여의도 윤중로의 상징적인 벚꽃 터널을 즐기는 도심 봄꽃 축제. 한강 배경의 거리 예술, 푸드트럭, 야간 조명 등이 운영됩니다.","region":"서울 영등포구","address":"서울특별시 영등포구 여의서로 일대","startDate":"2026-04-03","endDate":"2026-04-07","category":"NATURE","officialUrl":"https://www.ydp.go.kr","hasParking":false,"hasShuttle":false,"isPetFriendly":true,"isChildFriendly":true},
  {"name":"석촌호수 벚꽃축제","description":"서울 송파구 석촌호수를 둘러싼 벚꽃길과 롯데월드타워의 야경이 어우러지는 도심 봄 축제입니다.","region":"서울 송파구","address":"서울특별시 송파구 잠실로 148 석촌호수","startDate":"2026-04-03","endDate":"2026-04-11","category":"NATURE","officialUrl":"https://www.songpa.go.kr","hasParking":true,"hasShuttle":false,"isPetFriendly":true,"isChildFriendly":true},
  {"name":"강릉 경포벚꽃축제","description":"경포호수와 동해 바다의 절경 속에서 즐기는 벚꽃 축제. 벚꽃 자전거 라이딩, 야간 조명 산책 등이 마련됩니다.","region":"강원 강릉시","address":"강원특별자치도 강릉시 경포로 365 경포대 일원","startDate":"2026-04-04","endDate":"2026-04-11","category":"NATURE","officialUrl":"https://www.visitgangneung.net","hasParking":true,"hasShuttle":true,"isPetFriendly":true,"isChildFriendly":true},
  {"name":"제천 청풍호 벚꽃축제","description":"충북 제천 청풍호반의 아름다운 벚꽃 드라이브 코스를 따라 열리는 봄 축제. 유람선으로 호수와 벚꽃을 동시에 즐길 수 있습니다.","region":"충북 제천시","address":"충청북도 제천시 청풍면 청풍호로 일원","startDate":"2026-04-04","endDate":"2026-04-19","category":"NATURE","officialUrl":"https://www.jecheon.go.kr","hasParking":true,"hasShuttle":false,"isPetFriendly":true,"isChildFriendly":true},
  {"name":"속초 영랑호 벚꽃축제","description":"강원 속초 영랑호 주변의 아름다운 벚꽃길. 설악산 배경과 호수 산책로 따라 만개한 벚꽃이 조화를 이룹니다.","region":"강원 속초시","address":"강원특별자치도 속초시 영랑호 주변 산책로 일원","startDate":"2026-04-11","endDate":"2026-04-12","category":"NATURE","officialUrl":"https://www.sokcho.go.kr","hasParking":true,"hasShuttle":false,"isPetFriendly":true,"isChildFriendly":true},
  {"name":"진도 신비의 바닷길 축제","description":"바다가 갈라지는 자연현상을 축하하는 전남 진도의 독특한 봄 축제. 전통 강강술래와 지역 문화 공연이 펼쳐집니다.","region":"전남 진도군","address":"전라남도 진도군 고군면 회동리 일원","startDate":"2026-04-17","endDate":"2026-04-20","category":"CULTURE","officialUrl":"https://www.jindo.go.kr","hasParking":true,"hasShuttle":true,"isPetFriendly":false,"isChildFriendly":true},
  {"name":"부여 세도 유채꽃축제","description":"금강변의 노란 유채꽃과 충남 부여의 봄 축제. 개막 축하공연, 불꽃쇼, 유채꽃 대행진 등이 운영됩니다.","region":"충남 부여군","address":"충청남도 부여군 세도면 금강 황산대교 부근","startDate":"2026-04-17","endDate":"2026-04-19","category":"NATURE","officialUrl":"https://www.buyeo.go.kr","hasParking":true,"hasShuttle":false,"isPetFriendly":true,"isChildFriendly":true},
  {"name":"군포 철쭉축제","description":"경기도 군포시 철쭉동산에서 분홍빛 철쭉이 만개하는 대규모 봄꽃 축제. 가족 체험, 문화 공연, 먹거리 장터가 마련됩니다.","region":"경기 군포시","address":"경기도 군포시 산본동 철쭉동산 일원","startDate":"2026-04-18","endDate":"2026-04-26","category":"NATURE","officialUrl":"https://www.gunpofestival.or.kr","hasParking":true,"hasShuttle":true,"isPetFriendly":true,"isChildFriendly":true},
  {"name":"아침고요수목원 봄꽃 페스타","description":"가평 아침고요수목원에서 튤립, 수선화, 진달래 등 봄꽃이 만개하는 정원 축제. 수만 송이의 봄꽃 테마 정원을 산책하며 힐링합니다.","region":"경기 가평군","address":"경기도 가평군 상면 수목원로 432 아침고요수목원","startDate":"2026-04-18","endDate":"2026-05-25","category":"NATURE","officialUrl":"https://www.morningcalm.co.kr","hasParking":true,"hasShuttle":false,"isPetFriendly":false,"isChildFriendly":true},
  {"name":"고양 국제꽃박람회","description":"경기도 고양시 일산호수공원에서 열리는 대규모 국제 꽃 박람회. 국내외 정원 설계사들의 작품 정원, 꽃 전시 등이 펼쳐집니다.","region":"경기 고양시","address":"경기도 고양시 일산동구 호수로 595 일산호수공원","startDate":"2026-04-24","endDate":"2026-05-10","category":"NATURE","officialUrl":"https://www.flower.or.kr","hasParking":true,"hasShuttle":true,"isPetFriendly":false,"isChildFriendly":true},
  {"name":"부산 낙동강정원 벚꽃축제","description":"부산 사상구 낙동강 정원 일대에서 열리는 벚꽃 터널 축제. 야간 조명 연출과 문화 공연이 함께합니다.","region":"부산 사상구","address":"부산광역시 사상구 낙동대로 1489 낙동강 정원 일원","startDate":"2026-03-27","endDate":"2026-04-12","category":"NATURE","officialUrl":"https://www.sasang.go.kr","hasParking":true,"hasShuttle":false,"isPetFriendly":true,"isChildFriendly":true},
  {"name":"서천 동백꽃 주꾸미 축제","description":"충남 서천에서 동백꽃이 피는 시기에 열리는 제철 주꾸미 축제. 봄철 최고의 맛 주꾸미 요리와 동백꽃 포토존을 즐길 수 있습니다.","region":"충남 서천군","address":"충청남도 서천군 서면 마량포구 일원","startDate":"2026-03-21","endDate":"2026-04-05","category":"FOOD","officialUrl":"https://www.seocheon.go.kr","hasParking":true,"hasShuttle":false,"isPetFriendly":false,"isChildFriendly":true},
  {"name":"황매산 철쭉제","description":"경남 합천 황매산의 국내 최대 철쭉 군락지에서 열리는 봄 축제. 해발 1,108m 산정의 분홍빛 철쭉 평원이 장관을 이룹니다.","region":"경남 합천군","address":"경상남도 합천군 가회면 황매산공원길 일원","startDate":"2026-05-01","endDate":"2026-05-10","category":"NATURE","officialUrl":"https://www.hc.go.kr","hasParking":true,"hasShuttle":true,"isPetFriendly":false,"isChildFriendly":true},
  {"name":"대구 약령시 한방문화축제","description":"대구 약전골목에서 열리는 전통 한방문화 축제. 350년 역사의 약령시장에서 한약재 체험, 한방 족욕 등을 즐길 수 있습니다.","region":"대구 중구","address":"대구광역시 중구 남성로 51 약전골목 일원","startDate":"2026-05-07","endDate":"2026-05-10","category":"CULTURE","officialUrl":"https://herbfestival.org","hasParking":true,"hasShuttle":false,"isPetFriendly":false,"isChildFriendly":true},
  {"name":"서울 장미축제","description":"서울 중랑장미공원에서 수만 송이의 장미가 만개하는 도심 장미 축제. 장미터널 산책, 야간 조명, 문화 공연이 함께합니다.","region":"서울 중랑구","address":"서울특별시 중랑구 중랑천 장미공원 일원","startDate":"2026-05-15","endDate":"2026-05-23","category":"NATURE","officialUrl":"http://jnfac.or.kr/rose","hasParking":true,"hasShuttle":false,"isPetFriendly":true,"isChildFriendly":true},
  {"name":"해운대 모래축제","description":"부산 해운대 백사장에서 열리는 이색 모래 조형 축제. 국내외 조각가들의 대형 모래 조각 전시와 해변 문화 공연이 펼쳐집니다.","region":"부산 해운대구","address":"부산광역시 해운대구 해운대해변로 264","startDate":"2026-05-15","endDate":"2026-05-18","category":"ART","officialUrl":"https://www.haeundae.go.kr","hasParking":true,"hasShuttle":false,"isPetFriendly":true,"isChildFriendly":true},
  {"name":"연등회","description":"유네스코 인류무형문화유산에 등재된 한국 대표 전통 문화 축제. 수만 개의 전통등이 서울 종로 거리를 밝히는 연등행렬이 장관입니다.","region":"서울 종로구","address":"서울특별시 종로구 우정국로 55 조계사 및 종로 일대","startDate":"2026-05-08","endDate":"2026-05-25","category":"CULTURE","officialUrl":"https://llf.or.kr","hasParking":false,"hasShuttle":false,"isPetFriendly":false,"isChildFriendly":true},
  {"name":"곡성 세계장미축제","description":"전남 곡성 섬진강기차마을에서 열리는 대규모 장미 축제. 1,004종의 장미와 증기기관차 체험, 레일바이크를 함께 즐길 수 있습니다.","region":"전남 곡성군","address":"전라남도 곡성군 오곡면 기차마을로 232","startDate":"2026-05-22","endDate":"2026-05-31","category":"NATURE","officialUrl":"https://www.gokseong.go.kr/tour","hasParking":true,"hasShuttle":true,"isPetFriendly":true,"isChildFriendly":true},
  {"name":"서울 재즈 페스티벌","description":"서울 올림픽공원에서 열리는 대한민국 최대 규모의 야외 재즈 음악 페스티벌. 세계적 재즈 아티스트와 국내 뮤지션들의 3일간 라이브 공연입니다.","region":"서울 송파구","address":"서울특별시 송파구 올림픽로 424 올림픽공원","startDate":"2026-05-22","endDate":"2026-05-24","category":"MUSIC","officialUrl":"https://seouljazz.co.kr","hasParking":true,"hasShuttle":false,"isPetFriendly":false,"isChildFriendly":true},
  {"name":"춘천마임축제","description":"강원 춘천에서 열리는 국제 마임·거리 예술 축제. 전 세계 마임 아티스트들의 거리 공연과 관객 참여형 프로그램이 펼쳐집니다.","region":"강원 춘천시","address":"강원특별자치도 춘천시 춘천로 112 일원","startDate":"2026-05-24","endDate":"2026-05-31","category":"ART","officialUrl":"https://mimefestival.com","hasParking":true,"hasShuttle":false,"isPetFriendly":true,"isChildFriendly":true},
  {"name":"진주 논개제","description":"경남 진주성에서 열리는 전통 교방문화 축제. 논개의 충절을 기리며 의암별제, 진주검무, 남강 카약 체험 등이 진행됩니다.","region":"경남 진주시","address":"경상남도 진주시 본성동 진주성 일원","startDate":"2026-05-02","endDate":"2026-05-05","category":"CULTURE","officialUrl":"https://www.jinju.go.kr","hasParking":true,"hasShuttle":true,"isPetFriendly":false,"isChildFriendly":true},
];

// ── 여름 축제 데이터 (19개) ──
const summerFestivals: FestivalInput[] = [
  {"name":"서천 한산모시문화제","description":"유네스코 인류무형문화유산인 한산모시짜기의 전통을 이어가는 문화 축제. 모시 짜기 시연, 모시 패션쇼, 모시 음식 체험 등이 진행됩니다.","region":"충남 서천군","address":"충청남도 서천군 한산면 한산모시관 일원","startDate":"2026-06-12","endDate":"2026-06-14","category":"CULTURE","officialUrl":"https://hansanmosi.kr","hasParking":true,"hasShuttle":true,"isPetFriendly":false,"isChildFriendly":true},
  {"name":"World DJ Festival","description":"아시아 최대 규모의 EDM 페스티벌. 세계적인 DJ들이 총출동하는 음악 축제로 서울랜드 야외 무대에서 화려한 조명과 사운드를 즐깁니다.","region":"경기 과천시","address":"경기도 과천시 광명로 181 서울랜드","startDate":"2026-06-13","endDate":"2026-06-14","category":"MUSIC","officialUrl":"https://www.worlddjfestival.com","hasParking":true,"hasShuttle":true,"isPetFriendly":false,"isChildFriendly":false},
  {"name":"Weverse Con Festival","description":"하이브 소속 아티스트들을 중심으로 다양한 장르의 아티스트가 출연하는 대규모 K-POP 음악 페스티벌입니다.","region":"서울 송파구","address":"서울특별시 송파구 올림픽로 424 올림픽공원","startDate":"2026-06-06","endDate":"2026-06-07","category":"MUSIC","officialUrl":"https://weverse.io","hasParking":true,"hasShuttle":false,"isPetFriendly":false,"isChildFriendly":true},
  {"name":"서울파크뮤직페스티벌","description":"서울 올림픽공원에서 열리는 피크닉형 음악 축제. 어쿠스틱·인디·팝 장르 아티스트들의 감성적인 라이브 공연입니다.","region":"서울 송파구","address":"서울특별시 송파구 올림픽로 424 올림픽공원 88잔디마당","startDate":"2026-06-20","endDate":"2026-06-21","category":"MUSIC","officialUrl":"https://pmf.co.kr","hasParking":true,"hasShuttle":false,"isPetFriendly":false,"isChildFriendly":true},
  {"name":"대구 치맥페스티벌","description":"대구의 대표 여름 축제. 시원한 맥주와 바삭한 치킨을 야외에서 마음껏 즐기는 미식 축제. 라이브 공연과 DJ 파티가 가득합니다.","region":"대구 달서구","address":"대구광역시 달서구 공원순환로 36 두류공원","startDate":"2026-07-01","endDate":"2026-07-05","category":"FOOD","officialUrl":"https://www.chimacfestival.com","hasParking":true,"hasShuttle":true,"isPetFriendly":false,"isChildFriendly":true},
  {"name":"부여 서동연꽃축제","description":"백제 궁남지의 아름다운 연꽃을 배경으로 열리는 여름 꽃 축제. 연꽃 감상, 백제 역사문화 체험, 야간 조명 프로그램이 운영됩니다.","region":"충남 부여군","address":"충청남도 부여군 부여읍 서동공원(궁남지) 일원","startDate":"2026-07-03","endDate":"2026-07-05","category":"NATURE","officialUrl":"http://www.lotusfestival.kr","hasParking":true,"hasShuttle":true,"isPetFriendly":true,"isChildFriendly":true},
  {"name":"서울썸머비치","description":"서울 도심 한복판 광화문광장이 여름 해변으로 변신하는 도심형 물놀이 축제. 대형 워터슬라이드, 간이 수영장 등이 설치됩니다.","region":"서울 종로구","address":"서울특별시 종로구 세종대로 175 광화문광장","startDate":"2026-07-10","endDate":"2026-08-08","category":"OTHER","officialUrl":"https://festival.seoul.go.kr","hasParking":false,"hasShuttle":false,"isPetFriendly":false,"isChildFriendly":true},
  {"name":"태백 해바라기축제","description":"해발 850m 고원 마을 구와우에서 펼쳐지는 해바라기 꽃밭 축제. 드넓은 해바라기 꽃밭과 시원한 고원 바람 속에서 인생 사진을 남길 수 있습니다.","region":"강원 태백시","address":"강원특별자치도 태백시 구와우길 38-20","startDate":"2026-07-17","endDate":"2026-08-17","category":"NATURE","officialUrl":"http://www.sunflowerfestival.co.kr","hasParking":true,"hasShuttle":false,"isPetFriendly":true,"isChildFriendly":true},
  {"name":"워터밤 서울","description":"K-POP, 힙합, EDM 아티스트들의 공연과 대규모 물총 파이팅이 결합된 한국 최대의 워터 뮤직 페스티벌입니다.","region":"경기 고양시","address":"경기도 고양시 일산서구 킨텍스로 217-60 KINTEX","startDate":"2026-07-24","endDate":"2026-07-26","category":"MUSIC","officialUrl":"https://www.waterbombfestival.com","hasParking":true,"hasShuttle":true,"isPetFriendly":false,"isChildFriendly":false},
  {"name":"평창 더위사냥축제","description":"강원 평창의 시원한 계곡과 물을 테마로 한 여름 피서 축제. 대형 워터슬라이드, 계곡 래프팅 등 수상 액티비티가 풍성합니다.","region":"강원 평창군","address":"강원특별자치도 평창군 대화면 땀띠공원 일원","startDate":"2026-07-24","endDate":"2026-08-02","category":"OTHER","officialUrl":"https://summer-hunter.com","hasParking":true,"hasShuttle":false,"isPetFriendly":true,"isChildFriendly":true},
  {"name":"정남진 장흥 물축제","description":"전남 장흥 탐진강의 청정 수자원을 활용한 대규모 물놀이 축제. 대형 워터슬라이드, 편백숲 우드랜드 체험 등이 가득합니다.","region":"전남 장흥군","address":"전라남도 장흥군 탐진강 및 편백숲 우드랜드 일원","startDate":"2026-07-25","endDate":"2026-08-02","category":"OTHER","officialUrl":"https://festival.jangheung.go.kr/festival","hasParking":true,"hasShuttle":true,"isPetFriendly":true,"isChildFriendly":true},
  {"name":"봉화은어축제","description":"경북 봉화군 내성천에서 열리는 은어 잡기 체험 축제. 맑은 1급수에서 은어를 직접 잡아 회와 구이를 즐길 수 있습니다.","region":"경북 봉화군","address":"경상북도 봉화군 봉화읍 내성천 일원","startDate":"2026-07-25","endDate":"2026-08-02","category":"FOOD","officialUrl":"https://www.bhftf.or.kr","hasParking":true,"hasShuttle":false,"isPetFriendly":true,"isChildFriendly":true},
  {"name":"인천 펜타포트 록 페스티벌","description":"인천 송도에서 열리는 대한민국 대표 록 페스티벌. 3일간 국내외 유명 록·인디 밴드들의 라이브 공연과 캠핑존이 운영됩니다.","region":"인천 연수구","address":"인천광역시 연수구 센트럴로 350 송도달빛축제공원","startDate":"2026-07-31","endDate":"2026-08-02","category":"MUSIC","officialUrl":"https://pentaport.co.kr","hasParking":true,"hasShuttle":true,"isPetFriendly":false,"isChildFriendly":false},
  {"name":"춘천인형극제","description":"강원 춘천에서 열리는 한국 최대의 인형극 축제. 국내외 다양한 인형극 공연과 인형 만들기 체험이 진행됩니다.","region":"강원 춘천시","address":"강원특별자치도 춘천시 영서로 3017 춘천인형극장 일원","startDate":"2026-07-31","endDate":"2026-08-09","category":"ART","officialUrl":"https://cocobau.com","hasParking":true,"hasShuttle":false,"isPetFriendly":false,"isChildFriendly":true},
  {"name":"부산바다축제","description":"부산 다대포해수욕장에서 열리는 여름 해변 축제. 해변 콘서트, 해양 스포츠 체험, 불꽃놀이 등 다채로운 프로그램이 진행됩니다.","region":"부산 사하구","address":"부산광역시 사하구 몰운대1길 14 다대포해수욕장","startDate":"2026-08-07","endDate":"2026-08-16","category":"OTHER","officialUrl":"https://festivalbusan.com","hasParking":true,"hasShuttle":true,"isPetFriendly":true,"isChildFriendly":true},
  {"name":"통영한산대첩축제","description":"이순신 장군의 한산대첩 승전을 기리는 역사문화 축제. 거북선 재현, 해상 승전 퍼레이드, 불꽃쇼 등이 5일간 펼쳐집니다.","region":"경남 통영시","address":"경상남도 통영시 한산대첩광장 일원","startDate":"2026-08-12","endDate":"2026-08-16","category":"CULTURE","officialUrl":"http://www.hansanf.org","hasParking":true,"hasShuttle":true,"isPetFriendly":true,"isChildFriendly":true},
  {"name":"송도맥주축제","description":"인천 송도달빛축제공원에서 9일간 열리는 대규모 맥주 축제. 국내외 크래프트 맥주 시음, 야외 공연, DJ 파티를 즐깁니다.","region":"인천 연수구","address":"인천광역시 연수구 센트럴로 350 송도달빛축제공원","startDate":"2026-08-22","endDate":"2026-08-30","category":"FOOD","officialUrl":"https://www.songdobeer.com","hasParking":true,"hasShuttle":false,"isPetFriendly":false,"isChildFriendly":false},
  {"name":"강진 하멜축제","description":"전남 강진에서 열리는 여름 맥주 축제. 하멜의 역사적 표류지 문화와 시원한 맥주가 어우러집니다.","region":"전남 강진군","address":"전라남도 강진군 강진종합운동장 일원","startDate":"2026-08-27","endDate":"2026-08-29","category":"FOOD","officialUrl":"https://www.gangjin.go.kr","hasParking":true,"hasShuttle":false,"isPetFriendly":true,"isChildFriendly":true},
];

// ── 가을 축제 데이터 (25개) ──
const fallFestivals: FestivalInput[] = [
  {"name":"서울세계불꽃축제","description":"여의도 한강공원에서 개최되는 대한민국 최대 규모의 국제 불꽃축제. 여러 국가의 불꽃 전문팀이 참가하여 밤하늘을 화려하게 수놓습니다.","region":"서울 영등포구","address":"서울특별시 영등포구 여의동로 330","startDate":"2026-09-26","endDate":"2026-09-26","category":"OTHER","officialUrl":"https://www.hanwhafireworks.com","hasParking":true,"hasShuttle":false,"isPetFriendly":false,"isChildFriendly":true},
  {"name":"평창효석문화제","description":"이효석의 소설 '메밀꽃 필 무렵'의 배경인 봉평면 메밀꽃밭에서 열리는 문학 테마 축제. 하얀 메밀꽃 물결 속에서 문학 산책을 즐깁니다.","region":"강원 평창군","address":"강원특별자치도 평창군 봉평면 이효석길 157","startDate":"2026-09-04","endDate":"2026-09-13","category":"CULTURE","officialUrl":"http://www.hyoseok.com","hasParking":true,"hasShuttle":true,"isPetFriendly":true,"isChildFriendly":true},
  {"name":"무주반딧불축제","description":"청정 자연의 보고 무주에서 열리는 생태 축제. 반딧불이의 신비로운 빛을 직접 관찰하고 생태체험, 래프팅을 즐깁니다.","region":"전북 무주군","address":"전북특별자치도 무주군 무주읍 한풍루로 326-14","startDate":"2026-09-05","endDate":"2026-09-13","category":"NATURE","officialUrl":"http://www.firefly.or.kr","hasParking":true,"hasShuttle":true,"isPetFriendly":false,"isChildFriendly":true},
  {"name":"수원화성문화제","description":"유네스코 세계문화유산 수원화성을 배경으로 정조대왕의 효심과 개혁 정신을 기리는 역사 문화 축제입니다.","region":"경기 수원시","address":"경기도 수원시 팔달구 정조로 825","startDate":"2026-09-26","endDate":"2026-10-03","category":"CULTURE","officialUrl":"https://www.swcf.or.kr","hasParking":true,"hasShuttle":true,"isPetFriendly":true,"isChildFriendly":true},
  {"name":"백제문화제","description":"백제의 찬란한 역사와 문화를 재현하는 대한민국 대표 역사 문화 축제. 백제 왕궁 재현, 전통 퍼레이드가 펼쳐집니다.","region":"충남 공주시","address":"충청남도 공주시 금강신관공원, 공산성 일원","startDate":"2026-10-03","endDate":"2026-10-12","category":"CULTURE","officialUrl":"https://www.baekje.org","hasParking":true,"hasShuttle":true,"isPetFriendly":true,"isChildFriendly":true},
  {"name":"궁중문화축전","description":"서울 4대 궁궐과 종묘에서 열리는 궁중 문화 체험 축제. 궁궐 야간개장, 왕실 문화 재현 공연, 전통 복식 체험을 즐깁니다.","region":"서울 종로구","address":"서울특별시 종로구 사직로 161","startDate":"2026-10-08","endDate":"2026-10-12","category":"CULTURE","officialUrl":"https://www.kh.or.kr/fest","hasParking":false,"hasShuttle":false,"isPetFriendly":false,"isChildFriendly":true},
  {"name":"안성맞춤남사당바우덕이축제","description":"남사당패의 예술을 계승한 전통 공연 축제. 풍물, 버나, 줄타기 등 전통 곡예와 현대 서커스가 어우러집니다.","region":"경기 안성시","address":"경기도 안성시 보개면 남사당로 198","startDate":"2026-10-09","endDate":"2026-10-12","category":"CULTURE","officialUrl":"https://www.anseong.go.kr/festival","hasParking":true,"hasShuttle":true,"isPetFriendly":true,"isChildFriendly":true},
  {"name":"임실N치즈축제","description":"한국 치즈의 발원지 임실에서 열리는 대표 먹거리 축제. 치즈 만들기 체험, 모짜렐라 피자 만들기 등이 가득합니다.","region":"전북 임실군","address":"전북특별자치도 임실군 성수면 도인2길 50","startDate":"2026-10-08","endDate":"2026-10-12","category":"FOOD","officialUrl":"https://www.imsilfestival.com","hasParking":true,"hasShuttle":true,"isPetFriendly":true,"isChildFriendly":true},
  {"name":"서울억새축제","description":"도심 속 하늘공원의 억새밭에서 가을을 만끽하는 축제. 은빛 억새 물결과 야간 라이팅 쇼를 감상합니다.","region":"서울 마포구","address":"서울특별시 마포구 하늘공원로 95","startDate":"2026-10-17","endDate":"2026-10-23","category":"NATURE","officialUrl":"https://parks.seoul.go.kr","hasParking":true,"hasShuttle":false,"isPetFriendly":false,"isChildFriendly":true},
  {"name":"민둥산 억새축제","description":"전국 최대 규모의 억새 능선을 자랑하는 정선 민둥산에서 열리는 자연 힐링 축제입니다.","region":"강원 정선군","address":"강원특별자치도 정선군 남면 민둥산로 일원","startDate":"2026-10-02","endDate":"2026-11-15","category":"NATURE","officialUrl":"https://www.jeongseon.go.kr/tour","hasParking":true,"hasShuttle":false,"isPetFriendly":false,"isChildFriendly":false},
  {"name":"황매산 억새축제","description":"경남 합천 황매산의 광활한 억새 평원에서 열리는 가을 축제. 해발 1,108m 고원의 억새밭을 산책합니다.","region":"경남 합천군","address":"경상남도 합천군 가회면 황매산공원길 331","startDate":"2026-10-17","endDate":"2026-10-25","category":"NATURE","officialUrl":"https://www.hc.go.kr","hasParking":true,"hasShuttle":true,"isPetFriendly":false,"isChildFriendly":true},
  {"name":"강진만 갈대축제","description":"강진만생태공원의 광활한 갈대밭을 배경으로 열리는 자연 생태 축제입니다.","region":"전남 강진군","address":"전라남도 강진군 강진읍 생태공원길 47","startDate":"2026-10-24","endDate":"2026-11-01","category":"NATURE","officialUrl":"https://www.gangjin.go.kr","hasParking":true,"hasShuttle":false,"isPetFriendly":true,"isChildFriendly":true},
  {"name":"강경젓갈축제","description":"충남 논산 강경의 젓갈을 주제로 한 전통 식품 축제. 수백 종의 젓갈 시식·판매, 젓갈 담그기 체험이 가능합니다.","region":"충남 논산시","address":"충청남도 논산시 강경읍 젓갈골목길 일원","startDate":"2026-10-10","endDate":"2026-10-18","category":"FOOD","officialUrl":"https://www.nonsan.go.kr","hasParking":true,"hasShuttle":false,"isPetFriendly":false,"isChildFriendly":true},
  {"name":"이천쌀문화축제","description":"이천에서 햅쌀 수확을 기념하는 전통 농경 문화 축제. 벼 베기, 떡 만들기, 가마솥밥 시식을 즐깁니다.","region":"경기 이천시","address":"경기도 이천시 부악로 27","startDate":"2026-10-22","endDate":"2026-10-26","category":"FOOD","officialUrl":"https://www.ricefestival.or.kr","hasParking":true,"hasShuttle":true,"isPetFriendly":false,"isChildFriendly":true},
  {"name":"횡성한우축제","description":"고품질 횡성 한우를 현장에서 맛볼 수 있는 대표적인 미식 축제. 한우 직거래 판매, BBQ 체험이 가득합니다.","region":"강원 횡성군","address":"강원특별자치도 횡성군 횡성읍 문예로 39","startDate":"2026-10-22","endDate":"2026-10-26","category":"FOOD","officialUrl":"https://www.happyhanwoofestival.com","hasParking":true,"hasShuttle":true,"isPetFriendly":false,"isChildFriendly":true},
  {"name":"강릉커피축제","description":"커피 수도 강릉에서 열리는 커피 문화 축제. 핸드드립 체험, 바리스타 대회 등 커피 프로그램을 즐깁니다.","region":"강원 강릉시","address":"강원특별자치도 강릉시 창해로14번길 20","startDate":"2026-10-29","endDate":"2026-11-01","category":"FOOD","officialUrl":"https://www.coffeefestival.net","hasParking":true,"hasShuttle":false,"isPetFriendly":true,"isChildFriendly":true},
  {"name":"광주김치축제","description":"김치의 본고장 광주에서 열리는 대표 김치 문화 축제. 김장 체험, 김치 만들기 대회를 즐깁니다.","region":"광주 북구","address":"광주광역시 북구 비엔날레로 111","startDate":"2026-10-30","endDate":"2026-11-01","category":"FOOD","officialUrl":"https://kimchi.gwangju.go.kr","hasParking":true,"hasShuttle":false,"isPetFriendly":false,"isChildFriendly":true},
  {"name":"순창장류축제","description":"고추장의 본고장 순창에서 열리는 전통 장류 문화 축제. 고추장 담그기, 장류 명인 시연을 즐깁니다.","region":"전북 순창군","address":"전북특별자치도 순창군 순창읍 민속마을길 일원","startDate":"2026-10-16","endDate":"2026-10-18","category":"FOOD","officialUrl":"https://sftf.or.kr","hasParking":true,"hasShuttle":false,"isPetFriendly":false,"isChildFriendly":true},
  {"name":"양양송이축제","description":"강원도 양양의 청정 산림에서 자란 천연 송이버섯 축제. 송이 보물찾기, 캐기 체험, 요리 시식을 즐깁니다.","region":"강원 양양군","address":"강원특별자치도 양양군 양양읍 남대천로 일원","startDate":"2026-10-09","endDate":"2026-10-11","category":"FOOD","officialUrl":"https://www.yycf.or.kr","hasParking":true,"hasShuttle":false,"isPetFriendly":false,"isChildFriendly":true},
  {"name":"보은대추축제","description":"충북 보은의 황토 대추를 테마로 한 가을 축제. 대추 따기, 대추 요리 시식, 속리산 단풍 트레킹을 즐깁니다.","region":"충북 보은군","address":"충청북도 보은군 보은읍 뱃들공원 일원","startDate":"2026-10-16","endDate":"2026-10-25","category":"FOOD","officialUrl":"https://www.boeunjujube.com","hasParking":true,"hasShuttle":true,"isPetFriendly":true,"isChildFriendly":true},
  {"name":"대장경기록문화축제","description":"유네스코 세계기록유산 해인사 팔만대장경을 기념하는 역사 문화 축제. 대장경 인경 체험, 템플스테이 등을 즐깁니다.","region":"경남 합천군","address":"경상남도 합천군 합천읍 대장경대로 152","startDate":"2026-10-23","endDate":"2026-11-01","category":"CULTURE","officialUrl":"https://www.hc.go.kr","hasParking":true,"hasShuttle":true,"isPetFriendly":false,"isChildFriendly":true},
  {"name":"고창모양성제","description":"전북 고창의 고창읍성에서 열리는 전통 축제. 성 밟기, 판소리 한마당, 고창 특산물 장터가 펼쳐집니다.","region":"전북 고창군","address":"전북특별자치도 고창군 고창읍 모양성로 11","startDate":"2026-10-28","endDate":"2026-11-01","category":"CULTURE","officialUrl":"https://www.gochang.go.kr","hasParking":true,"hasShuttle":true,"isPetFriendly":true,"isChildFriendly":true},
  {"name":"부산불꽃축제","description":"광안대교를 배경으로 광안리 해수욕장에서 펼쳐지는 최대 규모의 해상 불꽃축제. 드론 아트와 레이저쇼가 어우러집니다.","region":"부산 수영구","address":"부산광역시 수영구 광안해변로 219","startDate":"2026-11-14","endDate":"2026-11-14","category":"OTHER","officialUrl":"https://busanfireworks.com","hasParking":false,"hasShuttle":false,"isPetFriendly":false,"isChildFriendly":true},
  {"name":"청도소싸움축제","description":"전국 유일의 소싸움 전용 돔 경기장에서 펼쳐지는 전통 민속 소싸움 축제입니다.","region":"경북 청도군","address":"경상북도 청도군 화양읍 남성현로 348","startDate":"2026-11-04","endDate":"2026-11-08","category":"CULTURE","officialUrl":"https://www.sossaum.or.kr","hasParking":true,"hasShuttle":false,"isPetFriendly":false,"isChildFriendly":true},
  {"name":"영동난계국악축제","description":"국악의 성지 충북 영동에서 열리는 전통 국악 축제. 가야금, 거문고 등 전통 국악 공연과 체험을 즐깁니다.","region":"충북 영동군","address":"충청북도 영동군 영동읍 영동힐링로 117","startDate":"2026-09-11","endDate":"2026-10-10","category":"MUSIC","officialUrl":"https://www.ydnan-gye.co.kr","hasParking":true,"hasShuttle":true,"isPetFriendly":true,"isChildFriendly":true},
];

// ── 겨울 축제 데이터 (20개) ──
const winterFestivals: FestivalInput[] = [
  {"name":"평창 송어축제","description":"평창에서 펼쳐지는 대표 겨울 축제. 오대천 얼음 위에서 송어 얼음낚시, 맨손잡기, 눈썰매 등을 즐길 수 있습니다.","region":"강원 평창군","address":"강원특별자치도 평창군 진부면 경강로 3562","startDate":"2026-01-09","endDate":"2026-02-09","category":"NATURE","officialUrl":"https://www.festival700.or.kr","hasParking":true,"hasShuttle":true,"isPetFriendly":false,"isChildFriendly":true},
  {"name":"홍천강 꽁꽁축제","description":"홍천강 둔치에서 열리는 강원도 대표 겨울 체험 축제. 송어 빙어 얼음낚시, 눈썰매, 얼음 축구 등을 즐깁니다.","region":"강원 홍천군","address":"강원특별자치도 홍천군 홍천읍 신장대리 85","startDate":"2026-01-09","endDate":"2026-01-25","category":"NATURE","officialUrl":"https://www.hccf.or.kr","hasParking":true,"hasShuttle":true,"isPetFriendly":false,"isChildFriendly":true},
  {"name":"양평 빙송어축제","description":"수도권에서 가까운 양평 수미마을 겨울 체험 축제. 빙어 뜰채 잡기, 송어 맨손 잡기, 눈썰매를 즐깁니다.","region":"경기 양평군","address":"경기도 양평군 단월면 곱다니길 55-2","startDate":"2025-12-06","endDate":"2026-03-02","category":"NATURE","officialUrl":"https://winterfestival.kr","hasParking":true,"hasShuttle":false,"isPetFriendly":false,"isChildFriendly":true},
  {"name":"포천 백운계곡 동장군축제","description":"포천 백운계곡 국민관광지에서 열리는 겨울 종합 체험 축제. 빙어낚시, 눈썰매, 스노우 튜빙을 즐깁니다.","region":"경기 포천시","address":"경기도 포천시 이동면 포화로 233","startDate":"2025-12-20","endDate":"2026-02-22","category":"NATURE","officialUrl":"https://www.dongjangkun.com","hasParking":true,"hasShuttle":false,"isPetFriendly":false,"isChildFriendly":true},
  {"name":"강화 양오빙어축제","description":"인천 강화군의 빙어 전문 낚시 축제. 수도권에서 가까운 거리에서 빙어낚시와 겨울 레저를 즐깁니다.","region":"인천 강화군","address":"인천광역시 강화군 송해면 전망대로423번길 161","startDate":"2025-12-20","endDate":"2026-02-22","category":"NATURE","officialUrl":"http://yango.co.kr","hasParking":true,"hasShuttle":false,"isPetFriendly":false,"isChildFriendly":true},
  {"name":"대관령 눈꽃축제","description":"'한국의 알프스' 대관령에서 열리는 전통 눈 축제. 초대형 눈조각 전시, 눈꽃썰매장, 동계 스포츠 체험을 즐깁니다.","region":"강원 평창군","address":"강원특별자치도 평창군 대관령면 대관령로 135-9","startDate":"2026-02-13","endDate":"2026-02-22","category":"NATURE","officialUrl":"https://www.snowfestival.net","hasParking":true,"hasShuttle":false,"isPetFriendly":false,"isChildFriendly":true},
  {"name":"아침고요수목원 오색별빛정원전","description":"가평 아침고요수목원에서 열리는 한국 최대 규모의 겨울 빛 축제. 수백만 개의 LED 전구가 자연과 환상적인 조화를 이룹니다.","region":"경기 가평군","address":"경기도 가평군 상면 수목원로 432","startDate":"2025-12-05","endDate":"2026-03-15","category":"ART","officialUrl":"https://www.morningcalm.co.kr","hasParking":true,"hasShuttle":false,"isPetFriendly":false,"isChildFriendly":true},
  {"name":"포천 허브아일랜드 불빛동화축제","description":"포천 허브아일랜드에서 열리는 겨울 야간 빛 축제. 산타마을과 정원을 수백만 개의 LED가 동화처럼 장식합니다.","region":"경기 포천시","address":"경기도 포천시 신북면 청신로947번길 35","startDate":"2025-11-01","endDate":"2026-03-31","category":"ART","officialUrl":"http://www.herbisland.co.kr","hasParking":true,"hasShuttle":false,"isPetFriendly":true,"isChildFriendly":true},
  {"name":"해운대 빛축제","description":"부산 해운대 해수욕장과 구남로 일대에서 열리는 화려한 겨울 야경 축제. LED 조명 설치물과 불꽃쇼가 어우러집니다.","region":"부산 해운대구","address":"부산광역시 해운대구 해운대해변로 264","startDate":"2025-11-29","endDate":"2026-01-18","category":"ART","officialUrl":"https://www.haeundae.go.kr","hasParking":true,"hasShuttle":false,"isPetFriendly":true,"isChildFriendly":true},
  {"name":"서울 빛초롱축제","description":"서울 청계천과 우이천 일대에서 열리는 도심 야경 축제. 대형 등불 조형물과 미디어 아트가 물길을 따라 설치됩니다.","region":"서울 종로구","address":"서울특별시 종로구 서린동 (청계광장~삼일교)","startDate":"2025-12-12","endDate":"2026-01-18","category":"CULTURE","officialUrl":"https://stolantern.com","hasParking":false,"hasShuttle":false,"isPetFriendly":true,"isChildFriendly":true},
  {"name":"광화문 크리스마스 마켓","description":"서울 광화문광장에서 열리는 유럽풍 크리스마스 마켓. 대형 트리, 회전목마, 소상공인 판매 부스가 마련됩니다.","region":"서울 종로구","address":"서울특별시 종로구 세종대로 175","startDate":"2025-12-12","endDate":"2025-12-31","category":"CULTURE","officialUrl":"https://stolantern.com","hasParking":false,"hasShuttle":false,"isPetFriendly":true,"isChildFriendly":true},
  {"name":"제천 의림지 빛축제","description":"충북 제천의 천년 저수지 의림지에서 열리는 야간 경관 조명 축제. LED 조명과 빛 터널이 겨울밤을 밝힙니다.","region":"충북 제천시","address":"충청북도 제천시 의림지로 33","startDate":"2025-11-15","endDate":"2026-02-15","category":"ART","officialUrl":"https://www.jecheon.go.kr","hasParking":true,"hasShuttle":false,"isPetFriendly":true,"isChildFriendly":true},
  {"name":"정동진 해맞이축제","description":"강릉 정동진 모래시계공원에서 열리는 새해맞이 일출 축제. 모래시계 회전식, 카운트다운, 불꽃놀이가 펼쳐집니다.","region":"강원 강릉시","address":"강원특별자치도 강릉시 강동면 헌화로 990-1","startDate":"2025-12-31","endDate":"2026-01-01","category":"CULTURE","officialUrl":"https://www.gn.go.kr/tour","hasParking":true,"hasShuttle":false,"isPetFriendly":true,"isChildFriendly":true},
  {"name":"포항 호미곶 해맞이축제","description":"한반도 최동단 포항 호미곶에서 열리는 대표 새해 일출 축제. '상생의 손' 사이로 떠오르는 장엄한 일출을 감상합니다.","region":"경북 포항시","address":"경상북도 포항시 남구 호미곶면 해맞이로 136","startDate":"2025-12-31","endDate":"2026-01-01","category":"CULTURE","officialUrl":"https://www.phcf.or.kr","hasParking":true,"hasShuttle":true,"isPetFriendly":true,"isChildFriendly":true},
  {"name":"울산 간절곶 해맞이축제","description":"해가 가장 먼저 뜨는 울산 간절곶의 새해 일출 축제. 카운트다운 콘서트, 드론 쇼, 소원 빌기 행사가 펼쳐집니다.","region":"울산 울주군","address":"울산광역시 울주군 서생면 간절곶해안길 222","startDate":"2025-12-31","endDate":"2026-01-01","category":"CULTURE","officialUrl":"https://www.ucf.or.kr","hasParking":true,"hasShuttle":true,"isPetFriendly":true,"isChildFriendly":true},
  {"name":"여수 향일암 일출제","description":"전국 4대 관음 기도처 여수 향일암에서 열리는 새해 일출 축제. 제야의 종 타종, 신년 불꽃쇼를 즐깁니다.","region":"전남 여수시","address":"전라남도 여수시 돌산읍 향일암로 60","startDate":"2025-12-31","endDate":"2026-01-01","category":"CULTURE","officialUrl":"https://www.yeosu.go.kr/tour","hasParking":true,"hasShuttle":true,"isPetFriendly":false,"isChildFriendly":true},
  {"name":"안동 암산얼음축제","description":"경북 안동 암산유원지에서 열리는 겨울 얼음 체험 축제. 얼음낚시, 눈썰매, 스케이트를 즐깁니다.","region":"경북 안동시","address":"경상북도 안동시 남후면 암산1길 59","startDate":"2026-01-17","endDate":"2026-01-25","category":"NATURE","officialUrl":"https://www.andong.go.kr/tour","hasParking":true,"hasShuttle":false,"isPetFriendly":false,"isChildFriendly":true},
  {"name":"전주 남부시장 야시장","description":"전주 한옥마을 인근 남부시장에서 매주 금·토요일 열리는 연중 상설 야시장. 전주 비빔밥, 수제 디저트 등을 즐깁니다.","region":"전북 전주시","address":"전북특별자치도 전주시 완산구 풍남문1길 19-3","startDate":"2026-01-01","endDate":"2026-12-31","category":"FOOD","officialUrl":"https://jbsj.kr","hasParking":true,"hasShuttle":false,"isPetFriendly":true,"isChildFriendly":true},
  {"name":"여수 밤바다 야경축제","description":"여수 이순신광장 등 도심 곳곳에서 연중 상시 즐기는 야경과 문화 행사. 화려한 조명과 버스킹이 밤바다와 어우러집니다.","region":"전남 여수시","address":"전라남도 여수시 중앙동 이순신광장 일원","startDate":"2026-01-01","endDate":"2026-12-31","category":"CULTURE","officialUrl":"https://www.yeosu.go.kr/tour","hasParking":true,"hasShuttle":false,"isPetFriendly":true,"isChildFriendly":true},
  {"name":"평창 알펜시아 별빛축제","description":"2018 동계올림픽 개최지 알펜시아 리조트의 겨울 야간 빛 축제. 화려한 LED 일루미네이션이 겨울 밤을 밝힙니다.","region":"강원 평창군","address":"강원특별자치도 평창군 대관령면 솔봉로 325","startDate":"2025-12-01","endDate":"2026-02-28","category":"ART","officialUrl":"https://www.alpensia.com","hasParking":true,"hasShuttle":true,"isPetFriendly":false,"isChildFriendly":true},
];

// ── 모든 축제 합치기 ──
const allFestivals: FestivalInput[] = [
  ...springFestivals,
  ...summerFestivals,
  ...fallFestivals,
  ...winterFestivals,
];

// trustScore 분배용 (92~98 사이를 순환)
const TRUST_SCORES = [92, 93, 94, 95, 96, 97, 98];

// views 분배용 (0~300 사이)
const VIEW_COUNTS = [
  12, 45, 78, 102, 134, 156, 189, 201, 223, 245,
  267, 289, 0, 34, 67, 98, 120, 145, 178, 210,
  234, 256, 278, 300, 15, 50, 85, 110, 140, 170,
  195, 220, 248, 270, 295, 8, 42, 75, 105, 130,
  160, 185, 215, 240, 265, 290, 20, 55, 88, 115,
  148, 175, 205, 230, 255, 280, 5, 38, 70, 100,
  128, 155, 182, 208, 235, 260, 285, 10, 48, 80,
  112, 138, 165, 192, 218, 242, 268, 292, 25, 58,
  90, 118, 150, 180, 200, 225, 250, 275, 298, 30,
  62, 95,
];

export async function seedMassFestivals(prisma: PrismaClient) {
  console.log(`🌍 전국 축제 대량 시딩 중... (${allFestivals.length}개)`);

  for (let i = 0; i < allFestivals.length; i++) {
    const f = allFestivals[i];
    const trustScore = TRUST_SCORES[i % TRUST_SCORES.length];
    const views = VIEW_COUNTS[i % VIEW_COUNTS.length];
    const imageUrl = CATEGORY_IMAGES[f.category] || CATEGORY_IMAGES.OTHER;

    await prisma.festival.create({
      data: {
        name: f.name,
        description: f.description,
        region: f.region,
        address: f.address,
        startDate: new Date(f.startDate),
        endDate: new Date(f.endDate),
        category: f.category,
        officialUrl: f.officialUrl,
        imageUrl,
        hasParking: f.hasParking,
        hasShuttle: f.hasShuttle,
        isPetFriendly: f.isPetFriendly,
        isChildFriendly: f.isChildFriendly,
        congestionStatus: "NORMAL",
        trustScore,
        views,
        status: "VERIFIED",
        sources: {
          create: [
            {
              name: `${f.name} 공식`,
              url: f.officialUrl,
              type: "LOCAL_GOV",
            },
          ],
        },
      },
    });
  }

  console.log(`✅ 전국 축제 ${allFestivals.length}개 시딩 완료!`);
}
