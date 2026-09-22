export type Platform = "macOS" | "Windows" | "iOS" | "Android" | "Web";
export type ProductStatus =
  | "exploring"
  | "development"
  | "private-beta"
  | "preview"
  | "published"
  | "maintained"
  | "maintenance"
  | "archived"
  | "discontinued";
export type ReleaseChannel = "stable" | "preview" | "beta";
export type Provenance = "verified" | "showcase" | "synthetic";
export type VerifiedProduct = Product & { provenance: "verified" };
export type ShowcaseProduct = Product & { provenance: "showcase" };
export type ResolvedPublication =
  | { kind: "verified"; product: VerifiedProduct }
  | { kind: "showcase"; product: ShowcaseProduct };
export type ProductTone =
  "clay" | "olive" | "forest" | "sky" | "ochre" | "plum";

export interface ProductCopy {
  tagline: string;
  description: string;
  features: { title: string; description: string }[];
}
export interface MediaAsset {
  src: string;
  alt: string;
  width: number;
  height: number;
  kind: "screenshot" | "artwork" | "video";
  poster?: string;
}
export interface Download {
  id: string;
  platform: Platform;
  label: string;
  url: string;
  channel: ReleaseChannel;
  architecture?: string;
  size?: string;
  checksum?: string;
  signature?: string;
  autoUpdate?: string;
}
export interface PrivacyNotice {
  updatedAt: string;
  summary: string;
  collected: string[];
  notCollected: string[];
  retention: string;
  deletion: string;
  services: { name: string; purpose: string }[];
  history: { date: string; change: string }[];
  storage?: string;
}
export interface ProductEra {
  date: string;
  version: string;
  title: string;
  summary: string;
}
export interface CompanyMilestone {
  id: string;
  year: number;
  title: string;
  description: string;
  provenance: Provenance;
}
export interface Product extends ProductCopy {
  id: string;
  slug: string;
  name: string;
  koreanName?: string;
  edition: string;
  provenance: Provenance;
  visibility: "public" | "internal";
  category: string;
  status: ProductStatus;
  platforms: Platform[];
  version?: string;
  firstReleasedAt?: string;
  latestReleasedAt?: string;
  expectedRelease?: string;
  publisher: string;
  price?: {
    model: "free" | "paid" | "subscription" | "freemium";
    text: string;
  };
  productUrl?: string;
  downloads: Download[];
  appStoreUrls?: { platform: Platform; url: string }[];
  media: MediaAsset[];
  icon: "sound" | "notes" | "focus" | "weather" | "spending" | "planning";
  tone: ProductTone;
  channels: ReleaseChannel[];
  requirements: { platform: Platform; description: string }[];
  accessibility: string[];
  languages: string[];
  resources: Partial<
    Record<
      | "support"
      | "documentation"
      | "privacy"
      | "terms"
      | "status"
      | "security"
      | "developer",
      string
    >
  >;
  privacy?: PrivacyNotice;
  archiveReason?: string;
  team?: string[];
  translations?: Record<string, ProductCopy>;
  architecture?: string[];
  supportState?: "active" | "security-only" | "read-only";
  history?: ProductEra[];
  relatedProductIds?: string[];
  successorId?: string;
  migration?: string;
}
export interface Release {
  id: string;
  productId: string;
  version: string;
  publishedAt: string;
  provenance: Provenance;
  title: string;
  summary: string;
  kind: "major" | "feature" | "maintenance" | "preview";
  channel: ReleaseChannel;
  platforms: Platform[];
  improvements: string[];
  fixes: string[];
  securityNotes: string[];
  compatibility: string[];
  knownIssues: string[];
  downloads: Download[];
  previousVersion?: string;
}
export interface SupportArticle {
  id: string;
  productId: string;
  slug: string;
  title: string;
  category:
    "getting-started" | "troubleshooting" | "accessibility" | "reference";
  updatedAt: string;
  provenance: Provenance;
  sections: { heading: string; paragraphs: string[] }[];
}
export interface PressItem {
  id: string;
  slug: string;
  title: string;
  publishedAt: string;
  provenance: Provenance;
  productId?: string;
  summary: string;
  paragraphs: string[];
  assets: { label: string; url: string; description: string }[];
}
export interface PublisherCatalog {
  edition: "live" | "demo" | "showcase";
  asOf: string;
  products: Product[];
  releases: Release[];
  supportArticles: SupportArticle[];
  pressItems: PressItem[];
  milestones?: CompanyMilestone[];
}
export type Query = Record<string, string | string[] | undefined>;
