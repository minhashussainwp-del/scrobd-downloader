import React, { useState, useEffect } from "react";
import { PageContent, SupportedLanguage } from "../../types";
import { loadPageContent, savePageContent } from "../../data/siteConfig";
import { SUPPORTED_LANGUAGES } from "../../data/translations";
import { FileEdit, Check, Save, Plus, Globe, ArrowRight, Languages } from "lucide-react";

interface PageDefinition {
  key: string;
  label: string;
  description: string;
}

const PAGE_DEFINITIONS: PageDefinition[] = [
  { key: "home", label: "Homepage (Downloader & Features)", description: "Hero, guide, features, and main SEO copy" },
  { key: "about", label: "About Us Page", description: "Mission statement, open-source ethos, and project background" },
  { key: "how-it-works", label: "How It Works Page", description: "Technical extraction steps, resolution, and architecture" },
  { key: "contact", label: "Contact & Support Page", description: "Support team contact copy and FAQs" },
  { key: "legal", label: "Legal Terms & Privacy Page", description: "Fair use disclosure, compliance, and caching policies" },
];

export function AdminPagesContent() {
  const [contents, setContents] = useState<PageContent[]>([]);
  const [editingItem, setEditingItem] = useState<PageContent | null>(null);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [selectedLangFilter, setSelectedLangFilter] = useState<SupportedLanguage | "all">("all");

  useEffect(() => {
    setContents(loadPageContent());
  }, []);

  const handleStartEdit = (pageKey: string, lang: SupportedLanguage) => {
    // Look for existing variation
    const existing = contents.find(
      (c) => (c.pageKey === pageKey && c.language === lang) || c.id === `${pageKey}-${lang}`
    );

    if (existing) {
      setEditingItem({ ...existing });
    } else {
      // Find base English variation to prefill
      const baseEn = contents.find(
        (c) => (c.pageKey === pageKey && c.language === "en") || c.id === `${pageKey}-en` || c.id === pageKey
      );

      const langInfo = SUPPORTED_LANGUAGES.find((l) => l.code === lang);

      setEditingItem({
        id: `${pageKey}-${lang}`,
        pageKey,
        language: lang,
        title: baseEn ? `${baseEn.title} (${langInfo?.nativeName || lang.toUpperCase()})` : `New ${pageKey} Page`,
        subtitle: baseEn?.subtitle || "",
        content: baseEn?.content || "",
      });
    }
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem) return;

    // Update or insert
    const existsIndex = contents.findIndex(
      (c) =>
        c.id === editingItem.id ||
        (c.pageKey === editingItem.pageKey && c.language === editingItem.language)
    );

    let updatedList: PageContent[];
    if (existsIndex >= 0) {
      updatedList = [...contents];
      updatedList[existsIndex] = editingItem;
    } else {
      updatedList = [...contents, editingItem];
    }

    setContents(updatedList);
    savePageContent(updatedList);
    setEditingItem(null);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-2.5 py-0.5 rounded-full border border-indigo-100">
              Multilingual CMS
            </span>
            <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
              6 Variations Supported
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 mt-1">
            Pages Content Editor & Translations
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Manage full text content and translations for all 5 core website pages across 6 supported languages.
          </p>
        </div>

        {/* Language Quick Filter */}
        <div className="flex items-center gap-1.5 overflow-x-auto py-1">
          <button
            type="button"
            onClick={() => setSelectedLangFilter("all")}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
              selectedLangFilter === "all"
                ? "bg-indigo-600 text-white shadow-xs"
                : "bg-slate-100 text-slate-700 hover:bg-slate-200"
            }`}
          >
            All Languages
          </button>
          {SUPPORTED_LANGUAGES.map((lang) => (
            <button
              key={lang.code}
              type="button"
              onClick={() => setSelectedLangFilter(lang.code)}
              className={`px-2.5 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1 cursor-pointer ${
                selectedLangFilter === lang.code
                  ? "bg-indigo-600 text-white shadow-xs"
                  : "bg-slate-100 text-slate-700 hover:bg-slate-200"
              }`}
            >
              <span>{lang.flag}</span>
              <span>{lang.code.toUpperCase()}</span>
            </button>
          ))}
        </div>
      </div>

      {savedSuccess && (
        <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 font-bold flex items-center gap-2 animate-in fade-in duration-200">
          <Check className="w-4 h-4 text-emerald-600" />
          <span>Page translation saved successfully! Live front-end content is updated immediately.</span>
        </div>
      )}

      {/* Edit Form Modal/Drawer */}
      {editingItem && (
        <form
          onSubmit={handleSaveEdit}
          className="bg-white p-6 sm:p-7 rounded-2xl border-2 border-indigo-400 shadow-md space-y-4 animate-in fade-in duration-200"
        >
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <span className="text-xl">
                {SUPPORTED_LANGUAGES.find((l) => l.code === editingItem.language)?.flag}
              </span>
              <div>
                <h3 className="text-base font-extrabold text-slate-900">
                  Editing: {editingItem.pageKey?.toUpperCase()} Page (
                  {SUPPORTED_LANGUAGES.find((l) => l.code === editingItem.language)?.name})
                </h3>
                <p className="text-xs text-slate-500 font-mono">ID: {editingItem.id}</p>
              </div>
            </div>
            <span className="text-xs font-bold uppercase tracking-wider px-2.5 py-1 rounded bg-indigo-50 text-indigo-700 border border-indigo-100">
              {editingItem.language?.toUpperCase()} Variation
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700">Language Variation</label>
              <select
                value={editingItem.language}
                onChange={(e) => {
                  const newLang = e.target.value as SupportedLanguage;
                  setEditingItem({
                    ...editingItem,
                    language: newLang,
                    id: `${editingItem.pageKey}-${newLang}`,
                  });
                }}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm font-semibold bg-white"
              >
                {SUPPORTED_LANGUAGES.map((l) => (
                  <option key={l.code} value={l.code}>
                    {l.flag} {l.name} ({l.nativeName})
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700">Page Subtitle / Tagline</label>
              <input
                type="text"
                value={editingItem.subtitle || ""}
                onChange={(e) => setEditingItem({ ...editingItem, subtitle: e.target.value })}
                placeholder="Brief summary or hook..."
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm font-medium"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700">Page Headline / Title</label>
            <input
              type="text"
              required
              value={editingItem.title}
              onChange={(e) => setEditingItem({ ...editingItem, title: e.target.value })}
              className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm font-bold"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700">Full Content (Markdown Supported)</label>
            <textarea
              rows={12}
              required
              value={editingItem.content}
              onChange={(e) => setEditingItem({ ...editingItem, content: e.target.value })}
              className="w-full px-3.5 py-3 rounded-xl border border-slate-300 text-sm font-mono whitespace-pre-wrap leading-relaxed focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
            />
            <p className="text-[11px] text-slate-400">
              Supports standard Markdown formatting: # Headings, paragraphs, **bold**, and bullet points.
            </p>
          </div>

          <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setEditingItem(null)}
              className="px-4 py-2 rounded-xl border border-slate-300 text-slate-700 text-xs font-semibold hover:bg-slate-50 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-xs cursor-pointer flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              <span>Save {editingItem.language?.toUpperCase()} Translation</span>
            </button>
          </div>
        </form>
      )}

      {/* Pages List with Polylang Language Matrix */}
      <div className="space-y-5">
        {PAGE_DEFINITIONS.map((def) => {
          // Filter out languages if filter applied
          const languagesToDisplay =
            selectedLangFilter === "all"
              ? SUPPORTED_LANGUAGES
              : SUPPORTED_LANGUAGES.filter((l) => l.code === selectedLangFilter);

          return (
            <div
              key={def.key}
              className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden"
            >
              {/* Card Header */}
              <div className="p-5 border-b border-slate-100 bg-slate-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-xs uppercase">
                    {def.key.slice(0, 2)}
                  </div>
                  <div>
                    <h3 className="font-extrabold text-slate-900 text-base">{def.label}</h3>
                    <p className="text-xs text-slate-500">{def.description}</p>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
                  <Languages className="w-3.5 h-3.5 text-indigo-600" />
                  <span>Total Variations: 6 Languages Available</span>
                </div>
              </div>

              {/* Language Variations Grid (Total 6 Variations) */}
              <div className="p-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
                {languagesToDisplay.map((lang) => {
                  const variation = contents.find(
                    (c) =>
                      (c.pageKey === def.key && c.language === lang.code) ||
                      c.id === `${def.key}-${lang.code}`
                  );

                  const isCreated = !!variation;

                  return (
                    <div
                      key={lang.code}
                      className={`p-3.5 rounded-xl border transition flex flex-col justify-between gap-3 ${
                        isCreated
                          ? "bg-white border-slate-200 hover:border-indigo-300 shadow-2xs"
                          : "bg-slate-50/80 border-dashed border-slate-300"
                      }`}
                    >
                      <div className="space-y-1.5">
                        <div className="flex items-center justify-between">
                          <span className="flex items-center gap-1.5 font-bold text-xs text-slate-900">
                            <span className="text-base">{lang.flag}</span>
                            <span>{lang.name}</span>
                          </span>
                          {isCreated ? (
                            <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                              Active
                            </span>
                          ) : (
                            <span className="text-[10px] font-bold text-slate-500 bg-slate-200 px-2 py-0.5 rounded">
                              Not created
                            </span>
                          )}
                        </div>

                        {isCreated ? (
                          <div className="space-y-0.5">
                            <p className="text-xs font-bold text-slate-800 line-clamp-1">
                              {variation.title}
                            </p>
                            <p className="text-[11px] text-slate-500 line-clamp-2">
                              {variation.content}
                            </p>
                          </div>
                        ) : (
                          <p className="text-[11px] text-slate-400 italic">
                            No {lang.name} translation created yet for this page.
                          </p>
                        )}
                      </div>

                      <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                        <span className="text-[10px] text-slate-400 font-mono">
                          /{lang.urlPrefix}/{def.key === "home" ? "" : def.key}
                        </span>
                        {isCreated ? (
                          <button
                            type="button"
                            onClick={() => handleStartEdit(def.key, lang.code)}
                            className="px-3 py-1 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold text-xs transition flex items-center gap-1 cursor-pointer"
                          >
                            <FileEdit className="w-3 h-3" />
                            <span>Edit Variation</span>
                          </button>
                        ) : (
                          <button
                            type="button"
                            onClick={() => handleStartEdit(def.key, lang.code)}
                            className="px-3 py-1 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs transition flex items-center gap-1 cursor-pointer shadow-xs"
                          >
                            <Plus className="w-3 h-3" />
                            <span>+ Create ({lang.code.toUpperCase()})</span>
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
