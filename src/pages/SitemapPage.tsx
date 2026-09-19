import React, { useState, useEffect, useMemo } from "react";
import { Copy, Check, Download, ExternalLink, Search, RefreshCw, ChevronLeft, ChevronRight } from "lucide-react";
import { PageRoute, BlogPost, CustomPage, SupportedLanguage } from "../types";
import { BLOG_POSTS } from "../data/blogData";

interface SitemapPageProps {
  onNavigate: (page: PageRoute) => void;
  onSelectPost: (post: BlogPost) => void;
  allCustomPages?: CustomPage[];
  currentLang?: SupportedLanguage;
}

interface ParsedUrlItem {
  url: string;
  images: number;
  lastmod: string;
  priority?: string;
  type?: string;
}

interface ParsedSitemapItem {
  url: string;
  lastmod: string;
}

type SitemapTab = "posts" | "pages" | "all" | "index";

export function SitemapPage({ onNavigate, onSelectPost, allCustomPages = [] }: SitemapPageProps) {
  const [activeTab, setActiveTab] = useState<SitemapTab>("posts");
  const [filterQuery, setFilterQuery] = useState("");
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState<number | "all">(100);

  const [rawXml, setRawXml] = useState("");
  const [urlItems, setUrlItems] = useState<ParsedUrlItem[]>([]);
  const [sitemapItems, setSitemapItems] = useState<ParsedSitemapItem[]>([]);

  // Format date to: YYYY-MM-DD HH:mm +00:00 (matching exact visual screenshot)
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
    const origin = window.location.origin;
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

      allCustomPages.forEach((cp) => {
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
      const res = await fetch(`/api/seo/sitemap?type=${tab}`);
      if (!res.ok) throw new Error("API error");
      const data = await res.json();
      const content = data.content || "";
      setRawXml(content);

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
    } finally {
      setLoading(false);
      setCurrentPage(1);
    }
  };

  useEffect(() => {
    fetchSitemap(activeTab);
  }, [activeTab]);

  const handleCopyXml = () => {
    navigator.clipboard.writeText(rawXml);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadXml = () => {
    const filename =
      activeTab === "index"
        ? "sitemap_index.xml"
        : activeTab === "posts"
        ? "post-sitemap.xml"
        : activeTab === "pages"
        ? "page-sitemap.xml"
        : "sitemap.xml";

    const blob = new Blob([rawXml], { type: "application/xml" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
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

  // Pagination calculation
  const totalCount = activeTab === "index" ? filteredSitemaps.length : filteredUrls.length;
  const currentLimit = pageSize === "all" ? totalCount : pageSize;
  const totalPages = Math.max(1, Math.ceil(totalCount / (typeof currentLimit === "number" ? currentLimit : 1)));

  const paginatedUrls = useMemo(() => {
    if (pageSize === "all") return filteredUrls;
    const start = (currentPage - 1) * pageSize;
    return filteredUrls.slice(start, start + pageSize);
  }, [filteredUrls, currentPage, pageSize]);

  // Current XML endpoint URL for direct browser viewing
  const currentXmlPath =
    activeTab === "index"
      ? "/sitemap_index.xml"
      : activeTab === "posts"
      ? "/post-sitemap.xml"
      : activeTab === "pages"
      ? "/page-sitemap.xml"
      : "/sitemap.xml";

  return (
    <div className="bg-white min-h-screen text-[#222222] font-sans antialiased py-6 sm:py-10">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-8 space-y-4">
        {/* Yoast SEO Style Header */}
        <div className="border-b border-[#e5e7eb] pb-4">
          <h1 className="text-2xl sm:text-3xl font-bold text-[#111111] tracking-tight mb-1">
            XML Sitemap
          </h1>
          <p className="text-[13px] text-[#555555] leading-relaxed">
            Generated by <strong className="text-[#111111] font-semibold">Yoast SEO</strong>, this is an XML Sitemap, meant for consumption by search engines.
            <br />
            You can find more information about XML sitemaps on{" "}
            <a
              href="https://sitemaps.org"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#111111] font-semibold underline hover:text-indigo-600"
            >
              sitemaps.org
            </a>.
          </p>
        </div>

        {/* Sitemap Partition Tabs & Controls */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pt-1">
          {/* Tabs */}
          <div className="flex flex-wrap items-center gap-1.5 text-xs font-semibold">
            <button
              type="button"
              onClick={() => setActiveTab("posts")}
              className={`px-3 py-1.5 rounded transition ${
                activeTab === "posts"
                  ? "bg-[#222222] text-white"
                  : "bg-[#f1f1f1] text-[#333333] hover:bg-[#e4e4e4]"
              }`}
            >
              post-sitemap.xml ({activeTab === "posts" ? totalCount : "Posts"})
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("pages")}
              className={`px-3 py-1.5 rounded transition ${
                activeTab === "pages"
                  ? "bg-[#222222] text-white"
                  : "bg-[#f1f1f1] text-[#333333] hover:bg-[#e4e4e4]"
              }`}
            >
              page-sitemap.xml ({activeTab === "pages" ? totalCount : "Pages"})
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("index")}
              className={`px-3 py-1.5 rounded transition ${
                activeTab === "index"
                  ? "bg-[#222222] text-white"
                  : "bg-[#f1f1f1] text-[#333333] hover:bg-[#e4e4e4]"
              }`}
            >
              sitemap_index.xml (Index)
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("all")}
              className={`px-3 py-1.5 rounded transition ${
                activeTab === "all"
                  ? "bg-[#222222] text-white"
                  : "bg-[#f1f1f1] text-[#333333] hover:bg-[#e4e4e4]"
              }`}
            >
              sitemap.xml (All URLs)
            </button>
          </div>

          {/* Quick Actions */}
          <div className="flex items-center gap-2 text-xs">
            <a
              href={currentXmlPath}
              target="_blank"
              rel="noopener noreferrer"
              className="px-2.5 py-1.5 bg-[#f1f1f1] hover:bg-[#e4e4e4] text-[#222222] rounded inline-flex items-center gap-1 font-medium transition"
              title="Open the real XML file formatted with XSL stylesheet"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Raw XML</span>
            </a>
            <button
              type="button"
              onClick={handleCopyXml}
              className="px-2.5 py-1.5 bg-[#f1f1f1] hover:bg-[#e4e4e4] text-[#222222] rounded inline-flex items-center gap-1 font-medium transition"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? "Copied" : "Copy"}</span>
            </button>
            <button
              type="button"
              onClick={handleDownloadXml}
              className="px-2.5 py-1.5 bg-[#f1f1f1] hover:bg-[#e4e4e4] text-[#222222] rounded inline-flex items-center gap-1 font-medium transition"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download</span>
            </button>
            <button
              type="button"
              onClick={() => fetchSitemap(activeTab)}
              disabled={loading}
              className="p-1.5 bg-[#f1f1f1] hover:bg-[#e4e4e4] text-[#222222] rounded transition"
              title="Refresh sitemap data"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
            </button>
          </div>
        </div>

        {/* Filter bar & Items Counter */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-[#555555]">
          <div className="flex items-center gap-2">
            <span>
              {activeTab === "index" ? "This XML Sitemap Index file contains" : "This XML Sitemap contains"}{" "}
              <strong className="text-[#111111] font-bold">{totalCount}</strong>{" "}
              {activeTab === "index" ? "sitemaps" : "URLs"}.
            </span>
            {loading && <span className="text-indigo-600 font-medium animate-pulse">(Loading...)</span>}
          </div>

          <div className="flex items-center gap-3">
            <div className="relative w-full sm:w-64">
              <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-[#888888]" />
              <input
                type="text"
                value={filterQuery}
                onChange={(e) => {
                  setFilterQuery(e.target.value);
                  setCurrentPage(1);
                }}
                placeholder="Filter URLs..."
                className="w-full pl-8 pr-3 py-1 bg-white border border-[#cccccc] rounded text-xs text-[#111111] focus:outline-hidden focus:border-[#444444]"
              />
            </div>

            <div className="flex items-center gap-1 text-xs text-[#666666]">
              <span>Rows:</span>
              <select
                value={pageSize}
                onChange={(e) => {
                  const val = e.target.value;
                  setPageSize(val === "all" ? "all" : Number(val));
                  setCurrentPage(1);
                }}
                className="bg-white border border-[#cccccc] rounded px-1.5 py-0.5 text-xs text-[#111111]"
              >
                <option value={50}>50</option>
                <option value={100}>100</option>
                <option value={250}>250</option>
                <option value="all">All ({totalCount})</option>
              </select>
            </div>
          </div>
        </div>

        {/* THE TABLE: Matching the Exact Look from the Image */}
        <div className="overflow-x-auto">
          {activeTab === "index" ? (
            /* Sitemap Index Table */
            <table className="w-full border-collapse text-[13px] border-t border-[#cccccc] select-text">
              <thead>
                <tr className="bg-[#fafafa] border-b border-[#cccccc] text-[#444444] font-semibold text-xs text-left">
                  <th className="py-1.5 px-3 font-semibold text-left">Sitemap</th>
                  <th className="py-1.5 px-3 font-semibold text-left w-[240px] whitespace-nowrap">Last Modified</th>
                </tr>
              </thead>
              <tbody>
                {filteredSitemaps.map((item, idx) => {
                  const isEven = idx % 2 === 1;
                  return (
                    <tr
                      key={item.url}
                      className={`${isEven ? "bg-[#ededed]" : "bg-white"} hover:bg-[#e2e2e2] transition-colors`}
                    >
                      <td className="py-1.5 px-3 align-middle text-[#111111]">
                        <button
                          type="button"
                          onClick={() => {
                            if (item.url.includes("post-sitemap")) setActiveTab("posts");
                            else if (item.url.includes("page-sitemap")) setActiveTab("pages");
                            else setActiveTab("all");
                          }}
                          className="text-[#111111] hover:underline font-normal text-left break-all"
                        >
                          {item.url}
                        </button>
                      </td>
                      <td className="py-1.5 px-3 align-middle text-[#222222] whitespace-nowrap font-normal">
                        {item.lastmod}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          ) : (
            /* URLSet Table (Posts, Pages, or All URLs) */
            <table className="w-full border-collapse text-[13px] border-t border-[#cccccc] select-text">
              <thead>
                <tr className="bg-[#fafafa] border-b border-[#cccccc] text-[#444444] font-semibold text-xs">
                  <th className="py-1.5 px-3 font-semibold text-left">URL</th>
                  <th className="py-1.5 px-3 font-semibold text-center w-[70px] whitespace-nowrap">Images</th>
                  <th className="py-1.5 px-3 font-semibold text-left w-[220px] whitespace-nowrap">Last Modified</th>
                </tr>
              </thead>
              <tbody>
                {paginatedUrls.map((item, idx) => {
                  // Zebra striping: Row 0 white, Row 1 gray (#ededed), Row 2 white, Row 3 gray...
                  const isEven = idx % 2 === 1;
                  return (
                    <tr
                      key={`${item.url}-${idx}`}
                      className={`${isEven ? "bg-[#ededed]" : "bg-white"} hover:bg-[#e2e2e2] transition-colors`}
                    >
                      <td className="py-1.5 px-3 align-middle text-[#111111]">
                        <a
                          href={item.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[#111111] hover:underline font-normal break-all"
                        >
                          {item.url}
                        </a>
                      </td>
                      <td className="py-1.5 px-3 align-middle text-center text-[#222222] font-normal">
                        {item.images}
                      </td>
                      <td className="py-1.5 px-3 align-middle text-[#222222] whitespace-nowrap font-normal">
                        {item.lastmod}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>

        {/* Pagination Bar */}
        {pageSize !== "all" && totalPages > 1 && (
          <div className="flex items-center justify-between border-t border-[#e5e7eb] pt-3 text-xs text-[#555555]">
            <div>
              Showing page <strong className="text-[#111111] font-semibold">{currentPage}</strong> of{" "}
              <strong className="text-[#111111] font-semibold">{totalPages}</strong> ({totalCount} total entries)
            </div>

            <div className="flex items-center gap-1.5">
              <button
                type="button"
                disabled={currentPage <= 1}
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                className="px-2 py-1 border border-[#cccccc] rounded bg-white hover:bg-[#f1f1f1] disabled:opacity-40 disabled:cursor-not-allowed inline-flex items-center gap-1 text-[#222222]"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
                <span>Prev</span>
              </button>
              <span className="px-2 text-xs font-medium text-[#222222]">
                {currentPage} / {totalPages}
              </span>
              <button
                type="button"
                disabled={currentPage >= totalPages}
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                className="px-2 py-1 border border-[#cccccc] rounded bg-white hover:bg-[#f1f1f1] disabled:opacity-40 disabled:cursor-not-allowed inline-flex items-center gap-1 text-[#222222]"
              >
                <span>Next</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
