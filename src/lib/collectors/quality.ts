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

const FESTIVAL_IMAGE_FALLBACKS: Array<{ pattern: RegExp; imageUrl: string }> = [];

const PROVINCE_ALIASES: Array<[RegExp, string]> = [
  [/^서울(특별시)?$/, "서울"],
  [/^부산(광역시)?$/, "부산"],
  [/^대구(광역시)?$/, "대구"],
  [/^인천(광역시)?$/, "인천"],
  [/^광주(광역시)?$/, "광주"],
  [/^대전(광역시)?$/, "대전"],
  [/^울산(광역시)?$/, "울산"],
  [/^세종(특별자치시|시)?$/, "세종"],
  [/^경기도$/, "경기"],
  [/^강원(도|특별자치도)?$/, "강원"],
  [/^충청북도$/, "충북"],
  [/^충청남도$/, "충남"],
  [/^전라북도|^전북특별자치도$/, "전북"],
  [/^전라남도$/, "전남"],
  [/^경상북도$/, "경북"],
  [/^경상남도$/, "경남"],
  [/^제주(도|특별자치도)?$/, "제주"]
];

function decodeHtmlEntities(value: string) {
  return value
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, "\"")
    .replace(/&#39;/g, "'");
}

export function stripHtml(value?: string | null): string | undefined {
  if (!value) return undefined;

  const stripped = decodeHtmlEntities(value)
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<\/?[^>]+(>|$)/g, "")
    .replace(/\s+/g, " ")
    .trim();

  return stripped || undefined;
}

export function normalizeUrl(url?: string | null): string | undefined {
  const stripped = stripHtml(url);
  if (!stripped) return undefined;

  const extracted = stripped.match(/https?:\/\/[^\s"'<>]+/i)?.[0] || stripped;
  const withProtocol = extracted.startsWith("www.") ? `https://${extracted}` : extracted;

  if (/\s/.test(withProtocol)) return undefined;

  try {
    const parsed = new URL(withProtocol);
    if (!["http:", "https:"].includes(parsed.protocol)) return undefined;
    parsed.hash = "";

    const normalized = parsed.toString();
    if (FAKE_URL_PATTERNS.some((pattern) => pattern.test(normalized))) return undefined;

    return normalized;
  } catch {
    return undefined;
  }
}

export function isUsableUrl(url?: string | null): url is string {
  return !!normalizeUrl(url);
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
  const normalizedImageUrl = normalizeUrl(imageUrl);
  if (normalizedImageUrl && !isLikelyStockImage(normalizedImageUrl)) {
    return normalizedImageUrl;
  }

  // 로컬 폴백 매핑이 있으면 교체
  const localFallback = FESTIVAL_IMAGE_FALLBACKS.find((item) => item.pattern.test(name))?.imageUrl;
  if (localFallback) {
    return localFallback;
  }

  // 범용 스톡 이미지는 실제 축제 이미지로 오인될 수 있어 저장하지 않습니다.
  return undefined;
}

export function normalizeOfficialUrl(url?: string | null): string | undefined {
  return normalizeUrl(url);
}

export function normalizeSourceUrl(sourceUrl: string | undefined, officialUrl?: string | null): string {
  return normalizeUrl(sourceUrl) || normalizeUrl(officialUrl) || "";
}

export function normalizeRegion(region?: string | null): string {
  const value = stripHtml(region)?.replace(/\s+/g, " ").trim();
  if (!value) return "전국";

  const parts = value.split(" ");
  const province = parts[0];
  const district = parts[1];
  const normalizedProvince = PROVINCE_ALIASES.find(([pattern]) => pattern.test(province))?.[1] || province;

  if (!district || normalizedProvince === district) {
    return normalizedProvince;
  }

  return `${normalizedProvince} ${district}`;
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
    name: stripHtml(item.name) || item.name.trim(),
    description: stripHtml(item.description),
    region: normalizeRegion(item.region),
    address: stripHtml(item.address),
    officialUrl,
    sourceUrl,
    imageUrl
  };
}
