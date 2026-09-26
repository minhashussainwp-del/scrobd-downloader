import React, { useState, useEffect, useRef } from "react";
import {
  ArrowLeft,
  Save,
  Eye,
  Globe,
  Image as ImageIcon,
  Link as LinkIcon,
  Bold,
  Italic,
  Underline,
  Strikethrough,
  List,
  ListOrdered,
  Quote,
  Code,
  Heading1,
  Heading2,
  Heading3,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  Minus,
  Table as TableIcon,
  Undo2,
  Redo2,
  Check,
  AlertCircle,
  CheckCircle2,
  Loader2,
  Sparkles,
  Search,
  ExternalLink,
  ChevronDown,
  ChevronRight,
  FileCode,
  Maximize2,
  Minimize2,
  HelpCircle,
} from "lucide-react";

export interface ClassicEditorProps {
  initialTitle?: string;
  initialContent?: string;
  initialMetadata?: {
    id?: string;
    slug?: string;
    subtitle?: string;
    excerpt?: string;
    status?: "published" | "draft";
    author?: string;
    featuredImage?: string;
    category?: string;
    tags?: string;
    metaTitle?: string;
    metaDescription?: string;
    canonicalUrl?: string;
    noindex?: boolean;
    translationGroupId?: string;
    [key: string]: any;
  };
  targetLang?: string;
  availableLanguages?: Array<{ code: string; name: string; flag: string }>;
  onSave: (payload: {
    title: string;
    content: string;
    htmlContent: string;
    metadata: any;
    status: "published" | "draft";
    language: string;
  }) => Promise<void>;
  onBack: () => void;
  onPreview?: (slug: string, lang?: string) => void;
  entityType?: "page" | "post" | "homepage";
  categories?: Array<{ id: string; name: string }>;
  onOpenMediaSelector?: (callback: (url: string) => void) => void;
}

const DEFAULT_LANGUAGES = [
  { code: "en", name: "English (Base)", flag: "🇺🇸" },
  { code: "id", name: "Indonesian", flag: "🇮🇩" },
  { code: "hi", name: "Hindi", flag: "🇮🇳" },
  { code: "es", name: "Spanish", flag: "🇲🇽" },
  { code: "fr", name: "French", flag: "🇫🇷" },
  { code: "nl", name: "Dutch", flag: "🇳🇱" },
  { code: "ur", name: "Urdu", flag: "🇵🇰" },
];

export function ClassicEditor({
  initialTitle = "",
  initialContent = "",
  initialMetadata = {},
  targetLang = "en",
  availableLanguages = DEFAULT_LANGUAGES,
  onSave,
  onBack,
  onPreview,
  entityType = "post",
  categories = [
    { id: "cat-1", name: "Guides" },
    { id: "cat-2", name: "Tutorials" },
    { id: "cat-3", name: "Tech" },
    { id: "cat-4", name: "Tips" },
  ],
  onOpenMediaSelector,
}: ClassicEditorProps) {
  // Title & Content State
  const [title, setTitle] = useState(initialTitle);
  const [activeLang, setActiveLang] = useState(targetLang);
  const [contentHtml, setContentHtml] = useState(initialContent);
  const [editorMode, setEditorMode] = useState<"visual" | "html">("visual");

  // Metadata State
  const [slug, setSlug] = useState(initialMetadata.slug || "");
  const [status, setStatus] = useState<"published" | "draft">(
    initialMetadata.status === "draft" ? "draft" : "published"
  );
  const [excerpt, setExcerpt] = useState(initialMetadata.excerpt || "");
  const [category, setCategory] = useState(initialMetadata.category || "Guides");
  const [tags, setTags] = useState(initialMetadata.tags || "");
  const [author, setAuthor] = useState(initialMetadata.author || "Admin Team");
  const [featuredImage, setFeaturedImage] = useState(initialMetadata.featuredImage || "");
  const [metaTitle, setMetaTitle] = useState(initialMetadata.metaTitle || initialTitle);
  const [metaDescription, setMetaDescription] = useState(initialMetadata.metaDescription || "");
  const [canonicalUrl, setCanonicalUrl] = useState(initialMetadata.canonicalUrl || "");
  const [noindex, setNoindex] = useState(Boolean(initialMetadata.noindex));

  // Editor Actions State
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [showLinkModal, setShowLinkModal] = useState(false);
  const [linkUrl, setLinkUrl] = useState("");
  const [linkText, setLinkText] = useState("");
  const [showImageModal, setShowImageModal] = useState(false);
  const [imageUrl, setImageUrl] = useState("");
  const [imageAlt, setImageAlt] = useState("");
  const [isFullscreen, setIsFullscreen] = useState(false);

  const visualEditorRef = useRef<HTMLDivElement>(null);

  // Sync initial content on mount or change
  useEffect(() => {
    setTitle(initialTitle);
    setContentHtml(initialContent);
    if (visualEditorRef.current) {
      visualEditorRef.current.innerHTML = initialContent;
    }
  }, [initialTitle, initialContent]);

  // Generate slug automatically from title if empty
  const handleTitleChange = (val: string) => {
    setTitle(val);
    if (!slug || slug === "new-page" || slug === "new-post") {
      const generated = val
        .toLowerCase()
        .replace(/[^\w\s-]/g, "")
        .trim()
        .replace(/\s+/g, "-");
      setSlug(generated);
    }
    if (!metaTitle) {
      setMetaTitle(val);
    }
  };

  // Format command execution
  const executeCommand = (command: string, value: string | undefined = undefined) => {
    if (editorMode === "html") return;
    document.execCommand(command, false, value);
    if (visualEditorRef.current) {
      setContentHtml(visualEditorRef.current.innerHTML);
    }
  };

  // Sync visual changes back to state
  const handleVisualInput = () => {
    if (visualEditorRef.current) {
      setContentHtml(visualEditorRef.current.innerHTML);
    }
  };

  // Switch between Visual & HTML Text mode
  const handleSwitchMode = (mode: "visual" | "html") => {
    if (mode === "visual" && visualEditorRef.current) {
      visualEditorRef.current.innerHTML = contentHtml;
    }
    setEditorMode(mode);
  };

  // Insert Link
  const handleInsertLink = () => {
    if (!linkUrl) return;
    const finalUrl = linkUrl.startsWith("http") || linkUrl.startsWith("/") ? linkUrl : `https://${linkUrl}`;
    if (editorMode === "visual") {
      executeCommand("createLink", finalUrl);
    } else {
      const textToWrap = linkText || "link";
      const snippet = `<a href="${finalUrl}" target="_blank" rel="noopener noreferrer">${textToWrap}</a>`;
      setContentHtml((prev) => prev + snippet);
    }
    setShowLinkModal(false);
    setLinkUrl("");
    setLinkText("");
  };

  // Insert Image
  const handleInsertImage = () => {
    if (!imageUrl) return;
    if (editorMode === "visual") {
      executeCommand("insertImage", imageUrl);
    } else {
      const snippet = `<img src="${imageUrl}" alt="${imageAlt || "Document illustration"}" class="rounded-xl shadow-md my-4 max-w-full h-auto" />`;
      setContentHtml((prev) => prev + snippet);
    }
    setShowImageModal(false);
    setImageUrl("");
    setImageAlt("");
  };

  // Insert Table
  const handleInsertTable = () => {
    const tableHtml = `
      <table class="w-full my-4 border-collapse border border-slate-300">
        <thead>
          <tr class="bg-slate-100">
            <th class="border border-slate-300 p-2 text-left font-bold">Feature</th>
            <th class="border border-slate-300 p-2 text-left font-bold">Specification</th>
            <th class="border border-slate-300 p-2 text-left font-bold">Details</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td class="border border-slate-300 p-2">Direct Extraction</td>
            <td class="border border-slate-300 p-2">High Resolution Vector</td>
            <td class="border border-slate-300 p-2">Instant download ready</td>
          </tr>
          <tr>
            <td class="border border-slate-300 p-2">Format Support</td>
            <td class="border border-slate-300 p-2">PDF / Images</td>
            <td class="border border-slate-300 p-2">Lossless quality compile</td>
          </tr>
        </tbody>
      </table>
    `;
    if (editorMode === "visual") {
      executeCommand("insertHTML", tableHtml);
    } else {
      setContentHtml((prev) => prev + tableHtml);
    }
  };

  // Word count & reading time
  const plainText = contentHtml.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
  const wordCount = plainText ? plainText.split(" ").filter(Boolean).length : 0;
  const charCount = plainText.length;
  const readTime = Math.max(1, Math.ceil(wordCount / 200));

  // Save handler with safe error handling
  const handleSaveAction = async (forcedStatus?: "published" | "draft") => {
    const saveStatus = forcedStatus || status;
    setSaving(true);
    setSaveSuccess(null);
    setErrorMessage(null);

    // Sync visual editor if in visual mode
    let finalHtml = contentHtml;
    if (editorMode === "visual" && visualEditorRef.current) {
      finalHtml = visualEditorRef.current.innerHTML;
      setContentHtml(finalHtml);
    }

    try {
      await onSave({
        title: title.trim() || "Untitled Document",
        content: plainText,
        htmlContent: finalHtml,
        status: saveStatus,
        language: activeLang,
        metadata: {
          ...initialMetadata,
          slug: slug.trim(),
          subtitle: initialMetadata.subtitle || "",
          excerpt: excerpt.trim(),
          status: saveStatus,
          category,
          tags,
          author,
          featuredImage,
          metaTitle: metaTitle || title,
          metaDescription: metaDescription || excerpt,
          canonicalUrl,
          noindex,
          translationGroupId: initialMetadata.translationGroupId || `group-${slug || Date.now()}`,
        },
      });

      setStatus(saveStatus);
      setSaveSuccess(
        `Successfully saved [${activeLang.toUpperCase()}] ${entityType === "page" ? "Page" : "Post"}!`
      );
      setTimeout(() => setSaveSuccess(null), 3500);
    } catch (err: any) {
      setErrorMessage(err.message || "Failed to save document. Please verify connection.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className={`space-y-4 ${isFullscreen ? "fixed inset-0 z-50 bg-slate-100 p-6 overflow-y-auto" : ""}`}>
      {/* Top Header & Action Bar */}
      <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onBack}
            className="p-2 rounded-lg hover:bg-slate-100 text-slate-600 transition cursor-pointer"
            title="Return to list"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200">
                Classic Editor
              </span>
              <span className="text-xs text-slate-500 font-medium">
                Editing {entityType === "page" ? "Page" : entityType === "homepage" ? "Homepage" : "Blog Post"}
              </span>
            </div>
            <h1 className="text-lg font-bold text-slate-900 tracking-tight mt-0.5 truncate max-w-md sm:max-w-xl">
              {title || "Untitled Document"}
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {saveSuccess && (
            <span className="text-xs text-emerald-600 font-bold flex items-center gap-1 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200">
              <CheckCircle2 className="w-3.5 h-3.5" />
              {saveSuccess}
            </span>
          )}

          {errorMessage && (
            <span className="text-xs text-rose-600 font-bold flex items-center gap-1 bg-rose-50 px-2.5 py-1 rounded-md border border-rose-200">
              <AlertCircle className="w-3.5 h-3.5" />
              {errorMessage}
            </span>
          )}

          {onPreview && (
            <button
              type="button"
              onClick={() => onPreview(slug, activeLang)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold transition cursor-pointer"
            >
              <Eye className="w-3.5 h-3.5 text-slate-500" />
              <span>Preview</span>
            </button>
          )}

          <button
            type="button"
            onClick={() => handleSaveAction("draft")}
            disabled={saving}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold transition cursor-pointer disabled:opacity-50"
          >
            <span>Save Draft</span>
          </button>

          <button
            type="button"
            onClick={() => handleSaveAction("published")}
            disabled={saving}
            className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-xs transition cursor-pointer disabled:opacity-50"
          >
            {saving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
            <span>{status === "published" ? "Update" : "Publish"}</span>
          </button>

          <button
            type="button"
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-500 transition cursor-pointer hidden md:block"
            title={isFullscreen ? "Exit Fullscreen" : "Fullscreen"}
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Multilingual Polylang Switcher */}
      <div className="bg-white rounded-xl border border-slate-200 p-2.5 shadow-xs flex items-center gap-2 overflow-x-auto">
        <Globe className="w-4 h-4 text-emerald-600 shrink-0 ml-1" />
        <span className="text-xs font-bold text-slate-700 whitespace-nowrap">Editing Language:</span>
        <div className="flex items-center gap-1.5">
          {availableLanguages.map((lang) => (
            <button
              key={lang.code}
              type="button"
              onClick={() => setActiveLang(lang.code)}
              className={`px-2.5 py-1 rounded-md text-xs font-semibold flex items-center gap-1.5 transition whitespace-nowrap cursor-pointer ${
                activeLang === lang.code
                  ? "bg-slate-900 text-white shadow-xs"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              <span>{lang.flag}</span>
              <span>{lang.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Main Grid: Left Editor + Right Settings Sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left Column: Classic Title, Toolbar, Visual/HTML Area */}
        <div className="lg:col-span-8 space-y-4">
          {/* Document Title Input */}
          <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs">
            <input
              type="text"
              value={title}
              onChange={(e) => handleTitleChange(e.target.value)}
              placeholder="Enter document title here..."
              className="w-full text-xl sm:text-2xl font-bold text-slate-900 placeholder:text-slate-400 border-none outline-none focus:ring-0 px-1 py-1"
            />
            {/* Permalink preview */}
            <div className="mt-2 pt-2 border-t border-slate-100 flex items-center gap-2 text-xs text-slate-500 font-mono">
              <span className="font-semibold text-slate-400">Permalink:</span>
              <span>
                {typeof window !== "undefined" ? window.location.origin : "https://scribddownloader.org"}/
                {activeLang !== "en" ? `${activeLang}/` : ""}
              </span>
              <input
                type="text"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                className="font-mono text-emerald-700 bg-emerald-50/50 hover:bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 outline-none focus:border-emerald-500 text-xs"
              />
            </div>
          </div>

          {/* Classic WYSIWYG Box */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden flex flex-col">
            {/* Top Toolbar Strip: Visual vs HTML Switcher + Add Media */}
            <div className="bg-slate-50 px-3 py-2 border-b border-slate-200 flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    if (onOpenMediaSelector) {
                      onOpenMediaSelector((url) => {
                        setImageUrl(url);
                        setShowImageModal(true);
                      });
                    } else {
                      setShowImageModal(true);
                    }
                  }}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 text-xs font-bold shadow-xs transition cursor-pointer"
                >
                  <ImageIcon className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Add Media</span>
                </button>
              </div>

              {/* Mode Toggle: Visual vs HTML Code */}
              <div className="flex items-center bg-slate-200/80 p-0.5 rounded-lg">
                <button
                  type="button"
                  onClick={() => handleSwitchMode("visual")}
                  className={`px-3 py-1 rounded-md text-xs font-bold transition cursor-pointer ${
                    editorMode === "visual"
                      ? "bg-white text-slate-900 shadow-xs"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  Visual
                </button>
                <button
                  type="button"
                  onClick={() => handleSwitchMode("html")}
                  className={`px-3 py-1 rounded-md text-xs font-bold transition cursor-pointer flex items-center gap-1 ${
                    editorMode === "html"
                      ? "bg-white text-slate-900 shadow-xs"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  <FileCode className="w-3 h-3" />
                  <span>HTML</span>
                </button>
              </div>
            </div>

            {/* Classic Formatting Toolbar (Visible in Visual Mode) */}
            {editorMode === "visual" && (
              <div className="bg-white px-3 py-2 border-b border-slate-100 flex flex-wrap items-center gap-1 text-slate-700 select-none">
                {/* Heading Dropdown */}
                <select
                  onChange={(e) => {
                    if (e.target.value) {
                      executeCommand("formatBlock", e.target.value);
                      e.target.value = "";
                    }
                  }}
                  defaultValue=""
                  className="text-xs font-medium bg-slate-50 border border-slate-200 rounded px-2 py-1 outline-none text-slate-700 cursor-pointer"
                >
                  <option value="" disabled>
                    Paragraph
                  </option>
                  <option value="<p>">Normal Paragraph</option>
                  <option value="<h1>">Heading 1</option>
                  <option value="<h2>">Heading 2</option>
                  <option value="<h3>">Heading 3</option>
                  <option value="<h4>">Heading 4</option>
                  <option value="<blockquote>">Blockquote</option>
                  <option value="<pre>">Code Block</option>
                </select>

                <div className="h-4 w-[1px] bg-slate-200 mx-1" />

                {/* Bold, Italic, Underline, Strikethrough */}
                <button
                  type="button"
                  onClick={() => executeCommand("bold")}
                  className="p-1.5 rounded hover:bg-slate-100 text-slate-700 transition"
                  title="Bold (Ctrl+B)"
                >
                  <Bold className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => executeCommand("italic")}
                  className="p-1.5 rounded hover:bg-slate-100 text-slate-700 transition"
                  title="Italic (Ctrl+I)"
                >
                  <Italic className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => executeCommand("underline")}
                  className="p-1.5 rounded hover:bg-slate-100 text-slate-700 transition"
                  title="Underline (Ctrl+U)"
                >
                  <Underline className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => executeCommand("strikeThrough")}
                  className="p-1.5 rounded hover:bg-slate-100 text-slate-700 transition"
                  title="Strikethrough"
                >
                  <Strikethrough className="w-4 h-4" />
                </button>

                <div className="h-4 w-[1px] bg-slate-200 mx-1" />

                {/* Alignment */}
                <button
                  type="button"
                  onClick={() => executeCommand("justifyLeft")}
                  className="p-1.5 rounded hover:bg-slate-100 text-slate-700 transition"
                  title="Align Left"
                >
                  <AlignLeft className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => executeCommand("justifyCenter")}
                  className="p-1.5 rounded hover:bg-slate-100 text-slate-700 transition"
                  title="Align Center"
                >
                  <AlignCenter className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => executeCommand("justifyRight")}
                  className="p-1.5 rounded hover:bg-slate-100 text-slate-700 transition"
                  title="Align Right"
                >
                  <AlignRight className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => executeCommand("justifyFull")}
                  className="p-1.5 rounded hover:bg-slate-100 text-slate-700 transition"
                  title="Justify"
                >
                  <AlignJustify className="w-4 h-4" />
                </button>

                <div className="h-4 w-[1px] bg-slate-200 mx-1" />

                {/* Lists & Quote */}
                <button
                  type="button"
                  onClick={() => executeCommand("insertUnorderedList")}
                  className="p-1.5 rounded hover:bg-slate-100 text-slate-700 transition"
                  title="Bulleted List"
                >
                  <List className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => executeCommand("insertOrderedList")}
                  className="p-1.5 rounded hover:bg-slate-100 text-slate-700 transition"
                  title="Numbered List"
                >
                  <ListOrdered className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => executeCommand("formatBlock", "<blockquote>")}
                  className="p-1.5 rounded hover:bg-slate-100 text-slate-700 transition"
                  title="Blockquote"
                >
                  <Quote className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => executeCommand("insertHorizontalRule")}
                  className="p-1.5 rounded hover:bg-slate-100 text-slate-700 transition"
                  title="Horizontal Line"
                >
                  <Minus className="w-4 h-4" />
                </button>

                <div className="h-4 w-[1px] bg-slate-200 mx-1" />

                {/* Links, Table, Media */}
                <button
                  type="button"
                  onClick={() => setShowLinkModal(true)}
                  className="p-1.5 rounded hover:bg-slate-100 text-slate-700 transition"
                  title="Insert / Edit Link"
                >
                  <LinkIcon className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={handleInsertTable}
                  className="p-1.5 rounded hover:bg-slate-100 text-slate-700 transition"
                  title="Insert Table"
                >
                  <TableIcon className="w-4 h-4" />
                </button>

                <div className="h-4 w-[1px] bg-slate-200 mx-1" />

                {/* Undo / Redo */}
                <button
                  type="button"
                  onClick={() => executeCommand("undo")}
                  className="p-1.5 rounded hover:bg-slate-100 text-slate-700 transition"
                  title="Undo"
                >
                  <Undo2 className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => executeCommand("redo")}
                  className="p-1.5 rounded hover:bg-slate-100 text-slate-700 transition"
                  title="Redo"
                >
                  <Redo2 className="w-4 h-4" />
                </button>
              </div>
            )}

            {/* Editable Content Workspace */}
            <div className="relative min-h-[480px] p-5">
              {editorMode === "visual" ? (
                <div
                  ref={visualEditorRef}
                  contentEditable
                  onInput={handleVisualInput}
                  className="outline-none min-h-[440px] prose prose-slate max-w-none focus:ring-0 leading-relaxed text-slate-800 text-sm sm:text-base"
                />
              ) : (
                <textarea
                  value={contentHtml}
                  onChange={(e) => setContentHtml(e.target.value)}
                  placeholder="Enter standard HTML / content code here..."
                  className="w-full h-full min-h-[440px] font-mono text-xs sm:text-sm text-slate-900 bg-slate-50/50 p-3 rounded-lg border border-slate-200 outline-none focus:border-emerald-500 focus:bg-white resize-y leading-relaxed"
                />
              )}
            </div>

            {/* Bottom Status Bar */}
            <div className="bg-slate-50 px-4 py-2 border-t border-slate-200 flex flex-wrap items-center justify-between text-xs text-slate-500">
              <div className="flex items-center gap-4">
                <span>
                  Words: <strong className="text-slate-700">{wordCount}</strong>
                </span>
                <span>
                  Characters: <strong className="text-slate-700">{charCount}</strong>
                </span>
                <span>
                  Est. Read: <strong className="text-slate-700">{readTime} min</strong>
                </span>
              </div>
              <div className="text-[11px] text-slate-400">
                Mode: <span className="font-semibold uppercase text-slate-600">{editorMode}</span>
              </div>
            </div>
          </div>

          {/* Excerpt Box */}
          <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs space-y-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">
              Excerpt / Summary
            </h3>
            <textarea
              value={excerpt}
              onChange={(e) => setExcerpt(e.target.value)}
              placeholder="Write an excerpt (optional). If empty, the first few sentences will be used automatically."
              rows={2}
              className="w-full text-xs text-slate-800 border border-slate-200 rounded-lg p-2.5 outline-none focus:border-emerald-500"
            />
          </div>
        </div>

        {/* Right Sidebar: Publish, Categories, Featured Image, SEO */}
        <div className="lg:col-span-4 space-y-4">
          {/* 1. Publish Box */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-4 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900">
                Publish Status
              </h3>
              <span
                className={`text-[11px] font-bold px-2 py-0.5 rounded-full border ${
                  status === "published"
                    ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                    : "bg-amber-50 text-amber-700 border-amber-200"
                }`}
              >
                {status === "published" ? "Published" : "Draft"}
              </span>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="text-slate-500 font-medium block mb-1">Status:</label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as "published" | "draft")}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs font-semibold text-slate-800 outline-none cursor-pointer"
                >
                  <option value="published">Published</option>
                  <option value="draft">Draft</option>
                </select>
              </div>

              <div>
                <label className="text-slate-500 font-medium block mb-1">Author:</label>
                <input
                  type="text"
                  value={author}
                  onChange={(e) => setAuthor(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs text-slate-800 outline-none"
                />
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
              <button
                type="button"
                onClick={() => handleSaveAction("draft")}
                disabled={saving}
                className="w-full py-2 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold transition cursor-pointer disabled:opacity-50"
              >
                Save Draft
              </button>
              <button
                type="button"
                onClick={() => handleSaveAction("published")}
                disabled={saving}
                className="w-full py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-xs transition cursor-pointer disabled:opacity-50 flex items-center justify-center gap-1.5"
              >
                {saving && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                <span>{status === "published" ? "Update" : "Publish"}</span>
              </button>
            </div>
          </div>

          {/* 2. Categories & Tags (For Blog Posts) */}
          {entityType === "post" && (
            <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-4 space-y-4">
              <div className="border-b border-slate-100 pb-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900">
                  Categories & Tags
                </h3>
              </div>

              <div className="space-y-3 text-xs">
                <div>
                  <label className="text-slate-500 font-medium block mb-1">Category:</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs font-semibold text-slate-800 outline-none cursor-pointer"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.name}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-slate-500 font-medium block mb-1">
                    Tags (comma separated):
                  </label>
                  <input
                    type="text"
                    value={tags}
                    onChange={(e) => setTags(e.target.value)}
                    placeholder="Scribd, PDF, Downloader, Guide"
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs text-slate-800 outline-none"
                  />
                </div>
              </div>
            </div>
          )}

          {/* 3. Featured Image */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-4 space-y-3">
            <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900">
                Featured Image
              </h3>
              {featuredImage && (
                <button
                  type="button"
                  onClick={() => setFeaturedImage("")}
                  className="text-[11px] text-rose-600 hover:underline"
                >
                  Remove
                </button>
              )}
            </div>

            {featuredImage ? (
              <div className="space-y-2">
                <img
                  src={featuredImage}
                  alt="Featured"
                  className="w-full h-36 object-cover rounded-lg border border-slate-200"
                />
                <button
                  type="button"
                  onClick={() => setShowImageModal(true)}
                  className="w-full py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-xs text-slate-700 font-medium transition cursor-pointer"
                >
                  Replace Image
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setShowImageModal(true)}
                className="w-full h-28 border-2 border-dashed border-slate-200 hover:border-emerald-500 rounded-lg flex flex-col items-center justify-center gap-1 text-slate-500 hover:text-emerald-700 transition cursor-pointer bg-slate-50/50"
              >
                <ImageIcon className="w-6 h-6" />
                <span className="text-xs font-semibold">Set Featured Image</span>
              </button>
            )}
          </div>

          {/* 4. SEO & Meta Controls */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-4 space-y-4">
            <div className="border-b border-slate-100 pb-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 flex items-center gap-1.5">
                <Search className="w-3.5 h-3.5 text-emerald-600" />
                <span>SEO & Search Snippet</span>
              </h3>
            </div>

            {/* Google Search Snippet Preview */}
            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 space-y-1">
              <div className="text-[11px] text-slate-500 font-mono truncate">
                https://scribddownloader.org/{activeLang !== "en" ? `${activeLang}/` : ""}{slug || "document"}
              </div>
              <div className="text-sm font-semibold text-blue-700 hover:underline truncate">
                {metaTitle || title || "Document Title"}
              </div>
              <div className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                {metaDescription || excerpt || "No description set yet. Search engines will display an auto-generated summary."}
              </div>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="text-slate-600 font-medium block mb-1">SEO Meta Title:</label>
                <input
                  type="text"
                  value={metaTitle}
                  onChange={(e) => setMetaTitle(e.target.value)}
                  placeholder={title || "SEO Meta Title"}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs text-slate-800 outline-none"
                />
              </div>

              <div>
                <label className="text-slate-600 font-medium block mb-1">SEO Meta Description:</label>
                <textarea
                  value={metaDescription}
                  onChange={(e) => setMetaDescription(e.target.value)}
                  placeholder={excerpt || "Search description (140-160 characters)"}
                  rows={2}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs text-slate-800 outline-none"
                />
              </div>

              <div>
                <label className="text-slate-600 font-medium block mb-1">Canonical URL:</label>
                <input
                  type="text"
                  value={canonicalUrl}
                  onChange={(e) => setCanonicalUrl(e.target.value)}
                  placeholder="https://scribddownloader.org/..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs text-slate-800 outline-none"
                />
              </div>

              <div className="pt-2 flex items-center gap-2">
                <input
                  type="checkbox"
                  id="noindex-check"
                  checked={noindex}
                  onChange={(e) => setNoindex(e.target.checked)}
                  className="rounded text-emerald-600 focus:ring-emerald-500 cursor-pointer"
                />
                <label htmlFor="noindex-check" className="text-slate-700 font-medium cursor-pointer">
                  Disallow search indexing (noindex)
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal: Insert Link */}
      {showLinkModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xl max-w-md w-full p-5 space-y-4">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <LinkIcon className="w-4 h-4 text-emerald-600" />
              <span>Insert / Edit Link</span>
            </h3>

            <div className="space-y-3 text-xs">
              <div>
                <label className="text-slate-600 font-medium block mb-1">Destination URL:</label>
                <input
                  type="text"
                  value={linkUrl}
                  onChange={(e) => setLinkUrl(e.target.value)}
                  placeholder="https://example.com or /about"
                  className="w-full border border-slate-200 rounded-lg p-2.5 outline-none focus:border-emerald-500"
                />
              </div>

              {editorMode === "html" && (
                <div>
                  <label className="text-slate-600 font-medium block mb-1">Link Anchor Text:</label>
                  <input
                    type="text"
                    value={linkText}
                    onChange={(e) => setLinkText(e.target.value)}
                    placeholder="Click here"
                    className="w-full border border-slate-200 rounded-lg p-2.5 outline-none focus:border-emerald-500"
                  />
                </div>
              )}
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setShowLinkModal(false)}
                className="px-3 py-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 text-xs font-medium cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleInsertLink}
                className="px-4 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition cursor-pointer"
              >
                Insert Link
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Insert / Set Image */}
      {showImageModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xl max-w-md w-full p-5 space-y-4">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <ImageIcon className="w-4 h-4 text-emerald-600" />
              <span>Insert Image</span>
            </h3>

            <div className="space-y-3 text-xs">
              <div>
                <label className="text-slate-600 font-medium block mb-1">Image URL:</label>
                <input
                  type="text"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="https://images.unsplash.com/... or /images/..."
                  className="w-full border border-slate-200 rounded-lg p-2.5 outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="text-slate-600 font-medium block mb-1">Alt Text (Accessibility & SEO):</label>
                <input
                  type="text"
                  value={imageAlt}
                  onChange={(e) => setImageAlt(e.target.value)}
                  placeholder="Descriptive image caption"
                  className="w-full border border-slate-200 rounded-lg p-2.5 outline-none focus:border-emerald-500"
                />
              </div>

              {imageUrl && (
                <div className="p-2 border border-slate-200 rounded-lg bg-slate-50">
                  <span className="text-[11px] text-slate-500 font-medium block mb-1">Preview:</span>
                  <img src={imageUrl} alt="Preview" className="h-28 object-cover rounded max-w-full" />
                </div>
              )}
            </div>

            <div className="flex items-center justify-between gap-2 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => {
                  setFeaturedImage(imageUrl);
                  setShowImageModal(false);
                }}
                className="text-xs text-emerald-700 hover:underline font-semibold"
              >
                Set as Featured Image
              </button>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setShowImageModal(false)}
                  className="px-3 py-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 text-xs font-medium cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleInsertImage}
                  className="px-4 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition cursor-pointer"
                >
                  Insert Into Content
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
