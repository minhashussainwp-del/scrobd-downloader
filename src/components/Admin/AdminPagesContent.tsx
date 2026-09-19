import React, { useState, useEffect } from "react";
import { PageContent, SupportedLanguage } from "../../types";
import { loadPageContent, savePageContent, INITIAL_PAGE_CONTENT } from "../../data/siteConfig";
import { SUPPORTED_LANGUAGES } from "../../data/translations";
import { ClassicEditor } from "./ClassicEditor";
import {
  FileEdit,
  Check,
  Save,
  Plus,
  Globe,
  Languages,
  X,
  ExternalLink,
  CheckCircle,
  Eye,
  Info,
  RotateCcw
} from "lucide-react";

interface PageDefinition {
  key: string;
  label: string;
  description: string;
  route: string;
}

const PAGE_DEFINITIONS: PageDefinition[] = [
  { key: "home", label: "Homepage (Downloader & Features)", description: "Hero, guide, features, and main SEO copy", route: "" },
  { key: "about", label: "About Us Page", description: "Mission statement, open-source ethos, and project background", route: "about" },
  { key: "how-it-works", label: "How It Works Page", description: "Technical extraction steps, resolution, and architecture", route: "how-it-works" },
  { key: "contact", label: "Contact & Support Page", description: "Support team contact copy and FAQs", route: "contact" },
  { key: "legal", label: "Legal Terms & Privacy Page", description: "Fair use disclosure, compliance, and caching policies", route: "legal" },
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
    // Look for existing variation in state or in INITIAL_PAGE_CONTENT
    const existing =
      contents.find(
        (c) => (c.pageKey === pageKey && c.language === lang) || c.id === `${pageKey}-${lang}`
      ) ||
      INITIAL_PAGE_CONTENT.find(
        (c) => (c.pageKey === pageKey && c.language === lang) || c.id === `${pageKey}-${lang}`
      );

    if (existing) {
      setEditingItem({ ...existing });
    } else {
      // Find base English variation to prefill
      const baseEn =
        contents.find(
          (c) => (c.pageKey === pageKey && c.language === "en") || c.id === `${pageKey}-en` || c.id === pageKey
        ) ||
        INITIAL_PAGE_CONTENT.find(
          (c) => (c.pageKey === pageKey && c.language === "en") || c.id === `${pageKey}-en` || c.id === pageKey
        );

      const langInfo = SUPPORTED_LANGUAGES.find((l) => l.code === lang);

      setEditingItem({
        id: `${pageKey}-${lang}`,
        pageKey,
        language: lang,
        title: baseEn ? baseEn.title : `Page ${pageKey} (${langInfo?.nativeName || lang.toUpperCase()})`,
        subtitle: baseEn?.subtitle || "",
        content: baseEn?.content || `<p>Write ${langInfo?.nativeName || lang.toUpperCase()} page content here...</p>`,
      });
    }

    // Scroll to top of editor
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const saveCurrentEditingState = (itemToSave: PageContent = editingItem!): PageContent[] => {
    if (!itemToSave) return contents;

    const updatedList = [...contents];
    const existsIndex = updatedList.findIndex(
      (c) =>
        c.id === itemToSave.id ||
        (c.pageKey === itemToSave.pageKey && c.language === itemToSave.language)
    );

    if (existsIndex >= 0) {
      updatedList[existsIndex] = itemToSave;
    } else {
      updatedList.push(itemToSave);
    }

    setContents(updatedList);
    savePageContent(updatedList);
    return updatedList;
  };

  const handleSwitchLanguage = (targetLang: SupportedLanguage) => {
    if (!editingItem) return;
    if (editingItem.language === targetLang) return;

    // 1. Auto-save current edits so work is never lost
    const updatedList = saveCurrentEditingState(editingItem);

    // 2. Locate or instantiate the target language variation
    const pageKey = editingItem.pageKey;
    const existing =
      updatedList.find(
        (c) => (c.pageKey === pageKey && c.language === targetLang) || c.id === `${pageKey}-${targetLang}`
      ) ||
      INITIAL_PAGE_CONTENT.find(
        (c) => (c.pageKey === pageKey && c.language === targetLang) || c.id === `${pageKey}-${targetLang}`
      );

    if (existing) {
      setEditingItem({ ...existing });
    } else {
      // Pre-fill from English or current page
      const baseEn =
        updatedList.find(
          (c) => (c.pageKey === pageKey && c.language === "en") || c.id === `${pageKey}-en` || c.id === pageKey
        ) ||
        INITIAL_PAGE_CONTENT.find(
          (c) => (c.pageKey === pageKey && c.language === "en") || c.id === `${pageKey}-en` || c.id === pageKey
        );
      const langInfo = SUPPORTED_LANGUAGES.find((l) => l.code === targetLang);

      const newItem: PageContent = {
        id: `${pageKey}-${targetLang}`,
        pageKey,
        language: targetLang,
        title: baseEn ? baseEn.title : `Page ${pageKey} (${langInfo?.nativeName || targetLang.toUpperCase()})`,
        subtitle: baseEn?.subtitle || "",
        content: baseEn?.content || `<p>Write ${langInfo?.nativeName || targetLang.toUpperCase()} page content here...</p>`,
      };

      const nextList = [...updatedList, newItem];
      setContents(nextList);
      savePageContent(nextList);
      setEditingItem(newItem);
    }
  };

  const handleSaveForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem) return;

    saveCurrentEditingState(editingItem);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const activeDef = PAGE_DEFINITIONS.find((d) => d.key === editingItem?.pageKey);
  const activeLang = SUPPORTED_LANGUAGES.find((l) => l.code === editingItem?.language);

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
              Unified Editor
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 mt-1">
            Pages Content Editor & Translations
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Manage full text content, rich layouts, and translations for all 5 core website pages across 6 supported languages.
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
          <span>Page content saved successfully! Live front-end content is updated immediately.</span>
        </div>
      )}

      {/* FULL UNIFIED EDITOR: IDENTICAL TO BLOG & ARTICLE EDITOR */}
      {editingItem && (
        <form
          onSubmit={handleSaveForm}
          className="bg-white rounded-2xl border border-slate-200 shadow-2xs p-6 sm:p-7 space-y-6 relative animate-in fade-in duration-200"
        >
          {/* Top Bar with Title & Close Action */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
            <div className="flex items-center gap-3">
              <span className="text-2xl">{activeLang?.flag}</span>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-bold text-slate-900">
                    Edit Page Content: {activeDef?.label || editingItem.pageKey.toUpperCase()}
                  </h3>
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-indigo-50 text-indigo-700 border border-indigo-100">
                    {activeLang?.name} ({editingItem.language.toUpperCase()})
                  </span>
                </div>
                <p className="text-xs text-slate-500 font-mono mt-0.5">
                  ID: {editingItem.id} &bull; Route: /{activeLang?.urlPrefix}/{activeDef?.route}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setEditingItem(null)}
                className="p-2 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition cursor-pointer"
                title="Close Editor"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* 2-Column Responsive Layout (Identical to AdminPosts) */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Left 3 Columns: Headline, Subtitle, & Full WYSIWYG ClassicEditor */}
            <div className="lg:col-span-3 space-y-5">
              {/* Page Headline / Title Input */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">Page Headline / Main Title</label>
                <input
                  type="text"
                  required
                  value={editingItem.title}
                  onChange={(e) => setEditingItem({ ...editingItem, title: e.target.value })}
                  placeholder="e.g. Free Scribd Document Downloader to PDF"
                  className="w-full px-0 py-2 border-0 border-b border-slate-200 text-slate-900 font-bold text-2xl focus:ring-0 focus:border-indigo-500 placeholder-slate-300 transition"
                />
              </div>

              {/* Subtitle / Tagline */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">Page Subtitle / Tagline</label>
                <input
                  type="text"
                  value={editingItem.subtitle || ""}
                  onChange={(e) => setEditingItem({ ...editingItem, subtitle: e.target.value })}
                  placeholder="e.g. Download and save Scribd documents, books, and presentations in high resolution PDF."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-slate-900 font-semibold text-sm focus:ring-2 focus:ring-indigo-500/15"
                />
              </div>

              {/* Full WYSIWYG Classic Editor */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-700">
                    Page Body Content & Layout (Rich Text / HTML / Markdown)
                  </label>
                  <span className="text-[11px] text-indigo-600 font-semibold">
                    WYSIWYG Mode & Source Toggle
                  </span>
                </div>
                <div className="border border-slate-300 rounded-xl overflow-hidden focus-within:ring-2 focus-within:ring-indigo-500/20">
                  <ClassicEditor
                    value={editingItem.content}
                    onChange={(newVal) => setEditingItem({ ...editingItem, content: newVal })}
                    minHeight="420px"
                  />
                </div>
                <p className="text-[11px] text-slate-400">
                  Formatted text, custom headings (H1-H4), tables, lists, blockquotes, and HTML snippets are supported.
                </p>
              </div>

              {/* Live Route Slug Badge */}
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <Globe className="w-4 h-4 text-indigo-600" />
                  <span className="font-semibold text-slate-600">Front-End URL:</span>
                  <code className="text-indigo-600 font-bold bg-white px-2 py-0.5 rounded border border-slate-200">
                    /{activeLang?.urlPrefix}/{activeDef?.route}
                  </code>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    const url = window.location.origin + `?lang=${editingItem.language}&page=${editingItem.pageKey}`;
                    window.open(url, "_blank");
                  }}
                  className="text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 hover:underline cursor-pointer"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>Preview Page</span>
                </button>
              </div>
            </div>

            {/* Right 1 Column: Polylang & Settings Sidebar */}
            <div className="space-y-6">
              {/* Language Settings (Polylang Style) */}
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
                <h4 className="text-xs font-black uppercase tracking-wider text-slate-500 flex items-center gap-2 mb-3">
                  <Globe className="w-4 h-4" />
                  Language & Translations
                </h4>

                {/* Current Language Dropdown */}
                <div className="mb-4">
                  <label className="text-xs font-bold text-slate-700 mb-1 block">Current Language</label>
                  <select
                    value={editingItem.language}
                    onChange={(e) => handleSwitchLanguage(e.target.value as SupportedLanguage)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm font-semibold bg-white cursor-pointer hover:border-indigo-400 focus:ring-2 focus:ring-indigo-500/20"
                  >
                    {SUPPORTED_LANGUAGES.map((lang) => (
                      <option key={lang.code} value={lang.code}>
                        {lang.flag} {lang.name} ({lang.code.toUpperCase()})
                      </option>
                    ))}
                  </select>
                </div>

                {/* Translations Matrix List */}
                <div className="space-y-2 border-t border-slate-200 pt-3">
                  <label className="text-xs font-bold text-slate-700">Translations</label>
                  <ul className="space-y-1.5 text-sm">
                    {SUPPORTED_LANGUAGES.map((lang) => {
                      if (lang.code === editingItem.language) {
                        return (
                          <li
                            key={lang.code}
                            className="flex items-center justify-between p-2 bg-indigo-50 border border-indigo-200 rounded-lg"
                          >
                            <span className="flex items-center gap-1.5 font-bold text-indigo-900">
                              {lang.flag} {lang.name}
                            </span>
                            <span className="text-xs text-indigo-700 font-bold bg-indigo-100 px-2 py-0.5 rounded border border-indigo-200">
                              Current
                            </span>
                          </li>
                        );
                      }

                      const existingTranslation = contents.find(
                        (c) =>
                          (c.pageKey === editingItem.pageKey && c.language === lang.code) ||
                          c.id === `${editingItem.pageKey}-${lang.code}`
                      );

                      if (existingTranslation) {
                        return (
                          <li
                            key={lang.code}
                            onClick={() => handleSwitchLanguage(lang.code)}
                            className="flex items-center justify-between p-2 hover:bg-slate-100 rounded-lg group transition cursor-pointer border border-transparent hover:border-slate-200"
                          >
                            <span className="flex items-center gap-1.5 font-medium text-slate-800 group-hover:text-indigo-600">
                              {lang.flag} {lang.name}
                            </span>
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleSwitchLanguage(lang.code);
                              }}
                              className="text-xs font-bold text-indigo-600 hover:text-indigo-800 bg-indigo-50 px-2.5 py-1 rounded hover:bg-indigo-100 transition flex items-center gap-1 cursor-pointer"
                            >
                              <FileEdit className="w-3 h-3 inline" /> Edit
                            </button>
                          </li>
                        );
                      } else {
                        return (
                          <li
                            key={lang.code}
                            onClick={() => handleSwitchLanguage(lang.code)}
                            className="flex items-center justify-between p-2 hover:bg-slate-100 rounded-lg group transition cursor-pointer border border-transparent hover:border-slate-200"
                          >
                            <span className="flex items-center gap-1.5 font-medium text-slate-500">
                              {lang.flag} {lang.name}
                            </span>
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleSwitchLanguage(lang.code);
                              }}
                              className="text-xs font-bold text-slate-500 hover:text-indigo-600 bg-slate-100 px-2.5 py-1 rounded hover:bg-indigo-50 transition cursor-pointer"
                            >
                              + Create
                            </button>
                          </li>
                        );
                      }
                    })}
                  </ul>
                </div>
              </div>

              {/* Publish & Save Settings Box */}
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-4">
                <h4 className="text-xs font-black uppercase tracking-wider text-slate-500 flex items-center gap-2">
                  <CheckCircle className="w-4 h-4" />
                  Publish & Save
                </h4>

                <div className="p-3 bg-white rounded-lg border border-slate-200 text-xs space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500 font-medium">Status:</span>
                    <span className="font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                      Active
                    </span>
                  </div>
                  <div className="flex items-center justify-between pt-1 border-t border-slate-100">
                    <span className="text-slate-500 font-medium">Visibility:</span>
                    <span className="font-bold text-slate-700">Public Live</span>
                  </div>
                </div>

                <div className="flex flex-col gap-2 pt-1">
                  <button
                    type="submit"
                    className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm shadow-xs transition cursor-pointer flex items-center justify-center gap-2 active:scale-98"
                  >
                    <Save className="w-4 h-4" />
                    <span>Save Page Content</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setEditingItem(null)}
                    className="w-full py-2 rounded-xl border border-slate-300 text-slate-700 hover:bg-white text-xs font-semibold transition cursor-pointer"
                  >
                    Close Editor
                  </button>
                </div>
              </div>

              {/* Page Information Box */}
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-2">
                <h4 className="text-xs font-black uppercase tracking-wider text-slate-500 flex items-center gap-2">
                  <Info className="w-4 h-4" />
                  Page Details
                </h4>
                <div className="text-xs space-y-1 text-slate-600">
                  <p><span className="font-bold text-slate-800">Key:</span> {editingItem.pageKey}</p>
                  <p><span className="font-bold text-slate-800">Target:</span> {activeDef?.label}</p>
                  <p className="text-[11px] text-slate-500 leading-relaxed pt-1">{activeDef?.description}</p>
                </div>
              </div>
            </div>
          </div>
        </form>
      )}

      {/* Pages List with Polylang Language Matrix */}
      <div className="space-y-5">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-extrabold text-slate-900">
            Available Pages & Language Variations
          </h3>
          <span className="text-xs text-slate-500 font-medium">
            Click any variation to open in the unified editor
          </span>
        </div>

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
                              {variation.content.replace(/<[^>]*>/g, "")}
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
