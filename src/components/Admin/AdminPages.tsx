import React, { useState, useEffect } from "react";
import { PageRoute, CustomPage, SupportedLanguage } from "../../types";
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
} from "lucide-react";
import {
  loadCustomPages,
  saveCustomPages,
  DEFAULT_CUSTOM_PAGES,
} from "../../data/siteConfig";

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
  },
  {
    id: "core-how-it-works",
    route: "how-it-works",
    title: "How It Works Guide",
    slug: "/how-it-works",
    status: "published",
    metaTitle: "How It Works - Scribd Document Extraction Architecture & Guide",
    metaDescription: "Learn how our multi-threaded Node.js engine extracts high-resolution vector tiles and compiles unified standard PDF documents.",
    lastModified: "2 days ago",
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
  },
  {
    id: "core-privacy",
    route: "privacy",
    title: "Privacy Policy (GDPR / CCPA)",
    slug: "/privacy",
    status: "published",
    metaTitle: "Privacy Policy - Scribd Downloader",
    metaDescription: "Learn about our strict zero-retention data privacy guarantees. All temp files purged automatically.",
    lastModified: "1 month ago",
  },
  {
    id: "core-terms",
    route: "terms",
    title: "Terms of Service & Fair Use",
    slug: "/terms",
    status: "published",
    metaTitle: "Terms of Service & Fair Use - Scribd Downloader",
    metaDescription: "Review our terms of service, fair-use guidelines, and DMCA copyright policies.",
    lastModified: "1 month ago",
  },
];

const TEMPLATES = {
  faq: {
    title: "Frequently Asked Questions",
    slug: "faq",
    subtitle: "Common answers to document downloading, DRM handling, and formats",
    content: `# Frequently Asked Questions

Find answers to common questions about using Scribd Downloader.

## 1. How does the document conversion work?
Our high-speed scraper connects to the document's vector streams, retrieves clean high-resolution page tiles, and re-compiles them into a standard Adobe-compliant PDF.

## 2. Is there a page count limit?
Documents up to 300 pages are supported. Standard documents (10–30 pages) usually compile in under 5 seconds!

## 3. Do I need an account or credit card?
No! The tool is completely free with no registration or credit cards required.`,
  },
  dmca: {
    title: "DMCA Copyright Compliance & Notice",
    slug: "dmca-compliance",
    subtitle: "Digital Millennium Copyright Act Notice and Takedown Submission",
    content: `# DMCA Copyright Compliance

We respect the intellectual property rights of content authors.

## Non-Hosting Notice
Our servers operate purely as an automated protocol converter and do not permanently host or archive proprietary materials.

## Submit a Takedown
If you are a copyright owner wishing to request takedown of any content, please email: dmca@scribddownloader.org.`,
  },
  guide: {
    title: "User Guide & Troubleshooting",
    slug: "user-guide",
    subtitle: "Step-by-step instructions for troubleshooting Scribd links",
    content: `# User Guide & Troubleshooting

Follow these steps to download documents reliably:

1. **Copy the Scribd URL**: Copy the full link from your browser address bar.
2. **Paste into Downloader**: Ensure the format is https://www.scribd.com/document/12345/Title.
3. **Click Download PDF**: Our scraper will extract and compile the file.`,
  },
  blank: {
    title: "New Page Title",
    slug: "new-page",
    subtitle: "Write a short subtitle or description for this page",
    content: `# New Page Title

Write your custom page content here using Markdown formatting.

## Section 1
Add paragraphs, bullet points, or instructions here.

- Feature item 1
- Feature item 2
- Feature item 3`,
  },
};

export function AdminPages() {
  const [corePages, setCorePages] = useState<PageConfig[]>(CORE_SYSTEM_PAGES);
  const [customPages, setCustomPages] = useState<CustomPage[]>([]);
  const [activeTabFilter, setActiveTabFilter] = useState<"all" | "custom" | "core">("all");
  const [searchQuery, setSearchQuery] = useState("");

  // Editor Modal State
  const [isEditing, setIsEditing] = useState(false);
  const [isCreatingNew, setIsCreatingNew] = useState(false);
  const [editingPage, setEditingPage] = useState<PageConfig | null>(null);
  const [previewMode, setPreviewMode] = useState<"edit" | "preview">("edit");

  // Notifications
  const [notification, setNotification] = useState<{ type: "success" | "error"; message: string } | null>(null);

  // Load custom pages from localStorage / server on mount
  useEffect(() => {
    const loaded = loadCustomPages();
    setCustomPages(loaded);

    // Sync from server if available
    fetch("/api/custom-pages")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data && Array.isArray(data.pages) && data.pages.length > 0) {
          setCustomPages(data.pages);
          saveCustomPages(data.pages);
        }
      })
      .catch(() => {});
  }, []);

  const showNotification = (message: string, type: "success" | "error" = "success") => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 3500);
  };

  // -------------------------------------------------------------
  // CREATE / EDIT ACTIONS
  // -------------------------------------------------------------
  const handleOpenCreateModal = (templateKey: keyof typeof TEMPLATES = "blank") => {
    const tpl = TEMPLATES[templateKey];
    const newId = `page-${Date.now()}`;
    setEditingPage({
      id: newId,
      isCustom: true,
      title: tpl.title,
      slug: tpl.slug + "-" + Math.floor(Math.random() * 90 + 10),
      subtitle: tpl.subtitle,
      content: tpl.content,
      status: "published",
      showInHeader: false,
      showInFooter: true,
      language: "all",
      metaTitle: `${tpl.title} - Scribd Downloader`,
      metaDescription: tpl.subtitle || "Learn more about our document conversion utility.",
      lastModified: "Today",
      authorName: "Admin Staff",
    });
    setIsCreatingNew(true);
    setIsEditing(true);
    setPreviewMode("edit");
  };

  const handleStartEdit = (page: PageConfig) => {
    setEditingPage({ ...page });
    setIsCreatingNew(!page.isCustom ? false : !customPages.some((p) => p.id === page.id));
    setIsEditing(true);
    setPreviewMode("edit");
  };

  const handleSavePage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPage) return;

    const todayStr = new Date().toISOString().split("T")[0];

    // Clean up slug
    let cleanSlug = editingPage.slug.trim().toLowerCase().replace(/^\/+/, "").replace(/\/+$/, "");
    if (!cleanSlug) cleanSlug = "page-" + Date.now();

    if (editingPage.isCustom) {
      const customPageObj: CustomPage = {
        id: editingPage.id,
        slug: cleanSlug,
        title: editingPage.title,
        subtitle: editingPage.subtitle || "",
        content: editingPage.content || "",
        status: editingPage.status,
        metaTitle: editingPage.metaTitle,
        metaDescription: editingPage.metaDescription,
        showInHeader: Boolean(editingPage.showInHeader),
        showInFooter: Boolean(editingPage.showInFooter),
        language: editingPage.language || "all",
        lastModified: todayStr,
        createdAt: todayStr,
        authorName: editingPage.authorName || "Site Admin",
      };

      let updatedCustomList: CustomPage[];
      const existsIndex = customPages.findIndex((p) => p.id === editingPage.id);

      if (existsIndex >= 0) {
        updatedCustomList = [...customPages];
        updatedCustomList[existsIndex] = customPageObj;
      } else {
        updatedCustomList = [customPageObj, ...customPages];
      }

      setCustomPages(updatedCustomList);
      saveCustomPages(updatedCustomList);
      showNotification(`Custom page "${editingPage.title}" has been saved and published successfully!`);
    } else {
      // Core System Page update
      const updatedCore = corePages.map((p) =>
        p.id === editingPage.id ? { ...editingPage, slug: editingPage.slug, lastModified: "Just now" } : p
      );
      setCorePages(updatedCore);
      showNotification(`Core page "${editingPage.title}" settings updated.`);
    }

    setIsEditing(false);
    setEditingPage(null);
  };

  const handleDeleteCustomPage = (id: string, title: string) => {
    if (!window.confirm(`Are you sure you want to delete custom page "${title}"?`)) return;
    const updated = customPages.filter((p) => p.id !== id);
    setCustomPages(updated);
    saveCustomPages(updated);
    showNotification(`Page "${title}" deleted.`);
  };

  const handleDuplicateCustomPage = (page: CustomPage) => {
    const duplicated: CustomPage = {
      ...page,
      id: `page-${Date.now()}`,
      slug: `${page.slug}-copy-${Math.floor(Math.random() * 100)}`,
      title: `${page.title} (Copy)`,
      lastModified: new Date().toISOString().split("T")[0],
    };
    const updated = [duplicated, ...customPages];
    setCustomPages(updated);
    saveCustomPages(updated);
    showNotification(`Duplicated page "${duplicated.title}".`);
  };

  const handleToggleStatus = (id: string) => {
    const updated = customPages.map((p) => {
      if (p.id === id) {
        return {
          ...p,
          status: p.status === "published" ? ("draft" as const) : ("published" as const),
        };
      }
      return p;
    });
    setCustomPages(updated);
    saveCustomPages(updated);
    showNotification("Page status updated.");
  };

  // Combine core and custom pages for the table
  const allTablePages: PageConfig[] = [
    ...customPages.map((cp) => ({
      id: cp.id,
      isCustom: true,
      title: cp.title,
      slug: `/${cp.slug}`,
      subtitle: cp.subtitle,
      status: cp.status,
      metaTitle: cp.metaTitle,
      metaDescription: cp.metaDescription,
      lastModified: cp.lastModified,
      content: cp.content,
      showInHeader: cp.showInHeader,
      showInFooter: cp.showInFooter,
      language: cp.language,
      authorName: cp.authorName,
    })),
    ...corePages.map((cp) => ({ ...cp, isCustom: false })),
  ];

  // Filter list
  const filteredPages = allTablePages.filter((p) => {
    if (activeTabFilter === "custom" && !p.isCustom) return false;
    if (activeTabFilter === "core" && p.isCustom) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return p.title.toLowerCase().includes(q) || p.slug.toLowerCase().includes(q);
    }
    return true;
  });

  return (
    <div className="space-y-6" id="admin-pages-dashboard">
      {/* Top Banner with Action Button */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-2.5 py-0.5 rounded-full border border-indigo-100">
              Page Builder & Architecture
            </span>
            <span className="text-xs text-slate-400">
              {customPages.length} Custom Pages • {corePages.length} Core Pages
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 mt-1">
            Website Pages & Custom Page Builder
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Create new landing pages, legal notices, FAQ guides, and configure SEO titles and slugs for all site routes.
          </p>
        </div>

        {/* Primary Create Button */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => handleOpenCreateModal("blank")}
            className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold inline-flex items-center gap-2 shadow-xs cursor-pointer transition"
          >
            <Plus className="w-4 h-4" />
            <span>+ Create New Page</span>
          </button>
        </div>
      </div>

      {/* Notification Toast */}
      {notification && (
        <div
          className={`p-4 rounded-xl text-xs font-bold flex items-center gap-2 shadow-xs transition-all ${
            notification.type === "success"
              ? "bg-emerald-50 border border-emerald-200 text-emerald-900"
              : "bg-rose-50 border border-rose-200 text-rose-900"
          }`}
        >
          {notification.type === "success" ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          ) : (
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
          )}
          <span>{notification.message}</span>
        </div>
      )}

      {/* Quick Create with Template Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div
          onClick={() => handleOpenCreateModal("faq")}
          className="p-3.5 bg-gradient-to-br from-blue-50/50 to-indigo-50/40 rounded-xl border border-blue-100/80 hover:border-blue-300 transition cursor-pointer group"
        >
          <div className="flex items-center gap-2 font-bold text-xs text-slate-900 group-hover:text-blue-600">
            <HelpCircle className="w-4 h-4 text-blue-600" />
            <span>FAQ Page Template</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">Pre-built Q&A structure for customer inquiries.</p>
        </div>

        <div
          onClick={() => handleOpenCreateModal("dmca")}
          className="p-3.5 bg-gradient-to-br from-emerald-50/50 to-teal-50/40 rounded-xl border border-emerald-100/80 hover:border-emerald-300 transition cursor-pointer group"
        >
          <div className="flex items-center gap-2 font-bold text-xs text-slate-900 group-hover:text-emerald-600">
            <Sparkles className="w-4 h-4 text-emerald-600" />
            <span>DMCA / Policy Template</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">Legal takedown and fair-use policy template.</p>
        </div>

        <div
          onClick={() => handleOpenCreateModal("guide")}
          className="p-3.5 bg-gradient-to-br from-purple-50/50 to-pink-50/40 rounded-xl border border-purple-100/80 hover:border-purple-300 transition cursor-pointer group"
        >
          <div className="flex items-center gap-2 font-bold text-xs text-slate-900 group-hover:text-purple-600">
            <BookOpenIcon className="w-4 h-4 text-purple-600" />
            <span>Tutorial & Guide Template</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">Step-by-step documentation and how-to guide.</p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-3">
        {/* Tabs Filter */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setActiveTabFilter("all")}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
              activeTabFilter === "all"
                ? "bg-slate-900 text-white"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
          >
            All Pages ({allTablePages.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveTabFilter("custom")}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
              activeTabFilter === "custom"
                ? "bg-indigo-600 text-white"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
          >
            Custom Pages ({customPages.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveTabFilter("core")}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
              activeTabFilter === "core"
                ? "bg-slate-700 text-white"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
          >
            Core Pages ({corePages.length})
          </button>
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search pages by title or slug..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-indigo-500 bg-white"
          />
        </div>
      </div>

      {/* Pages Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-50 text-slate-500 font-bold uppercase tracking-wider border-b border-slate-100">
            <tr>
              <th className="px-5 py-3.5">Page Title</th>
              <th className="px-5 py-3.5">Route Slug</th>
              <th className="px-5 py-3.5">Type</th>
              <th className="px-5 py-3.5">Placement</th>
              <th className="px-5 py-3.5">Status</th>
              <th className="px-5 py-3.5 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredPages.map((page) => (
              <tr key={page.id} className="hover:bg-slate-50/60 transition">
                {/* Title */}
                <td className="px-5 py-3.5">
                  <div className="flex items-center gap-2.5">
                    <div
                      className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                        page.isCustom ? "bg-indigo-50 text-indigo-600" : "bg-slate-100 text-slate-600"
                      }`}
                    >
                      {page.isCustom ? <FileText className="w-4 h-4" /> : <FileCode className="w-4 h-4" />}
                    </div>
                    <div>
                      <div className="font-bold text-slate-900">{page.title}</div>
                      <div className="text-[11px] text-slate-400 truncate max-w-xs">{page.metaTitle}</div>
                    </div>
                  </div>
                </td>

                {/* Slug */}
                <td className="px-5 py-3.5 font-mono text-slate-600">
                  <span className="bg-slate-100 px-2 py-0.5 rounded text-[11px]">{page.slug}</span>
                </td>

                {/* Type */}
                <td className="px-5 py-3.5">
                  {page.isCustom ? (
                    <span className="px-2 py-0.5 rounded-full bg-purple-50 text-purple-700 font-bold text-[10px] border border-purple-200">
                      Custom Page
                    </span>
                  ) : (
                    <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 font-bold text-[10px]">
                      Core System
                    </span>
                  )}
                </td>

                {/* Placement */}
                <td className="px-5 py-3.5 text-slate-500">
                  {page.isCustom ? (
                    <div className="flex items-center gap-1.5 text-[11px]">
                      {page.showInHeader && (
                        <span className="px-1.5 py-0.5 bg-blue-50 text-blue-700 rounded font-semibold">Header</span>
                      )}
                      {page.showInFooter && (
                        <span className="px-1.5 py-0.5 bg-slate-100 text-slate-700 rounded font-semibold">Footer</span>
                      )}
                      {!page.showInHeader && !page.showInFooter && <span className="text-slate-400">Direct Link Only</span>}
                    </div>
                  ) : (
                    <span className="text-slate-400 text-[11px]">Standard Menu</span>
                  )}
                </td>

                {/* Status */}
                <td className="px-5 py-3.5">
                  {page.isCustom ? (
                    <button
                      type="button"
                      onClick={() => handleToggleStatus(page.id)}
                      className={`px-2 py-0.5 rounded-full font-bold text-[11px] border transition cursor-pointer ${
                        page.status === "published"
                          ? "bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100"
                          : "bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100"
                      }`}
                      title="Click to toggle status"
                    >
                      {page.status === "published" ? "● Published" : "○ Draft"}
                    </button>
                  ) : (
                    <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 font-bold text-[11px] border border-emerald-200">
                      ● Active
                    </span>
                  )}
                </td>

                {/* Actions */}
                <td className="px-5 py-3.5 text-right">
                  <div className="flex items-center justify-end gap-1">
                    {/* Preview / View live button */}
                    {page.isCustom && (
                      <a
                        href={`#${page.slug.replace(/^\/+/, "")}`}
                        target="_blank"
                        rel="noreferrer"
                        className="p-1.5 rounded-lg text-slate-500 hover:text-indigo-600 hover:bg-slate-100 transition cursor-pointer"
                        title="View Live Page"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    )}

                    {/* Duplicate button for custom pages */}
                    {page.isCustom && (
                      <button
                        type="button"
                        onClick={() => {
                          const original = customPages.find((p) => p.id === page.id);
                          if (original) handleDuplicateCustomPage(original);
                        }}
                        className="p-1.5 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition cursor-pointer"
                        title="Duplicate Page"
                      >
                        <Copy className="w-3.5 h-3.5" />
                      </button>
                    )}

                    {/* Edit button */}
                    <button
                      type="button"
                      onClick={() => handleStartEdit(page)}
                      className="p-1.5 rounded-lg text-slate-600 hover:text-indigo-600 hover:bg-slate-100 transition cursor-pointer"
                      title="Edit Page"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>

                    {/* Delete button (for custom pages only) */}
                    {page.isCustom && (
                      <button
                        type="button"
                        onClick={() => handleDeleteCustomPage(page.id, page.title)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition cursor-pointer"
                        title="Delete Page"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}

            {filteredPages.length === 0 && (
              <tr>
                <td colSpan={6} className="px-5 py-8 text-center text-slate-400 text-xs">
                  No pages match your filter. Click <strong>"+ Create New Page"</strong> to add one.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* ================================================================= */}
      {/* FULL PAGE CREATOR / EDITOR DRAWER / MODAL                         */}
      {/* ================================================================= */}
      {isEditing && editingPage && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
          <div className="bg-white w-full max-w-4xl rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-auto max-h-[90vh] flex flex-col">
            {/* Modal Header */}
            <div className="p-5 sm:px-8 border-b border-slate-100 flex items-center justify-between bg-slate-50/60">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full border border-indigo-100">
                  {editingPage.isCustom ? (isCreatingNew ? "New Custom Page" : "Edit Custom Page") : "Edit Core Page"}
                </span>
                <h3 className="text-lg font-extrabold text-slate-900 mt-1">
                  {isCreatingNew ? "Create New Page" : `Editing: ${editingPage.title}`}
                </h3>
              </div>

              <div className="flex items-center gap-2">
                {editingPage.isCustom && (
                  <div className="flex items-center bg-slate-200/80 p-1 rounded-xl">
                    <button
                      type="button"
                      onClick={() => setPreviewMode("edit")}
                      className={`px-3 py-1 rounded-lg text-xs font-bold transition cursor-pointer ${
                        previewMode === "edit" ? "bg-white text-slate-900 shadow-xs" : "text-slate-600"
                      }`}
                    >
                      <Code className="w-3.5 h-3.5 inline mr-1" />
                      Editor
                    </button>
                    <button
                      type="button"
                      onClick={() => setPreviewMode("preview")}
                      className={`px-3 py-1 rounded-lg text-xs font-bold transition cursor-pointer ${
                        previewMode === "preview" ? "bg-white text-slate-900 shadow-xs" : "text-slate-600"
                      }`}
                    >
                      <Eye className="w-3.5 h-3.5 inline mr-1" />
                      Live Preview
                    </button>
                  </div>
                )}

                <button
                  type="button"
                  onClick={() => {
                    setIsEditing(false);
                    setEditingPage(null);
                  }}
                  className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Modal Body */}
            <form onSubmit={handleSavePage} className="p-6 sm:px-8 overflow-y-auto space-y-6 flex-1">
              {/* Row 1: Title & Slug */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700">Page Title *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. DMCA Copyright Notice"
                    value={editingPage.title}
                    onChange={(e) => {
                      const newTitle = e.target.value;
                      // Auto-update slug if creating new and slug hasn't been heavily customized
                      if (isCreatingNew) {
                        const autoSlug = newTitle
                          .toLowerCase()
                          .replace(/[^a-z0-9]+/g, "-")
                          .replace(/^-+|-+$/g, "");
                        setEditingPage({
                          ...editingPage,
                          title: newTitle,
                          slug: autoSlug,
                          metaTitle: `${newTitle} - Scribd Downloader`,
                        });
                      } else {
                        setEditingPage({ ...editingPage, title: newTitle });
                      }
                    }}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-bold text-slate-900 focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700">URL Route Slug *</label>
                  <div className="flex items-center">
                    <span className="bg-slate-100 border border-r-0 border-slate-300 text-slate-500 px-3 py-2.5 rounded-l-xl text-xs font-mono">
                      /
                    </span>
                    <input
                      type="text"
                      required
                      placeholder="e.g. dmca-notice"
                      value={editingPage.slug.replace(/^\/+/, "")}
                      onChange={(e) =>
                        setEditingPage({
                          ...editingPage,
                          slug: e.target.value.toLowerCase().replace(/[^a-z0-9_-]/g, "-"),
                        })
                      }
                      className="w-full px-3.5 py-2.5 rounded-r-xl border border-slate-300 text-xs font-mono text-indigo-600 font-bold focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                </div>
              </div>

              {/* Row 2: Subtitle / Tagline */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">Page Subtitle or Summary Tagline</label>
                <input
                  type="text"
                  placeholder="e.g. Official copyright takedown guidelines and fair-use educational principles"
                  value={editingPage.subtitle || ""}
                  onChange={(e) => setEditingPage({ ...editingPage, subtitle: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs text-slate-800 focus:outline-none focus:border-indigo-500"
                />
              </div>

              {/* If Custom Page: Placement & Status Controls */}
              {editingPage.isCustom && (
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                  {/* Status */}
                  <div className="space-y-1.5">
                    <label className="font-bold text-slate-700">Publication Status</label>
                    <select
                      value={editingPage.status}
                      onChange={(e) =>
                        setEditingPage({
                          ...editingPage,
                          status: e.target.value as "published" | "draft",
                        })
                      }
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-bold bg-white"
                    >
                      <option value="published">Published (Live to public)</option>
                      <option value="draft">Draft (Hidden from public)</option>
                    </select>
                  </div>

                  {/* Header Nav Toggle */}
                  <div className="space-y-1.5 flex flex-col justify-center">
                    <label className="font-bold text-slate-700">Header Menu</label>
                    <label className="flex items-center gap-2 cursor-pointer pt-1">
                      <input
                        type="checkbox"
                        checked={editingPage.showInHeader || false}
                        onChange={(e) => setEditingPage({ ...editingPage, showInHeader: e.target.checked })}
                        className="w-4 h-4 rounded text-indigo-600"
                      />
                      <span className="text-slate-700 font-medium">Show in top navigation</span>
                    </label>
                  </div>

                  {/* Footer Nav Toggle */}
                  <div className="space-y-1.5 flex flex-col justify-center">
                    <label className="font-bold text-slate-700">Footer Links</label>
                    <label className="flex items-center gap-2 cursor-pointer pt-1">
                      <input
                        type="checkbox"
                        checked={editingPage.showInFooter || false}
                        onChange={(e) => setEditingPage({ ...editingPage, showInFooter: e.target.checked })}
                        className="w-4 h-4 rounded text-indigo-600"
                      />
                      <span className="text-slate-700 font-medium">Show in footer links</span>
                    </label>
                  </div>
                </div>
              )}

              {/* Custom Page Markdown Content Editor */}
              {editingPage.isCustom && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-slate-700">Page Content (Markdown & HTML supported)</label>
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => {
                          const val = (editingPage.content || "") + "\n\n## Subheading Here\n";
                          setEditingPage({ ...editingPage, content: val });
                        }}
                        className="px-2 py-0.5 rounded bg-slate-100 hover:bg-slate-200 text-[11px] font-bold text-slate-600 cursor-pointer"
                      >
                        + H2
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          const val = (editingPage.content || "") + "\n- Bullet item\n- Bullet item 2\n";
                          setEditingPage({ ...editingPage, content: val });
                        }}
                        className="px-2 py-0.5 rounded bg-slate-100 hover:bg-slate-200 text-[11px] font-bold text-slate-600 cursor-pointer"
                      >
                        + List
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          const val = (editingPage.content || "") + "\n> Important note or disclaimer\n";
                          setEditingPage({ ...editingPage, content: val });
                        }}
                        className="px-2 py-0.5 rounded bg-slate-100 hover:bg-slate-200 text-[11px] font-bold text-slate-600 cursor-pointer"
                      >
                        + Quote
                      </button>
                    </div>
                  </div>

                  {previewMode === "edit" ? (
                    <textarea
                      rows={12}
                      required
                      value={editingPage.content || ""}
                      onChange={(e) => setEditingPage({ ...editingPage, content: e.target.value })}
                      placeholder="# Write your page title and content in Markdown format..."
                      className="w-full p-4 rounded-2xl border border-slate-300 font-mono text-xs text-slate-800 focus:outline-none focus:border-indigo-500 resize-y leading-relaxed bg-slate-50/50"
                    />
                  ) : (
                    <div className="p-6 rounded-2xl border border-slate-200 bg-white min-h-[280px] max-h-[400px] overflow-y-auto">
                      <h1 className="text-2xl font-extrabold text-slate-900 border-b border-slate-100 pb-3">
                        {editingPage.title}
                      </h1>
                      {editingPage.subtitle && (
                        <p className="text-sm text-slate-500 mt-1 mb-4 italic">{editingPage.subtitle}</p>
                      )}
                      <div className="text-xs sm:text-sm text-slate-700 whitespace-pre-line leading-relaxed">
                        {editingPage.content}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* SEO Meta Fields */}
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-4">
                <h4 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider">
                  Search Engine Optimization (SEO)
                </h4>

                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <label className="font-bold text-slate-700">SEO Meta Title (&lt;title&gt;)</label>
                    <span className="text-[11px] text-slate-400">
                      {editingPage.metaTitle.length}/60 recommended
                    </span>
                  </div>
                  <input
                    type="text"
                    required
                    value={editingPage.metaTitle}
                    onChange={(e) => setEditingPage({ ...editingPage, metaTitle: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs text-slate-800 bg-white focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <label className="font-bold text-slate-700">SEO Meta Description</label>
                    <span className="text-[11px] text-slate-400">
                      {editingPage.metaDescription.length}/160 recommended
                    </span>
                  </div>
                  <textarea
                    rows={2}
                    required
                    value={editingPage.metaDescription}
                    onChange={(e) => setEditingPage({ ...editingPage, metaDescription: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs text-slate-800 bg-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              {/* Modal Footer Buttons */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => {
                    setIsEditing(false);
                    setEditingPage(null);
                  }}
                  className="px-5 py-2.5 rounded-xl border border-slate-300 text-slate-700 text-xs font-semibold hover:bg-slate-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-xs cursor-pointer transition flex items-center gap-2"
                >
                  <Check className="w-4 h-4" />
                  <span>{isCreatingNew ? "Create & Publish Page" : "Save Changes"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

function BookOpenIcon(props: any) {
  return <FileText {...props} />;
}
