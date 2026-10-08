export type SiteSignals = {
  url: string;
  host: string;
  status: number;
  https: boolean;
  ttfbMs: number;
  loadMs: number;
  htmlKb: number;
  title: string;
  titleLength: number;
  description: string;
  descriptionLength: number;
  h1Count: number;
  h2Count: number;
  hasViewport: boolean;
  hasCanonical: boolean;
  hasLang: boolean;
  hasOpenGraph: boolean;
  hasTwitterCard: boolean;
  hasFavicon: boolean;
  noindex: boolean;
  robotsTxt: boolean;
  sitemap: boolean;
  schemaTypes: string[];
  hasLocalBusinessSchema: boolean;
  hasFaqSchema: boolean;
  imgCount: number;
  imgsMissingAlt: number;
  lazyImgs: number;
  modernImages: boolean;
  scriptCount: number;
  blockingScripts: number;
  stylesheets: number;
  wordCount: number;
  internalLinks: number;
  forms: number;
  inputs: number;
  labels: number;
  telLinks: number;
  mailtoLinks: number;
  whatsapp: boolean;
  ctaCount: number;
  hasChatWidget: boolean;
  hasBooking: boolean;
  testimonials: boolean;
  trustSignals: number;
  hasPrivacy: boolean;
  hasAddress: boolean;
  hasPhoneText: boolean;
  hasMapEmbed: boolean;
  hasGoogleReviewsLink: boolean;
  analytics: { ga: boolean; gtm: boolean; metaPixel: boolean; googleAds: boolean; linkedin: boolean; hotjar: boolean };
  pageSpeed: { performance: number; accessibility: number; seo: number; lcpMs: number | null; cls: number | null } | null;
};

export type ScoreKey =
  | "seo"
  | "speed"
  | "mobile"
  | "leadGen"
  | "conversion"
  | "trust"
  | "gbp"
  | "accessibility";

export type Check = { label: string; pass: boolean; tip: string; weight: number };

export type CategoryResult = {
  key: ScoreKey;
  label: string;
  score: number;
  summary: string;
  checks: Check[];
};

export type AuditReport = {
  signals: SiteSignals;
  categories: CategoryResult[];
  overall: number;
  grade: string;
  headline: string;
  losingLeads: string[];
  customersLeave: string[];
  improvements: string[];
  roadmap: { phase: string; window: string; items: string[] }[];
};
