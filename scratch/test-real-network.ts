// scratch/test-real-network.ts
async function testRealNetwork() {
  console.log("📡 [NetworkTest] 실시간 네트워크 수집 검증 테스트 시작...\n");

  // 1. Google News RSS 실시간 스크래핑 테스트
  const query = "지역축제 OR 골목축제 OR 플리마켓 OR 버스킹";
  const rssUrl = `https://news.google.com/rss/search?q=${encodeURIComponent(query)}&hl=ko&gl=KR&ceid=KR:ko`;
  
  console.log(`🔍 [Scraper] 1. 구글 뉴스 RSS 실시간 크롤링 시도: ${rssUrl}`);
  try {
    const response = await fetch(rssUrl);
    if (!response.ok) {
      throw new Error(`HTTP 에러: ${response.status}`);
    }
    const xmlText = await response.text();
    console.log("✅ [Scraper] 구글 뉴스 RSS 피드 수신 성공!");

    // 아이템 추출 및 정제
    const items: string[] = [];
    const matches = xmlText.matchAll(/<item>([\s\S]*?)<\/item>/g);
    for (const match of matches) {
      const itemContent = match[1];
      const title = itemContent.match(/<title>([\s\S]*?)<\/title>/)?.[1] || "";
      const link = itemContent.match(/<link>([\s\S]*?)<\/link>/)?.[1] || "";
      const pubDate = itemContent.match(/<pubDate>([\s\S]*?)<\/pubDate>/)?.[1] || "";
      
      const cleanTitle = title.replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, "$1").replace(/<\/?[^>]+(>|$)/g, "");
      items.push(`• 제목: ${cleanTitle}\n  링크: ${link}\n  발행일: ${pubDate}`);
      if (items.length >= 3) break;
    }

    console.log("\n📰 [Scraper] 최근 3개 실시간 수집 뉴스 기사 (실물 결과):");
    items.forEach((item, index) => {
      console.log(`\n[기사 #${index + 1}]\n${item}`);
    });

  } catch (error: any) {
    console.error("❌ [Scraper] 뉴스 크롤러 연동 실패:", error.message);
  }

  // 2. 한국관광공사 공공 Tour API 엔드포인트 연결 검증
  const tourApiUrl = "http://apis.data.go.kr/B551011/KorService1/searchFestival1";
  console.log(`\n🌐 [TourAPI] 2. 공공 데이터 포털 엔드포인트 연결성 검증: ${tourApiUrl}`);
  try {
    const response = await fetch(`${tourApiUrl}?serviceKey=test&numOfRows=1&pageNo=1&MobileOS=ETC&MobileApp=test&_type=json`, {
      signal: AbortSignal.timeout(3000)
    });
    console.log(`✅ [TourAPI] 엔드포인트 응답 수신 성공! HTTP 상태 코드: ${response.status}`);
    const text = await response.text();
    console.log(`   응답 데이터 스냅샷 (인증서 에러 여부 검증용):`, text.substring(0, 150));
  } catch (error: any) {
    console.warn(`⚠️ [TourAPI] 연결 결과 (임시 키 사용으로 인한 메시지 포함):`, error.message);
  }
}

testRealNetwork();
