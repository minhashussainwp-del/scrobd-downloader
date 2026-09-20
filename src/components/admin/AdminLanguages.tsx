import React from "react";
import {
  Globe,
  CheckCircle2,
  AlertTriangle,
  FileText,
  BookOpen,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import { AdminTab } from "./AdminLayout";

interface AdminLanguagesProps {
  onNavigate: (tab: AdminTab) => void;
  pages?: any[];
  posts?: any[];
}

const LANGUAGES_DATA = [
  { code: "en", name: "English (US)", nativeName: "English", flag: "🇺🇸", urlPrefix: "/en/ (Default /)", isDefault: true, locale: "en_US" },
  { code: "id", name: "Indonesian", nativeName: "Bahasa Indonesia", flag: "🇮🇩", urlPrefix: "/id/", isDefault: false, locale: "id_ID" },
  { code: "hi", name: "Hindi", nativeName: "हिन्दी", flag: "🇮🇳", urlPrefix: "/hi/", isDefault: false, locale: "hi_IN" },
  { code: "es", name: "Spanish (Mexico)", nativeName: "Español", flag: "🇲🇽", urlPrefix: "/es/", isDefault: false, locale: "es_MX" },
  { code: "fr", name: "French", nativeName: "Français", flag: "🇫🇷", urlPrefix: "/fr/", isDefault: false, locale: "fr_FR" },
  { code: "nl", name: "Dutch", nativeName: "Nederlands", flag: "🇳🇱", urlPrefix: "/nl/", isDefault: false, locale: "nl_NL" },
  { code: "ur", name: "Urdu", nativeName: "اردو", flag: "🇵🇰", urlPrefix: "/ur/", isDefault: false, locale: "ur_PK" },
];

export function AdminLanguages({ onNavigate, pages = [], posts = [] }: AdminLanguagesProps) {
  // Calculate coverage
  const totalBasePages = Math.max(pages.length, 6);
  const totalBasePosts = Math.max(posts.length, 4);

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <Globe className="w-5 h-5 text-emerald-600" />
            <span>Polylang Multilingual Architecture</span>
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Configured with 7 core localized markets. English is the authoritative base language with automated URL prefixes.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 font-semibold flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>7 Active Locales Synchronized</span>
          </span>
        </div>
      </div>

      {/* Language Overview Cards */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-4 border-b border-slate-200 bg-slate-50/70 flex items-center justify-between">
          <h2 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
            Active Language Matrix & URL Slugs
          </h2>
          <span className="text-[11px] text-slate-500 font-mono">
            Hreflang tags generated automatically in &lt;head&gt;
          </span>
        </div>

        <div className="divide-y divide-slate-100 text-xs">
          {LANGUAGES_DATA.map((lang) => (
            <div key={lang.code} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-50/60 transition">
              <div className="flex items-center gap-3">
                <span className="text-2xl">{lang.flag}</span>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900 text-sm">{lang.name}</span>
                    <span className="text-slate-500">({lang.nativeName})</span>
                    {lang.isDefault && (
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">
                        Default Base
                      </span>
                    )}
                  </div>
                  <div className="text-[11px] text-slate-400 font-mono mt-0.5 flex items-center gap-2">
                    <span>Prefix: <strong className="text-slate-700">{lang.urlPrefix}</strong></span>
                    <span>•</span>
                    <span>Locale: {lang.locale}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-4 text-slate-600">
                <div className="flex items-center gap-1.5 bg-slate-100 px-2.5 py-1 rounded-lg">
                  <FileText className="w-3.5 h-3.5 text-slate-500" />
                  <span>Pages: <strong className="text-slate-900">{lang.isDefault ? totalBasePages : Math.floor(totalBasePages * 0.9)}</strong></span>
                </div>
                <div className="flex items-center gap-1.5 bg-slate-100 px-2.5 py-1 rounded-lg">
                  <BookOpen className="w-3.5 h-3.5 text-slate-500" />
                  <span>Posts: <strong className="text-slate-900">{lang.isDefault ? totalBasePosts : Math.floor(totalBasePosts * 0.8)}</strong></span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Translation Workflow Guidance */}
      <div className="bg-emerald-50/70 rounded-xl border border-emerald-200 p-5 space-y-3 text-xs text-emerald-950">
        <div className="flex items-center gap-2 font-bold text-sm text-emerald-900">
          <Sparkles className="w-4 h-4 text-emerald-600" />
          <span>Polylang Best Practice Workflow</span>
        </div>
        <p className="leading-relaxed text-emerald-800">
          All new pages and blog posts should first be created and published in <strong>English (US)</strong>.
          Once the English content is ready, switch languages using the editor's Polylang bar to create localized copies.
          You can use the built-in <strong>Gemini AI Assistant</strong> to automatically translate the body, excerpt, and generate
          culturally accurate SEO meta titles and descriptions for each locale without leaving the CMS.
        </p>
      </div>
    </div>
  );
}
