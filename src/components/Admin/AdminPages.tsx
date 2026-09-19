import React, { useState, useEffect } from "react";
import { PageRoute, CustomPage, PageContent, SupportedLanguage } from "../../types";
import {
  FileCode,
  Edit2,
  Check,
  Plus,
  Trash2,
  Copy,
  ExternalLink,
  Eye,
  Globe,
  Layout,
  FileText,
  AlertCircle,
  HelpCircle,
  Code,
  Sparkles,
  Search,
  CheckCircle2,
  X,
  Languages,
  RotateCcw,
  Save,
  Zap,
  RefreshCw,
  Layers,
  ArrowRight,
  ShieldCheck,
  AlertTriangle,
  BookOpen,
  Folder,
  Clock,
  CheckCircle,
  Settings,
  CheckSquare,
  Square
} from "lucide-react";
import {
  loadCustomPages,
  saveCustomPages,
  DEFAULT_CUSTOM_PAGES
} from "../../data/customPagesData";
import {
  loadPageContent,
  savePageContent,
  INITIAL_PAGE_CONTENT
} from "../../data/siteConfig";
import { SUPPORTED_LANGUAGES } from "../../data/translations";
import { ClassicEditor } from "./ClassicEditor";
import { safeParseJson } from "../../utils/apiSafe";

interface PageConfig {
  id: string;
  isCustom?: boolean;
  route?: PageRoute;
  title: string;
  slug: string;
  subtitle?: string;
  status: "published" | "draft";
  metaTitle: string;
  metaDescription: string;
  lastModified: string;
  content?: string;
  showInHeader?: boolean;
  showInFooter?: boolean;
  language?: SupportedLanguage | "all";
  authorName?: string;
  translationGroupId?: string;
}

const CORE_SYSTEM_PAGES: PageConfig[] = [
  {
    id: "core-home",
    route: "home",
    title: "Homepage & PDF Downloader",
    slug: "/",
    status: "published",
    metaTitle: "Scribd Downloader - Free High Speed Document & Slide Deck Converter",
    metaDescription: "Download Scribd documents, presentations, and research papers as high-resolution PDF files with zero wait time. 100% free.",
    lastModified: "Today",
    translationGroupId: "tg-core-home",
  },
  {
    id: "core-how-it-works",
    route: "how-it-works",
    title: "How It Works Guide",
    slug: "/how-it-works",
    status: "published",
    metaTitle: "How It Works - Scribd Document Extraction Architecture & Guide",
    metaDescription: "Learn how our multi-threaded engine extracts high-resolution vector tiles and compiles unified standard PDF documents.",
    lastModified: "2 days ago",
    translationGroupId: "tg-core-how-it-works",
  },
  {
    id: "core-blog",
    route: "blog",
    title: "Blog Listing & Insights",
    slug: "/blog",
    status: "published",
    metaTitle: "Scribd Document Tips, Tutorials & Guides - Official Blog",
    metaDescription: "Read comprehensive guides, tips, and step-by-step tutorials for downloading, converting, and reading Scribd documents offline.",
    lastModified: "1 week ago",
    translationGroupId: "tg-core-blog",
  },
  {
    id: "core-about",
    route: "about",
    title: "About Our Project",
    slug: "/about",
    status: "published",
    metaTitle: "About Scribd Downloader - Our Mission & Engineering Lab",
    metaDescription: "Discover our open-access educational document conversion utility, mission, privacy guarantees, and tech stack.",
    lastModified: "2 weeks ago",
    translationGroupId: "tg-core-about",
  },
  {
    id: "core-contact",
    route: "contact",
    title: "Contact & Developer Support",
    slug: "/contact",
    status: "published",
    metaTitle: "Contact Us & Document Extraction Support",
    metaDescription: "Get in touch with our engineering team for troubleshooting, bug reports, or feature requests.",
    lastModified: "3 weeks ago",
    translationGroupId: "tg-core-contact",
  },
  {
    id: "core-legal",
    route: "legal",
    title: "Legal Terms & Privacy Policy",
    slug: "/legal",
    status: "published",
    metaTitle: "Terms of Service & Privacy Policy - Scribd Downloader",
    metaDescription: "Review our fair use policy, zero logs data privacy guarantee, and educational document converter terms.",
    lastModified: "1 month ago",
    translationGroupId: "tg-core-legal",
  },
];

interface AdminPagesProps {
  customPages?: CustomPage[];
  onSaveCustomPage?: (page: CustomPage) => void;
  onDeleteCustomPage?: (id: string) => void;
  onRefreshPages?: () => void;
}

export function AdminPages({
  customPages: propPages,
  onSaveCustomPage,
  onDeleteCustomPage,
  onRefreshPages,
}: AdminPagesProps) {
  const [activeListFilter, setActiveListFilter] = useState<"all" | "published" | "draft" | "core" | "custom">("all");
  const [selectedLangFilter, setSelectedLangFilter] = useState<SupportedLanguage | "all">("all");
  const [searchQuery, setSearchQuery] = useState("");

  // CONTENT & PAGE STATE
  const [pageContents, setPageContents] = useState<PageContent[]>([]);
  const [customPagesList, setCustomPagesList] = useState<CustomPage[]>([]);
  
  // EDITING STATE (WordPress Style Editor)
  const [isEditing, setIsEditing] = useState(false);
  const [editTargetType, setEditTargetType] = useState<"core" | "custom">("core");
  
  // Core Page Form State
  const [formCoreKey, setFormCoreKey] = useState<string>("home");
  const [formPageContent, setFormPageContent] = useState<PageContent | null>(null);

  // Custom Page Form State
  const [formCustomPage, setFormCustomPage] = useState<CustomPage | null>(null);

  // Shared Editor Active Language & Group
  const [activeFormLang, setActiveFormLang] = useState<SupportedLanguage>("en");
  const [formTranslationGroupId, setFormTranslationGroupId] = useState<string>("");

  // AI & Feedback
  const [aiWorking, setAiWorking] = useState(false);
  const [aiSuccessMsg, setAiSuccessMsg] = useState<string | null>(null);
  const [translateTargetLang, setTranslateTargetLang] = useState<SupportedLanguage>("hi");
  const [saveNotification, setSaveNotification] = useState<string | null>(null);

  // AI Duplicate Resolver State
  const [showDuplicateResolver, setShowDuplicateResolver] = useState(false);
  const [aiDuplicateAnalysis, setAiDuplicateAnalysis] = useState<any>(null);
  const [dedupRunning, setDedupRunning] = useState(false);

  // BULK SELECTION & CONFIRMATION MODAL STATE
  const [selectedPageIds, setSelectedPageIds] = useState<string[]>([]);
  const [confirmModalConfig, setConfirmModalConfig] = useState<{
    isOpen: boolean;
    type: "all" | "selected" | "single";
    pageId?: string;
    count?: number;
  } | null>(null);

  // Initial Load
  useEffect(() => {
    setPageContents(loadPageContent());
    if (propPages && propPages.length > 0) {
      setCustomPagesList(propPages);
    } else {
      setCustomPagesList(loadCustomPages());
    }
  }, [propPages]);

  const refreshAllData = async () => {
    try {
      const res = await fetch("/api/pages/custom");
      const data = await res.json();
      if (data && Array.isArray(data.pages)) {
        setCustomPagesList(data.pages);
      }
    } catch {}
    if (onRefreshPages) onRefreshPages();
  };

  // --- START EDITING CORE SYSTEM PAGE ---
  const startEditCorePage = (pageKey: string, targetLang: SupportedLanguage = "en") => {
    setEditTargetType("core");
    setFormCoreKey(pageKey);
    setActiveFormLang(targetLang);
    setFormTranslationGroupId(`tg-core-${pageKey}`);

    const existing =
      pageContents.find(
        (c) => (c.pageKey === pageKey && c.language === targetLang) || c.id === `${pageKey}-${targetLang}`
      ) ||
      INITIAL_PAGE_CONTENT.find(
        (c) => (c.pageKey === pageKey && c.language === targetLang) || c.id === `${pageKey}-${targetLang}`
      );

    if (existing) {
      setFormPageContent({ ...existing });
    } else {
      const baseEn =
        pageContents.find((c) => c.pageKey === pageKey && c.language === "en") ||
        INITIAL_PAGE_CONTENT.find((c) => c.pageKey === pageKey && c.language === "en");

      const langInfo = SUPPORTED_LANGUAGES.find((l) => l.code === targetLang);

      setFormPageContent({
        id: `${pageKey}-${targetLang}`,
        pageKey,
        language: targetLang,
        title: baseEn ? baseEn.title : `Page ${pageKey} (${langInfo?.name || targetLang})`,
        subtitle: baseEn?.subtitle || "",
        content: baseEn?.content || `<p>Write ${langInfo?.name || targetLang} content here...</p>`,
      });
    }

    setIsEditing(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // --- START EDITING CUSTOM PAGE ---
  const startEditCustomPage = (page: CustomPage, targetLang?: SupportedLanguage) => {
    setEditTargetType("custom");
    const lang = targetLang || (page.language === "all" ? "en" : (page.language as SupportedLanguage) || "en");
    setActiveFormLang(lang);
    
    const groupId = page.translationGroupId || `tg-${page.id.replace(/-[a-z]{2}$/, "")}`;
    setFormTranslationGroupId(groupId);

    setFormCustomPage({
      ...page,
      language: lang,
      translationGroupId: groupId,
    });

    setIsEditing(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const startCreateCustomPage = () => {
    setEditTargetType("custom");
    setActiveFormLang("en");
    const newId = `page-${Date.now()}`;
    const groupId = `tg-${newId}`;
    setFormTranslationGroupId(groupId);

    setFormCustomPage({
      id: newId,
      title: "",
      slug: "",
      subtitle: "",
      status: "published",
      metaTitle: "",
      metaDescription: "",
      content: "<h2>Page Heading</h2><p>Write custom landing page content here...</p>",
      showInHeader: false,
      showInFooter: true,
      language: "en",
      translationGroupId: groupId,
      lastModified: new Date().toISOString().split("T")[0],
      createdAt: new Date().toISOString(),
    });

    setIsEditing(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // --- SAVE CURRENT ACTIVE FORM STATE ---
  const handleSaveActivePage = () => {
    if (editTargetType === "core" && formPageContent) {
      const updatedList = [...pageContents];
      const idx = updatedList.findIndex(
        (c) =>
          c.id === formPageContent.id ||
          (c.pageKey === formPageContent.pageKey && c.language === formPageContent.language)
      );

      if (idx >= 0) {
        updatedList[idx] = formPageContent;
      } else {
        updatedList.push(formPageContent);
      }

      setPageContents(updatedList);
      savePageContent(updatedList);
      setSaveNotification(`Core Page (${formCoreKey.toUpperCase()} - ${formPageContent.language?.toUpperCase()}) saved successfully!`);
      setTimeout(() => setSaveNotification(null), 3000);
    } else if (editTargetType === "custom" && formCustomPage) {
      if (!formCustomPage.title) {
        alert("Please enter a page title.");
        return;
      }

      const cleanSlug = (formCustomPage.slug || formCustomPage.title.toLowerCase().replace(/[^a-z0-9]+/g, "-")).replace(/^\//, "");
      const pageToSave: CustomPage = {
        ...formCustomPage,
        slug: cleanSlug,
        language: activeFormLang,
        translationGroupId: formTranslationGroupId || `tg-${formCustomPage.id}`,
        lastModified: new Date().toISOString().split("T")[0],
      };

      let updatedList = [...customPagesList];
      const idx = updatedList.findIndex((p) => p.id === pageToSave.id);
      if (idx >= 0) {
        updatedList[idx] = pageToSave;
      } else {
        updatedList.push(pageToSave);
      }

      setCustomPagesList(updatedList);
      saveCustomPages(updatedList);

      if (onSaveCustomPage) {
        onSaveCustomPage(pageToSave);
      }

      fetch("/api/pages/custom", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ page: pageToSave }),
      }).catch(() => {});

      setSaveNotification(`Custom Page (${pageToSave.title} - ${activeFormLang.toUpperCase()}) saved successfully!`);
      setTimeout(() => setSaveNotification(null), 3000);
    }
  };

  // --- SWITCH LANGUAGE IN SIDEBAR ---
  const handleSidebarSwitchLanguage = (targetLang: SupportedLanguage) => {
    // First save current state
    handleSaveActivePage();

    if (editTargetType === "core") {
      startEditCorePage(formCoreKey, targetLang);
    } else if (editTargetType === "custom" && formCustomPage) {
      // Find if a custom page variant already exists for targetLang in this group
      const existingVariant = customPagesList.find(
        (p) =>
          (p.translationGroupId === formTranslationGroupId || p.slug.includes(formCustomPage.slug.replace(/-[a-z]{2}$/, ""))) &&
          p.language === targetLang
      );

      if (existingVariant) {
        startEditCustomPage(existingVariant, targetLang);
      } else {
        // Create new translated variation
        const cleanSlugBase = formCustomPage.slug.replace(/-[a-z]{2}$/, "");
        const langInfo = SUPPORTED_LANGUAGES.find((l) => l.code === targetLang);
        const newVariant: CustomPage = {
          ...formCustomPage,
          id: `page-${Date.now()}-${targetLang}`,
          title: formCustomPage.title ? `${formCustomPage.title} (${langInfo?.name || targetLang})` : "",
          slug: `${cleanSlugBase}-${targetLang}`,
          language: targetLang,
          translationGroupId: formTranslationGroupId || `tg-${formCustomPage.id}`,
          lastModified: new Date().toISOString().split("T")[0],
        };
        startEditCustomPage(newVariant, targetLang);
      }
    }
  };

  // --- AI ACTIONS FOR PAGE EDITOR ---
  const handleAiTranslateCurrentPage = async (targetLang: SupportedLanguage = translateTargetLang) => {
    setAiWorking(true);
    setAiSuccessMsg(null);
    try {
      if (editTargetType === "core" && formPageContent) {
        const res = await fetch("/api/ai/translate-content", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            content: formPageContent.content,
            title: formPageContent.title,
            sourceLanguage: formPageContent.language || "en",
            targetLanguage: targetLang,
          }),
        });
        const data = await res.json();
        if (res.ok && data.translation) {
          const tr = data.translation;
          const translatedContentItem: PageContent = {
            id: `${formPageContent.pageKey}-${targetLang}`,
            pageKey: formPageContent.pageKey,
            language: targetLang,
            title: tr.translatedTitle || formPageContent.title,
            subtitle: formPageContent.subtitle || "",
            content: tr.translatedContent || formPageContent.content,
          };
          setFormPageContent(translatedContentItem);
          setActiveFormLang(targetLang);

          // Save translated version
          const updatedList = [...pageContents];
          const idx = updatedList.findIndex(
            (c) =>
              c.id === translatedContentItem.id ||
              (c.pageKey === translatedContentItem.pageKey && c.language === translatedContentItem.language)
          );
          if (idx >= 0) updatedList[idx] = translatedContentItem;
          else updatedList.push(translatedContentItem);

          setPageContents(updatedList);
          savePageContent(updatedList);
          setAiSuccessMsg(`Successfully translated and saved page to ${targetLang.toUpperCase()}!`);
        }
      } else if (editTargetType === "custom" && formCustomPage) {
        const res = await fetch("/api/ai/translate-content", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            content: formCustomPage.content || "",
            title: formCustomPage.title,
            excerpt: formCustomPage.metaDescription,
            sourceLanguage: formCustomPage.language || "en",
            targetLanguage: targetLang,
          }),
        });
        const data = await res.json();
        if (res.ok && data.translation) {
          const tr = data.translation;
          const cleanSlugBase = formCustomPage.slug.replace(/-[a-z]{2}$/, "");
          const translatedCustomPage: CustomPage = {
            ...formCustomPage,
            id: `page-${Date.now()}-${targetLang}`,
            title: tr.translatedTitle || formCustomPage.title,
            slug: tr.translatedSlug || `${cleanSlugBase}-${targetLang}`,
            metaTitle: tr.translatedTitle || formCustomPage.metaTitle,
            metaDescription: tr.translatedExcerpt || formCustomPage.metaDescription,
            content: tr.translatedContent || formCustomPage.content,
            language: targetLang,
            translationGroupId: formTranslationGroupId || `tg-${formCustomPage.id}`,
            lastModified: new Date().toISOString().split("T")[0],
          };

          setFormCustomPage(translatedCustomPage);
          setActiveFormLang(targetLang);

          // Save custom page variant
          let updatedList = [...customPagesList];
          const idx = updatedList.findIndex((p) => p.id === translatedCustomPage.id);
          if (idx >= 0) updatedList[idx] = translatedCustomPage;
          else updatedList.push(translatedCustomPage);

          setCustomPagesList(updatedList);
          saveCustomPages(updatedList);
          if (onSaveCustomPage) onSaveCustomPage(translatedCustomPage);

          setAiSuccessMsg(`Successfully translated and saved custom page to ${targetLang.toUpperCase()}!`);
        }
      }
    } catch (e: any) {
      alert("AI Translation Error: " + e.message);
    } finally {
      setAiWorking(false);
    }
  };

  const handleBatchAiTranslateAllPages = async () => {
    setAiWorking(true);
    setAiSuccessMsg(null);
    let count = 0;
    const targetLangs: SupportedLanguage[] = ["id", "es", "br", "fr", "de", "hi"];

    for (const lang of targetLangs) {
      if (lang === activeFormLang) continue;
      await handleAiTranslateCurrentPage(lang);
      count++;
    }

    setAiWorking(false);
    setAiSuccessMsg(`Auto-Translate Complete! Created and saved ${count} localized page versions.`);
  };

  // --- CONFIRMED DELETE EXECUTOR (NO WINDOW.CONFIRM / ALERT) ---
  const executeConfirmedDelete = async () => {
    if (!confirmModalConfig) return;

    if (confirmModalConfig.type === "all") {
      setCustomPagesList([]);
      setSelectedPageIds([]);
      try {
        localStorage.setItem("scribd_custom_pages", "[]");
        localStorage.removeItem("scribd_page_content_v6");
      } catch (e) {
        console.error(e);
      }
      try {
        await fetch("/api/custom-pages", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ pages: [] }),
        });
      } catch (e) {
        console.error(e);
      }
      setSaveNotification("Successfully deleted all custom pages.");
    } else if (confirmModalConfig.type === "selected") {
      const idsToDelete = new Set(selectedPageIds);
      const updated = customPagesList.filter((p) => !idsToDelete.has(p.id));
      setCustomPagesList(updated);
      setSelectedPageIds([]);
      saveCustomPages(updated);
      try {
        await fetch("/api/custom-pages", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ pages: updated }),
        });
      } catch (e) {
        console.error(e);
      }
      setSaveNotification(`Successfully deleted ${idsToDelete.size} selected custom page(s).`);
    } else if (confirmModalConfig.type === "single" && confirmModalConfig.pageId) {
      const pageId = confirmModalConfig.pageId;
      const updated = customPagesList.filter((p) => p.id !== pageId);
      setCustomPagesList(updated);
      setSelectedPageIds((prev) => prev.filter((id) => id !== pageId));
      saveCustomPages(updated);
      if (onDeleteCustomPage) onDeleteCustomPage(pageId);
      try {
        await fetch(`/api/pages/custom/${pageId}`, { method: "DELETE" });
      } catch (e) {
        console.error(e);
      }
      setSaveNotification("Custom page deleted successfully.");
    }

    setConfirmModalConfig(null);
    setTimeout(() => setSaveNotification(null), 4000);
    if (onRefreshPages) onRefreshPages();
  };

  const toggleSelectPage = (id: string) => {
    setSelectedPageIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  // --- DUPLICATE RESOLVER ---
  const handleScanDuplicateIntent = async () => {
    setDedupRunning(true);
    try {
      const res = await fetch("/api/ai/deduplicate-pages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ customPages: customPagesList }),
      });
      const data = await res.json();
      if (res.ok && data.analysis) {
        setAiDuplicateAnalysis(data.analysis);
      }
    } catch (e: any) {
      alert("Analysis error: " + e.message);
    } finally {
      setDedupRunning(false);
    }
  };

  // FILTERED PAGES FOR VERTICAL LIST TABLE
  const combinedPagesList = [
    ...CORE_SYSTEM_PAGES.map((cp) => ({
      ...cp,
      isCore: true,
      route: cp.route as string | undefined,
      rawCustomPage: undefined as CustomPage | undefined,
    })),
    ...customPagesList.map((cp) => ({
      id: cp.id,
      isCore: false,
      route: undefined as string | undefined,
      title: cp.title,
      slug: cp.slug,
      status: (cp.status || "published") as "published" | "draft",
      metaTitle: cp.metaTitle || cp.title,
      metaDescription: cp.metaDescription || "",
      lastModified: cp.lastModified || "Recently",
      language: cp.language || "en",
      translationGroupId: cp.translationGroupId || `tg-${cp.id}`,
      rawCustomPage: cp as CustomPage | undefined,
    })),
  ];

  const filteredPages = combinedPagesList.filter((p) => {
    if (activeListFilter === "published" && p.status !== "published") return false;
    if (activeListFilter === "draft" && p.status !== "draft") return false;
    if (activeListFilter === "core" && !p.isCore) return false;
    if (activeListFilter === "custom" && p.isCore) return false;

    if (selectedLangFilter !== "all" && p.language !== "all" && p.language !== selectedLangFilter) {
      return false;
    }

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return p.title.toLowerCase().includes(q) || p.slug.toLowerCase().includes(q);
    }

    return true;
  });

  const customPagesVisible = filteredPages.filter((p) => !p.isCore);
  const allCustomVisibleSelected =
    customPagesVisible.length > 0 &&
    customPagesVisible.every((p) => selectedPageIds.includes(p.id));

  const toggleSelectAllCustomVisible = () => {
    if (allCustomVisibleSelected) {
      const visibleIds = new Set(customPagesVisible.map((p) => p.id));
      setSelectedPageIds((prev) => prev.filter((id) => !visibleIds.has(id)));
    } else {
      const visibleIds = customPagesVisible.map((p) => p.id);
      setSelectedPageIds((prev) => Array.from(new Set([...prev, ...visibleIds])));
    }
  };

  return (
    <div className="space-y-6" id="admin-pages-manager">
      {/* Top Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs">
        <div>
          <h2 className="text-xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            <Layout className="w-5 h-5 text-indigo-600" />
            Website Pages & Multilingual Matrix
          </h2>
          <p className="text-sm text-slate-500 font-medium">
            Manage Core System Pages and Custom Landing Pages with WordPress-style vertical listing and side-bar language translations.
          </p>
        </div>
        {!isEditing && (
          <div className="flex flex-wrap items-center gap-2">
            {customPagesList.length > 0 && (
              <button
                type="button"
                onClick={() =>
                  setConfirmModalConfig({
                    isOpen: true,
                    type: "all",
                    count: customPagesList.length,
                  })
                }
                className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 text-xs font-bold transition cursor-pointer shadow-xs"
              >
                <Trash2 className="w-4 h-4 text-rose-600" />
                Delete All Custom Pages ({customPagesList.length})
              </button>
            )}
            <button
              type="button"
              onClick={() => setShowDuplicateResolver(!showDuplicateResolver)}
              className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition cursor-pointer"
            >
              <AlertTriangle className="w-4 h-4 text-amber-500" />
              AI Search Intent Scan
            </button>
            <button
              type="button"
              onClick={startCreateCustomPage}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold shadow-xs hover:shadow-md transition cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              + Add New Custom Page
            </button>
          </div>
        )}
      </div>

      {saveNotification && (
        <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-xs font-semibold flex items-center gap-2 shadow-xs">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{saveNotification}</span>
        </div>
      )}

      {/* --- AI DUPLICATE RESOLVER PANEL --- */}
      {showDuplicateResolver && (
        <div className="bg-white rounded-2xl p-6 border border-amber-200 bg-amber-50/30 shadow-2xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-amber-200/80">
            <div>
              <h3 className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-600" />
                AI Search Intent & Page Conflict Scanner
              </h3>
              <p className="text-xs text-slate-600">
                Detect keyword overlap and cannibalizing landing page routes before indexing.
              </p>
            </div>
            <button
              onClick={handleScanDuplicateIntent}
              disabled={dedupRunning}
              className="px-3.5 py-1.5 bg-slate-900 hover:bg-slate-800 disabled:opacity-50 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 transition cursor-pointer"
            >
              {dedupRunning ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5" />}
              Scan All Page Intent
            </button>
          </div>

          {aiDuplicateAnalysis && (
            <div className="p-4 bg-white rounded-xl border border-amber-200 text-xs space-y-2">
              <p className="font-bold text-slate-800">{aiDuplicateAnalysis.summary}</p>
              <span className="inline-block px-2.5 py-1 bg-emerald-100 text-emerald-800 font-bold rounded-md">
                {aiDuplicateAnalysis.healthyPagesCount} Distinct Intent Routes Verified
              </span>
            </div>
          )}
        </div>
      )}

      {/* --- WORDPRESS BLOCK-EDITOR & SIDEBAR VIEW --- */}
      {isEditing ? (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs p-6 space-y-6 relative">
          {/* Top Bar inside Editor */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-100 pb-4 gap-3">
            <div className="flex items-center gap-3">
              <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <Edit2 className="w-5 h-5 text-indigo-600" />
                {editTargetType === "core" ? `Edit Core Page: ${formCoreKey.toUpperCase()}` : "Edit Custom Page"}
              </h3>
              <span className="px-2.5 py-0.5 text-xs font-bold bg-indigo-50 text-indigo-700 rounded-full border border-indigo-200 flex items-center gap-1 uppercase">
                {SUPPORTED_LANGUAGES.find((l) => l.code === activeFormLang)?.flag} {activeFormLang.toUpperCase()}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleSaveActivePage}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl shadow-xs flex items-center gap-1.5 transition cursor-pointer"
              >
                <Save className="w-4 h-4" />
                Save & Update Page
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsEditing(false);
                  setFormPageContent(null);
                  setFormCustomPage(null);
                }}
                className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition cursor-pointer"
              >
                <X className="w-4 h-4" />
                Close Editor
              </button>
            </div>
          </div>

          {/* AI Copilot Action Strip */}
          <div className="p-4 bg-gradient-to-r from-indigo-50 via-purple-50 to-slate-50 rounded-2xl border border-indigo-100 space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="flex items-center gap-2 text-indigo-900 font-bold text-xs">
                <Sparkles className="w-4 h-4 text-indigo-600" />
                <span>AI Page Copilot: Content Generator, SEO Meta & Multilingual Translator</span>
              </div>
              {aiWorking && (
                <span className="text-xs text-indigo-600 font-semibold flex items-center gap-1">
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  Processing with Gemini AI...
                </span>
              )}
            </div>

            {aiSuccessMsg && (
              <div className="p-2.5 bg-emerald-100 text-emerald-800 rounded-lg text-xs font-medium flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{aiSuccessMsg}</span>
              </div>
            )}

            <div className="flex flex-wrap items-center gap-2">
              <div className="flex items-center gap-1.5">
                <select
                  value={translateTargetLang}
                  onChange={(e) => setTranslateTargetLang(e.target.value as SupportedLanguage)}
                  className="px-2.5 py-1.5 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-800"
                >
                  {SUPPORTED_LANGUAGES.map((l) => (
                    <option key={l.code} value={l.code}>
                      {l.flag} {l.name}
                    </option>
                  ))}
                </select>
                <button
                  type="button"
                  onClick={() => handleAiTranslateCurrentPage(translateTargetLang)}
                  disabled={aiWorking}
                  className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-semibold text-xs rounded-xl shadow-xs flex items-center gap-1 transition cursor-pointer"
                >
                  <Globe className="w-3.5 h-3.5" />
                  Translate Page
                </button>
                <button
                  type="button"
                  onClick={handleBatchAiTranslateAllPages}
                  disabled={aiWorking}
                  className="px-3 py-1.5 bg-indigo-700 hover:bg-indigo-600 disabled:opacity-50 text-white font-semibold text-xs rounded-xl shadow-xs flex items-center gap-1 transition cursor-pointer"
                  title="Auto-translate page content into all 7 supported languages"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  Auto-Translate All Languages
                </button>
              </div>
            </div>
          </div>

          {/* Main Grid: Left Gutenberg Editor, Right WordPress Polylang Sidebar */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Left 3 Cols: Editor Workspace */}
            <div className="lg:col-span-3 space-y-5">
              {editTargetType === "core" && formPageContent ? (
                <>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700">Section / Page Title</label>
                    <input
                      type="text"
                      value={formPageContent.title || ""}
                      onChange={(e) =>
                        setFormPageContent({ ...formPageContent, title: e.target.value })
                      }
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-slate-900 font-bold text-xl focus:ring-2 focus:ring-indigo-500/15"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700">Subtitle / Lead Paragraph</label>
                    <input
                      type="text"
                      value={formPageContent.subtitle || ""}
                      onChange={(e) =>
                        setFormPageContent({ ...formPageContent, subtitle: e.target.value })
                      }
                      className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-slate-800 text-sm focus:ring-2 focus:ring-indigo-500/15"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700">Page Content (WYSIWYG / HTML)</label>
                    <ClassicEditor
                      value={formPageContent.content || ""}
                      onChange={(val) =>
                        setFormPageContent({ ...formPageContent, content: val })
                      }
                    />
                  </div>
                </>
              ) : editTargetType === "custom" && formCustomPage ? (
                <>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700">Page Title *</label>
                    <input
                      type="text"
                      value={formCustomPage.title || ""}
                      onChange={(e) =>
                        setFormCustomPage({
                          ...formCustomPage,
                          title: e.target.value,
                          slug:
                            formCustomPage.slug ||
                            e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
                        })
                      }
                      placeholder="e.g. Free Scribd Document & Audio Saver"
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-slate-900 font-bold text-xl focus:ring-2 focus:ring-indigo-500/15"
                      required
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700">Subtitle / Lead Sentence</label>
                    <input
                      type="text"
                      value={formCustomPage.subtitle || ""}
                      onChange={(e) =>
                        setFormCustomPage({ ...formCustomPage, subtitle: e.target.value })
                      }
                      className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-slate-800 text-sm focus:ring-2 focus:ring-indigo-500/15"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700">Page Content (WYSIWYG / HTML)</label>
                    <ClassicEditor
                      value={formCustomPage.content || ""}
                      onChange={(val) =>
                        setFormCustomPage({ ...formCustomPage, content: val })
                      }
                    />
                  </div>
                </>
              ) : null}
            </div>

            {/* Right Col: WordPress Polylang Sidebar & Page Settings */}
            <div className="space-y-6">
              {/* Language Settings (Polylang Style Sidebar) */}
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
                <h4 className="text-xs font-black uppercase tracking-wider text-slate-500 flex items-center gap-2 mb-3">
                  <Globe className="w-4 h-4 text-indigo-600" />
                  Language & Translations
                </h4>

                <div className="mb-4">
                  <label className="text-xs font-bold text-slate-700 mb-1 block">Active Language</label>
                  <select
                    value={activeFormLang}
                    onChange={(e) => handleSidebarSwitchLanguage(e.target.value as SupportedLanguage)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm font-semibold bg-white cursor-pointer hover:border-indigo-400 focus:ring-2 focus:ring-indigo-500/20"
                  >
                    {SUPPORTED_LANGUAGES.map((lang) => (
                      <option key={lang.code} value={lang.code}>
                        {lang.flag} {lang.name} ({lang.code.toUpperCase()})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2 border-t border-slate-200 pt-3">
                  <label className="text-xs font-bold text-slate-700 block">Translations List</label>
                  <ul className="space-y-1.5 text-xs">
                    {SUPPORTED_LANGUAGES.map((lang) => {
                      const isCurrent = lang.code === activeFormLang;

                      let hasVariant = false;
                      if (editTargetType === "core") {
                        hasVariant = pageContents.some(
                          (c) => c.pageKey === formCoreKey && c.language === lang.code && c.content && c.content.length > 30
                        );
                      } else if (editTargetType === "custom" && formCustomPage) {
                        hasVariant = customPagesList.some(
                          (p) =>
                            (p.translationGroupId === formTranslationGroupId ||
                              p.slug.includes(formCustomPage.slug.replace(/-[a-z]{2}$/, ""))) &&
                            p.language === lang.code
                        );
                      }

                      if (isCurrent) {
                        return (
                          <li
                            key={lang.code}
                            className="flex items-center justify-between p-2 bg-indigo-50 border border-indigo-200 rounded-lg"
                          >
                            <span className="flex items-center gap-1.5 font-bold text-indigo-900">
                              {lang.flag} {lang.name}
                            </span>
                            <span className="text-[10px] text-indigo-700 font-extrabold bg-indigo-100 px-2 py-0.5 rounded border border-indigo-200">
                              CURRENT
                            </span>
                          </li>
                        );
                      }

                      return (
                        <li
                          key={lang.code}
                          onClick={() => handleSidebarSwitchLanguage(lang.code)}
                          className="flex items-center justify-between p-2 hover:bg-slate-100 rounded-lg group transition cursor-pointer border border-transparent hover:border-slate-200"
                        >
                          <span className="flex items-center gap-1.5 font-medium text-slate-800 group-hover:text-indigo-600">
                            {lang.flag} {lang.name}
                          </span>
                          <div className="flex items-center gap-1">
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleSidebarSwitchLanguage(lang.code);
                              }}
                              className={`text-[10px] font-bold px-2 py-0.5 rounded transition cursor-pointer ${
                                hasVariant
                                  ? "bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200"
                                  : "bg-slate-100 text-slate-600 hover:bg-indigo-50 hover:text-indigo-600 border border-slate-200"
                              }`}
                            >
                              {hasVariant ? "✓ Edit" : "+ Create"}
                            </button>
                          </div>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              </div>

              {/* Publish & Status Panel */}
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-3">
                <h4 className="text-xs font-black uppercase tracking-wider text-slate-500 flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-600" />
                  Publish Status
                </h4>
                {editTargetType === "custom" && formCustomPage && (
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700">Status</label>
                    <select
                      value={formCustomPage.status || "published"}
                      onChange={(e) =>
                        setFormCustomPage({
                          ...formCustomPage,
                          status: e.target.value as "published" | "draft",
                        })
                      }
                      className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm font-semibold bg-white"
                    >
                      <option value="published">Published</option>
                      <option value="draft">Draft</option>
                    </select>
                  </div>
                )}
                <button
                  type="button"
                  onClick={handleSaveActivePage}
                  className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm shadow transition cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <Save className="w-4 h-4" />
                  Save & Publish Page
                </button>
              </div>

              {/* SEO & Route Settings Panel */}
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-3">
                <h4 className="text-xs font-black uppercase tracking-wider text-slate-500 flex items-center gap-2">
                  <Settings className="w-4 h-4 text-slate-600" />
                  Route & SEO Meta
                </h4>

                {editTargetType === "custom" && formCustomPage && (
                  <>
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-700">URL Slug</label>
                      <input
                        type="text"
                        value={formCustomPage.slug || ""}
                        onChange={(e) =>
                          setFormCustomPage({
                            ...formCustomPage,
                            slug: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ""),
                          })
                        }
                        className="w-full px-3 py-1.5 rounded-lg border border-slate-300 font-mono text-xs text-slate-800"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-700">SEO Meta Title</label>
                      <input
                        type="text"
                        value={formCustomPage.metaTitle || ""}
                        onChange={(e) =>
                          setFormCustomPage({ ...formCustomPage, metaTitle: e.target.value })
                        }
                        className="w-full px-3 py-1.5 rounded-lg border border-slate-300 text-xs text-slate-800"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-700">SEO Meta Description</label>
                      <textarea
                        rows={2}
                        value={formCustomPage.metaDescription || ""}
                        onChange={(e) =>
                          setFormCustomPage({ ...formCustomPage, metaDescription: e.target.value })
                        }
                        className="w-full px-3 py-1.5 rounded-lg border border-slate-300 text-xs text-slate-800"
                      />
                    </div>
                  </>
                )}

                {editTargetType === "core" && (
                  <div className="p-3 bg-white rounded-lg border border-slate-200 text-xs text-slate-600">
                    <span className="font-bold text-slate-800">Core Route: </span>
                    <span className="font-mono text-indigo-600">/{formCoreKey}</span>
                    <p className="mt-1 text-[11px] text-slate-500">
                      System pages have fixed routing. Content and translations are indexed automatically.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* --- VERTICAL PAGES TABLE & FILTERS (WordPress Style) --- */
        <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden space-y-4 p-5 sm:p-6">
          {/* Top Filter Bar */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-1 bg-slate-100 p-1 rounded-xl text-xs font-semibold">
              <button
                type="button"
                onClick={() => setActiveListFilter("all")}
                className={`px-3 py-1.5 rounded-lg transition cursor-pointer ${
                  activeListFilter === "all" ? "bg-white text-slate-900 shadow-2xs" : "text-slate-600 hover:text-slate-900"
                }`}
              >
                All Pages ({combinedPagesList.length})
              </button>
              <button
                type="button"
                onClick={() => setActiveListFilter("core")}
                className={`px-3 py-1.5 rounded-lg transition cursor-pointer ${
                  activeListFilter === "core" ? "bg-white text-indigo-700 shadow-2xs" : "text-slate-600 hover:text-slate-900"
                }`}
              >
                Core ({CORE_SYSTEM_PAGES.length})
              </button>
              <button
                type="button"
                onClick={() => setActiveListFilter("custom")}
                className={`px-3 py-1.5 rounded-lg transition cursor-pointer ${
                  activeListFilter === "custom" ? "bg-white text-indigo-700 shadow-2xs" : "text-slate-600 hover:text-slate-900"
                }`}
              >
                Custom ({customPagesList.length})
              </button>
              <button
                type="button"
                onClick={() => setActiveListFilter("published")}
                className={`px-3 py-1.5 rounded-lg transition cursor-pointer ${
                  activeListFilter === "published" ? "bg-white text-emerald-700 shadow-2xs" : "text-slate-600 hover:text-slate-900"
                }`}
              >
                Published
              </button>
              <button
                type="button"
                onClick={() => setActiveListFilter("draft")}
                className={`px-3 py-1.5 rounded-lg transition cursor-pointer ${
                  activeListFilter === "draft" ? "bg-white text-amber-700 shadow-2xs" : "text-slate-600 hover:text-slate-900"
                }`}
              >
                Draft
              </button>
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <select
                value={selectedLangFilter}
                onChange={(e) => setSelectedLangFilter(e.target.value as SupportedLanguage | "all")}
                className="px-3 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 bg-white"
              >
                <option value="all">🌐 All Languages</option>
                {SUPPORTED_LANGUAGES.map((l) => (
                  <option key={l.code} value={l.code}>
                    {l.flag} {l.name} ({l.code.toUpperCase()})
                  </option>
                ))}
              </select>

              <div className="relative w-full sm:w-64">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search pages..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-200 text-sm font-medium focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
                />
              </div>
            </div>
          </div>

          {/* Bulk Selection Bar */}
          {selectedPageIds.length > 0 && (
            <div className="flex items-center justify-between bg-indigo-50 border border-indigo-200 rounded-xl p-3 px-4 shadow-2xs">
              <div className="flex items-center gap-2 text-xs font-extrabold text-indigo-900">
                <CheckSquare className="w-4 h-4 text-indigo-600" />
                <span>{selectedPageIds.length} custom page(s) selected</span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedPageIds([])}
                  className="px-3 py-1.5 rounded-lg text-xs font-bold text-slate-600 hover:bg-indigo-100/70 transition cursor-pointer"
                >
                  Deselect All
                </button>
                <button
                  type="button"
                  onClick={() =>
                    setConfirmModalConfig({
                      isOpen: true,
                      type: "selected",
                      count: selectedPageIds.length,
                    })
                  }
                  className="px-3.5 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-700 text-white text-xs font-extrabold flex items-center gap-1.5 shadow-2xs transition cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  Delete Selected ({selectedPageIds.length})
                </button>
              </div>
            </div>
          )}

          {/* Vertical Table */}
          <div className="overflow-x-auto border border-slate-200 rounded-xl">
            <table className="w-full text-left border-collapse min-w-[800px]">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-xs text-slate-500 uppercase tracking-wider font-bold">
                  <th className="p-4 w-12 text-center">
                    <input
                      type="checkbox"
                      checked={allCustomVisibleSelected && customPagesVisible.length > 0}
                      onChange={toggleSelectAllCustomVisible}
                      disabled={customPagesVisible.length === 0}
                      className="w-4 h-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer disabled:opacity-30"
                      title="Select / Deselect All Custom Pages"
                    />
                  </th>
                  <th className="p-4">Title & Type</th>
                  <th className="p-4">URL Route</th>
                  <th className="p-4">Language</th>
                  <th className="p-4">Translations</th>
                  <th className="p-4">Status</th>
                  <th className="p-4">Last Modified</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm">
                {filteredPages.map((page) => {
                  const langOpt = SUPPORTED_LANGUAGES.find((l) => l.code === page.language);
                  const isPageSelected = selectedPageIds.includes(page.id);

                  return (
                    <tr
                      key={page.id}
                      className={`transition group ${
                        isPageSelected ? "bg-indigo-50/60" : "hover:bg-slate-50"
                      }`}
                    >
                      <td className="p-4 text-center">
                        {!page.isCore ? (
                          <input
                            type="checkbox"
                            checked={isPageSelected}
                            onChange={() => toggleSelectPage(page.id)}
                            className="w-4 h-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                          />
                        ) : (
                          <span
                            className="text-slate-300 text-xs"
                            title="Core system pages cannot be bulk selected"
                          >
                            •
                          </span>
                        )}
                      </td>
                      <td className="p-4">
                        <div className="font-bold text-slate-900 flex items-center gap-2">
                          {page.isCore ? (
                            <span className="px-2 py-0.5 text-[10px] font-extrabold uppercase bg-indigo-50 text-indigo-700 rounded border border-indigo-200">
                              Core Page
                            </span>
                          ) : (
                            <span className="px-2 py-0.5 text-[10px] font-extrabold uppercase bg-purple-50 text-purple-700 rounded border border-purple-200">
                              Custom Landing
                            </span>
                          )}
                          <span>{page.title}</span>
                        </div>
                        <div className="text-xs text-slate-400 mt-1 line-clamp-1">
                          {page.metaDescription}
                        </div>
                      </td>
                      <td className="p-4 font-mono text-xs font-bold text-indigo-600">
                        {page.slug}
                      </td>
                      <td className="p-4">
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-100 border border-slate-200 text-xs font-bold text-slate-700">
                          {page.isCore ? "🌐 Universal" : `${langOpt?.flag || "🌐"} ${(page.language || "all").toUpperCase()}`}
                        </span>
                      </td>
                      <td className="p-4">
                        <div className="flex flex-wrap items-center gap-1">
                          {SUPPORTED_LANGUAGES.map((lang) => {
                            let hasContent = false;
                            if (page.isCore) {
                              hasContent = pageContents.some(
                                (c) => c.pageKey === page.route && c.language === lang.code && c.content && c.content.length > 30
                              );
                            } else {
                              hasContent = customPagesList.some(
                                (p) =>
                                  (p.translationGroupId === page.translationGroupId ||
                                    p.slug.includes(page.slug.replace(/-[a-z]{2}$/, ""))) &&
                                  p.language === lang.code
                              );
                            }

                            return (
                              <button
                                key={lang.code}
                                type="button"
                                onClick={() => {
                                  if (page.isCore) {
                                    startEditCorePage(page.route || "home", lang.code);
                                  } else if (page.rawCustomPage) {
                                    startEditCustomPage(page.rawCustomPage, lang.code);
                                  }
                                }}
                                title={`Edit ${lang.name} translation`}
                                className={`px-1.5 py-0.5 rounded text-[10px] font-bold transition flex items-center gap-0.5 ${
                                  hasContent
                                    ? "bg-emerald-100 text-emerald-800 border border-emerald-200 hover:bg-emerald-200"
                                    : "bg-slate-100 text-slate-400 border border-slate-200 hover:bg-slate-200"
                                }`}
                              >
                                <span>{lang.flag}</span>
                                <span>{lang.code.toUpperCase()}</span>
                              </button>
                            );
                          })}
                        </div>
                      </td>
                      <td className="p-4">
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider bg-emerald-100 text-emerald-800">
                          {page.status.toUpperCase()}
                        </span>
                      </td>
                      <td className="p-4 text-slate-500 text-xs font-medium whitespace-nowrap">
                        {page.lastModified}
                      </td>
                      <td className="p-4 text-right">
                        <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            type="button"
                            onClick={() => {
                              if (page.isCore) {
                                startEditCorePage(page.route || "home", "en");
                              } else if (page.rawCustomPage) {
                                startEditCustomPage(page.rawCustomPage);
                              }
                            }}
                            className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition cursor-pointer"
                            title="Edit Page"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          {!page.isCore && (
                            <button
                              type="button"
                              onClick={() =>
                                setConfirmModalConfig({
                                  isOpen: true,
                                  type: "single",
                                  pageId: page.id,
                                })
                              }
                              className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition cursor-pointer"
                              title="Delete Custom Page"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
                {filteredPages.length === 0 && (
                  <tr>
                    <td colSpan={8} className="p-8 text-center">
                      <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-3">
                        <FileText className="w-6 h-6 text-slate-400" />
                      </div>
                      <p className="text-slate-500 font-medium">No pages found matching search criteria.</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* REACT CONFIRMATION MODAL (NO WINDOW.CONFIRM / ALERT) */}
      {confirmModalConfig && confirmModalConfig.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 animate-in fade-in">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl border border-slate-100 animate-in zoom-in-95 space-y-4">
            <div className="flex items-center gap-3 text-rose-600">
              <div className="p-3 bg-rose-100 rounded-xl">
                <AlertTriangle className="w-6 h-6 text-rose-600" />
              </div>
              <div>
                <h3 className="text-lg font-extrabold text-slate-900">
                  {confirmModalConfig.type === "all"
                    ? "Delete ALL Custom Pages?"
                    : confirmModalConfig.type === "selected"
                    ? `Delete ${confirmModalConfig.count} Selected Pages?`
                    : "Delete Custom Page?"}
                </h3>
                <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">
                  Irreversible Action
                </p>
              </div>
            </div>

            <p className="text-sm text-slate-600 font-medium leading-relaxed bg-slate-50 p-3.5 rounded-xl border border-slate-200">
              {confirmModalConfig.type === "all"
                ? `Are you sure you want to delete all ${confirmModalConfig.count || customPagesList.length} custom pages? They will be completely purged from local state, server storage, and sitemaps.`
                : confirmModalConfig.type === "selected"
                ? `Are you sure you want to delete the ${confirmModalConfig.count} selected custom pages? This will purge them from storage and sitemaps.`
                : "Are you sure you want to delete this custom page? It will be removed from storage and sitemaps."}
            </p>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setConfirmModalConfig(null)}
                className="px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-100 transition cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={executeConfirmedDelete}
                className="px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shadow-md transition cursor-pointer flex items-center gap-1.5"
              >
                <Trash2 className="w-4 h-4" />
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
