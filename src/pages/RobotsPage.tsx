import React, { useState, useEffect } from "react";
import {
  Bot,
  ExternalLink,
  Copy,
  Check,
  FileText,
  ShieldCheck,
  Download,
  RefreshCw,
  Globe,
  CornerDownRight,
} from "lucide-react";
import { PageRoute, SupportedLanguage } from "../types";

interface RobotsPageProps {
  onNavigate: (page: PageRoute) => void;
  currentLang?: SupportedLanguage;
}

export function RobotsPage({ onNavigate, currentLang = "en" }: RobotsPageProps) {
  const [robotsContent, setRobotsContent] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [copied, setCopied] = useState<boolean>(false);
  const [lastUpdated, setLastUpdated] = useState<string>("");

  const origin = typeof window !== "undefined" ? window.location.origin : "";

  const fetchRobots = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/robots.txt", { cache: "no-store" });
      if (res.ok) {
        const text = await res.text();
        setRobotsContent(text);
        setLastUpdated(new Date().toLocaleTimeString());
      } else {
        fallbackRobots();
      }
    } catch {
      fallbackRobots();
    } finally {
      setIsLoading(false);
    }
  };

  const fallbackRobots = () => {
    const defaultRobots = [
      "User-agent: *",
      "Allow: /",
      "Disallow: /admin",
      "Disallow: /admin123",
      "Disallow: /api/",
      "",
      `Sitemap: ${origin}/sitemap.xml`,
      `Sitemap: ${origin}/post-sitemap.xml`,
      `Sitemap: ${origin}/page-sitemap.xml`,
      `Sitemap: ${origin}/sitemap_index.xml`,
    ].join("\n");
    setRobotsContent(defaultRobots);
    setLastUpdated(new Date().toLocaleTimeString());
  };

  useEffect(() => {
    fetchRobots();
  }, []);

  const handleCopy = () => {
    if (!robotsContent) return;
    navigator.clipboard.writeText(robotsContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([robotsContent], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "robots.txt";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Parse lines for rich syntax display
  const lines = robotsContent.split("\n");

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-800 font-sans py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Breadcrumb Navigation */}
        <nav aria-label="Breadcrumb" className="mb-4 text-xs sm:text-sm text-slate-500 flex items-center gap-1.5">
          <button
            onClick={() => onNavigate("home")}
            className="hover:underline text-indigo-600 font-medium"
          >
            Home
          </button>
          <span>/</span>
          <button
            onClick={() => onNavigate("sitemap")}
            className="hover:underline text-indigo-600 font-medium"
          >
            Sitemap
          </button>
          <span>/</span>
          <span className="text-slate-800 font-semibold">robots.txt</span>
        </nav>

        {/* Header Card */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-sm mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600">
                <Bot className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900">
                    robots.txt
                  </h1>
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider bg-emerald-50 text-emerald-700 border border-emerald-200">
                    Active &amp; Live
                  </span>
                </div>
                <p className="text-sm text-slate-500 mt-1">
                  Crawler Instructions &amp; Search Engine Indexing Directives
                </p>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="flex flex-wrap items-center gap-2">
              <a
                href="/robots.txt"
                target="_blank"
                rel="noopener noreferrer"
                className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold rounded-lg inline-flex items-center gap-1.5 transition"
                title="View raw plain-text robots.txt served directly by webserver"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span>Raw Text File</span>
              </a>

              <button
                onClick={handleCopy}
                className="px-3.5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-lg inline-flex items-center gap-1.5 transition shadow-sm"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-white" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? "Copied!" : "Copy"}</span>
              </button>

              <button
                onClick={handleDownload}
                className="px-3 py-2 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 text-xs font-semibold rounded-lg inline-flex items-center gap-1.5 transition"
                title="Download robots.txt"
              >
                <Download className="w-3.5 h-3.5 text-slate-500" />
                <span>Download</span>
              </button>

              <button
                onClick={fetchRobots}
                disabled={isLoading}
                className="p-2 text-slate-500 hover:text-slate-800 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition"
                title="Refresh from server"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? "animate-spin" : ""}`} />
              </button>
            </div>
          </div>

          {/* Description & Sitemap reference */}
          <div className="mt-4 grid sm:grid-cols-2 gap-4 text-xs sm:text-sm text-slate-600">
            <div className="flex items-start gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span>
                Standard crawler access rules allowing all public search bots (Googlebot, Bingbot, Yandex) to crawl public downloader tools and documentation while safeguarding admin consoles.
              </span>
            </div>
            <div className="flex items-start gap-2">
              <Globe className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
              <span>
                Sitemaps referenced inside this file provide direct links for crawlers. View the interactive{" "}
                <button
                  onClick={() => onNavigate("sitemap")}
                  className="text-indigo-600 font-semibold hover:underline"
                >
                  XML Sitemap Table
                </button>.
              </span>
            </div>
          </div>
        </div>

        {/* Content Box */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-md">
          <div className="bg-slate-950 px-4 sm:px-6 py-3 border-b border-slate-800 flex items-center justify-between text-xs text-slate-400">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block animate-pulse"></span>
              <span className="font-mono text-slate-300 font-semibold">/robots.txt</span>
              <span className="text-slate-600">•</span>
              <span>Content-Type: text/plain; charset=utf-8</span>
            </div>
            {lastUpdated && <span>Fetched: {lastUpdated}</span>}
          </div>

          <div className="p-4 sm:p-6 font-mono text-xs sm:text-sm leading-relaxed overflow-x-auto">
            {isLoading ? (
              <div className="flex items-center justify-center py-12 text-slate-400">
                <RefreshCw className="w-5 h-5 animate-spin mr-2" />
                Loading live robots.txt from server...
              </div>
            ) : (
              <table className="w-full border-collapse">
                <tbody>
                  {lines.map((line, idx) => {
                    const trimmed = line.trim();
                    const isComment = trimmed.startsWith("#");
                    const isUserAgent = trimmed.toLowerCase().startsWith("user-agent:");
                    const isAllow = trimmed.toLowerCase().startsWith("allow:");
                    const isDisallow = trimmed.toLowerCase().startsWith("disallow:");
                    const isSitemap = trimmed.toLowerCase().startsWith("sitemap:");

                    return (
                      <tr key={idx} className="hover:bg-slate-800/40">
                        <td className="pr-4 py-0.5 text-right select-none text-slate-600 w-10 text-[11px]">
                          {idx + 1}
                        </td>
                        <td className="py-0.5 pl-2 font-mono whitespace-pre">
                          {isComment ? (
                            <span className="text-slate-500 italic">{line}</span>
                          ) : isUserAgent ? (
                            <span>
                              <span className="text-cyan-400 font-bold">User-agent:</span>
                              <span className="text-amber-300 font-bold ml-2">
                                {line.substring(line.indexOf(":") + 1)}
                              </span>
                            </span>
                          ) : isAllow ? (
                            <span>
                              <span className="text-emerald-400 font-semibold">Allow:</span>
                              <span className="text-slate-200 ml-2">
                                {line.substring(line.indexOf(":") + 1)}
                              </span>
                            </span>
                          ) : isDisallow ? (
                            <span>
                              <span className="text-rose-400 font-semibold">Disallow:</span>
                              <span className="text-rose-200 ml-2">
                                {line.substring(line.indexOf(":") + 1)}
                              </span>
                            </span>
                          ) : isSitemap ? (
                            <span>
                              <span className="text-purple-400 font-semibold">Sitemap:</span>
                              <a
                                href={line.substring(line.indexOf(":") + 1).trim()}
                                target="_blank"
                                rel="noreferrer"
                                className="text-indigo-300 hover:text-indigo-200 underline ml-2 inline-flex items-center gap-1"
                              >
                                {line.substring(line.indexOf(":") + 1).trim()}
                                <CornerDownRight className="w-3 h-3 inline" />
                              </a>
                            </span>
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

        {/* Informative Footer Links */}
        <div className="mt-8 bg-white border border-slate-200 rounded-xl p-5 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-600">
          <div className="flex items-center gap-2">
            <FileText className="w-4 h-4 text-slate-400" />
            <span>
              Direct links:{" "}
              <a href="/robots.txt" className="text-indigo-600 font-medium hover:underline">/robots.txt</a> •{" "}
              <a href="/sitemap.xml" className="text-indigo-600 font-medium hover:underline">/sitemap.xml</a> •{" "}
              <a href="/sitemap_index.xml" className="text-indigo-600 font-medium hover:underline">/sitemap_index.xml</a>
            </span>
          </div>

          <button
            onClick={() => onNavigate("sitemap")}
            className="px-3.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-lg transition"
          >
            Switch to XML Sitemap View &rarr;
          </button>
        </div>
      </div>
    </div>
  );
}
