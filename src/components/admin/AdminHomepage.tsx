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
  Bold,
  Italic,
  Underline,
  Strikethrough,
  List,
  ListOrdered,
  Quote,
  Code,
  Link as LinkIcon,
  Image as ImageIcon,
  Table as TableIcon,
  Eye,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { adminFetch } from "../../utils/adminApi";
import { ModernArticleRenderer } from "../ModernArticleRenderer";

interface AdminHomepageProps {
  onSave: (lang: string, content: any) => Promise<void>;
  availableLanguages?: Array<{ code: string; name: string; flag: string }>;
  onPreviewUrl?: (url: string) => void;
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
  onPreviewUrl,
}: AdminHomepageProps) {
  const [activeLang, setActiveLang] = useState<string>("en");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Editable fields
  const [guideBadge, setGuideBadge] = useState<string>("KNOWLEDGE BASE");
  const [guideTitle, setGuideTitle] = useState<string>("");
  const [htmlContent, setHtmlContent] = useState<string>("");
  const [editorMode, setEditorMode] = useState<"visual" | "html">("visual");

  // Hero section fields (collapsible)
  const [showHeroSettings, setShowHeroSettings] = useState(false);
  const [heroBadge, setHeroBadge] = useState<string>("100% Free & Secure Scribd PDF Converter");
  const [heroTitle, setHeroTitle] = useState<string>("Scribd Downloader – Free PDF Downloads");
  const [heroSubtitle, setHeroSubtitle] = useState<string>("Save documents, research papers, and slide decks from Scribd as clean, readable PDFs.");
  const [ctaText, setCtaText] = useState<string>("Download PDF");

  // How It Works section fields (collapsible)
  const [showHowSettings, setShowHowSettings] = useState(false);
  const [howTitle, setHowTitle] = useState<string>("");
  const [howStep1, setHowStep1] = useState<string>("");
  const [howStep1Desc, setHowStep1Desc] = useState<string>("");
  const [howStep2, setHowStep2] = useState<string>("");
  const [howStep2Desc, setHowStep2Desc] = useState<string>("");
  const [howStep3, setHowStep3] = useState<string>("");
  const [howStep3Desc, setHowStep3Desc] = useState<string>("");

  // Why Use This Tool (Benefits) section fields (collapsible)
  const [showBenefitsSettings, setShowBenefitsSettings] = useState(false);
  const [benefitsTitle, setBenefitsTitle] = useState<string>("");
  const [benefitsFastTitle, setBenefitsFastTitle] = useState<string>("");
  const [benefitsFastDesc, setBenefitsFastDesc] = useState<string>("");
  const [benefitsSafeTitle, setBenefitsSafeTitle] = useState<string>("");
  const [benefitsSafeDesc, setBenefitsSafeDesc] = useState<string>("");
  const [benefitsDevicesTitle, setBenefitsDevicesTitle] = useState<string>("");
  const [benefitsDevicesDesc, setBenefitsDevicesDesc] = useState<string>("");
  const [benefitsFreeTitle, setBenefitsFreeTitle] = useState<string>("");
  const [benefitsFreeDesc, setBenefitsFreeDesc] = useState<string>("");

  // SEO fields (collapsible)
  const [showSeoSettings, setShowSeoSettings] = useState(false);
  const [metaTitle, setMetaTitle] = useState<string>("");
  const [metaDescription, setMetaDescription] = useState<string>("");

  // FAQs (collapsible)
  const [showFaqSettings, setShowFaqSettings] = useState(false);
  const [faqs, setFaqs] = useState<Array<{ question: string; answer: string }>>([]);

  // Full article live preview modal
  const [showPreviewModal, setShowPreviewModal] = useState(false);

  const visualEditorRef = useRef<HTMLDivElement>(null);

  // Load homepage content for active language
  const loadHomepageData = async (lang: string) => {
    setLoading(true);
    setErrorMessage(null);
    try {
      const res = await adminFetch(`/api/admin/homepage?lang=${lang}`, {}, 6000);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      const content = data.content || {};

      setGuideBadge(content.guideBadge || "KNOWLEDGE BASE");
      setGuideTitle(content.guideTitle || "");
      
      const rawArticle = content.htmlContent || content.guideContent || "";
      setHtmlContent(rawArticle);
      if (visualEditorRef.current) {
        visualEditorRef.current.innerHTML = rawArticle;
      }

      setHeroBadge(content.heroBadge || "100% Free & Secure Scribd PDF Converter");
      setHeroTitle(content.heroTitle || content.h1Title || "Scribd Downloader – Free PDF Downloads");
      setHeroSubtitle(content.heroSubtitle || "Save documents, research papers, and slide decks from Scribd as clean, readable PDFs.");
      setCtaText(content.ctaText || "Download PDF");

      setHowTitle(content.howTitle || "");
      setHowStep1(content.howStep1 || "");
      setHowStep1Desc(content.howStep1Desc || "");
      setHowStep2(content.howStep2 || "");
      setHowStep2Desc(content.howStep2Desc || "");
      setHowStep3(content.howStep3 || "");
      setHowStep3Desc(content.howStep3Desc || "");

      setBenefitsTitle(content.benefitsTitle || "");
      setBenefitsFastTitle(content.benefitsFastTitle || "");
      setBenefitsFastDesc(content.benefitsFastDesc || "");
      setBenefitsSafeTitle(content.benefitsSafeTitle || "");
      setBenefitsSafeDesc(content.benefitsSafeDesc || "");
      setBenefitsDevicesTitle(content.benefitsDevicesTitle || "");
      setBenefitsDevicesDesc(content.benefitsDevicesDesc || "");
      setBenefitsFreeTitle(content.benefitsFreeTitle || "");
      setBenefitsFreeDesc(content.benefitsFreeDesc || "");

      setMetaTitle(content.metaTitle || "");
      setMetaDescription(content.metaDescription || "");

      const faqList = Array.isArray(content.faqs)
        ? content.faqs.map((f: any) => ({
            question: f.question || f.q || "",
            answer: f.answer || f.a || "",
          }))
        : [];
      setFaqs(faqList);
    } catch (err: any) {
      console.error("Failed to load homepage:", err);
      setErrorMessage("Could not load latest homepage content. Check server connection.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadHomepageData(activeLang);
  }, [activeLang]);

  // Sync visual editor content when visualEditorRef is rendered or mode switched
  useEffect(() => {
    if (editorMode === "visual" && visualEditorRef.current) {
      if (visualEditorRef.current.innerHTML !== htmlContent) {
        visualEditorRef.current.innerHTML = htmlContent;
      }
    }
  }, [editorMode, loading]);

  // Visual Editor Command execution
  const executeCommand = (command: string, value: string | undefined = undefined) => {
    if (editorMode === "html") return;
    document.execCommand(command, false, value);
    if (visualEditorRef.current) {
      setHtmlContent(visualEditorRef.current.innerHTML);
    }
  };

  const handleVisualInput = () => {
    if (visualEditorRef.current) {
      setHtmlContent(visualEditorRef.current.innerHTML);
    }
  };

  // Word count & reading stats
  const plainText = htmlContent.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
  const wordCount = plainText ? plainText.split(" ").filter(Boolean).length : 0;
  const charCount = plainText.length;
  const readTime = Math.max(1, Math.ceil(wordCount / 200));

  // Add & Remove FAQs
  const addFaqItem = () => {
    setFaqs((prev) => [
      ...prev,
      { question: "New Question?", answer: "Detailed explanation..." },
    ]);
  };

  const updateFaq = (idx: number, field: "question" | "answer", val: string) => {
    setFaqs((prev) => {
      const copy = [...prev];
      copy[idx] = { ...copy[idx], [field]: val };
      return copy;
    });
  };

  const removeFaq = (idx: number) => {
    setFaqs((prev) => prev.filter((_, i) => i !== idx));
  };

  // Master Save Handler
  const handleSaveHomepage = async () => {
    setSaving(true);
    setSaveSuccess(null);
    setErrorMessage(null);

    let finalHtml = htmlContent;
    if (editorMode === "visual" && visualEditorRef.current) {
      finalHtml = visualEditorRef.current.innerHTML;
      setHtmlContent(finalHtml);
    }

    const payload = {
      language: activeLang,
      guideBadge: guideBadge.trim(),
      guideTitle: guideTitle.trim(),
      htmlContent: finalHtml.trim(),
      guideContent: finalHtml.trim(),
      heroBadge: heroBadge.trim(),
      heroTitle: heroTitle.trim(),
      h1Title: heroTitle.trim(),
      heroSubtitle: heroSubtitle.trim(),
      ctaText: ctaText.trim(),
      howTitle: howTitle.trim(),
      howStep1: howStep1.trim(),
      howStep1Desc: howStep1Desc.trim(),
      howStep2: howStep2.trim(),
      howStep2Desc: howStep2Desc.trim(),
      howStep3: howStep3.trim(),
      howStep3Desc: howStep3Desc.trim(),
      benefitsTitle: benefitsTitle.trim(),
      benefitsFastTitle: benefitsFastTitle.trim(),
      benefitsFastDesc: benefitsFastDesc.trim(),
      benefitsSafeTitle: benefitsSafeTitle.trim(),
      benefitsSafeDesc: benefitsSafeDesc.trim(),
      benefitsDevicesTitle: benefitsDevicesTitle.trim(),
      benefitsDevicesDesc: benefitsDevicesDesc.trim(),
      benefitsFreeTitle: benefitsFreeTitle.trim(),
      benefitsFreeDesc: benefitsFreeDesc.trim(),
      metaTitle: metaTitle.trim() || guideTitle.trim() || heroTitle.trim(),
      metaDescription: metaDescription.trim() || heroSubtitle.trim(),
      faqs,
      lastUpdated: new Date().toISOString(),
    };

    try {
      await onSave(activeLang, payload);

      // Store in localStorage for instant frontend availability
      try {
        const stored = localStorage.getItem("scribd_page_content");
        const list = stored ? JSON.parse(stored) : [];
        const idx = list.findIndex(
          (c: any) => (c.pageKey === "home" && c.language === activeLang) || c.id === `home-${activeLang}`
        );
        const entry = {
          id: `home-${activeLang}`,
          pageKey: "home",
          language: activeLang,
          title: payload.guideTitle || payload.heroTitle,
          metaDescription: payload.metaDescription,
          h1Heading: payload.heroTitle,
          heroHeading: payload.heroTitle,
          heroDescription: payload.heroSubtitle,
          ctaButtonText: payload.ctaText,
          content: payload.htmlContent,
          htmlContent: payload.htmlContent,
          guideBadge: payload.guideBadge,
          guideTitle: payload.guideTitle,
          heroBadge: payload.heroBadge,
          howTitle: payload.howTitle,
          howStep1: payload.howStep1,
          howStep1Desc: payload.howStep1Desc,
          howStep2: payload.howStep2,
          howStep2Desc: payload.howStep2Desc,
          howStep3: payload.howStep3,
          howStep3Desc: payload.howStep3Desc,
          benefitsTitle: payload.benefitsTitle,
          benefitsFastTitle: payload.benefitsFastTitle,
          benefitsFastDesc: payload.benefitsFastDesc,
          benefitsSafeTitle: payload.benefitsSafeTitle,
          benefitsSafeDesc: payload.benefitsSafeDesc,
          benefitsDevicesTitle: payload.benefitsDevicesTitle,
          benefitsDevicesDesc: payload.benefitsDevicesDesc,
          benefitsFreeTitle: payload.benefitsFreeTitle,
          benefitsFreeDesc: payload.benefitsFreeDesc,
          faqs: payload.faqs,
          updatedAt: payload.lastUpdated,
        };
        if (idx >= 0) {
          list[idx] = entry;
        } else {
          list.push(entry);
        }
        localStorage.setItem("scribd_page_content", JSON.stringify(list));
      } catch {}

      // Broadcast update event across browser tabs and App.tsx
      window.dispatchEvent(new CustomEvent("scribd_content_updated", { detail: { lang: activeLang } }));

      setSaveSuccess(`Homepage Article for [${activeLang.toUpperCase()}] published successfully! Live on site now.`);
      setTimeout(() => setSaveSuccess(null), 4000);
    } catch (err: any) {
      console.error("Save error:", err);
      setErrorMessage("Save failed: " + (err.message || String(err)));
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6 pb-20 max-w-6xl mx-auto">
      {/* Header with Title and Language Switcher */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            <Home className="w-5 h-5 text-emerald-600" />
            <span>Homepage Content & Article CMS</span>
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Write or edit articles published on the homepage, hero banner texts, and FAQs for each language.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {onPreviewUrl && (
            <button
              type="button"
              onClick={() => onPreviewUrl(activeLang === "en" ? "/" : `/${activeLang}`)}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold transition cursor-pointer"
            >
              <Eye className="w-3.5 h-3.5 text-slate-500" />
              <span>Preview Live</span>
            </button>
          )}

          <button
            type="button"
            onClick={handleSaveHomepage}
            disabled={saving || loading}
            className="inline-flex items-center gap-1.5 px-5 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-xs transition disabled:opacity-50 cursor-pointer"
          >
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            <span>Save & Publish [{activeLang.toUpperCase()}]</span>
          </button>
        </div>
      </div>

      {/* Language Switcher Bar */}
      <div className="bg-white rounded-xl border border-slate-200 p-3 shadow-xs flex items-center gap-2 overflow-x-auto">
        <Globe className="w-4 h-4 text-emerald-600 shrink-0 ml-1" />
        <span className="text-xs font-bold text-slate-700 whitespace-nowrap">Editing Language:</span>
        <div className="flex items-center gap-1.5">
          {availableLanguages.map((l) => (
            <button
              key={l.code}
              type="button"
              onClick={() => setActiveLang(l.code)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition cursor-pointer whitespace-nowrap ${
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

      {/* Notifications */}
      {saveSuccess && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs font-semibold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{saveSuccess}</span>
        </div>
      )}

      {errorMessage && (
        <div className="p-4 bg-red-50 border border-red-200 text-red-800 rounded-xl text-xs font-semibold flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {loading ? (
        <div className="flex flex-col items-center justify-center py-24 space-y-3 bg-white rounded-2xl border border-slate-200">
          <Loader2 className="w-8 h-8 text-emerald-600 animate-spin" />
          <p className="text-xs text-slate-500 font-medium">Loading Homepage content for [{activeLang.toUpperCase()}]...</p>
        </div>
      ) : (
        <div className="space-y-6">
          {/* SECTION 1: HOMEPAGE ARTICLE PUBLISHER (PRIMARY) */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-4">
              <div>
                <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-md uppercase tracking-wider">
                  Live Article Section
                </span>
                <h2 className="text-lg font-extrabold text-slate-900 tracking-tight mt-1 flex items-center gap-2">
                  <FileText className="w-5 h-5 text-indigo-600" />
                  <span>Homepage Article Content ({activeLang.toUpperCase()})</span>
                </h2>
                <p className="text-xs text-slate-500">
                  Leave content blank to hide the article section, or enter your article below to publish it directly on the homepage.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setShowPreviewModal(true)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-600 text-xs font-semibold transition cursor-pointer"
                >
                  <Eye className="w-3.5 h-3.5 text-slate-500" />
                  <span>Preview Article</span>
                </button>
              </div>
            </div>

            {/* Article Badge & Title */}
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Article Category / Badge
                </label>
                <input
                  type="text"
                  value={guideBadge}
                  onChange={(e) => setGuideBadge(e.target.value)}
                  placeholder="e.g. KNOWLEDGE BASE"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                />
              </div>

              <div className="sm:col-span-3">
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Article Title / Main Heading (H1)
                </label>
                <input
                  type="text"
                  value={guideTitle}
                  onChange={(e) => setGuideTitle(e.target.value)}
                  placeholder="e.g. Complete Guide to Downloading Scribd Documents as PDF"
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                />
              </div>
            </div>

            {/* WYSIWYG Editor Container */}
            <div className="border border-slate-200 rounded-xl overflow-hidden shadow-xs">
              {/* Toolbar */}
              <div className="bg-slate-50 px-3 py-2 border-b border-slate-200 flex flex-wrap items-center justify-between gap-2">
                <div className="flex flex-wrap items-center gap-1">
                  {editorMode === "visual" && (
                    <>
                      {/* Heading selector */}
                      <select
                        onChange={(e) => {
                          if (e.target.value) {
                            executeCommand("formatBlock", e.target.value);
                            e.target.value = "";
                          }
                        }}
                        defaultValue=""
                        className="text-xs font-semibold bg-white border border-slate-200 rounded px-2 py-1 outline-none text-slate-700 cursor-pointer"
                      >
                        <option value="" disabled>Heading</option>
                        <option value="<p>">Normal Paragraph</option>
                        <option value="<h2>">Heading 2 (H2)</option>
                        <option value="<h3>">Heading 3 (H3)</option>
                        <option value="<h4>">Heading 4 (H4)</option>
                        <option value="<blockquote>">Blockquote</option>
                      </select>

                      <div className="h-4 w-[1px] bg-slate-200 mx-1" />

                      <button
                        type="button"
                        onClick={() => executeCommand("bold")}
                        className="p-1.5 rounded hover:bg-slate-200 text-slate-700 transition"
                        title="Bold"
                      >
                        <Bold className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => executeCommand("italic")}
                        className="p-1.5 rounded hover:bg-slate-200 text-slate-700 transition"
                        title="Italic"
                      >
                        <Italic className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => executeCommand("underline")}
                        className="p-1.5 rounded hover:bg-slate-200 text-slate-700 transition"
                        title="Underline"
                      >
                        <Underline className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => executeCommand("strikeThrough")}
                        className="p-1.5 rounded hover:bg-slate-200 text-slate-700 transition"
                        title="Strikethrough"
                      >
                        <Strikethrough className="w-4 h-4" />
                      </button>

                      <div className="h-4 w-[1px] bg-slate-200 mx-1" />

                      <button
                        type="button"
                        onClick={() => executeCommand("insertUnorderedList")}
                        className="p-1.5 rounded hover:bg-slate-200 text-slate-700 transition"
                        title="Bullet List"
                      >
                        <List className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => executeCommand("insertOrderedList")}
                        className="p-1.5 rounded hover:bg-slate-200 text-slate-700 transition"
                        title="Numbered List"
                      >
                        <ListOrdered className="w-4 h-4" />
                      </button>

                      <div className="h-4 w-[1px] bg-slate-200 mx-1" />

                      <button
                        type="button"
                        onClick={() => {
                          const url = prompt("Enter hyperlink URL (e.g. https://example.com):");
                          if (url) executeCommand("createLink", url);
                        }}
                        className="p-1.5 rounded hover:bg-slate-200 text-slate-700 transition"
                        title="Insert Link"
                      >
                        <LinkIcon className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          const url = prompt("Enter Image URL:");
                          if (url) executeCommand("insertImage", url);
                        }}
                        className="p-1.5 rounded hover:bg-slate-200 text-slate-700 transition"
                        title="Insert Image"
                      >
                        <ImageIcon className="w-4 h-4" />
                      </button>
                    </>
                  )}
                </div>

                {/* Mode Switcher */}
                <div className="flex items-center gap-1 bg-white p-0.5 rounded-lg border border-slate-200">
                  <button
                    type="button"
                    onClick={() => {
                      if (editorMode === "html" && visualEditorRef.current) {
                        visualEditorRef.current.innerHTML = htmlContent;
                      }
                      setEditorMode("visual");
                    }}
                    className={`px-2.5 py-1 rounded text-xs font-bold transition cursor-pointer ${
                      editorMode === "visual"
                        ? "bg-emerald-600 text-white shadow-xs"
                        : "text-slate-600 hover:text-slate-900"
                    }`}
                  >
                    Visual Editor
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      if (editorMode === "visual" && visualEditorRef.current) {
                        setHtmlContent(visualEditorRef.current.innerHTML);
                      }
                      setEditorMode("html");
                    }}
                    className={`px-2.5 py-1 rounded text-xs font-bold transition cursor-pointer ${
                      editorMode === "html"
                        ? "bg-emerald-600 text-white shadow-xs"
                        : "text-slate-600 hover:text-slate-900"
                    }`}
                  >
                    HTML Code
                  </button>
                </div>
              </div>

              {/* Editor Workspace */}
              <div className="relative min-h-[420px] p-4 bg-white">
                {editorMode === "visual" ? (
                  <div
                    ref={visualEditorRef}
                    contentEditable
                    onInput={handleVisualInput}
                    className="outline-none min-h-[380px] prose prose-slate max-w-none focus:ring-0 leading-relaxed text-slate-800 text-sm sm:text-base"
                    data-placeholder="Start writing your homepage article here..."
                  />
                ) : (
                  <textarea
                    value={htmlContent}
                    onChange={(e) => setHtmlContent(e.target.value)}
                    placeholder="Enter raw HTML / article content here..."
                    className="w-full h-full min-h-[380px] font-mono text-xs sm:text-sm text-slate-900 bg-slate-50/50 p-3 rounded-lg border border-slate-200 outline-none focus:border-emerald-500 focus:bg-white resize-y leading-relaxed"
                  />
                )}
              </div>

              {/* Editor Status Bar */}
              <div className="bg-slate-50 px-4 py-2 border-t border-slate-200 flex flex-wrap items-center justify-between text-xs text-slate-500">
                <div className="flex items-center gap-4">
                  <span>Words: <strong className="text-slate-700">{wordCount}</strong></span>
                  <span>Characters: <strong className="text-slate-700">{charCount}</strong></span>
                  <span>Estimated Read: <strong className="text-slate-700">{readTime} min</strong></span>
                </div>
                <div className="text-[11px] text-slate-400">
                  Mode: <span className="font-semibold uppercase text-slate-600">{editorMode}</span>
                </div>
              </div>
            </div>
          </div>

          {/* SECTION 2: HERO BANNER SETTINGS (COLLAPSIBLE) */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
            <button
              type="button"
              onClick={() => setShowHeroSettings(!showHeroSettings)}
              className="w-full p-5 flex items-center justify-between bg-slate-50/50 hover:bg-slate-50 transition cursor-pointer text-left"
            >
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-amber-500" />
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Hero Banner & Downloader Box Text</h3>
                  <p className="text-xs text-slate-500">Main headline, badge, subtitle, and CTA button text</p>
                </div>
              </div>
              {showHeroSettings ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
            </button>

            {showHeroSettings && (
              <div className="p-5 border-t border-slate-200 space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Hero Badge Text</label>
                    <input
                      type="text"
                      value={heroBadge}
                      onChange={(e) => setHeroBadge(e.target.value)}
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs font-medium text-slate-800"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Download CTA Button Text</label>
                    <input
                      type="text"
                      value={ctaText}
                      onChange={(e) => setCtaText(e.target.value)}
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs font-medium text-slate-800"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Hero Title (H1 Headline)</label>
                  <input
                    type="text"
                    value={heroTitle}
                    onChange={(e) => setHeroTitle(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs font-bold text-slate-900"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Hero Subtitle / Description</label>
                  <textarea
                    rows={2}
                    value={heroSubtitle}
                    onChange={(e) => setHeroSubtitle(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs text-slate-800 leading-relaxed"
                  />
                </div>
              </div>
            )}
          </div>

          {/* SECTION 2B: HOW IT WORKS SETTINGS (COLLAPSIBLE) */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
            <button
              type="button"
              onClick={() => setShowHowSettings(!showHowSettings)}
              className="w-full p-5 flex items-center justify-between bg-slate-50/50 hover:bg-slate-50 transition cursor-pointer text-left"
            >
              <div className="flex items-center gap-2">
                <Layers className="w-5 h-5 text-indigo-500" />
                <div>
                  <h3 className="text-sm font-bold text-slate-900">"How It Works" Section Content</h3>
                  <p className="text-xs text-slate-500">Edit the title, steps, and step descriptions for this language</p>
                </div>
              </div>
              {showHowSettings ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
            </button>

            {showHowSettings && (
              <div className="p-5 border-t border-slate-200 space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Section Title</label>
                  <input
                    type="text"
                    value={howTitle}
                    onChange={(e) => setHowTitle(e.target.value)}
                    placeholder="How It Works"
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs font-semibold text-slate-900"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Step 1 */}
                  <div className="p-3 bg-slate-50/60 rounded-xl border border-slate-200 space-y-2">
                    <span className="text-[11px] font-bold text-indigo-600 bg-indigo-50 border border-indigo-200 px-2 py-0.5 rounded">Step 1</span>
                    <div>
                      <label className="block text-[11px] font-bold text-slate-600 mb-1">Step Heading</label>
                      <input
                        type="text"
                        value={howStep1}
                        onChange={(e) => setHowStep1(e.target.value)}
                        placeholder="Copy Scribd Link"
                        className="w-full px-2.5 py-1.5 border border-slate-200 rounded-lg text-xs font-bold text-slate-900"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-slate-600 mb-1">Step Description</label>
                      <textarea
                        rows={2}
                        value={howStep1Desc}
                        onChange={(e) => setHowStep1Desc(e.target.value)}
                        placeholder="Copy the document URL from Scribd..."
                        className="w-full px-2.5 py-1.5 border border-slate-200 rounded-lg text-xs text-slate-800 leading-normal"
                      />
                    </div>
                  </div>

                  {/* Step 2 */}
                  <div className="p-3 bg-slate-50/60 rounded-xl border border-slate-200 space-y-2">
                    <span className="text-[11px] font-bold text-indigo-600 bg-indigo-50 border border-indigo-200 px-2 py-0.5 rounded">Step 2</span>
                    <div>
                      <label className="block text-[11px] font-bold text-slate-600 mb-1">Step Heading</label>
                      <input
                        type="text"
                        value={howStep2}
                        onChange={(e) => setHowStep2(e.target.value)}
                        placeholder="Paste in Downloader"
                        className="w-full px-2.5 py-1.5 border border-slate-200 rounded-lg text-xs font-bold text-slate-900"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-slate-600 mb-1">Step Description</label>
                      <textarea
                        rows={2}
                        value={howStep2Desc}
                        onChange={(e) => setHowStep2Desc(e.target.value)}
                        placeholder="Paste into the input box above..."
                        className="w-full px-2.5 py-1.5 border border-slate-200 rounded-lg text-xs text-slate-800 leading-normal"
                      />
                    </div>
                  </div>

                  {/* Step 3 */}
                  <div className="p-3 bg-slate-50/60 rounded-xl border border-slate-200 space-y-2">
                    <span className="text-[11px] font-bold text-indigo-600 bg-indigo-50 border border-indigo-200 px-2 py-0.5 rounded">Step 3</span>
                    <div>
                      <label className="block text-[11px] font-bold text-slate-600 mb-1">Step Heading</label>
                      <input
                        type="text"
                        value={howStep3}
                        onChange={(e) => setHowStep3(e.target.value)}
                        placeholder="Get Clean PDF"
                        className="w-full px-2.5 py-1.5 border border-slate-200 rounded-lg text-xs font-bold text-slate-900"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-slate-600 mb-1">Step Description</label>
                      <textarea
                        rows={2}
                        value={howStep3Desc}
                        onChange={(e) => setHowStep3Desc(e.target.value)}
                        placeholder="Click the CTA and grab your high-speed file..."
                        className="w-full px-2.5 py-1.5 border border-slate-200 rounded-lg text-xs text-slate-800 leading-normal"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* SECTION 2C: WHY CHOOSE US SETTINGS (COLLAPSIBLE) */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
            <button
              type="button"
              onClick={() => setShowBenefitsSettings(!showBenefitsSettings)}
              className="w-full p-5 flex items-center justify-between bg-slate-50/50 hover:bg-slate-50 transition cursor-pointer text-left"
            >
              <div className="flex items-center gap-2">
                <LayoutTemplate className="w-5 h-5 text-emerald-500" />
                <div>
                  <h3 className="text-sm font-bold text-slate-900">"Why Use This Tool" Section Content</h3>
                  <p className="text-xs text-slate-500">Edit the title, blocks, and benefits description details</p>
                </div>
              </div>
              {showBenefitsSettings ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
            </button>

            {showBenefitsSettings && (
              <div className="p-5 border-t border-slate-200 space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Section Title</label>
                  <input
                    type="text"
                    value={benefitsTitle}
                    onChange={(e) => setBenefitsTitle(e.target.value)}
                    placeholder="Why Choose Our Scribd Downloader?"
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs font-semibold text-slate-900"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Benefit 1 */}
                  <div className="p-3 bg-slate-50/60 rounded-xl border border-slate-200 space-y-2">
                    <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded">Benefit 1 (Fast)</span>
                    <div>
                      <input
                        type="text"
                        value={benefitsFastTitle}
                        onChange={(e) => setBenefitsFastTitle(e.target.value)}
                        placeholder="Ultra Fast Speeds"
                        className="w-full px-2.5 py-1.5 border border-slate-200 rounded-lg text-xs font-bold text-slate-900"
                      />
                    </div>
                    <textarea
                      rows={2}
                      value={benefitsFastDesc}
                      onChange={(e) => setBenefitsFastDesc(e.target.value)}
                      placeholder="High-speed parallel downloads..."
                      className="w-full px-2.5 py-1.5 border border-slate-200 rounded-lg text-xs text-slate-800 leading-normal"
                    />
                  </div>

                  {/* Benefit 2 */}
                  <div className="p-3 bg-slate-50/60 rounded-xl border border-slate-200 space-y-2">
                    <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded">Benefit 2 (Safe)</span>
                    <div>
                      <input
                        type="text"
                        value={benefitsSafeTitle}
                        onChange={(e) => setBenefitsSafeTitle(e.target.value)}
                        placeholder="Safe & Anonymous"
                        className="w-full px-2.5 py-1.5 border border-slate-200 rounded-lg text-xs font-bold text-slate-900"
                      />
                    </div>
                    <textarea
                      rows={2}
                      value={benefitsSafeDesc}
                      onChange={(e) => setBenefitsSafeDesc(e.target.value)}
                      placeholder="SSL encrypted and completely anonymous..."
                      className="w-full px-2.5 py-1.5 border border-slate-200 rounded-lg text-xs text-slate-800 leading-normal"
                    />
                  </div>

                  {/* Benefit 3 */}
                  <div className="p-3 bg-slate-50/60 rounded-xl border border-slate-200 space-y-2">
                    <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded">Benefit 3 (Devices)</span>
                    <div>
                      <input
                        type="text"
                        value={benefitsDevicesTitle}
                        onChange={(e) => setBenefitsDevicesTitle(e.target.value)}
                        placeholder="Supports All Devices"
                        className="w-full px-2.5 py-1.5 border border-slate-200 rounded-lg text-xs font-bold text-slate-900"
                      />
                    </div>
                    <textarea
                      rows={2}
                      value={benefitsDevicesDesc}
                      onChange={(e) => setBenefitsDevicesDesc(e.target.value)}
                      placeholder="Optimized for mobile, tablet, and desktop..."
                      className="w-full px-2.5 py-1.5 border border-slate-200 rounded-lg text-xs text-slate-800 leading-normal"
                    />
                  </div>

                  {/* Benefit 4 */}
                  <div className="p-3 bg-slate-50/60 rounded-xl border border-slate-200 space-y-2">
                    <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded">Benefit 4 (Free)</span>
                    <div>
                      <input
                        type="text"
                        value={benefitsFreeTitle}
                        onChange={(e) => setBenefitsFreeTitle(e.target.value)}
                        placeholder="Totally Free"
                        className="w-full px-2.5 py-1.5 border border-slate-200 rounded-lg text-xs font-bold text-slate-900"
                      />
                    </div>
                    <textarea
                      rows={2}
                      value={benefitsFreeDesc}
                      onChange={(e) => setBenefitsFreeDesc(e.target.value)}
                      placeholder="Unlimited downloads with no subscription fees..."
                      className="w-full px-2.5 py-1.5 border border-slate-200 rounded-lg text-xs text-slate-800 leading-normal"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* SECTION 3: FAQ ACCORDION MANAGER (COLLAPSIBLE) */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
            <button
              type="button"
              onClick={() => setShowFaqSettings(!showFaqSettings)}
              className="w-full p-5 flex items-center justify-between bg-slate-50/50 hover:bg-slate-50 transition cursor-pointer text-left"
            >
              <div className="flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-indigo-500" />
                <div>
                  <h3 className="text-sm font-bold text-slate-900">FAQ Accordion ({faqs.length} Questions)</h3>
                  <p className="text-xs text-slate-500">Custom FAQs displayed below the homepage article with JSON-LD schema</p>
                </div>
              </div>
              {showFaqSettings ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
            </button>

            {showFaqSettings && (
              <div className="p-5 border-t border-slate-200 space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-bold text-slate-600">FAQ Items</span>
                  <button
                    type="button"
                    onClick={addFaqItem}
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-indigo-50 text-indigo-700 border border-indigo-200 text-xs font-bold hover:bg-indigo-100 transition cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Question</span>
                  </button>
                </div>

                <div className="space-y-3">
                  {faqs.map((faq, idx) => (
                    <div key={idx} className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/60 space-y-2">
                      <div className="flex items-center justify-between gap-2">
                        <input
                          type="text"
                          value={faq.question}
                          onChange={(e) => updateFaq(idx, "question", e.target.value)}
                          placeholder="Question..."
                          className="w-full px-3 py-1.5 rounded-lg border border-slate-200 bg-white font-bold text-xs text-slate-800"
                        />
                        <button
                          type="button"
                          onClick={() => removeFaq(idx)}
                          className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded transition cursor-pointer"
                          title="Delete FAQ"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                      <textarea
                        rows={2}
                        value={faq.answer}
                        onChange={(e) => updateFaq(idx, "answer", e.target.value)}
                        placeholder="Answer..."
                        className="w-full px-3 py-1.5 rounded-lg border border-slate-200 bg-white text-xs text-slate-700 leading-relaxed"
                      />
                    </div>
                  ))}

                  {faqs.length === 0 && (
                    <p className="text-xs text-slate-400 text-center py-4">No custom FAQs added. Default translations will be used.</p>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* SECTION 4: SEO METADATA (COLLAPSIBLE) */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
            <button
              type="button"
              onClick={() => setShowSeoSettings(!showSeoSettings)}
              className="w-full p-5 flex items-center justify-between bg-slate-50/50 hover:bg-slate-50 transition cursor-pointer text-left"
            >
              <div className="flex items-center gap-2">
                <Globe className="w-5 h-5 text-blue-500" />
                <div>
                  <h3 className="text-sm font-bold text-slate-900">SEO Meta Tags ({activeLang.toUpperCase()})</h3>
                  <p className="text-xs text-slate-500">Google search title, meta description, and social share metadata</p>
                </div>
              </div>
              {showSeoSettings ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
            </button>

            {showSeoSettings && (
              <div className="p-5 border-t border-slate-200 space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">SEO Title Tag (&lt;title&gt;)</label>
                  <input
                    type="text"
                    value={metaTitle}
                    onChange={(e) => setMetaTitle(e.target.value)}
                    placeholder="Download Scribd Documents, Presentations & PDFs Fast"
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs font-semibold text-slate-900"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Meta Description</label>
                  <textarea
                    rows={2}
                    value={metaDescription}
                    onChange={(e) => setMetaDescription(e.target.value)}
                    placeholder="Search engine snippet description..."
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs text-slate-800 leading-relaxed"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Bottom Save Bar */}
          <div className="flex items-center justify-between pt-4">
            <span className="text-xs text-slate-500">
              Changes take effect immediately on the live homepage.
            </span>

            <button
              type="button"
              onClick={handleSaveHomepage}
              disabled={saving || loading}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-extrabold shadow-sm transition disabled:opacity-50 cursor-pointer"
            >
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              <span>Save & Publish Changes</span>
            </button>
          </div>
        </div>
      )}

      {/* Article Live Preview Modal */}
      {showPreviewModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-3xl w-full max-h-[85vh] flex flex-col overflow-hidden">
            <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
              <span className="text-xs font-bold text-slate-700">Homepage Article Preview ({activeLang.toUpperCase()})</span>
              <button
                type="button"
                onClick={() => setShowPreviewModal(false)}
                className="text-xs font-bold text-slate-500 hover:text-slate-800 px-2 py-1 rounded"
              >
                ✕ Close
              </button>
            </div>
            <div className="p-6 overflow-y-auto space-y-6">
              {guideBadge && (
                <span className="inline-flex px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider text-blue-700 bg-blue-50 border border-blue-100 rounded-md">
                  {guideBadge}
                </span>
              )}
              {guideTitle && (
                <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight leading-tight">
                  {guideTitle}
                </h1>
              )}
              <div className="article-body">
                <ModernArticleRenderer content={htmlContent} />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
