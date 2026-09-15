import React, { useState } from "react";
import {
  Sparkles,
  Monitor,
  Smartphone,
  Layers,
  Palette,
  Type,
  FileDown,
  CheckCircle2,
  ExternalLink,
  MousePointer,
  ArrowRight,
  Eye,
  Zap,
  ShieldCheck,
  Search,
  Filter,
  Download,
  BookOpen,
  Mail,
  HelpCircle,
  FolderArchive,
  FileText
} from "lucide-react";

interface PresentationBoardProps {
  onOpenLiveSite: () => void;
}

export function PresentationBoard({ onOpenLiveSite }: PresentationBoardProps) {
  const [boardFilter, setBoardFilter] = useState<"all" | "desktop" | "mobile" | "tokens">("all");
  const [zoomLevel, setZoomLevel] = useState<"fit" | "compact">("fit");

  const colors = [
    { name: "Brand Indigo", hex: "#4F46E5", role: "Primary CTA & Action Gradients", bg: "bg-indigo-600", text: "text-white" },
    { name: "Brand Purple", hex: "#7C3AED", role: "Secondary Accent & Visual Gradients", bg: "bg-purple-600", text: "text-white" },
    { name: "Deep Charcoal", hex: "#0F172A", role: "Headings & High-Contrast Typography", bg: "bg-slate-900", text: "text-white" },
    { name: "Slate Neutral", hex: "#475569", role: "Body Copy & Secondary Labels", bg: "bg-slate-600", text: "text-white" },
    { name: "Surface Clean", hex: "#F8FAFC", role: "Application Background & Card Insets", bg: "bg-slate-100", text: "text-slate-900", border: true },
    { name: "Success Emerald", hex: "#10B981", role: "Live Status & Verified Badges", bg: "bg-emerald-500", text: "text-white" },
  ];

  const typography = [
    { level: "Display Headline", size: "48px / 1.15", weight: "800 ExtraBold", sample: "Download Scribd Documents as PDF" },
    { level: "Section Heading (H2)", size: "30px / 1.25", weight: "800 ExtraBold", sample: "Engineered for Effortless Extraction" },
    { level: "Subheading (H3)", size: "20px / 1.3", weight: "700 Bold", sample: "Fast PDF Processing & Previews" },
    { level: "Body Text", size: "15px / 1.6", weight: "400 Regular", sample: "Convert public research papers and slide decks into crisp, universal files." },
    { level: "Mono / Logs", size: "12px / 1.5", weight: "600 SemiBold", sample: "> scraping manifest: 32 pages verified" },
  ];

  return (
    <div className="bg-slate-950 text-slate-100 min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      {/* Top Presentation Showcase Header */}
      <div className="max-w-7xl mx-auto space-y-6 pb-8 border-b border-slate-800">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-bold border border-indigo-500/30">
              <Sparkles className="w-3.5 h-3.5" />
              <span>UI/UX Design Showcase & Design System</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
              Scribd PDF Downloader — Design Board
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 max-w-2xl">
              Cohesive design system, production artboards, responsive 1440px desktop layouts, and 390px mobile viewports for a modern SaaS document converter.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              id="presentation-live-site-btn"
              onClick={onOpenLiveSite}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white text-xs sm:text-sm font-bold shadow-lg shadow-indigo-500/25 transition cursor-pointer"
            >
              <MousePointer className="w-4 h-4" />
              <span>Launch Live Working Website</span>
            </button>
          </div>
        </div>

        {/* Artboard Filter Tabs & Zoom */}
        <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
          <div className="flex items-center gap-1.5 bg-slate-900 p-1 rounded-xl border border-slate-800">
            <button
              type="button"
              onClick={() => setBoardFilter("all")}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                boardFilter === "all" ? "bg-indigo-600 text-white" : "text-slate-400 hover:text-white"
              }`}
            >
              All Artboards
            </button>
            <button
              type="button"
              onClick={() => setBoardFilter("desktop")}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition flex items-center gap-1.5 ${
                boardFilter === "desktop" ? "bg-indigo-600 text-white" : "text-slate-400 hover:text-white"
              }`}
            >
              <Monitor className="w-3.5 h-3.5" />
              <span>Desktop (1440px)</span>
            </button>
            <button
              type="button"
              onClick={() => setBoardFilter("mobile")}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition flex items-center gap-1.5 ${
                boardFilter === "mobile" ? "bg-indigo-600 text-white" : "text-slate-400 hover:text-white"
              }`}
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span>Mobile (390px)</span>
            </button>
            <button
              type="button"
              onClick={() => setBoardFilter("tokens")}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition flex items-center gap-1.5 ${
                boardFilter === "tokens" ? "bg-indigo-600 text-white" : "text-slate-400 hover:text-white"
              }`}
            >
              <Palette className="w-3.5 h-3.5" />
              <span>Design System Tokens</span>
            </button>
          </div>

          <div className="text-xs text-slate-500 hidden sm:block">
            <span>Grid scale: 8pt baseline • Math radii: 12px / 16px</span>
          </div>
        </div>
      </div>

      {/* Main Artboards Container */}
      <div className="max-w-7xl mx-auto py-10 space-y-16">

        {/* SECTION 1: DESIGN SYSTEM TOKENS & ATOMS */}
        {(boardFilter === "all" || boardFilter === "tokens") && (
          <div className="space-y-6">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-indigo-500" />
              <h2 className="text-xl font-bold text-white tracking-tight">
                01. Brand Identity & Design System Specification
              </h2>
            </div>

            {/* Color Swatches Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
              {colors.map((c, i) => (
                <div key={i} className="bg-slate-900 rounded-2xl p-3 border border-slate-800 space-y-2.5">
                  <div className={`h-16 rounded-xl ${c.bg} ${c.border ? "border border-slate-300" : ""} shadow-inner flex items-end p-2`}>
                    <span className={`text-[10px] font-mono font-bold ${c.text}`}>{c.hex}</span>
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-200">{c.name}</p>
                    <p className="text-[10px] text-slate-400 mt-0.5 leading-snug">{c.role}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Typography Scale Grid */}
            <div className="bg-slate-900 rounded-2xl p-6 border border-slate-800 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-300">
                  <Type className="w-4 h-4 text-indigo-400" />
                  <span>Typography Scale (Plus Jakarta Sans)</span>
                </div>
                <span className="text-[11px] text-slate-500 font-mono">Major Second (1.125 - 1.25)</span>
              </div>

              <div className="space-y-4">
                {typography.map((t, idx) => (
                  <div key={idx} className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 border-b border-slate-800/60 pb-3 last:border-0">
                    <div className="space-y-0.5">
                      <span className="text-[10px] font-mono text-indigo-400">{t.level} • {t.size} • {t.weight}</span>
                      <p className="text-sm sm:text-base font-bold text-slate-100">{t.sample}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* UI Atoms Showcase (Inputs, Buttons, Badges) */}
            <div className="bg-slate-900 rounded-2xl p-6 border border-slate-800 space-y-4">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-300">
                Core Interactive UI Atoms
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-2">
                {/* Primary Button */}
                <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
                  <span className="text-[10px] text-slate-500 font-mono">Primary Button (Gradient)</span>
                  <button type="button" className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-sm">
                    <FileDown className="w-4 h-4" />
                    <span>Download PDF</span>
                  </button>
                </div>

                {/* Secondary Button */}
                <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
                  <span className="text-[10px] text-slate-500 font-mono">Secondary Button</span>
                  <button type="button" className="w-full py-2.5 px-4 rounded-xl bg-white text-slate-900 font-bold text-xs flex items-center justify-center gap-2">
                    <span>View Documentation</span>
                  </button>
                </div>

                {/* Input with Paste Trigger */}
                <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
                  <span className="text-[10px] text-slate-500 font-mono">URL Input with Action</span>
                  <div className="relative flex items-center">
                    <input
                      type="text"
                      readOnly
                      value="https://scribd.com/doc..."
                      className="w-full bg-slate-900 border border-slate-700 text-[11px] rounded-lg pl-2.5 pr-14 py-2 text-slate-300"
                    />
                    <span className="absolute right-1.5 px-2 py-0.5 rounded bg-indigo-600 text-[10px] font-bold text-white">
                      Paste
                    </span>
                  </div>
                </div>

                {/* Status Badges */}
                <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
                  <span className="text-[10px] text-slate-500 font-mono">Semantic Status Badges</span>
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] font-bold border border-emerald-500/30">
                      Operational
                    </span>
                    <span className="px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 text-[10px] font-bold border border-indigo-500/30">
                      Vector 300 DPI
                    </span>
                    <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 text-[10px] font-bold border border-amber-500/30">
                      Processing
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* SECTION 2: DESKTOP 1440px ARTBOARDS */}
        {(boardFilter === "all" || boardFilter === "desktop") && (
          <div className="space-y-10">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-indigo-400" />
              <h2 className="text-xl font-bold text-white tracking-tight">
                02. Desktop Showcase (1440px Viewports)
              </h2>
            </div>

            {/* Artboard 1: Desktop Homepage */}
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span className="font-bold text-slate-200">Artboard 1: Desktop Homepage (1440px)</span>
                <span className="font-mono text-[11px]">Header • Downloader Hero • Features • How It Works • Blog Preview • FAQ</span>
              </div>

              <div className="bg-white text-slate-900 rounded-2xl shadow-2xl border border-slate-700 overflow-hidden">
                {/* Mock Browser Header */}
                <div className="bg-slate-100 border-b border-slate-200 px-4 py-2.5 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-rose-400" />
                    <div className="w-3 h-3 rounded-full bg-amber-400" />
                    <div className="w-3 h-3 rounded-full bg-emerald-400" />
                    <span className="text-[11px] font-mono text-slate-500 ml-3">https://scribddownloader.io</span>
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-200 text-slate-600 font-mono">1440 x 960</span>
                </div>

                {/* Mini Homepage Preview Canvas */}
                <div className="p-6 sm:p-10 space-y-12 bg-gradient-to-b from-white via-slate-50/50 to-slate-50">
                  {/* Header Bar */}
                  <div className="flex items-center justify-between border-b border-slate-200 pb-4">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center font-bold text-xs">
                        <FileDown className="w-4 h-4" />
                      </div>
                      <span className="font-extrabold text-sm text-slate-900">Scribd PDF Downloader</span>
                    </div>

                    <div className="flex items-center gap-4 text-xs font-semibold text-slate-600">
                      <span>Home</span>
                      <span>How It Works</span>
                      <span>Blog</span>
                      <span>About</span>
                      <span>Contact</span>
                    </div>

                    <div className="px-3 py-1.5 rounded-lg bg-indigo-600 text-white text-xs font-bold">
                      Download PDF
                    </div>
                  </div>

                  {/* Hero Grid */}
                  <div className="grid grid-cols-12 gap-8 items-center">
                    <div className="col-span-7 space-y-4">
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-100">
                        High Speed Document Extractor
                      </span>
                      <h3 className="text-3xl font-extrabold text-slate-900 leading-tight">
                        Download Scribd Documents as High-Quality PDF
                      </h3>
                      <p className="text-xs text-slate-600">
                        Convert public Scribd presentations, research papers, and slide decks into clean PDF files in seconds.
                      </p>

                      {/* Mock Downloader Card */}
                      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-md space-y-3">
                        <div className="relative flex items-center">
                          <input
                            type="text"
                            readOnly
                            value="https://www.scribd.com/document/477711709/mara-maravilha-pdf"
                            className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg pl-3 pr-16 py-2.5 text-slate-700"
                          />
                          <span className="absolute right-2 px-2 py-1 rounded bg-slate-200 text-[10px] font-bold text-slate-700">
                            Paste
                          </span>
                        </div>
                        <div className="flex gap-2">
                          <div className="flex-1 py-1.5 px-3 rounded-lg bg-indigo-50 text-indigo-700 text-[11px] font-bold border border-indigo-200">
                            Merged PDF (.pdf)
                          </div>
                          <div className="flex-1 py-1.5 px-3 rounded-lg bg-slate-50 text-slate-600 text-[11px] font-medium border border-slate-200">
                            Page Images (.zip)
                          </div>
                        </div>
                        <button type="button" className="w-full py-2.5 rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-xs font-bold flex items-center justify-center gap-1.5">
                          <FileDown className="w-3.5 h-3.5" />
                          <span>Fetch & Download PDF</span>
                        </button>
                      </div>
                    </div>

                    <div className="col-span-5 bg-slate-100 rounded-xl p-5 border border-slate-200 space-y-3">
                      <div className="flex items-center justify-between text-[10px] text-slate-500 border-b border-slate-200 pb-2">
                        <span>Vector Preview Canvas</span>
                        <span>Page 1 of 24</span>
                      </div>
                      <div className="aspect-[4/3] bg-white rounded-lg border border-slate-200 p-3 space-y-2">
                        <div className="h-3 w-24 bg-indigo-200 rounded" />
                        <div className="h-2.5 w-full bg-slate-100 rounded" />
                        <div className="h-2.5 w-4/5 bg-slate-100 rounded" />
                        <div className="h-16 bg-indigo-50 rounded-md flex items-center justify-center text-[10px] font-bold text-indigo-600">
                          Document Vector Layer
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* 3 Steps Strip */}
                  <div className="grid grid-cols-3 gap-4 pt-4 border-t border-slate-200">
                    <div className="p-3 bg-white rounded-xl border border-slate-200 text-center space-y-1">
                      <span className="text-xs font-mono font-bold text-indigo-600">01</span>
                      <p className="text-xs font-bold text-slate-800">Paste Scribd URL</p>
                      <p className="text-[10px] text-slate-500">Auto-cleans tracking params</p>
                    </div>
                    <div className="p-3 bg-white rounded-xl border border-slate-200 text-center space-y-1">
                      <span className="text-xs font-mono font-bold text-purple-600">02</span>
                      <p className="text-xs font-bold text-slate-800">Fetch & Preview</p>
                      <p className="text-[10px] text-slate-500">300 DPI high resolution</p>
                    </div>
                    <div className="p-3 bg-white rounded-xl border border-slate-200 text-center space-y-1">
                      <span className="text-xs font-mono font-bold text-emerald-600">03</span>
                      <p className="text-xs font-bold text-slate-800">Direct Download</p>
                      <p className="text-[10px] text-slate-500">PDF or ZIP ready instantly</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Artboard 2: Downloader Card Component Lifecycle States */}
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span className="font-bold text-slate-200">Artboard 2: Downloader Component UI Lifecycle (4 States)</span>
                <span className="font-mono text-[11px]">Empty/Default &gt; Scraping &gt; Document Preview &gt; Completed Direct Download</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* State 1: Default / Input */}
                <div className="bg-slate-900 rounded-xl p-5 border border-slate-800 space-y-3">
                  <span className="text-[10px] uppercase font-bold text-indigo-400 bg-indigo-500/20 px-2 py-0.5 rounded">
                    State 1: Initial Link Input
                  </span>
                  <div className="bg-white rounded-xl p-4 text-slate-900 space-y-2.5">
                    <label className="text-[11px] font-bold text-slate-700 block">Scribd URL</label>
                    <div className="relative flex items-center">
                      <input
                        type="text"
                        readOnly
                        value="https://pt.scribd.com/document/477711709/..."
                        className="w-full text-xs border border-slate-300 rounded-lg px-2.5 py-2"
                      />
                      <span className="absolute right-1.5 px-2 py-0.5 rounded bg-slate-100 text-[10px] font-bold text-slate-600">
                        Paste
                      </span>
                    </div>
                    <button type="button" className="w-full py-2 bg-indigo-600 text-white rounded-lg text-xs font-bold">
                      Fetch PDF
                    </button>
                  </div>
                </div>

                {/* State 2: Scraping in progress */}
                <div className="bg-slate-900 rounded-xl p-5 border border-slate-800 space-y-3">
                  <span className="text-[10px] uppercase font-bold text-amber-400 bg-amber-500/20 px-2 py-0.5 rounded">
                    State 2: Scraping & Progress Stream
                  </span>
                  <div className="bg-white rounded-xl p-4 text-slate-900 space-y-2.5">
                    <div className="flex justify-between text-xs font-bold">
                      <span>Downloading slide 14 of 24...</span>
                      <span className="text-indigo-600 font-mono">58%</span>
                    </div>
                    <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div className="w-[58%] h-full bg-gradient-to-r from-indigo-600 to-purple-600" />
                    </div>
                    <div className="bg-slate-900 text-slate-300 p-2 rounded text-[10px] font-mono">
                      &gt; parsed page 14: 1600x1200px JPEG fetched
                    </div>
                  </div>
                </div>

                {/* State 3: Page Previews */}
                <div className="bg-slate-900 rounded-xl p-5 border border-slate-800 space-y-3">
                  <span className="text-[10px] uppercase font-bold text-purple-400 bg-purple-500/20 px-2 py-0.5 rounded">
                    State 3: Multi-Page Thumbnail Preview
                  </span>
                  <div className="bg-white rounded-xl p-4 text-slate-900 space-y-2.5">
                    <div className="flex justify-between text-xs font-bold">
                      <span>Verified 4 Pages Preview</span>
                      <span className="text-emerald-600">300 DPI</span>
                    </div>
                    <div className="grid grid-cols-4 gap-2">
                      {[1, 2, 3, 4].map((n) => (
                        <div key={n} className="aspect-[3/4] bg-indigo-50 border border-indigo-100 rounded flex flex-col items-center justify-center text-[10px] font-bold text-indigo-700">
                          Slide #{n}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* State 4: Completed Download Ready */}
                <div className="bg-slate-900 rounded-xl p-5 border border-slate-800 space-y-3">
                  <span className="text-[10px] uppercase font-bold text-emerald-400 bg-emerald-500/20 px-2 py-0.5 rounded">
                    State 4: Download Ready & File Size
                  </span>
                  <div className="bg-white rounded-xl p-4 text-slate-900 space-y-2.5">
                    <div className="flex items-center gap-2 p-2 bg-emerald-50 text-emerald-800 rounded-lg text-xs font-bold">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      <span>Document Processed Successfully</span>
                    </div>
                    <div className="flex items-center justify-between text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-lg">
                      <div>
                        <p className="font-bold">1990-02-mara-maravilha.pdf</p>
                        <p className="text-[10px] text-slate-500">Universal PDF • 4.8 MB</p>
                      </div>
                      <span className="px-3 py-1.5 rounded-lg bg-indigo-600 text-white font-bold text-[11px]">
                        Save PDF
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Artboard 3 & 4: Blog Listing & Article Page */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Artboard 3: Blog Listing */}
              <div className="space-y-2">
                <span className="text-xs font-bold text-slate-200">Artboard 3: Blog & Knowledge Hub (1440px)</span>
                <div className="bg-white text-slate-900 rounded-xl p-6 border border-slate-700 shadow-xl space-y-4">
                  <div className="flex justify-between items-center border-b border-slate-100 pb-2">
                    <span className="font-bold text-sm">Blog & Tutorials</span>
                    <div className="flex gap-1">
                      <span className="px-2 py-0.5 rounded bg-indigo-600 text-white text-[10px]">All</span>
                      <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-600 text-[10px]">Guides</span>
                      <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-600 text-[10px]">Tech</span>
                    </div>
                  </div>
                  <div className="aspect-[16/9] bg-slate-100 rounded-lg p-4 flex flex-col justify-end text-left space-y-1">
                    <span className="text-[9px] font-bold text-indigo-600 uppercase">Featured Guide</span>
                    <p className="font-bold text-xs text-slate-900">How to Download Scribd Documents as PDF (2026 Guide)</p>
                    <p className="text-[10px] text-slate-500">4 min read • Marcus Vance</p>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="p-2 border border-slate-100 rounded bg-slate-50 text-[10px]">
                      <p className="font-bold text-slate-800">Previewing Before Download</p>
                      <p className="text-slate-500">Safe reading practices...</p>
                    </div>
                    <div className="p-2 border border-slate-100 rounded bg-slate-50 text-[10px]">
                      <p className="font-bold text-slate-800">Academic Paper Archiving</p>
                      <p className="text-slate-500">Optimizing e-ink displays...</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Artboard 4: Blog Article Reader */}
              <div className="space-y-2">
                <span className="text-xs font-bold text-slate-200">Artboard 4: Article Reader Layout (1440px)</span>
                <div className="bg-white text-slate-900 rounded-xl p-6 border border-slate-700 shadow-xl space-y-4">
                  <div className="flex justify-between items-center text-[10px] text-slate-500 border-b border-slate-100 pb-2">
                    <span>Home &gt; Blog &gt; Guide</span>
                    <span className="text-indigo-600 font-bold">Share Article</span>
                  </div>
                  <h4 className="text-sm font-extrabold text-slate-900">
                    Understanding Scribd Document Structures & Vector Pages
                  </h4>
                  <div className="grid grid-cols-12 gap-3">
                    <div className="col-span-8 space-y-2 text-[10px] text-slate-600">
                      <p className="bg-slate-50 p-2 rounded">
                        Scribd documents render either through vector glyph layers or high-resolution canvas tiles...
                      </p>
                      <div className="p-2 bg-indigo-50 border border-indigo-100 rounded text-indigo-900">
                        <strong>Author Insight:</strong> Check resolution before committing to a 40MB PDF compilation.
                      </div>
                    </div>
                    <div className="col-span-4 bg-slate-50 p-2 rounded border border-slate-200 text-[9px] space-y-1">
                      <span className="font-bold block text-slate-700">Table of Contents</span>
                      <p className="text-indigo-600">1. Document Structures</p>
                      <p className="text-slate-500">2. Copying URLs</p>
                      <p className="text-slate-500">3. Resolution & DPI</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Artboard 5 & 6: About & Contact */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Artboard 5: About & Stats */}
              <div className="space-y-2">
                <span className="text-xs font-bold text-slate-200">Artboard 5: About Us & Trust Metrics (1440px)</span>
                <div className="bg-white text-slate-900 rounded-xl p-6 border border-slate-700 shadow-xl space-y-3">
                  <div className="flex justify-between items-center border-b border-slate-100 pb-2">
                    <span className="font-bold text-xs text-slate-800">Our Mission & Metrics</span>
                    <span className="text-[10px] text-emerald-600 font-bold">99.8% Success</span>
                  </div>
                  <div className="grid grid-cols-4 gap-2 text-center">
                    <div className="bg-slate-50 p-2 rounded border border-slate-100">
                      <p className="text-xs font-bold text-indigo-600">4.8M+</p>
                      <p className="text-[9px] text-slate-500">Docs Converted</p>
                    </div>
                    <div className="bg-slate-50 p-2 rounded border border-slate-100">
                      <p className="text-xs font-bold text-indigo-600">3.8s</p>
                      <p className="text-[9px] text-slate-500">Avg Speed</p>
                    </div>
                    <div className="bg-slate-50 p-2 rounded border border-slate-100">
                      <p className="text-xs font-bold text-indigo-600">140+</p>
                      <p className="text-[9px] text-slate-500">Countries</p>
                    </div>
                    <div className="bg-slate-50 p-2 rounded border border-slate-100">
                      <p className="text-xs font-bold text-indigo-600">0 Logs</p>
                      <p className="text-[9px] text-slate-500">Retention</p>
                    </div>
                  </div>
                  <p className="text-[10px] text-slate-600 leading-relaxed">
                    Designed to bridge the gap between web documents and offline reading tools like Kindle and reMarkable.
                  </p>
                </div>
              </div>

              {/* Artboard 6: Contact & Support */}
              <div className="space-y-2">
                <span className="text-xs font-bold text-slate-200">Artboard 6: Contact & Support Center (1440px)</span>
                <div className="bg-white text-slate-900 rounded-xl p-6 border border-slate-700 shadow-xl space-y-3">
                  <div className="flex justify-between items-center border-b border-slate-100 pb-2">
                    <span className="font-bold text-xs text-slate-800">Direct Developer Inquiries</span>
                    <span className="text-[10px] text-slate-500">&lt; 12h Response</span>
                  </div>
                  <div className="space-y-2 text-[10px]">
                    <div className="grid grid-cols-2 gap-2">
                      <input type="text" readOnly value="Jane Doe" className="bg-slate-50 border border-slate-200 p-1.5 rounded" />
                      <input type="text" readOnly value="jane@domain.edu" className="bg-slate-50 border border-slate-200 p-1.5 rounded" />
                    </div>
                    <input type="text" readOnly value="Broken / Unparsable Scribd Link" className="w-full bg-slate-50 border border-slate-200 p-1.5 rounded" />
                    <textarea readOnly rows={2} value="Having trouble parsing document ID #477711709..." className="w-full bg-slate-50 border border-slate-200 p-1.5 rounded" />
                    <button type="button" className="w-full py-1.5 bg-slate-900 text-white rounded font-bold">
                      Submit Inquiry
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* SECTION 3: MOBILE 390px ARTBOARDS */}
        {(boardFilter === "all" || boardFilter === "mobile") && (
          <div className="space-y-8">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-purple-400" />
              <h2 className="text-xl font-bold text-white tracking-tight">
                03. Mobile Responsive Showcase (390px Viewports)
              </h2>
            </div>

            <p className="text-xs text-slate-400">
              Demonstrating how components gracefully transform: hamburger menu drawer, stacked downloader card, 1-column feature grid, full-width thumb-friendly CTAs, and sticky mobile actions.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              
              {/* Mobile 1: Mobile Homepage */}
              <div className="space-y-2">
                <span className="text-xs font-bold text-slate-300">Mobile 1: Homepage Hero</span>
                <div className="w-full max-w-[340px] mx-auto bg-white text-slate-900 rounded-3xl border-4 border-slate-700 shadow-2xl overflow-hidden p-4 space-y-4">
                  {/* Mobile Status Bar */}
                  <div className="flex justify-between items-center text-[10px] font-bold text-slate-600 border-b border-slate-100 pb-2">
                    <span>9:41</span>
                    <div className="flex items-center gap-1.5">
                      <span>5G</span>
                      <span className="w-2.5 h-2 rounded bg-slate-800" />
                    </div>
                  </div>

                  {/* Header */}
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-1.5">
                      <div className="w-6 h-6 rounded bg-indigo-600 text-white flex items-center justify-center font-bold text-[10px]">
                        <FileDown className="w-3.5 h-3.5" />
                      </div>
                      <span className="font-extrabold text-xs">Scribd PDF</span>
                    </div>
                    <span className="p-1 rounded bg-slate-100 text-slate-700 text-xs font-bold">≡</span>
                  </div>

                  {/* Hero Copy */}
                  <div className="space-y-1.5 pt-1">
                    <h3 className="text-base font-extrabold text-slate-900 leading-tight">
                      Download Scribd Documents as PDF
                    </h3>
                    <p className="text-[10px] text-slate-600">
                      Convert public slide decks into clean offline PDF files.
                    </p>
                  </div>

                  {/* Mobile Downloader Card */}
                  <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 space-y-2">
                    <input
                      type="text"
                      readOnly
                      value="https://scribd.com/doc..."
                      className="w-full text-[10px] bg-white border border-slate-200 rounded-lg p-2"
                    />
                    <button type="button" className="w-full py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-[11px] font-bold rounded-lg shadow-sm">
                      Fetch & Download PDF
                    </button>
                  </div>
                </div>
              </div>

              {/* Mobile 2: Mobile Downloader Progress */}
              <div className="space-y-2">
                <span className="text-xs font-bold text-slate-300">Mobile 2: Active Scraper State</span>
                <div className="w-full max-w-[340px] mx-auto bg-white text-slate-900 rounded-3xl border-4 border-slate-700 shadow-2xl overflow-hidden p-4 space-y-4">
                  <div className="flex justify-between items-center text-[10px] font-bold text-slate-600 border-b border-slate-100 pb-2">
                    <span>9:41</span>
                    <span>100%</span>
                  </div>

                  <div className="p-3 bg-indigo-50/70 border border-indigo-100 rounded-xl space-y-2">
                    <div className="flex justify-between text-xs font-bold text-slate-900">
                      <span>Fetching Pages...</span>
                      <span className="text-indigo-600">72%</span>
                    </div>
                    <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                      <div className="w-[72%] h-full bg-indigo-600 rounded-full" />
                    </div>
                    <p className="text-[9px] font-mono text-slate-500">Extracting slide 18/24...</p>
                  </div>

                  <div className="grid grid-cols-2 gap-1.5">
                    <div className="aspect-[3/4] bg-slate-100 rounded p-1 text-[9px] text-center flex flex-col justify-end font-bold">
                      Slide 1
                    </div>
                    <div className="aspect-[3/4] bg-slate-100 rounded p-1 text-[9px] text-center flex flex-col justify-end font-bold">
                      Slide 2
                    </div>
                  </div>
                </div>
              </div>

              {/* Mobile 3: Mobile Blog Listing */}
              <div className="space-y-2">
                <span className="text-xs font-bold text-slate-300">Mobile 3: Blog 1-Col Cards</span>
                <div className="w-full max-w-[340px] mx-auto bg-white text-slate-900 rounded-3xl border-4 border-slate-700 shadow-2xl overflow-hidden p-4 space-y-3">
                  <div className="flex justify-between items-center text-[10px] font-bold text-slate-600 border-b border-slate-100 pb-2">
                    <span>9:41</span>
                    <span>Knowledge</span>
                  </div>

                  <div className="flex gap-1 overflow-x-auto pb-1 text-[10px]">
                    <span className="px-2 py-0.5 rounded bg-indigo-600 text-white font-bold shrink-0">All</span>
                    <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-600 shrink-0">Guides</span>
                    <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-600 shrink-0">Tips</span>
                  </div>

                  <div className="border border-slate-200 rounded-xl overflow-hidden space-y-1.5 pb-2">
                    <div className="h-20 bg-slate-200 w-full" />
                    <div className="px-2 space-y-0.5">
                      <span className="text-[9px] font-bold text-indigo-600">Guide</span>
                      <p className="text-[11px] font-bold text-slate-900 line-clamp-1">How to Download Scribd Documents</p>
                      <p className="text-[9px] text-slate-500">4 min read</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Mobile 4: Mobile Article Reader */}
              <div className="space-y-2">
                <span className="text-xs font-bold text-slate-300">Mobile 4: Article & Sticky CTA</span>
                <div className="w-full max-w-[340px] mx-auto bg-white text-slate-900 rounded-3xl border-4 border-slate-700 shadow-2xl overflow-hidden p-4 space-y-3 relative">
                  <div className="flex justify-between items-center text-[10px] font-bold text-slate-600 border-b border-slate-100 pb-2">
                    <span>9:41</span>
                    <span>Reader</span>
                  </div>

                  <h4 className="text-xs font-bold text-slate-900">
                    Understanding Scribd Document Structures
                  </h4>
                  <p className="text-[10px] text-slate-600 leading-relaxed">
                    Scribd documents render through vector glyph layers or canvas tiles...
                  </p>

                  <div className="p-2 bg-indigo-50 border border-indigo-100 rounded text-[9px] text-indigo-900">
                    <strong>Tip:</strong> Always test preview resolution on mobile.
                  </div>

                  {/* Sticky Action Pill */}
                  <div className="pt-4">
                    <button type="button" className="w-full py-2 bg-indigo-600 text-white rounded-xl text-xs font-bold shadow-md flex items-center justify-center gap-1">
                      <FileDown className="w-3.5 h-3.5" />
                      <span>Convert Link Now</span>
                    </button>
                  </div>
                </div>
              </div>

            </div>
          </div>
        )}

      </div>
    </div>
  );
}
