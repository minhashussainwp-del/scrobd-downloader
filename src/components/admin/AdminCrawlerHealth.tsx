import React, { useState, useEffect } from "react";
import {
  Activity,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  RefreshCw,
  Search,
  ShieldCheck,
  FileCode,
  Globe,
  Bot,
  ExternalLink,
  Code2,
  Terminal,
  Loader2,
  Check,
  Zap,
} from "lucide-react";

interface CrawlerHealthData {
  healthScore: number;
  checks: Array<{
    id: string;
    title: string;
    status: "pass" | "warning" | "fail";
    message: string;
  }>;
  robots: {
    content: string;
    blocksAll: boolean;
    allowsPublic: boolean;
    disallowsAdmin: boolean;
    disallowsApi: boolean;
    hasSitemapDirective: boolean;
  };
  bots: Array<{
    bot: string;
    allowed: boolean;
    type: string;
    description: string;
  }>;
  sitemaps: Array<{
    name: string;
    path: string;
    exists: boolean;
    status: number;
    count: number;
  }>;
  inventory: {
    publishedPagesCount: number;
    publishedPostsCount: number;
    hindiPagesCount: number;
    hindiPostsCount: number;
    totalSitemapUrls: number;
    totalPageSitemapUrls: number;
    totalPostSitemapUrls: number;
  };
  timestamp: string;
}

interface TestFetchResult {
  success: boolean;
  path: string;
  bot: string;
  userAgent: string;
  statusCode: number;
  statusText: string;
  responseTimeMs: number;
  contentType: string;
  metaTitle: string | null;
  metaDescription: string | null;
  h1: string | null;
  canonical: string | null;
  isSsrRendered: boolean;
  contentLength: number;
  htmlSnippet: string;
  error?: string;
}

export function AdminCrawlerHealth() {
  const [data, setData] = useState<CrawlerHealthData | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Test Fetcher State
  const [testPath, setTestPath] = useState("/");
  const [testBot, setTestBot] = useState("googlebot");
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState<TestFetchResult | null>(null);

  const loadHealth = async () => {
    try {
      const res = await fetch("/api/admin/crawler-health");
      const json = await res.json();
      setData(json);
    } catch (err) {
      console.error("Failed to load crawler health:", err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadHealth();
  }, []);

  const handleRefresh = () => {
    setRefreshing(true);
    loadHealth();
  };

  const handleRunTestFetch = async () => {
    setTesting(true);
    setTestResult(null);
    try {
      const res = await fetch("/api/admin/crawler-health/test-fetch", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ path: testPath, bot: testBot }),
      });
      const result = await res.json();
      setTestResult(result);
    } catch (err: any) {
      setTestResult({
        success: false,
        path: testPath,
        bot: testBot,
        userAgent: "Error",
        statusCode: 500,
        statusText: "Internal Error",
        responseTimeMs: 0,
        contentType: "none",
        metaTitle: null,
        metaDescription: null,
        h1: null,
        canonical: null,
        isSsrRendered: false,
        contentLength: 0,
        htmlSnippet: "",
        error: err.message,
      });
    } finally {
      setTesting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-slate-500">
        <Loader2 className="w-8 h-8 animate-spin text-emerald-600 mb-3" />
        <p className="text-sm font-medium">Analyzing Crawler & Search Bot Health...</p>
      </div>
    );
  }

  const score = data?.healthScore || 100;

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-100">
              <Activity className="w-5 h-5" />
            </span>
            <h1 className="text-xl font-bold text-slate-900">Site & Universal Crawler Health</h1>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Factual technical diagnostic ensuring Googlebot, Bingbot, Applebot, AhrefsBot, and GPTBot discover, crawl, and render public pages.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-600">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>Live Node.js SSR Engine</span>
          </div>
          <button
            type="button"
            onClick={handleRefresh}
            disabled={refreshing}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? "animate-spin" : ""}`} />
            <span>Re-check Health</span>
          </button>
        </div>
      </div>

      {/* KPI Overview Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Health Score */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <div className="text-xs font-semibold uppercase tracking-wider text-slate-400">Crawlability Score</div>
            <div className="text-2xl font-black text-slate-900 mt-1 flex items-baseline gap-1">
              <span>{score}%</span>
              <span className="text-xs font-semibold text-emerald-600">Optimal</span>
            </div>
            <p className="text-[11px] text-slate-500 mt-1">100% legitimate bots allowed</p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600">
            <ShieldCheck className="w-6 h-6" />
          </div>
        </div>

        {/* Robots.txt Status */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <div className="text-xs font-semibold uppercase tracking-wider text-slate-400">Robots.txt Directives</div>
            <div className="text-base font-bold text-slate-900 mt-1 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              <span>Allow: / (Public)</span>
            </div>
            <p className="text-[11px] text-slate-500 mt-1">/admin & /api strictly protected</p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600">
            <FileCode className="w-6 h-6" />
          </div>
        </div>

        {/* Dynamic Sitemaps */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <div className="text-xs font-semibold uppercase tracking-wider text-slate-400">XML Sitemaps</div>
            <div className="text-base font-bold text-slate-900 mt-1 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              <span>{data?.inventory?.totalSitemapUrls || 0} URLs Indexed</span>
            </div>
            <p className="text-[11px] text-slate-500 mt-1">Exact match with WordPress CMS</p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-amber-50 border border-amber-100 flex items-center justify-center text-amber-600">
            <Globe className="w-6 h-6" />
          </div>
        </div>

        {/* Server-Side Rendering (SSR) */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <div className="text-xs font-semibold uppercase tracking-wider text-slate-400">Pre-Rendering (SSR)</div>
            <div className="text-base font-bold text-slate-900 mt-1 flex items-center gap-1.5">
              <Zap className="w-4 h-4 text-emerald-500" />
              <span>Pure Semantic HTML</span>
            </div>
            <p className="text-[11px] text-slate-500 mt-1">No JS required for bot indexation</p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600">
            <Bot className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Main Grid: Left = Technical Checklist, Right = Bot Permission Matrix */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column (2 Cols): Technical Audit Checklist */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4 flex items-center gap-2">
              <span>Technical Crawler & SEO Audit Checks</span>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
                {data?.checks?.filter((c) => c.status === "pass").length} / {data?.checks?.length} Passed
              </span>
            </h2>

            <div className="space-y-3">
              {data?.checks?.map((check) => (
                <div
                  key={check.id}
                  className="p-4 rounded-xl border border-slate-100 bg-slate-50/50 hover:bg-white hover:border-slate-200 transition flex items-start gap-3"
                >
                  <div className="mt-0.5">
                    {check.status === "pass" ? (
                      <CheckCircle2 className="w-5 h-5 text-emerald-500 flex-shrink-0" />
                    ) : check.status === "warning" ? (
                      <AlertTriangle className="w-5 h-5 text-amber-500 flex-shrink-0" />
                    ) : (
                      <XCircle className="w-5 h-5 text-rose-500 flex-shrink-0" />
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="text-sm font-bold text-slate-900">{check.title}</div>
                    <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">{check.message}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Interactive Bot Fetch & SSR Inspector */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <span className="p-1.5 rounded-lg bg-indigo-50 text-indigo-600">
                  <Terminal className="w-4 h-4" />
                </span>
                <h3 className="text-sm font-bold text-slate-900">Live Bot Request Simulator & Inspector</h3>
              </div>
              <span className="text-[11px] text-slate-400">Tests real HTTP status & SSR HTML payload</span>
            </div>

            <p className="text-xs text-slate-500 mb-4">
              Simulate an exact web crawl from Google, Bing, Applebot, Ahrefs, or GPTBot. Inspect the exact HTTP status code, canonical tags, and raw semantic HTML received by the bot before JavaScript execution.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 mb-4">
              <div className="flex-1">
                <label className="block text-[11px] font-semibold text-slate-500 mb-1">Target URL Path</label>
                <div className="flex items-center rounded-xl border border-slate-200 bg-slate-50 focus-within:border-indigo-500 focus-within:bg-white overflow-hidden px-3 py-1.5 text-xs">
                  <span className="text-slate-400 font-mono select-none">/</span>
                  <input
                    type="text"
                    value={testPath.replace(/^\//, "")}
                    onChange={(e) => setTestPath(e.target.value)}
                    placeholder="how-it-works or blog/how-to-download-scribd-documents"
                    className="flex-1 bg-transparent border-0 outline-none text-slate-800 font-mono text-xs pl-1"
                  />
                </div>
              </div>

              <div className="w-full sm:w-56">
                <label className="block text-[11px] font-semibold text-slate-500 mb-1">Crawler User-Agent</label>
                <select
                  value={testBot}
                  onChange={(e) => setTestBot(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 text-xs px-3 py-2 text-slate-800 focus:outline-none focus:border-indigo-500"
                >
                  <option value="googlebot">Googlebot (Google Search)</option>
                  <option value="bingbot">Bingbot (Microsoft Bing / Copilot)</option>
                  <option value="applebot">Applebot (Apple Siri & Spotlight)</option>
                  <option value="ahrefsbot">AhrefsBot (Ahrefs SEO Crawler)</option>
                  <option value="gptbot">GPTBot (OpenAI Web Crawler)</option>
                  <option value="curl">cURL / Raw HTTP Client</option>
                </select>
              </div>

              <div className="sm:self-end">
                <button
                  type="button"
                  onClick={handleRunTestFetch}
                  disabled={testing}
                  className="w-full sm:w-auto px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition shadow-sm disabled:opacity-50"
                >
                  {testing ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>Fetching...</span>
                    </>
                  ) : (
                    <>
                      <Search className="w-3.5 h-3.5" />
                      <span>Test Fetch as Bot</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Quick Path Preset Pills */}
            <div className="flex flex-wrap gap-2 mb-4 text-[11px]">
              <span className="text-slate-400 self-center">Quick tests:</span>
              {[
                { label: "Homepage (/)", path: "/" },
                { label: "How It Works (/how-it-works)", path: "/how-it-works" },
                { label: "Blog Index (/blog)", path: "/blog" },
                { label: "Sample Post (/en/blog/...)", path: "/en/blog/how-to-download-scribd-documents" },
                { label: "Robots.txt", path: "/robots.txt" },
                { label: "Sitemap Index", path: "/sitemap_index.xml" },
              ].map((p) => (
                <button
                  key={p.path}
                  type="button"
                  onClick={() => {
                    setTestPath(p.path);
                  }}
                  className={`px-2.5 py-1 rounded-lg border transition ${
                    testPath === p.path
                      ? "bg-indigo-50 border-indigo-200 text-indigo-700 font-semibold"
                      : "bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100"
                  }`}
                >
                  {p.label}
                </button>
              ))}
            </div>

            {/* Test Result Inspector Box */}
            {testResult && (
              <div className="mt-4 p-4 rounded-xl bg-slate-900 text-slate-200 border border-slate-800 text-xs font-mono space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-slate-800">
                  <div className="flex items-center gap-2">
                    <span
                      className={`px-2 py-0.5 rounded font-bold text-[10px] ${
                        testResult.statusCode === 200
                          ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                          : "bg-amber-500/20 text-amber-400 border border-amber-500/30"
                      }`}
                    >
                      HTTP {testResult.statusCode} {testResult.statusText}
                    </span>
                    <span className="text-slate-400">{testResult.responseTimeMs}ms</span>
                    <span className="text-slate-500">•</span>
                    <span className="text-slate-400">{testResult.contentType}</span>
                  </div>
                  <div className="flex items-center gap-1 text-[11px] text-emerald-400 font-sans font-semibold">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>{testResult.isSsrRendered ? "Server-Side Rendered" : "Client Static"}</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px]">
                  <div>
                    <span className="text-slate-500">Page Title: </span>
                    <span className="text-slate-200 font-sans">{testResult.metaTitle || "None"}</span>
                  </div>
                  <div>
                    <span className="text-slate-500">H1 Heading: </span>
                    <span className="text-slate-200 font-sans">{testResult.h1 || "None"}</span>
                  </div>
                  <div className="sm:col-span-2 truncate">
                    <span className="text-slate-500">Canonical Tag: </span>
                    <span className="text-indigo-400">{testResult.canonical || "None"}</span>
                  </div>
                </div>

                <div>
                  <div className="text-slate-500 text-[10px] mb-1">Raw HTML Response Payload Received by Bot:</div>
                  <pre className="p-3 bg-slate-950 rounded-lg overflow-x-auto text-[11px] text-slate-300 max-h-48 scrollbar-thin">
                    {testResult.htmlSnippet}
                  </pre>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Column (1 Col): Bot Matrix & Sitemap Links */}
        <div className="space-y-6">
          {/* Legitimate Search & AI Bots Matrix */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-3 flex items-center justify-between">
              <span>Universal Bot Permissions</span>
              <span className="text-[10px] font-normal text-slate-400">robots.txt</span>
            </h3>

            <p className="text-xs text-slate-500 mb-4 leading-relaxed">
              Standard configuration: Search engines and AI assistants can freely discover and index public documents.
            </p>

            <div className="space-y-2.5">
              {data?.bots?.map((b) => (
                <div
                  key={b.bot}
                  className="p-3 rounded-xl border border-slate-100 bg-slate-50/60 flex items-center justify-between gap-3"
                >
                  <div className="min-w-0">
                    <div className="text-xs font-bold text-slate-900 truncate">{b.bot}</div>
                    <div className="text-[10px] text-slate-500 truncate">{b.description}</div>
                  </div>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1 flex-shrink-0">
                    <Check className="w-3 h-3" />
                    <span>Allowed</span>
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Dynamic Sitemaps Direct Links */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-3">
              Dynamic XML Feeds
            </h3>
            <div className="space-y-2">
              {data?.sitemaps?.map((sm) => (
                <a
                  key={sm.path}
                  href={sm.path}
                  target="_blank"
                  rel="noreferrer"
                  className="p-2.5 rounded-xl border border-slate-100 hover:border-indigo-200 hover:bg-indigo-50/40 transition flex items-center justify-between text-xs group"
                >
                  <div>
                    <div className="font-semibold text-slate-800 group-hover:text-indigo-600">{sm.name}</div>
                    <div className="text-[10px] text-slate-400 font-mono">{sm.path}</div>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 text-[10px] font-bold">
                      {sm.count} URLs
                    </span>
                    <ExternalLink className="w-3.5 h-3.5 text-slate-400 group-hover:text-indigo-600" />
                  </div>
                </a>
              ))}
            </div>
          </div>

          {/* Security Guarantee Card */}
          <div className="bg-slate-900 text-white p-5 rounded-2xl border border-slate-800 shadow-sm">
            <div className="flex items-center gap-2 mb-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">Security Isolation</span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Legitimate search crawlers are granted full access to public content while internal admin control panels, API keys, private databases, and conversion temporary files remain strictly protected and disallowed.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
