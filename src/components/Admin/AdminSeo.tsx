import React, { useState, useEffect } from "react";
import {
  Globe,
  FileCode,
  Sparkles,
  Save,
  RefreshCw,
  ExternalLink,
  Download,
  Check,
  AlertCircle,
  Search,
  Sliders,
  Eye,
  Copy,
  Layers,
  ArrowRight,
  ShieldCheck,
  Zap,
} from "lucide-react";
import { BlogPost, CustomPage, SupportedLanguage } from "../../types";
import {
  loadRobotsTxt,
  saveRobotsTxt,
  loadSitemapXml,
  saveSitemapXml,
  buildDefaultRobotsTxt,
  buildDynamicSitemapXml,
  loadCustomPages,
} from "../../data/siteConfig";
import { BLOG_POSTS } from "../../data/blogData";

interface AdminSeoProps {
  customPages?: CustomPage[];
  posts?: BlogPost[];
}

export function AdminSeo({ customPages: propCustomPages, posts: propPosts }: AdminSeoProps) {
  const [activeSubTab, setActiveSubTab] = useState<"robots" | "sitemap" | "test">("robots");

  // Get current origin safely
  const siteOrigin = typeof window !== "undefined" ? window.location.origin : "https://example.com";

  // Data
  const effectiveCustomPages = propCustomPages || loadCustomPages();
  const effectivePosts = propPosts || BLOG_POSTS;

  // Robots state
  const [robotsContent, setRobotsContent] = useState<string>("");
  const [robotsSaved, setRobotsSaved] = useState(false);
  const [robotsLoading, setRobotsLoading] = useState(false);
  const [robotsLastModified, setRobotsLastModified] = useState<string>("Cached");

  // Sitemap state
  const [sitemapContent, setSitemapContent] = useState<string>("");
  const [sitemapSaved, setSitemapSaved] = useState(false);
  const [sitemapLoading, setSitemapLoading] = useState(false);
  const [sitemapLastModified, setSitemapLastModified] = useState<string>("Cached");
  const [sitemapFilter, setSitemapFilter] = useState("");

  // URL Testing tool state
  const [testPath, setTestPath] = useState<string>("/admin123");
  const [testResult, setTestResult] = useState<{ allowed: boolean; matchingRule: string } | null>(null);

  // Copy notification states
  const [copiedRobots, setCopiedRobots] = useState(false);
  const [copiedSitemap, setCopiedSitemap] = useState(false);

  // Load initial configurations from server / localStorage
  useEffect(() => {
    // 1. Fetch robots.txt
    fetch("/api/seo/robots")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data && data.content) {
          setRobotsContent(data.content);
          if (data.lastModified) setRobotsLastModified(new Date(data.lastModified).toLocaleString());
        } else {
          setRobotsContent(loadRobotsTxt(siteOrigin));
        }
      })
      .catch(() => {
        setRobotsContent(loadRobotsTxt(siteOrigin));
      });

    // 2. Fetch sitemap.xml
    fetch("/api/seo/sitemap")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data && data.content) {
          setSitemapContent(data.content);
          if (data.lastModified) setSitemapLastModified(new Date(data.lastModified).toLocaleString());
        } else {
          setSitemapContent(loadSitemapXml(siteOrigin, effectivePosts, effectiveCustomPages));
        }
      })
      .catch(() => {
        setSitemapContent(loadSitemapXml(siteOrigin, effectivePosts, effectiveCustomPages));
      });
  }, [siteOrigin]);

  // ---------------------------------------------------------------------------
  // ROBOTS.TXT ACTIONS
  // ---------------------------------------------------------------------------
  const handleAutoBuildRobots = (preset: "standard" | "strict" | "allow-all" = "standard") => {
    let built = "";
    if (preset === "standard") {
      built = `# robots.txt for Scribd PDF Downloader
# Auto-built via Admin Control Panel

User-agent: *
Allow: /

# Disallow admin panels and sensitive endpoints
Disallow: /admin123
Disallow: /admin
Disallow: /admin/*
Disallow: /api/
Disallow: /temp_downloads/

# XML Sitemap
Sitemap: ${siteOrigin}/sitemap.xml
`;
    } else if (preset === "strict") {
      built = `# robots.txt - Strict Security & Anti-Scraper
User-agent: *
Allow: /en/
Allow: /br/
Allow: /es/
Allow: /fr/
Allow: /de/
Allow: /id/
Disallow: /admin123
Disallow: /admin/
Disallow: /api/
Disallow: /temp_downloads/
Disallow: /cgi-bin/
Disallow: /*?*

# Crawler Rate Delay (for bots respecting Crawl-delay)
Crawl-delay: 2

Sitemap: ${siteOrigin}/sitemap.xml
`;
    } else {
      built = `# robots.txt - Allow All Indexing
User-agent: *
Allow: /
Disallow: /admin123
Disallow: /api/

Sitemap: ${siteOrigin}/sitemap.xml
`;
    }

    setRobotsContent(built);
  };

  const handleSaveRobots = async () => {
    setRobotsLoading(true);
    saveRobotsTxt(robotsContent);

    try {
      await fetch("/api/seo/robots", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: robotsContent }),
      });
      setRobotsLastModified("Just now");
    } catch (e) {
      console.error(e);
    } finally {
      setRobotsLoading(false);
      setRobotsSaved(true);
      setTimeout(() => setRobotsSaved(false), 3000);
    }
  };

  const handleDownloadRobots = () => {
    const blob = new Blob([robotsContent], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "robots.txt";
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleCopyRobots = () => {
    navigator.clipboard.writeText(robotsContent);
    setCopiedRobots(true);
    setTimeout(() => setCopiedRobots(false), 2000);
  };

  // ---------------------------------------------------------------------------
  // SITEMAP.XML ACTIONS
  // ---------------------------------------------------------------------------
  const handleAutoBuildSitemap = () => {
    const xml = buildDynamicSitemapXml(
      siteOrigin,
      effectivePosts,
      effectiveCustomPages,
      ["en", "br", "es", "fr", "de", "id"]
    );
    setSitemapContent(xml);
  };

  const handleSaveSitemap = async () => {
    setSitemapLoading(true);
    saveSitemapXml(sitemapContent);

    try {
      await fetch("/api/seo/sitemap", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: sitemapContent }),
      });
      setSitemapLastModified("Just now");
    } catch (e) {
      console.error(e);
    } finally {
      setSitemapLoading(false);
      setSitemapSaved(true);
      setTimeout(() => setSitemapSaved(false), 3000);
    }
  };

  const handleDownloadSitemap = () => {
    const blob = new Blob([sitemapContent], { type: "application/xml" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "sitemap.xml";
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleCopySitemap = () => {
    navigator.clipboard.writeText(sitemapContent);
    setCopiedSitemap(true);
    setTimeout(() => setCopiedSitemap(false), 2000);
  };

  // ---------------------------------------------------------------------------
  // CRAWLER TESTER UTILITY
  // ---------------------------------------------------------------------------
  const handleTestPath = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanPath = testPath.startsWith("/") ? testPath : "/" + testPath;

    // Parse disallow lines from robotsContent
    const lines = robotsContent.split("\n");
    let isBlocked = false;
    let ruleMatched = "Default: Allow: /";

    for (const rawLine of lines) {
      const line = rawLine.trim();
      if (line.startsWith("Disallow:")) {
        const disallowPath = line.replace("Disallow:", "").trim();
        if (!disallowPath) continue;

        // Check if prefix matches
        const pattern = disallowPath.replace(/\*/g, ".*");
        try {
          const regex = new RegExp(`^${pattern}`);
          if (regex.test(cleanPath)) {
            isBlocked = true;
            ruleMatched = `Blocked by rule: "${line}"`;
            break;
          }
        } catch {
          if (cleanPath.startsWith(disallowPath)) {
            isBlocked = true;
            ruleMatched = `Blocked by rule: "${line}"`;
            break;
          }
        }
      }
    }

    setTestResult({
      allowed: !isBlocked,
      matchingRule: isBlocked ? ruleMatched : "Allowed: No blocking Disallow pattern found for this URL path",
    });
  };

  // Extract URLs list from sitemapContent for inspection
  const parsedSitemapUrls = React.useMemo(() => {
    const urls: Array<{ loc: string; lastmod?: string; priority?: string; changefreq?: string }> = [];
    const urlBlocks = sitemapContent.match(/<url>([\s\S]*?)<\/url>/g) || [];

    for (const block of urlBlocks) {
      const locMatch = block.match(/<loc>(.*?)<\/loc>/);
      const lastmodMatch = block.match(/<lastmod>(.*?)<\/lastmod>/);
      const priorityMatch = block.match(/<priority>(.*?)<\/priority>/);
      const changefreqMatch = block.match(/<changefreq>(.*?)<\/changefreq>/);

      if (locMatch) {
        urls.push({
          loc: locMatch[1],
          lastmod: lastmodMatch ? lastmodMatch[1] : undefined,
          priority: priorityMatch ? priorityMatch[1] : undefined,
          changefreq: changefreqMatch ? changefreqMatch[1] : undefined,
        });
      }
    }
    return urls;
  }, [sitemapContent]);

  const filteredUrls = parsedSitemapUrls.filter((u) =>
    sitemapFilter ? u.loc.toLowerCase().includes(sitemapFilter.toLowerCase()) : true
  );

  return (
    <div className="space-y-6" id="admin-seo-manager">
      {/* Header Banner */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-600 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-100 flex items-center gap-1">
              <Zap className="w-3 h-3 text-emerald-600" />
              Search Engine Optimization
            </span>
            <span className="text-xs text-slate-400">Live Server Integration</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 mt-1">
            robots.txt & sitemap.xml Control Center
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Auto-generate, manually customize, and deploy your site's search engine indexing files directly from this admin panel.
          </p>
        </div>

        {/* Quick Links to Live Files */}
        <div className="flex flex-wrap items-center gap-2">
          <a
            href="/robots.txt"
            target="_blank"
            rel="noreferrer"
            className="px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 hover:bg-indigo-50 hover:text-indigo-600 hover:border-indigo-200 text-slate-700 text-xs font-bold inline-flex items-center gap-1.5 transition"
          >
            <span>Live /robots.txt</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
          <a
            href="/sitemap.xml"
            target="_blank"
            rel="noreferrer"
            className="px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 hover:bg-indigo-50 hover:text-indigo-600 hover:border-indigo-200 text-slate-700 text-xs font-bold inline-flex items-center gap-1.5 transition"
          >
            <span>Live /sitemap.xml</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200 gap-2">
        <button
          type="button"
          onClick={() => setActiveSubTab("robots")}
          className={`pb-3 px-4 text-xs font-bold transition-all border-b-2 flex items-center gap-2 cursor-pointer ${
            activeSubTab === "robots"
              ? "border-indigo-600 text-indigo-600"
              : "border-transparent text-slate-500 hover:text-slate-800"
          }`}
        >
          <FileCode className="w-4 h-4" />
          <span>robots.txt Controller</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveSubTab("sitemap")}
          className={`pb-3 px-4 text-xs font-bold transition-all border-b-2 flex items-center gap-2 cursor-pointer ${
            activeSubTab === "sitemap"
              ? "border-indigo-600 text-indigo-600"
              : "border-transparent text-slate-500 hover:text-slate-800"
          }`}
        >
          <Globe className="w-4 h-4" />
          <span>sitemap.xml Generator ({parsedSitemapUrls.length} URLs)</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveSubTab("test")}
          className={`pb-3 px-4 text-xs font-bold transition-all border-b-2 flex items-center gap-2 cursor-pointer ${
            activeSubTab === "test"
              ? "border-indigo-600 text-indigo-600"
              : "border-transparent text-slate-500 hover:text-slate-800"
          }`}
        >
          <ShieldCheck className="w-4 h-4" />
          <span>URL Crawler Tester</span>
        </button>
      </div>

      {/* =================================================================== */}
      {/* 1. ROBOTS.TXT CONTROLLER TAB                                        */}
      {/* =================================================================== */}
      {activeSubTab === "robots" && (
        <div className="space-y-6">
          {robotsSaved && (
            <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-900 font-bold flex items-center gap-2 shadow-xs">
              <Check className="w-4 h-4 text-emerald-600" />
              <span>robots.txt has been successfully built, saved, and deployed live to /robots.txt!</span>
            </div>
          )}

          {/* Controls bar */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h3 className="text-sm font-extrabold text-slate-900">robots.txt Direct Editor & Presets</h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Last modified: <span className="font-semibold text-slate-700">{robotsLastModified}</span> • Served dynamically at{" "}
                <code className="bg-slate-100 px-1 py-0.5 rounded text-indigo-600 font-mono">/robots.txt</code>
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              {/* Presets dropdown / buttons */}
              <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
                <button
                  type="button"
                  onClick={() => handleAutoBuildRobots("standard")}
                  className="px-2.5 py-1 text-[11px] font-bold rounded-lg bg-white shadow-xs text-slate-700 hover:text-indigo-600 cursor-pointer"
                  title="Generate standard recommended rules"
                >
                  ⚡ Standard Preset
                </button>
                <button
                  type="button"
                  onClick={() => handleAutoBuildRobots("strict")}
                  className="px-2.5 py-1 text-[11px] font-bold rounded-lg text-slate-600 hover:text-slate-900 hover:bg-white/60 cursor-pointer"
                  title="Generate strict anti-scraper rules"
                >
                  Strict Security
                </button>
                <button
                  type="button"
                  onClick={() => handleAutoBuildRobots("allow-all")}
                  className="px-2.5 py-1 text-[11px] font-bold rounded-lg text-slate-600 hover:text-slate-900 hover:bg-white/60 cursor-pointer"
                  title="Allow all public indexing"
                >
                  Allow All
                </button>
              </div>

              <button
                type="button"
                onClick={handleCopyRobots}
                className="px-3 py-1.5 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold inline-flex items-center gap-1.5 cursor-pointer shadow-xs"
              >
                {copiedRobots ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedRobots ? "Copied" : "Copy"}</span>
              </button>

              <button
                type="button"
                onClick={handleDownloadRobots}
                className="px-3 py-1.5 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold inline-flex items-center gap-1.5 cursor-pointer shadow-xs"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download</span>
              </button>

              <button
                type="button"
                onClick={handleSaveRobots}
                disabled={robotsLoading}
                className="px-4 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold inline-flex items-center gap-1.5 cursor-pointer shadow-xs disabled:opacity-50"
              >
                {robotsLoading ? (
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <Save className="w-3.5 h-3.5" />
                )}
                <span>Save & Update robots.txt</span>
              </button>
            </div>
          </div>

          {/* Code Editor */}
          <div className="bg-slate-900 rounded-2xl border border-slate-800 overflow-hidden shadow-sm">
            <div className="px-4 py-2.5 bg-slate-800/80 border-b border-slate-700 flex items-center justify-between text-xs text-slate-400">
              <div className="flex items-center gap-2 font-mono">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
                <span>robots.txt - Plain Text Format</span>
              </div>
              <span className="text-[11px] font-sans text-slate-400">
                Auto-synced with <code className="text-indigo-400">server.ts</code> and public directory
              </span>
            </div>

            <textarea
              rows={16}
              value={robotsContent}
              onChange={(e) => setRobotsContent(e.target.value)}
              className="w-full p-4 bg-transparent font-mono text-xs sm:text-sm text-emerald-400 focus:outline-none focus:ring-0 resize-y"
              placeholder="# Enter robots.txt directives here..."
            />
          </div>

          {/* Helpful Directive Reference */}
          <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 text-xs space-y-3">
            <h4 className="font-extrabold text-slate-900 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-indigo-600" />
              <span>Standard Directives Guide for Scribd Downloader</span>
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div className="bg-white p-3 rounded-xl border border-slate-200">
                <code className="text-indigo-600 font-bold font-mono">User-agent: *</code>
                <p className="text-slate-600 mt-1">Applies the directives to Googlebot, Bingbot, Yandex, DuckDuckGo, etc.</p>
              </div>
              <div className="bg-white p-3 rounded-xl border border-slate-200">
                <code className="text-rose-600 font-bold font-mono">Disallow: /admin123</code>
                <p className="text-slate-600 mt-1">Blocks web crawlers from indexing the admin dashboard or API routes.</p>
              </div>
              <div className="bg-white p-3 rounded-xl border border-slate-200">
                <code className="text-emerald-600 font-bold font-mono">Sitemap: https://.../sitemap.xml</code>
                <p className="text-slate-600 mt-1">Informs crawlers where your XML sitemap is hosted for rapid indexing.</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =================================================================== */}
      {/* 2. SITEMAP.XML GENERATOR TAB                                        */}
      {/* =================================================================== */}
      {activeSubTab === "sitemap" && (
        <div className="space-y-6">
          {sitemapSaved && (
            <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-900 font-bold flex items-center gap-2 shadow-xs">
              <Check className="w-4 h-4 text-emerald-600" />
              <span>sitemap.xml has been successfully saved, updated, and deployed live to /sitemap.xml!</span>
            </div>
          )}

          {/* Action Header */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h3 className="text-sm font-extrabold text-slate-900">
                Dynamic sitemap.xml Builder ({parsedSitemapUrls.length} Indexed Pages)
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Includes all 6 language versions, published blog posts, and active custom pages. Last updated:{" "}
                <span className="font-semibold text-slate-700">{sitemapLastModified}</span>
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={handleAutoBuildSitemap}
                className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold inline-flex items-center gap-1.5 cursor-pointer shadow-xs"
                title="Automatically scan routes, languages, blog posts, and custom pages to build sitemap"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Auto-Build from Site Data</span>
              </button>

              <button
                type="button"
                onClick={handleCopySitemap}
                className="px-3 py-1.5 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold inline-flex items-center gap-1.5 cursor-pointer shadow-xs"
              >
                {copiedSitemap ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedSitemap ? "Copied" : "Copy"}</span>
              </button>

              <button
                type="button"
                onClick={handleDownloadSitemap}
                className="px-3 py-1.5 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold inline-flex items-center gap-1.5 cursor-pointer shadow-xs"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download XML</span>
              </button>

              <button
                type="button"
                onClick={handleSaveSitemap}
                disabled={sitemapLoading}
                className="px-4 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold inline-flex items-center gap-1.5 cursor-pointer shadow-xs disabled:opacity-50"
              >
                {sitemapLoading ? (
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <Save className="w-3.5 h-3.5" />
                )}
                <span>Save & Update sitemap.xml</span>
              </button>
            </div>
          </div>

          {/* XML Editor */}
          <div className="bg-slate-900 rounded-2xl border border-slate-800 overflow-hidden shadow-sm">
            <div className="px-4 py-2.5 bg-slate-800/80 border-b border-slate-700 flex items-center justify-between text-xs text-slate-400">
              <div className="flex items-center gap-2 font-mono">
                <span className="w-2.5 h-2.5 rounded-full bg-blue-500"></span>
                <span>sitemap.xml - Standard XML URLSet Schema 0.9</span>
              </div>
              <span className="text-[11px] font-sans text-slate-400">Editable XML code</span>
            </div>

            <textarea
              rows={16}
              value={sitemapContent}
              onChange={(e) => setSitemapContent(e.target.value)}
              className="w-full p-4 bg-transparent font-mono text-xs sm:text-sm text-blue-300 focus:outline-none focus:ring-0 resize-y"
              placeholder="<?xml version='1.0' encoding='UTF-8'?>..."
            />
          </div>

          {/* URLs Inspector Table */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
            <div className="p-4 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h4 className="text-sm font-extrabold text-slate-900">Parsed URL Entries ({filteredUrls.length})</h4>
                <p className="text-xs text-slate-500">Overview of all paths currently represented in the XML sitemap.</p>
              </div>

              <div className="relative w-full sm:w-64">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Filter URLs..."
                  value={sitemapFilter}
                  onChange={(e) => setSitemapFilter(e.target.value)}
                  className="w-full pl-9 pr-3 py-1.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>

            <div className="max-h-72 overflow-y-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-500 font-bold uppercase tracking-wider sticky top-0 border-b border-slate-100">
                  <tr>
                    <th className="px-4 py-2.5">Location URL</th>
                    <th className="px-4 py-2.5">Priority</th>
                    <th className="px-4 py-2.5">Change Frequency</th>
                    <th className="px-4 py-2.5">Last Modified</th>
                    <th className="px-4 py-2.5 text-right">View</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredUrls.map((item, idx) => (
                    <tr key={idx} className="hover:bg-slate-50 transition font-mono">
                      <td className="px-4 py-2 text-slate-800 font-semibold truncate max-w-sm">{item.loc}</td>
                      <td className="px-4 py-2 text-indigo-600 font-bold">{item.priority || "0.5"}</td>
                      <td className="px-4 py-2 text-slate-500 font-sans">{item.changefreq || "weekly"}</td>
                      <td className="px-4 py-2 text-slate-400 text-[11px]">{item.lastmod || "-"}</td>
                      <td className="px-4 py-2 text-right">
                        <a
                          href={item.loc}
                          target="_blank"
                          rel="noreferrer"
                          className="text-slate-400 hover:text-indigo-600 inline-block p-1"
                          title="Open URL"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      </td>
                    </tr>
                  ))}
                  {filteredUrls.length === 0 && (
                    <tr>
                      <td colSpan={5} className="px-4 py-6 text-center text-slate-400 font-sans text-xs">
                        No URLs matching the filter.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* =================================================================== */}
      {/* 3. URL CRAWLER TESTER TAB                                           */}
      {/* =================================================================== */}
      {activeSubTab === "test" && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-6">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-2.5 py-0.5 rounded-full border border-indigo-100">
              Rule Verification
            </span>
            <h3 className="text-base font-extrabold text-slate-900 mt-1">Test URL Against robots.txt Rules</h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Input any URL path on your site to test if search engine crawlers are allowed or blocked by the active robots.txt directives.
            </p>
          </div>

          <form onSubmit={handleTestPath} className="flex flex-col sm:flex-row gap-3">
            <input
              type="text"
              required
              value={testPath}
              onChange={(e) => setTestPath(e.target.value)}
              placeholder="e.g. /admin123, /en/blog, /api/download"
              className="flex-1 px-4 py-2.5 rounded-xl border border-slate-300 text-xs font-mono focus:outline-none focus:border-indigo-500"
            />
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition cursor-pointer shadow-xs"
            >
              Test URL Access
            </button>
          </form>

          {/* Quick test buttons */}
          <div className="flex flex-wrap items-center gap-2 text-xs">
            <span className="text-slate-400 font-semibold">Quick tests:</span>
            {["/admin123", "/api/download", "/en/how-it-works", "/en/blog", "/temp_downloads/cache"].map((p) => (
              <button
                key={p}
                type="button"
                onClick={() => {
                  setTestPath(p);
                  // trigger test
                  setTimeout(() => {
                    const btn = document.querySelector("#admin-seo-manager form button[type='submit']") as HTMLButtonElement;
                    if (btn) btn.click();
                  }, 50);
                }}
                className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-mono text-[11px] cursor-pointer"
              >
                {p}
              </button>
            ))}
          </div>

          {testResult && (
            <div
              className={`p-4 rounded-xl border flex items-start gap-3 ${
                testResult.allowed
                  ? "bg-emerald-50 border-emerald-200 text-emerald-900"
                  : "bg-rose-50 border-rose-200 text-rose-900"
              }`}
            >
              {testResult.allowed ? (
                <Check className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
              ) : (
                <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
              )}
              <div className="space-y-1">
                <div className="font-extrabold text-sm">
                  {testResult.allowed ? "✅ ALLOWED for Web Crawlers" : "🛑 BLOCKED for Web Crawlers"}
                </div>
                <p className="text-xs font-mono">{testResult.matchingRule}</p>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
