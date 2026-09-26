import React from "react";
import {
  FileText,
  Calendar,
  User,
  ArrowLeft,
  Share2,
  HelpCircle,
} from "lucide-react";
import { CustomPage, PageRoute, SupportedLanguage } from "../types";
import { ModernArticleRenderer } from "../components/ModernArticleRenderer";
import { ModernArticleSidebar } from "../components/ModernArticleSidebar";

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

  const otherPages = allCustomPages.filter((p) => p.id !== page.id && !p.inTrash && p.status === "published");

  return (
    <div className="bg-slate-50 min-h-screen py-8 sm:py-12" id="custom-page-view">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 space-y-8">
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

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-10 items-start">
          <main className="lg:col-span-8 space-y-8">
            <div className="space-y-3">
              <div>
                <span className="inline-flex px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider text-blue-700 bg-blue-50 border border-blue-100 rounded-md">
                  KNOWLEDGE BASE
                </span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
                {page.title}
              </h1>
              {page.subtitle && (
                <p className="text-base sm:text-lg text-slate-600 font-medium leading-relaxed">
                  {page.subtitle}
                </p>
              )}
              <p className="text-xs text-slate-400 font-medium">
                Guide • {page.lastModified ? `Updated ${page.lastModified}` : "Document Edition"}
              </p>
            </div>

            <div className="article-body">
              <ModernArticleRenderer content={page.htmlContent || page.content} />
            </div>

            <div className="mt-12 p-6 rounded-2xl bg-blue-50/60 border border-blue-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
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

          <aside className="lg:col-span-4 space-y-6">
            <ModernArticleSidebar
              currentLang={currentLang}
              onOpenDownloader={() => onNavigate("home")}
            />

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
          </aside>
        </div>
      </div>
    </div>
  );
}
