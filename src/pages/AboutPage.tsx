import React, { useState, useEffect } from "react";
import { ShieldCheck, Zap, Users, Sparkles, Heart, FileDown, CheckCircle2, Globe, Cpu } from "lucide-react";
import { PageRoute, SupportedLanguage } from "../types";
import { loadPageContent } from "../data/siteConfig";

interface AboutPageProps {
  onNavigate: (page: PageRoute) => void;
  onCtaClick: () => void;
  currentLang?: SupportedLanguage;
}

export function AboutPage({ onNavigate, onCtaClick, currentLang = "en" }: AboutPageProps) {
  const [pageData, setPageData] = useState<any>(null);
  useEffect(() => {
    const contents = loadPageContent();
    const match =
      contents.find((c) => c.pageKey === "about" && c.language === currentLang) ||
      contents.find((c) => c.id === `about-${currentLang}`) ||
      contents.find((c) => c.id === "about");
    if (match) setPageData(match);
  }, [currentLang]);
  const stats = [
    { value: "4.8M+", label: "Documents Converted", helper: "Across 140+ countries" },
    { value: "99.8%", label: "Conversion Success Rate", helper: "Optimized parser pipeline" },
    { value: "3.8s", label: "Average Conversion Speed", helper: "High-throughput cloud engine" },
    { value: "0 Logs", label: "Zero Retention Guarantee", helper: "Strict ephemeral privacy" },
  ];

  const values = [
    {
      icon: Zap,
      title: "Lightweight & Blazing Fast",
      desc: "No bloat, no invasive tracking scripts, and no artificial delays. We believe document conversion tools should be instant and distraction-free.",
    },
    {
      icon: ShieldCheck,
      title: "Privacy First by Default",
      desc: "All converted assets and compiled PDF buffers are processed strictly in ephemeral memory and automatically purged after download.",
    },
    {
      icon: Globe,
      title: "Universal Knowledge Access",
      desc: "Enabling students, researchers, and educators worldwide to access public educational slide decks and papers offline without barrier.",
    },
    {
      icon: Cpu,
      title: "Engineered Craftsmanship",
      desc: "Precision vector assembly ensures slide presentations, diagrams, and typography remain sharp and printable at any scale.",
    },
  ];

  return (
    <div className="bg-slate-50 min-h-screen py-10 sm:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-16">
        
        {/* Breadcrumbs */}
        <div className="flex items-center gap-2 text-xs text-slate-500">
          <button
            type="button"
            onClick={() => onNavigate("home")}
            className="hover:text-indigo-600 transition"
          >
            Home
          </button>
          <span>/</span>
          <span className="text-slate-900 font-semibold">About Us</span>
        </div>

        {/* Hero & Mission Statement */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-3.5 py-1 rounded-full border border-indigo-100">
            Our Purpose & Mission
          </span>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight">
            {pageData?.title || "Making Public Knowledge Accessible, Offline and Permanent"}
          </h1>
          <p className="text-base sm:text-lg text-slate-600 leading-relaxed whitespace-pre-wrap">
            {pageData?.content || "Scribd PDF Downloader was built to bridge the gap between web-only document platforms and offline reading tools like e-ink tablets, laptops, and academic binders."}
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {stats.map((stat, idx) => (
            <div
              key={idx}
              className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs text-center space-y-1.5"
            >
              <div className="text-2xl sm:text-4xl font-extrabold text-slate-900 font-mono tracking-tight bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                {stat.value}
              </div>
              <p className="text-xs sm:text-sm font-bold text-slate-800">{stat.label}</p>
              <p className="text-[11px] text-slate-500">{stat.helper}</p>
            </div>
          ))}
        </div>

        {/* Why Users Choose It Grid */}
        <div className="space-y-8">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              Why Students & Researchers Choose Us
            </h2>
            <p className="text-sm text-slate-600">
              Built with an uncompromising standard of speed, security, and document fidelity.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {values.map((v, i) => {
              const Icon = v.icon;
              return (
                <div
                  key={i}
                  className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200/90 shadow-xs flex items-start gap-4"
                >
                  <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0 border border-indigo-100">
                    <Icon className="w-6 h-6" />
                  </div>
                  <div className="space-y-1.5">
                    <h3 className="text-base font-bold text-slate-900">{v.title}</h3>
                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">{v.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Technical Architecture Narrative */}
        <div className="bg-white rounded-3xl p-8 sm:p-12 border border-slate-200 shadow-sm grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-7 space-y-4">
            <span className="text-xs font-bold uppercase tracking-wider text-purple-600 bg-purple-50 px-3 py-1 rounded-full border border-purple-100">
              The Technology
            </span>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              High-Precision Node.js system Pipeline
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Unlike generic screen-capture tools that take blurry raster snapshots of browser viewports, our engine parses the underlying Scribd document asset manifests directly. We request the original high-DPI slide images and SVG glyph blocks, reassembling them with exact millimeter dimensions.
            </p>
            <div className="space-y-2 pt-2 text-xs text-slate-700">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>Supports both slide presentations and continuous scroll documents</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>Preserves original aspect ratios and high-definition diagrams</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>Zero server telemetry or personal identifier logging</span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-5 bg-slate-900 rounded-2xl p-6 text-slate-300 font-mono text-xs border border-slate-800 space-y-3">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2 text-[10px] text-slate-500">
              <span>system_CORE_V2.log</span>
              <span className="text-emerald-400">STATUS: ACTIVE</span>
            </div>
            <p className="text-indigo-400">&gt; fetch_manifest(scribd_doc_id)</p>
            <p className="text-slate-400">&gt; found 32 pages at 300 DPI</p>
            <p className="text-slate-400">&gt; compiling vector PDF container...</p>
            <p className="text-emerald-400">&gt; PDF compilation complete [14.2 MB]</p>
            <p className="text-slate-500">&gt; ephemeral cleanup scheduled</p>
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="text-center bg-gradient-to-r from-indigo-600 via-indigo-700 to-purple-700 rounded-3xl p-8 sm:p-12 text-white shadow-xl shadow-indigo-600/15 space-y-4">
          <h2 className="text-2xl sm:text-3xl font-extrabold">Ready to Download Your First Document?</h2>
          <p className="text-xs sm:text-sm text-indigo-100 max-w-lg mx-auto">
            Paste any Scribd URL into our downloader to receive your clean PDF file immediately.
          </p>
          <button
            type="button"
            onClick={() => {
              onNavigate("home");
              setTimeout(onCtaClick, 100);
            }}
            className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-white hover:bg-slate-50 text-indigo-900 font-bold text-xs sm:text-sm transition shadow-lg active:scale-95 cursor-pointer"
          >
            <FileDown className="w-4 h-4" />
            <span>Launch Web Downloader</span>
          </button>
        </div>

      </div>
    </div>
  );
}
