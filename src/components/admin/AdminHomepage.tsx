import React, { useState, useEffect, useRef } from "react";
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
  LayoutTemplate,
  MessageSquare,
  RefreshCw,
} from "lucide-react";
import { GutenbergEditor } from "./gutenberg/GutenbergEditor";
import { GutenbergEditorBlock } from "./gutenberg/types";
import {
  parseHomepageToBlocks,
  extractBlocksToHomepage,
} from "./gutenberg/gutenbergConverter";
import { adminFetch } from "../../utils/adminApi";

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

function getFallbackHomepage(lang: string) {
  return {
    language: lang,
    metaTitle: "Scribd Downloader - Free Document & Presentation PDF Exporter",
    metaDescription: "Download Scribd documents, books, and presentations in pristine vector PDF format instantly without registration.",
    h1Title: "Free Scribd Document & Presentation Downloader",
    heroBadge: "⚡ Instant Vector PDF Downloader",
    heroTitle: "Download Scribd Documents, Presentations & PDFs Fast",
    heroSubtitle: "Save complete Scribd presentations, documents, research publications, and slides directly to high-quality vector PDF format without fees or account requirements.",
    ctaText: "Download PDF Now",
    placeholderText: "Paste Scribd document link here (e.g. https://www.scribd.com/document/359613425/...)",
    qualityBadgeText: "Vector PDF Format",
    autoDownloadBadgeText: "High Resolution Clean Output",
    checklistItems: [
      "100% Free & Unlimited",
      "No Registration or Credit Card",
      "Pristine Vector Clarity",
      "Mobile & Tablet Friendly",
    ],
    howItWorksTitle: "How Scribd Downloader Operates",
    howItWorksSubtitle: "Follow 3 straightforward steps to download any public document in vector PDF format within seconds.",
    steps: [
      { step: "01", title: "Copy Scribd URL", description: "Navigate to Scribd and copy the document or presentation URL from your browser's address bar." },
      { step: "02", title: "Paste Document Link", description: "Paste the copied URL into the downloader input field above and click the Download button." },
      { step: "03", title: "Download Vector PDF", description: "Our high-speed engine parses every vector slide and delivers a complete, searchable PDF instantly." },
    ],
    benefitsTitle: "Why Use Our Scribd Downloader Tool?",
    benefitsSubtitle: "Engineered specifically for researchers, students, and readers worldwide.",
    benefits: [
      { title: "Pure Vector Text & Crisp Images", description: "Preserves vector fonts, original layouts, and embedded charts without pixelation or compression artifacts." },
      { title: "Completely Free With No Sign-up", description: "No subscription fees, hidden watermarks, or email verification required." },
      { title: "Lightning Fast Extraction", description: "High-speed multi-threaded parsing downloads multi-page documents in seconds." },
    ],
    guideBadge: "Complete Reader Guide",
    guideTitle: "Ultimate Guide to Downloading Scribd Documents & Presentations",
    guideContent: "Comprehensive walkthrough and tips for extracting high-resolution PDF documents from Scribd effortlessly.",
    faqTitle: "Frequently Asked Questions",
    faqSubtitle: "Common inquiries about downloading documents, supported formats, and system capabilities.",
    faqs: [
      { question: "Is Scribd Downloader completely free to use?", answer: "Yes, our service is 100% free with no hidden charges, registration, or subscription requirements." },
      { question: "What formats can I download?", answer: "All documents and presentations are compiled into pristine, high-resolution vector PDF files." },
      { question: "Do I need to install any software or browser extensions?", answer: "No software or extensions are required. The entire conversion happens safely online through your web browser." },
    ],
  };
}

export function AdminHomepage({
  onSave,
  availableLanguages = DEFAULT_LANGS,
}: AdminHomepageProps) {
  const [activeLang, setActiveLang] = useState<string>("en");
  const [content, setContent] = useState<any>(null);
  const [blocks, setBlocks] = useState<GutenbergEditorBlock[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState<string | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"gutenberg" | "faq">("gutenberg");
  const abortControllerRef = useRef<AbortController | null>(null);

  // Load homepage content for active language with timeout and error resilience
  const loadHomepage = async (lang: string) => {
    setLoading(true);
    setLoadError(null);

    // Cancel pending request if language changed rapidly
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    const controller = new AbortController();
    abortControllerRef.current = controller;

    // Safety timeout: auto-fallback if request exceeds 4000ms
    const timeoutTimer = setTimeout(() => {
      if (!content) {
        console.warn(`Homepage API slow for [${lang}], applying default template`);
        const fallback = getFallbackHomepage(lang);
        setContent(fallback);
        try {
          setBlocks(parseHomepageToBlocks(fallback));
        } catch (e) {
          console.error("Fallback block parsing error:", e);
        }
        setLoading(false);
      }
    }, 4000);

    try {
      const res = await adminFetch(`/api/admin/homepage?lang=${lang}`, {
        signal: controller.signal,
      }, 5000);

      clearTimeout(timeoutTimer);

      if (!res.ok) {
        throw new Error(`Server returned status ${res.status}`);
      }

      const data = await res.json();
      const rawContent = data.content || getFallbackHomepage(lang);
      setContent(rawContent);

      try {
        const parsedBlocks = parseHomepageToBlocks(rawContent);
        setBlocks(parsedBlocks);
      } catch (parseErr) {
        console.warn("Failed to parse blocks, using fallback structure:", parseErr);
        setBlocks(parseHomepageToBlocks(getFallbackHomepage(lang)));
      }
    } catch (err: any) {
      clearTimeout(timeoutTimer);
      if (err.name === "AbortError") return;
      console.error("Failed to load homepage content:", err);
      setLoadError("Could not retrieve saved homepage content from server. Loaded default structure.");
      const fallback = getFallbackHomepage(lang);
      setContent(fallback);
      try {
        setBlocks(parseHomepageToBlocks(fallback));
      } catch (e) {
        console.error(e);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadHomepage(activeLang);
    return () => {
      if (abortControllerRef.current) abortControllerRef.current.abort();
    };
  }, [activeLang]);

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
      faqs: [
        ...(prev.faqs || []),
        {
          question: "New Frequently Asked Question?",
          answer: "Detailed answer explaining how the tool functions...",
        },
      ],
    }));
  };

  const removeFaqItem = (index: number) => {
    setContent((prev: any) => {
      const faqs = [...(prev.faqs || [])];
      faqs.splice(index, 1);
      return { ...prev, faqs };
    });
  };

  const handleGutenbergSave = async (payload: {
    title: string;
    content: string;
    htmlContent: string;
    blocks: GutenbergEditorBlock[];
    metadata: any;
    status: "published" | "draft";
    language: string;
  }) => {
    setSaving(true);
    setSaveMessage(null);
    try {
      setBlocks(payload.blocks);
      const updatedHomepage = extractBlocksToHomepage(payload.blocks, content);
      updatedHomepage.h1Title = payload.title || updatedHomepage.h1Title;
      updatedHomepage.heroTitle = payload.title || updatedHomepage.heroTitle;
      updatedHomepage.htmlContent = payload.htmlContent;
      updatedHomepage.guideContent = payload.content;

      await onSave(activeLang, updatedHomepage);
      setContent(updatedHomepage);
      setSaveMessage(`Homepage for [${activeLang.toUpperCase()}] successfully saved!`);
      setTimeout(() => setSaveMessage(null), 3000);
    } catch (err: any) {
      setSaveMessage("Failed to save: " + err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleManualSave = async () => {
    setSaving(true);
    setSaveMessage(null);
    try {
      const updatedHomepage = extractBlocksToHomepage(blocks, content);
      await onSave(activeLang, updatedHomepage);
      setContent(updatedHomepage);
      setSaveMessage(`Homepage for [${activeLang.toUpperCase()}] successfully saved!`);
      setTimeout(() => setSaveMessage(null), 3000);
    } catch (err: any) {
      setSaveMessage("Failed to save: " + err.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading && !content) {
    return (
      <div className="flex flex-col items-center justify-center py-24 space-y-3">
        <Loader2 className="w-8 h-8 text-emerald-600 animate-spin" />
        <p className="text-xs text-slate-500 font-medium">Loading Homepage Editor for [{activeLang.toUpperCase()}]...</p>
        <button
          type="button"
          onClick={() => {
            const fallback = getFallbackHomepage(activeLang);
            setContent(fallback);
            setBlocks(parseHomepageToBlocks(fallback));
            setLoading(false);
          }}
          className="mt-2 text-xs text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 px-3 py-1.5 rounded-lg font-medium transition cursor-pointer"
        >
          Load Default Template Now
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-4 pb-12">
      {loadError && (
        <div className="p-3 bg-amber-50 border border-amber-200 text-amber-800 rounded-xl text-xs flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
            <span>{loadError}</span>
          </div>
          <button
            type="button"
            onClick={() => loadHomepage(activeLang)}
            className="inline-flex items-center gap-1 font-semibold text-amber-900 underline hover:no-underline"
          >
            <RefreshCw className="w-3 h-3" />
            <span>Retry Connection</span>
          </button>
        </div>
      )}

      {/* Top Header & Navigation Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white rounded-xl p-4 border border-slate-200 shadow-xs">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <Home className="w-5 h-5 text-emerald-600" />
            <span>Unified Homepage Content Editor</span>
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Hero, Downloader Box, How It Works, Benefits, and Article Guide merged into one seamless Gutenberg block flow.
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
            onClick={handleManualSave}
            disabled={saving}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-xs transition disabled:opacity-50 cursor-pointer"
          >
            {saving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
            <span>Save [{activeLang.toUpperCase()}] Homepage</span>
          </button>
        </div>
      </div>

      {/* Language Switcher & Tab Selector Bar */}
      <div className="bg-white rounded-xl border border-slate-200 p-3 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0">
          <Globe className="w-4 h-4 text-emerald-600 shrink-0" />
          <span className="font-semibold text-slate-700 whitespace-nowrap">Active Locale:</span>
          {availableLanguages.map((l) => (
            <button
              key={l.code}
              type="button"
              onClick={() => setActiveLang(l.code)}
              className={`px-3 py-1 rounded-md font-semibold flex items-center gap-1.5 transition whitespace-nowrap cursor-pointer ${
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

        {/* Tab Toggle: Unified Gutenberg vs FAQ Accordion */}
        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg border border-slate-200 self-start md:self-auto">
          <button
            type="button"
            onClick={() => setActiveTab("gutenberg")}
            className={`px-3 py-1.5 rounded-md font-bold text-xs flex items-center gap-1.5 transition cursor-pointer ${
              activeTab === "gutenberg"
                ? "bg-white text-emerald-700 shadow-xs"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <LayoutTemplate className="w-3.5 h-3.5 text-emerald-600" />
            <span>Gutenberg Content Builder</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("faq")}
            className={`px-3 py-1.5 rounded-md font-bold text-xs flex items-center gap-1.5 transition cursor-pointer ${
              activeTab === "faq"
                ? "bg-white text-emerald-700 shadow-xs"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <MessageSquare className="w-3.5 h-3.5 text-indigo-600" />
            <span>FAQ Accordion ({content.faqs?.length || 0})</span>
          </button>
        </div>
      </div>

      {/* Tab 1: Unified Gutenberg Block Canvas */}
      {activeTab === "gutenberg" && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
          <GutenbergEditor
            key={`${activeLang}-${blocks.length}`}
            initialTitle={content.heroTitle || content.h1Title || "Scribd Downloader – Free PDF Downloads"}
            initialBlocks={blocks}
            initialContent={content.guideContent || ""}
            initialMetadata={{
              heroBadge: content.heroBadge,
              h1Title: content.h1Title || content.heroTitle,
              guideBadge: content.guideBadge,
              guideTitle: content.guideTitle,
            }}
            targetLang={activeLang}
            onSave={handleGutenbergSave}
            onPreview={() => {
              window.open(`/${activeLang === "en" ? "" : activeLang}`, "_blank");
            }}
          />
        </div>
      )}

      {/* Tab 2: Separate FAQ Accordion Manager */}
      {activeTab === "faq" && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
            <div>
              <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <HelpCircle className="w-5 h-5 text-indigo-600" />
                <span>Dedicated FAQ Accordion Section</span>
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Manage expandable question/answer accordions that render with automated JSON-LD FAQ schema.
              </p>
            </div>

            <button
              type="button"
              onClick={addFaqItem}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-xs transition cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Add FAQ Question</span>
            </button>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              FAQ Section Title ({activeLang.toUpperCase()})
            </label>
            <input
              type="text"
              value={content.faqTitle || "Frequently Asked Questions"}
              onChange={(e) =>
                setContent((prev: any) => ({ ...prev, faqTitle: e.target.value }))
              }
              className="w-full sm:w-96 px-3 py-2 text-xs font-semibold text-slate-800 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
            />
          </div>

          <div className="space-y-3">
            {(content.faqs || []).map((faq: any, idx: number) => (
              <div
                key={idx}
                className="p-4 rounded-xl border border-slate-200 bg-slate-50/60 hover:bg-slate-50 transition space-y-2.5"
              >
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2 flex-1">
                    <span className="w-6 h-6 rounded-full bg-indigo-100 text-indigo-700 font-bold text-xs flex items-center justify-center shrink-0">
                      {idx + 1}
                    </span>
                    <input
                      type="text"
                      value={faq.question || ""}
                      onChange={(e) => handleFaqChange(idx, "question", e.target.value)}
                      placeholder="Frequently Asked Question?"
                      className="w-full px-3 py-1.5 rounded-lg border border-slate-200 bg-white font-bold text-xs text-slate-800 focus:outline-none"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => removeFaqItem(idx)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition cursor-pointer"
                    title="Remove Question"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <div className="pl-8">
                  <textarea
                    rows={3}
                    value={faq.answer || ""}
                    onChange={(e) => handleFaqChange(idx, "answer", e.target.value)}
                    placeholder="Clear, informative answer description..."
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-white text-xs text-slate-700 leading-relaxed focus:outline-none"
                  />
                </div>
              </div>
            ))}

            {(content.faqs || []).length === 0 && (
              <div className="text-center py-10 border-2 border-dashed border-slate-200 rounded-xl bg-slate-50">
                <HelpCircle className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                <p className="text-xs font-semibold text-slate-600">No FAQ items created yet.</p>
                <button
                  type="button"
                  onClick={addFaqItem}
                  className="mt-2 text-xs font-bold text-indigo-600 hover:text-indigo-800"
                >
                  + Add First Question
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
