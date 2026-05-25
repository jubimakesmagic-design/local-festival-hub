import { CollectedFestival } from "./types";

const GENERIC_STOCK_IMAGE_HOSTS = [
  "images.unsplash.com",
  "source.unsplash.com",
  "images.pexels.com",
  "cdn.pixabay.com"
];

const FAKE_URL_PATTERNS = [
  /idxno=20\d{6,}/i,
  /[?&]id=20\d{6,}/i,
  /cotid=(bof|wdjfest|mud|butterfly|ceramic)_20\d{2}/i,
  /\/multi\/public\/notify\/view/i,
  /jejurelease/i
];

const FESTIVAL_IMAGE_FALLBACKS: Array<{ pattern: RegExp; imageUrl: string }> = [
  { pattern: /보령.*머드|mud/i, imageUrl: "/images/boryeong_mud.png" },
  { pattern: /진해.*군항|군항제/i, imageUrl: "/images/jinhae_gunhangje.png" },
  { pattern: /곡성.*장미|세계장미/i, imageUrl: "/images/gokseong_roses_official.png" },
  { pattern: /홍어|한우|꼴갑|갑오징어/i, imageUrl: "/images/kkolgap_festival.png" }
];

export function isUsableUrl(url?: string | null): url is string {
  if (!url) return false;
  if (/\s/.test(url)) return false;

  try {
    const parsed = new URL(url);
    if (!["http:", "https:"].includes(parsed.protocol)) return false;
    return !FAKE_URL_PATTERNS.some((pattern) => pattern.test(url));
  } catch {
    return false;
  }
}

export function isLikelyStockImage(url?: string | null): boolean {
  if (!url) return false;

  try {
    const parsed = new URL(url);
    return GENERIC_STOCK_IMAGE_HOSTS.includes(parsed.hostname);
  } catch {
    return false;
  }
}

export function pickFestivalImage(name: string, imageUrl?: string | null): string | undefined {
  // 실제 공식 이미지(비-스톡)가 있으면 우선 사용
  if (imageUrl && !isLikelyStockImage(imageUrl)) {
    return imageUrl;
  }

  // 로컬 폴백 매핑이 있으면 교체
  const localFallback = FESTIVAL_IMAGE_FALLBACKS.find((item) => item.pattern.test(name))?.imageUrl;
  if (localFallback) {
    return localFallback;
  }

  // 로컬 폴백이 없으면 기존 이미지(Unsplash 포함)를 유지
  return imageUrl || undefined;
}

export function normalizeOfficialUrl(url?: string | null): string | undefined {
  if (!isUsableUrl(url)) return undefined;
  return url;
}

export function normalizeSourceUrl(sourceUrl: string | undefined, officialUrl?: string | null): string {
  if (isUsableUrl(sourceUrl)) return sourceUrl;
  if (isUsableUrl(officialUrl)) return officialUrl;
  return "https://korean.visitkorea.or.kr/main/fes_main.do";
}

/** 카테고리별 기본 폴백 이미지 (이미지가 전혀 없는 축제용) */
export const CATEGORY_FALLBACK_IMAGES: Record<string, string> = {
  FOOD: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800&auto=format&fit=crop",
  NATURE: "https://images.unsplash.com/photo-1490750967868-88aa4f44baee?w=800&auto=format&fit=crop",
  CULTURE: "https://images.unsplash.com/photo-1533669955142-6a73332af4db?w=800&auto=format&fit=crop",
  ART: "https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=800&auto=format&fit=crop",
  MUSIC: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800&auto=format&fit=crop",
  OTHER: "https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=800&auto=format&fit=crop"
};

export function normalizeCollectedFestival(item: CollectedFestival): CollectedFestival {
  const officialUrl = normalizeOfficialUrl(item.officialUrl);
  const sourceUrl = normalizeSourceUrl(item.sourceUrl, officialUrl);
  const imageUrl = pickFestivalImage(item.name, item.imageUrl);

  return {
    ...item,
    officialUrl,
    sourceUrl,
    imageUrl
  };
}
