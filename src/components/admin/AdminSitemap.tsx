import React, { useState, useEffect } from "react";
import {
  FileCode,
  Globe,
  RefreshCw,
  ExternalLink,
  Copy,
  Check,
  Search,
  Filter,
  Layers,
  FileText,
  Home,
  CheckCircle2,
  AlertCircle,
  Loader2,
} from "lucide-react";

interface InventoryData {
  inventory: {
    counts: {
      publishedPagesCount: number;
      draftPagesCount: number;
      publishedPostsCount: number;
      draftPostsCount: number;
      activeLanguagesCount: number;
      homepageUrlsCount: number;
      hindiHomepageStatus: string;
      hindiPagesCount: number;
      hindiPostsCount: number;
      totalPageSitemapUrls: number;
      totalPostSitemapUrls: number;
      totalSitemapUrls: number;
      duplicateUrlsCount: number;
      invalidUrlsCount: number;
    };
    homepages: string[];
    pages: Array<{ loc: string; lang: string; title: string; lastmod: string }>;
    posts: Array<{ loc: string; lang: string; title: string; lastmod: string }>;
    languages: Array<{ code: string; name: string }>;
  };
  timestamp: string;
  sitemapUrl: string;
  sitemapIndexUrl: string;
  pageSitemapUrl: string;
  postSitemapUrl: string;
}

export function AdminSitemap() {
  const [data, setData] = useState<InventoryData | null>(null);
  const [loading, setLoading] = useState(true);
  const [regenerating, setRegenerating] = useState(false);
  const [copiedUrl, setCopiedUrl] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFilter, setSelectedFilter] = useState<"all" | "home" | "pages" | "posts" | "hindi">("all");
  const [feedback, setFeedback] = useState<string | null>(null);

  // Manual Sitemap Mode & Content state
  const [isManualMode, setIsManualMode] = useState(false);
  const [manualSitemapIndexXml, setManualSitemapIndexXml] = useState("");
  const [manualSitemapXml, setManualSitemapXml] = useState("");
  const [manualPageSitemapXml, setManualPageSitemapXml] = useState("");
  const [manualPostSitemapXml, setManualPostSitemapXml] = useState("");
  const [activeXmlTab, setActiveXmlTab] = useState<"index" | "all" | "pages" | "posts">("index");
  const [savingConfig, setSavingConfig] = useState(false);

  const loadStats = async () => {
    try {
      const [statsRes, configRes] = await Promise.all([
        fetch("/api/admin/sitemap/stats"),
        fetch("/api/admin/sitemap/config"),
      ]);
      const statsJson = await statsRes.json();
      const configJson = await configRes.json();

      setData(statsJson);
      setIsManualMode(configJson.isManualMode || false);
      setManualSitemapIndexXml(configJson.manualSitemapIndexXml || "");
      setManualSitemapXml(configJson.manualSitemapXml || "");
      setManualPageSitemapXml(configJson.manualPageSitemapXml || "");
      setManualPostSitemapXml(configJson.manualPostSitemapXml || "");
    } catch (err) {
      console.error("Failed to load sitemap stats & configuration:", err);
    } finally {
      setLoading(false);
      setRegenerating(false);
    }
  };

  useEffect(() => {
    loadStats();
  }, []);

  const handleRegenerate = async () => {
    setRegenerating(true);
    setFeedback(null);
    try {
      const res = await fetch("/api/admin/sitemap/regenerate", { method: "POST" });
      const result = await res.json();
      setFeedback(result.message || "Sitemaps refreshed successfully.");
      await loadStats();
    } catch (err) {
      setFeedback("Failed to regenerate sitemaps.");
    } finally {
      setRegenerating(false);
      setTimeout(() => setFeedback(null), 4000);
    }
  };

  const handleSaveConfig = async (updatedMode?: boolean) => {
    setSavingConfig(true);
    setFeedback(null);
    try {
      const modeToSave = typeof updatedMode === "boolean" ? updatedMode : isManualMode;
      const res = await fetch("/api/admin/sitemap/config", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          isManualMode: modeToSave,
          manualSitemapIndexXml,
          manualSitemapXml,
          manualPageSitemapXml,
          manualPostSitemapXml,
        }),
      });
      const result = await res.json();
      if (result.success) {
        setFeedback("Sitemap configuration and manual code successfully saved.");
        setIsManualMode(result.config.isManualMode);
        setManualSitemapIndexXml(result.config.manualSitemapIndexXml);
        setManualSitemapXml(result.config.manualSitemapXml);
        setManualPageSitemapXml(result.config.manualPageSitemapXml);
        setManualPostSitemapXml(result.config.manualPostSitemapXml);
      } else {
        setFeedback("Failed to save sitemap configuration.");
      }
    } catch (err: any) {
      setFeedback("Failed to save sitemap configuration: " + err.message);
    } finally {
      setSavingConfig(false);
      setTimeout(() => setFeedback(null), 4000);
    }
  };

  const handleResetToDynamic = async () => {
    if (!confirm("Overwrite all manual XML inputs with the currently generated live dynamic XML feeds?")) return;
    setRegenerating(true);
    try {
      // Rebuild on server
      await fetch("/api/admin/sitemap/regenerate", { method: "POST" });

      // Fetch dynamic content
      const [indexRes, allRes, pagesRes, postsRes] = await Promise.all([
        fetch("/api/seo/sitemap?type=index"),
        fetch("/api/seo/sitemap?type=all"),
        fetch("/api/seo/sitemap?type=pages"),
        fetch("/api/seo/sitemap?type=posts"),
      ]);

      const indexData = await indexRes.json();
      const allData = await allRes.json();
      const pagesData = await pagesRes.json();
      const postsData = await postsRes.json();

      setManualSitemapIndexXml(indexData.content || "");
      setManualSitemapXml(allData.content || "");
      setManualPageSitemapXml(pagesData.content || "");
      setManualPostSitemapXml(postsData.content || "");

      setFeedback("Pre-populated manual code editors with dynamic XML feeds.");
    } catch (err) {
      console.error("Error pre-populating sitemaps:", err);
      setFeedback("Failed to load current dynamic XML feeds.");
    } finally {
      setRegenerating(false);
      setTimeout(() => setFeedback(null), 4000);
    }
  };

  const handleCopy = (url: string) => {
    navigator.clipboard.writeText(url);
    setCopiedUrl(url);
    setTimeout(() => setCopiedUrl(null), 2000);
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-slate-500">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-600 mb-3" />
        <p className="text-sm font-medium">Inspecting Dynamic XML Sitemaps...</p>
      </div>
    );
  }

  const counts = data?.inventory?.counts;

  // Build unified items array for search and table
  const allItems: Array<{ loc: string; type: "home" | "page" | "post"; title: string; lang: string; lastmod: string }> = [];

  data?.inventory?.homepages?.forEach((url) => {
    const isLangHome = url.split("/").filter(Boolean).length > 2;
    const langCode = isLangHome ? url.split("/").filter(Boolean).pop() || "en" : "en";
    allItems.push({
      loc: url,
      type: "home",
      title: isLangHome ? `Homepage (${langCode.toUpperCase()})` : "Primary English Homepage",
      lang: langCode,
      lastmod: data.timestamp,
    });
  });

  data?.inventory?.pages?.forEach((p) => {
    allItems.push({
      loc: p.loc,
      type: "page",
      title: p.title,
      lang: p.lang,
      lastmod: p.lastmod,
    });
  });

  data?.inventory?.posts?.forEach((p) => {
    allItems.push({
      loc: p.loc,
      type: "post",
      title: p.title,
      lang: p.lang,
      lastmod: p.lastmod,
    });
  });

  // Filter items
  const filteredItems = allItems.filter((item) => {
    if (selectedFilter === "home" && item.type !== "home") return false;
    if (selectedFilter === "pages" && item.type !== "page") return false;
    if (selectedFilter === "posts" && item.type !== "post") return false;
    if (selectedFilter === "hindi" && item.lang !== "hi") return false;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return item.loc.toLowerCase().includes(q) || item.title.toLowerCase().includes(q);
    }
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-indigo-50 text-indigo-700 border border-indigo-100">
              <Layers className="w-5 h-5" />
            </span>
            <h1 className="text-xl font-bold text-slate-900">WordPress XML Sitemap Management</h1>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Configure XML sitemaps built automatically or manually written for custom technical index coverage.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {feedback && (
            <div className="px-3 py-1.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-semibold flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4" />
              <span>{feedback}</span>
            </div>
          )}
          {!isManualMode && (
            <button
              type="button"
              onClick={handleRegenerate}
              disabled={regenerating}
              className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold shadow-sm transition disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${regenerating ? "animate-spin" : ""}`} />
              <span>Regenerate Dynamic Sitemaps</span>
            </button>
          )}
        </div>
      </div>

      {/* Sitemap operational mode toggle */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-sm font-bold text-slate-900">Sitemap Operational Mode</h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Choose whether sitemaps are generated dynamically from database content or written manually as custom static XML code.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className={`text-xs font-semibold ${!isManualMode ? "text-indigo-600" : "text-slate-400"}`}>
              Dynamic Mode
            </span>
            <button
              type="button"
              onClick={() => {
                const nextMode = !isManualMode;
                setIsManualMode(nextMode);
                handleSaveConfig(nextMode);
              }}
              disabled={savingConfig}
              className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                isManualMode ? "bg-indigo-600" : "bg-slate-200"
              }`}
            >
              <span
                className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${
                  isManualMode ? "translate-x-5" : "translate-x-0"
                }`}
              />
            </button>
            <span className={`text-xs font-semibold ${isManualMode ? "text-indigo-600" : "text-slate-400"}`}>
              Manual Mode
            </span>
          </div>
        </div>

        {isManualMode && (
          <div className="pt-4 border-t border-slate-100 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 bg-indigo-50/50 p-3 rounded-xl border border-indigo-100">
              <div className="text-xs text-indigo-800 font-medium">
                📝 <strong>Manual Mode Active:</strong> Edit the raw XML for each sitemap endpoint below. Click <strong>Save Manual Sitemaps</strong> to publish them.
              </div>
              <button
                type="button"
                onClick={handleResetToDynamic}
                className="text-[11px] text-indigo-700 hover:text-indigo-900 font-bold underline shrink-0"
              >
                Reset & Pre-populate from Dynamic XML
              </button>
            </div>

            {/* XML Editor Tabs */}
            <div className="flex items-center gap-1.5 border-b border-slate-100 pb-2 text-xs font-semibold">
              <button
                type="button"
                onClick={() => setActiveXmlTab("index")}
                className={`px-3 py-1.5 rounded-lg border transition ${
                  activeXmlTab === "index"
                    ? "bg-indigo-50 text-indigo-700 border-indigo-200 font-bold"
                    : "border-transparent text-slate-500 hover:text-slate-800"
                }`}
              >
                sitemap_index.xml
              </button>
              <button
                type="button"
                onClick={() => setActiveXmlTab("all")}
                className={`px-3 py-1.5 rounded-lg border transition ${
                  activeXmlTab === "all"
                    ? "bg-indigo-50 text-indigo-700 border-indigo-200 font-bold"
                    : "border-transparent text-slate-500 hover:text-slate-800"
                }`}
              >
                sitemap.xml (Unified)
              </button>
              <button
                type="button"
                onClick={() => setActiveXmlTab("pages")}
                className={`px-3 py-1.5 rounded-lg border transition ${
                  activeXmlTab === "pages"
                    ? "bg-indigo-50 text-indigo-700 border-indigo-200 font-bold"
                    : "border-transparent text-slate-500 hover:text-slate-800"
                }`}
              >
                page-sitemap.xml
              </button>
              <button
                type="button"
                onClick={() => setActiveXmlTab("posts")}
                className={`px-3 py-1.5 rounded-lg border transition ${
                  activeXmlTab === "posts"
                    ? "bg-indigo-50 text-indigo-700 border-indigo-200 font-bold"
                    : "border-transparent text-slate-500 hover:text-slate-800"
                }`}
              >
                post-sitemap.xml
              </button>
            </div>

            {/* Textarea Code Editors */}
            <div>
              {activeXmlTab === "index" && (
                <textarea
                  rows={12}
                  value={manualSitemapIndexXml}
                  onChange={(e) => setManualSitemapIndexXml(e.target.value)}
                  className="w-full p-4 rounded-xl border border-slate-200 font-mono text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 bg-slate-900 text-emerald-400 leading-relaxed"
                  placeholder="Paste manual sitemap_index.xml code here..."
                />
              )}
              {activeXmlTab === "all" && (
                <textarea
                  rows={12}
                  value={manualSitemapXml}
                  onChange={(e) => setManualSitemapXml(e.target.value)}
                  className="w-full p-4 rounded-xl border border-slate-200 font-mono text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 bg-slate-900 text-emerald-400 leading-relaxed"
                  placeholder="Paste manual sitemap.xml code here..."
                />
              )}
              {activeXmlTab === "pages" && (
                <textarea
                  rows={12}
                  value={manualPageSitemapXml}
                  onChange={(e) => setManualPageSitemapXml(e.target.value)}
                  className="w-full p-4 rounded-xl border border-slate-200 font-mono text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 bg-slate-900 text-emerald-400 leading-relaxed"
                  placeholder="Paste manual page-sitemap.xml code here..."
                />
              )}
              {activeXmlTab === "posts" && (
                <textarea
                  rows={12}
                  value={manualPostSitemapXml}
                  onChange={(e) => setManualPostSitemapXml(e.target.value)}
                  className="w-full p-4 rounded-xl border border-slate-200 font-mono text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 bg-slate-900 text-emerald-400 leading-relaxed"
                  placeholder="Paste manual post-sitemap.xml code here..."
                />
              )}
            </div>

            <div className="flex justify-end pt-1">
              <button
                type="button"
                onClick={() => handleSaveConfig()}
                disabled={savingConfig}
                className="flex items-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold shadow-sm transition disabled:opacity-50"
              >
                {savingConfig ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <Check className="w-3.5 h-3.5" />
                )}
                <span>Save Manual Sitemaps</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <div className="text-xs font-semibold uppercase tracking-wider text-slate-400">Total Indexed URLs</div>
          <div className="text-2xl font-black text-slate-900 mt-1">{counts?.totalSitemapUrls || 0}</div>
          <p className="text-[11px] text-slate-500 mt-0.5">100% synchronized with DB</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <div className="text-xs font-semibold uppercase tracking-wider text-slate-400">Page Sitemap URLs</div>
          <div className="text-2xl font-black text-indigo-600 mt-1">{counts?.totalPageSitemapUrls || 0}</div>
          <p className="text-[11px] text-slate-500 mt-0.5">Homepages + Standard + CMS</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <div className="text-xs font-semibold uppercase tracking-wider text-slate-400">Post Sitemap URLs</div>
          <div className="text-2xl font-black text-emerald-600 mt-1">{counts?.totalPostSitemapUrls || 0}</div>
          <p className="text-[11px] text-slate-500 mt-0.5">Published blog articles</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <div className="text-xs font-semibold uppercase tracking-wider text-slate-400">Hindi Localized URLs</div>
          <div className="text-2xl font-black text-amber-600 mt-1">
            {(counts?.hindiPagesCount || 0) + (counts?.hindiPostsCount || 0) + (counts?.hindiHomepageStatus === "Included" ? 1 : 0)}
          </div>
          <p className="text-[11px] text-slate-500 mt-0.5">Real verified Hindi content</p>
        </div>
      </div>

      {/* XML Sitemaps Direct Links Panel */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-4 flex items-center justify-between">
          <span>Active XML Sitemap Endpoints</span>
          <span className="text-[11px] font-normal text-slate-500">Auto-served by server.ts with strict XML headers</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            {
              name: "Sitemap Index",
              desc: "Root parent index pointing to Page and Post sub-sitemaps.",
              url: data?.sitemapIndexUrl || "/sitemap_index.xml",
              count: 2,
            },
            {
              name: "Unified Sitemap (All URLs)",
              desc: "Complete direct XML list of every discoverable public URL.",
              url: data?.sitemapUrl || "/sitemap.xml",
              count: counts?.totalSitemapUrls || 0,
            },
            {
              name: "Page Sitemap (page-sitemap.xml)",
              desc: "Homepages, standard core pages, and published custom CMS pages.",
              url: data?.pageSitemapUrl || "/page-sitemap.xml",
              count: counts?.totalPageSitemapUrls || 0,
            },
            {
              name: "Post Sitemap (post-sitemap.xml)",
              desc: "Published blog articles and instructional tutorials.",
              url: data?.postSitemapUrl || "/post-sitemap.xml",
              count: counts?.totalPostSitemapUrls || 0,
            },
          ].map((item) => (
            <div
              key={item.name}
              className="p-4 rounded-xl border border-slate-100 bg-slate-50/50 hover:bg-white hover:border-indigo-200 transition flex flex-col justify-between gap-3"
            >
              <div>
                <div className="flex items-center justify-between">
                  <div className="font-bold text-slate-900 text-sm">{item.name}</div>
                  <span className="px-2 py-0.5 rounded-md bg-indigo-50 text-indigo-700 font-bold text-[11px] border border-indigo-100">
                    {item.count} URLs
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-1">{item.desc}</p>
                <div className="mt-2 text-xs font-mono text-slate-600 truncate bg-slate-100 px-2.5 py-1 rounded-lg">
                  {item.url}
                </div>
              </div>

              <div className="flex items-center gap-2 pt-1 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => handleCopy(item.url)}
                  className="flex items-center gap-1 text-xs text-slate-600 hover:text-slate-900 px-2.5 py-1 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 transition"
                >
                  {copiedUrl === item.url ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedUrl === item.url ? "Copied!" : "Copy URL"}</span>
                </button>

                <a
                  href={item.url}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-1 text-xs text-indigo-600 hover:text-indigo-800 px-2.5 py-1 rounded-lg border border-indigo-200 bg-indigo-50/60 hover:bg-indigo-100 transition"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>Open XML Feed</span>
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Live URL Inventory Explorer */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
          <div>
            <h2 className="text-sm font-bold text-slate-900">Live URL Inventory & Crawl Table</h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Inspect all {allItems.length} URLs currently published and fed to search engines.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Filter Pills */}
            {(["all", "home", "pages", "posts", "hindi"] as const).map((f) => (
              <button
                key={f}
                type="button"
                onClick={() => setSelectedFilter(f)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold capitalize transition ${
                  selectedFilter === f
                    ? "bg-indigo-600 text-white shadow-sm"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        {/* Search Box */}
        <div className="mb-4">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by URL path or page title..."
              className="w-full pl-9 pr-4 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:border-indigo-500 text-slate-800"
            />
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto rounded-xl border border-slate-200">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="bg-slate-50 text-[11px] uppercase tracking-wider text-slate-400 border-b border-slate-200 select-none">
              <tr>
                <th className="py-2.5 px-3 font-semibold">URL Path</th>
                <th className="py-2.5 px-3 font-semibold">Type</th>
                <th className="py-2.5 px-3 font-semibold">Language</th>
                <th className="py-2.5 px-3 font-semibold">Title / Identifier</th>
                <th className="py-2.5 px-3 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredItems.map((item, idx) => (
                <tr key={idx} className="hover:bg-slate-50/70 transition">
                  <td className="py-2.5 px-3 font-mono text-[11px] text-slate-900 max-w-xs truncate">
                    {item.loc}
                  </td>
                  <td className="py-2.5 px-3">
                    <span
                      className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${
                        item.type === "home"
                          ? "bg-amber-50 text-amber-700 border border-amber-200"
                          : item.type === "page"
                          ? "bg-blue-50 text-blue-700 border border-blue-200"
                          : "bg-emerald-50 text-emerald-700 border border-emerald-200"
                      }`}
                    >
                      {item.type.toUpperCase()}
                    </span>
                  </td>
                  <td className="py-2.5 px-3">
                    <span className="px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 font-mono text-[10px] uppercase font-semibold">
                      {item.lang}
                    </span>
                  </td>
                  <td className="py-2.5 px-3 text-slate-800 font-medium max-w-xs truncate">
                    {item.title}
                  </td>
                  <td className="py-2.5 px-3 text-right">
                    <a
                      href={item.loc}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1 text-indigo-600 hover:text-indigo-800 font-semibold text-[11px]"
                    >
                      <span>Visit</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </td>
                </tr>
              ))}

              {filteredItems.length === 0 && (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-slate-400 text-xs">
                    No URLs match your current filter and search criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
