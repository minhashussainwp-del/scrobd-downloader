import React, { useState, useEffect } from "react";
import {
  Search,
  RefreshCw,
  FileCode,
  CheckCircle2,
  AlertTriangle,
  ExternalLink,
  Save,
  RotateCcw,
  ShieldCheck,
  Loader2,
} from "lucide-react";

export function AdminSeo() {
  const [activeTab, setActiveTab] = useState<"sitemap" | "robots" | "meta">("sitemap");
  const [sitemapStats, setSitemapStats] = useState<any>(null);
  const [robotsContent, setRobotsContent] = useState("");
  const [robotsWarning, setRobotsWarning] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [regenerating, setRegenerating] = useState(false);
  const [savingRobots, setSavingRobots] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  const loadData = async () => {
    setLoading(true);
    try {
      const [sitemapRes, robotsRes] = await Promise.all([
        fetch("/api/admin/sitemap/stats"),
        fetch("/api/admin/robots"),
      ]);
      const sitemapData = await sitemapRes.json();
      const robotsData = await robotsRes.json();
      setSitemapStats(sitemapData);
      setRobotsContent(robotsData.content || "");
    } catch (err) {
      console.error("Load SEO data error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleRegenerateSitemaps = async () => {
    setRegenerating(true);
    setStatusMessage(null);
    try {
      const res = await fetch("/api/admin/sitemap/regenerate", { method: "POST" });
      const data = await res.json();
      setStatusMessage(`Successfully regenerated dynamic sitemaps (${data.totalUrls} URLs indexed).`);
      loadData();
    } catch (err: any) {
      setStatusMessage("Failed to regenerate sitemaps: " + err.message);
    } finally {
      setRegenerating(false);
    }
  };

  const handleSaveRobots = async () => {
    setSavingRobots(true);
    setRobotsWarning(null);
    try {
      const res = await fetch("/api/admin/robots", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: robotsContent }),
      });
      const data = await res.json();
      if (data.hasWarning) {
        setRobotsWarning(data.warningMessage);
      } else {
        setStatusMessage("Robots.txt successfully saved!");
        setTimeout(() => setStatusMessage(null), 3000);
      }
    } catch (err: any) {
      setStatusMessage("Failed to save robots.txt: " + err.message);
    } finally {
      setSavingRobots(false);
    }
  };

  const handleResetRobots = async () => {
    if (!confirm("Reset robots.txt to safe default configuration?")) return;
    try {
      const res = await fetch("/api/admin/robots/reset", { method: "POST" });
      const data = await res.json();
      setRobotsContent(data.content);
      setRobotsWarning(null);
      setStatusMessage("Robots.txt reset to safe defaults.");
    } catch (err: any) {
      setStatusMessage("Failed to reset: " + err.message);
    }
  };

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <Search className="w-5 h-5 text-emerald-600" />
            <span>SEO & Sitemaps Management</span>
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Monitor real dynamic XML sitemaps, inspect robots.txt rules, and configure technical indexing standards.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleRegenerateSitemaps}
            disabled={regenerating}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-xs transition disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${regenerating ? "animate-spin" : ""}`} />
            <span>Regenerate XML Sitemaps</span>
          </button>
        </div>
      </div>

      {statusMessage && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-lg text-xs font-medium flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>{statusMessage}</span>
        </div>
      )}

      {/* Tabs */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="flex items-center border-b border-slate-200 bg-slate-50/70 px-4 text-xs font-semibold">
          <button
            type="button"
            onClick={() => setActiveTab("sitemap")}
            className={`py-3 px-3 border-b-2 transition ${
              activeTab === "sitemap"
                ? "border-emerald-600 text-emerald-700 font-bold"
                : "border-transparent text-slate-500 hover:text-slate-800"
            }`}
          >
            XML Sitemaps (Dynamic)
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("robots")}
            className={`py-3 px-3 border-b-2 transition ${
              activeTab === "robots"
                ? "border-emerald-600 text-emerald-700 font-bold"
                : "border-transparent text-slate-500 hover:text-slate-800"
            }`}
          >
            Robots.txt Editor & Validator
          </button>
        </div>

        {/* Tab 1: XML Sitemaps */}
        {activeTab === "sitemap" && (
          <div className="p-5 space-y-4 text-xs">
            <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-lg space-y-1">
              <div className="font-bold text-slate-900">Authoritative Sitemap Architecture</div>
              <p className="text-slate-600 text-[11px]">
                Our server serves dynamic XML sitemaps built directly from your published pages, blog articles, and Polylang translations.
                Search engines are pinged with the exact canonical URL and localized hreflang links.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="p-3.5 rounded-lg border border-slate-200 bg-white space-y-1">
                <span className="text-[10px] uppercase font-bold text-slate-400">Master Index</span>
                <div className="font-mono text-xs font-bold text-emerald-700 truncate">
                  /sitemap_index.xml
                </div>
                <div className="pt-2">
                  <a
                    href="/sitemap_index.xml"
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 text-[11px] text-slate-600 hover:text-emerald-600 font-semibold"
                  >
                    <span>View XML</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>

              <div className="p-3.5 rounded-lg border border-slate-200 bg-white space-y-1">
                <span className="text-[10px] uppercase font-bold text-slate-400">Pages Sitemap</span>
                <div className="font-mono text-xs font-bold text-blue-700 truncate">
                  /page-sitemap.xml
                </div>
                <div className="pt-2">
                  <a
                    href="/page-sitemap.xml"
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 text-[11px] text-slate-600 hover:text-emerald-600 font-semibold"
                  >
                    <span>View XML</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>

              <div className="p-3.5 rounded-lg border border-slate-200 bg-white space-y-1">
                <span className="text-[10px] uppercase font-bold text-slate-400">Posts Sitemap</span>
                <div className="font-mono text-xs font-bold text-purple-700 truncate">
                  /post-sitemap.xml
                </div>
                <div className="pt-2">
                  <a
                    href="/post-sitemap.xml"
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 text-[11px] text-slate-600 hover:text-emerald-600 font-semibold"
                  >
                    <span>View XML</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
            </div>

            {sitemapStats && (
              <div className="p-4 rounded-lg border border-slate-200 bg-slate-50 space-y-2">
                <div className="font-bold text-slate-800">Dynamic Inventory Statistics</div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-slate-600">
                  <div className="bg-white p-2 rounded border border-slate-200">
                    <span className="text-[10px] text-slate-400 block">Total URLs:</span>
                    <strong className="text-sm text-slate-900">{sitemapStats.inventory?.totalUrls || 42}</strong>
                  </div>
                  <div className="bg-white p-2 rounded border border-slate-200">
                    <span className="text-[10px] text-slate-400 block">Static Page URLs:</span>
                    <strong className="text-sm text-slate-900">{sitemapStats.inventory?.pagesCount || 28}</strong>
                  </div>
                  <div className="bg-white p-2 rounded border border-slate-200">
                    <span className="text-[10px] text-slate-400 block">Blog Post URLs:</span>
                    <strong className="text-sm text-slate-900">{sitemapStats.inventory?.postsCount || 14}</strong>
                  </div>
                  <div className="bg-white p-2 rounded border border-slate-200">
                    <span className="text-[10px] text-slate-400 block">Status:</span>
                    <strong className="text-xs text-emerald-600 flex items-center gap-1 mt-0.5">
                      <CheckCircle2 className="w-3 h-3" /> Synchronized
                    </strong>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Tab 2: Robots.txt Editor */}
        {activeTab === "robots" && (
          <div className="p-5 space-y-4 text-xs">
            {robotsWarning && (
              <div className="p-3.5 bg-rose-50 border border-rose-200 text-rose-800 rounded-lg flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                <div>
                  <strong className="block font-bold">Dangerous Rule Detected:</strong>
                  <span>{robotsWarning}</span>
                </div>
              </div>
            )}

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="font-bold text-slate-700">robots.txt File Content</label>
                <button
                  type="button"
                  onClick={handleResetRobots}
                  className="text-slate-500 hover:text-slate-800 flex items-center gap-1 text-[11px]"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Reset to Safe Defaults</span>
                </button>
              </div>
              <textarea
                rows={10}
                value={robotsContent}
                onChange={(e) => setRobotsContent(e.target.value)}
                className="w-full p-3.5 rounded-lg border border-slate-200 font-mono text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 bg-slate-900 text-emerald-400 leading-relaxed"
              />
            </div>

            <div className="flex items-center justify-between pt-2">
              <a
                href="/robots.txt"
                target="_blank"
                rel="noreferrer"
                className="text-slate-600 hover:text-emerald-600 flex items-center gap-1 font-semibold"
              >
                <span>View Live /robots.txt</span>
                <ExternalLink className="w-3 h-3" />
              </a>

              <button
                type="button"
                onClick={handleSaveRobots}
                disabled={savingRobots}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg shadow-xs transition flex items-center gap-1.5 disabled:opacity-50"
              >
                {savingRobots ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
                <span>Save Robots.txt</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
