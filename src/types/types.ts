export type Access = {
  date: Date;
  userAgent: string;
  referrer: string;
  country: string;
};
export type Accesses = {
  count: number;
  lastAccessed: Access[];
};
export type URLDocument = {
  _id: string;
  originalUrl: string;
  shortenUrl: string;
  alias?: string;
  accesses: Accesses;
  expirationDate?: Date;
  scheduledDate: Date | null;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
};
export type URLWithDuplicateCount = URLDocument & {
  duplicateCount: number;
  deletedAt?: Date | null;
};

export type SortOption =
  | "dateAsc"
  | "dateDesc"
  | "clicksAsc"
  | "clicksDesc"
  | "duplicateAsc"
  | "toBeDeleted"
  | "everything";

export type ChartColorOptions = {
  backgroundOptions: { color: string };
  areaChartColor: string;
  areaChartColors: string[];
  treemapColor: string;
  treemapColors: string[];
  heatmapColor: string;
  heatmapColors: string[];
  radarChartColor: string;
}