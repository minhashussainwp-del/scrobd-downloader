import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  Plus,
  Undo2,
  Redo2,
  ListTree,
  Search,
  Monitor,
  Tablet,
  Smartphone,
  Settings,
  Eye,
  Save,
  Loader2,
  CheckCircle2,
  AlertCircle,
  Code2,
  Sparkles,
  Globe,
  Share2,
  ExternalLink,
  ChevronDown,
  X,
  History,
  Image as ImageIcon,
  Check,
  Calendar,
  Layers,
  FileText,
} from "lucide-react";
import { GutenbergEditorBlock, BlockType, DocumentStats } from "./types";
import {
  parseContentToBlocks,
  serializeBlocksToHtml,
  serializeBlocksToMarkdown,
} from "./gutenbergConverter";
import { GutenbergBlockItem } from "./GutenbergBlockItem";
import { GutenbergInserter } from "./GutenbergInserter";
import { GutenbergListView } from "./GutenbergListView";
import { GUTENBERG_PATTERNS } from "./GutenbergPatterns";

interface GutenbergEditorProps {
  initialTitle: string;
  initialContent?: string;
  initialBlocks?: any[];
  initialMetadata?: any;
  targetLang?: string;
  availableLanguages?: Array<{ code: string; name: string; flag: string }>;
  onSave: (payload: {
    title: string;
    content: string;
    htmlContent: string;
    blocks: GutenbergEditorBlock[];
    metadata: any;
    status: "published" | "draft";
    language: string;
  }) => Promise<void>;
  onBack: () => void;
  onPreview?: (slug: string, lang: string) => void;
  entityType?: "page" | "post";
}

export function GutenbergEditor({
  initialTitle,
  initialContent = "",
  initialBlocks,
  initialMetadata = {},
  targetLang = "en",
  availableLanguages = [
    { code: "en", name: "English", flag: "🇺🇸" },
    { code: "id", name: "Indonesian", flag: "🇮🇩" },
    { code: "hi", name: "Hindi", flag: "🇮🇳" },
    { code: "es", name: "Spanish", flag: "🇲🇽" },
    { code: "fr", name: "French", flag: "🇫🇷" },
    { code: "nl", name: "Dutch", flag: "🇳🇱" },
    { code: "ur", name: "Urdu", flag: "🇵🇰" },
  ],
  onSave,
  onBack,
  onPreview,
  entityType = "post",
}: GutenbergEditorProps) {
  // Document state
  const [title, setTitle] = useState(initialTitle || "");
  const [blocks, setBlocks] = useState<GutenbergEditorBlock[]>(() =>
    parseContentToBlocks(initialContent, initialBlocks)
  );
  const [selectedBlockId, setSelectedBlockId] = useState<string | null>(null);
  const [activeLang, setActiveLang] = useState<string>(targetLang || initialMetadata?.language || "en");

  // Metadata state
  const [metadata, setMetadata] = useState<any>({
    slug: initialMetadata?.slug || "",
    excerpt: initialMetadata?.excerpt || "",
    category: initialMetadata?.category || "Guides",
    tags: Array.isArray(initialMetadata?.tags) ? initialMetadata.tags.join(", ") : initialMetadata?.tags || "Scribd, PDF",
    status: initialMetadata?.status || "published",
    author: initialMetadata?.author?.name || initialMetadata?.authorName || initialMetadata?.author || "Minhas Hussain",
    featuredImage: initialMetadata?.image || initialMetadata?.featuredImage || "",
    metaTitle: initialMetadata?.metaTitle || initialTitle || "",
    metaDescription: initialMetadata?.metaDescription || initialMetadata?.excerpt || "",
    canonicalUrl: initialMetadata?.canonicalUrl || "",
    noindex: initialMetadata?.noindex || false,
    translationGroupId: initialMetadata?.translationGroupId || `group-${entityType}-${Date.now()}`,
    ...initialMetadata,
  });

  // UI state
  const [viewMode, setViewMode] = useState<"desktop" | "tablet" | "mobile">("desktop");
  const [editorMode, setEditorMode] = useState<"visual" | "code">("visual");
  const [showInserter, setShowInserter] = useState(false);
  const [showListView, setShowListView] = useState(false);
  const [showSidebar, setShowSidebar] = useState(true);
  const [sidebarTab, setSidebarTab] = useState<"document" | "block">("document");
  const [showFindReplace, setShowFindReplace] = useState(false);
  const [findQuery, setFindQuery] = useState("");
  const [replaceQuery, setReplaceQuery] = useState("");
  const [previewModalOpen, setPreviewModalOpen] = useState(false);

  // Status & History
  const [saving, setSaving] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string>("Saved");
  const [historyStack, setHistoryStack] = useState<GutenbergEditorBlock[][]>([]);
  const [redoStack, setRedoStack] = useState<GutenbergEditorBlock[][]>([]);

  // Slash command quick picker
  const [slashMenu, setSlashMenu] = useState<{ open: boolean; top: number; left: number } | null>(null);

  // Sync if initial content changes externally
  useEffect(() => {
    if (initialTitle && !title) setTitle(initialTitle);
    if (initialContent || initialBlocks) {
      const parsed = parseContentToBlocks(initialContent, initialBlocks);
      if (parsed.length > 0) setBlocks(parsed);
    }
  }, [initialContent, initialBlocks, initialTitle]);

  // Compute stats
  const calculateStats = useCallback((): DocumentStats => {
    const fullText = blocks.map((b) => b.content).join(" ");
    const words = fullText.trim().split(/\s+/).filter(Boolean).length;
    const characters = fullText.length;
    const readingTimeMin = Math.max(1, Math.ceil(words / 200));
    const headingsCount = blocks.filter((b) => b.type === "heading").length;
    const paragraphsCount = blocks.filter((b) => b.type === "paragraph").length;
    const imagesCount = blocks.filter((b) => b.type === "image").length;

    return {
      words,
      characters,
      readingTimeMin,
      headingsCount,
      paragraphsCount,
      imagesCount,
      blocksCount: blocks.length,
    };
  }, [blocks]);

  const stats = calculateStats();

  // History helpers
  const pushHistory = (newBlocks: GutenbergEditorBlock[]) => {
    setHistoryStack((prev) => [...prev.slice(-20), blocks]);
    setRedoStack([]);
    setBlocks(newBlocks);
    setStatusMessage("Unsaved changes");
  };

  const handleUndo = () => {
    if (historyStack.length === 0) return;
    const prev = historyStack[historyStack.length - 1];
    setRedoStack((r) => [blocks, ...r]);
    setHistoryStack((h) => h.slice(0, -1));
    setBlocks(prev);
    setStatusMessage("Unsaved changes");
  };

  const handleRedo = () => {
    if (redoStack.length === 0) return;
    const next = redoStack[0];
    setRedoStack((r) => r.slice(1));
    setHistoryStack((h) => [...h, blocks]);
    setBlocks(next);
    setStatusMessage("Unsaved changes");
  };

  // Block manipulations
  const handleUpdateBlock = (id: string, updated: Partial<GutenbergEditorBlock>) => {
    const next = blocks.map((b) => (b.id === id ? { ...b, ...updated } : b));
    pushHistory(next);
  };

  const handleDuplicateBlock = (id: string) => {
    const idx = blocks.findIndex((b) => b.id === id);
    if (idx === -1) return;
    const original = blocks[idx];
    const clone: GutenbergEditorBlock = {
      ...original,
      id: "b-" + Math.random().toString(36).substring(2, 9),
    };
    const next = [...blocks.slice(0, idx + 1), clone, ...blocks.slice(idx + 1)];
    pushHistory(next);
    setSelectedBlockId(clone.id);
  };

  const handleDeleteBlock = (id: string) => {
    if (blocks.length <= 1) {
      // Keep at least one empty paragraph
      const reset: GutenbergEditorBlock[] = [
        {
          id: "b-" + Math.random().toString(36).substring(2, 9),
          type: "paragraph",
          content: "",
        },
      ];
      pushHistory(reset);
      setSelectedBlockId(reset[0].id);
      return;
    }
    const next = blocks.filter((b) => b.id !== id);
    pushHistory(next);
    setSelectedBlockId(null);
  };

  const handleMoveUp = (idx: number) => {
    if (idx <= 0) return;
    const next = [...blocks];
    const temp = next[idx - 1];
    next[idx - 1] = next[idx];
    next[idx] = temp;
    pushHistory(next);
  };

  const handleMoveDown = (idx: number) => {
    if (idx >= blocks.length - 1) return;
    const next = [...blocks];
    const temp = next[idx + 1];
    next[idx + 1] = next[idx];
    next[idx] = temp;
    pushHistory(next);
  };

  const handleAddBlockAt = (index: number, type: BlockType = "paragraph", extra: any = {}) => {
    const newBlock: GutenbergEditorBlock = {
      id: "b-" + Math.random().toString(36).substring(2, 9),
      type,
      content: "",
      textAlign: "left",
      ...extra,
    };
    const next = [...blocks.slice(0, index), newBlock, ...blocks.slice(index)];
    pushHistory(next);
    setSelectedBlockId(newBlock.id);
  };

  const handleInsertPattern = (patternId: string) => {
    const pattern = GUTENBERG_PATTERNS.find((p) => p.id === patternId);
    if (!pattern) return;
    const newBlocks: GutenbergEditorBlock[] = pattern.blocks.map((b) => ({
      ...b,
      id: "b-" + Math.random().toString(36).substring(2, 9),
    }));
    pushHistory([...blocks, ...newBlocks]);
  };

  // Find & Replace
  const handleReplaceAll = () => {
    if (!findQuery) return;
    const next = blocks.map((b) => ({
      ...b,
      content: b.content ? b.content.split(findQuery).join(replaceQuery) : b.content,
    }));
    pushHistory(next);
  };

  // Save handler
  const handleSave = async (statusOverride?: "published" | "draft") => {
    setSaving(true);
    setStatusMessage("Saving...");
    try {
      const targetStatus = statusOverride || metadata.status;
      const htmlContent = serializeBlocksToHtml(blocks);
      const markdownContent = serializeBlocksToMarkdown(blocks);

      const tagsArray = typeof metadata.tags === "string"
        ? metadata.tags.split(",").map((t: string) => t.trim()).filter(Boolean)
        : metadata.tags;

      await onSave({
        title,
        content: markdownContent,
        htmlContent,
        blocks,
        metadata: {
          ...metadata,
          tags: tagsArray,
        },
        status: targetStatus,
        language: activeLang,
      });

      setStatusMessage("Saved");
      setMetadata((prev: any) => ({ ...prev, status: targetStatus }));
    } catch (err: any) {
      setStatusMessage("Save failed: " + (err.message || "Network error"));
    } finally {
      setSaving(false);
    }
  };

  const selectedBlock = blocks.find((b) => b.id === selectedBlockId) || null;

  return (
    <div className="flex flex-col h-[calc(100vh-60px)] bg-slate-100 text-slate-800 antialiased select-none">
      {/* 1. TOP HEADER TOOLBAR */}
      <header className="h-14 bg-white border-b border-slate-200 px-4 flex items-center justify-between shrink-0 z-30 shadow-2xs">
        {/* Left tools */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onBack}
            className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-600 text-xs font-semibold flex items-center gap-1 transition cursor-pointer"
            title="Back to CMS list"
          >
            <span>← Back</span>
          </button>

          <div className="w-[1px] h-5 bg-slate-200 mx-1" />

          {/* Inserter (+) Toggle */}
          <button
            type="button"
            onClick={() => setShowInserter(!showInserter)}
            className={`p-2 rounded-lg transition flex items-center justify-center cursor-pointer ${
              showInserter ? "bg-slate-900 text-white" : "bg-indigo-600 hover:bg-indigo-700 text-white shadow-xs"
            }`}
            title="Toggle Block Inserter"
          >
            <Plus className="w-4 h-4" />
          </button>

          {/* Undo / Redo */}
          <button
            type="button"
            onClick={handleUndo}
            disabled={historyStack.length === 0}
            className="p-2 rounded-lg hover:bg-slate-100 text-slate-600 disabled:opacity-30 transition cursor-pointer"
            title="Undo (Ctrl+Z)"
          >
            <Undo2 className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={handleRedo}
            disabled={redoStack.length === 0}
            className="p-2 rounded-lg hover:bg-slate-100 text-slate-600 disabled:opacity-30 transition cursor-pointer"
            title="Redo (Ctrl+Y)"
          >
            <Redo2 className="w-4 h-4" />
          </button>

          {/* Document Overview / List View */}
          <button
            type="button"
            onClick={() => setShowListView(!showListView)}
            className={`p-2 rounded-lg hover:bg-slate-100 transition cursor-pointer ${
              showListView ? "bg-slate-200 text-slate-900 font-bold" : "text-slate-600"
            }`}
            title="Document Outline & List View"
          >
            <ListTree className="w-4 h-4" />
          </button>

          {/* Find & Replace */}
          <button
            type="button"
            onClick={() => setShowFindReplace(!showFindReplace)}
            className={`p-2 rounded-lg hover:bg-slate-100 transition cursor-pointer ${
              showFindReplace ? "bg-slate-200 text-slate-900" : "text-slate-600"
            }`}
            title="Find and Replace"
          >
            <Search className="w-4 h-4" />
          </button>

          {/* Status Indicator */}
          <div className="hidden md:flex items-center gap-1.5 text-xs text-slate-500 pl-2">
            {statusMessage === "Saving..." ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin text-indigo-600" />
            ) : statusMessage === "Saved" ? (
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            ) : (
              <AlertCircle className="w-3.5 h-3.5 text-amber-500" />
            )}
            <span>{statusMessage}</span>
          </div>
        </div>

        {/* Center: Viewport Toggle */}
        <div className="hidden lg:flex items-center gap-1 bg-slate-100 p-0.5 rounded-lg border border-slate-200">
          <button
            type="button"
            onClick={() => setViewMode("desktop")}
            className={`p-1.5 rounded-md transition cursor-pointer ${
              viewMode === "desktop" ? "bg-white text-slate-900 shadow-2xs font-bold" : "text-slate-500 hover:text-slate-900"
            }`}
            title="Desktop View (Full)"
          >
            <Monitor className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => setViewMode("tablet")}
            className={`p-1.5 rounded-md transition cursor-pointer ${
              viewMode === "tablet" ? "bg-white text-slate-900 shadow-2xs font-bold" : "text-slate-500 hover:text-slate-900"
            }`}
            title="Tablet View (768px)"
          >
            <Tablet className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => setViewMode("mobile")}
            className={`p-1.5 rounded-md transition cursor-pointer ${
              viewMode === "mobile" ? "bg-white text-slate-900 shadow-2xs font-bold" : "text-slate-500 hover:text-slate-900"
            }`}
            title="Mobile View (375px)"
          >
            <Smartphone className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Right actions: Preview, Save Draft, Publish, Settings */}
        <div className="flex items-center gap-2">
          {/* Visual vs Code Editor Toggle */}
          <button
            type="button"
            onClick={() => setEditorMode(editorMode === "visual" ? "code" : "visual")}
            className="hidden sm:inline-flex items-center gap-1 px-2.5 py-1 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-600 text-xs font-semibold transition cursor-pointer"
            title="Toggle Code / Visual Editor"
          >
            <Code2 className="w-3.5 h-3.5" />
            <span>{editorMode === "visual" ? "Code" : "Visual"}</span>
          </button>

          {/* Live Preview Modal Button */}
          <button
            type="button"
            onClick={() => setPreviewModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold transition cursor-pointer"
          >
            <Eye className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Preview</span>
          </button>

          {/* Save Draft */}
          <button
            type="button"
            onClick={() => handleSave("draft")}
            disabled={saving}
            className="px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold transition disabled:opacity-50 cursor-pointer"
          >
            Save Draft
          </button>

          {/* Publish / Update button */}
          <button
            type="button"
            onClick={() => handleSave("published")}
            disabled={saving}
            className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-xs transition disabled:opacity-50 cursor-pointer"
          >
            {saving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
            <span>{metadata.status === "published" ? "Update" : "Publish"}</span>
          </button>

          {/* Settings Sidebar Toggle */}
          <button
            type="button"
            onClick={() => setShowSidebar(!showSidebar)}
            className={`p-2 rounded-lg border border-slate-200 transition cursor-pointer ${
              showSidebar ? "bg-slate-100 text-slate-900 border-slate-300 font-bold" : "text-slate-600 hover:bg-slate-50"
            }`}
            title="Toggle Settings Sidebar"
          >
            <Settings className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* FIND & REPLACE BAR */}
      {showFindReplace && (
        <div className="bg-slate-50 border-b border-slate-200 px-6 py-2 flex flex-wrap items-center justify-between gap-3 text-xs z-20">
          <div className="flex items-center gap-2">
            <input
              type="text"
              placeholder="Find in document..."
              value={findQuery}
              onChange={(e) => setFindQuery(e.target.value)}
              className="px-3 py-1 rounded-md border border-slate-300 bg-white focus:outline-none w-48"
            />
            <input
              type="text"
              placeholder="Replace with..."
              value={replaceQuery}
              onChange={(e) => setReplaceQuery(e.target.value)}
              className="px-3 py-1 rounded-md border border-slate-300 bg-white focus:outline-none w-48"
            />
            <button
              type="button"
              onClick={handleReplaceAll}
              className="px-3 py-1 rounded-md bg-indigo-600 hover:bg-indigo-700 text-white font-semibold cursor-pointer"
            >
              Replace All
            </button>
          </div>
          <button
            type="button"
            onClick={() => setShowFindReplace(false)}
            className="text-slate-400 hover:text-slate-600 p-1"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* 2. MAIN WORKSPACE (CANVAS + DRAWERS + SIDEBAR) */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* Inserter Popover */}
        {showInserter && (
          <div className="absolute top-4 left-4 z-40">
            <GutenbergInserter
              onInsertBlock={(type) => {
                const insertIdx = selectedBlockId
                  ? blocks.findIndex((b) => b.id === selectedBlockId) + 1
                  : blocks.length;
                handleAddBlockAt(insertIdx, type);
                setShowInserter(false);
              }}
              onInsertPattern={(patternId) => {
                handleInsertPattern(patternId);
                setShowInserter(false);
              }}
              onClose={() => setShowInserter(false)}
            />
          </div>
        )}

        {/* List View & Outline Drawer */}
        {showListView && (
          <div className="absolute top-4 left-4 z-40">
            <GutenbergListView
              blocks={blocks}
              selectedBlockId={selectedBlockId}
              onSelectBlock={(id) => {
                setSelectedBlockId(id);
                setShowListView(false);
              }}
              onMoveUp={handleMoveUp}
              onMoveDown={handleMoveDown}
              onDelete={handleDeleteBlock}
              stats={stats}
              onClose={() => setShowListView(false)}
            />
          </div>
        )}

        {/* Central Writing Canvas */}
        <div
          className="flex-1 overflow-y-auto p-4 sm:p-8 flex justify-center cursor-text"
          onClick={() => setSelectedBlockId(null)}
        >
          <div
            className={`transition-all duration-300 ${
              viewMode === "mobile"
                ? "w-[375px] shadow-lg my-4 rounded-2xl border border-slate-300 bg-white"
                : viewMode === "tablet"
                ? "w-[768px] shadow-md my-4 rounded-2xl border border-slate-200 bg-white"
                : "w-full max-w-4xl"
            }`}
          >
            {/* Visual Editor Mode */}
            {editorMode === "visual" ? (
              <div
                className="bg-white min-h-[750px] p-6 sm:p-12 rounded-2xl border border-slate-200/80 shadow-2xs space-y-6"
                onClick={(e) => e.stopPropagation()}
              >
                {/* Document Title Input */}
                <div className="border-b border-slate-100 pb-6">
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => {
                      setTitle(e.target.value);
                      if (!metadata.slug) {
                        setMetadata((m: any) => ({
                          ...m,
                          slug: e.target.value
                            .toLowerCase()
                            .replace(/[^a-z0-9]+/g, "-")
                            .replace(/^-|-$/g, ""),
                        }));
                      }
                    }}
                    placeholder="Add title..."
                    className="w-full text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight border-none focus:outline-none placeholder-slate-300 leading-tight"
                  />
                </div>

                {/* Blocks Canvas */}
                <div className="space-y-4">
                  {blocks.map((block, idx) => (
                    <GutenbergBlockItem
                      key={block.id}
                      block={block}
                      isSelected={block.id === selectedBlockId}
                      onSelect={() => setSelectedBlockId(block.id)}
                      onUpdate={(updated) => handleUpdateBlock(block.id, updated)}
                      onDuplicate={() => handleDuplicateBlock(block.id)}
                      onDelete={() => handleDeleteBlock(block.id)}
                      onMoveUp={() => handleMoveUp(idx)}
                      onMoveDown={() => handleMoveDown(idx)}
                      onAddBefore={() => handleAddBlockAt(idx)}
                      onAddAfter={() => handleAddBlockAt(idx + 1)}
                      isFirst={idx === 0}
                      isLast={idx === blocks.length - 1}
                    />
                  ))}
                </div>

                {/* Bottom Canvas Add Block Trigger */}
                <div className="pt-8 text-center">
                  <button
                    type="button"
                    onClick={() => handleAddBlockAt(blocks.length, "paragraph")}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-50 hover:bg-indigo-50 border border-slate-200 hover:border-indigo-300 text-slate-600 hover:text-indigo-700 text-xs font-bold transition cursor-pointer shadow-2xs"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add Block</span>
                  </button>
                </div>
              </div>
            ) : (
              /* Code Editor Mode (Direct HTML/Markdown) */
              <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800 space-y-3">
                <div className="flex items-center justify-between text-xs text-slate-400 border-b border-slate-800 pb-2">
                  <span className="font-mono font-bold text-slate-200">HTML Code View</span>
                  <span>Direct edit supported</span>
                </div>
                <textarea
                  value={serializeBlocksToHtml(blocks)}
                  onChange={(e) => {
                    const parsed = parseContentToBlocks(e.target.value);
                    setBlocks(parsed);
                  }}
                  rows={28}
                  className="w-full bg-transparent font-mono text-xs text-emerald-400 focus:outline-none resize-none leading-relaxed"
                />
              </div>
            )}
          </div>
        </div>

        {/* 3. RIGHT INSPECTOR SIDEBAR */}
        {showSidebar && (
          <aside className="w-84 bg-white border-l border-slate-200 flex flex-col shrink-0 overflow-y-auto text-slate-800 z-20 shadow-xs">
            {/* Sidebar Tabs: Document vs Block */}
            <div className="flex items-center border-b border-slate-200 bg-slate-50/70 text-xs font-semibold">
              <button
                type="button"
                onClick={() => setSidebarTab("document")}
                className={`flex-1 py-3 text-center border-b-2 transition cursor-pointer ${
                  sidebarTab === "document"
                    ? "border-indigo-600 text-indigo-700 font-bold"
                    : "border-transparent text-slate-500 hover:text-slate-800"
                }`}
              >
                {entityType === "page" ? "Page Settings" : "Post Settings"}
              </button>
              <button
                type="button"
                onClick={() => setSidebarTab("block")}
                className={`flex-1 py-3 text-center border-b-2 transition cursor-pointer ${
                  sidebarTab === "block"
                    ? "border-indigo-600 text-indigo-700 font-bold"
                    : "border-transparent text-slate-500 hover:text-slate-800"
                }`}
              >
                Block
              </button>
            </div>

            {/* TAB: DOCUMENT SETTINGS */}
            {sidebarTab === "document" && (
              <div className="p-4 space-y-5 text-xs">
                {/* Polylang Language Selector */}
                <div className="space-y-2 border-b border-slate-200 pb-4">
                  <label className="font-bold text-slate-700 flex items-center justify-between">
                    <span className="flex items-center gap-1">
                      <Globe className="w-3.5 h-3.5 text-indigo-600" />
                      <span>Polylang Language</span>
                    </span>
                    <span className="font-mono text-[10px] text-slate-400 uppercase">{activeLang}</span>
                  </label>

                  <div className="grid grid-cols-4 gap-1">
                    {availableLanguages.map((l) => (
                      <button
                        key={l.code}
                        type="button"
                        onClick={() => setActiveLang(l.code)}
                        className={`p-1.5 rounded-lg border text-center transition cursor-pointer ${
                          activeLang === l.code
                            ? "bg-indigo-600 text-white border-indigo-600 font-bold"
                            : "border-slate-200 hover:bg-slate-50 text-slate-700"
                        }`}
                      >
                        <span className="block text-sm leading-none">{l.flag}</span>
                        <span className="text-[10px] uppercase">{l.code}</span>
                      </button>
                    ))}
                  </div>

                  <div className="text-[11px] text-slate-500 bg-slate-50 p-2 rounded-lg border border-slate-100 flex items-center justify-between">
                    <span>Group:</span>
                    <span className="font-mono font-medium truncate max-w-[150px]">
                      {metadata.translationGroupId}
                    </span>
                  </div>
                </div>

                {/* Status & Visibility */}
                <div className="space-y-3 border-b border-slate-200 pb-4">
                  <span className="font-bold text-slate-700 block">Status & Publishing</span>

                  <div className="flex items-center justify-between">
                    <span className="text-slate-600">Status</span>
                    <select
                      value={metadata.status}
                      onChange={(e) => setMetadata({ ...metadata, status: e.target.value })}
                      className="px-2 py-1 rounded-md border border-slate-200 text-xs font-semibold focus:outline-none"
                    >
                      <option value="published">Published</option>
                      <option value="draft">Draft</option>
                    </select>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-slate-600">Author</span>
                    <input
                      type="text"
                      value={metadata.author}
                      onChange={(e) => setMetadata({ ...metadata, author: e.target.value })}
                      className="px-2 py-1 rounded-md border border-slate-200 text-xs text-right w-36 focus:outline-none"
                    />
                  </div>
                </div>

                {/* URL Slug / Permalink */}
                <div className="space-y-2 border-b border-slate-200 pb-4">
                  <label className="font-bold text-slate-700 block">URL Slug / Permalink</label>
                  <div className="flex items-center rounded-lg border border-slate-200 overflow-hidden bg-slate-50">
                    <span className="px-2 text-slate-400 font-mono text-[10px]">
                      {activeLang === "en" ? "/" : `/${activeLang}/`}
                    </span>
                    <input
                      type="text"
                      value={metadata.slug}
                      onChange={(e) => setMetadata({ ...metadata, slug: e.target.value })}
                      className="w-full px-2 py-1.5 bg-white text-slate-800 font-mono text-xs focus:outline-none"
                    />
                  </div>
                </div>

                {/* Featured Image */}
                <div className="space-y-2 border-b border-slate-200 pb-4">
                  <label className="font-bold text-slate-700 block">Featured Image</label>
                  {metadata.featuredImage && (
                    <div className="rounded-lg overflow-hidden border border-slate-200 max-h-28 bg-slate-50">
                      <img
                        src={metadata.featuredImage}
                        alt="Featured preview"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  <input
                    type="text"
                    value={metadata.featuredImage}
                    onChange={(e) => setMetadata({ ...metadata, featuredImage: e.target.value })}
                    placeholder="Image URL (e.g. /images/... or https://...)"
                    className="w-full px-2.5 py-1.5 rounded-md border border-slate-200 text-xs focus:outline-none"
                  />
                </div>

                {/* Excerpt */}
                <div className="space-y-2 border-b border-slate-200 pb-4">
                  <label className="font-bold text-slate-700 block">Excerpt / Summary</label>
                  <textarea
                    rows={3}
                    value={metadata.excerpt}
                    onChange={(e) => setMetadata({ ...metadata, excerpt: e.target.value })}
                    placeholder="Short summary for archives and meta tags..."
                    className="w-full p-2 rounded-md border border-slate-200 text-xs focus:outline-none resize-none leading-relaxed"
                  />
                </div>

                {/* Categories & Tags (for Posts) */}
                {entityType === "post" && (
                  <div className="space-y-3 border-b border-slate-200 pb-4">
                    <div className="space-y-1">
                      <label className="font-bold text-slate-700 block">Category</label>
                      <select
                        value={metadata.category}
                        onChange={(e) => setMetadata({ ...metadata, category: e.target.value })}
                        className="w-full p-1.5 rounded-md border border-slate-200 text-xs focus:outline-none font-semibold"
                      >
                        <option value="Guides">Guides</option>
                        <option value="Tutorials">Tutorials</option>
                        <option value="Tech">Tech</option>
                        <option value="Tips">Tips</option>
                      </select>
                    </div>

                    <div className="space-y-1">
                      <label className="font-bold text-slate-700 block">Tags (Comma-separated)</label>
                      <input
                        type="text"
                        value={metadata.tags}
                        onChange={(e) => setMetadata({ ...metadata, tags: e.target.value })}
                        placeholder="Scribd, PDF, Guide"
                        className="w-full p-1.5 rounded-md border border-slate-200 text-xs focus:outline-none"
                      />
                    </div>
                  </div>
                )}

                {/* SEO Snippet & Meta */}
                <div className="space-y-3 border-b border-slate-200 pb-4">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-700">Google SERP Preview</span>
                    <span className="text-[10px] text-emerald-600 font-semibold bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
                      SEO Optimized
                    </span>
                  </div>

                  {/* Google Search Snippet Card */}
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                    <div className="text-[10px] text-slate-500 truncate">
                      https://scribddownloader.org/{activeLang !== "en" ? `${activeLang}/` : ""}
                      {metadata.slug}
                    </div>
                    <div className="text-xs font-semibold text-blue-700 line-clamp-1 hover:underline cursor-pointer">
                      {metadata.metaTitle || title || "Document Title"}
                    </div>
                    <div className="text-[11px] text-slate-600 line-clamp-2 leading-tight">
                      {metadata.metaDescription || metadata.excerpt || "Read this complete guide on scribddownloader.org..."}
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-slate-600 block">Meta Title</label>
                    <input
                      type="text"
                      value={metadata.metaTitle}
                      onChange={(e) => setMetadata({ ...metadata, metaTitle: e.target.value })}
                      placeholder="Page title for search engines"
                      className="w-full p-1.5 rounded-md border border-slate-200 text-xs focus:outline-none"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-slate-600 block">Meta Description</label>
                    <textarea
                      rows={2}
                      value={metadata.metaDescription}
                      onChange={(e) => setMetadata({ ...metadata, metaDescription: e.target.value })}
                      placeholder="Meta description (150-160 characters recommended)"
                      className="w-full p-1.5 rounded-md border border-slate-200 text-xs focus:outline-none resize-none leading-relaxed"
                    />
                  </div>
                </div>

                {/* Document Statistics */}
                <div className="space-y-2">
                  <span className="font-bold text-slate-700 block">Document Stats</span>
                  <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-600">
                    <div className="p-2 rounded-lg bg-slate-50 border border-slate-100">
                      <span className="font-bold text-slate-900 block text-xs">{stats.words}</span>
                      <span>Total Words</span>
                    </div>
                    <div className="p-2 rounded-lg bg-slate-50 border border-slate-100">
                      <span className="font-bold text-slate-900 block text-xs">{stats.readingTimeMin} min</span>
                      <span>Read Time</span>
                    </div>
                    <div className="p-2 rounded-lg bg-slate-50 border border-slate-100">
                      <span className="font-bold text-slate-900 block text-xs">{stats.headingsCount}</span>
                      <span>Headings</span>
                    </div>
                    <div className="p-2 rounded-lg bg-slate-50 border border-slate-100">
                      <span className="font-bold text-slate-900 block text-xs">{stats.blocksCount}</span>
                      <span>Blocks</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TAB: BLOCK SETTINGS */}
            {sidebarTab === "block" && (
              <div className="p-4 space-y-4 text-xs">
                {selectedBlock ? (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                      <span className="font-bold text-slate-900 uppercase tracking-wider text-[11px]">
                        {selectedBlock.type} Block Settings
                      </span>
                      <span className="font-mono text-[10px] text-slate-400">{selectedBlock.id}</span>
                    </div>

                    {/* Block-Specific Inspector Controls */}
                    {selectedBlock.type === "heading" && (
                      <div className="space-y-3">
                        <div className="space-y-1">
                          <label className="font-semibold text-slate-700 block">Heading Level</label>
                          <div className="flex items-center gap-1">
                            {([1, 2, 3, 4, 5, 6] as const).map((lvl) => (
                              <button
                                key={lvl}
                                type="button"
                                onClick={() => handleUpdateBlock(selectedBlock.id, { level: lvl })}
                                className={`flex-1 py-1 rounded font-mono font-bold transition cursor-pointer ${
                                  selectedBlock.level === lvl
                                    ? "bg-indigo-600 text-white"
                                    : "bg-slate-100 hover:bg-slate-200 text-slate-700"
                                }`}
                              >
                                H{lvl}
                              </button>
                            ))}
                          </div>
                        </div>

                        <div className="space-y-1">
                          <label className="font-semibold text-slate-700 block">HTML Anchor / ID</label>
                          <input
                            type="text"
                            value={selectedBlock.anchor || ""}
                            onChange={(e) => handleUpdateBlock(selectedBlock.id, { anchor: e.target.value })}
                            placeholder="e.g. step-1-link"
                            className="w-full p-1.5 rounded-md border border-slate-200 text-xs font-mono focus:outline-none"
                          />
                        </div>
                      </div>
                    )}

                    {selectedBlock.type === "image" && (
                      <div className="space-y-3">
                        <div className="space-y-1">
                          <label className="font-semibold text-slate-700 block">Alt Text (Alternative text for accessibility)</label>
                          <input
                            type="text"
                            value={selectedBlock.altText || ""}
                            onChange={(e) => handleUpdateBlock(selectedBlock.id, { altText: e.target.value })}
                            placeholder="Describe image content"
                            className="w-full p-1.5 rounded-md border border-slate-200 text-xs focus:outline-none"
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="font-semibold text-slate-700 block">Image Alignment</label>
                          <select
                            value={selectedBlock.imageAlign || "center"}
                            onChange={(e) => handleUpdateBlock(selectedBlock.id, { imageAlign: e.target.value as any })}
                            className="w-full p-1.5 rounded-md border border-slate-200 text-xs focus:outline-none"
                          >
                            <option value="center">Center</option>
                            <option value="left">Left</option>
                            <option value="right">Right</option>
                            <option value="wide">Wide Width</option>
                            <option value="full">Full Width</option>
                          </select>
                        </div>
                      </div>
                    )}

                    {selectedBlock.type === "table" && (
                      <div className="space-y-3">
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={selectedBlock.hasHeader !== false}
                            onChange={(e) => handleUpdateBlock(selectedBlock.id, { hasHeader: e.target.checked })}
                            className="rounded text-indigo-600 focus:ring-indigo-500"
                          />
                          <span className="font-semibold text-slate-700">Display Table Header Section</span>
                        </label>
                      </div>
                    )}

                    {selectedBlock.type === "faq" && (
                      <div className="space-y-3">
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={selectedBlock.includeFaqSchema !== false}
                            onChange={(e) => handleUpdateBlock(selectedBlock.id, { includeFaqSchema: e.target.checked })}
                            className="rounded text-indigo-600 focus:ring-indigo-500"
                          />
                          <span className="font-semibold text-slate-700">Include FAQPage JSON-LD Schema</span>
                        </label>
                      </div>
                    )}

                    {selectedBlock.type === "spacer" && (
                      <div className="space-y-2">
                        <label className="font-semibold text-slate-700 block">
                          Height ({selectedBlock.spacerHeight || 32}px)
                        </label>
                        <input
                          type="range"
                          min={12}
                          max={160}
                          step={4}
                          value={selectedBlock.spacerHeight || 32}
                          onChange={(e) =>
                            handleUpdateBlock(selectedBlock.id, { spacerHeight: parseInt(e.target.value, 10) })
                          }
                          className="w-full"
                        />
                      </div>
                    )}

                    {/* Common Advanced Section */}
                    <div className="border-t border-slate-200 pt-3 space-y-2">
                      <span className="font-bold text-slate-700 block">Advanced</span>
                      <div className="space-y-1">
                        <label className="text-slate-600 block text-[11px]">Additional CSS Class(es)</label>
                        <input
                          type="text"
                          value={selectedBlock.customClassName || ""}
                          onChange={(e) => handleUpdateBlock(selectedBlock.id, { customClassName: e.target.value })}
                          placeholder="e.g. my-custom-style"
                          className="w-full p-1.5 rounded-md border border-slate-200 text-xs font-mono focus:outline-none"
                        />
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-12 text-slate-400 space-y-2">
                    <p>No block selected.</p>
                    <p className="text-[11px]">Click on any block in the canvas to customize its settings.</p>
                  </div>
                )}
              </div>
            )}
          </aside>
        )}
      </div>

      {/* 4. PREVIEW MODAL */}
      {previewModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white w-full max-w-4xl max-h-[90vh] rounded-2xl shadow-2xl flex flex-col overflow-hidden">
            <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
              <div className="flex items-center gap-2">
                <span className="font-bold text-sm text-slate-900">Document Live Preview</span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-semibold">
                  {metadata.status}
                </span>
              </div>
              <button
                type="button"
                onClick={() => setPreviewModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200/60"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 sm:p-12 overflow-y-auto max-w-3xl mx-auto space-y-8 w-full">
              <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
                {title || "Untitled Document"}
              </h1>
              {metadata.excerpt && (
                <p className="text-lg text-slate-600 leading-relaxed font-normal">
                  {metadata.excerpt}
                </p>
              )}

              <div
                className="prose-custom max-w-none text-slate-700 space-y-5"
                dangerouslySetInnerHTML={{ __html: serializeBlocksToHtml(blocks) }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
