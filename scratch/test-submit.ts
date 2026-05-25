import { submitFestivalAction } from "../src/app/submit/actions";

async function main() {
  try {
    console.log("Submitting test festival...");
    const result = await submitFestivalAction({
      name: "테스트 골목 축제",
      region: "서울 마포구",
      category: "FOOD",
      dateRange: "2026-11-01 ~ 2026-11-03",
      description: "골목골목 숨은 맛집들의 무료 시식 축제",
      address: "서울시 마포구 합정동 일대",
      sourceUrl: "https://example.com/mapo",
      submitterEmail: "tester@example.com"
    });
    console.log("Submission result:", result);
  } catch (error) {
    console.error("Submission failed with error:", error);
  }
}

main();
