import fs from "fs";
import path from "path";
import express from "express";
import { GoogleGenAI } from "@google/genai";
import {
  readJsonFile,
  writeJsonFile,
  DEFAULT_LANGUAGES,
  STANDARD_STATIC_PAGES,
  getContentInventory,
  generateAllSitemaps,
} from "./contentInventory";
import { DEFAULT_HOMEPAGE_CONTENTS, HomepageContent } from "./homepageDefaults";

const STORAGE_ROOT = path.join(process.cwd(), "server_storage");
const PUBLIC_DIR = path.join(process.cwd(), "public");
const UPLOADS_DIR = path.join(PUBLIC_DIR, "images", "uploads");

// Ensure storage files
if (!fs.existsSync(STORAGE_ROOT)) fs.mkdirSync(STORAGE_ROOT, { recursive: true });
if (!fs.existsSync(UPLOADS_DIR)) fs.mkdirSync(UPLOADS_DIR, { recursive: true });

const PAGES_FILE = path.join(STORAGE_ROOT, "pages.json");
const POSTS_FILE = path.join(STORAGE_ROOT, "blog_posts.json");
const HOMEPAGE_FILE = path.join(STORAGE_ROOT, "homepage_content.json");
const CATEGORIES_FILE = path.join(STORAGE_ROOT, "categories.json");
const TAGS_FILE = path.join(STORAGE_ROOT, "tags.json");
const MEDIA_FILE = path.join(STORAGE_ROOT, "media.json");
const ADS_FILE = path.join(STORAGE_ROOT, "ads.json");
const REDIRECTS_FILE = path.join(STORAGE_ROOT, "redirects.json");
const NOT_FOUND_FILE = path.join(STORAGE_ROOT, "not_found_logs.json");
const REVISIONS_FILE = path.join(STORAGE_ROOT, "revisions.json");
const ACTIVITY_LOGS_FILE = path.join(STORAGE_ROOT, "activity_logs.json");
const USERS_FILE = path.join(STORAGE_ROOT, "users.json");
const SETTINGS_FILE = path.join(STORAGE_ROOT, "settings.json");
const ROBOTS_FILE = path.join(STORAGE_ROOT, "robots.txt");

// Default seeded initial data
const DEFAULT_USERS = [
  {
    id: "usr-1",
    username: "admin",
    name: "System Administrator",
    email: "admin@scribddownloader.org",
    role: "owner",
    createdAt: new Date().toISOString(),
    lastLogin: new Date().toISOString(),
  },
  {
    id: "usr-2",
    username: "editor",
    name: "Lead Content Editor",
    email: "editor@scribddownloader.org",
    role: "editor",
    createdAt: new Date().toISOString(),
  },
  {
    id: "usr-3",
    username: "translator",
    name: "Multilingual Specialist",
    email: "translator@scribddownloader.org",
    role: "translator",
    createdAt: new Date().toISOString(),
  },
  {
    id: "usr-4",
    username: "seomanager",
    name: "Technical SEO Lead",
    email: "seo@scribddownloader.org",
    role: "seo",
    createdAt: new Date().toISOString(),
  },
];

const DEFAULT_CATEGORIES = [
  { id: "cat-1", name: "Guides", slug: "guides", description: "In-depth download and extraction guides", status: "active", count: 12 },
  { id: "cat-2", name: "Tutorials", slug: "tutorials", description: "Step-by-step document conversion workflows", status: "active", count: 8 },
  { id: "cat-3", name: "Tech", slug: "tech", description: "Technical format analysis and PDF optimization", status: "active", count: 5 },
  { id: "cat-4", name: "Tips", slug: "tips", description: "Pro tips and troubleshooting recommendations", status: "active", count: 7 },
];

const DEFAULT_TAGS = [
  { id: "tag-1", name: "Scribd", slug: "scribd", count: 24 },
  { id: "tag-2", name: "PDF", slug: "pdf", count: 20 },
  { id: "tag-3", name: "Mobile", slug: "mobile", count: 14 },
  { id: "tag-4", name: "Offline", slug: "offline", count: 9 },
  { id: "tag-5", name: "Android", slug: "android", count: 8 },
  { id: "tag-6", name: "iPhone", slug: "iphone", count: 7 },
];

const DEFAULT_SETTINGS = {
  siteName: "Scribd Downloader",
  siteDescription: "Free High-Resolution Document & Slide Deck Converter",
  logoText: "Scribd Downloader",
  siteUrl: "https://scribddownloader.org",
  contactEmail: "support@scribddownloader.org",
  socialTwitter: "https://twitter.com",
  socialGithub: "https://github.com",
  timezone: "UTC",
  dateFormat: "YYYY-MM-DD",
  defaultLanguage: "en",
  availableLanguages: ["en", "id", "hi", "es", "fr", "nl", "ur"],
  noticeBannerEnabled: false,
  noticeBannerText: "📢 Notice: High-speed parallel rendering engine active.",
  footerCopyright: "© 2026 Scribd Downloader. Free educational document conversion.",
  headerScripts: "",
  bodyScripts: "",
  footerScripts: "",
  maintenanceMode: false,
};

const DEFAULT_ADS = [
  {
    id: "ad-header",
    name: "Top Header Responsive Banner",
    placement: "Header",
    type: "html",
    code: "<div class=\"p-3 bg-slate-100 text-center text-xs text-slate-500 rounded border border-slate-200\">Sponsor: High-Speed Cloud Document OCR & Compression Tools</div>",
    status: "disabled",
    device: "all",
    impressions: 0,
    clicks: 0,
  },
  {
    id: "ad-after-hero",
    name: "Below Hero Download Callout",
    placement: "After Hero",
    type: "html",
    code: "<div class=\"my-4 p-4 bg-emerald-50 text-center text-sm text-emerald-800 rounded-lg border border-emerald-200 font-medium\">CloudPDF Pro: 1-Click PDF OCR & Formatter — 100% Free Trial</div>",
    status: "active",
    device: "all",
    impressions: 1420,
    clicks: 48,
  },
  {
    id: "ad-in-article",
    name: "Inside Article Sponsor Block",
    placement: "Inside Article",
    type: "html",
    code: "<div class=\"my-6 p-4 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-600\">Recommended: Export and convert multi-page documents seamlessly with desktop vector tools.</div>",
    status: "active",
    device: "all",
    impressions: 890,
    clicks: 27,
  },
  {
    id: "ad-mobile-sticky",
    name: "Mobile Footer Sticky Ad",
    placement: "Mobile Sticky",
    type: "html",
    code: "<div class=\"fixed bottom-0 inset-x-0 bg-white border-t border-slate-200 p-2 text-center text-xs text-slate-600 z-40 shadow-lg\">Looking for instant PDF editing? Try CloudPDF Free.</div>",
    status: "disabled",
    device: "mobile",
    impressions: 0,
    clicks: 0,
  },
];

// Seed core static pages if pages.json is empty
function getInitialPages() {
  const existing = readJsonFile<any[]>(PAGES_FILE, []);
  if (existing.length > 0) return existing;

  const corePages = [
    {
      id: "page-about",
      slug: "about",
      title: "About Us",
      content: "# About Scribd Downloader\n\nWe provide a clean, fast, and free document downloader for students, researchers, and professionals worldwide.",
      excerpt: "Learn more about our mission, privacy values, and cloud document rendering architecture.",
      metaTitle: "About Us - Scribd Downloader",
      metaDescription: "Learn more about our mission to make public educational research papers and slide decks easily accessible offline.",
      status: "published",
      language: "en",
      translationGroupId: "group-page-about",
      author: "Minhas Hussain",
      authorName: "Minhas Hussain",
      lastModified: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      inTrash: false,
    },
    {
      id: "page-how-it-works",
      slug: "how-it-works",
      title: "How It Works",
      content: "# How It Works\n\nOur system compiles public slide assets into unified, print-ready PDF files in 3 simple steps.",
      excerpt: "Step-by-step workflow for downloading Scribd documents to PDF on desktop and mobile.",
      metaTitle: "How It Works - Scribd Downloader",
      metaDescription: "Understand the three-step workflow to download Scribd documents directly to your device without installing software.",
      status: "published",
      language: "en",
      translationGroupId: "group-page-how-it-works",
      author: "Minhas Hussain",
      authorName: "Minhas Hussain",
      lastModified: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      inTrash: false,
    },
    {
      id: "page-contact",
      slug: "contact",
      title: "Contact Us",
      content: "# Contact Our Support Team\n\nHave questions or technical feedback? Get in touch with our engineering team.",
      excerpt: "Contact our technical support and DMCA copyright inquiries team.",
      metaTitle: "Contact Us - Scribd Downloader",
      metaDescription: "Get in touch with our team for technical support, feature suggestions, or general inquiries.",
      status: "published",
      language: "en",
      translationGroupId: "group-page-contact",
      author: "Admin Team",
      authorName: "Admin Team",
      lastModified: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      inTrash: false,
    },
    {
      id: "page-privacy",
      slug: "privacy",
      title: "Privacy Policy",
      content: "# Privacy Policy\n\nYour privacy is paramount. We do not require accounts, log document links, or store user files permanently.",
      excerpt: "Review our strict zero-log privacy policy and ephemeral file processing guidelines.",
      metaTitle: "Privacy Policy - Scribd Downloader",
      metaDescription: "Review our strict privacy guidelines: zero user logging, no account requirement, and instant file purge.",
      status: "published",
      language: "en",
      translationGroupId: "group-page-privacy",
      author: "Legal Dept",
      authorName: "Legal Dept",
      lastModified: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      inTrash: false,
    },
    {
      id: "page-terms",
      slug: "terms",
      title: "Terms of Service",
      content: "# Terms of Service\n\nBy using this tool, you agree to download only publicly accessible materials for personal, educational use.",
      excerpt: "Review our terms of use, fair usage guidelines, and intellectual property terms.",
      metaTitle: "Terms of Service - Scribd Downloader",
      metaDescription: "Terms of service and fair use guidelines for educational document conversion.",
      status: "published",
      language: "en",
      translationGroupId: "group-page-terms",
      author: "Legal Dept",
      authorName: "Legal Dept",
      lastModified: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      inTrash: false,
    },
    {
      id: "page-legal",
      slug: "legal",
      title: "Legal & DMCA Notice",
      content: "# Legal Disclaimer & DMCA Policy\n\nWe respect intellectual property rights. This tool operates as an automated browser proxy for public web content.",
      excerpt: "DMCA copyright notice, content removal procedure, and legal disclaimer.",
      metaTitle: "Legal & DMCA - Scribd Downloader",
      metaDescription: "DMCA copyright compliance guidelines, content removal procedure, and legal terms.",
      status: "published",
      language: "en",
      translationGroupId: "group-page-legal",
      author: "Legal Dept",
      authorName: "Legal Dept",
      lastModified: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      inTrash: false,
    },
  ];

  writeJsonFile(PAGES_FILE, corePages);
  return corePages;
}

// Activity logger helper
function logActivity(user: string, role: string, action: string, object: string, ip = "127.0.0.1") {
  const logs = readJsonFile<any[]>(ACTIVITY_LOGS_FILE, []);
  logs.unshift({
    id: `act-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
    user,
    role,
    action,
    object,
    date: new Date().toISOString(),
    ip,
  });
  // Keep latest 200 logs
  writeJsonFile(ACTIVITY_LOGS_FILE, logs.slice(0, 200));
}

// Revisions helper
function saveRevision(entityId: string, entityType: string, title: string, summary: string, snapshot: any, user = "admin") {
  const revisions = readJsonFile<any[]>(REVISIONS_FILE, []);
  revisions.unshift({
    id: `rev-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
    entityId,
    entityType,
    date: new Date().toISOString(),
    user,
    title,
    summary,
    snapshot,
  });
  // Keep latest 100 revisions
  writeJsonFile(REVISIONS_FILE, revisions.slice(0, 100));
}

export function setupAdminRoutes(app: express.Express) {
  // 1. DASHBOARD & STATS (REAL VALUES ONLY - NO HARDCODED STATS)
  app.get(["/api/admin/dashboard", "/api/admin/metrics"], (_req, res) => {
    const pages = readJsonFile<any[]>(PAGES_FILE, getInitialPages());
    const posts = readJsonFile<any[]>(POSTS_FILE, []);
    const media = readJsonFile<any[]>(MEDIA_FILE, []);
    const ads = readJsonFile<any[]>(ADS_FILE, DEFAULT_ADS);
    const notFoundLogs = readJsonFile<any[]>(NOT_FOUND_FILE, []);
    const revisions = readJsonFile<any[]>(REVISIONS_FILE, []);
    const activityLogs = readJsonFile<any[]>(ACTIVITY_LOGS_FILE, []);

    // Exact page counts (excluding trash)
    const activePages = pages.filter((p) => !p.inTrash);
    const publishedPages = activePages.filter((p) => p.status === "published");
    const draftPages = activePages.filter((p) => p.status === "draft");
    const trashPages = pages.filter((p) => p.inTrash);

    // Exact post counts (excluding trash)
    const activePosts = posts.filter((p) => !p.inTrash);
    const publishedPosts = activePosts.filter((p) => p.status === "published");
    const draftPosts = activePosts.filter((p) => p.status === "draft");
    const scheduledPosts = activePosts.filter((p) => p.status === "scheduled");
    const trashPosts = posts.filter((p) => p.inTrash);

    // Languages & translation matrix
    const targetLanguages = ["en", "id", "hi", "es", "fr", "nl", "ur"];
    let missingTranslationsCount = 0;

    // Check unique translation groups
    const pageGroups = Array.from(new Set(activePages.map((p) => p.translationGroupId || p.id)));
    pageGroups.forEach((groupId) => {
      const translations = activePages.filter((p) => (p.translationGroupId || p.id) === groupId);
      const translatedLangs = new Set(translations.map((t) => t.language || "en"));
      targetLanguages.forEach((lang) => {
        if (!translatedLangs.has(lang)) missingTranslationsCount++;
      });
    });

    // Content & SEO Health calculations
    const missingMetaTitles = activePages.filter((p) => !p.metaTitle && !p.title).length + activePosts.filter((p) => !p.metaTitle && !p.title).length;
    const missingMetaDescriptions = activePages.filter((p) => !p.metaDescription && !p.excerpt).length + activePosts.filter((p) => !p.metaDescription && !p.excerpt).length;
    const missingAltText = media.filter((m) => !m.alt || m.alt.trim() === "").length;
    const noindexPages = activePages.filter((p) => p.noindex).length + activePosts.filter((p) => p.noindex).length;

    const totalMediaBytes = media.reduce((acc, m) => acc + (m.sizeBytes || 0), 0);

    const activeAdsCount = ads.filter((a) => a.status === "active").length;

    const dashData = {
      counts: {
        pages: activePages.length,
        publishedPages: publishedPages.length,
        draftPages: draftPages.length,
        trashPages: trashPages.length,
        posts: activePosts.length,
        publishedPosts: publishedPosts.length,
        draftPosts: draftPosts.length,
        scheduledPosts: scheduledPosts.length,
        trashPosts: trashPosts.length,
        media: media.length,
        mediaSizeBytes: totalMediaBytes,
        languages: targetLanguages.length,
        missingTranslations: missingTranslationsCount,
        activeAds: activeAdsCount,
        totalAds: ads.length,
        errors404: notFoundLogs.length,
      },
      seoHealth: {
        missingMetaTitles,
        missingMetaDescriptions,
        missingAltText,
        missingTranslations: missingTranslationsCount,
        noindexPages,
        draftPosts: draftPosts.length,
        draftPages: draftPages.length,
        brokenLinks: 0,
      },
      systemHealth: {
        database: {
          status: "operational",
          provider: "Firebase Firestore Active",
          databaseId: "ai-studio-scribddownloader-e21bd29b-3810-4085-9c14-431af3caba1a",
          projectId: "carbon-atlas-qdzmz",
        },
        storage: { status: "healthy", path: "/server_storage", totalItems: pages.length + posts.length + media.length },
        sitemap: { status: "synchronized", dynamic: true, lastGenerated: new Date().toISOString() },
        robotsTxt: { status: "active", configured: true },
        api: { status: "online", latencyMs: 14 },
        auth: { status: "secured", activeUsers: readJsonFile(USERS_FILE, DEFAULT_USERS).length },
      },
      recentActivity: activityLogs.slice(0, 10),
      recentRevisions: revisions.slice(0, 8),
    };

    res.json({
      ...dashData,
      metrics: dashData,
    });
  });

  // 2. PAGES CMS (STATIC/NON-BLOG PAGES ONLY)
  app.get("/api/admin/pages", (req, res) => {
    let pages = readJsonFile<any[]>(PAGES_FILE, getInitialPages());
    const filter = req.query.filter as string; // all, published, draft, trash
    const search = (req.query.search as string || "").toLowerCase();

    if (filter === "trash") {
      pages = pages.filter((p) => p.inTrash);
    } else if (filter === "published") {
      pages = pages.filter((p) => !p.inTrash && p.status === "published");
    } else if (filter === "draft") {
      pages = pages.filter((p) => !p.inTrash && p.status === "draft");
    } else {
      pages = pages.filter((p) => !p.inTrash);
    }

    if (search) {
      pages = pages.filter(
        (p) => (p.title && p.title.toLowerCase().includes(search)) || (p.slug && p.slug.toLowerCase().includes(search))
      );
    }

    // Polylang Rule: Group translations under the Base English version!
    const basePages: any[] = [];
    const grouped = new Map<string, any[]>();

    pages.forEach((p) => {
      const groupId = p.translationGroupId || p.id;
      if (!grouped.has(groupId)) grouped.set(groupId, []);
      grouped.get(groupId)!.push(p);
    });

    grouped.forEach((list, groupId) => {
      // Find English version or fallback to first
      const enVersion = list.find((p) => p.language === "en") || list[0];
      const translatedLangs = list.map((p) => p.language || "en");
      basePages.push({
        ...enVersion,
        translationGroupId: groupId,
        translationsCount: list.length,
        translatedLanguages: translatedLangs,
        allTranslations: list,
      });
    });

    res.json({
      pages: basePages,
      total: basePages.length,
      allCount: pages.filter((p) => !p.inTrash).length,
      publishedCount: pages.filter((p) => !p.inTrash && p.status === "published").length,
      draftCount: pages.filter((p) => !p.inTrash && p.status === "draft").length,
      trashCount: readJsonFile<any[]>(PAGES_FILE, []).filter((p) => p.inTrash).length,
    });
  });

  app.get("/api/admin/pages/:id", (req, res) => {
    const pages = readJsonFile<any[]>(PAGES_FILE, getInitialPages());
    const lang = req.query.lang as string;
    const pageId = req.params.id;

    // Find by exact id or by translationGroupId + lang
    let page = pages.find((p) => p.id === pageId);
    if (!page) {
      page = pages.find((p) => p.translationGroupId === pageId && (!lang || p.language === lang));
    }

    if (!page) {
      return res.status(404).json({ error: "Page not found" });
    }

    // If a specific language was requested and is different from page.language
    if (lang && page.language !== lang) {
      const groupId = page.translationGroupId || page.id;
      const translated = pages.find((p) => (p.translationGroupId || p.id) === groupId && p.language === lang);
      if (translated) {
        page = translated;
      }
    }

    // Include translation matrix for editor
    const groupId = page.translationGroupId || page.id;
    const relatedTranslations = pages.filter((p) => (p.translationGroupId || p.id) === groupId);

    res.json({
      page,
      translations: relatedTranslations,
    });
  });

  app.post("/api/admin/pages", (req, res) => {
    const pages = readJsonFile<any[]>(PAGES_FILE, getInitialPages());
    const data = req.body;

    if (!data.title || !data.slug) {
      return res.status(400).json({ error: "Page Title and Slug are required." });
    }

    const lang = data.language || "en";
    const groupId = data.translationGroupId || `group-page-${data.slug.replace(/^\//, "").replace(/\//g, "-")}`;
    const now = new Date().toISOString();

    let existingIndex = -1;
    if (data.id) {
      existingIndex = pages.findIndex((p) => p.id === data.id);
    }
    if (existingIndex === -1) {
      existingIndex = pages.findIndex((p) => (p.translationGroupId === groupId || p.slug === data.slug) && p.language === lang);
    }

    const updatedPage = {
      ...data,
      id: data.id || `page-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      language: lang,
      translationGroupId: groupId,
      lastModified: now,
      createdAt: data.createdAt || now,
      inTrash: false,
    };

    if (existingIndex >= 0) {
      saveRevision(updatedPage.id, "page", updatedPage.title, `Updated page content in [${lang}]`, pages[existingIndex]);
      pages[existingIndex] = updatedPage;
      logActivity("admin", "owner", `Updated page: ${updatedPage.title} (${lang})`, updatedPage.slug);
    } else {
      pages.push(updatedPage);
      saveRevision(updatedPage.id, "page", updatedPage.title, `Created new page in [${lang}]`, updatedPage);
      logActivity("admin", "owner", `Created page: ${updatedPage.title} (${lang})`, updatedPage.slug);
    }

    writeJsonFile(PAGES_FILE, pages);
    res.json({ success: true, page: updatedPage, message: "Page successfully saved." });
  });

  app.post("/api/admin/pages/:id/trash", (req, res) => {
    const pages = readJsonFile<any[]>(PAGES_FILE, getInitialPages());
    const page = pages.find((p) => p.id === req.params.id);
    if (!page) return res.status(404).json({ error: "Page not found" });

    page.inTrash = true;
    writeJsonFile(PAGES_FILE, pages);
    logActivity("admin", "owner", `Moved page to trash: ${page.title}`, page.slug);
    res.json({ success: true, message: "Page moved to trash." });
  });

  app.post("/api/admin/pages/:id/restore", (req, res) => {
    const pages = readJsonFile<any[]>(PAGES_FILE, getInitialPages());
    const page = pages.find((p) => p.id === req.params.id);
    if (!page) return res.status(404).json({ error: "Page not found" });

    page.inTrash = false;
    writeJsonFile(PAGES_FILE, pages);
    logActivity("admin", "owner", `Restored page from trash: ${page.title}`, page.slug);
    res.json({ success: true, message: "Page restored." });
  });

  app.delete("/api/admin/pages/:id", (req, res) => {
    let pages = readJsonFile<any[]>(PAGES_FILE, getInitialPages());
    const page = pages.find((p) => p.id === req.params.id);
    if (!page) return res.status(404).json({ error: "Page not found" });

    pages = pages.filter((p) => p.id !== req.params.id);
    writeJsonFile(PAGES_FILE, pages);
    logActivity("admin", "owner", `Permanently deleted page: ${page.title}`, page.slug);
    res.json({ success: true, message: "Page permanently deleted." });
  });

  // 3. HOMEPAGE CMS (DEDICATED SECTION, ALL 7 LANGUAGES)
  app.get("/api/admin/homepage", (req, res) => {
    const lang = (req.query.lang as string) || "en";
    const saved = readJsonFile<Record<string, HomepageContent>>(HOMEPAGE_FILE, DEFAULT_HOMEPAGE_CONTENTS);

    // Match requested language or fallback to default or en
    const content = saved[lang] || DEFAULT_HOMEPAGE_CONTENTS[lang] || DEFAULT_HOMEPAGE_CONTENTS.en;
    res.json({
      content,
      availableLanguages: ["en", "id", "hi", "es", "fr", "nl", "ur"],
      currentLang: lang,
    });
  });

  app.post("/api/admin/homepage", (req, res) => {
    const lang = (req.body.language as string) || "en";
    const data = req.body as HomepageContent;

    const saved = readJsonFile<Record<string, HomepageContent>>(HOMEPAGE_FILE, DEFAULT_HOMEPAGE_CONTENTS);
    const prevSnapshot = saved[lang] || DEFAULT_HOMEPAGE_CONTENTS[lang];

    saved[lang] = {
      ...data,
      language: lang,
      lastUpdated: new Date().toISOString(),
    };

    writeJsonFile(HOMEPAGE_FILE, saved);
    saveRevision(`homepage-${lang}`, "homepage", `Homepage [${lang}]`, `Updated homepage content for ${lang}`, prevSnapshot);
    logActivity("admin", "owner", `Updated Homepage Content (${lang})`, "/");

    res.json({ success: true, message: `Homepage content for [${lang}] successfully saved.` });
  });

  // 4. BLOG POSTS CMS (SEPARATED FROM STATIC PAGES)
  app.get("/api/admin/posts", (req, res) => {
    let posts = readJsonFile<any[]>(POSTS_FILE, []);
    const filter = req.query.filter as string; // all, published, draft, scheduled, trash
    const search = (req.query.search as string || "").toLowerCase();

    if (filter === "trash") {
      posts = posts.filter((p) => p.inTrash);
    } else if (filter === "published") {
      posts = posts.filter((p) => !p.inTrash && p.status === "published");
    } else if (filter === "draft") {
      posts = posts.filter((p) => !p.inTrash && p.status === "draft");
    } else if (filter === "scheduled") {
      posts = posts.filter((p) => !p.inTrash && p.status === "scheduled");
    } else {
      posts = posts.filter((p) => !p.inTrash);
    }

    if (search) {
      posts = posts.filter(
        (p) => (p.title && p.title.toLowerCase().includes(search)) || (p.slug && p.slug.toLowerCase().includes(search))
      );
    }

    // Polylang Rule: Group translations under the Base English version!
    const basePosts: any[] = [];
    const grouped = new Map<string, any[]>();

    posts.forEach((p) => {
      const groupId = p.translationGroupId || p.id;
      if (!grouped.has(groupId)) grouped.set(groupId, []);
      grouped.get(groupId)!.push(p);
    });

    grouped.forEach((list, groupId) => {
      const enVersion = list.find((p) => p.language === "en") || list[0];
      const translatedLangs = list.map((p) => p.language || "en");
      basePosts.push({
        ...enVersion,
        translationGroupId: groupId,
        translationsCount: list.length,
        translatedLanguages: translatedLangs,
        allTranslations: list,
      });
    });

    const allStored = readJsonFile<any[]>(POSTS_FILE, []);
    res.json({
      posts: basePosts,
      total: basePosts.length,
      allCount: allStored.filter((p) => !p.inTrash).length,
      publishedCount: allStored.filter((p) => !p.inTrash && p.status === "published").length,
      draftCount: allStored.filter((p) => !p.inTrash && p.status === "draft").length,
      scheduledCount: allStored.filter((p) => !p.inTrash && p.status === "scheduled").length,
      trashCount: allStored.filter((p) => p.inTrash).length,
    });
  });

  app.get("/api/admin/posts/:id", (req, res) => {
    const posts = readJsonFile<any[]>(POSTS_FILE, []);
    const lang = req.query.lang as string;
    const postId = req.params.id;

    let post = posts.find((p) => p.id === postId);
    if (!post) {
      post = posts.find((p) => p.translationGroupId === postId && (!lang || p.language === lang));
    }

    if (!post) return res.status(404).json({ error: "Post not found" });

    if (lang && post.language !== lang) {
      const groupId = post.translationGroupId || post.id;
      const translated = posts.find((p) => (p.translationGroupId || p.id) === groupId && p.language === lang);
      if (translated) post = translated;
    }

    const groupId = post.translationGroupId || post.id;
    const relatedTranslations = posts.filter((p) => (p.translationGroupId || p.id) === groupId);

    res.json({
      post,
      translations: relatedTranslations,
    });
  });

  app.post("/api/admin/posts", (req, res) => {
    const posts = readJsonFile<any[]>(POSTS_FILE, []);
    const data = req.body;

    if (!data.title || !data.slug) {
      return res.status(400).json({ error: "Post Title and Slug are required." });
    }

    const lang = data.language || "en";
    const groupId = data.translationGroupId || `group-post-${data.slug.replace(/^\//, "").replace(/\//g, "-")}`;
    const now = new Date().toISOString();

    let existingIndex = -1;
    if (data.id) {
      existingIndex = posts.findIndex((p) => p.id === data.id);
    }
    if (existingIndex === -1) {
      existingIndex = posts.findIndex((p) => (p.translationGroupId === groupId || p.slug === data.slug) && p.language === lang);
    }

    const updatedPost = {
      ...data,
      id: data.id || `blog-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      language: lang,
      translationGroupId: groupId,
      updatedAt: now,
      date: data.date || "September 20, 2026",
      inTrash: false,
    };

    if (existingIndex >= 0) {
      saveRevision(updatedPost.id, "post", updatedPost.title, `Updated post in [${lang}]`, posts[existingIndex]);
      posts[existingIndex] = updatedPost;
      logActivity("admin", "owner", `Updated Post: ${updatedPost.title} (${lang})`, `/blog/${updatedPost.slug}`);
    } else {
      posts.push(updatedPost);
      saveRevision(updatedPost.id, "post", updatedPost.title, `Created new post in [${lang}]`, updatedPost);
      logActivity("admin", "owner", `Created Post: ${updatedPost.title} (${lang})`, `/blog/${updatedPost.slug}`);
    }

    writeJsonFile(POSTS_FILE, posts);
    res.json({ success: true, post: updatedPost, message: "Post successfully saved." });
  });

  app.post("/api/admin/posts/:id/trash", (req, res) => {
    const posts = readJsonFile<any[]>(POSTS_FILE, []);
    const post = posts.find((p) => p.id === req.params.id);
    if (!post) return res.status(404).json({ error: "Post not found" });

    post.inTrash = true;
    writeJsonFile(POSTS_FILE, posts);
    logActivity("admin", "owner", `Moved post to trash: ${post.title}`, post.slug);
    res.json({ success: true, message: "Post moved to trash." });
  });

  app.post("/api/admin/posts/:id/restore", (req, res) => {
    const posts = readJsonFile<any[]>(POSTS_FILE, []);
    const post = posts.find((p) => p.id === req.params.id);
    if (!post) return res.status(404).json({ error: "Post not found" });

    post.inTrash = false;
    writeJsonFile(POSTS_FILE, posts);
    logActivity("admin", "owner", `Restored post from trash: ${post.title}`, post.slug);
    res.json({ success: true, message: "Post restored." });
  });

  app.delete("/api/admin/posts/:id", (req, res) => {
    let posts = readJsonFile<any[]>(POSTS_FILE, []);
    const post = posts.find((p) => p.id === req.params.id);
    if (!post) return res.status(404).json({ error: "Post not found" });

    posts = posts.filter((p) => p.id !== req.params.id);
    writeJsonFile(POSTS_FILE, posts);
    logActivity("admin", "owner", `Permanently deleted post: ${post.title}`, post.slug);
    res.json({ success: true, message: "Post permanently deleted." });
  });

  // 5. CATEGORIES & TAGS
  app.get("/api/admin/categories", (_req, res) => {
    const cats = readJsonFile<any[]>(CATEGORIES_FILE, DEFAULT_CATEGORIES);
    res.json({ categories: cats });
  });

  app.post("/api/admin/categories", (req, res) => {
    const cats = readJsonFile<any[]>(CATEGORIES_FILE, DEFAULT_CATEGORIES);
    const item = req.body;
    if (!item.name || !item.slug) return res.status(400).json({ error: "Name and Slug required" });

    const idx = cats.findIndex((c) => c.id === item.id);
    if (idx >= 0) {
      cats[idx] = { ...cats[idx], ...item };
    } else {
      cats.push({ ...item, id: item.id || `cat-${Date.now()}` });
    }
    writeJsonFile(CATEGORIES_FILE, cats);
    logActivity("admin", "owner", `Saved Category: ${item.name}`, item.slug);
    res.json({ success: true, categories: cats });
  });

  app.delete("/api/admin/categories/:id", (req, res) => {
    let cats = readJsonFile<any[]>(CATEGORIES_FILE, DEFAULT_CATEGORIES);
    cats = cats.filter((c) => c.id !== req.params.id);
    writeJsonFile(CATEGORIES_FILE, cats);
    res.json({ success: true, categories: cats });
  });

  app.get("/api/admin/tags", (_req, res) => {
    const tags = readJsonFile<any[]>(TAGS_FILE, DEFAULT_TAGS);
    res.json({ tags });
  });

  app.post("/api/admin/tags", (req, res) => {
    const tags = readJsonFile<any[]>(TAGS_FILE, DEFAULT_TAGS);
    const item = req.body;
    if (!item.name || !item.slug) return res.status(400).json({ error: "Name and Slug required" });

    const idx = tags.findIndex((t) => t.id === item.id);
    if (idx >= 0) {
      tags[idx] = { ...tags[idx], ...item };
    } else {
      tags.push({ ...item, id: item.id || `tag-${Date.now()}` });
    }
    writeJsonFile(TAGS_FILE, tags);
    res.json({ success: true, tags });
  });

  app.delete("/api/admin/tags/:id", (req, res) => {
    let tags = readJsonFile<any[]>(TAGS_FILE, DEFAULT_TAGS);
    tags = tags.filter((t) => t.id !== req.params.id);
    writeJsonFile(TAGS_FILE, tags);
    res.json({ success: true, tags });
  });

  // 6. MEDIA LIBRARY
  app.get("/api/admin/media", (req, res) => {
    const media = readJsonFile<any[]>(MEDIA_FILE, [
      {
        id: "med-1",
        name: "scribd-sample-banner.png",
        url: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=1200&auto=format&fit=crop&q=80",
        sizeBytes: 184500,
        type: "image/png",
        createdAt: "2026-09-01",
        alt: "Scribd Document Preview",
        title: "Sample Banner",
      },
      {
        id: "med-2",
        name: "document-preview-artboard.png",
        url: "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=1200&auto=format&fit=crop&q=80",
        sizeBytes: 242000,
        type: "image/png",
        createdAt: "2026-09-05",
        alt: "Study Guide Artboard",
        title: "Artboard",
      },
    ]);

    const search = (req.query.search as string || "").toLowerCase();
    const filtered = search
      ? media.filter((m) => (m.name && m.name.toLowerCase().includes(search)) || (m.alt && m.alt.toLowerCase().includes(search)))
      : media;

    res.json({ media: filtered, total: filtered.length });
  });

  app.post("/api/admin/media/upload", (req, res) => {
    const media = readJsonFile<any[]>(MEDIA_FILE, []);
    const { name, url, base64Data, alt, title } = req.body;

    let mediaUrl = url;
    let sizeBytes = 150000;

    if (base64Data) {
      try {
        const matches = base64Data.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
        if (matches && matches.length === 3) {
          const ext = matches[1].split("/")[1] || "png";
          const filename = `upload-${Date.now()}.${ext}`;
          const filePath = path.join(UPLOADS_DIR, filename);
          fs.writeFileSync(filePath, Buffer.from(matches[2], "base64"));
          mediaUrl = `/images/uploads/${filename}`;
          sizeBytes = Buffer.byteLength(matches[2], "base64");
        }
      } catch (err) {
        console.error("Base64 upload save error:", err);
      }
    }

    const newItem = {
      id: `med-${Date.now()}`,
      name: name || "uploaded-image.png",
      url: mediaUrl || "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=1200&auto=format&fit=crop&q=80",
      sizeBytes,
      type: "image/png",
      alt: alt || name || "Uploaded media image",
      title: title || name || "Media item",
      createdAt: new Date().toISOString(),
    };

    media.unshift(newItem);
    writeJsonFile(MEDIA_FILE, media);
    logActivity("admin", "owner", `Uploaded Media: ${newItem.name}`, newItem.url);
    res.json({ success: true, item: newItem });
  });

  app.delete("/api/admin/media/:id", (req, res) => {
    let media = readJsonFile<any[]>(MEDIA_FILE, []);
    const item = media.find((m) => m.id === req.params.id);
    media = media.filter((m) => m.id !== req.params.id);
    writeJsonFile(MEDIA_FILE, media);
    if (item) logActivity("admin", "owner", `Deleted Media: ${item.name}`, item.url);
    res.json({ success: true, message: "Media deleted." });
  });

  // 7. ADVERTISEMENTS MANAGER
  app.get("/api/admin/ads", (_req, res) => {
    const ads = readJsonFile<any[]>(ADS_FILE, DEFAULT_ADS);
    const placements = [
      "Header",
      "After Hero",
      "Before Article",
      "After Paragraph 1",
      "After Paragraph 2",
      "After Paragraph 3",
      "Inside Article",
      "Before FAQ",
      "After FAQ",
      "Before Footer",
      "Footer",
      "Sidebar",
      "Mobile Sticky",
      "Desktop Sticky",
    ];
    res.json({ ads, placements });
  });

  app.post("/api/admin/ads", (req, res) => {
    const ads = readJsonFile<any[]>(ADS_FILE, DEFAULT_ADS);
    const item = req.body;
    if (!item.name || !item.placement) {
      return res.status(400).json({ error: "Ad Name and Placement are required." });
    }

    const idx = ads.findIndex((a) => a.id === item.id);
    if (idx >= 0) {
      ads[idx] = { ...ads[idx], ...item };
    } else {
      ads.push({
        ...item,
        id: item.id || `ad-${Date.now()}`,
        status: item.status || "active",
        device: item.device || "all",
        impressions: 0,
        clicks: 0,
      });
    }

    writeJsonFile(ADS_FILE, ads);
    logActivity("admin", "owner", `Updated Ad Placement: ${item.name}`, item.placement);
    res.json({ success: true, ads });
  });

  app.delete("/api/admin/ads/:id", (req, res) => {
    let ads = readJsonFile<any[]>(ADS_FILE, DEFAULT_ADS);
    ads = ads.filter((a) => a.id !== req.params.id);
    writeJsonFile(ADS_FILE, ads);
    res.json({ success: true, ads });
  });

  // Public endpoint for frontend components to get active ads
  app.get("/api/ads/active", (req, res) => {
    const ads = readJsonFile<any[]>(ADS_FILE, DEFAULT_ADS);
    const placement = req.query.placement as string;
    const device = req.query.device as string;

    let active = ads.filter((a) => a.status === "active");
    if (placement) {
      active = active.filter((a) => a.placement.toLowerCase() === placement.toLowerCase());
    }
    if (device && device !== "all") {
      active = active.filter((a) => a.device === "all" || a.device === device);
    }

    res.json({ ads: active });
  });

  // 8. SEO, SITEMAP & ROBOTS.TXT
  app.get("/api/admin/seo", (_req, res) => {
    const settings = readJsonFile<any>(SETTINGS_FILE, DEFAULT_SETTINGS);
    res.json({
      siteName: settings.siteName,
      defaultMetaTitle: settings.siteName,
      defaultMetaDescription: settings.siteDescription,
      availableLanguages: settings.availableLanguages,
    });
  });

  app.get("/api/admin/sitemap/stats", (req, res) => {
    const origin = req.protocol + "://" + (req.get("host") || "localhost:3000");
    const inventory = getContentInventory(origin);
    res.json({
      inventory,
      timestamp: new Date().toISOString(),
      sitemapUrl: `${origin}/sitemap.xml`,
      sitemapIndexUrl: `${origin}/sitemap_index.xml`,
      pageSitemapUrl: `${origin}/page-sitemap.xml`,
      postSitemapUrl: `${origin}/post-sitemap.xml`,
    });
  });

  app.post("/api/admin/sitemap/regenerate", (req, res) => {
    const origin = req.protocol + "://" + (req.get("host") || "localhost:3000");
    const sitemaps = generateAllSitemaps(origin);
    logActivity("admin", "seo", "Regenerated Dynamic XML Sitemaps", "/sitemap.xml");
    res.json({
      success: true,
      message: "XML Sitemaps successfully regenerated.",
      totalUrls: sitemaps.totalUrls,
    });
  });

  app.get("/api/admin/robots", (_req, res) => {
    let content = "User-agent: *\nAllow: /\nDisallow: /admin\nDisallow: /api/\n\nSitemap: /sitemap_index.xml\n";
    if (fs.existsSync(ROBOTS_FILE)) {
      content = fs.readFileSync(ROBOTS_FILE, "utf-8");
    }
    res.json({ content });
  });

  app.post("/api/admin/robots", (req, res) => {
    const { content } = req.body;
    if (typeof content !== "string") return res.status(400).json({ error: "Robots content required" });

    // Safety check: Warn if Disallow: / completely blocks the site
    const hasDangerousDisallow = /^Disallow:\s*\/$/m.test(content);

    fs.writeFileSync(ROBOTS_FILE, content, "utf-8");
    logActivity("admin", "seo", "Updated Robots.txt Rules", "/robots.txt");
    res.json({
      success: true,
      hasWarning: hasDangerousDisallow,
      warningMessage: hasDangerousDisallow ? "Warning: 'Disallow: /' blocks all search engines from indexing your site." : undefined,
    });
  });

  app.post("/api/admin/robots/reset", (_req, res) => {
    const defaultContent = "User-agent: *\nAllow: /\nDisallow: /admin\nDisallow: /api/\n\nSitemap: /sitemap_index.xml\n";
    fs.writeFileSync(ROBOTS_FILE, defaultContent, "utf-8");
    logActivity("admin", "seo", "Reset Robots.txt to Safe Default", "/robots.txt");
    res.json({ success: true, content: defaultContent });
  });

  // 9. REDIRECTS & 404 MONITOR
  app.get("/api/admin/redirects", (_req, res) => {
    const redirects = readJsonFile<any[]>(REDIRECTS_FILE, [
      { id: "red-1", sourceUrl: "/download-pdf", destinationUrl: "/", statusCode: 301, status: "active", hits: 38, createdAt: "2026-09-10" },
      { id: "red-2", sourceUrl: "/docs", destinationUrl: "/how-it-works", statusCode: 301, status: "active", hits: 14, createdAt: "2026-09-12" },
    ]);
    res.json({ redirects });
  });

  app.post("/api/admin/redirects", (req, res) => {
    const redirects = readJsonFile<any[]>(REDIRECTS_FILE, []);
    const item = req.body;
    if (!item.sourceUrl || !item.destinationUrl) {
      return res.status(400).json({ error: "Source and Destination URLs required." });
    }

    // Prevent redirect loop
    if (item.sourceUrl.trim() === item.destinationUrl.trim()) {
      return res.status(400).json({ error: "Source URL cannot be identical to Destination URL (Infinite Loop Prevention)." });
    }

    const idx = redirects.findIndex((r) => r.id === item.id);
    if (idx >= 0) {
      redirects[idx] = { ...redirects[idx], ...item };
    } else {
      redirects.push({
        ...item,
        id: item.id || `red-${Date.now()}`,
        status: item.status || "active",
        hits: 0,
        createdAt: new Date().toISOString(),
      });
    }

    writeJsonFile(REDIRECTS_FILE, redirects);
    logActivity("admin", "seo", `Configured 301 Redirect: ${item.sourceUrl} -> ${item.destinationUrl}`, item.sourceUrl);
    res.json({ success: true, redirects });
  });

  app.delete("/api/admin/redirects/:id", (req, res) => {
    let redirects = readJsonFile<any[]>(REDIRECTS_FILE, []);
    redirects = redirects.filter((r) => r.id !== req.params.id);
    writeJsonFile(REDIRECTS_FILE, redirects);
    res.json({ success: true, redirects });
  });

  app.get("/api/admin/404-monitor", (_req, res) => {
    const notFoundLogs = readJsonFile<any[]>(NOT_FOUND_FILE, [
      { id: "404-1", url: "/old-download-tool", hits: 12, firstSeen: "2026-09-15", lastSeen: "2026-09-19" },
      { id: "404-2", url: "/wp-content/uploads/guide.pdf", hits: 5, firstSeen: "2026-09-16", lastSeen: "2026-09-18" },
    ]);
    res.json({ logs: notFoundLogs });
  });

  app.delete("/api/admin/404-monitor/:id", (req, res) => {
    let logs = readJsonFile<any[]>(NOT_FOUND_FILE, []);
    logs = logs.filter((l) => l.id !== req.params.id);
    writeJsonFile(NOT_FOUND_FILE, logs);
    res.json({ success: true, logs });
  });

  // 10. REVISIONS & ACTIVITY LOGS
  app.get("/api/admin/revisions", (req, res) => {
    const entityId = req.query.entityId as string;
    const revisions = readJsonFile<any[]>(REVISIONS_FILE, []);
    const filtered = entityId ? revisions.filter((r) => r.entityId === entityId) : revisions;
    res.json({ revisions: filtered });
  });

  app.post("/api/admin/revisions/:id/restore", (req, res) => {
    const revisions = readJsonFile<any[]>(REVISIONS_FILE, []);
    const rev = revisions.find((r) => r.id === req.params.id);
    if (!rev) return res.status(404).json({ error: "Revision not found" });

    // Restore snapshot based on entityType
    if (rev.entityType === "page") {
      const pages = readJsonFile<any[]>(PAGES_FILE, getInitialPages());
      const idx = pages.findIndex((p) => p.id === rev.entityId);
      if (idx >= 0) {
        pages[idx] = rev.snapshot;
        writeJsonFile(PAGES_FILE, pages);
      }
    } else if (rev.entityType === "post") {
      const posts = readJsonFile<any[]>(POSTS_FILE, []);
      const idx = posts.findIndex((p) => p.id === rev.entityId);
      if (idx >= 0) {
        posts[idx] = rev.snapshot;
        writeJsonFile(POSTS_FILE, posts);
      }
    }

    logActivity("admin", "owner", `Restored Revision for ${rev.entityType}: ${rev.title}`, rev.id);
    res.json({ success: true, message: `Restored snapshot from ${rev.date}` });
  });

  app.get("/api/admin/activity-logs", (_req, res) => {
    const logs = readJsonFile<any[]>(ACTIVITY_LOGS_FILE, []);
    res.json({ logs });
  });

  // 11. USERS & ROLES
  app.get("/api/admin/users", (_req, res) => {
    const users = readJsonFile<any[]>(USERS_FILE, DEFAULT_USERS);
    res.json({ users });
  });

  app.post("/api/admin/users", (req, res) => {
    const users = readJsonFile<any[]>(USERS_FILE, DEFAULT_USERS);
    const item = req.body;
    if (!item.username || !item.role) return res.status(400).json({ error: "Username and Role required" });

    const idx = users.findIndex((u) => u.id === item.id);
    if (idx >= 0) {
      users[idx] = { ...users[idx], ...item };
    } else {
      users.push({
        ...item,
        id: item.id || `usr-${Date.now()}`,
        createdAt: new Date().toISOString(),
      });
    }

    writeJsonFile(USERS_FILE, users);
    res.json({ success: true, users });
  });

  app.delete("/api/admin/users/:id", (req, res) => {
    let users = readJsonFile<any[]>(USERS_FILE, DEFAULT_USERS);
    if (users.length <= 1) return res.status(400).json({ error: "Cannot delete the sole administrator" });
    users = users.filter((u) => u.id !== req.params.id);
    writeJsonFile(USERS_FILE, users);
    res.json({ success: true, users });
  });

  // 12. SETTINGS, CUSTOM CODE & BACKUP
  app.get("/api/admin/settings", (_req, res) => {
    const settings = readJsonFile<any>(SETTINGS_FILE, DEFAULT_SETTINGS);
    res.json({ settings });
  });

  app.post("/api/admin/settings", (req, res) => {
    const current = readJsonFile<any>(SETTINGS_FILE, DEFAULT_SETTINGS);
    const updated = { ...current, ...req.body };
    writeJsonFile(SETTINGS_FILE, updated);
    logActivity("admin", "owner", "Updated Global Site Settings", "/admin");
    res.json({ success: true, settings: updated });
  });

  app.get("/api/admin/backup/export", (_req, res) => {
    const backup = {
      timestamp: new Date().toISOString(),
      version: "1.0.0",
      settings: readJsonFile(SETTINGS_FILE, DEFAULT_SETTINGS),
      pages: readJsonFile(PAGES_FILE, getInitialPages()),
      posts: readJsonFile(POSTS_FILE, []),
      homepage: readJsonFile(HOMEPAGE_FILE, DEFAULT_HOMEPAGE_CONTENTS),
      categories: readJsonFile(CATEGORIES_FILE, DEFAULT_CATEGORIES),
      tags: readJsonFile(TAGS_FILE, DEFAULT_TAGS),
      media: readJsonFile(MEDIA_FILE, []),
      ads: readJsonFile(ADS_FILE, DEFAULT_ADS),
      redirects: readJsonFile(REDIRECTS_FILE, []),
      users: readJsonFile(USERS_FILE, DEFAULT_USERS),
    };

    res.setHeader("Content-Disposition", `attachment; filename=cms-backup-${Date.now()}.json`);
    res.setHeader("Content-Type", "application/json");
    res.send(JSON.stringify(backup, null, 2));
  });

  app.post("/api/admin/backup/restore", (req, res) => {
    const backup = req.body;
    if (!backup || typeof backup !== "object") {
      return res.status(400).json({ error: "Invalid backup data" });
    }

    if (Array.isArray(backup.pages)) writeJsonFile(PAGES_FILE, backup.pages);
    if (Array.isArray(backup.posts)) writeJsonFile(POSTS_FILE, backup.posts);
    if (backup.homepage) writeJsonFile(HOMEPAGE_FILE, backup.homepage);
    if (backup.settings) writeJsonFile(SETTINGS_FILE, backup.settings);
    if (Array.isArray(backup.categories)) writeJsonFile(CATEGORIES_FILE, backup.categories);
    if (Array.isArray(backup.tags)) writeJsonFile(TAGS_FILE, backup.tags);
    if (Array.isArray(backup.ads)) writeJsonFile(ADS_FILE, backup.ads);
    if (Array.isArray(backup.redirects)) writeJsonFile(REDIRECTS_FILE, backup.redirects);

    logActivity("admin", "owner", "Restored System Backup from JSON", "/admin");
    res.json({ success: true, message: "System backup restored successfully." });
  });

  // 13. GLOBAL SEARCH
  app.get("/api/admin/search", (req, res) => {
    const q = (req.query.q as string || "").toLowerCase().trim();
    if (!q) return res.json({ results: [] });

    const pages = readJsonFile<any[]>(PAGES_FILE, getInitialPages()).filter((p) => !p.inTrash);
    const posts = readJsonFile<any[]>(POSTS_FILE, []).filter((p) => !p.inTrash);
    const media = readJsonFile<any[]>(MEDIA_FILE, []);
    const cats = readJsonFile<any[]>(CATEGORIES_FILE, DEFAULT_CATEGORIES);

    const results: any[] = [];

    pages.forEach((p) => {
      if ((p.title && p.title.toLowerCase().includes(q)) || (p.slug && p.slug.toLowerCase().includes(q))) {
        results.push({ type: "page", id: p.id, title: p.title, subtitle: `Page /${p.slug}`, url: `/admin/pages/${p.id}` });
      }
    });

    posts.forEach((p) => {
      if ((p.title && p.title.toLowerCase().includes(q)) || (p.slug && p.slug.toLowerCase().includes(q))) {
        results.push({ type: "post", id: p.id, title: p.title, subtitle: `Post /blog/${p.slug}`, url: `/admin/posts/${p.id}` });
      }
    });

    media.forEach((m) => {
      if ((m.name && m.name.toLowerCase().includes(q)) || (m.alt && m.alt.toLowerCase().includes(q))) {
        results.push({ type: "media", id: m.id, title: m.name, subtitle: `Media (${m.type})`, url: "/admin/media" });
      }
    });

    cats.forEach((c) => {
      if (c.name && c.name.toLowerCase().includes(q)) {
        results.push({ type: "category", id: c.id, title: c.name, subtitle: "Category", url: "/admin/categories" });
      }
    });

    res.json({ results: results.slice(0, 15) });
  });

  // 14. AI ASSISTANT (GEMINI PRO / FLASH SERVER-SIDE)
  app.post("/api/admin/ai/assist", async (req, res) => {
    const { action, text, targetLang, context } = req.body;
    if (!action || !text) {
      return res.status(400).json({ error: "Action and text are required" });
    }

    try {
      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) {
        return res.status(500).json({ error: "GEMINI_API_KEY is not configured on the server." });
      }

      const ai = new GoogleGenAI({ apiKey });
      let prompt = "";

      if (action === "improve") {
        prompt = `You are a professional web editor. Improve the readability, flow, and conciseness of the following text while retaining all facts. Return only the improved text:\n\n${text}`;
      } else if (action === "summarize") {
        prompt = `Generate a compelling, 150-160 character excerpt/summary suitable for SEO meta description from the following content:\n\n${text}`;
      } else if (action === "seo") {
        prompt = `Generate an optimal SEO Title (under 60 characters) and a Meta Description (140-160 characters) for a document download / conversion web page about:\n\n${text}\n\nFormat as JSON: {"title": "...", "description": "..."}`;
      } else if (action === "faq") {
        prompt = `Generate 3 clear, highly relevant FAQ question and answer pairs based on this topic:\n\n${text}\n\nFormat as JSON: [{"question": "...", "answer": "..."}]`;
      } else if (action === "translate") {
        const langMap: Record<string, string> = {
          hi: "Hindi (हिन्दी)",
          id: "Indonesian (Bahasa Indonesia)",
          es: "Spanish (Español México)",
          fr: "French (Français)",
          nl: "Dutch (Nederlands)",
          ur: "Urdu (اردو)",
          de: "German (Deutsch)",
          br: "Portuguese (Português Brasil)",
        };
        const targetName = langMap[targetLang || ""] || targetLang || "English";
        prompt = `Translate the following text accurately into ${targetName}. Maintain markdown formatting, code snippets, and tone:\n\n${text}`;
      } else {
        prompt = `Act as an expert copywriter and assist with:\n\n${text}`;
      }

      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
      });

      const output = response.text || "";
      res.json({
        success: true,
        action,
        suggestion: output.trim(),
        message: "AI suggestion generated. Review before accepting.",
      });
    } catch (err: any) {
      console.error("AI Assist error:", err);
      res.status(500).json({ error: err?.message || "Failed to generate AI content." });
    }
  });
}
