import React, { useState } from "react";
import { ClassicEditor } from "./ClassicEditor";
import { GutenbergEditor } from "./gutenberg/GutenbergEditor";
import { Blocks, Edit3, ArrowLeft } from "lucide-react";

interface AdminPostEditorProps {
  initialPost: any;
  targetLang?: string;
  onBack: () => void;
  onSave: (postData: any) => Promise<void>;
  onPreview: (slug: string, lang?: string) => void;
  categories?: any[];
  availableLanguages?: Array<{ code: string; name: string; flag: string }>;
  onOpenMediaSelector?: (callback: (url: string) => void) => void;
}

const DEFAULT_LANGS = [
  { code: "en", name: "English (Base)", flag: "🇺🇸" },
  { code: "id", name: "Indonesian", flag: "🇮🇩" },
  { code: "hi", name: "Hindi", flag: "🇮🇳" },
  { code: "es", name: "Spanish", flag: "🇲🇽" },
  { code: "fr", name: "French", flag: "🇫🇷" },
  { code: "nl", name: "Dutch", flag: "🇳🇱" },
  { code: "ur", name: "Urdu", flag: "🇵🇰" },
];

export function AdminPostEditor({
  initialPost,
  targetLang = "en",
  onBack,
  onSave,
  onPreview,
  categories = [
    { id: "cat-1", name: "Guides" },
    { id: "cat-2", name: "Tutorials" },
    { id: "cat-3", name: "Tech" },
    { id: "cat-4", name: "Tips" },
  ],
  availableLanguages = DEFAULT_LANGS,
  onOpenMediaSelector,
}: AdminPostEditorProps) {
  // Allow switching between Gutenberg Block Editor (with Custom HTML block) and Classic Editor
  const [editorType, setEditorType] = useState<"gutenberg" | "classic">("gutenberg");

  const handleSave = async (payload: {
    title: string;
    content: string;
    htmlContent: string;
    blocks?: any[];
    metadata: any;
    status: "published" | "draft";
    language: string;
  }) => {
    const postToSave = {
      ...initialPost,
      ...payload.metadata,
      id: initialPost?.id || payload.metadata.id || "",
      title: payload.title,
      content: payload.content,
      htmlContent: payload.htmlContent,
      blocks: payload.blocks || initialPost?.blocks,
      status: payload.status,
      language: payload.language,
      slug: payload.metadata.slug,
      excerpt: payload.metadata.excerpt,
      category: payload.metadata.category || "Guides",
      tags: Array.isArray(payload.metadata.tags)
        ? payload.metadata.tags
        : typeof payload.metadata.tags === "string"
        ? payload.metadata.tags.split(",").map((t: string) => t.trim()).filter(Boolean)
        : ["Scribd", "PDF", "Guide"],
      metaTitle: payload.metadata.metaTitle || payload.title,
      metaDescription: payload.metadata.metaDescription || payload.metadata.excerpt,
      canonicalUrl: payload.metadata.canonicalUrl,
      noindex: payload.metadata.noindex,
      image:
        payload.metadata.featuredImage ||
        initialPost?.image ||
        "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=1200&auto=format&fit=crop&q=80",
      featured: payload.metadata.featured ?? initialPost?.featured ?? false,
      author: {
        name: payload.metadata.author || initialPost?.author?.name || "Minhas Hussain",
        role: initialPost?.author?.role || "Lead Document Specialist",
        avatar:
          initialPost?.author?.avatar ||
          "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200",
      },
      translationGroupId:
        payload.metadata.translationGroupId ||
        initialPost?.translationGroupId ||
        `group-post-${payload.metadata.slug || Date.now()}`,
      readTime: `${Math.max(1, Math.ceil((payload.content?.length || 500) / 1000))} min read`,
      date:
        initialPost?.date ||
        new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" }),
    };

    await onSave(postToSave);
  };

  const initialMetadata = {
    id: initialPost?.id || "",
    slug: initialPost?.slug || "",
    excerpt: initialPost?.excerpt || "",
    status: initialPost?.status || "published",
    category: initialPost?.category || "Guides",
    tags: Array.isArray(initialPost?.tags)
      ? initialPost.tags.join(", ")
      : initialPost?.tags || "Scribd, PDF, Guide",
    author: initialPost?.author?.name || "Minhas Hussain",
    featuredImage: initialPost?.image || "",
    metaTitle: initialPost?.metaTitle || initialPost?.title || "",
    metaDescription: initialPost?.metaDescription || initialPost?.excerpt || "",
    canonicalUrl: initialPost?.canonicalUrl || "",
    noindex: initialPost?.noindex || false,
    translationGroupId:
      initialPost?.translationGroupId || `group-post-${initialPost?.slug || Date.now()}`,
  };

  return (
    <div className="space-y-4">
      {/* Editor Mode Selector Strip */}
      <div className="bg-white rounded-xl border border-slate-200 px-4 py-2.5 shadow-xs flex items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onBack}
            className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-600 transition cursor-pointer"
            title="Back to Posts List"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <span className="text-xs font-bold text-slate-700">Editor Environment:</span>
        </div>

        <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200">
          <button
            type="button"
            onClick={() => setEditorType("gutenberg")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
              editorType === "gutenberg"
                ? "bg-slate-900 text-white shadow-xs"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <Blocks className="w-3.5 h-3.5 text-indigo-400" />
            <span>Gutenberg Block Editor</span>
            <span className="hidden sm:inline-block px-1.5 py-0.2 rounded text-[10px] bg-indigo-500/30 text-indigo-200 font-mono">
              Custom HTML
            </span>
          </button>

          <button
            type="button"
            onClick={() => setEditorType("classic")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
              editorType === "classic"
                ? "bg-slate-900 text-white shadow-xs"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <Edit3 className="w-3.5 h-3.5 text-emerald-400" />
            <span>Classic Editor</span>
          </button>
        </div>
      </div>

      {editorType === "gutenberg" ? (
        <GutenbergEditor
          initialTitle={initialPost?.title || ""}
          initialContent={initialPost?.htmlContent || initialPost?.content || ""}
          initialBlocks={initialPost?.blocks}
          initialMetadata={initialMetadata}
          targetLang={targetLang || initialPost?.language || "en"}
          availableLanguages={availableLanguages}
          onSave={handleSave}
          onBack={onBack}
          onPreview={(slug, lang) => onPreview(slug, lang)}
          entityType="post"
        />
      ) : (
        <ClassicEditor
          initialTitle={initialPost?.title || ""}
          initialContent={initialPost?.htmlContent || initialPost?.content || ""}
          initialMetadata={initialMetadata}
          targetLang={targetLang || initialPost?.language || "en"}
          availableLanguages={availableLanguages}
          categories={categories}
          onSave={handleSave}
          onBack={onBack}
          onPreview={(slug, lang) => onPreview(slug, lang)}
          entityType="post"
          onOpenMediaSelector={onOpenMediaSelector}
        />
      )}
    </div>
  );
}
