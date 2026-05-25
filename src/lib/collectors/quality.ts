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
  /\/multi\/public\/notify\/view/i
];

const FESTIVAL_IMAGE_FALLBACKS: Array<{ pattern: RegExp; imageUrl: string }> = [
  { pattern: /보령.*머드|mud/i, imageUrl: "/images/boryeong_mud.png" },
  { pattern: /진해.*군항|군항제/i, imageUrl: "/images/jinhae_gunhangje.png" },
  { pattern: /곡성.*장미|세계장미/i, imageUrl: "/images/gokseong_roses_official.png" },
  { pattern: /홍어|한우|꼴갑|갑오징어/i, imageUrl: "/images/kkolgap_festival.png" }
];

export function isUsableUrl(url?: string | null): url is string {
  if (!url) return false;

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
  if (imageUrl && !isLikelyStockImage(imageUrl)) {
    return imageUrl;
  }

  return FESTIVAL_IMAGE_FALLBACKS.find((item) => item.pattern.test(name))?.imageUrl;
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
