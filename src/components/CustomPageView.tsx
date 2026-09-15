import React from "react";
import { CustomPage, PageRoute, AdSettings } from "../types";
import {
  Calendar,
  User,
  ArrowLeft,
  Share2,
  Printer,
  Sparkles,
  ShieldCheck,
  ChevronRight,
  BookOpen,
} from "lucide-react";
import { InFeedAdBanner } from "./AdBanners";

export interface CustomPageViewProps {
  page: CustomPage;
  onNavigate: (page: PageRoute) => void;
  adSettings?: AdSettings;
}

export function CustomPageView({ page, onNavigate, adSettings }: CustomPageViewProps) {
  const handleShare = () => {
    if (navigator.share) {
      navigator
        .share({
          title: page.title,
          text: page.subtitle || page.metaDescription,
          url: window.location.href,
        })
        .catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert("Page URL copied to clipboard!");
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <article className="min-h-screen bg-[#fcfdfe] pb-20 animate-fade-in" id={`custom-page-${page.slug}`}>
      {/* Breadcrumbs & Navigation Header */}
      <div className="bg-slate-50/80 border-b border-slate-200/80">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-3.5 flex items-center justify-between">
          <button
            type="button"
            onClick={() => onNavigate("home")}
            className="text-xs font-bold text-slate-600 hover:text-indigo-600 flex items-center gap-1.5 transition cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Downloader</span>
          </button>

          <div className="flex items-center gap-1.5 text-xs text-slate-400">
            <span className="cursor-pointer hover:text-slate-600" onClick={() => onNavigate("home")}>
              Home
            </span>
            <ChevronRight className="w-3 h-3 text-slate-300" />
            <span className="text-slate-800 font-semibold truncate max-w-[180px] sm:max-w-xs">
              {page.title}
            </span>
          </div>
        </div>
      </div>

      {/* Hero / Header Section */}
      <div className="bg-white border-b border-slate-100 py-10 sm:py-14">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 space-y-4">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-indigo-50 text-indigo-700 border border-indigo-100">
              <BookOpen className="w-3.5 h-3.5" />
              <span>Official Resource</span>
            </span>
            {page.status === "draft" && (
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
                Draft Mode Preview
              </span>
            )}
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight leading-tight">
            {page.title}
          </h1>

          {page.subtitle && (
            <p className="text-base sm:text-lg text-slate-600 font-medium leading-relaxed">
              {page.subtitle}
            </p>
          )}

          {/* Meta Bar */}
          <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-4 text-xs text-slate-500">
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1.5 font-medium">
                <User className="w-3.5 h-3.5 text-slate-400" />
                <span>{page.author || page.authorName || "Editorial Staff"}</span>
              </span>
              <span className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-slate-400" />
                <span>{page.lastModified || page.createdAt || "Updated recently"}</span>
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleShare}
                className="px-3 py-1.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold flex items-center gap-1.5 transition cursor-pointer"
                title="Share this page"
              >
                <Share2 className="w-3.5 h-3.5" />
                <span>Share</span>
              </button>

              <button
                type="button"
                onClick={handlePrint}
                className="px-3 py-1.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold flex items-center gap-1.5 transition cursor-pointer"
                title="Print document"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Top Banner Ad if enabled */}
      {adSettings?.enabled && adSettings?.inFeedAd && (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 my-6">
          <InFeedAdBanner settings={adSettings} />
        </div>
      )}

      {/* Page Body Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        <div className="bg-white p-6 sm:p-10 rounded-3xl border border-slate-200/80 shadow-2xs">
          <div className="prose prose-slate max-w-none text-slate-800 text-sm sm:text-base leading-relaxed space-y-4">
            {page.content.split("\n\n").map((block, idx) => {
              const trimmed = block.trim();
              if (trimmed.startsWith("# ")) {
                return (
                  <h2 key={idx} className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-6 mb-3">
                    {trimmed.replace("# ", "")}
                  </h2>
                );
              }
              if (trimmed.startsWith("## ")) {
                return (
                  <h3 key={idx} className="text-xl sm:text-2xl font-bold text-slate-900 mt-5 mb-2">
                    {trimmed.replace("## ", "")}
                  </h3>
                );
              }
              if (trimmed.startsWith("### ")) {
                return (
                  <h4 key={idx} className="text-lg font-bold text-slate-900 mt-4 mb-2">
                    {trimmed.replace("### ", "")}
                  </h4>
                );
              }
              if (trimmed.startsWith("> ")) {
                return (
                  <blockquote
                    key={idx}
                    className="p-4 my-4 bg-indigo-50/60 border-l-4 border-indigo-600 rounded-r-xl text-slate-700 italic"
                  >
                    {trimmed.replace("> ", "")}
                  </blockquote>
                );
              }
              if (trimmed.startsWith("- ")) {
                const items = trimmed.split("\n").filter((l) => l.trim().startsWith("- "));
                return (
                  <ul key={idx} className="list-disc pl-5 space-y-1.5 my-3 text-slate-700">
                    {items.map((item, itemIdx) => (
                      <li key={itemIdx}>{item.replace(/^-\s+/, "")}</li>
                    ))}
                  </ul>
                );
              }
              return (
                <p key={idx} className="text-slate-700 whitespace-pre-line">
                  {trimmed}
                </p>
              );
            })}
          </div>

          {/* Educational & Fair Use Callout */}
          <div className="mt-10 p-5 rounded-2xl bg-slate-50 border border-slate-200 flex items-start gap-3.5">
            <div className="w-8 h-8 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div className="space-y-1 text-xs text-slate-600">
              <h5 className="font-bold text-slate-900">Research &amp; Fair Use Disclaimer</h5>
              <p>
                Scribd PDF Downloader is an educational utility designed for scholars, researchers,
                and students to review publicly shared documents and slide decks. We maintain strict
                zero-retention policies and purge temporary cache files immediately upon delivery.
              </p>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}
