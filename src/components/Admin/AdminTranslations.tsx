import React, { useState } from "react";
import { SupportedLanguage } from "../../types";
import { SUPPORTED_LANGUAGES, saveCustomTranslation, t } from "../../data/translations";
import { Globe, Save, Check, RefreshCw, Search } from "lucide-react";

export function AdminTranslations() {
  const [selectedLang, setSelectedLang] = useState<SupportedLanguage>("es");
  const [searchQuery, setSearchQuery] = useState("");
  const [savedKey, setSavedKey] = useState<string | null>(null);

  // Common UI keys to edit
  const translationKeys = [
    { key: "hero.title1", label: "Hero Title Line 1" },
    { key: "hero.titleHighlight", label: "Hero Title Highlight" },
    { key: "hero.subtitle", label: "Hero Subtitle" },
    { key: "hero.fetchBtn", label: "Hero Fetch Button" },
    { key: "hero.urlPlaceholder", label: "URL Input Placeholder" },
    { key: "downloader.unsupported", label: "Unsupported URL Error Message" },
    { key: "downloader.preparingAd", label: "Preparing Ad Stream Message" },
    { key: "ads.adblockTitle", label: "Ad Blocker Warning Title" },
    { key: "ads.adblockMessage", label: "Ad Blocker Warning Message" },
    { key: "footer.disclaimer", label: "Footer Legal Disclaimer" },
  ];

  const [customValues, setCustomValues] = useState<Record<string, string>>(() => {
    const initial: Record<string, string> = {};
    translationKeys.forEach(({ key }) => {
      initial[key] = t(key, selectedLang);
    });
    return initial;
  });

  const handleLangChange = (lang: SupportedLanguage) => {
    setSelectedLang(lang);
    const updated: Record<string, string> = {};
    translationKeys.forEach(({ key }) => {
      updated[key] = t(key, lang);
    });
    setCustomValues(updated);
  };

  const handleValueChange = (key: string, val: string) => {
    setCustomValues((prev) => ({ ...prev, [key]: val }));
  };

  const handleSaveItem = (key: string) => {
    const val = customValues[key];
    saveCustomTranslation(selectedLang, key, val);
    setSavedKey(key);
    setTimeout(() => setSavedKey(null), 2500);
  };

  const filteredKeys = translationKeys.filter(
    (item) =>
      item.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.key.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6" id="admin-translations-manager">
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs">
        <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-2.5 py-0.5 rounded-full border border-indigo-100">
          Localization Database
        </span>
        <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 mt-1">
          Multilingual Translations Management (Item 43)
        </h2>
        <p className="text-xs text-slate-500 mt-0.5">
          Customize and override string translations for Portuguese (Brazil), English (US), Hindi, Spanish, and Bahasa Indonesia.
        </p>
      </div>

      {/* Language Selector & Search */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-xs font-bold text-slate-500 mr-1">Target Language:</span>
          {SUPPORTED_LANGUAGES.map((l) => (
            <button
              key={l.code}
              type="button"
              onClick={() => handleLangChange(l.code)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition cursor-pointer ${
                selectedLang === l.code
                  ? "bg-indigo-600 text-white shadow-xs"
                  : "bg-slate-100 text-slate-700 hover:bg-slate-200"
              }`}
            >
              <span>{l.flag}</span>
              <span>{l.nativeName}</span>
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search translation key..."
            className="w-full pl-9 pr-3 py-1.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-indigo-500/20"
          />
        </div>
      </div>

      {/* String Editing Cards */}
      <div className="space-y-4">
        {filteredKeys.map(({ key, label }) => {
          const isSaved = savedKey === key;
          return (
            <div
              key={key}
              className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-2.5"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold text-slate-900">{label}</h4>
                  <span className="text-[10px] font-mono text-slate-400">{key}</span>
                </div>
                <button
                  type="button"
                  onClick={() => handleSaveItem(key)}
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition inline-flex items-center gap-1 cursor-pointer ${
                    isSaved
                      ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                      : "bg-indigo-50 hover:bg-indigo-100 text-indigo-700"
                  }`}
                >
                  {isSaved ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Saved!</span>
                    </>
                  ) : (
                    <>
                      <Save className="w-3.5 h-3.5" />
                      <span>Save Key</span>
                    </>
                  )}
                </button>
              </div>

              <textarea
                rows={2}
                value={customValues[key] || ""}
                onChange={(e) => handleValueChange(key, e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs text-slate-800 bg-slate-50/50 focus:bg-white"
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}
