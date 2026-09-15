import React, { useState } from "react";
import { Globe, FileText, Check, Copy, Download, ArrowLeft, ExternalLink } from "lucide-react";
import { PageRoute, BlogPost } from "../types";
import { BLOG_POSTS } from "../data/blogData";

interface SitemapPageProps {
  onNavigate: (page: PageRoute) => void;
  onSelectPost: (post: BlogPost) => void;
}

export function SitemapPage({ onNavigate, onSelectPost }: SitemapPageProps) {
  const [copied, setCopied] = useState(false);

  const pages = [
    { title: "Home / PDF Downloader", url: "/", priority: "1.0", changefreq: "daily", page: "home" as PageRoute },
    { title: "How It Works & Technical Architecture", url: "/how-it-works", priority: "0.8", changefreq: "weekly", page: "how-it-works" as PageRoute },
    { title: "Blog & Guide Knowledge Base", url: "/blog", priority: "0.9", changefreq: "daily", page: "blog" as PageRoute },
    { title: "About Us & Engineering Mission", url: "/about", priority: "0.6", changefreq: "monthly", page: "about" as PageRoute },
    { title: "Contact Support & Feedback", url: "/contact", priority: "0.6", changefreq: "monthly", page: "contact" as PageRoute },
    { title: "Privacy Policy & Zero Retention", url: "/privacy", priority: "0.5", changefreq: "monthly", page: "privacy" as PageRoute },
    { title: "Terms of Service & Fair Use", url: "/terms", priority: "0.5", changefreq: "monthly", page: "terms" as PageRoute },
  ];

  const xmlContent = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${pages
  .map(
    (p) => `  <url>
    <loc>${window.location.origin}${p.url}</loc>
    <lastmod>${new Date().toISOString().split("T")[0]}</lastmod>
    <changefreq>${p.changefreq}</changefreq>
    <priority>${p.priority}</priority>
  </url>`
  )
  .join("\n")}
${BLOG_POSTS.map(
  (b) => `  <url>
    <loc>${window.location.origin}/blog/${b.slug}</loc>
    <lastmod>${b.date}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`
).join("\n")}
</urlset>`;

  const handleCopyXml = () => {
    navigator.clipboard.writeText(xmlContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadXml = () => {
    const blob = new Blob([xmlContent], { type: "application/xml" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "sitemap.xml";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="bg-slate-50 min-h-screen py-10 sm:py-14">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 space-y-8">
        {/* Header */}
        <div className="space-y-3 pb-6 border-b border-slate-200">
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <button
              type="button"
              onClick={() => onNavigate("home")}
              className="hover:text-indigo-600 transition"
            >
              Home
            </button>
            <span>/</span>
            <span className="text-slate-900 font-semibold">XML Sitemap</span>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                Search Engine Sitemap (XML & HTML)
              </h1>
              <p className="text-xs sm:text-sm text-slate-600 mt-1">
                Index of all public pages, tools, and research guides published on Scribd PDF Downloader.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleCopyXml}
                className="px-3.5 py-2 rounded-xl bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-semibold inline-flex items-center gap-1.5 shadow-xs transition"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-slate-500" />}
                <span>{copied ? "Copied" : "Copy XML"}</span>
              </button>
              <button
                type="button"
                onClick={handleDownloadXml}
                className="px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold inline-flex items-center gap-1.5 shadow-xs transition"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download sitemap.xml</span>
              </button>
            </div>
          </div>
        </div>

        {/* HTML Directory */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-6 shadow-xs">
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <Globe className="w-4 h-4 text-indigo-600" />
            <span>Main Platform Pages</span>
          </h2>

          <div className="divide-y divide-slate-100">
            {pages.map((p, idx) => (
              <div key={idx} className="py-3 flex items-center justify-between gap-4">
                <div>
                  <button
                    type="button"
                    onClick={() => onNavigate(p.page)}
                    className="text-xs sm:text-sm font-semibold text-indigo-600 hover:underline text-left block"
                  >
                    {p.title}
                  </button>
                  <span className="text-[11px] font-mono text-slate-400">{p.url}</span>
                </div>
                <div className="flex items-center gap-3 text-right shrink-0">
                  <span className="text-[10px] font-mono bg-slate-100 text-slate-600 px-2 py-0.5 rounded">
                    Priority: {p.priority}
                  </span>
                  <span className="text-[10px] text-slate-400 hidden sm:inline">{p.changefreq}</span>
                </div>
              </div>
            ))}
          </div>

          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2 pt-4">
            <FileText className="w-4 h-4 text-indigo-600" />
            <span>Blog Articles & Guides ({BLOG_POSTS.length})</span>
          </h2>

          <div className="divide-y divide-slate-100">
            {BLOG_POSTS.map((b) => (
              <div key={b.id} className="py-3 flex items-center justify-between gap-4">
                <div>
                  <button
                    type="button"
                    onClick={() => onSelectPost(b)}
                    className="text-xs sm:text-sm font-semibold text-indigo-600 hover:underline text-left block"
                  >
                    {b.title}
                  </button>
                  <span className="text-[11px] font-mono text-slate-400">/blog/{b.slug}</span>
                </div>
                <span className="text-[10px] font-mono bg-slate-100 text-slate-600 px-2 py-0.5 rounded shrink-0">
                  Priority: 0.8
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Raw XML Snippet */}
        <div className="bg-slate-950 rounded-2xl border border-slate-800 p-6 space-y-3 text-slate-300">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono text-slate-400">Raw sitemap.xml Preview</span>
            <span className="text-[10px] font-mono bg-slate-800 px-2 py-0.5 rounded text-indigo-300">
              Valid W3C Sitemap Protocol
            </span>
          </div>
          <pre className="text-[11px] font-mono leading-relaxed overflow-x-auto p-3 bg-slate-900 rounded-xl max-h-60 overflow-y-auto text-slate-300">
            {xmlContent}
          </pre>
        </div>
      </div>
    </div>
  );
}
