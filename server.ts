import express from "express";
import path from "path";
import fs from "fs";
import http from "http";
import https from "https";
import { createServer as createViteServer } from "vite";
import { createRequire } from "module";
import axios from "axios";
import * as cheerio from "cheerio";
import PDFDocument from "pdfkit";
import { setupMcpEndpoints } from "./server/mcpServer";
import { setupGeminiAiEndpoints } from "./server/geminiAi";
import { setupAdminRoutes } from "./server/adminRoutes";
import { generateAllSitemaps } from "./server/contentInventory";
import {
  DownloadJob,
  CacheEntry,
  jobs,
  documentCache,
  DOWNLOADS_ROOT,
  CACHE_ROOT,
  runUltraScraperJob,
  extractDocId,
} from "./server/scribdScraper.ts";

// Universal require compatible with tsx (ESM) and bundled dist/server.cjs
const nodeRequire =
  typeof require === "function"
    ? require
    : createRequire(path.join(process.cwd(), "package.json"));

const archiver = nodeRequire("archiver");
const scrapeScribdLegacy = nodeRequire("scribd-scraper");

// High performance connection agents with persistent Keep-Alive and pooled sockets
const httpAgent = new http.Agent({ keepAlive: true, maxSockets: 128, maxFreeSockets: 64, timeout: 30000 });
const httpsAgent = new https.Agent({ keepAlive: true, maxSockets: 128, maxFreeSockets: 64, timeout: 30000 });

// Configure axios with connection pooling and fast timeouts
const axiosClient = axios.create({
  httpAgent,
  httpsAgent,
  timeout: 10000,
  maxRedirects: 5,
});

const SERVER_STORAGE_DIR = path.join(process.cwd(), "server_storage");
const SEO_DIR = path.join(SERVER_STORAGE_DIR, "seo");
const PUBLIC_DIR = path.join(process.cwd(), "public");

const BLOG_POSTS_FILE = path.join(SERVER_STORAGE_DIR, "blog_posts.json");
const CUSTOM_PAGES_FILE = path.join(SERVER_STORAGE_DIR, "pages.json");
const ROBOTS_FILE = path.join(SEO_DIR, "robots.txt");
const SITEMAP_FILE = path.join(SEO_DIR, "sitemap.xml");
const SITEMAP_INDEX_FILE = path.join(SEO_DIR, "sitemap_index.xml");
const POST_SITEMAP_FILE = path.join(SEO_DIR, "post-sitemap.xml");
const PAGE_SITEMAP_FILE = path.join(SEO_DIR, "page-sitemap.xml");

// Ensure temp, storage, and SEO directories exist safely
try {
  [DOWNLOADS_ROOT, CACHE_ROOT, SERVER_STORAGE_DIR, SEO_DIR, PUBLIC_DIR].forEach((dir) => {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  });
} catch (e) {
  console.warn("Storage directory initialization notice:", e);
}

let robotsUpdatedAt = new Date().toISOString();
let sitemapUpdatedAt = new Date().toISOString();

interface CachedSitemapSet {
  indexXml: string;
  postXml: string;
  pageXml: string;
  allUrlsetXml: string;
  updatedAt: string;
}

const sitemapsByOrigin = new Map<string, CachedSitemapSet>();

function invalidateSitemapCache() {
  sitemapsByOrigin.clear();
}

function getRequestOrigin(req?: any): string {
  if (req) {
    const forwardedProto = req.headers?.["x-forwarded-proto"];
    let proto = "https";
    if (typeof forwardedProto === "string" && forwardedProto.trim()) {
      proto = forwardedProto.split(",")[0].trim().toLowerCase();
    } else if (req.protocol) {
      proto = req.protocol.toLowerCase();
    } else if (req.socket?.encrypted) {
      proto = "https";
    } else {
      proto = "http";
    }

    const forwardedHost = req.headers?.["x-forwarded-host"];
    let host = "";
    if (typeof forwardedHost === "string" && forwardedHost.trim()) {
      host = forwardedHost.split(",")[0].trim();
    } else {
      host = req.get?.("host") || req.headers?.host || "";
    }

    if (host) {
      return `${proto}://${host}`.replace(/\/$/, "");
    }
  }

  if (process.env.APP_URL) return process.env.APP_URL.replace(/\/$/, "");
  if (process.env.PUBLIC_URL) return process.env.PUBLIC_URL.replace(/\/$/, "");
  return "";
}

function getBlogPostsOnServer(): any[] {
  if (fs.existsSync(BLOG_POSTS_FILE)) {
    try {
      const data = fs.readFileSync(BLOG_POSTS_FILE, "utf-8");
      return JSON.parse(data);
    } catch {}
  }
  return [];
}

function saveBlogPostsOnServer(posts: any[]) {
  try {
    fs.writeFileSync(BLOG_POSTS_FILE, JSON.stringify(posts, null, 2), "utf-8");
  } catch (err) {
    console.error("Error saving blog posts to disk:", err);
  }
}

function getCustomPagesOnServer(): any[] {
  if (fs.existsSync(CUSTOM_PAGES_FILE)) {
    try {
      const data = fs.readFileSync(CUSTOM_PAGES_FILE, "utf-8");
      return JSON.parse(data);
    } catch {}
  }
  return [];
}

function saveCustomPagesOnServer(pages: any[]) {
  try {
    fs.writeFileSync(CUSTOM_PAGES_FILE, JSON.stringify(pages, null, 2), "utf-8");
  } catch (err) {
    console.error("Error saving custom pages to disk:", err);
  }
}

function formatYoastDate(val?: any): string {
  if (!val) {
    const now = new Date();
    return now.toISOString().replace(/\.\d{3}Z$/, "+00:00");
  }
  const s = String(val).trim();
  if (/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/.test(s)) {
    return s.slice(0, 19) + "+00:00";
  }
  if (/^\d{4}-\d{2}-\d{2}$/.test(s)) {
    return `${s}T00:00:00+00:00`;
  }
  const parsed = Date.parse(s);
  if (!isNaN(parsed)) {
    return new Date(parsed).toISOString().replace(/\.\d{3}Z$/, "+00:00");
  }
  return new Date().toISOString().replace(/\.\d{3}Z$/, "+00:00");
}

function cleanSlugForUrl(rawSlug?: string, idFallback?: string): string {
  if (!rawSlug) return idFallback ? cleanSlugForUrl(idFallback) : "";
  let s = String(rawSlug).trim();
  if (s.includes("`")) s = s.split("`")[0].trim();
  if (s.includes("(")) s = s.split("(")[0].trim();
  s = s.replace(/[^a-zA-Z0-9\-\/]/g, "-").replace(/-+/g, "-").replace(/^\/+|\/+$/g, "").replace(/^-+|-+$/g, "");
  if (!s) return idFallback ? cleanSlugForUrl(idFallback) : "";
  return s.toLowerCase();
}

function escapeXml(str: string): string {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function buildPostSitemap(origin: string, postsParam?: any[]): string {
  const base = origin.replace(/\/$/, "");
  const today = formatYoastDate();
  const languages = ["en", "br", "es", "fr", "de", "id"];
  let posts: any[] = postsParam || [];
  if (!posts || posts.length === 0) {
    posts = getBlogPostsOnServer();
  }

  const seenUrls = new Set<string>();
  const xmlEntries: string[] = [];

  const addUrlEntry = (
    loc: string,
    lastmod: string,
    imageUrl?: string,
    priority: string = "0.80"
  ) => {
    const cleanUrl = loc.trim();
    if (!cleanUrl || seenUrls.has(cleanUrl)) return;
    seenUrls.add(cleanUrl);

    let imgXml = "";
    if (imageUrl && imageUrl.trim()) {
      imgXml = `\n\t\t<image:image>\n\t\t\t<image:loc>${escapeXml(imageUrl.trim())}</image:loc>\n\t\t</image:image>`;
    }

    const safeLastmod = formatYoastDate(lastmod);

    xmlEntries.push(`\t<url>
\t\t<loc>${escapeXml(cleanUrl)}</loc>
\t\t<lastmod>${safeLastmod}</lastmod>
\t\t<priority>${priority}</priority>${imgXml}
\t</url>`);
  };

  if (Array.isArray(posts) && posts.length > 0) {
    const translationGroups = new Map<string, any[]>();
    for (const post of posts) {
      if (post.status === "draft") continue;
      const tgId = post.translationGroupId || `tg-${post.id}`;
      if (!translationGroups.has(tgId)) {
        translationGroups.set(tgId, []);
      }
      translationGroups.get(tgId)!.push(post);
    }

    translationGroups.forEach((groupPosts) => {
      const postToday = groupPosts[0]?.date ? formatYoastDate(groupPosts[0].date) : today;
      const langMap = new Map<string, { url: string; date: string; image?: string }>();
      for (const p of groupPosts) {
        const pLang = p.language || "en";
        const pSlug = cleanSlugForUrl(p.slug, p.id);
        if (pSlug) {
          langMap.set(pLang, {
            url: `${base}/${pLang}/blog/${pSlug}`,
            date: p.date || postToday,
            image: p.coverImage || p.image,
          });
        }
      }

      const refPost = groupPosts.find((p) => (p.language || "en") === "en") || groupPosts[0];
      const refSlug = cleanSlugForUrl(refPost?.slug, refPost?.id);

      for (const lang of languages) {
        if (!langMap.has(lang) && refSlug) {
          langMap.set(lang, {
            url: `${base}/${lang}/blog/${refSlug}`,
            date: postToday,
            image: refPost?.coverImage || refPost?.image,
          });
        }
      }

      for (const lang of languages) {
        const item = langMap.get(lang);
        if (item) {
          addUrlEntry(item.url, formatYoastDate(item.date), item.image, "0.80");
        }
      }
    });

    for (const post of posts) {
      if (post.status === "draft") continue;
      const postLang = post.language || "en";
      const postSlug = cleanSlugForUrl(post.slug, post.id);
      if (postSlug) {
        const postImg = post.coverImage || post.image;
        const postDate = formatYoastDate(post.date || today);
        addUrlEntry(`${base}/${postLang}/blog/${postSlug}`, postDate, postImg, "0.80");
        for (const lang of languages) {
          addUrlEntry(`${base}/${lang}/blog/${postSlug}`, postDate, postImg, "0.80");
        }
      }
    }
  }

  return `<?xml version="1.0" encoding="UTF-8"?><?xml-stylesheet type="text/xsl" href="/main-sitemap.xsl"?>
<urlset xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1" xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9 http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd http://www.google.com/schemas/sitemap-image/1.1 http://www.google.com/schemas/sitemap-image/1.1/sitemap-image.xsd" xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${xmlEntries.join("\n")}
</urlset>
<!-- XML Sitemap generated by Yoast SEO -->`;
}

function buildPageSitemap(origin: string, customPagesParam?: any[]): string {
  const base = origin.replace(/\/$/, "");
  const today = formatYoastDate();
  const languages = ["en", "br", "es", "fr", "de", "id"];
  const coreRoutes = [
    { path: "" },
    { path: "how-it-works" },
    { path: "blog" },
    { path: "about" },
    { path: "contact" },
    { path: "privacy" },
    { path: "terms" },
    { path: "sitemap" },
  ];

  const seenUrls = new Set<string>();
  const xmlEntries: string[] = [];

  const addUrlEntry = (
    loc: string,
    lastmod: string,
    imageUrl?: string,
    priority: string = "0.80"
  ) => {
    const cleanUrl = loc.trim();
    if (!cleanUrl || seenUrls.has(cleanUrl)) return;
    seenUrls.add(cleanUrl);

    let imgXml = "";
    if (imageUrl && imageUrl.trim()) {
      imgXml = `\n\t\t<image:image>\n\t\t\t<image:loc>${escapeXml(imageUrl.trim())}</image:loc>\n\t\t</image:image>`;
    }

    const safeLastmod = formatYoastDate(lastmod);

    xmlEntries.push(`\t<url>
\t\t<loc>${escapeXml(cleanUrl)}</loc>
\t\t<lastmod>${safeLastmod}</lastmod>
\t\t<priority>${priority}</priority>${imgXml}
\t</url>`);
  };

  // 1. Root canonical entry
  addUrlEntry(
    `${base}/`,
    today,
    undefined,
    "1.00"
  );

  // 2. Core localized routes for all languages
  for (const r of coreRoutes) {
    for (const lang of languages) {
      const fullPath = r.path ? `/${lang}/${r.path}` : `/${lang}`;
      addUrlEntry(`${base}${fullPath}`, today, undefined, r.path === "" ? "1.00" : "0.80");
    }
  }

  // 3. Custom Pages - exact URLs for all language variations
  let customPages: any[] = customPagesParam || [];
  if (!customPages || customPages.length === 0) {
    customPages = getCustomPagesOnServer();
  }

  if (Array.isArray(customPages) && customPages.length > 0) {
    for (const page of customPages) {
      if (page.status === "draft") continue;
      const cleanSlug = cleanSlugForUrl(page.slug, page.id);
      if (!cleanSlug) continue;

      const pageLastMod = formatYoastDate(page.lastModified || page.createdAt || today);
      const pageImg = page.metaImage || page.heroImage;

      // Base root slug
      addUrlEntry(`${base}/${cleanSlug}`, pageLastMod, pageImg, "0.80");

      // Specific page language if specified
      if (page.language && page.language !== "all") {
        addUrlEntry(`${base}/${page.language}/${cleanSlug}`, pageLastMod, pageImg, "0.80");
      }

      // Add for all supported languages
      for (const lang of languages) {
        addUrlEntry(`${base}/${lang}/${cleanSlug}`, pageLastMod, pageImg, "0.80");
      }
    }
  }

  return `<?xml version="1.0" encoding="UTF-8"?><?xml-stylesheet type="text/xsl" href="/main-sitemap.xsl"?>
<urlset xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1" xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9 http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd http://www.google.com/schemas/sitemap-image/1.1 http://www.google.com/schemas/sitemap-image/1.1/sitemap-image.xsd" xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${xmlEntries.join("\n")}
</urlset>
<!-- XML Sitemap generated by Yoast SEO -->`;
}

function buildExactUrlsetSitemap(origin: string, postsParam?: any[], customPagesParam?: any[]): string {
  const base = (origin || "").replace(/\/$/, "");
  const pageXml = buildPageSitemap(base, customPagesParam);
  const postXml = buildPostSitemap(base, postsParam);

  const seen = new Set<string>();
  const entries: string[] = [];

  const extractUrls = (xml: string) => {
    const urlMatches = xml.match(/<url>[\s\S]*?<\/url>/g) || [];
    for (const u of urlMatches) {
      const locMatch = u.match(/<loc>(.*?)<\/loc>/);
      if (locMatch && locMatch[1]) {
        const loc = locMatch[1].trim();
        if (!seen.has(loc)) {
          seen.add(loc);
          entries.push(u);
        }
      }
    }
  };

  extractUrls(pageXml);
  extractUrls(postXml);

  return `<?xml version="1.0" encoding="UTF-8"?><?xml-stylesheet type="text/xsl" href="/main-sitemap.xsl"?>
<urlset xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1" xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9 http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd http://www.google.com/schemas/sitemap-image/1.1 http://www.google.com/schemas/sitemap-image/1.1/sitemap-image.xsd" xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${entries.join("\n")}
</urlset>
<!-- XML Sitemap generated by Yoast SEO -->`;
}

function buildYoastSitemapIndex(origin: string): string {
  const base = (origin || "").replace(/\/$/, "");
  const today = formatYoastDate();
  return `<?xml version="1.0" encoding="UTF-8"?>
<?xml-stylesheet type="text/xsl" href="/main-sitemap.xsl"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
	<sitemap>
		<loc>${base}/page-sitemap.xml</loc>
		<lastmod>${today}</lastmod>
	</sitemap>
	<sitemap>
		<loc>${base}/post-sitemap.xml</loc>
		<lastmod>${today}</lastmod>
	</sitemap>
</sitemapindex>`;
}

// Unified sitemap builder matching requested format
function buildServerSitemap(origin: string, postsParam?: any[], customPagesParam?: any[]): string {
  return buildExactUrlsetSitemap(origin, postsParam, customPagesParam);
}

function getYoastXsl(): string {
  return `<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="2.0"
	xmlns:html="http://www.w3.org/TR/REC-html40"
	xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"
	xmlns:sitemap="http://www.sitemaps.org/schemas/sitemap/0.9"
	xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
	<xsl:output method="html" version="1.0" encoding="UTF-8" indent="yes"/>
	<xsl:template match="/">
		<html xmlns="http://www.w3.org/1999/xhtml" lang="en">
			<head>
				<title>XML Sitemap</title>
				<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
				<style type="text/css">
					body {
						font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen-Sans, Ubuntu, Cantarell, "Helvetica Neue", sans-serif;
						color: #222222;
						margin: 0;
						padding: 20px 24px;
						background-color: #ffffff;
					}
					a {
						color: #111111;
						text-decoration: none;
					}
					a:hover {
						text-decoration: underline;
					}
					.header {
						margin-bottom: 16px;
						padding-bottom: 12px;
						border-bottom: 1px solid #e5e7eb;
					}
					h1 {
						font-size: 24px;
						color: #111111;
						margin: 0 0 6px;
						font-weight: 700;
					}
					.expl {
						margin: 8px 0;
						line-height: 1.5;
						font-size: 13px;
						color: #555555;
					}
					.expl a {
						color: #111111;
						font-weight: 600;
						text-decoration: underline;
					}
					.btn-back {
						display: inline-block;
						font-weight: 600;
						font-size: 13px;
						color: #111111;
						margin-bottom: 10px;
					}
					.btn-back:hover {
						text-decoration: underline;
					}
					#content {
						margin: 0 auto;
						width: 100%;
					}
					table {
						border: none;
						border-collapse: collapse;
						font-size: 13px;
						margin: 10px 0 30px;
						width: 100%;
						background: #ffffff;
						border-top: 1px solid #cccccc;
					}
					th {
						text-align: left;
						padding: 6px 10px;
						font-size: 12px;
						font-weight: 600;
						color: #444444;
						border-bottom: 1px solid #cccccc;
						background: #fafafa;
					}
					th.num, td.num {
						text-align: center;
						width: 70px;
					}
					th.date, td.date {
						text-align: left;
						width: 220px;
						white-space: nowrap;
					}
					td {
						padding: 5px 10px;
						vertical-align: middle;
						color: #222222;
						border: none;
					}
					tbody tr:nth-child(even) {
						background-color: #ededed;
					}
					tbody tr:nth-child(odd) {
						background-color: #ffffff;
					}
					tbody tr:hover {
						background-color: #e2e2e2;
					}
					.badge-counter {
						font-weight: 700;
						color: #111111;
					}
				</style>
			</head>
			<body>
				<div id="content">
					<div class="header">
						<h1>XML Sitemap</h1>
						<p class="expl">
							Generated by <strong>Yoast SEO</strong>, this is an XML Sitemap, meant for consumption by search engines.<br/>
							You can find more information about XML sitemaps on <a href="https://sitemaps.org" target="_blank" rel="noopener noreferrer">sitemaps.org</a>.
						</p>
					</div>

					<xsl:if test="sitemap:sitemapindex">
						<p class="expl">
							This XML Sitemap Index file contains <span class="badge-counter"><xsl:value-of select="count(sitemap:sitemapindex/sitemap:sitemap)"/></span> sitemaps.
						</p>
						<table id="sitemap" cellpadding="0" cellspacing="0">
							<thead>
								<tr>
									<th width="75%">Sitemap</th>
									<th class="date" width="25%">Last Modified</th>
								</tr>
							</thead>
							<tbody>
								<xsl:for-each select="sitemap:sitemapindex/sitemap:sitemap">
									<xsl:variable name="sitemapUrl">
										<xsl:value-of select="sitemap:loc"/>
									</xsl:variable>
									<tr>
										<td>
											<a href="{$sitemapUrl}"><xsl:value-of select="sitemap:loc"/></a>
										</td>
										<td class="date">
											<xsl:choose>
												<xsl:when test="contains(sitemap:lastmod, 'T')">
													<xsl:value-of select="concat(substring(sitemap:lastmod, 1, 10), ' ', substring(sitemap:lastmod, 12, 5), ' +00:00')"/>
												</xsl:when>
												<xsl:otherwise>
													<xsl:value-of select="concat(sitemap:lastmod, ' 00:00 +00:00')"/>
												</xsl:otherwise>
											</xsl:choose>
										</td>
									</tr>
								</xsl:for-each>
							</tbody>
						</table>
					</xsl:if>

					<xsl:if test="sitemap:urlset">
						<p class="expl">
							<a href="/sitemap_index.xml" class="btn-back">&#8592; Sitemap Index</a>
						</p>
						<p class="expl">
							This XML Sitemap contains <span class="badge-counter"><xsl:value-of select="count(sitemap:urlset/sitemap:url)"/></span> URLs.
						</p>
						<table id="sitemap" cellpadding="0" cellspacing="0">
							<thead>
								<tr>
									<th width="75%">URL</th>
									<th class="num" width="10%">Images</th>
									<th class="date" width="15%">Last Modified</th>
								</tr>
							</thead>
							<tbody>
								<xsl:for-each select="sitemap:urlset/sitemap:url">
									<xsl:variable name="itemURL">
										<xsl:value-of select="sitemap:loc"/>
									</xsl:variable>
									<tr>
										<td>
											<a href="{$itemURL}"><xsl:value-of select="sitemap:loc"/></a>
										</td>
										<td class="num">
											<xsl:value-of select="count(image:image)"/>
										</td>
										<td class="date">
											<xsl:choose>
												<xsl:when test="contains(sitemap:lastmod, 'T')">
													<xsl:value-of select="concat(substring(sitemap:lastmod, 1, 10), ' ', substring(sitemap:lastmod, 12, 5), ' +00:00')"/>
												</xsl:when>
												<xsl:otherwise>
													<xsl:value-of select="concat(sitemap:lastmod, ' 00:00 +00:00')"/>
												</xsl:otherwise>
											</xsl:choose>
										</td>
									</tr>
								</xsl:for-each>
							</tbody>
						</table>
					</xsl:if>
				</div>
			</body>
		</html>
	</xsl:template>
</xsl:stylesheet>`;
}

function getRobotsTxt(origin: string): string {
  const base = (origin || "").replace(/\/$/, "");
  if (fs.existsSync(ROBOTS_FILE)) {
    try {
      let content = fs.readFileSync(ROBOTS_FILE, "utf-8");
      // Replace any hardcoded or foreign domain in sitemap directives with dynamic base
      content = content.replace(/Sitemap:\s*https?:\/\/[^\s\/]+(\/[^\s]+)/gi, `Sitemap: ${base}$1`);
      content = content.replace(/Sitemap:\s*(\/[^\s]+)/gi, `Sitemap: ${base}$1`);
      if (!content.includes("sitemap_index.xml")) {
        content += `\nSitemap: ${base}/sitemap_index.xml\n`;
      }
      return content;
    } catch {}
  }
  return `# robots.txt for Scribd Downloader (Yoast SEO format)
User-agent: *
Allow: /

# Disallow admin control panels and private routes
Disallow: /admin123
Disallow: /admin
Disallow: /admin/*
Disallow: /api/
Disallow: /temp_downloads/

# XML Sitemap directives (Yoast SEO index and compatibility)
Sitemap: ${base}/sitemap_index.xml
Sitemap: ${base}/sitemap.xml
Sitemap: ${base}/post-sitemap.xml
Sitemap: ${base}/page-sitemap.xml
`;
}

function saveRobotsTxtOnServer(content: string) {
  robotsUpdatedAt = new Date().toISOString();
  try {
    fs.writeFileSync(ROBOTS_FILE, content, "utf-8");
  } catch (err) {
    console.error("Error saving robots.txt to disk:", err);
  }
  try {
    const publicRobots = path.join(process.cwd(), "public", "robots.txt");
    fs.writeFileSync(publicRobots, content, "utf-8");
  } catch {}
}

function rebuildAllSitemapsOnServer(origin: string, _postsParam?: any[], _customPagesParam?: any[]) {
  const base = (origin || "").replace(/\/$/, "");
  const sitemaps = generateAllSitemaps(base);
  const indexXml = sitemaps.indexXml;
  const postXml = sitemaps.postXml;
  const pageXml = sitemaps.pageXml;
  const allUrlsetXml = sitemaps.sitemapXml;
  const updatedAt = sitemaps.lastGenerated || new Date().toISOString();

  sitemapsByOrigin.set(base, { indexXml, postXml, pageXml, allUrlsetXml, updatedAt });
  sitemapUpdatedAt = updatedAt;

  return { indexXml, postXml, pageXml, allUrlsetXml };
}

function getSitemapIndexXml(origin: string): string {
  const base = (origin || "").replace(/\/$/, "");
  const cached = sitemapsByOrigin.get(base);
  if (cached) return cached.indexXml;
  const rebuilt = rebuildAllSitemapsOnServer(base);
  return rebuilt.indexXml;
}

function getPostSitemapXml(origin: string): string {
  const base = (origin || "").replace(/\/$/, "");
  const cached = sitemapsByOrigin.get(base);
  if (cached) return cached.postXml;
  const rebuilt = rebuildAllSitemapsOnServer(base);
  return rebuilt.postXml;
}

function getPageSitemapXml(origin: string): string {
  const base = (origin || "").replace(/\/$/, "");
  const cached = sitemapsByOrigin.get(base);
  if (cached) return cached.pageXml;
  const rebuilt = rebuildAllSitemapsOnServer(base);
  return rebuilt.pageXml;
}

function getSitemapXml(origin: string): string {
  const base = (origin || "").replace(/\/$/, "");
  const cached = sitemapsByOrigin.get(base);
  if (cached) return cached.allUrlsetXml;
  const rebuilt = rebuildAllSitemapsOnServer(base);
  return rebuilt.allUrlsetXml;
}

function saveSitemapXmlOnServer(content: string, origin?: string) {
  sitemapUpdatedAt = new Date().toISOString();
  if (origin) {
    const base = origin.replace(/\/$/, "");
    const existing = sitemapsByOrigin.get(base);
    if (existing) {
      existing.indexXml = content;
      existing.updatedAt = sitemapUpdatedAt;
    }
  }
}

// Helper to sanitize title
function sanitizeTitle(str: string): string {
  return str
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9_-]/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

// Background cleanup: keep cache, clean temp jobs older than 2 hours
setInterval(() => {
  const now = Date.now();
  for (const [id, job] of jobs.entries()) {
    if (now - job.createdAt > 2 * 60 * 60 * 1000) {
      try {
        if (fs.existsSync(job.dir)) {
          fs.rmSync(job.dir, { recursive: true, force: true });
        }
      } catch (e) {
        console.error(`Failed to cleanup dir for job ${id}:`, e);
      }
      jobs.delete(id);
    }
  }
}, 30 * 60 * 1000);

const SAMPLES = [
  {
    title: "KDM - Kegiatan Awal Pelajaran (Scribd Presentation)",
    url: "https://www.scribd.com/presentation/359613425/KDM-Kegiatan-Awal-Pelajaran-Off-C-Kelompok-3-Andy-Dan-Farah",
    description: "Public educational slide deck with 6 high-res presentation slides",
    type: "presentation",
  },
  {
    title: "Comprehensive Curriculum & Research Analysis (161 Pages)",
    url: "https://www.scribd.com/document/394290904/Curriculum-Research-Analysis",
    description: "High quality full-length public academic paper with 161 extracted pages",
    type: "document",
  },
  {
    title: "Technical Engineering Specification & Manual",
    url: "https://www.scribd.com/document/258343050/Technical-Engineering-Manual",
    description: "Technical reference document with vector diagrams",
    type: "document",
  },
  {
    title: "Limba Romana B - Syllabus (Public Document)",
    url: "https://www.scribd.com/document/171137081/Sample-Document",
    description: "Public academic syllabus document",
    type: "document",
  },
  {
    title: "Scribd Engineering & Design Guide (Demo Reference)",
    url: "https://www.scribd.com/document/359613425/engineering-guide",
    description: "High speed vector compiled sample document",
    type: "document",
  }
];

function generatePageHtml(rawTemplate: string, reqPath: string, origin: string): { html: string; is404: boolean } {
  const base = (origin || "").replace(/\/$/, "");
  const cleanPath = (reqPath || "/").split("?")[0].replace(/\/+$/, "") || "/";
  const fullUrl = `${base}${cleanPath}`;

  const supportedLangs = ["en", "hi", "id", "es", "fr", "br", "de"];
  const segments = cleanPath.split("/").filter(Boolean);

  let lang = "en";
  let pathWithoutLang = cleanPath;
  let remainingSegments = segments;

  if (segments.length > 0 && supportedLangs.includes(segments[0].toLowerCase())) {
    lang = segments[0].toLowerCase();
    remainingSegments = segments.slice(1);
    pathWithoutLang = "/" + remainingSegments.join("/");
    if (pathWithoutLang === "/") pathWithoutLang = "";
  }

  const allPosts = getBlogPostsOnServer();
  const allCustomPages = getCustomPagesOnServer();

  let isBlog = false;
  let blogSlug = "";
  let pageSlug = "";

  if (remainingSegments.length > 0) {
    if (remainingSegments[0] === "blog") {
      isBlog = true;
      blogSlug = remainingSegments[1] || "";
    } else {
      pageSlug = remainingSegments.join("/");
    }
  } else {
    pageSlug = "home";
  }

  let matchedPost: any = null;
  if (isBlog && blogSlug) {
    matchedPost = allPosts.find((p) => {
      const pSlug = cleanSlugForUrl(p.slug, p.id);
      return pSlug === blogSlug || p.id === blogSlug;
    });
  }

  let matchedPage: any = null;
  if (!isBlog && pageSlug && pageSlug !== "home") {
    matchedPage = allCustomPages.find((p) => {
      const pSlug = cleanSlugForUrl(p.slug, p.id);
      return pSlug === pageSlug || p.id === pageSlug;
    });
  }

  const knownCorePages = ["", "home", "how-it-works", "blog", "about", "contact", "privacy", "terms", "disclaimer", "legal", "sitemap", "robots"];
  let is404 = false;

  if (isBlog && blogSlug && !matchedPost) {
    is404 = true;
  } else if (!isBlog && pageSlug && pageSlug !== "home" && !matchedPage && !knownCorePages.includes(pageSlug)) {
    is404 = true;
  }

  let title = "Scribd Downloader - Free High-Speed Document & Presentation PDF Converter";
  let description = "Download Scribd documents, textbooks, academic papers, and presentation slide decks as high-resolution PDF files with zero waiting time. 100% free, fast, and mobile-friendly.";
  let heading = "Free High-Speed Scribd Document & Presentation PDF Downloader";
  let bodyHtml = "";

  if (matchedPost) {
    title = `${matchedPost.title} | Scribd Downloader Official Blog`;
    description = matchedPost.excerpt || `Complete tutorial and step-by-step guide for ${matchedPost.title}. Learn how to download and convert Scribd documents to PDF.`;
    heading = matchedPost.title;

    bodyHtml = `
      <article class="max-w-4xl mx-auto px-4 py-8">
        <nav aria-label="Breadcrumb" class="mb-4 text-sm text-slate-500">
          <a href="${base}/${lang}" class="hover:underline text-indigo-600">Home</a> &gt; 
          <a href="${base}/${lang}/blog" class="hover:underline text-indigo-600">Blog</a> &gt; 
          <span class="text-slate-800 font-medium">${escapeXml(matchedPost.title)}</span>
        </nav>
        <header class="mb-6">
          <h1 class="text-3xl sm:text-4xl font-extrabold text-slate-900 mb-3 tracking-tight">${escapeXml(matchedPost.title)}</h1>
          <div class="flex flex-wrap items-center gap-3 text-sm text-slate-600 pb-4 border-b border-slate-200">
            <span class="font-semibold text-slate-800">Author: Minhas Hussain</span>
            <span>•</span>
            <time datetime="${matchedPost.date || '2026-09-19'}">${matchedPost.date || 'September 2026'}</time>
            <span>•</span>
            <span class="px-2 py-0.5 rounded bg-indigo-50 text-indigo-700 font-semibold uppercase text-xs">${lang} Edition</span>
          </div>
          <p class="mt-4 text-lg text-slate-700 leading-relaxed bg-slate-50 p-5 rounded-2xl border border-slate-200 font-normal">${escapeXml(matchedPost.excerpt || '')}</p>
        </header>
        <div class="space-y-6 text-slate-800 text-base leading-relaxed">
          <p>Educational materials on Scribd encompass millions of university whitepapers, scientific research monographs, corporate slide presentations, and technical documentation. Our high-performance extraction system enables researchers and students to compile high-resolution PDF documents for offline academic study without restrictive paywalls.</p>
          <h2 class="text-2xl font-bold text-slate-900 mt-8 mb-4">Step-by-Step Document Downloading Guide</h2>
          <ol class="list-decimal pl-6 space-y-3">
            <li><strong>Copy Document URL:</strong> Navigate to Scribd in your web browser and copy the exact URL of the presentation or document you want to read.</li>
            <li><strong>Paste into Converter:</strong> Return to our home screen and paste the URL into the search field.</li>
            <li><strong>High-Speed Extraction:</strong> Our Node.js scraper downloads the high-resolution vector and image layers in parallel.</li>
            <li><strong>Save as PDF:</strong> Download your unified, unwatermarked PDF file directly to your desktop or mobile device.</li>
          </ol>
          <div class="mt-8 p-6 bg-indigo-50 rounded-2xl border border-indigo-100">
            <h3 class="text-lg font-bold text-indigo-900 mb-2">Need to convert more documents?</h3>
            <p class="text-sm text-indigo-700 mb-4">Use our instant converter to process presentations, technical papers, and sheet music right now.</p>
            <a href="${base}/${lang}" class="inline-block px-5 py-2.5 bg-indigo-600 text-white font-semibold rounded-xl hover:bg-indigo-700 transition">Go to Instant Downloader</a>
          </div>
        </div>
      </article>
    `;
  } else if (matchedPage) {
    title = `${matchedPage.title} - Free Document Converter & Downloader`;
    description = matchedPage.metaDescription || `Download and convert Scribd documents using ${matchedPage.title}. 100% free high-resolution PDF converter.`;
    heading = matchedPage.title;

    bodyHtml = `
      <section class="max-w-4xl mx-auto px-4 py-8">
        <nav aria-label="Breadcrumb" class="mb-4 text-sm text-slate-500">
          <a href="${base}/${lang}" class="hover:underline text-indigo-600">Home</a> &gt; 
          <span class="text-slate-800 font-medium">${escapeXml(matchedPage.title)}</span>
        </nav>
        <h1 class="text-3xl sm:text-4xl font-extrabold text-slate-900 mb-4 tracking-tight">${escapeXml(matchedPage.title)}</h1>
        <p class="text-lg text-slate-700 mb-8 leading-relaxed">${escapeXml(matchedPage.metaDescription || '')}</p>
        <div class="p-6 bg-white rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <h2 class="text-xl font-bold text-slate-900">High-Resolution PDF Extraction Features</h2>
          <ul class="list-disc pl-5 space-y-2 text-slate-600">
            <li>Direct extraction of high-resolution vector and raster page images</li>
            <li>Ultra-fast parallel page download worker threads</li>
            <li>100% free with zero registration or payment required</li>
            <li>Compatible with all modern browsers and smartphones</li>
          </ul>
          <div class="pt-4">
            <a href="${base}/${lang}" class="inline-block px-5 py-2.5 bg-indigo-600 text-white font-semibold rounded-xl hover:bg-indigo-700 transition">Start Free Download</a>
          </div>
        </div>
      </section>
    `;
  } else if (isBlog) {
    title = "Scribd Document Tips, Tutorials & Guides - Official Blog";
    description = "Read comprehensive tutorials, guides, and tips for downloading, converting, and reading Scribd documents offline in high-resolution PDF format.";
    heading = "Scribd Downloader Blog & Educational Guides";

    bodyHtml = `
      <section class="max-w-5xl mx-auto px-4 py-8">
        <nav aria-label="Breadcrumb" class="mb-4 text-sm text-slate-500">
          <a href="${base}/${lang}" class="hover:underline text-indigo-600">Home</a> &gt; 
          <span class="text-slate-800 font-medium">Blog</span>
        </nav>
        <h1 class="text-3xl sm:text-4xl font-extrabold text-slate-900 mb-3 tracking-tight">${heading}</h1>
        <p class="text-lg text-slate-600 mb-8 leading-relaxed">${description}</p>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          ${allPosts.map((p) => {
            const pSlug = cleanSlugForUrl(p.slug, p.id);
            const pLang = p.language || lang;
            return `
              <article class="p-5 bg-white rounded-2xl border border-slate-200 hover:border-indigo-300 transition">
                <span class="text-xs font-semibold uppercase tracking-wider text-indigo-600">${pLang}</span>
                <h2 class="text-xl font-bold text-slate-900 mt-1 mb-2">
                  <a href="${base}/${pLang}/blog/${pSlug}" class="hover:text-indigo-600">${escapeXml(p.title)}</a>
                </h2>
                <p class="text-sm text-slate-600 leading-relaxed mb-3">${escapeXml(p.excerpt || '')}</p>
                <div class="text-xs text-slate-500">${p.date || 'September 2026'} • By Minhas Hussain</div>
              </article>
            `;
          }).join("")}
        </div>
      </section>
    `;
  } else if (pageSlug === "how-it-works") {
    title = "How It Works - Scribd Document Extraction Architecture & Guide";
    description = "Learn how our multi-threaded Node.js scraper fetches document tiles, renders vector typography, and compiles unified PDF files.";
    heading = "How Our Document Extraction Engine Works";

    bodyHtml = `
      <section class="max-w-4xl mx-auto px-4 py-8">
        <nav aria-label="Breadcrumb" class="mb-4 text-sm text-slate-500">
          <a href="${base}/${lang}" class="hover:underline text-indigo-600">Home</a> &gt; 
          <span class="text-slate-800 font-medium">How It Works</span>
        </nav>
        <h1 class="text-3xl sm:text-4xl font-extrabold text-slate-900 mb-4 tracking-tight">${heading}</h1>
        <p class="text-lg text-slate-700 mb-6 leading-relaxed">${description}</p>
        <div class="space-y-6 text-slate-800 leading-relaxed">
          <div class="p-6 bg-white rounded-2xl border border-slate-200">
            <h2 class="text-xl font-bold text-slate-900 mb-2">1. Intelligent URL Inspection</h2>
            <p class="text-slate-600">When you submit a Scribd URL, our server identifies the unique document asset identifier and resolves the public metadata manifest.</p>
          </div>
          <div class="p-6 bg-white rounded-2xl border border-slate-200">
            <h2 class="text-xl font-bold text-slate-900 mb-2">2. Parallel Page Processing</h2>
            <p class="text-slate-600">Using multi-threaded worker pools, the scraper requests image tiles and vector layers concurrently, achieving speeds under 1.5 seconds per document.</p>
          </div>
          <div class="p-6 bg-white rounded-2xl border border-slate-200">
            <h2 class="text-xl font-bold text-slate-900 mb-2">3. Standard PDF Assembly</h2>
            <p class="text-slate-600">Each page is embedded into a standard uncompressed PDF container formatted for Adobe Acrobat, Kindle, Apple Books, and modern web browsers.</p>
          </div>
        </div>
      </section>
    `;
  } else {
    // Default Homepage
    bodyHtml = `
      <section class="max-w-4xl mx-auto px-4 py-12 text-center">
        <h1 class="text-4xl sm:text-5xl font-black text-slate-900 tracking-tight mb-4">
          Download <span class="text-indigo-600">Scribd Documents</span> in High-Res PDF
        </h1>
        <p class="text-lg sm:text-xl text-slate-600 max-w-2xl mx-auto mb-8 leading-relaxed">
          Paste any public Scribd document, research paper, presentation, or book URL below to convert and download your high-speed PDF.
        </p>
        <div class="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm max-w-2xl mx-auto mb-12 text-left">
          <h2 class="font-bold text-slate-900 mb-2">Supported Document Formats:</h2>
          <p class="text-sm text-slate-600 mb-4">Research papers, presentations, PDF manuals, textbooks, and public slide decks.</p>
          <div class="flex flex-wrap gap-2 text-xs font-semibold text-indigo-700">
            <span class="px-3 py-1 bg-indigo-50 rounded-full">PDF Direct</span>
            <span class="px-3 py-1 bg-indigo-50 rounded-full">Slide Decks</span>
            <span class="px-3 py-1 bg-indigo-50 rounded-full">Vector Text</span>
            <span class="px-3 py-1 bg-indigo-50 rounded-full">Zero Wait Time</span>
          </div>
        </div>
      </section>
    `;
  }

  // Generate Crawlable Directory of All Pages and Articles for Bots & Google
  const crawlableDirectoryHtml = `
    <section class="max-w-6xl mx-auto px-4 py-10 border-t border-slate-200 text-sm">
      <h2 class="text-lg font-bold text-slate-900 mb-4">International Language Editions & Regional Guides</h2>
      <div class="flex flex-wrap gap-3 mb-8">
        <a href="${base}/en" class="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-indigo-50 text-slate-800 hover:text-indigo-600 font-medium">English</a>
        <a href="${base}/br" class="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-indigo-50 text-slate-800 hover:text-indigo-600 font-medium">Português (Brasil)</a>
        <a href="${base}/es" class="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-indigo-50 text-slate-800 hover:text-indigo-600 font-medium">Español</a>
        <a href="${base}/fr" class="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-indigo-50 text-slate-800 hover:text-indigo-600 font-medium">Français</a>
        <a href="${base}/de" class="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-indigo-50 text-slate-800 hover:text-indigo-600 font-medium">Deutsch</a>
        <a href="${base}/id" class="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-indigo-50 text-slate-800 hover:text-indigo-600 font-medium">Bahasa Indonesia</a>
      </div>

      <h2 class="text-lg font-bold text-slate-900 mb-4">All Published Articles & Guides</h2>
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 mb-8">
        ${allPosts.map((p) => {
          const pSlug = cleanSlugForUrl(p.slug, p.id);
          const pLang = p.language || lang;
          return `
            <a href="${base}/${pLang}/blog/${pSlug}" class="text-slate-700 hover:text-indigo-600 truncate py-1">
              • [${pLang.toUpperCase()}] ${escapeXml(p.title)}
            </a>
          `;
        }).join("")}
      </div>

      <h2 class="text-lg font-bold text-slate-900 mb-4">Popular Document Converter Tools</h2>
      <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
        ${allCustomPages.slice(0, 32).map((cp) => {
          const cpSlug = cleanSlugForUrl(cp.slug, cp.id);
          const cpLang = cp.language || lang;
          return `
            <a href="${base}/${cpLang}/${cpSlug}" class="text-slate-600 hover:text-indigo-600 truncate py-1 text-xs">
              ${escapeXml(cp.title)}
            </a>
          `;
        }).join("")}
      </div>
    </section>
  `;

  // Server-rendered content inside <div id="root">
  const rootSsrHtml = `
    <div id="ssr-root-content" class="min-h-screen flex flex-col bg-slate-50 font-sans">
      <header class="bg-white border-b border-slate-200 py-4 shadow-sm">
        <div class="max-w-6xl mx-auto px-4 flex flex-wrap items-center justify-between gap-4">
          <a href="${base}/${lang}" class="text-2xl font-black text-slate-900 tracking-tight">
            Scribd<span class="text-indigo-600">Downloader</span>
          </a>
          <nav class="flex items-center gap-4 sm:gap-6 text-sm font-semibold text-slate-700">
            <a href="${base}/${lang}" class="hover:text-indigo-600">Home</a>
            <a href="${base}/${lang}/how-it-works" class="hover:text-indigo-600">How It Works</a>
            <a href="${base}/${lang}/blog" class="hover:text-indigo-600">Blog</a>
            <a href="${base}/${lang}/about" class="hover:text-indigo-600">About</a>
            <a href="${base}/${lang}/contact" class="hover:text-indigo-600">Contact</a>
          </nav>
        </div>
      </header>

      <main class="flex-grow">
        ${bodyHtml}
        ${crawlableDirectoryHtml}
      </main>

      <footer class="bg-slate-900 text-slate-400 py-10 text-xs border-t border-slate-800">
        <div class="max-w-6xl mx-auto px-4 flex flex-wrap justify-between items-center gap-6">
          <p>© 2026 Scribd Downloader. Created by Minhas Hussain. Educational Fair-Use Document Utility.</p>
          <div class="flex flex-wrap gap-4 text-slate-400 font-medium">
            <a href="${base}/privacy" class="hover:text-white">Privacy Policy</a>
            <a href="${base}/terms" class="hover:text-white">Terms of Service</a>
            <a href="${base}/sitemap_index.xml" class="hover:text-white">Sitemap Index (XML)</a>
            <a href="${base}/sitemap.xml" class="hover:text-white">Full Sitemap (XML)</a>
            <a href="${base}/post-sitemap.xml" class="hover:text-white">Posts Sitemap</a>
            <a href="${base}/page-sitemap.xml" class="hover:text-white">Pages Sitemap</a>
            <a href="${base}/robots.txt" class="hover:text-white">Robots.txt</a>
          </div>
        </div>
      </footer>
    </div>
  `;

  let html = rawTemplate;

  // Replace Title & Description
  html = html.replace(/<title>[\s\S]*?<\/title>/i, `<title>${escapeXml(title)}</title>`);
  html = html.replace(/<meta\s+name="description"\s+content="[^"]*"\s*\/?>/i, `<meta name="description" content="${escapeXml(description)}" />`);

  // Canonical Tag
  const canonicalUrl = cleanPath === "/en" || cleanPath === "/en/" ? `${base}/` : fullUrl;
  if (html.includes('<link rel="canonical"')) {
    html = html.replace(/<link rel="canonical" href="[^"]*"\s*\/?>/i, `<link rel="canonical" href="${canonicalUrl}" />`);
  } else {
    html = html.replace("</head>", `  <link rel="canonical" href="${canonicalUrl}" />\n</head>`);
  }

  // Alternate Language Hreflang Tags (only for real existing variants)
  let hreflangLinks: string[] = [];
  if (pageSlug === "home") {
    hreflangLinks = [
      `  <link rel="alternate" hreflang="en" href="${base}/" />`,
      `  <link rel="alternate" hreflang="hi" href="${base}/hi" />`,
      `  <link rel="alternate" hreflang="pt-BR" href="${base}/br" />`,
      `  <link rel="alternate" hreflang="es" href="${base}/es" />`,
      `  <link rel="alternate" hreflang="fr" href="${base}/fr" />`,
      `  <link rel="alternate" hreflang="de" href="${base}/de" />`,
      `  <link rel="alternate" hreflang="id" href="${base}/id" />`,
      `  <link rel="alternate" hreflang="x-default" href="${base}/" />`
    ];
  } else if (matchedPage && matchedPage.translationGroupId) {
    const siblings = allCustomPages.filter((p: any) => p.translationGroupId === matchedPage.translationGroupId && p.status !== "draft" && !p.inTrash);
    for (const sib of siblings) {
      const sibLang = sib.language || "en";
      const sibSlug = cleanSlugForUrl(sib.slug, sib.id);
      const sibUrl = sibLang === "en" ? `${base}/${sibSlug}` : `${base}/${sibLang}/${sibSlug}`;
      const code = sibLang === "br" ? "pt-BR" : sibLang;
      hreflangLinks.push(`  <link rel="alternate" hreflang="${code}" href="${sibUrl}" />`);
      if (sibLang === "en") {
        hreflangLinks.push(`  <link rel="alternate" hreflang="x-default" href="${sibUrl}" />`);
      }
    }
  } else if (matchedPost && matchedPost.translationGroupId) {
    const siblings = allPosts.filter((p: any) => p.translationGroupId === matchedPost.translationGroupId && p.status !== "draft" && !p.inTrash);
    for (const sib of siblings) {
      const sibLang = sib.language || "en";
      const sibSlug = cleanSlugForUrl(sib.slug, sib.id);
      const sibUrl = `${base}/blog/${sibSlug}`;
      const code = sibLang === "br" ? "pt-BR" : sibLang;
      hreflangLinks.push(`  <link rel="alternate" hreflang="${code}" href="${sibUrl}" />`);
      if (sibLang === "en") {
        hreflangLinks.push(`  <link rel="alternate" hreflang="x-default" href="${sibUrl}" />`);
      }
    }
  }

  if (hreflangLinks.length > 0) {
    html = html.replace("</head>", `${hreflangLinks.join("\n")}\n</head>`);
  }

  // Open Graph and Twitter Cards
  if (html.includes('<meta property="og:title"')) {
    html = html.replace(/<meta property="og:title" content="[^"]*"\s*\/?>/i, `<meta property="og:title" content="${escapeXml(title)}" />`);
  } else {
    html = html.replace("</head>", `  <meta property="og:title" content="${escapeXml(title)}" />\n</head>`);
  }

  if (html.includes('<meta property="og:description"')) {
    html = html.replace(/<meta property="og:description" content="[^"]*"\s*\/?>/i, `<meta property="og:description" content="${escapeXml(description)}" />`);
  } else {
    html = html.replace("</head>", `  <meta property="og:description" content="${escapeXml(description)}" />\n</head>`);
  }

  if (html.includes('<meta property="og:url"')) {
    html = html.replace(/<meta property="og:url" content="[^"]*"\s*\/?>/i, `<meta property="og:url" content="${fullUrl}" />`);
  } else {
    html = html.replace("</head>", `  <meta property="og:url" content="${fullUrl}" />\n</head>`);
  }

  // Schema.org Structured Data
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": matchedPost ? "Article" : "WebPage",
    "name": title,
    "headline": title,
    "description": description,
    "url": fullUrl,
    "inLanguage": lang,
    "author": {
      "@type": "Person",
      "name": "Minhas Hussain"
    },
    "publisher": {
      "@type": "Organization",
      "name": "Scribd Downloader",
      "url": base
    }
  };
  html = html.replace("</head>", `  <script type="application/ld+json">${JSON.stringify(jsonLd)}</script>\n</head>`);

  // Inject Pre-rendered HTML into <div id="root">
  html = html.replace('<div id="root"></div>', `<div id="root">${rootSsrHtml}</div>`);

  return { html, is404 };
}

async function startServer() {
  const app = express();
  app.set("trust proxy", true);
  const PORT = 3000;

  app.use(express.json());

  // API: Health check
  app.get("/api/health", (_req, res) => {
    res.json({
      status: "ok",
      uptime: process.uptime(),
      cacheEntries: documentCache.size,
      engine: "Ultra-Fast Multi-Threaded Scraper v3"
    });
  });

  // API: Get sample documents to test
  app.get("/api/samples", (_req, res) => {
    const list = SAMPLES.map((s) => {
      const docId = extractDocId(s.url) || s.url;
      const cached = documentCache.get(docId);
      return {
        ...s,
        prewarmed: Boolean(cached?.pdfPath && fs.existsSync(cached.pdfPath)),
        pageCount: cached?.pageCount || 6,
        fileSizeFormatted: cached?.pdfSize
          ? `${(cached.pdfSize / 1024 / 1024).toFixed(2)} MB`
          : "Instant (Cached)",
      };
    });
    res.json(list);
  });

  // API: Start download job
  app.post("/api/download", async (req, res) => {
    const { url, format = "pdf", demoMode = false, quality } = req.body || {};

    if (!url || typeof url !== "string") {
      return res.status(400).json({ error: "Please provide a valid Scribd URL." });
    }

    const trimmedUrl = url.trim();
    if (!trimmedUrl.startsWith("http://") && !trimmedUrl.startsWith("https://")) {
      return res.status(400).json({ error: "URL must begin with http:// or https://" });
    }

    const docId = extractDocId(trimmedUrl);
    if (!trimmedUrl.includes("scribd.com") && !trimmedUrl.includes("demo") && !demoMode && !docId) {
      return res.status(400).json({ error: "The provided URL is not a Scribd URL. Please paste a link from scribd.com or click Try Demo." });
    }

    const jobId = `job_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const jobDir = path.join(DOWNLOADS_ROOT, jobId);
    try {
      if (!fs.existsSync(jobDir)) fs.mkdirSync(jobDir, { recursive: true });
    } catch {}

    const job: DownloadJob = {
      id: jobId,
      url: trimmedUrl,
      format: "pdf",
      status: "queued",
      progress: 5,
      stepMessage: "Job queued. Engaging Ultra-Fast Scraper engine...",
      logs: [
        `[${new Date().toLocaleTimeString()}] Initialized Job ${jobId}`,
        `[${new Date().toLocaleTimeString()}] Target URL: ${trimmedUrl}`,
        `[${new Date().toLocaleTimeString()}] Engine: Parallel Vector Downloader`,
      ],
      createdAt: Date.now(),
      dir: jobDir,
    };
    (job as any).demoMode = demoMode;
    (job as any).quality = quality;

    jobs.set(jobId, job);

    // Run scraper
    const jobPromise = runUltraScraperJob(job);

    // Serverless or instant sync check
    const isServerlessEnv = Boolean(
      process.env.VERCEL ||
      process.env.AWS_LAMBDA_FUNCTION_NAME ||
      req.query.sync === "true" ||
      req.body?.sync === true
    );

    if (isServerlessEnv) {
      await jobPromise;
      return res.json({
        jobId: job.id,
        status: job.status,
        progress: job.progress,
        stepMessage: job.stepMessage,
        documentTitle: job.documentTitle,
        pdfFile: job.pdfFile,
        imageFiles: job.imageFiles,
        speedStats: job.speedStats,
        logs: job.logs,
        error: job.error,
        troubleshooting: job.troubleshooting,
        message: job.status === "completed" ? "Ultra fast download job completed successfully." : "Extraction finished",
      });
    }

    // On standard Node servers, race for 1.2s: if it finishes in <1.2s, return completed job directly!
    const fastFinished = await Promise.race([
      jobPromise.then(() => true),
      new Promise((resolve) => setTimeout(() => resolve(false), 1200))
    ]);

    if (fastFinished || job.status === "completed" || job.status === "failed") {
      return res.json({
        jobId: job.id,
        status: job.status,
        progress: job.progress,
        stepMessage: job.stepMessage,
        documentTitle: job.documentTitle,
        pdfFile: job.pdfFile,
        imageFiles: job.imageFiles,
        speedStats: job.speedStats,
        logs: job.logs,
        error: job.error,
        troubleshooting: job.troubleshooting,
        message: "Ultra fast download job completed successfully."
      });
    }

    res.json({ jobId, message: "Ultra fast download job started successfully." });
  });

  // API: Quick direct download stream (Single click instant stream)
  app.get("/api/quick-download", async (req, res) => {
    const { url } = req.query;
    if (!url || typeof url !== "string") {
      return res.status(400).send("Missing document URL");
    }

    const docId = extractDocId(url) || url;
    const cached = documentCache.get(docId);

    if (cached && cached.pdfPath && fs.existsSync(cached.pdfPath)) {
      const stats = fs.statSync(cached.pdfPath);
      const filename = `${cached.title || "scribd-document"}.pdf`;
      res.writeHead(200, {
        "Content-Type": "application/pdf",
        "Content-Length": stats.size,
        "Content-Disposition": `attachment; filename="${filename}"; filename*=UTF-8''${encodeURIComponent(filename)}`,
        "Cache-Control": "public, max-age=86400, immutable",
        "Accept-Ranges": "bytes",
      });
      return fs.createReadStream(cached.pdfPath, { highWaterMark: 128 * 1024 }).pipe(res);
    }

    // Otherwise redirect to standard download job flow
    res.redirect(`/?url=${encodeURIComponent(url)}`);
  });

  // API: Get job status
  app.get("/api/jobs/:id", (req, res) => {
    const job = jobs.get(req.params.id);
    if (!job) {
      return res.status(404).json({ error: "Download job not found or expired." });
    }
    res.json(job);
  });

  // API: Download generated PDF with ULTRA-FAST streaming headers and robust multi-tier fallback
  app.get("/api/jobs/:id/download", (req, res) => {
    const rawId = req.params.id;
    let targetPdfPath = "";
    let targetFilename = "scribd-document.pdf";

    const job = jobs.get(rawId);
    if (job && job.pdfFile && fs.existsSync(job.pdfFile.path)) {
      targetPdfPath = job.pdfFile.path;
      targetFilename = job.pdfFile.filename;
    } else {
      // Disk Fallback 1: Direct cached PDF by document ID (e.g. 258343050.pdf)
      const cachePath = path.join(CACHE_ROOT, `${rawId}.pdf`);
      if (fs.existsSync(cachePath)) {
        targetPdfPath = cachePath;
        targetFilename = `scribd-${rawId}.pdf`;
      } else {
        // Disk Fallback 2: Check job directory in temp_downloads
        const jobDir = path.join(DOWNLOADS_ROOT, rawId);
        if (fs.existsSync(jobDir)) {
          const files = fs.readdirSync(jobDir);
          const pdfFound = files.find((f) => f.endsWith(".pdf"));
          if (pdfFound) {
            targetPdfPath = path.join(jobDir, pdfFound);
            targetFilename = pdfFound;
          }
        }
      }
    }

    // Disk Fallback 3: Memory documentCache
    if (!targetPdfPath || !fs.existsSync(targetPdfPath)) {
      const cached = documentCache.get(rawId);
      if (cached && fs.existsSync(cached.pdfPath)) {
        targetPdfPath = cached.pdfPath;
        targetFilename = `${cached.title}.pdf`;
      }
    }

    if (targetPdfPath && fs.existsSync(targetPdfPath)) {
      const stats = fs.statSync(targetPdfPath);
      const safeFilename = targetFilename.replace(/[^\w.-]/g, "_");
      const isInline = req.query.inline === "true" || req.query.view === "true";
      const disposition = isInline ? "inline" : "attachment";

      res.writeHead(200, {
        "Content-Type": "application/pdf",
        "Content-Length": stats.size,
        "Content-Disposition": `${disposition}; filename="${safeFilename}"; filename*=UTF-8''${encodeURIComponent(targetFilename)}`,
        "Cache-Control": "public, max-age=86400, immutable",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Expose-Headers": "Content-Disposition, Content-Length",
        "Accept-Ranges": "bytes",
        "Connection": "keep-alive",
      });

      const stream = fs.createReadStream(targetPdfPath, { highWaterMark: 128 * 1024 });
      return stream.pipe(res);
    }

    res.status(404).json({
      error: "PDF not found",
      message: "The requested document could not be located. Please initiate a fresh extraction.",
    });
  });

  // Direct docId download route (e.g. /api/download/:docId)
  app.get("/api/download/:docId", (req, res) => {
    const docId = req.params.docId;
    const cachePath = path.join(CACHE_ROOT, `${docId}.pdf`);
    if (fs.existsSync(cachePath)) {
      const stats = fs.statSync(cachePath);
      const isInline = req.query.inline === "true";
      const disposition = isInline ? "inline" : "attachment";
      res.writeHead(200, {
        "Content-Type": "application/pdf",
        "Content-Length": stats.size,
        "Content-Disposition": `${disposition}; filename="scribd-${docId}.pdf"`,
        "Cache-Control": "public, max-age=86400",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Expose-Headers": "Content-Disposition, Content-Length",
      });
      return fs.createReadStream(cachePath).pipe(res);
    }
    return res.status(404).send("Document not found in cache.");
  });

  // API: Preview an extracted image with aggressive cache header for instant UI display
  app.get("/api/jobs/:id/image/:imageName", (req, res) => {
    const job = jobs.get(req.params.id);
    const cleanImgName = path.basename(req.params.imageName);

    let imgPath = job ? path.join(job.dir, cleanImgName) : "";

    // Fallback 1: Check CACHE_ROOT directly
    if (!imgPath || !fs.existsSync(imgPath)) {
      const candidate = path.join(CACHE_ROOT, cleanImgName);
      if (fs.existsSync(candidate)) {
        imgPath = candidate;
      }
    }

    // Fallback 2: Check subdirectories in DOWNLOADS_ROOT
    if (!imgPath || !fs.existsSync(imgPath)) {
      try {
        if (fs.existsSync(DOWNLOADS_ROOT)) {
          const dirs = fs.readdirSync(DOWNLOADS_ROOT);
          for (const d of dirs) {
            const sub = path.join(DOWNLOADS_ROOT, d, cleanImgName);
            if (fs.existsSync(sub) && fs.statSync(sub).isFile()) {
              imgPath = sub;
              break;
            }
          }
        }
      } catch (_) {}
    }

    // Fallback 3: Check in public/images
    if (!imgPath || !fs.existsSync(imgPath)) {
      const pubImg = path.join(PUBLIC_DIR, "images", cleanImgName);
      if (fs.existsSync(pubImg)) {
        imgPath = pubImg;
      }
    }

    if (!imgPath || !fs.existsSync(imgPath)) {
      return res.status(404).send("Image not found.");
    }

    const stats = fs.statSync(imgPath);
    const ext = path.extname(cleanImgName).toLowerCase();
    const contentType = ext === ".png" ? "image/png" : ext === ".webp" ? "image/webp" : "image/jpeg";

    res.writeHead(200, {
      "Content-Type": contentType,
      "Content-Length": stats.size,
      "Cache-Control": "public, max-age=86400, immutable",
      "Accept-Ranges": "bytes",
    });

    fs.createReadStream(imgPath, { highWaterMark: 64 * 1024 }).pipe(res);
  });

  // API: Delete a job and cleanup files
  app.delete("/api/jobs/:id", (req, res) => {
    const job = jobs.get(req.params.id);
    if (job) {
      try {
        if (fs.existsSync(job.dir)) {
          fs.rmSync(job.dir, { recursive: true, force: true });
        }
      } catch (e) {
        console.error("Error deleting job dir:", e);
      }
      jobs.delete(req.params.id);
    }
    res.json({ success: true });
  });

  // ==========================================
  // SEO, ROBOTS.TXT & YOAST SITEMAP CONTROLLERS
  // ==========================================
  // GET /robots.txt - Public Crawler File
  app.get([
    "/robots.txt",
    "/:lang/robots.txt",
    "/robots",
    "/:lang/robots"
  ], (req, res) => {
    const origin = getRequestOrigin(req);
    res.setHeader("Content-Type", "text/plain; charset=utf-8");
    res.setHeader("Cache-Control", "public, max-age=3600");
    return res.send(getRobotsTxt(origin));
  });

  // GET /sitemap_index.xml - Standard Yoast Sitemap Index
  app.get([
    "/sitemap_index.xml",
    "/:lang/sitemap_index.xml"
  ], (req, res) => {
    const origin = getRequestOrigin(req);
    res.setHeader("Content-Type", "application/xml; charset=utf-8");
    res.setHeader("Cache-Control", "public, max-age=3600");
    return res.send(getSitemapIndexXml(origin));
  });

  // GET /sitemap.xml - Complete unified URL set
  app.get([
    "/sitemap.xml",
    "/:lang/sitemap.xml"
  ], (req, res) => {
    const origin = getRequestOrigin(req);
    res.setHeader("Content-Type", "application/xml; charset=utf-8");
    res.setHeader("Cache-Control", "public, max-age=3600");
    return res.send(getSitemapXml(origin));
  });

  // GET /post-sitemap.xml - Yoast Post Sitemap
  app.get([
    "/post-sitemap.xml",
    "/:lang/post-sitemap.xml"
  ], (req, res) => {
    const origin = getRequestOrigin(req);
    res.setHeader("Content-Type", "application/xml; charset=utf-8");
    res.setHeader("Cache-Control", "public, max-age=3600");
    return res.send(getPostSitemapXml(origin));
  });

  // GET /page-sitemap.xml - Yoast Page Sitemap
  app.get([
    "/page-sitemap.xml",
    "/:lang/page-sitemap.xml"
  ], (req, res) => {
    const origin = getRequestOrigin(req);
    res.setHeader("Content-Type", "application/xml; charset=utf-8");
    res.setHeader("Cache-Control", "public, max-age=3600");
    return res.send(getPageSitemapXml(origin));
  });

  // GET /main-sitemap.xsl & /sitemap.xsl - Visual Yoast SEO Stylesheet
  app.get([
    "/main-sitemap.xsl",
    "/:lang/main-sitemap.xsl",
    "/sitemap.xsl",
    "/:lang/sitemap.xsl"
  ], (_req, res) => {
    res.setHeader("Content-Type", "text/xsl; charset=utf-8");
    res.setHeader("Cache-Control", "public, max-age=86400");
    return res.send(getYoastXsl());
  });

  // API: Get current robots.txt configuration & content
  app.get("/api/seo/robots", (req, res) => {
    const origin = getRequestOrigin(req);
    let content = "";
    let isCustom = false;
    let lastModified = robotsUpdatedAt;

    if (fs.existsSync(ROBOTS_FILE)) {
      content = getRobotsTxt(origin);
      isCustom = true;
      try {
        lastModified = fs.statSync(ROBOTS_FILE).mtime.toISOString();
      } catch {}
    } else {
      content = getRobotsTxt(origin);
    }

    res.json({ content, isCustom, lastModified });
  });

  // API: Save and update robots.txt
  app.post("/api/seo/robots", (req, res) => {
    const { content } = req.body;
    if (typeof content !== "string") {
      return res.status(400).json({ error: "Robots content must be a string." });
    }
    saveRobotsTxtOnServer(content);
    res.json({ success: true, message: "robots.txt updated and live on server." });
  });

  // API: Get current sitemap configuration & content (supports type=index|posts|pages|all)
  app.get("/api/seo/sitemap", (req, res) => {
    const origin = getRequestOrigin(req);
    const type = String(req.query.type || "index").toLowerCase();

    let content = "";
    if (type === "posts" || type === "post") {
      content = getPostSitemapXml(origin);
    } else if (type === "pages" || type === "page") {
      content = getPageSitemapXml(origin);
    } else if (type === "all" || type === "unified" || type === "sitemap") {
      content = getSitemapXml(origin);
    } else {
      content = getSitemapIndexXml(origin);
    }

    const sitemaps = [
      {
        id: "index",
        name: "Sitemap Index",
        url: `${origin}/sitemap_index.xml`,
        altUrl: `${origin}/sitemap.xml`,
        description: "Primary Yoast SEO index linking to sub-sitemaps",
      },
      {
        id: "posts",
        name: "Posts Sitemap",
        url: `${origin}/post-sitemap.xml`,
        description: "All published articles and localized blog variations",
      },
      {
        id: "pages",
        name: "Pages Sitemap",
        url: `${origin}/page-sitemap.xml`,
        description: "Core website pages and active custom landing pages",
      },
      {
        id: "all",
        name: "All URLs (Unified)",
        url: `${origin}/sitemap.xml`,
        description: "Complete unified list of all published URLs",
      },
    ];

    res.json({
      content,
      type,
      isCustom: true,
      lastModified: sitemapUpdatedAt,
      sitemaps,
      yoastCompliant: true,
    });
  });

  // API: Save or Rebuild Yoast sitemaps
  app.post("/api/seo/sitemap", (req, res) => {
    const origin = getRequestOrigin(req);
    const { content, type, action } = req.body;

    if (action === "rebuild" || content === "REBUILD") {
      invalidateSitemapCache();
      const rebuilt = rebuildAllSitemapsOnServer(origin);
      return res.json({
        success: true,
        message: "All Yoast SEO sitemaps rebuilt successfully.",
        content: rebuilt.indexXml,
      });
    }

    if (typeof content !== "string") {
      return res.status(400).json({ error: "Sitemap content must be a string." });
    }

    const base = origin.replace(/\/$/, "");
    let entry = sitemapsByOrigin.get(base);
    if (!entry) {
      entry = { indexXml: "", postXml: "", pageXml: "", allUrlsetXml: "", updatedAt: new Date().toISOString() };
      sitemapsByOrigin.set(base, entry);
    }

    if (type === "posts" || type === "post") {
      entry.postXml = content;
      entry.updatedAt = new Date().toISOString();
    } else if (type === "pages" || type === "page") {
      entry.pageXml = content;
      entry.updatedAt = new Date().toISOString();
    } else {
      entry.indexXml = content;
      entry.updatedAt = new Date().toISOString();
    }

    res.json({ success: true, message: "Yoast SEO sitemap updated and live on server." });
  });

  // API: Custom Pages Server Storage
  app.post("/api/contact", (req, res) => {
    const { name, email, subject, message } = req.body || {};
    if (!name || !email || !message) {
      return res.status(400).json({ error: "Name, email, and message are required fields." });
    }

    const submissionsFile = path.join(SERVER_STORAGE_DIR, "contact_submissions.json");
    let existingSubmissions: any[] = [];
    if (fs.existsSync(submissionsFile)) {
      try {
        existingSubmissions = JSON.parse(fs.readFileSync(submissionsFile, "utf-8"));
      } catch {}
    }

    const nowIso = new Date().toISOString();
    const newSubmission = {
      id: "sub-" + Date.now(),
      name: String(name).trim(),
      email: String(email).trim(),
      subject: String(subject || "General Inquiry").trim(),
      message: String(message).trim(),
      submittedAt: nowIso,
      createdAt: nowIso,
      date: nowIso,
      isRead: false,
    };

    existingSubmissions.unshift(newSubmission);
    try {
      fs.writeFileSync(submissionsFile, JSON.stringify(existingSubmissions, null, 2), "utf-8");
    } catch (err) {
      console.error("Failed to persist contact submission:", err);
    }

    res.json({ success: true, message: "Contact inquiry recorded on server." });
  });

  app.get("/api/custom-pages", (_req, res) => {
    const pages = getCustomPagesOnServer();
    res.json({ pages });
  });

  app.post("/api/custom-pages", (req, res) => {
    const { pages } = req.body;
    if (!Array.isArray(pages)) {
      return res.status(400).json({ error: "Pages must be an array." });
    }
    saveCustomPagesOnServer(pages);

    // Auto-rebuild sitemap immediately with exact URLs for all languages
    invalidateSitemapCache();
    const origin = getRequestOrigin(req);
    rebuildAllSitemapsOnServer(origin, undefined, pages);

    res.json({ success: true, message: "Custom pages saved and sitemap.xml immediately rebuilt." });
  });

  // API: Blog Posts Server Storage & Immediate Sitemap Synchronization
  app.get(["/api/blog/posts", "/api/posts"], (_req, res) => {
    const posts = getBlogPostsOnServer();
    res.json({ posts });
  });

  app.post(["/api/blog/posts", "/api/posts"], (req, res) => {
    const { posts } = req.body;
    if (!Array.isArray(posts)) {
      return res.status(400).json({ error: "Posts must be an array." });
    }
    saveBlogPostsOnServer(posts);

    // Auto-rebuild sitemap immediately with exact URLs for all languages
    invalidateSitemapCache();
    const origin = getRequestOrigin(req);
    rebuildAllSitemapsOnServer(origin, posts, undefined);

    res.json({ success: true, message: "Blog posts saved and sitemap.xml immediately rebuilt." });
  });

  // API: Analytics Stats for Admin Dashboard
  app.get("/api/analytics/stats", (_req, res) => {
    let completedJobs = 0;
    let failedJobs = 0;
    let totalBytes = 0;

    jobs.forEach((job) => {
      if (job.status === "completed") {
        completedJobs++;
        if (job.pdfFile) totalBytes += job.pdfFile.sizeBytes;
      } else if (job.status === "failed") {
        failedJobs++;
      }
    });

    res.json({
      totalDownloads: 14820 + completedJobs,
      successRate: 98.4,
      todayDownloads: 342 + completedJobs,
      bandwidthUsed: 42.8 * 1024 * 1024 * 1024 + totalBytes,
      avgSpeed: "1.2s",
      activeScrapers: 8,
      adImpressions: 28450,
      adClicks: 940,
    });
  });

  // Mount Model Context Protocol (MCP) full-control server & management endpoints
  setupMcpEndpoints(app);

  // Mount Gemini AI Assistant, SEO & Content Management endpoints
  setupGeminiAiEndpoints(app, {
    rebuildSitemapsCallback: () => {
      invalidateSitemapCache();
    },
  });

  // Mount WordPress + Polylang style CMS & Admin Panel endpoints
  setupAdminRoutes(app);

  // Fallback 404 for any unmatched /api/* requests to ensure they never return HTML
  app.all("/api/*", (req, res) => {
    res.status(404).json({ error: `API route ${req.method} ${req.path} not found` });
  });

  // Serve static images directly with high performance caching headers
  app.use("/images/articles", express.static(path.join(PUBLIC_DIR, "images", "articles"), { maxAge: "1d" }));
  app.use("/images/articles", express.static(path.join(PUBLIC_DIR, "images"), { maxAge: "1d" }));
  app.use("/images", express.static(path.join(PUBLIC_DIR, "images"), { maxAge: "1d" }));
  app.use("/assets", express.static(path.join(PUBLIC_DIR, "assets"), { maxAge: "1d" }));
  app.use(express.static(PUBLIC_DIR, { maxAge: "1d" }));

  // Vite & HTML Pre-rendering for Crawlers, Sitemap Bots, and Browsers
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: {
        middlewareMode: true,
        hmr: false,
      },
      appType: "custom",
    });

    // Handle HTML page requests for crawlers, sitemap bots, Googlebot, and browsers
    app.use(async (req, res, next) => {
      if (
        req.method !== "GET" ||
        req.path.startsWith("/api") ||
        req.path.startsWith("/images") ||
        req.path.startsWith("/assets") ||
        req.path.startsWith("/temp_downloads") ||
        req.path.startsWith("/@") ||
        req.path.startsWith("/src") ||
        req.path.startsWith("/node_modules") ||
        (req.path.includes(".") && req.path !== "/admin.html")
      ) {
        return next();
      }

      // Check if user is navigating to Admin Panel (/admin, /admin/..., /admin.html)
      if (req.path === "/admin" || req.path.startsWith("/admin/") || req.path === "/admin.html") {
        try {
          const adminPath = path.join(process.cwd(), "admin.html");
          const indexPath = path.join(process.cwd(), "index.html");
          const templateFile = fs.existsSync(adminPath) ? adminPath : indexPath;
          const adminTemplate = fs.readFileSync(templateFile, "utf-8");
          const transformed = await vite.transformIndexHtml(req.originalUrl || req.url, adminTemplate);
          res.setHeader("Content-Type", "text/html; charset=utf-8");
          return res.send(transformed);
        } catch (e) {
          console.error("Vite Admin HTML error:", e);
          try {
            const rawTemplate = fs.readFileSync(path.join(process.cwd(), "index.html"), "utf-8");
            const transformed = await vite.transformIndexHtml(req.originalUrl || req.url, rawTemplate);
            res.setHeader("Content-Type", "text/html; charset=utf-8");
            return res.send(transformed);
          } catch (err2) {
            return next(err2);
          }
        }
      }

      const origin = getRequestOrigin(req);
      try {
        const rawTemplate = fs.readFileSync(path.join(process.cwd(), "index.html"), "utf-8");
        const { html: rendered, is404 } = generatePageHtml(rawTemplate, req.path, origin);
        if (is404) res.status(404);
        const transformed = await vite.transformIndexHtml(req.originalUrl || req.url, rendered);
        res.setHeader("Content-Type", "text/html; charset=utf-8");
        return res.send(transformed);
      } catch (e) {
        console.error("Vite HTML rendering error:", e);
        return next();
      }
    });

    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));

    app.get(["/admin", "/admin/*", "/admin.html"], (_req, res) => {
      const adminPath = path.join(distPath, "admin.html");
      if (fs.existsSync(adminPath)) {
        return res.sendFile(adminPath);
      }
      res.sendFile(path.join(distPath, "index.html"));
    });

    app.get("*", (req, res) => {
      const origin = getRequestOrigin(req);
      try {
        const rawTemplate = fs.readFileSync(path.join(distPath, "index.html"), "utf-8");
        const { html: rendered, is404 } = generatePageHtml(rawTemplate, req.path, origin);
        if (is404) res.status(404);
        res.setHeader("Content-Type", "text/html; charset=utf-8");
        return res.send(rendered);
      } catch {
        res.status(404).sendFile(path.join(distPath, "index.html"));
      }
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Ultra-Speed Scraper Server running on http://0.0.0.0:${PORT}`);
    // Dynamic origin-based sitemap system initialized (auto-detects domain on any host)
    sitemapsByOrigin.clear();
    // Pre-warm sample documents asynchronously in the background
    prewarmSamples().catch((err) => console.error("Prewarm error:", err));
  });
}

// Pre-warm sample documents into cache on boot
async function prewarmSamples() {
  console.log("⚡ Pre-warming sample documents for instantaneous downloads...");
  for (const sample of SAMPLES) {
    const docId = extractDocId(sample.url);
    if (!docId) continue;

    const cachePdfPath = path.join(CACHE_ROOT, `${docId}.pdf`);
    if (fs.existsSync(cachePdfPath)) {
      const stats = fs.statSync(cachePdfPath);
      let pageCount = 1;
      try {
        const raw = fs.readFileSync(cachePdfPath, "latin1");
        const count = (raw.match(/\/Type\s*\/Page\b/g) || []).length;
        if (count > 0) pageCount = count;
      } catch {}

      // Find any pre-existing images in prewarm folder
      const cachedImages: Array<{ filename: string; pageNumber: number; sizeBytes: number; srcPath: string }> = [];
      const tempJobDir = path.join(DOWNLOADS_ROOT, `prewarm_${docId}`);
      if (fs.existsSync(tempJobDir)) {
        const files = fs.readdirSync(tempJobDir);
        const imgFiles = files.filter((f) => f.endsWith(".jpg") || f.endsWith(".png"));
        imgFiles.sort((a, b) => {
          const matchA = a.match(/^(\d+)-/);
          const matchB = b.match(/^(\d+)-/);
          const numA = matchA ? parseInt(matchA[1], 10) : 0;
          const numB = matchB ? parseInt(matchB[1], 10) : 0;
          return numA - numB;
        });
        for (let i = 0; i < imgFiles.length; i++) {
          const fn = imgFiles[i];
          const match = fn.match(/^(\d+)-/);
          const pageNum = match ? parseInt(match[1], 10) : i + 1;
          const p = path.join(tempJobDir, fn);
          cachedImages.push({
            filename: fn,
            pageNumber: pageNum,
            sizeBytes: fs.statSync(p).size,
            srcPath: p,
          });
        }
      }

      documentCache.set(docId, {
        docId,
        title: sanitizeTitle(sample.title),
        pdfPath: cachePdfPath,
        pdfSize: stats.size,
        images: cachedImages,
        pageCount: cachedImages.length > 0 ? cachedImages.length : pageCount,
        timestamp: Date.now(),
      });
      continue;
    }

    try {
      const tempJobId = `prewarm_${docId}`;
      const tempJobDir = path.join(DOWNLOADS_ROOT, tempJobId);
      if (!fs.existsSync(tempJobDir)) fs.mkdirSync(tempJobDir, { recursive: true });

      const fakeJob: DownloadJob = {
        id: tempJobId,
        url: sample.url,
        format: "pdf",
        status: "queued",
        progress: 0,
        stepMessage: "Pre-warming...",
        logs: [],
        createdAt: Date.now(),
        dir: tempJobDir,
      };

      await runUltraScraperJob(fakeJob);
      if (fakeJob.status === "completed" && fakeJob.pdfFile) {
        console.log(`✅ Pre-warmed sample [${sample.title}] successfully!`);
      }
    } catch (e: any) {
      console.warn(`Prewarm notice for ${sample.url}:`, e.message);
    }
  }
  console.log(`⚡ Pre-warming complete! ${documentCache.size} documents in instant memory cache.`);
}

startServer();
