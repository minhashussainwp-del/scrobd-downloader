import React from "react";
import {
  FileText,
  Calendar,
  User,
  ArrowLeft,
  Share2,
  Clock,
  CheckCircle2,
  HelpCircle,
  Shield,
  BookOpen,
} from "lucide-react";
import { CustomPage, PageRoute, SupportedLanguage } from "../types";

interface CustomPageViewProps {
  page: CustomPage;
  onNavigate: (page: PageRoute) => void;
  allCustomPages?: CustomPage[];
  currentLang?: SupportedLanguage;
}

export function CustomPageView({
  page,
  onNavigate,
  allCustomPages = [],
  currentLang = "en",
}: CustomPageViewProps) {
  const [copied, setCopied] = React.useState(false);

  const handleShare = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  // Simple, safe Markdown parser for headings, lists, bold, blockquotes, and paragraphs
  const renderMarkdownContent = (text: string) => {
    if (!text) return null;
    const lines = text.split("\n");
    const elements: React.ReactNode[] = [];
    let listBuffer: string[] = [];
    let listType: "ul" | "ol" | null = null;

    const flushList = (keyPrefix: number) => {
      if (listBuffer.length > 0) {
        if (listType === "ul") {
          elements.push(
            <ul key={`ul-${keyPrefix}`} className="list-disc pl-6 space-y-2 text-slate-700 my-4 text-sm leading-relaxed">
              {listBuffer.map((item, idx) => (
                <li key={idx}>{parseInlineFormatting(item)}</li>
              ))}
            </ul>
          );
        } else if (listType === "ol") {
          elements.push(
            <ol key={`ol-${keyPrefix}`} className="list-decimal pl-6 space-y-2 text-slate-700 my-4 text-sm leading-relaxed">
              {listBuffer.map((item, idx) => (
                <li key={idx}>{parseInlineFormatting(item)}</li>
              ))}
            </ol>
          );
        }
        listBuffer = [];
        listType = null;
      }
    };

    const parseInlineFormatting = (str: string): React.ReactNode => {
      // Bold **text**
      const parts = str.split(/(\*\*.*?\*\*|\*.*?\*|`.*?`)/g);
      return parts.map((part, i) => {
        if (part.startsWith("**") && part.endsWith("**")) {
          return <strong key={i} className="font-bold text-slate-900">{part.slice(2, -2)}</strong>;
        }
        if (part.startsWith("*") && part.endsWith("*")) {
          return <em key={i} className="italic text-slate-800">{part.slice(1, -1)}</em>;
        }
        if (part.startsWith("`") && part.endsWith("`")) {
          return <code key={i} className="bg-slate-100 text-indigo-600 px-1.5 py-0.5 rounded text-xs font-mono">{part.slice(1, -1)}</code>;
        }
        return part;
      });
    };

    lines.forEach((line, index) => {
      const trimmed = line.trim();

      // Heading 1 (#)
      if (trimmed.startsWith("# ")) {
        flushList(index);
        elements.push(
          <h1 key={index} className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-8 mb-4 border-b border-slate-100 pb-3">
            {trimmed.slice(2)}
          </h1>
        );
      }
      // Heading 2 (##)
      else if (trimmed.startsWith("## ")) {
        flushList(index);
        elements.push(
          <h2 key={index} className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight mt-8 mb-3">
            {trimmed.slice(3)}
          </h2>
        );
      }
      // Heading 3 (###)
      else if (trimmed.startsWith("### ")) {
        flushList(index);
        elements.push(
          <h3 key={index} className="text-base sm:text-lg font-bold text-slate-800 tracking-tight mt-6 mb-2">
            {trimmed.slice(4)}
          </h3>
        );
      }
      // Bullet list item (- or *)
      else if (trimmed.startsWith("- ") || trimmed.startsWith("* ")) {
        if (listType !== "ul") flushList(index);
        listType = "ul";
        listBuffer.push(trimmed.slice(2));
      }
      // Numbered list item (1. 2.)
      else if (/^\d+\.\s/.test(trimmed)) {
        if (listType !== "ol") flushList(index);
        listType = "ol";
        const itemText = trimmed.replace(/^\d+\.\s/, "");
        listBuffer.push(itemText);
      }
      // Blockquote (> )
      else if (trimmed.startsWith("> ")) {
        flushList(index);
        elements.push(
          <blockquote key={index} className="border-l-4 border-indigo-500 bg-indigo-50/50 p-4 rounded-r-xl my-4 text-slate-700 italic text-sm">
            {parseInlineFormatting(trimmed.slice(2))}
          </blockquote>
        );
      }
      // Empty line
      else if (trimmed === "") {
        flushList(index);
      }
      // Standard paragraph
      else {
        flushList(index);
        elements.push(
          <p key={index} className="text-slate-700 text-sm sm:text-base leading-relaxed my-3">
            {parseInlineFormatting(trimmed)}
          </p>
        );
      }
    });

    flushList(lines.length);
    return elements;
  };

  // Other published custom pages for sidebar
  const otherPages = allCustomPages.filter((p) => p.id !== page.id && p.status === "published");

  return (
    <div className="bg-slate-50 min-h-screen py-8 sm:py-12" id="custom-page-view">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 space-y-8">
        
        {/* Breadcrumb Bar */}
        <div className="flex items-center justify-between gap-4 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => onNavigate("home")}
              className="hover:text-indigo-600 transition flex items-center gap-1 font-semibold cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Home</span>
            </button>
            <span>/</span>
            <span className="text-slate-900 font-bold truncate max-w-xs">{page.title}</span>
          </div>

          <button
            type="button"
            onClick={handleShare}
            className="px-3 py-1.5 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold inline-flex items-center gap-1.5 transition cursor-pointer shadow-2xs"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>{copied ? "Link Copied!" : "Share Page"}</span>
          </button>
        </div>

        {/* Layout: Content & Sidebar */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Main Document Content */}
          <main className="lg:col-span-8 bg-white rounded-3xl p-6 sm:p-10 border border-slate-200 shadow-2xs space-y-6">
            {/* Header Area */}
            <div className="border-b border-slate-100 pb-6 space-y-3">
              <div className="flex items-center gap-2 text-xs">
                <span className="px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700 font-bold border border-indigo-100 uppercase tracking-wider text-[10px]">
                  Official Document
                </span>
                <span className="text-slate-400">•</span>
                <span className="text-slate-500 flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5" />
                  {page.lastModified ? `Updated ${page.lastModified}` : "Current Edition"}
                </span>
                {page.authorName && (
                  <>
                    <span className="text-slate-400">•</span>
                    <span className="text-slate-500 flex items-center gap-1">
                      <User className="w-3.5 h-3.5" />
                      {page.authorName}
                    </span>
                  </>
                )}
              </div>

              <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
                {page.title}
              </h1>

              {page.subtitle && (
                <p className="text-sm sm:text-base text-slate-600 font-medium leading-relaxed">
                  {page.subtitle}
                </p>
              )}
            </div>

            {/* Markdown Body */}
            <div className="prose-clean pt-2">
              {renderMarkdownContent(page.content)}
            </div>

            {/* Bottom Support Callout */}
            <div className="mt-10 p-5 rounded-2xl bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center shrink-0 shadow-xs">
                  <HelpCircle className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900">Have questions or need assistance?</h4>
                  <p className="text-xs text-slate-600">Our support desk responds to academic and technical inquiries.</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => onNavigate("contact")}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl transition cursor-pointer shadow-xs whitespace-nowrap"
              >
                Contact Support
              </button>
            </div>
          </main>

          {/* Right Sidebar */}
          <aside className="lg:col-span-4 space-y-6">
            {/* Quick Links / Other Pages */}
            {otherPages.length > 0 && (
              <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-2xs space-y-3">
                <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-400">
                  Related Documents
                </h3>
                <div className="space-y-1">
                  {otherPages.map((op) => (
                    <button
                      key={op.id}
                      type="button"
                      onClick={() => {
                        // Navigate to that page
                        if (typeof window !== "undefined") {
                          window.location.hash = op.slug;
                        }
                      }}
                      className="w-full text-left p-2.5 rounded-xl hover:bg-slate-50 transition flex items-center justify-between group cursor-pointer"
                    >
                      <div className="flex items-center gap-2.5 overflow-hidden">
                        <FileText className="w-4 h-4 text-slate-400 group-hover:text-indigo-600 shrink-0" />
                        <span className="text-xs font-bold text-slate-700 group-hover:text-slate-900 truncate">
                          {op.title}
                        </span>
                      </div>
                      <span className="text-[10px] text-slate-400 shrink-0 font-mono">/{op.slug}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quick Downloader Navigation Banner */}
            <div className="bg-gradient-to-br from-slate-900 to-slate-800 text-white rounded-2xl p-5 space-y-3 shadow-md">
              <span className="text-[10px] uppercase font-bold tracking-wider text-blue-400">
                Scribd Downloader Tool
              </span>
              <h4 className="text-base font-extrabold leading-snug">
                Need to convert another document to PDF?
              </h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                Paste any Scribd link on our homepage to download high-resolution vectors in seconds.
              </p>
              <button
                type="button"
                onClick={() => onNavigate("home")}
                className="w-full py-2.5 rounded-xl bg-blue-500 hover:bg-blue-600 text-white text-xs font-bold transition cursor-pointer shadow-xs"
              >
                Go to Downloader
              </button>
            </div>
          </aside>

        </div>
      </div>
    </div>
  );
}
