export type DownloadFormat = "pdf" | "images";

export type PageRoute =
  | "home"
  | "how-it-works"
  | "blog"
  | "blog-article"
  | "about"
  | "contact"
  | "privacy"
  | "terms"
  | "legal"
  | "admin"
  | "sitemap"
  | "robots"
  | "custom-page";

export type ViewportMode = "responsive" | "desktop" | "tablet" | "mobile" | "presentation";

export type SupportedLanguage = "en" | "id" | "es" | "br" | "fr" | "de" | "hi" | "nl" | "ur";

export interface LanguageOption {
  code: SupportedLanguage;
  name: string;
  nativeName: string;
  flag: string;
  country: string;
  urlPrefix: string;
  isDefault?: boolean;
}

export type AdminRole = "owner" | "admin" | "editor" | "author" | "translator" | "seo";

export interface AdminUser {
  id: string;
  username: string;
  name: string;
  email: string;
  role: AdminRole;
  avatar?: string;
  createdAt: string;
  lastLogin?: string;
}

export interface CmsCategory {
  id: string;
  name: string;
  slug: string;
  description?: string;
  parentId?: string;
  seoTitle?: string;
  metaDescription?: string;
  status: "active" | "inactive";
  count?: number;
}

export interface CmsTag {
  id: string;
  name: string;
  slug: string;
  description?: string;
  count?: number;
}

export interface CmsAd {
  id: string;
  name: string;
  placement: string;
  type: "html" | "javascript" | "network" | "image" | "custom";
  code: string;
  status: "active" | "disabled";
  device: "all" | "desktop" | "tablet" | "mobile";
  targetPage?: string;
  targetCategory?: string;
  targetLanguage?: string;
  startDate?: string;
  endDate?: string;
  impressions?: number;
  clicks?: number;
}

export interface CmsRedirect {
  id: string;
  sourceUrl: string;
  destinationUrl: string;
  statusCode: 301 | 302 | 307 | 308;
  status: "active" | "disabled";
  hits: number;
  createdAt: string;
  lastHit?: string;
}

export interface CmsNotFoundEntry {
  id: string;
  url: string;
  hits: number;
  firstSeen: string;
  lastSeen: string;
  referer?: string;
}

export interface CmsRevision {
  id: string;
  entityId: string;
  entityType: "page" | "post" | "homepage" | "seo" | "settings";
  date: string;
  user: string;
  title: string;
  summary: string;
  snapshot: any;
}

export interface CmsActivityLog {
  id: string;
  user: string;
  role: string;
  action: string;
  object: string;
  date: string;
  ip?: string;
}

export interface CmsContentHealth {
  missingMetaTitles: number;
  missingMetaDescriptions: number;
  missingAltText: number;
  missingTranslations: number;
  noindexPages: number;
  draftPosts: number;
  draftPages: number;
  brokenLinks: number;
}

export type GutenbergBlockType =
  | "paragraph"
  | "heading"
  | "image"
  | "quote"
  | "callout"
  | "code"
  | "list"
  | "table"
  | "faq"
  | "columns"
  | "button"
  | "ad"
  | "html"
  | "divider"
  | "spacer";

export interface GutenbergBlock {
  id: string;
  type: GutenbergBlockType;
  content: string;
  level?: 1 | 2 | 3 | 4 | 5 | 6;
  textAlign?: "left" | "center" | "right";
  caption?: string;
  altText?: string;
  styleVariant?: "info" | "warning" | "success" | "tip" | "note";
  listType?: "unordered" | "ordered";
  listItems?: string[];
  imageUrl?: string;
  imageAlign?: "left" | "center" | "right" | "wide" | "full";
  hasHeader?: boolean;
  tableHeaders?: string[];
  tableRows?: string[][];
  faqItems?: Array<{ question: string; answer: string }>;
  includeFaqSchema?: boolean;
  columns?: string[];
  columnLayout?: "50-50" | "30-70" | "70-30" | "33-33-33";
  buttonText?: string;
  buttonUrl?: string;
  buttonVariant?: "primary" | "secondary" | "outline";
  buttonAlign?: "left" | "center" | "right";
  buttonNewTab?: boolean;
  adSlot?: "in-feed" | "below-hero" | "sidebar" | "article-mid";
  adCode?: string;
  adLabel?: string;
  codeLanguage?: string;
  spacerHeight?: number;
  customClassName?: string;
}

export interface AdSettings {
  enabled: boolean; // Master ad toggle
  // Download Button New-Tab Ad Trigger
  newTabOnDownload: boolean;
  newTabUrl: string;
  // Pre-Download Interstitial Modal
  preDownloadAd: boolean;
  preDownloadSeconds: number;
  // Post-Download Card Ad
  postDownloadAd: boolean;
  // Ad Placement Slots
  headerAd?: boolean;
  headerAdCode?: string;
  belowHeroAd?: boolean;
  belowHeroAdCode?: string;
  inFeedAd?: boolean;
  inFeedAdCode?: string;
  sidebarAd: boolean;
  sidebarAdCode?: string;
  footerAd?: boolean;
  footerAdCode?: string;
  popupAd: boolean;
  popupDelaySeconds: number;
  // Ad Networks & Creative
  antiAdblock?: boolean;
  adblockNotice: boolean;
  customBannerHtml: string;
  adSenseScript?: string;
  sponsorName: string;
  sponsorTagline: string;
  sponsorCta: string;
}

export interface DownloadSettings {
  autoDownloadDefault: boolean;
  rateLimitPerMin: number;
  cacheDurationHours: number;
  maxFileSizeMb: number;
  allowHighResThumbnails: boolean;
}

export interface SiteSettings {
  siteName: string;
  tagline: string;
  logoText: string;
  noticeBannerEnabled: boolean;
  noticeBannerText: string;
  contactEmail: string;
  footerCopyright: string;
  headerScripts: string;
  footerScripts: string;
  maintenanceMode: boolean;
  defaultMetaTitle: string;
  defaultMetaDescription: string;
}

export interface PageContent {
  id: string;
  pageKey?: string;
  language?: SupportedLanguage;
  title: string;
  subtitle?: string;
  content?: string;
  metaDescription?: string;
  h1Heading?: string;
  heroHeading?: string;
  heroDescription?: string;
  ctaButtonText?: string;
  updatedAt?: string;
}

export interface CustomPage {
  id: string;
  title: string;
  slug: string;
  subtitle?: string;
  content: string;
  metaTitle: string;
  metaDescription: string;
  status: "published" | "draft";
  isCustom?: boolean;
  showInHeader?: boolean;
  showInFooter?: boolean;
  lastModified: string;
  createdAt?: string;
  language?: SupportedLanguage | "all";
  author?: string;
  authorName?: string;
  translationGroupId?: string;
  featuredImage?: string;
  excerpt?: string;
  canonicalUrl?: string;
  noindex?: boolean;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  inTrash?: boolean;
}

export interface SeoRobotsConfig {
  content: string;
  userAgent: string;
  allowAll: boolean;
  disallowAdmin: boolean;
  disallowApi: boolean;
  disallowTemp: boolean;
  crawlDelay?: number;
  sitemapUrl: string;
  lastUpdated?: string;
}

export interface SeoSitemapConfig {
  content: string;
  domain: string;
  includeStandardPages: boolean;
  includeBlogPosts: boolean;
  includeCustomPages: boolean;
  includeLanguages: boolean;
  defaultPriority: string;
  defaultChangeFreq: "daily" | "weekly" | "monthly";
  lastUpdated?: string;
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  date: string;
  isRead: boolean;
}

export interface MediaItem {
  id: string;
  name: string;
  url: string;
  sizeBytes: number;
  type: string;
  createdAt: string;
}

export interface AnalyticsStats {
  totalDownloads: number;
  todayDownloads: number;
  bandwidthBytes: number;
  successRate: number;
  adImpressions: number;
  adClicks: number;
  adblockCount: number;
  recentDownloads: Array<{
    id: string;
    title: string;
    time: string;
    status: string;
    sizeFormatted: string;
  }>;
}

export interface DownloadJob {
  id: string;
  url: string;
  format: DownloadFormat;
  status: "queued" | "fetching" | "extracting" | "converting" | "completed" | "failed";
  progress: number;
  stepMessage: string;
  logs: string[];
  createdAt: number;
  dir: string;
  documentTitle?: string;
  speedStats?: {
    totalTimeMs: number;
    fetchTimeMs: number;
    compileTimeMs: number;
    pageCount: number;
    cached?: boolean;
    mode?: string;
  };
  pdfFile?: {
    filename: string;
    sizeBytes: number;
    path: string;
  };
  imageFiles?: Array<{
    filename: string;
    pageNumber: number;
    sizeBytes: number;
  }>;
  error?: string;
  troubleshooting?: string[];
}

export interface AuthorProfile {
  name: string;
  role: string;
  title?: string;
  bio: string;
  email: string;
  avatar: string;
  skills: string[];
  website?: string;
  socials?: {
    twitter?: string;
    linkedin?: string;
    github?: string;
  };
}

export interface BlogPost {
  language?: SupportedLanguage;
  translationGroupId?: string;
  status?: "published" | "draft";
  htmlContent?: string;
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  category: "Guides" | "Tutorials" | "Tech" | "Tips" | string;
  readTime: string;
  date: string;
  author: {
    name: string;
    role: string;
    avatar: string;
    bio?: string;
    email?: string;
  };
  image: string;
  featured?: boolean;
  tags?: string[];
  metaTitle?: string;
  metaDescription?: string;
  canonicalUrl?: string;
  noindex?: boolean;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  inTrash?: boolean;
  blocks?: GutenbergBlock[];
  content?: {
    intro: string;
    tableOfContents: string[];
    sections: Array<{
      heading: string;
      body: string[];
      tip?: string;
      image?: string;
    }>;
  };
}

export interface RobotsConfig {
  content: string;
  updatedAt: string;
}

export interface SitemapConfig {
  content: string;
  updatedAt: string;
  totalUrls: number;
}

export type McpPlatform = "opencode" | "antigravity" | "cursor" | "claude" | "custom";

export type McpScope =
  | "full_control"
  | "seo_technical"
  | "content_manager"
  | "ui_ux_control"
  | "read_only";

export interface McpCredential {
  id: string;
  name: string;
  platform: McpPlatform;
  username: string;
  applicationPassword: string;
  scope: McpScope;
  active: boolean;
  createdAt: string;
  lastUsedAt?: string;
  expiresAt?: string;
  totalRequests: number;
  lastIp?: string;
}

export interface McpToolDefinition {
  name: string;
  description: string;
  category: "seo_onpage" | "seo_technical" | "content" | "ui_ux" | "system" | "marketing" | "custom";
  enabled: boolean;
  isCustom?: boolean;
  systemInstruction?: string;
  lastExecutedAt?: string;
  executionCount?: number;
  inputSchema: {
    type: string;
    properties: Record<string, any>;
    required?: string[];
  };
}

export interface McpInvocationLog {
  id: string;
  timestamp: string;
  clientName: string;
  username: string;
  platform: McpPlatform;
  toolName: string;
  status: "success" | "error";
  durationMs: number;
  paramsSummary?: string;
  responseSummary?: string;
  ip?: string;
}

export interface UiUxIssueReport {
  id: string;
  type:
    | "contrast"
    | "mobile_viewport"
    | "missing_alt"
    | "broken_link"
    | "banner_overlap"
    | "heading_order"
    | "performance"
    | "touch_target";
  severity: "critical" | "warning" | "info";
  element: string;
  description: string;
  suggestion: string;
  autoFixable: boolean;
  resolved: boolean;
}
