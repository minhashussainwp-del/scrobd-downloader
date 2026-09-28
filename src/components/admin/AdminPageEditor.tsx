import React, { useState } from "react";
import { ClassicEditor } from "./ClassicEditor";
import { GutenbergEditor } from "./gutenberg/GutenbergEditor";
import { Blocks, Edit3, ArrowLeft } from "lucide-react";

interface AdminPageEditorProps {
  initialPage: any;
  targetLang?: string;
  onBack: () => void;
  onSave: (pageData: any) => Promise<void>;
  onOpenMediaSelector?: (callback: (url: string) => void) => void;
  onPreview: (slug: string, lang?: string) => void;
  availableLanguages?: Array<{ code: string; name: string; flag: string }>;
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

export function AdminPageEditor({
  initialPage,
  targetLang = "en",
  onBack,
  onSave,
  onOpenMediaSelector,
  onPreview,
  availableLanguages = DEFAULT_LANGS,
}: AdminPageEditorProps) {
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
    const pageToSave = {
      ...initialPage,
      ...payload.metadata,
      id: initialPage?.id || payload.metadata.id || "",
      title: payload.title,
      content: payload.content,
      htmlContent: payload.htmlContent,
      blocks: payload.blocks || initialPage?.blocks,
      status: payload.status,
      language: payload.language,
      slug: payload.metadata.slug,
      excerpt: payload.metadata.excerpt,
      metaTitle: payload.metadata.metaTitle || payload.title,
      metaDescription: payload.metadata.metaDescription || payload.metadata.excerpt,
      canonicalUrl: payload.metadata.canonicalUrl,
      noindex: payload.metadata.noindex,
      featuredImage: payload.metadata.featuredImage,
      author: payload.metadata.author,
      authorName: payload.metadata.author,
      translationGroupId: payload.metadata.translationGroupId,
      lastModified: new Date().toISOString(),
    };

    await onSave(pageToSave);
  };

  const initialMetadata = {
    id: initialPage?.id || "",
    slug: initialPage?.slug || "",
    subtitle: initialPage?.subtitle || "",
    excerpt: initialPage?.excerpt || "",
    status: initialPage?.status || "published",
    author: initialPage?.authorName || initialPage?.author || "Admin Team",
    featuredImage: initialPage?.featuredImage || "",
    metaTitle: initialPage?.metaTitle || initialPage?.title || "",
    metaDescription: initialPage?.metaDescription || initialPage?.excerpt || "",
    canonicalUrl: initialPage?.canonicalUrl || "",
    noindex: initialPage?.noindex || false,
    translationGroupId:
      initialPage?.translationGroupId || `group-page-${initialPage?.slug || Date.now()}`,
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
            title="Back to Pages List"
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
          initialTitle={initialPage?.title || ""}
          initialContent={initialPage?.htmlContent || initialPage?.content || ""}
          initialBlocks={initialPage?.blocks}
          initialMetadata={initialMetadata}
          targetLang={targetLang || initialPage?.language || "en"}
          availableLanguages={availableLanguages}
          onSave={handleSave}
          onBack={onBack}
          onPreview={(slug, lang) => onPreview(slug, lang)}
          entityType="page"
        />
      ) : (
        <ClassicEditor
          initialTitle={initialPage?.title || ""}
          initialContent={initialPage?.htmlContent || initialPage?.content || ""}
          initialMetadata={initialMetadata}
          targetLang={targetLang || initialPage?.language || "en"}
          availableLanguages={availableLanguages}
          onSave={handleSave}
          onBack={onBack}
          onPreview={(slug, lang) => onPreview(slug, lang)}
          entityType="page"
          onOpenMediaSelector={onOpenMediaSelector}
        />
      )}
    </div>
  );
}
