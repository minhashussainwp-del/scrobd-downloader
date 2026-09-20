import React, { useState, useEffect } from "react";
import {
  Home,
  Save,
  Globe,
  Plus,
  Trash2,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Sparkles,
  Layers,
  FileText,
  Loader2,
} from "lucide-react";
import { HomepageContent } from "../../../server/homepageDefaults";

interface AdminHomepageProps {
  onSave: (lang: string, content: any) => Promise<void>;
  availableLanguages?: Array<{ code: string; name: string; flag: string }>;
}

const DEFAULT_LANGS = [
  { code: "en", name: "English (US)", flag: "🇺🇸" },
  { code: "id", name: "Indonesian", flag: "🇮🇩" },
  { code: "hi", name: "Hindi", flag: "🇮🇳" },
  { code: "es", name: "Spanish", flag: "🇲🇽" },
  { code: "fr", name: "French", flag: "🇫🇷" },
  { code: "nl", name: "Dutch", flag: "🇳🇱" },
  { code: "ur", name: "Urdu", flag: "🇵🇰" },
];

export function AdminHomepage({
  onSave,
  availableLanguages = DEFAULT_LANGS,
}: AdminHomepageProps) {
  const [activeLang, setActiveLang] = useState<string>("en");
  const [content, setContent] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState<string | null>(null);
  const [activeSection, setActiveSection] = useState<"hero" | "howItWorks" | "benefits" | "guide" | "faq">("hero");

  // Load homepage content for active language
  const loadHomepage = async (lang: string) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/homepage?lang=${lang}`);
      const data = await res.json();
      setContent(data.content || {});
    } catch (err) {
      console.error("Failed to load homepage content:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadHomepage(activeLang);
  }, [activeLang]);

  const handleChange = (field: string, value: any) => {
    setContent((prev: any) => ({ ...prev, [field]: value }));
  };

  const handleStepChange = (index: number, field: string, value: any) => {
    setContent((prev: any) => {
      const steps = [...(prev.steps || [])];
      steps[index] = { ...steps[index], [field]: value };
      return { ...prev, steps };
    });
  };

  const handleBenefitChange = (index: number, field: string, value: any) => {
    setContent((prev: any) => {
      const benefits = [...(prev.benefits || [])];
      benefits[index] = { ...benefits[index], [field]: value };
      return { ...prev, benefits };
    });
  };

  const handleFaqChange = (index: number, field: string, value: any) => {
    setContent((prev: any) => {
      const faqs = [...(prev.faqs || [])];
      faqs[index] = { ...faqs[index], [field]: value };
      return { ...prev, faqs };
    });
  };

  const addFaqItem = () => {
    setContent((prev: any) => ({
      ...prev,
      faqs: [...(prev.faqs || []), { question: "New Question?", answer: "Answer description..." }],
    }));
  };

  const removeFaqItem = (index: number) => {
    setContent((prev: any) => {
      const faqs = [...(prev.faqs || [])];
      faqs.splice(index, 1);
      return { ...prev, faqs };
    });
  };

  const handleSave = async () => {
    setSaving(true);
    setSaveMessage(null);
    try {
      await onSave(activeLang, content);
      setSaveMessage(`Homepage for [${activeLang.toUpperCase()}] successfully saved!`);
      setTimeout(() => setSaveMessage(null), 3000);
    } catch (err: any) {
      setSaveMessage("Failed to save: " + err.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading || !content) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-8 h-8 text-emerald-600 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-5 pb-12">
      {/* Top Header & Language Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white rounded-xl p-4 border border-slate-200 shadow-xs">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <Home className="w-5 h-5 text-emerald-600" />
            <span>Dedicated Homepage Editor</span>
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Customize hero texts, conversion steps, benefits, educational guide, and FAQ items for each language.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {saveMessage && (
            <span className="text-xs text-emerald-600 font-medium flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" />
              {saveMessage}
            </span>
          )}

          <button
            type="button"
            onClick={handleSave}
            disabled={saving}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-xs transition disabled:opacity-50"
          >
            {saving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
            <span>Save [{activeLang.toUpperCase()}] Homepage</span>
          </button>
        </div>
      </div>

      {/* Language Switcher Bar */}
      <div className="bg-white rounded-xl border border-slate-200 p-3 shadow-xs flex items-center justify-between gap-2 text-xs">
        <div className="flex items-center gap-2 overflow-x-auto">
          <Globe className="w-4 h-4 text-emerald-600 shrink-0" />
          <span className="font-semibold text-slate-700 whitespace-nowrap">Active Locale:</span>
          {availableLanguages.map((l) => (
            <button
              key={l.code}
              type="button"
              onClick={() => setActiveLang(l.code)}
              className={`px-3 py-1 rounded-md font-semibold flex items-center gap-1.5 transition whitespace-nowrap ${
                activeLang === l.code
                  ? "bg-slate-900 text-white shadow-xs"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              <span>{l.flag}</span>
              <span>{l.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Section Subtabs */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="flex items-center border-b border-slate-200 bg-slate-50/70 px-4 text-xs font-semibold overflow-x-auto">
          <button
            type="button"
            onClick={() => setActiveSection("hero")}
            className={`py-3 px-3 border-b-2 transition whitespace-nowrap ${
              activeSection === "hero"
                ? "border-emerald-600 text-emerald-700 font-bold"
                : "border-transparent text-slate-500 hover:text-slate-800"
            }`}
          >
            Hero & Downloader Box
          </button>
          <button
            type="button"
            onClick={() => setActiveSection("howItWorks")}
            className={`py-3 px-3 border-b-2 transition whitespace-nowrap ${
              activeSection === "howItWorks"
                ? "border-emerald-600 text-emerald-700 font-bold"
                : "border-transparent text-slate-500 hover:text-slate-800"
            }`}
          >
            How It Works (3 Steps)
          </button>
          <button
            type="button"
            onClick={() => setActiveSection("benefits")}
            className={`py-3 px-3 border-b-2 transition whitespace-nowrap ${
              activeSection === "benefits"
                ? "border-emerald-600 text-emerald-700 font-bold"
                : "border-transparent text-slate-500 hover:text-slate-800"
            }`}
          >
            Features & Benefits
          </button>
          <button
            type="button"
            onClick={() => setActiveSection("guide")}
            className={`py-3 px-3 border-b-2 transition whitespace-nowrap ${
              activeSection === "guide"
                ? "border-emerald-600 text-emerald-700 font-bold"
                : "border-transparent text-slate-500 hover:text-slate-800"
            }`}
          >
            Homepage Article Guide
          </button>
          <button
            type="button"
            onClick={() => setActiveSection("faq")}
            className={`py-3 px-3 border-b-2 transition whitespace-nowrap ${
              activeSection === "faq"
                ? "border-emerald-600 text-emerald-700 font-bold"
                : "border-transparent text-slate-500 hover:text-slate-800"
            }`}
          >
            FAQ Accordion ({content.faqs?.length || 0})
          </button>
        </div>

        {/* Section 1: Hero */}
        {activeSection === "hero" && (
          <div className="p-5 space-y-4 text-xs">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Hero Pill Badge</label>
                <input
                  type="text"
                  value={content.heroBadge || ""}
                  onChange={(e) => handleChange("heroBadge", e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Primary H1 Heading</label>
                <input
                  type="text"
                  value={content.h1Title || content.heroTitle || ""}
                  onChange={(e) => {
                    handleChange("h1Title", e.target.value);
                    handleChange("heroTitle", e.target.value);
                  }}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                />
              </div>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Hero Subtitle / Description</label>
              <textarea
                rows={3}
                value={content.heroSubtitle || ""}
                onChange={(e) => handleChange("heroSubtitle", e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block font-bold text-slate-700 mb-1">CTA Button Text</label>
                <input
                  type="text"
                  value={content.ctaText || ""}
                  onChange={(e) => handleChange("ctaText", e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 font-semibold text-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Input Placeholder</label>
                <input
                  type="text"
                  value={content.placeholderText || ""}
                  onChange={(e) => handleChange("placeholderText", e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Quality Badge Text</label>
                <input
                  type="text"
                  value={content.qualityBadgeText || ""}
                  onChange={(e) => handleChange("qualityBadgeText", e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                />
              </div>
            </div>
          </div>
        )}

        {/* Section 2: How It Works */}
        {activeSection === "howItWorks" && (
          <div className="p-5 space-y-4 text-xs">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Section Title</label>
                <input
                  type="text"
                  value={content.howItWorksTitle || ""}
                  onChange={(e) => handleChange("howItWorksTitle", e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 font-semibold focus:outline-none"
                />
              </div>
              <div>
                <label className="block font-bold text-slate-700 mb-1">Section Subtitle</label>
                <input
                  type="text"
                  value={content.howItWorksSubtitle || ""}
                  onChange={(e) => handleChange("howItWorksSubtitle", e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:outline-none"
                />
              </div>
            </div>

            <div className="space-y-3 pt-2">
              <span className="font-bold text-slate-900 block">3 Simple Steps:</span>
              {(content.steps || []).map((step: any, idx: number) => (
                <div key={idx} className="p-3.5 rounded-lg border border-slate-200 bg-slate-50 space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-emerald-600 text-white font-bold flex items-center justify-center text-[10px]">
                      {idx + 1}
                    </span>
                    <input
                      type="text"
                      value={step.title || ""}
                      onChange={(e) => handleStepChange(idx, "title", e.target.value)}
                      placeholder={`Step ${idx + 1} Title`}
                      className="flex-1 px-2.5 py-1 rounded border border-slate-200 bg-white font-semibold"
                    />
                  </div>
                  <textarea
                    rows={2}
                    value={step.description || ""}
                    onChange={(e) => handleStepChange(idx, "description", e.target.value)}
                    placeholder={`Step ${idx + 1} instructions...`}
                    className="w-full px-2.5 py-1.5 rounded border border-slate-200 bg-white"
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Section 3: Benefits */}
        {activeSection === "benefits" && (
          <div className="p-5 space-y-4 text-xs">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Section Title</label>
                <input
                  type="text"
                  value={content.benefitsTitle || ""}
                  onChange={(e) => handleChange("benefitsTitle", e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 font-semibold focus:outline-none"
                />
              </div>
              <div>
                <label className="block font-bold text-slate-700 mb-1">Section Subtitle</label>
                <input
                  type="text"
                  value={content.benefitsSubtitle || ""}
                  onChange={(e) => handleChange("benefitsSubtitle", e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              {(content.benefits || []).map((b: any, idx: number) => (
                <div key={idx} className="p-3 rounded-lg border border-slate-200 bg-slate-50 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-500">Feature #{idx + 1}</span>
                    <input
                      type="text"
                      value={b.badge || ""}
                      onChange={(e) => handleBenefitChange(idx, "badge", e.target.value)}
                      placeholder="Badge"
                      className="w-24 px-2 py-0.5 rounded border border-slate-200 bg-white text-[11px] font-semibold text-emerald-700"
                    />
                  </div>
                  <input
                    type="text"
                    value={b.title || ""}
                    onChange={(e) => handleBenefitChange(idx, "title", e.target.value)}
                    placeholder="Feature Title"
                    className="w-full px-2.5 py-1 rounded border border-slate-200 bg-white font-semibold"
                  />
                  <textarea
                    rows={2}
                    value={b.description || ""}
                    onChange={(e) => handleBenefitChange(idx, "description", e.target.value)}
                    placeholder="Feature Description"
                    className="w-full px-2.5 py-1 rounded border border-slate-200 bg-white"
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Section 4: Guide Article */}
        {activeSection === "guide" && (
          <div className="p-5 space-y-4 text-xs">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Guide Pill Badge</label>
                <input
                  type="text"
                  value={content.guideBadge || ""}
                  onChange={(e) => handleChange("guideBadge", e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:outline-none"
                />
              </div>
              <div>
                <label className="block font-bold text-slate-700 mb-1">Guide Title</label>
                <input
                  type="text"
                  value={content.guideTitle || ""}
                  onChange={(e) => handleChange("guideTitle", e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 font-semibold focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Guide Body Content (Markdown & HTML)
              </label>
              <textarea
                rows={12}
                value={content.guideContent || ""}
                onChange={(e) => handleChange("guideContent", e.target.value)}
                className="w-full p-3.5 rounded-lg border border-slate-200 font-mono leading-relaxed focus:outline-none"
              />
            </div>
          </div>
        )}

        {/* Section 5: FAQ */}
        {activeSection === "faq" && (
          <div className="p-5 space-y-4 text-xs">
            <div className="flex items-center justify-between">
              <div>
                <label className="block font-bold text-slate-700 mb-1">FAQ Section Title</label>
                <input
                  type="text"
                  value={content.faqTitle || ""}
                  onChange={(e) => handleChange("faqTitle", e.target.value)}
                  className="w-72 px-3 py-1.5 rounded-lg border border-slate-200 font-semibold focus:outline-none"
                />
              </div>

              <button
                type="button"
                onClick={addFaqItem}
                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-semibold shadow-xs"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Question</span>
              </button>
            </div>

            <div className="space-y-3 pt-2">
              {(content.faqs || []).map((faq: any, idx: number) => (
                <div key={idx} className="p-3.5 rounded-lg border border-slate-200 bg-slate-50 space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <input
                      type="text"
                      value={faq.question || ""}
                      onChange={(e) => handleFaqChange(idx, "question", e.target.value)}
                      placeholder="Question?"
                      className="flex-1 px-2.5 py-1 rounded border border-slate-200 bg-white font-semibold text-slate-800"
                    />
                    <button
                      type="button"
                      onClick={() => removeFaqItem(idx)}
                      className="p-1 rounded text-rose-500 hover:bg-rose-50"
                      title="Remove Question"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  <textarea
                    rows={2}
                    value={faq.answer || ""}
                    onChange={(e) => handleFaqChange(idx, "answer", e.target.value)}
                    placeholder="Answer description..."
                    className="w-full px-2.5 py-1.5 rounded border border-slate-200 bg-white"
                  />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
