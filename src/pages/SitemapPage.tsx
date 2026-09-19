import React, { useState, useEffect, useMemo } from "react";
import {
  Network,
  ExternalLink,
  Copy,
  Check,
  Download,
  RefreshCw,
  Search,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  Globe,
  FileCode,
  Table as TableIcon,
  Code as CodeIcon,
} from "lucide-react";
import { PageRoute, BlogPost, CustomPage, SupportedLanguage } from "../types";
import { BLOG_POSTS } from "../data/blogData";

interface SitemapPageProps {
  onNavigate: (page: PageRoute) => void;
  onSelectPost?: (post: BlogPost) => void;
  allCustomPages?: CustomPage[];
  currentLang?: SupportedLanguage;
}

interface ParsedUrlItem {
  url: string;
  images: number;
  lastmod: string;
  priority?: string;
}

interface ParsedSitemapItem {
  url: string;
  lastmod: string;
}

type SitemapTab = "posts" | "pages" | "all" | "index";
type ViewMode = "table" | "xml";

export function SitemapPage({ onNavigate, allCustomPages = [] }: SitemapPageProps) {
  const getInitialTab = (): SitemapTab => {
    if (typeof window !== "undefined") {
      const p = window.location.pathname.toLowerCase();
      if (p.includes("page-sitemap")) return "pages";
      if (p.includes("post-sitemap")) return "posts";
      if (p.includes("sitemap_index")) return "index";
      if (p.includes("sitemap.xml") || p.includes("sitemap")) return "all";
    }
    return "all";
  };

  const [activeTab, setActiveTab] = useState<SitemapTab>(getInitialTab);
  const [viewMode, setViewMode] = useState<ViewMode>("table");
  const [filterQuery, setFilterQuery] = useState("");
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState<number | "all">(100);
  const [lastUpdated, setLastUpdated] = useState<string>("");

  const [rawXml, setRawXml] = useState("");
  const [urlItems, setUrlItems] = useState<ParsedUrlItem[]>([]);
  const [sitemapItems, setSitemapItems] = useState<ParsedSitemapItem[]>([]);

  // Format date to: YYYY-MM-DD HH:mm +00:00
  const formatSitemapDate = (dateStr?: string) => {
    if (!dateStr) {
      const now = new Date();
      const pad = (n: number) => String(n).padStart(2, "0");
      return `${now.getUTCFullYear()}-${pad(now.getUTCMonth() + 1)}-${pad(now.getUTCDate())} ${pad(now.getUTCHours())}:${pad(now.getUTCMinutes())} +00:00`;
    }
    const clean = dateStr.trim();
    if (clean.includes("T")) {
      const datePart = clean.substring(0, 10);
      const timePart = clean.substring(11, 16) || "00:00";
      return `${datePart} ${timePart} +00:00`;
    }
    if (clean.length === 10) {
      return `${clean} 00:00 +00:00`;
    }
    return clean;
  };

  // Helper to parse XML content into item structures
  const parseXml = (xml: string) => {
    const urls: ParsedUrlItem[] = [];
    const sitemaps: ParsedSitemapItem[] = [];

    try {
      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(xml, "application/xml");

      // Check if sitemapindex
      const sitemapNodes = xmlDoc.querySelectorAll("sitemap");
      if (sitemapNodes.length > 0) {
        sitemapNodes.forEach((node) => {
          const loc = node.querySelector("loc")?.textContent || "";
          const lastmod = node.querySelector("lastmod")?.textContent || "";
          if (loc) {
            sitemaps.push({
              url: loc.trim(),
              lastmod: formatSitemapDate(lastmod),
            });
          }
        });
      }

      // Check if urlset
      const urlNodes = xmlDoc.querySelectorAll("url");
      if (urlNodes.length > 0) {
        urlNodes.forEach((node) => {
          const loc = node.querySelector("loc")?.textContent || "";
          const lastmod = node.querySelector("lastmod")?.textContent || "";
          const imageCount = node.querySelectorAll("image\\:image, image").length;
          const priority = node.querySelector("priority")?.textContent || "0.80";

          if (loc) {
            urls.push({
              url: loc.trim(),
              images: imageCount,
              lastmod: formatSitemapDate(lastmod),
              priority,
            });
          }
        });
      }
    } catch {
      // Fallback regex parser if DOMParser fails
      const urlMatches = [...xml.matchAll(/<url>[\s\S]*?<loc>(.*?)<\/loc>[\s\S]*?(?:<lastmod>(.*?)<\/lastmod>)?[\s\S]*?<\/url>/g)];
      for (const match of urlMatches) {
        const loc = match[1]?.trim();
        const lastmod = match[2]?.trim();
        const hasImg = match[0].includes("<image:image>");
        if (loc) {
          urls.push({
            url: loc,
            images: hasImg ? 1 : 0,
            lastmod: formatSitemapDate(lastmod),
          });
        }
      }
    }

    return { urls, sitemaps };
  };

  // Build local fallback if fetch is delayed
  const buildLocalFallback = (tab: SitemapTab) => {
    const origin = typeof window !== "undefined" ? window.location.origin : "";
    const now = formatSitemapDate();

    if (tab === "index") {
      return {
        xml: `<?xml version="1.0" encoding="UTF-8"?><sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"><sitemap><loc>${origin}/page-sitemap.xml</loc><lastmod>${now}</lastmod></sitemap><sitemap><loc>${origin}/post-sitemap.xml</loc><lastmod>${now}</lastmod></sitemap></sitemapindex>`,
        sitemaps: [
          { url: `${origin}/page-sitemap.xml`, lastmod: now },
          { url: `${origin}/post-sitemap.xml`, lastmod: now },
        ],
        urls: [],
      };
    }

    const languages = ["en", "br", "es", "fr", "de", "id"];
    const fallbackUrls: ParsedUrlItem[] = [];

    if (tab === "posts" || tab === "all") {
      BLOG_POSTS.forEach((post) => {
        languages.forEach((l) => {
          fallbackUrls.push({
            url: `${origin}/${l}/blog/${post.slug}`,
            images: 1,
            lastmod: formatSitemapDate(post.date),
          });
        });
      });
    }

    if (tab === "pages" || tab === "all") {
      const core = ["", "how-it-works", "blog", "about", "contact", "privacy", "terms", "sitemap"];
      languages.forEach((l) => {
        core.forEach((c) => {
          fallbackUrls.push({
            url: `${origin}/${l}${c ? "/" + c : ""}`,
            images: 0,
            lastmod: now,
          });
        });
      });

      // Filter out any custom pages with deleted blog prefixes
      const allowedCustomPages = allCustomPages.filter((cp) => !cp.slug.startsWith("blog/"));
      allowedCustomPages.forEach((cp) => {
        const lang = cp.language || "en";
        fallbackUrls.push({
          url: `${origin}/${lang}/${cp.slug}`,
          images: 1,
          lastmod: formatSitemapDate(cp.lastModified),
        });
      });
    }

    return {
      xml: `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${fallbackUrls.map((u) => `<url><loc>${u.url}</loc><lastmod>${u.lastmod}</lastmod></url>`).join("")}</urlset>`,
      urls: fallbackUrls,
      sitemaps: [],
    };
  };

  const fetchSitemap = async (tab: SitemapTab) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/seo/sitemap?type=${tab}`, { cache: "no-store" });
      if (!res.ok) throw new Error("API error");
      const data = await res.json();
      const content = data.content || "";
      setRawXml(content);
      setLastUpdated(new Date().toLocaleTimeString());

      const parsed = parseXml(content);
      if (tab === "index") {
        setSitemapItems(parsed.sitemaps);
        setUrlItems([]);
      } else {
        setUrlItems(parsed.urls);
        setSitemapItems([]);
      }
    } catch {
      const fallback = buildLocalFallback(tab);
      setRawXml(fallback.xml);
      setUrlItems(fallback.urls);
      setSitemapItems(fallback.sitemaps);
      setLastUpdated(new Date().toLocaleTimeString());
    } finally {
      setLoading(false);
      setCurrentPage(1);
    }
  };

  useEffect(() => {
    fetchSitemap(activeTab);
  }, [activeTab]);

  const handleCopy = () => {
    if (!rawXml) return;
    navigator.clipboard.writeText(rawXml);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const currentXmlFilename =
    activeTab === "index"
      ? "sitemap_index.xml"
      : activeTab === "posts"
      ? "post-sitemap.xml"
      : activeTab === "pages"
      ? "page-sitemap.xml"
      : "sitemap.xml";

  const currentXmlPath = "/" + currentXmlFilename;

  const handleDownload = () => {
    const blob = new Blob([rawXml], { type: "application/xml;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = currentXmlFilename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const filteredUrls = useMemo(() => {
    if (!filterQuery.trim()) return urlItems;
    const q = filterQuery.toLowerCase().trim();
    return urlItems.filter((item) => item.url.toLowerCase().includes(q));
  }, [urlItems, filterQuery]);

  const filteredSitemaps = useMemo(() => {
    if (!filterQuery.trim()) return sitemapItems;
    const q = filterQuery.toLowerCase().trim();
    return sitemapItems.filter((item) => item.url.toLowerCase().includes(q));
  }, [sitemapItems, filterQuery]);

  const totalCount = activeTab === "index" ? filteredSitemaps.length : filteredUrls.length;
  const currentLimit = pageSize === "all" ? totalCount : pageSize;
  const totalPages = Math.max(1, Math.ceil(totalCount / (typeof currentLimit === "number" ? currentLimit : 1)));

  const paginatedUrls = useMemo(() => {
    if (pageSize === "all") return filteredUrls;
    const start = (currentPage - 1) * pageSize;
    return filteredUrls.slice(start, start + pageSize);
  }, [filteredUrls, currentPage, pageSize]);

  // Split raw XML lines for XML view
  const rawXmlLines = useMemo(() => rawXml.split("\n"), [rawXml]);

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-800 font-sans py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Breadcrumb Navigation - same style as robots.txt */}
        <nav aria-label="Breadcrumb" className="text-xs sm:text-sm text-slate-500 flex items-center gap-1.5">
          <button
            onClick={() => onNavigate("home")}
            className="hover:underline text-indigo-600 font-medium"
          >
            Home
          </button>
          <span>/</span>
          <button
            onClick={() => onNavigate("robots")}
            className="hover:underline text-indigo-600 font-medium"
          >
            robots.txt
          </button>
          <span>/</span>
          <span className="text-slate-800 font-semibold">{currentXmlFilename}</span>
        </nav>

        {/* Header Card - same styling as robots.txt */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-sm">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-6 border-b border-slate-100">
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 shrink-0">
                <Network className="w-6 h-6" />
              </div>
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900">
                    {currentXmlFilename}
                  </h1>
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider bg-emerald-50 text-emerald-700 border border-emerald-200">
                    Active &amp; Indexed
                  </span>
                </div>
                <p className="text-sm text-slate-500 mt-1">
                  XML Sitemap Specification for Google, Bing &amp; Global Search Engine Crawlers
                </p>
              </div>
            </div>

            {/* Quick Actions - same buttons as robots.txt */}
            <div className="flex flex-wrap items-center gap-2">
              {/* View Mode Toggle: Table vs XML Source */}
              <div className="bg-slate-100 p-0.5 rounded-lg flex items-center mr-1">
                <button
                  type="button"
                  onClick={() => setViewMode("table")}
                  className={`px-3 py-1.5 rounded-md text-xs font-semibold flex items-center gap-1.5 transition ${
                    viewMode === "table"
                      ? "bg-white text-slate-900 shadow-xs"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                  title="Switch to Interactive Table View"
                >
                  <TableIcon className="w-3.5 h-3.5" />
                  <span>Table</span>
                </button>
                <button
                  type="button"
                  onClick={() => setViewMode("xml")}
                  className={`px-3 py-1.5 rounded-md text-xs font-semibold flex items-center gap-1.5 transition ${
                    viewMode === "xml"
                      ? "bg-white text-slate-900 shadow-xs"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                  title="Switch to Raw XML Terminal View"
                >
                  <CodeIcon className="w-3.5 h-3.5" />
                  <span>XML Source</span>
                </button>
              </div>

              <a
                href={currentXmlPath}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold rounded-lg inline-flex items-center gap-1.5 transition"
                title="Open raw XML file served directly with XSL stylesheet"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span>Raw XML</span>
              </a>

              <button
                type="button"
                onClick={handleCopy}
                className="px-3.5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-lg inline-flex items-center gap-1.5 transition shadow-sm"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-white" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? "Copied!" : "Copy"}</span>
              </button>

              <button
                type="button"
                onClick={handleDownload}
                className="px-3 py-2 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 text-xs font-semibold rounded-lg inline-flex items-center gap-1.5 transition"
                title={`Download ${currentXmlFilename}`}
              >
                <Download className="w-3.5 h-3.5 text-slate-500" />
                <span>Download</span>
              </button>

              <button
                type="button"
                onClick={() => fetchSitemap(activeTab)}
                disabled={loading}
                className="p-2 text-slate-500 hover:text-slate-800 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition"
                title="Refresh from server"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
              </button>
            </div>
          </div>

          {/* Description & Reference row */}
          <div className="mt-4 grid sm:grid-cols-2 gap-4 text-xs sm:text-sm text-slate-600">
            <div className="flex items-start gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span>
                Standard XML sitemap protocol with Yoast XSL styling. Includes real URLs, canonical hreflang language partitions, and last modified timestamps.
              </span>
            </div>
            <div className="flex items-start gap-2">
              <Globe className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
              <span>
                Crawlers index these exact URLs. Direct robots directives can be inspected in the{" "}
                <button
                  onClick={() => onNavigate("robots")}
                  className="text-indigo-600 font-semibold hover:underline"
                >
                  robots.txt viewer
                </button>.
              </span>
            </div>
          </div>

          {/* Sitemap Partition Tabs */}
          <div className="mt-6 pt-5 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-2 text-xs font-semibold">
              <button
                type="button"
                onClick={() => setActiveTab("all")}
                className={`px-3.5 py-1.5 rounded-lg transition ${
                  activeTab === "all"
                    ? "bg-indigo-600 text-white shadow-xs"
                    : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                }`}
              >
                sitemap.xml ({activeTab === "all" ? totalCount : "All URLs"})
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("posts")}
                className={`px-3.5 py-1.5 rounded-lg transition ${
                  activeTab === "posts"
                    ? "bg-indigo-600 text-white shadow-xs"
                    : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                }`}
              >
                post-sitemap.xml ({activeTab === "posts" ? totalCount : "Posts"})
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("pages")}
                className={`px-3.5 py-1.5 rounded-lg transition ${
                  activeTab === "pages"
                    ? "bg-indigo-600 text-white shadow-xs"
                    : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                }`}
              >
                page-sitemap.xml ({activeTab === "pages" ? totalCount : "Pages"})
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("index")}
                className={`px-3.5 py-1.5 rounded-lg transition ${
                  activeTab === "index"
                    ? "bg-indigo-600 text-white shadow-xs"
                    : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                }`}
              >
                sitemap_index.xml (Index)
              </button>
            </div>

            <div className="text-xs text-slate-500 font-medium">
              Contains <strong className="text-slate-900 font-bold">{totalCount}</strong>{" "}
              {activeTab === "index" ? "sitemaps" : "URLs"}
              {loading && <span className="text-indigo-600 font-medium ml-2 animate-pulse">(Updating...)</span>}
            </div>
          </div>
        </div>

        {/* Content Section: Dark Terminal Look (identical to robots.txt) OR Interactive Table */}
        {viewMode === "xml" ? (
          /* RAW XML TERMINAL VIEW - EXACT MATCH TO ROBOTS.TXT LOOK */
          <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-md">
            <div className="bg-slate-950 px-4 sm:px-6 py-3 border-b border-slate-800 flex items-center justify-between text-xs text-slate-400">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block animate-pulse"></span>
                <span className="font-mono text-slate-300 font-semibold">{currentXmlPath}</span>
                <span className="text-slate-600">•</span>
                <span>Content-Type: application/xml; charset=utf-8</span>
              </div>
              {lastUpdated && <span>Fetched: {lastUpdated}</span>}
            </div>

            <div className="p-4 sm:p-6 font-mono text-xs sm:text-sm leading-relaxed overflow-x-auto max-h-[700px] overflow-y-auto">
              {loading ? (
                <div className="flex items-center justify-center py-16 text-slate-400">
                  <RefreshCw className="w-5 h-5 animate-spin mr-2" />
                  Loading live XML sitemap from server...
                </div>
              ) : (
                <table className="w-full border-collapse">
                  <tbody>
                    {rawXmlLines.map((line, idx) => {
                      const trimmed = line.trim();
                      const isTag = trimmed.startsWith("<");
                      const isLoc = trimmed.startsWith("<loc>");
                      const isLastmod = trimmed.startsWith("<lastmod>");

                      return (
                        <tr key={idx} className="hover:bg-slate-800/40">
                          <td className="pr-4 py-0.5 text-right select-none text-slate-600 w-12 text-[11px]">
                            {idx + 1}
                          </td>
                          <td className="py-0.5 pl-2 font-mono whitespace-pre text-slate-300">
                            {isLoc ? (
                              <span>
                                <span className="text-indigo-400">&lt;loc&gt;</span>
                                <span className="text-emerald-300">
                                  {trimmed.replace("<loc>", "").replace("</loc>", "")}
                                </span>
                                <span className="text-indigo-400">&lt;/loc&gt;</span>
                              </span>
                            ) : isLastmod ? (
                              <span>
                                <span className="text-cyan-400">&lt;lastmod&gt;</span>
                                <span className="text-amber-300">
                                  {trimmed.replace("<lastmod>", "").replace("</lastmod>", "")}
                                </span>
                                <span className="text-cyan-400">&lt;/lastmod&gt;</span>
                              </span>
                            ) : isTag ? (
                              <span className="text-sky-300">{line}</span>
                            ) : (
                              <span className="text-slate-300">{line}</span>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        ) : (
          /* INTERACTIVE TABLE VIEW - ENHANCED SLATE CARD MATCHING ROBOTS.TXT PALETTE */
          <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
            {/* Table Control Header */}
            <div className="p-4 sm:p-5 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-50/70">
              <div className="relative w-full sm:w-80">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={filterQuery}
                  onChange={(e) => {
                    setFilterQuery(e.target.value);
                    setCurrentPage(1);
                  }}
                  placeholder="Filter URLs or paths..."
                  className="w-full pl-9 pr-3 py-1.5 bg-white border border-slate-300 rounded-lg text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                />
              </div>

              <div className="flex items-center gap-2 text-xs text-slate-600 self-end sm:self-auto">
                <span>Rows per page:</span>
                <select
                  value={pageSize}
                  onChange={(e) => {
                    const val = e.target.value;
                    setPageSize(val === "all" ? "all" : Number(val));
                    setCurrentPage(1);
                  }}
                  className="bg-white border border-slate-300 rounded-md px-2 py-1 text-xs text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20"
                >
                  <option value={50}>50</option>
                  <option value={100}>100</option>
                  <option value={250}>250</option>
                  <option value="all">All ({totalCount})</option>
                </select>
              </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              {activeTab === "index" ? (
                <table className="w-full border-collapse text-xs sm:text-sm text-left">
                  <thead>
                    <tr className="bg-slate-100/70 border-b border-slate-200 text-slate-700 font-semibold text-xs uppercase tracking-wider">
                      <th className="py-3 px-4 font-semibold text-left">Sitemap Resource</th>
                      <th className="py-3 px-4 font-semibold text-left w-[240px] whitespace-nowrap">Last Modified</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredSitemaps.map((item, idx) => (
                      <tr key={item.url} className="hover:bg-indigo-50/40 transition-colors">
                        <td className="py-3 px-4 font-mono text-xs text-slate-800 break-all">
                          <button
                            type="button"
                            onClick={() => {
                              if (item.url.includes("post-sitemap")) setActiveTab("posts");
                              else if (item.url.includes("page-sitemap")) setActiveTab("pages");
                              else setActiveTab("all");
                            }}
                            className="text-indigo-600 hover:underline font-medium text-left"
                          >
                            {item.url}
                          </button>
                        </td>
                        <td className="py-3 px-4 text-slate-500 font-mono text-xs whitespace-nowrap">
                          {item.lastmod}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <table className="w-full border-collapse text-xs sm:text-sm text-left">
                  <thead>
                    <tr className="bg-slate-100/70 border-b border-slate-200 text-slate-700 font-semibold text-xs uppercase tracking-wider">
                      <th className="py-3 px-4 font-semibold text-left">URL</th>
                      <th className="py-3 px-4 font-semibold text-center w-[90px] whitespace-nowrap">Images</th>
                      <th className="py-3 px-4 font-semibold text-left w-[220px] whitespace-nowrap">Last Modified</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {paginatedUrls.map((item, idx) => (
                      <tr key={`${item.url}-${idx}`} className="hover:bg-indigo-50/40 transition-colors">
                        <td className="py-3 px-4 font-mono text-xs text-slate-800 break-all">
                          <a
                            href={item.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-slate-800 hover:text-indigo-600 hover:underline font-medium"
                          >
                            {item.url}
                          </a>
                        </td>
                        <td className="py-3 px-4 text-center text-slate-600 font-medium">
                          {item.images > 0 ? (
                            <span className="inline-flex items-center justify-center px-2 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                              {item.images}
                            </span>
                          ) : (
                            <span className="text-slate-400">0</span>
                          )}
                        </td>
                        <td className="py-3 px-4 text-slate-500 font-mono text-xs whitespace-nowrap">
                          {item.lastmod}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>

            {/* Pagination Controls */}
            {pageSize !== "all" && totalPages > 1 && (
              <div className="p-4 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-600 bg-slate-50/50">
                <div>
                  Showing page <strong className="text-slate-900 font-semibold">{currentPage}</strong> of{" "}
                  <strong className="text-slate-900 font-semibold">{totalPages}</strong> ({totalCount} total URLs)
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    disabled={currentPage <= 1}
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    className="px-2.5 py-1.5 border border-slate-200 rounded-lg bg-white hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed inline-flex items-center gap-1 text-slate-700 font-medium transition"
                  >
                    <ChevronLeft className="w-3.5 h-3.5" />
                    <span>Prev</span>
                  </button>
                  <span className="px-3 py-1 font-semibold text-slate-800">
                    {currentPage} / {totalPages}
                  </span>
                  <button
                    type="button"
                    disabled={currentPage >= totalPages}
                    onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                    className="px-2.5 py-1.5 border border-slate-200 rounded-lg bg-white hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed inline-flex items-center gap-1 text-slate-700 font-medium transition"
                  >
                    <span>Next</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Informative Footer Links - exact match to robots.txt footer card */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-600 shadow-sm">
          <div className="flex items-center gap-2">
            <FileCode className="w-4 h-4 text-slate-400" />
            <span>
              Direct resources:{" "}
              <a href="/robots.txt" className="text-indigo-600 font-medium hover:underline">/robots.txt</a> •{" "}
              <a href="/sitemap.xml" className="text-indigo-600 font-medium hover:underline">/sitemap.xml</a> •{" "}
              <a href="/post-sitemap.xml" className="text-indigo-600 font-medium hover:underline">/post-sitemap.xml</a> •{" "}
              <a href="/page-sitemap.xml" className="text-indigo-600 font-medium hover:underline">/page-sitemap.xml</a>
            </span>
          </div>

          <button
            onClick={() => onNavigate("robots")}
            className="px-3.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-lg transition"
          >
            Switch to robots.txt Directives &rarr;
          </button>
        </div>
      </div>
    </div>
  );
}
