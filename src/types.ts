export type DownloadFormat = "pdf";

export type PageRoute =
  | "home"
  | "how-it-works"
  | "blog"
  | "blog-article"
  | "about"
  | "contact"
  | "privacy"
  | "terms"
  | "admin"
  | "sitemap"
  | "custom-page";

export type ViewportMode = "responsive" | "desktop" | "tablet" | "mobile" | "presentation";

export type SupportedLanguage = "en" | "br" | "es" | "fr" | "de" | "id" | "pt";

export interface LanguageOption {
  code: SupportedLanguage;
  name: string;
  nativeName: string;
  flag: string;
  country: string;
  urlPrefix: string;
}

export type AdminRole = "superadmin" | "editor" | "viewer";

export interface AdminUser {
  username: string;
  role: AdminRole;
  name: string;
}

export type GutenbergBlockType =
  | "paragraph"
  | "heading"
  | "image"
  | "quote"
  | "callout"
  | "code"
  | "list"
  | "divider";

export interface GutenbergBlock {
  id: string;
  type: GutenbergBlockType;
  content: string;
  level?: 1 | 2 | 3;
  caption?: string;
  styleVariant?: "info" | "warning" | "success" | "tip" | "note";
  listItems?: string[];
  imageUrl?: string;
}

export interface AdSettings {
  enabled: boolean;
  headerAd?: boolean;
  inFeedAd?: boolean;
  antiAdblock?: boolean;
  preDownloadAd: boolean;
  preDownloadSeconds: number;
  postDownloadAd: boolean;
  newTabOnDownload: boolean;
  newTabUrl: string;
  sidebarAd: boolean;
  popupAd: boolean;
  popupDelaySeconds: number;
  adblockNotice: boolean;
  customBannerHtml: string;
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
  content: string;
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
  format: "pdf";
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
  };
  image: string;
  featured?: boolean;
  blocks?: GutenbergBlock[];
  content: {
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
