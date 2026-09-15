import React, { useState } from "react";
import {
  Calendar,
  Clock,
  ArrowLeft,
  Share2,
  Check,
  Twitter,
  Linkedin,
  Link2,
  Sparkles,
  Bookmark,
  FileDown,
  ArrowRight,
  BookOpen,
  Info
} from "lucide-react";
import { BlogPost, PageRoute, AdSettings, SupportedLanguage } from "../types";
import { GutenbergBlockRenderer } from "../components/GutenbergBlockRenderer";
import { InFeedAdBanner, SidebarAdBanner } from "../components/AdBanners";
import { SUPPORTED_LANGUAGES } from "../data/translations";

interface BlogArticlePageProps {
  post: BlogPost;
  allPosts: BlogPost[];
  onBackToBlog: () => void;
  onSelectPost: (post: BlogPost) => void;
  onNavigate: (page: PageRoute) => void;
  onQuickDownloadClick: () => void;
  onLanguageChange?: (lang: SupportedLanguage) => void;
  currentLang?: SupportedLanguage;
  adSettings?: AdSettings;
}

export function BlogArticlePage({
  post,
  allPosts,
  onBackToBlog,
  onSelectPost,
  onNavigate,
  onQuickDownloadClick,
  onLanguageChange,
  currentLang = "en",
  adSettings,
}: BlogArticlePageProps) {
  const [copiedLink, setCopiedLink] = useState(false);

  // Group translations for this article
  const translations = post.translationGroupId
    ? allPosts.filter(
        (p) => p.translationGroupId === post.translationGroupId && p.status !== "draft"
      )
    : [];

  const relatedPosts = allPosts
    .filter((p) => p.id !== post.id)
    .slice(0, 3);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  return (
    <div className="bg-white min-h-screen py-10 sm:py-14">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        
        {/* Breadcrumb Navigation */}
        <div className="flex items-center justify-between pb-6 mb-8 border-b border-slate-100">
          <div className="flex items-center gap-2 text-xs text-slate-500 truncate">
            <button
              type="button"
              onClick={() => onNavigate("home")}
              className="hover:text-indigo-600 transition"
            >
              Home
            </button>
            <span>/</span>
            <button
              type="button"
              onClick={onBackToBlog}
              className="hover:text-indigo-600 transition"
            >
              Blog
            </button>
            <span>/</span>
            <span className="text-slate-900 font-semibold truncate max-w-xs sm:max-w-md">
              {post.title}
            </span>
          </div>

          <button
            type="button"
            onClick={onBackToBlog}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-indigo-600 transition shrink-0"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Guides</span>
          </button>
        </div>

        {/* Article Header */}
        <div className="max-w-4xl mx-auto space-y-6 text-center sm:text-left">
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2.5">
            <span className="text-xs uppercase font-bold tracking-wider px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-100">
              {post.category}
            </span>
            <span className="text-xs text-slate-400">•</span>
            <span className="text-xs text-slate-500 flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5" />
              {post.date}
            </span>
            <span className="text-xs text-slate-400">•</span>
            <span className="text-xs text-slate-500 flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" />
              {post.readTime}
            </span>
          </div>

          <h1 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight leading-[1.2]">
            {post.title}
          </h1>

          <div className="flex items-center justify-center sm:justify-between flex-wrap gap-4 pt-2 border-t border-slate-100">
            {/* Author */}
            <div className="flex items-center gap-3">
              <img
                src={post.author.avatar}
                alt={post.author.name}
                className="w-10 h-10 rounded-full object-cover border border-slate-200"
                referrerPolicy="no-referrer"
              />
              <div className="text-left">
                <p className="text-xs sm:text-sm font-bold text-slate-900">{post.author.name}</p>
                <p className="text-[11px] text-slate-500">{post.author.role}</p>
              </div>
            </div>

            {/* Social Share Controls */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleCopyLink}
                className="px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-xs font-semibold text-slate-700 flex items-center gap-1.5 transition"
                title="Copy URL"
              >
                {copiedLink ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <span className="text-emerald-700">Link Copied!</span>
                  </>
                ) : (
                  <>
                    <Link2 className="w-3.5 h-3.5 text-slate-500" />
                    <span>Share</span>
                  </>
                )}
              </button>
              <a
                href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(post.title)}`}
                target="_blank"
                rel="noreferrer"
                className="p-2 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-600 hover:text-indigo-600 transition"
                aria-label="Tweet article"
              >
                <Twitter className="w-3.5 h-3.5" />
              </a>
              <a
                href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.href)}`}
                target="_blank"
                rel="noreferrer"
                className="p-2 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-600 hover:text-indigo-600 transition"
                aria-label="Share on LinkedIn"
              >
                <Linkedin className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>

          {/* 6 Variations Bar */}
          {translations.length > 1 && (
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 sm:p-5 mt-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <span className="text-base">🌐</span>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">
                      Read this guide in other languages:
                    </h4>
                    <p className="text-[11px] text-slate-500">
                      Available in {translations.length} language variations
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-1.5">
                  {SUPPORTED_LANGUAGES.map((lang) => {
                    const match = translations.find((t) => (t.language || "en") === lang.code);
                    if (!match) return null;
                    const isActive = match.id === post.id;
                    return (
                      <button
                        key={lang.code}
                        type="button"
                        onClick={() => {
                          if (!isActive) {
                            onSelectPost(match);
                            if (onLanguageChange) onLanguageChange(lang.code);
                            window.scrollTo({ top: 0, behavior: "smooth" });
                          }
                        }}
                        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                          isActive
                            ? "bg-indigo-600 text-white shadow-xs"
                            : "bg-white text-slate-700 border border-slate-200 hover:border-indigo-300 hover:bg-indigo-50/50"
                        }`}
                      >
                        <span>{lang.flag}</span>
                        <span>{lang.nativeName}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Hero Image */}
        <div className="max-w-4xl mx-auto my-8 sm:my-10 rounded-3xl overflow-hidden border border-slate-200 shadow-md aspect-[16/9] bg-slate-100">
          <img
            src={post.image}
            alt={post.title}
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
        </div>

        {/* Main Content Layout with Sticky Sidebar */}
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12">
          
          {/* Left / Article Body */}
          <div className="lg:col-span-8 space-y-8">
            {/* Intro Lead Paragraph */}
            {post.content?.intro && (
              <p className="text-base sm:text-lg text-slate-700 leading-relaxed font-normal bg-slate-50 p-6 rounded-2xl border border-slate-200/80">
                {post.content.intro}
              </p>
            )}

            {/* Gutenberg Block Editor Content if present */}
            {post.blocks && post.blocks.length > 0 ? (
              <div className="space-y-6">
                <GutenbergBlockRenderer blocks={post.blocks} />
              </div>
            ) : (
              /* Traditional Sections */
              post.content?.sections?.map((section, idx) => (
                <section key={idx} className="space-y-4 pt-4">
                  <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
                    {section.heading}
                  </h2>

                  <div className="space-y-3 text-sm sm:text-base text-slate-600 leading-relaxed">
                    {section.body.map((p, pIdx) => (
                      <p key={pIdx}>{p}</p>
                    ))}
                  </div>

                  {section.tip && (
                    <div className="p-4 rounded-xl bg-indigo-50/70 border border-indigo-100 flex items-start gap-3 text-xs sm:text-sm text-indigo-950 my-4">
                      <Info className="w-5 h-5 text-indigo-600 shrink-0 mt-0.5" />
                      <div>
                        <span className="font-bold block mb-0.5">Author Insight</span>
                        <span>{section.tip}</span>
                      </div>
                    </div>
                  )}

                  {/* Mid-article InFeed Ad banner (Item 10) */}
                  {idx === 0 && adSettings?.enabled && adSettings?.inFeedAd && (
                    <div className="my-6">
                      <InFeedAdBanner settings={adSettings} />
                    </div>
                  )}
                </section>
              ))
            )}

            {/* In-Article Downloader Callout */}
            <div className="mt-12 p-6 sm:p-8 rounded-2xl bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white space-y-4">
              <span className="text-[10px] uppercase font-bold tracking-wider px-2.5 py-1 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 inline-block">
                Online Utility
              </span>
              <h3 className="text-xl font-bold">Have a Scribd Link Ready to Convert?</h3>
              <p className="text-xs sm:text-sm text-slate-300">
                Paste the URL into our web tool right now to preview pages and download your document as a pure PDF file.
              </p>
              <button
                type="button"
                onClick={onQuickDownloadClick}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-bold text-xs shadow-md transition"
              >
                <FileDown className="w-4 h-4" />
                <span>Open PDF Downloader</span>
              </button>
            </div>
          </div>

          {/* Right / Sidebar */}
          <div className="lg:col-span-4 space-y-8">
            {/* Sticky Table of Contents */}
            <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200/80 sticky top-24 space-y-4">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-900">
                <BookOpen className="w-4 h-4 text-indigo-600" />
                <span>Table of Contents</span>
              </div>

              <ul className="space-y-2 text-xs text-slate-600 border-l border-slate-200 pl-3">
                {post.content.tableOfContents.map((item, idx) => (
                  <li key={idx} className="hover:text-indigo-600 transition cursor-pointer py-0.5">
                    {item}
                  </li>
                ))}
              </ul>

              {/* Sidebar Quick Downloader Widget */}
              <div className="pt-4 border-t border-slate-200 space-y-3">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-900">
                  <FileDown className="w-4 h-4 text-indigo-600" />
                  <span>Quick PDF Downloader</span>
                </div>
                <p className="text-[11px] text-slate-500">
                  Instant web extraction for public documents and slide presentations.
                </p>
                <button
                  type="button"
                  onClick={onQuickDownloadClick}
                  className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs shadow-xs transition"
                >
                  Go to Downloader
                </button>
              </div>

              {/* Sidebar Ad Banner (Item 11) */}
              {adSettings?.enabled && adSettings?.sidebarAd && (
                <div className="pt-2">
                  <SidebarAdBanner settings={adSettings} />
                </div>
              )}
            </div>
          </div>

        </div>

        {/* Related Articles Section */}
        <div className="max-w-6xl mx-auto pt-16 mt-16 border-t border-slate-200 space-y-6">
          <h3 className="text-xl font-extrabold text-slate-900">Related Tutorials & Guides</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {relatedPosts.map((rPost) => (
              <div
                key={rPost.id}
                onClick={() => {
                  onSelectPost(rPost);
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
                className="bg-white rounded-xl border border-slate-200 p-4 hover:shadow-md transition cursor-pointer group space-y-3"
              >
                <div className="aspect-[16/10] rounded-lg overflow-hidden bg-slate-100">
                  <img
                    src={rPost.image}
                    alt={rPost.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <span className="text-[10px] uppercase font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded">
                  {rPost.category}
                </span>
                <h4 className="text-xs sm:text-sm font-bold text-slate-900 group-hover:text-indigo-600 transition line-clamp-2">
                  {rPost.title}
                </h4>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
