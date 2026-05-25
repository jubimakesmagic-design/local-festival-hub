// lib/collectors/types.ts

export interface CollectedFestival {
  name: string;
  description?: string;
  region: string;
  address?: string;
  startDate: Date;
  endDate: Date;
  category: "FOOD" | "CULTURE" | "ART" | "MUSIC" | "NATURE" | "OTHER";
  officialUrl?: string;
  imageUrl?: string;
  hasParking: boolean;
  hasShuttle: boolean;
  isPetFriendly: boolean;
  isChildFriendly: boolean;
  sourceName: string;
  sourceUrl: string;
}

export interface CollectParams {
  region?: string;
  category?: string;
}

export interface FestivalCollector {
  sourceName: string;
  sourceType: "LOCAL_GOV" | "NEWS" | "USER_SUBMIT" | "VISIT_KOREA";
  collect(params: CollectParams): Promise<CollectedFestival[]>;
}
